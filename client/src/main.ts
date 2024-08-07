import {createApp} from 'vue'
import VueStarter from "@/vue/VueStarter.vue";
import VueUI from "@/vue/VueUI.vue";

const app = createApp(VueStarter);
app.component('VueUI', VueUI);
app.mount('#app');