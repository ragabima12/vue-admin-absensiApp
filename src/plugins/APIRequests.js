import Axios from 'axios'

let responseStatus = {
    isError: false,
    data: null,
    reason: null
}

const Request = async (reqUrl, reqMethod, reqBody, reqHeaders) => {
    let response = {...responseStatus}

    if( typeof reqUrl !== 'string' || reqUrl == ''){
        response.isError = true
        response.reason = `Request Url must be a string, ${typeof reqUrl} given`
        return response
    }

    if( typeof reqMethod !== 'string'){
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
    let response = {...responseStatus}
    if( typeof username !== 'string' || typeof password !== 'string'){
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
    if( requestResponse.isError ){
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }
    
    response.data = requestResponse.data
    return response

}

const TokenUpgrade = async(accessToken, refreshToken) => {
    let response = {...responseStatus}
    if( typeof accessToken !== 'string' || typeof refreshToken !== 'string'){
        response.isError = true
        response.reason = `Access token and Refresh token must be a string, given ${typeof accessToken} on Access Token, and ${typeof refreshToken} on Refresh Token`
        return response
    }
    const url = `${process.env.VUE_APP_API_HOST}/api/v1/auth/token`
    const method = 'GET'
    const headers = {
        'Access-Token': accessToken,
        'Refresh-Token': refreshToken
    }

    const requestResponse = await Request(url, method, null, headers)
    if( requestResponse.isError ){
        response.isError = true
        response.reason = `Error when requesting to API server with error : ${requestResponse.reason}`
        return response
    }
    
    response.data = requestResponse.data
    return response
}

export default { Login, TokenUpgrade}