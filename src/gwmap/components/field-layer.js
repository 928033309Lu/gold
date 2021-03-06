const fieldLayer = {}

let kmlLayer = null
fieldLayer.load = function (url) {
  fieldLayer.remove()
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

fieldLayer.zoomToLayer = function () {
  kmlLayer && kmlLayer.layerLocation()
}

fieldLayer.remove = function () {
  kmlLayer && kmlLayer.removeFromViewer()
  kmlLayer = null
}
export default fieldLayer
