<script setup lang="ts">

import type {Entity} from "@/Entity";
import {Starter} from "@/Starter";

async function init() {
    let app : Entity = await Starter.createFromUrl();
    let html = app.uiG.uiElement;
    while (document.body.children.length > 0) {
        document.body.removeChild(document.body.children.item(0));
    }
    document.body.appendChild(html);
    await app.update();
}

init();

</script>

<template>
</template>

<style scoped>
</style>