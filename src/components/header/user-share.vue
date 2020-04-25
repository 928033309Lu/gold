<template>
    <div class="user-share">
        <div class="title">
            <div> <el-checkbox v-model="checkedAll"></el-checkbox> <span>(已加载 <b>22</b> 个)  分享失败超过1年以上的链接记录将被自动清理</span>  </div>
            <div class="delAll"> <i class="iconfont icon-wechaticon13"></i>批量删除 </div>
        </div>
       <div class="content">
           <div v-for="(item,index) of shareList" :key="index">
               <div class="left">
                    <el-checkbox v-model="item.checked"></el-checkbox>
                    <div class="imgBox"><img src="/images/demo.png" alt="" /></div>
                    <div class="itemCon">
                        <p class="itemCon-title"> <i class="iconfont icon-wenjianjia2"></i> 湖南湖南湖南湖南湖南湖南</p>
                        <div  class="itemCon-bottom">
                            <span><i class="iconfont icon-liulan"></i> xx 次 </span>
                            <span><i class="iconfont icon-baocun_mian"></i> xx 次 </span>
                            <span><i class="iconfont icon-shijian"></i> 2019 </span>
                        </div>
                    </div>
               </div>
                <div class="right">
                    <span>剩余期限 xx 天</span>
                    <span><i class="iconfont icon-wechaticon13"></i></span>
                </div>
           </div>
       </div>
    </div>
</template>
<script>
export default {
    name: "user-share",
    data (){
        return {
            checkedAll: false,
            shareList:[
                {
                    name: 'aaa',
                    checked: false
                },
                {
                    name: '222',
                    checked: false
                },
                {
                    name: '333',
                    checked: false
                }
            ]
        }
    },
    methods:{
       
    }
}
</script>
<style lang="scss" scoped>
.user-share{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8rem;
    z-index: 6;
    color: #333;
    margin: 1.12rem 0 0 1.57rem;
    padding: 0.2rem 1.97rem 0.4rem 0.4rem;
    /deep/ .el-checkbox{
        margin-right: 0.3rem;
    }
    /deep/ .el-checkbox__inner{
        width: 0.22rem;
        height: 0.22rem;
    }
    /deep/ .el-checkbox__inner::after{
        height: 0.13rem;
        left: 0.07rem;
        top: 0.01rem;
        width: 0.05rem;
    }
    .title{
        color: #6D7D41;
        height: 0.8rem;
        line-height: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #E2E5D8;
        b{
            color: #2CD0B9;
        }
        .delAll{
            width: 1.57rem;
            height: 0.45rem;
            line-height: 0.45rem;
            text-align: center;
            background:rgba(44,208,185,1);
            border-radius:2px;
            color: #FFFFFF;
            cursor: pointer;
        }
    }
    .content{
        color: #333;
        .iconfont{
            color: #C1C1C1;
        }
        img{
            width: 100%;
            max-height: 100%;
        }
        &>div{
            height: 1rem;
            line-height: 1rem;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #E2E5D8;
        }
        .left{
            display: flex;
            .imgBox{
                width: 1rem;
                display: flex;
                align-items: center;
                margin-right: 0.3rem;
            }
        }
        .right{
            color: #666;
            line-height: 1.5rem; 
            padding-right: 0.2rem;
            span{
                margin-left: 0.4rem;
            }
            .iconfont{
                color: #2CD0B9;
                font-size: 0.2rem;
            }
        }
        .itemCon{
            line-height: 0.5rem; 
            .itemCon-title{
                font-size: 0.21rem;
            }
            .itemCon-bottom span {
                margin-right: 0.9rem;
            }
        }
    }
}
</style>