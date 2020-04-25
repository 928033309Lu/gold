<template>
    <div class="windFactor">
        <div class="title"> <div class="line"></div> <span>限制性因素</span> </div>
        

        <div class="content" v-for="(item, index) of factorList" :key="'t'+index" >
            <el-checkbox v-if="item.isShow"
                @change="changeCheckbox($event, item)"
                :checked="item.checked">{{$t('m.'+item.fileName_astrict)}}</el-checkbox>
        </div>
        <div class="content" v-for="(item, index) of customFactorData" :key="'n'+index" >
            <el-checkbox v-if="item.fileName_astrict_new"
                @change="changeCheckbox2($event, item)"
                :checked="item.checked">{{item.fileName_astrict_new}}</el-checkbox>
        </div>
    </div>
</template>
<script>

import { mapState } from "vuex"
export default {
    name: 'windFactor',
    components:{
        
    },
    props:{
       
    },
    data (){
        return{
            factorList: [],
            customFactorData: []
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            factorData: state => state.projectUpload.factorData,
            customData: state => state.projectUpload.customFactorData,
        })
    },
    watch:{
        factorData:{
            handler(val, oldVal){
                this.factorList = val
            },
            deep:true
        },
        customData:{
            handler(val, oldVal){
                this.customFactorData = val
                this.loadastrictLayer()
            },
            deep:true
        },
        
    },
    mounted (){
       this.init()
    },
    beforeDestroy (){
        
        this.customFactorData.forEach((item, index) =>{
            item.checked = false
            // console.log(item.id)
            if (item.id){
                gwmap.astrictLayer.remove(item)
            }
        })
        this.factorList.forEach((item, index)=>{
            item.checked = false
            // console.log(item)
            if(item.fileName_astrict == 'windLine'){
                gwmap.removeGisMap(item, 'road')
            }
            if(item.fileName_astrict == 'windHouse'){
                gwmap.removeGisMap(item, 'building')
            }
            if(item.fileName_astrict == 'windLakes'){
                gwmap.removeGisMap(item, 'water')
            }
        })
        this.$store.commit('openWindFactor', false)
    },
    methods:{
        init (){
            this.factorList = this.factorData
            this.customFactorData = this.customData
            console.log(this.factorList)
            console.log(this.customFactorData)
        },
        changeCheckbox (value, item){
            item.checked = value
            console.log(value, item)
            // 道路
            if (item.fileName_astrict == 'windLine'){
                if (item.checked){
                    gwmap.loadGisMap(item, 'road')
                }else{
                    gwmap.removeGisMap(item, 'road')
                }
            }
            // 房屋
            else if (item.fileName_astrict == 'windHouse'){
                if (item.checked){
                    gwmap.loadGisMap(item, 'building')
                }else{
                    gwmap.removeGisMap(item, 'building')
                }
            }
            // 湖泊
            else if (item.fileName_astrict == 'windLakes'){
                if (item.checked){
                    gwmap.loadGisMap(item, 'water')
                }else{
                    gwmap.removeGisMap(item, 'water')
                }
            }
           
        },
        changeCheckbox2 (value, item){
            item.checked = value
            console.log(value, item)
            // 限制因素
            if (item.checked){
                gwmap.astrictLayer.load(item)
            }else{
                gwmap.astrictLayer.remove(item)
            }
        },
        loadastrictLayer (){
            if(this.customFactorData.length<=0) return;
            this.customFactorData.forEach((item, index) =>{
                if (item.url && item.checked){
                    gwmap.astrictLayer.load(item)
                }
                if (item.url && !item.checked){
                    gwmap.astrictLayer.remove(item)
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.windFactor{
    position: absolute;
    top: 0;
    right: 1.41rem;
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