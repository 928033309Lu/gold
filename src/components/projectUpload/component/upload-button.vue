<template>
    <!-- <div class="upload-button" @click="clickUpload" :class="type ==1 || type ==2 ? 'buttonSolid' :''"> -->
        <!-- todo  -->
    <div class="upload-button" @click="clickUpload" :class="type ==1 ? 'buttonSolid' :''">
        <i v-if="!fileName && type != 24" :class="'iconfont '+ icon"></i>
        <i v-if="type == 24" class="iconfont icon-zengjia"></i>
        <div v-if="!fileName"> {{title}} </div>
        <el-tooltip class="item" 
            effect="light"
            :content="fileName"
            :visible-arrow="false"
            :disabled="fileName && fileName.length <= 15 ? true : false"
            placement="top">
            <div v-show="fileName" class="fileName ellipsis"> {{fileName}} </div>
        </el-tooltip>
        <!-- <div class="removeIcon" @click.stop="removeFile" v-if="fileName && type !=1 && type !=2 && width <=0"><i class="iconfont icon-shanchu1"></i></div> -->
        <!-- todo -->
        <div class="removeIcon" @click.stop="removeFile" v-if="fileName && type !=1 && width <=0"><i class="iconfont icon-shanchu1"></i></div>
        <div class="progress" :style="{width: width + '%'}"></div>
    </div>
</template>
<script>

export default {
    name: 'upload-button',
    props:{
        icon: {
            default: 'icon-shangchuan1'
        },
        fileName: {
            default: null
        },
        type: {
            default: 1
        },
        width:{
            default: 0
        }
    },
    data (){
        return{
            title: null
        }
    },
    computed:{
        
    },
    watch:{
        
    },
    mounted (){
        this.init()
    },
    methods:{
        init (){
            if (this.type == 1){
                this.title = this.$t('m.uploadFileMap')
            } else if (this.type == 2){
                this.title = this.$t('m.uploadFileField')
            } else if (this.type == 3){
                this.title = this.$t('m.uploadFileRaconn')
            } else if (this.type == 4){
                this.title = this.$t('m.uploadFileConstraints')
            }
            else if (this.type == 21){
                this.title = this.$t('m.uploadFileMesoscale')
            }
            else if (this.type == 22){
                this.title = this.$t('m.uploadFileTim')
            }
            else if (this.type == 23){
                this.title = this.$t('m.uploadFileTXT')
            }
            else if (this.type == 24){
                this.title = this.$t('m.uploadAddMast')
            }
            else if (this.type == 33){
                this.title = this.$t('m.uploadAddWrg')
            }
            else if (this.type == 31){
                this.title = this.$t('m.uploadRarZip')
            }
            else if (this.type == 41){
                this.title = this.$t('m.uploadDXF')
            }
            else if (this.type == 42){
                this.title = this.$t('m.uploadZIP')
            }
        },
        clickUpload (){
            if(this.width > 0) return;
            this.$emit('clickUpload', this.type)
        },
        removeFile (){
            this.$emit('removeFile', this.type)
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
    .fileName{
        width: 80%;
        height: 0.4rem;
        line-height: 0.4rem;
        text-align: center;
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
    .icon-zengjia{
        color: #6D7D41;
    }
}
.upload-button.buttonSolid{
    border: 1px solid;
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