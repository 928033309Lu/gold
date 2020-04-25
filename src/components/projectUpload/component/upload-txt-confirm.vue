<template>
    <!-- <el-dialog title="通道高度确认"
        :visible.sync="typeVisibleTXT" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="onClose"
        
        custom-class="upload-txt-confirm" > -->
        <!-- :before-close="handleClose" -->
        <!-- :show-close="false" -->
        <!-- <div class="close" @click="onClose"><i class="el-icon-close"></i></div> -->
<div class="my-dialog-box" v-show="typeVisibleTXT">
  <div class="my-dialog upload-txt-confirm">
    <div class="header"> 通道高度确认 </div>
    <div class="close" @click="onClose"><i class="el-icon-close"></i></div>
    <div class="dialog_body">
        <div class="btnSubmit"><div @click="onSubmit">提交</div></div>

        <div class="content">
            <div class="left">
                <el-table style="width: 100%" height="5rem" :data="tableData.dataSlices" @row-click="clickRow" highlight-current-row  ref="tableTxt" :row-class-name="tableRowClassName">
                    <el-table-column prop="label" label="标签" width="250"> 
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="light" :content="scope.row.label" placement="top">
                                <span>{{scope.row.label}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unitDescribe" label="单位" width="120"> </el-table-column>
                    <el-table-column prop="type" label="类型" width="120"> </el-table-column>
                    <el-table-column prop="subType" label="次类型" width="120"> </el-table-column>
                    <el-table-column prop="height" label="高度" width="120"> </el-table-column>
                    <el-table-column prop="columnValueAvg" label="平均值">
                        <template slot-scope="scope">
                            <span>{{scope.row.columnValueAvg == 0 ? 0 : scope.row.columnValueAvg.toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="columnValueMax" label="最大值" width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.columnValueMax == 0 ? 0 : scope.row.columnValueMax.toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="columnValueMin" label="最小值" width="120"><template slot-scope="scope">
                            <span>{{scope.row.columnValueMin == 0 ? 0 : scope.row.columnValueMin.toFixed(2)}}</span>
                        </template>
                    </el-table-column>
    
                </el-table>
                
            </div>
            
        </div>
        <div class="right">
            <el-form :model="txtForm" label-width="1.1rem" label-position="right">
                <el-form-item label="标签:">
                    <el-tooltip class="item" effect="light" :content="txtForm.label" placement="top">
                        <span class="span ellipsis"> {{txtForm.label}} </span>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="类型:">
                    <el-select v-model="txtForm.type" @change="changeType">
                        <el-option
                        v-for="(item,index) of typeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="高度(m):">
                    
                    <el-input v-model="txtForm.height" class="heightInpt" @input="onInput"></el-input>  
                    <span class="uni"> - </span>
                    <el-select v-model="txtForm.heightType" class="heightType" @change="changeHeightType">
                        <el-option
                        v-for="(item,index) of heightOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="次类型:">
                    <el-select v-model="txtForm.subType" @change="changeSubType">
                        <el-option
                        v-for="(item,index) of typeserOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="首行数据:" class="frommaxNumber">
                    <span> {{txtForm.columnValueFirst}} </span>
                </el-form-item>

            </el-form>
        </div>

    </div>
  </div>
</div>  
    <!-- </el-dialog> -->
</template>
<script>

import { txtConfirmRead, txtConfirmPut, txtConfirmLoop } from "@/api/goldLab.request.js"
import { mapState } from "vuex";
export default {
    name: 'upload-txt-confirm',
    components:{
        txtConfirmData:{}
    },
    data (){
        return{
            loopNum: 0,
            loopTXTtimeout: null,
            waitingGlodLab: false,
            typeVisibleTXT: false,
            fileName: null, 
            txtForm:{ 
                label: '',
                type: '',
                height: '',
                heightType: '',
                subType: '',
                maxNumber: '',
                id: ''
            },
            tableData: {},
            typeOptions: [
                {
                    label: 'SPEED',
                    value: 'SPEED'
                },
                {
                    label: 'DIRECTION',
                    value: 'DIRECTION'
                },
                {
                    label: 'TEMPRETURE',
                    value: 'TEMPRETURE'
                },
                {
                    label: 'PRESSURE',
                    value: 'PRESSURE'
                },
                {
                    label: 'OTHER',
                    value: 'OTHER'
                },
            ],
            heightOptions: [
                {
                    label: 'DEFAULT',
                    value: 'DEFAULT'
                },
                {
                    label: 'A',
                    value: 'A'
                },
                {
                    label: 'B',
                    value: 'B'
                },
                {
                    label: 'C',
                    value: 'C'
                },
                {
                    label: 'N',
                    value: 'N'
                },
                {
                    label: 'NNW',
                    value: 'NNW'
                },
                {
                    label: 'NW',
                    value: 'NW'
                },
                {
                    label: 'WNW',
                    value: 'WNW'
                },
                {
                    label: 'W',
                    value: 'W'
                },
                {
                    label: 'WSW',
                    value: 'WSW'
                },
                {
                    label: 'SW',
                    value: 'SW'
                },
                {
                    label: 'SSW',
                    value: 'SSW'
                },
                {
                    label: 'S',
                    value: 'S'
                },
                {
                    label: 'SSE',
                    value: 'SSE'
                },
                {
                    label: 'SE',
                    value: 'SE'
                },
                {
                    label: 'ESE',
                    value: 'ESE'
                },
                {
                    label: 'E',
                    value: 'E'
                },
                {
                    label: 'ENE',
                    value: 'ENE'
                },
                {
                    label: 'NE',
                    value: 'NE'
                },
                {
                    label: 'NNE',
                    value: 'NNE'
                },
            ],
            typeserOptions: [
                {
                    label: 'AVG',
                    value: 'AVG'
                },
                {
                    label: 'SD',
                    value: 'SD'
                },
                {
                    label: 'MAX',
                    value: 'MAX'
                },
                {
                    label: 'MIN',
                    value: 'MIN'
                },
                {
                    label: 'OTHER',
                    value: 'OTHER'
                },
            ],
            index: null,
            tableRowClass: -1
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
        }),
    },
    watch:{
        waitingGlodLab () {
            this.$store.dispatch('handleLoading', {loading: this.waitingGlodLab, text: '正在上传数据，请稍候...'});
        },
    },
    beforeDestroy() {
        
    },
    mounted (){
        
    },
    methods:{
        onClose (){
            this.txtForm = { 
                label: '',
                type: '',
                height: '',
                heightType: '',
                subType: '',
                maxNumber: '',
                id: ''
            }
            this.typeVisibleTXT = false
            this.$emit('uploadTxtClose', this.index)
        },
        open (data, fileName, index){
            this.index = index
            this.typeVisibleTXT = true
            console.log(data, index)
            this.tableData = data
            this.fileName = fileName


            let dataSlices = this.tableData.dataSlices[0]
            this.$refs.tableTxt.setCurrentRow(dataSlices)
            this.txtForm = { 
                label: dataSlices.label,
                type: dataSlices.type,
                height: dataSlices.height,
                heightType: dataSlices.cedian,
                subType: dataSlices.subType,
                maxNumber: dataSlices.columnValueMax,
                id: dataSlices.id
            }
        },
        clickRow (row, column, event){
            console.log(row)
            this.txtForm = { 
                label: row.label,
                type: row.type,
                height: row.height,
                heightType: row.cedian,
                subType: row.subType,
                maxNumber: row.columnValueMax,
                id: row.id
            }
        },
        changeType (val){
            // console.log(val, this.txtForm.id)
            this.tableData.dataSlices.forEach((item, index)=>{
                if(item.id == this.txtForm.id){
                    item.type = val
                }
            })
        },
        changeHeightType (val){
            this.tableData.dataSlices.forEach((item, index)=>{
                if(item.id == this.txtForm.id){
                    item.cedian = val
                }
            })
        },
        changeSubType (val){
            this.tableData.dataSlices.forEach((item, index)=>{
                if(item.id == this.txtForm.id){
                    item.subType = val
                }
            })
        },
        onInput (val){
            this.tableData.dataSlices.forEach((item, index)=>{
                if(item.id == this.txtForm.id){
                    item.height = val
                }
            })
        },
        tableRowClassName ({row, rowIndex}){
            if(rowIndex == this.tableRowClass){
                return 'activeRed'
            }
        },
        onSubmit (){
            
            if (!this.tableData.ensureId) return;
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            txtConfirmPut(this.tableData.ensureId, this.tableData, config).then((res)=>{
                if(res.code != 200){
                    // this.$message.error(res.msg || '提交失败')
                    this.$message({
                        type: 'error',
                        message: res.msg || '提交失败',
                        duration: 6000
                    })

                    if (res.msg){
                        let str = res.msg.split('【')[1]
                        if(!str) return;
                        let redData = str.split('】')[0]
                        if(!redData) return;
                        this.tableData.dataSlices.forEach((item, index)=>{
                            if(item.label == redData){
                                this.tableRowClass = index
                            }
                        })
                        
                        
                    }
                    return
                }
                this.tableRowClass = -1
                // this.$message.success(res.data)
                this.loopNum = 0
                // this.onLoopTxt()  // 轮询接口作废， 上传完了就可以
                this.$message.success('文件上传成功')
                this.waitingGlodLab = false
                this.$emit('uploadTxtSuccess', this.tableData.ensureId, this.fileName, this.index)
                this.typeVisibleTXT = false
            }).catch((err)=>{
                this.$message.error('提交失败')
            })
        },
        onLoopTxt (){
            this.waitingGlodLab = true
            if (this.loopNum > 300){
                this.$message.error('上传超时，请换个文件再重试！')
                this.waitingGlodLab = false
                this.$emit('uploadTimeOut', this.index)
                this.typeVisibleTXT = false
                return
            }
            txtConfirmLoop(this.tableData.ensureId).then((res)=>{
                if (res.code != 200){
                    this.waitingGlodLab = false
                    this.$message.error(res.msg || '提交失败')
                    this.$emit('uploadTxtError', this.index)
                    this.typeVisibleTXT = false
                    return
                }
                if (res.data != true){
                    this.loopTXTtimeout = setTimeout(() =>{
                        this.loopNum += 5
                        this.onLoopTxt()
                    },5000)
                }else{
                    this.$message.success('文件上传成功')
                    this.waitingGlodLab = false
                    this.$emit('uploadTxtSuccess', this.tableData.ensureId, this.fileName, this.index)
                    this.typeVisibleTXT = false
                }

            }).catch((err)=>{
                this.waitingGlodLab = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/ .upload-txt-confirm, .upload-txt-confirm{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 9999;
    height: 6.3rem;
    width: 80%;
    .activeRed {
        overflow: initial;
        td{
            background-color: #f56c6c;
        }
    }
    .el-table__body-wrapper{
        overflow: auto;
    }
    .cell{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .el-table{
        
    }
    .el-form{
        border: 1px dashed #ccc;
        padding: 0.2rem 0.1rem;
    }
    .el-form-item{
        margin-bottom: 0.1rem;
        padding: 0 !important;
    }
    .el-form-item__label{
        padding-right: 0.15rem !important;
    }
    .fromlabel{
        margin-bottom: 0.2rem;
    }
    .frommaxNumber{
        margin: 0.3rem 0 0.1rem 0;
    }
    .el-select{
        width: 2.25rem;
        border: 1px dashed #ccc;
        border-radius: 6px;
    }
    .el-input__inner{
        border: none;
    }
    .heightType{
        width: 1.1rem;
    }
    .el-form-item__content, .el-form-item, .el-form-item__label, .el-input, .el-input__inner{
        line-height: 0.3rem !important;
        height: 0.3rem !important;
    }
    .el-input__inner{
        padding: 0 0 0 0.1rem !important;
        margin: 0 !important;
    }
    .el-table__body tr:hover>td {
		background-color: #ecf5ff !important;
	}
    .el-table__body tr.activeRed:hover>td {
		background-color: #BC0711 !important;
	}
    .el-input__inner{
        width: 1rem;
    }
    .heightInpt{
        width: 0.8rem;
    }
    .heightInpt{
        border: 1px dashed #ccc;
        border-radius: 6px;
    }
    .uni{
        margin: 0 0.1rem;
    }
    .btnSubmit{
        position: absolute;
        right: 1.6rem;
        bottom: 0.5rem;
        display: flex;
        justify-content: center;
        &>div{
            cursor: pointer;
            width: 1.3rem;
            height: 0.4rem;
            line-height: 0.4rem;
            text-align: center;
            color: #fff;
            background: rgba(44,208,185,1);
            border-radius: 0.16rem;
        }
        .disableClass{
            pointer-events: none;
            cursor: default;
            background: #ccc;
        }
    }
    .dialog_body{
        display: flex;
    }
    .content{
        display: flex;
        max-height: 5rem;
        overflow: auto;
        .left{
            flex: 1;
        }
    }
    .right{
        width: 4rem;
        margin-left: 0.3rem;
    }
}
.close{
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
    z-index: 99999;
    font-size: 0.25rem;
    cursor: pointer;
}
.span{
    display: inline-block;
    width: 2.6rem;
}
</style>