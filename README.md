# @xenix/cap-todo-plugin

Capacitor plugin scaffold and demo workspace for `Todo`.

## Install

```bash
npm install @xenix/cap-todo-plugin
npx cap sync
```

## API

<docgen-index>

* [`getStatus()`](#getstatus)
* [`getOptions()`](#getoptions)
* [`setOptions(...)`](#setoptions)
* [`resetOptions()`](#resetoptions)
* [`start()`](#start)
* [`stop()`](#stop)
* [`reset()`](#reset)
* [`checkPermissions()`](#checkpermissions)
* [`requestPermissions(...)`](#requestpermissions)
* [`echo(...)`](#echo)
* [`addListener('statusChange', ...)`](#addlistenerstatuschange-)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

TodoPlugin 的正式對外 contract。

這份定義的目的不是展示某個特定功能做多完整，
而是展示一份可跨平台、可測、可讓 AI 持續迭代的 plugin 協議。

### getStatus()

```typescript
getStatus() => Promise<StatusResult>
```

取得目前 plugin 狀態。

回傳的是目前正式狀態快照，
不是最後一次事件通知結果，也不是操作歷史。

**Returns:** <code>Promise&lt;<a href="#statusresult">StatusResult</a>&gt;</code>

--------------------


### getOptions()

```typescript
getOptions() => Promise<PluginOptions>
```

取得目前生效的 plugin options。

**Returns:** <code>Promise&lt;<a href="#pluginoptions">PluginOptions</a>&gt;</code>

--------------------


### setOptions(...)

```typescript
setOptions(options: Partial<PluginOptions>) => Promise<void>
```

局部更新 plugin options。

未提供的欄位必須保留原值，不可整體覆蓋。
此方法只更新 options，不應隱式觸發 lifecycle 狀態變化。

| Param         | Type                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------- |
| **`options`** | <code><a href="#partial">Partial</a>&lt;<a href="#pluginoptions">PluginOptions</a>&gt;</code> |

--------------------


### resetOptions()

```typescript
resetOptions() => Promise<void>
```

只重置 options，不改變目前狀態。

執行後 options 應回到預設值，但 `status` 保持不變。

--------------------


### start()

```typescript
start() => Promise<void>
```

啟動 plugin 主要功能。

當 `enabled = false` 時，應拋出 `INVALID_STATE`。
當目前狀態不允許啟動時，也應拋出 `INVALID_STATE`。

--------------------


### stop()

```typescript
stop() => Promise<void>
```

停止 plugin 主要功能，成功後回到 `idle`。

--------------------


### reset()

```typescript
reset() => Promise<void>
```

重置 plugin。

流程應為 `init -&gt; idle`。

此方法會重置 options 與內部運作狀態。
若重置失敗，應以正式錯誤契約 throw / reject，
不可假裝回到 `idle`。

--------------------


### checkPermissions()

```typescript
checkPermissions() => Promise<PluginPermissionStatus>
```

取得目前權限狀態。

對 App 層只允許回傳 `prompt | granted | denied`。
各平台內部更細的原生權限狀態必須先完成映射。

**Returns:** <code>Promise&lt;<a href="#pluginpermissionstatus">PluginPermissionStatus</a>&gt;</code>

--------------------


### requestPermissions(...)

```typescript
requestPermissions(options?: PermissionRequestOptions | undefined) => Promise<PluginPermissionStatus>
```

請求權限。

若未提供 `permissions`，表示請求所有正式對外權限。

不支援的權限請求應拋出 `INVALID_ARGUMENT`
或 `UNSUPPORTED_PLATFORM`，不可靜默忽略。

| Param         | Type                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| **`options`** | <code><a href="#permissionrequestoptions">PermissionRequestOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginpermissionstatus">PluginPermissionStatus</a>&gt;</code>

--------------------


### echo(...)

```typescript
echo(options: EchoOptions) => Promise<EchoResult>
```

最小示範方法，用來驗證基礎 request / response contract。

這不是核心 lifecycle 能力，
而是示範一個最小可驗證的功能型方法。

| Param         | Type                                                |
| ------------- | --------------------------------------------------- |
| **`options`** | <code><a href="#echooptions">EchoOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#echoresult">EchoResult</a>&gt;</code>

--------------------


### addListener('statusChange', ...)

```typescript
addListener(eventName: 'statusChange', listenerFunc: (event: StatusChangeEvent) => void) => Promise<PluginListenerHandle>
```

註冊狀態變化監聽器。

只有正式狀態變化時才應觸發 `statusChange`。
App 層可依此同步 UI 或流程狀態，但不應取代 `getStatus()`。

| Param              | Type                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'statusChange'</code>                                                         |
| **`listenerFunc`** | <code>(event: <a href="#statuschangeevent">StatusChangeEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

移除所有已註冊監聽器。

--------------------


### Interfaces


#### StatusResult

| Prop         | Type                                                  |
| ------------ | ----------------------------------------------------- |
| **`status`** | <code><a href="#pluginstatus">PluginStatus</a></code> |


#### PluginOptions

Plugin 的正式設定選項。

這裡只保留示範型 contract 最常見、最容易跨平台對齊的欄位。

- `enabled`: 是否允許 plugin 進入可執行流程
- `debug`: 是否啟用除錯輔助行為

| Prop          | Type                 |
| ------------- | -------------------- |
| **`enabled`** | <code>boolean</code> |
| **`debug`**   | <code>boolean</code> |


#### PluginPermissionStatus

| Prop             | Type                                                                    |
| ---------------- | ----------------------------------------------------------------------- |
| **`microphone`** | <code><a href="#pluginpermissionstate">PluginPermissionState</a></code> |


#### PermissionRequestOptions

指定要請求哪些權限。

若未提供，則表示請求此 plugin 所有正式對外權限。

目前示範型 contract 只保留 `microphone`，
但這個型別刻意保留未來擴充多權限的空間。

| Prop              | Type                        |
| ----------------- | --------------------------- |
| **`permissions`** | <code>'microphone'[]</code> |


#### EchoResult

| Prop        | Type                |
| ----------- | ------------------- |
| **`value`** | <code>string</code> |


#### EchoOptions

| Prop        | Type                |
| ----------- | ------------------- |
| **`value`** | <code>string</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### StatusChangeEvent

狀態變化事件。

只有正式狀態變化時才應觸發 `statusChange`。
若呼叫方法後狀態未改變，不應額外推送 event。

| Prop         | Type                                                  |
| ------------ | ----------------------------------------------------- |
| **`status`** | <code><a href="#pluginstatus">PluginStatus</a></code> |


### Type Aliases


#### PluginStatus

Plugin 的對外狀態。

- `init`: 初始化或重置進行中
- `idle`: 可運作但尚未啟動
- `running`: 功能執行中

`status` 只表達正式運作狀態，不包含錯誤狀態。
若操作失敗，應以正式錯誤契約 throw / reject，
而不是把 `error` 混入 status。

<code>'init' | 'idle' | 'running'</code>


#### Partial

Make all properties in T optional

<code>{ [P in keyof T]?: T[P]; }</code>


#### PluginPermissionState

對 App 層暴露的統一權限狀態。

平台內部若有更細的原生權限狀態，
必須先映射到這三種後才能對外回傳。

例如 Android 的 `prompt-with-rationale`
也必須先收斂成這裡的 `prompt`。

<code>'prompt' | 'granted' | 'denied'</code>


#### PluginPermissionName

目前示範型 contract 只保留一種權限，
但型別結構保留未來擴充多權限的空間。

<code>'microphone'</code>

</docgen-api>
