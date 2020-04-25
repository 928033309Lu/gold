<template>
  <div class="mast-param-echarts">
    <div class="header">
      <span @click="backWindParam" class="title">代表湍流</span>
    </div>
    <el-row :gutter="14">
      <el-col :span="maximize ? 12 : 8" v-for="(echart,index) in echarts" :key="echart.name">
        <span class="mast_name">{{echart.name}}</span>
        <el-radio-group v-model="echart.radio" @change="radioChange(index, echart.radio)">
          <el-radio label="iec3">IEC3</el-radio>
          <el-radio label="iec2">IEC2</el-radio>
        </el-radio-group>
        <my-echarts :ref="'echart'+index" :options="echart.option" :theme="'myTheme'" :autoResize="true"></my-echarts>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  export default {
    name: "mast-param-turbulence",
    data () {
      return {
        echarts: [],
        radio: 'iec3',
        option: {
          title: {
            text: '代表湍流',
            textStyle: {
              color: '#6D7D41 ',
              fontSize: 12,
              fontWeight: 'normal'
            }
          },
          color: ['#2C31FF', '#BE6CFE', '#8883FF', '#53A9FF', '#01E2A1', '#FFC035', '#FB5D3F', '#D4031C'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (params)=>{
              let str = `${Number(params[0].value[0].toFixed(2))}m/s<br/>`;
              params.forEach((v, k)=>{
                str += `${v.seriesName} : ${Number(Number(v.value[1]).toFixed(2))}<br/>`
              })
              return str;
            }
          },
          legend: {
            top:'center',
            right:'0',
            type: 'scroll',
            orient:'vertical',
            itemWidth: 10,
            itemHeight: 6,
            lineHeight: 12,
            borderWidth: 0,
            textStyle: {
              color: '#6D7D41',
              padding: [0, 0, 0, 0],
              fontSize:10,
            },
          },
          grid: {
            top:'50px',
            left:'40px',
            right: "70px",
            bottom:"20px"
          },
          xAxis: [
            {
              type: 'value',
              name: '风速(m/s)',
              nameTextStyle: {
                color: '#6D7D41',
              },
              splitLine: {show: true},
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '湍流强度',
              nameTextStyle: {
                color: '#6D7D41',
              },
              max: function (val) {
                return (val.max > 2) ? 2 : Number(val.max.toFixed(1))
              }
            }
          ],
        },
      }
    },
    props: ['mastTxtData', 'maximize'],
    components:{
      myEcharts: () => import('@/components/utils/echarts/echarts.vue'),
    },
    computed: {
      ...mapState({
        projectUnfold: state => state.projectUpload.projectUnfold
      })
    },
    mounted () {
      this.init()
    },
    methods: {
      backWindParam(){
        this.$emit('closeComponentMast')
      },
      init () {
        let vm = this;
        if(!vm.mastTxtData) return
        vm.echarts = vm.mastTxtData.map(w => {
          return {
            id: w.mast_id,
            name: w.mast_name,
            radio: 'iec3',
            option: Object.assign(vm.option, {
              series: w.txt_data.iec3.map(v => {
                return {
                  name: v.height+'m',
                  type: 'line',
                  data: v.data,
                  symbolSize: 1
                }
              })
            })
          }
          
        })
      },
      radioChange(index, radio){
        // console.log(index)
        // console.log(radio)
        this.resizeChart(index, radio)
      },
      resizeChart(index, iec){
        let vm = this;
        this.$refs['echart'+index][0].mergeOptions(Object.assign(vm.option, {
         series: vm.mastTxtData[index]['txt_data'][iec].map(v => {
           return {
             name: v.height+'m',
             type: 'line',
             data: v.data,
             symbolSize: 1
           }
         })
        }))
      },
      resizeEcharts () {
        this.$nextTick(() => {
          this.mastTxtData.forEach((v, k) => {
            this.$refs['echart'+k][0].resize()
          })
        })
      }
    },
    watch: {
      projectUnfold(){
        this.resizeEcharts()
      },
      maximize () {
        this.resizeEcharts()
      }
    }
  }
</script>

<style lang="scss" scoped>
.mast-param-echarts{
  .el-radio-group{
    position: absolute;
    left: 1rem;
    top: 0.04rem;
    border: none !important;
    z-index: 1;
    &:hover{
      box-shadow: none !important;
    }
    .el-radio{
      margin-right: 0.1rem;
    }
  }
}
</style>
