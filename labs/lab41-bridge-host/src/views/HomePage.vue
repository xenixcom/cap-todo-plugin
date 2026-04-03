<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>TodoPlugin Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">TodoPlugin Demo</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-shell ion-padding">
        <section class="demo-panel">
          <h2>Overview</h2>
          <p>This page manually exercises the same formal contract used by the plugin pipeline.</p>
          <p>Current status: <strong>{{ statusText }}</strong></p>
          <p>Last statusChange: <strong>{{ lastStatusEvent }}</strong></p>
          <p>Permissions: <strong>{{ permissionText }}</strong></p>
          <p>Options: <strong>{{ optionsText }}</strong></p>
          <p v-if="lastSuccess" class="success-text">Last success: {{ lastSuccess }}</p>
          <p v-if="lastError" class="error-text">Last error: {{ lastError }}</p>
        </section>

        <section class="demo-panel">
          <h2>Echo</h2>
          <ion-input
            label="Echo Input"
            placeholder="Enter text"
            v-model="inputValue"
          ></ion-input>
          <ion-button class="ion-no-margin" expand="block" @click="runEcho">Run Echo</ion-button>
          <p>Echo result: <strong>{{ echoResult }}</strong></p>
        </section>

        <section class="demo-panel">
          <h2>Options</h2>
          <ion-button class="ion-margin-top" expand="block" @click="readOptions">Refresh Options</ion-button>
          <ion-button class="ion-margin-top" expand="block" @click="enableDebug">Set Debug = true</ion-button>
          <ion-button class="ion-margin-top" expand="block" @click="disablePlugin">Set Enabled = false</ion-button>
          <ion-button class="ion-margin-top" expand="block" @click="resetOptions">Reset Options</ion-button>
        </section>

        <section class="demo-panel">
          <h2>Permissions</h2>
          <ion-button class="ion-margin-top" expand="block" @click="checkPermissions">Check Permissions</ion-button>
          <ion-button class="ion-margin-top" expand="block" @click="requestPermissions">Request Permissions</ion-button>
        </section>

        <section class="demo-panel">
          <h2>Lifecycle</h2>
          <ion-button class="ion-margin-top" expand="block" @click="readStatus">Refresh Status</ion-button>
          <ion-button class="ion-margin-top" expand="block" @click="startPlugin">Start</ion-button>
          <ion-button class="ion-margin-top" expand="block" @click="stopPlugin">Stop</ion-button>
          <ion-button class="ion-margin-top" expand="block" @click="resetPlugin">Reset</ion-button>
        </section>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { Todo } from '@xenix/cap-todo-plugin';

const inputValue = ref<string>('Hello World');
const echoResult = ref<string>('');
const statusText = ref<string>('unknown');
const optionsText = ref<string>('unknown');
const permissionText = ref<string>('unknown');
const lastStatusEvent = ref<string>('none');
const lastSuccess = ref<string>('');
const lastError = ref<string>('');

function setSuccess(message: string): void {
  lastSuccess.value = message;
  lastError.value = '';
}

function setError(error: unknown): void {
  const detail =
    typeof error === 'object' && error !== null && 'code' in error && 'message' in error
      ? `${String((error as { code: unknown }).code)}: ${String((error as { message: unknown }).message)}`
      : error instanceof Error
        ? error.message
        : String(error);
  lastError.value = detail;
}

async function syncSnapshot(): Promise<void> {
  const [status, options, permissions] = await Promise.all([
    Todo.getStatus(),
    Todo.getOptions(),
    Todo.checkPermissions(),
  ]);

  statusText.value = status.status;
  optionsText.value = JSON.stringify(options);
  permissionText.value = JSON.stringify(permissions);
}

async function runAction(label: string, action: () => Promise<void>): Promise<void> {
  try {
    await action();
    await syncSnapshot();
    setSuccess(label);
  } catch (error) {
    setError(error);
  }
}

const runEcho = async () =>
  runAction('echo completed', async () => {
    const res = await Todo.echo({ value: inputValue.value });
    echoResult.value = res.value;
  });

const readStatus = async () =>
  runAction('status refreshed', async () => {
    const res = await Todo.getStatus();
    statusText.value = res.status;
  });

const readOptions = async () =>
  runAction('options refreshed', async () => {
    const res = await Todo.getOptions();
    optionsText.value = JSON.stringify(res);
  });

const enableDebug = async () =>
  runAction('debug enabled', async () => {
    await Todo.setOptions({ debug: true });
  });

const disablePlugin = async () =>
  runAction('plugin disabled', async () => {
    await Todo.setOptions({ enabled: false });
  });

const resetOptions = async () =>
  runAction('options reset', async () => {
    await Todo.resetOptions();
  });

const checkPermissions = async () =>
  runAction('permissions checked', async () => {
    const res = await Todo.checkPermissions();
    permissionText.value = JSON.stringify(res);
  });

const requestPermissions = async () =>
  runAction('permissions requested', async () => {
    const res = await Todo.requestPermissions({ permissions: ['microphone'] });
    permissionText.value = JSON.stringify(res);
  });

const startPlugin = async () =>
  runAction('plugin started', async () => {
    await Todo.start();
  });

const stopPlugin = async () =>
  runAction('plugin stopped', async () => {
    await Todo.stop();
  });

const resetPlugin = async () =>
  runAction('plugin reset', async () => {
    await Todo.reset();
  });

onMounted(() => {
  void syncSnapshot();
  Todo.addListener('statusChange', (data: { status: string }) => {
    console.log('[APP]', `Received statusChange event: ${data.status}`);
    lastStatusEvent.value = data.status;
    statusText.value = data.status;
  });
});

onUnmounted(() => {
  Todo.removeAllListeners();
});
</script>

<style scoped>
.demo-shell {
  display: grid;
  gap: 16px;
}

.demo-panel {
  border: 1px solid var(--ion-color-medium-tint);
  border-radius: 12px;
  padding: 16px;
  background: var(--ion-color-light);
}

.demo-panel h2 {
  margin: 0 0 12px;
  font-size: 18px;
}

.demo-panel p {
  margin: 8px 0 0;
}

.success-text {
  color: var(--ion-color-success-shade);
}

.error-text {
  color: var(--ion-color-danger);
}
</style>
