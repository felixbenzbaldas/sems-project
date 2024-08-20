<script setup lang="ts">

import type {Identity} from "@/Identity";
import {type Ref, ref} from "vue";

const props = defineProps<{
    identity: Identity,
    isView? : boolean,
}>();

const hasListItem : Ref<boolean> = ref();
const list : Ref<Array<Identity>> = ref();
const text : Ref<string> = ref();
const hidden : Ref<boolean> = ref();

if (props.identity.subject) {
    props.identity.subject.subscribe(event => {
        updateList();
        updateHasListItem();
        updateHidden();
        updateText();
    });
}

updateList();
updateHasListItem();
updateHidden();
updateText();

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

function updateText() {
    text.value = props.identity.text;
}

function updateHidden() {
    hidden.value = props.identity.hidden;
}

function neitherNullNorUndefined(toCheck : any) {
    return toCheck != null && toCheck != undefined;
}

function saveText(event: any) {
    props.identity.setText(event.target.innerText.trim());
}

</script>

<template>
    <div v-if="!hidden" style="display: inline">
        <div v-if="identity.abstractUi?.commands" style="margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: dashed">
            <VueUI :identity="identity.abstractUi.commands" :is-view="true"/>
        </div>
        <VueUI v-if="identity.abstractUi" :identity="props.identity.abstractUi.output.getUi()" :is-view="true"></VueUI>
        <VueUI v-if="identity.abstractUi" :identity="identity.abstractUi.content" :is-view="identity.abstractUi.isWebsite"/>
        <button v-else-if="identity.action" @click="identity.action()" style="margin: 0.3rem">
            {{text}}
        </button>
        <a v-else-if="neitherNullNorUndefined(identity.link)" :href="identity.link">
            {{neitherNullNorUndefined(text) ? text : identity.link }}
        </a>
        <div v-else-if="neitherNullNorUndefined(text)">
            <div style="min-height: 1rem; white-space: pre-wrap;" :contenteditable="!props.isView" @blur="saveText">
                {{text}}
            </div>
            <div v-if="identity.list && hasListItem" style="margin-left: 0.8rem; margin-top: 0.2rem; margin-bottom: 0.2rem">
                <VueUI v-for="current in list" :identity="current" :is-view="props.isView"/>
            </div>
        </div>
        <VueUI v-else-if="identity.list" v-for="current in list" :identity="current" :is-view="props.isView"/>
    </div>
</template>

<style scoped>
</style>