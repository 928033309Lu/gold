<template>
    <div class="comparison-power">
        <!-- 列表 -->
        <table v-show="!templateHouers" class="mytable" border="1" cellspacing="0" cellpadding="0" width="100%">
            <tr v-for="(item, index) of gridData" :key="'a'+index">
                <td v-for="(item2,index2) in item" :key="'b'+index2" >
                    <div v-if="index == 0 && index2 != 0 && index2 != 1">
                        <input @change="changeCheckBox($event,item2)" type="checkbox" :checked="item2.checked" ></input>
                        <span>{{item2.scheme_name}}</span>
                    </div>

                    <span v-if="!Array.isArray(item2)" v-show="index != 0" 
                    @click="onClickHours(index, index2)"
                    :style="index==11 && index2==0? 'color: #2CD0B9;cursor: pointer;' : ''">{{item2}}</span>
                    <div v-else v-for="(v,m) of item2" :key="'cm'+m">{{v.turbine_type}}</div>
                </td>
            </tr>
        </table>

        <!-- 图表 -->
        <div v-if="templateHouers" class="comeBack" @click="onComeBack">
            <el-tooltip class="item" effect="light" :content="$t('m.comeback')" placement="top">
                <i class="iconfont icon-bianzubeifen"></i>
            </el-tooltip>  
        </div>
        <div v-if="templateHouers" class="templateHouers">
            <div v-for="(item, index) of houersEchartsList" :key="'houers'+index">
                <div class="title">{{item.scheme_name}}</div>
                <my-echarts :options="item || {}" :theme="'brokenLine'" :autoResize="true"></my-echarts>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getAllHoursDetails } from "@/api/server.request.js"
export default {
    name: 'comparison-power',
    components:{
        myEcharts: () => import('@/components/utils/echarts/echarts.vue'),
    },
    props:{
        schemeListDetail:{}
    },
    data (){
        return{
            waitingMinute: false,
            gridData: [[]],
            templateHouers: false, // 等效小时数图表界面
            houersEchartsList: [], // 图表数据
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            schemeList: state => state.app.schemeList,
        })
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: '正在获取数据，请稍候...'});
        },
        templateHouers (val){
            console.log(val, this.houersEchartsList.length)
            if (val && this.houersEchartsList.length <= 0){
                this.getHouersData()
            }
        }
    },
    mounted (){
        this.initDdetailsList()
    },
    beforeDestroy (){
        this.houersEchartsList = []
    },
    methods:{
        onComeBack (){
            this.templateHouers = false
        },
        onClickHours (index, index2){
            // 打开等效小时数图表界面
            if (index == 11 && index2 == 0){
                this.templateHouers = true
            }
        },
        // 等效小时数图表数据
        getHouersData (){
            this.waitingMinute = true
            getAllHoursDetails(this.projectInfo.project_id).then((res)=>{
                this.waitingMinute = false
                if (res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                var houersArr = []
                let houersEchartsList = res.data.filter((item)=> item.scheme_name)
                houersEchartsList.sort(function(a,b){
                    return b.scheme_id - a.scheme_id
                })
                this.houersEchartsList = houersEchartsList.map((item, index)=>{
                    let arr = item.turbine_data.map((v)=>v.equal_hours)
                    houersArr.push(...arr)
                    // console.log(houersArr)
                    let obj = {
                        scheme_name: item.scheme_name,
                        // title: {
                        //     text: '等效小时数折线图'
                        // },
                        legend: {
                            data:['小时数','尾流前', '尾流后']
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        xAxis: {
                            splitLine:{
                                show:false
                            },
                            type: 'category',
                            name: '风机',
                            nameLocation: 'end',
                            boundaryGap: false,
                            // axisLabel: {  
                            //     interval:0,  
                            //     rotate:40  
                            // },
                            data: item.turbine_data.map((v)=>v.turbine_name)
                        },
                        yAxis: [
                            {
                                type: 'value',
                                name: '小时数(h)',
                                min: Math.floor(Math.min(...houersArr)-200),
                                max: Math.floor(Math.max(...houersArr)+200),
                                nameLocation: 'end',
                            },
                            {
                                type: 'value',
                                name: '尾流(m/s)',
                                nameLocation: 'end',
                            },
                            
                        ],
                        series: [
                            {
                                data: arr,
                                name: '小时数',
                                yAxisIndex: 0,
                                type: 'line'
                            },
                            {
                                data: item.turbine_data.map((v)=>v.free_speed),
                                name: '尾流前',
                                yAxisIndex: 1,
                                type: 'line'
                            },
                            {
                                data: item.turbine_data.map((v)=>v.waked_speed),
                                name: '尾流后',
                                yAxisIndex: 1,
                                type: 'line'
                            },
                        ]
                    }
                    return obj
                })
                console.log(this.houersEchartsList)
            }).catch((err)=>{
                this.waitingMinute = false
            })
        },
        initData (){
            this.gridData = [
                [{scheme_name: '方案',scheme_id:'',checked:false}, {scheme_name: '',scheme_id:'',checked:false}],
                [[{turbine_type:'机型'}], [{turbine_type:''}]],
                ["总台数(台)", ""],
                ["容量(MW)", ""],
                ["平均风速(m/s)", ""],
                ["平均尾流(%)", ""],
                ["尾流后风速(m/s)", ""],
                ["理论发电量(MWh)", ""],
                ["尾流后发电量(MWh)", ""],
                ["折减系数", ""],
                ["年上网电量(MWh)", ""],
                ["等效小时(h)", ""],
            ]
        },
        initDdetailsList (){
            this.initData()
            // console.log(this.schemeListDetail)
            this.schemeListDetail.forEach((item, index)=>{
                this.gridData[0].push({
                    scheme_name: item.scheme_name,
                    scheme_id: item.scheme_id,
                    checked: item.checked,
                })
                this.gridData[1].push(item.turbine_type_info)
                this.gridData[2].push(item.turbine_num)
                this.gridData[3].push(item.real_capacity)
                this.gridData[4].push(item.free_speed)
                this.gridData[5].push(item.wake_flow)
                this.gridData[6].push(item.wake_speed)
                this.gridData[7].push(item.gross_aep)
                this.gridData[8].push(item.wake_aep)
                this.gridData[9].push(item.reduction_factor)
                this.gridData[10].push(item.real_aep)
                this.gridData[11].push(item.equal_hours||0)
                
            })
            // console.log(this.gridData)
        },
        changeCheckBox (ev, item){
            if (!ev.target.checked){
                gwmap.comparisonLayer.removeScheme(item.scheme_id)
                this.$emit('removeUrlColor', item)
            }
            item.checked = ev.target.checked
            // console.log(ev.target.checked, item)

            this.schemeList.forEach((v,n)=>{
                if (item.scheme_id == v.scheme_id){
                    v.checked = item.checked
                }
            })
            this.$store.commit('setSchemeList', this.schemeList)

            let arr = this.schemeList.filter((m)=>m.checked)
            console.log(arr.length)
            if (arr.length > 2){
                this.$message.error('最多允许两个方案定位进行比选')
                ev.target.checked = false
                item.checked = false
                return
            }
            
            if (item.checked){
                this.$emit('changeCheckedBox', item)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.comparison-power{
    height: 100%;
    .mytable{
        td{
            min-width: 200px !important;
        }
    }
    .comeBack{
        cursor: pointer;
        position: absolute;
        right: 0.15rem;
        top: 0.6rem;
        z-index: 9999;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ced4be;
        background: #fff;
        border-radius: 2px;
        transform: rotate(180deg);
    }
    .templateHouers{
        background: #fff;
        display: flex;
        &>div{
            position: relative;
            min-width: 6rem;
            min-height: 3rem;
            margin-top: 0.1rem;
            .title{
                position: absolute;
                top: 0.05rem;
                // right: 0.5rem;
                left: 0.3rem;
                z-index: 999;
                text-align: center;
            }
        }
    }
}
</style>