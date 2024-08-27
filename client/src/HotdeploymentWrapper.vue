<script setup lang="ts">

import type {Identity} from "@/Identity";
import {Starter} from "@/Starter";

let app : Identity = await Starter.createFromUrl();
let html = app.ui_js.uiElement();

while (document.body.children.length > 0) {
    document.body.removeChild(document.body.children.item(0));
}
document.body.appendChild(html);

</script>

<template>
</template>

<style scoped>
</style>