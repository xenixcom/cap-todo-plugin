# Contract Tests
`tests/contract/` is the visible formal test unit layer.

Keep these specs simple:
- scenario
- input
- expectation

Use `tests/support/` only for thin shared support such as repeated setup and
small reusable assertions. Do not move formal contract meaning out of the spec
files.

Current suites:
- `options.spec.ts`
- `lifecycle.spec.ts`
- `status.spec.ts`
- `error.spec.ts`
- `edge.spec.ts`

Rules:
- all formal acceptance cases live here
- `web`, `ios`, and `android` should align to this contract over time
- platform-specific tests may exist, but they do not replace this layer
- `tools/captool` is the formal tool entrypoint that consumes this layer

Current role:
- `web` already runs these suites directly through `npm test`
- `ios` and `android` still bridge through native coverage and are not yet at
  the same app-level host depth as `web`
- permission cases currently stay inside `error.spec.ts` and `edge.spec.ts`
- if permission behavior grows later, a dedicated `permissions.spec.ts` may be
  justified

建議測試情境矩陣：

### Options

- 讀取預設 options
- 局部更新單一欄位
- 局部更新多個欄位
- 傳入空物件
- `resetOptions()` 後恢復預設值
- `resetOptions()` 不影響目前 status

### Lifecycle

- 初始化完成後進入 `idle`
- `start()` 使 `idle -> running`
- `stop()` 使 `running -> idle`
- `reset()` 使 `init -> idle`
- `enabled = false` 時拒絕 `start()`

### Status

- `getStatus()` 回傳正式狀態快照
- `status` 僅允許 `init | idle | running`
- `statusChange` payload 與正式狀態一致
- 發生正式狀態改變時才推送 event
- 未發生狀態改變時不得推送多餘 event

### Error Handling

- 權限拒絕
- 平台不支援
- 能力暫時不可用
- 參數不合法
- 狀態不合法
- 對外錯誤缺少 `code` 或 `message`

### Edge Cases

- 重複呼叫 `start()`
- 重複呼叫 `stop()`
- `requestPermissions()` 未提供 `permissions`
- `requestPermissions()` 傳入不合法值
- 平台內部特殊權限狀態映射
- 平台實作以靜默失敗、`false`、空值取代正式錯誤
