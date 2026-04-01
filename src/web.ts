import { WebPlugin } from '@capacitor/core';
import type {
  EchoOptions,
  EchoResult,
  PermissionRequestOptions,
  PluginAvailabilityResult,
  PluginOptions,
  PluginPermissionState,
  PluginPermissionStatus,
  PluginStatus,
  StatusResult,
  TodoPlugin,
} from './definitions';

export class TodoWeb extends WebPlugin implements TodoPlugin {
  private options: PluginOptions = {
    enabled: true,
    debug: false,
  };

  private status: PluginStatus = 'idle';

  async getStatus(): Promise<StatusResult> {
    return { status: this.status };
  }

  async getOptions(): Promise<PluginOptions> {
    return { ...this.options };
  }

  async setOptions(options: Partial<PluginOptions>): Promise<void> {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  async resetOptions(): Promise<void> {
    this.options = {
      enabled: true,
      debug: false,
    };
  }

  async start(): Promise<void> {
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

  async stop(): Promise<void> {
    if (this.status !== 'running') {
      throw this.createPluginError('INVALID_STATE', 'Plugin can only stop from running');
    }

    this.setStatus('idle');
  }

  async reset(): Promise<void> {
    this.setStatus('init');
    await this.resetOptions();
    this.setStatus('idle');
  }

  async checkPermissions(): Promise<PluginPermissionStatus> {
    return this.checkPermissionsInternal();
  }

  async getAvailability(): Promise<PluginAvailabilityResult> {
    return {
      supported: Boolean(navigator.mediaDevices?.getUserMedia),
      enabled: this.options.enabled,
    };
  }

  async requestPermissions(options?: PermissionRequestOptions): Promise<PluginPermissionStatus> {
    const permissions = options?.permissions ?? ['microphone'];
    if (permissions.length === 0) {
      return this.checkPermissions();
    }

    if (permissions.some((permission) => permission !== 'microphone')) {
      throw this.createPluginError('INVALID_ARGUMENT', 'Unsupported permission request');
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw this.createPluginError('UNSUPPORTED_PLATFORM', 'Microphone request is not supported');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      for (const track of stream.getTracks()) {
        track.stop();
      }
    } catch {
      // Let the unified permission mapping decide whether this becomes prompt or denied.
    }

    return this.checkPermissionsInternal();
  }

  async echo(options: EchoOptions): Promise<EchoResult> {
    return { value: options.value };
  }

  private setStatus(nextStatus: PluginStatus): void {
    if (this.status === nextStatus) {
      return;
    }

    this.status = nextStatus;
    this.notifyListeners('statusChange', { status: nextStatus });
  }

  private createPluginError(code: string, message: string): Error & { code: string } {
    const error = new Error(message) as Error & { code: string };
    error.code = code;
    return error;
  }

  private async checkPermissionsInternal(): Promise<PluginPermissionStatus> {
    const query = async (name: PermissionName): Promise<PluginPermissionState> => {
      try {
        const status = await navigator.permissions.query({ name });
        if (status.state === 'granted') {
          return 'granted';
        }
        if (status.state === 'denied') {
          return 'denied';
        }
        return 'prompt';
      } catch {
        return 'prompt';
      }
    };

    return {
      microphone: await query('microphone'),
    };
  }
}
