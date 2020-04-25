<template>
    <div class="scheme-memu">
        <div v-for="(item, index) of schemeMemu" :key="index"
        @click="clickSchemeMemu(item)"
        v-show="item.show"
        :class="item.active ? 'activeBg div' :'div'">
            <el-tooltip class="item" effect="light" :content="$t('m.'+ item.label)" placement="right">
                <i :class="item.icon"></i>
            </el-tooltip>
        </div>

        <component v-if="componentScheme && !Array.isArray(componentScheme)" :is="'scheme-'+ componentScheme" :componentScheme.sync="componentScheme"></component>
        <div class="foldable-window">
            <component v-if="Array.isArray(componentScheme) && componentScheme.includes('basedRoad')" is="scheme-basedRoad" :detailsData="stationData"></component>
            <component v-if="Array.isArray(componentScheme) && componentScheme.includes('boosterStation')" is="scheme-boosterStation" :detailsData="stationData"></component>
            <component v-if="Array.isArray(componentScheme) && componentScheme.includes('currentLine')" is="scheme-currentLine"></component>
        </div>
        <!-- <router-view /> -->
    </div>
</template>
<script>
import { mapState } from "vuex";
import {station_get} from "@/api/server.request.js"
export default {
    name: 'scheme-memu',
    components:{
        'scheme-overview': () => import('@/components/schemePanel/scheme-overview.vue'),
        'scheme-terrainData': () => import('@/components/schemePanel/scheme-terrainData.vue'),
        'scheme-windData': () => import('@/components/schemePanel/scheme-windData.vue'),
        'scheme-simulationData': () => import('@/components/schemePanel/scheme-simulationData.vue'),
        'scheme-planArrangement': () => import('@/components/schemePanel/scheme-planArrangement.vue'),
        'scheme-anemometerTower': () => import('@/components/schemePanel/scheme-anemometerTower.vue'),
        'scheme-pinggu': () => import('@/components/schemePanel/scheme-pinggu.vue'),
        'scheme-basedRoad': () => import('@/components/schemePanel/scheme-basedRoad.vue'),
        'scheme-boosterStation': () => import('@/components/schemePanel/scheme-boosterStation.vue'),
        'scheme-currentLine': () => import('@/components/schemePanel/scheme-currentLine.vue'),
    },
    data (){
        return{
            memuList: [],
            componentScheme: null,
            stationData: null
        }
    },
    computed:{
        ...mapState({
            schemeMemu: state => state.projectUpload.schemeMemu,
            schemeId: state => state.app['scheme_id'],
            componentPanel: state => state.projectUpload.componentScheme,
            projectInfo: state => state.app.projectInfo,
        })
    },
    watch:{
        componentPanel (val){
            console.log(val)
            this.componentScheme = val
        },
        schemeId () {
            this.stationData = null
        }
    },
    mounted (){
    },
    methods:{
      clickSchemeMemu(item) {
        var componentScheme = this.componentScheme
        item.active = !item.active
        this.schemeMemu.forEach((item2, index2) => {
          if (item2.label != item.label && !['basedRoad', 'boosterStation', 'currentLine'].includes(item.label)) {
            item2.active = false
          }
        })
        if (['basedRoad', 'boosterStation', 'currentLine'].includes(item.label)) {
          this.getData();
          if (Array.isArray(componentScheme)) {
            if (componentScheme.includes(item.label)) {
              componentScheme.splice(componentScheme.indexOf(item.label), 1)
              this.schemeMemu.forEach((item2, index2) => {
                if (item2.label == item.label) {
                  item2.active = false
                }
              })
            } else {
              componentScheme.push(item.label)
            }
          } else {
            componentScheme = [item.label]
          }
        } else {
          if (item.active) {
            componentScheme = item.label
            if(item.label == 'pinggu'){
              this.$emit('changeModel', false)
            }
          } else {
            componentScheme = null
          }
        }
        this.$store.commit('componentScheme', componentScheme)
        // console.log(componentScheme)
        // if (!item.active){
        //     this.$router.push({
        //         path: '/index/project',
        //         query: {
        //             id: this.projectInfo.project_id
        //         }
        //     })
        // } else{
        //     this.$router.push({
        //         path: '/index/project/'+ item.label,
        //         query: {
        //             id: this.projectInfo.project_id
        //         }
        //     })
        // }
      },
      getData() {
        if(this.stationData) {
          return
        }
        station_get(this.projectInfo.project_id, this.schemeId).then((res) => {
          if (res.code != 200) {
            this.$message.error(res.message)
            return
          }
          this.stationData = res.data;
        })
      }
    }
}
</script>
<style lang="scss" scoped>
.projectData{
    width: 4rem;
    background: red;
    position: absolute;
}
.scheme-memu{
    color: #6D7D41;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 0.6rem;
    padding: 0.1rem 0 0 0;
    position: relative;
    &>div.div{
        cursor: pointer;
        width: 0.48rem;
        height: 0.51rem;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont{
            font-size: 0.3rem;
        }
    }
    &>div:nth-of-type(4):before{
        position: absolute;
        left: 0;
        bottom:0;
        content: '';
        width:0;
        border-bottom: solid  darkblue 1px;
    }
    &>div:last-child{
        // border-bottom: 1px solid rgba(180,188,171,1);
    }
    .activeBg{
        background:rgba(255,255,255,1);
        color: #2CD0B9;
        border-radius: 0.11rem;
    }
    .foldable-window{
        position: absolute;
        bottom: 0.34rem;
        right: 0.62rem;
        z-index: 999;
        /deep/ > div{
            margin-bottom: 2px;
            width: 2.67rem;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 7px 0px rgba(9, 38, 40, 0.4);
            border-radius: 0.22rem 0.22rem 0.18rem 0.18rem;
            .title {
                padding: 0 0.2rem;
                color: #333333;
                height: 0.45rem;
                background: rgba(235, 242, 228, 1);
                border-radius: 0.22rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span:nth-of-type(1) {
                    font-weight: bold;
                }
                span:nth-of-type(2) {
                    cursor: pointer;
                    transform: rotate(90deg);
                    &.fold{
                        transform: rotate(0);
                    }
                }
            }
            .content {
                flex: 1;
                display: flex;
                justify-content: space-between;
                /deep/ .el-divider--vertical {
                    width: 1px;
                    height: 70%;
                    top: 15%;
                    margin: 0 3px;
                }
                .left {
                    width: 100%;
                    padding: 0.1rem 0;
                    li {
                        padding-left: 0.15rem;
                        line-height: 0.25rem;
                        display: flex;
                        span:nth-of-type(1) {
                            text-align: right;
                            display: inline-block;
                            min-width: 0.7rem;
                            text-align: justify;
                            text-align-last: justify;
                            margin-right: 0.1rem;
                        }
                        span:nth-of-type(2) {
                            flex: 1;
                            padding-left: 0.3rem;
                        }
                    }
                }
                .right {
                    width: 49%;
                }
            }
        }
    }
}
</style>
