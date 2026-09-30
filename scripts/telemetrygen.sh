#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

TELEMETRYGEN_VERSION="${TELEMETRYGEN_VERSION:-v0.162.0}"
ENDPOINT="${TELEMETRYGEN_OTLP_ENDPOINT:-127.0.0.1:4318}"
TOKEN="${DUCKDB_OTLP_TOKEN:?DUCKDB_OTLP_TOKEN is required (set in .env)}"
SERVICE="${TELEMETRYGEN_SERVICE:-quack-demo}"
COUNT="${TELEMETRYGEN_COUNT:-20}"
RATE="${TELEMETRYGEN_RATE:-10}"
WORKERS="${TELEMETRYGEN_WORKERS:-2}"
SIGNAL="${1:-all}"

HDR="Authorization=\"Bearer ${TOKEN}\""

run_signal() {
  local kind="$1"
  echo "==> telemetrygen ${kind} → ${ENDPOINT} (service=${SERVICE}, count=${COUNT})"
  go run "github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen@${TELEMETRYGEN_VERSION}" \
    "$kind" \
    --otlp-http \
    --otlp-insecure \
    --otlp-endpoint "$ENDPOINT" \
    --otlp-header "$HDR" \
    --"${kind}" "$COUNT" \
    --workers "$WORKERS" \
    --rate "$RATE" \
    --service "$SERVICE"
}

case "$SIGNAL" in
  traces | metrics | logs)
    run_signal "$SIGNAL"
    ;;
  all)
    run_signal traces
    run_signal metrics
    run_signal logs
    ;;
  *)
    echo "usage: $0 [traces|metrics|logs|all]" >&2
    exit 1
    ;;
esac
