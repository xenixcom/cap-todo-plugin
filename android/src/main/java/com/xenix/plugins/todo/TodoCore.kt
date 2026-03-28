package com.xenix.plugins.todo

data class TodoOptions(
    val enabled: Boolean = true,
    val debug: Boolean = false,
)

data class TodoStatusResult(
    val status: String,
)

data class TodoEchoResult(
    val value: String,
)

class TodoCoreException(
    val code: String,
    override val message: String,
) : Exception(message)

class TodoCore {
    var onStatusChange: ((String) -> Unit)? = null

    private var options = TodoOptions()
    private var status = "idle"

    fun getStatus(): TodoStatusResult = TodoStatusResult(status)

    fun getOptions(): TodoOptions = options

    fun setOptions(enabled: Boolean?, debug: Boolean?) {
        options =
            options.copy(
                enabled = enabled ?: options.enabled,
                debug = debug ?: options.debug,
            )
    }

    fun resetOptions() {
        options = TodoOptions()
    }

    fun echo(value: String): TodoEchoResult = TodoEchoResult(value)

    @Throws(TodoCoreException::class)
    fun start(permissionState: String) {
        if (!options.enabled) {
            throw TodoCoreException("INVALID_STATE", "Plugin is disabled")
        }

        if (status != "idle") {
            throw TodoCoreException("INVALID_STATE", "Plugin can only start from idle")
        }

        if (permissionState != "granted") {
            throw TodoCoreException("PERMISSION_DENIED", "Microphone permission is required")
        }

        setStatus("running")
    }

    @Throws(TodoCoreException::class)
    fun stop() {
        if (status != "running") {
            throw TodoCoreException("INVALID_STATE", "Plugin can only stop from running")
        }

        setStatus("idle")
    }

    fun reset() {
        setStatus("init")
        resetOptions()
        setStatus("idle")
    }

    private fun setStatus(nextStatus: String) {
        if (status == nextStatus) {
            return
        }

        status = nextStatus
        onStatusChange?.invoke(nextStatus)
    }
}
