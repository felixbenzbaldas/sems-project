<script setup lang="ts">

import type {Identity} from "@/Identity";
import {Starter} from "@/Starter";

let queryParams = new URLSearchParams(window.location.search);
let app : Identity;
if (queryParams.has('local')) {
    app = Starter.createAppWithUIWithCommands();
} else if (queryParams.has('client-app')) {
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