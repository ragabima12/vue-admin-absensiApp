import Vue from 'vue'
import Vuex from 'vuex'
import Request from '@/plugins/APIRequests'

Vue.use(Vuex)

let responseStatus = {
  isError: false,
  data: null,
  reason: null
}

export default new Vuex.Store({
  state: {
    userCredentials: {
      accessToken: '',
      refreshToken: ''
    },

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
    },
    setUserToken: (state, payload) => {
      const accessToken = payload.accessToken
      const refreshToken = payload.refreshToken
      state.userCredentials.accessToken = accessToken
      state.userCredentials.refreshToken = refreshToken
    }
  },
  actions: {
    isLoggedIn: (state) => {
      const isHavingAccessToken = state.state.userCredentials.accessToken ? true : false
      const isHavingRefreshToken = state.state.userCredentials.accessToken ? true : false
      return isHavingAccessToken && isHavingRefreshToken ? true : false
    },
    login: (state, payload) => {
      let response = {...responseStatus}
      const username = payload.username
      const password = payload.password
      if( !username || !password ){
        response.isError = true
        response.reason = `Username or Password must be a string. got ${typeof username} for username and ${typeof password} on password`
        return response
      }
      
      // state.commit('setUserToken', {accessToken: 'aaa', refreshToken: 'bbb'})
      return response
    }
  },
  modules: {
  },
  getters: {
    getSidebar: state => {
      return state.sidebar
    },
  }
})
