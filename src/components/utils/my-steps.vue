<template>
    <div class="my-steps" :style="{width: boxWidth}">
        <div v-for="(item,index) of stepsArr" :key="index" 
        :class="item.value < activeValue ? 'finish' : ''">
            <span class="circle" 
            :class="item.value == activeValue ? 'active' : ''"
            :style="{width: width, height: width, lineHeight: width}">
                {{item.value}}
                <b class="iconBox"><i class="iconfont icon-dui"></i></b>
            </span>
            <span :class="item.value == activeValue ? 'activeLabel' : ''">{{$t('m.'+ item.label)}}</span>

            <div class="line"></div>
        </div>
    </div>
</template>
<script>
import steps from "@/config/steps-config.js";
export default {
    name: 'my-steps',
    props:{
        activeValue:{
            type: Number,
            default: 1
        },
        width:{
            default: '0.43rem'
        },
        boxWidth:{
            default: '8rem'
        }
    },
    data (){
        return{
            stepsArr: []
        }
    },
    mounted(){
        this.stepsArr = steps;
    }
}
</script>
<style lang="scss" scoped>
.my-steps{
    display: flex;
    justify-content: space-between;
    span{
        display: block;
        margin: 0 auto;
        font-size: 0.14rem;
    }
    .circle{
        text-align: center;
        background:rgba(193,193,193,1);
        border-radius:50%;
        position: relative;
        z-index: 99;
        margin-bottom: 0.2rem;
    }
    .iconBox{
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
        border-radius: 50%;
        overflow: hidden;
        width: 100%;
        background:rgba(44,208,185,1);
    }
    &>div{
        flex: 1;
        text-align: center;
        position: relative;
        .line{
            border-bottom: 1px solid rgba(193,193,193,1);
            position: absolute;
            width: 100%;
            left: 50%;
            top: 30%;
        }
    }
    &>div:last-child .line{
        display: none;
    }
    .active{
        width: 0.64rem !important;
        height: 0.64rem !important;
        line-height: 0.64rem !important;
        background:rgba(44,208,185,1);
        font-size: 0.24rem;
        color: #fff;
        position: relative;
        top: -0.1rem;
        margin-bottom: 0;
    }
    .activeLabel{
        color: rgba(44,208,185,1);
    }
    .finish {
        span:nth-of-type(1){
            color: #fff;
        }
        span:nth-of-type(2){
            color: rgba(44,208,185,1);
        }
        .circle{
            background:rgba(44,208,185,1);
            .iconBox{
                display: block;
            }
        }
    }
}

</style>