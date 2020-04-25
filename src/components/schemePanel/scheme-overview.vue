<template>
    <div class="scheme-overview">
        <div class="title"> 
            <span>{{$t('m.overview')}}</span> 
            <span @click="openTypeSet" style="cursor: pointer;"><i class="iconfont icon-peizhi"></i></span>
        </div>
        
        <div class="content">
            <ul class="left">
                <li>
                    <span>{{$t('m.position')}}</span>:
                    <span class="ellipsis">{{detailsData && detailsData.province + detailsData.city + detailsData.county}}</span>
                </li>
                <li>
                    <span>{{$t('m.terrain')}}</span>:
                    <span>{{detailsData && detailsData.terrain}}</span>
                </li>
                <li>
                    <span>{{$t('m.capacity3')}}</span>:
                    <span>{{detailsData && detailsData.design_capacity}} MW</span>
                </li>
                <li>
                    <span>{{$t('m.ElevationRange')}}</span>:
                    <span>{{detailsData && detailsData.altitude_range}} m</span>
                </li>
                <li>
                    <span>{{$t('m.averageElevation')}}</span>:
                    <span>{{detailsData && detailsData.altitude_avg}} m</span>
                </li>
            </ul>
            <el-divider direction="vertical"></el-divider>
            <div class="right">
                <div class="averageNumber">平均风速：{{averageNumber}} m/s</div>
                <div class="titleName">主风向：{{main_wind_direction}}</div>
                <my-echarts :options="option" :theme="'themeOverview'" :autoResize="true"></my-echarts>
            </div>
        </div>
    </div>
</template>
<script>
import myEcharts from "@/components/utils/echarts/echarts.vue"
import { getProjectDetails, getProjectDetailsEchart } from "@/api/server.request.js"
import { mapState } from "vuex"
export default {
    name: 'scheme-overview',
    components:{
        myEcharts
    },
    props:{
       
    },
    data (){
        return{
            detailsData: null,
            option: this.initOption(),
            averageNumber: null,
            main_wind_direction: null
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
        })
    },
    watch:{
        
    },
    mounted (){
        this.init()
    },
    beforeDestroy (){
        // console.log("beforeDestroy--overview")
    },
    methods:{
        initOption (){
            return{
                title:{
                    textStyle:{
                        fontSize: 11
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        axios : "auto"
                    }
                },
                grid: {
                    bottom: '20',
                    top: '0',
                    right: '0',
                    left: '0',
                },
                legend:[{
                    right: "-2",
                    bottom: "0",
                    textStyle: {
                        fontSize: 12,
                    },
                    itemWidth: 16,
                    itemHeight: 10,
                    data:[{
                        name: "风向",
                        icon: "roundRect"
                    }]
                }],
                angleAxis: {
                    type: 'category',
                    show:true,
                    data: [], // 名字
                    boundaryGap: false,
                },
                radiusAxis: {
                },
                polar: {
                },
                series: [{
                    type: 'line',
                    data: [],
                    coordinateSystem: 'polar',
                    name: '风向',
                    stack: 'a'
                }]
                
            }
        },
        init (){
            let that = this
            getProjectDetails({
                project_id: that.projectInfo.project_id
            }).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.detailsData = res.data;
            })
            getProjectDetailsEchart(that.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    this.option = {}
                    return
                }
                if(!res.data || res.data.length <=0){
                    return
                }
                let dataEchart = res.data[0].tim_data.directionRose
                
                dataEchart.forEach((item,index)=>{
                    this.option.angleAxis.data.push({
                        value: item.direction,
                        textStyle:{
                            fontSize: 10
                        }
                    })
                    this.option.series[0].data.push({
                        value: item.rate,
                        textStyle:{
                            fontSize: 10
                        }
                    })
                })
                
                this.averageNumber = res.data[0].tim_data.avgSpeed || null 
                this.main_wind_direction = res.data[0].main_wind_direction || null
            })
        },
        openTypeSet (){
            this.$store.commit("typeSettingVisible", true)
        }
    }
}
</script>
<style lang="scss" scoped>
.scheme-overview{
    position: absolute;
    top: 0;
    right: 0.6rem;
    z-index: 999;
    
    width: 5.36rem;
    min-height: 2.77rem;
    background:rgba(255,255,255,1);
    box-shadow: 0px 0px 7px 0px rgba(9,38,40,0.4);
    border-radius: 0.22rem 0.22rem 0.18rem 0.18rem;
    display: flex;
    flex-direction: column;
    .title{
        padding: 0 0.2rem;
        color: #333333;
        height: 0.45rem;
        background:rgba(235,242,228,1);
        border-radius: 0.22rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:nth-of-type(1){
            font-weight:bold;
        }
    }
    .content{
        flex: 1;
        display: flex;
        justify-content: space-between;
        /deep/ .el-divider--vertical {
            width: 1px;
            height: 70%;
            top: 15%;
            margin: 0 3px;
        }
        .left{
            width: 48%;
            padding: 0.2rem 0 0 0.1rem;
            li{
                padding-left: 0.15rem;
                line-height: 0.38rem;
                display: flex;
                span:nth-of-type(1){
                    text-align: right;
                    display: inline-block;
                    min-width: 0.7rem;
                    text-align: justify;
                    text-align-last: justify;
                }
                span:nth-of-type(2){
                    flex: 1;
                    padding-left: 0.05rem;
                }
            }
        }
        .right{
            width: 50%;
            position: relative;
            margin-right: 0.1rem;
            padding: 0.35rem 0.1rem 0.1rem 0.1rem;
            .averageNumber{
                position: absolute;
                left: 0.35rem;
                top: 0.1rem;
                z-index: 999;
                font-size: 11px;
            }
            .titleName{
                position: absolute;
                top: 0.1rem;
                right: 0.2rem;
                z-index: 999;
                font-size: 11px;
            }
        }
    }
}

</style>