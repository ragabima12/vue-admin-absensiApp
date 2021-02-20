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

const TokenUpgrade = async () => {
    let response = { ...responseStatus }
    const url = `${process.env.VUE_APP_API_HOST}/api/v1/auth/token`
    const method = 'GET'
    const headers =  {}
    const requestResponse = await Request(url, method, null, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const UploadExcelFile = async (base64) => {
    let response = { ...responseStatus }
    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student`
    const method = 'POST'
    const headers = {}
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

const GetStudents = async () => {
    let response = { ...responseStatus }
    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student`
    const method = 'GET'
    const headers = {}
    const requestResponse = await Request(url, method, null, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const UpdateStudent = async (studentData) => {
    let response = { ...responseStatus }
    if (typeof studentData !== 'object') {
        response.isError = true
        response.reason = `Student data must be an object, ${typeof studentData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student`
    const method = 'PATCH'
    const headers = {}
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

const StoreStudent = async (studentData) => {
    let response = { ...responseStatus }
    if (typeof studentData !== 'object') {
        response.isError = true
        response.reason = `Student data must be an object, ${typeof studentData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student`
    const method = 'POST'
    const headers = {}
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

const DeleteStudent = async (studentData) => {
    let response = { ...responseStatus }

    if (typeof studentData !== 'object') {
        response.isError = true
        response.reason = `Student data must be an object, ${typeof studentData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/student`
    const method = 'DELETE'
    const headers = {}
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

const GetParents = async () => {
    let response = { ...responseStatus }
    const url = `${process.env.VUE_APP_API_HOST}/api/v1/parent`
    const method = 'GET'
    const headers = {}
    const requestResponse = await Request(url, method, null, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const UpdateParent = async (parentData) => {
    let response = { ...responseStatus }
    if (typeof parentData !== 'object') {
        response.isError = true
        response.reason = `Student data must be an object, ${typeof parentData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/parent`
    const method = 'PATCH'
    const headers = {}
    const data = parentData
    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}

const StoreParent = async (parentData) => {
    let response = { ...responseStatus }
    if (typeof parentData !== 'object') {
        response.isError = true
        response.reason = `Student data must be an object, ${typeof parentData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/parent`
    const method = 'POST'
    const headers = {}
    const data = parentData
    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}


const DeleteParent = async (parentData) => {
    let response = { ...responseStatus }
    if (typeof parentData !== 'object') {
        response.isError = true
        response.reason = `Student data must be an object, ${typeof parentData} given`
        return response
    }

    const url = `${process.env.VUE_APP_API_HOST}/api/v1/parent`
    const method = 'DELETE'
    const headers = {}
    const data = parentData
    const requestResponse = await Request(url, method, data, headers)
    if (requestResponse.isError) {
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }

    response.data = requestResponse.data
    return response
}
const GetAttendance = async () => {
    let response = { ...responseStatus }
    const url = `${process.env.VUE_APP_API_HOST}/api/v1/attendance`
    const method = 'GET'
    const headers = {}
    const requestResponse = await Request(url, method, null, headers)
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
    GetParents,
    UpdateParent,
    StoreParent,
    DeleteParent,
    GetAttendance
}