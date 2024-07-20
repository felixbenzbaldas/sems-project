<script setup lang="ts">
import HeaderBody from './components/HeaderBody.vue';
import type {SemsObject} from "@/core/SemsObject";
import {App} from "@/core/App";
import {defaultConfiguration} from "@/core/defaultConfiguration";
import {type Ref, ref} from "vue";
import {UserInterface} from "@/user-interface/UserInterface";
import type {ObservableList} from "@/core/ObservableList";
import type {UserInterfaceObject} from "@/user-interface/UserInterfaceObject";
import DisplayForListOfUIOs from "@/components/DisplayForListOfUIOs.vue";


let app = new App(defaultConfiguration);
let userInterface = new UserInterface(app);

const workingPlace : Ref<ObservableList<UserInterfaceObject>> = ref(undefined);

async function init() {
    await userInterface.load();
    let workingPlaceUIO = await userInterface.getWorkingPlace();
    workingPlace.value = workingPlaceUIO.listAspect.getListOfUIOs();
}

init();

async function newSubitem() {
    await userInterface.newSubitem();
}

async function clearWorkingPlace() {
    userInterface.setFocused(await userInterface.getWorkingPlace());
    app.clearWorkingPlace();
}

</script>

<template>
    <HeaderBody expanded>
        <template #head>commands</template>
        <template #body>
            <div class="flow">
                <button @click="newSubitem">new subitem</button>
                <button v-if="workingPlace" @click="clearWorkingPlace()">clear working place</button>
            </div>
        </template>
    </HeaderBody>
    <div style="border: solid; min-height: 25rem; margin: 0.2rem; padding: 1rem">
        <div v-if="workingPlace">
            <DisplayForListOfUIOs :list="workingPlace" :app="app" :userInterface="userInterface"/>
        </div>
    </div>
</template>

<style scoped>
.flow {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    row-gap: 1rem;
}
</style>
