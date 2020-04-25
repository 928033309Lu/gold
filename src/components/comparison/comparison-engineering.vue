<template>
    <div class="comparison-engineering">
         <!-- 列表 -->
        <table v-show="!templateEchart" class="mytable" border="1" cellspacing="0" cellpadding="0" width="100%">
            <tr v-for="(item, index) of gridData" :key="'a'+index">
                <td v-for="(item2,index2) in item" :key="'b'+index2" :class="{clickClass : index2 ==0 && index==1 || index==2 || index==3 || index==4 || index==8}">
                    <div v-if="index == 0 && index2 != 0 && index2 != 1">
                        <input @change="changeCheckBox($event,item2)" type="checkbox" :checked="item2.checked" ></input>
                        <span>{{item2.scheme_name}}</span>
                    </div>

                    <span v-show="index != 0" @click="onClick(index, index2)">
                        {{item2}}
                    </span>
                </td>
            </tr>
        </table>

        <div v-if="templateEchart" class="comeBack" @click="onComeBack">
            <el-tooltip class="item" effect="light" :content="$t('m.comeback')" placement="top">
                <i class="iconfont icon-bianzubeifen"></i>
            </el-tooltip>  
        </div>
        <!-- 图表 -->
        <div v-if="templateEchart && templateEchart_auxiliary" class="templateEchart">
            <div v-for="(item, index) of auxiliaryEchartsList" :key="'au'+index">
                <div class="title center">{{item.scheme_name}}</div>
                <my-echarts :options="item" :theme="'brokenLine'" :autoResize="true"></my-echarts>
            </div>
        </div>

        <div v-if="templateEchart && templateEchart_insatall" class="templateEchart">
            <div v-for="(item, index) of insatallEchartsList" :key="'in'+index">
                <div class="title center">{{item.scheme_name}}</div>
                <my-echarts :options="item" :theme="'brokenLine'" :autoResize="true"></my-echarts>
            </div>
        </div>

        <div v-if="templateEchart && templateEchart_building" class="templateEchart">
            <div v-for="(item, index) of buildingEchartsList" :key="'bu'+index">
                <div class="title center">{{item.scheme_name}}</div>
                <my-echarts :options="item" :theme="'brokenLine'" :autoResize="true"></my-echarts>
            </div>
        </div>

        <div v-if="templateEchart && templateEchart_money" class="templateEchart">
            <div v-for="(item, index) of moneyEchartsList" :key="'mon'+index">
                <div class="title center">{{item.scheme_name}}</div>
                <my-echarts :options="item" :theme="'brokenLine'" :autoResize="true"></my-echarts>
            </div>
        </div>

        <div v-if="templateEchart && templateEchart_assets" class="templateEchart">
            <div v-for="(item, index) of assetsEchartsList" :key="'ass'+index">
                <div class="title center">{{item.scheme_name}}</div>
                <my-echarts :options="item" :theme="'brokenLine'" :autoResize="true"></my-echarts>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState } from "vuex";
// import { getContrastEvaluation } from "@/api/server.request.js"
export default {
    name: 'comparison-engineering',
    components:{
        myEcharts: () => import('@/components/utils/echarts/echarts.vue'),
    },
    props:{
        evaluationDetail:{},
        auxiliaryEchartsList:{},
        insatallEchartsList:{},
        buildingEchartsList:{},
        moneyEchartsList:{},
        assetsEchartsList:{},
    },
    data (){
        return{
            gridData:[[]],
            templateEchart: false,
            templateEchart_auxiliary: false, // 施工辅助工程 图表
            templateEchart_insatall: false, // 设备及安装工程 图表
            templateEchart_building: false, // 建筑工程 图表
            templateEchart_money: false, // 其他费用 图表
            templateEchart_assets: false, // 资产 图表
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            schemeList: state => state.app.schemeList,
        })
    },
    watch:{
    },
    mounted (){
        this.initDdetailsList()
    },
    beforeDestroy (){

    },
    methods:{
        onComeBack (){
            this.templateEchart = false
            this.templateEchart_auxiliary = false
            this.templateEchart_insatall = false
            this.templateEchart_building = false
            this.templateEchart_money = false
            this.templateEchart_assets = false
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
        },
        onClick (index, index2){
            // 施工辅助工程 图表
            if (index == 1 && index2 == 0){
                this.templateEchart = true
                this.templateEchart_auxiliary = true
            }
            // 设备及安装工程 图表
            else if(index == 2 && index2 == 0){
                this.templateEchart = true
                this.templateEchart_insatall = true
            }
            // 建筑工程 图表
            else if(index == 3 && index2 == 0){
                this.templateEchart = true
                this.templateEchart_building = true
            }
            // 其他费用 图表
            else if(index == 4 && index2 == 0){
                this.templateEchart = true
                this.templateEchart_money = true
            }
            // 图表
            else if(index == 8 && index2 == 0){
                this.templateEchart = true
                this.templateEchart_assets = true
            }
        },
        initData (){
            this.gridData = [
                [{scheme_name: '方案',scheme_id:'',checked:false}, {scheme_name: '',scheme_id:'',checked:false}],
                ["施工辅助工程(万元)", ""],
                ["设备及安装工程(万元)", ""],
                ["建筑工程(万元)", ""],
                ["其他费用(万元)", ""],
                ["基本预备费(万元)", ""],
                ["价差预备费(万元)", ""],
                ["建设期利息(万元)", ""],
                ["工程总投资(万元)", ""],
            ]
        },
        initDdetailsList (){
            this.initData()
            this.evaluationDetail.forEach((item, index)=>{
                this.gridData[0].push({
                    scheme_name: item.scheme_name,
                    scheme_id: item.scheme_id,
                    checked: item.checked,
                })
                this.gridData[1].push(item.engineAssistance)
                this.gridData[2].push(item.equipment_install)
                this.gridData[3].push(item.constructionInstall)
                this.gridData[4].push(item.otherFee)
                this.gridData[5].push(item.basicReserveFundsFee)
                this.gridData[6].push(item.reservePriceDiff)
                this.gridData[7].push(item.interestConstruction)
                this.gridData[8].push(item.totalProjectInvestment)
                
            })
            // console.log(this.gridData)
        }
    }
}
</script>

<style lang="scss" scoped>
.comparison-engineering{
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
    .clickClass:nth-of-type(1){
        color: #2CD0B9;
        cursor: pointer;
    }

    .templateEchart{
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
            .center{
                left: 35%;
            }
            .right{
                left: inherit;
                right: 1.3rem;
            }
        }
    }
    .templateEchart>div:hover{
        box-shadow:0px 0px 16px 0px rgba(104,164,171,0.5);
    }
}
</style>