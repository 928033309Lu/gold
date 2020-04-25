import { get, post, put, deleteOut } from './request.js'

// 获取公司列表
export function getOwner () {
  return get('/project/owner')
}
// 注册-获取验证码
export function registerCode (data) {
  return post('/user/register-code', data)
}
// 立即注册
export function postRegister (data) {
  return post('/user/register', data)
}
export function verifyCode (data) {
  return post('/user/verify-code', data)
}
// 忘记密码-获取验证码
export function forgetCode (data) {
  return post('/user/forget-code', data)
}
// 获取地形列表
export function getTerrain () {
  return get('/map_info/terrain')
}
// 获取省市县
export function getPosition (data = {}) {
  return get('/project/position', data)
}
// 获取大区
export function getAreaPosition (data = {}) {
  return get('/project/position_area', data)
}
// 获取项目列表
export function getProjectList (data = {}) {
  return get('/project/')
}
// 筛选项目列表
export function getFilterPro (data = {}) {
  return get('/project/filter', data)
}
// 新增项目
export function postProject (data = {}) {
  return post('/project/', data)
}
// 编辑项目
export function putProject (project_id, data = {}) {
  return put('/project/' + project_id, data)
}
// 删除项目
export function deleteProject (project_id) {
  return deleteOut('/project/' + project_id)
}
// 搜索项目
export function searchProject (data = {}) {
  return get('/project/search', data)
}
// 修改密码
export function changePass (data = {}, config = {}) {
  return put('/user/password/', data, config)
}
// 忘记密码-重置密码
export function forgetChangePass (data = {}) {
  return put('/user/password/forget', data)
}
// 登录
export function postLogin (data = {}) {
  return post('/passport/login', data)
}

// 查询单个项目信息
export function getProjectInfo (project_id) {
  return get('/project/' + project_id)
}

// 项目概览
export function getProjectDetails (data = {}) {
  return get('/project/project_detail', data)
}

// 项目概览图表
export function getProjectDetailsEchart (project_id) {
  return get('/wind/mast_tim_data', {
    project_id
  })
}

// 项目概览 查询机型
export function getProjectDetailsType (project_id) {
  return get('/project/get_turbine_type', {
    project_id
  })
}
// -----------------比选-------------------
// 发电量列表数据
export function getAllSchemeDetails (project_id) {
  return get('/scheme/all_scheme_detail', {
    project_id
  })
}
// 工程--经评--数据
export function getContrastEvaluation (project_id) {
  return get('/evaluation/evaluation_result_all', {
    project_id
  })
}

// 等效小时数图表数据
export function getAllHoursDetails (project_id) {
  return get('/scheme/all_turbine_hours', {
    project_id
  })
}

// 单个风机详情
export function getTurbineSingle (project_id, scheme_id, turbine_id) {
  return get('/scheme/turbine_single', {
    project_id,
    scheme_id,
    turbine_id
  })
}

// ----------------方案---------------------
// 方案概览
export function getTurbineDetails (data = {}) {
  return get('/scheme/scheme_detail', data)
}
// 风参表 -- 风机列表
export function getTurbine_scheme (data = {}) {
  return get('/scheme/turbine_scheme', data)
}
// 风参表 -- 导入覆盖
export function coverageTurbine_scheme (project_id, scheme_id, data = {}, config) {
  return put('/scheme/power_generation_update/' + project_id + '/' + scheme_id, data, config)
}
// 折减系数修改
export function setSchemeReductionFactor (data = {}, config = {}) {
  return post('/scheme/scheme_reduction_factor', data, config)
}
// 获取折减系数
export function getDiscount (project_id) {
  return get('/scheme/get_default_discount?project_id=' + project_id)
}
// ----------------PPT演示---------------------
// ppt查询
export function getPPtList (data = {}) {
  return get('/scheme/scheme_ppt', data)
}
// ppt添加
export function addPPt (data = {}, config = {}) {
  return post('/scheme/scheme_ppt', data, config)
}
// ppt删除
export function deletePPt (project_id, sequence_id) {
  return deleteOut('/scheme/scheme_ppt?project_id=' + project_id + '&sequence_id=' + sequence_id)
}
// ppt顺序修改
export function updateSortPPt (data = {}, config = {}) {
  return post('/scheme/scheme_ppt_sequence_id_update', data, config)
}
// ----------------经评---------------------
// 经评 经评参数页数据获取
export function getEvaluationOutput (data = {}) {
  return get('/evaluation/evaluation_output', data)
}
// 经评结果页获取
export function getEvaluationResult (data = {}) {
  return get('/evaluation/evaluation_result', data)
}
// 经评参数页下拉列表内容
export function getEvaluationOutputParams (data = {}) {
  return get('/evaluation/evaluation_output_params', data)
}
// 经评参数页保存计算接口
export function updateEvaluationOutput (data = {}, config = {}) {
  return post('/evaluation/evaluation_output', data, config)
}
// 经评结果页面修改
export function updateEvaluationResult (data = {}, config = {}) {
  return post('/evaluation/evaluation_result', data, config)
}
// -----------------epsg--------------------
// 判断epsg是否可以修改
export function checkEpsgChange (project_id) {
  return get('/map_info/check_update_epsg', {
    project_id
  })
}
// 参考坐标系
export function getEpsgList (data = {}) {
  return get('/map_info/epsg_zone', data)
}

// 回显 参考坐标系
export function getProjectEpsg (project_id) {
  return get('/project/project_epsg/' + project_id)
}

// 上传参考坐标系
export function postProjectEpsg (project_id, data) {
  return post('/map_info/terrain_info/' + project_id, data)
}
// -----------------Terrain--------------------
// 上传地形模块的文件
export function postTerrainModel (project_id, data = {}, config = {}) {
  return post('/map_info/upload_terrain/' + project_id, data, config)
}

// 删除地形形模块的文件
export function deleteTerrainModel (project_id, fileName, fileType) {
  return deleteOut('/map_info/upload_terrain/' + project_id + '?file_name=' + fileName + '&upload_type=' + fileType)
}

// 计算地形and风场范围
export function calculateMapWind () {
  return post('/')
}

// 获取文件名信息
export function getAllUploadName (project_id) {
  return get('/map_info/terrain_info/' + project_id)
}

// 发起地形计算
export function calculationTerrain (project_id) {
  return get('/map_info/calculation_terrain', {
    project_id: project_id
  })
}

// 获取地形模块计算状态
export function terrainStatus (project_id) {
  return get('/step/get_steps_status_list', {
    project_id: project_id,
    scheme_id: '1',
    step_names: JSON.stringify(['map2tif', 'map_info', 'contour', 'limiting_factor'])
  })
}
// -------
// 获取所有模块计算状态
export function allStatus (project_id) {
  return get('/step/get_steps_status_list', {
    project_id: project_id,
    scheme_id: '1',
    step_names: JSON.stringify(['map_info', 'contour', 'limiting_factor', 'wind_info', 'mast_confidence', 'wrg2vtk'])
  })
}
// -----------------mast--------------------

// 获取测风塔模块计算状态
export function mastStatus (project_id) {
  return get('/step/get_steps_status_list', {
    project_id: project_id,
    scheme_id: '1',
    step_names: JSON.stringify(['wind_info', 'mast_confidence'])
  })
}
// 置信度状态
export function mastStatusConfidence (project_id) {
  return get('/step/get_steps_status_list', {
    project_id: project_id,
    scheme_id: '1',
    step_names: JSON.stringify(['mast_confidence'])
  })
}

// 导入测风塔模板
export function readMastInfoFile (data = {}, config = {}) {
  return post('/wind/read_mast_info_file', data, config)
}

// 删除已有的测风塔
export function removeMastInfo (project_id) {
  return deleteOut('/wind/delete_mast_info_all/' + project_id)
}

// 上传测风数据
export function postMastJson (data = {}, config = {}) {
  return post('/wind/upload_mast_info/' + data.project_id, {
    mast_info: data.mast_info
  }, config)
}
// 上传单个测风数据
export function postMastOnce (data = {}, config = {}) {
  return post('/wind/upload_mast_info/' + data.project_id, {
    mast_info: data.mast_info
  }, config)
}

// 修改单个测风数据
export function putMastOnce (data = {}, config = {}) {
  return put('/wind/put_mast_info?project_id=' + data.project_id + '&mast_id=' + data.mast_id, {
    mast_info: data.mast_info
  }, config)
}
// 主测风塔修改
export function putMastMain (project_id, mast_id) {
  return put('/wind/set_main_mast?project_id=' + project_id + '&mast_id=' + mast_id)
}

// 删除单个测风数据
export function removeMastOnce (project_id, mast_id) {
  return deleteOut('/wind/delete_mast_info/' + project_id + '/1/' + mast_id)
}

// 上传tim   txt
export function postMastTimTxt (project_id, data = {}, config = {}) {
  return post('/wind/upload_mast_file/' + project_id, data, config)
}

// 上传测风中尺度 csv
export function postMastCsv (project_id, data = {}, config = {}) {
  return post('/wind/upload_long_term_mesoscale_file/' + project_id, data, config)
}
// 获取测风中尺度 csv
export function getMastCsv (project_id) {
  return get('/wind/merra2_name/' + project_id)
}
// 删除 测风中尺度 csv
export function removeMastCsv (project_id) {
  return deleteOut('/wind/delete_mesoscale_file/' + project_id)
}

// 获取测风数据
export function getMastList (project_id) {
  return get('/wind/get_mast_info/' + project_id)
}

// 测风塔计算接口
export function postMastCalculate (project_id) {
  return post('/wind/mast_calculate_start/' + project_id)
}
// 置信度 计算
export function calculateConfidence (project_id) {
  return post('/wind/wind_mast_confidence', {
    project_id: project_id
  })
}
// 风数据中尺度计算结果
export function getMastMesoscaleData (data = {}) {
  return get('/wind/mast_mesoscale_data', data)
}
// 风数据单通道计算结果
export function getMastTimData (data = {}) {
  return get('/wind/mast_tim_data', data)
}
// 风数据多通道计算结果
export function getMastTxtData (data = {}) {
  return get('/wind/mast_txt_data', data)
}
// -----------------cfd--------------------
// 上传cfd
export function postCfdFile (data = {}, config = {}) {
  return post('/cfd/wrg_upload', data, config)
}
// 删除cfd
export function deleteCfdFile (data = {}) {
  return deleteOut('/cfd/wrg_delete/' + data.project_id + '?wrg_file_name=' + data.wrg_file_name + '&height=' + data.height)
}
// 获取cfd
export function getCfdInfo (project_id) {
  return get('/cfd/wrg_name/' + project_id)
}

// cfd计算接口
export function postCfdCalculate (project_id) {
  return post('/cfd/wrg_calculate_start', {
    project_id: project_id
  })
}
// 获取cfd计算状态
export function cfdStatus (project_id) {
  return get('/step/get_steps_status_list', {
    project_id: project_id,
    scheme_id: '1',
    step_names: JSON.stringify(['wrg2vtk'])
  })
}

// 获取图谱url渲染
export function getMapLayerUrl (project_id, height) {
  return get('/cfd/vtk', {
    project_id,
    height
  })
}
// 逐点显示风参
export function getMapWindInfo (data, config) {
  return get('/cfd/cfd_wind_info', data, config)
}

// -------------------------fan----------------
// 自定义机型 上传
export function turbineTypePost (data) {
  return post('/turbine/turbine_type', data)
}

// 导入解析发电量
export function postFanCapacity (data, config) {
  return post('/scheme/power_generation_read', data, config)
}

// 获取机型列表
export function getTypeData (user_id) {
  return get('/turbine/turbine_type', {
    key: 'turbines',
    user_id: user_id
  })
}

// 保存点位数据
export function postTurbineSave (project_id, data, config) {
  return post('/scheme/turbine_save/' + project_id, {
    scheme_data: data
  }, config)
}

// 获取方案列表
export function getSchemeList (project_id) {
  return get('/scheme/scheme_list', {
    project_id: project_id
  })
}

// 修改方案名称
export function putSchemeName (data, config) {
  return put('/scheme/scheme_update?project_id=' + data.project_id + '&scheme_id=' + data.scheme_id, {
    scheme_data: data
  }, config)
}

// 删除方案
export function removeScheme (project_id, scheme_id) {
  return deleteOut('/scheme/scheme_delete?project_id=' + project_id + '&scheme_id=' + scheme_id)
}

// 复制方案
export function copyScheme (data, config) {
  return post('/scheme/scheme_copy?project_id=' + data.project_id + '&scheme_id=' + data.scheme_id, {
    scheme_data: data
  }, config)
}

// 查询机型是否可以调噪音计算
export function checkNoise (data, config) {
  return post('/noise/noise_turbine', {
    turbines: data.data,
    project_id: data.project_id
  }, config)
}

// 噪音计算接口
export function calculationNoise (project_id, scheme_id) {
  return post('/noise/noise_calculation', {
    project_id,
    scheme_id
  })
}

// 工程设计选择保存接口
export function chooseScheme (data, config) {
  return post('/engineering/engineering_choose', {
    engineering_choose: data
  }, config)
}
// 工程设计计算
export function chooseCalculation (project_id, scheme_id) {
  return post('/engineering/engineering_start', {
    project_id,
    scheme_id
  })
}

// 获取各个方案得计算进度
export function schemeStatus (project_id, scheme_id) {
  return get('/step/get_steps_status_list', {
    project_id: project_id,
    scheme_id: scheme_id,
    step_names: JSON.stringify(['noise', 'road_info', 'syz_info', 'line_info', 'evaluation_info'])
  })
}

// 创建scheme_id
export function createdSchemeid (project_id) {
  return post('/scheme/scheme_save/' + project_id)
}

// 删除scheme_id
export function removeSchemeid (project_id, scheme_id) {
  return deleteOut('/scheme/scheme_delete?project_id=' + project_id + '&scheme_id=' + scheme_id)
}

// 上传dxf
export function postDxfFile (data, config) {
  return post('/road/road_dxf', data, config)
}

// 删除dxf
export function removeDxfFile (project_id, scheme_id) {
  return deleteOut('/road/road_dxf?project_id=' + project_id + '&scheme_id=' + scheme_id)
}

// 上传zip
export function postZipFile (data, config) {
  return post('/line/line_file', data, config)
}

// 删除zip
export function removeZipFile (project_id, scheme_id) {
  return deleteOut('/line/line_file?project_id=' + project_id + '&scheme_id=' + scheme_id)
}

// 重新计算 ---综合

// 重新计算 ---噪音=》》》》用 calculationNoise
// 噪音跳过接口(状态置4) -- 保存点位时不勾噪音计算选噪音掉这个
export function skipNoise (project_id, scheme_id, message = null) {
  return get('/noise/skip_noise', {
    project_id,
    scheme_id,
    message
  })
}
// 跳过 ---噪音  --- 噪音初始化接口(状态置0) -- 步骤进度的跳过
export function skipNoiseInit (project_id, scheme_id) {
  return get('/noise/init_noise', {
    project_id,
    scheme_id
  })
}
// 重新计算 ---道路
export function roadCalculation (project_id, scheme_id) {
  return get('/road/start', {
    project_id,
    scheme_id
  })
}
// 跳过 ---道路
export function roadSkip (project_id, scheme_id) {
  return get('/road/pass', {
    project_id,
    scheme_id
  })
}
// 道路个点位数据json获取
export function getRoad (project_id, scheme_id) {
  return get('/road/road', {
    project_id,
    scheme_id
  })
}
// 重新计算 ---升压站
export function stationCalculation (project_id, scheme_id) {
  return get('/syz/start', {
    project_id,
    scheme_id
  })
}
// 跳过 ---升压站
export function stationSkip (project_id, scheme_id) {
  return get('/syz/pass', {
    project_id,
    scheme_id
  })
}
// 重新计算 ---线路
export function lineCalculation (project_id, scheme_id) {
  return get('/line/start', {
    project_id,
    scheme_id
  })
}
// 跳过 ---线路
export function lineSkip (project_id, scheme_id) {
  return get('/line/pass', {
    project_id,
    scheme_id
  })
}
// 线路个点位数据json获取
export function getLine (project_id, scheme_id) {
  return get('/line/line', {
    project_id,
    scheme_id
  })
}
// 重新计算 ---经评
export function evaluationCalculation (project_id, scheme_id) {
  return get('/evaluation/start', {
    project_id,
    scheme_id
  })
}
// 跳过 ---经评
export function evaluationSkip (project_id, scheme_id) {
  return get('/evaluation/pass', {
    project_id,
    scheme_id
  })
}

// 升压站点位获取
export function station_get (project_id, scheme_id) {
  return get('/engineering/engineering_get', {
    project_id,
    scheme_id
  })
}
// 工程数据获取
export function engineering_get (project_id, scheme_id) {
  return get('/engineering/engineering_choose', {
    project_id,
    scheme_id
  })
}
// 步骤，升压站坐标---上传
export function postStationlonLat (data) {
  return post('/syz/upload_syz_point', {
    syz_x: data.syz_x,
    syz_y: data.syz_y,
    project_id: data.project_id,
    scheme_id: data.scheme_id
  })
}

// ------------------------
// 获取噪音图谱数据
export function getNoisePoint (data) {
  return get('/noise/noise_res', {
    project_id: data.project_id,
    scheme_id: data.scheme_id
  })
}
// 获取噪音计算状态
export function getNoiseStatus (project_id, scheme_id) {
  return get('/step/get_steps_status_list', {
    project_id: project_id,
    scheme_id: scheme_id,
    step_names: JSON.stringify(['noise'])
  })
}

// 获取置信度图谱数据
export function getCreditPoint (project_id) {
  return get('/wind/wind_mast_confidence_res', {
    project_id
  })
}

