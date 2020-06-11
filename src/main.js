import Vue from 'vue'

import App from './App.vue'
import formaters from './mixins/formaters'

import './registerServiceWorker'

Vue.mixin(formaters)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
