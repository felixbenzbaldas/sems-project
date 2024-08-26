<script setup lang="ts">

import type {Identity} from "@/Identity";
import {Starter} from "@/Starter";
import {type Ref, ref} from "vue";

const app : Ref<Identity> = ref();

async function init() {
    let queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has('local')) {
        app.value = Starter.createAppWithUIWithCommands();
    } else if (queryParams.has('client-app')) {
        app.value = Starter.createAppWithUIWithCommands();
    } else {
        app.value = await Starter.createWebsite();
    }
}

init();

</script>

<template>
    <VueUI v-if="app" :identity="app" />
</template>

<style scoped>
</style>