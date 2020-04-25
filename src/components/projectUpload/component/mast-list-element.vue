<template>
    <div class="mast-list-element">
        <div :class="list.show ? 'showContent' : ''">
            <el-form label-width="1rem" :model="list" :ref="'mast'+ index" :show-message="false">
                <div class="close" @click="removeMast(list, index)"><i class="iconfont icon-close"></i></div>

                <el-tooltip class="item" effect="light" content="选择主测风塔" placement="top">
                    <span class="my_checkbox_input_circle" :class="{ is_checked : list.main_mast }"
                    @click="changeCheckbox($event, list)"></span>
                </el-tooltip>
                
                <i class="iconfont icon-dianta"></i>
                <el-form-item :label="$t('m.windTowerName')" class="title" prop="mast_name" :rules="{validator: validateAzNumber, trigger: 'blur' }">
                    <el-tooltip class="item" 
                    effect="light"
                    :content="validate_mast_name_value"
                    :disabled="!validate_mast_name_value"
                    :visible-arrow="false"
                    placement="top">
                        <el-input v-model="list.mast_name" :placeholder="$t('m.pleaseEnter')" 
                        @blur="onBlur('mast_name', list.mast_name)"  
                        @focus="onBlur('mast_name', list.mast_name)"></el-input>
                    </el-tooltip>
                    <span @click="onClickOpen" class="showrotateCon" :class="list.show ? 'rotateCon' : ''"><i class="el-icon-arrow-right"></i></span>
                </el-form-item>

                <el-form-item :label="$t('m.coordinateX')" prop="coordinate_x" :rules="{validator: validateX, trigger: 'blur' }">
                    <el-tooltip class="item" 
                    effect="light"
                    :content="validate_x_value"
                    :disabled="!validate_x_value"
                    :visible-arrow="false"
                    placement="top">
                        <el-input v-model="list.coordinate_x" :placeholder="$t('m.pleaseEnter')" 
                        @blur="onBlur('lon', list.coordinate_x)"  
                        @focus="onBlur('lon', list.coordinate_x)" type="number"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item :label="$t('m.coordinateY')" prop="coordinate_y" :rules="{validator: validateY, trigger: 'blur' }">
                    <el-tooltip class="item" 
                    effect="light"
                    :content="validate_y_value"
                    :disabled="!validate_y_value"
                    :visible-arrow="false"
                    placement="top">
                        <el-input v-model="list.coordinate_y" :placeholder="$t('m.pleaseEnter')" 
                        @blur="onBlur('lat', list.coordinate_y)"  
                        @focus="onBlur('lat', list.coordinate_y)" type="number"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item :label="$t('m.calculatedHeight')" prop="mast_height" :rules="{validator: validateHeight, trigger: 'blur' }">
                    <el-tooltip class="item" 
                    effect="light"
                    :content="validate_mast_height_value"
                    :disabled="!validate_mast_height_value"
                    :visible-arrow="false"
                    placement="top">
                        <el-input v-model="list.mast_height" :placeholder="$t('m.pleaseEnter')" 
                        @blur="onBlur('mast_height', list.mast_height)"  
                        @focus="onBlur('mast_height', list.mast_height)" type="number"></el-input>
                    </el-tooltip>
                </el-form-item>

                <!-- <el-form-item class="buttonForm" prop="mast_file_tim" :rules="{validator: validateFile, trigger: 'change' }"> -->
                <el-form-item class="buttonForm" >
                    <upload-button :class="list.tim_uploading? 'uploading' :''" :style="!list.mast_file_tim ? '' : 'border-color: #2cd0b9'"
                    :width="list.tim_progress_width"
                        :type="22" :fileName="list.mast_file_tim" 
                        @removeFile="removeFile"
                        @clickUpload="onClickUpload"></upload-button>
                </el-form-item>
                <div class="nameTitle" v-if="list.tim_progress_width"> 
                        <span class="ellipsis">{{ list.mast_file_tim_progress }}</span> 
                        <span>{{list.tim_progress_width}} %</span> </div>
                <!-- <el-form-item class="buttonForm" prop="mast_file_txt" :rules="{validator: validateFile, trigger: 'change' }"> -->
                <el-form-item class="buttonForm">
                    <upload-button :class="list.txt_uploading? 'uploading' :''" :style="!list.mast_file_txt ? '' : 'border-color: #2cd0b9'"
                    :width="list.txt_progress_width"
                        :type="23" :fileName="list.mast_file_txt" 
                        @removeFile="removeFile"
                        @clickUpload="onClickUpload"></upload-button>
                </el-form-item>
                <div class="nameTitle" v-if="list.txt_progress_width"> 
                        <span class="ellipsis">{{ list.mast_file_txt_progress }}</span> 
                        <span>{{list.txt_progress_width}} %</span> </div>

                <div class="btnSubmit"><div @click="onMastSubmit(list, index)">提交</div></div>
            </el-form>

            <el-upload  action="/"  class="defaultUpload" accept=".tim"
                :before-upload="beforeTimUpload" 
                :http-request="httpTimRequest">
                <button ref="TimUpload"></button>
            </el-upload>
            <el-upload  action="/"  class="defaultUpload" accept=".txt"
                :before-upload="beforeTxtUpload" 
                :http-request="httpTxtRequest">
                <button ref="TxtUpload"></button>
            </el-upload>
            
            
            <el-upload  action="/"  class="defaultUpload" accept=".txt"
                :before-upload="beforeReadTXTUpload" 
                :http-request="httpReadTXTRequest">
                <button ref="readTXTUpload"></button>
            </el-upload>

        </div>
    </div>
</template>
<script>
import uploadButton from "./upload-button.vue"
import uploadTxtConfirm from "./upload-txt-confirm.vue"
import { verifyFileNameCheck, verifyFileName, verifyFileNameLength, validateAzNumber, validateWGS84X, validateWGS84Y, valUTMX, validateCoordinateX, validateCoordinateY, validateHeight, validateFile } from "@/utils/validate"
import { mapState } from "vuex";
import { postMastTimTxt, putMastMain } from "@/api/server.request.js"
import { txtConfirmRead } from "@/api/goldLab.request.js"
export default {
    name: 'mast-list-element',
    props:{
        list: {},
        index: {},
        mastList: {}
    },
    components:{
        uploadButton,
        uploadTxtConfirm
    },
    data (){
        return{
            waitingGlodLab: false,
            txtConfirmData: null,
            validate_x_value:'',
            validate_y_value:'',
            validate_mast_height_value:'',
            validate_mast_name_value:'',
            waitingMinute: false,
            validateAzNumber: validateAzNumber,
            validateHeight: validateHeight,
            validateFile: validateFile,
            // show: false,
            tim_uploading: false,
            fileName_tim: false,
            txt_uploading: false,
            fileName_txt: false,

        }
    },
    computed:{
        ...mapState({
            verifiEpsgModel: state => state.app.verifiEpsgModel,
            projectInfo: state => state.app.projectInfo,
        }),
        validateX (){
            if (this.verifiEpsgModel == 1){
                return validateWGS84X;
            } else if (this.verifiEpsgModel == 2){
                return valUTMX;
            } else{
                return validateCoordinateX;
            }
        },
        validateY (){
            if (this.verifiEpsgModel == 1){
                return validateWGS84Y;
            } else if (this.verifiEpsgModel == 2){
                return validateCoordinateY;
            } else{
                return validateCoordinateY;
            }
        }
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.uploading')});
        },
        waitingGlodLab () {
            this.$store.dispatch('handleLoading', {loading: this.waitingGlodLab, text: '正在解析数据，请稍候...'});
        },
    },
    mounted (){
        
    },
    beforeDestroy (){
        
    },
    methods:{
        // new txt上传
        beforeReadTXTUpload (file){
            
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'txt', 'txt', true)
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpReadTXTRequest (options){
            let that = this
            this.list.txt_uploading = true
            this.list.mast_file_txt_progress = options.file.name

            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        let progress = (progressEvent.loaded / progressEvent.total * 100 | 0)-2
                        that.list.txt_progress_width = progress
                    }
                }
            };
            data.append('file', options.file)

            this.waitingGlodLab = true
            txtConfirmRead(data, config).then((res)=>{
                this.list.txt_progress_width = 0
                this.waitingGlodLab = false
                if(res.code != 200){
                    this.list.txt_uploading = false
                    this.list.mast_file_txt_progress = null
                    this.list.txt_uploading = false
                    this.$message.error(res.msg || '解析错误')
                    return
                }
                this.$emit('opentxtConfirm', res.data, options.file.name, this.index)
                
            }).catch((err)=>{
                console.log(err)
                this.list.txt_progress_width = 0
                this.waitingGlodLab = false
                this.list.txt_uploading = false
                this.list.mast_file_txt_progress = null
                this.list.txt_uploading = false
            })
        },
        changeCheckbox (ev, list){
            if (list.main_mast) return;

            this.mastList.forEach((item, index)=>{
                item.main_mast = false
            })
            list.main_mast = true
            this.$store.commit('setMainMast', list.mast_id)
            
            console.log(list.mast_id)
            if (!list.mast_id) return;
            putMastMain(this.projectInfo.project_id, list.mast_id).then((res)=>{
                if(res.code != 201){
                    this.$message.error(res.message)
                    // 刷新列表
                    this.$emit('refreshMastList')
                    return
                }
                this.$message.success(res.message)
            }).catch((err) =>{
                this.$emit('refreshMastList')
            })
            
        },
        onMastSubmit (item, index){
            var validateFlag = false
            this.$refs['mast'+index].validate((valid) => {
                validateFlag = valid
            })
            if(!validateFlag){
                this.$message.error(this.$t('m.messErrTip'))
                return
            }
            // this.$store.commit('refreshWindLayer', false)
            this.$emit("onMastSubmit", item, index, (res)=>{
                // 提交成功后操作
                if(res){
                    this.$store.commit('refreshWindLayer', true)
                    this.onClickOpen()
                    // 显示测风塔
                    this.$store.commit('setSchemeMemu', {
                        type: 'windModel'
                    })
                }
            })
        },
        onClickOpen (){
            this.list.show = !this.list.show
        },
        removeFile (type){
            
            
            if (type == 22){
                this.list.mast_file_tim = ''
                this.list.tim_uploading = false
            }
            if (type == 23){
                this.list.mast_file_txt = ''
                this.list.txt_uploading = false
            }
        },
        onClickUpload (type){
            

            if (type == 22){
                this.$refs.TimUpload.click()
            }
            if (type == 23){
                // this.$refs.TxtUpload.click()

                this.$refs.readTXTUpload.click()
            }
            
        },
        removeMast (list, index){
            this.$confirm(this.$t('m.removeWindTowerData'), this.$t('m.hint'), {
                confirmButtonText: this.$t('m.confirm'),
                cancelButtonText: this.$t('m.cancel'),
                type: 'warning'
            }).then(() => {
                this.$emit('removeMastElement', list, index)
                this.$refs['mast'+index].resetFields()
            }).catch(() => {
                         
            });
            
        },
        // 上传tim
        beforeTimUpload (file){
            
            if (this.list.tim_progress_width != 0){
                this.$message.error('已有文件上传中，请稍后重试')
                return false
            }
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'tim', 'tim', true)
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpTimRequest (options){
            let fileName = options.file.name
            this.postMastTimTxtFile(options, 'tim', (res) =>{
                this.list.mast_file_tim = fileName
                this.list.tim_uploading = true
            })
        },

       

        // 废弃
        // 上传txt---txt
        beforeTxtUpload (file){
            if (this.list.txt_progress_width != 0){
                this.$message.error(this.$t('m.uploadloading'))
                return false
            }
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'txt', 'txt', true)
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpTxtRequest (options){
            let fileName = options.file.name
            this.postMastTimTxtFile(options, 'txt', (res) =>{
                if(!res){

                    return
                }
                this.list.mast_file_txt = fileName
                
            })
        },
        postMastTimTxtFile (options, type, callback){
            if(type == 'tim'){
                this.list.tim_uploading = true
                this.list.mast_file_tim_progress = options.file.name
            }else{
                this.list.txt_uploading = true
                this.list.mast_file_txt_progress = options.file.name
            }
            let that = this
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 99999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        let progress = (progressEvent.loaded / progressEvent.total * 100 | 0)-2
                        if(type == 'tim'){
                            that.list.tim_progress_width = progress
                        }else{
                            that.list.txt_progress_width = progress
                        }
                    }
                }
            }
            if(type == 'tim'){
                data.append('mast_file_tim', options.file)
            } else if(type == 'txt'){
                data.append('mast_file_txt', options.file)
            }
            // this.waitingMinute = true
            postMastTimTxt(this.projectInfo.project_id, data, config).then((res)=>{
                // this.waitingMinute = false
                if(type == 'tim'){
                    this.list.tim_progress_width = 0
                }else{
                    this.list.txt_progress_width = 0
                }
                if (res.code == 201){
                    callback(type)
                } else{
                    callback(null)
                }
            }).catch((err)=>{
                if(type == 'tim'){
                    this.list.tim_progress_width = 0
                }else{
                    this.list.txt_progress_width = 0
                }
                callback(null)
            })
        },
        onBlur(type, value){
            let that = this
            switch (type){
                case 'mast_name':
                    if (!value){
                        this.validate_mast_name_value = this.$t('m.validateMastNameNone')
                    } 
                    else if (!/^[0-9a-zA-Z]+$/.test(value)){
                        this.validate_mast_name_value = this.$t('m.validateAZ09')
                    }
                    else {
                        this.validate_mast_name_value = '';
                    }
                break;
                case 'mast_height':
                    if (!value){
                        this.validate_mast_height_value = this.$t('m.validateMastHeightNone')
                    } 
                    else if(value >300 || value <= 0){
                        this.validate_mast_height_value = this.$t('m.validate300')
                    }
                    else {
                        this.validate_mast_height_value = '';
                    }
                break;
                case 'lon':
                    if (!value){
                        this.validate_x_value = this.$t('m.validateXnone')
                    } else if (this.verifiEpsgModel == 1 && !/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(value)){
                        this.validate_x_value = this.$t('m.validateX180')
                    } else if (this.verifiEpsgModel == 2 && !/^[\d]{6}(\.\d{1,4})?$/.test(value)){
                        this.validate_x_value = this.$t('m.validateX6')
                    } else if (this.verifiEpsgModel == 3 && !/^[\d]{8}(\.\d{1,4})?$/.test(value)){
                        this.validate_x_value = this.$t('m.validateX8')
                    } else{
                        this.validate_x_value = ''
                    }
                break;
                case 'lat':
                    if (!value){
                        this.validate_y_value = this.$t('m.validateYnone')
                    } else if (this.verifiEpsgModel == 1 && !/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(value)){
                        this.validate_y_value = this.$t('m.validateY90')
                    } else if (this.verifiEpsgModel == 2 && !/^[\d]{7}(\.\d{1,4})?$/.test(value)){
                        this.validate_y_value = this.$t('m.validateY7')
                    } else if (this.verifiEpsgModel == 3 && !/^[\d]{7}(\.\d{1,4})?$/.test(value)){
                        this.validate_y_value = this.$t('m.validateY7')
                    } else{
                        this.validate_y_value = ''
                    }
                break;
            }

        }
    }
}
</script>
<style lang="scss" scoped>
.mast-list-element{
    width: 100%;
    background:rgba(255,255,255,1);
    box-shadow: 0px 0px 10px 0px rgba(216,232,230,1);
    border-radius: 0.16rem;
    margin-bottom: 0.05rem;
    /deep/ .el-form{
        position: relative;
    }
    /deep/ .el-input__inner{
        border: none;
        width: 75%;
        margin-left: 0.1rem;
        padding: 0 0 0 0.1rem;
    }
    /deep/ .el-input::placeholder{
        font-size: 0.11rem;
    }
    /deep/ .el-form-item__content, /deep/ .el-form-item, /deep/ .el-form-item__label, /deep/ .el-input, /deep/ .el-input__inner{
        line-height: 0.22rem;
        height: 0.22rem;
    }
    /deep/ .is-error .upload-button{
        border: 1px solid #F56C6C;
    }
    /deep/ .el-form-item__label{
        padding: 0;
        position: relative;
        top: 1px;
    }
    /deep/ .el-form-item{
        display: flex;
        padding: 0 0 0 0.35rem;
        .el-form-item__content{
            margin: 0 !important;
        }
    }
    /deep/ .buttonForm{
        line-height: 0.45rem;
        height: 0.45rem;
        margin-top: 0.1rem;
        padding: 0 0 0 0.25rem;
    }
    .icon-dianta{
        position: absolute;
        left: 0.3rem;
        top: 0.15rem;
        font-size: 0.23rem;
    }
    .showrotateCon{
        position: absolute;
        right: 0.2rem;
        top: 3px;
    }
    .close{
        cursor: pointer;
        width: 0.3rem;
        height: 0.3rem;
        line-height: 0.3rem;
        text-align: center;
        background:rgba(255,255,255,1);
        box-shadow: 0px 0px 6px 0px rgba(216,232,230,1);
        border-radius:50%;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 111;
        display: none;
    }
    *{
        transition: all 0.4s;
    }
    &>div{
        height: 0.54rem;
        overflow: hidden;
    }
    .showContent{
        height: initial;
        padding-bottom: 0.1rem;
    }
    /deep/ .title{
        height: 0.51rem;
        display: flex;
        align-items: center;
        padding: 0 0.2rem 0 0.35rem;
        .el-form-item__content{
            margin: 0 !important;
        }
        .el-icon-arrow-right{
            cursor: pointer;
        }
        .rotateCon{
            transform: rotate(90deg);
        }
    }
    /deep/ .el-form:hover .close{
        display: block;
    }
}
.btnSubmit{
    display: flex;
    justify-content: center;
    padding: 0.1rem 0.15rem 0 0;
    &>div{
        cursor: pointer;
        width: 1.57rem;
        height: 0.45rem;
        line-height: 0.45rem;
        text-align: center;
        color: #fff;
        background: rgba(44,208,185,1);
        border-radius: 0.16rem;
    }
    .disableClass{
        pointer-events: none !important;
        cursor: default !important;
        background: #ccc;
    }
}
.nameTitle{
    margin: 0 auto;
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
.my_checkbox_input_circle{
    position: absolute;
    top: 0.2rem;
    left: 0.13rem;
}
</style>