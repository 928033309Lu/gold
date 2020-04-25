<template>
  <div class="mast-param-echarts">
    <div class="header">
      <span @click="backWindParam" class="title">实测风速</span>
    </div>
    <el-row :gutter="14">
      <el-col :span="maximize ? 12 : 8" v-for="(echart,index) in echarts" :key="echart.name">
        <span class="mast_name">{{echart.name}}</span>
        <my-echarts :ref="'echart'+index" :options="echart.option" :theme="'myTheme'" :autoResize="true"></my-echarts>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  export default {
    name: "mast-param-wind-speed",
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
              let str = `${params[0].name}月<br/>`;
              params.forEach((v, k)=>{
                str += `${v.seriesName} : ${v.value && Number(v.value.toFixed(2)) || ''}m/s<br/>`
              })
              return str;
            }
          },
          legend: {
            top:'center',
            right:'1',
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
            top:'40px',
            left:'40px',
            right: "70px",
            bottom:"20px"
          },
          xAxis: [
            {
              type: 'category',
              name: '月份',
              nameTextStyle: {
                color: '#6D7D41',
              },
              data: [1,2,3,4,5,6,7,8,9,10,11,12],
              splitLine: {show: false},
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '风速(m/s)',
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
            option: Object.assign(vm.option, {
              series: w.txt_data.monthlySpeed.map(v => {
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
}
</style>
