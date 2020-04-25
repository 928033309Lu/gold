<template>
  <div>
    <div class="ppt-model" v-if="pptModel == 'edit'">
      <div class="tool">
        <el-tooltip effect="light" content="新增场景" placement="bottom">
          <el-button icon="iconfont icon-add" :disabled="pptSaving" @click="addPPt"></el-button>
        </el-tooltip>
        <el-tooltip effect="light" content="从头播放" placement="bottom">
          <el-button icon="iconfont icon-bofang" @click="pptPlay(0)"></el-button>
        </el-tooltip>
        <el-tooltip effect="light" content="从当前场景播放" placement="bottom">
          <el-button icon="iconfont icon-bofang1" @click="pptPlay(activePageNum)"></el-button>
        </el-tooltip>
        <el-tooltip effect="light" content="退出演示模式" placement="bottom">
          <el-button icon="iconfont icon-signOut" @click="closePPt"></el-button>
        </el-tooltip>
      </div>
      <draggable v-model="list" @update="datadragEnd" :options = "{animation:500}" class="ppt-container">
        <transition-group>
          <div v-for="(item, index) in list" :key="item.id" class="drag-item" :class="{'active': index == activePageNum}" @click="pptPlay(index, 0)">
            <el-button icon="iconfont icon-close" circle @click.stop="deletePage(item, index)"></el-button>
            <span>{{ index+1 }}</span>
            <img :src="JSON.parse(item.data).imgUrl" alt="">
            <!--<img :src="s3path + item.data" alt="">-->
          </div>
        </transition-group>
      </draggable>
    </div>

    <div class="ppt-model-play" v-if="pptModel == 'play'">
      <el-tooltip effect="light" content="退出播放" placement="bottom">
        <el-button icon="iconfont icon-suolvetucopy" @click="quitPlay" circle></el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="上一页" placement="bottom">
        <el-button class="page-pre" icon="iconfont icon-arrow-right-copy" :disabled="activePageNum == 0" @click="playByPage('prev')" circle></el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="下一页" placement="bottom">
        <el-button icon="iconfont icon-arrow-right-copy" :disabled="activePageNum == list.length - 1" @click="playByPage('next')" circle></el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="退出三维展示模式" placement="bottom">
        <el-button icon="iconfont icon-signOut" @click="closePPt" circle></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import draggable from 'vuedraggable'
  import { getPPtList, addPPt, deletePPt, updateSortPPt } from "@/api/server.request.js"
  import envConfig from '@/config/env-config'
  import axios from 'axios'
  export default {
    name: "ppt",
    data () {
      return {
        list: [],
        activePageNum: 0,
        pptSaving: false,
        s3path: envConfig.S3Path + '/'
      }
    },
    computed:{
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        pptModel: state => state.app.pptModel,
        scheme_id: state => state.app.scheme_id,
        projectUnfold: state => state.projectUpload.projectUnfold,
        tabTitle: state => state.projectUpload.tabTitle,
        schemeListActive: state => state.projectUpload.schemeListActive,
        schemeMemu: state => state.projectUpload.schemeMemu,
        componentScheme: state => state.projectUpload.componentScheme,
        factorData: state => state.projectUpload.factorData,
        customFactorData: state => state.projectUpload.customFactorData,
        ellipseForm: state => state.projectUpload.ellipseForm,
        renderSet: state => state.projectUpload.renderSet,
      }),
    },
    components: {
      draggable
    },
    mounted () {
      let vm = this
      this.init()
      // 防止火狐浏览器拖拽的时候以新标签打开
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      // 支持 键盘 上一页、下一页 切换场景
      document.onkeydown = function(e) {
        if (vm.pptModel == 'play'){
          if (e.keyCode == 37) {
            window.event.preventDefault()
            vm.activePageNum >0 && vm.pptPlay(vm.activePageNum - 1)
          }
          if (e.keyCode == 39) {
            window.event.preventDefault()
            if (vm.activePageNum < vm.list.length -1) {
              vm.pptPlay(vm.activePageNum + 1)
            }
          }
        }
      }
    },
    methods: {
      init () {
        this.activePageNum = 0
        if (this.projectInfo && this.projectInfo.project_id && this.pptModel) {
          this.getList()
        }
      },
      getList () {
        let vm = this
        getPPtList({
          project_id: this.projectInfo.project_id
        }).then(res => {
          if (res.code != 200) {
            this.$message.error(res.message)
            return
          }
          this.list = res.data.sort((a, b) => {
            return a.sequence_id - b.sequence_id
          })
          // this.list.forEach((v, index) => {
          //   vm.getS3Data(v.data, index)
          // })
        })
      },
      getCanvas () {
        let p = new Promise((resolve, reject) => {
            this.$htmlCanvas((img)=>{
              resolve(img)
            })
        });
        return p;
      },
      getCameraPar () {
        let p = new Promise((resolve, reject) => {
          gwmap.dataManager.storageAtWill(cameraPar=>{
            resolve(cameraPar)
          })
        });
        return p;
      },
      addPPt () {
        this.pptSaving = true
        Promise.all([this.getCanvas(), this.getCameraPar()]).then(vals => {
          let showTabTitleNum = this.tabTitle.map(v => {
            return v.show
          }).indexOf(true)
          let params = {}
          if (showTabTitleNum == 3) { // 方案
            params = {
              scheme_id: this.scheme_id,
              schemeListActive: this.schemeListActive,
              componentScheme: this.componentScheme,
              schemeMemu: JSON.parse(JSON.stringify(this.schemeMemu)),
            }
            if (this.componentScheme == 'terrainData') { // 地理数据
              params.factorData = JSON.parse(JSON.stringify(this.factorData))
              params.customFactorData = JSON.parse(JSON.stringify(this.customFactorData))
            }
            if (this.componentScheme == 'anemometerTower') { // 风机排布
              params.ellipseForm = JSON.parse(JSON.stringify(this.ellipseForm))
              params.renderSet = JSON.parse(JSON.stringify(this.renderSet))
            }
          }
          let data = JSON.stringify({
            router: this.$route.fullPath,
            imgUrl: vals[0],
            cameraPar: vals[1],
            projectUnfold: this.projectUnfold,
            showTabTitleNum,
            params
          })
          this.addPPtPost(data)
        })
      },
      addPPtPost (data) {
        addPPt({
          project_id: this.projectInfo.project_id,
          data
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(res => {
          this.pptSaving = false
          if (res.code != 200) {
            this.$message.error(res.message)
            return
          }
          this.list.push({
            id: res.data,
            data
          })
          this.getList()
          this.activePageNum = this.list.length - 1
        }).catch(()=>{
          this.pptSaving = false
        })
      },
      pptPlay (num = 0, isEdit = true) {
        if (this.list.length == 0) return
        this.activePageNum = num
        isEdit && this.$store.commit('setPPtModel', 'play')
        const curPage = JSON.parse(this.list[num].data)
        if (this.$route.fullPath != curPage.router){
          this.$router.push(curPage.router)
        }
        this.$store.commit("setProjectUnfold", curPage.projectUnfold)
        this.$store.commit('changeTab', curPage.showTabTitleNum)
        if (curPage.showTabTitleNum == 3) { // 方案
          this.$store.commit("setScheme_id", curPage.params.scheme_id)
          this.$store.commit("setSchemeListActive", curPage.params.schemeListActive)
          this.$store.commit("initSchemeMemu", JSON.parse(JSON.stringify(curPage.params.schemeMemu)))
          this.$store.commit("componentScheme", curPage.params.componentScheme)
          if (this.componentScheme == 'terrainData') { // 地理数据
            this.$store.commit("setFactorData", JSON.parse(JSON.stringify(curPage.params.factorData)))
            this.$store.commit("setCustomFactorData", JSON.parse(JSON.stringify(curPage.params.customFactorData)))
          }
          if (this.componentScheme == 'anemometerTower') { // 风机排布
            this.$store.commit("setEllipseForm", JSON.parse(JSON.stringify(curPage.params.ellipseForm)))
            this.$store.commit("setRenderSet", JSON.parse(JSON.stringify(curPage.params.renderSet)))
          }
        }
        this.$store.commit('setMapCameraPos', curPage.cameraPar)
      },
      deletePage (item, index) {
        deletePPt(this.projectInfo.project_id, item.sequence_id).then(res => {
          if (res.code != 200) {
            this.$message.error(res.message)
            return
          }

          this.list.splice(index, 1)
          if (this.activePageNum == index) {
            this.pptPlay(index>this.list.length-1 ? this.list.length-1 : index, 0)
          }
        })
      },
      closePPt () {
        this.$store.commit('setPPtModel', null)
        this.$store.commit('setMapCameraPos', null)
      },
      datadragEnd (evt) {
        evt.preventDefault();
        let data = new FormData();
        data.append('project_id', this.projectInfo.project_id);
        data.append('sequence_ids', this.list.map(v => { return v.sequence_id }));
        updateSortPPt(data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }).then(res => {

        })
        // console.log('拖动前的索引 :' + evt.oldIndex)
        // console.log('拖动后的索引 :' + evt.newIndex)
      },
      quitPlay () {
        this.$store.commit('setPPtModel', 'edit')
      },
      playByPage (style) {
        if (style == 'prev') {
          this.activePageNum--
        }
        if (style == 'next') {
          this.activePageNum++
        }
        this.pptPlay(this.activePageNum)
      },
      getS3Data(data, index){
        axios.get('/s3path/' + data, {
        }).then(res => {
          this.$set(this.list, index, Object.assign({}, this.list[index], res.data))
        }).catch(err => {
        })
      }
    },
    watch: {
      'projectInfo.project_id' (val) {
        if (val && this.pptModel) {
            this.getList()
        }
      },
      list (val) {
        val.length && val.forEach(v=>{
          // console.log(JSON.parse(v.jsonData))
          console.log(v)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ppt-model {
    width: 2.5rem;
    height: 100vh;
    padding: 0 0.07rem;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999999999;
    background-color: #fff;
    .tool{
      padding: 0.1rem 0.13rem;
      display: flex;
      .el-button{
        width: 0.5rem;
        height: 0.32rem;
        border-radius: 0.1rem;
        background: #F0F6F7;
        border-color: #F0F6F7;
        color: #2CD0B9;
        &:hover{
          background: #2CD0B9;
          border-color: #2CD0B9;
          color: #fff;
        }
      }
    }
    .ppt-container {
      width: 100%;
      height: calc(100vh - 0.52rem);
      background-color: #EBF2E4;
      overflow: auto;
      color: #333;
      padding: 0.1rem;
      .drag-item{
        cursor: pointer;
        display: flex;
        position: relative;
        .el-button{
          display: none;
          position: absolute;
          width: 0.27rem;
          height: 0.27rem;
          right: -0.1rem;
          top: -0.13rem;
          background-color: #FFF6DF;
          box-shadow: 0px 0px 5px 0px #d8e8e6;
          text-align: center;
          padding: 0;
          /deep/.iconfont{
            font-size: 0.12rem;
          }
        }
        img {
          width: 2rem;
          flex: 1;
          height: 1.25rem;
          border-radius: 0.06rem;
          object-fit: fill;
          box-sizing: border-box;
        }
        span {
          display: inline-block;
          width: 0.3rem;
        }
        img,span{
          vertical-align: top;
        }
        &+.drag-item{
          margin-top: 0.07rem;
        }
        &.active{
          img{
            border: 4px solid #2CD0B9;
          }
        }
        &:hover{
          .el-button{
            display: block;
          }
        }
      }
    }
  }
  .ppt-model-play{
    position: fixed;
    left: 0.25rem;
    top: 0.9rem;
    z-index: 999;
    .el-button{
      background-color: #E9F2EC;
      border-color: #E9F2Ec;
      color: #5F482E;
      width: 0.44rem;
      height: 0.44rem;
      text-align: center;
      padding: 0;
      line-height: 0.44rem;
      /deep/.iconfont {
        font-size: 0.24rem;
        &.icon-arrow-right-copy{
          transform: scale(1.1) translate(1px, 0px);
        }
      }
      &.page-pre{
        /deep/.iconfont{
          transform: rotate(180deg) translate(2px, 1px) scale(1.1);
        }
      }
      &:hover{
        background-color: #2CD0B9;
        border-color: #2CD0B9;
        color: #fff;
      }
      &+.el-button{
        margin-left: 0.06rem;
      }
    }
  }
</style>