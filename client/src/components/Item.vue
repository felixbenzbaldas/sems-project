<template>
  <div class="item">
    <slot name="head"></slot>
    <div class="details">
      <slot name="details"></slot>
    </div>
  </div>
</template>

<style scoped>

.item {
}

.details {
  margin-left: 1rem;
}

.unused {
  flex: 1;
  display: flex;
  position: relative;
}

</style>
<script setup lang="ts">
</script>