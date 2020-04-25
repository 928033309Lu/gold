// 页面初始化 资源加载
import 'normalize.css/normalize.css'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/index.scss'
import router from './router'
import store from '@/store/index'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import '@/components/utils/echarts/myTheme.js' // 自定义echarts主题默认样式
import '@/components/utils/echarts/themeOverview.js' // 项目概览图表默认样式
import '@/components/utils/echarts/brokenLine.js' // 折线图默认样式
import { getToken } from '@/utils/auth'
import htmlCanvas from '@/utils/htmlCanvas.js'
Vue.prototype.$htmlCanvas = htmlCanvas

// 全局路由拦截
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/index') {
    if (!getToken()) {
      next({ path: '/login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

Vue.use(VueI18n)
Vue.use(ElementUI)
const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    'zh': require('./common/lang/zh'), // 中文
    'en': require('./common/lang/en') // 英文
  }
})

// VUE部分 初始化
// 蓝湖正常尺寸 选 1920 尺寸。（ 如果1920分辨率下放大125%的选 1536 尺寸）
// 单位，请使用rem开发,                            =>    100px == 0.1rem       超过3px都改rem，不写单位就改用flex属性
// 颜色，请使用变量开发=>                          目录@/assets/style/fixed/variable-set.scss
// 固定文字，请使用语言变量=>                       {{ $t("m.music") }}   目录@/common/lang
// echart样式，请使用自定义主题样式=>               "myTheme"             目录@/components/utils/echarts/
// element-ui全局样式在这里修改=>                  目录@/assets/style/fixed/element-var.scss
// 全局变量在这里修改=>                            目录@/assets/style/fixed/variable-set.scss
// 英文版本的样式在这里修改=>                       app.vue   #app.enClass{}

// 截取全屏方法 配置文档https://blog.csdn.net/qq_32842925/article/details/83041380
// this.$htmlCanvas((res)=>{
//   console.log(res)
// })


new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  created () {

  },
  mounted () {

  }
}).$mount('#app')

// 地图部分 初始化
import gwmap from '@/gwmap'
gwmap.init('mapContainer')
window.gwmap = gwmap


