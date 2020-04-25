<template>
    <div class="user-info">
        <div class="content">
            <el-form ref="form" :model="form" :rules="rules" label-width="0">
                <el-form-item prop="name">
                    <i class="iconfont icon-yonghu"></i>
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <i class="iconfont icon-youxiang"></i>
                    <el-input v-model="form.email" ></el-input>
                </el-form-item>
                <el-form-item prop="owner_id">
                    <i class="iconfont icon-qiye"></i>
                    <i class="el-icon-arrow-down"></i>
                    <el-select v-model="form.owner_id" filterable remote 
                        @change="changeOwner"
                        :remote-method="remoteMethod">
                        <el-option
                        v-for="(item,index) of ownerOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-button class="btn" @click="submit">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { put } from "@/api/request"
import { getOwner } from "@/api/server.request.js"
import { validateEmail, validateName } from "@/utils/validate"
import envConfig from '@/config/env-config'
import { setLocal, getLocal } from '@/utils/auth';
export default {
    name: "user-info",
    data (){
        return {
            form:{
                name: '',
                email: '',
                owner_id: ''
            },
            changeOwner_id: '',
            oldOwnerOptions:[],
            ownerOptions:[],
            rules: {
                name: [
                    { required: true, message: this.$t('m.iptUserName'), trigger: 'blur' },
                    {validator: validateName, trigger: ['blur', 'change']}
                ],
                email: [
                    {required: true, message: this.$t('m.iptMailBox'), trigger: 'blur'},
                    {validator: validateEmail, trigger: ['blur', 'change']}
                ],
                owner_id: [
                    {required: true, message: this.$t('m.iptBusinessName'), trigger: 'change'}
                ],
            }
        }
    },
    computed:{
        userInfo (){
            return this.$store.state.user.userInfo;
        }
    },
    watch:{
    },
    mounted(){
        this.form.name = this.userInfo.user_name;
        this.form.email = this.userInfo.email;
        this.form.owner_id = this.userInfo.owner_id;
        this.getOwners();
    },
    methods:{
        submit(){
            let that = this
            this.$refs.form.validate((valid)=>{
                if(valid){
                    put('/user/',{
                        username: that.form.name,
                        owner_id: that.form.owner_id,
                        email: that.form.email
                    }).then((res)=>{
                        if(res.code != 201){
                            this.$message.error(res.message);
                            return;
                        }
                        this.$message({
                            type: 'success',
                            message: res.message,
                            duration: 1000
                        });
                        // 存用户信息
                        let obj = {};
                        obj.email = that.form.email;
                        obj.owner_id = getLocal(envConfig.appTitle+'-user').owner_id
                        obj.token = getLocal(envConfig.appTitle+'-user').token
                        obj.user_id = getLocal(envConfig.appTitle+'-user').user_id
                        obj.user_name = that.form.name;
                        setLocal(envConfig.appTitle+'-user' , obj);
                    })
                }else{
                    return false;
                }
            })
        },
        remoteMethod(query) {
            if (query != '') {
                this.ownerOptions = this.oldOwnerOptions.filter(item => {
                    return item.label.indexOf(query) != -1;
                })
            } else {
                this.ownerOptions = this.oldOwnerOptions;
            }
        },
        getOwners(){
            getOwner().then((res)=>{
                if(res.code == 403 ) return;
                if(res.code != 200){
                    this.$message.error(res.message);
                    return;
                };
                this.oldOwnerOptions = res.data.map((item, index, arr) => {
                    return { value: item.owner_id, label: item.full_owner_name };
                });
                this.ownerOptions = this.oldOwnerOptions.filter((item,index)=>{
                    return index < 10;
                })
                this.ownerOptions.push({
                    value: '更多',
                    label: '更多'
                })
            })
        },
        changeOwner(value){
            if(value == "更多"){
                return;
            }
            this.changeOwner_id = value;
        },
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/fixed/variable-set.scss";
.user-info{
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
        height: 0.8rem;
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
    }
    .btn{
        width: 2rem;
        height: 0.72rem;
        background:rgba(44,208,185,0.9);
        border-radius:2px;
        color: rgba(255,255,255,0.8);
        cursor: pointer;
    }
    .btn:hover{
        background:rgba(44,208,185,1);
        color: rgba(255,255,255,1);
    }
}
.el-icon-arrow-down{
    position: absolute;
    right: 0.2rem;
    top: 0.35rem;
    z-index: 99;
    font-size: 0.2rem;
}
</style>