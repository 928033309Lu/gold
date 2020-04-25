<template>
    <div class="project-add" @click="onClickAll">
        <div class="content" id="addProject" :class="visible? 'addAnimation' : 'noneAnimation'">
            <p class="title">
                <span>{{!isCompile ? $t('m.addProject') : $t('m.editProject')}}</span>
                <span>关联风匠项目数据</span>
            </p>
            <el-form ref="formAdd" class="formAdd" :rules="rules" :model="formAdd" label-width="1rem" label-position="left" :hide-required-asterisk="true">
                <el-form-item prop="name" :label="$t('m.projectName2')">
                    <el-input v-model="formAdd.name" :placeholder="$t('m.projectName')"></el-input>
                </el-form-item>
                <el-form-item prop="owner" :label="$t('m.ownerInput2')">
                    <el-select v-model="formAdd.owner" filterable remote :placeholder="$t('m.ownerInput')"
                    @change="changeOwner"
                    :remote-method="remoteMethod">
                        <el-option
                        v-for="(item,index) of ownerOption"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="inputMw" :label="$t('m.capacity2')">
                    <el-input class="inputMw" type="number" v-model="formAdd.inputMw" :placeholder="$t('m.capacity')"></el-input>
                    <span class="unit">MW</span>
                </el-form-item>
                <el-form-item prop="terrain" :label="$t('m.projectTerrain2')">
                    <el-select v-model="formAdd.terrain" :placeholder="$t('m.projectTerrain')" @change="changeTerrain">
                        <el-option
                        v-for="item in terrainOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="region" :label="$t('m.administrative')">
                    <el-cascader v-model="formAdd.region" :placeholder="$t('m.selectedPosition')"
                    @expand-change="handleChange"
                    @change="changeCascader"
                    :options="regionOption">
                    </el-cascader>
                </el-form-item>
                <el-form-item :label="$t('m.notes')">
                    <el-input type="textarea" :rows="4" v-model="formAdd.desc" :placeholder="$t('m.description')"></el-input>
                </el-form-item>
            </el-form>

            <div class="bottomBtn">
                <el-button @click="closeAdd" class="submit submit1" >取消</el-button>
                <el-button @click="onSubmit" class="submit submit2" >{{$t('m.save')}}</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGet } from "@/api/request.js"
import { getTerrain, getPosition, postProject, putProject } from "@/api/server.request.js"
import amapKey from "@/config/amap-key.js"
export default {
    name: 'project-add',
    props: {
        ownerOptions: {
            type: Array,
            default: []
        },
        oldOwnerOptions: {
            type: Array,
            default: []
        },
        isCompileProject: {},
        compileData: {},
        addVisible: {}
    },
    data (){
        const Reg = /^(([1-9][0-9]*)|(([0]\.\d{1}|[1-9][0-9]*\.\d{1})))$/;
        const validate = (rule, value, callback) => {
            if (Reg.test(value)) {
                callback();
            } else callback(new Error('项目容量为正数，允许输入到小数点后一位'));
        };
        return{
            oldOwnerOption:[],
            ownerOption:[],
            visible: true,
            isCompile: false,
            
            formAdd:{
                name: '',
                owner: '',
                inputMw: '',
                terrain: '',
                region: [],
                desc: ''
            },
            regionOption:[],
            terrainOptions:[],
            reqObj:{
                owner_id: '',
                terrain_id: '',
                region_arr:[],
                region_name1: '',
                region_name2: '',
                region_name3: ''
            },
            rules: {
                name:[
                    {required: true, message: this.$t('m.iptProjectName'), trigger: 'blur'},
                    {min: 1, max: 20, message: this.$t('m.iptProjectNameLength'), trigger: 'blur'}
                ],
                owner:[
                    {required: true, message: this.$t('m.ownerInput'), trigger: 'change'}
                ],
                inputMw:[
                    {required: true, message: this.$t('m.iptProjectCapacity'), trigger: 'blur'},
                    {validator: validate, trigger: 'blur'}
                ],
                terrain:[
                    {required: true, message: this.$t('m.projectTerrain'), trigger: 'change'}
                ],
                region:[
                    {required: true, message: this.$t('m.iptDivision'), trigger: 'change'}
                ]
            },
            waitingMinute: false,
            waiting: false
        }
    },
    mounted (){
        this.getTerrains();
        this.getRegionOption();
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: '正在提交数据，请稍候...'});
        },
        waiting () {
            this.$store.dispatch('handleLoading', {loading: this.waiting, text: this.$t('m.getLoading')});
        },
        addVisible(val){
            this.visible = val;
            if (!val){
                this.$refs.formAdd && this.$refs.formAdd.clearValidate()
            }
        },
        isCompileProject(val){
            console.log(val)
            this.isCompile = val;
            if(val){
                this.getCompileData();
            }
        },
        oldOwnerOptions(val){
            this.oldOwnerOption = [...val];
        },
        ownerOptions(val){
            this.ownerOption = [...val];
        }
    },
    methods:{
        remoteMethod(query) {
            if (query != '') {
                this.ownerOption = this.oldOwnerOption.filter(item => {
                    return item.label.indexOf(query) != -1;
                })
            } else {
                this.ownerOption = this.oldOwnerOption;
            }
        },
        closeAdd(isTrue){
            this.visible = false;
            this.isCompile = false;
            setTimeout(()=>{
                this.formAdd = {
                    name: '',
                    owner: '',
                    inputMw: '',
                    terrain: '',
                    region: [],
                    desc: ''
                }
                this.$emit("closeAddProject", isTrue);
            },200)
        },
        getCompileData(){
            if(this.compileData && this.compileData.project_name){
                console.log('编辑项目open');
                this.formAdd.name = this.compileData.project_name;
                this.formAdd.owner = this.compileData.owner_id;
                this.formAdd.inputMw = this.compileData.design_capacity;
                this.formAdd.terrain = this.compileData.terrain_id;
                this.formAdd.desc = this.compileData.description;
                this.reqObj.terrain_id = this.compileData.terrain_id;
                this.reqObj.owner_id = this.compileData.owner_id;
                this.formAdd.region[0] = this.compileData.province;
                this.formAdd.region[1] = this.compileData.city;
                this.formAdd.region[2] = this.compileData.county;
                this.reqObj.region_arr = this.formAdd.region;
                setTimeout(()=>{
                    this.handleChange(this.formAdd.region, true);
                },500)
            }

        },
        getTerrains(){
            getTerrain().then((res)=>{
                if(res.code == 403) return;
                if(res.code != 200){
                    this.$message.error(res.message);
                    return;
                };
                this.terrainOptions = res.data.map((item, index, arr) => {
                    return { value: item.terrain_id, id: item.terrain_id, label: item.terrain_name };
                });
            })
        },
        getRegionOption(){
            getPosition().then((res)=>{
                // console.log(res)
                if(res.code == 403) return;
                if(res.code != 200){
                    this.$message.error(res.message);
                    return;
                };
                this.regionOption = res.data.map((item,index)=>{
                    return { value: item.province_id, id: item.province_id, label: item.province_name, children: [] };
                })
            })
        },
        
        handleChange(arr, isCompile){
            this.waiting = true
            if(!isCompile){
                if(arr.length == 1){
                    let province_id = Number(arr[0]);
                    getPosition({
                        province_id: province_id
                    }).then((res)=>{
                        this.waiting = false
                        // console.log(res)
                        if(res.code != 200){
                            this.$message.error(res.message);
                            return;
                        };
                        this.regionOption.map((item,index)=>{
                            if(item.id == province_id){
                                item.children = res.data.map((item, index, arr) => {
                                    return { value: item.city_id, id: item.city_id, label: item.city_name, children: [] };
                                });
                            }
                        })
                    }).catch((err)=>{
                        this.waiting = false
                    })
                } else if (arr.length == 2){
                    let province_id = Number(arr[0]);
                    let city_id = Number(arr[1]);
                    getPosition({
                        city_id: city_id,
                        province_id: province_id
                    }).then((res)=>{
                        this.waiting = false
                        // console.log(res)
                        if(res.code != 200){
                            this.$message.error(res.message);
                            return;
                        };
                        this.regionOption.map((item,index)=>{
                            if(item.id == province_id){
                                item.children.map((item2,index2)=>{
                                    if(item2.id == city_id){
                                        item2.children = res.data.map((item3, index3) => {
                                            return { value: item3.county_id, id: item3.county_id, label: item3.county_name};
                                        });
                                    }
                                })
                            }
                        })
                    }).catch((err)=>{
                        this.waiting = false
                    })
                }
            } else{
                // console.log(arr)
                var province_id = Number(arr[0]);
                var city_id = Number(arr[1]);
                    getPosition({
                        province_id: province_id
                    }).then((res)=>{
                        this.waiting = false
                        // console.log(res)
                        if(res.code != 200){
                            this.$message.error(res.message);
                            return;
                        };
                        this.regionOption.map((item,index)=>{
                            if(item.id == province_id){
                                item.children = res.data.map((item, index, arr) => {
                                    return { value: item.city_id, id: item.city_id, label: item.city_name, children: [] };
                                });
                            }
                        })
                        getPosition({
                            city_id: city_id,
                            province_id: province_id
                        }).then((res)=>{
                            this.waiting = false
                            // console.log(res)
                            if(res.code != 200){
                                this.$message.error(res.message);
                                return;
                            };
                            this.regionOption.map((item,index)=>{
                                if(item.id == province_id){
                                    item.children.map((item2,index2)=>{
                                        if(item2.id == city_id){
                                            item2.children = res.data.map((item3, index3) => {
                                                return { value: item3.county_id, id: item3.county_id, label: item3.county_name};
                                            });
                                        }
                                    })
                                }
                            })
                            this.setformat(arr);
                        }).catch((err)=>{
                            this.waiting = false
                        })
                    }).catch((err)=>{
                        this.waiting = false
                    })
                
            }
        },
        changeCascader(arr){
            this.reqObj.region_arr = arr;
            this.setformat(arr);
            // console.log(arr)
        },
        changeTerrain(val){
            this.reqObj.terrain_id = val;
        },
        changeOwner(val){
            if(val == "更多"){
                return;
            }
            this.reqObj.owner_id = val;
        },
        onClickAll (){
            let addProject = document.getElementById('addProject');
            // 点击其他地方关闭
            if (addProject && !addProject.contains(event.target)) {
                this.closeAdd();
            }
        },
        // 获取经纬度
        getLngLat (callBack){
            // 调用高德API服务获取经纬度
            let address = this.reqObj.region_name1 + this.reqObj.region_name2 + this.reqObj.region_name3;
            if(!address){
                // console.log(address)
                this.$message.error(this.$t('m.emptyAdministrative'));
                return;
            }
           
            mapGet('/geocode/geo?address=' + address + '&key=' + amapKey, {}).then(res => {
                // console.log(res);
                if (res.status == '1') {
                    let lnglat = res.geocodes[0].location.split(',');
                    let obj = {};
                    obj.lng = lnglat[0];
                    obj.lat = lnglat[1];
                    callBack(obj);
                } else {
                    callBack({});
                    this.$message.error(res.info);
                }
            }).catch((err) => {
                console.log(err);
                callBack({});
                this.$message.error(this.$t('m.emptyCallApi'));
            });
        },
        onSubmit (){
            let that = this;
            this.$refs.formAdd.validate((valid) => {
                if (valid) {
                    this.createSubmit();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        createSubmit (){
            let that = this;
            this.waitingMinute = true
            // 获取经纬度
            this.getLngLat((res)=>{
                this.waitingMinute = false
                if(!res.lng){
                    this.$message.error(this.$t('m.emptylonLat'));
                    return;
                }
                // console.log(res)
                // 提交
                
                if(!this.isCompile){
                    this.waitingMinute = true
                    postProject({
                        project_name: that.formAdd.name,
                        design_capacity: that.formAdd.inputMw,
                        province: that.reqObj.region_arr[0],
                        city: that.reqObj.region_arr[1],
                        county: that.reqObj.region_arr[2],
                        owner_id: that.reqObj.owner_id,
                        latitude: res.lat,
                        longitude: res.lng,
                        terrain: that.reqObj.terrain_id,
                        description: that.formAdd.desc
                    }).then((res)=>{
                        this.waitingMinute = false
                        // console.log(res)
                        
                        if(res.code != 200){
                            this.$message.error(res.message);
                            return;
                        }
                        this.$message.success(res.message);
                        that.closeAdd(true);
                    }).catch((err)=>{
                        this.waitingMinute = false
                    })
                } else{
                    this.waitingMinute = true
                    putProject(that.compileData.project_id, {
                        project_name: that.formAdd.name,
                        design_capacity: that.formAdd.inputMw,
                        province: that.reqObj.region_arr[0],
                        city: that.reqObj.region_arr[1],
                        county: that.reqObj.region_arr[2],
                        owner_id: that.reqObj.owner_id,
                        latitude: res.lat,
                        longitude: res.lng,
                        terrain: that.reqObj.terrain_id,
                        description: that.formAdd.desc
                    }).then((res)=>{
                        this.waitingMinute = false
                        // console.log(res)
                        
                        if(res.code != 200){
                            this.$message.error(res.message);
                            return;
                        }
                        this.$message.success(res.message);
                        that.closeAdd(true);
                    }).catch((err)=>{
                        this.waitingMinute = false
                    })
                }
            })
        },
        setformat (arr){
            // console.log(arr)
            let that = this;
            if(arr && arr.length >0 && this.regionOption && this.regionOption.length >0 ) {
                this.regionOption.forEach((item,index)=>{
                   if(item.id == arr[0]){
                       that.reqObj.region_name1 = item.label;
                       item.children && item.children.forEach((item2,index2)=>{
                           if(item2.id == arr[1]){
                               that.reqObj.region_name2 = item2.label;
                               item2.children && item2.children.forEach((item3,index3)=>{
                                   if(item3.id == arr[2]){
                                       that.reqObj.region_name3 = item3.label;
                                   }
                               })
                           }
                       })
                   }
               })
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.project-add{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    .content{
        width: 3.96rem;
        // height: 4.7rem;
        overflow: hidden;
        height: 0;
        background:rgba(255,255,255,1);
        border-radius:2px;
        color: #6D7D41;
        position: absolute;
        // top: 2.65rem;
        top: 2.35rem;
        right: 0.18rem;
        padding: 0 0.2rem 0.2rem 0.2rem;
        /deep/ .el-input .el-input__inner{
            width: 2.55rem;
            height: 0.3rem;
            line-height: 0.3rem;
            background:rgba(235,242,228,1);
        }
        /deep/ .el-select{
            width: 2.55rem;
        }
        /deep/ .el-input.inputMw .el-input__inner{
            width: 1.8rem;
        }
        /deep/ .el-select-dropdown{
            border:1px solid rgba(206,212,190,1) !important;
        }
        /deep/ .el-textarea__inner{
            background:rgba(235,242,228,1);
            border:none;
        }
        /deep/ .el-textarea__inner, .el-textarea__inner:focus{
            color: #6D7D41;
        }
        /deep/ .el-form-item__label{
            color: #333;
        }
        .unit{
            position: absolute;
            left: 1.9rem;
            top: 0;
        }
        .bottomBtn{
            margin: 0.2rem 0 0 0.6rem;
        }
        .submit{
            width: 1.12rem;
            height: 0.45rem;
        }
        .submit1{
            background:rgba(212,226,230,0.9);
            color: #6D7D41;
        }
        .submit2{
            background:rgba(44,208,185,0.9);
            color: #fff;
        }
        .submit1:hover{
            background: rgba(212,226,230,1);
        }
        .submit2:hover{
            background: rgba(44,208,185,1);
        }
        .title{
            height: 0.5rem;
            line-height: 0.5rem;
            display: flex;
            justify-content: space-between;
            span{
                font-size: 0.17rem;
            }
            span:last-child{
                color: #2CD0B9;
                font-size: 0.15rem;
            }
        }
    }
} 

.addAnimation{
    animation: myfirst 0.4s;
    animation-fill-mode: forwards;
    animation-timing-function: 0.4s;
    transition: all 0.4s;
}
.noneAnimation{
    animation: myfirst2 0.4s;
    animation-fill-mode: forwards;
    animation-timing-function: 0.4s;
    transition: all 0.4s;
}
@keyframes myfirst
{
    0% { height: 0;}
    100% { min-height: 4.7rem;}
}
@keyframes myfirst2
{
    0% { min-height: 4.7rem}
    100% { height: 0;}
}
</style>