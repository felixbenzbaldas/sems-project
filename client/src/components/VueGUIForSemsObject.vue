<script setup lang="ts">
import {ref} from "vue";
import {RemoteObject} from "@/core/RemoteObject";
const props = defineProps<{
  object: RemoteObject
}>();
const hasBody = ref(false);
const showBody = ref(false);

function saveChanges(event : any) {
  props.object.setText(event.target.innerText.trim());
}

</script>

<template>
  <div class="semsObject">
    <div style="display: inline-block ; max-width: 20rem">
      <div class="contentEditableDiv" contenteditable @blur="saveChanges">{{ props.object.getText() }}</div>
    </div>
    <span v-if="hasBody && !showBody"> [...]</span>
    <div v-if="showBody" class="details">
    </div>
  </div>
</template>

<style scoped>

.contentEditableDiv {
  min-height: 1rem;
  min-width: 1rem;
  background-color: antiquewhite;
}

.details {
  margin-left: 1rem;
}

</style>