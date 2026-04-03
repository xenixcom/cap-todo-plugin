#!/bin/zsh
set -euo pipefail

STRATEGY="${1:-}"
if [[ "$STRATEGY" != "grant-microphone" ]]; then
  echo "{\"platform\":\"android\",\"status\":\"error\",\"detail\":\"unsupported strategy: $STRATEGY\"}"
  exit 0
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP_DIR="$ROOT/labs/lab44/android"
PKG="io.xenix.demo"
RESULT_PATH="/data/data/$PKG/files/webview-native-bridge-probe.json"

cd "$APP_DIR"
./gradlew -q assembleDebug >/tmp/lab56-android-gradle.log 2>&1
APK="app/build/outputs/apk/debug/app-debug.apk"

adb uninstall "$PKG" >/dev/null 2>&1 || true
adb install -r "$APK" >/tmp/lab56-android-install.log 2>&1
adb shell pm grant "$PKG" android.permission.RECORD_AUDIO >/tmp/lab56-android-grant.log 2>&1
adb shell rm -f "$RESULT_PATH" >/dev/null 2>&1 || true
adb shell am force-stop "$PKG" >/dev/null 2>&1 || true
adb shell am start -n "$PKG/.MainActivity" >/tmp/lab56-android-start.log 2>&1

for _ in $(seq 1 20); do
  if adb shell run-as "$PKG" cat files/webview-native-bridge-probe.json >/tmp/lab56-android-result.json 2>/dev/null; then
    DETAIL="$(python3 - <<'PY'
import json
with open('/tmp/lab56-android-result.json', 'r', encoding='utf-8') as f:
    payload = json.load(f)
print(json.dumps({"platform":"android","status":payload.get("status"),"detail":payload.get("detail")}, ensure_ascii=True))
PY
)"
    echo "$DETAIL"
    exit 0
  fi
  sleep 1
done

echo "{\"platform\":\"android\",\"status\":\"error\",\"detail\":\"no probe result\"}"
