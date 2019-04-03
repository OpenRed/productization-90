import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import router from '@/router'

let routes = router.options.routes
// let menu = []
// routes.forEach(item => {
//   if (item.path === '/') menu = item.children
// })
// console.log(menu);
// let nav = menu.map(item => {
//   return {
//     index: item.index,
//     title: item.title,
//     children: item.children
//   }
// })
// console.log(nav);

// let menu2 = []

// function getmenu(list) {
//   if (item.children) {
//     if (item.path) {
//       delete item.path
//     } else if (item.component) {
//       delete item.component
//     }
//     getmenu(item.children);
//   } else return;
//
//   list.forEach(item => {
//   })
// }
// getmenu(nav);
// console.log(nav);

// function getmenu(list) {
//   for (let i = 0; i < list.lenght; i++) {
//     let item = list[i]
//
//     if (item.path) {
//       getmenu(item.children, list2)
//     } else if (i === list.length - 1) {
//       return list2
//     }
//   }
// }
// console.log(getmenu(nav, menu));

const store = new Vuex.Store({
  state: {
    // menulist: menu
    menulist: router.options.routes.filter(item => {
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
