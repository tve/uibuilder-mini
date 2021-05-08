import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import Dash from './Dash.vue'

// Load socket.io from the local npm package (i.e. tell webpack to include it) and stick it into
// a global var so uibuilder finds it.
window.io = require('socket.io-client')

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(Dash)
}).$mount('#app')
