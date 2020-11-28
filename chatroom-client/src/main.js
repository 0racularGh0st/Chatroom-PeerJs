import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Particles from 'particles.vue3';
import './registerServiceWorker'
import mitt from 'mitt';
const emitter = mitt();
let app = createApp(App).use(store).use(router).use(Particles);
app.config.globalProperties.emitter = emitter;

app.mount('#app');
