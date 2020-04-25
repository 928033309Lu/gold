const scoutingLayer = {}

let kmlLayer = null
scoutingLayer.load = function (url) {
  scoutingLayer.remove()
  if (!url) {
    return
  }
  if (!kmlLayer) {
    kmlLayer = new WindEarth.KmlLayer(gwmap.viewer)
  }
  kmlLayer.loadData({
    url: url,
    clampToGround: true
  })
  kmlLayer.addToViewer()
  kmlLayer.layerLocation()
}

scoutingLayer.zoomToLayer = function () {
  kmlLayer && kmlLayer.layerLocation()
}

scoutingLayer.remove = function () {
  kmlLayer && kmlLayer.removeFromViewer()
  kmlLayer = null
}
export default scoutingLayer
