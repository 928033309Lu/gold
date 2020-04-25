<template>
    <el-dialog
        title="新建方案-自动优化排布"
        :visible.sync="dialogVisible"
        width="8rem"
        :close-on-click-modal="false"
        :before-close="handleClose">


    </el-dialog>
</template>
<script>

import { verifyFileName, validateAzNumber, validateWGS84X, validateWGS84Y, valUTMX, validateCoordinateX, validateCoordinateY, validateHeight, validateFile } from "@/utils/validate"
import { mapState } from "vuex";
import { postMastTimTxt } from "@/api/server.request.js"
export default {
    name: 'fan-add-auto',
    props:{
      
    },
    components:{
        
    },
    data (){
        return{
            waitingMinute: false,
            dialogVisible: false
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
            if(val && val.type == 'auto'){
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

.fan-add-auto{
   
}
</style>