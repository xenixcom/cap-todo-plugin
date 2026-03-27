package com.xenix.plugins.todo;

import com.getcapacitor.JSObject
import com.getcapacitor.Logger

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class Todo {
    // 使用標準 Map，不依賴 JSObject
    var onNotify: ((String, Map<String, Any>) -> Unit)? = null

    fun echo(value: String): String {
        val result = "$value from android"
        Logger.info("[Todo]", "Echo called with: $result")
      
        val data = mapOf(
            "time" to SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date()),
            "status" to "success"
        )

        onNotify?.invoke("updateTime", data)
        return result
    }

    fun startRecording() {
        Logger.info("[Todo]", "startRecording called")
    }

    fun stopRecording() {
        Logger.info("[Todo]", "stopRecording called")
    }

    fun takePhoto() {
        Logger.info("[Todo]", "takePhoto called")
    }
    
}
