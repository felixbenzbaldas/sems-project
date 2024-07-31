<script setup lang="ts">

import type {Identity} from "@/restart-with-aspects/Identity";

const props = defineProps<{
    identity: Identity,
}>();

</script>

<template>
    <div>
<!--        {{ props.identity.text }}-->
        This is the Sems software. It is being developed. New features will be added.
    </div>
</template>

<style scoped>
</style>
