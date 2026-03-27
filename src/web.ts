import { WebPlugin } from '@capacitor/core';
import type {
  TodoPlugin,
  TodoPermissionState,
  TodoPermissionStatus,
  TodoPermissions,
} from './definitions';

import { Todo } from './todo';

export class TodoWeb extends WebPlugin implements TodoPlugin {

  private implementation = new Todo();

  // --------------------------------------------------
  // MARK: - Lifecycle
  // --------------------------------------------------

  constructor() {
    super();
    this.implementation.onNotify = (eventName, data) => {
      this.notifyListeners(eventName, data as any);
    };
  }

  // --------------------------------------------------
  // MARK: - Actions
  // --------------------------------------------------

  async echo(options: { value: string }): Promise<{ value: string }> {
    return { value: await this.implementation.echo(options.value) };
  }

  async startRecording(): Promise<void> {
    console.log('[Todo][Web] startRecording');
    // 真正 request microphone 會在實作時觸發
  }

  async stopRecording(): Promise<void> {
    console.log('[Todo][Web] stopRecording');
  }

  async takePhoto(): Promise<void> {
    console.log('[Todo][Web] takePhoto');
    // 真正 request camera 會在實作時觸發
  }

  async checkPermissions(): Promise<TodoPermissionStatus> {
    return this.checkPermissionsInternal();
  }

  async requestPermissions(_permissions?: TodoPermissions): Promise<TodoPermissionStatus> {
    // Web 無法主動 request，只能回傳當前狀態
    return this.checkPermissionsInternal();
  }

  // --------------------------------------------------
  // MARK: - Permissions Management
  // --------------------------------------------------

  private async checkPermissionsInternal(): Promise<TodoPermissionStatus> {
    const query = async (
      name: PermissionName
    ): Promise<TodoPermissionState> => {
      try {
        const status = await navigator.permissions.query({ name });
        return status.state as TodoPermissionState;
      } catch {
        // Safari / unsupported
        return 'prompt';
      }
    };

    return {
      camera: await query('camera'),
      microphone: await query('microphone'),
      photos: 'granted', // Web 視為永遠可用
    };
  }

}
