
<template>
<!-- 自定义Echarts参数
*    options: Object, // 数据
*    theme: String, // 主题名字
*    initOptions: Object, // 初始化
*    group: String, // 分组
*    autoResize: Boolean, // 自适应
*    modules: Array
 -->
  <div style="height: 100%;width:100%"></div>
</template>
<script>

  const ACTION_EVENTS = [
    'legendselectchanged',
    'legendselected',
    'legendunselected',
    'datazoom',
    'datarangeselected',
    'timelinechanged',
    'timelineplaychanged',
    'restore',
    'dataviewchanged',
    'magictypechanged',
    'geoselectchanged',
    'geoselected',
    'geounselected',
    'pieselectchanged',
    'pieselected',
    'pieunselected',
    'mapselectchanged',
    'mapselected',
    'mapunselected',
    'axisareaselected',
    'brush',
    'brushselected'
  ];
  const MOUSE_EVENTS = [
    'click',
    'dblclick',
    'mouseover',
    'mouseout',
    'mousedown',
    'mouseup',
    'globalout'
  ];
  export default {
    props: {
      options: Object,
      theme: String,
      initOptions: Object,
      group: String,
      autoResize: Boolean,
      modules: Array
    },
    data () {
      return {
        chart: null,
      }
    },
    computed: { // 数据驱动，不更新DOM
      width: {
        cache: false,
        get () {
          return this.chart.getWidth()
        }
      },
      height: {
        cache: false,
        get () {
          return this.chart.getHeight()
        }
      },
      isDisposed: {
        cache: false,
        get () {
          return this.chart.isDisposed()
        }
      }
    },
    watch: {// 通过监听参数：options、group进行重绘
      options: {
        handler (options) {
          if (!this.chart && options) {
            this.echartInit();
          } else {
            this.chart.setOption(this.options, true);
          }
        },
        deep: true
      },
      group: {
        handler (group) {
          this.chart.group = group
        }
      }
    },
    methods: {
      // 设置数据
      mergeOptions (options) {
        this._delegateMethod('setOption', options)
      },
      // 是否重新绘制
      resize (options) {
        this._delegateMethod('resize', options)
      },
      dispatchAction (payload) {
        this._delegateMethod('dispatchAction', payload)
      },
      convertToPixel (finder, value) {
        return this._delegateMethod('convertToPixel', finder, value)
      },
      convertFromPixel (finder, value) {
        return this._delegateMethod('convertFromPixel', finder, value)
      },
      containPixel (finder, value) {
        return this._delegateMethod('containPixel', finder, value)
      },
      showLoading (type, options) {
        this._delegateMethod('showLoading', type, options)
      },
      hideLoading () {
        this._delegateMethod('hideLoading')
      },
      getDataURL (options) {
        return this._delegateMethod('getDataURL', options)
      },
      getConnectedDataURL (options) {
        return this._delegateMethod('getConnectedDataURL', options)
      },
      clear () {
        this._delegateMethod('clear')
      },
      dispose () {
        this._delegateMethod('dispose')
      },
      _delegateMethod (name, ...args) {
        if (!this.chart) {
          return
        }
        return this.chart[name](...args)
      },
      echartInit () { // 按需引入
        if (this.chart) return false;
        import('echarts').then(({ init }) => {
          const { $el, theme, initOptions, group, options, autoResize, _resizeHanlder } = this
          let chart = init($el, theme, initOptions);
          if (group) {
            chart.group = group
          }
          chart.setOption(options, true);
          // 自定义点击事件回调
          ACTION_EVENTS.forEach(event => {
            chart.on(event, params => {
              this.$emit(event, params)
            })
          });
          // 自定义鼠标事件回调
          MOUSE_EVENTS.forEach(event => {
            chart.on(event, params => {
              this.$emit(event, params)
            })
          });
          if (autoResize) {
            window.addEventListener('resize', _resizeHanlder, false)
          }
          this.chart = chart;
          console.log('加载成功', chart)
        }).catch((err)=> {
          console.log('加载失败')
        })
      },
      _resizeHanlder () {
        window.setTimeout(() => {
          this.chart.resize()
        }, 100)
      }
    },
    mounted () { // 初始化
      if (this.options) {
        this.echartInit()
      }
    },
    beforeDestroy () {
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this._resizeHanlder, false)
      }
      this.dispose()
    },
    connect (group) {
      const { chart } = this;
      if (typeof group !== 'string') {
        group = group.map(chart => chart.chart)
      }
      this.chart.connect(group)
    },
    disconnect (group) {
      this.chart.disConnect(group)
    },
    registerMap (...args) {
      this.chart.registerMap(...args)
    },
    registerTheme (...args) {
      this.chart.registerTheme(...args)
    }
  }
</script>