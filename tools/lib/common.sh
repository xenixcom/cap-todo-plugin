usage() {
  cat <<'EOF'
Usage:
  ./tools/captool test [all|web|ios|android] [options]
  ./tools/captool clean [local|global|all]
  ./tools/captool doctor
  ./tools/captool report [latest|list|<file>]
  ./tools/captool help

Options:
  --device=<ID>          指定 iOS 模擬器或真機 ID
  --no-close-device      若本次測試由腳本自行開啟裝置，測完後也不要關閉
  --fast                 啟用快速模式；Web 會跳過 build，iOS 會重用 simulator 與 derived data
  --keep-artifacts       保留 report 與測試產物，不自動清理
  --logs=<filename>      將完整 log 同步輸出到 logs/ 檔案；若含路徑則照原值
  --report               生成簡易 fail report

Commands:
  test                   執行正式測試流程
  clean local            清除 repo 內測試產物
  clean global           清除全域 Xcode / Simulator / Gradle / npm 快取
  clean all              一次清除 repo 內產物與全域快取
  doctor                 檢查本機工具鏈與 repo 關鍵路徑是否可用
  report                 顯示最新、列出、或讀取指定測試報告
  help                   顯示使用說明
EOF
}

log() {
  local message="$1"
  if [[ -n "$LOG_FILE" ]]; then
    echo "$message" | tee -a "$LOG_FILE"
  else
    echo "$message"
  fi
}

report_fail() {
  local message="${1-}"
  if [[ $REPORT -eq 1 ]]; then
    echo "$message" >> "$REPORT_FILE"
  fi
}

report_append() {
  local message="${1-}"
  if [[ $REPORT -eq 1 ]]; then
    echo "$message" >> "$REPORT_FILE"
  fi
}

append_unique_line() {
  local current="${1-}"
  local line="${2-}"
  if [[ -z "$line" ]]; then
    echo "$current"
    return
  fi

  case "$current" in
    *"$line"*)
      echo "$current"
      ;;
    "")
      echo "$line"
      ;;
    *)
      printf "%s\n%s" "$current" "$line"
      ;;
  esac
}

ensure_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    log "缺少必要指令: $command_name"
    return 1
  fi
  return 0
}

ensure_tool_output_dirs() {
  mkdir -p "./logs" "./reports"
}

ensure_captool_config() {
  [[ -f "$CAPTOOL_CONFIG" ]]
}

platform_supported_declared() {
  local platform="$1"
  if ! ensure_captool_config; then
    return 2
  fi

  local result
  result="$(node -e '
    const fs = require("fs");
    const path = process.argv[1];
    const platform = process.argv[2];
    const json = JSON.parse(fs.readFileSync(path, "utf8"));
    const supported = json?.platforms?.[platform]?.supported;
    if (supported === true) process.stdout.write("1");
    else if (supported === false) process.stdout.write("0");
    else process.stdout.write("");
  ' "$CAPTOOL_CONFIG" "$platform" 2>/dev/null || true)"

  case "$result" in
    1) return 0 ;;
    0) return 1 ;;
    *) return 2 ;;
  esac
}

platform_presence_detected() {
  local platform="$1"
  case "$platform" in
    web)
      [[ -f "$CAPTOOL_ROOT/src/web.ts" ]]
      ;;
    ios)
      [[ -d "$CAPTOOL_ROOT/ios" && -f "$CAPTOOL_ROOT/ios/Sources/TodoPlugin/TodoPlugin.swift" ]]
      ;;
    android)
      [[ -d "$CAPTOOL_ROOT/android" && -x "$CAPTOOL_ROOT/android/gradlew" ]]
      ;;
    *)
      return 1
      ;;
  esac
}

resolve_log_file_path() {
  local requested_path="$1"
  if [[ -z "$requested_path" ]]; then
    echo ""
    return
  fi

  if [[ "$requested_path" == */* ]]; then
    echo "$requested_path"
  else
    echo "./logs/$requested_path"
  fi
}
