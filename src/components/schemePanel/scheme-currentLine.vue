<template>
  <div class="currentLine">
    <div class="title">
      <span>{{$t('m.currentLine')}}</span>
      <span @click="toggleFold" :class="fold ? 'fold' : ''"><i class="iconfont icon-sanjiao"></i></span>
    </div>
    
    <div class="content" v-if="!fold">
      <ul class="left">
        <li>
          <span>电压等级</span>:
          <span> </span>
        </li>
        <li>
          <span>线路总长度</span>:
          <span>{{ detailsData && detailsData.lineLength.toFixed(2) }} 米</span>
        </li>
        <li>
          <span>转角塔个数</span>:
          <span>{{ detailsData && detailsData.angleTowerNum }} 个</span>
        </li>
        <li>
          <span>直线塔个数</span>:
          <span>{{detailsData && detailsData.lineTowerNum}} 个</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {mapState} from "vuex"
  import {getLine} from "@/api/server.request.js"
  import envConfig from '@/config/env-config'
  export default {
    name: 'currentLine',
    components: {},
    props: {

    },
    data() {
      return {
        fold: false,
        detailsData: {
          lineLength: 0,
          angleTowerNum: 0,
          lineTowerNum: 0
        }
      }
    },
    computed: {
      ...mapState({
        schemeId: state => state.app['scheme_id'],
        projectInfo: state => state.app.projectInfo,
        lineListInfo: state => state.app.lineListInfo,
        mapCameraPos: state => state.projectUpload.mapCameraPos,
      }),
    },
    watch: {
      schemeId (){
        this.init()
      },
      lineListInfo (val){
        console.log(val)
        if (val){
          this.detailsData.lineLength = 0
          this.detailsData.angleTowerNum = 0
          this.detailsData.lineTowerNum = 0
          val.forEach((item, index)=>{
            this.detailsData.lineLength += item.lineInfo.routeLength
            this.detailsData.angleTowerNum += item.lineInfo.angleTowerNum
            this.detailsData.lineTowerNum += item.lineInfo.lineTowerNum
          })
          // console.log(this.detailsData)
        }
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      gwmap.towerLineNewLayer.remove()
      this.$store.commit('setLineListInfo', null)
      console.log("beforeDestroy--overview")
    },
    methods: {
      init() {
        // 加载到亨线路 /10000299/Scheme/-1/windturbine_coordinate.jf
        let url = envConfig.S3Path + '/' + this.projectInfo.project_id + '/Scheme/' + this.schemeId + '/windturbine_coordinate.jf'
        gwmap.towerLineNewLayer.load(url)
        if (this.pptModel && this.mapCameraPos) {
          gwmap.dataManager.flyToStorageAtWill(this.mapCameraPos)
        }
      },
      toggleFold () {
        this.fold = !this.fold
      }
    }
  }
</script>
<style lang="scss" scoped>
  .currentLine {
  }

</style>
