<template>
<div class="fan-list-element" :class="list.scheme_id == active_scheme_id ? 'active' : ''">
    <div v-show="!listActive" class="minList">
        <el-checkbox @change="onChange" v-model="list.checked"></el-checkbox>
        <span @click.stop="onClick(list)"  class="name ellipsis">{{list.scheme_name}}</span>
    </div>
    <div v-show="listActive" class="maxList">
        <el-checkbox @change="onChange" v-model="list.checked"></el-checkbox>
        <div class="title">
            <div>
                <div v-if="openPutName">
                    <span class="name ellipsis"  @click.stop="onClick(list)">{{list.scheme_name}}</span>
                    <el-tooltip class="item" effect="light" :content="$t('m.putScheme')" placement="top">
                        <span @click.stop="openPutName = false"><i class="iconfont icon-bianji"></i></span>
                    </el-tooltip>
                    <!-- <el-tooltip class="item" effect="light" :content="$t('m.yicahng1')" placement="top">
                        <span v-if="list.status_id == 3" class="yichangLabel"><i class="iconfont icon-yichang1"></i></span>
                    </el-tooltip> -->
                </div>
                <div v-if="!openPutName">
                    <el-input v-model="list.scheme_name">
                        <el-button @click.stop="handleClick('put')" slot="append" class="btn">{{$t('m.confirm')}}</el-button>
                    </el-input>
                </div>
                
            </div>
            <div>
                <el-tooltip class="item" effect="light" :content="$t('m.copyScheme')" placement="top">
                    <span v-if="list.status_id != 1" @click.stop="handleClick('copy')"><i class="iconfont icon-fuzhi"></i></span>
                </el-tooltip>
                <el-tooltip class="item" effect="light" :content="$t('m.removeScheme')" placement="top">
                    <span  v-if="list.status_id != 1" @click.stop="handleClick('remove')"><i class="iconfont icon-shanchu1"></i></span>
                </el-tooltip> 
                <!-- <el-tooltip class="item" effect="light" :content="list.status_id == 3 ? $t('m.yicahng1') : $t('m.statusScheme')" placement="top">
                    <span v-if="list.status_id == 3" @click.stop="handleClick('status')"><i class="iconfont icon-fankuijindu" :style="list.status_id == 3 ? 'color: red' : ''"></i></span>
                </el-tooltip> -->
            </div>
        </div>

        <div class="content" @click.stop="onClick(list)" v-show="list.status_id != 1">
            <div>
                <div>{{list.vat_cit ? list.vat_cit.toFixed(2) : '-'}}</div>
                <div>{{$t('m.KWHcost')}}</div>
                <div>{{$t('m.unitKWH')}}</div>
            </div>
            <div>
                <div>{{Math.round(list.equal_hours)}}</div>
                <div>{{$t('m.equivalentHours')}}</div>
                <div>{{$t('m.uniyhours')}}</div>
            </div>
            <div>
                <div>{{list.pirr ? list.pirr.toFixed(2) : '-'}}</div>
                <div>{{$t('m.investment')}}</div>
                <div>PIRR(%)</div>
            </div>
        </div>
        <div class="contentStatus" @click.stop="onClick(list)" v-show="list.status_id == 1">
            <!-- <div class="imgLoading">
                <div class="bgBox"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div></div>
            </div> -->
            <loading-calculate></loading-calculate>
        </div>
    </div>
</div>
</template>
<script>
import loadingCalculate from "@/components/utils/loading/loading-calculate.vue";
import { verifyFileName, validateAzNumber, validateWGS84X, validateWGS84Y, valUTMX, validateCoordinateX, validateCoordinateY, validateHeight, validateFile } from "@/utils/validate"
import { mapState } from "vuex";
import { schemeStatus, postMastTimTxt, removeScheme, copyScheme, putSchemeName } from "@/api/server.request.js"
export default {
    name: 'fan-list-element',
    props:{
       list: {},
       active_scheme_id: {},
       listActive: {}
    },
    components:{
        loadingCalculate
    },
    data (){
        return{
            openPutName: true,
            waitingMinute: false,
            oldSchemeName: null
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            scheme_id: state => state.app.scheme_id,
        })
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.uploading')});
        },
        openPutName (val){
            // console.log(val)
            if(!val){
                this.oldSchemeName = this.list.scheme_name
            }
        }
    },
    mounted (){
        
    },
    beforeDestroy (){
        
    },
    methods:{
        onChange (value){
            this.list.checked = value
        },
        handleClick (type){
            switch (type){
                case 'copy':
                this.$confirm(this.$t('m.copySchemeData'), this.$t('m.hint'), {
                    confirmButtonText: this.$t('m.confirm'),
                    cancelButtonText: this.$t('m.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.onCopyScheme()
                }).catch(() => {
                            
                })
                
                break;
                case 'remove':
                this.$confirm(this.$t('m.removeSchemeData'), this.$t('m.hint'), {
                    confirmButtonText: this.$t('m.confirm'),
                    cancelButtonText: this.$t('m.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.onRemoveScheme()
                }).catch(() => {
                            
                })
                
                break;
                case 'put':
                this.onPutSchemeName()
                break;
                case 'status':
                this.onOpenSchemeStatus()
                break;
            }
        },
        // 复制
        onCopyScheme (){
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            let data = {
                project_id: this.projectInfo.project_id,
                scheme_id: this.list.scheme_id,
                scheme_name: this.list.scheme_name
            }
            copyScheme(data, config).then((res)=>{
                if(res.code != 201){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                this.$store.commit('refreshSchemeList')
            })
        },
        // 删除
        onRemoveScheme (){
            if(this.list.scheme_id == this.scheme_id){
                gwmap.wtLayer.remove()
                this.$store.dispatch('clearScheme_id')
            }
            removeScheme(this.projectInfo.project_id, this.list.scheme_id).then((res)=>{
                if(res.code != 204){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                this.$store.commit('refreshSchemeListRemove')
            })
        },
        // 修改
        onPutSchemeName (){
            if(!this.list.scheme_name){
                this.$message.error(this.$t('m.schemeNoneNull'))
                return
            }
            if(this.list.scheme_name.length > 100){
                this.$message.error(this.$t('m.nameLength100'))
                this.list.scheme_name = this.oldSchemeName
                return
            }
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            let data = {
                project_id: this.projectInfo.project_id,
                scheme_id: this.list.scheme_id,
                scheme_name: this.list.scheme_name
            }
            putSchemeName(data, config).then((res)=>{
                if(res.code != 201){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                this.openPutName = true
                this.onOpenSchemeStatus()
            })
        },
        // 查看各个方案步骤
        onOpenSchemeStatus (){
            this.$emit('openStatus', this.list)
            
        },
        onClick (value){
            this.$emit('clickList', value)
        }
    }
}
</script>
<style lang="scss" scoped>
*{
    transition: all 0.2s;
}
.fan-list-element{
    width: 100%;
    
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 10px 0px rgba(216,232,230,1);
    border-radius: 0.2rem;
    margin-bottom: 0.1rem;
    position: relative;
    .minList{
        height: 0.35rem;
        border-radius: 0.07rem;
        display: flex;
        align-items: center;
        .name{
            display: inline-block;
            color: #5F482E;
            width: 2.2rem;
            cursor: pointer;
            margin-left: 0.1rem;
        }
        /deep/ .el-checkbox{
            padding: 0 0.2rem 0 0.4rem;
        }
        /deep/ .el-checkbox__inner{
            border-radius: 50%;
        }
        /deep/ .el-checkbox__inner::after{
            height: 0.08rem;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            width: 0.08rem;
            border-radius: 50%;
            background: #fff;
            border: none;
        }
    }
    .minList:hover{
        box-shadow:0px 0px 10px 0px rgba(216,232,230,1);
    }

    
    .maxList{
        min-height: 1.65rem;
        /deep/ .el-checkbox{
            position: absolute;
            left: 1px;
            top: 1px;
        }
        /deep/ .el-checkbox__inner{
            width: 0.27rem;
            height: 0.29rem;
            border-radius: 0.2rem 0px 0.2rem 0px;
            border: none;
            background:rgba(235,242,228,1);
        }
        /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner{
            border: none;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
            background: #2CD0B9;
        }
        /deep/ .el-checkbox__inner::after{
            height: 0.18rem;
            left: 0.08rem;
            top: 0.02rem;
            width: 0.08rem;
            border: 2px solid #FFF;
            border-left: 0;
            border-top: 0;
        }
    }

    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.45rem;
        padding: 0 0.1rem 0 0.35rem;
        
        .name{
            display: inline-block;
            color: #5F482E;
            margin-right: 0.05rem;
            max-width: 1.7rem;
            cursor: pointer;
        }
        /deep/ .el-input{
            max-width: 1.7rem;
            .el-input__inner{
                height: 0.3rem;
                line-height: 0.3rem;
            }
        }
        /deep/ .el-input-group__append{
            background: #2cd0b9;
            color: #fff;
        }
    }
    .iconfont{
        color: #6D7D41;
        font-size: 0.18rem;
        cursor: pointer;
    }
    .iconfont:hover{
        color: #000;
    }
    .icon-shanchu1{
        font-size: 0.24rem;
        position: relative;
        top: 2px;
    }

    .content{
        cursor: pointer;
        display: flex;
        text-align: center;
        padding: 0.2rem 0 0 0;
        &>div{
            flex: 1;
            &>div:nth-of-type(1){
                font-weight: bold;
                font-size: 0.23rem;
            }
            &>div:nth-of-type(2){
                margin-top: 0.1rem;
                font-size: 0.15rem;
            }
            &>div:nth-of-type(3){
                font-size: 0.11rem;
            }
        }
        &>div:nth-of-type(3){
            flex: 1.2;
        }
    }
    .contentStatus{
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .imgLoading{
        
        &>div{
            width: 20px;
            height: 15px;
            position: relative;
            .top{
                width: 100%;
                height: 50%;
                position: absolute;
                top: -1px;
                border-radius: 50%;
            }
            .bottom{
                width: 14px;
                height: 100%;
                position: absolute;
                bottom: -2px;
                left: 3px;
            }
            .left{
                width: 6px;
                height: 105%;
                position: absolute;
                top: 0;
                left: 0;
                transform: rotate(-15deg);
                border-radius: 2px 0 0 0 ;
            }
            .right{
                width: 6px;
                height: 105%;
                position: absolute;
                top: 0;
                right: 0;
                transform: rotate(15deg);
                border-radius: 0 2px 0 0 ;
            }
        }
    }
    .imgLoading div:not(.bgBox){
        background: #1CCFBA;
    }
}
.fan-list-element.active{
    background:rgba(240,247,242,0.9);
    box-shadow: 0px 0px 10px 0px rgba(197,212,210,1);
}
.yichangLabel{
    margin-left: 0.1rem;
    .iconfont{
        color: red;
    }
}
</style>