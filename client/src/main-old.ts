import './assets/main.css'

import { createApp } from 'vue'
import VueApp from "@/VueApp.vue";
import DisplayForListOfUIOs from "@/components/DisplayForListOfUIOs.vue";
import GUIForUIO from "@/components/GUIForUIO.vue";
import HeaderBody from "@/components/HeaderBody.vue";
import VueGUI from "@/VueGUI.vue";

const app = createApp(VueApp);
app.component('VueGUI', VueGUI);
app.component('DisplayForListOfUIOs', DisplayForListOfUIOs);
app.component('GUIForUIO', GUIForUIO);
app.component('HeaderBody', HeaderBody);
app.mount('#app');