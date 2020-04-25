<template>
    <div class="comparison-hover"  v-if="indexHover > 0">
        <!-- <div class="close" @click="onClose"><i class="iconfont icon-close"></i></div> -->

        <div class="title">
            <span v-show="indexHover == 1">各方案发电量-风速对比图</span>
            <span v-show="indexHover == 2">各方案工程概算分析(万元)</span>
            <span v-show="indexHover == 3">各方案经济指标分析</span>
        </div>

        <div class="content">
            <my-echarts v-if="indexHover == 1" class="top"
            :options="hover1EchartOption ? hover1EchartOption : {}" :theme="'brokenLine'" :autoResize="true"></my-echarts>

            <my-echarts v-if="indexHover == 2"
            :options="hover2EchartOption ? hover2EchartOption : {}" :theme="'brokenLine'" :autoResize="true"></my-echarts>

            <my-echarts v-if="indexHover == 3"
            :options="hover3EchartOption ? hover3EchartOption : {}" :theme="'brokenLine'" :autoResize="true"></my-echarts>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getTurbine_scheme } from "@/api/server.request.js"
export default {
    name: 'comparison-hover',
    components:{
        myEcharts: () => import('@/components/utils/echarts/echarts.vue'),
    },
    props:{
        indexHover:{},
        hover1EchartOption:{},
        hover2EchartOption:{},
        hover3EchartOption:{},
    },
    data (){
        return{
            
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
        })
    },
    watch:{
       
    },
    mounted (){
        
    },
    beforeDestroy (){

    },
    methods:{
        onClose (){
            this.$emit('closeHover') 
        }
    }
}
</script>

<style lang="scss" scoped>
.comparison-hover{
    position: absolute;
    width: 4.5rem;
    top: -3.5rem;
    left: 0.2rem;
    z-index: 999;
    background: #fff;
    border-radius: 0.22rem;
    margin: 0 auto;
    .title{
        color: #6D7D41;
        height: 0.45rem;
        line-height: 0.45rem;
        padding: 0 0 0 0.2rem;
        background: #EBF2E4;
        border-radius: 0.22rem;
    }
    .close{
        width: 0.4rem;
        height: 0.4rem;
        line-height: 0.4rem;
        text-align: center;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
    }
    .close:hover .iconfont{
        font-weight: bold;
    }
    .content{
        height: 2.9rem;
        display: flex;
        justify-content: center;
        .top{
            position: relative;
            top: -0.1rem;
        }
    }
}
</style>