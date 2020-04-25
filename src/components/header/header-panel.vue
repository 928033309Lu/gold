<template>
  <div class="header-panel" :style="projectInfo ? 'padding-right: 0.65rem;' : ''" :class="{comparisonActive: comparison}">
    <div>
      <div class="projectName"> 
        <div class="title">{{projectName}}</div> 
        <span class="iconlocation" @click="setLocation"><i class="iconfont icon-dingwei1"></i></span>
      </div>
    </div>
    <div class="right">
      <div style="position: relative;" :class="searchPanel ? 'project-search' : ''">
        <project-search :search="searchPanel" @closeSearch="initSearch"></project-search>
        <div class="saerchBtn" @click="handleSearch(search)" ><i :class="search.icon"></i></div>
      </div>

      <div @click="handleProject(project)" :class="project.active? 'iconActive' : ''"><i :class="project.icon"></i></div>
      <div @click="handleFullScreen"><i class="iconfont icon-quanping1"></i></div>
      
      <el-dropdown trigger="hover" @command="onDropdownLang" placement="bottom">
        <span class="el-dropdown-link">
          <img v-if="langEnglish" src="/images/en.png"/>
          <img v-else src="/images/zh.png"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh"><img src="/images/zh.png"/>中文</el-dropdown-item>
          <el-dropdown-item command="en"><img src="/images/en.png"/>English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="hover" @command="onDropdown">
        <span class="el-dropdown-link">
          <i class="iconfont icon-yonghuming"></i> {{userInfo && userInfo.user_name}} <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) of userList" :key="index"
          :icon="item.icon" :command="item.path"
          :class="item.active || indexPath == item.path ? 'dropdownActive' : ''"
          >{{$t('m.'+ item.label)}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { userList, project, search } from "@/config/header-config"
import projectSearch from "@/components/header/project-search.vue";
export default {
  name: "headerPanel",
  props:["projectName", "userInfo"],
  components:{
    projectSearch
  },
  data () {
    return {
      searchPanel: false,
      langEn: false,
      fullscreen: false,
      indexPath: '',
      userList: [],
      project: {},
      search: {}
    }
  },
  created(){
    
  },
  mounted () {
    this.userList = userList;
    this.project = project;
    this.search = search;
    this.indexPath = this.$route.path;
  },
  beforeDestroy () {
    this.initSearch();
  },
  computed: {
    ...mapState({
      projectInfo: state => state.app.projectInfo,
      allUploadNameInfo: state => state.projectUpload.allUploadNameInfo,
      uploadScheme_id: state => state.app.scheme_id,
      comparison: state => state.app.comparison,
    }),
    langEnglish () {
      return this.$i18n.locale == "en"; // default:false
    }
  },
  watch:{
    "$store.state.app.routePath"(val){
      this.indexPath = val;
      if (val.path != "/index"){
        this.initSearch();
      }
    }
  },
  methods: {
    initSearch (){
      this.searchPanel = false;
    },
    onDropdownLang(command){
      this.initSearch()
      this.$i18n.locale = command
      this.$store.commit("language", this.$i18n.locale)
    },
    handleFullScreen () {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    onDropdown(command) {
      this.initSearch()
      let that = this;
      switch (command) {
        case "/login":
          that.$store.dispatch('FedLogOut').then(() => {
            console.log('登出OK');
            that.$router.push('/login');
          })
          break;
        default: 
          that.$router.push(command);
      }
    },
    // 搜索
    handleSearch (item){
      this.searchPanel = true;
    },
    handleProject (item){
      this.$router.push(item.path);
    },
    setLocation (){
      if (!this.projectInfo){
        gwmap.dataManager.fltToHome()
      }else{
        // console.log("定位风场")
        if(this.projectInfo.four_point){
          
          gwmap.dataManager.fltToRectangle(this.projectInfo.four_point, this.uploadScheme_id)
        }else{
          gwmap.dataManager.flyToLocation(this.projectInfo.longitude, this.projectInfo.latitude);
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/fixed/variable-set.scss";
.header-panel{
  color: $text-color;
  font-size: $font-size;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.33rem;
  line-height: 0.33rem;
  margin: 0.18rem 0 0 0;
  padding: 0 0 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.5s;
  img{
    width: 0.27rem;
    vertical-align: middle;
  }
  .iconfont{
    font-size: 0.22rem;
  }
  .right{
    display: flex;
    align-items: center;
    &>div{
      margin-right: 0.16rem;
      cursor: pointer;
      outline: none;
    }
    &>div:not(:first-child):hover{
      color: $bg-color;
      transform: scale(1.1);
    }
    &>div:last-child:hover{
      transform: scale(1);
    }
    &>div:first-child:hover .saerchBtn{
      color: $bg-color;
      transform: scale(1.1);
    }
    
  }
  .projectName{
    text-align: center;
    min-width: 1rem;
    font-size: 0.2rem;
    background: rgba(44,208,185,0.5);
    margin: 0 0.26rem;
    position: relative;
    .iconlocation{
      display: inline-block;
      position: absolute;
      right: -0.55rem;
      top: 0;
      font-size: 0.35rem;
      color: $bg-color;
      cursor: pointer;
    }
    .iconlocation:hover{
      transform: scale(1.1);
    }
  }
  .projectName:before{
    content: "";
    width: 0.33rem;
    height: 0.33rem;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABCElEQVRIicXWu0oDQRQA0JOHZhHUQkWiaIxoYWOjSISIYGIjQixsFH/Uz/CPLBYb2ayZ2Zn1tjN3Dszj3ukMvz5lji7GOMUhdlH0M4IbuMEVNn8P5oB7uMUUxbJJqeEDLLD/18SU8ATzVddMAXfxhOuQpKbwAK84D01sAg/wgaOY5G4kuob3WDQW7uENo1g0Fl4oq1CjCIWnuGyKhsIXmKVAQ+Ad5RZ32oT7yre6tO7mgmcYpkRXgcfKGpw86uACLxKe66rwHNs50Dp4pPw5ZIsquIdnmba4Dp5gLydaBW/hPjdaBc+w3jY8lKgBhMKPMl+oKvhEgh4bAz+0if7AZzj+D/iubRS+AW6gDWD265ayAAAAAElFTkSuQmCC);
    background-size: 100% 100%;
    position: absolute;
    left: -0.33rem;
    top: 0;
  }
  .projectName::after{
    content: "";
    width: 0.33rem;
    height: 0.33rem;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABCElEQVRIicXWu0oDQRQA0JOHZhHUQkWiaIxoYWOjSISIYGIjQixsFH/Uz/CPLBYb2ayZ2Zn1tjN3Dszj3ukMvz5lji7GOMUhdlH0M4IbuMEVNn8P5oB7uMUUxbJJqeEDLLD/18SU8ATzVddMAXfxhOuQpKbwAK84D01sAg/wgaOY5G4kuob3WDQW7uENo1g0Fl4oq1CjCIWnuGyKhsIXmKVAQ+Ad5RZ32oT7yre6tO7mgmcYpkRXgcfKGpw86uACLxKe66rwHNs50Dp4pPw5ZIsquIdnmba4Dp5gLydaBW/hPjdaBc+w3jY8lKgBhMKPMl+oKvhEgh4bAz+0if7AZzj+D/iubRS+AW6gDWD265ayAAAAAElFTkSuQmCC);
    background-size: 100% 100%;
    position: absolute;
    right: -0.33rem;
    top: 0;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .iconActive{
    color: $bg-color;
  }
}
.comparisonActive .right{
  position: relative;
  top: -0.5rem;
  transition: all 0.5s;
}
</style>