<script setup lang="ts">

import {ref} from "vue";

const hasBody = ref(true);
const showBody = ref(true);

function toggleBodyVisibility() {
  showBody.value = !showBody.value;
}
function rightClick() {
  console.log('not implemented yet');
}
</script>

<template>
  <div class="semsObject">
    <div @click="toggleBodyVisibility" @contextmenu.prevent="rightClick" style="cursor: pointer">
      <div style="display: inline-block ; max-width: 20rem">
        <slot name="head"></slot>
      </div>
      <span v-if="hasBody && !showBody"> [...]</span>
    </div>
    <div v-if="showBody" class="details">
      <slot name="details"></slot>
    </div>
  </div>
</template>

<style scoped>

.details {
  margin-left: 1rem;
}

</style>