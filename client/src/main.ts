import './assets/main.css'

import { createApp } from 'vue'
import VueApp from "@/VueGUI.vue";
import ListOfSemsObjects from "@/components/ListOfSemsObjects.vue";
import VueGUIForSemsObject from "@/components/VueGUIForSemsObject.vue";
import HeadBody from "@/components/HeadBody.vue";

const app = createApp(VueApp);
app.component('ListOfSemsObjects', ListOfSemsObjects);
app.component('VueGUIForSemsObject', VueGUIForSemsObject);
app.component('HeadBody', HeadBody);
app.mount('#app');