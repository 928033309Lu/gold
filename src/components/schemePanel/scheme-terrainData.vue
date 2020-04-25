<template>
    <div class="scheme-terrainData">
        <div class="title"> <div class="line"></div> <span>地理数据</span> </div>
        <div v-if="noData" style="text-align: center;">暂无数据</div>
        <div class="content" v-for="(item, index) of terrainDatafix" :key="'t'+index" >
            <label v-show="item.isShow" class="my_checkbox_box">
                <input type="checkbox" :id="index+'vv'"
                :checked="item.checked"
                @change="changeCheckboxEvent($event, item)">  </input>
                <span class="my_checkbox_label">{{$t('m.' + item.fileName_astrict)}} </span>
            </label>

                <!-- 道路湖泊等等限制因素 -->
                <div v-show="item.checked && item.fileName_astrict == 'factorData'">
                    <!-- 道路湖泊房屋 -->
                    <div v-for="(item2, index2) of factorList" :key="'p'+index2" class="children" >
                        <label v-show="item2.isShow" class="my_checkbox_box my_checkbox_box_left">
                            <input type="checkbox" :id="index+'ff'"
                            :checked="item2.checked"
                            @change="changeCheckboxGisEvent($event, item2)"></input>
                            <span class="my_checkbox_label">{{$t('m.' + item2.fileName_astrict)}}</span>
                        </label>
                    </div>
                    <!-- 自定义 -->
                    <div v-for="(item4, index4) of customFactorData" :key="'y'+index4" class="children" >
                        <label v-show="item4.fileName_astrict_new" class="my_checkbox_box my_checkbox_box_left">
                            <input type="checkbox" :id="index+'p'"
                            :checked="item4.checked"
                            @change="changeCheckboxGis2Event($event, item4)"></input>
                            <span class="my_checkbox_label">{{item4.fileName_astrict_new}} </span>
                        </label>

                    </div>
                </div>
                <!-- 等高线 -->
                <div v-show="item.checked && item.fileName_astrict == 'windisoheight'">
                    <div v-for="(item3, index3) of isoheightData" :key="'b'+index3" class="children" >
                        <label class="my_checkbox_box my_checkbox_box_left">
                            <input type="checkbox" :id="index+'gg'"
                            :checked="item3.checked"
                            @change="changeCheckboxHeightEvent($event, item3)"></input>
                            <span class="my_checkbox_label">{{item3.label}} m</span>
                        </label>
                    </div>
                </div>
        </div>
        <!-- 废弃 -->
        <!-- <component v-if="componentIsoheight" :is="'wind-'+ componentIsoheight" :componentScheme.sync="componentIsoheight"></component>
        <component v-if="componentFactor" :is="'wind-'+ componentFactor" :componentFactor.sync="componentFactor"></component>  -->
    </div>
</template>
<script>
import envConfig from '@/config/env-config.js'
import { getProjectDetails, terrainStatus, getAllUploadName } from "@/api/server.request.js"
import { mapState } from "vuex"
export default {
    name: 'schemeTerrainDataPanel',
    components:{
        'wind-isoheight': () => import('./wind-isoheight.vue'),
        'wind-factor': () => import('./wind-factor.vue')
    },
    props:{
       
    },
    data (){
        return{
            terrainDatafix:[],
            componentIsoheight: null,
            componentFactor: null,
            isoheightData: [],
            factorList: [],
            customFactorData: [],
            waitingMinute: false,
            noData: true,
            isHeight_radio: ''
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            schemeMemu: state => state.projectUpload.schemeMemu,
            // allUploadNameInfo: state => state.projectUpload.allUploadNameInfo,
            openWindisoheight: state => state.projectUpload.openWindisoheight,
            openWindFactor: state => state.projectUpload.openWindFactor,
            windisoheightData: state => state.projectUpload.windisoheightData,
            factorData: state => state.projectUpload.factorData,
            customData: state => state.projectUpload.customFactorData,
            pptModel: state => state.app.pptModel,
        })

    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.getLoading')});
        },
        schemeMemu:{
            handler(val, oldVal){
               this.terrainDatafix = val[1].fixationChildren
            },
            deep:true
        },
        terrainDatafix:{
            handler(val, oldVal){
                this.noData = val.every((item, index)=>!item.isShow)
                if(!val[2].checked){
                    this.removeFactor()
                }
            },
            deep:true
        },
        openWindisoheight(val){
            console.log("openWindisoheight", val)
            // if(val){
            //     this.componentIsoheight = 'isoheight'
            // }else{
            //     this.componentIsoheight = null
            // }
            if(val){
                this.initWindisoheight()
            }
            else{
                this.removeWindisoheight()
            }
        },
        openWindFactor(val){
            console.log("openWindFactor", val)
            // if(val){
            //     this.componentFactor = 'factor'
            // }else{
            //     this.componentFactor = null
            // }
            if(val){
                this.initfactor()
            }
            else{
                this.removeFactor()
            }
        },
        //  限制性的道路，湖泊，房屋
        factorData (val) {
            console.log("factorData", val)
            if (val) {
              this.initfactor2()
            }
        },
        // 自定义限制性因素
        customData:{
            handler(val, oldVal){
                console.log(val,"00000")
                if(val.length > 0){
                    this.initfactor2()
                }
            },
            deep:true
        },
        
    },
    mounted (){
        this.initfactor()
        this.getTerrainStatus()

    },
    beforeDestroy (){
        
        gwmap.fieldLayer.remove()
        gwmap.scoutingLayer.remove()
 
        this.terrainDatafix.forEach((item, index)=>{
            item.checked = false
            // console.log(item)
        })
        this.removeFactor()
        this.removeWindisoheight()
        this.$store.commit('openWindFactor', false)
        this.$store.commit('openWindisoheight', false)
       
    },
    methods:{
        initfactor (){
            this.factorList = this.factorData
            // console.log(this.factorList)
            this.customFactorData = this.customData // 自定义限制性因素
            console.log(this.customFactorData)
            if (this.pptModel) {
              this.factorData.map(v => {
                this.changeCheckboxGisEvent(null, v)
              })
            }
        },
        initfactor2 (){
            this.factorList = this.factorData
            this.customFactorData = []
            this.customFactorData = this.customData
            this.customFactorData.forEach((item, index)=>{
                if(item.checked){
                    gwmap.astrictLayer.load(item)
                }
            })
        },
        removeFactor (){
            this.customFactorData.forEach((item, index) =>{
                item.checked = false
                // console.log(item.id)
                if (item.id){
                    gwmap.astrictLayer.remove(item)
                }
            })
            this.customFactorData = []
            this.factorList.forEach((item, index)=>{
                item.checked = false
                // console.log(item)
                if(item.fileName_astrict == 'windLine'){
                    gwmap.removeGisMap(item, 'road')
                }
                if(item.fileName_astrict == 'windHouse'){
                    gwmap.removeGisMap(item, 'building')
                }
                if(item.fileName_astrict == 'windLakes'){
                    gwmap.removeGisMap(item, 'water')
                }
            })
        },
        initWindisoheight (){
            this.isoheightData = []
            let data = this.windisoheightData.layers.split(',')
            for(let i in data ){
                this.isoheightData.push({
                    checked: false,
                    name: data[i],
                    label: data[i].replace(/[^0-9]/ig,""),
                    url: this.windisoheightData.url.contour,
                    subdomains: this.windisoheightData.url.subdomains
                })
            }
        },
        removeWindisoheight (){
            this.isHeight_radio = ''
            this.isoheightData.forEach((item, index)=>{
                if(item.feature){
                    item.checked = false
                    gwmap.removeGisHeightLine(item)
                }
            })
        },
        getTerrainStatus (){
            // this.waitingMinute = true
            let p1 = new Promise((resolve, reject) => {
                terrainStatus(this.projectInfo.project_id).then((res)=>{
                    if (res.code != 200){
                        reject(res.message)
                        return
                    }
                    let resData = res.data
                    // 父级限制因素 下的道路湖泊房屋开关
                    this.$store.commit('setSchemeMemu', {
                        type: 'astrict_init',
                        open: resData[3].status == 2 ? true :false
                    })
                    // 父级等高线开关
                    this.$store.commit('setSchemeMemu', {
                        type: 'height_init',
                        open: resData[2].status == 2 ? true :false
                    })
                    resolve('ok')
                })
            })
            let p2 = new Promise((resolve, reject) => {
                getAllUploadName (this.projectInfo.project_id).then((res)=>{
                    if (res.code != 200){
                        reject(res.message)
                        return
                    }
                    let fileName_wind = res.data.user_redline_data
                    let fileName_walk = res.data.user_scouting_data
                    // 风场范围
                    this.$store.commit('setSchemeMemu', {
                        type: 'field_init',
                        open: fileName_wind ? true :false
                    })
                    // 踏勘
                    this.$store.commit('setSchemeMemu', {
                        type: 'scouting_init',
                        open: fileName_walk ? true :false
                    })
                    resolve('ok')
                })
            })
            Promise.all([p1, p2]).then((res)=>{
                this.terrainDatafix = this.schemeMemu[1].fixationChildren
                this.waitingMinute = false
            }).catch((err)=>{
                this.$message.error('获取数据失败')
                this.waitingMinute = false
            })
        },
        // 风场/踏勘/限制性/等高线change
        changeCheckboxEvent (ev, item){
            item.checked = ev.target.checked
            console.log(ev.target.checked, item)

            ev && this.$store.commit('setSchemeMemu', {
                type: 'terrainDataCheck',
                data: this.schemeMemu[1].fixationChildren
            })
            if (item.fileName_astrict == 'windField'){
                if (item.checked){
                    this.loadWindKmzData('redline.kmz')
                } else{
                    gwmap.fieldLayer.remove()
                }
            }
            // 踏勘
            else if (item.fileName_astrict == 'windScouting'){
                if (item.checked){
                    this.loadScoutingKmzData('scouting.kmz')
                } else{
                    gwmap.scoutingLayer.remove()
                }
            }
            
            // 限制因素 new
            else if (item.fileName_astrict == 'factorData'){
                if (item.checked){
                    this.$store.commit('openWindFactor', true)
                } else{
                    this.$store.commit('openWindFactor', false)
                }
                
            }
            // 等高线
            else if (item.fileName_astrict == 'windisoheight'){
                if (item.checked){
                    this.$store.commit('openWindisoheight', true)
                } else{
                    this.$store.commit('openWindisoheight', false)
                }
            }
            
        },
        // 道路/房屋/湖泊change
        changeCheckboxGisEvent (ev, item){
            ev && (item.checked = ev.target.checked)
            // console.log(ev.target.checked, item)
            // 道路
            if (item.fileName_astrict == 'windLine'){
              console.log(item)
              if (item.checked){
                    gwmap.loadGisMap(item, 'road')
                }else{
                    gwmap.removeGisMap(item, 'road')
                }
            }
            // 房屋
            else if (item.fileName_astrict == 'windHouse'){
                if (item.checked){
                    gwmap.loadGisMap(item, 'building')
                }else{
                    gwmap.removeGisMap(item, 'building')
                }
            }
            // 湖泊
            else if (item.fileName_astrict == 'windLakes'){
                if (item.checked){
                    gwmap.loadGisMap(item, 'water')
                }else{
                    gwmap.removeGisMap(item, 'water')
                }
            }
        },
        // 原生
        changeCheckboxGis2Event (ev, item){
            item.checked = ev.target.checked
            console.log(ev.target.checked, item)
            // 限制因素
            if (item.checked){
                gwmap.astrictLayer.load(item)
            }else{
                gwmap.astrictLayer.remove(item)
            }
        },
        // 原生  改单选
        changeCheckboxHeightEvent (ev, item){
            this.isoheightData = this.isoheightData.map((v,m)=>{
                v.checked = false
                gwmap.removeGisHeightLine(v)
                return v
            })
            item.checked = ev.target.checked
            console.log(ev.target.checked, item)
            if(item.checked){
                gwmap.loadGisHeightLine(item)
            }else{
                gwmap.removeGisHeightLine(item)
            }
        },
        loadWindKmzData (fileName){
            let url = envConfig.S3Path + '/' + this.projectInfo.project_id + '/UAV/input/' + fileName
            gwmap.fieldLayer.load(url)
        },
        loadScoutingKmzData (fileName){
            let url = envConfig.S3Path + '/' + this.projectInfo.project_id + '/UAV/input/' + fileName
            gwmap.scoutingLayer.load(url)
        },
       
    }
}
</script>
<style lang="scss" scoped>
.scheme-terrainData{
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    z-index: 99;
    background:rgba(255,255,255,1);
    box-shadow: 0px 0px 7px 0px rgba(9,38,40,0.4);
    border-radius: 0.13rem;
    padding: 0.15rem 0 0.15rem 0;
    min-width: 1rem;
    /deep/ .el-checkbox{
        // margin: 0 0 0 0.1rem;
        width: 100%;
        padding: 0 0.2rem;
        color: #333333;
    }
    /deep/ .el-checkbox__label{
        padding-left: 0;
    }
    .content{
        // padding: 0 0.15rem 0 0.1rem;
        line-height: 0.33rem;
    }
    /deep/ .el-checkbox:hover{
        background:rgba(226,245,242,1);
    }
    /deep/ .children .el-checkbox .el-checkbox__input{
        margin-left: 0.2rem;
    }
    .title{
        display: flex;
        align-items: center;
        height: 0.35rem;
        margin-bottom: 0.1rem;
        .line{
            width: 0.07rem;
            height: 0.2rem;
            background:rgba(44,208,185,1);
            margin-right: 0.05rem;
        }
        span{
            font-weight: bold;
            color: #6D7D41;
        }
    }
}

</style>