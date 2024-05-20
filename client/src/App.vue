<script setup lang="ts">
import Heading from './components/Heading.vue'
import {type Ref, ref} from "vue";
import Item from "@/components/Item.vue";
import {HttpImpl} from "@/core/HttpImpl";
import {NewLocation} from "@/core/NewLocation";
import {PathUtil} from "@/core/PathUtil";

const testServer = 'http://localhost:8081/';

let http = new HttpImpl();
let location = new NewLocation(http);
location.setHttpAddress(testServer);

let id=0;

const mySemsObjects : Ref<Array<any>> = ref([
])

function newSubitem() {
  location.createObjectWithText(PathUtil.fromList(['house1']), 'some text').then(object => {
    console.log("done");
    mySemsObjects.value.push({id: id++, text: '' })
    return null;
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
    </template>
  </Item>
  <Item>
    <template #head>house1</template>
    <template #details>
      <Item class="semsObject" v-for="obj in mySemsObjects" :key="obj.id">
        <template #head>
          <input :value="obj.text">
        </template>
      </Item>
    </template>
  </Item>

</template>

<style scoped>
</style>
