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

function neitherNullNorUndefined(toCheck : any) {
    return toCheck != null && toCheck != undefined;
}

</script>

<template>
    <div v-if="identity.abstractUi?.commands" style="margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: dashed">
        <VueUI :identity="identity.abstractUi.commands" :is-view="true"/>
    </div>
    <VueUI v-if="identity.abstractUi" :identity="identity.abstractUi.content" :is-view="identity.abstractUi.isWebsite"/>
    <button v-else-if="identity.action" @click="identity.action()">
        {{identity.text}}
    </button>
    <a v-else-if="neitherNullNorUndefined(identity.link)" :href="identity.link">
        {{neitherNullNorUndefined(identity.text) ? identity.text : identity.link }}
    </a>
    <div v-else-if="neitherNullNorUndefined(identity.text)">
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