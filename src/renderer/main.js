import Vue from 'vue'
import axios from 'axios'

import Timer from 'easytimer'
import NProgress from 'nprogress'
import vueinterval from 'vue-interval'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import locale from 'iview/dist/locale/en-US'
import filters from './filters'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.config.lang = 'en-US'
Vue.use(iView, { locale })

store.dispatch('checkAuth')
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken')

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
