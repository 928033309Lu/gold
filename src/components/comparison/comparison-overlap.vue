<template>
    <div class="comparison-overlap" v-if="mouseMoveList && mouseMoveList.infos && mouseMoveList.infos.length > 0" 
    :style="{left: mouseMoveList.pos.x + 'px', top: mouseMoveList.pos.y + 'px'}">
        <div v-for="(item, index) of mouseMoveList.infos" :key="index" 
        @mouseenter="onMouseenter(item)"
        :style="{color: item.color}">
            {{item.name}}
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getTurbine_scheme } from "@/api/server.request.js"
export default {
    name: 'comparison-overlap',
    components:{

    },
    data (){
        return{
            
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            mouseMoveList: state => state.app.mouseMoveList,
        })
    },
    watch:{
       
    },
    mounted (){

    },
    beforeDestroy (){

    },
    methods:{
        onMouseleave (){
            this.$store.commit('comparisonDetalisData', null)
        },
        onMouseenter (item){
            this.$store.commit('comparisonDetalisData', item)
        }
    }
}
</script>

<style lang="scss" scoped>
.comparison-overlap{
    position: fixed;
    z-index: 9999;
    background: rgba(255,255,255,0.1);
    &>div{
        width: 80px;
        height: 33px;
        line-height: 33px;
        text-align: center;
        cursor: pointer;
    }
    &>div:hover{
        font-weight: bold;
    }
}
</style>