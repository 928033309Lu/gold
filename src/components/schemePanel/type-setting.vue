<template>
    <el-dialog title="查看机型配置" 
        custom-class="type-setting" 
        :visible.sync="dialogVisible" 
        :close-on-click-modal="false"
        :before-close="beforeClose">

        <div class="content">
           <table class="mytable" border="1" cellspacing="0" cellpadding="0" width="100%">
                <tr v-for="(item, index) of gridData" :key="index">
                    <td v-for="(item2,index2) in item" :key="index2">
                       {{item2}}
                    </td>
                </tr>
            </table>
        
        </div>
    </el-dialog>
</template>
<script>
import { mapState } from "vuex"
import { getProjectDetailsType } from "@/api/server.request.js"
export default {
    name: 'type-setting',
    components:{
        
    },
    props:{
       
    },
    data (){
        return{
            dialogVisible: false,
            gridData: [[]],
        }
    },
    computed:{
        ...mapState({
            typeSettingVisible: state => state.app.typeSettingVisible,
            projectInfo: state => state.app.projectInfo,
        })
    },
    watch:{
        typeSettingVisible (val){
            this.dialogVisible = val
            if(val){
                this.initTypeData()
            }
        }
    },
    mounted (){
        this.initData()
    },
    methods:{
        initTypeData (){
            this.initData()
            getProjectDetailsType(this.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                res.data.forEach((item, index)=>{
                    this.gridData[0].push('机型'+ (index+1))
                    this.gridData[1].push(item.type)
                    this.gridData[2].push(item.power)
                    this.gridData[3].push(item.bladeDiameter)
                    this.gridData[4].push(item.cutInWindSpeed)
                    this.gridData[5].push(item.standSpeed)
                    this.gridData[6].push(item.cutOutWindSpeed)
                    this.gridData[7].push(item.turbulence)
                    this.gridData[8].push(item.maxWindSpeed)
                    this.gridData[9].push(item.designGrade)
                    this.gridData[10].push(item.hubHeight)
                })
                
                console.log(this.gridData)
            })
            

        },
        initData (){
            this.gridData = [
                ["描述", ""],
                ["机组型号", ""],
                ["额定功率", ""],
                ["叶轮直径(m)", ""],
                ["切入风速(m/s)", ""],
                ["额定风速(m/s)", ""],
                ["切出风速(m/s)", ""],
                ["湍流强度", ""],
                ["最大风速(m)", ""],
                ["设计等级", ""],
                ["塔架类型及高度", ""]
            ]
        },
        beforeClose (done){
            this.$store.commit("typeSettingVisible", false)
            done()
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/ .type-setting{
    
}
.content{
    border:1px solid rgba(207,213,201,1);
    border-radius: 0.18rem;
    margin: 0 0.1rem 0.2rem 0;
    overflow: auto;
    .mytable{
        padding: 0.1rem;
        text-align: center;
        border: none;
        td{
            border-left: none;
            border-right: none;
            border-top: none;
            min-width: 1.8rem;
            height: 0.33rem;
            line-height: 0.33rem;
            background: #fff;
        }
        tr{
            position: relative;
            width: 100%;
            td:nth-of-type(1){
                position: fixed;
                z-index: 1;
                border: none;
            }
        }
        tr:nth-of-type(1){
            background:rgba(240,247,242,1);
            border-radius: 0.04rem;
            td{
                border: none;
                background:rgba(240,247,242,1);
            }
        }
    }
}

</style>