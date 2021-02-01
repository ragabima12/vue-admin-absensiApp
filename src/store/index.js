import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebar: {
      title: "OK!",
      menus: [],
      actions: {},
      selectedMenu: 0
    }
  },
  mutations: {
    setSidebar: (state, payload) => {
      if ('menus' in payload && 'title' in payload) {
        if (!'selectedMenu' in payload) payload.selectedMenu = 0
        state.sidebar = payload
      }
    },
    setActivePage: (state, path) => {
      if (!path) return console.warn('[WARN] Path not defined when change the active page')
      state.activePage = path
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
