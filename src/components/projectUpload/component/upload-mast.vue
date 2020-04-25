<template>
    <div class="upload-mast" ref="mastHeight">
        <div class="mastContent" >
            <div>
                <div class="title">
                    <div>
                        <el-tooltip class="item" effect="light" :content="$t('m.downTemplate')" placement="top">
                            <span class="span1" @click="downLoadMast"><i class="iconfont icon-moban"></i></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" :content="$t('m.daoruTemplate')"  placement="top">
                            <span class="span2" @click="importMast"><i class="iconfont icon-daoru1"></i></span>
                        </el-tooltip>
                    </div>
                    <div>
                        <!-- <span class="span3" @click="trustMast"><i class="iconfont icon-11farendaibiaotongyong"></i></span>
                        <span class="span3" @click="analyzeMast"><i class="iconfont icon-fenxi"></i></span> -->
                        <span class="span4" @click="onSubmitNew">{{$t('m.submitCalculations2')}}</span>
                    </div>
                </div>
            
                <upload-button :class="mast_uploading? 'uploading' :''" ref="mast_point"
                    :type="24" :fileName="fileName_mast" 
                    @removeFile="removeFile"
                    @clickUpload="onClickUpload"></upload-button>
                <!-- <upload-button :class="csv_uploading? 'uploading' :''" ref="mast_csv"
                    :type="21" :fileName="fileName_csv" :width="mast_csv_width"
                    @removeFile="removeFile"
                    @clickUpload="onClickUpload"></upload-button> -->

                <div class="content">
                    <mast-list-element v-for="(item, index) of mastList" :key="index"
                    :ref="'mast'+ index" :list = 'item' :index = 'index'
                    :mastList="mastList"
                    @opentxtConfirm="opentxtConfirm"
                    @refreshMastList="refreshMastList"
                    @onMastSubmit="onMastSubmit"
                    @removeMastElement="removeMastElement"></mast-list-element>
                </div>
            </div>
        </div>


        <el-upload  action="/"  class="defaultUpload" accept=".txt,.xyh"
            :before-upload="beforeReadMastUpload" 
            :http-request="httpReadMastRequest">
            <button ref="readMastUpload"></button>
        </el-upload>
        <el-upload  action="/"  class="defaultUpload" accept=".txt,.csv"
            :before-upload="beforeCSVUpload" 
            :http-request="httpCSVRequest">
            <button ref="csvUpload"></button>
        </el-upload>
        <!-- txt -->
        <upload-txt-confirm ref="txtConfirm"
            @uploadTimeOut="uploadTimeOut"
            @uploadTxtError="uploadTxtError"
            @uploadTxtClose="uploadTxtClose"
            @uploadTxtSuccess="uploadTxtSuccess"></upload-txt-confirm>
        
    </div>
</template>
<script>
import uploadTxtConfirm from "./upload-txt-confirm.vue"
import uploadButton from "./upload-button.vue"
import mastListElement from "./mast-list-element.vue"
import { verifyFileNameCheck, verifyFileName, verifyFileNameLength, validateFile } from "@/utils/validate"
import { downTemplate } from "@/utils/download"
import { putMastMain, calculateMast, putMastOnce, removeMastInfo, calculateConfidence, removeMastCsv, removeMastOnce, postMastOnce, readMastInfoFile, postMastJson, getMastList, getMastCsv, terrainStatus, postMastCsv, postMastCalculate, mastStatus } from "@/api/server.request.js"
import { mapState } from "vuex";
import envConfig from '@/config/env-config.js'
export default {
    name: 'upload-mast',
    components:{
        uploadButton,
        mastListElement,
        uploadTxtConfirm
    },
    data (){
        return{
            confidenceStatusInfo: null,
            mastStatusInfo: null,
            mastCalculateStatus: null,
            waitingMinute: false,
            heights: '',
            mast_uploading: false,
            fileName_mast: '',
            csv_uploading: false,
            fileName_csv: '',
            mast_csv_width: 0,
            mastList: [],
            terrainStatusInfo: null,
            waitingMin: false
        }
    },
    computed:{
        ...mapState({
            projectInfo: state => state.app.projectInfo,
            recalculate: state => state.projectUpload.recalculate,
            refreshMastLayer: state => state.projectUpload.refreshMastLayer,
        })
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.uploading')});
        },
        waitingMin () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMin, text: '发起计算中，请稍候...'});
        },
        fileName_csv (val){
            if (val){
                this.csv_uploading = true
            } else{
                this.csv_uploading = false
            }
        },
        recalculate (type){
            if(type == 'mast'){
                this.onMastCalculate()
            }
        },
        mastList:{
            handler(val, oldVal){
                let data = val.filter((item, index) => item.mast_id)
                if(data.length<=0){
                    this.$store.commit('setSchemeMemu',{
                        type: 'clearWind'
                    })
                }else{
                    this.$store.commit('setSchemeMemu',{
                        type: 'windData'
                    })
                }
            },
            deep:true
        },
        refreshMastLayer (val){
            if(val){
                this.refreshMastList()
            }
        }
        
    },
    mounted (){
        
        
        this.getMastInfoList()
        
    },
    beforeDestroy (){
        this.waitingMinute = false
        clearTimeout(this.mastCalculateStatus)
    },
    methods:{
        opentxtConfirm (data, fileName, index){
            this.$refs.txtConfirm.open(data, fileName, index)
        },
        // new 上传txt成功后
        uploadTxtSuccess (ensureId, fileName, index){
            // console.log(ensureId, fileName, index)
            this.mastList[index].mast_file_txt = fileName
            this.mastList[index].goldlab_id = ensureId
        },
        uploadTimeOut (index){
            this.mastList[index].txt_uploading = false
        },
        uploadTxtError (index){
            this.mastList[index].txt_uploading = false
            this.mastList[index].mast_file_txt = null
            this.mastList[index].goldlab_id = null
        },
        uploadTxtClose (index){
            if (!this.mastList[index].mast_file_txt){
                this.mastList[index].txt_uploading = false
            }
        },



        windSetSchemeMemu (){
            if (this.mastList.length){
                this.$store.commit('setSchemeMemu', {
                    type: 'windData',
                    change: false
                })
            }
        },
        windSetSchemeMemuCSV (){
            // if (this.fileName_csv){
            //     this.$store.commit('setSchemeMemu', {
            //         type: 'windDataConfidence',
            //         data: true
            //     })
            // }
        },
        refreshMastList (){
            this.getMastInfoList()
        },
        // 测风列表数据
        getMastInfoList (){
            // getMastCsv(this.projectInfo.project_id).then((res)=>{
            //     if(res.code == 200){
            //         this.fileName_csv = res.data.merra2_file_name
            //     }
            //     this.windSetSchemeMemuCSV()
            // })
            getMastList(this.projectInfo.project_id).then((res)=>{
                if(res.code == 200){
                    if (res.data.length>0){
                        this.mastList = res.data.map((item, index) =>{
                            return{
                                main_mast: item.main_mast == '1' ? true : false,
                                mast_id: item.mast_id,
                                mast_name: item.mast_name,
                                coordinate_x: item.coordinate_x,
                                coordinate_y: item.coordinate_y,
                                mast_height: item.height,
                                mast_file_tim: item.filename,
                                mast_file_txt: item.filename_txt,
                                goldlab_id: item.goldlab_id,
                                goldlab_id: item.goldlab_id,
                                tim_uploading: item.filename ? true : false,
                                txt_uploading: item.filename_txt ? true : false,
                                tim_progress_width: 0,
                                txt_progress_width: 0,
                                show: item.mast_name && item.coordinate_x && item.coordinate_y && item.height ? false : true
                            }
                        })
                    }else{
                        this.mastList = []
                    }
                }
                
                this.windSetSchemeMemu()
                this.getMastStatus()
            })
        },
        // 步骤
        getMastStatus (type = null){
            // console.log(this.mastList)
            if (this.mastList.length <= 0){
                this.$store.commit('calculateStatus', {
                    type: 'clearmast'
                })
                return
            }
            mastStatus(this.projectInfo.project_id).then((res)=>{
                if(res.code == 200){
                    this.mastStatusInfo = res.data.filter((item, index) => {
                        return item.step_name == 'wind_info' && item.mast_task
                    })
                    this.confidenceStatusInfo = res.data.filter((item, index) => {
                        return item.step_name == 'mast_confidence'
                    })
                    // console.log(this.confidenceStatusInfo)
                    var statuss = false
                    var statuss1 = false
                    statuss = this.mastStatusInfo.some((item, index)=>{
                        return item.status == 1 || item.status == 0
                    })
                    statuss1 = this.confidenceStatusInfo.some((item, index)=>{
                        return item.status == 1 || item.status == 0
                    })

                        this.$store.commit('calculateStatus', {
                            type: 'mast',
                            data: this.mastStatusInfo,
                            data2: this.confidenceStatusInfo
                        })
                        if(this.mastCalculateStatus){
                            clearTimeout(this.mastCalculateStatus)
                        }
                        // console.log(statuss, statuss1)
                        if (statuss || statuss1) {
                            this.mastCalculateStatus = setTimeout(()=>{
                                this.getMastStatus()
                            }, 5000)
                        }

                }
            }).catch((err)=>{
                clearTimeout(this.mastCalculateStatus)
            })
        },
        downLoadMast (){
            // 点位模板
            downTemplate("/project/output_template", {
                args: 'mast_coordinate'
            })
            downTemplate("/project/output_template", {
                args: 'mast_xyh'
            })
        },
        importMast (){
            let that = this
            if (this.mastList.length <= 0){
                this.$refs.readMastUpload.click()
                return
            }
            this.$confirm(this.$t('m.importWindDataTip'), this.$t('m.hint'), {
                confirmButtonText: this.$t('m.confirm'),
                cancelButtonText: this.$t('m.cancel'),
                type: 'warning'
            }).then(() => {
                removeMastInfo(this.projectInfo.project_id).then((res)=>{
                    if(res.code != 204){
                        this.$message.error(res.message)
                        return
                    }
                    this.mastList = []
                    gwmap.mastLayer.remove()

                    this.$store.commit('calculateStatus', {
                        type: 'clearmast'
                    })
                })
                this.$refs.readMastUpload.click()
                
            }).catch(() => {
                         
            });
            
        },
        // 废弃
        onSubmit (){
            let that = this
            let validateArr = []
            var result = true
            if (this.mastList.length <=0){
                this.$refs.mast_point.$el.classList.add('redBorder')
                this.$message.error(this.$t('m.messErrUploadMast'))
                return
            }
            // if (!this.fileName_csv){
            //     this.$refs.mast_csv.$el.classList.add('redBorder')
            //     this.$message.error(this.$t('m.messErrUploadCsv'))
            //     return
            // }
            this.$refs.mast_point.$el.classList.remove('redBorder')
            this.$refs.mast_csv.$el.classList.remove('redBorder')

            this.mastList.forEach((item, index) =>{
                that.$refs['mast'+index][0].$refs['mast'+index].validate((valid) => {
                    validateArr.push({
                        name: 'mast'+index,
                        validate: valid
                    }) 
                })
            })
            if (validateArr.length >0){
                validateArr.forEach((item, index) =>{
                    if (!item.validate){
                        that.$refs[item.name][0].$el.classList.add('redBorder')
                    } else{
                        that.$refs[item.name][0].$el.classList.remove('redBorder')
                    }
                })
                result = validateArr.some(function(item) {
                    return !item.validate
                })
                if (result){
                    this.$message.error(this.$t('m.messErrTip'))
                    return
                }
                this.verifyMastRepetition((res)=>{
                    if(!res){
                        return;
                    }
                    this.postMastData()
                })
            }
            
        },
        removeFile (type){
            // console.log(type)
            if(type == 21){
                this.removeCSVfile()
            }
        },
        onSubmitNew (){
            if (this.mastList.length <=0){
                this.$message.error(this.$t('m.messErrUploadMast'))
                return
            }
            let flag = this.mastList.some((item, index) => {
                return item.mast_file_tim && item.mast_file_txt
            })
            if (!flag){
                this.$message.error('至少有一个测风塔上传.tim和.txt数据文件方可发起计算！')
                return
            }
            this.waitingMin = true
            let p2 = new Promise((resolve, reject) => {
                calculateConfidence(this.projectInfo.project_id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        reject(res.message)
                        return
                    }
                    resolve('ok')
                })
            })
            Promise.all([p2]).then((res)=>{
                this.waitingMin = false
                console.log(res.message)
                this.getMastStatus()
            }).catch((err)=>{
                this.waitingMin = false
            })
        },
        // 删除中尺度
        removeCSVfile (){
            removeMastCsv(this.projectInfo.project_id).then((res)=>{
                if(res.code != 204){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                this.fileName_csv = null
                // this.getMastStatus()
            })
        },
        // 确定
        onMastSubmit (item, index, callback){
            // console.log(item, index)
            this.verifyMastRepetitionNew((res)=>{
                // console.log(res)
                if (!res) return;
                this.verifyMastFile(item, (resFile)=>{
                    
                    if (!item.mast_id){
                        // 单个提交
                        this.postMastDataOnce(item, index, callback)
                    }
                    else{
                        // 单个修改
                        this.onPutMastOnce(item, index, callback)
                    }
                })
            })
        },
        // 拆开后 文件名单独验证
        verifyMastFile (item, callback){
            console.log(item.mast_file_tim , item.mast_file_txt, "0000")

            if (!item.mast_file_tim && item.mast_file_txt){
                this.$message.error('请上传.tim文件')
                callback(false)
            }
            else if(item.mast_file_tim && !item.mast_file_txt){
                this.$message.error('请上传.txt文件')
                callback(false)
            }
            else if(item.mast_file_tim && item.mast_file_txt){
                callback(true)
            }
            else if(!item.mast_file_tim && !item.mast_file_txt){
                callback(true)
            }
        },
        // 单个修改
        onPutMastOnce (item, index, callback){
            let data = {
                project_id: this.projectInfo.project_id,
                mast_id: item.mast_id,
                mast_info: item
            }
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            putMastOnce(data, config).then((res)=>{
                if(res.code != 201){
                    this.$message.error(res.message)
                    callback(null)
                    return
                }
                this.$message.success(res.message)
                callback('close')
                setTimeout(()=>{
                    this.getMastStatus()
                    this.$store.commit('refreshWindLayer')
                }, 1000)
            })
        },
       
        // 删除
        onRemoveMast (item, index){
            
            removeMastOnce(this.projectInfo.project_id, item.mast_id).then((res)=>{
                if(res.code != 204){
                    this.$message.error(res.message)
                    return
                }
                
                this.mastList.splice(index, 1)
                if(this.mastList.length <= 0) {
                    this.$store.commit('calculateStatus', {
                        type: 'clearmast'
                    })
                    return
                };
                
                if(this.mastList.every((item, index)=> !item.main_mast)){
                    this.mastList[0].main_mast = true
                }
                this.onSetMastMain(this.mastList[0], (res)=>{  
                    this.getMastStatus()
                    this.$store.commit('refreshWindLayer')
                })
            })
        },
        // 单个提交
        postMastDataOnce (item, index, callback){
            let data = {
                project_id: this.projectInfo.project_id,
                mast_info: item
            }
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            postMastOnce(data, config).then((res)=>{
                if(res.code != 201){
                    this.$message.error(res.message)
                    callback(null)
                    return
                }
                this.$message.success(res.message)
                item.mast_id = res.data
                callback('close')
                setTimeout(()=>{
                    this.getMastStatus()
                    this.windSetSchemeMemu()
                }, 500)
            })
        },
        // 验证
        verifyMastRepetitionNew (callback){
            var temp = [];
            var index = [];
            var tempName = [];
            var indexName = [];
            for(var i = 0; i < this.mastList.length; i++) {
                for(var j = i + 1; j < this.mastList.length; j++){
                    if (this.mastList[i].coordinate_x && this.mastList[i].coordinate_y 
                    &&(this.mastList[i].coordinate_x == this.mastList[j].coordinate_x)
                    &&(this.mastList[i].coordinate_y == this.mastList[j].coordinate_y)){
                        index.push(j)
                        i++;
                        j = i;
                    }
                    if (this.mastList[i].mast_name == this.mastList[j].mast_name){
                        indexName.push(j)
                        i++;
                        j = i;
                    }
                }
                temp.push(this.mastList[i]);
                tempName.push(this.mastList[i]);
            }            
                       
            for(var i = 0 ; i < index.length - 1; i ++){
                for(var j = 0 ; j < index.length - i - 1; j ++){
                    if(index[j] > index[j + 1]){	
                        var ls = index[j];
                        index[j] = index[j + 1];
                        index[j + 1] = ls;
                    }
                }
            }
            for(var i = 0 ; i < indexName.length - 1; i ++){
                for(var j = 0 ; j < indexName.length - i - 1; j ++){
                    if(indexName[j] > indexName[j + 1]){	
                        var ls2 = indexName[j];
                        indexName[j] = indexName[j + 1];
                        indexName[j + 1] = ls2;
                    }
                }
            }
            
            var str = "";
            for(let i=0; i<index.length; i++){
                str += (index[i]+1)+",";
            }
            str = str.substring(0,str.length-1);
            var strName = "";
            for(let i=0; i<indexName.length; i++){
                strName += (indexName[i]+1)+",";
            }
            strName = strName.substring(0,strName.length-1);

            var next1 = true;
            var next2 = true;
            if(index.length>0) {
                this.$message.error('存在测风塔坐标数据与其他的有重复');
                next1 = false
                return
            }else {
                next1 = true
            }
            if(indexName.length>0) {
                this.$message.error('存在测风塔名称与其他的有重复');
                next2 = false
                return
            }else {
                next2 = true
            }

            if (next1 && next2){
                callback('ok')
            } else{
                return
                callback(null)
            }
        },
        verifyMastRepetition (callback){
            var temp = [];
            var index = [];
            var tempName = [];
            var indexName = [];
            for(var i = 0; i < this.mastList.length; i++) {
                this.$refs['mast'+ i][0].$el.classList.remove('redBorder')
                for(var j = i + 1; j < this.mastList.length; j++){
                    if (this.mastList[i].coordinate_x && this.mastList[i].coordinate_y 
                    &&(this.mastList[i].coordinate_x == this.mastList[j].coordinate_x)
                    &&(this.mastList[i].coordinate_y == this.mastList[j].coordinate_y)){
                        index.push(j)
                        i++;
                        j = i;
                    }
                    if (this.mastList[i].mast_name == this.mastList[j].mast_name){
                        indexName.push(j)
                        i++;
                        j = i;
                    }
                }
                temp.push(this.mastList[i]);
                tempName.push(this.mastList[i]);
            }            
                       
            for(var i = 0 ; i < index.length - 1; i ++){
                for(var j = 0 ; j < index.length - i - 1; j ++){
                    if(index[j] > index[j + 1]){	
                        var ls = index[j];
                        index[j] = index[j + 1];
                        index[j + 1] = ls;
                    }
                }
            }
            for(var i = 0 ; i < indexName.length - 1; i ++){
                for(var j = 0 ; j < indexName.length - i - 1; j ++){
                    if(indexName[j] > indexName[j + 1]){	
                        var ls2 = indexName[j];
                        indexName[j] = indexName[j + 1];
                        indexName[j + 1] = ls2;
                    }
                }
            }
            if(index.length>0) {
                index.forEach((item) =>{
                    this.$refs['mast'+ item][0].$el.classList.add('redBorder')
                })
            }
            if(indexName.length>0) {
                indexName.forEach((item) =>{
                    this.$refs['mast'+ item][0].$el.classList.add('redBorder')
                })
            }
            var str = "";
            for(let i=0; i<index.length; i++){
                str += (index[i]+1)+",";
            }
            str = str.substring(0,str.length-1);
            var strName = "";
            for(let i=0; i<indexName.length; i++){
                strName += (indexName[i]+1)+",";
            }
            strName = strName.substring(0,strName.length-1);

            var next1 = true;
            var next2 = true;
            if(index.length>0) {
                this.$message.error(this.$t('m.messErrX1')+ (str) +this.$t('m.messErrX2'));
                next1 = false
                return
            }else {
                next1 = true
            }
            if(indexName.length>0) {
                this.$message.error(this.$t('m.messErrName1')+ (strName) +this.$t('m.messErrName2'));
                next2 = false
                return
            }else {
                next2 = true
            }

            if (next1 && next2){
                callback('ok')
            } else{
                return
                callback(null)
            }
        },
        // 删除测风塔
        removeMastElement (item, index){
            // console.log(item)
            if (!item.mast_id){ // 没ID就是未接口保存，前端删除即可
                this.mastList.splice(index, 1)
                if(this.mastList.length <= 0) {
                    this.$store.commit('calculateStatus', {
                        type: 'clearmast'
                    })
                    return
                };
                if (this.mastList.some((v)=>v.main_mast)) return; // 有主测风塔不用调修改接口
                this.mastList[0].main_mast = true // 设置主测风塔
                this.onSetMastMain(this.mastList[0], (res)=>{  
                    this.getMastStatus()
                    this.$store.commit('refreshWindLayer')
                })
                
            }else{ // 有id 接口删除
                this.onRemoveMast(item, index)
            }
            
        },
        // 修改主测风塔
        onSetMastMain (item, callback){
            if (!item.mast_id){
                callback(null)
                return
            }
            
            putMastMain(this.projectInfo.project_id, item.mast_id).then((res)=>{
                if(res.code != 201){
                    this.$message.error(res.message)
                    callback(null)
                    return
                }
                this.$message.success(res.message)
                callback('ok')
            }).catch((err)=>{
                callback(null)
            })
            
        },
        onClickUpload (type){
            if(this.mastList.some((item, index)=> item.tim_progress_width > 0)){
                this.$message.info('有文件正在上传中，请稍候再添加！')
                return
            }
            // 新增一个测风塔
            if(type == 24){
                this.mastList.unshift({
                    main_mast: false,
                    mast_id: '',
                    mast_name: '',
                    coordinate_x: '',
                    coordinate_y: '',
                    mast_height: '',
                    mast_file_tim: '',
                    mast_file_txt: '',
                    goldlab_id: '',
                    goldlab_id: '',
                    tim_uploading: false,
                    txt_uploading: false,
                    tim_progress_width: 0,
                    txt_progress_width: 0,
                    show: true
                })
                
                if(this.mastList.every((item, index)=> !item.main_mast)){
                    this.mastList[0].main_mast = true
                }
            }
            // 中尺度.csv
            if (type == 21){
                this.$refs.csvUpload.click()
            }
        },
        // 上传 中尺度
        beforeCSVUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'txt', 'csv')
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpCSVRequest (options){
            this.csv_uploading = true
            let that = this
            let data = new FormData()
            let fileName = options.file.name
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 9999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        let progress = (progressEvent.loaded / progressEvent.total * 100 | 0)
                        that.mast_csv_width = progress
                    }
                }
            }
            data.append('long_term_mesoscale_file', options.file)

            postMastCsv(this.projectInfo.project_id, data, config).then((res)=>{
                this.mast_csv_width = 0
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.fileName_csv = fileName
                this.$message.success(res.message)
                // this.getMastStatus()
                this.windSetSchemeMemuCSV()
            }).catch((err)=>{
                this.mast_csv_width = 0
            })

        },
        // 导入测风塔
        beforeReadMastUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'txt', 'xyh')
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpReadMastRequest (options){
            let that = this
            let data = new FormData()
            let fileName = options.file.name
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999
            }
            data.append('mast_info_file', options.file)
            this.waitingMinute = true
            
            readMastInfoFile(data, config).then((res)=>{
                this.waitingMinute = false
                if (res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.mastList = res.data.map((item, index)=>{
                    return{
                        main_mast: false,
                        mast_id: '',
                        mast_name: item.mast_name,
                        coordinate_x: item.coordinate_x,
                        coordinate_y: item.coordinate_y,
                        mast_height: item.height,
                        mast_file_tim: item.mast_file_tim || '',
                        mast_file_txt: item.mast_file_txt || '',
                        goldlab_id: item.goldlab_id || '',
                        tim_uploading: false,
                        txt_uploading: false,
                        tim_progress_width: 0,
                        txt_progress_width: 0,
                        show: true
                    }
                })
                this.mastList[0].main_mast = true
                
            })
        },
        postMastData (){
            let data = {
                project_id: this.projectInfo.project_id,
                mast_info: this.mastList
            }
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            this.waitingMinute = true
            postMastJson(data, config).then((res)=>{
                this.waitingMinute = false
                if(res.code != 201){
                    this.$message.error(res.message)
                    return
                }
                this.$message.success(res.message)
                this.windSetSchemeMemu()
                this.onMastCalculate()
                this.$store.commit('refreshMastLayer')
            })
        },
        onMastCalculate (){
            // postMastCalculate(this.projectInfo.project_id).then((res)=>{
            //     if(res.code != 200){
            //         this.$message.error(res.message)
            //         return
            //     }
            //     this.$message.success(res.message)
            //     this.getMastStatus()
            // })
        },
        
    }
}
</script>
<style lang="scss" scoped>
.upload-mast{
    width: 3.86rem;
    background:rgba(255,255,255,1);
    border-radius: 0.18rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title{
        margin: 0.05rem 0 0.05rem 0;
        width: 3.04rem;
        height: 0.45rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .span1, .span2{
            cursor: pointer;
            display: inline-block;
            text-align: center;
            line-height: 0.29rem;
            width: 0.29rem;
            height: 0.29rem;
            border-radius: 0.09rem;
            background:rgba(232,247,236,1);
        }
        .span1:hover{
            background:rgba(219,236,224,1);
        }
        .span2{
            background:rgba(235,244,255,1);
        }
        .span2:hover{
            background:rgba(217,229,243,1);
        }
        .span3{
            cursor: pointer;
            display: inline-block;
            text-align: center;
            line-height: 0.31rem;
            width: 0.56rem;
            height: 0.31rem;
            background:rgba(44,208,185, 0.8);
            color: #fff;
            border-radius: 0.11rem;
            .iconfont{
                font-size: 0.18rem;
            }
        }
        .span3:hover{
            background:rgba(44,208,185, 1);
        }
        .span4{
            cursor: pointer;
            display: inline-block;
            padding: 0.06rem 0.1rem;
            background:rgba(44,208,185, 0.8);
            color: #fff;
            font-size: 0.13rem;
            border-radius: 0.11rem;
        }
    }
    .mastContent{
        overflow: auto;
        width: 100%;
        &>div{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .content{
            height: calc(100vh - 5.4rem);
            overflow: auto;
        }
    }
    .redBorder{
        border: 1px solid #F56C6C;
    }
}
</style>