<script setup lang="ts">

import {Starter} from "@/Starter";

async function init() {
    let html = await Starter.start();
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