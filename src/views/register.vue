<template>
    <div class="register">
        <p class="login">{{$t('m.haveAccount')}}, <router-link :to="{path:'/login',query:{rool:true}}" tag="span">{{$t('m.login')}}</router-link> </p>
        <p class="cloud"></p>
        <div class="content">
            <div class="title"> {{$t('m.nameTodo1')}} <b>GoldFarm</b> {{$t('m.nameTodo2')}}</div>
            <my-steps :activeValue="activeValue" :boxWidth="'11rem'"></my-steps>

            <div v-show="activeValue == 1">
                <el-form ref="phoneForm" :model="phoneForm" :rules="rules" class="phoneForm" label-width="0">
                    <el-form-item prop="phone">
                        <i class="iconfont icon-shoujihao"></i>
                        <el-input type="number" v-model="phoneForm.phone" :placeholder="$t('m.telPhone2')"></el-input>
                        <div class="codeBtn ellipsis" @click="clickCode" 
                        ref="getCodeReg"> {{number}} </div>
                    </el-form-item>
                </el-form>
                <el-form ref="phoneForm2" :model="phoneForm" :rules="rules" class="phoneForm phoneForm2" label-width="0">
                    <el-form-item prop="code">
                        <i class="iconfont icon-yanzhengma"></i>
                        <el-input v-model="phoneForm.code" :placeholder="$t('m.getCode2')"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <div class="btn" @click="onNext">{{$t('m.nextStep')}}</div>
                    </el-form-item>
                </el-form>
            </div>
            <div v-show="activeValue == 2">
                <el-form ref="userForm" :model="userForm" :rules="userRules" class="userForm" label-width="0">
                    <el-form-item prop="name">
                        <img class="iconfont img" src="/images/user2.png" alt=""/>
                        <el-input v-model="userForm.name" :placeholder="$t('m.userName')"></el-input>
                    </el-form-item>
                    <el-form-item prop="email">
                        <i class="iconfont icon-youxiang"></i>
                        <el-input v-model="userForm.email" :placeholder="$t('m.mailBox')"></el-input>
                    </el-form-item>
                    <el-form-item prop="owner_id">
                        <i class="iconfont icon-qiye"></i>
                        <i class="el-icon-arrow-down"></i>
                        <el-select @change="changeOwner"
                            v-model="userForm.owner_id"
                            filterable
                            remote
                            :remote-method="remoteMethod"
                            :placeholder="$t('m.enterpriseName')">
                            <el-option
                            v-for="(item,index) of ownerOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="password">
                        <i class="iconfont icon-mima"></i>
                        <el-input v-model="userForm.password" :placeholder="$t('m.passWord')" show-password></el-input>
                    </el-form-item>
                    <el-form-item prop="password2">
                        <i class="iconfont icon-mima1"></i>
                        <el-input v-model="userForm.password2" :placeholder="$t('m.confirmPass')" show-password></el-input>
                    </el-form-item>
                    <el-form-item >
                        <div class="button-item">
                            <div class="btn" @click="onStep">{{$t('m.lastStep')}}</div>
                            <div class="btn next" @click="onSubmit">{{$t('m.signUpWay')}}</div>
                        </div>
                    </el-form-item>
                    <el-form-item >
                        <div style="color: #495253;font-size: 0.14rem;text-align: center;">
                            {{$t('m.regTitleTip1')}} <span class="signUpWay">{{$t('m.signUpWay')}}</span> {{$t('m.regTitleTip2')}} <b>GoldFarm</b> {{$t('m.regTitleTip3')}}
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div v-show="activeValue == 3">
                <div class="imgBox" @click="goLogin">
                    <img src="/images/register.png" alt="" />
                </div>
            </div>
            
        </div>
    </div>
</template>
<script>
import mySteps from "@/components/utils/my-steps.vue";
import { getOwner, registerCode, verifyCode, postRegister } from "@/api/server.request.js"
import { validateEmail, validateName, validatePassword } from "@/utils/validate.js"
export default {
    name: 'register',
    components:{
        mySteps
    },
    data (){
        return{
            number: this.$t('m.getCode'),
            setIntervalNumner: null,
            activeValue: 1,
            oldOwnerOptions: [],
            ownerOptions: [],
            value: '',
            rules: {
                phone: [
                    { required: true, message: this.$t('m.telPhone2'), trigger: 'blur' },
                    { min: 11, max: 11, message: this.$t('m.telPhone3'), trigger: 'blur' }
                ],
                code: [
                    { required: true, message: this.$t('m.getCode2'), trigger: 'blur' }
                ],
            },
            userRules: {
                name: [
                    { required: true, message: this.$t('m.iptUserName'), trigger: 'blur' },
                    {validator: validateName, trigger: ['blur', 'change']}
                ],
                email: [
                    {required: true, message: this.$t('m.iptMailBox'), trigger: 'blur'},
                    {validator: validateEmail, trigger: ['blur', 'change']}
                ],
                owner_id: [
                    { required: true, message: this.$t('m.iptPriseName'), trigger: 'change' }
                ],
                password: [
                    { required: true, message: this.$t('m.iptPassWord'), trigger: 'blur' },
                    {validator: validatePassword, trigger: ['blur', 'change']}
                ],
                password2: [
                    { required: true, message: this.$t('m.iptPassWord'), trigger: 'blur' }
                ],
            },
            phoneForm:{
                phone: '',
                code: ''
            },
            userForm:{
                name: '',
                email: '',
                owner_id: '',
                password: '',
                password2: ''
            }
            
        }
    },
    computed:{
        language (){
            return this.$i18n.locale;
        },
    },
    mounted(){
        this.getOwners();
    },
    methods:{
        clickCode(){
            if (this.language == 'en'){
                if(this.number != 'Get code') {
                    console.log("禁止点击")
                    return;
                }
            }else{
                if(this.number != '获取验证码') {
                    console.log("禁止点击")
                    return;
                }
            }
            this.$refs.phoneForm.validate((valid) => {
                if (valid) {
                    this.$refs.getCodeReg.classList.add('disableBtn')
                    this.getCode();
                } else {
                    return false;
                }
            });
        },
        // 18311155659
        getCode(){
            registerCode({
                phone: this.phoneForm.phone
            }).then((res)=>{
                // console.log(res)
                if(res.code != 200){
                    this.$message.error(res.message);
                    return;
                }
                this.$message.success(res.message);
                var number = 60
                this.setIntervalNumner = setInterval(()=>{
                    number -- ;
                    this.language == 'en' ? this.number = 'Retrieve after'+ number +'s' : this.number = number + " s后重新获取"
                },1000) 
                setTimeout(()=>{
                    clearInterval(this.setIntervalNumner);
                    this.number = this.$t('m.getCode');
                    this.$refs.getCodeReg.classList.remove('disableBtn')
                },60000)
            }).catch((err)=>{
                this.$refs.getCodeReg.classList.remove('disableBtn')
            })
        } ,
        getOwners(){
            getOwner().then((res)=>{
                // console.log(res)
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
            this.userForm.owner_id = value;
        },
        onStep(){
            this.activeValue >1 ? this.activeValue -- : this.activeValue = 1;
        },
        onNext(){
            this.$refs.phoneForm.validate((valid) => {
                return valid;
            })
            this.$refs.phoneForm2.validate((valid) => {
                if (valid) {
                    verifyCode({
                        phone: this.phoneForm.phone,
                        verify_code: this.phoneForm.code
                    }).then((res)=>{
                        // console.log(res)
                        if(res.code != 200){
                            this.$message.error(res.message);
                            return;
                        }
                        this.activeValue ++;
                    })
                } else {
                    return false;
                }
            });
        },
        goLogin(){
            this.$router.push({path:'/login',query:{rool:true}});
        },
        onSubmit(){
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    if(this.userForm.password != this.userForm.password2){
                        this.$message.error(this.$t('m.againTwoPass'));
                        return;
                    }
                    postRegister({
                        phone: this.phoneForm.phone,
                        verify_code: this.phoneForm.code,
                        username: this.userForm.name,
                        password: this.userForm.password,
                        owner_id: this.userForm.owner_id,
                        email: this.userForm.email
                    }).then((res)=>{
                        if(res.code != 201){
                            this.$message.error(res.message);
                            this.activeValue = 2;
                            return;
                        }
                        this.activeValue = 3;
                    })
                } else {
                    return false;
                }
            });
        },
        remoteMethod(query) {
            if (query != '') {
                this.ownerOptions = this.oldOwnerOptions.filter(item => {
                    return item.label.indexOf(query) != -1;
                })
            } else {
                this.ownerOptions = this.oldOwnerOptions;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/fixed/variable-set.scss";
.number{
    position: absolute;
    right: -0.5rem;
    top: 0.1rem;
    font-size: 0.2rem;
}
.imgBox{
    width: 4.29rem;
    height: 2.57rem;
    display: flex;
    margin: auto;
    position: relative;
    z-index: 9;
    img{
        width: 100%;
        position: relative;
        top: 0.2rem;
        left: 0.3rem;
        cursor: pointer;
    }
}
.el-icon-arrow-down{
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    z-index: 99;
}
.register{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #F0F0F0;
    color: $text-black-color;
    /deep/ .el-form-item__error{
        bottom: -0.07rem;
    }
    .cloud{
        width: 100%;
        height: 2.38rem;
        background-image: url("/images/cloud.png");
        background-size: 100% 100%;
        position: absolute;
        left: 0;
        bottom: 0;
    } 
    .content{
        margin: 0 auto;
        width: 11rem;
        height: 6rem; 
        .title{
            font-size: 0.24rem;
            margin: 0.55rem 0;
            text-align: center;
            b{
                color: $bg-color;
            }
        }
    }
    .phoneForm, .userForm{
        width: 4rem;
        margin: 0.52rem auto 0 auto;
        color: #333;
        /deep/ .el-input .el-input__inner{
            height: 0.61rem;
            background:rgba(255,255,255,0.3);
            border:none;
            border-radius:2px;
            padding-left: 0.82rem;
        }
        /deep/ .el-input .el-input__inner:focus{
            background:rgba(255,255,255,1);
        }
        /deep/ .el-form-item{
            margin-bottom: 0.31rem;
        }
        .iconfont{
            position: absolute;
            left: 0.25rem;
            top: 0.1rem;
            z-index: 88;
            font-size: 0.3rem;
            color: #374657;
        }
        .codeBtn{
            position: absolute;
            right: 0;
            top: 0;
            width: 1.25rem;
            height: 0.61rem;
            background:rgba(44,208,185,1);
            border-radius:0px 2px 2px 0px;
            font-size: 0.14rem;
            text-align: center;
            line-height: 0.61rem;
            color: #fff;
            cursor: pointer;
        }
        .btn{
            height: 0.61rem;
            background:rgba(212,226,230,1);
            border-radius:2px;
            text-align: center;
            line-height: 0.61rem;
            color: #6D7D41;
            cursor: pointer;
        }
        .btn:hover{
            color: #2CD0B9;
            border: 1px solid #2CD0B9;
        }
    }
    .phoneForm2{
        margin-top: 0;
    }
    .userForm{
        /deep/ .el-form-item{
            margin-bottom: 0.18rem;
        }
        /deep/ .el-select{
            width: 100%;
        }
        .iconfont.img{
            width: 0.29rem;
            top: 0.15rem;
        }
        .button-item{
            display: flex;
            justify-content: space-between;
            .btn{
                width: 1.9rem;
                color: #6D7D41;
            }
            .btn.next{
                background: #2CD0B9;
                color: #fff;
            }
        }
    }
}
.disableBtn{
    cursor: no-drop !important;
}
.login{
  position: fixed;
  right: 0.71rem;
  top: 0.29rem;
  z-index: 9999;
  span{
    color: $bg-color;
    cursor: pointer;
  }
}
.signUpWay{
    color: #2CD0B9;
    cursor: pointer;
}
</style>