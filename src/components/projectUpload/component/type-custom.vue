<template>
    <el-dialog :title="!isbatchPut ? $t('m.CustomModel') : $t('m.batchPut')"
        :visible.sync="typeVisible" 
        :close-on-click-modal="false"
        :before-close="beforeClose"
        custom-class="typeDialog" >
        <el-form  ref="typeForm" 
            :model="typeForm"
            :rules="myRules"
            label-width="1rem" class="demo-ruleForm">
            <el-form-item prop="name" label="字母缩写：" style="text-align: justify;">
                <el-input v-model="typeForm.name"  />
                <div class="spanTip"> 示例：<b style="color:#E20B4D">GW</b>140/2500 </div>
            </el-form-item>
            <el-form-item prop="dia" label="叶轮直径：">
                <el-input type="number" v-model="typeForm.dia" />
                <div class="spanTip"> 示例：GW<b style="color:#E20B4D">140</b>/2500 <span>(m)</span></div>
            </el-form-item>
            <el-form-item prop="cap" label="单机容量：">
                <el-input type="number" v-model="typeForm.cap" />
                <div class="spanTip"> 示例：GW140/<b style="color:#E20B4D">2500</b> <span>(kw)</span></div>
            </el-form-item>
            <el-form-item prop="typeHeight" label="机型高度：">
                <el-input type="number" v-model="typeForm.typeHeight" />
            </el-form-item>
            <!-- <el-form-item prop="height" label="轮毂高度：">
                <el-input type="number" v-model="typeForm.height" />
            </el-form-item> -->
            <el-form-item  label="机型名称：">
                <span v-if="value"> {{value}} </span>
            </el-form-item>
        </el-form>
        <div class="btnBox">
            <el-button class="gf-button" style="width: 2.2rem;" type="primary" @click="submitForm">{{$t('m.confirm')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>

export default {
    name: "type-custom",
    components: {
        
    },
    props: ["turbineOptions"],
    data () {
        const validtypeHeight = (rule, value, callback) => {
            if (!value) {
                if (this.language == 'en') {
                    return callback(new Error('Please enter the model height'));
                }else{
                    return callback(new Error('请输入机型高度'));
                }
                
            }
            else if (value <= 0 || value > 300 ) {
                if (this.language == 'en') {
                    return callback(new Error('Values range from 0 to 300'));
                }else{
                    return callback(new Error('取值范围0~300'));
                };
            }
            else {
                callback();
            }
        };
        const valid999 = (rule, value, callback) => {
            if (!value) {
                if (this.language == 'en') {
                    return callback(new Error('Please enter impeller diameter'));
                }else{
                    return callback(new Error('请输入叶轮直径'));
                }
            }
            else if (value <10 || value >999) {
                if (this.language == 'en') {
                    return callback(new Error('Values range from 10 to 99'));
                }else{
                    return callback(new Error('取值范围10~999'));
                }
            }
            else {
                callback();
            }
        };
        const valid1000 = (rule, value, callback) => {
            if (!value) {
                if (this.language == 'en') {
                    return callback(new Error('Please enter the stand-alone capacity'));
                }else{
                    return callback(new Error('请输入单机容量'));
                }
                
            }
            else if (value<1000 || value>9999) {
                if (this.language == 'en') {
                    return callback(new Error('Values range from 1000 to 9999'));
                }else{
                    return callback(new Error('取值范围1000~9999'));
                }
                
            }
            else {
                callback();
            }
        };
        const validAZ = (rule, value, callback) => {
            if (!value) {
                if (this.language == 'en') {
                    return callback(new Error('Please enter the manufacturer code'));
                }else{
                    return callback(new Error('请输入厂家代号'));
                }
                
            }
            else if (!/^[a-zA-Z]+$/.test(value)) {
                if (this.language == 'en') {
                    return callback(new Error('English letter code'));
                }else{
                    return callback(new Error('英文字母代表的厂家代号'));
                }
                
            }
            else {
                callback();
            }
        };
        const validHeight = (rule, value, callback) => {
            if (!value) {
                if (this.language == 'en') {
                    return callback(new Error('Please enter the hub height'));
                }else{
                    return callback(new Error('请输入轮毂高度'));
                }
                
            }
            else if (value <= 0 || value > 300 ) {
                if (this.language == 'en') {
                    return callback(new Error('Values range from 0 to 300'));
                }else{
                    return callback(new Error('取值范围0~300'));
                };
            }
            else {
                callback();
            }
        };
        return {
            myRules:{
                dia: [
                    {validator: valid999, trigger: 'change'}
                ],
                cap: [
                    {validator: valid1000, trigger: 'change'}
                ],
                name: [
                    {validator: validAZ, trigger: 'change'}
                ],
                typeHeight: [
                    {validator: validtypeHeight, trigger: 'change'}
                ],
                height: [
                    {validator: validHeight, trigger: 'change'}
                ],
            },
            typeVisible:false,
            typeForm: {
                name: "",
                dia: "",
                cap: "",
                typeHeight: "",
                height: ""
            },
            optimize: false,
            isbatchPut: false
        }
    },
    computed: {
        value (){
            if (this.typeForm.name && this.typeForm.dia && this.typeForm.cap){

                return (this.typeForm.name).toUpperCase() + this.typeForm.dia + "/" + this.typeForm.cap;
            } else{
                return null
            }
        },
        language (){
            return this.$store.state.app.language
        }
    },
    created () {
    
    },
    mounted () {

    },
    methods: {
        open(isTrue, type, height){
            this.isbatchPut = false
            if (type == 'batchPut'){
                this.isbatchPut = true
            }
            this.typeVisible = true;
            this.optimize = isTrue;
            // this.typeForm.height = height
            this.typeForm.typeHeight = height
        },
        submitForm (){
            let isValid = false;
            this.$refs.typeForm.validate(valid => {
                isValid = valid;
                return valid;
            });
            if(!isValid){
                return;
            }

            let type = this.turbineOptions.some((item,index)=>{
                return item.value == this.value;
            })
            // console.log(type)
            if(!type){
                this.$emit("changeType", this.value, this.optimize , this.typeForm.typeHeight, this.isbatchPut, this.typeForm.typeHeight);
                this.typeVisible = false;
                this.typeForm = {
                    name: "",
                    dia: "",
                    cap: "",
                    typeHeight: "",
                    height: "",
                }
                this.$refs.typeForm.resetFields()
            }else{
                this.$message.warning(this.$t('m.validateType'));
            }
        },
        beforeClose(done){
            this.typeVisible = false;
            this.$emit("restoreType",true ,this.optimize, this.isbatchPut);
            this.typeForm = {
                name: "",
                dia: "",
                cap: "",
                typeHeight: "",
                height: ""
            }
            this.$refs.typeForm.resetFields()
            done()
        }
    }
}
</script>
<style lang="scss" scoped>

/deep/ .typeDialog{
    width: 4.8rem;
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
    width: 2.2rem;
    position: absolute;
    right: -2.2rem;
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