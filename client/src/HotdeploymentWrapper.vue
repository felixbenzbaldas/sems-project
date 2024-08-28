<script setup lang="ts">

import type {Identity} from "@/Identity";
import {Starter} from "@/Starter";

async function init() {
    let app : Identity = await Starter.createFromUrl();
    let html = app.ui_js.lazy_uiElement();

    while (document.body.children.length > 0) {
        document.body.removeChild(document.body.children.item(0));
    }
    document.body.appendChild(html);

    await app.ui_js.asyncUpdate();
}

init();

</script>

<template>
</template>

<style scoped>
</style>