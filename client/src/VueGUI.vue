<script setup lang="ts">
import Heading from './components/Heading.vue';
import HeadBody from './components/HeadBody.vue';
import type {RemoteObject} from "@/core/RemoteObject";
import {App} from "@/core/App";
import {configuration} from "@/core/configuration";
import {ref} from "vue";


let app = new App(configuration);
app.setFocused('workingPlace');
const workingPlace = ref(undefined);

async function init() {
  workingPlace.value = await app.getObjectsInWorkingPlace();
}

init();

async function newSubitem() {
  if (app.getFocused() === 'workingPlace') {
    await app.createObjectInWorkingPlace().then(object => {
      app.setFocused(object);
    });
  } else {
    let object : RemoteObject = await app.createObject();
    app.getFocused().addDetail(object);
    app.setFocused(object);
  }
}

</script>

<template>
  <div>
    <a href="https://github.com/felixbenzbaldas/sems-project" target="_blank" rel="noopener"><Heading msg="Sems"/></a>
  </div>
  <HeadBody>
    <template #head>commands</template>
    <template #body>
      <div class="flow">
        <button @click="newSubitem">new subitem</button>
        <button v-if="workingPlace" @click="app.clearWorkingPlace()">clear working place</button>
      </div>
    </template>
  </HeadBody>
  <div style="border: solid; min-height: 25rem; margin: 0.2rem; padding: 1rem">
    <div v-if="workingPlace">
      <ListOfSemsObjects :list="workingPlace"/>
    </div>
  </div>
</template>

<style scoped>
.flow {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1rem;
  row-gap: 1rem;
}
</style>
