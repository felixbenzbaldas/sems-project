<!--<script setup lang="ts">-->
<!--import {ref} from "vue";-->
<!--import type {ObservableList} from "@/deprecated/core/ObservableList";-->
<!--import type {App} from "@/deprecated/core/App";-->
<!--import type {UserInterfaceObject} from "@/deprecated/user-interface/UserInterfaceObject";-->
<!--import type {UserInterface} from "@/deprecated/user-interface/UserInterface";-->

<!--const props = defineProps<{-->
<!--    list: ObservableList<UserInterfaceObject>,-->
<!--    userInterface : UserInterface,-->
<!--    app: App-->
<!--}>();-->

<!--const listObject = ref([]);-->

<!--function updateListObject() {-->
<!--    listObject.value = props.list.createCopyOfList();-->
<!--}-->

<!--props.list.subject.subscribe(next => {-->
<!--    updateListObject();-->
<!--});-->

<!--updateListObject();-->

<!--</script>-->

<!--<template>-->
<!--    <GUIForUIO style="margin: 0.5rem" v-for="uio in listObject" :uio="uio" :app="props.app" :userInterface="props.userInterface" />-->
<!--    &lt;!&ndash; TODO: :key verwenden  &ndash;&gt;-->
<!--</template>-->

<!--<style scoped>-->
<!--</style>-->