<template>
    <!-- <el-dialog title="设置" custom-class="uploadSetParam" :visible.sync="dialogFormVisible" :before-close="beforeClose"> -->
    <div class="uploadSetParam uploadSetParam2" v-if="dialogFormVisible">
        <el-form ref="setParamForm" :model="form" :rules="rules" :show-message="false" label-width="1.2rem" label-position="left">
            <el-form-item label="参考坐标系:" prop="coordinate">
                <el-tooltip class="item" effect="light" :content="String(form.coordinate)" placement="top">
                    <el-cascader
                        v-model="form.coordinate"
                        :options="options"
                        :disabled="terrainFileName"
                        @expand-change="handleExpandChange"
                        @change="handleChange">
                    </el-cascader>
                </el-tooltip>
            </el-form-item>
            <!-- <el-form-item label="折减系数:" prop="discount">
                <el-input v-model="form.discount" placeholder="折减系数" type="number"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="升压站坐标 X:" prop="station_X">
                <el-input v-model="form.station_X" placeholder="投影坐标X"></el-input>
            </el-form-item>
            <el-form-item label="升压站坐标 Y:" prop="station_Y">
                <el-input v-model="form.station_Y" placeholder="投影坐标Y"></el-input>
            </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit" :class="!epsg_id || terrainFileName ? 'disableClass': ''">确 定</el-button>
        </div>
    </div>
    <!-- </el-dialog> -->
</template>
<script>
import { validateCoordinateX, validateCoordinateY, validateCoordinates, validateDiscount } from "@/utils/validate"
import { checkEpsgChange, getAllUploadName, getEpsgList, getProjectEpsg, postProjectEpsg } from "@/api/server.request.js"
import { mapState } from "vuex";
export default {
    name: 'upload-setParam',
    data (){
        return{
            rules: {
                coordinate: [
                    {validator: validateCoordinates, trigger: 'change'}
                ],
                discount: [
                    {validator: validateDiscount, trigger: 'blur'}
                ],
                station_X: [
                    {validator: validateCoordinateX, trigger: 'blur'}
                ],
                station_Y: [
                    {validator: validateCoordinateY, trigger: 'blur'}
                ],
            },
            dialogFormVisible: false,
            form:{
                coordinate: [],
                discount: '0.78',
                station_X: '',
                station_Y: ''
            },
            options:[],
            epsg_id: '',
            terrainFileName: false // 地形
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
        }),
    },
    watch:{
        epsg_id (val){
            console.log("epsg:" + val)
            // console.log(this.form.coordinate)
        },
        dialogFormVisible (val){
            if(!val){
                this.form = {
                    coordinate: [],
                    discount: '0.78',
                    station_X: '',
                    station_Y: ''
                }
                this.options = []
                this.epsg_id = ''
            }
        }
    },
    beforeDestroy() {
        
    },
    mounted (){
        
    },
    methods:{
        closeEpsg (){
            this.dialogFormVisible = false
        },
        open (isGet, data){
            this.dialogFormVisible = data
            
            if (isGet == 'noneGet'){
                this.getEpsgZone(null, "0")
                return
            }
            // 新接口，返回是否可以修改epsg
            checkEpsgChange (this.projectInfo.project_id).then((res)=>{
                if (res.code != 200){
                    this.terrainFileName = false
                    return
                }
                console.log(res.data,"111111111111111111")
                this.terrainFileName = res.data != true ? true : false
            })
            getProjectEpsg (this.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    
                    return
                }
                
                let arr = []
                if(res.data.epsg_src_info.zone){
                    arr = [res.data.epsg_src_info.pcs, res.data.epsg_src_info.latitude_zone, res.data.epsg_src_info.zone]
                } else if (!res.data.epsg_src_info.zone && res.data.epsg_src_info.latitude_zone){
                    arr = [res.data.epsg_src_info.pcs, res.data.epsg_src_info.latitude_zone]
                } else if (!res.data.epsg_src_info.zone && !res.data.epsg_src_info.latitude_zone){
                    arr = [res.data.epsg_src_info.pcs]
                } else if (!res.data.epsg_src_info.pcs){
                    arr = []
                }
                this.form.coordinate = arr
                if(arr.length > 0){
                    this.getEpsgZoneBack(arr)
                } else{
                    this.getEpsgZone(null, "0")
                }
            })
        },
        getEpsgZoneBack(arr){
        let that = this
        this.httpEpsgZoneBack({},res=>{
            this.options = this.handleData(res.data)
            let data = {
                pcs: arr[0]
            }
            this.httpEpsgZoneBack(data, res => {
                if(!res) return;
                let resData = res.data
                if (arr.length == 1) {
                    that.epsg_id = resData.epsg_id
                    return;
                }
                that.options.forEach((item, index) => {
                    if (item.label == resData.pcs) {
                        item.children = resData.latitude_zone.map(v => {
                            return {
                                label: v,
                                value: v,
                                children: []
                            }
                        })
                    }
                })
                let data2 = {
                    pcs: arr[0],
                    latitude_zone: arr[1]
                }
                that.httpEpsgZoneBack(data2, res=>{
                    if(!res) return;
                    let resData = res.data
                    that.options.forEach(function (item) {
                        if (item.label == resData.pcs) {
                            item.children.forEach(function (citem) {
                                if (citem.label === resData.latitude_zone) {
                                    citem.children = resData.zone.map(v => {
                                    return {
                                        label: v,
                                        value: v,
                                    }
                                    })
                                }
                            })
                        }
                    })
                })
                let data3 = {
                    pcs: arr[0],
                    latitude_zone: arr[1],
                    zone: arr[2]
                }
                that.httpEpsgZoneBack(data3, res =>{
                    if(!res) return;
                    that.epsg_id = res.data.epsg_id
                })

            })

        })
        },
        httpEpsgZoneBack(data, callBack){
            let that = this;
            getEpsgList(data).then(res => {
                if (res.code != 200){
                    callBack(null)
                    return;
                };
                callBack(res)
            }).catch((err)=>{
                callBack(null)
            })
        },
        getEpsgZone(data, level) {
            let _this = this
            getEpsgList(data).then(res => {
                let resData = res.data
                if (level == '0') {
                    _this.options = this.handleData(resData)
                }
                else if (level == '1') {
                    if (!resData.latitude_zone) {
                        this.epsg_id = resData.epsg_id
                    } else {
                        _this.options.forEach(function (item) {
                            if (item.label == resData.pcs) {
                                item.children = resData.latitude_zone.map(v => {
                                    return {
                                        label: v,
                                        value: v,
                                        children: []
                                    }
                                })
                            }
                        })
                    }
                }
                else if (level == '2') {
                    if (JSON.stringify(resData) == "{}") return false
                    _this.options.forEach(function (item) {
                        if (item.label == resData.pcs) {
                            item.children.forEach(function (citem) {
                                if (citem.label == resData.latitude_zone) {
                                    citem.children = resData.zone.map(v => {
                                        return {
                                            label: v,
                                            value: v,
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else if (level == '3') {
                    _this.epsg_id = resData.epsg_id
                }
            }).catch((err)=>{
                callBack(null)
            })
        },
        close (){
            this.form = {
                coordinate: '',
                discount: '0.78',
                station_X: '',
                station_Y: ''
            }
            this.$refs.setParamForm.clearValidate()
            this.dialogFormVisible = false
        },
        beforeClose (done){
            this.close()
            done()
        },
        handleData(data) {
            return data.map(item => {
                let obj = {}
                obj.label = item.pcs
                obj.value = item.pcs
                if (item.children == "true") {
                    obj.children = []
                } else {
                    delete  obj.children
                }
                return obj
            })
        },
        verification (value){
            if ( value.length == 1 && value[0] == 'GCS_WGS_1984' || value[0] == 'GCS_CN_2000' ){
                this.$store.commit("verifiEpsgModel", 1)
            }
            else if (value.length == 3 && value[0] == 'WGS_84_UTM'){
                this.$store.commit("verifiEpsgModel", 2)
            }
            else {
                this.$store.commit("verifiEpsgModel", 3)
            }
        },
        handleExpandChange (value){
            let requestParam = {}
            if (value.length == 1) {
                requestParam.pcs = value[0]
                this.getEpsgZone(requestParam, '1')
            } else {
                requestParam.pcs = value[0]
                requestParam.latitude_zone = value[1]
                this.getEpsgZone(requestParam, "2")
            }
        },
        handleChange (value){
            this.form.coordinate = value
            this.verification(value);
            if (value.length === 0) {
                this.epsg_id = ''
                return
            }
            let list = ['pcs', 'latitude_zone', 'zone']
            let requestParam = {}
            value.forEach(function (item, index) {
                requestParam[list[index]] = item
            })
            if (value.length == 1) {
                this.getEpsgZone(requestParam, '1')
            } else {
                this.getEpsgZone(requestParam, "3")
            }
        },
        onSubmit (){
            if(!this.epsg_id){
                this.$message.error('请选择参考坐标系')
                return;
            }
            this.$refs.setParamForm.validate((valid) => {
                if (valid) {
                   this.postSubmit()
                } else {
                    return false;
                }
            })
        },
        postSubmit(){
            
            let that = this
            postProjectEpsg(that.projectInfo.project_id, {
                epsg_src: that.epsg_id,
                epsg_dst: that.epsg_id
            }).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                this.$emit('onSetEpsg')
                this.close()
            })
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/ .uploadSetParam{
    width: 4.5rem;
    .el-dialog__body{
        padding: 0.2rem 0.5rem;
    }
    .el-input, .el-form-item__label, .el-form-item__content, .el-cascader, .el-input__icon{
        line-height: 0.26rem;
        border: none;
        color: #6D7D41;
    }
    .el-cascader{
        width: 100%;
    }
    .el-form-item{
        margin-bottom: 0.08rem;
    }
    .el-input__inner{
        height:0.26rem;
        border: none;
        background:rgba(235,242,228,1);
        border-radius: 0.04rem;
    }
}
.uploadSetParam2{
    width: 3.97rem;
    margin: 0 auto 0.2rem auto;
    background:rgba(255,255,255,1);
    border-radius: 0.18rem;
    padding: 0.2rem 0.3rem;
    /deep/ .el-input,/deep/ .el-form-item__label,/deep/ .el-form-item__content,/deep/ .el-cascader,/deep/ .el-input__icon{
        line-height: 0.26rem;
        border: none;
        color: #6D7D41;
    }
    /deep/ .el-cascader{
        width: 100%;
    }
    /deep/ .el-form-item{
        margin-bottom: 0.08rem;
    }
    /deep/ .el-input__inner{
        height:0.26rem;
        border: none;
        background:rgba(235,242,228,1);
        border-radius: 0.04rem;
    }
    .dialog-footer{
        display: flex;
        justify-content: center;
        padding-top: 0.1rem;
        .disableClass{
            background: #ccc;
            cursor:no-drop;
        }
    }
}
</style>