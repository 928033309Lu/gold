<template>
    <div class="upload-button" @click="clickUpload">
        <i v-if="!fileName" :class="'iconfont '+ icon"></i>
        <div v-if="!fileName"> {{title}} </div>
        <el-tooltip class="item" 
            effect="light"
            :content="fileNameNew"
            :disabled="fileNameNew && fileNameNew.length <= 15 ? true : false"
            :visible-arrow="false"
            placement="top">
            <div v-show="fileName" class="fileNameNew ellipsis"> {{fileNameNew}}</div>
        </el-tooltip>
        <div class="removeIcon" @click.stop="removeFile" v-if="fileName && width <=0"><i class="iconfont icon-shanchu1"></i></div>
        <div class="progress" :style="{width: width + '%'}"></div>

        <el-upload  action="/"  class="defaultUpload" accept=".kmz,.kml"
            :before-upload="beforeAstrictUpload" 
            :on-change="onChange"
            :http-request="httpAstrictRequest">
            <button ref="astrictUpload"></button>
        </el-upload>
    </div>
</template>
<script>
import { verifyFileName, verifyFileNameLength, verifyFileNameCheck } from "@/utils/validate"
import { postTerrainModel } from "@/api/server.request.js"
import { mapState } from "vuex";
export default {
    name: 'astrict-upload-button',
    props:{
        icon: {
            default: 'icon-shangchuan1'
        },
        fileName: {
            default: null
        },
        fileNameNew: {
            default: null
        },
        astrict_Data:{
            default: []
        },
        uploadIndex: {
            default: 0
        },
        width:{
            default: 0
        }
    },
    data (){
        return{
            title: null,
            addFileName: null,
            progress: 0,
            isAdd: false
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
        }),
    },
    watch:{
        progress (val){
            this.$emit('changeAstrictStatus', 'astrict_progress_width', this.uploadIndex, val, this.fileName, this.addFileName)
        }
    },
    mounted (){
        this.init()
    },
    methods:{
        open (isAdd){
            this.isAdd = true
            this.$refs.astrictUpload.click()
        },
        onChange (value){
            this.$emit('changeOpacityShow', this.uploadIndex)
        },
        init (){
            this.title = this.$t('m.uploadFileConstraints')
        },
        clickUpload (){
            if(this.width >0){
                return
            }
            this.$refs.astrictUpload.click()
        },
        removeFile (){
            this.$emit('removeFile', this.uploadIndex, this.fileName, this.fileNameNew)
        },
        // 限制因素
        beforeAstrictUpload (file){
            // let checkName = this.astrict_Data.some((item, index) =>{
            //     return item.fileName_astrict_new == file.name
            // })
            // if(checkName){
            //     this.$message.error('请勿重复上传')
            //     if(!this.fileNameNew){
            //         this.$emit('removeLength')
            //         return false
            //     }else{
            //         return false
            //     }
            // }
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'kmz', 'kml')
            console.log(this.isAdd)
            if(length && files && nameCheck){
                return true
            }else{
                this.isAdd && this.$emit('removeLength') // 验证不通过把add的一行数据删了
                return false
            }
        },
        httpAstrictRequest (options){
            this.progress = 0
            this.$emit('changeAstrictStatus', 'astrict_uploading', this.uploadIndex, true, this.fileName, '')
            let that = this

            let data = new FormData()
            let fileName = options.file.name
            this.addFileName = options.file.name
            
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        that.progress = (progressEvent.loaded / progressEvent.total * 100 | 0)
                        // that.$emit('changeAstrictStatus', 'astrict_progress_width', progress)
                    }
                }
            }
            data.append('terrain_file', options.file)
            data.append('upload_type', 'factor.kmz')
            if (this.fileName){
                data.append('file_name', this.fileName)
            }else{
                data.append('file_name', 'factor_'+ this.uploadIndex +'.kmz')
            }

            postTerrainModel(that.projectInfo.project_id, data, config).then((res)=>{
                
                if(res.code != 200){
                    if (that.fileName){
                        that.$emit('changeAstrictStatus', 'err', this.uploadIndex, this.fileName, this.fileName, fileName)
                    }else{
                        that.$emit('changeAstrictStatus', 'err', this.uploadIndex, 'factor_'+ this.uploadIndex +'.kmz', this.fileName, fileName)
                    }
                    this.$message.error(res.message)
                    return
                }
                if (that.fileName){
                    that.$emit('changeAstrictStatus', 'end', this.uploadIndex, this.fileName, this.fileName, fileName)
                }else{
                    that.$emit('changeAstrictStatus', 'end', this.uploadIndex, 'factor_'+ this.uploadIndex +'.kmz', this.fileName, fileName)
                }
            }).catch((err)=>{
                if (that.fileName){
                    that.$emit('changeAstrictStatus', 'err', this.uploadIndex, this.fileName, this.fileName, fileName)
                }else{
                    that.$emit('changeAstrictStatus', 'err', this.uploadIndex, 'factor_'+ this.uploadIndex +'.kmz', this.fileName, fileName)
                }
            })

            
        }
    }
}
</script>
<style lang="scss" scoped>
.upload-button{
    position: relative;
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
   
    .progress{
        width: 0;
        height: 0.07rem;
        background:rgba(44,208,185,1);
        border-radius: 0 0.2rem 0.3rem 0.5rem;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .removeIcon{
        position: absolute;
        right: 0;
        top: 0.1rem;
        .iconfont{
            font-size: 0.22rem;
            display: none;
        }
    }
}
.fileNameNew{
    width: 80%;
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: center;
}
.upload-button:hover .iconfont{
    display: inline-block;
}
.uploading.upload-button{
    border:1px solid rgba(44,208,185,1);
    background:rgba(173,238,229,1);
    .icon-shanchu1{
        color: #333333;
    }
}
</style>