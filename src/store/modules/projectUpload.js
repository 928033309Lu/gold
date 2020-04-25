import { factorData, schemeMemuList, tabTitle } from '@/config/scheme-config.js'
import { terrainStatus } from '@/config/upload-status-config.js'
const projectUpload = {
  state: {
    refreshWindLayer: null, // 是否刷新测风塔模型
    refreshFanStatus: null, // 是否刷新方案步骤
    refreshMastLayer: null, // 是否刷新测风塔渲染
    refreshSchemeList: false, // 是否刷新方案接口
    refreshSchemeListRemove: false, // 删除操作后，是否刷新方案接口
    cfdList: [], // 计算完成的图谱
    openWindisoheight: false, // 等高线三级菜单是否打开
    openWindFactor: false, // 限制因素三级
    windisoheightData: null, // 等高线三级菜单数据
    recalculate: null, // 重新计算那个模块
    recalculateFan: null, // 步骤操作，方案那个模块
    componentScheme: null,
    allUploadNameInfo: null, // 获取文件名信息
    tabTitle: tabTitle, // tab页
    schemeListActive: true,
    schemeMemu: schemeMemuList.map(o => ({...o})), // 方案工具条
    terrainStatus: terrainStatus.map(o => ({...o})),
    mainMast: null, // 主测风塔id
    mastStatus: [],
    cfdStatus: [],
    fanStatus: [],
    fanAddVisible: null, // exist 已有机位点， result 发电量成果， auto 自动排布
    projectUnfold: null, // 项目信息块是否展开
    ellipseForm: {}, // 椭圆设置条件
    renderSet: [], // 渲染设置条件
    windMapMinMax: null, // 图谱返回值
    windMap: null, // 图谱点击返回值
    factorData: factorData.map(o => ({...o})), // 限制性的道路，湖泊，房屋
    customFactorData: [], // 自定义限制性因素
    init_factor: null, // 初始数据
    mapCameraPos: null // 地图视角
  },
  mutations: {
    unCheckSchemeClear (state, data) {
      state.componentScheme = null
      state.tabTitle[3].schemeName = null
      state.fanStatus = []
      // todo 取消选中风机等
      // state.schemeMemu = state.schemeMemu.map((v)=>{
      //   console.log(v)
      //   return v
      // })
    },
    windMapMinMax (state, data) {
      state.windMapMinMax = null
      state.windMapMinMax = data
    },
    windMapClick (state, data) {
      state.windMap = data
    },
    setSchemeListActive (state, data) {
      state.schemeListActive = data
    },
    refreshWindLayer (state, data) {
      state.refreshWindLayer = true
      setTimeout(()=>{
        state.refreshWindLayer = false
      },500)
    },
    refreshFanStatus (state, data) {
      state.refreshFanStatus = true
      setTimeout(()=>{
        state.refreshFanStatus = false
      },500)
    },
    refreshSchemeList (state, data) {
      state.refreshSchemeList = true
      setTimeout(()=>{
        state.refreshSchemeList = false
      },500)
    },
    refreshSchemeListRemove (state, data) {
      state.refreshSchemeListRemove = true
      setTimeout(()=>{
        state.refreshSchemeListRemove = false
      },500)
    },
    refreshMastLayer (state, data) {
      state.refreshMastLayer = true
      state.schemeMemu[2].active = false
      state.schemeMemu[2].show = false
      state.componentScheme = null
      setTimeout(()=>{
        state.refreshMastLayer = false
      },500)
    },
    openWindisoheight (state, data) {
      state.openWindisoheight = data
    },
    openWindFactor (state, data) {
      state.openWindFactor = data
    },
    changeTab (state, num) {
      state.tabTitle = state.tabTitle.map((item, index) => {
        if (num < 2) {
          item.style = 'z-index: ' + (4 - index)
        } else {
          item.style = 'z-index: ' + index
        }
        if (index == num) {
          item.show = true
          item.style = 'z-index: 9'
        } else {
          item.show = false
        }
        return item
      })
    },
    componentScheme (state, data) {
      state.componentScheme = data
    },
    allUploadNameInfo (state, data) {
      state.allUploadNameInfo = data
    },
    closeSchemeMemu (state, data){
      state.componentScheme = null
      state.schemeMemu = state.schemeMemu.map((v)=>{
        v.active = false
        return v
      })
    },
    // 进入项目初始化数据
    initSchemeMemu (state, data) {
      state.componentScheme = null
      state.schemeMemu = data || schemeMemuList.map(o => ({...o}))
      state.terrainStatus = terrainStatus.map(o => ({...o}))
      state.mastStatus = []
      state.cfdStatus = []
      state.fanStatus = []
      state.factorData = factorData.map(o => ({...o}))
      state.openWindFactor = false
      state.openWindisoheight = false
      state.customFactorData = []
      state.windisoheightData = []
    },
    // 删除方案后还原，关闭一系列有关的东西
    removeSchemeInit (state, data){
      state.tabTitle[3].schemeName = null
      state.fanStatus = []
      state.schemeMemu = state.schemeMemu.map((item, index)=>{
        item.active = false
        return item
      })
    },
    setSchemeMemu (state, data) {
      switch (data.type) {
        case 'field_init': // 风场范围
          if(data.open){
            state.schemeMemu[1].show = true
            state.schemeMemu[1].fixationChildren[0].isShow = true
          }else{
            state.schemeMemu[1].fixationChildren[0].isShow = false
          }
        break
        case 'scouting_init': // 踏勘
          if(data.open){
            state.schemeMemu[1].show = true
            state.schemeMemu[1].fixationChildren[1].isShow = true
          }else{
            state.schemeMemu[1].fixationChildren[1].isShow = false
          }
        break
        case 'height_init': // 父级等高线开关
          if(data.open){
            state.schemeMemu[1].show = true
            state.schemeMemu[1].fixationChildren[3].isShow = true

            state.factorData = state.factorData.map((item, index)=>{
              item.isShow = true
              return item
            })
          }else{
            state.schemeMemu[1].fixationChildren[3].isShow = false

          }
        break
        case 'astrict_init': // 父级限制因素开关 下的道路湖泊房屋
          if(data.open){
            state.schemeMemu[1].show = true
            state.schemeMemu[1].fixationChildren[2].isShow = true
            // 道路湖泊房屋
            state.factorData = state.factorData.map((item, index)=>{
              item.isShow = true
              return item
            })
          }else{
            // 道路湖泊房屋
            state.factorData = state.factorData.map((item, index)=>{
              item.isShow = false
              return item
            })

          }
        break
        case 'terrain': // 地形
          state.schemeMemu[1].show = true
        break
        case 'clearterrainmodel': // 地形
          state.schemeMemu[1].show = false
          state.schemeMemu[1].active = false
          state.componentScheme = null
        break
        case 'terrainFix': // 地形子菜单
          state.schemeMemu[1].show = true
          state.schemeMemu[1].fixationChildren[2].isShow = true // 限制性因素
          state.factorData = state.factorData.map((item, index)=>{
            item.url = data.data
            item.isShow = true
            return item
          })
        break
        case 'removeterrainFix':
          state.schemeMemu[1].fixationChildren[2].isShow = false
        break
        case 'terrainHeight': // 等高线
          state.schemeMemu[1].show = true

          state.schemeMemu[1].fixationChildren[3].isShow = true // 等高线
          const obj = JSON.parse(data.data)
          state.windisoheightData.url = obj
          state.windisoheightData.layers = obj.contour_layers
        break
        case 'field': // 风场范围
          state.schemeMemu[1].show = true
          if (data.active) {
            state.componentScheme = 'terrainData'
            state.schemeMemu[1].active = true
            state.schemeMemu[1].fixationChildren[0].isShow = true
            state.schemeMemu[1].fixationChildren[0].checked = true
          } else {
            state.schemeMemu[1].active = false
            state.schemeMemu[1].fixationChildren[0].isShow = true
            state.schemeMemu[1].fixationChildren[0].checked = false
          }

        break
        case 'removefield': // 删除风场范围
          state.schemeMemu[1].fixationChildren[0].isShow = false
          state.schemeMemu[1].fixationChildren[0].checked = false
        break
        case 'scouting': // 踏勘
          state.schemeMemu[1].show = true
          if (data.active) {
            state.componentScheme = 'terrainData'
            state.schemeMemu[1].active = true
            state.schemeMemu[1].fixationChildren[1].isShow = true
            state.schemeMemu[1].fixationChildren[1].checked = true
          } else {
            state.schemeMemu[1].fixationChildren[1].isShow = true
            state.schemeMemu[1].fixationChildren[1].checked = false
          }
        break
        case 'removescouting': // 删除踏勘
          state.schemeMemu[1].fixationChildren[1].isShow = false
          state.schemeMemu[1].fixationChildren[1].checked = false
        break
        case 'astrict': // 自定义限制因素
          state.schemeMemu[1].show = true
          state.schemeMemu[1].fixationChildren[2].isShow = false
          state.schemeMemu[1].fixationChildren[2].isShow = true
          if(!data.change){
            state.customFactorData = data.data
          }else{
            state.customFactorData = data.data
            state.componentScheme = 'terrainData'
            state.schemeMemu[1].active = true
            state.schemeMemu[1].fixationChildren[2].isShow = true
            state.schemeMemu[1].fixationChildren[2].checked = true
          }
        break
        case 'removeAstrictOne': // 删除自定义限制因素
          // console.log(data.data)
          state.customFactorData = state.customFactorData.filter((item, index)=>{
            return item.fileName_astrict_new != data.data
          })
          // console.log(data.data2, state.factorData.every((v)=>!v.isShow))
          if ( data.data2.length <= 0 && state.factorData.every((v)=>!v.isShow) ) {
            state.schemeMemu[1].fixationChildren[2].isShow = false
            state.schemeMemu[1].fixationChildren[2].checked = false
          }
        break
        case 'removeAstrict': // 删除自定义限制因素

          state.customFactorData = []
        break
        case 'windData': // 测风数据
          if (!data.change) {
            state.schemeMemu[2].show = true
          } else {
            state.schemeMemu[2].show = true
            state.schemeMemu[2].active = true
          }
          state.schemeMemu[2].children[0].isShow = true
        break
        case 'windModel': // 测风模型
          state.componentScheme = 'windData'
          state.schemeMemu[2].show = true
          state.schemeMemu[2].active = true
          state.schemeMemu[2].children[0].isShow = true
          state.schemeMemu[2].children[0].checked = true
        break
        case 'windDataConfidence': // 测风置信度
          state.schemeMemu[2].show = true

          state.schemeMemu[2].children[1].isShow = data.data

        break
        case 'windTowerInformation': // 测风塔信息
          state.schemeMemu[2].show = true
          state.schemeMemu[2].children[2].isShow = data.data
        break
        case 'clearWind': // 删除测风
          state.schemeMemu[2].show = false
        break
        case 'windDataInfo':
          if (data.data) {
            state.schemeMemu[2].children[0].isShow = true
          }
        break
        case 'windDataCheck':
          state.schemeMemu[2].children = data.data
          break
        case 'terrainDataCheck':
          state.schemeMemu[1].fixationChildren = data.data
          break
        case 'anemometerTowerCheck': //风机排布
          state.schemeMemu[5].children = data.data
          break
        case 'simulationData': // 仿真数据
          if (!data.change) {
            state.schemeMemu[3].show = true
          } else {
            state.schemeMemu[3].show = true
            state.schemeMemu[3].active = true
          }
        break
        case 'clearSimulation': // 仿真数据
          state.schemeMemu[3].show = false
        break
        case 'planArrangement': // 方案概览
          state.schemeMemu[4].show = true
        break
        case 'anemometerTower': // 风机排布
          state.schemeMemu[5].show = true
        break
        case 'basedRoad':
          state.schemeMemu[6].show = true
        break
        case 'boosterStation':
          state.schemeMemu[7].show = true
        break
        case 'currentLine':
          state.schemeMemu[8].show = true
        break
        case 'pinggu': //经评
          state.schemeMemu[9].show = true
          state.schemeMemu[9].active = data.active
        break
        case 'windNoise': //噪音
          state.schemeMemu[5].children[1].isShow = data.data

        break
      }
    },
    // status-------  0 等待未开始， 1 计算中， 2 计算完成， 3 异常， 4 跳过， -1 找不到，未上传数据
    calculateStatus (state, data) {
      switch (data.type) {
        case 'clearterrain':
          state.terrainStatus = state.terrainStatus.map((item, index)=>{
            item.show = false
            item.iconLeft = ''
            item.iconRight = ''
            return item
          })
        break
        case 'terrain':
          if (data.data && data.data[0]) {
            state.terrainStatus[0].error_msg = data.data[0].error_msg
            state.terrainStatus[0].show = true
            state.terrainStatus[0].iconRight = ''
            state.terrainStatus[0].iconLeft = 'icon-weikaishi'
            if (data.data[0].status == 1) {
              state.terrainStatus[0].iconLeft = 'icon-jinhangzhong'
            } else if (data.data[0].status == 2) {
              state.terrainStatus[0].iconLeft = 'icon-check'
              // state.terrainStatus[0].iconRight = 'icon-check'
            } else if (data.data[0].status == 3) {
              state.terrainStatus[0].iconLeft = 'icon-yichang1'
              // state.terrainStatus[0].iconRight = 'icon-yichang1'
            } else if (data.data[0].status == -1) {
              state.terrainStatus[0].show = false
            }
          }
          if (data.data && data.data[1]) {
            state.terrainStatus[1].error_msg = data.data[1].error_msg
            state.terrainStatus[1].show = true
            state.terrainStatus[1].iconRight = ''
            state.terrainStatus[1].iconLeft = 'icon-weikaishi'
            if (data.data[1].status == 1) {
              state.terrainStatus[1].iconLeft = 'icon-jinhangzhong'
            } else if (data.data[1].status == 2) {
              state.terrainStatus[1].iconLeft = 'icon-check'
              // state.terrainStatus[1].iconRight = 'icon-check'
            } else if (data.data[1].status == 3) {
              state.terrainStatus[1].iconLeft = 'icon-yichang1'
              // state.terrainStatus[0].iconRight = 'icon-yichang1'
            } else if (data.data[1].status == -1) {
              state.terrainStatus[1].show = false
            }
          }
          if (data.data && data.data[2]) {
            state.terrainStatus[2].error_msg = data.data[2].error_msg
            state.terrainStatus[2].show = true
            state.terrainStatus[2].iconRight = ''
            state.terrainStatus[2].iconLeft = 'icon-weikaishi'
            if (data.data[2].status == 1) {
              state.terrainStatus[2].iconLeft = 'icon-jinhangzhong'
            } else if (data.data[2].status == 2) {
              state.terrainStatus[2].iconLeft = 'icon-check'
              // state.terrainStatus[2].iconRight = 'icon-check'
            } else if (data.data[2].status == 3) {
              state.terrainStatus[2].iconLeft = 'icon-yichang1'
              // state.terrainStatus[0].iconRight = 'icon-yichang1'
            } else if (data.data[2].status == -1) {
              state.terrainStatus[2].show = false
            }
          }
          if (data.data && data.data[3]) {
            state.terrainStatus[3].error_msg = data.data[2].error_msg
            state.terrainStatus[3].show = true
            state.terrainStatus[3].iconRight = ''
            state.terrainStatus[3].iconLeft = 'icon-weikaishi'
            if (data.data[3].status == 1) {
              state.terrainStatus[3].iconLeft = 'icon-jinhangzhong'
            } else if (data.data[3].status == 2) {
              state.terrainStatus[3].iconLeft = 'icon-check'
              // state.terrainStatus[3].iconRight = 'icon-check'
            } else if (data.data[3].status == 3) {
              state.terrainStatus[3].iconLeft = 'icon-yichang1'
              // state.terrainStatus[3].iconRight = 'icon-yichang1'
            } else if (data.data[3].status == -1) {
              state.terrainStatus[3].show = false
            }
          }
          if (data.data[0].status == 2 && data.data[1].status == 2){
            state.schemeMemu[1].fixationChildren[2].isShow = true
            state.schemeMemu[1].fixationChildren[3].isShow = true
          }

          // tab页圆点状态
          var err = data.data.some((item, index) => {
            return item.status == 3
          })
          var success = data.data.some((item, index) => {
            return item.status == 2
          })
          if (err) {
            state.tabTitle[0].status = '3'
          } else if (success && !err) {
            state.tabTitle[0].status = '2'
          } else {
            state.tabTitle[0].status = '1'
          }

        break
        case 'clearmast':
          state.mastStatus = [] 
          state.componentScheme = null
        break
        case 'mast':
          var list = data.data.concat(data.data2)
          state.mastStatus = list.map((item, index) => {
            item.show = true
            item.iconRight = ''
            item.iconLeft = 'icon-weikaishi'
            if (item.status == 1) {
              item.iconLeft = 'icon-jinhangzhong'
            } else if (item.status == 2) {
              item.iconLeft = 'icon-check'
              // item.iconRight = 'icon-check'
            } else if (item.status == 3) {
              item.iconLeft = 'icon-yichang1'
              // item.iconRight = 'icon-yichang1'
            } else if (item.status == -1) {
              item.show = false
            }
            return item
          })
          var confidenceLoading = data.data2.some((item, index)=>{
            return item.status == 2
          })
          if (!confidenceLoading){
            state.schemeMemu[2].children[1].isShow = false
          }
          // console.log(state.mastStatus)

          // tab页圆点状态
          var err1 = list.some((item, index) => {
            return item.status == 3
          })
          var success1 = list.some((item, index) => {
            return item.status == 2
          })
          if (err1) {
            state.tabTitle[1].status = '3'
          } else if (success1 && !err1) {
            state.tabTitle[1].status = '2'
          } else {
            state.tabTitle[1].status = '1'
          }

        break
        case 'clearcfd':
          state.cfdStatus = []
        break
        case 'cfd':
            // console.log(data.data)
          state.cfdStatus = data.data.map((item, index) => {
            item.show = true
            item.iconRight = ''
            item.iconLeft = 'icon-weikaishi'
            if (item.status == 1) {
              item.iconLeft = 'icon-jinhangzhong'
            } else if (item.status == 2) {
              item.iconLeft = 'icon-check'
              // item.iconRight = 'icon-check'
            } else if (item.status == 3) {
              item.iconLeft = 'icon-yichang1'
              // item.iconRight = 'icon-yichang1'
            } else if (item.status == -1) {
              item.show = false
            }
            return item
          })
          state.cfdList = data.data.filter((item, iindex) =>{
            return item.status == 2
          })

          // tab页圆点状态
          var errCfd = data.data.some((item, index) => {
            return item.status == 3
          })
          var successCfd = data.data.some((item, index) => {
            return item.status == 2
          })
          if (errCfd) {
            state.tabTitle[2].status = '3'
          } else if (successCfd && !errCfd) {
            state.tabTitle[2].status = '2'
          } else {
            state.tabTitle[2].status = '1'
          }
          
        break
        case 'fan':
          state.tabTitle[3].schemeName = data.data.scheme_name
          state.fanStatus = data.data.data.map((item, index)=>{
            item.show = true
            item.iconLeft = 'icon-weikaishi' // 未开始-状态 0
            item.iconRight = '' // 计算==操作一
            item.iconRight2 = 'icon-tiaoguo' // 跳过==操作二
            
            if (item.status == 1) {
              item.iconLeft = 'icon-jinhangzhong' // 计算中-状态 1
              item.iconRight = '' // 空==操作一
              item.iconRight2 = '' // 空==操作二
            } else if (item.status == 2) {
              item.iconLeft = 'icon-check' // 计算完成-状态 2
              item.iconRight = '' // 空==操作一
              item.iconRight2 = '' // 空==操作二
            } else if (item.status == 3) {
              item.iconLeft = 'icon-yichang1' // 异常-状态 3
              item.iconRight = 'icon-refresh2' // 重新计算==操作一
              item.iconRight2 = '' 
              if(index == 1 || index == 2 || index == 3){
                item.iconRight2 = 'icon-daoru2' // 重新导入数据==操作二  支持升压站，道路，线路
              }
            } else if (item.status == 4) {
              item.iconLeft = 'icon-jinzhi' // 未勾选-状态 4
              item.iconRight = 'icon-refresh2' // ==操作一
              item.iconRight2 = '' // ==操作二
              if(index == 1 || index == 2 || index == 3){
                // item.iconRight = 'icon-refresh2' // 计算==操作一
                item.iconRight2 = 'icon-daoru2' // 重新导入数据==操作二  支持升压站，道路，线路
              }
            } else if (item.status == -1) {
              item.show = false
            }
            return item
          })

          // tab页圆点状态
          var errfan = data.data.data.some((item, index) => {
            return item.status == 3
          })
          var successfan = data.data.data.some((item, index) => {
            return item.status == 2
          })
          if (errfan) {
            state.tabTitle[3].status = '3'
          } else if (successfan && !errfan) {
            state.tabTitle[3].status = '2'
          } else {
            state.tabTitle[3].status = '1'
          }
          
          
        break
      }
    },
    // 清空
    clearFanStatus (state, data){
      state.tabTitle[3].schemeName = null
      state.fanStatus = []
    },
    setCfdList (state, data){
      state.cfdList = data
    },
    recalculate (state, data) {
      state.recalculate = data
      setTimeout(() => {
        state.recalculate = null
      }, 500)
    },
    recalculateFan (state, data) {
      state.recalculateFan = data
      setTimeout(() => {
        state.recalculateFan = null
      }, 500)
    },
    setTabStatus (state, data) {
      state.tabTitle[0].status = data[0].status
      state.tabTitle[1].status = data[1].status
      state.tabTitle[2].status = data[2].status
    },
    setTabStatusFan (state, data) {
      state.tabTitle[3].status = data.status
    },
    fanAddVisible (state, data) {
      state.fanAddVisible = data
    },
    setProjectUnfold (state, data) {
      state.projectUnfold = data
    },
    setRenderSet (state, data) {
      state.renderSet = data
    },
    setEllipseForm (state, data) {
      state.ellipseForm = data
    },
    setMainMast (state, data) {
      state.mainMast = data
    },
    setFactorData (state, data) {
      state.factorData = data
    },
    setCustomFactorData (state, data) {
      state.customFactorData = data
    },
    setMapCameraPos (state, data) {
      state.mapCameraPos = data
    }
  },
  actions: {
    // calculateStatus ({ commit, state, rootState }, data) {
    //   switch (data.type) {
    //     case 'terrain':
    //       if (data.data && data.data[0].status != '') {
    //         rootState.
    //       }
    //     break
    //     case 'mast':
    //     break
    //     case 'cfd':
    //     break
    //     case 'fan':
    //     break
    //   }
    // }
  }
}

export default projectUpload
