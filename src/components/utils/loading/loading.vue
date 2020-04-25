<template>
    <div class="loading-panel" v-show="loadingObj.loading">
        <div>
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p>{{loadingObj.text}}</p>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    name:"loading-panel",
    computed:{
        ...mapState({
            loadingObj: state => state.screen.loadingObj,
        })
    }
}
</script>
<style lang="scss">
.loading-panel{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    color: #fff;
    z-index: 9999999;
    &>div{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 3rem;
        height: 3rem;
        text-align: center;
        p{
            margin-top: 0.3rem;
        }
    }
}
.loading{
    width: 0.8rem;
    height: 0.5rem;
    margin: 0 auto;
}
.loading span{
    display: inline-block;
    width: 0.08rem;
    height: 100%;
    border-radius: 0.04rem;
    background: #2cd0b9;;
    -webkit-animation: load 1s ease infinite;
}
@-webkit-keyframes load{
    0%,100%{
        height: 0.4rem;
        background: #2cd0b9;;
    }
    50%{
        height: 0.7rem;
        margin: -0.14rem 0;
        background: #2cd0b9;;
    }
}
.loading span:nth-child(2){
    -webkit-animation-delay:0.2s;
}
.loading span:nth-child(3){
    -webkit-animation-delay:0.4s;
}
.loading span:nth-child(4){
    -webkit-animation-delay:0.6s;
}
.loading span:nth-child(5){
    -webkit-animation-delay:0.8s;
}
</style>