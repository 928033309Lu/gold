<template>
    <div class="scheme-comparison":class="{'ppt-edit': pptModel == 'edit'}" v-if="comparison">
        <comparison-hover :indexHover="indexHover" 
        :hover3EchartOption="hover3EchartOption"
        :hover2EchartOption="hover2EchartOption"
        :hover1EchartOption="hover1EchartOption" @closeHover="indexHover = -1"></comparison-hover>

        <div class="title" @mouseleave="onHover(-1)">
            <div @click="changeTab(1)" :class="{active: tabIndex == 1}"><i @mouseenter="onHover(1)" class="iconfont icon-tubiaozhexiantu"></i> 发电量 </div>
            <div @click="changeTab(2)" :class="{active: tabIndex == 2}"><i @mouseenter="onHover(2)" class="iconfont icon-tubiaozhexiantu"></i> 工程概算 </div>
            <div @click="changeTab(3)" :class="{active: tabIndex == 3}"><i @mouseenter="onHover(3)" class="iconfont icon-tubiaozhexiantu"></i> 经济指标 </div>

            <el-tooltip class="item" effect="light" :content="tabMax ? $t('m.minMIn') : $t('m.maxMax')" placement="top">
                <div class="minMax" @click="tabMax = !tabMax"><i class="iconfont icon-minview"></i></div>
            </el-tooltip>  
            <el-tooltip class="item" effect="light" :content="$t('m.ExitChoose')" placement="top">
                <div class="close" @click="onClose"><i class="iconfont icon-close"></i></div>
            </el-tooltip>
        </div>
        <div class="content" :style="tabMax ? '' : 'height: 0.5rem'">
            <comparison-power :schemeListDetail="schemeListDetail" v-if="tabIndex == 1"
            ref="power"
            @removeUrlColor="removeUrlColor"
            @changeCheckedBox="changeCheckedBox"></comparison-power>

            <comparison-engineering :evaluationDetail="evaluationDetail" v-if="tabIndex == 2"
            ref="engineering"
            :auxiliaryEchartsList="auxiliaryEchartsList"
            :insatallEchartsList="insatallEchartsList"
            :buildingEchartsList="buildingEchartsList"
            :moneyEchartsList="moneyEchartsList"
            :assetsEchartsList="assetsEchartsList"
            @removeUrlColor="removeUrlColor"
            @changeCheckedBox="changeCheckedBox"></comparison-engineering>

            <comparison-economic :economicDetail="economicDetail" v-if="tabIndex == 3"
            @removeUrlColor="removeUrlColor"
            @changeCheckedBox="changeCheckedBox"></comparison-economic>
        
        </div>
        <!-- <div @click="openLabel"><el-checkbox v-model="flagLabel">点击开关标签</el-checkbox></div> -->
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getTurbine_scheme, getAllSchemeDetails, getContrastEvaluation } from "@/api/server.request.js"
export default {
    name: 'scheme-comparison',
    components:{
        'comparison-power': () => import('./comparison-power.vue'),
        'comparison-engineering': () => import('./comparison-engineering.vue'),
        'comparison-economic': () => import('./comparison-economic.vue'),
        'comparison-hover': () => import('./comparison-hover.vue'),
    },
    data (){
        return{
            waitingMinute: false,
            waitingLoading: false,
            tabIndex: -1,
            indexHover: -1,
            flagLabel: false,
            tabMax: true,
            imgUrl: ['/images/green.png', '/images/purple.png',],
            color: ['#00ff00', '#ff00ff',],
            addUrlColor: [],
            schemeListDetail: [], // 发电量表格数据
            evaluationDetail: [], // 工程表格数据
            economicDetail: [], // 经评表格数据
            auxiliaryEchartsList: [], // 施工辅助工程 图表数据
            insatallEchartsList: [], // 设备及安装工程 图表数据
            buildingEchartsList: [], //  图表数据
            moneyEchartsList: [], //  图表数据
            assetsEchartsList: [], //  图表数据
            hover1EchartOption: null, //  移入图表数据1
            hover2EchartOption: null, //  移入图表数据2
            hover3EchartOption: null, //  移入图表数据3
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            comparison: state => state.app.comparison,
            schemeList: state => state.app.schemeList,
            turbineSchemeList: state => state.app.turbineSchemeList,
            allUploadNameInfo: state => state.projectUpload.allUploadNameInfo,
            pptModel: state => state.app.pptModel,
        })
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: '正在获取机位点数据，请稍候...'});
        },
        waitingLoading () {
            this.$store.dispatch('handleLoading', {loading: this.waitingLoading, text: '正在获取列表数据，请稍候...'});
        },
        comparison (val){
            console.log("比选模块",val)
            if (val){
                this.openEnter()
               
                gwmap.wtLayer.remove()
                let checkedList = this.schemeList.filter((n)=>n.checked)
                // 切换加载改成一次性加载
                this.initPowerTableData(checkedList, (res)=>{
                    this.getAllAllData(checkedList, (res)=>{
                        this.changeTab(1)
                    })
                })
                this.initTurbineScheme(checkedList)
            }
            else{
                this.schemeListDetail = []
                this.evaluationDetail = []
                this.economicDetail = []
                this.addUrlColor = []
                this.tabIndex = -1
                this.indexHover = -1
                this.schemeList.forEach((item)=>{
                    item.checked = false
                })
                this.$store.commit('setSchemeList', this.schemeList)
                gwmap.comparisonLayer.exit()
                gwmap.wtLayer.loadWt(this.turbineSchemeList, ()=>{})
            }
        }
    },
    mounted (){

    },
    beforeDestroy (){

    },
    methods:{
        onHover (index){
            this.indexHover = index
            console.log(this.indexHover)
        },
        getHoverEchartData1 (data){
            var arrName = []
            var arrHouers = []
            var arr1 = []
            var arr2 = []
            data.forEach((item, index)=>{
                arrName.push(item.scheme_name)
                arrHouers.push(item.equal_hours||0)
                arr1.push(item.free_speed||0)
                arr2.push(item.waked_speed||0)
            })
            // console.log(arrName)
            this.hover1EchartOption =  {
                legend: {
                    data:['等效小时数', '尾流前风速', '尾流后风速'],
                    bottom: 8
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '11%',
                    right: '14%',
                },
                xAxis: {
                    splitLine:{
                        show:false
                    },
                    type: 'category',
                    name: '方案',
                    nameLocation: 'end',
                    boundaryGap: false,
                    // axisLabel: {  
                    //     interval:0,  
                    //     rotate:40  
                    // },
                    data: arrName
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '小时数(h)',
                        min: Math.floor(Math.min(...arrHouers)-200) < 0 ? 0 : Math.floor(Math.min(...arrHouers)-200),
                        max: Math.floor(Math.max(...arrHouers)+200),
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
                        data: arrHouers,
                        name: '等效小时数',
                        yAxisIndex: 0,
                        type: 'line'
                    },
                    {
                        data: arr1,
                        name: '尾流前风速',
                        yAxisIndex: 1,
                        type: 'line'
                    },
                    {
                        data: arr2,
                        name: '尾流后风速',
                        yAxisIndex: 1,
                        type: 'line'
                    },
                ]
            }
        },
        // 初始化工程-经评模块所有图表数据
        initEchartData (data){
            this.auxiliaryEchartsList = []
            this.insatallEchartsList = []
            this.buildingEchartsList = []
            this.moneyEchartsList = []
            this.assetsEchartsList = []
            var arrName3 = []
            var arrData3 = []
            var max1 = []
            var max2 = []
            var max3 = []
            var arrData2 = []
            var arrName2 = []
            console.log("图表数据", data)
            
            data.forEach((item, index)=>{
                // 工程模块五个图
                let obj = {
                    scheme_name: item.scheme_name,
                    tooltip: {
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: '0',
                        top: '25',
                        data: ['施工交通工程', '施工供电工程', '施工供水工程', '其他施工辅助工程']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: [40, 100],
                            center: ['40%', '50%'],
                            label: {
                                normal:{
                                    show:true,
                                    position:'inner',
                                    textStyle : {
                                        fontWeight: 300 ,
                                        fontSize: 14 
                                    },
                                    formatter:'{d}%'
                                }
                            },
                            data: [
                                {
                                    value: item.evaluation_budgetary_estimates.assistanceTrafficFee || 0, 
                                    name: '施工交通工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.assistancePowerFee || 0, 
                                    name: '施工供电工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.assistanceWaterFee || 0, 
                                    name: '施工供水工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.assistanceOtherFee || 0, 
                                    name: '其他施工辅助工程'
                                },
                            ]
                        }
                    ]
                }

                let obj2 = {
                    scheme_name: item.scheme_name,
                    tooltip: {
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: '0',
                        top: '25',
                        data: ['发电场设备及安装工程', '升压变电站设备及安装工程', '控制保护设备及安装工程', '其他设备及安装工程']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: [40, 100],
                            center: ['40%', '50%'],
                            label: {
                                normal:{
                                    show:true,
                                    position:'inner',
                                    textStyle : {
                                        fontWeight: 300 ,
                                        fontSize: 14 
                                    },
                                    formatter:'{d}%'
                                }
                            },
                            data: [
                                {
                                    value: item.evaluation_budgetary_estimates.electricalEquipmentInstall || 0, 
                                    name: '发电场设备及安装工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.equipmentInstallationBoosterSubstation || 0, 
                                    name: '升压变电站设备及安装工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.controlProtectionEquipmentInstall || 0, 
                                    name: '控制保护设备及安装工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.otherEquipmentInstall || 0, 
                                    name: '其他设备及安装工程'
                                },
                            ]
                        }
                    ]
                }

                let obj3 = {
                    scheme_name: item.scheme_name,
                    tooltip: {
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: '0',
                        top: '25',
                        data: ['发电场工程', '升压变电站工程', '房屋建筑工程', '交通工程', '其他工程']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: [40, 100],
                            center: ['40%', '50%'],
                            label: {
                                normal:{
                                    show:true,
                                    position:'inner',
                                    textStyle : {
                                        fontWeight: 300 ,
                                        fontSize: 14 
                                    },
                                    formatter:'{d}%'
                                }
                            },
                            data: [
                                {
                                    value: item.evaluation_budgetary_estimates.electricEngineering || 0, 
                                    name: '发电场工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.boosterSubstationProject || 0,  
                                    name: '升压变电站工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.housingConstructionProject || 0, 
                                    name: '房屋建筑工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.trafficEngineering || 0, 
                                    name: '交通工程'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.otherEngineering || 0, 
                                    name: '其他工程'
                                },
                            ]
                        }
                    ]
                }

                let obj4 = {
                    scheme_name: item.scheme_name,
                    tooltip: {
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: '0',
                        top: '25',
                        data: ['项目建设用地费', '项目建设管理费', '生产准备费', '勘察设计费', '其他税费']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: [40, 100],
                            center: ['40%', '50%'],
                            label: {
                                normal:{
                                    show:true,
                                    position:'inner',
                                    textStyle : {
                                        fontWeight: 300 ,
                                        fontSize: 14 
                                    },
                                    formatter:'{d}%'
                                }
                            },
                            data: [
                                {
                                    value: item.evaluation_budgetary_estimates.projectConstructionLandFee || 0, 
                                    name: '项目建设用地费'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.projectConstructionManagementFee || 0, 
                                    name: '项目建设管理费'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.productionPreparationFee || 0, 
                                    name: '生产准备费'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.surveyDesignFee || 0, 
                                    name: '勘察设计费'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.otherTax || 0, 
                                    name: '其他税费'
                                },
                            ]
                        }
                    ]
                }

                let obj5 = {
                    scheme_name: item.scheme_name,
                    tooltip: {
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: '0',
                        top: '25',
                        data: ['单位千瓦静态投资', '单位千瓦动态投资']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: [40, 100],
                            center: ['40%', '50%'],
                            label: {
                                normal:{
                                    show:true,
                                    position:'inner',
                                    textStyle : {
                                        fontWeight: 300 ,
                                        fontSize: 14 
                                    },
                                    formatter:'{d}%'
                                }
                            },
                            data: [
                                {
                                    value: item.evaluation_budgetary_estimates.staticInvestmentPerkW || 0, 
                                    name: '单位千瓦静态投资'
                                },
                                {
                                    value: item.evaluation_budgetary_estimates.dymaticInvestmentPerkW || 0, 
                                    name: '单位千瓦动态投资'
                                },
                            ]
                        }
                    ]
                }
                // 移入图3
                arrName3.push(item.scheme_name +'-'+ (index+1))
                arrData3.push({
                    value: [item.output_rate_rate.lcoe||0, item.output_rate_rate.equivalent_hours||0, item.output_rate_rate.static_total_investment||0],
                    name: item.scheme_name +'-'+ (index+1),
                    // areaStyle:{},
                })
                max1.push(item.output_rate_rate.lcoe||0)
                max2.push(item.output_rate_rate.equivalent_hours||0)
                max3.push(item.output_rate_rate.static_total_investment||0)
                // 移入图2
                arrName2.push(item.scheme_name)
                arrData2.push(item.evaluation_budgetary_estimates.totalProjectInvestment||0)


                this.auxiliaryEchartsList.push(obj)
                this.insatallEchartsList.push(obj2)
                this.buildingEchartsList.push(obj3)
                this.moneyEchartsList.push(obj4)
                this.assetsEchartsList.push(obj5)
            })
            this.hover3EchartOption = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: arrName3,
                    bottom: 0,
                    left: 0
                },
                 grid: {
                    x: 0,
                    x2: 0,
                    y: 0,
                    y2: 0,
                },
                radar: [
                    {
                        indicator: [
                            {text: 'LCOE(元／kwh)'},
                            {text: '单位千瓦投资(万元)'},
                            {text: '等效小时数(h)'}
                        ],
                        radius: 100
                    }
                ],
                series: [
                    {
                        type: 'radar',
                        tooltip: {
                            trigger: 'item'
                        },
                        data: arrData3
                    },
                    
                ]
            }

            this.hover2EchartOption =  {
                legend: {
                    data:['工程总投资'],
                    right: 8
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '15%',
                    right: '14%',
                },
                xAxis: {
                    splitLine:{
                        show:false
                    },
                    type: 'category',
                    name: '方案',
                    nameLocation: 'end',
                    boundaryGap: false,
                    // axisLabel: {  
                    //     interval:0,  
                    //     rotate:40  
                    // },
                    data: arrName2
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '工程总投资(万元)',
                        nameLocation: 'end',
                    },
                    
                ],
                series: [
                    {
                        data: arrData2,
                        name: '工程总投资',
                        type: 'line'
                    }
                ]
            }
            
            console.log(this.hover2EchartOption)
        },
        openEnter (){
            if (!this.allUploadNameInfo.dem_server_path && this.allUploadNameInfo.dom_server_path){
                gwmap.comparisonLayer.enter(false)
            }else{
                gwmap.comparisonLayer.enter(true)
            }
        },
        // 进入提前先获取所有数据,不切换时加载
        getAllAllData (checkedList, callback){
            let checkedIDs = checkedList.map(v=>v.scheme_id)
            // console.log(checkedIDs)
            getContrastEvaluation(this.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    callback(null)
                    this.$message.error(res.message)
                    return
                }
                let gcList = res.data.filter((v)=>v.scheme_name)
                gcList.sort(function(a,b){
                    return b.scheme_id - a.scheme_id
                })
                this.initEchartData(gcList)
                this.evaluationDetail = gcList.map((item, index)=>{
                    return{
                        engineAssistance: item.evaluation_budgetary_estimates.engineAssistance || '-',
                        equipment_install: item.evaluation_budgetary_estimates.equipment_install || '-',
                        constructionInstall: item.evaluation_budgetary_estimates.constructionInstall || '-',
                        otherFee: item.evaluation_budgetary_estimates.otherFee || '-',
                        basicReserveFundsFee: item.evaluation_budgetary_estimates.basicReserveFundsFee || '-',
                        reservePriceDiff: item.evaluation_budgetary_estimates.reservePriceDiff || '-',
                        interestConstruction: item.evaluation_budgetary_estimates.interestConstruction || '-',
                        totalProjectInvestment: item.evaluation_budgetary_estimates.totalProjectInvestment || '-',
                        scheme_name: item.scheme_name,
                        scheme_id: item.scheme_id,
                        checked: checkedIDs.indexOf(item.scheme_id) != -1 ? true : false,
                    }
                })
                
                // console.log(this.evaluationDetail)
                this.economicDetail = gcList.map((item, index)=>{
                    return{
                        capacity: item.output_rate_rate.capacity || '-',
                        equivalent_hours: item.output_rate_rate.equivalent_hours || '-',
                        static_total_investment: item.output_rate_rate.static_total_investment || '-',
                        fan_price: item.output_rate_rate.fan_price || '-',
                        tower_price: item.output_rate_rate.tower_price || '-',
                        basic_price: item.output_rate_rate.basic_price || '-',
                        lcoe: item.output_rate_rate.lcoe || '-',
                        pt: item.output_rate_rate.pt || '-',
                        total_investment_value: item.output_rate_rate.total_investment_value || '-',
                        capital_found_value: item.output_rate_rate.capital_found_value || '-',
                        p_i_r_r: item.output_rate_rate.p_i_r_r || '-',
                        e_i_r_r: item.output_rate_rate.e_i_r_r || '-',
                        scheme_name: item.scheme_name,
                        scheme_id: item.scheme_id,
                        checked: checkedIDs.indexOf(item.scheme_id) != -1 ? true : false,
                    }
                })
                // console.log(this.economicDetail)
                callback('ok')
            }).catch((err)=>{
                callback(null)
            })

            callback('ok')
        },
        changeTab (index){
            
            if (index == 1){
                this.waitingLoading = true
                this.tabIndex = index
                this.waitingLoading = false
                // this.initPowerTableData(this.schemeList.filter((v)=>v.checked), (res)=>{
                //     this.tabIndex = index
                //     this.waitingLoading = false
                // })
            } else if(index == 2){
                this.waitingLoading = true
                this.tabIndex = index
                this.waitingLoading = false
                // this.initEngineeringData(this.schemeList.filter((v)=>v.checked), (res)=>{
                //     this.tabIndex = index
                //     this.waitingLoading = false
                // })
            } else if(index == 3){
                this.waitingLoading = true
                this.tabIndex = index
                this.waitingLoading = false
                // this.initEconomicData(this.schemeList.filter((v)=>v.checked), (res)=>{
                //     this.tabIndex = index
                //     this.waitingLoading = false
                // })
            } 

            this.$refs.power && this.$refs.power.onComeBack()
            this.$refs.engineering && this.$refs.engineering.onComeBack()
        },
       
        // 获取经评表格数据
        initEconomicData (checkedList, callback){
            let checkedIDs = checkedList.map(v=>v.scheme_id)
            // console.log(checkedIDs)
            if (this.economicDetail.length > 0){
                callback(null)
                return
            }
            getContrastEvaluation(this.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    callback(null)
                    this.$message.error(res.message)
                    return
                }
                let gcList = res.data.filter((v)=>v.scheme_name)
                gcList.sort(function(a,b){
                    return b.scheme_id - a.scheme_id
                })
                // this.initEchartData(gcList)
                this.economicDetail = gcList.map((item, index)=>{
                    return{
                        capacity: item.output_rate_rate.capacity || '-',
                        equivalent_hours: item.output_rate_rate.equivalent_hours || '-',
                        static_total_investment: item.output_rate_rate.static_total_investment || '-',
                        fan_price: item.output_rate_rate.fan_price || '-',
                        tower_price: item.output_rate_rate.tower_price || '-',
                        basic_price: item.output_rate_rate.basic_price || '-',
                        lcoe: item.output_rate_rate.lcoe || '-',
                        pt: item.output_rate_rate.pt || '-',
                        total_investment_value: item.output_rate_rate.total_investment_value || '-',
                        capital_found_value: item.output_rate_rate.capital_found_value || '-',
                        p_i_r_r: item.output_rate_rate.p_i_r_r || '-',
                        e_i_r_r: item.output_rate_rate.e_i_r_r || '-',
                        scheme_name: item.scheme_name,
                        scheme_id: item.scheme_id,
                        checked: checkedIDs.indexOf(item.scheme_id) != -1 ? true : false,
                    }
                })
                
                // console.log(this.economicDetail)
                callback(checkedList)
            }).catch((err)=>{
                callback(null)
            })
        },
        // 获取工程表格数据
        initEngineeringData (checkedList, callback){
            let checkedIDs = checkedList.map(v=>v.scheme_id)
            // console.log(checkedIDs)
            if (this.evaluationDetail.length > 0){
                callback(null)
                return
            }
            getContrastEvaluation(this.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    callback(null)
                    this.$message.error(res.message)
                    return
                }
                let gcList = res.data.filter((v)=>v.scheme_name)
                gcList.sort(function(a,b){
                    return b.scheme_id - a.scheme_id
                })
                this.initEchartData(gcList)
                this.evaluationDetail = gcList.map((item, index)=>{
                    return{
                        engineAssistance: item.evaluation_budgetary_estimates.engineAssistance || '-',
                        equipment_install: item.evaluation_budgetary_estimates.equipment_install || '-',
                        constructionInstall: item.evaluation_budgetary_estimates.constructionInstall || '-',
                        otherFee: item.evaluation_budgetary_estimates.otherFee || '-',
                        basicReserveFundsFee: item.evaluation_budgetary_estimates.basicReserveFundsFee || '-',
                        reservePriceDiff: item.evaluation_budgetary_estimates.reservePriceDiff || '-',
                        interestConstruction: item.evaluation_budgetary_estimates.interestConstruction || '-',
                        totalProjectInvestment: item.evaluation_budgetary_estimates.totalProjectInvestment || '-',
                        scheme_name: item.scheme_name,
                        scheme_id: item.scheme_id,
                        checked: checkedIDs.indexOf(item.scheme_id) != -1 ? true : false,
                    }
                })
               
                // console.log(this.evaluationDetail)
                callback(checkedList)
            }).catch((err)=>{
                callback(null)
            })
        },
        // 获取发电量表格数据
        initPowerTableData (checkedList, callback){
            let checkedIDs = checkedList.map(v=>v.scheme_id)
            // console.log(checkedIDs)
            if (this.schemeListDetail.length > 0){
                callback(null)
                return
            }
            getAllSchemeDetails(this.projectInfo.project_id).then((res=>{
                if(res.code != 200){
                    callback(null)
                    this.$message.error(res.message)
                    return
                }
                this.schemeListDetail = res.data.filter((v)=>v.scheme_name)
                this.schemeListDetail = this.schemeListDetail.map((item, index)=>{
                    if(checkedIDs.indexOf(item.scheme_id) != -1){
                        item.checked = true
                    }else{
                        item.checked = false
                    }
                    return item
                })
                this.schemeListDetail.sort(function(a,b){
                    return b.scheme_id - a.scheme_id
                })

                this.getHoverEchartData1(this.schemeListDetail)
                // console.log(this.schemeListDetail)
                callback(checkedList)
            })).catch((err)=>{
                callback(null)
            })
        },
        // 不勾选，清楚存储的值
        removeUrlColor (obj){
            this.addUrlColor = this.addUrlColor.filter((item)=>item.scheme_id != obj.scheme_id)
        },
        changeCheckedBox (obj){
            console.log(obj.scheme_id)
            console.log(this.addUrlColor)
            if (this.addUrlColor.length <= 0){
                this.changeTurbineScheme(obj.scheme_id, false)
            }else{
                this.changeTurbineScheme(obj.scheme_id, true)
            }
        },
        // 勾选获取点位数据
        changeTurbineScheme (scheme_id, type){
            console.log(scheme_id)
            this.waitingMinute = true
            getTurbine_scheme({
                project_id: this.projectInfo.project_id,
                scheme_id: scheme_id
            }).then((res)=>{
                this.waitingMinute = false
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                let schemeData = res.data.map((v)=>{
                    let obj = {
                        id: v.turbine_id,
                        name: v.turbine_name,
                        point: [v.longitude, v.latitude, 100]
                    }
                    return obj
                })
                if (!type){
                    gwmap.comparisonLayer.addScheme(true, {
                        scheme_id: scheme_id,
                        imgUrl: this.imgUrl[0],
                        color: this.color[0]
                    }, schemeData)
                    this.addUrlColor.push({
                        scheme_id: scheme_id,
                        imgUrl: this.imgUrl[0],
                        color: this.color[0]
                    })
                }else{
                    gwmap.comparisonLayer.addScheme(true, {
                        scheme_id: scheme_id,
                        imgUrl: this.addUrlColor[0].color == '#00ff00' ? '/images/purple.png' : '/images/green.png',
                        color: this.addUrlColor[0].color == '#00ff00' ? '#ff00ff' : '#00ff00'
                    }, schemeData)
                    this.addUrlColor.push({
                        scheme_id: scheme_id,
                        imgUrl: this.addUrlColor[0].color == '#00ff00' ? '/images/purple.png' : '/images/green.png',
                        color: this.addUrlColor[0].color == '#00ff00' ? '#ff00ff' : '#00ff00'
                    })
                }

            }).catch((err)=>{
                this.waitingMinute = false
            })

        },
        // 初始化获取点位列表
        initTurbineScheme (checkedList){
            console.log(checkedList)
            if (checkedList.length <= 0) return;
            this.waitingMinute = true
            checkedList.forEach((item, index)=>{
                // 获取点位列表
                getTurbine_scheme({
                    project_id: this.projectInfo.project_id,
                    scheme_id: item.scheme_id
                }).then((res)=>{
                    this.waitingMinute = false
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    let schemeData = res.data.map((v)=>{
                        let obj = {
                            id: v.turbine_id,
                            name: v.turbine_name,
                            point: [v.longitude, v.latitude, 100]
                        }
                        return obj
                    })
                    gwmap.comparisonLayer.addScheme(true, {
                        scheme_id: item.scheme_id,
                        imgUrl: this.imgUrl[index],
                        color: this.color[index]

                    }, schemeData)
                    this.addUrlColor.push({
                        scheme_id: item.scheme_id,
                        imgUrl: this.imgUrl[index],
                        color: this.color[index]
                    })
                }).catch((err)=>{
                    this.waitingMinute = false
                })
                
            })
        },
        onClose (){
            this.$store.commit('openComparison', false)
        }
    }
}
</script>

<style lang="scss" scoped>
.scheme-comparison{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    background: #fff;
    border-radius: 0.22rem 0.22rem 0 0;
    color: #333;
    padding-bottom: 16px;
    &.ppt-edit{
        left: 2.5rem;
        width: calc(100% - 2.5rem);
    }
    .title{
        display: flex;
        align-items: center;
        position: relative;
        height: 0.45rem;
        background: #EBF2E4;
        border-radius: 0.22rem;
        .iconfont{
            margin-right: 2px;
        }
        &>div{
            width: 1.2rem;
            height: 0.34rem;
            line-height: 0.34rem;
            text-align: center;
            border-radius: 0.17rem;
            margin-left: 0.1rem;
            cursor: pointer;
        }
        &>div:not(.close):hover{
            background:rgba(255,255,255, 0.7);
        }
        .active{
            background:rgba(255,255,255,1);
            color: #2CD0B9;
        }
        .close{
            width: 0.4rem;
            height: 0.4rem;
            line-height: 0.4rem;
            position: absolute;
            right: 0.1rem;
            top: 0;
            cursor: pointer;
        }
        .close:hover .iconfont{
            font-weight: bold;
        }
        .minMax{
            width: 0.4rem;
            height: 0.4rem;
            line-height: 0.4rem;
            position: absolute;
            right: 0.6rem;
            top: 0;
            background: none;
            .iconfont{
                font-size: 0.17rem;
            }
        }
        .minMax:hover{
            background: none !important;
            .iconfont{
                font-weight: bold;
            }
        }
    }
    .content{
        overflow: auto;
    }
}
</style>