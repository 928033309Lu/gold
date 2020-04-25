<template>
    <div class="earth-fan" @click="onClickProject(fanData)" v-if="clickEarthFan" :style="{left: (clickEarthFan.x - 144) + 'px', top: (clickEarthFan.y - 287) + 'px'}">
        <div v-if="imgUrl" class="imgBox"><img src="" alt="" /></div>
        <div v-else class="imgBox imgBox2"><i class="el-icon-picture-outline"></i></div>

        <ul class="content">
            <p class="titleName"> {{fanData && fanData.project_name}} </p>
            <li> <span>业主单位：</span> <span> {{fanData &&fanData.owner_id}} </span> </li>
            <li> <span>行政划区：</span> <span> {{fanData && fanData.province + fanData.city + fanData.county}} </span> </li>
            <li> <span>创建时间：</span> <span> {{fanData && fanData.create_time}} </span> </li>
            <li> <span>项目容量：</span> <span> {{fanData && fanData.design_capacity}} </span> </li>
            <li> <span>备注：</span> <span> {{fanData && fanData.description}} </span> </li>
        </ul>
        
        <div class=" triangle"><div class=" triangle2"></div></div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { getProjectInfo } from "@/api/server.request.js"
export default {
    name: 'earth-fan',
    data (){
        return{
            imgUrl: null,
            fanData: null
        }
    },
    computed: {
        ...mapState({
            clickEarthFan: state => state.earthFan.clickEarthFan,
            uploadScheme_id: state => state.app.scheme_id,
        })
    },
    watch:{
        clickEarthFan (val){
            if(val){
                this.fanData = null
                this.getData(val.id)
            }
        }
    },
    mounted(){

    },
    methods:{
        getData (project_id){
            getProjectInfo(project_id).then((res)=>{
                if (res.code != 200){
                    this.$message.error(res.message);
                    return;
                }
                this.fanData = res.data;
                this.imgUrl = res.data.project_picture;
                this.$store.commit('setProjectInfo', res.data);
            })
        },
        onClickProject (item){
            if (!item) return;
            // setTimeout(()=>{
                this.$store.commit('setProjectInfo', item);
            // },100)
            if (item.four_point) {
                gwmap.dataManager.fltToRectangle(item.four_point, this.uploadScheme_id)
            }else{
               gwmap.dataManager.flyToLocation(item.longitude, item.latitude);
            }
            // this.$router.push('/index/project/' + item.project_id)
            this.$router.push({
                path: '/index/project',
                query: {
                    id: item.project_id
                }
            })
            this.$store.commit('clickEarthFan', null)
            this.$store.commit('componentScheme', null)
        }
    }

}
</script>
<style lang="scss" scoped>
.earth-fan{
    cursor: pointer;
    position: fixed;
    z-index: 11;
    width: 2.7rem;
    min-height: 2.77rem;
    background: rgba(255,255,255,1);
    padding: 6px 8px;
    color: #333333;
    .imgBox{
        height: 1.03rem;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
            width: 100%;
            height: 100%;
        }
        .el-icon-picture-outline{
            font-size: 0.35rem;
        }
    }
    .imgBox2{
        background: rgba(244,244,244,0.5);
    }
    .content{
        padding: 8px 6px 0 6px;
        font-size: 0.13rem;
        li{
            margin-top: 10px;
            display: flex;
            span:first-child{
                display: inline-block;
                min-width: 65px;
            }
            span:last-child{
                flex: 1;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
    }
    .titleName{
        color: #2CD0B9;
        font-size: 0.16rem;
        font-weight: bold;
    }
    .triangle:before{
        content: "";
        width: 0px;
        height: 0px;
        border-top: 0.2rem solid #fff;
        border-left: 0.2rem solid transparent;
        border-right: 0.2rem solid transparent;
        position: absolute;
        bottom: -0.2rem;
        left: 50%;
        margin-left: -0.1rem;
    }
    .triangle2:before{
        content: "";
        width: 0px;
        height: 0px;
        border-top: 0.08rem solid #2CD0B9;
        border-left: 0.08rem solid transparent;
        border-right: 0.08rem solid transparent;
        position: absolute;
        bottom: -0.08rem;
        left: 50%;
        margin-left: 0.02rem;
    }
}
</style>