import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "jquery/dist/jquery.slim.min"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImage,faFolder,faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
//todo: choose server version
import store from './store/index-c#'



library.add(faImage,faFolder,faFile)



createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(store).use(router).mount('#app')

