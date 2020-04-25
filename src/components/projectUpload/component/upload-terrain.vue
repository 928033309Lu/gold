<template>
    <div class="upload-terrain" ref="contentHeight">
        <div class="terrainRadio">
            <!-- <el-radio v-model="terrainRadio" label="1">使用实测地形</el-radio>
            <el-radio v-model="terrainRadio" label="2">使用SRTM地形</el-radio> -->
        </div>

        <div class="content">
            <div>
                <!-- 地形 -->
                <upload-button v-if="terrainRadio == 1" :class="terrain_uploading? 'uploading' :''" 
                    :width="terrain_progress_width" :type="1" :fileName="fileName_terrain" 
                    @removeFile="removeFile"
                    @clickUpload="onClickUpload"></upload-button>
                <div class="nameTitle" v-if="uploading_terrain_name"> <span class="ellipsis">{{uploading_terrain_name}}</span> <span>{{terrain_progress_width}} %</span> </div>
                <!-- <div v-if="terrainRadio == 2" class="srtmTerrain">
                    <div> <div><i class="iconfont icon-sanjiaoxing"></i> X= </div>
                        <el-input v-model="srtmTerrain_X" type="number"></el-input>
                    </div>
                    <div> <div><i class="iconfont icon-sanjiaoxing"></i> Y= </div>
                        <el-input v-model="srtmTerrain_Y" type="number"></el-input>
                    </div>
                    <div class="btn">
                        <el-button>基于地球选择</el-button>
                        <el-button type="success">纠正</el-button>
                    </div>
                </div> -->
                <!-- 风场范围 -->
                <upload-button :class="wind_uploading? 'uploading' :''" 
                    :width="wind_progress_width" :type="2" :fileName="fileName_wind" 
                    @removeFile="removeFile"
                    @clickUpload="onClickUpload"></upload-button>
                <div class="nameTitle" v-if="uploading_wind_name"> <span class="ellipsis">{{uploading_wind_name}}</span> <span>{{wind_progress_width}} %</span> </div>
                <!-- 踏勘 -->
                <upload-button :class="walk_uploading? 'uploading' :''" 
                    :width="walk_progress_width" :type="3" :fileName="fileName_walk" 
                    @removeFile="removeFile"
                    @clickUpload="onClickUpload"></upload-button>
                <div class="nameTitle" v-if="uploading_walk_name"> <span class="ellipsis">{{uploading_walk_name}}</span> <span>{{walk_progress_width}} %</span> </div>
                <!-- 限制性因素 -->
                <div class="upload-button" @click="onClickAstrict"> <i class="iconfont icon-shangchuan1"></i> {{$t('m.uploadFileConstraints')}}</div>
                <div v-for="(item, index) of astrict_Data" :key="index">
                    <div v-show="item.isShow">
                        <astrict-upload-button 
                            :ref="'astrictUpload'+index"
                            :class="item.astrict_uploading? 'uploading' :''" 
                            :style="item.opacityShow? 'opacity: 0;z-index: -1;top:0;left:0;position: absolute;' : ''"
                            :width="item.astrict_progress_width" 
                            :uploadIndex="(index+1)" :fileName="item.fileName_astrict" :fileNameNew="item.fileName_astrict_new" :astrict_Data="astrict_Data"
                            @removeLength="removeLength"
                            @changeAstrictStatus="changeAstrictStatus"
                            @changeOpacityShow="changeOpacityShow"
                            @removeFile="astrictRemoveFile"></astrict-upload-button>
                        <div class="nameTitle" v-if="item.astrict_progress_width > 0"> <span class="ellipsis">{{item.uploading_name}}</span> <span>{{item.astrict_progress_width}} %</span> </div>
                    </div>
                </div>
            </div>
        </div>
        
        <el-upload  action="/"  class="defaultUpload" accept=".map,.tif"
            :before-upload="beforeTerrainUpload" 
            :http-request="httpTerrainRequest">
            <button ref="terrainUpload"></button>
        </el-upload>
        <el-upload  action="/"  class="defaultUpload" accept=".kmz,.kml"
            :before-upload="beforeWindUpload" 
            :http-request="httpWindRequest">
            <button ref="windUpload"></button>
        </el-upload>
        <el-upload  action="/"  class="defaultUpload" accept=".kmz,.kml"
            :before-upload="beforeWalkUpload" 
            :http-request="httpWalkRequest">
            <button ref="walkUpload"></button>
        </el-upload>
        
    </div>
</template>
<script>
import envConfig from '@/config/env-config.js'
import uploadButton from "./upload-button.vue"
import astrictUploadButton from "./astrict-upload-button.vue"
import { postTerrainModel, deleteTerrainModel, calculationTerrain, terrainStatus, getAllUploadName } from "@/api/server.request.js"
import { verifyFileName, verifyFileNameLength, verifyFileNameCheck } from "@/utils/validate"
import { mapState } from "vuex";
export default {
    name: 'upload-terrain',
    props:{
        isExistEpsg:{
            default: false
        }
    },
    components:{
        uploadButton,
        astrictUploadButton
    },
    data (){
        return{
            terrainCalculateStatus: null,
            // fileName_wind: null,
            heights: '',
            terrainRadio: '1',
            fileName_terrain: null,
            fileName_wind: null,
            fileName_walk: null,
            uploading_terrain_name: null,
            uploading_wind_name: null,
            uploading_walk_name: null,

            terrain_uploading: false,
            wind_uploading: false,
            walk_uploading: false,

            terrain_progress_width: 0,
            wind_progress_width: 0,
            walk_progress_width: 0,
            
            srtmTerrain_X: 0,
            srtmTerrain_Y: 0,
            astrict_Data:[],

            terrainStatusInfo: null,
            dem_server_path: null,
            dom_server_path: null,
            all_server_path: null,
            restriction_url: null,
            contour_server_path: null,
            waitingCalculate: false
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            allUploadNameInfo: state => state.projectUpload.allUploadNameInfo,
            schemeMemu: state => state.projectUpload.schemeMemu,
            recalculate: state => state.projectUpload.recalculate,
        }),
        clearTerrain (){
            if (this.astrict_Data.every((item)=>!item.isShow) && !this.fileName_terrain && !this.fileName_wind && !this.fileName_walk){
                return true
            }else{
                return false
            }
        }
    },
    watch:{
        waitingCalculate () {
            this.$store.dispatch('handleLoading', {loading: this.waitingCalculate, text: '发起计算中，请稍候...'});
        },
        clearTerrain (val){
            // console.log(val)
            if (val){
                this.$store.commit('setSchemeMemu',{
                    type: 'clearterrainmodel'
                })
            }
        },
        allUploadNameInfo:{
            handler(val, oldVal){
                // console.log(val)
                if(!val) return;
                this.initallUploadNameInfo(val)
            },
            deep:true
        },
        fileName_terrain (val){
            if(val){
                this.terrain_uploading = true
            } else{
                this.terrain_uploading = false
            }
        },
        fileName_wind (val){
            if(val){
                this.wind_uploading = true
            } else{
                this.wind_uploading = false
            }
        },
        fileName_walk (val){
            if(val){
                this.walk_uploading = true
            } else{
                this.walk_uploading = false
            }
        },
        recalculate (type){
            if(type == 'terrain'){
                this.getCalculationTerrain()
            }
        }
    },
    mounted (){
        this.initAllUploadName()
        
        
    },
    beforeDestroy (){
        
        clearTimeout(this.terrainCalculateStatus)
        
    },
    destroyed (){
        clearTimeout(this.terrainCalculateStatus)
    },
    methods:{
        initAllUploadName (){
            if(!this.projectInfo) return;
            getAllUploadName (this.projectInfo.project_id).then((res)=>{
                
                if (res.code != 200){
                    return
                }
                this.$store.commit('allUploadNameInfo', res.data)
                this.initallUploadNameInfo(res.data)
                
                this.all_server_path = res.data.dem_server_path || res.data.dom_server_path
                if (this.all_server_path){
                    gwmap.init3dMap(this.all_server_path)
                }
                this.getTerrainStatus()
            })
        },
        initallUploadNameInfo (val){
            if(!val) return;
            // console.log(val)
            this.restriction_url = val.restriction_url
            this.contour_server_path = val.contour_server_path

            this.fileName_terrain = val.user_map_data
            this.fileName_wind = val.user_redline_data
            this.fileName_walk = val.user_scouting_data
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
                    data: this.astrict_Data,
                    change: false
                })
                
            }
            // console.log(this.astrict_Data)

        },
        removeLength (){
            this.astrict_Data.splice(this.astrict_Data.length-1, 1)
        },
        onClickAstrict (){
            if (!this.checkExistEpsg()) return;
            // if (!this.checkTerrainWind()) return;
            let that = this
            // this.astrict_Data = this.astrict_Data.filter((item, index) => item.opacityShow != true)
            this.astrict_Data.push({
                fileName_astrict_new: null,
                fileName_astrict: null,
                uploading_name: null,
                astrict_uploading: false,
                astrict_progress_width: 0,
                isShow: true,
                opacityShow: true
            })
            var len = this.astrict_Data.length-1
            setTimeout(()=>{
                // that.$refs['astrictUpload'+ len][0].$el.click()
                that.$refs['astrictUpload'+ len][0].open()
            },200)
        },
        changeOpacityShow (index){
            this.astrict_Data[index-1].opacityShow = false
        },
        astrictRemoveFile (index, fileName, fileNameNew){
            let that = this
            this.$confirm(this.$t('m.removeFileData'), this.$t('m.hint'), {
                confirmButtonText: this.$t('m.confirm'),
                cancelButtonText: this.$t('m.cancel'),
                type: 'warning'
            }).then(() => {
                deleteTerrainModel (that.projectInfo.project_id, fileName, 'factor.kmz').then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    this.astrict_Data[index-1].isShow = false
                    this.astrict_Data[index-1].opacityShow = true
                    this.astrict_Data[index-1].fileName_astrict_new = null
                    this.astrict_Data[index-1].fileName_astrict = null
                    if(this.astrict_Data[index-1].checked && this.astrict_Data[index-1].url){
                        gwmap.astrictLayer.remove(this.astrict_Data[index-1])
                    }
                    this.$store.commit('setSchemeMemu', {
                        type: 'removeAstrictOne',
                        data: fileNameNew,
                        data2: this.astrict_Data.filter((v)=>v.fileName_astrict_new)
                    })
                })
            }).catch(() => {
                         
            });
            
        },
        //限制因素
        changeAstrictStatus (type, index, status, okfileName, fileNameNew){
            // console.log(type, index, status, okfileName, fileNameNew)
            if (okfileName){
                // console.log("change--false")
                switch (type){
                    case 'astrict_uploading':
                        this.astrict_Data.forEach((item, index)=>{
                            if (item.fileName_astrict == okfileName){
                                item.astrict_uploading = true
                            }
                        })
                    break;
                    case 'astrict_progress_width':
                         console.log(type, index, status, okfileName, fileNameNew)
                        this.astrict_Data.forEach((item, index)=>{
                            if (item.fileName_astrict == okfileName){
                                item.astrict_progress_width = status
                                item.uploading_name = fileNameNew
                            }
                        })
                    break;
                    case 'end':
                        this.astrict_Data.forEach((item, index)=>{
                            if (item.fileName_astrict == okfileName){
                                item.fileName_astrict_new = fileNameNew
                                item.fileName_astrict = okfileName
                                item.astrict_progress_width = 0
                                item.url = envConfig.S3Path + '/' + this.projectInfo.project_id + '/UAV/input/factor/' + okfileName
                                item.checked = true
                                item.isShow = true
                                
                            }
                            this.$store.commit('setSchemeMemu', {
                                type: 'astrict',
                                data: this.astrict_Data,
                                change: true
                            })
                        })
                        // console.log(this.astrict_Data)
                    break;
                    case 'err':
                        this.astrict_Data.forEach((item, index)=>{
                            if (item.fileName_astrict == okfileName){
                                item.fileName_astrict = null
                                item.fileName_astrict_new = null
                                item.astrict_progress_width = 0
                            }
                        })
                    break;
                }
                return
            }
            // console.log("change--true")
            // 最好不用下标，加id来操作
            switch (type){
                case 'astrict_uploading':
                    this.astrict_Data[index-1].astrict_uploading = status
                break;
                case 'astrict_progress_width':
                    //  console.log(type, index, status, okfileName, fileNameNew)
                    this.astrict_Data[index-1].astrict_progress_width = status
                    this.astrict_Data[index-1].uploading_name = fileNameNew
                break;
                case 'end':
                    this.astrict_Data[index-1].astrict_progress_width = 0
                    this.astrict_Data[index-1].fileName_astrict = status
                    this.astrict_Data[index-1].fileName_astrict_new = fileNameNew
                    this.astrict_Data[index-1].url = envConfig.S3Path + '/' + this.projectInfo.project_id + '/UAV/input/factor/' + status
                    this.astrict_Data[index-1].checked = true
                    this.astrict_Data[index-1].isShow = true

                    this.$store.commit('openWindFactor', true)
                    this.$store.commit('setSchemeMemu', {
                        type: 'astrict',
                        // data: this.astrict_Data[index-1],
                        data: this.astrict_Data,
                        change: true
                    })
                break;
                case 'err':
                    this.astrict_Data[index-1].astrict_progress_width = 0
                    this.astrict_Data[index-1].fileName_astrict = null
                    this.astrict_Data[index-1].fileName_astrict_new = null
                break;
                case 'uploading_name':
                    
                break;
            }
        },
       
        // 是否有epsg
        checkExistEpsg (){
            if (!this.isExistEpsg){
                this.$message.info(this.$t('m.messErrUploadEpsg'))
                return false
            }else{
                return true
            }
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
        onClickUpload (type){
            switch (type){
                case 1:
                    if (!this.checkExistEpsg()) return;
                    // console.log(this.terrainStatusInfo)
                    if(this.terrainStatusInfo){
                        // 地形计算成功加提醒
                        if (this.terrainStatusInfo[1].status == 2){
                            this.$confirm(this.$t('m.terrainSucccessTip'), this.$t('m.hint'), {
                                confirmButtonText: this.$t('m.confirm'),
                                cancelButtonText: this.$t('m.cancel'),
                                type: 'warning'
                            }).then(() => {
                                this.$refs.terrainUpload.click()
                            }).catch(() => {
                                        
                            })
                        }
                        else if (this.terrainStatusInfo[0].status == 1 || this.terrainStatusInfo[1].status == 1){
                            this.$message.error('地形数据计算中，请勿重复上传！')
                        }
                        else{
                            this.$refs.terrainUpload.click()
                        }
                    }
                    else{
                        this.$refs.terrainUpload.click()
                    }

                break;
                case 2:
                    if (!this.checkExistEpsg()) return;
                    this.$refs.windUpload.click();
                break;
                case 3:
                    if (!this.checkExistEpsg()) return;
                    // if (!this.checkTerrainWind()) return;
                    this.$refs.walkUpload.click();
                break;
            }
        },
        nextRemoveFile (type){
            let that = this
            switch (type){
                case 1:
                    deleteTerrainModel (that.projectInfo.project_id, 'terrain.map', 'dsm.map').then((res)=>{
                        if(res.code != 200){
                            this.$message.error(res.message)
                            return
                        }
                        this.$message.success(res.message)
                        this.fileName_terrain = null
                        
                    })
                break;
                case 2:
                    deleteTerrainModel (that.projectInfo.project_id, 'redline.kmz', 'redline.kmz').then((res)=>{
                        if(res.code != 200){
                            this.$message.error(res.message)
                            return
                        }
                        this.$message.success(res.message)
                        this.fileName_wind = null

                        gwmap.fieldLayer.remove()
                        this.$store.commit('setSchemeMemu', {
                            type: 'removefield'
                        })
                    })
                break;
                case 3:
                    deleteTerrainModel (that.projectInfo.project_id, 'scouting.kmz', 'scouting.kmz').then((res)=>{
                        if(res.code != 200){
                            this.$message.error(res.message)
                            return
                        }
                        this.$message.success(res.message)
                        this.fileName_walk = null

                        gwmap.scoutingLayer.remove()
                        this.$store.commit('setSchemeMemu', {
                            type: 'removescouting'
                        })
                    })
                break;
                
            }
        },
        removeFile (type){
            this.$confirm(this.$t('m.removeFileData'), this.$t('m.hint'), {
                confirmButtonText: this.$t('m.confirm'),
                cancelButtonText: this.$t('m.cancel'),
                type: 'warning'
            }).then(() => {
                this.nextRemoveFile(type)
            }).catch(() => {
                         
            });
            
        },
        // 地形
        beforeTerrainUpload (file){
            
            if (this.terrain_progress_width != 0){
                this.$message.error(this.$t('m.uploadloading'))
                return false
            }
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'map', 'tif', true)
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpTerrainRequest (options){
            this.terrain_uploading = true
            let that = this

            let data = new FormData()
            let fileName = options.file.name
            this.uploading_terrain_name = fileName
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        let progress = (progressEvent.loaded / progressEvent.total * 100 | 0)
                        that.terrain_progress_width = progress
                    }
                }
            }
            data.append('terrain_file', options.file)
            data.append('upload_type', 'dsm.map')
            data.append('file_name', 'terrain.map')

            this.terrainPost(data, config, fileName)
        },
        terrainPost(data, config, fileName){
            let that = this
            postTerrainModel(that.projectInfo.project_id, data, config).then((res)=>{
                that.uploading_terrain_name = null
                if(res.code != 200){
                    that.terrain_progress_width = 0
                    that.fileName_terrain = null
                    this.$message.error(res.message)
                    return
                }
                that.terrain_progress_width = 0
                that.fileName_terrain = fileName
                
                this.getCalculationTerrain()
                this.$store.commit('setSchemeMemu', {
                    type: 'terrain',
                    data: null
                })
            }).catch((err)=>{
                console.log(err)
                that.terrain_progress_width = 0
                that.fileName_terrain = null
                that.uploading_terrain_name = null
            })
        },
        // 风场范围
        beforeWindUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'kmz', 'kml')
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpWindRequest (options){
            this.wind_uploading = true
            let that = this

            let data = new FormData()
            let fileName = options.file.name
            this.uploading_wind_name = fileName
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        let progress = (progressEvent.loaded / progressEvent.total * 100 | 0)
                        that.wind_progress_width = progress
                    }
                }
            }
            data.append('terrain_file', options.file)
            data.append('upload_type', 'redline.kmz')
            data.append('file_name', 'redline.kmz')

            postTerrainModel(that.projectInfo.project_id, data, config).then((res)=>{
                that.uploading_wind_name = null
                if(res.code != 200){
                    that.wind_progress_width = 0
                    that.fileName_wind = null
                    this.$message.error(res.message)
                    return
                }
                this.wind_progress_width = 0
                this.fileName_wind = fileName
                
                // this.getCalculationTerrain()
                this.$store.commit('setSchemeMemu', {
                    type: 'field',
                    data: null,
                    active: true
                })
                this.loadWindKmzData('redline.kmz')
            }).catch((err)=>{
                that.wind_progress_width = 0
                that.fileName_wind = null
                that.uploading_wind_name = null
            })
            
        },
        loadWindKmzData (fileName){
            // https://goldfarm-dev.s3.cn-northwest-1.amazonaws.com.cn/40/UAV/input/scouting.kmz
            let url = envConfig.S3Path + '/' + this.projectInfo.project_id + '/UAV/input/' + fileName
            gwmap.fieldLayer.load(url);
            gwmap.fieldLayer.zoomToLayer()
        },
        loadScoutingKmzData (fileName){
            let url = envConfig.S3Path + '/' + this.projectInfo.project_id + '/UAV/input/' + fileName
            gwmap.scoutingLayer.load(url)
        },
        // 踏勘
        beforeWalkUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'kmz', 'kml')
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpWalkRequest (options){
            this.walk_uploading = true
            let that = this

            let data = new FormData()
            let fileName = options.file.name
            this.uploading_walk_name = fileName
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        let progress = (progressEvent.loaded / progressEvent.total * 100 | 0)
                        that.walk_progress_width = progress
                    }
                }
            }
            data.append('terrain_file', options.file)
            data.append('upload_type', 'scouting.kmz')
            data.append('file_name', 'scouting.kmz')

            postTerrainModel(that.projectInfo.project_id, data, config).then((res)=>{
                that.uploading_walk_name = null
                if(res.code != 200){
                    that.walk_progress_width = 0
                    that.fileName_walk = null
                    this.$message.error(res.message)
                    return
                }
                this.walk_progress_width = 0
                this.fileName_walk = fileName

                this.$store.commit('setSchemeMemu', {
                    type: 'scouting',
                    active: true
                })
                this.loadScoutingKmzData('scouting.kmz')
            }).catch((err)=>{
                that.walk_progress_width = 0
                that.fileName_walk = null
                that.uploading_walk_name = null
            })
        },
        // 发起计算
        getCalculationTerrain (){
            // 联调风场可选，只有地形即可计算
            // if (this.fileName_terrain && this.fileName_wind) {
            if (this.fileName_terrain) {
                // 先调一次状态接口，再正常提交
                this.waitingCalculate = true
                terrainStatus(this.projectInfo.project_id).then((res)=>{
                    calculationTerrain (this.projectInfo.project_id).then((res)=>{
                        if (res.code != 200){
                            this.$message.error(res.message)
                            return
                        }
                        this.$message.success(res.message)
                        this.waitingCalculate = false
                        setTimeout(()=>{
                            this.getTerrainStatus()
                        }, 1000)
                    }).catch((err)=>{
                        console.log(err)
                        this.$message.error("发起计算失败")
                        this.waitingCalculate = false
                    })
                }).catch((err)=>{
                    this.waitingCalculate = false
                })
            }
        },
        // 计算状态
        getTerrainStatus (type){
            
            // if(!this.fileName_terrain && !this.fileName_wind){
            
            console.log(this.fileName_terrain, "地形计算接口")
            if(!this.fileName_terrain){
                return
            }
            terrainStatus(this.projectInfo.project_id).then((res)=>{
                if (res.code == 200){
                    this.terrainStatusInfo = res.data
                    let statuss = this.terrainStatusInfo.some((item, index)=>{
                        return item.status == 1 || item.status == 0
                    })
                    let terrainPath = this.terrainStatusInfo.some((item, index)=>{
                        return index == 1 && item.status == 2
                    })
                    let heightPath = this.terrainStatusInfo.some((item, index)=>{
                        return index == 2 && item.status == 2
                    })
                    let fatPath = this.terrainStatusInfo.some((item, index)=>{
                        return index == 3 && item.status == 2
                    })
                    this.$store.commit('calculateStatus', {
                        type: 'terrain',
                        data: this.terrainStatusInfo
                    })
                    
                    if(this.terrainCalculateStatus){
                        clearTimeout(this.terrainCalculateStatus)
                    }
                    // 地形
                    if (terrainPath && !this.all_server_path){
                        this.initAllUploadName()
                    }
                    // 等高线 
                    if (heightPath && !this.contour_server_path){
                        this.initAllUploadName()
                    }
                    // 限制因素
                    if (fatPath && !this.restriction_url){
                        this.initAllUploadName()
                    }
                    if (statuss) {
                        this.terrainCalculateStatus = setTimeout(()=>{
                            this.getTerrainStatus()
                        }, 4000)
                    }
                } else{
                    this.terrainStatusInfo = null
                }
                
            })
        }

    }
}
</script>
<style lang="scss" scoped>
.upload-terrain{
    width: 3.86rem;
    height: 100%;
    background:rgba(255,255,255,1);
    border-radius: 0.18rem;
    /deep/ .el-radio__label{
        color: #333333;
    }
    /deep/ .defaultUpload{
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        z-index: -9;
        width: 10px;
    }
    .srtmTerrain{
        width: 3rem;
        margin: 0 0 0.15rem 0;
        /deep/ .el-button{
            width: 1.45rem;
            height: 0.45rem;
            border-radius: 0.16rem;
        }
        /deep/ .el-input{
            width: 2.4rem;
            height: 0.25rem;
        }
        /deep/ .el-input__inner{
            width: 2.4rem;
            height: 0.25rem;
            background:rgba(235,242,228,1);
            border-radius: 0.07rem;
        }
        &>div:nth-of-type(1),&>div:nth-of-type(2){
            height: 0.3rem;
            line-height: 0.3rem;
            display: flex;
            justify-content: space-between;
        }
        .btn{
            display: flex;
            justify-content: space-between;
            margin-top: 0.1rem;
        }
    }

    .terrainRadio{
        // height: 0.6rem;
        height: 0.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .content{
        // overflow: auto;
        height: 100%;
        &>div{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
}
.upload-button{
    cursor: pointer;
    margin-bottom: 0.11rem;
    width: 3rem;
    height: 0.45rem;
    background:rgba(235,242,228,1);
    border: 1px dashed rgba(178,191,142,1);
    border-radius: 0.13rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont{
        color: #8A9A5E;
        position: relative;
        top: 1px;
        right: 0.05rem;
    }
}

.opacityShow{
    opacity: 0;z-index: -1;top:0;left:0;position: absolute;
}
.nameTitle{
    position: relative;
    top: -0.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 3rem;
    height: 0.2rem;
    font-size: 0.11rem;
    &>span:nth-of-type(1){
        flex: 1;
    }
    &>span:nth-of-type(2){
        min-width: 35px;
    }
}
</style>