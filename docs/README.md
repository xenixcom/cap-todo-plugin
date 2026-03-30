# TodoPlugin Skeleton

這個 repo 是 `TodoPlugin` 的開發骨架，目標是先把單一契約、單一正式測試標準、單一正式測試入口固定下來，再往下實作最小範例與實際平台功能。現在 repo 已經包含官方 Capacitor plugin 結構、三平台實作骨架與 `demo` 展示 app，且 `demo` 三平台已手動驗證可正確運作。這一輪已先把正式暫定 `definitions.ts`、`tests/contract` 測試設計稿、`PLUGIN_GUIDELINES` 與 `test-plugin.sh` 主線收斂完成。

## 核心原則

- App 層只寫一套程式。
- Plugin 對外只提供一套 interface。
- 正式測試標準只有一套 contract test。
- 正式測試工具入口只有一個 `shell script`。
- 平台差異只能存在於 plugin 內部實作，不得演變成各自表述。

## 目前結構

```text
README.md
README.skeleton.md
docs/
  HANDOFF.md
  PORTING_NOTES.md
  PLUGIN_GUIDELINES.md
  README.md
src/
  definitions.ts
  index.ts
  web.ts
ios/
android/
demo/
tools/
  test-plugin.sh
tests/
  contract/
    README.md
    options.spec.ts
    lifecycle.spec.ts
    status.spec.ts
    error-handling.spec.ts
    edge-cases.spec.ts
```

## 檔案定位

- [`docs/PLUGIN_GUIDELINES.md`](/Users/james/dev2/cap-todo-plugin/docs/PLUGIN_GUIDELINES.md)
  正式開發與測試原則。
- [`docs/HANDOFF.md`](/Users/james/dev2/cap-todo-plugin/docs/HANDOFF.md)
  完整交接文件，讓另一台電腦可直接接手。
- [`docs/PORTING_NOTES.md`](/Users/james/dev2/cap-todo-plugin/docs/PORTING_NOTES.md)
  未來移植到其他 plugin repo 時的命名與識別字調整清單。
- [`tools/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/tools/test-plugin.sh)
  唯一正式測試工具入口。
- [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)
  唯一正式測試規格來源。
- [`demo`](/Users/james/dev2/cap-todo-plugin/demo)
  展示與手動驗證環境，目前三平台已手動驗證可運作。

## 測試入口

```bash
./tools/test-plugin.sh [all|web|ios|android] [--device=ID] [--no-close-device] [--fast] [--logs=file] [--report]
```

範例：

```bash
./tools/test-plugin.sh all --logs=plugin_test.log --report
./tools/test-plugin.sh ios --device=00008030-001D195E3A90002E --no-close-device --report
./tools/test-plugin.sh web --logs=web_test.log
./tools/test-plugin.sh web --fast
```

目前 `tools/test-plugin.sh` 的 web 測試命令預設為 `npm test`。
目前 `npm test` 已可執行完整 web formal contract tests，直接接到真實 `TodoWeb`。
目前 `./tools/test-plugin.sh all --report` 已可得到三平台全綠結果。
目前 `--report` 全綠時會輸出摘要，失敗時會輸出人類可讀的 failure summary。
目前 `--fast` 為通用快速模式旗標；目前僅 web 會跳過發佈型 build，只跑 formal contract tests，適合日常快速回歸。其他平台暫時忽略此旗標。
後續主線是把 `iOS / Android` 從目前 coverage 逐步提升到更接近 app 位階的單一 pipeline host，而不是發展各平台各自標準。
## 下一步

- 微調並確認正式 `src/definitions.ts`。
- 維持 `tests/contract` 作為唯一正式測試單元。
- 讓 `tools/test-plugin.sh` 從目前平台 coverage 逐步提升到更接近 app 位階的單一 pipeline host。
- 再讓 AI 依 contract 與測試持續實作、除錯、迭代。
## Core Reminder

- 正式 pipeline 先跑 [`tools/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/tools/test-plugin.sh)。
- `demo` 要等正式 pipeline 全綠後才做。
- `demo` 只負責最後 UI 確認、功能展示、用法示範。

## Pipeline Manifesto

- 這條正式 pipeline 應站在最接近前端 app 呼叫 plugin 的位階。
- 只要 `web` formal pipeline 能跑通，就代表這套正式 contract、正式測試單元與正式入口的主線設計成立。
- 若 `ios / android` 之後不綠，優先視為平台實作或 bridge 對齊問題，而不是回頭動搖 pipeline 主線。
- `TodoPlugin` 這個 repo 的價值，不只在展示 plugin 功能，也在展示 Capacitor plugin 如何把原生能力收斂回前端單一使用面。

## Current State

- `web` 已打通正式 contract pipeline，直接對真實 [`src/web.ts`](/Users/james/dev2/cap-todo-plugin/src/web.ts) 執行 [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)。
- `ios` 與 `android` 目前都已由 [`tools/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/tools/test-plugin.sh) 跑通三平台。
- [`tools/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/tools/test-plugin.sh) 仍是唯一正式入口。

## Platform Coverage

- `web`
  - 完整正式 contract tests
  - 目前 `npm test` 為 `43` 個 tests 全通過
- `ios`
  - 原生整合編譯驗證
  - 透過 `xcodebuild build` 與 simulator destination 驗證
  - 不再保留私有 XCTest target
- `android`
  - native core + bridge helper contract coverage
  - 透過 `./android/gradlew -p android test` 驗證
  - 已探測 bridge listener 邊界；local unit test 不適合直接承接真實 `notifyListeners` 驗證

## Current Direction

- 維持單一 [`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts)。
- 維持單一正式測試單元 [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)。
- 下一步是在目前「能測、能 run、三平台全綠」的穩定基準上做優化，而不是發展各平台各自的標準。
- `demo` 仍維持最後 UI 驗證與功能展示用途，不承擔正式 pipeline。

## Related Notes

- [`PIPELINE_RETROSPECTIVE.md`](/Users/james/dev2/cap-todo-plugin/docs/PIPELINE_RETROSPECTIVE.md): records lessons learned from temporary private tests and platform bridge probing.
- [`tests/pipeline/README.md`](/Users/james/dev2/cap-todo-plugin/tests/pipeline/README.md): records where the future single app-level pipeline host should live.
## Latest Baseline

- `./tools/test-plugin.sh all --report` currently passes on `web`, `ios`, and `android`.
- `ios` is no longer treated as compile-only validation. It now runs a minimal native contract test target that covers `echo`, `options`, `resetOptions`, `start/stop`, and disabled-state rejection.
- `ios` simulator startup now avoids opening the Simulator app window and can self-heal a stale default simulator record by recreating the configured `iPhone 17` device when needed.

## Artifact Cleanup

- Repo-local test artifacts can be cleaned with:
  - `./tools/test-plugin.sh --clean-artifacts`
- Global caches can be cleaned with:
  - `./tools/test-plugin.sh --clean-global-caches`

Notes:
- `--clean-artifacts` only clears repo-local outputs such as `ios/build/Logs/Test`, Android build outputs, demo Android build outputs, and `plugin-report-*.txt`.
- `--clean-global-caches` clears global Xcode, CoreSimulator, Gradle, and npm caches. Use it intentionally because it affects the whole machine and will make later builds slower until caches warm back up.
