<template>
  <div>
    <div class="scheme-simulationData">
      <div class="title">
        <div class="line"></div>
        <span>CFD仿真</span>
      </div>
      <div v-if="layerList.length <= 0" style="text-align: center;">暂无数据</div>
      <el-checkbox v-else label="风图谱" v-model="openLayer"> </el-checkbox>
      <!-- <div class="wind-label" v-else>风图谱: </div> -->
      <el-checkbox-group v-model='checkedList' :max="1" v-show="openLayer">
        <div class="content" v-for="(item, index) of layerList" :key="'t'+index">
          <el-checkbox :label="item.wrg_height"
                       :checked="item.checked"
                       @change="changeCheckbox($event, item)">{{item.wrg_height}} m
          </el-checkbox>
        </div>
      </el-checkbox-group>
      <el-checkbox v-if="layerList.length" label="风参查询" :checked="searchOpen" @change="changeSearchOpen"> </el-checkbox>
      <wind-map ref="windMap" :height="checkedList[0]"></wind-map>
    </div>
    <div v-if="checkedList.length" class="legend" :class="{'projectUnfold': projectUnfold}">
      <img src="/images/wind-simu.png" alt="">
      <p>综合风图谱<br>风图谱<br>风能切片</p>
    </div>
  </div>
</template>
<script>
  import envConfig from '@/config/env-config.js'
  import {mapState} from "vuex"
  import {getMapLayerUrl, cfdStatus, getMapWindInfo} from "@/api/server.request.js"

  export default {
    name: 'scheme-simulationData',
    components: {},
    props: {},
    data() {
      return {
        openLayer: false,
        layerList: [],
        wrg_radio: '',
        checkedList: [],
        searchOpen: false
      }
    },
    components:{
      'wind-map': () => import('@/components/schemePanel/component/wind-map.vue'),
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        windMap: state => state.projectUpload.windMap,
        cfdList: state => state.projectUpload.cfdList,
        projectUnfold: state => state.projectUpload.projectUnfold,
      })
    },
    watch: {
      cfdList: {
        handler(val, oldVal) {
          this.layerList = val
        },
        deep: true
      },
      windMap (val) {
        if(!this.searchOpen) return
        val && this.$refs.windMap.openWindow(JSON.parse(val))
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.openLayer = false
      this.layerList.forEach(v => {
        v.checked = false
      })
      this.searchOpen = false
      gwmap.windMap.remove()
    },
    methods: {
      init() {
        this.getCfdInfoList()
        this.layerList = this.cfdList
        console.log(this.cfdList)
      },
      getCfdInfoList (){
        cfdStatus(this.projectInfo.project_id).then((res)=>{
          if(res.code == 200){
            let cfdList = res.data.filter((item, index)=>{
              return item.wrg_height && item.status == 2
            })
            this.$store.commit('setCfdList', cfdList)
          }
        })
        },
      changeCheckbox(value, item) {
        item.checked = value
        // console.log(value, item)
        if (item.checked) {
          getMapLayerUrl(this.projectInfo.project_id, item.wrg_height).then((res) => {
            if (res.code != 200) {
              this.$message.error(res.message)
              return
            }
            let dataMap = res.data
            dataMap.mapUrl = envConfig.S3Path + '/' + res.data.url
            // console.log(dataMap)
            gwmap.windMap.loadWindMap();
            gwmap.windMap.addWindMap(dataMap)
          })
        } else {
          gwmap.windMap.remove()
        }
      },
      changeSearchOpen(v){
        console.log(v)
        this.searchOpen = v
      }
    }
  }
</script>
<style lang="scss" scoped>
  .scheme-simulationData {
    position: absolute;
    top: 1.6rem;
    right: 0.6rem;
    z-index: 99;
    min-width: 1.6rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 7px 0px rgba(9, 38, 40, 0.4);
    border-radius: 0.13rem;
    padding: 0.15rem 0 0.15rem 0;
    /deep/ .el-checkbox {
      margin: 0 0 0 0.1rem;
      color: #333333;
    }
    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label{
      color: #5F482E;
    }
    /deep/ .el-radio__label {
      color: #333333;
    }
    .title {
      display: flex;
      align-items: center;
      height: 0.35rem;
      margin-bottom: 0.1rem;
      .line {
        width: 0.07rem;
        height: 0.2rem;
        background: rgba(44, 208, 185, 1);
        margin-right: 0.05rem;
      }
      span {
        font-weight: bold;
        color: #6D7D41;
      }
    }
    .wind-label{
      font-size: 0.16rem;
      line-height: 20px;
      color: #333;
      padding-left: 0.1rem;
    }
    .content {
      color: #333;
      padding: 0 0.15rem 0 0.1rem;
      line-height: 0.33rem;

    }
  }
  div[componentscheme="simulationData"]{
    .legend{
      position: fixed;
      bottom: 30px;
      right: 0.66rem;
      width: 0.75rem;
      height: 2.04rem;
      border: 1px solid rgba(211,219,228,.4);
      border-radius:0px 0px 4px 4px;
      padding-top: 0.06rem;
      text-align: center;
      &.projectUnfold{
        right: 4.63rem;
      }
      img {
        width: 0.17rem;
        height: 1.41rem;
        margin: 0 auto;
        margin-bottom: 0.02rem;
      }
      p {
        text-align: left;
        height: 0.54rem;
        background-color: #fff;
        font-size:12px;
        line-height: 14px;
        color:rgba(95,72,46,1);
        padding: 0.05rem;
        white-space: nowrap;
      }
    }

  }

</style>
