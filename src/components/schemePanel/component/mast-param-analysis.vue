<template>
  <div class="mast-param-analysis">
    <el-table v-if="!componentMast" ref="table" :data="tableData" height="2.8rem">
      <el-table-column label="测风塔编号">
        <template slot-scope="scope">
          <a v-if="scope.row.clickable" @click="openEcharts(scope.row)">{{scope.row.name}}</a>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(mast, index) in mastList" :key="mast.mast_id" :label="mast.mast_name">
        <template slot-scope="scope">
          <el-select v-if="scope.row.name == '通道高度 m'" v-model="scope.row['mast' + index]" @change="heightChange(scope.row['mast' + index], index)">
            <el-option v-for="(item,index) of mast['channel_wind_velocity']" :key="index" :label="item" :value="item"></el-option>
          </el-select>
          <span v-else-if="scope.row.name == '实测风速'">{{measuredWindSpeedFilter(scope.row['mast' + index], mast.mast_id)}}</span>
          <span v-else-if="scope.row.name == '风切变'">{{windShearFilter(scope.row['mast' + index], mast.mast_id)}}</span>
          <span v-else-if="scope.row.name == '代表湍流'">{{turbulenceFilter(scope.row['mast' + index], mast.mast_id)}}</span>
          <span v-else>{{scope.row['mast' + index]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="handle" v-if="componentMast">
      <el-tooltip content="返回" placement="bottom">
        <i class="iconfont icon-bianzubeifen" @click="closeComponentMast"></i>
      </el-tooltip>
      <el-tooltip :content="maximize ? '最小化' : '最大化'" placement="bottom">
        <i class="iconfont" :class="maximize ? 'icon-minview' : 'icon-zuidahua2'" @click="toMaximize"></i>
      </el-tooltip>
    </div>
    <component v-if="componentMast" :is="'mast-param-'+ componentMast" @closeComponentMast="closeComponentMast" :mastTxtData="mastTxtData" :mastList="mastList" :maximize="maximize" :class="maximize ? 'maximize' : ''">
      <i class="iconfont icon-zuidahua1"></i>
    </component>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import { getMastTxtData } from "@/api/server.request.js"
  export default {
    name: "mast-param-analysis",
    data () {
      return {
        tableData: [],
        nameList: [
          {value: 'height', label: '通道高度 m'},
          {value: 'measured_wind_speed', label: '实测风速', clickable: true, key: 'wind-speed'},
          {value: 'tim_k', label: 'K', clickable: true, key: 'tim-k'},
          {value: 'main_wind_direction', label: '主风向', clickable: true, key: 'wind-direc'},
          {value: 'wind_shear', label: '风切变', clickable: true, key: 'wind-shear'},
          {value: 'behalf_of_turbulence', label: '代表湍流', clickable: true, key: 'turbulence'},
          {value: 'mast_air_density', label: '空气密度'},
          {value: 'max50_speed', label: '最大风速 m/s'},
          {value: 'extreme50_speed', label: '极大风速 m/s'},
        ],
        componentMast: null,
        mastTxtData: null,
        maximize: false
      }
    },
    computed:{
      ...mapState({
        projectInfo: state => state.app.projectInfo
      })
    },
    components:{
      'mast-param-wind-speed': () => import('@/components/schemePanel/component/mast-param-wind-speed.vue'),
      'mast-param-tim-k': () => import('@/components/schemePanel/component/mast-param-tim-k.vue'),
      'mast-param-wind-direc': () => import('@/components/schemePanel/component/mast-param-wind-direc.vue'),
      'mast-param-wind-shear': () => import('@/components/schemePanel/component/mast-param-wind-shear.vue'),
      'mast-param-turbulence': () => import('@/components/schemePanel/component/mast-param-turbulence.vue'),
    },
    props: ['mastList'],
    mounted (){
      console.log(this.mastList)
      this.initData()
    },
    methods: {
      initData () {
        let vm = this;
        this.tableData = this.nameList.map(v => {
          let obj = {}
          vm.mastList.map((w,k) => {
            obj['mast' + k] = w[v.value]
          })
          return Object.assign({
            name: v.label,
            key: v.key,
            clickable: v.clickable
          }, obj)
        })
        this.getMastTxtData()
      },
      getMastTxtData () {
        let vm = this
        getMastTxtData({
          project_id: vm.projectInfo.project_id,
          // project_id: 77,
        }).then((res)=>{
          if(res.code != 200){
            vm.$message.error(res.message)
            return
          }
          let mastIds = vm.mastList.map(v => v.mast_id)
          vm.mastTxtData = []
          res.data && res.data.length && res.data.forEach(v => {
            if (mastIds.includes(v.mast_id)) {
              vm.mastTxtData.push(v)
            }
          })
          // vm.mastTxtData = res.data
          // console.log(res.data)
        })
      },
      openEcharts (row) {
        this.componentMast = row.key
      },
      closeComponentMast (){
        this.componentMast = null
        this.toMinimise()
      },
      toMaximize () {
        this.maximize = !this.maximize
        this.$emit('setMaximize', this.maximize)
      },
      toMinimise(){
        this.maximize = false
        this.$emit('setMaximize', false)
      },
      measuredWindSpeedFilter (list, id) {
        if(!list) return
        let height = this.mastList.filter(v => {
          return v.mast_id == id
        })[0].height
        let speed = list.filter(v => {
          return v.height == height
        })[0].data
        return Number(speed.toFixed(2))
      },
      windShearFilter (list, id) {
        if(!list) return
        let height = this.mastList.filter(v => {
          return v.mast_id == id
        })[0].height
        let windShear = list.filter(v => {
          return v[1] == height
        })

        let shear =  windShear.length && Number(windShear[0][0].toFixed(3)) || ''
        return shear
      },
      turbulenceFilter (obj, id){
        if(!obj) return
        let height = this.mastList.filter(v => {
          return v.mast_id == id
        })[0].height
        let turbulence = ''
        // if(obj.iec2){
        //   let iec2 = obj.iec2.filter(v=>{
        //     return v.height = height
        //   })[0].data
        //   turbulence += 'iec2: '+Number(iec2.toFixed(3)) + ' '
        // }
        if(obj.iec3){
          let iec3 = obj.iec3.filter(v=>{
            return v.height == height
          })[0].data
          iec3 && (turbulence += Number(iec3.toFixed(3)))
        }
        return turbulence
      },
      heightChange (height, index) {
        this.$set(this.mastList, index, Object.assign(this.mastList[index], {
          height: height
        }))
        // this.$set(this.tableData, 0, Object.assign(this.tableData[0], {
        //   ["mast"+index]: height
        // }))
        // this.$refs.table.doLayout()
      }
    }
  }
</script>

<style lang="scss" scoped>
.mast-param-analysis{
  height: 100%;
  /deep/td a{
   color: #2CD0B9;
   text-decoration: underline;
   cursor: pointer;
 }
  .handle{
    float: right;
    padding-right: 0.1rem;
    .iconfont{
      font-size: 0.16rem;
      cursor: pointer;
      border: 1px solid #B2B9BA;
      &.icon-bianzubeifen{
        transform: rotate(180deg);
      }
    }
  }
  /deep/.mast-param-echarts{
    height: 100%;
    padding: 0 0.07rem;
    .header{
      padding-bottom: 0.1rem;
      .title{
        display: inline-block;
        min-width: 0.5rem;
        cursor: pointer;
      }
    }
    .el-row{
      overflow: auto;
      height: calc(100% - 0.1rem)
    }
    .el-col{
      height: 2.4rem;
      position: relative;
      margin-bottom: 0.2rem;
      .mast_name{
        position: absolute;
        right: 0.19rem;
        top: 0.1rem;
        display: inline-block;
        border: 1px solid #E7EDE0;
        border-radius:2px;
        color: #2CD0B9;
        padding: 0.11rem 0.08rem;
        z-index: 1;
      }
      > div{
        border:1px solid rgba(238,246,248,1);
        padding: 0.1rem;
        &:hover{
          box-shadow:0px 0px 14px 0px rgba(104,164,171,0.5);
        }
      }
    }
    &.maximize{
      .el-col{
        height: 4rem
      }
    }
  }
}
</style>
