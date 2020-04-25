<template>
  <div class="wind-param-table" :class="{'ppt-model': pptModel == 'edit'}">
    <ellipse-param-set ref="ellipseParamSet" :wtList="tableData"></ellipse-param-set>
    <render-set ref="renderSet"></render-set>
    <el-drawer
        :modal="false"
        :wrapperClosable="false"
        :append-to-body="false"
        :modal-append-to-body="false"
        class="drawer-container"
        :class="{'small': projectUnfold, 'medium': !projectUnfold, 'minimise': minimise}"
        title="风参表"
        :visible.sync="visible"
        direction="btt"
        :show-close="false"
        @close="closeCall"
        @before-close="beforeCloseCall">
      <div class="render-list">
        <ul>
          <li v-for="item in renderSet" :key="item.columnName" :style="{borderColor: item.color}">
            <span :style="{color: item.color}">{{item.columnName | columnFilter}} : </span>{{item.ruleName | ruleNameFilter}}<span v-if="['>', '<', '==', '<>'].includes(item.ruleName)">{{item.ruleValue}}</span><span v-if="item.ruleName == '<>'">-{{item.maxValue}}</span><i class="iconfont icon-guanbi" @click="deleteRender(item)"></i></li>
        </ul>
      </div>
      <div class="fan-reduction">
        <label>{{$t('m.fanReduction')}}</label>
        <el-input v-if="fanRedEditable" v-model="fanReduction" :disabled="fanDisabled">
          <el-button slot="append" @click="submitFanReduction">{{$t('m.confirm')}}</el-button>
        </el-input>
        <span class="un-input" v-else>{{ fanReduction }}<i class="iconfont icon-bianji3" @click="fanRedEditable = true"></i></span>
      </div>
      <div class="tool-icons" :class="projectUnfold ? 'small' : ''">
        <el-tooltip class="item" effect="light" content="导入修改" placement="bottom">
          <i class="iconfont icon-daoru" @click="importPut"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="椭圆开关" placement="bottom">
          <i class="iconfont icon-tuoyuan" @click="ellipseClick"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="渲染设置" placement="bottom">
          <i class="iconfont icon-yanseshezhi" @click="renderClick"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="清除" placement="bottom">
          <i class="iconfont icon-xiangpica" @click="clearAll"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="导入" placement="bottom" v-if="0">
          <i class="iconfont icon-daoru"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="手动优化" placement="bottom" v-if="0">
          <i class="iconfont icon-shoudonghuanjie"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="minimise ? '还原' : '最小化'" placement="bottom">
          <i class="iconfont" :class="minimise ? 'icon-zuidahua2' : 'icon-minview'" @click="toMinimise"></i>
        </el-tooltip>
        <i class="iconfont icon-guanbi" @click="closeCall"></i>
      </div>
      <el-table ref="table" :data="tableData" height="3.5rem" :row-class-name="tableRowClassName" @row-click="tableRowClick" :cell-style="cellStyle">
        <el-table-column type="index" :label="turbineNum" width="100" fixed></el-table-column>
        <el-table-column prop="turbine_name" label="机位号" fixed></el-table-column>
        <el-table-column prop="turbine_type" label="机型" sortable fixed width="120"></el-table-column>
        <el-table-column prop="height" sortable fixed>
          <template slot="header" slot-scope="scope" >轮毂高度(m)</template>
        </el-table-column>
        <el-table-column prop="elevation" sortable>
          <template slot="header" slot-scope="scope">海拔(m)</template>
        </el-table-column>
        <el-table-column prop="air_density" sortable>
          <template slot="header" slot-scope="scope">空气密度<br>(kg/m3)</template>
        </el-table-column>
        <el-table-column prop="at" sortable>
          <template slot="header" slot-scope="scope">A(m/s)</template>
        </el-table-column>
        <el-table-column prop="kt" label="K" sortable></el-table-column>
        <el-table-column prop="average_shear" label="风切变" sortable></el-table-column>
        <el-table-column prop="max_inc" sortable>
          <template slot="header" slot-scope="scope">最大入流角(度)</template>
        </el-table-column>
        <el-table-column prop="representative_wake_added" label="湍流强度" sortable></el-table-column>
        <el-table-column prop="free_speed" label="尾流前风速(m/s)" sortable></el-table-column>
        <el-table-column prop="speed_discount" label="尾流损失(%)" sortable></el-table-column>
        <el-table-column prop="waked_speed" label="尾流后风速(m/s)" sortable></el-table-column>
        <el-table-column prop="array_yield" label="上网电量(MWh/y)" sortable></el-table-column>
        <el-table-column prop="equal_hours" label="等效小时数(h)" sortable></el-table-column>
      </el-table>
    </el-drawer>


    <el-upload  action="/"  class="defaultUpload" accept=".xlsx,.xls"
      :before-upload="beforePutUpload"
      :http-request="httpPutRequest">
      <button ref="putUpload"></button>
    </el-upload>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  import { getTurbine_scheme, setSchemeReductionFactor, getTurbineDetails, coverageTurbine_scheme } from "@/api/server.request.js"
  import { verifyFileNameLength, verifyFileNameCheck, verifyFileName  } from "@/utils/validate"
  import { windParam } from '@/config/scheme-config.js'
  export default {
    name: 'windParamTable',
    data() {
      return {
        visible: false,
        tableData: [],
        toolshow: true,
        minimise: false,
        activeWt: null,
        highColor: '#2cd0b9',
        fanReduction: null,
        fanRedEditable: false,
        fanDisabled: false,
        majorWt: 0,
        viceWt: 0
      }
    },
    components:{
      'ellipse-param-set': () => import('@/components/schemePanel/component/ellipse-param-set.vue'),
      'render-set': () => import('@/components/schemePanel/component/render-set.vue'),
    },
    props: [],
    computed:{
      ...mapState({
        schemeId: state => state.app['scheme_id'],
        projectInfo: state => state.app.projectInfo,
        schemeInfo: state => state.app.schemeInfo,
        projectUnfold: state => state.projectUpload.projectUnfold,
        ellipseForm: state => state.projectUpload.ellipseForm,
        renderSet: state => state.projectUpload.renderSet,
        mapCameraPos: state => state.projectUpload.mapCameraPos,
        pptModel: state => state.app.pptModel
      }),
      turbineNum: function(){
        let str = '风机数量  ('+ (this.majorWt && this.majorWt || '') +((this.viceWt && this.majorWt)?'+':'') + (this.viceWt ? this.viceWt : '') +'台)'
        return str
      }
    },
    filters: {
      columnFilter: columnName => {
        return windParam.columnNames.filter(v => {
          return v.value == columnName
        })[0].label.split('（')[0]
      },
      ruleNameFilter: ruleName => {
        return windParam.rules.filter(v => {
          return v.value == ruleName
        })[0].label
      },
    },
    mounted() {
      this.fanReduction = this.schemeInfo && this.schemeInfo.reduction_factor
      this.$emit('renderCall')
    },
    beforeDestroy() {
      this.clearAll()
    },
    methods: {
      // 导入覆盖
      beforePutUpload (file){
        let length = verifyFileNameLength(file, 200)
        let nameCheck = verifyFileNameCheck(file)
        let files = verifyFileName(file, 'xlsx', 'xls')
        if(length && files && nameCheck){
          return true
        }else{
          return false
        }
      },
      httpPutRequest (options){
        let data = new FormData();
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        data.append('power_generation_excel', options.file);
        coverageTurbine_scheme(this.projectInfo.project_id, this.schemeId, data, config).then((res)=>{
          if (res.code != 200){
            this.$message.error(res.message)
            return
          }
          this.$message.success(res.message)
          // 刷新方案列表数据
          this.$store.commit('refreshSchemeList')
        }).catch((err)=>{
          this.$message.error('err:请求错误')
        })
      },
      importPut (){
        this.$confirm('导入文件后，会把风机编号、X、Y 同时都一样的该行数据进行覆盖，请确认是否继续？', this.$t('m.hint'), {
          confirmButtonText: this.$t('m.confirm'),
          cancelButtonText: this.$t('m.cancel'),
          type: 'warning'
        }).then(() => {
          this.$refs.putUpload.click()
        }).catch(() => {
                      
        })
        
      },
      openDraw () {
        this.visible = true;
        this.getList();
      },
      closeDraw () {
        this.visible = false;
      },
      getList () {
        let that = this
        this.majorWt = 0
        this.viceWt = 0
        getTurbine_scheme({
          project_id: that.projectInfo.project_id,
          // scheme_id: that.schemeInfo && that.schemeInfo.scheme_id || 1
          scheme_id: that.schemeId
        }).then((res)=>{
          if(res.code != 200){
            this.$message.error(res.message)
            return
          }
          this.tableData = res.data
          this.$nextTick(() => {
            this.$refs.table.sort('turbine_name')
          })
          gwmap.wtLayer.loadWt(this.tableData, () => {
            if (this.pptModel) {
              Object.keys(this.ellipseForm).length && gwmap.wtLayer.loadWtEllipse(this.ellipseForm, this.tableData)
              this.reDrawWt()
              this.mapCameraPos && gwmap.dataManager.flyToStorageAtWill(this.mapCameraPos)
            }
          })

          res.data.forEach(v=>{
            if(v.checked && v.checked !== '0'){
              this.majorWt = this.majorWt+1
            } else {
              this.viceWt = this.viceWt+1
            }
          })
        })
      },
      closeCall () {
        this.visible = false
        this.clearAll()
        this.$emit('colseDraw', 'windParamTable')
      },
      beforeCloseCall () {
        this.toolshow = false
      },
      ellipseClick(key, keyPath) {
        this.$refs.ellipseParamSet.openDialog()
      },
      renderClick(key, keyPath) {
        this.$refs.renderSet.openDialog()
      },
      // 删除渲染参数
      deleteRender (render) {
        let arr = this.renderSet
        arr.splice(arr.map(v=>{return v.columnName}).indexOf(render.columnName), 1)
        this.$store.commit('setRenderSet', arr)
      },
      // 清除
      clearAll(){
        this.$store.commit('setRenderSet', [])
        gwmap.wtLayer.removeEllipse()
        this.$refs.ellipseParamSet && this.$refs.ellipseParamSet.clearForm()
        this.$refs.renderSet && this.$refs.renderSet.clearForm()
      },
      toMinimise () {
        this.minimise = !this.minimise
      },
      tableRowClassName({row, rowIndex}){
        if(this.activeWt && row.turbine_id == this.activeWt.turbine_id){
          return 'active-row'
        }
      },
      // 获取当前风机标签渲染颜色
      getWtRenderColor(turbine){
        let color = null
        this.renderSet.forEach(v=>{
          if(this.judgeCell(turbine, v)){
            color = v.color
          }
        })
        return color
      },
      tableRowClick (row, column, event){
        // 恢复上一个高亮风机颜色(渲染颜色->默认颜色)
        this.activeWt && gwmap.wtLayer.changeWtProperty(this.activeWt.turbine_id, this.getWtRenderColor(this.activeWt))
        this.activeWt = row
        gwmap.wtLayer.changeWtProperty(row.turbine_id, this.highColor)
        gwmap.wtLayer.zoomToFeature(row.turbine_id)
      },
      cellStyle ({row, column, rowIndex, columnIndex}) {
        let index = this.renderSet.map(v=>{return v.columnName}).indexOf(column.property)
        if(index > -1){
          let obj = this.renderSet[index]
          if (this.judgeCell(row, obj)) {
            return {
              'background-color': obj.color,
              'color': '#fff'
            }
          }
        }
      },
      judgeCell (row, obj){
        let bool = false;
        if(['>', '<', '=='].includes(obj.ruleName)){
          if(eval(row[obj.columnName] + obj.ruleName + obj.ruleValue)) {
            bool = true;
          }
        } else if (['aboveAvg', 'belowAvg', '>10%', '<10%'].includes(obj.ruleName)){
          let values = this.tableData.map(v => {
            return v[obj.columnName]
          })
          if (obj.ruleName == 'aboveAvg' || obj.ruleName == 'belowAvg') {
            let avg = eval(values.join('+'))/this.tableData.length
            if((obj.ruleName == 'aboveAvg' && row[obj.columnName] > avg) || (obj.ruleName == 'belowAvg' && row[obj.columnName] < avg)) {
              bool = true;
            }
          } else if(obj.ruleName == '>10%' || obj.ruleName == '<10%') {
            let sortArr = values.sort((a,b) =>{
              return b-a
            })
            let top10 = sortArr[Math.ceil(sortArr.length*0.1) - 1]
            let btm10 = sortArr[Math.floor(sortArr.length*0.9) - 1]
            if((obj.ruleName == '>10%' && row[obj.columnName] >= top10) || (obj.ruleName == '<10%' && row[obj.columnName] < btm10)) {
              bool = true;
            }
          }
        } else if(obj.ruleName == '<>'){
          if(row[obj.columnName] >= obj.ruleValue && row[obj.columnName] <= obj.maxValue) {
            bool = true;
          }
        }
        return bool
      },
      // 基于最新的渲染参数，重新渲染风机label样式
      reDrawWt (){
        this.tableData.forEach(turbine => {
          gwmap.wtLayer.changeWtProperty(turbine.turbine_id, '')
        })
        this.renderSet.length && this.renderSet.forEach((obj, rIndex) => {
          let lastRenderWts = []
          this.tableData.forEach(turbine => {
            if (this.judgeCell(turbine, obj)) {
              gwmap.wtLayer.changeWtProperty(turbine.turbine_id, obj.color)
              if (rIndex == this.renderSet.length - 1) {
                lastRenderWts.push(turbine.turbine_id)
              }
            }
          })
          gwmap.wtLayer.zoomToFeature(lastRenderWts)
        })
      },
      submitFanReduction () {
        if(!this.fanReduction) return
        this.fanDisabled = true
        setSchemeReductionFactor({
          project_id: this.projectInfo.project_id,
          scheme_id: this.schemeId,
          reduction_factor: this.fanReduction
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }).then(res =>{
          if(res.code != 200){
            this.$message.error(res.message)
            return
          }
          this.fanDisabled = false
          this.fanRedEditable = false
          this.getList()
          this.getTurbineDetails()
          this.$store.commit('refreshSchemeList')
        })
      },
      getTurbineDetails (){
        getTurbineDetails({
          project_id: this.$route.query.id || this.projectInfo.project_id,
          scheme_id: this.schemeId
        }).then((res) => {
          if (res.code != 200) {
            this.$message.error(res.message)
            return
          }
          this.$store.commit('setSchemeInfo', JSON.parse(JSON.stringify(res.data)))
        })
      }
    },
    watch: {
      renderSet: {
        handler (options) {
          // console.log(options)
          setTimeout(()=>{
            this.$refs.table.doLayout()
            this.reDrawWt()
          }, 1000)
        },
        deep: true
      },
      schemeInfo () {
        this.fanReduction = this.schemeInfo.reduction_factor
      }
    }
  }
</script>
<style lang="scss" scoped>
.wind-param-table{
  .render-list{
    position: absolute;
    left: 1.18rem;
    top: 0.07rem;
    width: calc(100% - 4rem);
    white-space: nowrap;
    overflow: auto;
    li{
      position: relative;
      display: inline-block;
      font-size: 0.12rem;
      line-height: 1;
      border: 1px solid;
      border-radius: 0.14rem;
      background-color: #fff;
      padding: 0.06rem 0.1rem;
      &+li{
        margin-left: 0.3rem;
      }
      .icon-guanbi{
        position: absolute;
        background-color: #fff;
        border-radius: 100%;
        right: -0.05rem;
        top: 0;
        font-size: 0.07rem;
        box-shadow: 0px 0px 3px 0px #000000;
        cursor: pointer;
      }
    }
    &::-webkit-scrollbar{
      height: 0.06rem;
    }
  }
  .fan-reduction{
    position: absolute;
    right: 0.3rem;
    top: 0.07rem;
    display: inline-block;
    > * {
      vertical-align: middle;
    }
    /deep/.el-input{
      border-radius: 0.08rem;
      overflow: hidden;
      width: 1.25rem;
      .el-input__inner{
        width: 0.6rem;
        height: 0.3rem;
        border: none;
        background-color: #fff;
        padding-left: 0.02rem;
        padding-right: 0.02rem;
      }
      .el-input-group__append{
        border: none;
      }
      .el-button{
        height: 0.3rem;
        background-color: #2CD0B9;
        color: #fff;
        border-radius:0px 0.08rem 0.08rem 0px;
        font-size: 0.12rem;
      }
    }
    .un-input{
      display: inline-block;
      color: #6D7D41;
      font-size: 0.14rem;
      height: 0.3rem;
      line-height: 0.32rem;
      width: 1.25rem;
      .iconfont{
        color: #2CD0B9;
        cursor: pointer;
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        margin-left: 0.05rem;
      }
    }
  }
  .tool-icons{
    position: absolute;
    top: -0.7rem;
    right: 0.06rem;
    border-radius: 6px;
    background-color: #F0F7F2;
    padding: 0 0.05rem;
    .iconfont{
      padding: 0 0.12rem;
      height: 0.5rem;
      line-height: 0.5rem;
      font-size: 0.26rem;
      color: #627045;
      cursor: pointer;
      outline: none;
      &.icon-tuoyuan{
        font-size: 0.24rem;
        &::before {
          transform: rotate(-45deg);
          display: inline-block;
        }
      }
      &.icon-zuidahua2{
        font-size: 0.34rem;
      }
      &:hover{
        background-color: #E2F5F2;
        color: #2CD0B9;
      }
    }
  }
  /deep/.v-modal{
    background: rgba(0,0,0,0.3) !important;
    z-index: 2002 !important;
  }
  /deep/.drawer-container{
    top: unset;
    right: unset;
    overflow: visible;
    z-index: unset !important;
    &.medium {
      width: calc(100% - 0.62rem);
    }
    &.small {
      width: calc(100% - 4.57rem);
    }
    &.minimise {
      .el-drawer {
        height: 0.5rem !important;
        display: unset;
      }
    }
  }
  /deep/.el-drawer{
    height: 4rem !important;
    border-radius: 0.22rem 0.22rem 0 0;
    overflow: visible;
    outline: none;
    *{
      outline: none;
    }
    .el-drawer__header{
      height: 0.5rem;
      padding: 0 0.2rem;
      background:rgba(235,242,228,1);
      border-radius: 0.22rem;
      color: #333333;
      margin-bottom: 0;
      span{
        line-height: 0.5rem;
        outline: none;
        user-select: none;
      }
    }
    .el-drawer__body{
      padding: 0.07rem;
    }
  }
  /deep/.el-table{
    .active-row {
      td{
        background-color: #F1F4EE;
      }
    }
    tr:hover{
      td {
        background-color: #F1F4EE;
      }
    }
  }
  &.ppt-model{
    /deep/.drawer-container{
      left: 2.5rem;
      &.medium {
        width: calc(100% - 3.12rem);
      }
      &.small {
        width: calc(100% - 7.07rem);
      }
    }
    /deep/.ellipse-param-set {
      left: -1.05rem;
    }
    /deep/.render-set {
      left: -1.05rem;
    }
  }
}
</style>
