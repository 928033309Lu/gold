<template>
    <!-- <div class="tool-list" :style="componentTool? language == 'en' ? 'padding-right:3.9rem' : 'padding-right:2.9rem' : ''"> -->
    <div class="tool-list">
        <div v-for="(item,index) of toolList" :key="index"
        :class="item.active ? 'active' : ''"
        @click="toolChange(item,index)">
            <el-tooltip class="item" effect="light" :content="$t('m.'+ item.label)" placement="right">
                <i :class="item.icon"></i>
            </el-tooltip>
        </div>
    </div>
</template>
<script>
import { toolList } from "@/config/tool-list-config.js";
export default {
    name: 'tool-list',
    props:{
        componentTool:{},
        profileArr:{}
    },
    data (){
        return{
            toolList: []
        }
    },
    computed:{
        language (){
            return this.$i18n.locale;
        }
    },
    watch:{
        componentTool (val){
            if(!val){
                this.toolList[4].active = false;
            }
        },
        "$store.state.app.measuredlength":function(val){
            if(val > 0){
                let arr = this.toolList.filter((item,index)=>{
                    return item.active == true;
                })
                arr.length > 0 && this.onMeasured(arr[0]);
            }
        },
        profileArr(val){
            if(val.length >0 ){
                let arr = this.toolList.filter((item,index)=>{
                    return item.active == true;
                })
                arr.length > 0 && this.onMeasured(arr[0]);
            }
        }
    },
    mounted(){
        this.toolList = toolList
    },
    methods:{
        toolChange (data, index){
            // console.log(data.type)
            this.toolList.forEach((item,index)=>{
                item.active = false;
            })
            data.active = true;
            this.onMeasured(data);
        },
        onMeasured (data){
            this.$store.commit('measuredlength', 0);
            this.$store.commit('profilePoints', []);
            switch (data.type){
                case 'default':
                    data.active = false;
                    this.$emit('closeComponentCoverage');
                    gwmap.mapControlManager.disactive('measure');
                    document.querySelector('body').className = '';
                break;
                case 'length':
                    document.querySelector('body').className = 'measurePen';
                    gwmap.mapControlManager.active('measureLength');
                break;
                case 'area':
                    document.querySelector('body').className = 'measurePen';
                    gwmap.mapControlManager.active('measureArea');
                break;
                case 'elevation':
                    document.querySelector('body').className = 'measurePen';
                    gwmap.mapControlManager.active('measureProfile');
                break;
                case 'coverage':
                    this.$emit('toolChange', data);
                break;
                case 'favorite':
                    
                break;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.tool-list{
    position: fixed;
    left: 0.2rem;
    bottom: 0.3rem;
    z-index: 9;
    width: 0.5rem;
    transition: all 0.5s;
    &>div{
        width: 0.5rem;
        height: 0.5rem;
        text-align: center;
        line-height: 0.5rem;
        cursor: pointer;
        outline: none;
    }
    &>div:hover{
        color: #36CAB3;
        // position: relative;
        // .bg{
        //     position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;
        //     border-radius: 100%;
        //     animation: myBg 0.4s;
        //     animation-fill-mode: forwards;
        //     animation-timing-function: 0.4s;
        // }
    }
    .active{
        color: #36CAB3;
    }
    .iconfont{
        font-size: 0.3rem;
        outline: none;
    }
}   
// @keyframes myBg
// {
//     0% {width: 0;background: none;opacity: 0;}
//     50% {width: 100%;background: #36CAB3;opacity: 0.3;}
//     100% { width: 0;background: none;opacity: 0;}
// } 
</style>