const envConfig = {
  appNodeEnv: process.env.NODE_ENV,
  appVersion: process.env.APP_VERSION,
  appBuildTime: process.env.APP_BUILD_TIME,
  appTitle: process.env.APP_TITLE,
  apiBaseUrl: process.env.BASE_API,
  apiBaseUrlMap: process.env.VUE_APP_API_MAP,
  apiBaseUrlElevation: process.env.VUE_APP_API_ELELVATION,
  apiBaseUrlElevation2: process.env.VUE_APP_API_ELELVATION2,
  prickPageUrl: process.env.PRICK_PAGE_URL,
  assessUrl: process.env.ASSESS_URL,
  jdxlUrl: process.env.JDXL_URL,
  amapUrl: process.env.AMAP_URL,
  xianluUrl: process.env.XIAN_LU_URL,
  S3Path: process.env.S3_PATH
}

export default envConfig
