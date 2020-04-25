<template>
    <div class="loading-calculate" >
        <div class="loadEffect16">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <p>{{this.$t('m.calculation')}}</p>
    </div>
</template>
<script>
// import { mapState } from "vuex";
export default {
    name:"loading-calculate",
    computed:{

    }
}
</script>
<style lang="scss">
.loading-calculate{
    text-align: center;
    position: relative;
    top: -0.1rem;
}


.loadEffect16{
    width: 1rem;
    height: 1rem;
    position: relative;
    
    transform: scale(0.8);
}
.loadEffect16 span{
    display: inline-block;
    width: 0.25rem;
    height: 0.1rem;
    border-top-left-radius: 0.05rem;
    border-bottom-left-radius: 0.05rem;
    background: #1CCFBA;
    position: absolute;
    -webkit-animation: load16 1.04s ease infinite;
}
@-webkit-keyframes load16{
    0%{
        opacity: 1;
    }
    100%{
        opacity: 0.2;
    }
}
.loadEffect16 span:nth-child(1){
    left: 0;
    top: 50%;
    margin-top: -0.05rem;
    -webkit-animation-delay:0.13s;
}
.loadEffect16 span:nth-child(2){
    left: 0.1rem;
    top: 0.2rem;
    -webkit-transform: rotate(45deg);
    -webkit-animation-delay:0.26s;
}
.loadEffect16 span:nth-child(3){
    left: 50%;
    top: 0.1rem;
    margin-left: -0.15rem;
    -webkit-transform: rotate(90deg);
    -webkit-animation-delay:0.39s;
}
.loadEffect16 span:nth-child(4){
    top: 0.2rem;
    right: 0.15rem;
    -webkit-transform: rotate(135deg);
    -webkit-animation-delay:0.52s;
}
.loadEffect16 span:nth-child(5){
    right: 0.05rem;
    top: 50%;
    margin-top: -0.05rem;
    -webkit-transform: rotate(180deg);
    -webkit-animation-delay:0.65s;
}
.loadEffect16 span:nth-child(6){
    right: 0.15rem;
    bottom: 0.2rem;
    -webkit-transform: rotate(225deg);
    -webkit-animation-delay:0.78s;
}
.loadEffect16 span:nth-child(7){
    bottom: 0.1rem;
    left: 50%;
    margin-left: -0.15rem;
    -webkit-transform: rotate(270deg);
    -webkit-animation-delay:0.91s;
}
.loadEffect16 span:nth-child(8){
    bottom: 0.2rem;
    left: 0.1rem;
    -webkit-transform: rotate(315deg);
    -webkit-animation-delay:1.04s;
}

</style>