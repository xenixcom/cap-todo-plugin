package com.xenix.plugins.todo;

import android.Manifest
import android.os.Build
import com.getcapacitor.*
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback

@CapacitorPlugin(
    name = "Todo",
    permissions = [
        Permission(alias = TodoPlugin.CAMERA, strings = [Manifest.permission.CAMERA]),
        Permission(alias = TodoPlugin.MICROPHONE, strings = [Manifest.permission.RECORD_AUDIO]),
        Permission(alias = TodoPlugin.PHOTOS, strings = [Manifest.permission.READ_MEDIA_IMAGES]),
        Permission(alias = TodoPlugin.PHOTOS_LEGACY, strings = [Manifest.permission.READ_EXTERNAL_STORAGE])
    ]
)
class TodoPlugin : Plugin() {

    companion object {
        const val CAMERA = "camera"
        const val MICROPHONE = "microphone"
        const val PHOTOS = "photos"
        const val PHOTOS_LEGACY = "photos_legacy"
    }

    private val implementation = Todo()

    private var pendingAction: (() -> Unit)? = null
    private var pendingPermissionKeys: List<String> = emptyList()

    // --------------------------------------------------
    // MARK: - Lifecycle
    // --------------------------------------------------

    override fun load() {
        implementation.onNotify = { event, payload ->
            val data = JSObject()
            payload.forEach { (k, v) -> data.put(k, v) }
            notifyListeners(event, data, true)
        }
    }

    // --------------------------------------------------
    // MARK: - Actions
    // --------------------------------------------------

    @PluginMethod
    fun echo(call: PluginCall) {
        call.resolve(JSObject().put("value", implementation.echo(call.getString("value") ?: "")))
    }

    @PluginMethod
    fun startRecording(call: PluginCall) =
        ensurePermissions(call, listOf(MICROPHONE)) {
            implementation.startRecording()
            call.resolve()
        }

    @PluginMethod
    fun stopRecording(call: PluginCall) {
        implementation.stopRecording()
        call.resolve()
    }

    @PluginMethod
    fun takePhoto(call: PluginCall) =
        ensurePermissions(call, listOf(CAMERA, PHOTOS)) {
            implementation.takePhoto()
            call.resolve()
        }

    @PluginMethod
    override fun checkPermissions(call: PluginCall) {
        call.resolve(checkPermissionsInternal())
    }

    @PluginMethod
    override fun requestPermissions(call: PluginCall) {
        val keys =
            call.getArray("permissions")?.toList<String>()
                ?: listOf(CAMERA, MICROPHONE, PHOTOS)

        val aliases = keys.mapNotNull { permissionAlias(it) }.toTypedArray()
        requestPermissionForAliases(aliases, call, "permissionCallback")
    }

    // --------------------------------------------------
    // MARK: - Permission Management
    // --------------------------------------------------

    @PermissionCallback
    private fun permissionCallback(call: PluginCall) {
        val status = checkPermissionsInternal()

        val granted = pendingPermissionKeys.all {
            status.getString(it) == "granted"
        }

        if (granted) {
            pendingAction?.invoke()
        } else {
            call.reject("Permission denied")
        }

        pendingAction = null
        pendingPermissionKeys = emptyList()
    }

    private fun ensurePermissions(call: PluginCall, requiredKeys: List<String>, onGranted: () -> Unit) {
        val status = checkPermissionsInternal()

        val missing = requiredKeys.filter {
            status.getString(it) != "granted"
        }

        if (missing.isEmpty()) {
            onGranted()
            return
        }

        pendingAction = onGranted
        pendingPermissionKeys = requiredKeys

        saveCall(call)
        requestPermissionForAliases(
            missing.mapNotNull { permissionAlias(it) }.toTypedArray(),
            call,
            "permissionCallback"
        )
    }

    // --------------------------------------------------
    // MARK: - Permission Helpers
    // --------------------------------------------------

    private fun permissionAlias(key: String): String? =
        when (key) {
            CAMERA, MICROPHONE -> key
            PHOTOS -> if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) PHOTOS else PHOTOS_LEGACY
            else -> null
        }

    private fun checkPermissionsInternal(): JSObject =
        JSObject().apply {
            put(CAMERA, permissionState(CAMERA))
            put(MICROPHONE, permissionState(MICROPHONE))
            put(PHOTOS, permissionState(permissionAlias(PHOTOS)!!))
        }

    private fun permissionState(alias: String): String =
        when (
            if (isPermissionDeclared(alias)) super.getPermissionState(alias)
            else PermissionState.GRANTED
        ) {
            PermissionState.GRANTED -> "granted"
            PermissionState.DENIED -> "denied"
            PermissionState.PROMPT,
            PermissionState.PROMPT_WITH_RATIONALE -> "prompt"
        }
        
}
