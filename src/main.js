// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/app.css'
import router from './router'
import store from '../store'
import JsEncrypt from 'JsEncrypt'
// import JsEncrypt from 'jsencrypt'
import Jq from 'jquery'
import 'jquery-form'
import FormData from 'form-data'
import Vuex from 'vuex'
import VueMeta from 'vue-meta'
import axios from 'axios'

import '@/static/js/canvas-to-blob.js'

Vue.prototype.$jsEncrypt = JsEncrypt
Vue.prototype.Jq = Jq

// 华平生产环境
// Vue.prototype.Host = 'http://120.132.18.193'
// Vue.prototype.Url = 'http://120.132.18.193:3000/file'
// Vue.prototype.Url2 = 'http://120.132.18.193:3000/livefile'
// Vue.prototype.UploadImgUrl = 'http://training.avcon.com.cn/avctraining/uploadImgFile'
// window.localStorage.setItem('UploadImgUrl','http://training.avcon.com.cn/avctraining/uploadImgFile');

Vue.config.productionTip = false;
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueMeta)

// router.beforeEach((to, from, next) => {
//   //判断登录状态简单实例
//   console.log(to);
//   console.log(from);
//   console.log(next);
//   let params = {
//     'time': new Date().getTime(),
//     'oid': window.localStorage.getItem("saasoid"),
//     'token': window.localStorage.getItem('saastoken'),
//     'version': 1
//   }
//   console.log(params);
//   axios.get('/avctraining/home', {
//     params: {
//       'time': new Date().getTime(),
//       'oid': window.localStorage.getItem("saasoid"),
//       'token': window.localStorage.getItem('saastoken'),
//       'version': 1
//     }
//   }).then(function getRes(res) {
//       next();
//       if (res.data.resMsg==='token不正确，请重新登录') {
//         next('/Login');
//       } else {
//         next();
//       }
//   })
// })

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  },
})
//
// export default VM;
