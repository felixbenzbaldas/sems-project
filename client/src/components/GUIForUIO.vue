<script setup lang="ts">
import {type Ref, ref} from "vue";
import ListOfSemsObjects from "@/components/DisplayForListOfUIOs.vue";
import HeaderBody from "@/components/HeaderBody.vue";
import {ObservableList} from "@/core/ObservableList";
import type {App} from "@/core/App";
import {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import type {UserInterface} from "@/user-interface/UserInterface";

const props = defineProps<{
    uio: UserInterfaceObject,
    app: App,
    userInterface: UserInterface,
}>();

const hasBody = ref(false);
const list : Ref<ObservableList<UserInterfaceObject>> = ref(undefined);
list.value = new ObservableList<UserInterfaceObject>();

async function updateHasBody() {
    hasBody.value = !props.uio.getSemsObject().getDetails().isEmpty();
};

async function init() {
    updateHasBody();
    updateDetails();
    let details = props.uio.getSemsObject().getDetails();
    details.subject.subscribe(next => {
        updateHasBody();
        updateDetails();
    });
}

init();

async function updateDetails() {
    list.value.clear();
    for (let detailPath of props.uio.getSemsObject().getDetails().createCopyOfList()) {
        let semsObject = await props.app.getLocation().getObject(detailPath);
        let uio = new UserInterfaceObject(props.userInterface);
        uio.setSemsObject(semsObject);
        list.value.add(uio);
    }
}

function saveChanges(event: any) {
    props.uio.getSemsObject().setText(event.target.innerText.trim());
}

</script>

<template>
    <HeaderBody>
        <template #head>
            <div style="display: inline-block ; max-width: 20rem">
                <div @click="$event.stopPropagation()" class="contentEditableDiv" contenteditable @blur="saveChanges">
                    {{ props.uio.getSemsObject().getText() }}
                </div>
            </div>
        </template>
        <template v-if="hasBody" #body>
            <DisplayForListOfUIOs :list="list" :app="props.app" :userInterface="props.userInterface"/>
        </template>
    </HeaderBody>
</template>

<style scoped>

.contentEditableDiv {
    min-height: 1rem;
    min-width: 1rem;
    background-color: antiquewhite;
}

</style>