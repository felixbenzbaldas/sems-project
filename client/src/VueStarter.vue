<script setup lang="ts">

import {Environment} from "@/Environment";

async function init() {
    document.body.innerHTML = null; // necessary for hot-deployment (npm run dev)
    let html = await Environment.create().createApp().createStarter().fullStart();
    document.body.appendChild(html);
}

init();

</script>

<template>
</template>

<style scoped>
</style>