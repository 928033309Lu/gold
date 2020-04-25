import envConfig from '@/config/env-config'
import store from '../../store'

const towerLineNewLayer = {}
let wireModule = null
// 加载线路
towerLineNewLayer.load = function (url) {
  towerLineNewLayer.remove()
  // console.log(envConfig.S3Path)
  wireModule = new WindEarth.WireModule(gwmap.viewer, envConfig.S3Path)
  let promise = wireModule.loadFile(url)
  promise.then((data) => {
    wireModule.parseData(data, { showModel: true, location: true })
  })

  wireModule.towerClickChanged.addEventListener(function (event) {
    console.log(event)
  })
  wireModule.routeClickChanged.addEventListener(function (event) {
    console.log(event)
  })
  
  setTimeout(() => {
    towerLineNewLayer.getLineListInfo()
  }, 2000)
}
// 获取支线列表数据
towerLineNewLayer.getLineListInfo = function () {
  if (!wireModule) return
  let info =  wireModule.getLineListInfo()
  // console.log(info)
  store.commit('setLineListInfo', info)
}
// 获取横断面数据
towerLineNewLayer.getLineCrossSection = function (entities_id) {
  if (!wireModule || !entities_id) return
  console.log(entities_id) // 其中每一段线路的id
  let info =  wireModule.getLineCrossSection(entities_id)
  console.log(info)
}

// 开启编辑
towerLineNewLayer.startEdit = function () {
  
}
// 新增加点
towerLineNewLayer.addNode = function () {
  
}
// 节点编辑
towerLineNewLayer.nodeEdit = function () {
 
}
// 打断节点
towerLineNewLayer.breakEdit = function () {
  
}
// 合并节点
towerLineNewLayer.combineNode = function () {
  
}
// 删除节点
towerLineNewLayer.delEdit = function () {

}
// 退出编辑
towerLineNewLayer.exitEdit = function () {
  
}

// 删除
towerLineNewLayer.remove = function () {
  if (!wireModule) return
  wireModule.removeAll()
}

export default towerLineNewLayer