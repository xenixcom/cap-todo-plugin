cleanup_report_artifacts() {
  if [[ $KEEP_ARTIFACTS -eq 1 ]]; then
    return
  fi

  if [[ $REPORT -eq 1 && -n "${REPORT_FILE:-}" ]]; then
    find . -maxdepth 1 -type f -name 'plugin-report-*.txt' ! -name "$REPORT_FILE" -delete 2>/dev/null || true
  else
    find . -maxdepth 1 -type f -name 'plugin-report-*.txt' -delete 2>/dev/null || true
  fi
}

cleanup_ios_test_artifacts() {
  if [[ $KEEP_ARTIFACTS -eq 1 || $FAST_MODE -eq 1 ]]; then
    return
  fi

  rm -rf "$IOS_DERIVED_DATA/Logs/Test" 2>/dev/null || true
  rm -rf "$IOS_DERIVED_DATA/Logs/TestSummary" 2>/dev/null || true
}

cleanup_repo_artifacts_and_exit() {
  rm -rf ./ios/build/Logs/Test 2>/dev/null || true
  rm -rf ./ios/build/Logs/TestSummary 2>/dev/null || true
  rm -rf ./android/build 2>/dev/null || true
  rm -rf ./demo/android/app/build 2>/dev/null || true
  find . -maxdepth 1 -type f -name 'plugin-report-*.txt' -delete 2>/dev/null || true
  echo "已清理測試產物"
  exit 0
}

cleanup_global_caches_and_exit() {
  rm -rf "$HOME/Library/Developer/Xcode/DerivedData"/* 2>/dev/null || true
  rm -rf "$HOME/Library/Developer/CoreSimulator/Devices"/* 2>/dev/null || true
  rm -rf "$HOME/.gradle/caches"/* 2>/dev/null || true
  rm -rf "$HOME/.gradle/daemon"/* 2>/dev/null || true
  npm cache clean --force >/dev/null 2>&1 || true
  echo "已清理全域快取"
  exit 0
}
