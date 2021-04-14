import Axios from 'axios'
Axios.defaults.withCredentials = true

let responseStatus = {
    isError: false,
    data: null,
    reason: null
}

const Request = async (reqUrl, reqMethod, reqBody, reqHeaders) => {
    let response = { ...responseStatus }

    if (typeof reqUrl !== 'string' || reqUrl == '') {
        response.isError = true
        response.reason = `Request Url must be a string, ${typeof reqUrl} given`
        return response
    }

    if (typeof reqMethod !== 'string') {
        response.isError = true
        response.reason = `Request Method must be a string, ${typeof reqMethod} given`
        return response
    }

    const request = await Axios({
        url: reqUrl,
        method: reqMethod,
        data: reqBody || {},
        headers: reqHeaders || {}
    })

    response.data = request.data
    return response

}

const Login = async (username, password) => {
    let response = { ...responseStatus }
    if (typeof username !== 'string' || typeof password !== 'string') {
        response.isError = true
        response.reason = `Username and Password must be a string, given ${typeof username} on username, and ${typeof password} on password`
        return response
    }
    const url = `${process.env.VUE_APP_API_HOST}/api/v1/auth/login`
    const method = 'POST'
    const data = {
        username: username,
        password: password
    }

    const requestResponse = await Request(url, method, data)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response

}

const TokenUpgrade = async (accessToken, refreshToken) => {
    let response = { ...responseStatus }
    const url = `${process.env.VUE_APP_API_HOST}/api/v1/auth/token`
    const method = 'GET'
    const headers = {
        'Access-Token': accessToken || '',
        'Refresh-Token': refreshToken || ''
    }

    const requestResponse = await Request(url, method, null, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const UploadExcelFile = async (accessToken, base64, isTruncate=false) => {
    let response = { ...responseStatus }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student?excel=true&truncate=${isTruncate}`
    const method = 'POST'
    const headers = {
        'Access-Token': accessToken  || '',
    }
    const data = {
        'excel-file': base64
    }

    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const GetStudents = async (accessToken) => {
    let response = { ...responseStatus }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student`
    const method = 'GET'
    const headers = {
        'Access-Token': accessToken || '',
    }

    const requestResponse = await Request(url, method, null, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const UpdateStudent = async (accessToken, studentData) => {
    let response = { ...responseStatus }

    if (typeof studentData !== 'object') {
        response.isError = true
        response.reason = `Student data must be an object, ${typeof studentData} given`
        return response
    }
    
    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student`
    const method = 'PATCH'
    const headers = {
        'Access-Token': accessToken || '',
    }
    const data = studentData
    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const StoreStudent = async (accessToken, studentData) => {
    let response = { ...responseStatus }

    if (typeof studentData !== 'object') {
        response.isError = true
        response.reason = `Student data must be an object, ${typeof studentData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student`
    const method = 'POST'
    const headers = {
        'Access-Token': accessToken || '',
    }
    const data = studentData
    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const DeleteStudent = async (accessToken, studentData) => {
    let response = { ...responseStatus }

    if (typeof studentData !== 'object') {
        response.isError = true
        response.reason = `Student data must be an object, ${typeof studentData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student`
    const method = 'DELETE'
    const headers = {
        'Access-Token': accessToken || '',
    }
    const data = studentData
    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}
const GetAttendance = async (accessToken) => {
    let response = { ...responseStatus }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/attendance`
    const method = 'GET'
    const headers = {
        'Access-Token': accessToken || '',
    }

    const requestResponse = await Request(url, method, null, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}


const GetAbsence = async (accessToken) => {
    let response = { ...responseStatus }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/absence`
    const method = 'GET'
    const headers = {
        'Access-Token': accessToken || '',
    }

    const requestResponse = await Request(url, method, null, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const UpdateAttendance = async (accessToken, payload) => {
    let response = { ...responseStatus }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/attendance`
    const method = 'PATCH'
    const data = payload

    const requestResponse = await Request(url, method, data)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const StoreAbsence = async (accessToken, absenceData) => {
    let response = { ...responseStatus }

    if (typeof absenceData !== 'object') {
        response.isError = true
        response.reason = `Absence Data must be an object, ${typeof absenceData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/absence`
    const method = 'POST'
    const headers = {
        'Access-Token': accessToken || '',
    }
    const data = absenceData
    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const UpdateConfig = async (accessToken, payload) => {
    let response = {...responseStatus}

    if (typeof payload !== 'object') {
        response.isError = true
        response.reason = `Payload must be an object, ${typeof absenceData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/config`
    const method = 'PATCH'
    const headers = {
        'Access-Token': accessToken || '',
    }
    const data = payload

    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}
const GetConfig = async (accessToken) => {
    let response = {...responseStatus}

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/config`
    const method = 'GET'
    const headers = {
        'Access-Token': accessToken || '',
    }
    

    const requestResponse = await Request(url, method, null, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const UpdateAccountPassword = async (accessToken, payload) => {
    let response = {...responseStatus}

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/account/password`
    const method = 'PATCH'
    const headers = {
        'Access-Token': accessToken || '',
    }
    const data = payload
    

    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const StoreAccount = async (accessToken, payload) => {
    let response = {...responseStatus}

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/account`
    const method = 'POST'
    const headers = {
        'Access-Token': accessToken || '',
    }
    const data = payload
    

    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const GetAccount = async (accessToken) => {
    let response = {...responseStatus}

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/account`
    const method = 'GET'
    const headers = {
        'Access-Token': accessToken || '',
    }
    

    const requestResponse = await Request(url, method, null, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const UpdateAccount = async (accessToken, payload) => {
    let response = {...responseStatus}

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/account`
    const method = 'PATCH'
    const headers = {
        'Access-Token': accessToken || '',
    }
    
    const data = payload

    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}


export default {
    Login,
    TokenUpgrade,
    UploadExcelFile,
    GetStudents,
    UpdateStudent,
    StoreStudent,
    DeleteStudent,
    GetAttendance,
    GetAbsence,
    UpdateAttendance,
    StoreAbsence,
    UpdateConfig,
    GetConfig,
    StoreAccount,
    GetAccount,
    UpdateAccountPassword,
    UpdateAccount
}