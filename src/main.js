import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "jquery/dist/jquery.slim.min"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import store from './store'





createApp(App).use(store).use(router).mount('#app')

