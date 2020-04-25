import store from '../../store'
const comparisonLayer = {}

let schemeCompareModule = null

comparisonLayer.enter = function (hasTerrain) {
    comparisonLayer.exit()
  if (!schemeCompareModule) {
    schemeCompareModule = new WindEarth.SchemeCompareModule(gwmap.viewer, {
      hasTerrain: hasTerrain
    })
    
    schemeCompareModule.enterSchemeCompare()
  }
  schemeCompareModule && schemeCompareModule.mouseMoveEvent.addEventListener((event)=>{
    if (event.infos.length > 0){
      // console.log('鼠标悬停重叠风机信息：', event)
      store.commit('mouseMoveList', event)
    }else{
      store.commit('mouseMoveList', {
        infos: [],
        pos: {
          x: 0,
          y: 0
        }
      })
    }
  })
}

comparisonLayer.addScheme = function (checked, item, data) {
  if (checked) {
    console.log(data)
    schemeCompareModule.createSchemeTurbines(item.scheme_id, {
      imgUrl: item.imgUrl,
      color: item.color
    }, data)
  }
}
comparisonLayer.removeScheme = function (scheme_id) {
  schemeCompareModule.removeSchemeTurbines(scheme_id)
  
}
// 单个方案的标签开关
comparisonLayer.layerFlag = function (scheme_id, checked) {
  if (!schemeCompareModule) return
  schemeCompareModule.setSchemeTurbineLabelVisible(scheme_id, checked)
}


comparisonLayer.exit = function () {
  if (!schemeCompareModule) return
  schemeCompareModule.exitSchemeCpmpare()
  schemeCompareModule = null
}



export default comparisonLayer