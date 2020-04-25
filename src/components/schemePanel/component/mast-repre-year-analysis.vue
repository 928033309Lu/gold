<template>
  <div class="repre-year-analysis">
    <el-row :gutter="14">
      <el-col :span="8">
        <span class="mast_name">{{mainMastName}}</span>
        <my-echarts :options="windSpeed" ref="echarts0" :theme="'myTheme'" :autoResize="true"></my-echarts>
      </el-col>
      <el-col :span="8">
        <span class="mast_name">{{mainMastName}}</span>
        <my-echarts :options="targetWindSpeed" ref="echarts1" :theme="'myTheme'" :autoResize="true"></my-echarts>
      </el-col>
      <el-col :span="8">
        <my-echarts :options="mastRepreYearResults" ref="echarts2" :theme="'myTheme'" :autoResize="true"></my-echarts>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import { getMastMesoscaleData } from "@/api/server.request.js"
  export default {
    name: "mast-repre-year-analysis",
    data () {
      return {
        windSpeed: {},
        windSpeedOption: {
          title: {
            text: '长期风速变化图',
            textStyle: {
              color: '#6D7D41 ',
              fontSize: 12,
              fontWeight: 'normal'
            }
          },
          color: ['#2CD0B9'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (params)=>{
              let str = `${Number(Number(params[0].data[0]).toFixed(2))}年<br/>`;
              params.forEach((v, k)=>{
                str += `${v.marker} ${v.seriesName} : ${Number(Number(v.value[1]).toFixed(2))}m/s<br/>`
              })
              return str;
            }
          },
          grid: {
            right: '60',
            bottom: '20',
            top: '50',
          },
          legend: {
            icon: 'roundRect',
            itemWidth: 15,
            itemHeight: 6,
            top: 16,
            textStyle: {
              color: '#6D7D41',
            }
          },
          xAxis: [
            {
              type: 'category',
              name: '年份(年)',
              nameTextStyle: {
                color: '#6D7D41',
              },
              splitLine: {show: false},
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '年平均风速(m/s)',
              nameTextStyle: {
                color: '#6D7D41',
                align: 'center',
                padding: [0,0,0,20],
              },
            }
          ],
          series: []
        },
        targetWindSpeed: {},
        targetWindSpeedOption: {
          title: {
            text: 'R2=0.113',
            textStyle: {
              color: '#6D7D41 ',
              fontSize: 12,
              fontWeight: 'normal'
            }
          },
          color: ['#2CD0B9'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (params)=>{
              let str = `${Number(Number(params[0].data[0]).toFixed(2))}m/s<br/>`;
              params.forEach((v, k)=>{
                str += `${v.marker}  ${Number(Number(v.value[1]).toFixed(2))}m/s<br/>`
              })
              return str;
            }
          },
          grid: {
            // left: '3%',
            right: '60',
            bottom: '20',
            top: '50',
            // containLabel: true
          },
          legend: {
            show: true
          },
          xAxis: [
            {
              type: 'value',
              name: 'Reference Wind Speed(m/s)',
              nameTextStyle: {
                color: '#6D7D41',
              },
              axisLabel: {
                formatter: function (value, index) {
                  return Number(value.toFixed(2))
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: 'Target Wind Speed(m/s)',
              nameTextStyle: {
                color: '#6D7D41',
                align: 'center',
                padding: [0,0,0,70],
              },
            }
          ],
          series: []
        },
        mastRepreYearResults: {
          title: {
            text: '测风塔代表年订正结果',
            textStyle: {
              color: '#6D7D41 ',
              fontSize: 12,
              fontWeight: 'normal'
            }
          },
          color: ['#2CD0B9', '#53A9FF', '#2CD0B9'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (params)=>{
              let str = `${params[0].name}<br/>`;
              params.forEach((v, k)=>{
                str += `${v.marker} ${v.seriesName} : ${Number(v.value.toFixed(2))} ${v.seriesName == '相关系数' ? '' : 'm/s'}<br/>`
              })
              return str;
            }
          },
          grid: {
            // left: '3%',
            right: '60',
            bottom: '20',
            top: '70',
            // containLabel: true
          },
          legend: {
            icon: 'roundRect',
            itemWidth: 15,
            itemHeight: 6,
            top: 16,
            textStyle: {
              color: '#6D7D41',
            }
          },
          xAxis: {
            name: '测风塔',
            nameTextStyle: {
              color: '#6D7D41',
            },
            type: 'category',
            splitLine: {show: false},
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: [
            {
              type: 'value',
              name: '风速(m/s)',
              nameTextStyle: {
                color: '#6D7D41',
              },
            },
            {
              type: 'value',
              name: '相关系数',
              nameTextStyle: {
                color: '#6D7D41',
              },
              splitLine: {show: false},
            }
          ],
          series: []
        },
        mainMastName: null,
        mastTxtData: null
      }
    },
    props: ['mastList', 'allMast'],
    components:{
      myEcharts: () => import('@/components/utils/echarts/echarts.vue'),
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        projectUnfold: state => state.projectUpload.projectUnfold,
        mainMast: state => state.projectUpload.mainMast
      })
    },
    mounted () {
      this.getMastMesoscaleData()
    },
    methods: {
      getMastMesoscaleData () {
        let vm = this
        getMastMesoscaleData({
          project_id: vm.projectInfo.project_id,
          // project_id: 77,
        }).then((res)=>{
          if(res.code != 200){
            vm.$message.error(res.message)
            return
          }
          vm.mastTxtData = res.data
          vm.mastTxtData.length && this.setMainMastName()
          this.initThree(this.mastTxtData)
        })
      },
      setMainMastName(){
        let mainMast = this.mastTxtData.filter(v=>{
          return v.mast_id == this.mainMast
        })[0]
        if(mainMast){
          this.mainMastName = mainMast.mast_name
          this.initOne(mainMast.mesoscale_data.one)
          this.initTwo(mainMast.mesoscale_data.two, mainMast.mesoscale_data.r2_point)
        } else {
          this.mainMastName = this.allMast.filter(v=>{
            return v.mast_id == (this.mainMast || this.allMast[0].mast_id)
          })[0].mast_name
          this.windSpeed = this.windSpeedOption
          this.targetWindSpeed = this.targetWindSpeedOption
          this.$refs.echarts0.resize()
          this.$refs.echarts1.resize()
        }
      },
      initOne (data) {
        this.windSpeed = Object.assign({}, JSON.parse(JSON.stringify(this.windSpeedOption)), {
          series: {
            name: '年平均风速',
            type: 'bar',
            barWidth: 6,
            data: data.map(v => {
              return [v.year, v.ws]
            }),
            markLine: {
              symbol: 'none',
              lineStyle:{
                type: 'solid',
                color: '#B5C833',
              },
              label:{
                // fontSize:12
              },
              data: [
                {type: 'average', name: '近20年平均风速',symbolSize:5}
              ]
            }
          }
        })
      },
      initTwo (data, r2_point) {
        let newArr = data.ws_by_one_six_hour.sort((a, b)=>{
          return a[0] - b[0]
        })
        let xMax = newArr[newArr.length -1][0]
        this.targetWindSpeed = Object.assign({}, this.targetWindSpeedOption, {
          title: Object.assign(this.targetWindSpeedOption.title, {
            text: 'R2=' + Number(r2_point.R2_result.toFixed(3))
          }),
          series: [
            {
              type: 'scatter',
              symbolSize: 3,
              data: newArr,
              large: true, //大数据量优化
              largeThreshold: 500, //绘制优化的阈值
              markLine: {
                animation: true,
                label: {
                  formatter: 'y = '+ Number(data.k_b_para_list[0].toFixed(2)) +' * x',
                  align: 'right',
                  show: false
                },
                lineStyle: {
                  type: 'solid',
                  color: '#53A9FF'
                },
                tooltip: {
                  formatter: 'y = '+ data.k_b_para_list[0] +' * x'
                },
                data: [[{
                  coord: [0, data.k_b_para_list[1]],
                  symbol: 'none'
                }, {
                  coord: [xMax, data.k_b_para_list[0] * xMax],
                  symbol: 'none'
                }]]
              }
            }
          ]
        })
        console.log(this.targetWindSpeed)
      },
      initThree (data) {
        let masts = [], mast_wind_speed = [], behalf_of_the_wind_speed = [], correlation_coefficient = []
        let successMastList = this.mastList.map(v => v.mast_id)
        data.map(v => {
          if (!successMastList.includes(v.mast_id)) return
          let three = v.mesoscale_data.three
          masts.push(v.mast_name),
          mast_wind_speed.push(three.mast_wind_speed.data)
          behalf_of_the_wind_speed.push(three.behalf_of_the_wind_speed.data)
          correlation_coefficient.push(three.correlation_coefficient.data)
        })
        this.mastRepreYearResults = Object.assign(this.mastRepreYearResults, {
          xAxis: Object.assign({
            data: masts
          }, this.mastRepreYearResults.xAxis),
          series: [
            {
              name: '实测风速',
              type: 'bar',
              barWidth: 6,
              data: mast_wind_speed
            },
            {
              name: '代表年风速',
              type: 'bar',
              barWidth: 6,
              data: behalf_of_the_wind_speed
            },
            {
              name: '相关系数',
              type: 'line',
              yAxisIndex: 1,
              data: correlation_coefficient,
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                color: '#FB5D3F'
              },
              lineStyle: {
                color: '#2CD0B9'
              }
            }
          ]
        })
      }
    },
    watch: {
      'projectUnfold'(cur){
        for(let k=0; k<3; k++){
          this.$refs['echarts'+k][0].resize()
        }
      },
      mainMast: {
        handler(val, oldVal){
          this.setMainMastName()
        },
        deep:true
      }
    }
  }
</script>

<style lang="scss" scoped>
.repre-year-analysis{
  .el-col{
    position: relative;
    height: 2.8rem;
    > div{
      border:1px solid rgba(238,246,248,1);
      padding: 0.1rem;
      &:hover{
        box-shadow:0px 0px 14px 0px rgba(104,164,171,0.5);
      }
    }
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
  }
}
</style>
