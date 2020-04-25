<template>
  <div class="mast-param-echarts">
    <div class="header">
      <span @click="backWindParam" class="title">风切变</span>
    </div>
    <el-row :gutter="14">
      <el-col :span="maximize ? 12 : 8" v-for="(echart,index) in echarts" :key="echart.name">
        <span class="mast_name">{{echart.name}}</span>
        <span class="tip">{{'α=' + echart.alpha.toFixed(3)}}</span>
        <my-echarts :ref="'echart'+index" :options="echart.option" :theme="'myTheme'" :autoResize="true"></my-echarts>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  export default {
    name: "mast-param-wind-shear",
    data () {
      return {
        echarts: [],
        option: {
          // title: {
          //   text: '月平均风速',
          //   textStyle: {
          //     color: '#6D7D41 ',
          //     fontSize: 12,
          //     fontWeight: 'normal'
          //   }
          // },
          color: ['#2C31FF', '#BE6CFE', '#8883FF', '#53A9FF', '#01E2A1', '#FFC035', '#FB5D3F', '#D4031C'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (params)=>{
              let str = `${Number(Number(params[0].data[0]).toFixed(2))}m/s<br/>`;
              params.forEach((v, k)=>{
                str += `${v.seriesName} : ${Number(Number(v.value[1]).toFixed(2))}m<br/>`
              })
              return str;
            }
          },
          legend: {
            top:'center',
            right:'0',
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
            top:'40px',
            left:'40px',
            right: "94px",
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
              name: '高度(m)',
              nameTextStyle: {
                color: '#6D7D41',
              },
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
            alpha: w.txt_data.rightWindParam.other.shear,
            option: Object.assign(vm.option, {
              series: [{
                name: 'PowerLawFit',
                data: w.txt_data.shear.powerlawfit.map((item,index)=>{
                  return [item[0].toFixed(2),item[1].toFixed(2)]
                }),
                type: "line",
                color: "#009fff",
                symbolSize: 1,
                smooth: true
              }, {
                symbolSize: 5,
                name: 'MeasuredData',
                data: w.txt_data.shear.measureddata,
                type: "scatter",
                color: "#FF2E76"
              }]
            })
          }
          
        })
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
  .tip{
    position: absolute;
    right: 50%;
    top: 0.23rem;
  }
}
</style>
