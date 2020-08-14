import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import formaters from './mixins/formaters'

import './registerServiceWorker'

import axios from 'axios'

Vue.use({
	install(Vue) {
		Vue.prototype.$axios = axios.create({
			baseURL: 'https://api.covid19api.com/'
		})
	}
})

Vue.mixin(formaters)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
