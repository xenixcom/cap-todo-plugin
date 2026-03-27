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
        <ion-input label="Input:" placeholder="Enter text" v-model="inputValue"></ion-input>
        <ion-button class="ion-no-margin" expand="block" @click="testPlugin">Test Plugin</ion-button>
        <p>Result: {{ result }}</p>
        <p>Update: {{ updateTime }}</p>
      </div>

      <div class="ion-padding">
        <ion-button class="ion-margin-vertical" expand="block" @click="checkPermissions">Check Permissions</ion-button>
        <ion-button class="ion-margin-vertical" expand="block" @click="requestPermissions">Request Permissions</ion-button>
      </div>

      <div class="ion-padding">
        <ion-button class="ion-margin-vertical" expand="block" @click="startRecording">Start Recording</ion-button>
        <ion-button class="ion-margin-vertical" expand="block" @click="stopRecording">Stop Recording</ion-button>
        <ion-button class="ion-margin-vertical" expand="block" @click="takePhoto">Take Photo</ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { Todo } from '@xenix/cap-todo-plugin';

const inputValue = ref<string>('Hello World')
const result = ref<string>('')
const updateTime = ref<string>('')

const testPlugin = async () => {
  const res = await Todo.echo({ value: inputValue.value })
  result.value = res.value
}

const checkPermissions = async () => {
  const res = await Todo.checkPermissions()
  console.log('[APP]', 'Permission status:', JSON.stringify(res, null, 2));
}

const requestPermissions = async () => {
  const res = await Todo.requestPermissions({ permissions: ['microphone', 'camera', 'photos'] })
  console.log('[APP]', 'Requested permissions result:', JSON.stringify(res, null, 2));
}

const startRecording = async () => {
  await Todo.startRecording()
}

const stopRecording = async () => {
  await Todo.stopRecording()
}

const takePhoto = async () => {
  await Todo.takePhoto()
}

onMounted(() => {
  Todo.addListener('updateTime', (data: { time: string, status?: string }) => {
    console.log('[APP]', `Received updateTime event: ${data.time}, ${data.status}`);
    updateTime.value = `${data.time}, ${data.status}`;
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
