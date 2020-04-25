<template>
    <div class="tool-profile">
        <div>
            <p class="title"><span>剖面分析</span> <span @click="close" class="closeIcon"><i class="iconfont icon-close"></i></span></p>
            <div class="content">
                <elevation-slicing ref="elevPanel" :showContent="true"></elevation-slicing>
            </div>
         </div>
    </div>
</template>
<script>

import ElevationSlicing from '@/components/elevation-slicing/index.vue'
import { mapState } from "vuex";

export default {
    name: 'tool-profile',
    props:{
        profileArr:{}
    },
    components:{
        ElevationSlicing
    },
    data (){
        return{
            options: {}
        }
    },
    mounted(){
        this.init();
    },
    computed:{
        
    },
    watch:{
        
    },
    methods:{
        init(){
            if (!this.$refs.elevPanel || this.profileArr.length <= 0) return
            this.$refs.elevPanel.setData(this.profileArr)
        },
        close (){
            this.$emit("update:componentProfile", null);
        }
    }
}
</script>
<style lang="scss" scoped>
.tool-profile{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0);
    &>div{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 999;
        width: 1000px;
        height: 380px;
        background:#fff;
        color: #6D7D41;
        border-radius: 0.22rem 0.22rem 0.8rem 0.22rem;
    }
}
.title{
    color: #333;
    display: flex;
    justify-content: space-between;
    padding: 0.1rem 0.2rem;
    font-weight: bold;
    border-radius: 0.22rem;
    background: #EBF2E4;
    .closeIcon{
        cursor: pointer;
    }
    .closeIcon:hover{
        font-weight: bold;
    }
}
.content{
    width: 100%;
}

</style>