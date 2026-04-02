#!/bin/bash

set -euo pipefail

ACTION="${1:-}"
MODE="${2:-normal}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
LAB="labs/lab16/android-plugin-hook-host"
APP_ID='io.xenix.lab.androidwebviewhost'
RESULT_FILE='webview-manifest-shape-probe.json'

wrap_result() {
  local raw_json="$1"
  node -e 'const platform = process.argv[1]; const raw = JSON.parse(process.argv[2]); console.log(JSON.stringify({ platform, status: raw.status, detail: raw.detail }));' \
    android \
    "$raw_json"
}

prepare() {
  if [[ ! -f "$ROOT/$LAB/app/build/outputs/apk/debug/app-debug.apk" ]]; then
    (cd "$ROOT/$LAB" && ./gradlew assembleDebug >/tmp/lab17-android-build.log)
  fi
}

run_mode() {
  local apk="$ROOT/$LAB/app/build/outputs/apk/debug/app-debug.apk"
  adb install -r "$apk" >/dev/null
  adb shell am force-stop "$APP_ID" >/dev/null 2>&1 || true
  adb shell run-as "$APP_ID" rm -f "files/$RESULT_FILE" >/dev/null 2>&1 || true
  if [[ "$MODE" == "fault" ]]; then
    adb shell am start -n "$APP_ID/.MainActivity" --es probe_mode fault >/dev/null
  else
    adb shell am start -n "$APP_ID/.MainActivity" >/dev/null
  fi

  for _ in $(seq 1 20); do
    if adb shell run-as "$APP_ID" test -f "files/$RESULT_FILE" >/dev/null 2>&1; then
      wrap_result "$(adb shell run-as "$APP_ID" cat "files/$RESULT_FILE")"
      return 0
    fi
    sleep 1
  done

  printf '{"platform":"android","status":"error","detail":"timeout waiting for %s"}\n' "$RESULT_FILE"
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
