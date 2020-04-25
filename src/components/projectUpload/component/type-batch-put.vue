<template>
    <el-dialog :title="$t('m.batchPutmodel')"
        :visible.sync="typeVisible" 
        :close-on-click-modal="false"
        custom-class="typeDialog" >
        <el-form label-width="1rem" ref="batchForm" :model="batchForm">
            <el-form-item label="机型:" prop="turbine_type"
            :rules="{validator: validateNull2, trigger: 'change'}">
                <el-select v-model="batchForm.turbine_type" 
                @change="changeSelect" class="mySelect">
                    <el-option
                        v-for="(item) of turbineOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="轮毂高度:" prop="height"
            :rules="{validator: validateHeight, trigger: 'blur'}">
                <el-input v-model="batchForm.height" placeholder="请输入轮毂高度"></el-input>
            </el-form-item>
        </el-form>
        <div class="btnBox">
            <el-button style="width:1.5rem;" type="primary" @click="submitForm">{{$t('m.confirm')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { validateNull2, validateHeight } from "@/utils/validate"
export default {
    name: "type-batch-put",
    components: {
        
    },
    props: ["turbineOptions"],
    data () {
        return {
            validateNull2: validateNull2,
            validateHeight: validateHeight,
            typeVisible:false,
            batchForm:{
                turbine_type: '',
                height: ''
            }
        }
    },
    computed: {
        
    },
    created () {
    
    },
    mounted () {

    },
    methods: {
        changeSelect (value){
            console.log(value)
            if(value == '自定义机型'){
                this.$emit('openTypeCustom', this.batchForm.height)
                this.typeVisible = false
                return
            }
        },
        submitForm (){
            let flag = true
            this.$refs.batchForm.validate((valid) => {
                flag = valid
            })
            if(!flag) return;
            this.$emit('submitBatchForm', this.batchForm)
            this.typeVisible = false
        },
        open (item){
            console.log(item.height)
            this.typeVisible = true
            this.batchForm.height = item.height
            this.batchForm.turbine_type = ''
        }
    }
}
</script>
<style lang="scss" scoped>

/deep/ .typeDialog{
    width: 3.9rem;
    .el-form-item__content{
        width: 1.5rem;
    }
    .el-form-item__label, .el-form-item__content, .el-input__inner{
        height: 0.3rem;
        line-height: 0.3rem;
    }
    .el-form-item{
        margin-bottom: 0.18rem;
    }
}
.spanTip{
    font-size: 0.11rem;
    width: 170px;
    position: absolute;
    right: -170px;
    top: 0;
    padding-left: 0.4rem;
    box-sizing: border-box;
    &>span{
        position: absolute;
        left: 0.08rem;
        top: 0;
    }
}
.btnBox{
    padding: 0 0 0 1rem;
}

</style>