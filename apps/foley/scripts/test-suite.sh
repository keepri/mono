#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-all}"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$APP_DIR/.env.test.local"

usage() {
    printf '%s\n' "usage: ./scripts/test-suite.sh <unit|setup-only|integration|e2e|all|serial>" >&2
}

if [[ ! "$MODE" =~ ^(unit|setup-only|integration|e2e|all|serial)$ ]]; then
    usage
    exit 1
fi

if ! command -v bun >/dev/null 2>&1; then
    printf '%s\n' "bun missing. Install bun, then rerun." >&2
    exit 1
fi

if [[ "$MODE" =~ ^(setup-only|integration|e2e|all|serial)$ ]] && ! command -v upstash >/dev/null 2>&1; then
    printf '%s\n' "upstash CLI missing. Install/setup first, then rerun." >&2
    exit 1
fi

load_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        return
    fi

    set -a
    # shellcheck source=/dev/null
    . "$ENV_FILE"
    set +a
}

write_env_file() {
    local db_id="$1"
    local db_url="$2"
    local db_token="$3"

    cat > "$ENV_FILE" <<EOF
UPSTASH_START_REDIS_ID=$db_id
UPSTASH_REDIS_REST_URL=$db_url
UPSTASH_REDIS_REST_TOKEN=$db_token
EOF
}

extract_field() {
    local output="$1"
    local field="$2"
    printf '%s\n' "$output" | awk -F': ' -v field="$field" '$0 ~ field { print $2; exit }'
}

get_or_create_creds() {
    local mode="$1"
    local id="${2:-}"
    local output

    if [ "$mode" = "reuse" ]; then
        output="$(upstash start-redis --id "$id")" || return 1
    else
        output="$(upstash start-redis --user-agent opencode)" || return 1
    fi

    local parsed_id parsed_url parsed_token
    parsed_id="$(extract_field "$output" "\*\*Database ID:\*\*")"
    parsed_url="$(extract_field "$output" "\*\*Endpoint:\*\*")"
    parsed_token="$(extract_field "$output" "\*\*Token:\*\*")"

    if [ -z "$parsed_id" ] || [ -z "$parsed_url" ] || [ -z "$parsed_token" ]; then
        return 1
    fi

    printf '%s\n%s\n%s\n' "$parsed_id" "$parsed_url" "$parsed_token"
}

ping_redis() {
    local url="$1"
    local token="$2"
    upstash redis exec --db-url "$url" --db-token "$token" --json '["PING"]' >/dev/null 2>&1
}

setup_redis() {
    local db_id db_url db_token status creds

    touch "$ENV_FILE"
    load_env_file

    db_id="${UPSTASH_START_REDIS_ID:-}"
    db_url="${UPSTASH_REDIS_REST_URL:-}"
    db_token="${UPSTASH_REDIS_REST_TOKEN:-}"

    status=""

    if [ -n "$db_url" ] && [ -n "$db_token" ] && ping_redis "$db_url" "$db_token"; then
        status="reused-existing"
    else
        creds=""

        if [ -n "$db_id" ]; then
            if creds="$(get_or_create_creds reuse "$db_id")"; then
                status="reused-by-id"
            fi
        fi

        if [ -z "$creds" ]; then
            creds="$(get_or_create_creds create)" || {
                printf '%s\n' "failed to create temp redis with upstash start-redis" >&2
                exit 1
            }
            status="created-new"
        fi

        db_id="$(printf '%s\n' "$creds" | awk 'NR==1{print $1}')"
        db_url="$(printf '%s\n' "$creds" | awk 'NR==2{print $1}')"
        db_token="$(printf '%s\n' "$creds" | awk 'NR==3{print $1}')"

        if ! ping_redis "$db_url" "$db_token"; then
            printf '%s\n' "redis ping failed after credential refresh" >&2
            exit 1
        fi

        write_env_file "$db_id" "$db_url" "$db_token"
    fi

    export UPSTASH_START_REDIS_ID="$db_id"
    export UPSTASH_REDIS_REST_URL="$db_url"
    export UPSTASH_REDIS_REST_TOKEN="$db_token"

    printf '%s\n' "temp redis: $status"
}

run_unit() {
    (
        cd "$APP_DIR"
        bun run test:unit
    )
}

run_suite_glob() {
    local label="$1"
    local glob_pattern="$2"
    local env_prefix="${3:-}"

    (
        cd "$APP_DIR"
        shopt -s globstar nullglob
        local tests=($glob_pattern)

        if [ ${#tests[@]} -eq 0 ]; then
            printf '%s\n' "no $label tests found matching $glob_pattern" >&2
            exit 1
        fi

        printf '%s\n' "running $label files: ${#tests[@]}"

        if [ -n "$env_prefix" ]; then
            env $env_prefix bun x vitest run --config "vitest.config.mjs" "${tests[@]}"
            return
        fi

        bun x vitest run --config "vitest.config.mjs" "${tests[@]}"
    )
}

run_all_parallel() {
    run_unit &
    local pid_unit=$!

    run_suite_glob "integration" "src/**/*.integration.test.ts" &
    local pid_integration=$!

    run_suite_glob "e2e" "src/e2e/**/*.e2e.test.ts" "RUN_NEXT_E2E=1" &
    local pid_e2e=$!

    local status=0
    wait "$pid_unit" || status=1
    wait "$pid_integration" || status=1
    wait "$pid_e2e" || status=1
    return "$status"
}

case "$MODE" in
    unit)
        run_unit
        ;;
    setup-only)
        setup_redis
        ;;
    integration)
        setup_redis
        run_suite_glob "integration" "src/**/*.integration.test.ts"
        ;;
    e2e)
        setup_redis
        run_suite_glob "e2e" "src/e2e/**/*.e2e.test.ts" "RUN_NEXT_E2E=1"
        ;;
    all)
        setup_redis
        run_all_parallel
        ;;
    serial)
        run_unit
        setup_redis
        run_suite_glob "integration" "src/**/*.integration.test.ts"
        run_suite_glob "e2e" "src/e2e/**/*.e2e.test.ts" "RUN_NEXT_E2E=1"
        ;;
esac
