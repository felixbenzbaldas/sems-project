<script setup lang="ts">

import type {Identity} from "@/restart-with-aspects/Identity";
import {Starter} from "@/restart-with-aspects/Starter";

let app : Identity = Starter.createApp();

</script>

<template>
    <VueUI :identity="app">
    </VueUI>
</template>

<style scoped>
</style>