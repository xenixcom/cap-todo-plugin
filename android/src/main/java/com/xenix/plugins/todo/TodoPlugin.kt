package com.xenix.plugins.todo;

import android.Manifest
import com.getcapacitor.*
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback

@CapacitorPlugin(
    name = "Todo",
    permissions = [
        Permission(alias = TodoPlugin.MICROPHONE, strings = [Manifest.permission.RECORD_AUDIO]),
    ]
)
class TodoPlugin : Plugin() {

    companion object {
        const val MICROPHONE = "microphone"
        const val EVENT_STATUS_CHANGE = "statusChange"
    }

    private var enabled = true
    private var debug = false
    private var status = "idle"

    private var pendingAction: (() -> Unit)? = null
    private var pendingCall: PluginCall? = null

    @PluginMethod
    fun getStatus(call: PluginCall) {
        call.resolve(JSObject().put("status", status))
    }

    @PluginMethod
    fun getOptions(call: PluginCall) {
        call.resolve(defaultOptions().put("enabled", enabled).put("debug", debug))
    }

    @PluginMethod
    fun setOptions(call: PluginCall) {
        if (call.data.has("enabled")) {
            enabled = call.getBoolean("enabled", enabled) ?: enabled
        }
        if (call.data.has("debug")) {
            debug = call.getBoolean("debug", debug) ?: debug
        }
        call.resolve()
    }

    @PluginMethod
    fun resetOptions(call: PluginCall) {
        enabled = true
        debug = false
        call.resolve()
    }

    @PluginMethod
    fun echo(call: PluginCall) {
        call.resolve(JSObject().put("value", call.getString("value") ?: ""))
    }

    @PluginMethod
    fun start(call: PluginCall) {
        if (!enabled) {
            reject(call, "INVALID_STATE", "Plugin is disabled")
            return
        }

        if (status != "idle") {
            reject(call, "INVALID_STATE", "Plugin can only start from idle")
            return
        }

        ensureMicrophonePermission(call) {
            setStatus("running")
            call.resolve()
        }
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        if (status != "running") {
            reject(call, "INVALID_STATE", "Plugin can only stop from running")
            return
        }

        setStatus("idle")
        call.resolve()
    }

    @PluginMethod
    fun reset(call: PluginCall) {
        setStatus("init")
        enabled = true
        debug = false
        setStatus("idle")
        call.resolve()
    }

    @PluginMethod
    override fun checkPermissions(call: PluginCall) {
        call.resolve(checkPermissionsInternal())
    }

    @PluginMethod
    override fun requestPermissions(call: PluginCall) {
        val requested = call.getArray("permissions")
        val permissions = mutableListOf<String>()

        if (requested == null) {
            permissions.add(MICROPHONE)
        } else {
            for (index in 0 until requested.length()) {
                val permission = requested.optString(index)
                if (permission != MICROPHONE) {
                    reject(call, "INVALID_ARGUMENT", "Unsupported permission request")
                    return
                }
                permissions.add(permission)
            }
        }

        if (permissions.isEmpty()) {
            call.resolve(checkPermissionsInternal())
            return
        }

        pendingCall = call
        requestPermissionForAlias(MICROPHONE, call, "permissionCallback")
    }

    @PermissionCallback
    private fun permissionCallback(call: PluginCall) {
        val status = checkPermissionsInternal()
        if (status.getString(MICROPHONE) == "granted") {
            pendingAction?.invoke()
            pendingCall?.resolve(status)
        } else {
            pendingCall?.resolve(status)
        }

        pendingAction = null
        pendingCall = null
    }

    private fun ensureMicrophonePermission(call: PluginCall, onGranted: () -> Unit) {
        val status = checkPermissionsInternal()
        if (status.getString(MICROPHONE) == "granted") {
            onGranted()
            return
        }

        pendingAction = onGranted
        saveCall(call)
        pendingCall = call
        requestPermissionForAlias(MICROPHONE, call, "permissionCallback")
    }

    private fun checkPermissionsInternal(): JSObject =
        JSObject().apply {
            put(MICROPHONE, permissionState(MICROPHONE))
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

    private fun defaultOptions(): JSObject = JSObject().put("enabled", true).put("debug", false)

    private fun setStatus(nextStatus: String) {
        if (status == nextStatus) {
            return
        }

        status = nextStatus
        notifyListeners(EVENT_STATUS_CHANGE, JSObject().put("status", nextStatus))
    }

    private fun reject(call: PluginCall, code: String, message: String) {
        call.reject(message, code, JSObject())
    }
}
