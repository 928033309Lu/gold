<template>
  <div class="mast-param-echarts">
    <div class="header">
      <span @click="backWindParam" class="title">主风向</span>
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
    name: "mast-param-wind-direc",
    
    data () {
      const dir = ["N","NNW","NW","WNW","W","WSW","SW","SSW","S","SSE","SE","ESE","E","ENE","NE","NNE"]
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
          tooltip: {
            show: true,
            trigger: "item",
            formatter: function (params) {
              let data = params.data;
              let str = data.name + '<br>';
              data.value.forEach((item, index) => {
                str += dir[index] + ': ' + ((Number(item) * 100).toFixed(2) + '%') + '<br>'
              })
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
          legend: {
            right: '1',
            top: 'center',
            orient: 'vertical',
            itemWidth: 10,
            itemHeight: 6,
            lineHeight: 12,
            icon: 'roundRect',
            borderWidth: 0,
            textStyle: {
              color: '#6D7D41',
              padding: [2, 0, 0, 0],
              fontSize: 10,
            },
            itemGap: 5
          },
          grid: {
            top: '40px',
            left: '40px',
            right: "80px",
            bottom: "50px"
          },
          radar: [{
            "splitArea": {
              "show": false,
              "areaStyle": {
                "color": ["rgba(3,73,114,0)", "rgba(3,73,114,.5)"]
              }
            },
            "splitLine": {
              "show": true,
              "lineStyle": {
                "color": "#C4CABD",
                "type": "solid"
              }
            },
            "axisLine": {
              "show": true,
              "lineStyle": {
                "color": "#C4CABD",
                "type": "solid"
              }
            },
            "center": ["43%", "50%"],
            "radius": "70%",
            "shape": "circle",
            "name": {
              "textStyle": {
                "color": "#6D7D41",
                fontSize: 10
              }
            },
            "nameGap": 10,
          }],
        },
        dir: dir
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
          
          let names = [],seriesData = [],dataArr = [];
          w.txt_data.wdFrequency.forEach(item=>{
            names.push(item.height+'m'+(item.cedian=='DEFAULT'?'':item.cedian));
            seriesData.push({
              "name": item.height+'m'+(item.cedian=='DEFAULT'?'':item.cedian),
              "value": vm.changeOrder(item.data)
            })
            item.data.map(son=>{
              dataArr.push(son);
            })
          })
          let maxData = 1;
          maxData = Math.max.apply(null, dataArr);
          
          return {
            id: w.mast_id,
            name: w.mast_name,
            option: Object.assign(vm.option, {
              legend: Object.assign({
                data: names
              }, vm.option.legend),
              radar: [Object.assign({
                indicator: vm.dir.map(v => {
                  return {
                    text: v,
                    max: maxData
                  }
                })
              }, vm.option.radar[0])],
              series: [{
                type: "radar",
                symbolSize: 0,
                data: seriesData
              }]
            })
          }
        })
        console.log(vm.echarts)
      },
      changeOrder(arr){
        let newArr = [];
        newArr[0] = arr[0];
        let spliceArr = this.takeRight(arr, 15);
        newArr = newArr.concat(spliceArr.reverse());
        return newArr;
      },
      //从结尾开始获取数组的n个元素作为切片返回
      takeRight(array, n=1) {
        const length = array == null ? 0 : array.length//数组长度
        if (!length) {//如果数组没有长度，返回空数组
          return []
        }
        n = length - n//切片的起始索引
        return array.slice(n < 0 ? 0 : n, length)//调用slice获取切片
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
