<script setup lang="ts">

import {ref} from "vue";
import VueGUI from "@/VueGUI.vue";
import {websiteData} from "@/websiteData";
import HeaderBody from "@/components/HeaderBody.vue";

const isWebsite = ref(!new URLSearchParams(window.location.search).has('local'));

const text = ref(websiteData.workingPlace[0].text);

</script>

<template>
    <div v-if="isWebsite">
        <HeaderBody>
            <template #head>Sems</template>
            <template #body>
                <div class="flow">
                    Sems is a software for linking text blocks. This website is based on the Sems-software. Simply click
                    on what you are interested in and see what happens.
                </div>
                <HeaderBody>
                    <template #head>description of Sems</template>
                    <template #body>
                        With Sems you can link text blocks. For example this paragraph is a text block. It is a subitem
                        of 'description of Sems'.
                        The handling of Sems is as follows: objects can be clicked. When you click an object, further
                        text blocks are expanded. When you click again on the object it collapses. Try it and click on
                        the superordinate 'description of Sems'.
                    </template>
                </HeaderBody>
            </template>
        </HeaderBody>
    </div>
    <VueGUI v-else/>
</template>

<style scoped>
</style>