<template>
    <div class="upload-button" @click="clickUpload">
        <i v-if="!fileName" :class="'iconfont '+ icon"></i>
        <div v-if="!fileName"> {{title}} </div>
        <el-tooltip class="item" 
            effect="light"
            :content="fileName"
            :visible-arrow="false"
            :disabled="fileName && fileName.length <= 15 ? true : false"
            placement="top">
            <div v-show="fileName" class="fileNameNew ellipsis"> {{fileName}} </div>
        </el-tooltip>
        <div class="removeIcon" @click.stop="removeFile" v-if="fileName && width <=0"><i class="iconfont icon-shanchu1"></i></div>
        <div class="progress" :style="{width: width + '%'}"></div>

        <el-upload  action="/"  class="defaultUpload" accept=".wrg"
            :before-upload="beforeCfdUpload" 
            :on-change="onChange"
            :http-request="httpCfdRequest">
            <button ref="cfdUpload"></button>
        </el-upload>
    </div>
</template>
<script>
import { verifyFileName, verifyFileNameLength, verifyFileNameCheck } from "@/utils/validate"
import { postCfdFile } from "@/api/server.request.js"
import { mapState } from "vuex";
export default {
    name: 'cfd-upload-button',
    props:{
        icon: {
            default: 'icon-shangchuan1'
        },
        fileName: {
            default: null
        },
        uploadIndex: {
            default: 0
        },
        width:{
            default: 0
        },
        project:{

        },
        height:{
            default: 90
        },
        ids:{},
        formHeight:{},
    },
    data (){
        return{
            title: '上传wrg文件',
            progress: 0
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
        }),
    },
    watch:{
        progress (val){
            this.$emit('changeCfdStatus', 'cfd_progress_width', val, this.uploadIndex, '', this.ids)
        }
    },
    mounted (){
    },
    methods:{
        onChange (value){
            this.$emit('changeOpacityShow', this.uploadIndex, this.ids)
        },
        clickUpload (){
            if(this.width > 0){
                return
            }
            this.$refs.cfdUpload.click()
        },
        removeFile (){
            var fileNameHeight = null
            var fileName = null
            if(this.fileName){
                fileNameHeight = this.fileName.split('/')[0]
                fileName = this.fileName.split('/')[1]
            }
            this.$emit('removeFile', this.uploadIndex, fileName, fileNameHeight, this.ids)
        },
        // cfd
        beforeCfdUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'wrg', 'wrg', true)
            // console.log(length ,files ,nameCheck)
            if(length && files && nameCheck){
                return true
            }else{
                if(!this.fileName){
                    this.$emit('removeLength', this.ids)
                }
                return false
            }
        },
        httpCfdRequest (options){
            var fileNameHeight = null
            if(this.fileName){
                fileNameHeight = this.fileName.split('/')[0]
            }

            let that = this
            let fileName = options.file.name
            if (!fileNameHeight){
                this.$emit('changeCfdStatus', 'start', fileName, this.uploadIndex, this.formHeight, this.ids)
            } else{
                this.$emit('changeCfdStatus', 'start', fileName, this.uploadIndex, fileNameHeight, this.ids)
            }
            
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        that.progress = (progressEvent.loaded / progressEvent.total * 100 | 0)
                    }
                }
            };
            data.append('wrg_file', options.file)
            data.append('project_id', this.project)
            if (!fileNameHeight){
                data.append('height', this.height)
            } else{
                data.append('height', fileNameHeight)
            }
            // console.log(this.item.formHeight, "11111")
            postCfdFile(data, config).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                if (!fileNameHeight){
                    this.$emit('changeCfdStatus', 'end', fileName, this.uploadIndex, this.formHeight, this.ids)
                } else{
                    this.$emit('changeCfdStatus', 'end', fileName, this.uploadIndex, fileNameHeight, this.ids)
                }
            }).catch((err)=>{
                this.$emit('changeCfdStatus', 'err', null, this.uploadIndex, this.ids)
            })
        },
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