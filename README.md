# @xenix/cap-todo-plugin

Capacitor plugin scaffold and demo workspace for `Todo`.

## Install

```bash
npm install @xenix/cap-todo-plugin
npx cap sync
```

## API

<docgen-index>

* [`checkPermissions()`](#checkpermissions)
* [`requestPermissions(...)`](#requestpermissions)
* [`echo(...)`](#echo)
* [`startRecording()`](#startrecording)
* [`stopRecording()`](#stoprecording)
* [`takePhoto()`](#takephoto)
* [`addListener('updateTime', ...)`](#addlistenerupdatetime-)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### checkPermissions()

```typescript
checkPermissions() => Promise<TodoPermissionStatus>
```

**Returns:** <code>Promise&lt;<a href="#todopermissionstatus">TodoPermissionStatus</a>&gt;</code>

--------------------


### requestPermissions(...)

```typescript
requestPermissions(permissions?: TodoPermissions | undefined) => Promise<TodoPermissionStatus>
```

| Param             | Type                                                        |
| ----------------- | ----------------------------------------------------------- |
| **`permissions`** | <code><a href="#todopermissions">TodoPermissions</a></code> |

**Returns:** <code>Promise&lt;<a href="#todopermissionstatus">TodoPermissionStatus</a>&gt;</code>

--------------------


### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### startRecording()

```typescript
startRecording() => Promise<void>
```

--------------------


### stopRecording()

```typescript
stopRecording() => Promise<void>
```

--------------------


### takePhoto()

```typescript
takePhoto() => Promise<void>
```

--------------------


### addListener('updateTime', ...)

```typescript
addListener(eventName: 'updateTime', listenerFunc: (data: TimeResult) => void) => Promise<PluginListenerHandle>
```

| Param              | Type                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| **`eventName`**    | <code>'updateTime'</code>                                            |
| **`listenerFunc`** | <code>(data: <a href="#timeresult">TimeResult</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

--------------------


### Interfaces


#### TodoPermissionStatus

| Prop             | Type                                                                |
| ---------------- | ------------------------------------------------------------------- |
| **`microphone`** | <code><a href="#todopermissionstate">TodoPermissionState</a></code> |
| **`camera`**     | <code><a href="#todopermissionstate">TodoPermissionState</a></code> |
| **`photos`**     | <code><a href="#todopermissionstate">TodoPermissionState</a></code> |


#### TodoPermissions

| Prop              | Type                              |
| ----------------- | --------------------------------- |
| **`permissions`** | <code>TodoPermissionType[]</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### TimeResult

| Prop         | Type                |
| ------------ | ------------------- |
| **`time`**   | <code>string</code> |
| **`status`** | <code>string</code> |


### Type Aliases


#### TodoPermissionState

<code><a href="#permissionstate">PermissionState</a> | 'limited'</code>


#### PermissionState

<code>'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'</code>


#### TodoPermissionType

<code>'microphone' | 'camera' | 'photos'</code>

</docgen-api>
