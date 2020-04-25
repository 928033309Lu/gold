<template>
    <!-- <div class="tool-coverage">
        <p class="title"><span>{{$t('m.layerSelection')}}</span><span @click="$emit('update:componentTool',null)"><i class="iconfont icon-close"></i></span></p>
        <div class="content">
            <div class="type">{{$t('m.allLayers')}}</div>
            <el-checkbox v-for="(item,index) of treeData" :key="index"
            @change="onChange(item)"
            v-model="item.checked">{{$t('m.'+ item.layerName)}}</el-checkbox>
        </div>
    </div> -->
    <div class="tool-coverage tool-coverage2">
        <div class="close2" @click="$emit('update:componentTool',null)"></div>
        <div class="content">
            <el-checkbox v-for="(item,index) of treeData" :key="index"
            @change="onChange(item)"
            v-model="item.checked">{{$t('m.'+ item.layerName)}}</el-checkbox>
        </div>
    </div>
</template>
<script>
import { LayerConfig } from "@/config/layer-config.js";
export default {
    name: 'tool-coverage',
    data (){
        return{
            treeData: []
        }
    },
    mounted(){
        this.treeData = LayerConfig.filter((item,index)=>{
            return item.layerId > 0;
        });
    },
    methods:{
        onChange(data){
            // console.log(data)
            // 加载或移除 在线服务图层
            data.checked ? gwmap.loadServiceLayer(data) : gwmap.removeServiceLayer(data)
        }
    }
}
</script>
<style lang="scss" scoped>

.tool-coverage{
    position: fixed;
    /* right: 0;
    top: 0; */
    z-index: 99;
    width: 2.48rem;
    /* height: 100%; */
    background:rgba(235,242,228,1);
    color: #6D7D41;
    display: flex;
    flex-direction: column;
    /deep/ .el-checkbox{
        width: 100%;
        margin: 0 0 0.1rem 0.15rem;
        color: #6D7D41;
    }
    .title{
        height: 0.5rem;
        line-height: 0.5rem;
        padding: 0 0.15rem;
        display: flex;
        justify-content: space-between;
        span{
            color: #333;
            display: inline-block;
        }
        .iconfont{
            cursor: pointer;
            transition: all 0.3s;
        }
        .iconfont:hover{
            color: rgba(44,208,185,1);
            transform: scale(1.2);
            transition: all 0.3s;
        }
    }
    .content{
        width: 2.27rem;
        flex: 1;
        background: #fff;
        margin: 0 auto;
    }
    .type{
        height: 0.5rem;
        line-height: 0.5rem;
        padding: 0 0.15rem;
        border-bottom: 1px solid #D1D4C8;
        margin-bottom: 0.2rem;
    }
}
.tool-coverage2{
    left: 0.8rem;
    bottom: 0.4rem;
    padding: 0.15rem;
    border-radius: 0.09rem;
    .close2{
        cursor: pointer;
        position: absolute;
        left: -0.6rem;
        bottom: 0.4rem;
        width: 0.5rem;
        height: 0.5rem;
    }
    .content{
        width: 100% !important;
    }
}

</style>