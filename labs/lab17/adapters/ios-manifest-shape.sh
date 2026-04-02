#!/bin/bash

set -euo pipefail

ACTION="${1:-}"
MODE="${2:-normal}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
LAB="labs/lab16/ios-plugin-hook-host"
SIM_ID='9E0A7DE1-C9D9-48D6-B2C8-E3AEC781B31E'
BUNDLE_ID='io.xenix.demo'
DERIVED="$ROOT/$LAB/.derived"
APP_PATH="$DERIVED/Build/Products/Debug-iphonesimulator/App.app"
RESULT_FILE='wkwebview-manifest-shape-probe.json'

wrap_result() {
  local raw_json="$1"
  node -e 'const platform = process.argv[1]; const raw = JSON.parse(process.argv[2]); console.log(JSON.stringify({ platform, status: raw.status, detail: raw.detail }));' \
    ios \
    "$raw_json"
}

prepare() {
  if [[ ! -d "$ROOT/$LAB/node_modules" ]]; then
    (cd "$ROOT/$LAB" && npm ci >/dev/null)
  fi
  if [[ ! -d "$APP_PATH" ]]; then
    rm -rf "$DERIVED"
    xcodebuild \
      -project "$ROOT/$LAB/App/App.xcodeproj" \
      -scheme App \
      -configuration Debug \
      -destination "id=$SIM_ID" \
      -derivedDataPath "$DERIVED" \
      build >/tmp/lab17-ios-build.log
  fi
}

run_mode() {
  xcrun simctl uninstall "$SIM_ID" "$BUNDLE_ID" >/dev/null 2>&1 || true
  xcrun simctl install "$SIM_ID" "$APP_PATH" >/dev/null
  local container=""
  container="$(xcrun simctl get_app_container "$SIM_ID" "$BUNDLE_ID" data 2>/dev/null || true)"
  if [[ -n "$container" ]]; then
    rm -f "$container/Documents/$RESULT_FILE"
  fi
  xcrun simctl terminate "$SIM_ID" "$BUNDLE_ID" >/dev/null 2>&1 || true
  if [[ "$MODE" == "fault" ]]; then
    xcrun simctl launch "$SIM_ID" "$BUNDLE_ID" fault >/dev/null
  else
    xcrun simctl launch "$SIM_ID" "$BUNDLE_ID" >/dev/null
  fi

  container="$(xcrun simctl get_app_container "$SIM_ID" "$BUNDLE_ID" data)"
  local result_path="$container/Documents/$RESULT_FILE"
  for _ in $(seq 1 20); do
    if [[ -f "$result_path" ]]; then
      wrap_result "$(cat "$result_path")"
      return 0
    fi
    sleep 1
  done

  printf '{"platform":"ios","status":"error","detail":"timeout waiting for %s"}\n' "$RESULT_FILE"
  return 0
}

case "$ACTION" in
  prepare)
    prepare
    ;;
  run)
    run_mode
    ;;
  *)
    echo "usage: $0 <prepare|run> [normal|fault]" >&2
    exit 2
    ;;
esac
