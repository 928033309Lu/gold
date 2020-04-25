<template>
  <div class="errorClass">
    <div>
      <span class="codeTxt">{{codeTxt}}</span>
      <el-button v-show="codeTxt!=401" @click="clickHome">返回首页</el-button>
      <el-button @click="clickLogin">返回登录</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "error",
  data () {
    return {

    }
  },
  computed: {
    codeTxt () {
      return this.$route.params.code || null;
    }
  },
  mounted () {

  },
  methods: {
    clickHome () {
      this.$router.push("/index")
    },
    clickLogin () {
      this.$router.push("/login")
    },
    onStepRouter(){
      this.$router.go(-1);
    }
  }
}
</script>
<style lang="scss">
.errorClass {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
  background: #fff;
  color: #000;
  &>div{
    width: 50%;
    height: 50%;
    margin: 10% auto 0 auto;
  }
  .codeTxt{
    font-size: 0.5rem;
  }
}
</style>