import Vue from 'vue'
import axios from 'axios'

import Timer from 'easytimer'
import NProgress from 'nprogress'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import vueinterval from 'vue-interval'
import filters from './filters'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Buefy)

axios.interceptors.response.use((config) => {
  NProgress.start()
  const authToken = store.getters.userToken
  config.headers.Authorization = `Bearer ${authToken}`

  next((response) => {
    NProgress.done()
  })
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
