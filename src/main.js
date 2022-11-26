import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFeather,faTrash } from '@fortawesome/free-solid-svg-icons'
import Notifications from '@kyvg/vue3-notification'

library.add(faFeather,faTrash)


const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(Notifications)
app.mount("#app");

