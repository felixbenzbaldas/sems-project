<script setup lang="ts">

import {ref} from "vue";

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
    <div class='head' @click="toggleBodyVisibility" @contextmenu.prevent="rightClick" style="cursor: pointer">
      <div style="display: inline-block ; max-width: 20rem;">
        <slot name="head"></slot>
      </div>
      <div style="display: inline-block; cursor: pointer;">
        <span v-if="$slots.body && showBody">  _</span>
        <span v-if="$slots.body && !showBody"> [...]</span>
      </div>
    </div>
    <div v-if="$slots.body && showBody" class="body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<style scoped>

.body {
  margin-left: 1rem;
  margin-top: 0.2rem;
}

</style>