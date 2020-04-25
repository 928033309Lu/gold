import html2canvas from 'html2canvas'

const htmlCanvas = function (callback) {
  html2canvas(document.querySelector('#bodyCanvas'), {
    backgroundColor: null,
    useCORS: true,
    allowTaint: true,
    taintTest: false,
    width: document.querySelector('#bodyCanvas').clientWidth,
    height: document.querySelector('#bodyCanvas').clientHeight,
    scale: true
    // windowWidth: 200,
    // windowHeight: 126
    // x: 250
  }).then((canvas) => {
    if (!canvas) {
      callback(null)
      return
    }
    // canvas.width = 200
    // callback(canvas.toDataURL('image/png'))
    callback(canvas.toDataURL('image/jpeg', 0.5))
  })
}
export default htmlCanvas
