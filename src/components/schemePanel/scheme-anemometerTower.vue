<template>
    <div class="scheme-anemometerTower">
        <div class="title"> <div class="line"></div> <span>风机排布</span> </div>

        <div class="content" v-for="(item, index) of anemometerTower" :key="'t'+index" >
            <el-checkbox
                v-show="item.isShow"
                @change="changeCheckbox($event, item)"
                :checked="item.checked"
                v-model="item.checked">
                {{$t('m.' + item.label)}}
            </el-checkbox>
            <div v-show="item.isShow && index == 2"  class="div">{{$t('m.' + item.label)}}</div>
        </div>
        <wind-param-table ref="windParamTable" @colseDraw="colseDraw" @renderCall="renderCall"></wind-param-table>
    </div>
</template>
<script>

import { mapState } from "vuex"
import { mastStatus, getNoisePoint, getNoiseStatus } from "@/api/server.request.js"
export default {
    name: 'scheme-anemometerTower',
    components:{
      'wind-param-table': () => import('@/components/schemePanel/component/wind-param-table.vue'),
    },
    props:{
    
    },
    data (){
        return{
            anemometerTower: []
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            schemeMemu: state => state.projectUpload.schemeMemu,
            scheme_id: state => state.app.scheme_id,
            pptModel: state => state.app.pptModel,
        })
    },
    watch:{
        // schemeMemu: {
        //     handler(val, oldVal){
        //         this.anemometerTower = val[5].children
        //         this.$nextTick(()=>{
        //           this.renderCall()
        //         })
        //     },
        //     deep:true
        // }
    },
    mounted (){
        if (!this.pptModel) {
            this.anemometerTower = this.schemeMemu[5].children.map(v=>{return Object.assign(v, {checked: false})})
        } else {
            this.anemometerTower = this.schemeMemu[5].children
            this.$refs.windParamTable && this.renderCall()
        }
        this.initConfidence()
    },
    beforeDestroy (){
        gwmap.noiseLayer.remove()
    },
    methods:{
        renderCall () {
            if (this.pptModel) {
              this.anemometerTower.forEach(v => {
                this.changeCheckbox(1, v)
              })
            }
        },
        initConfidence (){
            getNoiseStatus(this.projectInfo.project_id, this.scheme_id).then((res)=>{
                if(res.code != 200){
                    return
                }
                if(res.data[0].status == 2){
                    this.$store.commit('setSchemeMemu', {
                        type: 'windNoise',
                        data: true
                    })
                }else{
                    this.$store.commit('setSchemeMemu', {
                        type: 'windNoise',
                        data: false
                    })
                }
            })
        },
        changeCheckbox (value, item) {
            console.log(value, item)
            if (value !== 1) {
              item.checked = value
            }
            if(item.label == 'windParamTable'){
              if (item.checked){
                this.$refs.windParamTable.openDraw()
              } else {
                this.$refs.windParamTable && this.$refs.windParamTable.closeDraw()
              }
            }

            if(item.label == 'windNoise'){
              if (item.checked){
                this.getNoiseData()
              } else {
                gwmap.noiseLayer.remove()
              }
            }
        },
        getNoiseData (){
            if(!this.scheme_id) return;

            getNoisePoint({
                project_id: this.projectInfo.project_id,
                scheme_id: this.scheme_id,
            }).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                gwmap.noiseLayer.load(res.data)
            })
        },
        colseDraw (label) {
          this.anemometerTower.forEach(v =>{
            if(v.label == label) {
              v.checked = false
            //   gwmap.wtLayer.remove()
            }
          })
        }
    }
}
</script>
<style lang="scss" scoped>
.scheme-anemometerTower{
    position: absolute;
    top: 2.136rem;
    right: 0.6rem;
    z-index: 99;
    min-width: 1.5rem;
    background:rgba(255,255,255,1);
    box-shadow: 0px 0px 7px 0px rgba(9,38,40,0.4);
    border-radius: 0.13rem;
    padding: 0.15rem 0 0.15rem 0;
    /deep/ .el-checkbox{
        margin: 0 0 0 0.1rem;
        color: #333333;
    }
    .title{
        display: flex;
        align-items: center;
        height: 0.35rem;
        margin-bottom: 0.1rem;
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
        color: #333;
        padding: 0 0.15rem 0 0.1rem;
        line-height: 0.33rem;
        .div{
            padding: 0 0 0 0.1rem;
            cursor: pointer;
        }
    }
}

</style>
