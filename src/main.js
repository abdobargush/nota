import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/*
Global Style
*/
import './assets/scss/style.scss'

import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Event bus
export const bus = new Vue()
