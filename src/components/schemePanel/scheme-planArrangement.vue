<template>
  <div class="plan-overview">
    <div class="title">
      <span>方案概览</span>
    </div>
    
    <div class="content">
      <ul class="left">
        <li>
          <span>机型</span>:
          <span>
            <p v-for="item in schemeInfo.turbine_type_info" :key="item.turbine_type">{{item.turbine_type}} {{item.turbine_count}}台</p>
          </span>
        </li>
        <li>
          <span>容      量</span>:
          <span>{{schemeInfo && Number(schemeInfo.real_capacity.toFixed(1))}} MW</span>
        </li>
        <li>
          <span>自由平均风速</span>:
          <span>{{schemeInfo && Number(schemeInfo.free_speed.toFixed(2))}} m/s</span>
        </li>
        <li>
          <span>平均尾流</span>:
          <span>{{schemeInfo && Number(schemeInfo.wake_flow.toFixed(1))}} %</span>
        </li>
        <li>
          <span>尾流后风速</span>:
          <span>{{schemeInfo && Number(schemeInfo.wake_speed.toFixed(2))}} m/s</span>
        </li>
        <li>
          <span>尾流后发电量</span>:
          <span>{{schemeInfo && Number(schemeInfo.wake_aep.toFixed(2))}} MWh</span>
        </li>
        <li>
          <span>折减系数</span>:
          <span>{{schemeInfo && Number(schemeInfo.reduction_factor.toFixed(3))}}</span>
        </li>
        <li>
          <span>年上网电量</span>:
          <span>{{schemeInfo && Number(schemeInfo.real_aep.toFixed(2))}} MWh</span>
        </li>
        <li>
          <span>等效小时</span>:
          <span>{{schemeInfo && Number(schemeInfo.equal_hours.toFixed(2))}} h</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {getTurbineDetails} from "@/api/server.request.js"
  import {mapState} from "vuex"

  export default {
    name: 'plan-overview',
    components: {},
    props: {},
    data() {
      return {
      }
    },
    computed: {
      ...mapState({
        schemeId: state => state.app['scheme_id'],
        projectInfo: state => state.app.projectInfo,
        schemeInfo: state => state.app.schemeInfo
      }),
      turbineType () {
        if (this.schemeInfo && this.schemeInfo.turbine_type_info) {
          return this.schemeInfo.turbine_type_info.map (v => {
            return v.turbine_type
          }).join("、")
        } else {
          return ''
        }
      },
      height () {
        if (this.schemeInfo && this.schemeInfo.height) {
          return this.schemeInfo.height.map(v=>{return Number(v.toFixed(1))}).join("、")
        }
      },
      turbineCount () {
        if (this.schemeInfo && this.schemeInfo.turbine_type_info) {
          return this.schemeInfo.turbine_type_info.map (v => {
            return v.turbine_count
          }).join("、")
        }
      }
    },
    watch: {
      schemeId (){
        this.init()
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      console.log("beforeDestroy--overview")
    },
    methods: {
      init() {
      },
    }
  }
</script>
<style lang="scss" scoped>
  .plan-overview {
    position: absolute;
    top: 0;
    right: 0.6rem;
    z-index: 999;
    
    width: 3.8rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 7px 0px rgba(9, 38, 40, 0.4);
    border-radius: 0.22rem 0.22rem 0.18rem 0.18rem;
    .title {
      padding: 0 0.2rem;
      color: #333333;
      height: 0.45rem;
      background: rgba(235, 242, 228, 1);
      border-radius: 0.22rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:nth-of-type(1) {
        font-weight: bold;
      }
    }
    .content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      /deep/ .el-divider--vertical {
        width: 1px;
        height: 70%;
        top: 15%;
        margin: 0 3px;
      }
      .left {
        width: 100%;
        padding: 0.1rem 0;
        li {
          padding-left: 0.15rem;
          line-height: 0.25rem;
          display: flex;
          span:nth-of-type(1) {
            text-align: right;
            display: inline-block;
            width: 1rem;
            text-align: justify;
            text-align-last: justify;
            margin-right: 0.1rem;
          }
          span:nth-of-type(2) {
            flex: 1;
            padding-left: 0.14rem;
          }
        }
      }
      .right {
        width: 49%;
      }
    }
  }

</style>
