import Vue from 'vue'
import App from './App.vue'
import router from "./router"

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import moment from 'moment'

import 'vue2-datepicker/index.css';
import DatePicker from 'vue2-datepicker';

import { BootstrapVue } from 'bootstrap-vue'
import VueMeta from 'vue-meta'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faPen, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTimes)
library.add(faPen)
library.add(faSort)
library.add(faSortDown)
library.add(faSortUp)

Vue.use(VueMeta)

Vue.use(BootstrapVue)
Vue.use(DatePicker)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
})

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
