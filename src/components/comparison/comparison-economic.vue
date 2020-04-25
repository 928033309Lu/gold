<template>
    <div class="comparison-economic">
         <!-- 列表 -->
        <table class="mytable" border="1" cellspacing="0" cellpadding="0" width="100%">
            <tr v-for="(item, index) of gridData" :key="'a'+index">
                <td v-for="(item2,index2) in item" :key="'b'+index2" >
                    <div v-if="index == 0 && index2 != 0 && index2 != 1">
                        <input @change="changeCheckBox($event,item2)" type="checkbox" :checked="item2.checked" ></input>
                        <span>{{item2.scheme_name}}</span>
                    </div>

                    <span v-show="index != 0" @click="onClick(index, index2)">
                        {{item2}}
                    </span>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getTurbine_scheme } from "@/api/server.request.js"
export default {
    name: 'comparison-economic',
    components:{

    },
    props:{
        economicDetail:{}
    },
    data (){
        return{
            gridData:[[]]
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            schemeList: state => state.app.schemeList,
        })
    },
    watch:{
       
    },
    mounted (){
        this.initDdetailsList()
    },
    beforeDestroy (){

    },
    methods:{
        changeCheckBox (ev, item){
            if (!ev.target.checked){
                gwmap.comparisonLayer.removeScheme(item.scheme_id)
                this.$emit('removeUrlColor', item)
            }
            item.checked = ev.target.checked
            // console.log(ev.target.checked, item)

            this.schemeList.forEach((v,n)=>{
                if (item.scheme_id == v.scheme_id){
                    v.checked = item.checked
                }
            })
            this.$store.commit('setSchemeList', this.schemeList)

            let arr = this.schemeList.filter((m)=>m.checked)
            console.log(arr.length)
            if (arr.length > 2){
                this.$message.error('最多允许两个方案定位进行比选')
                ev.target.checked = false
                item.checked = false
                return
            }
            
            if (item.checked){
                this.$emit('changeCheckedBox', item)
            }
        },
        initData (){
            this.gridData = [
                [{scheme_name: '方案',scheme_id:'',checked:false}, {scheme_name: '',scheme_id:'',checked:false}],
                ["项目容量(MW)", ""],
                ["等效小时数(h)", ""],
                ["单位千瓦投资(元/kW)", ""],
                ["——风机(元/kW)", ""],
                ["——塔筒(元/kW)", ""],
                ["——基础(元/kW)", ""],
                ["LCOE(元/kWh)", ""],
                ["PT(年)", ""],
                ["全投资净现值(万元)", ""],
                ["资本金净现值(万元)", ""],
                ["PIRR(%)", ""],
                ["EIRR(%)", ""],
            ]
        },
        initDdetailsList (){
            this.initData()
            this.economicDetail.forEach((item, index)=>{
                this.gridData[0].push({
                    scheme_name: item.scheme_name,
                    scheme_id: item.scheme_id,
                    checked: item.checked,
                })
                this.gridData[1].push(item.capacity)
                this.gridData[2].push(item.equivalent_hours)
                this.gridData[3].push(item.static_total_investment)
                this.gridData[4].push(item.fan_price)
                this.gridData[5].push(item.tower_price)
                this.gridData[6].push(item.basic_price)
                this.gridData[7].push(item.lcoe)
                this.gridData[8].push(item.pt)
                this.gridData[9].push(item.total_investment_value)
                this.gridData[10].push(item.capital_found_value)
                this.gridData[11].push(item.p_i_r_r)
                this.gridData[12].push(item.e_i_r_r)
                
            })
            console.log(this.gridData)
        }
    }
}
</script>

<style lang="scss" scoped>
.comparison-economic{
    
}
</style>