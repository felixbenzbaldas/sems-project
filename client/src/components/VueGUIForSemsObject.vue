<script setup lang="ts">
import {ref} from "vue";
import {RemoteObject} from "@/core/RemoteObject";
import ListOfSemsObjects from "@/components/ListOfSemsObjects.vue";
import HeadBody from "@/components/HeadBody.vue";
const props = defineProps<{
  object: RemoteObject
}>();

const hasBody = ref(false);

function updateHasBody() {
  hasBody.value = !props.object.getDetails().isEmpty();
}

updateHasBody();

props.object.getDetails().subject.subscribe(next => {
  updateHasBody();
});

function saveChanges(event : any) {
  props.object.setText(event.target.innerText.trim());
}

</script>

<template>
  <HeadBody>
    <template #head>
      <div style="display: inline-block ; max-width: 20rem">
        <div @click="$event.stopPropagation()" class="contentEditableDiv" contenteditable @blur="saveChanges">{{ props.object.getText() }}</div>
      </div>
    </template>
    <template v-if="hasBody" #body>
      <ListOfSemsObjects :list="props.object.getDetails()"/>
    </template>
  </HeadBody>
</template>

<style scoped>

.contentEditableDiv {
  min-height: 1rem;
  min-width: 1rem;
  background-color: antiquewhite;
}

</style>