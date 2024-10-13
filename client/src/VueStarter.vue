<script setup lang="ts">

import {Environment} from "@/Environment";

async function init() {
    let html = await Environment.create().createApp().appA.createStarter().fullStart();
    while (document.body.children.length > 0) {
        document.body.removeChild(document.body.children.item(0));
    }
    document.body.appendChild(html);
}

init();

</script>

<template>
</template>

<style scoped>
</style>