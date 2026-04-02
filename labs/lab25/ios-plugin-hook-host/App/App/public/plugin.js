var capacitorTodo = (function (exports, core) {
    'use strict';

    const Todo = core.registerPlugin('Todo', {
        web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.TodoWeb()),
    });

    class TodoWeb extends core.WebPlugin {
        constructor() {
            super(...arguments);
            this.options = {
                enabled: true,
                debug: false,
            };
            this.status = 'idle';
            this.activeSessionId = null;
        }
        async getStatus() {
            return { status: this.status };
        }
        async getOptions() {
            return Object.assign({}, this.options);
        }
        async setOptions(options) {
            this.options = Object.assign(Object.assign({}, this.options), options);
        }
        async resetOptions() {
            this.options = {
                enabled: true,
                debug: false,
            };
        }
        async start() {
            if (!this.options.enabled) {
                throw this.createPluginError('INVALID_STATE', 'Plugin is disabled');
            }
            if (this.status !== 'idle') {
                throw this.createPluginError('INVALID_STATE', 'Plugin can only start from idle');
            }
            const permissions = await this.checkPermissions();
            if (permissions.microphone !== 'granted') {
                throw this.createPluginError('PERMISSION_DENIED', 'Microphone permission is required');
            }
            this.setStatus('running');
        }
        async openSession() {
            if (this.activeSessionId) {
                throw this.createPluginError('INVALID_STATE', 'Session already active');
            }
            await this.start();
            this.activeSessionId = 'session-1';
            return { sessionId: this.activeSessionId };
        }
        async stop() {
            if (this.status !== 'running') {
                throw this.createPluginError('INVALID_STATE', 'Plugin can only stop from running');
            }
            this.setStatus('idle');
        }
        async closeSession(sessionId) {
            if (!this.activeSessionId || sessionId !== this.activeSessionId) {
                throw this.createPluginError('INVALID_ARGUMENT', 'Unknown session token');
            }
            this.activeSessionId = null;
            await this.stop();
        }
        async reset() {
            this.setStatus('init');
            this.activeSessionId = null;
            await this.resetOptions();
            this.setStatus('idle');
        }
        async checkPermissions() {
            return this.checkPermissionsInternal();
        }
        async getAvailability() {
            var _a;
            return {
                supported: Boolean((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia),
                enabled: this.options.enabled,
            };
        }
        async requestPermissions(options) {
            var _a, _b;
            const permissions = (_a = options === null || options === void 0 ? void 0 : options.permissions) !== null && _a !== void 0 ? _a : ['microphone'];
            if (permissions.length === 0) {
                return this.checkPermissions();
            }
            if (permissions.some((permission) => permission !== 'microphone')) {
                throw this.createPluginError('INVALID_ARGUMENT', 'Unsupported permission request');
            }
            if (!((_b = navigator.mediaDevices) === null || _b === void 0 ? void 0 : _b.getUserMedia)) {
                throw this.createPluginError('UNSUPPORTED_PLATFORM', 'Microphone request is not supported');
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                for (const track of stream.getTracks()) {
                    track.stop();
                }
            }
            catch (_c) {
                // Let the unified permission mapping decide whether this becomes prompt or denied.
            }
            return this.checkPermissionsInternal();
        }
        async echo(options) {
            return { value: options.value };
        }
        setStatus(nextStatus) {
            if (this.status === nextStatus) {
                return;
            }
            this.status = nextStatus;
            this.notifyListeners('statusChange', { status: nextStatus });
        }
        createPluginError(code, message) {
            const error = new Error(message);
            error.code = code;
            return error;
        }
        async checkPermissionsInternal() {
            const query = async (name) => {
                try {
                    const status = await navigator.permissions.query({ name });
                    if (status.state === 'granted') {
                        return 'granted';
                    }
                    if (status.state === 'denied') {
                        return 'denied';
                    }
                    return 'prompt';
                }
                catch (_a) {
                    return 'prompt';
                }
            };
            return {
                microphone: await query('microphone'),
            };
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        TodoWeb: TodoWeb
    });

    exports.Todo = Todo;

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
