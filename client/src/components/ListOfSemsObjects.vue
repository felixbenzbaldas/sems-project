<script setup lang="ts">
import {ref} from "vue";
import {RemoteObject} from "@/core/RemoteObject";
import type {ObservableList} from "@/core/ObservableList";
const props = defineProps<{
  list: ObservableList<RemoteObject>;
}>();

const listObject = ref([]);

function updateListObject() {
  listObject.value = props.list.createCopyOfList();
}
props.list.subject.subscribe(next => {
  updateListObject();
});

updateListObject();

</script>

<template>
  <VueGUIForSemsObject style="margin: 0.5rem" v-for="obj in listObject" :object="obj"/><!-- TODO: :key verwenden  -->
</template>

<style scoped>
</style>