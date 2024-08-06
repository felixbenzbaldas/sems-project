<script setup lang="ts">

import type {Identity} from "@/restart-with-aspects/Identity";
import {Starter} from "@/restart-with-aspects/Starter";

let queryParams = new URLSearchParams(window.location.search);
let app : Identity;
if (queryParams.has('local')) {
    app = Starter.createAppWithUIWithCommands();
} else {
    app = Starter.createWebsite();
}

</script>

<template>
    <VueUI :identity="app" />
</template>

<style scoped>
</style>