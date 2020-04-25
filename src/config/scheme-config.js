const factorData = [
  {
    fileName_astrict: 'windLine', // 道路
    isShow: false,
    checked: false
  },
  {
    fileName_astrict: 'windHouse', // 房屋
    isShow: false,
    checked: false
  },
  {
    fileName_astrict: 'windLakes', // 湖泊
    isShow: false,
    checked: false
  }
]
const schemeMemuList = [
  {
    icon: 'iconfont icon-gaishu',
    label: 'overview', // 项目概览
    active: false,
    show: true,
    children: []
  },
  {
    icon: 'iconfont icon-dilixinxi',
    label: 'terrainData', // 地形数据
    active: false,
    show: false,
    fixationChildren: [
      {
        fileName_astrict: 'windField', // 风场范围
        isShow: false,
        checked: false
      },
      {
        fileName_astrict: 'windScouting', // 踏勘路径
        isShow: false,
        checked: false
      },

      {
        fileName_astrict: 'factorData', // 限制性因素,含自定义，
        isShow: false,
        checked: false
      },
      {
        fileName_astrict: 'windisoheight', // 等高线
        isShow: false,
        checked: false
      }
    ]
  },
  {
    icon: 'iconfont icon-feng_',
    label: 'windData', // 测风数据 2
    active: false,
    show: false,
    children: [
      {
        label: 'windTowerModel', // 测风塔模型
        isShow: false,
        active: false,
        checked: false
      },
      {
        label: 'windConfidence', // 测风置信度
        isShow: false,
        active: false,
        checked: false
      },
      {
        label: 'windTowerInformation', // 测风塔信息
        isShow: false,
        active: false,
        checked: false
      }
    ]
  },
  {
    icon: 'iconfont icon-liucheng',
    label: 'simulationData', // 仿真数据
    active: false,
    show: false,
    fixationChildren: [
      {
        label: 'windAtlas', // 风图谱
        isShow: false,
        active: false,
        checked: false
      },
      {
        label: 'windParamSearch', // 风参查询
        isShow: false,
        active: false,
        checked: false
      }
    ]
  },

  {
    icon: 'iconfont icon-fangan-',
    label: 'planArrangement', // 方案排布方案概览
    active: false,
    show: false,
    children: []
  },
  {
    icon: 'iconfont icon-shock',
    label: 'anemometerTower', // 测风塔  风机排布 5
    active: false,
    show: false,
    children: [
      {
        label: 'windParamTable', // 风参表
        isShow: true,
        active: false,
        checked: false
      },
      {
        label: 'windNoise', // 噪音
        isShow: true,
        active: false,
        checked: false
      }
    ]
  },
  {
    icon: 'iconfont icon-jiaotong-daolu',
    label: 'basedRoad', // 场内道路  道路设计
    active: false,
    show: false,
    children: []
  },
  {
    icon: 'iconfont icon-boost',
    label: 'boosterStation', // 升压站
    active: false,
    show: false,
    children: []
  },
  {
    icon: 'iconfont icon-line',
    label: 'currentLine', // 线路
    active: false,
    show: false,
    children: []
  },
  {
    icon: 'iconfont icon-pinggu',
    label: 'pinggu',
    active: false,
    show: false,
    children: []
  }
]

// tab页卡
const tabTitle = [
  {
    icon: 'iconfont icon-dilixinxi',
    show: false,
    style: 'z-index: 4',
    imgUrl: '/images/tab11.png',
    label: 'terrainData',
    labelPlan: 'terrainProgress',
    panel: 'terrain',
    status: 1,
    schemeName: null
  },
  {
    icon: 'iconfont icon-feng_',
    show: false,
    style: 'z-index: 3',
    imgUrl: '/images/tab22.png',
    label: 'windData',
    labelPlan: 'mastProgress',
    panel: 'mast',
    status: 1,
    schemeName: null
  },
  {
    icon: 'iconfont icon-liucheng',
    show: false,
    style: 'z-index: 2',
    imgUrl: '/images/tab33.png',
    label: 'simulationData',
    labelPlan: 'cfdProgress',
    panel: 'cfd',
    status: 1,
    schemeName: null
  },
  {
    icon: 'iconfont icon-fangan-',
    show: false,
    style: 'z-index: 1',
    imgUrl: '/images/tab44.png',
    label: 'planArrangement2',
    labelPlan: 'fanProgress',
    panel: 'fan',
    status: 1,
    schemeName: null
  }
]
// 风参表
const windParam = {
  columnNames: [
    {label: '海拔（m)', value: 'elevation'},
    {label: '轮毂高度（m）', value: 'height'},
    {label: '空气密度（kg/m^3)', value: 'air_density'},
    {label: 'A(m/s)', value: 'at'},
    {label: 'K', value: 'kt'},
    {label: '风切变', value: 'average_shear'},
    {label: '最大入流角（度）', value: 'max_inc'},
    {label: '湍流强度', value: 'representative_wake_added'},
    {label: '尾流前风速(m/s)', value: 'free_speed'},
    {label: '尾流损失(%)', value: 'speed_discount'},
    {label: '尾流后风速(m/s)', value: 'waked_speed'},
    {label: '上网电量(MWh/y)', value: 'array_yield'},
    {label: '等效小时数(h)', value: 'equal_hours'}
  ],
  rules: [
    {label: '大于', value: '>'},
    {label: '小于', value: '<'},
    {label: '等于', value: '=='},
    {label: '介于', value: '<>'},
    {label: '前10%', value: '>10%'},
    {label: '后10%', value: '<10%'},
    {label: '高于平均值', value: 'aboveAvg'},
    {label: '低于平均值', value: 'belowAvg'}
  ],
  colors: [
    {label: '红色', value: '#FB5D3F'},
    {label: '黄色', value: '#FFC035'},
    {label: '绿色', value: '#02D397'},
    {label: '蓝色', value: '#53A9FF'},
    {label: '紫色', value: '#8883FF'}
  ]
}
export {
  factorData,
  schemeMemuList,
  tabTitle,
  windParam
}
