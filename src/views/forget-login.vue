<template>
    <div class="forget-login-panel">
        <router-link class="comeBack" :to="{path:'/login',query:{rool:true}}" tag="p">返回登录</router-link>
        <p class="cloud"></p>
        <div>
            <p class="title">{{$t("m.resetPassword")}}</p>
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
                <el-form-item prop="tel">
                    <i class="iconfont icon-shoujihao"></i>
                    <el-input ref="tel" v-model.trim="ruleForm.tel" type="number" auto-complete="off"
                            :placeholder="$t('m.telPhone')"></el-input>
                    <div class="getCode ellipsis" ref="getCodeFor" @click="codeSend" >{{buttonName}}</div>
                </el-form-item>
                <el-form-item prop="sendCode">
                    <i class="iconfont icon-yanzhengma"></i>
                    <el-input v-model.trim="ruleForm.sendCode" auto-complete="off"
                            :placeholder="$t('m.verificationCode')"></el-input>
                </el-form-item>
                <el-form-item prop="pass">
                    <i class="iconfont icon-password"></i>
                    <el-input type="password" v-model="ruleForm.pass" show-password
                        :placeholder="$t('m.newPassword')"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <i class="iconfont icon-mima1"></i>
                    <el-input type="password" v-model="ruleForm.checkPass" show-password
                            :placeholder="$t('m.againNewPassword')" @keydown.enter.native="submitForm">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">{{$t("m.resetPassword")}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { forgetCode, forgetChangePass } from "@/api/server.request.js"
import { validatePassword } from "@/utils/validate"
import { setLocal } from '@/utils/auth';
import envConfig from '@/config/env-config'
import crypto from '@/utils/crypto.js';
export default {
    name: "forget-login",
    data () {
        return {
            buttonName: this.$t('m.getCode'),
            setIntervalNumner: null,
            ruleForm: {
                tel: '',
                sendCode: '',
                pass: '',
                checkPass: ''
            },
            rules: {
                tel: [
                    { required: true, message: this.$t('m.accountEmpty'), trigger: 'blur' },
                    { min: 11, max: 11, message: this.$t('m.telPhone3'), trigger: 'blur' }
                ],
                sendCode: [
                    { required: true, message: this.$t('m.getCodeEmpty'), trigger: 'blur' },
                ],
                pass: [
                    { required: true, message: this.$t('m.emptyPassWord'), trigger: 'blur' },
                    { validator: validatePassword, trigger: 'blur'}
                ],
                checkPass: [
                    { required: true, message: this.$t('m.emptyPassWord'), trigger: 'blur' }
                ]
            }
        }
    },
    computed:{
        language (){
            return this.$i18n.locale;
        },
    },
    methods: {
        codeSend () {
            if (this.language == 'en'){
                if(this.buttonName != 'Get code') {
                    console.log("禁止点击")
                    return;
                }
            }else{
                if(this.buttonName != '获取验证码') {
                    console.log("禁止点击")
                    return;
                }
            }
            
            let that = this
            this.$refs.ruleForm.validateField('tel', (valid) => {
                if (!valid) {
                    this.$refs.getCodeFor.classList.add('disableBtn')
                    // 获取验证码
                    var number = 60;
                    forgetCode({
                        phone: that.ruleForm.tel
                    }).then(res => {
                        if (res.code !== 200) {
                            this.$message.error(res.message);
                            return;
                        }
                        this.$message.success(res.message);
                        let that = this;
                        this.setIntervalNumner = setInterval(()=>{
                            number --
                            this.language == 'en' ? this.buttonName = 'Retrieve after'+ number +'s' : this.buttonName = number + " s后重新获取"
                        },1000) 
                        setTimeout(()=>{
                            clearInterval(this.setIntervalNumner);
                            this.buttonName = this.$t('m.getCode');
                            this.$refs.getCodeFor.classList.remove('disableBtn')
                        },60000)
                    }).catch((err)=>{
                        this.$refs.getCodeFor.classList.remove('disableBtn')
                    })
                } else {
                    return false;
                }
            });
        },
        submitForm(){
            let that = this
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if(that.ruleForm.pass != that.ruleForm.checkPass){
                        this.$message.error(this.$t('m.againTwoPass'))
                        return;
                    }
                    forgetChangePass({
                        phone: that.ruleForm.tel,
                        verify_code: that.ruleForm.sendCode,
                        new_password: that.ruleForm.pass
                    }).then(res => {
                        if (res.code !== 201) {
                            this.$message.error(res.message);
                            return;
                        }
                        this.$message.success(res.message);
                        this.rememberPass();
                    })
                } else {
                    return false;
                }
            });
        },
        rememberPass(){
            // 存密码
            let key2 = crypto.Encrypt(this.ruleForm.pass);
            setLocal(envConfig.appTitle+'key2' , key2);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/fixed/variable-set.scss";
$input-height: 0.72rem;
.forget-login-panel{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    color: $text-black-color;
    .cloud{
        width: 100%;
        height: 2.38rem;
        background-image: url("/images/cloud.png");
        background-size: 100% 100%;
        position: absolute;
        left: 0;
        bottom: 0;
    }
        /deep/ .el-input .el-input__inner{
        color: $text-black-color;
        border: none;
        background: rgba(255, 255, 255, 0.3);
        height: $input-height;
        line-height: $input-height;
        padding: 0 0 0 1.5rem;
        font-size: 0.15rem;
    }
    /deep/ .el-input .el-input__inner:focus{
        background: rgba(255, 255, 255, 0.8);
    }
    /deep/ .el-form-item{
        margin-bottom: 0.35rem;
    }
    /deep/ .el-form-item__error{
        left: initial;
        right: 0;
        bottom: -0.08rem;
    }
    /deep/ .el-button{
        width: 100%;
        height: 0.64rem;
        border-radius: 0.5rem;
        font-size: 0.18rem;
        background: none;
        border: 1px solid $button-background;
        color: $button-background;
    }
    /deep/ .el-button:hover{
        background: $button-hover-background;
        color: $button-hover-text;
    }
    .title{
        font-size: 0.3rem;
        text-align: center;
        padding: 0.45rem;
    }
    .iconfont{
        font-size: 0.25rem;
        position: absolute;
        top: 0.15rem;
        left: 0.45rem;
        z-index: 1;
    }
    .icon-shoujihao{
        font-size: 0.27rem;
    }
    .getCode{
        position: absolute;
        right: 0;
        top: 0;
        width: 1.57rem;
        height: $input-height;
        line-height: $input-height;
        text-align: center;
        color: #fff;
        background: $button-background;
        cursor: pointer;
    }
    .getCode:hover{
        background: $button-hover-background;
    }
    .comeBack{
        position: absolute;
        right: 0.2rem;
        top: 0.2rem;
        color: $text-active-color;
        cursor: pointer;
    }
    &>div{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 5rem;
    }
    .disableBtn{
        cursor: not-allowed !important;
    }
}
</style>