import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import Request from '@/plugins/APIRequests'
import JWT from 'jsonwebtoken'

Vue.use(Vuex)
Vue.use(VueCookies)

let responseStatus = {
  isError: false,
  data: null,
  reason: null
}

export default new Vuex.Store({
  state: {
    userData: {},
    sidebar: {
      title: "",
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
    setUserData: (state, payload) => {
      if( typeof payload === 'object' ){
        state.userData = payload
      }
    }
  },
  actions: {
    isLoggedIn: async (state) => {
      const accessToken = Vue.$cookies.get('access-token')
      const refreshToken = Vue.$cookies.get('refresh-token')
      const isHavingAccessToken =  accessToken ? true : false
      const isHavingRefreshToken = refreshToken ? true : false
      const publicKey = process.env.VUE_APP_PUBLIC_KEY

      if (isHavingAccessToken && isHavingRefreshToken) {
        try{
          const decodedToken = await JWT.verify(accessToken, publicKey)
          if( !decodedToken ) return false

          // Delete unused property of "decodedToken" object
          delete decodedToken.exp
          delete decodedToken.iat

          state.commit('setUserData', decodedToken)
          const isAdmin = state.state.userData.previleges === 'admin'
          if( !isAdmin ) return false

          return true
        }catch(exception){
          if( exception.name === 'TokenExpiredError' ){
            const upgradeStatus = state.dispatch('tokenUpgrade', {accessToken: accessToken, refreshToken: refreshToken})
            if( upgradeStatus.isError ){
              console.warn(upgradeStatus.reason)
              return false
            }
          }
          return true 
        }
      }
      return false
    },
    login: async (state, payload) => {
      let response = { ...responseStatus }
      const username = payload.username
      const password = payload.password
      if (!username || !password) {
        response.isError = true
        response.reason = `Username or Password must be a string. got ${typeof username} for username and ${typeof password} on password`
        return response
      }

      let requestResponse = await Request.Login(username, password)
      const isError = requestResponse.isError
      const isSuccess = requestResponse.data.statusCode === 200

      if( !isError && isSuccess ){
        const responseData = requestResponse.data.data
        const accessToken = responseData.access_token
        const refreshToken = responseData.refresh_token
        
        // Store both tokens to cookie
        Vue.$cookies.set('access-token', accessToken)
        Vue.$cookies.set('refresh-token', refreshToken)
        return response
      }

      response.isError = true
      response.reason = requestResponse.data.reason
      return response
    },
    tokenUpgrade: async(state, payload) => {
      const response = {...responseStatus}
      if(typeof payload !== 'object'){
        response.isError = true
        response.reason = `Payload that included tokens must be an object, ${typeof payload} given`
        return response
      }
      
      const accessToken = payload.accessToken || null
      const refreshToken = payload.refreshToken || null
      const isValidToken = accessToken && refreshToken
      if( !isValidToken ){
        response.isError = true
        response.reason = `Tokens must be included, got ${accessToken} on accessToken and ${refreshToken} on refreshToken`
        return response
      }

      const requestResponse = await Request.TokenUpgrade(accessToken, refreshToken)
      if( requestResponse.isError || requestResponse.data.statusCode !== 200 ){
        response.isError = true
        response.reason = `Error when requesting to API server with error ${requestResponse.reason}`
        return response
      }

      const responseData = requestResponse.data.data
      const newAccessToken = responseData.access_token
      const newRefreshToken = responseData.refresh_token
      Vue.$cookies.set('access-token', newAccessToken)
      Vue.$cookies.set('refresh-token', newRefreshToken)
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