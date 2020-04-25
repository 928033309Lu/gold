<template>
    <div class="project-list">
        <div>
            <p>
                <b class="nameTitle">{{$t('m.projectList')}}</b>
                <!-- <router-link class="close" to="/index" tag="div"><i class="iconfont icon-close"></i></router-link> -->
                <div class="close" @click="closeList"><i class="iconfont icon-close"></i></div>
            </p>
            
            <el-form ref="form" class="formClass" :model="form"  label-position="left">
                <el-form-item :label="$t('m.owner')">
                    <el-select v-model="form.owner" filterable remote 
                    @change="filterOwner"
                    :remote-method="remoteMethod">
                        <el-option
                        v-for="(item,index) of ownerOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <i @click="clearFilter('owner')" class="iconfont icon-qingkong"></i>
                </el-form-item>
                <el-form-item :label="$t('m.administrative')">
                    
                    <el-cascader v-model="form.administrative" ref="cascaderHandle"
                        :props="{ checkStrictly: true }"
                        @expand-change="handleChange"
                        @change="filterRegion"
                        :options="regionOptions">
                    </el-cascader>
                    <i @click="clearFilter('region')" class="iconfont icon-qingkong" style="top: 0.07rem"></i>
                </el-form-item>
                <el-form-item  :label="$t('m.createdDate')">
                    <el-select v-model="form.createdDate" @change="filterDate">
                        <el-option
                        v-for="item in dateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <i @click="clearFilter('date')" class="iconfont icon-qingkong"></i>
                </el-form-item>
            </el-form>
            <!-- <div><el-button class="addbtn" @click="addVisible = true"><i class="iconfont icon-zengjia"></i>{{$t('m.addProject')}}</el-button></div> -->
            <!-- <div class="checkBox">
                <el-checkbox v-model="checkProject">{{$t('m.myProject')}}</el-checkbox>
                <el-checkbox v-model="checkShare">{{$t('m.myShare')}}</el-checkbox>
            </div> -->
        </div>

        <div class="content">
            <div class="checkBox2">
                <div>
                    <el-checkbox v-model="checkProject">{{$t('m.myProject')}}</el-checkbox>
                    <el-checkbox v-model="checkShare">{{$t('m.myShare')}}</el-checkbox>
                </div>
                <el-tooltip class="item" effect="light" :content="$t('m.addProject')" placement="top">
                    <div class="iconAdd" @click="addVisible = true">
                        <i class="iconfont icon-add"></i>
                    </div>
                </el-tooltip>
            </div>
            <div class="content-list" :style="addVisible ? 'padding-top: 4.7rem;transition: all 0.3s;' : ''">
                <div>
                    <list-element 
                    v-for="(item,index) of listData" :key="index"
                    :list="item"
                    @removeProject="onRemoveProject"
                    @compileProject="onCompileProject"
                    @clickProject="onClickProject"
                    />
                </div>
            </div>
        </div>

        
        <project-add v-show="addVisible" 
            :addVisible="addVisible"
            :isCompileProject="isCompileProject"
            :compileData="compileData"
            :ownerOptions="ownerOptions"
            :oldOwnerOptions="oldOwnerOptions"
            @closeAddProject="closeAddProject"></project-add>
       
    </div>
</template>
<script>
import { mapState } from "vuex";
import listElement from "./list-element.vue"
import projectAdd from "./project-add.vue"
import { getOwner, getAreaPosition, getProjectList, getFilterPro, deleteProject } from "@/api/server.request.js"
export default {
    name: 'project-list',
    components:{
        listElement,
        projectAdd
    },
    data (){
        return{
            isCompileProject: false,
            compileData: null,
            addVisible: false,
            checkProject: true,
            checkShare: false,
            form:{
                owner: '',
                administrative: '',
                createdDate: ''
            },
            ownerOptions:[],
            oldOwnerOptions:[],
            regionOptions:[],
            dateOptions:[{
                label: '最近一星期',
                value: '1'
            },{
                label: '最近一个月',
                value: '2'
            },{
                label: '最近一年',
                value: '3'
            }],
            listData:[],
            filterObj:{
                owner_id: '',
                area_id: '',
                province_id: '',
                create_time: ''
            }
        }
    },
    created(){
        
    },
    mounted(){
        this.getOwners();
        this.getPosition();
        this.getDataList();
    },
    destroyed(){
       
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            uploadScheme_id: state => state.app.scheme_id,
        }),
    },
    methods:{
        closeList(){
            this.listData.length > 0 && this.listData.forEach((item,index)=>{
                gwmap.fanLayer.remove();
            })
            this.$store.commit('clickEarthFan', null)
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
        },
        remoteMethod(query) {
            if (query != '') {
                this.ownerOptions = this.oldOwnerOptions.filter(item => {
                    return item.label.indexOf(query) != -1;
                })
            } else {
                this.ownerOptions = this.oldOwnerOptions;
            }
        },
       
        closeAddProject(isTrue){
            this.compileData = null;
            this.isCompileProject = false;
            this.addVisible = false;
            // console.log(isTrue)
            if(isTrue){
                this.getDataList();
            }
        },
        getOwners(){
            getOwner().then((res)=>{
                if(res.code == 403 ) return;
                if(res.code != 200){
                    this.$message.error(res.message);
                    return;
                };
                this.oldOwnerOptions = res.data.map((item, index, arr) => {
                    return { value: item.owner_id, label: item.full_owner_name };
                });
                this.ownerOptions = this.oldOwnerOptions.filter((item,index)=>{
                    return index < 10;
                })
                this.ownerOptions.push({
                    value: '更多',
                    label: '更多'
                })
            })
        },
        getPosition(){
            getAreaPosition().then((res)=>{
                if(res.code == 403 ) return;
                if(res.code != 200){
                    this.$message.error(res.message);
                    return;
                };
                this.regionOptions = res.data.map((item, index, arr) => {
                    return { value: item.area_id, id: item.area_id, label: item.area_name,children:[] };
                });
               
            })
        },
        handleChange(arr){
            // console.log(arr)
            let area_id = Number(arr[0]);
            getAreaPosition({
                area_id: area_id
             }).then((res)=>{
                // console.log(res)
                if(res.code != 200){
                    this.$message.error(res.message);
                    return;
                };
                let data = res.data.map((item, index, arr) => {
                    return { value: item.province_id, id: item.province_id, label: item.province_name };
                });
                this.regionOptions.forEach((item,index)=>{
                    if(item.id == area_id){
                        item.children = data;
                    }
                })
            })
        },
        getDataList(){
            getProjectList().then((res)=>{
                if(res.code == 403 ) return;
                if(res.code != 200 ){
                    this.$message.error(res.message);
                    return;
                }
                this.listData = res.data;
                gwmap.fanLayer.load();
                this.listData.forEach((item,index)=>{
                    gwmap.fanLayer.add(item);
                })
            })
        },
        onClickProject(item, isPPt = false){
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
            isPPt && this.$store.commit('setPPtModel', 'edit')
        },
        onRemoveProject(item){
            this.$confirm(this.$t('m.removeProjectDataTip'), this.$t('m.hint'), {
                confirmButtonText: this.$t('m.confirm'),
                cancelButtonText: this.$t('m.cancel'),
                type: 'warning'
            }).then(() => {
                deleteProject(item.project_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message);
                        return;
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                        duration: 1000
                    });
                    this.getDataList();
                })
            }).catch(() => {
                         
            });
        },
        onCompileProject(item){
            // console.log(item)
            this.compileData = item;
            this.isCompileProject = true;
            this.addVisible = true;
        },
        filterOwner(value){
            if(value == "更多"){
                return;
            }
            this.filterObj.owner_id = value;
            this.getFilter();
        },
        filterRegion(value){
            // console.log(value)
            if (value.length ==1 ){
                this.filterObj.area_id = Number(value[0]);
                this.filterObj.province_id = '';
            } else if (value.length ==2 ){
                this.filterObj.area_id = '';
                this.filterObj.province_id = Number(value[1]);
            }
            this.getFilter();
            this.$refs.cascaderHandle.dropDownVisible = false;
        },
        filterDate(value){
            this.filterObj.create_time = value;
            this.getFilter();
        },
        getFilter(){
            getFilterPro({
                owner_id: this.filterObj.owner_id,
                area_id: this.filterObj.area_id,
                province_id: this.filterObj.province_id,
                create_time: this.filterObj.create_time
            }).then((res)=>{
                // console.log(res)
                if(res.code != 200){
                    return;
                }
                this.listData = res.data;
           })
        },
        clearFilter(type){
            switch (type){
                case 'owner':
                    this.form.owner = '';
                    this.filterObj.owner_id = '';
                break;
                case 'region':
                    this.form.administrative = '';
                    this.filterObj.province_id = '';
                break;
                case 'date':
                    this.form.createdDate = '';
                    this.filterObj.create_time = '';
                break;
            }
            this.getFilter();
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/fixed/variable-set.scss";
$height: 0.26rem;
$color: #6D7D41;
.project-list{
    position: fixed;
    top: 0;
    right: 0;
    z-index: 66;
    width: 4.3rem;
    height: 100%;
    background: $box-background;
    color: $text-black-color;
    padding: 0.1rem;
    border-radius: 0.9rem 0px 0px 0.34rem;
    display: flex;
    flex-direction: column;
    /deep/ .el-form-item__label{
        width: 0.9rem;
        padding: 0;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap
    }
    /deep/ .el-form-item__error{
       bottom: -0.05rem; 
    }
    /deep/ .el-select, /deep/ .el-cascader{
        width: 2.66rem;
    }
    /deep/ .el-input .el-input__inner{
        background: #fff;
        border: none;
        height: $height;
        line-height: $height;
    }
    /deep/ .el-form-item__content, /deep/ .el-form-item__label, /deep/ .el-select .el-input__icon{
        line-height: $height;
    }
    /deep/ .el-form-item{
        margin-bottom: 0.12rem;
    }
    /deep/ .el-form-item__content{
        .iconfont{
            position: absolute;
            right: 0.05rem;
            top: 0.01rem;
            z-index: 6;
            cursor: pointer;
            display: none;
        }
    }
    /deep/ .el-form-item__content:hover .iconfont{
        display: block;
    }
    /deep/ .el-checkbox{
        margin-right: 0.1rem;
        .el-checkbox__label{
            font-size: 0.14rem;
        }
    }
    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label, /deep/ .el-checkbox{
        color: #333;
    }
    /deep/ .el-checkbox__inner{
        background: none;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
        background: #2cd0b9;
    }
    .close{
        position: absolute;
        top: 0.1rem;
        right: 0.1rem;
        cursor: pointer;
        .iconfont{
            font-size: 0.18rem;
        }
    }
    .close:hover{
        color: $bg-color;
    }
    .formClass{
        margin: 0.3rem 0 0 0.25rem;
    }
    .addbtn{
        width: 2.66rem;
        height: 0.45rem;
        background: rgba(255,255,255,1);
        border:1px solid rgba(178,191,142,1);
        border-radius:2px;
        margin-left: 1.15rem;
        color: $color;
        .iconfont{
            font-size: 0.17rem;
            vertical-align: middle;
            margin-right: 0.08rem;
        }
    }
    .addbtn:hover{
        color: $bg-color;
        border: 1px solid $bg-color;
    }
    .checkBox{
        margin: 0.1rem 0 0 0.1rem;
    }
    .checkBox2{
        height: 0.5rem;
        padding: 0 0.18rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .iconAdd{
            cursor: pointer;
            color: #2CD0B9;
            width: 0.56rem;
            height: 0.3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background:rgba(240,246,247,1);
            border-radius: 0.11rem;
        }
    }
    .content{
        // margin-top: 0.1rem;
        background: rgba(255,255,255,1);
        border-radius: 0.18rem;
        // overflow-y: scroll;
        // flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        .content-list{
            flex: 1;
            overflow-y: auto;
            padding-top: 0.05rem;
            transition: all 0.3s;
        }
    }
}
.nameTitle{
    font-size: 0.14rem;
    padding: 0 0 0 0.5rem;
}
</style>