
import store from '../../store'
const fanLayer = {}

let featureEntityLayer = null
let featureEntity = null
let arr = []

fanLayer.load = function () {
  fanLayer.remove()
  if (!featureEntityLayer) {
    featureEntityLayer = new WindEarth.FeatureEntityLayer(gwmap.viewer, {
      id: 'fan'
    })
    featureEntityLayer.bindMouseEventFunc(WindEarth.MouseEventType.LEFT_CLICK, function (e) {
      if (!e.feature || !e.position) {
        store.commit('clickEarthFan', null)
      } else {
        let obj = {}
        obj.x = e.position.x
        obj.y = e.position.y
        obj.id = e.feature._id
        store.commit('clickEarthFan', obj)
      }
    })
  }
}
fanLayer.add = function (data) {
  if (!data) {
    return
  }
  featureEntity = new WindEarth.BillBoardFeatureEntity({
    name: '',
    id: data.project_id,
    positions: [data.longitude, data.latitude, 0],
    styleOptions: {
      url: '/images/fan.png',
      heightReference: 1,
      scale: 1,
      width: 52,
      height: 62,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      scaleByDistance: new WindEarth.NearFarScalar(2000, 1, 4000000, 0.65),
      distanceDisplayCondition: {
        near: 400000
      }
    }
  })
  featureEntityLayer.addFeatureEntity(featureEntity)
  arr.push(featureEntity)
}

fanLayer.remove = function () {
  if (!featureEntityLayer) {
    return
  }
  for (let i = 0; i <= arr; i++) {
    featureEntityLayer.removeFeatureEntity(arr[i])
  }
  featureEntityLayer.removeFromViewer()
  featureEntityLayer = null
  featureEntity = null
  arr = []
}
export default fanLayer
