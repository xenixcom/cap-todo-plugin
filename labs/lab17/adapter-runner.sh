#!/bin/bash

set -euo pipefail

LAB17_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-normal}"

if [[ "$MODE" != "normal" && "$MODE" != "fault" ]]; then
  echo "usage: $0 [normal|fault]" >&2
  exit 2
fi

ADAPTERS=(
  "$LAB17_DIR/adapters/ios-manifest-shape.sh"
  "$LAB17_DIR/adapters/android-manifest-shape.sh"
)

for adapter in "${ADAPTERS[@]}"; do
  "$adapter" prepare >/dev/null
done

results=()
for adapter in "${ADAPTERS[@]}"; do
  results+=("$("$adapter" run "$MODE")")
done

printf '{"mode":"%s","results":[%s]}\n' \
  "$MODE" \
  "$(IFS=,; echo "${results[*]}")"
