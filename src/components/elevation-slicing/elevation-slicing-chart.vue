<template>
  <!-- <div class="gold-form" id="chart">
  </div> -->
  <my-echarts :options="option" :theme="'brokenLine'" :autoResize="true"></my-echarts>
</template>

<script>
import { getElevationSlicingOption } from './chart-config'
// const echarts = require('echarts')
export default {
  components: {
    myEcharts: () => import('@/components/utils/echarts/echarts.vue'),
  },
  props: ['slicingData'],
  data () {
    return {
      chart: null,
      option: {}
    }
  },
  computed: {
  },
  watch: {

    slicingData () {
      // if (!this.chart) {
      //   this.chart = echarts.init(document.getElementById('chart'))
      // }
      // if (!this.slicingData) {
      //   this.chart.setOption({})
      // } else {
      //   this.chart.setOption(getElevationSlicingOption(this.slicingData.distance, this.slicingData.elevation))
      // }
      this.option = getElevationSlicingOption(this.slicingData.distance, this.slicingData.elevation)
    }

  },
  mounted () {
    window.onresize = (val) => {
      this.chart && this.chart.resize();
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.gold-form{
  height: 100%;
}
</style>
