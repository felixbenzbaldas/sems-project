<script setup lang="ts">

import type {Identity} from "@/Identity";
import {type Ref, ref} from "vue";

const props = defineProps<{
    identity: Identity,
    isView? : boolean,
}>();

const hasListItem : Ref<boolean> = ref();
const list : Ref<Array<Identity>> = ref();

if (props.identity.subject) {
    props.identity.subject.subscribe(event => {
        updateList();
        updateHasListItem();
    });
}

updateList();
updateHasListItem();

function updateHasListItem() {
    if (props.identity.list) {
        hasListItem.value = props.identity.list.jsList.length > 0;
    } else {
        hasListItem.value = false;
    }
}

function updateList() {
    if (props.identity.list) {
        list.value = [...props.identity.list.jsList];
    } else {
        list.value = undefined;
    }
}

</script>

<template>
    <div v-if="identity.ui?.commands" style="margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: dashed">
        <VueUI :identity="identity.ui.commands" :is-view="true"/>
    </div>
    <VueUI v-if="identity.ui" :identity="identity.ui.content" :is-view="identity.ui.isWebsite"/>
    <button v-else-if="identity.action" @click="identity.action()">
        {{identity.text}}
    </button>
    <div v-else-if="identity.text != undefined">
        <div style="min-height: 1rem" :contenteditable="!props.isView">
            {{identity.text}}
        </div>
        <div v-if="identity.list && hasListItem" style="margin-left: 0.8rem; margin-top: 0.2rem; margin-bottom: 0.2rem">
            <VueUI v-for="current in list" :identity="current" :is-view="props.isView"/>
        </div>
    </div>
    <VueUI v-else-if="identity.list" v-for="current in list" :identity="current" :is-view="props.isView"/>
</template>

<style scoped>
</style>