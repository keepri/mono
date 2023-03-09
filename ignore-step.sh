#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

local project = "foley" # nika

if [[ project == "foley" ]]; then
    if [["$VERCEL_GIT_COMMIT_REF" == "prod-foley" || "$VERCEL_GIT_COMMIT_REF" == "foley"]] ; then
        # Proceed with the build
        echo "✅ - Build can proceed"
        exit 1;

    else
        # Don't build
        echo "🛑 - Build cancelled"
        exit 0;
    fi

fi

if [[ project == "nika" ]]; then
    if [["$VERCEL_GIT_COMMIT_REF" == "prod-nika" || "$VERCEL_GIT_COMMIT_REF" == "nika"]] ; then
        # Proceed with the build
        echo "✅ - Build can proceed"
        exit 1;

    else
        # Don't build
        echo "🛑 - Build cancelled"
        exit 0;
    fi
fi
