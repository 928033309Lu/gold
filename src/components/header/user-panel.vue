<template>
    <div class="user-panel">
        <div class="title">
            <div class="logos"><div></div></div>  
            <div class="name"> {{title}} </div>
            <div class="iconDiv" @click="onClose"><i class="iconfont icon-close"></i></div>
            <div class="passlogo" v-if="title != '我的分享' && title != 'My share' ">
                <span v-if="title == '个人信息' || title == 'Personal information'"> 缺图 </span>
                <span v-if="title == '修改密码' || title == 'Change password'"> <i class="iconfont icon-mima2"></i> </span>
            </div>
        </div>
        <div class="content">
            <ul class="metu">
                <router-link tag="li" 
                v-for="(item,index) of userList" :key="index"
                :to="item.path">
                    <div>
                        <span><i :class="item.icon"></i></span>
                        <span>{{$t('m.'+ item.label)}}</span>
                    </div>
                    <div class="leftBorder"></div>
                </router-link>
            </ul>
            <div class="tabContent">
                <router-view />
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { userList } from "@/config/header-config"
export default {
    name: "user-panel",
    data (){
        return{
            routePath: '',
            title: '',
            userList
        }
    },
    watch:{
       "$store.state.app.routePath"(val){
        //    console.log(val)
           this.init();
       }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
        }),
    },
    mounted(){
        this.init();
        this.userList = userList;
        this.userList = this.userList.filter((item,index)=>{
            return item.type != "exit";
        })
    },
    methods:{
        init (){
            if (this.$route.path == "/index/user/password"){
                this.title = this.$t('m.changePassword');
            } else if (this.$route.path == "/index/user/info"){
                this.title = this.$t('m.userInfo');
            } else if (this.$route.path == "/index/user/share"){
                this.title = this.$t('m.myShare');
            }
        },
        onClose(){
            if (this.projectInfo){
                // this.$router.push('/index/project/'+ this.projectInfo.project_id)
                this.$router.push({
                    path: '/index/project',
                    query: {
                        id: this.projectInfo.project_id
                    }
                })
            } else{
                this.$router.push('/index')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
$width: 1.57rem;
$height: 1.12rem;
.user-panel{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background: #fff;
    .title{
        height: $height;
        color: #333;
        display: flex;
        position: relative;
        background: #EBF2E4;
        .passlogo{
            width: 1.93rem;
            height: 1.93rem;
            background:rgba(206,223,222,1);
            border-radius:50%;
            position: absolute;
            bottom: -1rem;
            left: 50%;
            margin-left: -0.965rem;
            display: flex;
            align-items: center;
            justify-content: center;
            .iconfont{
                font-size: 1rem;
                color: #656766;
            }
        }
        .logos{
            width: $width;
            height: $height;
            background:rgba(44,208,185,1);
            display: flex;
            align-items: center;
            justify-content: center;
            div{
                width: 1.35rem;
                height: 0.22rem;
                background: url("/images/logo.png");
                background-size: 100% 100%;
            }
        }
        .name{
            font-size: 0.27rem;
            font-weight: bold;
            line-height: $height;
            padding-left: 0.2rem;
        }
        .iconDiv{
            position: absolute;
            top: 0.15rem;
            right: 0.15rem;
        }
        .iconfont{
            cursor: pointer;
            transition: all 0.5s;
        }
        .iconfont:hover{
            color: rgba(44,208,185,1);
            transform: scale(1.2);
            transition: all 0.4s;
        }
    }
    .content{
        width: 100%;
        height: 100%;
        padding-top: $height;
        margin-top: -$height;
        .metu{
            background: #333333;
            width: $width;
            height: 100%;
            li{
                width: 1.56rem;
                height: 1.43rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.5s;
                position: relative;
                cursor: pointer;
                .leftBorder{
                    width: 0.09rem;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 9;
                    background: #2CD0B9;
                    opacity: 0;
                    transition: all 0.5s;
                }
            }
            span{
                display: block;
                text-align: center;
                margin-bottom: 0.1rem;
                color: #EBF2E4;
                .iconfont{
                    font-size: 0.33rem;
                }
            }
            .router-link-active{
                transition: all 0.5s;
                background:rgba(66,66,66,1);
                .leftBorder{
                    opacity: 1;
                    transition: all 0.5s;
                }
            }
        }
        .tabContent{
            width: 100%;
            height: 100%;
            padding-left: $width;
            background: #FFFFFF;
        }
    }
} 
</style>