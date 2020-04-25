<template>
  <div id="app" :class="{'ppt-edit-model': pptModel=='edit'}">
    <div id="bodyCanvas">
      <div id="mapContainer"></div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "app",
  data () {
    return {
      fullWidth: document.documentElement.clientWidth
    }
  },
  created(){
    window.addEventListener('resize', this.handleResize);
  },
  mounted () {
    this.setRem();
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize);
  },
  computed:{
    ...mapState({
      pptModel: state => state.app.pptModel,
    }),
  },
  watch:{
    
  },
  methods: {
    setRem (){
      let designSize = 1920; 
      let rem = this.fullWidth * 100 / designSize; 
      document.documentElement.style.fontSize = rem + 'px';
    },
    handleResize (event) {
      this.fullWidth = document.documentElement.clientWidth;
      this.setRem();
      this.$store.dispatch("handleResize",this.fullWidth);
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/style/fixed/variable-set.scss";
@import "@/assets/style/fixed/app-narrow.scss";
#app{
  font-size: $font-size;
  color: $text-color;
}
#bodyCanvas{
  width: 100vw;
  height: 100%;
}

.defaultUpload{
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: -9;
  width: 10px;
}
// 英文样式
#app.enClass {
  .el-form-item__error{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    min-height: 0.13rem;
    line-height: 0.13rem;
    bottom: -0.13rem;
  }
  .tool-coverage{
    width: 3.48rem;
    .content{
      width: 3.27rem;
    }
  }
  .project-panel .tab-title{
    text-align: right;
    padding-right: 0.1rem;
  }
  .project-panel .footer .title{
    width: 100%;
  }
  .mast-list-element .icon-dianta{
    left: 0;
  }
  .el-form-item__label{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
</style>

