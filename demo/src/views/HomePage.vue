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

      <div class="ion-padding">
        <ion-input label="Echo Input" placeholder="Enter text" v-model="inputValue"></ion-input>
        <ion-button class="ion-no-margin" expand="block" @click="runEcho">Run Echo</ion-button>
        <p>Echo Result: {{ echoResult }}</p>
      </div>

      <div class="ion-padding">
        <ion-button class="ion-margin-vertical" expand="block" @click="readStatus">Get Status</ion-button>
        <ion-button class="ion-margin-vertical" expand="block" @click="readOptions">Get Options</ion-button>
        <ion-button class="ion-margin-vertical" expand="block" @click="enableDebug">Set Debug = true</ion-button>
        <ion-button class="ion-margin-vertical" expand="block" @click="resetOptions">Reset Options</ion-button>
        <p>Status: {{ statusText }}</p>
        <p>Options: {{ optionsText }}</p>
        <p>Last statusChange: {{ lastStatusEvent }}</p>
      </div>

      <div class="ion-padding">
        <ion-button class="ion-margin-vertical" expand="block" @click="checkPermissions">Check Permissions</ion-button>
        <ion-button class="ion-margin-vertical" expand="block" @click="requestPermissions">Request Permissions</ion-button>
        <p>Permissions: {{ permissionText }}</p>
      </div>

      <div class="ion-padding">
        <ion-button class="ion-margin-vertical" expand="block" @click="startPlugin">Start</ion-button>
        <ion-button class="ion-margin-vertical" expand="block" @click="stopPlugin">Stop</ion-button>
        <ion-button class="ion-margin-vertical" expand="block" @click="resetPlugin">Reset</ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { Todo } from '@xenix/cap-todo-plugin';

const inputValue = ref<string>('Hello World')
const echoResult = ref<string>('')
const statusText = ref<string>('unknown')
const optionsText = ref<string>('unknown')
const permissionText = ref<string>('unknown')
const lastStatusEvent = ref<string>('none')

const runEcho = async () => {
  const res = await Todo.echo({ value: inputValue.value })
  echoResult.value = res.value
}

const readStatus = async () => {
  const res = await Todo.getStatus()
  statusText.value = res.status
}

const readOptions = async () => {
  const res = await Todo.getOptions()
  optionsText.value = JSON.stringify(res)
}

const enableDebug = async () => {
  await Todo.setOptions({ debug: true })
  await readOptions()
}

const resetOptions = async () => {
  await Todo.resetOptions()
  await readOptions()
}

const checkPermissions = async () => {
  const res = await Todo.checkPermissions()
  permissionText.value = JSON.stringify(res)
  console.log('[APP]', 'Permission status:', JSON.stringify(res, null, 2));
}

const requestPermissions = async () => {
  const res = await Todo.requestPermissions({ permissions: ['microphone'] })
  permissionText.value = JSON.stringify(res)
  console.log('[APP]', 'Requested permissions result:', JSON.stringify(res, null, 2));
}

const startPlugin = async () => {
  await Todo.start()
  await readStatus()
}

const stopPlugin = async () => {
  await Todo.stop()
  await readStatus()
}

const resetPlugin = async () => {
  await Todo.reset()
  await readStatus()
  await readOptions()
}

onMounted(() => {
  void readStatus();
  void readOptions();
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
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
