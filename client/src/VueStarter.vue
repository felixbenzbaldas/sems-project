<script setup lang="ts">

import {StarterA} from "@/StarterA";

async function init() {
    let html = await StarterA.start();
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