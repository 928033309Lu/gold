<template>
  <div class="scheme-windData">
    <div class="title">
      <div class="line"></div>
      <span>测风数据</span></div>

    <div class="content" v-for="(item, index) of windData" :key="'t'+index">
      <!-- <el-checkbox :ref="'checkbox_'+ item.label"
      v-show="item.isShow"
          @change="changeCheckbox($event, item)"
          :checked="item.checked">
          {{$t('m.' + item.label)}}
      </el-checkbox> -->
      <div class="el-checkbox" v-show="item.isShow">
        <input type="checkbox" v-model="item.checked" :ref="'checkbox_'+ item.label" :id="'checkbox_'+ item.label"
               style="position: absolute;z-index: -1;opacity: 0;"
               @change="changeCheckbox2($event, item)"></input>
        <label :for="'checkbox_'+ item.label" class="my_checkbox_input_box">
          <span class="my_checkbox_input" :class="item.checked ? 'is_checked' : ''"></span>
          {{$t('m.' + item.label)}}</label>
      </div>

    </div>

    <!-- <mast-tabs ref="mastTabs" :mastList="windDataList" @closeMastTab="onCloseMastTab"></mast-tabs> -->
    <mast-tabs ref="mastTabs" :mastList="windDataList" :allMast="windDataListLayer" @closeMastTab="onCloseMastTab2"></mast-tabs>
  </div>
</template>
<script>

  import {mapState} from "vuex"
  import {mastStatusConfidence, getMastList, getCreditPoint, mastStatus} from "@/api/server.request.js"

  export default {
    name: 'scheme-windData',
    components: {
      'mast-tabs': () => import('@/components/schemePanel/component/mast-tabs.vue'),
    },
    props: {},
    data() {
      return {
        windData: [],
        windDataList: [],
        windDataListLayer: [],
        confidenceStatusInfo: null,
        mastStatusInfo: null,
        mastCalculateStatus: null
      }
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        schemeMemu: state => state.projectUpload.schemeMemu,
        refreshMastLayer: state => state.projectUpload.refreshMastLayer,
        scheme_id: state => state.app.scheme_id,
        mainMast: state => state.projectUpload.mainMast,
        mastStatus: state => state.projectUpload.mastStatus,
        refreshWindLayer: state => state.projectUpload.refreshWindLayer,
        pptModel: state => state.app.pptModel,
        mapCameraPos: state => state.projectUpload.mapCameraPos,
      })
    },
    watch: {
      refreshWindLayer (val){
        console.log(val, "888888888")
        if (val){
          getMastList(this.projectInfo.project_id).then((res) => {
            if (res.code != 200) return
            this.windDataListLayer = res.data
            gwmap.mastLayer.loadMast(this.windDataListLayer)
          })
        }
      },
      schemeMemu: {
        handler(val, oldVal) {
          this.windData = val[2].children
        },
        deep: true
      },
      mainMast: {
        handler(val, oldVal) {
          this.loadMastList()
        },
        deep: true
      },
      mastStatus: {
        handler(val, oldVal) {
          this.loadMastList()
        },
        deep: true
      }
    },
    mounted() {
      this.windData = this.schemeMemu[2].children
      this.initConfidence()
      this.getMastStatus()
      this.initInformation('layer')
      // this.loadMastList('layer')
    },
    beforeDestroy() {
      this.windData[0].checked = false
      this.windData[1].checked = false
      this.windData[2].checked = false
      // console.log(this.windData)
      gwmap.mastLayer.remove()
      gwmap.creditLayer.remove()
      clearTimeout(this.mastCalculateStatus)
    },
    methods: {
      initPPtPlay () {
        //演示模式初始渲染
        let vm = this
        if (!this.pptModel) return
        this.$nextTick(() => {
          this.windData.forEach((v, index) => {
            vm.changeCheckbox2(null, v)
            if (index == vm.windData.length - 1) {
              gwmap.dataManager.flyToStorageAtWill(vm.mapCameraPos)
            }
          })
        })
      },
      initConfidence() {
        mastStatusConfidence(this.projectInfo.project_id).then((res) => {
          if (res.code == 200) {
            if (res.data[res.data.length - 1].status == 2) {
              this.$store.commit('setSchemeMemu', {
                type: 'windDataConfidence',
                data: true
              })
            }
            else {
              this.$store.commit('setSchemeMemu', {
                type: 'windDataConfidence',
                data: false
              })
            }
          }
        })
      },
      // 步骤
      getMastStatus (type = null){
        mastStatus(this.projectInfo.project_id).then((res)=>{
          if(res.code == 200){
            this.mastStatusInfo = res.data.filter((item, index) => {
              return item.step_name == 'wind_info' && item.mast_task
            })
            this.confidenceStatusInfo = res.data.filter((item, index) => {
              return item.step_name == 'mast_confidence'
            })
            // console.log(this.confidenceStatusInfo)
            var statuss = false
            var statuss1 = false
            statuss = this.mastStatusInfo.some((item, index)=>{
              return item.status == 1 || item.status == 0
            })
            this.$store.commit('calculateStatus', {
              type: 'mast',
              data: this.mastStatusInfo,
              data2: this.confidenceStatusInfo
            })
            if(this.mastCalculateStatus){
              clearTimeout(this.mastCalculateStatus)
            }
            if (statuss) {
              this.mastCalculateStatus = setTimeout(()=>{
                this.getMastStatus()
              }, 5000)
            }
          }
        }).catch((err)=>{
          clearTimeout(this.mastCalculateStatus)
        })
      },
      // 当且仅当有测风塔数据解析成功时，才显示测风塔信息
      initInformation(layer) {
        let successNum = this.mastStatus.filter(v => {
          return v.step_name == 'wind_info' && v.status == 2
        })
        if (successNum.length) {
          this.$store.commit('setSchemeMemu', {
            type: 'windTowerInformation',
            data: true
          })
        } else {
          this.$store.commit('setSchemeMemu', {
            type: 'windTowerInformation',
            data: false
          })
        }
        this.loadMastList(successNum, layer)
      },
    //   changeCheckbox(value, item) {
    //     item.checked = value
    //     console.log(value, item)
    //     if (item.label == 'windTowerModel' && item.checked) {
    //       // gwmap.mastLayer.load(this.windDataListLayer)
    //       gwmap.mastLayer.loadMast(this.windDataListLayer)
    //     }
    //     if (item.label == 'windTowerModel' && !item.checked) {
    //       gwmap.mastLayer.remove()
    //     }
    //     if (item.label == 'windTowerInformation') {
    //       if (item.checked) {
    //         this.mastClick()
    //       } else {
    //         this.$refs.mastTabs.closeDraw()
    //       }
    //     }
    //     if (item.label == 'windConfidence') {
    //       if (item.checked) {
    //         this.getCreditData()
    //       } else {
    //         gwmap.creditLayer.remove()
    //       }
    //     }
    //   },
      changeCheckbox2(ev, item) {
        console.log("new", item)
        // console.log(this.windDataListLayer)
        item.checked = item.checked
        ev && this.$store.commit('setSchemeMemu', {
          type: 'windDataCheck',
          data: this.schemeMemu[2].children
        })
        if (item.label == 'windTowerModel' && item.checked) {
          gwmap.mastLayer.loadMast(this.windDataListLayer)
        }
        if (item.label == 'windTowerModel' && !item.checked) {
          gwmap.mastLayer.remove()
        }
        if (item.label == 'windTowerInformation') {
          if (item.checked) {
            this.mastClick()
          } else {
            this.$refs.mastTabs && this.$refs.mastTabs.closeDraw()
          }
        }
        if (item.label == 'windConfidence') {
          if (item.checked) {
            this.getCreditData()
          } else {
            gwmap.creditLayer.remove()
          }
        }
      },
      onCloseMastTab2() {
        this.windData[2].checked = false
        this.$refs.checkbox_windTowerInformation[0].checked = false
      },
      getCreditData() {
        // if (!this.scheme_id) return;

        getCreditPoint(this.projectInfo.project_id).then((res) => {
          if (res.code != 200) {
            this.$message.error(res.message)
            return
          }
          gwmap.creditLayer.load(res.data)
        })
      },
      onCloseMastTab() {
        // console.log(this.$refs.checkbox_windTowerInformation[0])
        this.windData[2].checked = false
        if (this.$refs.checkbox_windTowerInformation && this.$refs.checkbox_windTowerInformation.length > 0 && this.$refs.checkbox_windTowerInformation[0].checked) {
          this.$refs.checkbox_windTowerInformation[0].checked = false
          this.$refs.checkbox_windTowerInformation[0].model = false
        }
      },
      mastClick() {
        this.$refs.mastTabs.toggleDraw(this.windDataList)
      },
      loadMastList(successNum, isLayer) {
        getMastList(this.projectInfo.project_id).then((res) => {
          if (res.code == 200) {
            if(isLayer == 'layer'){
              this.windDataListLayer = res.data
              if(this.refreshWindLayer && this.windData[0].checked){
                gwmap.mastLayer.loadMast(this.windDataListLayer)
              }
              this.initPPtPlay()
            }
            this.windDataList = res.data.filter(v=>{
              return v.complete && successNum.map(w => {
                return w.mast_task
              }).includes(v.mast_name)
            })
            // this.checkInformationShow()
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .scheme-windData {
    position: absolute;
    top: 1.1rem;
    right: 0.6rem;
    z-index: 99;
    min-width: 1.5rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 7px 0px rgba(9, 38, 40, 0.4);
    border-radius: 0.13rem;
    padding: 0.15rem 0 0.15rem 0;
    /deep/ .el-checkbox {
      margin: 0 0 0 0.1rem;
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
    .content {
      color: #333;
      padding: 0 0.15rem 0 0.1rem;
      line-height: 0.33rem;
      .div {
        padding: 0 0 0 0.1rem;
        cursor: pointer;
      }
    }
  }
</style>
