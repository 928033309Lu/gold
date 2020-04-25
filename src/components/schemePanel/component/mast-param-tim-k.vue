<template>
  <div class="mast-param-echarts">
    <div class="header">
      <span @click="backWindParam" class="title">K</span>
      <!--<el-select v-model="height">-->
        <!--<el-option-->
            <!--v-for="item in options"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
        <!--</el-option>-->
      <!--</el-select>-->
    </div>
    <el-row :gutter="14">
      <el-col :span="maximize ? 12 : 8" v-for="(echart,index) in echarts" :key="echart.name">
        <span class="mast_name">{{echart.name}}</span>
        <span class="tip a">{{'A=' + echart.A.toFixed(3)}}</span>
        <span class="tip k">{{'K=' + echart.K.toFixed(3)}}</span>
        <my-echarts :ref="'echart'+index" :options="echart.option" :theme="'myTheme'" :autoResize="true"></my-echarts>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  export default {
    name: "mast-param-tim-k",
    data () {
      return {
        echarts: [],
        option: {
          color:['#53A9FF','#1E66EA','#1EBCEA','#1EEAB3','#CBE925','#E96125'],
          tooltip: {
            show: true,
            trigger: "axis",
            formatter:function(params){
              let str = params[0].axisValueLabel + 'm/s<br>' + '威布尔分布：' + Number(params[0].value.toFixed(4)) + '%' + '<br>' + '风频分布：' + Number(params[1].value.toFixed(4)) + '%';
              return str;
            },
            position: function (point, params, dom, rect, size) {
              // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
              // 提示框位置
              var x = 0; // x坐标位置
              var y = 0; // y坐标位置

              // 当前鼠标位置
              var pointX = point[0];
              var pointY = point[1];

              // 外层div大小
              // var viewWidth = size.viewSize[0];
              // var viewHeight = size.viewSize[1];

              // 提示框大小
              var boxWidth = size.contentSize[0];
              var boxHeight = size.contentSize[1];

              // boxWidth > pointX 说明鼠标左边放不下提示框
              if (boxWidth > pointX) {
                x = 5;
              } else { // 左边放的下
                x = pointX - boxWidth;
              }

              // boxHeight > pointY 说明鼠标上边放不下提示框
              if (boxHeight > pointY) {
                y = 5;
              } else { // 上边放得下
                y = pointY - boxHeight;
              }

              return [x, y];
            }
          },
          xAxis: {
            name: "风速(m/s)",
            type: "category",
            // nameLocation:'right',
            // nameGap:'25',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#6D7D41',
                fontSize:'12'
              }
            },
            // 控制网格线是否显示
            splitLine: {
              show: false,
              //  改变轴线颜色
              lineStyle: {
                // 使用深浅的间隔色
                color: '#C4CABD'
              }
            },
            nameTextStyle: {
              color: '#6D7D41'
            },
            // x轴的颜色和宽度
            axisLine:{
              lineStyle:{
                color:'#C4CABD',
                width:1,   //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          legend: {
            right:'1',
            top:'center',
            orient:'vertical',
            itemWidth: 10,
            itemHeight: 6,
            lineHeight: 12,
            borderWidth: 0,
            padding: 0,
            textStyle: {
              color: '#6D7D41',
              padding: [2, 0, 0, 0],
              fontSize:10,
            },
            itemGap:5,
            data: ["风频分布", "威布尔分布"]
          },
          yAxis: [{
            name: "频率(%)",
            type: "value",
            axisLabel: {
              show: true,
              textStyle: {
                color: '#6D7D41',
                fontSize:'12'
              }
            },
            // 控制网格线是否显示
            splitLine: {
              show: true,
              //  改变轴线颜色
              lineStyle: {
                // 使用深浅的间隔色
                color: '#C4CABD'
              }
            },
            nameTextStyle: {
              color: '#6D7D41'
            },
            // x轴的颜色和宽度
            axisLine:{
              lineStyle:{
                color:'#C4CABD',
                width:1,   //这里是坐标轴的宽度,可以去掉
              }
            }
          }],
          grid: {
            top:'40px',
            left:'40px',
            right: "70px",
            bottom:"20px"
          },
        }
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
            A: w.txt_data.weibullA,
            K: w.txt_data.weibullK,
            option: Object.assign(vm.option, {
              xAxis: Object.assign(vm.option.xAxis, {
                data:w.txt_data.weibullFrequency.map((v, k) => {
                  return 0.5 * (k+1)
                })
              }),
              series: [{
                name: "风频分布",
                data: w.txt_data.weibullFrequency,
                type: "bar",
                color: "#53A9FF",
                symbolSize: 1
              },{
                name: "威布尔分布",
                data: w.txt_data.weibullMaximum.map(item => {
                  return item[1];
                }),
                type: "line",
                color: "#01E2A1",
                smooth: true,
                symbolSize: 1
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
    top: 0.23rem;
    &.a{
      left: 2rem;
    }
    &.k{
      left: 3rem;
    }
  }
}
</style>
