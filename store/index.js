import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import router from '@/router'

// console.log(router);
var routes = router.options.routes

const store = new Vuex.Store({
  state: {
    menulist: router.options.routes.filter(function (item) {
      return item.path === '/'
    })[0].children
  },
  mutations: {
    // login(state, flag) {
    //   state.login = flag
    // },
    // setNextPage(state, page) {
    //   state.nextPage = page
    // },
    // setPrevPage(state, page) {
    //   state.prevPage = page
    // }
  }
})

export default store
