<template>
    <div class="upload-status">
        <div class="title"> 
            <span>{{$t('m.status')}}</span> 
            <span>{{$t('m.steps')}}</span> 
            <span><span v-if="type == 'fan'">{{$t('m.operation')}}</span></span> 
        </div>
       <ul v-if="type == 'terrain'">
            <li v-for="(item, index) of terrainStatus" :key="index" v-show="item.show" class="li">
                <el-tooltip class="item" effect="light" :content="item.error_msg" placement="top">
                    <span class="span"><span :class="item.iconLeft == 'icon-jinhangzhong'?'jinhangzhong':''"><i :class="'iconfont '+ item.iconLeft"></i></span></span>
                </el-tooltip>
                <span class="ellipsis span"> {{$t('m.'+item.label)}} </span>
                <span @click="clickTerrainRight(item.iconRight)" class="btn span"><i :class="'iconfont '+ item.iconRight"></i></span>
            </li>
       </ul>
       <ul v-if="type == 'mast'">
            <li v-for="(item, index) of mastStatus" :key="index" v-show="item.show" class="li">
                <el-tooltip class="item" effect="light" :content="item.error_msg" placement="top">
                    <span class="span"><span :class="item.iconLeft == 'icon-jinhangzhong'?'jinhangzhong':''"><i :class="'iconfont '+ item.iconLeft"></i></span></span>
                </el-tooltip>
                <span class="ellipsis span"> {{item.mast_task ? '测风塔: '+ item.mast_task : '测风置信度'}} </span>
                <span @click="clickMastRight(item.iconRight)" class="btn span"><i :class="'iconfont '+ item.iconRight"></i></span>
            </li>
       </ul>
       <ul v-if="type == 'cfd'">
            <li v-for="(item, index) of cfdStatus" :key="index" v-show="item.wrg_height && item.show" class="li"> 
                <el-tooltip class="item" effect="light" :content="item.error_msg" placement="top">
                    <span class="span"><span :class="item.iconLeft == 'icon-jinhangzhong'?'jinhangzhong':''"><i :class="'iconfont '+ item.iconLeft"></i></span></span>
                </el-tooltip>
                <span class="ellipsis span"> {{item.wrg_height}} m 图谱解析</span>
                <span @click="clickCfdRight(item.iconRight)" class="btn span"><i :class="'iconfont '+ item.iconRight"></i></span>
            </li>
       </ul>
       <ul v-if="type == 'fan'">
            <li v-for="(item, index) of fanStatus" :key="index" v-show="item.show">
                <div class="li">
                    <el-tooltip class="item" effect="light" :content="item.error_msg" placement="top">
                        <span class="span"><span :class="item.iconLeft == 'icon-jinhangzhong'?'jinhangzhong':''"><i :class="'iconfont '+ item.iconLeft"></i></span></span>
                    </el-tooltip>    
                    <span class="ellipsis span" :class="{disableColor : item.iconLeft == 'icon-jinzhi'}"> {{$t('m.'+item.label)}} </span>
                    
                    <span class="span">
                        <el-tooltip class="item" effect="light" :content="returnTip(item)" placement="top">
                            <span @click="clickFanRight(item.iconRight, item.label, item)" class="btn">
                                <i :class="'iconfont '+ item.iconRight"></i>
                            </span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" :content="returnTip2(item)" placement="top">
                            <span @click="clickFanRight(item.iconRight2, item.label, item)" v-if="item.iconRight2" class="btn">
                                <i :class="'iconfont '+ item.iconRight2"></i>
                            </span>
                        </el-tooltip>
                    </span>

                    <!-- 道路 -->
                    <div v-if="importModel == index && roadShow" class="roadClass">
                        <span class="name ellipsis"> {{fileName_dxf_progress}} </span>
                        <p class="poss"> <span>{{dxf_progress_width}} %</span> <span>请勿切换界面</span> </p>
                    </div>
                    <!-- 线路 -->
                    <div v-if="importModel == index && lineShow" class="roadClass">
                        <span class="name ellipsis"> {{fileName_zip_progress}} </span>
                        <p class="poss"> <span>{{zip_progress_width}} %</span> <span>请勿切换界面</span> </p>
                    </div>
                </div>

                
                <!-- 升压站 -->
                <div v-if="importModel == index && stationShow" class="stationClass">
                    <el-form ref="stationforms2" :model="stationform" label-width="20px" :show-message="false">
                        <el-form-item label="X:" prop="lon"
                        :rules="{validator: validateCoordinateX, trigger: 'blur'}">
                            <el-tooltip class="item" effect="light" 
                            :content="validate_lon_value"
                            :disabled="!validate_lon_value" placement="top">
                                <el-input v-model="stationform.lon"  type="number" 
                                @blur="onBlur('lon', stationform.lon)"  
                                @focus="onBlur('lon', stationform.lon)"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="Y:" class="latItem"  prop="lat"
                        :rules="{validator: validateCoordinateY, trigger: 'blur'}">
                            <el-tooltip class="item" effect="light" 
                            :content="validate_lat_value"
                            :disabled="!validate_lat_value" placement="top">
                                <el-input v-model="stationform.lat" type="number" 
                                @blur="onBlur('lat', stationform.lat)"  
                                @focus="onBlur('lat', stationform.lat)"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <div class="button" @click="onSubmitStation">{{$t('m.confirm')}}</div>
                    </el-form>
                    
                </div>
            </li>
       </ul>


        <el-upload  action="/"  class="defaultUpload" accept=".dxf"
            :before-upload="beforeDXFUpload"
            :http-request="httpDXFRequest">
            <button ref="dxfImport"></button>
        </el-upload>
        <el-upload  action="/"  class="defaultUpload" accept=".zip"
            :before-upload="beforeZIPUpload"
            :http-request="httpZIPRequest">
            <button ref="zipImport"></button>
        </el-upload>
    </div>
</template>
<script>
import { mapState } from "vuex"; 
import { postZipFile, postDxfFile, postStationlonLat, station_get } from "@/api/server.request.js"
import { verifyFileNameCheck, verifyFileName, verifyFileNameLength, validateCoordinateX, validateCoordinateY } from "@/utils/validate"
export default {
    name: 'upload-status',
    props:{
        type:{
            default: 'terrain'
        }
    },
    data (){
        return{
            validateCoordinateX: validateCoordinateX,
            validateCoordinateY: validateCoordinateY,
            validate_lon_value: '',
            validate_lat_value: '',
            importModel: null,
            stationShow: false,
            stationform:{
                lon: '',
                lat: ''
            },
            waitingMinute: false,
            roadShow: false,
            dxf_progress_width: 0,
            fileName_dxf_progress: null,
            lineShow: false,
            zip_progress_width: 0,
            fileName_zip_progress: null
        }
    },
    computed:{
        ...mapState({
            terrainStatus: state => state.projectUpload.terrainStatus,
            mastStatus: state => state.projectUpload.mastStatus,
            cfdStatus: state => state.projectUpload.cfdStatus,
            fanStatus: state => state.projectUpload.fanStatus,
            projectInfo: state => state.app.projectInfo,
            scheme_id: state => state.app.scheme_id,
        }),
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.pleaseLater')});
        },
    },
    mounted (){
        
    },
    methods:{
        onBlur(type, value){
            let that = this
            switch (type){
                case 'lon':
                    if (!value){
                        this.validate_lon_value = this.$t('m.validateXnone')
                    } else if (!/^[\d]{8}(\.\d{1,4})?$/.test(value)){
                        this.validate_lon_value = this.$t('m.validateX8')
                    } else{
                        this.validate_lon_value = ''
                    }
                break;
                case 'lat':
                    if (!value){
                        this.validate_lat_value = this.$t('m.validateYnone')
                    } else if (!/^[\d]{7}(\.\d{1,4})?$/.test(value)){
                        this.validate_lat_value = this.$t('m.validateY7')
                    } else{
                        this.validate_lat_value = ''
                    }
                break;
            }
        },
        returnTip (item){
            if(item.iconRight == 'icon-refresh2'){
                return this.$t('m.autocalculate')
            }
            else{
                return ''
            }
            
        },
        returnTip2 (item){
            if(item.iconRight2 == 'icon-tiaoguo'){
                return this.$t('m.skipcalculate')
            }
            else if(item.iconRight2 == 'icon-daoru2'){
                return this.$t('m.importStatusTip')
            }
            else{
                return ''
            }
            
        },
        clickTerrainRight (type){
            // if (type == 'icon-yichang1i'){
            //     this.$store.commit("recalculate", 'terrain')
            // }
        },
        clickMastRight (type){
            // if (type == 'icon-yichang1'){
            //     this.$store.commit("recalculate", 'mast')
            // }
        },
        clickCfdRight (type){
            // if (type == 'icon-yichang1'){
            //     this.$store.commit("recalculate", 'cfd')
            // }
        },
        clickFanRight (type, label, item){
            console.log(type, label, item)
            //跳过
            if (type == 'icon-tiaoguo'){
                this.$store.commit("recalculateFan", {
                    type: 'skip',
                    label: label,
                    scheme_id: item.scheme_id
                })
            }
            //开始计算   、、  重新计算
            if (type == 'icon-kaishi' || type == 'icon-refresh2'){
                this.$store.commit("recalculateFan", {
                    type: 'recalculate',
                    label: label,
                    scheme_id: item.scheme_id
                })
            }
            //导入
            if (type == 'icon-daoru2'){
                // this.$store.commit("recalculateFan", {
                //     type: 'import',
                //     label: label,
                //     scheme_id: item.scheme_id
                // })
                // 新一版界面
                switch (label) {
                    case 'stationCalculation': // 升压站
                    this.importModel = 2
                    this.stationShow = !this.stationShow
                    if (this.stationShow){
                        this.initStationLon()
                    }
                    break;

                    case 'roadCalculation': // 道路
                    this.importModel = 1
                    this.$refs.dxfImport.click()
                    break;

                    case 'lineCalculation': // 线路
                    this.importModel = 3
                    this.$refs.zipImport.click()
                    break;
                }
            }
        },
        // 线路
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
            data.append('scheme_id', this.scheme_id);
            this.lineShow = true
            this.fileName_zip_progress = fileName
            postZipFile(data, config).then((res)=>{
                this.zip_progress_width = 0
                this.fileName_zip_progress = null
                this.lineShow = false
                if(res.code != 200){
                    this.$message.error(res.message)
                    
                    return
                }
                this.$message.success(res.message)
                // 刷新状态
                this.$store.commit('refreshFanStatus')
            }).catch((err)=>{
                this.zip_progress_width = 0
                this.lineShow = false
                this.fileName_zip_progress = null
            })
        },
        // 道路
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
            data.append('scheme_id', this.scheme_id);
            this.roadShow = true
            this.fileName_dxf_progress = fileName
            postDxfFile(data, config).then((res)=>{
                this.dxf_progress_width = 0
                this.fileName_dxf_progress = null
                this.roadShow = false

                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                // 刷新状态
                this.$store.commit('refreshFanStatus')
            }).catch((err)=>{
                this.dxf_progress_width = 0
                this.fileName_dxf_progress = null
                this.roadShow = false
            })
        },
        // 回显数据接口
        initStationLon (){
            this.waitingMinute = true
            station_get(this.projectInfo.project_id, this.scheme_id).then((res)=>{
                this.waitingMinute = false
                if(res.code != 200){
                    this.$message.error(res.meessage)
                    return
                }
                this.stationform = {
                    lon: res.data.syz_x,
                    lat: res.data.syz_y
                }
                
            }).catch((err)=>{
                this.waitingMinute = false
            })
        },
        // 提交升压站
        onSubmitStation (){
            let flag3 = true
            this.$refs.stationforms2[0].validate((valid) => {
                flag3 = valid
            })
            // console.log(flag3)
            if (!flag3){
                return
            }
            let data = {
                syz_x: this.stationform.lon,
                syz_y: this.stationform.lat,
                project_id: this.projectInfo.project_id,
                scheme_id: this.scheme_id
            }
            this.waitingMinute = true
            postStationlonLat(data).then((res)=>{
                this.waitingMinute = false
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                this.stationShow = false
                // 刷新状态
                this.$store.commit('refreshFanStatus')
            }).catch((err)=>{
                this.waitingMinute = false
            })
        }

    }
}
</script>
<style lang="scss" scoped>
.upload-status{
    width: 100%;
    .title{
        height: 0.35rem;
        line-height: 0.35rem;
        display: flex;
        text-align: center;
        span:nth-of-type(1){
            width: 0.7rem;
        }
        span:nth-of-type(2){
            flex: 1;
            padding-left: 0.2rem;
            text-align: left;
        }
        span:nth-of-type(3){
            width: 0.65rem;
            text-align: left;
        }
    }
    ul{
        height: 1.6rem;
        overflow-y: auto;
    }
    .li{
        height: 0.33rem;
        line-height: 0.33rem;
        display: flex;
        text-align: center;
        position: relative;
        .span:nth-of-type(1){
            width: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .span:nth-of-type(2){
            flex: 1;
            padding-left: 0.2rem;
            text-align: left;
        }
        .span:nth-of-type(3){
            width: 0.55rem;
            text-align: left;
        }
    }
    li:hover{
        box-shadow:0px 0px 10px 0px rgba(216,232,230,1);
        border-radius: 0.13rem;
    }
    .iconfont{
        font-size: 0.18rem;
    }
    /* 开始 */
    .icon-kaishi{
        color: #01E2A1;
    }
    /* 重新计算 */
    .icon-refresh2{
        color: #01E2A1;
        font-size: 0.2rem;
        transform: rotateY(180deg);
    }
    /* 停止 */
    .icon-tingzhi{
        color: #8883FF;
    }
    /* 跳过 */
    .icon-tiaoguo{
        color: #FFC035;
        position: relative;
        left: -3px;
    }
    /* 禁用 */
    .icon-jinzhi{
        color: #ccc;
    }
    /* 从新导入 */
    .icon-daoru2{
        color: #8883FF;
        // font-size: 0.14rem;
        position: relative;
        top: 2px;
        transform: rotateY(180deg);
    }
    .icondaorucopy{
        margin: auto;
        position: absolute;
        left: 0.05rem;
        right: 0;
        top: -0.032rem;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0.17rem;
        height: 0.17rem;
        border-radius: 50%;
        border: 2px solid #FFC035;
    }
    /* //----------------------------------- */
    /* // 未开始 ... */
    .icon-weikaishi{
        color: #BE6CFE;
    }
    /* // 进行中  --> */
    .jinhangzhong{
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0.19rem;
        height: 0.19rem;
        
        border-radius: 50%;
        border: 2px solid #53A9FF;
    }
    .icon-jinhangzhong{
        color: #53A9FF;
        font-size: 0.15rem;
        position: relative;
        top: 1px;
    }
    /* // 计算完毕 √ */
    .icon-check{
        color: #01E2A1;
    }
    /* // 异常 ！ */
    .icon-yichang1{
        color: #FB5D3F;
    }
    
    .btn{
        cursor: pointer;
        width: initial !important;
    }
}
/deep/ .stationClass{
    width: 3rem;
    padding: 0 0 0 0.25rem;
    position: relative;
    left: -1px;
    .el-form{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.1rem;
    }
    .el-form-item{
        margin: 0;
        flex: 1;
    }
    .buttonForm{
        flex: initial;
        width: 50px;
    }
    .el-form-item__label, .el-form-item__content{
        line-height: 0.20rem;
        padding: 0;
        text-align: left;
    }
    .el-form-item__label{
        padding-left: 0.05rem;
    }
    .el-form-item__content{
        position: relative;
        .el-form-item__error{
            right: initial;
            left: 0;
            width: 200%;
        }
    }
    .el-input__inner{
        border: none;
        height: 0.20rem;
        background:rgba(235,242,228,1);
        border-radius: 0.02rem;
    }
    .button{
        width: 45px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 0.14rem;
        background:rgba(44,208,185,1);
        color: #fff;
        border-radius:4px;
        cursor: pointer;
        margin-left: 0.1rem;
    }
}

.roadClass{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 1.5rem;;
    height: 0.5rem;
    font-size: 0.12rem;
    // border: 1px solid red;
    display: flex;
    flex-direction: column;
    align-items: center;
    .name{
        color: #5F482E;
        display: inline-block;
        max-width: 1.5rem;
        height: 0.2rem;
        line-height: 0.2rem;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 6px 0px rgba(216,232,230,0.97);
        border-radius:2px;
    }
    .poss{
        color: #DB631C;
        width: 1.3rem;
        height: 0.2rem;
        line-height: 0.2rem;
        background:rgba(253,234,185,1);
        border-radius:2px;
    }
}
.disableColor{
    color: #C6D2D0;
}
</style>