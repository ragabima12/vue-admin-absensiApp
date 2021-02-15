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
    parentData: [],
    sidebar: {
      title: "",
      menus: [],
      actions: {},
      selectedMenu: 0
    },
    selectedStudent: {
      id: '',
      parent_id: '',
      major: '',
      grade: '',
      fullname: '',
    },
    selectedParent: {
      id: '',
      nik: '',
      fullname: ''
    },
    notification: ''
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
      if (typeof payload === 'object') {
        state.userData = payload
      }
    },
    setStudentData: (state, payload) => {
      if (typeof payload !== 'object') {
        console.warn(`[WARN] Payload is not an object, ${typeof payload} given`)
        return
      }

      state.studentData = payload
    },
    setParentData: (state, payload) => {
      if (!Array.isArray(payload)) {
        console.warn(`[WARN] Payload is not an array, ${typeof payload} given`)
        return
      }
      state.parentData = payload
    },
    setSelectedStudent: (state, payload) => {
      if (typeof payload !== 'object') {
        console.warn(`[WARN] Payload is not an object, ${typeof payload} given`)
        return
      }
      state.selectedStudent = { ...payload }
    },
    setSelectedParent: (state, payload) => {
      if (typeof payload !== 'object') {
        console.warn(`[WARN] Payload is not an object, ${typeof payload} given`)
        return
      }
      state.selectedParent = { ...payload }
    },
    setNotification: (state, payload) => {
      if (typeof payload === 'string') state.notification = payload
    }
  },
  actions: {
    isLoggedIn: async (state) => {
      const accessToken = Vue.$cookies.get('access-token')
      const refreshToken = Vue.$cookies.get('refresh-token')
      const isHavingAccessToken = accessToken ? true : false
      const isHavingRefreshToken = refreshToken ? true : false
      const publicKey = process.env.VUE_APP_PUBLIC_KEY

      if (isHavingAccessToken && isHavingRefreshToken) {
        try {
          const decodedToken = await JWT.verify(accessToken, publicKey)
          if (!decodedToken) return false

          // Delete unused property of "decodedToken" object
          delete decodedToken.exp
          delete decodedToken.iat

          state.commit('setUserData', decodedToken)
          const isAllowedUsers = ['admin', 'superadmin']
          const isAdmin = isAllowedUsers.includes(state.state.userData.previleges)
          if (!isAdmin) {
            state.commit('setNotification', `Akses ditolak, akun yang anda gunakan tidak diperbolehkan mengakses fitur ini`)
            Vue.$cookies.remove('access-token')
            Vue.$cookies.remove('refresh-token')
            return false
          }

          return true
        } catch (exception) {
          if (exception.name === 'TokenExpiredError') {
            const upgradeStatus = state.dispatch('tokenUpgrade', { accessToken: accessToken, refreshToken: refreshToken })
            if (upgradeStatus.isError) {
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

      try {
        const requestResponse = await Request.Login(username, password)
        const isError = requestResponse.isError
        const isSuccess = requestResponse.data.statusCode === 200

        if (!isError && isSuccess) {
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
      } catch (exception) {
        state.commit('setNotification', `Terjadi kesalahan saat menghubungi server, ${exception.message}`)
        response.isError = true
        response.reason = exception.message
        return response

      }

    },
    tokenUpgrade: async (state, payload) => {
      const response = { ...responseStatus }
      if (typeof payload !== 'object') {
        response.isError = true
        response.reason = `Payload that included tokens must be an object, ${typeof payload} given`
        return response
      }

      const accessToken = payload.accessToken || null
      const refreshToken = payload.refreshToken || null
      const isValidToken = accessToken && refreshToken
      if (!isValidToken) {
        response.isError = true
        response.reason = `Tokens must be included, got ${accessToken} on accessToken and ${refreshToken} on refreshToken`
        return response
      }

      try {
        const requestResponse = await Request.TokenUpgrade(accessToken, refreshToken)
        if (requestResponse.isError || requestResponse.data.statusCode !== 200) {
          response.isError = true
          response.reason = `Terjadi kesalahan saat memperbaharui token, ${requestResponse.reason}`
          state.commit('setNotification', response.reason)
          return response
        }

        const responseData = requestResponse.data.data
        const newAccessToken = responseData.access_token
        const newRefreshToken = responseData.refresh_token
        Vue.$cookies.set('access-token', newAccessToken)
        Vue.$cookies.set('refresh-token', newRefreshToken)
        return response
      } catch (exception) {
        response.isError = true
        response.reason = exception.message
        state.commit('setNotification', `Terjadi kesalahan saat memperbaharui token, ${exception.message}`)
        return response
      }

    },
    getStudentData: async (state) => {
      const isLoggedIn = await state.dispatch('isLoggedIn')
      if (!isLoggedIn) return

      const accessToken = Vue.$cookies.get('access-token')
      try {
        const responseStatus = await Request.GetStudents(accessToken)
        if (responseStatus.isError) {
          state.commit('setNotification', `Terjadi kesalahan saat merequest data siswa, ${responseStatus.reason}`)
          return
        }
        if (responseStatus.data.statusCode === 200) {
          let studentData = responseStatus.data.data

          let students = {
            majors: [],
            grades: [],
            students: []
          }

          for (let student of studentData) {
            students.grades.push(student.grade)
            students.majors.push(student.major)
            students.students.push(student)
          }

          students.majors = Array.from(new Set(students.majors))
          students.grades = Array.from(new Set(students.grades))

          state.commit('setStudentData', students)
        }
      } catch (exception) {
        state.commit('setNotification', `Terjadi kesalahan saat merequest data siswa, ${exception.message}`)
      }
    },
    updateStudentData: async (state) => {
      const response = { ...responseStatus }

      await state.dispatch('isLoggedIn')
      const accessToken = Vue.$cookies.get('access-token')
      const studentData = state.getters.getSelectedStudent
      let { _id: studentId, nisn, fullname, grade, major, parent, card_id } = studentData
      let parentId = null
      if (parent) parentId = parent._id
      let student = new Object()
      student['student-id'] = studentId
      if (parentId) student['parent-id'] = parentId
      student['card-id'] = card_id || ''
      student.nisn = nisn
      student.fullname = fullname
      student.grade = grade
      student.major = major

      try {
        const result = await Request.UpdateStudent(accessToken, student)
        if (result.isError) {
          console.warn(result.reason)
          state.commit('setNotification', `Terjadi kesalahan saat memperbaharui data siswa, ${result.reason}`)
          response.isError = true
          response.reason = result.reason
          return response
        }

        const statusCode = result.data.statusCode
        if (statusCode !== 200) {
          response.isError = true
          response.reason = result.data.reason
          return response
        }

        await state.dispatch('getStudentData')
        return response
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat memperbaharui data siswa, ${exception.message}`)
        response.isError = true
        response.reason = exception.message
        return response
      }

    },
    storeStudentData: async (state, payload) => {
      const response = { ...responseStatus }

      if (typeof payload !== 'object') {
        console.warn(`[ERR] Payload must be an object, ${typeof payload} given`)
        response.isError = true
        response.reason = 'INVALID_PAYLOAD'
        return response
      }

      await state.dispatch('isLoggedIn')
      const accessToken = Vue.$cookies.get('access-token')
      const studentData = payload
      let { nisn, fullname, grade, major, parent, card_id } = studentData
      let parentId = null
      if (parent) parentId = parent._id
      let student = new Object()
      if (parentId) student['parent-id'] = parentId
      student['card-id'] = card_id || ''
      student.nisn = nisn
      student.fullname = fullname
      student.grade = grade
      student.major = major

      try {
        const result = await Request.StoreStudent(accessToken, student)
        if (result.isError) {
          console.warn(result.reason)
          state.commit('setNotification', `Terjadi kesalahan saat memperbaharui data siswa, ${result.reason}`)
          response.isError = true
          response.reason = result.reason
          return response
        }

        const statusCode = result.data.statusCode
        if (statusCode !== 200) {
          response.isError = true
          response.reason = result.data.reason
          return response
        }

        await state.dispatch('getStudentData')
        return response
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat memperbaharui data siswa, ${exception.message}`)
        response.isError = true
        response.reason = exception.message
        return response
      }

    },
    deleteStudentData: async (state) => {
      const response = { ...responseStatus }

      await state.dispatch('isLoggedIn')
      const accessToken = Vue.$cookies.get('access-token')
      const studentData = state.getters.getSelectedStudent
      let { _id: studentId, fullname } = studentData
      let student = {
        'student-id': studentId
      }

      try{
        const result = await Request.DeleteStudent(accessToken, student)
        if (result.isError) {
          console.warn(result.reason)
          state.commit('setNotification', `Terjadi kesalahan saat memperbaharui data siswa, ${result.reason}`)
          response.isError = true
          response.reason = result.reason
          return response
        }

        const statusCode = result.data.statusCode
        if (statusCode !== 200) {
          response.isError = true
          response.reason = result.data.reason
          return response
        }

        await state.dispatch('getStudentData')
        state.commit('setNotification', `Data siswa dengan nama ${fullname} berhasil dihapus`)
        return response
      }catch(exception){
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat memperbaharui data siswa, ${exception.message}`)
        response.isError = true
        response.reason = exception.message
        return response
      }
    },
    getParentData: async (state) => {
      const isLoggedIn = await state.dispatch('isLoggedIn')
      if (!isLoggedIn) return

      const accessToken = Vue.$cookies.get('access-token')
      try {
        const responseStatus = await Request.GetParents(accessToken)
        if (responseStatus.isError) {
          state.commit('setNotification', `Terjadi kesalahan saat merequest data orang tua, ${responseStatus.reason}`)
          return
        }

        if (responseStatus.data.statusCode === 200) {
          let parents = responseStatus.data.data
          state.commit('setParentData', parents)
        }
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat merequest data orang tua, ${exception.message}`)

      }
    }

  },
  modules: {
  },
  getters: {
    getSidebar: state => {
      return state.sidebar
    },
    getStudents: state => {
      return state.studentData.students
    },
    getMajors: state => {
      return state.studentData.majors
    },
    getGrades: state => {
      return state.studentData.grades
    },
    getSelectedStudent: state => {
      return state.selectedStudent
    },
    getSelectedParent: state => {
      return state.selectedParent
    },
    getParents: state => {
      return state.parentData
    },
    getNotification: state => {
      return state.notification
    }
  },

})