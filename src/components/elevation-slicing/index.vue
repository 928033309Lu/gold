<template>
  <div style="width: 100%;height: 100%;" class="elevationClass" v-loading="computing">
    <div class="left" v-if="showContent">
      <div class="div">
        <div ><span class="span">起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</span>  <span>{{startPoint}}</span></div>
        <div ><span class="span">终&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</span>  <span>{{endPoint}}</span></div>
        <div ><span class="span">横跨距离：</span>  <span>{{startEndDistance}}</span></div>
        <div ><span class="span">最大&nbsp;&nbsp;<br/>海拔落差：</span>  <span>{{maxHeightDiff?(maxHeightDiff+'米'):''}}</span></div>
        <div ><span class="span">起止点&nbsp;&nbsp;<br/>海拔落差：</span>  <span>{{startEndHeightDiff?(startEndHeightDiff+'米'):''}}</span></div>
      </div>
    </div>
    <elevation-slicing-chart id="chart" :slicingData="requestResult" :style="showContent?'width:65%;height: 300px':'width:100%;height: 300px'"></elevation-slicing-chart>
  </div>
</template>

<script>
import util from '@/utils'
import { service } from '@/api/request'
import ElevationSlicingChart from './elevation-slicing-chart.vue'
export default {
  components: { ElevationSlicingChart },
  props: {
    "showContent": {
      default: false
    }
  },
  data () {
    return {
      requestResult: null,
      startPoint: null,
      endPoint: null,
      startEndDistance: null,
      startEndHeightDiff: null,
      maxHeightDiff: null,
      computing: false
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
  },
  methods: {

    setData (data) {
      if (!data) return
      this.clear()
      if (!data || !data.hasOwnProperty('length') || data.length < 2) return
      // section服务中的坐标不支持[x,y,z]形式
      data.forEach(item => {
        if (item && item.length === 3) {
          item.splice(2, 1)
        }
      })
      const geojson = {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': data
        }
      }
      this.computing = true
      service.map('section', [JSON.stringify(geojson)], (res) => {
        this.computing = false
        // if (res.code !== '1' || !res.data.result) {
        //   this.$message.error('获取高程剖面数据出错。')
        //   return
        // }
        const result = res.data.result
        result.startPoint = util.formater.formatCoordinate(data[0]).toString()
        result.endPoint = util.formater.formatCoordinate(data[data.length - 1]).toString()
        if (result.distance && result.distance.length !== 0) {
          result.distance[result.distance.length - 1] = Number(result.distance[result.distance.length - 1].toFixed(2))
          this.startEndDistance = result.distance[result.distance.length - 1]
        }
        this.requestResult = result

        this.startEndHeightDiff = result.elevation[result.elevation.length - 1] - result.elevation[0]
        this.maxHeightDiff = Math.max(...result.elevation) - Math.min(...result.elevation)
        this.startPoint = result.startPoint
        this.endPoint = result.endPoint
      })



    },
    clear () {
      this.requestResult = null
      this.startEndDistance = null
      this.startEndHeightDiff = null
      this.maxHeightDiff = null
      this.startPoint = null
      this.endPoint = null
      this.computing = false
    }
  }
}
</script>

<style lang="scss" scoped>
.elevationClass{
  display: flex;
  color: #6D7D41;
  .left{
    width: 33%;
    padding-top: 50px;
  }
  .div{
    div{
      line-height: 35px;
    }
  }
  .span{
    display: inline-block;
    width: 140px;
    text-align: center;
    line-height: 20px;
  }
}
.slicing-text {
  padding: 5px 10px !important;
  text-align: unset !important;
}
#chart {
  display: inline-block;
  padding: 5px 10px;
  height: 161px;
  width: 400px;
  background: white;
  //background: rgba(52, 52, 57, 1);
}
#content {
  position: absolute;
  display: inline-block;
  top: 40px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  padding: 5px 10px;
  width: 35%;
  height: 300px;
  &>div{
    background:#EBF2E4;
    height: 137px;
    width: 100%;
    height: 100%;
    border-radius: 5px 5px 22px 5px;
  }
  .slicing-text{
    padding: 10px 0 0 0  !important;
    height: 35px;
    
    &>span:first-child{
      padding: 5px 0;
      height: 35px;
      display: inline-block;
      width: 140px;
      text-align: right;
      
    }
    &>span:last-child{
      padding-left: 30px;
    }
  }
  .slicing-text:last-child{
    border: none;
  }
}
</style>
