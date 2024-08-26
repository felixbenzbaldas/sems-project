import {createApp} from 'vue'
import VueStarter from "@/vue/deprecated/VueStarter.vue";
import VueUI from "@/vue/deprecated/VueUI.vue";

const app = createApp(VueStarter);
app.component('VueUI', VueUI);
app.mount('#app');