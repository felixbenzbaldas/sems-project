<script setup lang="ts">

import type {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import {type Ref, ref} from "vue";
import vue from "@vitejs/plugin-vue";

let app : Identity = await Starter.createFromUrl();
let html = app.ui_js.getUi();

while (document.body.children.length > 0) {
    document.body.removeChild(document.body.children.item(0));
}
document.body.appendChild(html);


// the following is deprecated and will be deleted

// const app : Ref<Identity> = ref();

// async function init() {
//     let queryParams = new URLSearchParams(window.location.search);
//     if (queryParams.has('local')) {
//         app.value = Starter.createAppWithUIWithCommands();
//     } else if (queryParams.has('client-app')) {
//         app.value = Starter.createAppWithUIWithCommands();
//     } else {
//         app.value = await Starter.createWebsite();
//     }
// }
//
// init();

</script>

<template>
<!--    <VueUI v-if="app" :identity="app" />-->
</template>

<style scoped>
</style>