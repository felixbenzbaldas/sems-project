import {createApp} from 'vue'
import VueStarter from "@/vue/deprecated/VueStarter.vue";
import VueUI from "@/vue/deprecated/VueUI.vue";
import HotdeploymentWrapper from "@/vue/HotdeploymentWrapper.vue";

const app = createApp(HotdeploymentWrapper);
app.component('VueUI', VueUI);
app.component('VueStarter', VueStarter);
app.mount('#app');