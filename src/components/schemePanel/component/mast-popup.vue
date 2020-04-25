<template>
  <div class="mast-popup" v-if="visible">
    <div class="title">测风塔 {{mast.mast_name}}
      <i class="iconfont icon-close" @click="visible = false; dateTime = []"></i>
    </div>
    <el-row>
      <el-col :span="12">
        <ul class="content">
          <li><span>坐标：</span> <span> {{mast.longitude + ', ' + mast.latitude}}</span></li>
          <li><span>测风时间：</span> <span>
        <el-date-picker size="mini" v-model="dateTime" format="yyyy.MM.dd" value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        type="daterange"
                        unlink-panels
                        @change="getTxtData"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" clearable>
    </el-date-picker> </span></li>
          <li><span>通道高度：</span> <span>
        <el-select v-model="mast.height" @change="drawEchart">
          <el-option v-for="(item,index) of mast['channel_wind_velocity']" :key="index" :label="item" :value="item"></el-option>
        </el-select> m
      </span></li>
          <li><span>风速：</span> <span> {{wind_speed}} m/s</span></li>
          <li><span>风向：</span> <span> {{mast.main_wind_direction}}</span></li>
          <li><span>湍流：</span> <span> {{turbulence}}</span></li>
          <li><span>切变：</span> <span> {{wind_shear}} </span></li>
          <li><span>50年一遇<br>最大风速：</span> <span> {{mast.extreme50_speed}} m/s</span></li>
        </ul>
      </el-col>
      <el-col :span="12">
        <ul class="tab-list">
          <li v-for="item in echartsList" :key="item.name" :class="{'active': active == item.name }" @click="tabChange(item)">{{item.label}}</li>
        </ul>
        <div class="echarts-box">
          <span v-if="txt_data && active == 'timk'" class="tip a">{{'A=' + txt_data.weibullA.toFixed(3)}}</span>
          <span v-if="txt_data && active == 'timk'" class="tip k">{{'K=' + txt_data.weibullK.toFixed(3)}}</span>
          <!--<span v-if="active == 'windShear'" class="tip">{{'α=' + txt_data.alpha.toFixed(3)}}</span>-->
          <my-echarts :ref="active" :options="option" :theme="'myTheme'" :autoResize="true"></my-echarts>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  import {getMapWindInfo} from "@/api/server.request.js"
  import { getTxtData } from "@/api/goldLab.request.js"

  export default {
    name: 'mast-popup',
    data() {
      return {
        visible: false,
        mast: {
          height: '',
          txt_start_date: '',
          txt_end_date: ''
        },
        dateTime: '',
        pickerOptions: {},
        echartsList: [
          {label: '风向', name: 'windDirec'},
          {label: '风速', name: 'winSpeed'},
          {label: '湍流', name: 'turbulence'},
          {label: '威布尔', name: 'timk'},
          {label: '切变', name: 'windShear'}
        ],
        active: 'turbulence',
        option: {
        },
        txt_data: '',
        dir: ["N","NNW","NW","WNW","W","WSW","SW","SSW","S","SSE","SE","ESE","E","ENE","NE","NNE"],
        iecStandard: {
          a: [0.478,0.376,0.319,0.283,0.258,0.239,0.225,0.214,0.205,0.198,0.192,0.186,0.182,0.178,0.174,0.171,0.168,0.166,0.164,0.162,0.16,0.158,0.157],
          b: [0.419,0.329,0.279,0.248,0.226,0.21,0.197,0.188,0.18,0.173,0.168,0.163,0.159,0.156,0.153,0.15,0.147,0.145,0.143,0.141,0.14,0.138,0.137],
          c: [0.359,0.282,0.239,0.212,0.193,0.18,0.169,0.161,0.154,0.148,0.144,0.14,0.136,0.133,0.131,0.128,0.126,0.124,0.123,0.121,0.12,0.119,0.117]
        }
      }
    },
    components:{
      myEcharts: () => import('@/components/utils/echarts/echarts.vue'),
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        clickMastData: state => state.app.clickMastData
      }),
      wind_shear: function(){
        let str = this.mast && this.mast.wind_shear && this.mast.wind_shear.filter(v => {
          return v[1] == this.mast.height
        })[0] || ''
        return str && Number(str[0].toFixed(3)) || ''
      },
      wind_speed: function(){
        let str = this.mast && this.mast.measured_wind_speed && this.mast.measured_wind_speed.filter(v => {
          return v.height == this.mast.height
        })[0] || ''
        return str && Number(str.data.toFixed(1)) || ''
      },
      turbulence: function(){
        let str = this.mast && this.mast.behalf_of_turbulence && this.mast.behalf_of_turbulence.iec3.filter(v => {
          return v.height == this.mast.height
        })[0] || ''
        return str && str.data && Number(str.data.toFixed(3)) || ''
      }
    },
    watch: {
      clickMastData(val) {
        if (val) {
          this.init(val)
        }
      }
    },
    mounted() {
      this.dateTime = []
    },
    methods: {
      init(mast){
        this.visible = true
        this.mast = mast
        this.dateTime = [mast.txt_start_date, mast.txt_end_date]
        this.pickerOptions.disabledDate = (time) => {
          return (time.getTime() < new Date(mast.txt_start_date).getTime() || time.getTime() > new Date(mast.txt_end_date).getTime())
        }
        this.height = mast.channel_wind_velocity && mast.channel_wind_velocity[0] || ''
        this.getTxtData()
      },

      getTxtData (){
        getTxtData(this.mast.goldlab_id, {
          startDateTime: this.dateTime[0],
          endDateTime: this.dateTime[1]
        }).then(res => {
          if(res.code != 200){
            this.$message.error(res.msg || '')
            this.txt_data = ''
            this.drawEchart()
            return
          }
          this.txt_data = res.data
          console.log(res)
          this.drawEchart()
        })
      },
      drawEchart(){
        if (!this.txt_data){
          this.$refs[this.active] && this.$refs[this.active].clear()
          return
        }
        switch (this.active){
          case 'timk':
            this.option = this.setTimkOption();
            break;
          case 'windShear':
            this.option = this.setWindShearOption();
            break;
          case 'turbulence':
            this.option = this.setTurbulenceOption();
            break;
          case 'windDirec':
            this.option = this.setWindDirecOption();
            break;
          case 'winSpeed':
            this.option = this.setWinSpeedOption();
            break;
        }
        this.$refs[this.active] && this.$refs[this.active].resize()
      },
      tabChange(item){
        this.active = item.name;
        this.drawEchart()
      },
      setTimkOption(){
        let option = {
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
            nameLocation:'end',
            nameGap: -50,
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
              color: '#6D7D41',
              padding: [60, 0,0,0]
            },
            // x轴的颜色和宽度
            axisLine:{
              lineStyle:{
                color:'#C4CABD',
                width:1,   //这里是坐标轴的宽度,可以去掉
              }
            },
            data: this.txt_data.weibullFrequency.map((v, k) => {
              return 0.5 * (k+1)
            })
          },
          legend: {
            left:'center',
            top:'bottom',
            // orient:'vertical',
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
            right: "20px",
            bottom:"50px"
          },
          series: [{
            name: "风频分布",
            data: this.txt_data.weibullFrequency,
            type: "bar",
            color: "#53A9FF",
            symbolSize: 1
          },{
            name: "威布尔分布",
            data: this.txt_data.weibullMaximum.map(item => {
              return item[1];
            }),
            type: "line",
            color: "#01E2A1",
            smooth: true,
            symbolSize: 1
          }]
        }
        return option
      },
      setWindShearOption (){
        let option = {
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
            left:'center',
            top:'bottom',
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
            right: "20px",
            bottom:"50px"
          },
          xAxis: [
            {
              type: 'value',
              name: '风速(m/s)',
              nameGap: -50,
              nameTextStyle: {
                color: '#6D7D41',
                padding: [60, 0,0,0]
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
          series: [{
            name: 'PowerLawFit',
            data: this.txt_data.shear.powerlawfit.map((item,index)=>{
              return [item[0].toFixed(2),item[1].toFixed(2)]
            }),
            type: "line",
            color: "#009fff",
            symbolSize: 1,
            smooth: true
          }, {
            symbolSize: 5,
            name: 'MeasuredDatas',
            data: this.txt_data.shear.measureddata,
            type: "scatter",
            color: "#FF2E76"
          }]
        }
        return option
      },
      setTurbulenceOption (){
        let vm = this;
        let item = this.txt_data.iec3.filter(v => {
          return v.height == this.mast.height
        })[0]
        let standard = {a: [],b: [],c: []}
        for( let i=2.5; i < 25; i++){
          standard.a.push([i, vm.iecStandard.a[i-2.5]])
          standard.b.push([i, vm.iecStandard.b[i-2.5]])
          standard.c.push([i, vm.iecStandard.c[i-2.5]])
        }
        let series = []
        Object.keys(standard).forEach(v =>{
          series.push({
            name: v,
            type: 'line',
            data: standard[v],
            smooth: true,
            symbolSize: 1
          })
        })
        series.push({
          name: item.height+'m',
          type: 'line',
          data: item.data,
          smooth: true,
          symbolSize: 1
        })
        let option = {
          color: ['#2C31FF', '#BE6CFE', '#8883FF', '#53A9FF', '#01E2A1', '#FFC035', '#FB5D3F', '#D4031C'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (params)=>{
              let str = `${Number(params[0].value[0].toFixed(2))}m/s<br/>`;
              params.forEach((v, k)=>{
                str += `${v.seriesName} : ${Number(v.value[1].toFixed(2))}<br/>`
              })
              return str;
            }
          },
          legend: {
            top:'bottom',
            right:'center',
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
            right: "20px",
            bottom:"50px"
          },
          xAxis: [
            {
              type: 'value',
              name: '风速(m/s)',
              nameLocation: 'end',
              nameGap: -50,
              nameTextStyle: {
                color: '#6D7D41',
                padding: [60, 0,0,0]
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
          series: series
        }
        return option
      },
      setWinSpeedOption (){
        let item = this.txt_data.monthlySpeed.filter(v => {
          return v.height == this.mast.height
        })[0]
        let option = {
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
            top:'bottom',
            right:'center',
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
            right: "20px",
            bottom:"50px"
          },
          xAxis: [
            {
              type: 'category',
              name: '月份',
              nameGap: -20,
              nameTextStyle: {
                color: '#6D7D41',
                padding: [60, 0,0,0]
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
          series: [{
            name: item.height+'m',
            type: 'line',
            data: item.data,
            symbolSize: 1
          }]
        }
        return option
      },
      setWindDirecOption (){
        let vm = this
        let names = [],seriesData = [],dataArr = [];
        this.txt_data.wdFrequency.forEach(item=>{
          // if(item.height != vm.mast.height) return
          names.push(item.height+'m'+(item.cedian=='DEFAULT'?'':item.cedian));
          seriesData.push({
            "name": item.height+'m'+(item.cedian=='DEFAULT'?'':item.cedian),
            "value": this.changeOrder(item.data)
          })
          item.data.map(son=>{
            dataArr.push(son);
          })
        })
        let maxData = 1;
        maxData = Math.max.apply(null, dataArr);

        let option = {
          tooltip: {
            show: true,
            trigger: "item",
            formatter: function (params) {
              let data = params.data;
              let str = data.name + '<br>';
              data.value.forEach((item, index) => {
                str += vm.dir[index] + ': ' + ((Number(item) * 100).toFixed(2) + '%') + '<br>'
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
            right: '20px',
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
            itemGap: 5,
            data: names
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
            indicator: vm.dir.map(v => {
              return {
                text: v,
                max: maxData
              }
            })
          }],
          series: [{
            type: "radar",
            symbolSize: 0,
            data: seriesData
          }]
        }
        return option
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
      }
    }

  }
</script>
<style lang="scss" scoped>
  .mast-popup {
    cursor: pointer;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 99999;
    width: 578px;
    min-height: 3rem;
    margin-left: -9rem;
    margin-top: -1.5rem;
    padding-bottom: 0.18rem;
    border-radius: 0.2rem 0.2rem 0.16rem 0.16rem;
    background: rgba(255, 255, 255, 1);
    color: #333333;
    .title{
      height: 0.45rem;
      line-height: 0.35rem;
      padding: 0.05rem 0.1rem;
      background: rgba(235, 242, 228, 1);
      border-radius: 0.2rem;
      color: #333333;
      margin-bottom: 0;
      .iconfont{
        position: absolute;
        right: 0.15rem;
        top: 0.05rem;
        font-size: 0.16rem;
        color: #6D7D41;
        cursor: pointer;
      }
    }
    .content {
      padding: 8px 20px 0 20px;
      font-size: 14px;
      li {
        margin-top: 10px;
        display: flex;
        span:first-child {
          display: inline-block;
          min-width: 65px;
        }
        span:last-child {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      /deep/.el-date-editor--daterange.el-input__inner{
        width: 160px;
        height: 0.3rem;
        background-color: #EBF2E4;
        border: none;
        padding: 0.03rem;
        .el-range__icon{
          display: none;
        }
        .el-range-input{
          background-color: transparent;
          width: 65px;
          font-size: 0.14rem;
          color: #6D7D41;
        }
        .el-range-separator{
          padding: 0;
          width: 12px;
          line-height: 0.3rem;
          height: 0.3rem;
        }
        .el-range__close-icon{
          line-height: 0.3rem;
          height: 0.3rem;
        }
      }
      /deep/.el-select{
        .el-input__inner{
          width: 60px;
          background-color: #EBF2E4;
          border: none;
          height: 0.2rem;
          line-height: 0.2rem;
          font-size: 14px;
        }
        .el-input__suffix{
          top: 8px;
          right: -1px;
        }
        .is-focus{
          .el-input__suffix{
            top: -5px;
          }
        }
      }
    }
    .titleName {
      color: #2CD0B9;
      font-size: 0.16rem;
      font-weight: bold;
    }
    .tab-list{
      width:260px;
      height: 0.3rem;
      background:rgba(240,247,242,1);
      border:1px solid rgba(237,238,239,1);
      border-radius: 0.15rem;
      margin-top: 18px;
      li{
        width: 20%;
        height: 0.3rem;
        text-align: center;
        display: inline-block;
        font-size: 0.14rem;
        line-height: 0.3rem;
        padding: 0 0.05rem;
        color: #5F482E;
        cursor: pointer;
        white-space: nowrap;
        &.active{
          text-align: center;
          color: #2CD0B9;
          background:rgba(255,255,255,1);
          box-shadow:0px 0px 9px 0px rgba(216,232,230,1);
          border-radius: 0.15rem;
        }
      }
    }
    .echarts-box{
      position: relative;
      width: 100%;
      height: 2.8rem;
      .tip{
        position: absolute;
        top: 0.15rem;
        &.a{
          right: 1rem;
        }
        &.k{
          right: 0.2rem
        }
      }
    }
  }
</style>