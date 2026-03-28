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
  todo.ts
  web.ts
ios/
android/
demo/
scripts/
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
- [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh)
  唯一正式測試工具入口。
- [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)
  唯一正式測試規格來源。
- [`demo`](/Users/james/dev2/cap-todo-plugin/demo)
  展示與手動驗證環境，目前三平台已手動驗證可運作。

## 測試入口

```bash
./scripts/test-plugin.sh [all|web|ios|android] [--device=ID] [--no-close-device] [--logs=file] [--report]
```

範例：

```bash
./scripts/test-plugin.sh all --logs=plugin_test.log --report
./scripts/test-plugin.sh ios --device=00008030-001D195E3A90002E --no-close-device --report
./scripts/test-plugin.sh web --logs=web_test.log
```

目前 `scripts/test-plugin.sh` 的 web 測試命令預設為 `npm test`。
目前 `npm test` 已可執行完整 web formal contract tests，直接接到真實 `TodoWeb`。
後續主線是把 `iOS / Android` 逐步接上同一套正式測試入口，而不是發展各平台各自標準。
## 下一步

- 微調並確認正式 `src/definitions.ts`。
- 讓 `tests/contract` 從測試設計稿轉成可執行 contract tests。
- 把 `scripts/test-plugin.sh` 與正式 contract tests 接成閉環。
- 再讓 AI 依 contract 與測試持續實作、除錯、迭代。
## Current State

- `web` 已打通正式 contract pipeline，直接對真實 [`src/web.ts`](/Users/james/dev2/cap-todo-plugin/src/web.ts) 執行 [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)。
- `ios` 與 `android` 已完成第一批 native core 與 bridge helper contract coverage，但尚未完全達到 `web` 那種完整 formal suite 深度。
- [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh) 仍是唯一正式入口。

## Platform Coverage

- `web`
  - 完整正式 contract tests
  - 目前 `npm test` 為 `43` 個 tests 全通過
- `ios`
  - native core + bridge helper contract coverage
  - 透過 `xcodebuild test` 驗證
  - 已驗證最小 bridge seam 可存在且不破壞現有測試
- `android`
  - native core + bridge helper contract coverage
  - 透過 `./android/gradlew -p android test` 驗證
  - 已探測 bridge listener 邊界；local unit test 不適合直接承接真實 `notifyListeners` 驗證

## Current Direction

- 維持單一 [`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts)。
- 維持單一正式測試單元 [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)。
- 下一步是把 `ios` / `android` 逐步提升到與 `web` 更接近的 formal bridge contract coverage，而不是發展各平台各自的標準。
- 目前建議先推 `ios` 的第一個 bridge event test，再決定 `android` 的下一層原生測試形態。

## Related Notes

- [`PIPELINE_RETROSPECTIVE.md`](/Users/james/dev2/cap-todo-plugin/docs/PIPELINE_RETROSPECTIVE.md): records lessons learned from temporary private tests and platform bridge probing.
