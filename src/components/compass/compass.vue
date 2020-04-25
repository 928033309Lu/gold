<template>
<div class="gfCompass" :class="{comparisonActive: comparison}">
    <div :style="projectInfo ? 'position: relative; right: 0.62rem;' :''">
        <img class="bg" src="/images/compass.png" />
        <div :style="retateStyle" class="pointBox" >
            <img class="point" src="/images/zhen.png" />
        </div>
        <ol class="ol" @mouseenter="mouseEnter" @mouseleave="mouseleave">
            <li class="lio1" @click="onChange(0,$event)"><div class="dian"></div><div v-show="activeArr[0]" ></div></li>
            <li class="lio2" @click="onChange(15,$event)"><div class="dian"></div><div v-show="activeArr[15]" ></div></li>
            <li class="lio3" @click="onChange(14,$event)"><div class="dian"><span v-show="!activeArr[14]">NE</span></div><div v-show="activeArr[14]" ></div></li>
            <li class="lio4" @click="onChange(13,$event)"><div class="dian"></div><div v-show="activeArr[13]" ></div></li>
            <li class="lio5" @click="onChange(12,$event)"><div class="dian"></div><div v-show="activeArr[12]" ></div></li>
            <li class="lio6" @click="onChange(11,$event)"><div class="dian"></div><div v-show="activeArr[11]" ></div></li>
            <li class="lio7" @click="onChange(10,$event)"><div class="dian"><span v-show="!activeArr[10]">ES</span></div><div v-show="activeArr[10]" ></div></li>
            <li class="lio8" @click="onChange(9,$event)"><div class="dian"></div><div v-show="activeArr[9]" ></div></li>
            <li class="lio9" @click="onChange(8,$event)"><div class="dian"></div><div v-show="activeArr[8]" ></div></li>
            <li class="lio10" @click="onChange(7,$event)"><div class="dian"></div><div v-show="activeArr[7]" ></div></li>
            <li class="lio11" @click="onChange(6,$event)"><div class="dian"><span v-show="!activeArr[6]">WS</span></div><div v-show="activeArr[6]" ></div></li>
            <li class="lio12" @click="onChange(5,$event)"><div class="dian"></div><div v-show="activeArr[5]" ></div></li>
            <li class="lio13" @click="onChange(4,$event)"><div class="dian"></div><div v-show="activeArr[4]" ></div></li>
            <li class="lio14" @click="onChange(3,$event)"><div class="dian"></div><div v-show="activeArr[3]" ></div></li>
            <li class="lio15" @click="onChange(2,$event)"><div class="dian"><span v-show="!activeArr[2]">NW</span></div><div v-show="activeArr[2]" ></div></li>
            <li class="lio16" @click="onChange(1,$event)"><div class="dian"></div><div v-show="activeArr[1]" ></div></li>
    
        </ol>
        
        <ul class="ul">
            <li class="li1">N</li>
            <li class="li2" v-show="activeArr[14]">NE</li>
            <li class="li3">E</li>
            <li class="li4" v-show="activeArr[10]">ES</li>
            <li class="li5">S</li>
            <li class="li6" v-show="activeArr[6]">WS</li>
            <li class="li7">W</li>
            <li class="li8" v-show="activeArr[2]">NW</li>
        </ul>
    </div>
</div>
</template>

<script>
import { mapState } from "vuex";
    export default {
        name: 'gfCompass',
        // props:[],
        data (){
            return{
                activeArr:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                cunArr:[],
                isShow: false,
                angle: 0 ,  //正北 0
                yuanXY:{
                    x:809,
                    y:24
                }
            }
        },
        computed: {
            ...mapState({
                projectInfo: state => state.app.projectInfo,
                comparison: state => state.app.comparison,
            }),
            retateStyle () {
                return {
                    transform: 'rotate(' + (360 - this.$store.state.app.northInfoAngle) + 'deg)'
                };
            }
        },
        methods: {
            init(){
                this.activeArr = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
            },
            mouseEnter(){
                this.cunArr = this.activeArr;
                this.init();
            },
            mouseleave(){
                this.activeArr = this.cunArr;
            },
            onChange(num, ev){
                let deg = num*22.5;
                this.$emit('changeAngle', deg);
                for(var i=0; i<this.activeArr.length; i++ ){
                    this.activeArr[i] = false;
                }
                this.activeArr[num] = true;
                this.cunArr = this.activeArr;
            },
            getAngle(point1, point2, point3) {
				var bb = (point2.y - point1.y) * (point2.y - point1.y) + (point2.x - point1.x) * (point2.x - point1.x);
				var aa = (point3.y - point1.y) * (point3.y - point1.y) + (point3.x - point1.x) * (point3.x - point1.x);
				var cc = (point3.y - point2.y) * (point3.y - point2.y) + (point3.x - point2.x) * (point3.x - point2.x);
				var cosa = (bb + cc - aa) / (2 * Math.sqrt(bb) * Math.sqrt(cc));
				return Math.acos(cosa);
            },
            duration(point1, point2, point3) {
				var sp = (point1.x - point3.x) * (point2.y - point3.y) - (point1.y - point3.y) * (point2.x - point3.x);
				// console.log(sp);
				if (sp > 0) {
					return 1
				} else if (sp < 0) {
					return -1
				} else {
					return 0;
				}
			}
        }
    };
</script>

<style lang="scss" scoped>
.gfCompass {
    position: fixed;
    top: 1rem;
    right: 0.35rem;
    width: 0.8rem;
    height: 0.8rem;
    z-index: 11;
    transition: all 0.5s;
    *{
        transition: all 0.5s;
    }
    .yuan{
        width: 0.08rem;
        height: 0.08rem;
        background: #FFD93F;
        border-radius:50%;
        position: absolute;
        z-index: 112;
        top: -0.12rem;
        left: 48%;
        margin-left: -0.04rem;
        cursor: pointer;
    }
    .bg {
        width: 0.8rem;
        height: 0.8rem;
        user-select: none;
        display: block;
    }
    .pointBox{
        position: absolute;
        /* z-index: 1111; */
        top: 0.09rem;
        left: 0.32rem;
        width: 0.16rem;
        height: 0.56rem;
        transform-origin: center center;
    }
    .point {
        display: block;
        width: 0.16rem;
        height: 0.4rem;
        cursor: pointer;
        position: relative;
        left: 0.02rem;
    }
}
.ol{
    position: absolute;
    top: -0.23rem;
    left: -0.2rem;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0;
    padding: 0;
    z-index: 112;
    &>li{
        position: absolute;
        width: 0.1rem;
        height: 0.1rem;
        cursor: pointer;
        font-size: 0.13rem;
        &>div{
            width: 0.08rem;
            height: 0.08rem;
            background: #FFD93F;
            border-radius:50%;
            cursor: pointer; 
            
        }
        &>div:nth-of-type(1){
            opacity: 0.9;
            display: none;
        }
        &>div:nth-of-type(1){
            position: absolute;
        }
    }
    &>li:hover .dian{
        display: block;
    }
    .dian>span{
        position: absolute;
        color: #fff;
    }
    .lio1{
        top: 17%;
        left: 47.5%;
        margin-top: -0.5px;
    }
    .lio2{
        top: 20%;
        left: 58%;
    }
    .lio3{
        top: 25.5%;
        left: 67.5%;
        span{
            left: 0.11rem;
            top:-0.15rem;
        }
    }
    .lio4{
        top: 36%;
        left: 73%;
    }
    .lio5{
        top: 46%;
        left: 76%;
    }
    .lio6{
        top: 57%;
        left: 74%;
    }
    .lio7{
        top: 67.5%;
        left: 67.5%;
        span{
            left:0.08rem;
            top:0.07rem;
        }
    }
    .lio8{
        top: 73%;
        left: 58%;
    }
    .lio9{
        top: 76%;
        left: 47%;
        margin-left: 0.5px;
    }
    .lio10{
        top: 73%;
        left: 37%;
    }
    .lio11{
        top: 67.5%;
        left: 27%;
        span{
            left:-0.2rem;
            top: 0.04rem;
        }
    }
    .lio12{
        top: 58%;
        left: 21%;
    }
    .lio13{
        top: 47%;
        left: 18%;
    }
    .lio14{
        top: 35%;
        left:20%;
    }
    .lio15{
        top: 25%;
        left: 27%;
        span{
            left:-0.26rem;
            top:-0.15rem;
        }
    }
    .lio16{
        top: 19%;
        left: 36%;
    }
    
}
.ul{
    position: absolute;
    top: -0.23rem;
    left: -0.22rem;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0;
    padding: 0;
    /* border: 1px solid red; */
    color: #fff;
    &>li{
        position: absolute;
        width: 0.2rem;
        height: 0.2rem;
        line-height:0.2rem;
        text-align: center;
        font-size: 0.13rem;
    }
    .li1{
        top: 0;
        left: 52%;
        margin-left: -0.1rem;
    }
    .li3{
        top: 50%;
        right: 0;
        margin-top: -0.1rem;
    }
    .li5{
        left: 52.5%;
        bottom: 0;
        margin-left: -0.1rem;
    }
    .li7{
        left: 0;
        top: 50%;
        margin-top: -0.1rem;
    }
    .li2{
        left: 80%;
        top: 20%;
        margin-top: -0.1rem;
    }
    .li4{
        left: 75%;
        bottom: 10%;
        margin-top: -0.1rem;
    }
    .li6{
        top: 80%;
        left: 10%;
        margin-top: -0.1rem;
    }
    .li8{
        top: 20%;
        left: 5%;
        margin-top: -0.1rem;
    }
}
.comparisonActive{
    top: 0.5rem !important;
    &>div{
        position: relative;
        right: 0 !important;
    }
}
</style>