import './assets/main.css'

import {createApp} from 'vue'
import VueStarter from "@/restart-with-aspects/vue/VueStarter.vue";
import VueUI from "@/restart-with-aspects/vue/VueUI.vue";

const app = createApp(VueStarter);
app.component('VueUI', VueUI);
app.mount('#app');