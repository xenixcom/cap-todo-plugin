import { TodoWeb } from '../../src/web';

type PermissionStateValue = 'prompt' | 'granted' | 'denied';

type PermissionNameValue = PermissionName | 'microphone';

type PermissionQueryResult = {
  state: PermissionStateValue;
};

type TestNavigator = Navigator & {
  permissions?: {
    query: (descriptor: { name: PermissionNameValue }) => Promise<PermissionQueryResult>;
  };
  mediaDevices?: {
    getUserMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
  };
};

class MockMediaStreamTrack implements MediaStreamTrack {
  enabled = true;
  id = 'mock-track';
  kind = 'audio';
  label = 'mock-track';
  muted = false;
  onended: ((this: MediaStreamTrack, ev: Event) => any) | null = null;
  onmute: ((this: MediaStreamTrack, ev: Event) => any) | null = null;
  onunmute: ((this: MediaStreamTrack, ev: Event) => any) | null = null;
  readyState: MediaStreamTrackState = 'live';

  addEventListener(): void {}
  removeEventListener(): void {}
  dispatchEvent(): boolean {
    return true;
  }
  applyConstraints(): Promise<void> {
    return Promise.resolve();
  }
  clone(): MediaStreamTrack {
    return new MockMediaStreamTrack();
  }
  getCapabilities(): MediaTrackCapabilities {
    return {};
  }
  getConstraints(): MediaTrackConstraints {
    return {};
  }
  getSettings(): MediaTrackSettings {
    return {};
  }
  stop(): void {
    this.readyState = 'ended';
  }
}

class MockMediaStream implements MediaStream {
  active = true;
  id = 'mock-stream';
  onaddtrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => any) | null = null;
  onremovetrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => any) | null = null;

  addEventListener(): void {}
  removeEventListener(): void {}
  dispatchEvent(): boolean {
    return true;
  }
  addTrack(): void {}
  clone(): MediaStream {
    return new MockMediaStream();
  }
  getAudioTracks(): MediaStreamTrack[] {
    return [new MockMediaStreamTrack()];
  }
  getTrackById(): MediaStreamTrack | null {
    return null;
  }
  getTracks(): MediaStreamTrack[] {
    return [new MockMediaStreamTrack()];
  }
  getVideoTracks(): MediaStreamTrack[] {
    return [];
  }
  removeTrack(): void {}
}

export interface WebContractFixture {
  plugin: TodoWeb;
  permissionState: PermissionStateValue;
  permissionQueries: string[];
  getUserMediaCalls: number;
  supportsGetUserMedia: boolean;
}

export interface PrepareWebFixtureOptions {
  permissionState?: PermissionStateValue;
  supportsGetUserMedia?: boolean;
  removeListeners?: boolean;
}

export function createWebContractFixture(
  initialPermission: PermissionStateValue = 'granted',
): WebContractFixture {
  const navigatorObject = globalThis.navigator as TestNavigator;

  const permissionQueries: string[] = [];
  let permissionState = initialPermission;
  let getUserMediaCalls = 0;
  let supportsGetUserMedia = true;

  navigatorObject.permissions = {
    query: async ({ name }) => {
      permissionQueries.push(name);
      return { state: permissionState };
    },
  };

  const mediaDevices = {
    getUserMedia: async () => {
      getUserMediaCalls += 1;
      permissionState = 'granted';
      return new MockMediaStream();
    },
  };

  Object.defineProperty(navigatorObject, 'mediaDevices', {
    configurable: true,
    get() {
      return supportsGetUserMedia ? mediaDevices : undefined;
    },
  });

  const plugin = new TodoWeb();

  return {
    plugin,
    permissionQueries,
    get getUserMediaCalls() {
      return getUserMediaCalls;
    },
    get supportsGetUserMedia() {
      return supportsGetUserMedia;
    },
    set supportsGetUserMedia(nextValue: boolean) {
      supportsGetUserMedia = nextValue;
    },
    get permissionState() {
      return permissionState;
    },
    set permissionState(nextState: PermissionStateValue) {
      permissionState = nextState;
    },
  };
}

export async function prepareWebContractFixture(
  fixture: WebContractFixture,
  options: PrepareWebFixtureOptions = {},
): Promise<void> {
  await fixture.plugin.reset();

  fixture.permissionState = options.permissionState ?? 'granted';
  fixture.supportsGetUserMedia = options.supportsGetUserMedia ?? true;

  if (options.removeListeners ?? true) {
    await fixture.plugin.removeAllListeners();
  }
}
