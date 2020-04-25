<template>
    <div class="upload-fan">
        <div class="title">
            <!-- <div>{{$t('m.PackageList')}}</div> -->
            <div class="iconMume">
                <span @click="$store.commit('setSchemeListActive', false)"><i class="iconfont icon-liebiao" :class="{active : !listActive}"></i></span>
                <span @click="$store.commit('setSchemeListActive', true)"><i class="iconfont icon-sea_space" :class="{active : listActive}"></i></span>
            </div>
            <div class="btn">
                <!-- <el-dropdown trigger="click" @command="onDropdown">
                    <el-tooltip class="item" effect="light" content="新增方案" placement="top">
                        <div class="iconfont btn"><i class="iconfont icon-add"></i></div>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown" class="fan">
                        <el-dropdown-item icon="iconfont icon-zengjia" class="fan" command="1">已有点位</el-dropdown-item>
                        <el-dropdown-item icon="iconfont icon-zengjia" class="fan" command="2">已有发电量成果</el-dropdown-item>
                        <el-dropdown-item icon="iconfont icon-zengjia" class="fan" command="3">自动优化排布</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
                <el-tooltip class="item" effect="light" content="新增方案" placement="top">
                    <div class="el-dropdown" @click="onDropdown(2)">
                        <div  class="iconfont btn" style="margin: 0;"><i class="iconfont icon-add"></i></div>
                    </div>
                </el-tooltip>

                <el-tooltip class="item" effect="light" content="方案比选" placement="top">
                    <div @click="openComparison"><i class="iconfont icon-duibi"></i></div>
                </el-tooltip>
            </div>
        </div>

        <div class="content">
            <fan-list-element v-for="(item, index) of fanList" :key="index"
            :listActive="listActive"
            :list="item" :active_scheme_id="active_scheme_id"
            @openStatus="onOpenStatus"
            @clickList="clickFanList"></fan-list-element>
        </div>

        <el-dialog
        :show-close="false"
            :title="$t('m.ReimportDXF')"
            :visible.sync="roadVisible"
            width="4rem"
            custom-class="stationVisibleClass"
            :close-on-click-modal="false">
            <div class="close" @click="onCloseRoadLine('road')"><i class="el-dialog__close el-icon el-icon-close"></i></div>

            <div class="content">
                <upload-button :type="41" :fileName="fileName_dxf" :class="dxf_uploading? 'uploading' :''" :style="!nonePass && !fileName_dxf? 'border:1px solid red':''"
                :width="dxf_progress_width"
                @clickUpload="onClickUpload"></upload-button>
                <div class="nameTitle" v-if="dxf_progress_width > 0"> 
                    <span>{{fileName_dxf_progress}}</span> 
                    <span>{{dxf_progress_width}} %</span> </div>

                <div class="button" @click="onSubmitLineRoad('road')">{{$t('m.confirm')}}</div>
            </div>
            
            <el-upload  action="/"  class="defaultUpload" accept=".dxf"
                :before-upload="beforeDXFUpload"
                :http-request="httpDXFRequest">
                <button ref="dxfImport"></button>
            </el-upload>
        </el-dialog>
        <el-dialog
        :show-close="false"
            :title="$t('m.ReimportZIP')"
            :visible.sync="lineVisible"
            width="4rem"
            custom-class="stationVisibleClass"
            :close-on-click-modal="false">
            <div class="close" @click="onCloseRoadLine('line')"><i class="el-dialog__close el-icon el-icon-close"></i></div>
            
            <div class="content">
                <upload-button :type="42"  :fileName="fileName_zip" :class="zip_uploading? 'uploading' :''" :style="!nonePass && !fileName_zip? 'border:1px solid red':''"
                :width="zip_progress_width"
                @clickUpload="onClickUpload"></upload-button>
                <div class="nameTitle" v-if="zip_progress_width > 0"> 
                    <span>{{fileName_zip_progress}}</span> 
                    <span>{{zip_progress_width}} %</span> </div>

                <div class="button" @click="onSubmitLineRoad('line')">{{$t('m.confirm')}}</div>
            </div>
            
            <el-upload  action="/"  class="defaultUpload" accept=".zip"
                :before-upload="beforeZIPUpload"
                :http-request="httpZIPRequest">
                <button ref="zipImport"></button>
            </el-upload>
        </el-dialog>

        <el-dialog
            :title="$t('m.statiosLonLat')"
            :visible.sync="stationVisible"
            width="3rem"
            custom-class="stationVisibleClass"
            :close-on-click-modal="false">
            <el-form ref="stationforms2" :model="stationform" label-width="0.42rem" >
                <el-form-item label="X:" prop="lon"
                :rules="{validator: validateCoordinateX, trigger: 'blur'}">
                    <el-input v-model="stationform.lon"  type="number"></el-input>
                </el-form-item>
                <el-form-item label="Y:" class="latItem"  prop="lat"
                :rules="{validator: validateCoordinateY, trigger: 'blur'}">
                    <el-input v-model="stationform.lat" type="number"></el-input>
                </el-form-item>
            </el-form>
            <div class="button" @click="onSubmitStation">{{$t('m.confirm')}}</div>
        </el-dialog>
    </div>
</template>
<script>
import uploadButton from "./upload-button.vue"
import fanListElement from "./fan-list-element.vue"
import { evaluationSkip, lineSkip, stationSkip, roadSkip, chooseScheme, postZipFile, postDxfFile, postStationlonLat, station_get, engineering_get, checkNoise, calculationNoise, skipNoiseInit, skipNoise, evaluationCalculation, lineCalculation, stationCalculation, roadCalculation, schemeStatus, getTurbine_scheme, getSchemeList, createdSchemeid } from "@/api/server.request.js"
import { verifyFileNameCheck, verifyFileName, verifyFileNameLength, validateCoordinateX, validateCoordinateY } from "@/utils/validate"
import { mapState } from "vuex";
export default {
    name: 'upload-fan',
    components:{
        fanListElement,
        uploadButton
    },
    data (){
        return{
            validateCoordinateX: validateCoordinateX,
            validateCoordinateY: validateCoordinateY,
            fanList: [],
            active_scheme_id: null,
            fanCalculateStatus: null,
            scheme_item: null,
            stationVisible: false,
            step_scheme_id: null,
            stationform:{
                lon: '',
                lat: ''
            },
            roadVisible: false,
            fileName_dxf: null,
            dxf_uploading: false,
            dxf_progress_width: 0,
            fileName_dxf_progress: null,
            nonePass: true,
            lineVisible: false,
            fileName_zip: null,
            zip_uploading: false,
            zip_progress_width: 0,
            fileName_zip_progress: null,
            engineering_choose: null,
            waitingMinute: false,
            listActive: true,
            computingFlag: false
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            uploadScheme_id: state => state.app.scheme_id,
            refreshSchemeList: state => state.projectUpload.refreshSchemeList,
            refreshSchemeListRemove: state => state.projectUpload.refreshSchemeListRemove,
            recalculateFan: state => state.projectUpload.recalculateFan,
            refreshFanStatus: state => state.projectUpload.refreshFanStatus,
            turbineSchemeList: state => state.app.turbineSchemeList,
            schemeListActive: state => state.projectUpload.schemeListActive
        }),
    },
    watch:{
        schemeListActive(val) {
            this.listActive = val
        },
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: '正在获取方案数据，请稍候...'});
        },
        uploadScheme_id (val){
            console.log('fan-------scheme_id:', val)
            if(val){
                // console.log('projectInfo:', this.projectInfo.project_id)
                setTimeout(()=>{
                    this.computingFlag = false;
    
                    this.active_scheme_id = val
                    let arr = this.fanList.filter((item, index)=>{
                        return item.scheme_id == val
                    })
                    if(arr.length >0){
                        this.onOpenStatus(arr[0])
                    }
                    this.getSchemeFanList()
                    this.$router.push({
                        query: {
                            id: this.projectInfo && this.projectInfo.project_id || this.$route.query.id,
                            scheme_id:  val
                        }
                    })
                },500)
            }
        },
        // 刷新列表
        refreshSchemeList (val){
            if(val){
                console.log('refreshSchemeList')
                this.init()
            }
        },
        refreshSchemeListRemove (val){
            if(val){
                this.init('remove')
                console.log('refreshSchemeListRemove')
            }
        },
        refreshFanStatus (val){
            if(val){
                this.onSchemeStatus()
            }
        },
        recalculateFan (val){
            if(val && val.type == 'skip'){
                this.onSkipcalculate(val.label, val.scheme_id)
            }
            if(val && val.type == 'recalculate'){
                this.onRecalculate(val.label, val.scheme_id)
            }
            if(val && val.type == 'import'){
                this.onImportRecalculate(val.label, val.scheme_id)
            }
        },
        stationVisible (val){
            if(val){
                this.initStationLon()
            }else{
                this.$refs.stationforms2.clearValidate()
            }
        },
        roadVisible (val){
            if(!val){
                this.fileName_dxf = null
                this.dxf_uploading = false
                this.dxf_progress_width = 0
                this.fileName_dxf_progress = null
                this.nonePass = true
                this.engineering_choose = null
            }else{
                this.initengineering_choose()
            }
        },
        lineVisible (val){
            if(!val){
                this.fileName_zip = null
                this.zip_uploading = false
                this.zip_progress_width = 0
                this.fileName_zip_progress = null
                this.nonePass = true
                this.engineering_choose = null
            }else{
                this.initengineering_choose()
            }
        }
    },
    mounted (){
        this.init()
        this.listActive = this.schemeListActive
        this.loopSchemeList()
    },
    beforeDestroy (){
        clearTimeout(this.fanCalculateStatus)

        this.$store.commit('clearFanStatus')
        this.scheme_item = null
    },
    methods:{
        // 轮询这个接口目的就复制接口是否可用
        loopSchemeList (){
            getSchemeList(this.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                let fanList = res.data.map((item, index)=>{
                    item.checked = false
                    return item
                })
                this.fanList = fanList

                setTimeout(()=>{
                    this.loopSchemeList()
                }, 5000)
            })
        },
        // 比选
        openComparison (){
            let checkedArr = this.fanList.filter((item, index) => item.checked)

            if (checkedArr.length <= 0){
                this.$message.info('请勾选要进行比选的方案')
                return
            }
            if (checkedArr.length > 2){
                this.$message.info('最多选择两个方案进行对比')
                return
            }
            this.$store.commit('openComparison', true)
        },
        checkFileStatus (type, isClose = false){
            if(this.dxf_progress_width > 0 || this.zip_progress_width > 0){
                this.$message.error(this.$t('m.pleaseWaitUpload'))
                return false
            }
            if(type == 'road' && !isClose){
                if(!this.fileName_dxf){
                    this.nonePass = false
                    return false
                }
            }
            if(type == 'line' && !isClose) {
                if(!this.fileName_zip){
                    this.nonePass = false
                    return false
                }
            }
            return true
        },
        onClickUpload (type){
            switch (type){
                case 41: // dxf
                this.$refs.dxfImport.click()
                break;
                case 42: // zip
                this.$refs.zipImport.click()
                break;
            }
        },
        // 关闭
        onCloseRoadLine (type){
            let flag = this.checkFileStatus(type, true)
            if (!flag){
                return
            }
            switch (type){
                case 'line':
                this.lineVisible = false
                break;
                case 'road':
                this.roadVisible = false
                break;
            }
        },
        // 保存提交
        onSubmitLineRoad (type){
            let flag = this.checkFileStatus(type)
            if (!flag){
                return
            }
            switch (type){
                case 'line':
                    // console.log(this.engineering_choose)
                    this.engineering_choose.checked_line = true
                    this.engineering_choose.auto_line = '2'
                    let data = {
                        project_id: this.projectInfo.project_id,
                        scheme_id: this.scheme_item.scheme_id,
                        choose: this.engineering_choose
                    }
                    let config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    chooseScheme(data, config).then((res)=>{
                        if(res.code != 201){
                            this.$message.error(res.message)
                            return
                        }
                        this.$message.success(res.message)
                        this.lineVisible = false
                        // 刷新状态
                        this.onSchemeStatus()
                    })
                break;
                case 'road':
                    // console.log(this.engineering_choose)
                    this.engineering_choose.checked_road = true
                    this.engineering_choose.auto_road = '2'
                    let data2 = {
                        project_id: this.projectInfo.project_id,
                        scheme_id: this.scheme_item.scheme_id,
                        choose: this.engineering_choose
                    }
                    let config2 = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    chooseScheme(data2, config2).then((res)=>{
                        if(res.code != 201){
                            this.$message.error(res.message)
                            return
                        }
                        this.$message.success(res.message)
                        this.roadVisible = false
                        // 刷新状态
                        this.onSchemeStatus()
                    })
                break;
                
            }
        },
        // 保存提交
        onSubmitStation (){
            let flag3 = true
            this.$refs.stationforms2.validate((valid) => {
                flag3 = valid
            })
            if(!flag3){

                return
            }
            
            let data = {
                syz_x: this.stationform.lon,
                syz_y: this.stationform.lat,
                project_id: this.projectInfo.project_id,
                scheme_id: this.step_scheme_id
            }
            postStationlonLat(data).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                this.stationVisible = false
                // 刷新状态
                this.onSchemeStatus()
            })
        },
        beforeDXFUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'dxf', 'dxf', true)
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpDXFRequest (options){
            let that = this
            let fileName = options.file.name
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        that.dxf_progress_width = (progressEvent.loaded / progressEvent.total * 100 | 0)-2
                    }
                }
            };
            data.append('road_dxf', options.file);
            data.append('project_id', this.projectInfo.project_id);
            data.append('scheme_id', this.step_scheme_id);
            this.dxf_uploading = true
            this.fileName_dxf_progress = fileName
            postDxfFile(data, config).then((res)=>{
                this.dxf_progress_width = 0
                this.fileName_dxf_progress = null

                if(res.code != 200){
                    this.$message.error(res.message)
                    this.dxf_uploading = false
                    return
                }
                this.$message.success(res.message)
                this.fileName_dxf = fileName
            }).catch((err)=>{
                this.dxf_progress_width = 0
                this.dxf_uploading = false
                this.fileName_dxf_progress = null
            })
        },
        beforeZIPUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'zip', 'zip', true)
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpZIPRequest (options){
            let that = this
            let fileName = options.file.name
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        that.zip_progress_width = (progressEvent.loaded / progressEvent.total * 100 | 0)
                    }
                }
            };
            data.append('line_file', options.file);
            data.append('project_id', this.projectInfo.project_id);
            data.append('scheme_id', this.step_scheme_id);
            this.zip_uploading = true
            this.fileName_zip_progress = fileName
            postZipFile(data, config).then((res)=>{
                this.zip_progress_width = 0
                this.fileName_zip_progress = null

                if(res.code != 200){
                    this.$message.error(res.message)
                    this.zip_uploading = false
                    return
                }
                this.$message.success(res.message)
                this.fileName_zip = fileName
            }).catch((err)=>{
                this.zip_progress_width = 0
                this.zip_uploading = false
                this.fileName_zip_progress = null
            })
        },
        // 回显数据接口
        initStationLon (){
            station_get(this.projectInfo.project_id, this.step_scheme_id).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.meessage)
                    return
                }
                this.stationform = {
                    lon: res.data.syz_x,
                    lat: res.data.syz_y
                }
                
            })
        },
        // 获取勾选的值
        initengineering_choose (){
            engineering_get(this.projectInfo.project_id, this.step_scheme_id).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.meessage)
                    return
                }
                this.engineering_choose = res.data
            })
        },
        // 重新导入
        onImportRecalculate (label, scheme_id){
            this.step_scheme_id = scheme_id
            // console.log('重新导入在计算', label, scheme_id)
            switch (label){
                case 'roadCalculation': // 道路
                this.roadVisible = true
                break;
                case 'stationCalculation': // 升压站
                this.stationVisible = true
                break;
                case 'lineCalculation': // 线路
                this.lineVisible = true
                break;
            }
        },
        // 跳过
        onSkipcalculate (label, scheme_id){
            console.log('跳过', label, scheme_id)
            switch (label){
                
                case 'NoiseCalculation': // 噪音
                skipNoise(this.projectInfo.project_id, scheme_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    this.onSchemeStatus()
                })
                break;
                case 'roadCalculation': // 道路
                roadSkip(this.projectInfo.project_id, scheme_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    this.onSchemeStatus()
                })
                break;
                case 'stationCalculation': // 升压站
                stationSkip(this.projectInfo.project_id, scheme_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    this.onSchemeStatus()
                })
                break;
                case 'lineCalculation': // 线路
                lineSkip(this.projectInfo.project_id, scheme_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    this.onSchemeStatus()
                })
                break;
                case 'computingCalculation': // 经评
                evaluationSkip(this.projectInfo.project_id, scheme_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    this.onSchemeStatus()
                })
                break;
            }
        },
        // 重新计算
        onRecalculate (label, scheme_id){
            console.log('重新计算: ',label, scheme_id)
            switch (label){
                case 'synthesisAccount': // 综合

                break;
                case 'NoiseCalculation': // 噪音
                this.initSchemeFanList(scheme_id, (res)=>{
                    // console.log(res)
                    if(!res){
                        this.$message.error(res.message)
                        return
                    }
                    this.onCheckNoise(res.data, (callback)=>{
                        if(!callback) return
                        //计算接口
                        calculationNoise(this.projectInfo.project_id, scheme_id).then((res)=>{
                            if(res.code != 200){
                                this.$message.error(res.message)
                                return
                            }
                            this.$message.success(res.message)
                            setTimeout(()=>{
                                this.onSchemeStatus()
                            },1500)
                        })
                    })
                })
                break;
                case 'roadCalculation': // 道路
                roadCalculation(this.projectInfo.project_id, scheme_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    setTimeout(()=>{
                        this.onSchemeStatus()
                    },1500)
                })
                break;
                case 'stationCalculation': // 升压站
                stationCalculation(this.projectInfo.project_id, scheme_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    setTimeout(()=>{
                        this.onSchemeStatus()
                    },1500)
                })
                break;
                case 'lineCalculation': // 线路
                lineCalculation(this.projectInfo.project_id, scheme_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    setTimeout(()=>{
                        this.onSchemeStatus()
                    },1500)
                })
                break;
                case 'computingCalculation': // 经评
                evaluationCalculation(this.projectInfo.project_id, scheme_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    setTimeout(()=>{
                        this.onSchemeStatus()
                    },1500)
                })
                break;
            }
        },
        initSchemeFanList (scheme_id, callback){
            getTurbine_scheme({
                project_id: this.projectInfo.project_id,
                scheme_id: scheme_id
            }).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    callback(null)
                    return
                }
               callback(res)
            })
        },
        onCheckNoise (list, callback){
            var arr = []
            list.forEach((item, index)=>{
                arr.push(item.turbine_type)
            })
            // console.log(arr)
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            checkNoise({
                data: arr,
                project_id: this.projectInfo.project_id
            }, config).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    callback(null)
                    return
                }
                if(res.data.toLowerCase() == 'true'){
                    callback('ok')
                }
            }).catch((err)=>{
                callback(null)
            })
        },
        onOpenStatus (list){
            this.scheme_item = list
            this.onSchemeStatus()
        },
        onSchemeStatus (){
            if(!this.scheme_item) return;

            let statusData = {}
            statusData.scheme_name = this.scheme_item.scheme_name
            statusData.scheme_id = this.scheme_item.scheme_id
            schemeStatus(this.scheme_item.project_id, this.scheme_item.scheme_id).then((res)=>{
                if (res.code != 200){
                    return
                }
                statusData.data = res.data
                
                statusData.data[0].label = 'NoiseCalculation'
                statusData.data[1].label = 'roadCalculation'
                statusData.data[2].label = 'stationCalculation'
                statusData.data[3].label = 'lineCalculation'
                statusData.data[4].label = 'computingCalculation'
                this.$store.commit('calculateStatus', {
                    type: 'fan',
                    data: statusData
                })

                let status = res.data.some((item, index)=>{
                    return item.status == 0 || item.status == 1
                })
                let flag4 = statusData.data[4].status

                // console.log(this.computingFlag, flag4, "9999999")
                // 经评完成刷新
                if (!this.computingFlag && flag4 == 2){
                    console.log('刷新一次方案列表')
                    this.computingFlag = true
                    this.init()
                }
                if(this.fanCalculateStatus){
                    clearTimeout(this.fanCalculateStatus)
                }
                if(status){
                    this.fanCalculateStatus = setTimeout(()=>{
                        this.onSchemeStatus()
                    },4000)
                }
                if(statusData.data[2].status == 2){
                  this.$store.commit('setSchemeMemu',{
                      type: 'boosterStation'
                  })
                }
                if(statusData.data[1].status == 2){
                  this.$store.commit('setSchemeMemu',{
                      type: 'basedRoad'
                  })
                }
                if(statusData.data[3].status == 2){
                  this.$store.commit('setSchemeMemu',{
                      type: 'currentLine'
                  })
                }
                if(statusData.data[4].status == 2 || statusData.data[4].status == 3){
                  this.$store.commit('setSchemeMemu',{
                      type: 'pinggu'
                  })
                }
            })
        },
        initSchemeid (){
            console.log(this.uploadScheme_id)
            this.active_scheme_id = this.uploadScheme_id
            let arr = this.fanList.filter((item, index)=>{
                return item.scheme_id == this.uploadScheme_id
            })
            console.log(arr, "00000000000000")
            if(arr.length >0){
                this.onOpenStatus(arr[0])
                this.getSchemeFanList(this.active_scheme_id)
            }
        },
        init (type){
            this.waitingMinute = true
            getSchemeList(this.projectInfo.project_id).then((res)=>{
                this.waitingMinute = false
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }

                let fanList = res.data.map((item, index)=>{
                    item.checked = false
                    return item
                })
                // 后端只过滤这个接口，比选等其他列表那边没有过滤，自己过滤
                // this.fanList = fanList.filter((item, index)=>{
                //     return item.scheme_name
                // })
                this.fanList = fanList
                this.$store.commit('setSchemeList', this.fanList)
                if(this.fanList.length >0){
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
                }
                else{
                    this.fanList = []
                }
                // console.log(this.fanList)
                if (type != 'remove') {
                    this.initSchemeid()
                }else{
                    this.$store.commit('removeSchemeInit')
                    clearTimeout(this.fanCalculateStatus)
                    if (this.fanList.length <=0 ){
                        this.active_scheme_id = null
                        this.$store.commit('setScheme_id', null)
                    
                        this.$router.push({
                            query: {
                                id: this.projectInfo && this.projectInfo.project_id ||this.$route.query.id
                            }
                        })
                        return
                    }
                    this.clickFanList(this.fanList[0])
                }
                
            }).catch((err)=>{
                this.waitingMinute = false
            })
        },
        onDropdown (command){
  
            createdSchemeid(this.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                if(command == 1){
                    this.$store.commit('fanAddVisible', {
                        type: 'exist',
                        id: res.data
                    })
                }else if(command == 2){
                    this.$store.commit('fanAddVisible', {
                        type: 'result',
                        id: res.data
                    })
                }else if(command == 3){
                    this.$store.commit('fanAddVisible', {
                        type: 'auto',
                        id: res.data
                    })
                }
            })
        },
        clickFanList (item){
            console.log(item.scheme_id, this.active_scheme_id)
            //再次点击取消选中
            if (item.scheme_id == this.active_scheme_id) {
                this.active_scheme_id = ''
                this.$store.commit('setScheme_id', '')
                this.$router.push({
                    query: {
                        id: this.projectInfo && this.projectInfo.project_id || this.$route.query.id,
                        disable: true, // 用来防止 切换路由会自动选中加scheme_id
                    }
                })
                return
            }
            this.active_scheme_id = item.scheme_id
            // 设置id
            this.$store.commit('setScheme_id', item.scheme_id)
            this.$store.commit("initSchemeMemu")
            // this.$store.commit('closeSchemeMemu')
            // 设置router, 刷新用
            if (!this.$route.query.id) return
            this.$router.push({
                query: {
                    id: this.projectInfo && this.projectInfo.project_id || this.$route.query.id,
                    scheme_id: item.scheme_id,
                }
            })
        },
        // 获取该方案得风机列表渲染
        getSchemeFanList (){
            // console.log(this.turbineSchemeList)
            
            let project_id = this.projectInfo ? this.projectInfo.project_id : this.$route.query.id
            this.waitingMinute = true
            getTurbine_scheme({
                project_id: project_id,
                scheme_id: this.active_scheme_id
            }).then((res)=>{
                this.waitingMinute = false
                if(res.code != 200){
                    this.$store.commit('setTurbineScheme', [])
                    this.$message.error(res.message)
                    return
                }
                this.$store.commit('setTurbineScheme', res.data)
                gwmap.wtLayer.loadWt(res.data, ()=>{})
            }).catch((err)=>{
                this.waitingMinute = false
            })
        },
    }
}
</script>
<style lang="scss" scoped>

.upload-fan{
    width: 3.86rem;
    background:rgba(255,255,255,1);
    border-radius: 0.18rem;
    /deep/ .stationVisibleClass{
        margin: 0;
        width: 3rem;
        bottom: 2rem;
        right: 0.5rem;
        position: absolute;
        .close{
            cursor: pointer;
            position: absolute;
            top: 0.1rem;
            right: 0.2rem;
            .el-dialog__close{
                font-size: 0.25rem;
            }
        }
        .content{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .el-dialog__close:hover{
            color: #333;
        }
        .el-form-item__error{
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .el-dialog__body{
            padding: 0.1rem 0.1rem 0.2rem 0.1rem;
        }
        .el-form{
            margin: 0 auto;
            padding-right: 0.3rem;
        }
        .el-form-item{
            margin-bottom:0.16rem
        }
        .el-form-item__label, .el-form-item__content{
            line-height: 0.26rem;
        }
        .el-input__inner{
            border: none;
            height: 0.26rem;
            background:rgba(235,242,228,1);
            border-radius: 0.02rem;
        }
        .button{
            width: 1.44rem;
            height: 0.45rem;
            background:rgba(44,208,185,1);
            border-radius: 0.16rem;
            text-align: center;
            line-height: 0.45rem;
            color: #fff;
            margin: 0.1rem auto 0 auto;
            cursor: pointer;
        }
    }
    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.15rem;
        color: #333333;
        .iconfont.btn{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            outline: none;
        }
        .btn{
            display: flex;
            &>div{
                cursor: pointer;
                width: 0.56rem;
                height: 0.31rem;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 0.11rem;
            }
            &>div:nth-of-type(1){
                background:rgba(240,246,247,1);
                margin-right: 0.08rem;
            }
            &>div:nth-of-type(2){
                background:rgba(44,208,185,1);
            }
        }
        .iconfont{
            color: #fff;
        }
        .icon-add{
            color: #2CD0B9;
        }
   }
   .content{
       padding: 0 0.15rem;
   }
   .iconMume{
        .iconfont{
            color: #8A9A5E;
            font-size: 0.28rem;
            cursor: pointer;
        }
        .iconfont.active{
            color: #2CD0B9;
        }
    }
}
</style>