import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebar: {
      title: "OK!",
      menus: [],
      selectedMenu: 0
    }
  },
  mutations: {
    setSidebar: (state, payload) => {
      if ('menus' in payload && 'title' in payload) {
        if (!'selectedMenu' in payload) payload.selectedMenu = 0
        state.sidebar = payload
      }
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getSidebar: state => {
      return state.sidebar
    },
  }
})
