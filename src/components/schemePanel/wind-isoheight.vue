<template>
    <div class="windisoheight">
        <div class="title"> <div class="line"></div> <span>等高线图层</span> </div>
        

        <div class="content" v-for="(item, index) of isoheightData" :key="'t'+index" >
            <el-checkbox
                @change="changeCheckbox($event, item)"
                :checked="item.checked">{{item.name}}</el-checkbox>
        </div>
    </div>
</template>
<script>

import { mapState } from "vuex"
export default {
    name: 'windisoheight',
    components:{
        
    },
    props:{
       
    },
    data (){
        return{
            isoheightData: []
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            windisoheightData: state => state.projectUpload.windisoheightData,
        })
    },
    watch:{
        
    },
    mounted (){
       this.init()
    },
    beforeDestroy (){
        this.isoheightData.forEach((item, index)=>{
            if(item.feature){
                item.checked = false
                gwmap.removeGisHeightLine(item)
            }
        })
        
    },
    methods:{
        init (){
            let data = this.windisoheightData.layers.split(',')
            for(let i in data ){
                this.isoheightData.push({
                    checked: false,
                    name: data[i],
                    url: this.windisoheightData.url.contour,
                    subdomains: this.windisoheightData.url.subdomains
                })
            }
        },
        changeCheckbox (value, item){
            item.checked = value
            // console.log(value, item)
            if(item.checked){
                gwmap.loadGisHeightLine(item)
            }else{
                gwmap.removeGisHeightLine(item)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.windisoheight{
    position: absolute;
    top: 0;
    left: -1rem;
    z-index: 99;
    min-width: 1rem;
    background:rgba(255,255,255,1);
    box-shadow: 0px 0px 7px 0px rgba(9,38,40,0.4);
    border-radius: 0.13rem;
    padding: 0 0 0.15rem 0;
    /deep/ .el-checkbox{
        margin: 0 0 0 0.1rem;
        color: #333333;
    }
    .title{
        display: flex;
        align-items: center;
        height: 0.35rem;
        .line{
            width: 0.07rem;
            height: 0.2rem;
            background:rgba(44,208,185,1);
            margin-right: 0.05rem;
        }
        span{
            font-weight: bold;
            color: #6D7D41;
        }
    }
    .content{
        padding: 0 0 0 0.05rem;
        line-height: 0.25rem;
    }
    
}

</style>