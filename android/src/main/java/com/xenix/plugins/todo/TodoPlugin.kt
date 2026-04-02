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

    private val core = TodoCore()

    override fun load() {
        core.onStatusChange = { nextStatus ->
            notifyListeners(EVENT_STATUS_CHANGE, JSObject().put("status", nextStatus))
        }
    }

    @PluginMethod
    fun getStatus(call: PluginCall) {
        call.resolve(JSObject().put("status", core.getStatus().status))
    }

    @PluginMethod
    fun getOptions(call: PluginCall) {
        val options = core.getOptions()
        call.resolve(defaultOptions().put("enabled", options.enabled).put("debug", options.debug))
    }

    @PluginMethod
    fun setOptions(call: PluginCall) {
        val nextEnabled = if (call.data.has("enabled")) call.getBoolean("enabled") else null
        val nextDebug = if (call.data.has("debug")) call.getBoolean("debug") else null
        core.setOptions(enabled = nextEnabled, debug = nextDebug)
        call.resolve()
    }

    @PluginMethod
    fun resetOptions(call: PluginCall) {
        core.resetOptions()
        call.resolve()
    }

    @PluginMethod
    fun echo(call: PluginCall) {
        call.resolve(JSObject().put("value", core.echo(call.getString("value") ?: "").value))
    }

    @PluginMethod
    fun start(call: PluginCall) {
        try {
            core.start(checkPermissionsInternal().getString(MICROPHONE) ?: "denied")
            call.resolve()
        } catch (error: TodoCoreException) {
            reject(call, error.code, error.message)
        }
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        try {
            core.stop()
            call.resolve()
        } catch (error: TodoCoreException) {
            reject(call, error.code, error.message)
        }
    }

    @PluginMethod
    fun reset(call: PluginCall) {
        core.reset()
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

        requestPermissionForAlias(MICROPHONE, call, "permissionCallback")
    }

    @PermissionCallback
    private fun permissionCallback(call: PluginCall) {
        call.resolve(checkPermissionsInternal())
    }

    private fun checkPermissionsInternal(): JSObject =
        JSObject().apply {
            put(MICROPHONE, permissionState(MICROPHONE))
        }

    private fun permissionState(alias: String): String =
        when (
            (
                if (isPermissionDeclared(alias)) super.getPermissionState(alias)
                else PermissionState.GRANTED
            ) ?: PermissionState.PROMPT
        ) {
            PermissionState.GRANTED -> "granted"
            PermissionState.DENIED -> "denied"
            PermissionState.PROMPT,
            PermissionState.PROMPT_WITH_RATIONALE -> "prompt"
        }

    private fun defaultOptions(): JSObject = JSObject().put("enabled", true).put("debug", false)

    private fun reject(call: PluginCall, code: String, message: String) {
        call.reject(message, code, JSObject())
    }
}
