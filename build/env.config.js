/**
 * 所有环境公用的基础配置
 */
const publicConfig = {
  APP_TITLE: '"GoldFarm"',
  APP_VERSION: `'${require('../package.json').version}'`,
  APP_BUILD_TIME: `'${require('dayjs')().format('YYYYMMDD')}'`,

  VUE_APP_API_MAP: '"/section"', // 数据功能模块服务地址 http://10.12.3.135:6500
  // VUE_APP_API_MAP: '"http://1.202.243.97:8008"', // 数据功能模块服务地址 http://10.12.3.135:6500
  // VUE_APP_API_ELELVATION: '"http://10.35.191.98:5000"', // （姜云鹏）高程服务地址
  VUE_APP_API_ELELVATION2: '"http://10.12.3.134:8010"', // （郭俊伟）高程服务地址
  PRICK_PAGE_URL: '"http://52.83.252.242:7001/"',
  ASSESS_URL: '"http://www.windtrump.com"',
  JDXL_URL: '"http://10.12.50.38:8008/jdxl"',
  // AMAP_URL: '"http://restapi.amap.com/v3"',
 
};
const merge = function (env) {
  return Object.assign({}, publicConfig, env)
}
/**
 * 
 * 系统环境变量配置
 * 在/src/config/env-config.js中有对应的信息
 */
const envConfig = {
  "local": merge({
    NODE_ENV: '"local"',
    BASE_API: '"/v2"', 
    XIAN_LU_URL: '"http://1.202.243.97:8008/jdxl"',
    S3_PATH: '"https://goldfarm-dev.s3.cn-northwest-1.amazonaws.com.cn"',
    AMAP_URL: '"/geocode"',
    VUE_APP_API_ELELVATION: '"/elevation"', // （姜云鹏）高程服务地址
  }),
  "development": merge({
    NODE_ENV: '"development"',
    BASE_API: '"/v2"', 
    XIAN_LU_URL: '"http://1.202.243.97:8008/jdxl"',
    S3_PATH: '"https://goldfarm-dev.s3.cn-northwest-1.amazonaws.com.cn"',
    AMAP_URL: '"/geocode"',
    VUE_APP_API_ELELVATION: '"/elevation"', // （姜云鹏）高程服务地址
  }),
  "testing": merge({
    NODE_ENV: '"testing"',
    BASE_API: '"http://10.35.190.103:5001/v2/"',
    XIAN_LU_URL: '"http://1.202.243.97:8008/jdxl_test"',
    S3_PATH: '"https://goldfarm-test.s3.cn-northwest-1.amazonaws.com.cn"',
    AMAP_URL: '"/geocode"',
    VUE_APP_API_ELELVATION: '"/elevation"', // （姜云鹏）高程服务地址
  }),
  "production": merge({
    NODE_ENV: '"production"',
    BASE_API: '"/"', 
    XIAN_LU_URL: '"http://1.202.243.97:8008/jdxl_prod"',
    S3_PATH: '"https://goldfarm-prod.s3.cn-northwest-1.amazonaws.com.cn"',
    AMAP_URL: '"http://restapi.amap.com/v3"',
    VUE_APP_API_ELELVATION: '"/elevation"', // （姜云鹏）高程服务地址
  })
}

module.exports = envConfig