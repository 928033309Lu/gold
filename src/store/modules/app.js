const app = {
  state: {
    northInfoAngle: 0, // 旋转角度
    verifiEpsgModel: 3, // 切换epsg后不同的校验规则
    language: 'zh', // 当前语言 zh / en
    routePath: '', // 当前路由
    measuredlength: null,
    profilePoints: null, // 剖面分析数据
    projectInfo: null, // 当前项目数据
    typeSettingVisible: false, // 查看机型界面
    schemeInfo: null, // 当前方案数据
    scheme_id: null, // 有点位数据就去列表里面的第一个，id不一定是1
    clickMastData: null, // 点击测风塔的返回数据
    clickFanWtData: null, // 点击风机的返回数据
    epsgId: null,
    schemeList: [], // 方案列表数据
    turbineSchemeList: [], // 当前方案机位点列表数据
    comparison: false, // 比选模块
    mouseMoveList: [], // 移入重叠的点位数据
    comparisonDetalisData: null, // 发电量详情框数据
    pptModel: null, // 演示模式 编辑/播放
    lineListInfo: null // 线路右下角框 支线列表数据
  },
  mutations: {
    setLineListInfo (state, data) {
      state.lineListInfo = data
    },
    northInfoAngle (state, data) {
      state.northInfoAngle = data
    },
    comparisonDetalisData (state, data) {
      state.comparisonDetalisData = data
    },
    mouseMoveList (state, data) {
      state.mouseMoveList = data
    },
    setTurbineScheme (state, data) {
      state.turbineSchemeList = data
    },
    setSchemeList (state, data) {
      state.schemeList = data
    },
    openComparison (state, data) {
      state.comparison = data
    },
    setPPtModel (state, data) {
      state.pptModel = data
    },
    setEpsgId (state, data) {
      state.epsgId = data
      console.log(state.epsgId)
    },
    clickMast (state, data) {
      state.clickMastData = data
      console.log(state.clickMastData)
    },
    clickFanWt (state, data) {
      state.clickFanWtData = data
      console.log(state.clickFanWtData)
    },
    clearScheme (state, data) {
      state.scheme_id = null
    },
    setScheme_id (state, data) {
      state.scheme_id = null
      state.scheme_id = data
    },
    verifiEpsgModel (state, data) {
      state.verifiEpsgModel = data
    },
    routePath (state, data) {
      state.routePath = ''
      state.routePath = data
    },
    measuredlength (state, data) {
      state.measuredlength = data
    },
    profilePoints (state, data) {
      state.profilePoints = data
    },
    language (state, data) {
      state.language = data
    },
    setProjectInfo (state, data) {
      state.projectInfo = Object.assign({}, data)
      this.commit('setSchemeListActive', true)
    },
    typeSettingVisible (state, data) {
      state.typeSettingVisible = data
    },
    setSchemeInfo (state, data) {
      state.schemeInfo = Object.assign({}, data)
    }
  },
  actions: {
    clearScheme_id ({ commit, state, rootState }, data) {
      rootState.projectUpload.fanStatus = [] // 方案步骤
      commit('clearScheme')
    }
  }
}

export default app
