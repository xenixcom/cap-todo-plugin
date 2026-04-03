#!/bin/zsh
set -euo pipefail

STRATEGY="${1:-}"
if [[ "$STRATEGY" != "grant-microphone" ]]; then
  echo "{\"platform\":\"ios\",\"status\":\"error\",\"detail\":\"unsupported strategy: $STRATEGY\"}"
  exit 0
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP_DIR="$ROOT/labs/lab40/ios-plugin-hook-host"
PROJECT="$APP_DIR/App/App.xcodeproj"
SCHEME="App"
DERIVED="$ROOT/labs/lab56/DerivedData-ios"
BUNDLE_ID="io.xenix.demo"
RESULT_FILE="wkwebview-plugin-permission-request-probe.json"

if [[ ! -d "$APP_DIR/node_modules" ]]; then
  (cd "$APP_DIR" && npm install >/tmp/lab56-ios-npm.log 2>&1)
fi

APP_PATH="$(find "$DERIVED/Build/Products/Debug-iphonesimulator" -name 'App.app' | head -n 1)"
if [[ -z "$APP_PATH" ]]; then
  xcodebuild -project "$PROJECT" -scheme "$SCHEME" -configuration Debug -sdk iphonesimulator -derivedDataPath "$DERIVED" build >/tmp/lab56-ios-build.log 2>&1
  APP_PATH="$(find "$DERIVED/Build/Products/Debug-iphonesimulator" -name 'App.app' | head -n 1)"
fi

if [[ -z "$APP_PATH" ]]; then
  echo "{\"platform\":\"ios\",\"status\":\"error\",\"detail\":\"missing built app\"}"
  exit 0
fi

xcrun simctl uninstall booted "$BUNDLE_ID" >/dev/null 2>&1 || true
xcrun simctl install booted "$APP_PATH" >/tmp/lab56-ios-install.log 2>&1
xcrun simctl privacy booted grant microphone "$BUNDLE_ID" >/tmp/lab56-ios-privacy.log 2>&1 || true
CONTAINER="$(xcrun simctl get_app_container booted "$BUNDLE_ID" data)"
rm -f "$CONTAINER/Documents/$RESULT_FILE"
xcrun simctl terminate booted "$BUNDLE_ID" >/dev/null 2>&1 || true
xcrun simctl launch booted "$BUNDLE_ID" >/tmp/lab56-ios-launch.log 2>&1

for _ in $(seq 1 25); do
  if [[ -f "$CONTAINER/Documents/$RESULT_FILE" ]]; then
    DETAIL="$(python3 - <<PY
import json
with open("$CONTAINER/Documents/$RESULT_FILE", "r", encoding="utf-8") as f:
    payload = json.load(f)
print(json.dumps({"platform":"ios","status":payload.get("status"),"detail":payload.get("detail")}, ensure_ascii=True))
PY
)"
    echo "$DETAIL"
    exit 0
  fi
  sleep 1
done

echo "{\"platform\":\"ios\",\"status\":\"error\",\"detail\":\"no probe result\"}"
