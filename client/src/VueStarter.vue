<script setup lang="ts">

import {Environment} from "@/Environment";

async function init() {
    let html = await Environment.create().createApp().appA.createStarter().fullStart();
    document.body.innerHTML = null;
    document.body.appendChild(html);
}

init();

</script>

<template>
</template>

<style scoped>
</style>