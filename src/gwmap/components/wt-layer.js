import store from '../../store'
const wtLayer = {}
let wtModule = null
let wtFeatureLayer = null
let ellipseLayer = null
let arrDataList = []
wtLayer.load = function (dataList) {
  wtLayer.remove()
  if (!dataList) return
  wtModule = new WindEarth.ModelWithBillboardModule(gwmap.viewer)
  dataList.forEach((item, index) => {
    wtModule.loadModelWithBillboard({
      id: item.turbine_id,
      name: item.turbine_name,
      positions: [item.longitude || item.coordinate_x, item.latitude || item.coordinate_y, item.elevation || 0],
      url: '/models/turbine25.glb',
      highLightColor: 'green'
    })
  })
  wtModule.layerLocation()
}
wtLayer.locationModel = name => {
  wtModule.modelLocation([name])
  wtModule.setModelHighLight(name, true)
}

wtLayer.loadWt = function (dataList, call) {
  wtLayer.remove()
  if (!dataList) return
  if (!wtFeatureLayer) {
    wtFeatureLayer = new WindEarth.FeatureEntityLayer(gwmap.viewer)
    wtFeatureLayer.bindMouseEventFunc(WindEarth.MouseEventType.LEFT_CLICK, (res) => {
      // console.log(res)
      if (!res.feature || !res.position) {
        store.commit('clickFanWt', null)
      } else {
        if (!String(res.feature.id).includes('_label')) {
          store.commit('clickFanWt', Object.assign({
            x: res.position.x,
            y: res.position.y
          }, res.feature.styleOptions.turbine))
        } else {
          wtLayer.zoomToFeature(res.feature._id)
        }
      }
    })
  }
  arrDataList = dataList
  dataList.forEach((item, index) => {
    gwmap.getLonLatHeight([[Number(item.longitude || item.coordinate_x), Number(item.latitude || item.coordinate_y), Number(0)]], (callback)=>{
      // console.log(callback[0][2])
      if (callback) {
        item.heights = callback[0][2] || 0
      } else {
        item.heights = 0
      }
      createWtModel(item)
      if (index === dataList.length - 1) {
        call()
      }
    })
  })
}
// 定位当前风机
wtLayer.zoomToFeature = function (wt_id, t, y) {
  console.log('风机定位id: ', wt_id)
  let entities = null
  if (Array.isArray(wt_id)) {
    entities = wt_id.map(v => {
      return wtFeatureLayer.getFeatureEntityById(v)
    })
  } else {
    entities = wtFeatureLayer.getFeatureEntityById(wt_id)
  }
  gwmap.viewer.flyTo(entities, {
    duration: 1,
    offset: new WindEarth.HeadingPitchRange(0, t || -0.4, y || 1000)
  })
}

// 修改风机label属性
wtLayer.changeWtProperty = (id, color) => {
  if (!wtFeatureLayer) return
  const labelFeature = wtFeatureLayer.getFeatureEntityById(id + '_label')
  if (!labelFeature) return
  const name = labelFeature.styleOptions.name
  labelFeature.changeFeatureProperty({
    styleOptions: {
      url: getLabel(name, color).url
    }
  })
}

wtLayer.remove = function () {
  // if (!wtModule) return
  // wtModule.removeAll()
  // wtModule = null

  if (!wtFeatureLayer) return
  wtFeatureLayer.undindMouseEventFunc(WindEarth.MouseEventType.LEFT_CLICK)
  wtFeatureLayer.removeFromViewer()
  wtFeatureLayer = null
}

wtLayer.removeEllipse = () => {
  if (!ellipseLayer) return
  ellipseLayer.removeFromViewer()
  ellipseLayer = null
}
wtLayer.loadWtEllipse = (param, wtList) => {
  wtLayer.removeEllipse()
  if (!wtList) return
  if (!ellipseLayer) {
    ellipseLayer = new WindEarth.FeatureEntityLayer(gwmap.viewer)
  }
  wtList.forEach(item => {
    gwmap.getLonLatHeight([[Number(item.longitude || item.coordinate_x), Number(item.latitude || item.coordinate_y), Number(0)]], (callback)=>{
      if (callback) {
        item.heights = callback[0][2] || 0
      } else {
        item.heights = 0
      }
      createWtEllipse(item, param)
    })
  })
}

// 风机范围定位
wtLayer.layerLocation = function (t, y) {
  if (!wtFeatureLayer) return
  wtFeatureLayer.locationLayer({
    offset: new WindEarth.HeadingPitchRange(0, t || -0.3, y || 25000) // -0.2, 16000
  })
}


// 标签显影
wtLayer.lableShow = function (id, isShow) {
  if (!wtFeatureLayer || arrDataList.length <= 0) return
  arrDataList.forEach((item, index) => {
    var labelFs = wtFeatureLayer.getFeatureEntityById(item.turbine_id + '_label')
    labelFs._show = isShow
  })
}


export default wtLayer






// 添加标签and模型
function createWtModel (item) {
  const labelEntity = addLabelLayer(item)
  wtFeatureLayer.addFeatureEntity(labelEntity)
  const modelEntity = addModelLayer(item)
  wtFeatureLayer.addFeatureEntity(modelEntity)
  // console.log(wtFeatureLayer)
  wtLayer.layerLocation()
}
// 模型
function addModelLayer (item) {
  const modelEntity = new WindEarth.ModelFeatureEntity({
    id: item.turbine_id,
    positions: [item.longitude || item.coordinate_x, item.latitude || item.coordinate_y, item.heights || 0],
    orientation: {
      head: 0,
      tilt: 0,
      roll: 0
    },
    styleOptions: {
      turbine: item,
      url: '/models/205-3.gltf',
      heightReference: 0,
      // color: color,
      colorBlendAmount: 0.9,
      colorBlendMode: WindEarth.ColorBlendMode.HIGHLIGHT,
      scale: 1,
      minimumPixelSize: 20,
      maximumScale: 5,
      distanceDisplayCondition: {
        near: 0,
        far: 50000
      }
    }
  })
  return modelEntity
}
// 标签
function addLabelLayer (item, isHighLight) {
  const itemLabel = getLabel(item, isHighLight)
  const labelEntity = new WindEarth.BillBoardFeatureEntity({
    id: item.turbine_id + '_label',
    // name: item.turbine_name,
    positions: [item.longitude || item.coordinate_x, item.latitude || item.coordinate_y, item.heights || 0],
    styleOptions: {
      url: itemLabel.url,
      name: item.turbine_name,
      // scale: 1,
      heightReference: 0,
      width: itemLabel.width,
      height: itemLabel.height,
      eyeOffset: new WindEarth.Cartesian3(0, 0, -100),
      pixelOffset: new WindEarth.Cartesian2(26, 0), // 左右，前后
      scaleByDistance: new WindEarth.NearFarScalar(2000, 1.2, 7500, 0.5),
      distanceDisplayCondition: {
        // near: 10,
        // far: 50000
      },
      disableDepthTestDistance: 0
    }
  })
  return labelEntity
}
function getLabel (turbine, color) {
  let canvas = null
  let ctx = null
  const result = {
    url: '',
    width: 74,
    height: 93
  }
  canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 166
  ctx = canvas.getContext('2d')
  // ctx.fillStyle = color || 'rgba(235,242,228,1)'
  ctx.fillStyle = color || (turbine.checked && turbine.checked !== '0') ? '#2cd0b9' : '#8883FF'
  ctx.beginPath()
  ctx.arc(64, 89, 61, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#EBF2E4'
  ctx.lineWidth = '4'
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(52, 145)
  ctx.lineTo(76, 145)
  ctx.lineTo(64, 162)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(51, 149)
  ctx.lineTo(64, 162)
  ctx.lineTo(77, 149)
  ctx.stroke()

  ctx.font = '36px bolder Microsoft YaHei'
  // ctx.fillStyle = color && 'rgba(255, 255, 255, 1)' || 'rgba(95,72,46,1)'
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'
  ctx.textAlign = 'center'// 文字水平居中 并且将fillText的第二个参数设置为ctx width的一半
  ctx.fillText(turbine.turbine_name, 64, 107)
  result.url = canvas.toDataURL('image/png', 1.0)
  return result
}

// 添加椭圆
function createWtEllipse (item, param) {
  const ellipseEntity = addEllipseLayer(item, param)
  ellipseLayer.addFeatureEntity(ellipseEntity)
}
// 椭圆
function addEllipseLayer (item, param) {
  const d = item.drotor
  const ellipseEntity = new WindEarth.Entity({
    position: WindEarth.Cartesian3.fromDegrees(item.longitude || item.coordinate_x, item.latitude || item.coordinate_y, item.heights || 0),
    name: item.nearest_turbine_name,
    ellipse: {
      semiMajorAxis: Number(param.radiusLong) * d,
      semiMinorAxis: Number(param.radiusShort) * d,
      fill: true,
      material: WindEarth.Color.fromBytes(44, 208, 185).withAlpha(0.5),
      rotation: WindEarth.Math.toRadians(360 - param.direction + 90),
      granularity: Math.PI / 3600.0, // 调节曲线圆润度
      outline: true, // 可选的boolean属性，指定是否绘制椭圆。
      outlineColor: WindEarth.Color.fromBytes(44, 208, 185),	// 可选一个指定Color轮廓的属性。
      outlineWidth: 5
    }
  })
  return ellipseEntity
}
