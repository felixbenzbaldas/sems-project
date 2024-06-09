<script setup lang="ts">
import Heading from './components/Heading.vue'
import {type Ref, ref} from "vue";
import Item from "@/components/Item.vue";
import type {RemoteObject} from "@/core/RemoteObject";
import {App} from "@/core/App";
import {configuration} from "@/core/configuration";
import VueGUIForSemsObject from "@/components/VueGUIForSemsObject.vue";


let app = new App(configuration);
const mySemsObjects : Ref<Array<RemoteObject>> = ref([]);

getObjectsInWorkingPlace();

async function getObjectsInWorkingPlace() {
  await app.getObjectsInWorkingPlace().then(listOfObjects => {
    listOfObjects.forEach(object => {
      mySemsObjects.value.push(object);
    });
  });
}

function createObjectInWorkingPlace() : Promise<RemoteObject> {
  return app.createObjectInWorkingPlace();
}

 async function clearWorkingSpace() {
  await app.clearWorkingSpace();
  mySemsObjects.value = [];
}

async function newSubitem() {
  await createObjectInWorkingPlace().then(object => {
    mySemsObjects.value.push(object);
  });
}

</script>

<template>
  <div>
    <a href="https://github.com/felixbenzbaldas/sems-project" target="_blank" rel="noopener"><Heading msg="Sems"/></a>
  </div>
  <Item>
    <template #head>commands</template>
    <template #details>
      <button @click="newSubitem">new subitem</button>
      <button @click="clearWorkingSpace">clear working space</button>
    </template>
  </Item>
  <div style="border: solid; min-height: 25rem; margin: 0.2rem; padding: 1rem">
    <VueGUIForSemsObject v-for="obj in mySemsObjects" :object="obj" /><!-- TODO: :key verwenden  -->
  </div>
</template>

<style scoped>
</style>
