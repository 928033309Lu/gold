<template>
    <div class="comparison-overlap-details" v-if="comparisonDetalisData && mouseMoveList && mouseMoveList.infos && mouseMoveList.infos.length > 0" 
    :style="{left: mouseMoveList.pos.x+65 + 'px', top: mouseMoveList.pos.y + 'px'}">
        <div class="title">
            <span>风机详情</span>
        </div>
        <div class="content">
            <div>
                <span>机型：</span>
                <span>{{details && details.turbine_type}}</span>
            </div>
            <div>
                <span>轮毂高度(m)：</span>
                <span>{{details && details.height}}</span>
            </div>
            <div>
                <span>海拔(m)：</span>
                <span>{{details && details.elevation}}</span>
            </div>
            <div>
                <span>空气密度(kg/m3)：</span>
                <span>{{details && details.air_density}}</span>
            </div>
            <div>
                <span>风切变：</span>
                <span>{{details && details.average_shear}}</span>
            </div>
            <div>
                <span>湍流强度：</span>
                <span>{{details && details.representative_wake_added}}</span>
            </div>
            <div>
                <span>尾流前风速(m/s)：</span>
                <span>{{details && details.free_speed}}</span>
            </div>
            <div>
                <span>尾流损失(%)：</span>
                <span>{{details && details.speed_discount}}</span>
            </div>
            <div>
                <span>尾流后风速(m/s)：</span>
                <span>{{details && details.waked_speed}}</span>
            </div>
            <div>
                <span>上网电量(MWh/y)：</span>
                <span>{{details && details.array_yield}}</span>
            </div>
            <div>
                <span>等效小时数(h)：</span>
                <span>{{details && details.equal_hours}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getTurbineSingle } from "@/api/server.request.js"
export default {
    name: 'comparison-overlap',
    components:{

    },
    data (){
        return{
            details: null,
            waitingMinute: false
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            mouseMoveList: state => state.app.mouseMoveList,
            comparisonDetalisData: state => state.app.comparisonDetalisData,
        })
    },
    watch:{
        comparisonDetalisData:{
            handler(val, oldVal){
                this.getDetailsData(val)
                this.turbine_id = val.id
                this.scheme_id = val.scheme
            },
            deep:true
        },
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: '正在获取机位点数据，请稍候...'});
        },
    },
    mounted (){
        
    },
    beforeDestroy (){

    },
    methods:{
        getDetailsData (val){
            // console.log(this.turbine_id, val.id)
            if (this.turbine_id == val.id && this.details){
                return
            }
            // this.waitingMinute = true
            getTurbineSingle(this.projectInfo.project_id, val.scheme, val.id).then((res)=>{
                this.waitingMinute = false
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.details = res.data
                console.log(this.details)
            }).catch((err)=>{
                this.waitingMinute = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.comparison-overlap-details{
    position: fixed;
    z-index: 9999;
    width: 3.5rem;
    background: #fff;
    border-radius: 0.22rem;
    color: #333;
    .title {
      padding: 0 0.2rem;
      color: #333333;
      height: 0.4rem;
      background: rgba(235, 242, 228, 1);
      border-radius: 0.22rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .content{
        padding: 0.1rem 0.2rem;
        &>div{
            line-height: 0.23rem;
            span:nth-of-type(1){
                display: inline-block;
                min-width: 1.6rem;
            }
            span:nth-of-type(2){
                color: #6D7D41;
            }
        }
    }
}
</style>