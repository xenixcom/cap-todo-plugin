doctor_fail=0
doctor_warn_count=0
doctor_ok_count=0

doctor_ok() {
  echo "[OK] $1"
  doctor_ok_count=$((doctor_ok_count + 1))
}

doctor_warn() {
  echo "[WARN] $1"
  doctor_warn_count=$((doctor_warn_count + 1))
}

doctor_fail_msg() {
  echo "[FAIL] $1"
  doctor_fail=1
}

doctor_section() {
  echo
  echo "[$1]"
}

run_doctor_and_exit() {
  echo "=============================="
  echo "Captool Doctor"
  echo "=============================="

  doctor_section "Toolchain"
  if command -v npm >/dev/null 2>&1; then
    doctor_ok "npm: $(npm --version)"
  else
    doctor_fail_msg "npm not found"
  fi

  if command -v bash >/dev/null 2>&1; then
    doctor_ok "bash available"
  else
    doctor_fail_msg "bash not found"
  fi

  if command -v xcodebuild >/dev/null 2>&1; then
    doctor_ok "xcodebuild available"
  else
    doctor_warn "xcodebuild not found"
  fi

  if command -v xcrun >/dev/null 2>&1; then
    doctor_ok "xcrun available"
    if xcrun simctl list devices available | grep -q "$IOS_SIMULATOR_NAME"; then
      doctor_ok "iOS simulator available: $IOS_SIMULATOR_NAME"
    else
      doctor_warn "iOS simulator missing: $IOS_SIMULATOR_NAME"
    fi
  else
    doctor_warn "xcrun not found"
  fi

  if [[ -x "./android/gradlew" ]]; then
    doctor_ok "android gradlew available"
  else
    doctor_warn "android gradlew missing or not executable"
  fi

  doctor_section "Repo Paths"
  for path in src ios android demo tests/contract tools tools/lib tools/templates logs reports; do
    if [[ -e "$path" ]]; then
      doctor_ok "path present: $path"
    else
      doctor_fail_msg "missing required path: $path"
    fi
  done

  if [[ -f "./tools/captool" ]]; then
    doctor_ok "formal tool entrypoint present: tools/captool"
  else
    doctor_fail_msg "missing formal tool entrypoint: tools/captool"
  fi

  if [[ -f "./src/definitions.ts" ]]; then
    doctor_ok "formal contract source present: src/definitions.ts"
  else
    doctor_fail_msg "missing formal contract source: src/definitions.ts"
  fi

  echo "=============================="
  echo "Doctor Summary"
  echo "OK: $doctor_ok_count"
  echo "WARN: $doctor_warn_count"
  echo "FAIL: $doctor_fail"
  if [[ $doctor_fail -eq 0 ]]; then
    echo "Doctor Result: PASS"
    exit 0
  else
    echo "Doctor Result: FAIL"
    exit 1
  fi
}
