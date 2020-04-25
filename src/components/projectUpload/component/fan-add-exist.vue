<template>
    <el-dialog
        title="新建方案-已有点位"
        :visible.sync="dialogVisible"
        width="8rem"
        custom-class="fan-add-exist"
        :close-on-click-modal="false"
        :before-close="handleClose">
        <div class="title">
            <el-form ref="titleform" :model="titleform" label-width="0.8rem">
                <el-form-item label="方案名称:">
                    <el-input v-model="titleform.name" ></el-input>
                </el-form-item>
                <el-form-item label="折减系数:">
                    <el-input v-model="titleform.number" type="number" class="ipt"></el-input>
                </el-form-item>
            </el-form>
            <div class="btn">
                <div>排布方案</div>
                <div>设计方案</div>
            </div>
        </div>

    </el-dialog>
</template>
<script>

import { verifyFileName, validateAzNumber, validateWGS84X, validateWGS84Y, valUTMX, validateCoordinateX, validateCoordinateY, validateHeight, validateFile } from "@/utils/validate"
import { mapState } from "vuex";
import { postMastTimTxt } from "@/api/server.request.js"
export default {
    name: 'fan-add-exist',
    props:{
      
    },
    components:{
        
    },
    data (){
        return{
            waitingMinute: false,
            dialogVisible: false,
            titleform:{
                name: 'aaaa',
                number: '0.773'
            },
            activeBtn: true
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            fanAddVisible: state => state.projectUpload.fanAddVisible,
        })
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.uploading')});
        },
        fanAddVisible (val){
            if(val && val.type == 'exist'){
                this.dialogVisible = true
            }else{
                this.dialogVisible = false
            }
        }
    },
    mounted (){
        
    },
    beforeDestroy (){
        
    },
    methods:{
       handleClose (done){

            done()
            this.$store.commit('fanAddVisible', null)
       }
    }
}
</script>
<style lang="scss" scoped>
/deep/ .fan-add-exist{
    .title{
        display: flex;
        justify-content: space-between;
        padding: 0 0.1rem 0 0;
        .el-form{
            display: flex;
        }
        .el-input__inner{
            width: 1.57rem;
            background:rgba(235,242,228,1);
            border-radius: 0.07rem;
            border: none;
        }
        .ipt .el-input__inner{
            width: 1rem;
        }
        .el-form-item__content, .el-form-item, .el-form-item__label, .el-input, .el-input__inner{
            line-height: 0.26rem;
            height: 0.26rem;
        }
        .el-form-item__label{
            font-size: 0.15rem;
            padding: 0 0.1rem 0 0;
        }
        .btn{
            display: flex;
            &>div{
                cursor: pointer;
                width: 1rem;
                height: 0.3rem;
                line-height: 0.3rem;
                text-align: center;
                border-radius: 0.11rem;
            }
        }
    }
   
}
</style>