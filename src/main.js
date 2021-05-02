import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "jquery/dist/jquery.slim.min"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage,faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import store from './store/index'



library.add(faImage,faFolder)



createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(store).use(router).mount('#app')

