<template>
  <div class="appMain">
    <loading-panel></loading-panel>
    <header-Panel :projectName="projectInfoName || projectName" :userInfo="userInfo"  ></header-Panel>
    <compass @changeAngle="onChangeAngle"/>
    <div class="logo"></div>
    <!-- 地球风机 -->
    <earth-fan></earth-fan>
    <!-- 查看机型配置 -->
    <type-setting></type-setting>
    <!-- 风机-添加已有风机 -->
    <fan-add-exist></fan-add-exist>
    <!-- 风机-添加发电量成果 -->
    <fan-add-result></fan-add-result>
    <!-- 风机-自动优化排布 -->
    <fan-add-auto></fan-add-auto>
    <!-- 风机-点击显示信息 -->
    <turbine-popup></turbine-popup>
    <!-- 测风塔-点击显示信息 -->
    <mast-popup></mast-popup>
    <!-- 方案比选 -->
    <scheme-comparison></scheme-comparison>
    <!-- 比选重叠列表 -->
    <comparison-overlap></comparison-overlap>
    <!-- 发电量详情框 -->
    <comparison-overlap-details></comparison-overlap-details>

    <!-- 演示模式 -->
    <ppt v-if="pptModel"></ppt>
    <!-- 项目列表 -->
    <transition :name="!animationChange ? 'project-slide-right' : 'el-fade-in-linear'">
      <router-view @clearProjectName="clearProjectName" />
    </transition>
   
    <!-- 工具列表 -->
    <tool-list @toolChange="onToolChange" @closeComponentCoverage="componentTool = null" :profileArr="profileArr" :componentTool="componentTool"></tool-list>
    <!-- 工具-图层 -->
    <transition name="project-slide-left">
      <component v-if="componentTool" :is="'tool-'+ componentTool" :componentTool.sync="componentTool"></component> 
    </transition>
    <!-- 剖面分析 -->
    <component v-if="componentProfile" :is="'tool-'+ componentProfile" :profileArr="profileArr" :componentProfile.sync="componentProfile"></component>
    
  </div>
</template>
<script>
import { mapState } from "vuex";
import headerPanel from "@/components/header/header-panel.vue";
import loadingPanel from "@/components/utils/loading/loading.vue";
import compass from "@/components/compass/compass.vue";
import earthFan from "@/components/earth-fan.vue";
import typeSetting from "@/components/schemePanel/type-setting.vue";
import fanAddExist from "@/components/projectUpload/component/fan-add-exist.vue";
import fanAddResult from "@/components/projectUpload/component/fan-add-result.vue";
import fanAddAuto from "@/components/projectUpload/component/fan-add-auto.vue";
import toolList from "@/components/tool-list.vue";
import comparisonOverlap from "@/components/comparison/comparison-overlap.vue";
import comparisonOverlapDetails from "@/components/comparison/comparison-overlap-details.vue";
import { LayerConfig } from "@/config/layer-config.js";
import envConfig from '@/config/env-config'
import { removeToken, removeLocal, getLocal } from '@/utils/auth';
import { getProjectList, getProjectInfo, getTurbineDetails } from "@/api/server.request.js"

export default {
  name: "home",
  components:{
    headerPanel,
    loadingPanel,
    compass,
    earthFan,
    typeSetting,
    fanAddExist,
    fanAddResult,
    fanAddAuto,
    toolList,
    comparisonOverlap,
    comparisonOverlapDetails,
    'scheme-comparison': () => import('@/components/comparison/scheme-comparison.vue'),
    'tool-coverage': () => import('@/components/tool-coverage.vue'),
    'tool-profile': () => import('@/components/tool-profile.vue'),
    'turbine-popup': () => import('@/components/schemePanel/component/turbine-popup.vue'),
    'mast-popup': () => import('@/components/schemePanel/component/mast-popup.vue'),
    'ppt': () => import('@/components/ppt/index.vue')
  },
  data () {
    return {
      labelShow: true,
      animationChange: false,
      waitingMinute: false,
      defalutLayerList: [], // 默认加载一些图层
      projectName: '数字化规划设计平台',
      projectInfoName: null,
      componentTool: '',
      componentProfile: '',
      profileArr:[], 
    }
  },
  created(){
    this.$store.dispatch("setUser", getLocal(envConfig.appTitle + '-user'))
  },
  mounted () {
    this.refreshRouter();

    window.onkeydown = function(e) {
      // console.log(e.keyCode)
      if(e && e.keyCode == 87){
        this.labelShow = !this.labelShow
        gwmap.wtLayer.lableShow(11112775,this.labelShow)
      }
    }
    // // 例子
    // setTimeout(()=>{
    //   gwmap.dataManager.storageAtWill((res)=>{
    //     console.log(res) // 任意视角Data, 还原任意位置定位用，ppt存下后端接口
    //     setTimeout(()=>{
    //       gwmap.dataManager.flyToStorageAtWill(res)
    //     },5000)
    //   })
    // },5000)
  },
  beforeDestroy () {
    
  },
  computed:{
    ...mapState({
      userInfo: state => state.user.userInfo,
      projectInfo: state => state.app.projectInfo,
      uploadScheme_id: state => state.app.scheme_id,
      scheme_id: state => state.app.scheme_id,
      pptModel: state => state.app.pptModel
    }),
    language (){
      return this.$i18n.locale;
    },
    comRouters() {
      // return this.$store.getters.permission_routers.filter(item => { 
      //   return item.children && item.children.length > 0 && !item.meta.xxxx 
      // }) 根据权限todo=> 显示 or 至灰 or 跳转 or ....
    }
  },
  watch:{
    language (val){
      // 可按需全局修改 英文样式.enClass
      if (val != 'zh'){
        app.classList.add('enClass')
        this.projectName = this.projectInfoName ? this.projectInfoName : "Digital planning and design platform"
      } else{
        app.classList.remove('enClass')
        this.projectName = this.projectInfoName ? this.projectInfoName : "数字化规划设计平台"
      }
    },
    waitingMinute () {
      this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.pleaseLater')});
    },
    $route (to, from){
      this.routeUpdate(to)
    },
    "$store.state.app.profilePoints":function(val){
      if(val.length>0){
        // console.log(val)
        this.profileArr = val;
        this.componentProfile = 'profile'
      }
    },
    projectInfo (item){
      if (!item){
        document.querySelector('#map-status-bar').classList.remove('mapStatusbar_project')
        return;
      }
      this.projectInfoName = item.project_name;
      document.querySelector('#map-status-bar').classList.add('mapStatusbar_project')
    },
    scheme_id (val) {
      if(!val) return;
      getTurbineDetails({
        project_id: this.$route.query.id || this.projectInfo.project_id,
        scheme_id: val
      }).then((res) => {
        if (res.code != 200) {
          this.$message.error(res.message)
          return
        }
        this.$store.commit('setSchemeInfo', JSON.parse(JSON.stringify(res.data)))
      })
    }
  },
  methods: {
    // 再次点击取消选中，这里清空一系列东西  upload-fan  927行触发
    clearOpenTemplate (){
      gwmap.wtLayer.remove()
      setTimeout(()=>{
        this.$store.commit('unCheckSchemeClear')
      }, 1500)

    },
    // 刷新页面
    refreshRouter(){
      console.log(this.$route.path, "init111111")
      
      if (this.$route.path.indexOf('/index/project') != -1){
        this.getProjectInfoData(this.$route.query.id)
      }
      this.getProjectDataList();
      this.getLoadLayer();
    },
    getLoadLayer (){
      this.defalutLayerList = LayerConfig.filter((item,index)=>{
        return item.layerId < 0;
      })
      if(this.defalutLayerList.length > 0){
        this.defalutLayerList.forEach((item,index)=>{
          gwmap.loadServiceLayer(item);
        })
      }
    },
    getProjectDataList(){
      getProjectList().then((res)=>{
        if(res.code == 403 ) return;
        if(res.code != 200 ){
            this.$message.error(res.message);
            return;
        }
        gwmap.fanLayer.load();
        res.data.forEach((item,index)=>{
            gwmap.fanLayer.add(item);
        })
      })
    },
    // 路由变化
    routeUpdate (to){
      console.log(to.path, "1111111")
      this.$store.commit("routePath", to.path);
      if (to.path.indexOf('/user') != -1){
        this.animationChange = true;
      } else{
        this.animationChange = false;
      }
      if (to.path.indexOf('/list') != -1){
        this.componentTool = null;
      }
      if (to.path.indexOf('/index') != -1){
        this.$store.dispatch("setUser", getLocal(envConfig.appTitle + '-user'))
      }
      if (to.path == '/index'){
        this.getProjectDataList();
      }
      //  console.log(this.$route.query.disable, "init1111000011")
      if (to.path.indexOf('/index/project') != -1){
        if (this.$route.query.disable){
          this.clearOpenTemplate()
          return
        }
        this.getProjectInfoData(this.$route.query.id)
      }
    },
    // 指南针
    onChangeAngle (deg) {
      console.log(deg)
      gwmap.dataManager.rotateToHome(deg)
      this.$store.commit('northInfoAngle', deg)
    },
    clearProjectName (){
      this.projectInfoName = null
    },
    // 工具事件
    onToolChange (data){
      // console.log(data);
      this.componentTool = null;
      switch (data.type){
        case 'coverage': // 图层
          this.componentTool = "coverage";
        break;
        case 'favorite': //收藏夹
          
        break;
      }
      
    },
    getProjectInfoData (project_id){
      let p1 = new Promise((resolve, reject) => {
        getProjectInfo(project_id).then((res)=>{
          if (res.code != 200){
              this.$message.error(res.message);
              reject(res.message)
              return;
          }
          this.$store.commit('setProjectInfo', res.data);
          
          if (res.data.four_point) {
            gwmap.dataManager.fltToRectangle(res.data.four_point, this.uploadScheme_id)
          }else{
            gwmap.dataManager.flyToLocation(res.data.longitude, res.data.latitude);
          }
          resolve('ok')
        })
      })
      Promise.all([p1]).then((res)=>{

        let schemeID = this.$route.query.scheme_id
        if (schemeID){
          this.$store.commit('setScheme_id', schemeID)

        }
      })
    }
  }
}
</script>
<style lang="scss">
.appMain{
  // position: fixed;
}
.el-form-item__error{
  bottom: -7px;
}
.mapStatusbar_project{
  padding-right: 0.65rem;
}
.imgUrl{
  position: fixed;
  top: 0;
  left: 0;
  z-index:9999999999;
}
</style>