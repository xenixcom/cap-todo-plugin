# Handoff

## 1. 這個 repo 目前是什麼

這個 repo 目前不是純文件骨架，也不是已定案的正式 plugin。

它現在是：

- `TodoPlugin` 的 Capacitor plugin 開發骨架
- 以官方 `npm init @capacitor/plugin@latest` 建立的實作基底
- 已搬入 `web / iOS / Android` 三平台 plugin 結構
- 已搬入 `demo` 展示 app，且三平台已手動驗證可正確運作
- 已搬入一份暫時性的 `src/definitions.ts` 供參考

它目前還不是：

- 已定案的正式 contract repo
- 已完成正式 contract tests 的 repo
- 已完成一條龍正式驗證閉環的 repo

## 2. 這個 repo 的真正目的

這個示範 repo 的最終目的不是只做出一個 Todo plugin，而是建立一種可持續的人機協作方式：

- 人負責定義 contract
- 人負責定義正式測試單元
- 人負責補充行為說明文件
- AI 依照這些邊界持續編寫、除錯、迭代到完成

核心思想：

- 先把語意定清楚，再讓 AI 高速往前推
- 先把正式驗收標準固定，再談平台細節
- 讓人與 AI 討論的重點收斂在定義與驗收，而不是零碎實作

## 3. 目前共識

- 採用 `contract-first`，不是 `platform-first`
- App 層只應面對單一 plugin contract
- 正式測試標準只應有一套
- 正式測試入口只應有一個
- `web / iOS / Android` 的差異只能存在於內部實作
- `demo` 是展示與驗證環境，不是正式 contract test
- `src/definitions.ts` 已整理成正式暫定 contract 草案
- `tests/contract` 已整理成正式測試設計稿與情境矩陣
- `scripts/test-plugin.sh` 已整理成框架中立的唯一正式測試入口
- 目前命名層已整理並通過 demo 三平台手動驗證

## 4. 目前目錄狀態

```text
README.md
README.skeleton.md
docs/
  README.md
  PLUGIN_GUIDELINES.md
  HANDOFF.md
  PORTING_NOTES.md
scripts/
  test-plugin.sh
src/
  definitions.ts
  index.ts
  web.ts
ios/
android/
demo/
tests/
  contract/
```

補充：

- 舊 `.git` 已移除，repo 已重新初始化並建立新歷史
- 本機建置殘留與 IDE 檔案已清除
- `package-lock.json` 與 `demo/package-lock.json` 目前保留
- `Package.resolved` 目前保留

## 5. 命名現況

目前主要命名層如下：

- npm package：`@xenix/cap-todo-plugin`
- JS plugin 名稱：`Todo`
- Type / 類別名稱：`TodoPlugin`
- iOS Swift package / pod / scheme：`XenixCapTodoPlugin`
- Android package namespace：`com.xenix.plugins.todo`
- demo app id：`io.xenix.demo`

這些命名目前視為可運作的現況，不代表最終一定不改。

## 6. 各區塊目前狀態

### 6.1 `src/definitions.ts`

- 已存在
- 已整理成正式暫定 contract 草案
- 已明確定義 `Status`、`Options`、`Permissions`、`Error`、`Events`
- 已補上詳細註解，說明用法、狀態轉移、錯誤行為與事件觸發時機
- 目前可作為後續 contract tests 與平台實作的共同語意來源

### 6.2 `demo`

- 已存在
- 作用是展示 plugin 與驗證環境可跑
- `web / iOS / Android` 已手動驗證可運作
- 不等於正式 contract 驗收
- `demo` 目前已調整回與正式 contract 一致的示範用法，不再引用舊版 `startRecording / takePhoto / updateTime` API

### 6.3 `tests/contract`

- 已整理成正式測試設計稿
- `options.spec.ts`、`lifecycle.spec.ts`、`status.spec.ts`、`error-handling.spec.ts`、`edge-cases.spec.ts` 已接到真實 `TodoWeb`
- 目前 `npm test` 可執行完整 web formal contract tests
- 已和正式 `definitions.ts` 對齊
- 已補上情境矩陣，且 web 端已形成可執行 formal suite
- 目前整體基準已達到「能測、能 run、三平台全綠」

### 6.4 `scripts/test-plugin.sh`

- 已整理成唯一正式測試工具入口
- 已有單一入口、平台選擇、裝置參數、log、report 等流程骨架
- 已改成不綁定 Jest / Vitest 的框架中立語意
- 目前 `./scripts/test-plugin.sh all --report` 已可跑通三平台，失敗平台數為 `0`
- `--report` 在成功時會輸出摘要，在失敗時會輸出人類可讀的 failure summary
- `--fast` 為通用快速模式旗標；目前僅 web 會跳過發佈型 build，只跑 formal contract tests，作為開發期快速回歸模式。其他平台暫時忽略。

## 7. 目前已確認的事

- 官方 Capacitor plugin 骨架可以作為實作底盤
- `demo` 這條展示路徑是有效的
- `demo` 三平台目前可跑，表示目前命名層與平台串接沒有明顯錯位
- lockfile 對可重現環境有價值，不能隨便移除
- 若未先定清楚 contract 與測試單元，AI 雖然可以快速寫 code，但很容易往錯方向高速前進

## 8. 目前還沒定案的事

- 正式 `definitions.ts` 是否還需再微調欄位與註解
- `ios / android` 如何從目前可執行 coverage 提升到更接近 app 位階的單一 pipeline host
- `demo` 與正式 contract test 的責任分界是否還需補充文件
- 平台實作何時開始跟進正式 contract

## 9. 下一步建議順序

1. 先把骨架清乾淨，移除過時或模板殘留
2. 微調並確認正式 `definitions.ts`
3. 維持 `tests/contract` 作為唯一正式測試單元
4. 讓 `scripts/test-plugin.sh` 從目前平台 coverage 逐步提升到更接近 app 位階的單一 pipeline host
5. 再讓 AI 依據 contract 與測試去持續實作、除錯、迭代

## 10. 移植到其他 repo 時

未來若要把這份骨架移植到其他 plugin repo，不要直接全域取代名稱。

先看：

- [`docs/PORTING_NOTES.md`](/Users/james/dev2/cap-todo-plugin/docs/PORTING_NOTES.md)

那份文件列出目前需要同步調整的命名層、識別字、路徑與注意事項。

## 11. 交接結論

這個 repo 現在最重要的價值不是某個功能已經完成，而是它已經逐步接近一個可讓 AI 長期接手的工作底盤：

- 環境已有基礎可跑路徑
- 平台骨架已存在
- 命名層已初步收斂，且目前 demo 三平台手動驗證通過
- 文件、正式暫定 contract、測試設計稿與 script 主線已存在
- 下一個關鍵點是從目前已可執行、可回歸的穩定基準往下一輪優化

後續若有分歧，優先守住這個原則：

- 人負責定義正確性
- AI 負責逼近正確性
## Critical Principle

- 正式 pipeline 的唯一入口是 [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh)。
- 正式 contract、正式測試單元、正式入口都必須先跑通，之後才做 `demo`。
- `demo` 的定位是最後 UI 確認與功能展示，不是正式 pipeline 的執行宿主。
- 若後續工作把 `demo` 當成正式測試主體，代表方向已偏離，應回到單一入口設計。

## Pipeline Declaration

- 這條正式 pipeline 的位置，應站在最接近前端 app 呼叫 plugin 的位階。
- Capacitor plugin 的最終目的，是把各平台能力收斂回前端 web 的單一使用面。
- 因此，只要 `web` formal pipeline 能跑通，就代表：
  - 正式 contract 可工作
  - 正式測試單元可工作
  - 正式測試入口可工作
  - 整條 pipeline 的設計本身成立
- 在這個前提下，若 `ios` 或 `android` 無法綠燈，優先視為平台實作或 bridge 對齊問題，而不是回頭動搖正式 pipeline 主線。
- `TodoPlugin` 這個 repo 不只展示 plugin 功能，也展示：
  - 如何把原生能力收斂回前端單一使用面
  - 如何用單一 contract、單一測試單元、單一入口去驗證 Capacitor plugin
  - 如何讓後續開發者節省平台分裂與重複摸索的時間

## Current Verification Status

- `web` 已是完整的正式 contract pipeline。
- 正式來源為 [`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts) 與 [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)。
- `web` 端正式 contract tests 已直接對真實 [`src/web.ts`](/Users/james/dev2/cap-todo-plugin/src/web.ts) 執行，不再依賴臨時 reference harness。
- 目前 `npm test` 會執行：
  - `options.spec.ts`
  - `lifecycle.spec.ts`
  - `status.spec.ts`
  - `error-handling.spec.ts`
  - `edge-cases.spec.ts`
- 最新驗證結果為 `5` 個 test files、`43` 個 tests 全數通過。

## Native Coverage Status

- `ios` 與 `android` 已完成第一批 native core contract coverage。
- 這一層主要驗證：
  - options 與 default state
  - lifecycle 與錯誤碼
  - reset 行為
  - `statusChange` payload
  - `checkPermissions` / `requestPermissions` 相關 mapping 與正規化 helper
- `ios` 目前透過 [`ios/Sources/TodoPlugin/Todo.swift`](/Users/james/dev2/cap-todo-plugin/ios/Sources/TodoPlugin/Todo.swift) 與單一入口 [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh) 的原生整合編譯路徑驗證。
- `android` 目前透過 [`android/src/main/java/com/xenix/plugins/todo/TodoCore.kt`](/Users/james/dev2/cap-todo-plugin/android/src/main/java/com/xenix/plugins/todo/TodoCore.kt) 與 [`android/src/test/java/com/xenix/plugins/todo/TodoCoreTest.kt`](/Users/james/dev2/cap-todo-plugin/android/src/test/java/com/xenix/plugins/todo/TodoCoreTest.kt) 驗證。
- 原生 bridge 仍在逐步推進；目前是以 bridge helper contract coverage 為主，尚未達到和 `web` 完全同層級的 formal contract suite。
- `android` 已額外探測 `statusChange -> notifyListeners` 的 bridge 邊界，結果顯示目前 local unit test 一碰真實 bridge listener payload，就會受到 `JSObject` / Android SDK mock 限制。
- 這代表 Android 若要再往前推真正的 bridge formal tests，下一層應考慮 Robolectric 或 instrumented tests，而不是繼續硬塞在目前的 local unit test。
- `ios` 先前曾用私有 XCTest 探測 bridge seam，但該私測已移除；目前正式主線不再依賴私有 iOS test target。

## Single Entry Status

- [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh) 仍是唯一正式測試入口。
- 目前入口對應狀態：
  - `web`: 跑完整正式 contract tests
  - `ios`: 跑原生整合編譯驗證
  - `android`: 跑 native core 與 bridge helper contract coverage
- 這仍符合單一 contract、單一正式測試標準、單一正式入口的核心思想；差異只在各平台目前接入深度不同。
- 最新實測狀態：`./scripts/test-plugin.sh all --report` 已全數通過，失敗平台數為 `0`。

## Next Step

- 下一輪主軸不是再擴張私測，而是在目前穩定基準上做優化。
- 下一步應沿用既有 [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract) 與 [`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts)，把 `ios` / `android` 從目前 coverage 逐步接到未來的單一 pipeline host。
- `demo` 仍維持最後 UI 驗證與功能展示用途，不承擔正式 pipeline。
## Current Stable State

- The current optimization branch still preserves the single-pipeline rule:
  - formal entry: `./scripts/test-plugin.sh`
  - formal contract source: `src/definitions.ts`
  - formal web suites: `tests/contract`
- `web`, `ios`, and `android` now all return green from `./scripts/test-plugin.sh all --report`.

### iOS Status

- `ios` no longer stops at compile-only verification.
- A minimal native Swift test target is active again and currently covers:
  - `echo`
  - default options
  - partial `setOptions`
  - `resetOptions`
  - `start -> running`
  - `stop -> idle`
  - disabled-state `start` rejection
- The script also self-heals a stale default simulator entry by recreating the configured `iPhone 17` simulator when the stored CoreSimulator record no longer exists on disk.

### Cleanup Controls

- Use `./scripts/test-plugin.sh --clean-artifacts` for repo-local cleanup.
- Use `./scripts/test-plugin.sh --clean-global-caches` for machine-wide cache cleanup.

Keep the distinction clear:
- `--clean-artifacts` is safe routine cleanup for this repo.
- `--clean-global-caches` is a deliberate machine-level cleanup step.
