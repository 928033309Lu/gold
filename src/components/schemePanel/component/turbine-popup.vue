<template>
  <div class="turbine-popup" v-if="visible">
    <div class="title">风机 {{turbine.turbine_name}}
      <i class="iconfont icon-close" @click="visible = false"></i>
    </div>
    <ul class="content">
      <li><span>海拔：</span> <span> {{Number(turbine.elevation.toFixed(1))}} m</span></li>
      <li><span>自由平均风速：</span> <span> {{Number(turbine.free_speed.toFixed(2))}} m/s</span></li>
      <li><span>平均尾流：</span> <span> {{Number(turbine.speed_discount.toFixed(1))}} %</span></li>
      <li><span>尾流后风速：</span> <span> {{Number(turbine.waked_speed.toFixed(2))}} m/s</span></li>
      <li><span>尾流后发电量：</span> <span> {{Number(turbine.array_yield.toFixed(2))}} MWh</span></li>
      <li><span>等效小时：</span> <span> {{Number(turbine.equal_hours.toFixed(2))}} h</span></li>
    </ul>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  import {getMapWindInfo} from "@/api/server.request.js"

  export default {
    name: 'turbine-popup',
    data() {
      return {
        visible: false,
        turbine: null,
      }
    },
    components:{
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        clickFanWtData: state => state.app.clickFanWtData
      })
    },
    watch: {
      clickFanWtData(val) {
        if (val) {
          this.init(val)
        }
      }
    },
    mounted() {

    },
    methods: {
      init(turbine){
        this.visible = true
        this.turbine = turbine
      }
    }

  }
</script>
<style lang="scss" scoped>
  .turbine-popup {
    cursor: pointer;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 99999;
    width: 3rem;
    /*min-height: 3rem;*/
    margin-left: -4.5rem;
    margin-top: -1.5rem;
    padding-bottom: 0.18rem;
    border-radius: 0.2rem 0.2rem 0.16rem 0.16rem;
    background: rgba(255, 255, 255, 1);
    color: #333333;
    .title{
      height: 0.45rem;
      line-height: 0.35rem;
      padding: 0.05rem 0.1rem;
      background: rgba(235, 242, 228, 1);
      border-radius: 0.2rem;
      color: #333333;
      margin-bottom: 0;
      .iconfont{
        position: absolute;
        right: 0.15rem;
        top: 0.05rem;
        font-size: 0.16rem;
        color: #6D7D41;
        cursor: pointer;
      }
    }
    .content {
      padding: 8px 6px 0 6px;
      font-size: 0.13rem;
      li {
        margin-top: 10px;
        display: flex;
        span:first-child {
          display: inline-block;
          min-width: 65px;
        }
        span:last-child {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .titleName {
      color: #2CD0B9;
      font-size: 0.16rem;
      font-weight: bold;
    }
  }
</style>