<template>
  <div class="wind-map" v-if="visible"
       :style="{left: (position.x < 140) && 140 || position.x + 'px', top: (position.y < 350) && 350 || position.y + 'px'}">
    <ul class="title">
      <li @click="active = 1" :class="{'active': active == 1}">风玫瑰图</li>
      <li @click="active = 2" :class="{'active': active == 2}">韦布尔分布图</li>
    </ul>
    <div class="echart">
      <my-echarts v-if="active ==1" :options="windRose" ref="echarts0" :theme="'myTheme'" :autoResize="true"></my-echarts>
      <my-echarts v-if="active ==2" :options="timk" ref="echarts1" :theme="'myTheme'" :autoResize="true"></my-echarts>
    </div>
    <ul class="content">
      <li><span>经     度：</span> <span> {{Number(position.lon.toFixed(4))}} </span></li>
      <li><span>纬     度：</span> <span> {{Number(position.lat.toFixed(4))}} </span></li>
      <li><span>海     拔：</span> <span> {{Number(height.toFixed(1))}} m</span></li>
      <li><span>风     速：</span> <span> {{fanData && Number(fanData.speed.toFixed(3))}} m/s</span></li>
      <li><span>空气密度：</span> <span> {{fanData && Number(fanData.air_density.toFixed(3))}} kg/m</span></li>
    </ul>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  import {getMapWindInfo} from "@/api/server.request.js"

  export default {
    name: 'wind-map',
    data() {
      const dir = ["N","NNW","NW","WNW","W","WSW","SW","SSW","S","SSE","SE","ESE","E","ENE","NE","NNE"]
      return {
        visible: false,
        active: 1,
        fanData: null,
        position: {},
        windRose: {
          color: ['#BE6CFE'],
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
            top: 'bottom',
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
            "center": ["50%", "50%"],
            "radius": "60%",
            "shape": "circle",
            "name": {
              "textStyle": {
                "color": "#6D7D41",
                fontSize: 10
              }
            },
            "nameGap": 10,
          }],
          series: [{
            type: "radar",
            symbolSize: 0,
            data: []
          }]
        },
        timk: {
          color:['#53A9FF','#1E66EA','#1EBCEA','#1EEAB3','#CBE925','#E96125'],
          tooltip: {
            show: true,
            trigger: "axis",
            formatter:function(params){
              let str = params[0].axisValueLabel + 'm/s: ' + Number(params[0].value.toFixed(4)) + '%';
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
            show: false,
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
            data: ["威布尔分布"]
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
            right: "40px",
            bottom:"20px"
          },
        },
        dir: dir
      }
    },
    components:{
      myEcharts: () => import('@/components/utils/echarts/echarts.vue'),
    },
    props: ['height'],
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
      })
    },
    watch: {
      clickEarthFan(val) {
        if (val) {
          this.fanData = null
          this.getData()
        }
      },
      active (val) {
        this.active ==1 && this.initWindRose()
        this.active ==2 && this.initTimk()
      }
    },
    mounted() {

    },
    methods: {
      openWindow(position){
        this.visible = true
        this.position = position
        this.getData()
      },
      getData() {
        this.active ==1 && this.$refs.echarts0 && this.$refs.echarts0.showLoading()
        this.active ==2 && this.$refs.echarts1 && this.$refs.echarts1.showLoading()
        this.fanData = null
        getMapWindInfo({
          project_id: this.projectInfo.project_id,
          epsg: this.projectInfo.epsg_src,
          height: this.height,
          lon: this.position.lon,
          lat: this.position.lat
        }).then((res) => {
          if (res.code != 200) {
            this.$message.error(res.message);
            return;
          }
          this.fanData = res.data;
          this.active ==1 && this.initWindRose()
          this.active ==2 && this.initTimk()
        })
      },
      initWindRose () {
        let vm = this, data = this.fanData
        let max = Math.max.apply(null, data.sector_speed)
        if (!this.fanData) return
        this.$refs.echarts0 && this.$refs.echarts0.hideLoading()
        this.windRose = Object.assign(this.windRose, {
          legend: Object.assign({
            data: [data.height + 'm']
          }, vm.windRose.legend),
          radar: [Object.assign({
            indicator: vm.dir.map(v => {
              return {
                text: v,
                max
              }
            })
          }, vm.windRose.radar[0])],
          series: [{
            type: "radar",
            symbolSize: 0,
            data: [{
              name: data.height + 'm',
              value: data.sector_speed
            }]
          }]
        })
        console.log(this.windRose)
        this.$refs.echarts0 && this.$refs.echarts0.resize()
      },
      initTimk () {
        if (!this.fanData) return
        let vm = this, data = this.fanData
        this.$refs.echarts1 && this.$refs.echarts1.hideLoading()
        this.timk = Object.assign(this.timk, {
          xAxis: Object.assign(vm.timk.xAxis, {
            data: data.xAxis.map((v, k) => {
              return 0.5 * (k+1)
            })
          }),
          series: [{
            name: "威布尔分布",
            data: data.fit_line,
            type: "line",
            color: "#01E2A1",
            smooth: true,
            symbolSize: 1
          }]
        })
        this.$refs.echarts1 && this.$refs.echarts1.resize()
      },
      onClickProject(item) {
        if (!item) return;
        // setTimeout(()=>{
        this.$store.commit('setProjectInfo', item);
        // },100)
        if (item.four_point) {
          gwmap.dataManager.fltToRectangle(item.four_point, this.uploadScheme_id)
        } else {
          gwmap.dataManager.flyToLocation(item.longitude, item.latitude);
        }
        // this.$router.push('/index/project/' + item.project_id)
        this.$router.push({
          path: '/index/project',
          query: {
            id: item.project_id
          }
        })
        this.$store.commit('clickEarthFan', null)
        this.$store.commit('componentScheme', null)
      }
    }

  }
</script>
<style lang="scss" scoped>
  .wind-map {
    cursor: pointer;
    position: fixed;
    z-index: 99999;
    width: 3rem;
    min-height: 3.5rem;
    margin-left: -1.4rem;
    margin-top: -3.5rem;
    padding-bottom: 0.18rem;
    border-radius: 0.2rem 0.2rem 0.16rem 0.16rem;
    background: rgba(255, 255, 255, 1);
    color: #333333;
    ul.title{
      height: 0.45rem;
      padding: 0.05rem;
      background: rgba(235, 242, 228, 1);
      border-radius: 0.2rem;
      color: #333333;
      margin-bottom: 0;
      li{
        display: inline-block;
        padding: 0.08rem 0.17rem;
        border-radius: 0.15rem;
        cursor: pointer;
        &.active{
          background-color: #fff;
          color: #2CD0B9;
        }
      }
    }
    .echart{
      height: 2rem;
    }
    .content {
      padding: 8px 6px 0 6px;
      font-size: 0.13rem;
      li {
        margin-top: 10px;
        display: flex;
        span:first-child {
          display: inline-block;
          min-width: 65px;
          margin-left: 0.2rem;
        }
        span:last-child {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .titleName {
      color: #2CD0B9;
      font-size: 0.16rem;
      font-weight: bold;
    }
  }
</style>