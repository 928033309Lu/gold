<template>
<div class="project-panel" :class="{comparisonActive: comparison}">
    <!-- <div class="project-view" v-if="!projectUpload" ref="projectView">
        <div class="uploadView" @click="changeModel(true)"> {{$t('m.datas')}}> </div>
        <div class="content">
            <scheme-memu></scheme-memu>
        </div>
    </div> -->
    <!-- <div class="project-upload" v-if="projectUpload" ref="projectViewUpload"> -->
    <div class="project-upload" :class="!projectUpload ? 'project-view' : '' ">
        <div v-if="!projectUpload" class="uploadView" @click="changeModel(true)"> {{$t('m.datas')}}> </div>

        <div class="header" v-if="projectUpload">
            <div>{{$t('m.readyDatas')}}
                <el-tooltip class="item" effect="light" :content="$t('m.setDatas')" placement="right">
                    <span v-if="!openEpsg" class="setDat" @click="openSetData"><i class="iconfont icon-shezhi1"></i></span>
                    <span v-if="openEpsg" class="setDat closeEpsg" @click="closeSetData"><i class="iconfont icon-shezhi1"></i></span>
                </el-tooltip>
            </div>
            <div class="closeUpload">
                <div @click="changeModel(false)"><i class="iconfont icon-zuixiaohua"></i></div>
                <div @click="goProjectList"><i class="iconfont icon-close"></i></div>
            </div>
        </div>
        <!-- 设置界面 -->
        <upload-setParam v-if="projectUpload" ref="serParam" @onSetEpsg="isExistEpsg = true"></upload-setParam>
        <!-- tab页卡 -->
        <ul class="upload-tab" v-show="projectUpload">
            <li v-for="(item, index) of tabTitle" :key="index" :style="item.style" @click="changeTab(index)">
                <el-tooltip class="item" effect="light" :content="$t('m.'+ item.label)" placement="top">
                <div>
                    <span :class="item.show ? 'rotateActive' : '' "><i :class="item.icon"></i> </span>
                    <div class="imgBox" :class="!item.show ? 'imgShow' : '' "><img :src="item.imgUrl" alt="" /></div>
                    <div class="circle" :class="item.status !=2 ? item.status ==3 ? '' : 'circleStatus1' : 'circleStatus2'"></div>
                    
                </div>
                </el-tooltip>
            </li>
            <div class="tab-title">
                <div class="ellipsis">
                    <div class="border-right"><span></span></div>
                    {{tabLabel}}
                </div>
            </div>
        </ul>

        <div class="content">
            <scheme-memu @changeModel="changeModel"></scheme-memu>
            <!-- <div style="width: 0.6rem;"></div> -->

            <div v-if="projectUpload" class="project-upload-content" style="background: #fff;display: flex;margin: 0.1rem 0;border-radius: 0.13rem;">
                <div class="tabContent" :style="{marginBottom: (statusHeight+0.1) + 'rem'}">
                    <component v-if="componentScheme" :isExistEpsg="isExistEpsg" :is="'upload-'+ componentScheme" :componentScheme.sync="componentScheme"></component>
                </div>
                <div class="footer" :style="{height: statusHeight + 'rem'}">
                    <div v-for="(item, index) of tabTitle" :key="index">
                        <div class="title" v-if="item.show" :class="item.schemeName ? 'fanSchemeName' : ''" @click="statusHeight == 2.7 ? statusHeight = 0.7 : statusHeight = 2.7">
                            <i class="iconfont icon-gongchengjindu"></i>
                            <el-tooltip class="item" effect="light" :disabled="!item.schemeName ? true : false" :content="item.schemeName + $t('m.'+ item.labelPlan)" placement="top">
                                <span class="span ellipsis"> {{item.schemeName}} {{$t('m.'+ item.labelPlan)}} </span>
                            </el-tooltip>
                        </div>
                        <div class="content" v-if="item.show">
                            <upload-status :type="item.panel"></upload-status>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
    </div>
</div>
</template>
<script>
import envConfig from '@/config/env-config.js'
import { mapState } from "vuex";
import schemeMemu from './component/scheme-memu.vue'
import uploadStatus from './component/upload-status.vue'
import uploadSetParam from './component/upload-setParam.vue'
import { schemeStatus, getTurbine_scheme, getSchemeList, getEpsgList, getProjectEpsg, getAllUploadName, getMastList, getMastCsv, allStatus, getCfdInfo, cfdStatus } from "@/api/server.request.js"
export default {
    name: 'project-view',
    components:{
        schemeMemu,
        uploadStatus,
        uploadSetParam,
        'upload-terrain': () => import('./component/upload-terrain.vue'),
        'upload-mast': () => import('./component/upload-mast.vue'),
        'upload-cfd': () => import('./component/upload-cfd.vue'),
        'upload-fan': () => import('./component/upload-fan.vue')
    },
    data (){
        return{
            
            waitingMinute: false,
            mast_list_info: false,
            mast_file_csv: false,
            astrict_Data:[],
            fileName_terrain: true,
            fileName_wind: true,
            isExistEpsg: false, // 是否有epsg
            projectUpload: false,
            componentScheme: null, // tab内容
            statusHeight: 2.7,
            openEpsg: false
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            scheme_id: state => state.app.scheme_id,
            tabTitle: state => state.projectUpload.tabTitle,
            uploadScheme_id: state => state.app.scheme_id,
            allUploadNameInfo: state => state.projectUpload.allUploadNameInfo,
            comparison: state => state.app.comparison,
            projectUnfold: state => state.projectUpload.projectUnfold
        }),
        tabLabel (){
            let tabLabel =  this.tabTitle.filter((item, index) => item.show)
            if (tabLabel.length > 0){
                return this.$t('m.'+ tabLabel[0].label)
            } else {
                return null
            }
        }
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.getLoading')});
        },
        allUploadNameInfo:{
            handler(val, oldVal){
                if(!val) return;
                this.initallUploadNameInfo(val)
            },
            deep:true
        },
        projectInfo (val){
            // console.log(val)
            if (val){
                this.init() // 初始化接口显示图标
                this.changeModel(true)
            }
        },
        projectUnfold (val) {
            this.projectUpload = val
        },
        tabTitle: {
          handler () {
            let tabArr = this.tabTitle.filter(item => item.show)
            if (tabArr.length > 0) {
              this.componentScheme = tabArr[0].panel
            } else {
              this.componentScheme = null
            }
          },
          deep: true
        }
    },
    created() {
        this.$store.commit('initSchemeMemu')
    },
    mounted(){
        this.projectUpload = this.projectUnfold
        this.changeTab(0)
        
    },
    beforeDestroy(){
        gwmap.wtLayer.remove()
        this.$store.dispatch('clearScheme_id')
    },
    methods:{
        getAllStatus (){
            
            allStatus(this.projectInfo.project_id).then((res)=>{
                if(res.code == 200){
                    var terrainErr, terrainSuccess, mastErr, mastSuccess, cfdErr, cfdSuccess;
                    let terrainArr = res.data.filter((item, index)=>{
                        return item.step_name == "map_info" || item.step_name == "contour" || item.step_name == "limiting_factor"
                    })
                    terrainErr = terrainArr.some((item, index)=>{
                        return item.status == 3
                    })
                    terrainSuccess = terrainArr.some((item, index)=>{
                        return item.status == 2
                    })
                    let mastStatusInfo = res.data.filter((item, index) => {
                        return item.step_name == 'wind_info' && item.mast_task || item.step_name == 'mast_confidence'
                    })
                    mastErr = mastStatusInfo.some((item, index)=>{
                        return (item.step_name == "wind_info" && item.step_name == "mast_confidence" && item.status == 3)
                    })
                    mastSuccess = mastStatusInfo.some((item, index)=>{
                        return (item.step_name == "wind_info" && item.step_name == "mast_confidence" && item.status == 2)
                    })
                    // console.log(mastErr, mastSuccess)
                    cfdErr = res.data.some((item, index)=>{
                        return (item.step_name == "wrg2vtk" && item.wrg_height && item.status == 3)
                    })
                    cfdSuccess = res.data.some((item, index)=>{
                        return (item.step_name == "wrg2vtk" && item.wrg_height && item.status == 2)
                    })
                    
                    var terrain_status = '1'
                    if (terrainErr) {
                        terrain_status = '3'
                    } else if (terrainSuccess && !terrainErr) {
                        terrain_status = '2'
                    } else {
                        terrain_status = '1'
                    }
                    var mast_status = '1'
                    if (mastErr) {
                        mast_status = '3'
                    } else if (mastSuccess && !mastErr) {
                        mast_status = '2'
                    } else {
                        mast_status = '1'
                    }
                    var cfd_status = '1'
                    if (cfdErr) {
                        cfd_status = '3'
                    } else if (cfdSuccess && !cfdErr) {
                        cfd_status = '2'
                    } else {
                        cfd_status = '1'
                    }
                    this.$store.commit('setTabStatus', [
                        {
                            type: 'terrain',
                            status: terrain_status
                        },
                        {
                            type: 'mast',
                            status: mast_status
                        },
                        {
                            type: 'cfd',
                            status: cfd_status
                        }
                    ])
                }
            })

            
        },
        // 初始化地形数据
        initAllUploadName (){
            if(!this.projectInfo) return;
            getAllUploadName (this.projectInfo.project_id).then((res)=>{
                if (res.code != 200){
                    return
                }
                this.$store.commit('allUploadNameInfo', res.data)
            })
        },
        // 初始化地形数据
        initallUploadNameInfo (val){
            // console.log(val)
            this.fileName_terrain = val.map_data
            this.fileName_wind = val.redline_data
            this.fileName_walk = val.scouting_data
            if (this.fileName_terrain){
                this.$store.commit('setSchemeMemu', {
                    type: 'terrain',
                    data: null
                })
            }
            if (this.fileName_wind){
                this.$store.commit('setSchemeMemu', {
                    type: 'field',
                    data: null
                })
            }
            if (this.fileName_walk){
                this.$store.commit('setSchemeMemu', {
                    type: 'scouting',
                    data: null
                })
            }
            
            if (val.restriction_url){
                this.$store.commit('setSchemeMemu', {
                    type: 'terrainFix',
                    data: val.restriction_url
                })
            }else{
                this.$store.commit('setSchemeMemu', {
                    type: 'removeterrainFix'
                })
            }

            if (val.contour_server_path){
                this.$store.commit('setSchemeMemu', {
                    type: 'terrainHeight',
                    data: val.contour_server_path
                })
            }

            var result = []
            if(val.user_factor_data){
                var arr = eval(val.user_factor_data)
                result = arr.map((item,i) => ({
                    item, name: val.factor_data[i]
                }))
                
            }else{
                this.$store.commit('setSchemeMemu', {
                    type: 'removeAstrict',
                })
            }
            if(result && result.length >0 && val.factor_data.length >0){
                
                this.astrict_Data = result.map((item, index)=>{
                    return {
                        fileName_astrict_new: item.item,
                        fileName_astrict: item.name,
                        uploading_name: null,
                        astrict_uploading: true,
                        astrict_progress_width: 0,
                        isShow: true,
                        opacityShow: false,
                        url: envConfig.S3Path + '/' + this.projectInfo.project_id + '/UAV/input/factor/' + item.name
                    }
                })
                var filterArr = []
                var max;
                this.astrict_Data.forEach((item, index, list)=>{
                    if(item.fileName_astrict){
                        let arr = item.fileName_astrict.split('_')
                        let number = arr[arr.length-1].split('.')[0]
                        filterArr.push(number)
                        max = Math.max.apply(null, filterArr);
                    }
                })
                if(max != this.astrict_Data.length && max >0){
                    let num = max - this.astrict_Data.length
                    for(let i=0; i< num; i++){
                        this.astrict_Data.unshift({
                            fileName_astrict_new: '',
                            fileName_astrict: '',
                            uploading_name: null,
                            astrict_uploading: false,
                            astrict_progress_width: 0,
                            isShow: false,
                            opacityShow: true
                        })
                    }
                }
                this.$store.commit('setSchemeMemu', {
                    type: 'astrict',
                    data: this.astrict_Data
                })
                
            }
        },
        init (){
            if(!this.projectInfo) {
                return;
            };
            this.waitingMinute = true

            let that = this
            this.getAllStatus()
            // 初始化epsg
            let p1 = new Promise((resolve, reject) => {
                getProjectEpsg (that.projectInfo.project_id).then((res)=>{
                    if(res.code == 404){
                        this.isExistEpsg = false
                        this.openEpsg = true
                        this.$refs.serParam.open('noneGet', this.openEpsg);
                    }
                    if(res.code == 200){
                        this.isExistEpsg = true
                        let arr = []
                        this.$store.commit('setEpsgId', res.data.epsg_src_info.epsg_id)
                        if(res.data.epsg_src_info.zone){
                            arr = [res.data.epsg_src_info.pcs, res.data.epsg_src_info.latitude_zone, res.data.epsg_src_info.zone]
                        } else if (!res.data.epsg_src_info.zone && res.data.epsg_src_info.latitude_zone){
                            arr = [res.data.epsg_src_info.pcs, res.data.epsg_src_info.latitude_zone]
                        } else if (!res.data.epsg_src_info.zone && !res.data.epsg_src_info.latitude_zone){
                            arr = [res.data.epsg_src_info.pcs]
                        } else if (!res.data.epsg_src_info.pcs){
                            arr = []
                        }
                        if(arr.length >0){
                            this.verification(arr)
                        }
                    }
                    resolve('ok')
                })
            })

            Promise.all([p1]).then((res)=>{
                // 初始化测风数据
                this.getMastInfoList()
                // 初始化cfd数据
                this.getCfdInfoList()
                // 初始化方案数据，有数据就显示图标
                this.getFanInfoList((res)=>{
                    this.waitingMinute = false
                })
            }).catch((err)=>{
                this.waitingMinute = false
            })

        },
        getFanInfoList (callback){
            getSchemeList(this.projectInfo.project_id).then((res)=>{
                callback('ok')
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                // 后端只过滤这个接口，比选等其他列表那边没有过滤，自己过滤
                // var dataList = res.data.filter((item, index) => {
                //     return item.scheme_name
                // })
                var dataList = res.data
                this.$store.commit('setSchemeList', dataList)
                if(dataList.length >0){
                    let schemeID = this.$route.query.scheme_id
                    if (!schemeID){
                        this.$store.commit('setScheme_id', dataList[0].scheme_id)
                    }
                    // tab页圆点状态
                    var errfan = dataList.some((item, index) => {
                        return item.status_id == 3
                    })
                    var successfan = dataList.some((item, index) => {
                        return item.status_id == 2
                    })
                    console.log(successfan, errfan)
                    this.$store.commit('setTabStatusFan', {
                        status: !successfan ? errfan ? '3' : '1' : '2'
                    })

                    this.$store.commit('setSchemeMemu',{
                        type: 'planArrangement'
                    })
                    this.$store.commit('setSchemeMemu',{
                        type: 'anemometerTower'
                    })
                    // this.$store.commit('setSchemeMemu',{
                    //     type: 'basedRoad'
                    // })
                    // this.$store.commit('setSchemeMemu',{
                    //     type: 'boosterStation'
                    // })
                    // this.$store.commit('setSchemeMemu',{
                    //     type: 'currentLine'
                    // })
                    // this.$store.commit('setSchemeMemu',{
                    //     type: 'pinggu'
                    // })
                    
                    // 有方案默认跳转方案页
                    this.changeTab(3)
                }else{
                    console.log(1111)
                    this.$store.commit('setTabStatusFan', {
                        status: '1'
                    })
                }

            })
        },
        getSchemeFanList (){
            // getTurbine_scheme({
            //     project_id: this.projectInfo.project_id,
            //     scheme_id: this.uploadScheme_id
            // }).then((res)=>{
            //     if(res.code != 200){
            //         this.$store.commit('setTurbineScheme', [])
            //         this.$message.error(res.message)
            //         return
            //     }
            //     this.$store.commit('setTurbineScheme', res.data)
            //     gwmap.wtLayer.loadWt(res.data)
            // })
        },
        getMastInfoList (){
            // getMastCsv(this.projectInfo.project_id).then((res)=>{
            //     if(res.code == 200){
            //         this.mast_file_csv = res.data.merra2_file_name
            //     }
            //     this.windSetSchemeMemu('csv')
            // })
            getMastList(this.projectInfo.project_id).then((res)=>{
                if(res.code == 200){
                    if (res.data && res.data.length > 0){
                        this.mast_list_info = true
                    }else{
                        this.mast_list_info = false
                    }
                }
                this.windSetSchemeMemu()
            })
        },
        getCfdInfoList (){
            
            cfdStatus(this.projectInfo.project_id).then((res)=>{
                if(res.code == 200){
                   
                    let cfdStatusInfo = res.data.filter((item, index)=>{
                        return item.wrg_height && item.status == 2
                    })
                    // console.log(cfdStatusInfo)
                    if(cfdStatusInfo.length>0){
                        this.$store.commit('setSchemeMemu', {
                            type: 'simulationData'
                        })
                    }else{
                        this.$store.commit('setSchemeMemu', {
                            type: 'clearSimulation'
                        })
                    }
                    
                }
                
            })
        },
        windSetSchemeMemu (type){
            if (this.mast_list_info){
                this.$store.commit('setSchemeMemu', {
                    type: 'windData',
                    change: false
                })
            }
            // if(type == 'csv'){
            //     this.$store.commit('setSchemeMemu', {
            //         type: 'windDataConfidence',
            //         change: false
            //     })
            // }
        },
        verification (value){
            if ( value.length == 1 && value[0] == 'GCS_WGS_1984' || value[0] == 'GCS_CN_2000' ){
                this.$store.commit("verifiEpsgModel", 1)
            }
            else if (value.length == 3 && value[0] == 'WGS_84_UTM'){
                this.$store.commit("verifiEpsgModel", 2)
            }
            else {
                this.$store.commit("verifiEpsgModel", 3)
            }
        },
        changeTab (num){
            if (num != 0 && !this.isExistEpsg){
                this.$message.info(this.$t('m.messErrUploadEpsg'))
                return
            }
            // if (num != 0 && !this.checkTerrainWind()) return;

            this.$store.commit('changeTab', num)

        },
        // 是否有地形，风场范围
        checkTerrainWind (){
            if(!this.fileName_terrain || !this.fileName_wind) {
                this.$message.error(this.$t('m.messErrUpload'))
                return false
            } else{
                return true
            }
        },
        // 切换上传界面
        changeModel (type){
            this.initAllUploadName()
            if (type){
                this.projectUpload = true
                // setTimeout(()=>{
                //    this.$refs.projectViewUpload && this.$refs.projectViewUpload.classList.add('project-upload-open')
                // },300)
            } else{
                this.projectUpload = false
                // setTimeout(()=>{
                //     this.$refs.projectView && this.$refs.projectView.classList.add('project-view-open')
                // },300)
            }
            this.$store.commit("setProjectUnfold", this.projectUpload)
        },
        openSetData (){
            this.openEpsg = true
            this.$refs.serParam.open('', this.openEpsg);
        },
        closeSetData (){
            this.openEpsg = false
            if(!this.isExistEpsg){
                this.$message.error('请先设置坐标系')
                return
            }
            this.$refs.serParam.closeEpsg()
        },
        goProjectList (){
            this.$emit('clearProjectName')
            this.$store.commit('setPPtModel', null)
            this.$router.push({
                path: '/index/list'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.project-panel{
    transition: all 1s;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 999;
    height: 100%;
    color: #5F482E;
}
.closeUpload{
    font-weight: bold;
    display: flex;
    color: #828D62;
    &>div{
        cursor: pointer;
        margin-left: 0.1rem;
    }
    div:nth-of-type(1) .iconfont{
        font-size: 0.2rem;
    }
    div:hover{
        transform: scale(1.1);
    }
}

.project-upload{
    width: 4.57rem;
    /* width: 0; */
    /* overflow: hidden; */
    transition: all 0.3s;
    height: 100%;
    background:rgba(235,242,228,1);
    border-radius: 0.9rem 0px 0px 0.34rem;
    display: flex;
    flex-direction: column;
    .header{
        height: 0.45rem;
        padding: 0 0.1rem 0 0.8rem;
        color: #333333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .iconfont{
            color: #8A9A5E;
        }
    }
    .content{
        flex: 1;
        display: flex;
    }
}
.project-view{
    width: 0.62rem;
    /* width: 0; */
    /* overflow: hidden; */
    transition: all 0.3s;
    height: 100%;
    display: flex;
    flex-direction: column;

    border-radius: 0.1rem;
    background: none;
    .uploadView{
        cursor: pointer;
        height: 0.51rem;
        line-height: 0.51rem;
        text-align: center;
        background:rgba(235,242,228,1);
        box-shadow: 0px 0px 7px 0px rgba(9,38,40,0.4);
        border-radius: 0.13rem;
        margin: 0.05rem 0;
        font-size: 0.16rem;
    }
    .content{
        flex: 1;
        background:rgba(235,242,228,1);
        border-radius: 0.13rem;
    }
    .project-upload-content{
        position: relative;
        left: 1rem;
    }
}
.tabContent{
    padding: 0.1rem 0;
    // margin-bottom: 2.7rem;
    overflow: auto;
}
.upload-tab{
    display: flex;
    &>li{
        cursor: pointer;
        position: relative;
        width: 0.58rem;
        height: 0.56rem;
        outline: none;
        &>div{
            width: 100%;
            height: 100%;
            position: relative;
            perspective: 200px;
            outline: none;
        }
        .iconfont{
            color: #fff;
            font-size: 0.26rem;
        }
        span{
            display: inline-block;
            width: 100%;
            height: 100%;
            background:rgba(44,208,185,1);
            border: 3px solid rgba(255,255,255,1);
            border-radius: 0.22rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .imgBox{
            transition: all 0.2s;
            width: 100%;
            height: 100%;
            border: 3px solid rgba(255,255,255,1);
            border-radius: 0.23rem;
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
            img{
                width: 100%;
                height: 100%;
                border-radius: 0.22rem;
            }
        }
        .imgShow{
            z-index: 9;
        }
        .circle{
            position: absolute;
            right: 0.04rem;
            top: -0.05rem;
            z-index: 9;
            width: 0.15rem;
            height: 0.15rem;
            background:rgba(251,93,63,1);
            border:2px solid rgba(255,255,255,1);
            border-radius: 50%;
        }
        .circleStatus1{
            background:rgba(213,221,215,1);
        }
        .circleStatus2{
            background:rgba(1,226,161,1);
        }
    }
    &>li:hover {
        z-index: 10 !important;
        .imgBox.imgShow{
            transform-origin : 0 100% 0;
            // transform: rotateX(65deg) scale(0.9) translateX(4px);
            transform: translateZ(8px);
            transition: all 0.2s;
        }
    }
    &>li:nth-of-type(1){
        left: -0.1rem;
    }
    &>li:nth-of-type(2){
        left: -0.3rem;
    }
    &>li:nth-of-type(3){
        left: -0.5rem;
    }
    &>li:nth-of-type(4){
        left: -0.7rem;
    }
    .tab-title{
        color: #5F482E;
        position: absolute;
        left: 1.5rem;
        width: 1.48rem;
        height: 0.52rem;
        line-height: 0.52rem;
        text-align: center;
        background:rgba(213,221,215,1);
        border-radius: 0 0.22rem 0.22rem 0;
        &>div{
            position: relative;
        }
    }


}
.border-right{
    width: 0;height: 0;
    border-left: 10px solid #fff;
    border-bottom: 10px solid transparent;
    border-top: 10px solid transparent;
    position: absolute;
    left: -60%;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 8px;
}
.border-right span{
    display: block;
    width: 0;height: 0;
    border-left: 8px solid #2CD0B9;
    border-bottom: 8px solid transparent;
    border-top: 8px solid transparent;
    position: absolute;
    top: -8px;
    left: -9px;
    border-radius: 8px;
}

.project-view-open{
    width: 0.62rem;
    overflow: initial;
    transition: all 0.3s;
}
.project-upload-open{
    width: 4.57rem;
    overflow: initial;
    transition: all 0.3s;
}

.rotateActive{
    animation: rotate 0.4s;
}
@keyframes rotate{
    0% { transform: translateZ(8px);}
    100% { transform:  translateZ(0px);}
}
.setDat{
    cursor: pointer;
}
.closeEpsg{
    display: inline-block;
}

.footer{
    width: 3.8rem;
    // height: 2.7rem;
    position: absolute;
    bottom: 0;
    left: 0.6rem;
    background: #fff;
    .title{
        width: 1.7rem;
        height: 0.5rem;
        background:rgba(233,242,236,1);
        border-radius: 0px 0.22rem 0.22rem 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .iconfont{
            position: relative;
            top: 1px;
            right: 0.05rem;
        }
    }
    .fanSchemeName{
        width: initial;
        max-width: 2.5rem;
    }
    .content{
        padding: 0.1rem 0.2rem;
    }
}
.span{
    display: inline-block;
}

.comparisonActive{
    right: -5rem;
    transition: all 0.5s;
}
</style>
