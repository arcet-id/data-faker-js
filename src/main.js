import Vue from 'vue'
import App from './App.vue'
import Clipboard from 'v-clipboard'
import hljs from 'highlight.js'

Vue.config.productionTip = false
Vue.use(Clipboard)
Vue.use(hljs.vuePlugin);
new Vue({
  render: h => h(App),
}).$mount('#app')
