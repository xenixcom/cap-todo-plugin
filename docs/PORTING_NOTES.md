# Porting Notes

這份文件記錄未來把此骨架移植到其他 plugin repo 時，應同步調整的命名與識別字。

目標不是要求一次改完，而是避免只改表面名稱，導致各平台識別字不同步。

## 1. 命名層總覽

目前 repo 使用的命名層：

- npm package：`@xenix/cap-todo-plugin`
- JS plugin 名稱：`Todo`
- Type / 類別名稱：`TodoPlugin`
- iOS Swift package / pod / scheme：`XenixCapTodoPlugin`
- Android namespace：`com.xenix.plugins.todo`
- demo app id：`io.xenix.demo`

移植時應先決定新 repo 的對應值，再一次性同步調整。

## 2. 必改項目

### 2.1 npm package 與 repo metadata

檔案：

- [`package.json`](/Users/james/dev2/cap-todo-plugin/package.json)
- [`README.md`](/Users/james/dev2/cap-todo-plugin/README.md)
- [`demo/package.json`](/Users/james/dev2/cap-todo-plugin/demo/package.json)

通常要改：

- package name
- description
- repository URL
- bugs URL
- install 指令
- demo 內對主 plugin 的相依名稱

### 2.2 JS plugin 名稱

檔案：

- [`src/index.ts`](/Users/james/dev2/cap-todo-plugin/src/index.ts)
- [`ios/Sources/TodoPlugin/TodoPlugin.swift`](/Users/james/dev2/cap-todo-plugin/ios/Sources/TodoPlugin/TodoPlugin.swift)
- [`android/src/main/java/com/xenix/plugins/todo/TodoPlugin.kt`](/Users/james/dev2/cap-todo-plugin/android/src/main/java/com/xenix/plugins/todo/TodoPlugin.kt)
- [`demo/src/views/HomePage.vue`](/Users/james/dev2/cap-todo-plugin/demo/src/views/HomePage.vue)

通常要改：

- `registerPlugin('Todo', ...)`
- iOS `jsName`
- Android `@CapacitorPlugin(name = "Todo")`
- demo import 與呼叫名稱

### 2.3 Type / 類別名稱

檔案：

- [`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts)
- [`src/web.ts`](/Users/james/dev2/cap-todo-plugin/src/web.ts)
- [`ios/Sources/TodoPlugin/TodoPlugin.swift`](/Users/james/dev2/cap-todo-plugin/ios/Sources/TodoPlugin/TodoPlugin.swift)
- [`ios/Sources/TodoPlugin/Todo.swift`](/Users/james/dev2/cap-todo-plugin/ios/Sources/TodoPlugin/Todo.swift)
- [`android/src/main/java/com/xenix/plugins/todo/TodoPlugin.kt`](/Users/james/dev2/cap-todo-plugin/android/src/main/java/com/xenix/plugins/todo/TodoPlugin.kt)
- [`android/src/main/java/com/xenix/plugins/todo/TodoCore.kt`](/Users/james/dev2/cap-todo-plugin/android/src/main/java/com/xenix/plugins/todo/TodoCore.kt)

通常要改：

- `TodoPlugin`
- `TodoWeb`
- `TodoCore`
- 對應檔名與資料夾名稱

## 3. iOS 需要同步注意的地方

檔案：

- [`Package.swift`](/Users/james/dev2/cap-todo-plugin/Package.swift)
- [`XenixCapTodoPlugin.podspec`](/Users/james/dev2/cap-todo-plugin/XenixCapTodoPlugin.podspec)
- [`tools/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/tools/test-plugin.sh)
- [`demo/ios/App/CapApp-SPM/Package.swift`](/Users/james/dev2/cap-todo-plugin/demo/ios/App/CapApp-SPM/Package.swift)

通常要改：

- Swift package name
- library product name
- podspec name
- xcodebuild scheme
- demo SPM package reference

注意：

- iOS 這層通常最容易出現「產品名改了，但 scheme / pod / SPM 還留舊名」的問題
- 不要只改 `TodoPlugin.swift` 類別名稱就停下來

## 4. Android 需要同步注意的地方

檔案：

- [`android/build.gradle`](/Users/james/dev2/cap-todo-plugin/android/build.gradle)
- [`android/src/main/java/com/xenix/plugins/todo/TodoPlugin.kt`](/Users/james/dev2/cap-todo-plugin/android/src/main/java/com/xenix/plugins/todo/TodoPlugin.kt)
- [`android/src/main/java/com/xenix/plugins/todo/TodoCore.kt`](/Users/james/dev2/cap-todo-plugin/android/src/main/java/com/xenix/plugins/todo/TodoCore.kt)
- [`demo/android/capacitor.settings.gradle`](/Users/james/dev2/cap-todo-plugin/demo/android/capacitor.settings.gradle)
- [`demo/android/app/capacitor.build.gradle`](/Users/james/dev2/cap-todo-plugin/demo/android/app/capacitor.build.gradle)

通常要改：

- namespace
- package path
- plugin class import path
- demo 內 linking 名稱

## 5. demo app 需要同步注意的地方

檔案：

- [`demo/package.json`](/Users/james/dev2/cap-todo-plugin/demo/package.json)
- [`demo/capacitor.config.ts`](/Users/james/dev2/cap-todo-plugin/demo/capacitor.config.ts)
- [`demo/src/views/HomePage.vue`](/Users/james/dev2/cap-todo-plugin/demo/src/views/HomePage.vue)
- [`demo/android/app/build.gradle`](/Users/james/dev2/cap-todo-plugin/demo/android/app/build.gradle)
- [`demo/android/app/src/main/res/values/strings.xml`](/Users/james/dev2/cap-todo-plugin/demo/android/app/src/main/res/values/strings.xml)
- [`demo/ios/App/App.xcodeproj/project.pbxproj`](/Users/james/dev2/cap-todo-plugin/demo/ios/App/App.xcodeproj/project.pbxproj)

通常要改：

- demo 顯示名稱
- app id / bundle identifier
- plugin dependency 名稱
- UI 上展示用文字

## 6. 文件與腳本

檔案：

- [`README.md`](/Users/james/dev2/cap-todo-plugin/README.md)
- [`README.skeleton.md`](/Users/james/dev2/cap-todo-plugin/README.skeleton.md)
- [`docs/README.md`](/Users/james/dev2/cap-todo-plugin/docs/README.md)
- [`docs/HANDOFF.md`](/Users/james/dev2/cap-todo-plugin/docs/HANDOFF.md)
- [`tools/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/tools/test-plugin.sh)

通常要改：

- 對外名稱
- repo 說明
- 移植後的現況描述
- iOS scheme
- 任何示例指令或路徑

## 7. 移植時的建議順序

1. 先決定新的命名對照表
2. 先改 metadata 與識別字
3. 再改平台層名稱與路徑
4. 再改 demo 相依與顯示文字
5. 最後再跑 build / sync / verify

## 8. 不要做的事

- 不要只改 npm package name
- 不要只改 JS plugin 名稱
- 不要只改 iOS 類別名
- 不要在沒整理命名層前就開始修改 `definitions.ts`

命名層未收斂前，後續 contract 討論會一直被雜訊打斷。
