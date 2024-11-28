<script setup lang="ts">

import {Environment} from "@/Environment";
import {clearElement} from "@/utils";

const body = document.body;

async function init() {
    let html = await Environment.create().createApp().appA.createStarter().fullStart();
    clearElement(body);
    body.appendChild(html);
}

init();

</script>

<template>
</template>

<style scoped>
</style>