<template>
    <div class="saerch-panel" >
        <div class="project-search" id="project-search" ref="projectSearch" :class="animation?'searchAnimation':'searchNone'">
            <el-input v-model="value" 
            @blur="onBlur"
            @input="onInput"
            @keyup.native="onkeyup"
            :placeholder="$t('m.inputSearch')"></el-input>
            <div class="btn"><i class="iconfont icon-search"></i></div>

            <div class="projectList" 
            @keyup="onkeyup"
            v-show="showList">
                <div class="content">
                    <div v-for="(item,index) of searchList" :key="index"
                    @click="onClickList(item)"
                    :class="listIndex == index ? 'active' : ''"
                    >{{item.project_name}}</div>
                </div>
            </div>
        </div>
        <div class="closeSarchLeft" @click="onClickAll" v-if="animation"></div>
        <div class="closeSarchCenter" @click="onClickAll" v-if="animation"></div>
        <div class="closeSarchRight" @click="onClickAll" v-if="animation"></div>
    </div>
</template>
<script>
import { searchProject } from "@/api/server.request.js"
import { mapState } from "vuex";
export default {
    name:"search",
    props:['search'],
    data (){
        return{
            value: '',
            showList: false,
            listIndex: -1,
            animation: false,
            searchList:[]
        }
    },
    computed:{
        ...mapState({
            uploadScheme_id: state => state.app.scheme_id,
        })
    },
    watch:{
        value (val){
            if(val){
                this.showList = true;
            }
        },
        search (val){
            this.animation = val;
            if(!val){
                this.value = ''
                this.listIndex = -1
                this.searchList = []
            }
        }
    },
    mounted(){
        this.$refs.projectSearch.classList.remove('searchAnimation')
        this.$refs.projectSearch.classList.remove('searchNone')
    },
    methods:{
        onBlur (){
            setTimeout(()=>{
                this.showList = false;
            },300)
        },
        onkeyup (){
            if (event.keyCode == 38){
                this.listIndex <= 0 ? this.listIndex = 0 : this.listIndex --;
                this.value = this.searchList[this.listIndex].project_name;
            } else if (event.keyCode == 40){
                this.listIndex >= this.searchList.length-1 ? this.listIndex = this.searchList.length-1 : this.listIndex ++;
                this.value = this.searchList[this.listIndex].project_name;
            } else if (event.keyCode == 13){
                this.showList = false;
                this.onSelectedProject()
                this.$emit("closeSearch")
            }
        },
        onClickList (item){
            this.value = item.name;
            this.showList = false;
            this.onSelectedProject(item)
            this.$emit("closeSearch")
        },
        onSelectedProject (item){
            if (item){
                this.flyToProject(item)
            }else{
                let searchArr = this.searchList.filter((item, index)=>{
                    return item.project_name == this.value
                })
                if (searchArr.length>0){
                    this.flyToProject(searchArr[0])
                }
            }
        },
        // 进入项目
        flyToProject (item){
            // console.log(item)
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
        },
        onInput(){
            searchProject({
                keyword: this.value
            }).then((res)=>{
                // console.log(res)
                this.searchList = res.data;
            })
        },
        onClickAll (){
            let search = document.getElementById('project-search');
            // 点击其他地方关闭
            if (search && !search.contains(event.target)) {
                this.$emit("closeSearch")
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/fixed/variable-set.scss";
$height: 0.45rem;
$background-hover: rgba(226,245,242,1);
.saerch-panel{
    z-index: 99;
    position: absolute;
    top: -0.06rem;
    right: 0;
    cursor: initial;
}
.closeSarchLeft{
    width: 13rem;
    height: 13rem;
    position: absolute;
    right: 3.5rem;
    top: -0.2rem;
}
.closeSarchRight{
    width: 2.9rem;
    height: 13rem;
    position: absolute;
    right: -3rem;
    top: -0.2rem;
}
.closeSarchCenter{
    width: 3rem;
    height: 10rem;
    position: absolute;
    left: 0;
    top: 2.5rem;
}
.project-search{
    // width: 3.3rem;
    width: 0;overflow: hidden;
    height: $height;
    position: relative;
    
    /deep/ .el-input .el-input__inner{
        height: $height;
        padding: 0 0 0 0.1rem;
        background: $box-background;
        border: none;
    }
    .btn{
        width: 0.44rem;
        height: $height;
        line-height: $height;
        text-align: center;
        border-radius: 0 0.04rem 0.04rem 0;
        background: $bg-color;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
    }
    .iconfont{
        font-size: 0.21rem;
    }
}
.projectList{
    overflow: initial;
    width: 2.86rem;
    max-height: 2rem;
    background: $box-background;
    color: $text-black-color;
    overflow-y: auto;
    .content{
        &>div{
            height: $height;
            line-height: $height;
            padding: 0 0 0 0.1rem;
            cursor: pointer;
        }
        &>div:hover{
            background: $background-hover;
        }
        .active{
            background: $background-hover;
        }
    }
}

.searchAnimation{
    animation: myfirst 0.4s;
    animation-fill-mode: forwards;
    animation-timing-function: 0.4s;
}
.searchNone{
    animation: myfirst2 0.4s;
    animation-fill-mode: forwards;
    animation-timing-function: 0.4s;
}
@keyframes myfirst
{
    0% {width: 0;}
    100% { width: 3.3rem;overflow: initial;}
}
@keyframes myfirst2
{
    0% {width: 3.3rem;overflow: initial;}
    100% { width: 0;}
}

</style>