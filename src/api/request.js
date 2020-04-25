import envConfig from '@/config/env-config.js'
import mapApisConfig from '@/config/api-config'
import apisConfig from '@/config/api-config-map'
import { Message } from 'element-ui'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import { getToken } from '@/utils/auth'
import store from '@/store/index'

axios.defaults.withCredentials = true // 携带cookie
const http = {}
// 后端这边的请求
// 默认请求
http.axios = axios.create({
  baseURL: envConfig.apiBaseUrl,
  timeout: 40000
})
// 陈煜那边接口请求
http.goldLab = axios.create({
  baseURL: '/goldLab',
  timeout: 40000
})

//
http.amap = axios.create({
  baseURL: envConfig.amapUrl,
  timeout: 50000
})
// gis这边的请求
// 集电线路
http.jdxl = axios.create({
  baseURL: envConfig.jdxlUrl,
  timeout: 50000
})
// 线路
http.line = axios.create({
  baseURL: envConfig.xianluUrl,
  timeout: 50000
})
// 后评估
http.assess = axios.create({
  baseURL: envConfig.assessUrl,
  timeout: 50000
})

// 请求拦截器--后端这边
http.axios.interceptors.request.use(
  config => {
    const token = getToken() // 本地存的token
    if (store.state.app.language == 'en') {
      config.headers['language'] = 'en'
    }
    if (token) {
      config.headers.Authorization = token
    }
    const contentType = config.headers['Content-Type']
    if ((config.method === 'post' || config.method === 'put') && (contentType && contentType != null && contentType.indexOf('application/json') > -1)) {
      config.headers['Content-Type'] = 'application/json'
    } else if ((config.method === 'post' || config.method === 'put') &&
        (!config.headers['Content-Type'] || config.headers['Content-Type'].indexOf('multipart') < 0)) {
      config.data = qs.stringify(config.data)
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    Message.error('err: 请求错误...')
    return Promise.error(error)
  })
// 响应拦截器
http.axios.interceptors.response.use(
  response => {
    // console.log(response)
    responseHandler(response.data.code)
    return response
  },
  error => {
    store.dispatch('handleLoading', { loading: false })
    // 跳转错误页面
    responseHandler('服务错误')
    return Promise.reject(error)
  }
)
// 返回操作
function responseHandler (code) {
  if (code === 403) {
    // console.log(router)
    router.replace({ path: '/login', query: { rool: true }})
  }
  if (code >= 500 || code === '服务错误') { // 服务器错误
    // router.push('/error/' + code)
  }
}

// 默认请求
function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    http.axios.get(url, {
      params: params
    })
      .then(res => {
        if (res.data.code === 403) return
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}

function post (url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    http.axios.post(url, data, config)
      .then(res => {
        if (res.data.code === 403) return
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}

function deleteOut (url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    http.axios.delete(url, data, config)
      .then(res => {
        if (res.data.code === 403) return
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}

function put (url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    http.axios.put(url, data, config)
      .then(res => {
        if (res.data.code === 403) return
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}
// 陈煜那边的请求
function labPost (url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    http.goldLab.post(url, data, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}
function labGet (url, params, config) {
  return new Promise((resolve, reject) => {
    http.goldLab.get(url, {
      params: params
    }, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}
function labPut (url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    http.goldLab.put(url, data, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}



// --------- 旧项目的接口请求-----------
// 集电线路
function jdxlGet (url, params = {}) {
  return new Promise((resolve, reject) => {
    http.jdxl.get(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}

function jdxlPost (url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    http.jdxl.get(url, data, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}

// 线路
function lineGet (url, params = {}) {
  return new Promise((resolve, reject) => {
    http.line.get(url, {
      params: params
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}

function linePost (url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    http.line.get(url, data, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}

// 后评估
function assessGet (url, params = {}) {
  return new Promise((resolve, reject) => {
    http.assess.get(url, {
      params: params
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}

function assessPost (url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    http.assess.get(url, data, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        Message.error('err: 请求错误')
        reject(err)
      })
  })
}
// 获取经纬度
function mapGet (url, data = {}) {
  return new Promise((resolve, reject) => {
    http.amap.get(url, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const service = {}
http.service = axios.create({ timeout: 30000 })
/**
 * 获取点位高程信息
 * @param {Number} lon 经度
 * @param {Number} lat 纬度
 * @param {Function} callback
 */
service.getElevation = function (lon, lat, callback) {
  return $J.requestUtil.requestService({
    request: http.service,
    apisConfig: mapApisConfig,
    apiRootUrl: envConfig.apiBaseUrlElevation,
    apiName: 'getElevation',
    apiUrlParams: [lon, lat],
    callback
  })
}

/**
 * 请求地图处理相关API
 */
service.map = function (apiName, apiUrlParams, callback) {
  return $J.requestUtil.requestService({
    request: http.service,
    apisConfig: apisConfig,
    apiRootUrl: envConfig.apiBaseUrlMap,
    apiName,
    apiUrlParams,
    callback
  })
}

export {
  get,
  post,
  deleteOut,
  put,
  jdxlGet,
  jdxlPost,
  lineGet,
  linePost,
  assessGet,
  assessPost,
  mapGet,
  service,
  labPost,
  labGet,
  labPut
}
