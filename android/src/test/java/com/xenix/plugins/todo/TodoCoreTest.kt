package com.xenix.plugins.todo

import org.junit.Assert.assertEquals
import org.junit.Assert.fail
import org.junit.Test

class TodoCoreTest {

    @Test
    fun defaultOptionsAndStatusMatchContract() {
        val core = TodoCore()

        assertEquals(TodoOptions(enabled = true, debug = false), core.getOptions())
        assertEquals(TodoStatusResult(status = "idle"), core.getStatus())
    }

    @Test
    fun setOptionsOnlyUpdatesProvidedFields() {
        val core = TodoCore()

        core.setOptions(enabled = null, debug = true)

        assertEquals(TodoOptions(enabled = true, debug = true), core.getOptions())
    }

    @Test
    fun resetOptionsDoesNotChangeStatus() {
        val core = TodoCore()
        core.start("granted")

        core.setOptions(enabled = false, debug = true)
        core.resetOptions()

        assertEquals(TodoOptions(enabled = true, debug = false), core.getOptions())
        assertEquals(TodoStatusResult(status = "running"), core.getStatus())
    }

    @Test
    fun lifecycleTransitionsMatchContract() {
        val core = TodoCore()

        core.start("granted")
        assertEquals(TodoStatusResult(status = "running"), core.getStatus())

        core.stop()
        assertEquals(TodoStatusResult(status = "idle"), core.getStatus())
    }

    @Test
    fun resetEmitsInitThenIdleAndResetsOptions() {
        val core = TodoCore()
        val statuses = mutableListOf<String>()
        core.onStatusChange = { statuses.add(it) }

        core.start("granted")
        core.setOptions(enabled = false, debug = true)
        core.reset()

        assertEquals(listOf("running", "init", "idle"), statuses)
        assertEquals(TodoOptions(enabled = true, debug = false), core.getOptions())
        assertEquals(TodoStatusResult(status = "idle"), core.getStatus())
    }

    @Test
    fun startRejectsWhenDisabled() {
        val core = TodoCore()
        core.setOptions(enabled = false, debug = null)

        try {
            core.start("granted")
            fail("Expected INVALID_STATE")
        } catch (error: TodoCoreException) {
            assertEquals("INVALID_STATE", error.code)
            assertEquals("Plugin is disabled", error.message)
        }
    }

    @Test
    fun startRejectsWhenPermissionDenied() {
        val core = TodoCore()

        try {
            core.start("denied")
            fail("Expected PERMISSION_DENIED")
        } catch (error: TodoCoreException) {
            assertEquals("PERMISSION_DENIED", error.code)
            assertEquals("Microphone permission is required", error.message)
        }
    }

    @Test
    fun stopRejectsOutsideRunningState() {
        val core = TodoCore()

        try {
            core.stop()
            fail("Expected INVALID_STATE")
        } catch (error: TodoCoreException) {
            assertEquals("INVALID_STATE", error.code)
            assertEquals("Plugin can only stop from running", error.message)
        }
    }

    @Test
    fun echoReturnsValueUnchanged() {
        val core = TodoCore()

        assertEquals(TodoEchoResult("Hello, World!"), core.echo("Hello, World!"))
    }
}
