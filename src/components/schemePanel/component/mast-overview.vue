<template>
  <el-table ref="table" :data="tableData" height="2.8rem">
    <el-table-column label="测风塔编号" prop="name"></el-table-column>
    <el-table-column v-for="(mast, index) in mastList" :key="mast.mast_id" :label="mast.mast_name">
      <template slot-scope="scope">{{scope.row['mast' + index]}}</template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "mast-overview",
    data () {
      return {
        tableData: [],
        nameList: [
          {value: 'lnglat', label: '经纬度'},
          {value: 'elevation', label: '海拔'},
          {value: 'channel_wind_velocity', label: '风速通道'},
          {value: 'channel_wind_direction', label: '风向通道'},
          {value: 'channel_temperature', label: '温度通道'},
          {value: 'channel_atmospheric_pressure', label: '气压通道'},
          {value: 'tim_start_date', label: '测风数据收集时间'},
          {value: 'txt_start_date', label: '参考年选取'},
        ]
      }
    },
    props: ['mastList'],
    mounted (){
      console.log(this.mastList)
      this.initData()
    },
    methods: {
      initData () {
        let vm = this;
        this.tableData = this.nameList.map(v => {
          let obj = {}
          vm.mastList.map((w,k) => {
            if(v.value == 'lnglat') {
              obj['mast' + k] = w['longitude'] + ' , ' + w['latitude']
            } else if(v.value == 'tim_start_date') {
              obj['mast' + k] = vm.dataFilter(w['tim_start_date'], w['tim_end_date'])
            } else if(v.value == 'txt_start_date') {
              obj['mast' + k] = vm.dataFilter(w['txt_start_date'], w['txt_end_date'])
            } else if(v.value == 'channel_wind_velocity' || v.value == 'channel_wind_direction' || v.value == 'channel_temperature' || v.value == 'channel_atmospheric_pressure') {
              obj['mast' + k] = w[v.value] && w[v.value].length && w[v.value].sort((a,b) => {return a-b}) || ''
            } else {
              obj['mast' + k] = w[v.value]
            }
          })
          return Object.assign({
            name: v.label
          }, obj)
        })
      },
      dataFilter(start, end){
        let str = ''
        if(start){
          str += start
          if (end) {
            str += ' 至 '
          }
        }
        if(end){
          str += end
        }
        return str
      }
    }
  }
</script>

<style scoped>

</style>
