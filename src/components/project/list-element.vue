<template>
    <div class="list-element" @click="aaa">
        <!-- <div class="leftBorber"></div> -->
        <div class="title">
            <div class="ellipsis"> <span class="nameHover"></span> {{list.project_name}}</div>
            <div>
                <span title="演示模式" @click.stop="projectPPt"><i class="iconfont icon-yanshi"></i></span>
                <i class="iconfont icon-fenxiang2"></i>
                <span @click.stop="$emit('compileProject',list)"><i class="iconfont icon-bianji"></i></span>
                <span @click.stop="$emit('removeProject',list)"><i class="iconfont icon-wechaticon13"></i></span>
            </div>
        </div>
        <div class="content">
            <div>{{list.owner_name}}</div>
            <div>{{list.design_capacity}}mw</div>
            <div>{{list.create_time}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'list-element',
    props:{
        list:{
            default:{
                project_name:'',
                owner_name:'',
                design_capacity:'',
                create_time:'',
            }
        }
    },
    data (){
        return{

        }
    },
    methods:{
        aaa (){
            this.$emit('clickProject', this.list)
        },
        projectPPt () {
            this.$emit('clickProject', this.list, 1)
        }
    }
}
</script>
<style lang="scss" scoped>
.list-element{
    width: 3.89rem;
    height: 1.18rem;
    background: rgba(255,255,255,1);
    box-shadow: 0px 0px 10px 0px rgba(216,232,230,0.7);
    border-radius: 0.18rem;
    // border-radius: 2px;
    position: relative;
    left: 0.1rem;
    padding: 0.18rem 0.12rem 0 0;
    margin-bottom: 0.07rem;
    transition: all 0.5s;
    cursor: pointer;
    span{
        display: inline-block;
    }
    .title{
        display: flex;
        justify-content: space-between;
        color: #6D7D41;
        font-size: 0.22rem;
        div:first-child{
            max-width: 2.4rem;
            font-weight: bold;
            padding-left: 0.12rem;
        }
    }
    .iconfont{
        margin-left: 0.08rem;
        font-size: 0.2rem;
        font-weight: 0;
    }
    .leftBorber{
        width: 0.09rem;
        height: 100%;
        position: absolute;
        top: 0;
        left: -0.08rem;
        background: #2CD0B9;
        border-radius: 0.03rem 0px 0px 0.03rem;
        opacity: 0;
        transition: all 0.5s;
    }
    .nameHover{
        // width: 0.1rem;
        width: 0;
        height: 0.16rem;
        background:rgba(44,208,185,1);
        border-radius: 2px;
        transition: all 0.4s;
    }
    .content{
        margin-top: 0.2rem;
        display: flex;
        justify-content: space-between;
        font-size: 0.13rem;
        height: 0.5rem;
        line-height: 0.5rem;
        &>div{
            text-align: center;
            flex: 1;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        &>div:last-child{
            flex: 2.8;
        }
        &>div:first-child{
            flex: 2.5;
            text-align: left;
            padding-left: 0.12rem;
        }
    }
}
.list-element:hover {
    z-index: 3;
    // box-shadow: 0 0 30px rgba(0,0,0,0.3);
    box-shadow:0px 0px 33px 0px rgba(207,223,221,1);
    transition: all 0.5s;
}
// .list-element:hover .leftBorber{
//     transition: all 0.5s;
//     opacity: 1;
// }
.list-element:hover .nameHover{
    transition: all 0.4s;
    width: 0.1rem
}
</style>