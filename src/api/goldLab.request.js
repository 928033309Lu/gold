import { labPost, labPut, labGet } from './request.js'

// txt解析接口
export function txtConfirmRead (data = {}, config = {}) {
  return labPost('/wind-service/info', data, config)
}

// txt 上传接口
export function txtConfirmPut (ensureId, data, config) {
  return labPut('/wind-service/info/' + ensureId, data, config)
}

// txt 上传后轮询接口
export function txtConfirmLoop (ensureId) {
  return labGet('/wind-service/check-auto/' + ensureId)
}

// 文档 http://wind-java-be.windlab.wrinternal.goldwind.com.cn/swagger-ui.html#/wind-service-controller/sixPicPageUsingGET_1
// txt 获取六个图数据  展示用
export function getTxtData (ensureId, data) {
  return labGet('/wind-service/windParams/data/' + ensureId, data)
}


