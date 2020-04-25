<template>
  <div class="login-box">
    <div :class="active? 'active' : '' ">
      <div class="login-view">
        <div class="bgDiv"></div>
        <div class="div">
          <p style="font-weight: 100">{{ $t("m.goldName") }}</p>
          <div class="loginBtn" @click="rollClick">{{$t('m.enter')}}
            <img src="/images/login.png" alt="login" />
          </div>
        </div>
        <vue-particles
          style="z-index: 1; position: relative;"
          color="#ffffff"
          :particleOpacity="0.3"
          linesColor="#ffffff"
          :particlesNumber="60"
          shapeType="circle"
          :particleSize="3"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.2"
          :linesDistance="300"
          :moveSpeed="3"
          :hoverEffect="true"
          hoverMode="grab"
          :clickEffect="true"
          clickMode="push"></vue-particles>
      </div>

      <!-- //---- -->

      <div class="login-panel">
        <p class="register" v-show="active">{{$t('m.noAccount')}}, <router-link to="/register" tag="span">{{$t('m.signUp')}}</router-link> </p>

        <p class="cloud"></p>
        <div>
          <p class="head">{{$t('m.login')}}</p>

          <el-form ref="userForm" :model="userForm" :rules="rules" label-width="10px">
            <el-form-item prop="telPhone">
              <img class="iconfont userImg" src="/images/user.png" alt="login" />
              <el-input v-model="userForm.telPhone" type="number" :placeholder="$t('m.telPhone2')"
              @keydown.enter.native="nextInputFocus"
              ></el-input>
            </el-form-item>
            <el-form-item prop="passWord">
              <i class="iconfont icon-password"></i>
              <el-input ref="passInput" v-model="userForm.passWord" :placeholder="$t('m.passWord')" show-password
              @keydown.enter.native="handleSubmit"
              ></el-input>
            </el-form-item>
          </el-form>

          <div class="passPanel">
            <el-checkbox :label="$t('m.rememberPass')" v-model="checkedPass"></el-checkbox>
            <div @click="forgetPass" style="cursor:pointer;">{{$t('m.forgetPass')}}?</div>
          </div>

          <div class="submit">
            <el-button @click="handleSubmit">{{$t('m.login')}}</el-button>
          </div>
        </div>


        <p class="buttomTip">Copyright goldwind.com.cn All Right Reserved.<span></span>新ICP备 11003499号-2<span></span>
          <img src="/images/timg.png" alt="">
          新公网安备 65010602000294号 </p>
      </div>
    </div>
  </div>
</template>
<script>
import VueParticles from '@/components/vue-particles/vue-particles.vue';
import www from '@/utils/auth.js';
import crypto from '@/utils/crypto.js';
import { setToken, setLocal, getLocal, removeToken, removeLocal } from '@/utils/auth';
import { postLogin } from '@/api/server.request';
import envConfig from '@/config/env-config'
export default {
  name: "login",
  components:{
    VueParticles
  },
  data () {
    return {
      active: false,
      checkedPass: false,
      rules: {
        telPhone: [
          { required: true, message: this.$t('m.accountEmpty'), trigger: 'change' },
          { min: 11, max: 11, message: this.$t('m.telPhone3'), trigger: 'change' }
        ],
        passWord: [
          { required: true, message: this.$t('m.emptyPassWord'), trigger: 'change' }
        ]
      },
      userForm:{
        telPhone: "",
        passWord: ""
      }
    }
  },
  mounted () {
    if(this.$route && this.$route.query && this.$route.query.rool){
      this.active = true;
    }
    this.getPassword();
  },
  watch:{
    
  },
  methods:{
    getPassword(){
      // console.log("getPassword")
      let key1 = getLocal(envConfig.appTitle+'key1');
      let key2 = getLocal(envConfig.appTitle+'key2');
      if(key1 && key2){
        this.userForm.telPhone = crypto.Decrypt(key1);
        this.userForm.passWord = crypto.Decrypt(key2);
        this.checkedPass = true;
      }
    },
    nextInputFocus () {
      this.$refs.passInput.$el.querySelector('input').focus();
    },
    rollClick () {
      this.active = true;
    },
    forgetPass(){
      this.$router.push("/forget-login");
    },
    handleSubmit(){
      let that = this;
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          postLogin({
            password: that.userForm.passWord,
            phone: that.userForm.telPhone,
          }).then((res)=>{
            if(res.code != 200){
              this.$message.error(res.message);
              return;
            }
            this.$message({
              type: 'success',
              message: res.message,
              duration: 1000
            });
            if(this.checkedPass){
              this.rememberPass();
            } else{
              removeLocal(envConfig.appTitle+'key1');
              removeLocal(envConfig.appTitle+'key2');
            }
            // 存用户信息
            setLocal(envConfig.appTitle+'-user' , res.data);
            this.$store.dispatch('setUser', res.data);
            // 存token到cookies
            setToken(res.data.token);
            this.$router.push('/index');
            gwmap.dataManager.fltToHome()
          })
        } else {
            return false;
        }
      });
    },
    rememberPass(){
      // 存账号密码
      let key1 = crypto.Encrypt(this.userForm.telPhone);
      let key2 = crypto.Encrypt(this.userForm.passWord);
      setLocal(envConfig.appTitle+'key1' , key1);
      setLocal(envConfig.appTitle+'key2' , key2);
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/fixed/variable-set.scss";
$input-height: 0.72rem;
$color: #000;

.login-box{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ccc;
  color: #fff;
  overflow: hidden;
  &>div{
    height: 200%;
    position: relative;
    top: 0;
    transition: all 0.5s;
  }
  .active{
    top: -100%;
    transition: all 0.5s;
  }
}
.login-view{
  height: 50%;
  background-image: url("/images/loginBg.jpg");
  background-size: 100% 100%;
  position: relative;
  .bgDiv{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 9rem;
    height: 9rem;
    background-image: url("/images/loginTxt.png");
    background-size: 100% 100%;
  }
  .div{
    display: inline-block;
    width: 11rem;
    height: 5rem;
    padding-top: 2.9rem;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    font-size: 0.18rem;
  }
  .loginBtn{
    background: $button-background;
    border-radius: 0.25rem;
    border: none;
    width: 2.24rem;
    height: 0.5rem;
    line-height: 0.5rem;
    position: relative;
    top: 0.5rem;
    left: 50%;
    margin-left: -1.12rem;
    cursor:pointer;
    font-size: 0.16rem;
    z-index: 66;
  }
  .loginBtn:hover{
    background: $button-hover-background;
  }
  img{
    vertical-align: middle;
    margin-left: 0.05rem;
  }
}
.login-panel{
  position: relative;
  height: 50%;
  color: $color;
  display: flex;
  justify-content: center;
  background: #f0f0f0;
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
    color: $color;
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
    bottom: -0.1rem;
  }
  &>div{
    min-width: 5.2rem;
    min-height: 5rem;
    margin-top: 0.8rem;
    z-index: 1;
  }
  .head{
    font-size: 0.3rem;
    text-align: center;
    margin-bottom: 0.4rem;
  }
  .iconfont{
    font-size: 0.25rem;
    position: absolute;
    top: 0.15rem;
    left: 0.45rem;
    z-index: 1;
  }
  .userImg{
    width: 0.28rem;
    height: 0.28rem;
    top: 0.2rem;
  }
  .passPanel{
    display: flex;
    justify-content: space-between;
    padding: 0 0 0.4rem 10px;
    /deep/ .el-checkbox{
      color: $color;
      font-size: 0.14rem;
    }
  }
  .submit{
    padding: 0 0 0 10px;
    /deep/ .el-button{
      width: 100%;
      height: 0.64rem;
      border-radius: 0.5rem;
      font-size: 0.18rem;
      background: none;
      border: 1px solid $button-background;
      color: #333;
    }
    /deep/ .el-button:hover{
      background: $button-hover-background;
      color: $button-hover-text;
    }
  }
}

.register{
  position: fixed;
  right: 0.71rem;
  top: 0.29rem;
  z-index: 9999;
  span{
    color: $bg-color;
    cursor: pointer;
  }
}

.buttomTip{
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #9c9c9c;
  font-size: 11px;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 999;
  text-align: center;
  span{
    display: inline-block;
    width: 20px;
  }
  img{
    height: 20px;
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
}
</style>