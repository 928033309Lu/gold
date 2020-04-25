<template>
  <el-drawer
      :modal="false"
      :wrapperClosable="false"
      :append-to-body="false"
      :modal-append-to-body="false"
      class="mast-tabs"
      :class="{'small': projectUnfold, 'medium': !projectUnfold, 'maximize': maximize, 'ppt-model': pptModel == 'edit'}"
      :visible.sync="visible"
      direction="btt">
    <ul slot="title">
      <li @click="changeTabs(1)" :class="{active: activeTab == 1}">测风塔概览</li>
      <li @click="changeTabs(2)" :class="{active: activeTab == 2}">测风塔参数分析</li>
      <li @click="changeTabs(3)" :class="{active: activeTab == 3}">代表年分析</li>
    </ul>
    <mast-overview v-if="activeTab == 1" :mastList="mastList"></mast-overview>
    <mast-param-analysis v-if="activeTab == 2" ref="mast-param-analysis" :mastList="mastList" @setMaximize="setMaximize"></mast-param-analysis>
    <mast-repre-year-analysis v-if="activeTab == 3" :mastList="mastList" :allMast="allMast"></mast-repre-year-analysis>
  </el-drawer>
</template>
<script>
  import {mapState} from "vuex";

  export default {
    name: "mast-tabs",
    data() {
      return {
        visible: false,
        activeTab: 1,
        maximize: false
      }
    },
    props: ['mastList', 'allMast'],
    components:{
      'mast-overview': () => import('@/components/schemePanel/component/mast-overview.vue'),
      'mast-param-analysis': () => import('@/components/schemePanel/component/mast-param-analysis.vue'),
      'mast-repre-year-analysis': () => import('@/components/schemePanel/component/mast-repre-year-analysis.vue'),
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        schemeInfo: state => state.app.schemeInfo,
        projectUnfold: state => state.projectUpload.projectUnfold,
        pptModel: state => state.app.pptModel
      })
    },
    watch:{
      visible (val){
        if(!val){
          this.$emit('closeMastTab')
        }
      }
    },
    methods: {
      toggleDraw() {
        this.visible = !this.visible;
      },
      closeDraw() {
        this.visible = false;
      },
      changeTabs(tab) {
        this.activeTab = tab
        this.maximize = false
        this.$refs['mast-param-analysis'] && this.$refs['mast-param-analysis'].toMinimise()
      },
      setMaximize (bool) {
        this.maximize = bool
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mast-tabs {
    top: unset;
    right: unset;
    overflow: visible;
    &.medium {
      width: calc(100% - 0.62rem);
    }
    &.small {
      width: calc(100% - 4.57rem);
    }
    &.maximize {
      /deep/.el-drawer {
        height: 100vh !important;
        display: unset;
      }
    }
    /deep/ .el-drawer {
      height: 3.3rem !important;
      border-radius: 0.22rem 0.22rem 0 0;
      overflow: visible;
      outline: none;
      .el-drawer__header {
        height: 0.45rem;
        padding: 0.1rem 0.2rem;
        background: rgba(235, 242, 228, 1);
        border-radius: 0.22rem;
        color: #333333;
        margin-bottom: 0;
        ul{
          li{
            display: inline-block;
            padding: 0.08rem 0.17rem;
            border-radius: 0.15rem;
            cursor: pointer;
            &+li{
              margin-left: 0.1rem;
            }
            &.active{
              background-color: #fff;
              color: #2CD0B9;
            }
          }
        }
        span {
          outline: none;
          user-select: none;
        }
      }
      .el-drawer__body {
        padding: 0.07rem;
        height: calc(100% - 0.5rem);
      }
      /deep/.el-select{
        .el-input__inner{
          width: 1rem;
          background-color: #EBF2E4;
          border: none;
          height: 0.2rem;
          line-height: 0.2rem;
        }
        .el-input__suffix{
          top: 7px;
        }
        .is-focus{
          .el-input__suffix{
            top: -6px;
          }
        }
      }
    }
    &.ppt-model{
      left: 2.5rem;
      &.medium {
        width: calc(100% - 3.12rem);
      }
      &.small {
        width: calc(100% - 7.07rem);
      }
    }
  }
</style>
