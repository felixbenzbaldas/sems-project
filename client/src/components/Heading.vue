<script setup lang="ts">
import IconHeart from "@/components/icons/IconHeart.vue";

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green"><IconHeart/>{{ msg }}<IconHeart/></h1>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

.greetings h1 {
  text-align: center;
}
</style>
