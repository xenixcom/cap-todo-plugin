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
- `src/definitions.ts` 目前只是搬來的參考稿，還不是正式定案
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
  todo.ts
  web.ts
ios/
android/
demo/
tests/
  contract/
```

補充：

- 舊 `.git` 已移除，這裡目前不是 git repo
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
- 內容是從舊 repo 搬來的概念型定義
- 可作為討論參考
- 不應被視為正式 contract 定案

### 6.2 `demo`

- 已存在
- 作用是展示 plugin 與驗證環境可跑
- `web / iOS / Android` 已手動驗證可運作
- 不等於正式 contract 驗收

### 6.3 `tests/contract`

- 目前仍是 placeholder
- 分類方向已先固定
- 尚未接上正式 `definitions.ts`
- 尚未接上真實 runner

### 6.4 `scripts/test-plugin.sh`

- 目前仍是測試入口骨架
- 已有單一入口、平台選擇、裝置參數、log、report 等流程骨架
- 尚未與真實正式 contract tests 完成閉環驗證

## 7. 目前已確認的事

- 官方 Capacitor plugin 骨架可以作為實作底盤
- `demo` 這條展示路徑是有效的
- `demo` 三平台目前可跑，表示目前命名層與平台串接沒有明顯錯位
- lockfile 對可重現環境有價值，不能隨便移除
- 若未先定清楚 contract 與測試單元，AI 雖然可以快速寫 code，但很容易往錯方向高速前進

## 8. 目前還沒定案的事

- 正式 `definitions.ts` 長什麼樣
- 正式錯誤碼契約
- 正式狀態模型
- 正式 listener / event 協議
- 正式 contract tests 如何從 placeholder 轉成可執行案例
- `demo` 與正式 contract test 的責任分界要如何文字化

## 9. 下一步建議順序

1. 先把骨架清乾淨，移除過時或模板殘留
2. 討論正式 `definitions.ts`
3. 定義唯一正式測試單元
4. 補充行為說明文件
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
- 文件與測試骨架已存在
- 下一個關鍵點是把正式 `definitions.ts` 與正式測試單元定下來

後續若有分歧，優先守住這個原則：

- 人負責定義正確性
- AI 負責逼近正確性
