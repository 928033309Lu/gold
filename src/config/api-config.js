/**
 * 后端服务配置信息
 */

const mapApisConfig = {
  section: {
    url: '/section?crossline={0}',
    method: 'get'
  },
  getElevation: {
    url: '/elevation?x={0}&y={1}',
    method: 'get'
  },
  geoQuery: {
    url: '/query-data'
  }
}
export default mapApisConfig