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
    studentData: {
      students: [],
      majors: [],
      grades: []
    },
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
    },
    setStudentData: (state, payload) => {
      if( typeof payload !== 'object' ){
        console.warn(`[WARN] Payload is not an object, given ${typeof payload}`)
        return
      }

      state.studentData = payload
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
          if( !isAdmin ){
            Vue.$cookies.remove('access-token')
            Vue.$cookies.remove('refresh-token')
            return false
          }

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
    },
    getStudentData: async (state) => {
      // Get Access Token
      const accessToken = Vue.$cookies.get('access-token')
      // Request To API
      const responseStatus = await Request.GetStudents(accessToken)
      if( responseStatus.isError ){
        console.warn(`[WARN] Error fetching student data with error : ${responseStatus.reason}`)
        return
      }
      if( responseStatus.data.statusCode === 200 ){
          let studentData = responseStatus.data.data

          // Parsing student data Array
          studentData = studentData.filter(student => student.classroom !== undefined)
          const parsedStudents = studentData.map((student, index)=> {
            return {
              nisn: student.nisn,
              fullname: student.fullname,
              major: `${student.classroom.split(' ')[1]} ${student.classroom.split(' ')[2]}`,
              grade: student.classroom.split(' ')[0]
            }
          })

          let students = {
            majors: [],
            grades: [],
            students: []
          }
          
          for( let parsedStudent of parsedStudents){
            students.grades.push(parsedStudent.grade)
            students.majors.push(parsedStudent.major)
            students.students.push(parsedStudent)
          }

          students.majors = Array.from(new Set(students.majors))
          students.grades = Array.from(new Set(students.grades))

          state.commit('setStudentData', students)
      }
    }
  },
  modules: {
  },
  getters: {
    getSidebar: state => {
      return state.sidebar
      },

    getStudentData: state => {
      return state.studentData
    }
  },
    
})