<template>
    <div class="upload-cfd">
        <!-- <div class="cfdSubmit" style="width: 3rem;margin: 0 auto;"><span @click="onSubmit">{{$t('m.submitCalculations')}}</span></div> -->
        <div class="title">
            <div>
                <!-- <el-radio v-model="form.cfd_radio" label="1"> {{$t('m.uploadDatData')}} </el-radio> -->
                <!-- <el-radio v-model="form.cfd_radio" label="2"> {{$t('m.uploadWrgData')}} </el-radio> -->
            </div>
        </div>
        <div class="content">
            <el-form ref="form" :model="form" label-width="0">
            <!-- <el-form ref="form" :model="form" label-width="0" :show-message="false"> -->
                <!-- <el-form-item prop="density" :rules="{validator: validateDensity, trigger: 'blur' }">
                    <div class="label label1">空气密度</div>
                    <el-tooltip class="item" 
                    effect="light"
                    :content="form.density ? form.density <=0 || form.density > 1.5 ? '取值范围0~1.5' : '' : '请输入空气密度' "
                    :visible-arrow="false"
                    placement="top">
                        <el-input v-model="form.density" type="number"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item prop="elevation" :rules="{validator: validateElevation, trigger: 'blur' }">
                    <div class="label label1">海拔</div>
                    <el-tooltip class="item" 
                    effect="light"
                    content="取值范围大于0"
                    :disabled="form.elevation >= 0"
                    :visible-arrow="false"
                    placement="top">
                        <el-input v-model="form.elevation" type="number"></el-input>
                    </el-tooltip>
                </el-form-item> -->
                <el-form-item prop="height" :rules="{validator: validateLayerheight, trigger: 'blur' }">
                    <div class="label2">{{$t('m.atlasHighly')}}</div>
                    <!-- <el-tooltip class="item" 
                    effect="light"
                    :content="form.height == '' ? this.$t('m.iptAtlasHighly') : ''"
                    :vsible-arrow="false"
                    placement="top"> -->
                        <el-input v-model="form.height" type="number"></el-input>
                    <!-- </el-tooltip> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="footer">
            <upload-button :type="33" @clickUpload="onClickCfd"></upload-button>
        </div>
        <div class="cfdButton" v-for="(item, index) of cfdDataList" :key="index" >
            <cfd-upload-button :class="item.cfd_uploading? 'uploading' :''" :type="30" v-show="item.isShow" :ref="'cfd'+index"
            :style="item.opacityShow? 'opacity: 0;z-index: -1;top:0;left:0;position: absolute;' : ''"
            :fileName="item.cfd_fileName" :ids="item.id" :formHeight="item.formHeight" :project="projectInfo.project_id" :height="form.height" :width="item.cfd_progress_width"
            :uploadIndex="(index+1)"
            @changeOpacityShow="changeOpacityShow"
            @removeLength="removeLength"
            @removeFile="removeCfdFile"
            @changeCfdStatus="changeCfdStatus"></cfd-upload-button>
            <div class="nameTitle" v-if="item.cfd_progress_width"> <span class="ellipsis">高度为：{{ item.height }}</span> <span>{{item.cfd_progress_width}} %</span> </div>
        </div>

    </div>
</template>
<script>
import { mapState } from "vuex";
import uploadButton from "./upload-button.vue"
import cfdUploadButton from "./cfd-upload-button.vue"
import { verifyFileName, validateDensity, validateElevation, validateLayerheight } from "@/utils/validate"
import { postCfdForm, getCfdInfo, deleteCfdFile, postCfdCalculate, cfdStatus } from "@/api/server.request.js"
export default {
    name: 'upload-cfd',
    components:{
        uploadButton,
        cfdUploadButton
    },
    data (){
        return{
            validateDensity: validateDensity,
            validateElevation: validateElevation,
            validateLayerheight: validateLayerheight,
            cfdDataList:[],
            form:{
                cfd_radio: '2',
                height: 90
            },
            cfdStatusInfo: null,
            cfdCalculateStatus: null
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            recalculate: state => state.projectUpload.recalculate,
        })
    },
    watch:{
        recalculate (type){
            if(type == 'cfd'){
                this.onSubmitPostCfdForm()
            }
        }
    },
    mounted (){
        this.init()
    },
    beforeDestroy (){
        this.cfdDataList = []
        clearTimeout(this.cfdCalculateStatus)
        
    },
    methods:{
        init (){
            getCfdInfo(this.projectInfo.project_id).then((res)=>{
                this.cfdDataList = []
                if(res.code == 200){
                    this.cfdDataList = res.data.map((item, index)=>{
                        return{
                            id:  Math.floor(Math.random() * 10000),
                            cfd_fileName: item.height + '/' + item.wrg_name,
                            cfd_uploading: true,
                            cfd_progress_width: 0,
                            height: item.height,
                            isShow: true,
                            opacityShow: false
                        }
                    })
                }
                this.getCfdStatus()
            })
        },
        removeCfdFile (uploadIndex, fileName, fileNameHeight, ids){
            this.$confirm(this.$t('m.removeFileData'), this.$t('m.hint'), {
                confirmButtonText: this.$t('m.confirm'),
                cancelButtonText: this.$t('m.cancel'),
                type: 'warning'
            }).then(() => {
                deleteCfdFile({
                    project_id: this.projectInfo.project_id,
                    wrg_file_name: fileName,
                    height: fileNameHeight
                }).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                    return
                    }
                    this.$message.success(res.message)
                    this.cfdDataList = this.cfdDataList.filter((item, index)=>{
                        return item.id != ids
                    })
                    this.getCfdStatus()
                })
            }).catch(() => {
                         
            })
            
        },
        onClickCfd (){
            // if (!this.form.height){
            //     this.$message.error(this.$t('m.wrgheightSet'))
            //     return
            // }
            let isHeight = this.cfdDataList.some((item, index)=>{
                return item.height == this.form.height
            })
            if (isHeight){
                this.$message.error(this.$t('m.messErrWrgH1')+ this.form.height + this.$t('m.messErrWrgH2'))
                return
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.pushCfdUpload()
                } else {
                    return false;
                }
            })
        },
        removeLength (ids){
            // this.cfdDataList.splice(this.cfdDataList.length-1, 1)
            this.cfdDataList = this.cfdDataList.filter((item, index)=>{
                return item.id != ids
            })
        },
        pushCfdUpload (){
            let that = this
            this.cfdDataList.push({
                id:  Math.floor(Math.random() * 10000),
                cfd_fileName: '',
                cfd_uploading: false,
                cfd_progress_width: 0,
                height: '',
                formHeight: this.form.height,
                isShow: true,
                opacityShow: true
            })
            var len = this.cfdDataList.length-1
            setTimeout(()=>{
                that.$refs['cfd'+ len][0].$el.click()
            },200)
        },
        changeOpacityShow (index, ids){
            // this.cfdDataList[index-1].opacityShow = false
            this.cfdDataList = this.cfdDataList.map((item, index)=>{
                if(item.id == ids){
                    item.opacityShow = false
                }
                return item
            })
        },
        changeCfdStatus (type, data, uploadIndex, height, ids){
            // console.log(type, data, uploadIndex, height, ids)
            this.cfdDataList = this.cfdDataList.map((item, index)=>{
                // console.log(item.id)
                switch (type){
                    case 'cfd_progress_width':
                        if(item.id == ids){
                            item.cfd_progress_width = data
                        }
                    break
                    case 'start':
                        if(item.id == ids){
                            item.cfd_uploading = true
                            item.cfd_fileName = height + '/' + data
                            item.height = height
                        }
                    break
                    case 'end':
                        if(item.id == ids){
                            item.cfd_progress_width = 0
                            item.cfd_fileName = height + '/' + data
                            item.height = height
                            this.getCfdStatus()
                            this.form.height = ''
                        }
                    break
                    case 'err':
                        if(item.id == ids){
                            item.cfd_progress_width = 0
                            item.cfd_fileName = null
                        }
                    break
                }
                return item
            })
            // switch (type){
            //     case 'cfd_progress_width':
            //         this.cfdDataList[uploadIndex-1].cfd_progress_width = data
            //     break
            //     case 'start':
            //         this.cfdDataList[uploadIndex-1].cfd_uploading = true
            //         this.cfdDataList[uploadIndex-1].cfd_fileName = height + '/' + data
            //         this.cfdDataList[uploadIndex-1].height = height
            //         // console.log(type, data, uploadIndex, height)
            //         // console.log(this.cfdDataList[uploadIndex-1].cfd_fileName)
            //     break
            //     case 'end':
            //         this.cfdDataList[uploadIndex-1].cfd_progress_width = 0
            //         this.cfdDataList[uploadIndex-1].cfd_fileName = height + '/' + data
            //         this.cfdDataList[uploadIndex-1].height = height
            //         this.getCfdStatus()
            //         this.form.height = ''
            //     break
            //     case 'err':
            //         this.cfdDataList[uploadIndex-1].cfd_progress_width = 0
            //         this.cfdDataList[uploadIndex-1].cfd_fileName = null
            //     break
            // }
        },
        onSubmit (){
            // this.onSubmitPostCfdForm()
        },
        // // 计算cfd
        onSubmitPostCfdForm (){
            postCfdCalculate(this.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                this.getCfdStatus()
            })
        },
        getCfdStatus (){
            // console.log(this.cfdDataList)
            cfdStatus(this.projectInfo.project_id).then((res)=>{
                if(res.code == 200){
                    this.cfdStatusInfo = res.data.filter((item, index)=>{
                        return item.wrg_height
                    })
                    let statuss = this.cfdStatusInfo.some((item, index)=>{
                        return item.status == 1 || item.status == 0
                    })
                    
                    if(this.cfdStatusInfo.length >0){
                        this.$store.commit('setSchemeMemu', {
                            type: 'simulationData'
                        })
                    }else{
                        this.$store.commit('setSchemeMemu', {
                            type: 'clearSimulation'
                        })
                    }
                    this.$store.commit('calculateStatus', {
                        type: 'cfd',
                        data: this.cfdStatusInfo
                    })
                    if(this.cfdCalculateStatus){
                        clearTimeout(this.cfdCalculateStatus)
                    }
                    if (this.cfdStatusInfo.length <= 0){
                        this.$store.commit('calculateStatus', {
                            type: 'clearcfd'
                        })
                        return
                    }
                    if(statuss && this.cfdStatusInfo.length >0 ){
                        this.cfdCalculateStatus = setTimeout(()=>{
                            this.getCfdStatus()
                        }, 5000)
                    }
                    
                }
                
            }).catch((err)=>{
                clearTimeout(this.cfdCalculateStatus)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.upload-cfd{
    width: 3.86rem;
    background:rgba(255,255,255,1);
    border-radius: 0.18rem;
    .cfdSubmit{
        display: flex;
        justify-content: flex-end;
        padding: 0.1rem 0 0 0;
        span{
            cursor: pointer;
            display: inline-block;
            padding: 0.06rem 0.1rem;
            background:rgba(44,208,185, 0.8);
            color: #fff;
            font-size: 0.13rem;
            border-radius: 0.11rem;
        }
    }
    .title{
        padding: 0 0 0.1rem 0.55rem;
        /deep/ .el-radio{
            color: #333;
            margin-bottom: 0.1rem;
        }
        &>div{
            display: flex;
            flex-direction: column;
        }
    }
    .content{
        padding: 0 0 0 0.5rem;
        /deep/ .el-input, /deep/ .el-input__inner, /deep/ .el-form-item__content, /deep/ .el-form-item__label{
            height: 0.26rem;
            line-height: 0.26rem;
        }
        /deep/ .el-form-item__content{
            display: flex;
        }
        /deep/ .el-input{
            width: 1.6rem;
            margin-left: 0.1rem;
        }
        /deep/ .el-form-item__error{
            width: 100%;
            text-align:center;
            padding-left: 0.05rem;
        }
        /deep/ .el-input__inner{
            background:rgba(235,242,228,1);
            border-radius: 0.07rem;
            border: none;
        }
        .label{
            width: 1.2rem;
            padding-right: 0.4rem;
            text-align: justify;
            text-align-last: justify;
        }
        .label2{
            width: 1.2rem;
        }
        .label1:after{
            content: ":";
            position: absolute;
        }
    }
    .footer{
        display: flex;
        justify-content: center;
        margin-top: 0.2rem;
    }
    .cfdButton{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .redBorder{
        border: 1px solid #F56C6C;
    }
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