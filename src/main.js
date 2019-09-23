// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import store from './store'
import 'mint-ui/lib/style.css'
import '../static/reset.css'
import 'lib-flexible/flexible.js'
import 'vant/lib/index.css';
import $http from '../static/axios'
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)
Vue.prototype._Vuex = store.goods
Vue.use(MintUI)

Vue.prototype.$http = $http
Vue.config.productionTip = false
Vue.filter('pay', val => {
  return (Number(val) / 100).toFixed(2)
})
Vue.filter('imgFilter', val => {
  return sessionStorage.img + val
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
