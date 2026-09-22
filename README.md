# kipri

## Testing (foley)

Unit tests (no Redis required):

```bash
bun run --filter=foley test:unit
```

Integration tests (real Upstash):

1. Copy `apps/foley/.env.test.local.example` to `apps/foley/.env.test.local`.
2. Run (auto reuses existing temp DB by id, or creates one):

```bash
bun run --filter=foley test:integration
```

The runner updates these keys in `apps/foley/.env.test.local`:

- `UPSTASH_START_REDIS_ID`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Integration/e2e runners auto-provision temp Redis credentials when needed.

Full stack e2e (real Next middleware + real API route in one request path):

```bash
bun run --filter=foley test:e2e
```

`test:integration` and `test:e2e` both load credentials from `apps/foley/.env.test.local`,
verify the temp Redis with `PING`, and when expired/unavailable they re-fetch by
`UPSTASH_START_REDIS_ID` or create a new `upstash start-redis` database, then overwrite
`UPSTASH_START_REDIS_ID`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`.

All test commands are backed by one runner: `apps/foley/scripts/test-suite.sh`
with modes: `unit | setup-only | integration | e2e | all | serial`.

Each command runs all matching files in its suite:

- `test:integration` runs `src/**/*.integration.test.ts`
- `test:e2e` runs `src/e2e/**/*.e2e.test.ts`

From repo root, run full stack with no skipped suites (parallel by default):

```bash
bun run foley:test
```

Run the same stack serially:

```bash
bun run foley:test:serial
```
