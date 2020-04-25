<template>
  <div class="boosterStation">
    <div class="title">
      <span>{{$t('m.boosterStation')}}</span>
      <span @click="toggleFold" :class="fold ? 'fold' : ''"><i class="iconfont icon-sanjiao"></i></span>
    </div>
    
    <div class="content" v-if="!fold">
      <ul class="left">
        <li>
          <span>占地面积</span>:
          <span>{{ detailsData && detailsData.station_floor_area }} 平方米</span>
        </li>
        <li>
          <span>基准高程</span>:
          <span>{{ detailsData && detailsData.station_base_elevation }} 米</span>
        </li>
        <li>
          <span>总填方量</span>:
          <span>{{ detailsData && detailsData.station_fill_amount }} 立方米</span>
        </li>
        <li>
          <span>总挖方量</span>:
          <span>{{detailsData && detailsData.station_excavation}} 立方米</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {mapState} from "vuex"
  import { station_get } from "@/api/server.request.js"

  export default {
    name: 'boosterStation',
    components: {},
    props: ['detailsData'],
    data() {
      return {
        fold: false
      }
    },
    computed: {
      ...mapState({
        schemeId: state => state.app['scheme_id'],
        projectInfo: state => state.app.projectInfo,
        schemeInfo: state => state.app.schemeInfo,
        mapCameraPos: state => state.projectUpload.mapCameraPos,
      }),
    },
    watch: {
      schemeId (){
        this.init()
      },
      detailsData (val) {
        val && this.init()
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      gwmap.stationLayer.remove()
      console.log("beforeDestroy--overview")
    },
    methods: {
      init() {
        if (!this.detailsData) return
        gwmap.stationLayer.load({
          lon: this.detailsData.syz_x,
          lat: this.detailsData.syz_y,
          // lon: 116.35929108,
          // lat: 39.95659611
          // angle: Number(this.formData.angle)
        });
        if (this.pptModel && this.mapCameraPos) {
          gwmap.dataManager.flyToStorageAtWill(this.mapCameraPos)
        } else {
          gwmap.stationLayer.zoomToLayer()
        }
      },
      toggleFold () {
        this.fold = !this.fold
      }
    }
  }
</script>
<style lang="scss" scoped>
  .boosterStation {
  }

</style>
