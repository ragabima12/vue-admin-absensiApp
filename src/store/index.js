import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import Request from '@/plugins/APIRequests'
import JWT from 'jsonwebtoken'

Vue.use(Vuex)
Vue.use(VueCookies)

let responseStatus = ({ data, isError, reason }) => ({
  isError: isError || false,
  data: data || null,
  reason: reason || null
})

export default new Vuex.Store({
  state: {
    userData: {},
    studentData: {
      students: [],
      majors: [],
      grades: []
    },
    attendanceData: [],
    absenceData: [],
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
      fullname: '',
      email: '',
      phone_number: ''
    },
    selectedAttendance: {},
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
    },
    setAttendanceData: (state, payload) => {
      if (!Array.isArray(payload)) {
        console.warn(`[WARN] Payload is not an array, ${typeof payload} given`)
        return
      }
      state.attendanceData = payload
    },
    setAbsenceData: (state, payload) => {
      if (!Array.isArray(payload)) {
        console.warn(`[WARN] Payload is not an array, ${typeof payload} given`)
        return
      }
      state.absenceData = payload
    },
    setSelectedAttendance: (state, payload) => {
      if (typeof payload !== 'object') {
        console.warn(`[WARN] Payload is not an array, ${typeof payload} given`)
        return
      }
      state.selectedAttendance = payload
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
            const upgradeStatus = await state.dispatch('tokenUpgrade', { accessToken: accessToken, refreshToken: refreshToken })
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
      const username = payload.username
      const password = payload.password
      if (!username || !password) return responseStatus({ data: null, isError: true, reason: `Username or Password must be a string. got ${typeof username} for username and ${typeof password} on password` })

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
          return responseStatus({ data: null, isError: false, reason: null })
        }

        return responseStatus({ data: null, isError: true, reason: requestResponse.data.reason })
      } catch (exception) {
        state.commit('setNotification', `Terjadi kesalahan saat menghubungi server, ${exception.message}`)
        return responseStatus({ data: null, isError: true, reason: exception.message })

      }

    },
    tokenUpgrade: async (state, payload) => {
      if (typeof payload !== 'object') return responseStatus({ data: null, isError: true, reason: `Payload that included tokens must be an object, ${typeof payload} given` })

      const accessToken = payload.accessToken || null
      const refreshToken = payload.refreshToken || null
      const isValidToken = accessToken && refreshToken
      if (!isValidToken) return responseStatus({ data: null, isError: true, reason: `Tokens must be included, got ${accessToken} on accessToken and ${refreshToken} on refreshToken` })

      try {
        const requestResponse = await Request.TokenUpgrade(accessToken, refreshToken)
        if (requestResponse.isError || requestResponse.data.statusCode !== 200) {
          Vue.$cookies.remove('access-token')
          Vue.$cookies.remove('refresh-token')
          state.commit('setNotification', requestResponse.reason)
          return responseStatus({ data: null, isError: true, reason: `Terjadi kesalahan saat memperbaharui token, ${requestResponse.reason}` })
        }

        const responseData = requestResponse.data.data
        const newAccessToken = responseData.access_token
        const newRefreshToken = responseData.refresh_token
        Vue.$cookies.set('access-token', newAccessToken)
        Vue.$cookies.set('refresh-token', newRefreshToken)
        return responseStatus({ data: null, isError: false, reason: null })
      } catch (exception) {
        state.commit('setNotification', `Terjadi kesalahan saat memperbaharui token, ${exception.message}`)
        return responseStatus({ data: null, isError: true, reason: exception.message })
      }

    },
    getStudentData: async (state) => {
      await state.dispatch('isLoggedIn')

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
          return responseStatus({ data: null, isError: true, reason: result.reason })
        }

        const statusCode = result.data.statusCode
        if (statusCode !== 200) return responseStatus({ data: result.data.data, isError: true, reason: result.data.reason })

        await state.dispatch('getStudentData')
        return responseStatus({ data: null, isError: false, reason: false })
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat memperbaharui data siswa, ${exception.message}`)
        return responseStatus({ data: null, isError: true, reason: exception.message })
      }

    },
    storeStudentData: async (state, payload) => {
      if (typeof payload !== 'object') {
        console.warn(`[ERR] Payload must be an object, ${typeof payload} given`)
        return responseStatus({ data: null, isError: true, reason: 'INVALID_PAYLOAD' })
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
          return responseStatus({ data: null, isError: true, reason: result.reason })
        }

        const statusCode = result.data.statusCode
        if (statusCode !== 200) return responseStatus({ data: null, isError: true, reason: result.data.reason })

        await state.dispatch('getStudentData')
        return responseStatus({ data: null, isError: false, reason: null })
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat memperbaharui data siswa, ${exception.message}`)
        return responseStatus({ data: null, isError: true, reason: exception.message })
      }

    },
    deleteStudentData: async (state) => {
      await state.dispatch('isLoggedIn')
      const accessToken = Vue.$cookies.get('access-token')
      const studentData = state.getters.getSelectedStudent
      let { _id: studentId, fullname } = studentData
      let student = {
        'student-id': studentId
      }

      try {
        const result = await Request.DeleteStudent(accessToken, student)
        if (result.isError) {
          console.warn(result.reason)
          state.commit('setNotification', `Terjadi kesalahan saat menghapus data siswa, ${result.reason}`)
          return responseStatus({ data: null, isError: true, reason: result.reason })
        }

        const statusCode = result.data.statusCode
        if (statusCode !== 200) return responseStatus({ data: null, isError: true, reason: result.data.reason })

        await state.dispatch('getStudentData')
        state.commit('setNotification', `Data siswa dengan nama ${fullname} berhasil dihapus`)
        return responseStatus({ data: null, isError: false, reason: null })
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat menghapus data siswa, ${exception.message}`)
        return responseStatus({ data: null, isError: true, reason: exception.message })
      }
    },
    getParentData: async (state) => {
      await state.dispatch('isLoggedIn')
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
    },
    updateParentData: async (state) => {
      await state.dispatch('isLoggedIn')
      const accessToken = Vue.$cookies.get('access-token')
      const parentData = state.getters.getSelectedParent
      let { id, fullname, nik, email, phone_number } = parentData
      let parent = {
        'parent-id': id,
        nik: nik,
        fullname: fullname,
        email: email,
        'phone-number': phone_number
      }

      try {
        const result = await Request.UpdateParent(accessToken, parent)
        if (result.isError) return responseStatus({ data: null, isError: true, reason: result.reason })
        if (result.data.statusCode !== 200) return responseStatus({ data: result.data.data, isError: true, reason: result.data.reason })
        await state.dispatch('getParentData')
        return responseStatus({ data: result.data.data, isError: false, reason: null })
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat memperbaharui data orang tua, ${exception.message}`)
      }
    },

    storeParentData: async (state, payload) => {
      if (typeof payload !== 'object') {
        console.warn(`Payload must be an object, ${typeof payload} given`)
        return responseStatus({ data: null, isError: true, reason: `Payload must be an object, ${typeof payload} given` })
      }

      await state.dispatch('isLoggedIn')
      const accessToken = Vue.$cookies.get('access-token')
      const parentData = payload
      let { fullname, nik, email, phone_number } = parentData
      let parent = {
        nik: nik,
        fullname: fullname,
        email: email,
        'phone-number': phone_number
      }

      try {
        const result = await Request.StoreParent(accessToken, parent)
        if (result.isError) return responseStatus({ data: null, isError: true, reason: result.reason })
        if (result.data.statusCode !== 200) return responseStatus({ data: result.data.data, isError: true, reason: result.data.reason })
        await state.dispatch('getParentData')
        return responseStatus({ data: result.data.data, isError: false, reason: null })
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat menambahkan data orang tua, ${exception.message}`)
      }
    },

    deleteParentData: async (state) => {
      await state.dispatch('isLoggedIn')
      const accessToken = Vue.$cookies.get('access-token')
      const parentData = state.getters.getSelectedParent
      let { id, fullname } = parentData
      let parent = {
        'parent-id': id
      }

      try {
        const result = await Request.DeleteParent(accessToken, parent)
        if (result.isError) {
          console.warn(result.reason)
          state.commit('setNotification', `Terjadi kesalahan saat menghapus data orang tua, ${result.reason}`)
          return responseStatus({ data: null, isError: true, reason: result.reason })
        }

        const statusCode = result.data.statusCode
        if (statusCode !== 200) return responseStatus({ data: null, isError: true, reason: result.data.reason })

        await state.dispatch('getParentData')
        state.commit('setNotification', `Data orang tua dengan nama ${fullname} berhasil dihapus`)
        return responseStatus({ data: null, isError: false, reason: null })
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat menghapus data orang tua, ${exception.message}`)
        return responseStatus({ data: null, isError: true, reason: exception.message })
      }
    },
    getAttendanceData: async (state) => {
      await state.dispatch('isLoggedIn')
      const accessToken = Vue.$cookies.get('access-token')
      try {
        const responseStatus = await Request.GetAttendance(accessToken)
        if (responseStatus.isError) {
          state.commit('setNotification', `Terjadi kesalahan saat merequest kehadiran siswa, ${responseStatus.reason}`)
          return
        }

        if (responseStatus.data.statusCode === 200) {
          let attendances = responseStatus.data.data
          state.commit('setAttendanceData', attendances)
        }
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat merequest kehadiran siswa, ${exception.message}`)

      }
    },
    getAbsenceData: async (state) => {
      await state.dispatch('isLoggedIn')
      const accessToken = Vue.$cookies.get('access-token')
      try {
        const responseStatus = await Request.GetAbsence(accessToken)
        if (responseStatus.isError) {
          state.commit('setNotification', `Terjadi kesalahan saat merequest ketidakhadiran siswa, ${responseStatus.reason}`)
          return
        }

        if (responseStatus.data.statusCode === 200) {
          let absences = responseStatus.data.data
          state.commit('setAbsenceData', absences)
        }
      } catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat merequest ketidakhadiran siswa, ${exception.message}`)
      }
    },
    updateAttendance: async (state, payload) => {
      if (typeof payload !== 'object') {
        console.warn(`Payload must be an object, ${typeof payload} given`)
        console.log(payload)
        return responseStatus({ data: null, isError: true, reason: `Payload must be an object, ${typeof payload} given` })
      } 
      const accessToken = Vue.$cookies.get('access-token')
      state.commit('setNotification', `Memperbaharui status kehadiran ...`)

      try {
        const responseStatus = await Request.UpdateAttendance(accessToken, payload)
        if (responseStatus.isError ) {
          state.commit('setNotification', `Terjadi kesalahan saat merequest ketidakhadiran siswa, ${responseStatus.reason}`)
          return
        } 
        if(responseStatus.data.statusCode !== 200) {
          state.commit('setNotification', `Terjadi kesalahan saat merequest ketidakhadiran siswa, ${responseStatus.reason}`)
          return
        } 

        // Update attendance data
        await state.dispatch('getAttendanceData')
        state.commit('setNotification', `Status berhasil diperbaharui`)
      }
      catch (exception) {
        console.warn(exception.message)
        state.commit('setNotification', `Terjadi kesalahan saat merequest ketidakhadiran siswa, ${exception.message}`)
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
    },
    getAttendances: state => {
      return state.attendanceData
    },
    getUserData: state => {
      return state.userData
    },
    getAbsences: state => {
      return state.absenceData
    }
  },

})