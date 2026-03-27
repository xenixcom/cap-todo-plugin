import type { PermissionState } from '@capacitor/core';
import { PluginListenerHandle } from "@capacitor/core";

// ------------------------------------------------------------
// MARK: - Permissions
// ------------------------------------------------------------

export type TodoPermissionState = PermissionState | 'limited';

export type TodoPermissionType = 'microphone' | 'camera' | 'photos';

export interface TodoPermissionStatus {
  microphone: TodoPermissionState;
  camera: TodoPermissionState;
  photos: TodoPermissionState;
}

export interface TodoPermissions {
  permissions: TodoPermissionType[];
}

// ------------------------------------------------------------
// MARK: - Results
// ------------------------------------------------------------

export interface TimeResult {
  time: string;
  status?: string;
}

// ------------------------------------------------------------
// MARK: - TodoPlugin
// ------------------------------------------------------------

export interface TodoPlugin {

  checkPermissions(): Promise<TodoPermissionStatus>;
  requestPermissions(permissions?: TodoPermissions): Promise<TodoPermissionStatus>;

  echo(options: { value: string }): Promise<{ value: string }>;
  startRecording(): Promise<void>;
  stopRecording(): Promise<void>;
  takePhoto(): Promise<void>;

  addListener(
    eventName: 'updateTime',
    listenerFunc: (data: TimeResult) => void
  ): Promise<PluginListenerHandle>;

  removeAllListeners(): Promise<void>;

}
