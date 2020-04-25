<template>
    <div class="user-password">
        <div class="content">
            <el-form ref="form" :model="form" :rules="rules" label-width="0">
                <el-form-item prop="oldPass">
                    <i class="iconfont icon-password"></i>
                    <el-input v-model="form.oldPass" :placeholder="$t('m.oldPassword')" show-password></el-input>
                </el-form-item>
                <el-form-item prop="newPass">
                    <i class="iconfont icon-mima1"></i>
                    <el-input v-model="form.newPass" :placeholder="$t('m.newPassword')" show-password></el-input>
                </el-form-item>
                <el-form-item prop="againPass">
                    <i class="iconfont icon-mima1"></i>
                    <el-input v-model="form.againPass" :placeholder="$t('m.againNewPassword')" show-password></el-input>
                </el-form-item>
            </el-form>
            <el-button class="btn" @click="onSubmit">重置密码</el-button>
        </div>
    </div>
</template>
<script>
import { validatePassword } from "@/utils/validate.js"
import { changePass } from "@/api/server.request.js"
import crypto from '@/utils/crypto.js';
import { setLocal } from '@/utils/auth';
import envConfig from '@/config/env-config'
export default {
    name: "user-password",
    data (){
        return {
            form: {
                oldPass: '',
                newPass: '',
                againPass: ''
            },
            rules: {
                oldPass: [
                    { required: true, message: this.$t('m.emptyPassWord'), trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: this.$t('m.emptyPassWord'), trigger: 'blur' },
                    {validator: validatePassword, trigger: ['blur', 'change']}
                ],
                againPass: [
                    { required: true, message: this.$t('m.emptyPassWord'), trigger: 'blur' }
                ]
            },
        }
    },
    methods:{
        onSubmit (){
            let that = this;
            this.$refs.form.validate((valid)=>{
                if(valid){
                    if(that.form.newPass != that.form.againPass){
                        this.$message.error(this.$t('m.againTwoPass'));
                        return;
                    }
                    that.postPassWord();
                }else{
                    return false;
                }
            })
        },
        postPassWord(){
            let that = this;
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            data.append('old_password', that.form.oldPass);
            data.append('new_password', that.form.newPass);
            changePass(data, config).then((res)=>{
                if(res.code != 201){
                    this.$message.error(res.message);
                    return;
                }
                this.$message.success(res.message);
                this.rememberPass()
            })
        },
        rememberPass(){
            // 存账号密码
            let key2 = crypto.Encrypt(this.form.newPass);
            setLocal(envConfig.appTitle+'key2' , key2);
        },
        onClose (){
            
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/fixed/variable-set.scss";
.user-password{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 5.82rem;
    height: 40%;
    border-radius: 0.04rem;
    color: $text-black-color;
    /deep/ .el-input .el-input__inner{
        width: 5.81rem;
        height: 0.81rem;
        background:rgba(235,242,228,1);
        border-radius:2px;
        padding-left: 1.1rem;
    }
    /deep/ .el-form-item{
        margin-bottom: 0.31rem;
    }
    .content{
        text-align: center;
        .iconfont{
            font-size: 0.25rem;
            position: absolute;
            top: 0.15rem;
            left: 0.45rem;
            z-index: 1;
        }
        .btn{
            width: 2.25rem;
            height: 0.81rem;
            background: $button-background;
            color: $text-color;
            margin-top: 0.1rem;
        }
        .btn:hover{
            background: $button-hover-background;
        }
    }
}  
</style>