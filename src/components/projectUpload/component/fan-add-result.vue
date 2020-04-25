<template>
    <el-dialog
        :title="$t('m.fanAddResultnew')"
        :visible.sync="dialogVisible"
        width="70%"
        :close-on-click-modal="false"
        custom-class="fan-add-result"
        :before-close="handleClose">
        <div class="title">
            <el-form ref="titleform" :model="titleform" label-width="100px" >
                <el-form-item :label="$t('m.fanSchemeName')" prop="name"
                :rules="{validator: validateSchemeName, trigger: 'blur'}">
                    <el-input v-model="titleform.name" ></el-input>
                    
                </el-form-item>
                <el-form-item :label="$t('m.fanReduction')" prop="number"
                :rules="{validator: validateNull, trigger: 'blur'}">
                    <el-input v-model="titleform.number" type="number" class="ipt"></el-input>
                    
                </el-form-item>
            </el-form>
            <div class="btn">
                <div :class="activeBtn ? 'activeBtn' :''" @click="onChangeTab">{{$t('m.configurationScheme')}}</div>
                <div :class="!activeBtn ? 'activeBtn' :''" :style="!nonePass ? 'border: 1px solid red;' : ''"
                @click="activeBtn = false">{{$t('m.designingScheme')}}</div>
            </div>
        </div>

        <div class="content" v-show="activeBtn">
            <div class="header">
                <div>
                    <el-tooltip class="item" 
                    effect="light"
                    :content="checkedLayerTip"
                    :disabled="!checkedLayerTip"
                    :visible-arrow="false"
                    placement="top">
                        <el-checkbox v-model="checkedLayer" :disabled="!checkedLayer" :class="{disableClass: !checkedLayer}">{{$t('m.NoiseCalculation')}}</el-checkbox>
                    </el-tooltip>
                </div>
                <div class="btn">
                    <el-tooltip class="item" 
                    effect="light"
                    :content="$t('m.batchPut')"
                    :visible-arrow="false"
                    placement="top">
                        <span @click="handleClick('batchPut')" :class="changeJiweiArr.length <= 0 ? 'disablebatchPut' : ''"><i class="iconfont icon-yingyong"></i></span>
                    </el-tooltip>

                    <el-tooltip class="item" 
                    effect="light"
                    :content="$t('m.ImportTemplate')"
                    :visible-arrow="false"
                    placement="top">
                        <span @click="handleClick('import')"><i class="iconfont icon-daoru1"></i></span>
                    </el-tooltip>
                    <el-tooltip class="item" 
                    effect="light"
                    :content="$t('m.DownloadTemplate')"
                    :visible-arrow="false"
                    placement="top">
                        <span @click="handleClick('download')"><i class="iconfont icon-xiazaijiangyiicon"></i></span>
                    </el-tooltip>
                    
                    <!-- <el-tooltip class="item" 
                    effect="light"
                    content="新增一行点位"
                    :visible-arrow="false"
                    placement="top">
                        <span @click="handleClick('add')"><i class="iconfont icon-add"></i></span>
                    </el-tooltip> -->
                </div>
            </div>
            <!-- 表格内容 -->
            <el-form  v-show="achievement" :model="formData" ref="formDataResult" :show-message="false">
                <!-- <div class="numberLength">({{tableData.length}}台)</div> -->
                <!-- <el-table :data="formData.list" ref="tabelResult" max-height="380" :header-cell-class-name="must"> -->
                <!-- :data="formData.list.slice((currentPage-1) * pageSize, currentPage * pageSize)"这方法全选会失效 -->
                <el-table :data="formData.list" ref="tabelResult" 

                :header-cell-class-name="must" 
                @selection-change="handleSelectionChange">
                    <el-table-column type="selection" header-align="center" width="50" align="center" fixed>

                    </el-table-column>
                    <el-table-column header-align="center" width="80" align="center" fixed>
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="light" content="设置备选点" placement="top">
                                <div @click="scope.row.checked = !scope.row.checked" :class="scope.row.checked ? 'checkFengji checkFengjiCheck' : 'checkFengji'"><i class="iconfont icon-fengji"></i></div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.number')" header-align="center" align="center" fixed>
                        <template slot-scope="scope">
                            <el-form-item  >
                                <!-- <span>{{scope.$index+1}}</span> -->
                                <span>{{scope.row.id}}</span>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    
                    
                    <el-table-column :label="$t('m.WTGNum')" width="100">
                        <template slot-scope="scope">
                            <el-form-item  :prop="'list.'+scope.$index+'.turbine_name'" 
                            :rules="{validator: validateTurbineName, trigger: 'blur'}">
                                <!-- <el-tooltip class="item" 
                                    effect="light"
                                    :content="validate_turbine_name_value"
                                    :disabled="!validate_turbine_name_value"
                                    :visible-arrow="false"
                                    placement="top"> -->
                                    <el-input v-model="scope.row.turbine_name" readonly class="readonly"
                                        @blur="onBlur('turbine_name', scope.row.turbine_name)"  
                                        @focus="onBlur('turbine_name', scope.row.turbine_name)"></el-input>
                                <!-- </el-tooltip> -->
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.WTGModel')" width="160">
                        <template slot-scope="scope">
                            <el-form-item  :prop="'list.'+scope.$index+'.turbine_type'" class="myFormItem"
                            :rules="{validator: validateType, trigger: 'blur'}">
                                <el-select v-model="scope.row.turbine_type" 
                                @visible-change="((value)=>{visibleChange( value, scope.row.turbine_type, scope.$index )})"
                                @change="changeSelect" class="mySelect">
                                    <el-option
                                      v-for="(item) of typeOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.coordinateX')" width="140">
                        <template slot-scope="scope">
                            <el-form-item  :prop="'list.'+scope.$index+'.coordinate_x'" 
                            :rules="{validator: validateX, trigger: 'blur'}">
                                <el-input v-model="scope.row.coordinate_x" type='number'></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.coordinateY')" width="140">
                        <template slot-scope="scope">
                            <el-form-item  :prop="'list.'+scope.$index+'.coordinate_y'" 
                            :rules="{validator: validateY, trigger: 'blur'}">
                                <el-input v-model="scope.row.coordinate_y" type='number'></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.longitude')" width="140">
                        <template slot-scope="scope">
                            <el-form-item  :prop="'list.'+scope.$index+'.longitude'" 
                            :rules="{validator: validateLon, trigger: 'blur'}">
                                <el-input v-model="scope.row.longitude" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.latitude')" width="140">
                        <template slot-scope="scope">
                            <el-form-item  :prop="'list.'+scope.$index+'.latitude'" 
                            :rules="{validator: validateLat, trigger: 'blur'}">
                                <el-input v-model="scope.row.latitude" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>


                    <el-table-column :label="$t('m.elevation')" >
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.elevation" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.hubHeight2')" width="120">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.height" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.weibullparameterA')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.at" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.weibullparameterK')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.kt" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.Energydensity')" width="190">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.energy_density" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.Powergeneration')" width="180">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.gross_yield" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.PowergenerationThink')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.array_yield" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.capacityCoefficient')" width="100">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.capacity_coff" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.MeanWindSpeed')" width="160">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.free_speed" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.strongWindConditions')" width="160">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.representative_ambiance" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.intensityStrongWindConditions')" width="160">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.representative_wake_added" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.consideringWakeEffect')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.waked_speed" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.AverageReductionRate')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.speed_discount" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.Airdensity')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.air_density" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.MeanWindshearIndex')" width="150">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.average_shear" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.MaximumWindShearIndex')" width="150">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.max_shear" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.degMaximumWindShearIndex')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.max_shear_section" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.AbsoluteMeanAngle')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.average_inc" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.MaximumInletAngle')" width="150">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.max_inc" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.WindSectorMaximum')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.max_inclination_sector" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.adjacentFanLabel')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.nearest_turbine_name" readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.distanceAdjacent')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.distance_to_nearest_turbine" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.ImpellerDiameter')" width="140">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.drotor" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.impellerDiameterD')" width="190">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.nearest_turbine_drotor" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.AzimuthAdjacent')" width="170">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.angle_to_nearest_turbine" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('m.NumberSectors')" width="140">
                        <template slot-scope="scope">
                            <el-form-item  >
                                <el-input v-model="scope.row.number_of_sections" type='number' readonly class="readonly"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>


                    <el-table-column :label="$t('m.operation')" width="60" fixed='right'>
                        <template slot-scope="scope">
                            <div @click="removeRow(scope.row, scope.$index)" class="button"><i class="iconfont icon-remove"></i></div>
                        </template>
                    </el-table-column>
                    
                </el-table>
            </el-form>


             <div v-show="!achievement">
                已有点位表格

             要有： 全选， 数量， 机型，投影坐标X，投影坐标Y， 高度  （全部必选）
             批量修改机型，调上面表格里面的方法
             数据格式 第1365行

             /scheme/power_generation_read
             这接口等佳丽改成支持两个文件导入，然后返回字段会加一个我们用来判断用哪个表格，赋值给 achievement
            </div>

            <el-pagination 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" 
                :current-page.sync="currentPage" 
                :page-size="pageSize" 　　　　
                layout="total, prev, pager, next,jumper" 
                :total="tableData.length"></el-pagination>
        </div>

        <div class="content2" v-show="!activeBtn">
            <div class="header2">
                <div class="header_title">
                    <div><el-checkbox v-model="checked_station">{{$t('m.BoosterStationDesign')}}</el-checkbox></div>
                    
                    <div v-if="checked_station">
                        <el-radio v-model="auto_station" label="1">{{$t('m.AutomaticStationLocation')}}</el-radio>
                        <el-radio v-model="auto_station" label="2" class="radio2">{{$t('m.AutomaticStationAvailable')}}</el-radio>
                    </div>
                </div>
                <div class="header_content" v-if="checked_station && auto_station == 2">
                    <div style="width:3.5rem"></div>
                    <div>
                        <el-form ref="stationForms" :model="stationForm" :inline="true" style="margin: 0.1rem 0 0 0">
                            <el-form-item label="X:" prop="lon"
                            :rules="{validator: validateCoordinateX, trigger: 'blur'}">
                                <el-input v-model="stationForm.lon" :placeholder="$t('m.coordinateX')" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="Y:" class="latItem"  prop="lat"
                            :rules="{validator: validateCoordinateY, trigger: 'blur'}">
                                <el-input v-model="stationForm.lat" :placeholder="$t('m.coordinateY')" type="number"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>

            <div class="header2">
                <div class="header_title">
                    <div><el-checkbox v-model="checked_line" :disabled="zip_progress_width>0 || disable_checked_line">{{$t('m.CollectorCircuitDesign')}}</el-checkbox></div>
                    
                    <div v-if="checked_line">
                        <el-radio v-model="auto_line" label="1" :disabled="zip_progress_width>0">{{$t('m.AutomaticPileDesign')}}</el-radio>
                        <el-radio v-model="auto_line" label="2">{{$t('m.ImportZipFile')}}</el-radio>
                    </div>
                </div>
                <div class="header_content" v-if="checked_line && auto_line == 2">
                    <div style="width:3.5rem"></div>
                    <div class="import_line">
                        <upload-button :type="42"  :fileName="fileName_zip" :class="zip_uploading? 'uploading' :''" :style="!nonePass && !fileName_zip? 'border:1px solid red':''"
                        :width="zip_progress_width"
                        @removeFile="onRemoveFile"
                        @clickUpload="onClickUpload"></upload-button>
                        <div class="nameTitle" v-if="zip_progress_width > 0"> 
                            <span class="ellipsis">{{fileName_zip_progress}}</span> 
                            <span>{{zip_progress_width}} %</span> </div>
                    </div>
                </div>
            </div>

            <div class="header2">
                <div class="header_title">
                    <div><el-checkbox v-model="checked_road" :disabled="dxf_progress_width>0">{{$t('m.InteriorRoadDesign')}}</el-checkbox></div>
                    
                    <div v-if="checked_road">
                        <el-radio v-model="auto_road" label="1" :disabled="dxf_progress_width>0">{{$t('m.AutomaticPileDesign')}}</el-radio>
                        <el-radio v-model="auto_road" label="2">{{$t('m.ImportDXFFile')}}</el-radio>
                    </div>
                </div>
                <div class="header_content" v-if="checked_road && auto_road == 1">
                    <el-form :model="roadForm" label-width="90px" label-position="left" style="margin: 0.2rem 0 0 3.5rem;">
                        <el-form-item :label="$t('m.roadWidth')">
                            <el-input v-model="roadForm.width" readonly></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('m.maximumGradient')">
                            <el-input v-model="roadForm.height" readonly></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('m.radiusCircle')">
                            <el-input v-model="roadForm.radius" readonly></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="header_content" v-if="checked_road && auto_road == 2">
                    <div style="width:3.5rem"></div>
                    <div class="import_line">
                        <upload-button :type="41" :fileName="fileName_dxf" :class="dxf_uploading? 'uploading' :''" :style="!nonePass && !fileName_dxf? 'border:1px solid red':''"
                        :width="dxf_progress_width"
                        @removeFile="onRemoveFile"
                        @clickUpload="onClickUpload"></upload-button>
                        <div class="nameTitle" v-if="dxf_progress_width > 0"> 
                            <span class="ellipsis">{{fileName_dxf_progress}}</span> 
                            <span>{{dxf_progress_width}} %</span> </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div @click="onSubmit" class="button1">{{$t('m.confirm')}}</div>
        </div>


        <el-upload  action="/"  class="defaultUpload" accept=".xlsx,.xls"
            :before-upload="beforeFanUpload"
            :http-request="httpFanRequest">
            <button ref="importUpload"></button>
        </el-upload>
        <el-upload  action="/"  class="defaultUpload" accept=".dxf"
            :before-upload="beforeDXFUpload"
            :http-request="httpDXFRequest">
            <button ref="dxfUpload"></button>
        </el-upload>
        <el-upload  action="/"  class="defaultUpload" accept=".zip"
            :before-upload="beforeZIPUpload"
            :http-request="httpZIPRequest">
            <button ref="zipUpload"></button>
        </el-upload>


        <!-- //自定义机型 -->
        <type-dialog :turbineOptions="typeOptions" @restoreType="restoreType" @changeType="changeType" ref="typeDialog"></type-dialog>
        <!-- 批量修改机型 -->
        <type-batch-put :turbineOptions="typeOptions" 
        @submitBatchForm="submitBatchForm"
        @openTypeCustom="openTypeCustom" ref="typeBatchPut"></type-batch-put>
         
    </el-dialog>
</template>
<script>
 import typeDialog from './type-custom.vue';
 import typeBatchPut from './type-batch-put.vue';
import uploadButton from "./upload-button.vue"
import { downTemplate } from "@/utils/download"
import { verifyFileNameCheck, validateLat, validateLon, validateSchemeName, verifyFileNameLength, verifyFileName, validateTurbineName, validateWGS84X, validateWGS84Y, valUTMX, validateCoordinateX, validateCoordinateY, validateType, validateElevation, validateHeight, validateNull } from "@/utils/validate"
import { mapState } from "vuex";
import { getDiscount, turbineTypePost, postStationlonLat, skipNoise, skipNoiseInit, chooseCalculation, postDxfFile, removeDxfFile, postZipFile, removeZipFile, removeSchemeid, chooseScheme, calculationNoise, checkNoise, postFanCapacity, postTurbineSave, getTypeData } from "@/api/server.request.js"
export default {
    name: 'fan-add-result',
    props:{
      
    },
    components:{
        uploadButton,
        typeDialog,
        typeBatchPut
    },
    data (){
        return{
            waitingClose: false,
            validateTurbineName: validateTurbineName,
            validateLon: validateLon,
            validateLat: validateLat,
            validateCoordinateX: validateCoordinateX,
            validateCoordinateY: validateCoordinateY,
            validateType: validateType,
            validateElevation: validateElevation,
            validateHeight: validateHeight,
            validateNull: validateNull,
            validateSchemeName: validateSchemeName,
            waitingMinute: false,
            dialogVisible: false,
            typeOptions:[], //机型
            titleform:{
                name: '新增方案',
                number: ''
            },
            activeBtn: true,

            checked_station: true,
            auto_station: '1',
            checked_line: true,
            auto_line: '1',
            checked_road: true,
            auto_road: '1',
            stationForm:{
                lon: '',
                lat:''
            },
            roadForm:{
                width: 6,
                height: 15,
                radius: 40
            },
            checkedLayer: true,
            checkedLayerTip: null, // 显示用
            checkedLayerTipMessage: null, // 传后端用
            formData:{
                list:[] // 展示数据
            },
            validate_turbine_name_value: '',
            dxf_progress_width: 0,
            zip_progress_width: 0,
            fileName_dxf: null,
            fileName_zip: null,
            dxf_uploading: false,
            zip_uploading: false,
            fileName_dxf_progress: null,
            fileName_zip_progress: null,
            nonePass: true, //设计方案的验证
            oldTurbineType: null,
            nowTurbineIds: 0,
            multipleSelection: [],
            waitingMinuteNoise: false,
            waitingScroll: false,
            tableData: [], // 完整数据
            num: 10,
            dom: null,
            changeJiweiArr: [], // 选中的数据
            disable_checked_line: false, // 是否禁用线路选择
            pageSize: 10,
            currentPage: 1,
            achievement: true // true发电量表格，false已有点位
        }
    },
    computed:{
        ...mapState({
            verifiEpsgModel: state => state.app.verifiEpsgModel,
            projectInfo: state => state.app.projectInfo,
            userInfo: state => state.user.userInfo,
            fanAddVisible: state => state.projectUpload.fanAddVisible,
        }),
        validateX (){
            if (this.verifiEpsgModel == 1){
                return validateWGS84X;
            } else if (this.verifiEpsgModel == 2){
                return valUTMX;
            } else{
                return validateCoordinateX;
            }
        },
        validateY (){
            if (this.verifiEpsgModel == 1){
                return validateWGS84Y;
            } else if (this.verifiEpsgModel == 2){
                return validateCoordinateY;
            } else{
                return validateCoordinateY;
            }
        }
    },
    watch:{
        waitingMinute () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.uploading')});
        },
        waitingMinuteNoise () {
            this.$store.dispatch('handleLoading', {loading: this.waitingMinuteNoise, text: '验证机型中，请稍候...'});
        },
        waitingScroll () {
            this.$store.dispatch('handleLoading', {loading: this.waitingScroll, text: '数据加载中，请稍候...'});
        },
        waitingClose () {
            this.$store.dispatch('handleLoading', {loading: this.waitingClose, text: '正在关闭，请稍候...'});
        },
        fanAddVisible (val){
            if(val && val.type == 'result'){
                this.dialogVisible = true
                this.init()
                
            }else{
                this.dialogVisible = false
            }
        },
        auto_station(val){
            if(val == '1'){
                this.stationForm = {
                    lon: '',
                    lat:''
                }
            }
        },
        checked_station(val){
            if(!val){
                this.stationForm = {
                    lon: '',
                    lat:''
                }
                this.checked_line = false
                this.disable_checked_line = true
            }else{
                this.disable_checked_line = false
            }
        }
    },
    mounted (){
       
    },
    beforeDestroy (){
        // this.dom && this.dom.removeEventListener('scroll', () => {})
    },
    methods:{
        handleSizeChange (val){
            console.log(val)
        },
        // 切换页数
        handleCurrentChange (val){
            console.log(val)
            // .slice((currentPage-1) * pageSize, currentPage * pageSize)
            let arr = this.tableData.slice((val-1) * this.pageSize, val * this.pageSize)
            this.formData.list = arr

            // console.log(this.tableData)
        },
        domScroll (callback){
            // this.dom = this.$refs.tabelResult.bodyWrapper
            // this.dom.addEventListener('scroll', () => {
            //     // 滚动距离
            //     let scrollTop = this.dom.scrollTop
            //     // 变量windowHeight是可视区的高度
            //     let windowHeight = this.dom.clientHeight || this.dom.clientHeight
            //     // 变量scrollHeight是滚动条的总高度
            //     let scrollHeight = this.dom.scrollHeight || this.dom.scrollHeight
            //     console.log(scrollTop , windowHeight , scrollHeight)
            //     if (scrollTop + windowHeight == scrollHeight) {
            //         callback('ok')
            //     }else{
            //         callback(null)
            //     }
            // })
        },
        //选择前存储当前机型和下标,自定义机型取消用来还原
        visibleChange(isTrue, value, index){
            // console.log(value,index)
            if(isTrue){
                this.oldTurbineType = value
                this.nowTurbineIds = index
            }
        },
        // 自定义机型-还原
        restoreType(isTrue, optimize, isbatchPut){
            // console.log(isTrue, optimize)
            if (isbatchPut) {
                return
            }
            let that = this
            this.formData.list[that.nowTurbineIds].turbine_type = that.oldTurbineType
            this.tableData[that.nowTurbineIds].turbine_type = that.oldTurbineType
        },
        // 自定义机型-确定
        changeType(value, optimize , typeHeight, isbatchPut, height){
            let that = this
            if (isbatchPut) { // 批量修改自定义
                console.log('批量修改自定义', value, optimize , typeHeight, isbatchPut, height)
                this.formData.list.forEach((item, index)=>{
                    if(this.changeJiweiArr.length < this.pageSize){
                        if(this.changeJiweiArr.includes(item.my_id)){
                            item.turbine_type = value
                            item.height = height
                        }
                    }else{
                        item.turbine_type = value
                        item.height = height
                    }
                })
                this.tableData.forEach((item, index)=>{
                    if(this.changeJiweiArr.length < this.pageSize){
                        if(this.changeJiweiArr.includes(item.my_id)){
                            item.turbine_type = value
                            item.height = height
                        }
                    }else{
                        item.turbine_type = value
                        item.height = height
                    }
                })
                this.onTurbineTypePost(value, typeHeight)
                this.checkNoiseImport(this.tableData)
                // console.log(this.tableData)
                return
            }
            console.log('当行自定义机型修改', value, optimize , typeHeight, isbatchPut, height)
            this.formData.list[that.nowTurbineIds].turbine_type = value
            this.tableData[that.nowTurbineIds].turbine_type = value
            this.onTurbineTypePost(value, typeHeight)
            this.checkNoiseImport(this.tableData)
        },
        onTurbineTypePost (value, height){
            if(!this.userInfo.user_id) return
            turbineTypePost({
                turbine_type: value,
                user_id: this.userInfo.user_id,
                turbine_height: height
            }).then((res)=>{
                if(res.code != 201){
                    this.$message.error(res.message)
                    return
                }
                this.typeOptions.unshift({
                    label: value,
                    value: value
                })
            })
        },
        // 批量修改  确定
        submitBatchForm (value){
            console.log(value)
            console.log(this.changeJiweiArr)
            
            this.formData.list.forEach((item, index)=>{
                if(this.changeJiweiArr.length < this.pageSize){
                    if(this.changeJiweiArr.includes(item.my_id)){
                        item.turbine_type = value.turbine_type
                        item.height = value.height
                    }
                }else{
                    item.turbine_type = value.turbine_type
                    item.height = value.height
                }
            })
            this.tableData.forEach((item, index)=>{
                if(this.changeJiweiArr.length < this.pageSize){
                    if(this.changeJiweiArr.includes(item.my_id)){
                        item.turbine_type = value.turbine_type
                        item.height = value.height
                    }
                }else{
                    item.turbine_type = value.turbine_type
                    item.height = value.height
                }
            })
            
            this.checkNoiseImport(this.tableData)
            // console.log(this.tableData)
        },
        // 批量自定义修改界面
        openTypeCustom (height){
            this.$refs.typeDialog.open(false, 'batchPut', height) 
        },
        changeSelect (value){
            // console.log(value)
            if(value == '自定义机型'){
                this.$refs.typeDialog.open(false)
                return
            }
            this.checkNoiseImport(this.tableData)
        },
        onChangeTab (){
            if (this.dxf_progress_width >0 || this.zip_progress_width >0){
                return
            }
            this.activeBtn = true
        },
        onRemoveFile (type){
            switch (type){
                case 41:
                removeDxfFile(this.projectInfo.project_id, this.fanAddVisible.id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    this.fileName_dxf = null
                    this.dxf_uploading = false
                })
                break;
                case 42:
                removeZipFile(this.projectInfo.project_id, this.fanAddVisible.id).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        return
                    }
                    this.$message.success(res.message)
                    this.fileName_zip = null
                    this.zip_uploading = false
                })
                break;
            }
        },
        onClickUpload (type){
            switch (type){
                case 41: // dxf
                this.$refs.dxfUpload.click()
                break;
                case 42: // zip
                this.$refs.zipUpload.click()
                break;
            }
        },
        // 上传dxf
        beforeDXFUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'dxf', 'dxf', true)
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpDXFRequest (options){
            let that = this
            let fileName = options.file.name
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        that.dxf_progress_width = (progressEvent.loaded / progressEvent.total * 100 | 0)-2
                    }
                }
            };
            data.append('road_dxf', options.file);
            data.append('project_id', this.projectInfo.project_id);
            data.append('scheme_id', this.fanAddVisible.id);
            this.dxf_uploading = true
            this.fileName_dxf_progress = fileName
            postDxfFile(data, config).then((res)=>{
                this.dxf_progress_width = 0
                this.fileName_dxf_progress = null

                if(res.code != 200){
                    this.$message.error(res.message)
                    this.dxf_uploading = false
                    return
                }
                this.$message.success(res.message)
                this.fileName_dxf = fileName
            }).catch((err)=>{
                this.dxf_progress_width = 0
                this.dxf_uploading = false
                this.fileName_dxf_progress = null
            })
        },
        // 上传zip
        beforeZIPUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'zip', 'zip', true)
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpZIPRequest (options){
            let that = this
            let fileName = options.file.name
            let data = new FormData();
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 999999999,
                onUploadProgress(progressEvent){
                    if (progressEvent.lengthComputable) {
                        that.zip_progress_width = (progressEvent.loaded / progressEvent.total * 100 | 0)
                    }
                }
            };
            data.append('line_file', options.file);
            data.append('project_id', this.projectInfo.project_id);
            data.append('scheme_id', this.fanAddVisible.id);
            this.zip_uploading = true
            this.fileName_zip_progress = fileName
            postZipFile(data, config).then((res)=>{
                this.zip_progress_width = 0
                this.fileName_zip_progress = null

                if(res.code != 200){
                    this.$message.error(res.message)
                    this.zip_uploading = false
                    return
                }
                this.$message.success(res.message)
                this.fileName_zip = fileName
            }).catch((err)=>{
                this.zip_progress_width = 0
                this.zip_uploading = false
                this.fileName_zip_progress = null
            })
        },

        removeScheme (project_id, scheme_id, callback){
            removeSchemeid(project_id, scheme_id).then((res)=>{
                if(res.code != 204){
                    this.$message.error(res.message)
                    callback(null)
                    return
                }
                callback('ok')
            }).catch((err)=>{
                callback(null)
            })
        },
        init (){
            this.activeBtn = true
            this.checked_station = true
            this.auto_station = '1'
            this.checked_line = true
            this.auto_line = '1'
            this.checked_road = true
            this.auto_road = '1'
            this.stationForm = {
                lon: '',
                lat:''
            }
            getDiscount(this.projectInfo.project_id).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.titleform.number = res.data.discount
            })

            if(!this.userInfo.user_id) return
            getTypeData(this.userInfo.user_id).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                this.typeOptions = res.data.items.map((item, index)=>{
                    return{
                        label: item,
                        value: item
                    }
                })
                // console.log(this.typeOptions)
                this.typeOptions.push({
                    label: '自定义机型',
                    value: '自定义机型'
                })
            })
        },
        onBlur(type, value){
            // console.log(type, value)
            let that = this
            switch (type){
                case 'turbine_name':
                    if (!value){
                        this.validate_turbine_name_value = this.$t('m.validateTurbineNameNone')
                    }
                    else {
                        this.validate_turbine_name_value = '';
                    }
                break;
            }
        },
        handleClose (done){
            if (this.dxf_progress_width >0 || this.zip_progress_width >0){
                return
            }
            this.waitingClose = true
            this.removeScheme(this.projectInfo.project_id, this.fanAddVisible.id, (res)=>{
                this.waitingClose = false
                if(!res) null
                this.close()
                done()
            })
        },
        close (){
            
            this.formData.list = []
            this.tableData = []
            this.titleform = {
                name: '新增方案',
                number: ''
            }
            this.$refs.formDataResult.clearValidate()
            this.$refs.titleform.clearValidate()
            this.$store.commit('fanAddVisible', null)
        },
        handleClick (type){
            switch (type){
                case 'import':
                this.$refs.importUpload.click()
                break;
                case 'download':
                this.downloadTemplate()
                break;
                case 'add':
                    // this.formData.list.push(this.initFanObj())
                break;
                case 'batchPut': 
                    this.$refs.typeBatchPut.open(this.formData.list[0])
                break;
            }
        },
        
        removeRow (row, index){
            // console.log(row, index)
            this.formData.list.splice(index, 1)
            this.tableData.splice(index, 1)
            this.num = this.num -1

            // 删除后调机型验证
            this.checkNoiseImport(this.tableData)
        },
        downloadTemplate (){
            downTemplate("/project/output_template", {
                args: 'pg'
            })
            downTemplate("/project/output_template", {
                args: 'wt'
            })
        },
        // 提交保存
        onSubmit (){
            // console.log(this.tableData)
            if (this.dxf_progress_width >0 || this.zip_progress_width >0){
                return
            }
            if(this.tableData.length <= 0){
                this.$message.error('排布方案点位数据不能为空！')
                return
            }
            let flag1 = true
            let flag2 = true
            let flag3 = true
            let flag4 = true
            let flag5 = true
            this.$refs.titleform.validate((valid) => {
                flag1 = valid
            })
            this.$refs.formDataResult.validate((valid) => {
                flag2 = valid
            })
            if(this.auto_station == 2){
                this.$refs.stationForms.validate((valid) => {
                    flag3 = valid
                })
            }
            if(this.auto_line == 2 && !this.fileName_zip){
                flag4 = false
            }else{
                flag4 = true
            }
            if(this.auto_road == 2 && !this.fileName_dxf){
                flag5 = false
            }else{
                flag5 = true
            }

            if(!flag3 || !flag4 || !flag5){
                this.$message.error(this.$t('m.nonePass'))
                this.nonePass = false
                return
            }else{
                this.nonePass = true
            }
            if(flag1 && flag2 && flag3){
                
                this.verifyMastRepetitionNew((res)=>{
                    if(res){
                        this.onCheckNoise()
                    }
                })
            }
            
        },
        // 查询机型是否能计算噪音
        onCheckNoise (){
            this.waitingMinute = true
            this.checkedLayerTip = null
            if(!this.checkedLayer) {
                this.onTurbineSave(false, (res)=>{
                    if(!res) {
                        this.waitingMinute = false
                        return
                    }
                    
                    this.onCalculate(res)
                })

            }else {
                var arr = []
                this.tableData.forEach((item, index)=>{
                    arr.push(item.turbine_type)
                })
                // console.log(arr)
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                checkNoise({
                    data: arr,
                    project_id: this.projectInfo.project_id
                }, config).then((res)=>{
                    if(res.code != 200){
                        this.checkedLayer = false
                        this.checkedLayerTip = res.message
                        this.checkedLayerTipMessage = res.message
                        this.waitingMinute = false
                        // this.$message.error(res.message)
                        return
                    }
                    if(res.data.toLowerCase() == 'true'){
                        this.checkedLayer = true
                        this.checkedLayerTip = null
                        this.onTurbineSave(true, (res)=>{
                            if(!res) {
                                this.waitingMinute = false
                                return
                            }
                            
                            this.onCalculate(res)
                        })
                    }else{
                        this.checkedLayer = false
                        this.checkedLayerTip = res.message
                        this.waitingMinute = false
                    }
                }).catch((err)=>{
                    this.waitingMinute = false
                })
            }
        },
        // 需要提交数据计算的接口
        onCalculate (res){
            
            if(!res.isNoise){
                // 工程计算接口
                let p1 = new Promise((resolve, reject) => {
                    chooseCalculation(this.projectInfo.project_id, this.fanAddVisible.id).then((res)=>{
                        if(res.code != 200){
                            this.$message.error(res.message)
                            reject(res.message)
                            return
                        }
                        resolve('ok')
                    })
                })
                let p2 = new Promise((resolve, reject) => {
                    // console.log(this.checkedLayerTipMessage)
                    // console.log(this.checkedLayer)
                    var messageTip = !this.checkedLayer ? this.checkedLayerTipMessage : null

                    skipNoise(this.projectInfo.project_id, this.fanAddVisible.id, messageTip).then((res)=>{
                        if(res.code != 200){
                            this.$message.error(res.message)
                            reject(res.message)
                            return
                        }
                        resolve('ok')
                    })
                })
                Promise.all([p1, p2]).then((res)=>{
                    this.$store.commit('refreshSchemeList')
                    setTimeout(()=>{
                        this.$message.success('开始计算')
                        this.waitingMinute = false
                        this.$store.commit('setScheme_id', this.fanAddVisible.id)
                        this.close()
                    },500)
                }).catch((err)=>{
                    this.waitingMinute = false
                })
                
                
            }else{
                // 调计算噪音
                let p1 = new Promise((resolve, reject) => {
                    calculationNoise(this.projectInfo.project_id, this.fanAddVisible.id).then((res)=>{
                        if(res.code != 200){
                            this.$message.error(res.message)
                            reject(res.message)
                            return
                        }
                        resolve('ok')
                    })
                })
                
                // 工程计算接口
                let p2 = new Promise((resolve, reject) => {
                    chooseCalculation(this.projectInfo.project_id, this.fanAddVisible.id).then((res)=>{
                        if(res.code != 200){
                            this.$message.error(res.message)
                            reject(res.message)
                            return
                        }
                        resolve('ok')
                    })
                })
                Promise.all([p1, p2]).then((res)=>{
                    this.$store.commit('refreshSchemeList')
                    setTimeout(()=>{
                        this.$message.success('开始计算')
                        this.waitingMinute = false
                        this.$store.commit('setScheme_id', this.fanAddVisible.id)
                        this.close()
                    },500)
                }).catch((err)=>{
                    this.waitingMinute = false
                })
            }
        },
        // 保存点位 保存工程设计
        onTurbineSave (isNoise, callback){
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            let data = {
                scheme_name: this.titleform.name,
                scheme_id: this.fanAddVisible.id,
                reduction_factor: this.titleform.number,
                turbine_data: this.tableData
            }
            let p1 = new Promise((resolve, reject) => {
                postTurbineSave(this.projectInfo.project_id, data, config).then((res)=>{
                    if(res.code != 201){
                        this.$message.error(res.message)
                        reject(res.message)
                        return
                    }
                    resolve('ok')
                    
                })
            })
            
            var data2 = {
                project_id: this.projectInfo.project_id,
                scheme_id: this.fanAddVisible.id,
                choose: {
                    auto_station: this.auto_station,
                    auto_line: this.auto_line,
                    auto_road: this.auto_road,
                    checked_line: this.checked_line,
                    checked_road: this.checked_road,
                    checked_station: this.checked_station
                }
            }
            var config2 = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            let p2 = new Promise((resolve, reject) => {
                chooseScheme(data2, config2).then((res)=>{
                    if(res.code != 201){
                        this.$message.error(res.message)
                        reject(res.message)
                        return
                    }
                    resolve('ok')
                })
            })
            // 升压站点位保存
            let p3 = new Promise((resolve, reject) => {
                postStationlonLat({
                    syz_x: this.stationForm.lon,
                    syz_y: this.stationForm.lat,
                    project_id: this.projectInfo.project_id,
                    scheme_id: this.fanAddVisible.id
                }).then((res)=>{
                    if(res.code != 200){
                        this.$message.error(res.message)
                        reject(res.message)
                        return
                    }
                    resolve('ok')
                })
            })
            Promise.all([p1, p2, p3]).then((res)=>{
                callback({
                    isNoise: isNoise,
                    data: 'ok'
                })
            }).catch((err)=>{
                callback(null)
            })
        },
        // 导入
        beforeFanUpload (file){
            let length = verifyFileNameLength(file, 200)
            let nameCheck = verifyFileNameCheck(file)
            let files = verifyFileName(file, 'xlsx', 'xls')
            if(length && files && nameCheck){
                return true
            }else{
                return false
            }
        },
        httpFanRequest (options){
            let fileName = options.file.name
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            let data = new FormData()
            data.append('power_generation_excel', options.file)
            this.waitingMinute = true
            postFanCapacity(data, config).then((res)=>{
                this.waitingMinute = false
                if(res.code != 200){
                    this.$message.error(res.message)
                    return
                }
                // console.log(res.data)
                let tableData = res.data
                tableData.forEach((item, index)=>{
                    item.my_id = Math.floor((Math.random()*100000000))
                    item.id = index + 1
                    item.checked = true
                })
                this.tableData = [...tableData]

                // if(res.data.length > 10){
                    // this.formData.list = tableData.slice(0, 10)  
                    // this.num = 10
                    // // 滚动加载
                    // this.domScroll((callback)=>{
                    //     if (!callback) return;  
                    //     // console.log(this.num)
                    //     let arr = tableData.slice(this.num, this.num + 5)  
                    //     this.formData.list = this.formData.list.concat(arr)
                    //     this.num += 5
                    // })
                // }else{
                    // this.formData.list = tableData
                // }
                // 分页加载
                if(res.data.length > this.pageSize){
                    this.formData.list = tableData.slice(0, this.pageSize)  
                    
                }else{
                    this.formData.list = tableData
                }

                if(this.tableData.length <= 0) return
                // this.handleCheckData(this.tableData)
                this.checkNoiseImport(this.tableData)
            }).catch((err)=>{
                this.waitingMinute = false
            })
        },
        // 设置key
        getRowKeys (row){
            // console.log(row)
            return row.my_id
        },
        // 选择
        handleSelectionChangeOne (val){
            console.log(val)
        },
        handleSelectionChangeAll (val){
            console.log(val)
        },
        // 选择
        handleSelectionChange (val){
            console.log(val)
            this.changeJiweiArr = val.map((item, index)=>item.my_id)
        },
        // 回显
        handleCheckData (tableData) {
            this.multipleSelection = tableData
            this.$nextTick(()=> {
                // tableData.forEach((item, index)=>{
                //     this.$refs.tabelResult.toggleRowSelection(item, true)
                // })
                this.$refs.tabelResult.toggleAllSelection()
            })
        },
        checkNoiseImport (list){
            this.checkedLayerTip = null
            var arr = []
            list.forEach((item, index)=>{
                arr.push(item.turbine_type)
            })
            let dataArr = Array.from(new Set(arr))
            console.log(dataArr)
            if (dataArr.length <= 0){
                return
            }
            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            this.waitingMinuteNoise = true
            checkNoise({
                data: dataArr,
                project_id: this.projectInfo.project_id
            }, config).then((res)=>{
                this.waitingMinuteNoise = false
                if(res.code != 200){
                    this.checkedLayer = false
                    this.checkedLayerTip = res.message
                    this.checkedLayerTipMessage = res.message
                    // this.$message.error(res.message)
                    return
                }
                if(res.data.toLowerCase() == 'true'){
                    this.checkedLayer = true
                    this.checkedLayerTip = null
                }else{
                    this.checkedLayer = false
                    this.checkedLayerTip = res.message
                }
            }).catch((err)=>{
                this.waitingMinuteNoise = false
            })
        },
        // *号
        must(obj) {
            // console.log(obj.columnIndex);
            if(obj.columnIndex == 2 || obj.columnIndex == 4 || obj.columnIndex == 5 || obj.columnIndex == 6 || obj.columnIndex == 7 || obj.columnIndex == 8) {
                return 'must';
            }
            // if (obj.columnIndex == 1){
            //     return 'titleName'
            // }
            if (obj.columnIndex == 0){
                return 'notCheck'
            }
        },
        verifyMastRepetitionNew (callback){
            var temp = [];
            var index = [];
            var tempName = [];
            var indexName = [];
            var tempLon = [];
            var indexLon = [];
            for(var i = 0; i < this.tableData.length; i++) {
                for(var j = i + 1; j < this.tableData.length; j++){
                    if (this.tableData[i].coordinate_x && this.tableData[i].coordinate_y 
                    &&(this.tableData[i].coordinate_x == this.tableData[j].coordinate_x)
                    &&(this.tableData[i].coordinate_y == this.tableData[j].coordinate_y)){
                        index.push(j)
                        i++;
                        j = i;
                    }
                    if (this.tableData[i].turbine_name == this.tableData[j].turbine_name){
                        indexName.push(j)
                        i++;
                        j = i;
                    }
                    if (this.tableData[i].longitude == this.tableData[j].longitude 
                    && this.tableData[i].latitude == this.tableData[j].latitude){
                        indexLon.push(j)
                        i++;
                        j = i;
                    }
                }
                temp.push(this.tableData[i]);
                tempName.push(this.tableData[i]);
                tempLon.push(this.tableData[i]);
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
            for(var i = 0 ; i < indexLon.length - 1; i ++){
                for(var j = 0 ; j < indexLon.length - i - 1; j ++){
                    if(indexLon[j] > indexLon[j + 1]){	
                        var ls3 = indexLon[j];
                        indexLon[j] = indexLon[j + 1];
                        indexLon[j + 1] = ls2;
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
            var strLon = "";
            for(let i=0; i<indexLon.length; i++){
                strLon += (indexLon[i]+1)+",";
            }
            strLon = strLon.substring(0,strLon.length-1);

            var next1 = true;
            var next2 = true;
            var next3 = true;
            if(index.length>0) {
                console.log(str)
                this.$message.error(this.$t('m.messErrX1')+ (str) +this.$t('m.messErrX2'));
                next1 = false
                return
            }else {
                next1 = true
            }
            if(indexName.length>0) {
                console.log(strName)
                this.$message.error(this.$t('m.messErrName1')+ (strName) +this.$t('m.messErrName3'));
                next2 = false
                return
            }else {
                next2 = true
            }
            if(indexLon.length>0) {
                console.log(strLon)
                this.$message.error(this.$t('m.messErrX1')+ (strLon) +this.$t('m.messErrX3'));
                next3 = false
                return
            }else {
                next3 = true
            }
            

            if (next1 && next2 && next3){
                callback('ok')
            } else{
                return
                callback(null)
            }
        },
        initFanObj (){
            return{
                turbine_name: '', // 风机编号
                turbine_type: '', // 机型
                coordinate_x: '', // 投影坐标X
                coordinate_y: '', // 投影坐标Y
                elevation: '', // 海拔
                height: '', // 轮毂高度
                longitude: '', // 经度
                latitude: '', // 纬度
                at: '', // 韦布尔参数A
                kt: '', // 韦布尔参数K
                energy_density: '', // 能量密度(瓦特/平方米)
                gross_yield: '', // 发电量(兆瓦小时/年)
                array_yield: '', // 考虑尾流效应的发电量(兆瓦小时/年)
                capacity_coff: '', // 容量系数
                free_speed: '', // 平均风速(米/秒)
                representative_ambiance: '', // 强风状态下的平均环境湍流强度
                representative_wake_added: '', // 强风状态下的平均总体湍流强度
                waked_speed: '', // 考虑尾流效应的平均风速（米/秒)
                speed_discount: '', // 尾流效应导致的平均折减率(%)
                air_density: '', // 该点的空气密度(千克/立方米)
                average_shear: '', // 平均风切变指数
                max_shear: '', // 最大风切变指数
                max_shear_section: '', // 最大风切变指数对应方向扇区(度)
                average_inc: '', // 绝对值平均入流角(度)
                max_inc: '', // 最大入流角(度)
                max_inclination_sector: '', // 出现最大入流角的风向扇区 (度)
                nearest_turbine_name: '', // 最近相邻风机的标签
                distance_to_nearest_turbine: '', // 相邻风机的最近距离(米)
                drotor: '', // 叶轮直径(米)
                nearest_turbine_drotor: '', // 以叶轮直径为单位的相邻风机最近距离(D)
                angle_to_nearest_turbine: '', // 最近相邻风机的方位角(度)
                number_of_sections: '', // 扇区数量
            }
        }

    }
}
</script>
<style lang="scss" scoped>
/deep/ .fan-add-result{
    margin-top: 5vh !important;
    .el-dialog__body{
        padding: 0.2rem 0.2rem 0.15rem 0.2rem;
    }
    .el-pagination{
        margin: 0.05rem;
    }
    .el-pagination__editor .el-input__inner, .el-pagination__editor div{
        padding: 0;
        height: 0.25rem;
        line-height: 0.25rem;
    }
    .el-table__empty-text{
        width: 100%;
        text-align: left;
        padding-left: 11.5%;
    }
    .cell .el-checkbox__original {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }
    table th.must div:before {
        content: '*';
        color: #ff1818;
    }
    table th.titleName div{
        padding: 0;
    }
    table th.titleName div:after {
        content: ' 主风机';
    }
    table tr td:nth-of-type(1), table tr td:nth-of-type(34){
        background: #fff;
    }
    .el-dialog__title{
        color:#000;
        font-weight: 500;
    }
    .title{
        display: -webkit-flex;
        justify-content: space-between;
        padding: 0 0.1rem 0 0;
        margin-bottom: 0.1rem;
        .el-form{
            display: -webkit-flex;
        }
        .el-input__inner{
            width: 1.57rem;
            background:rgba(235,242,228,1);
            border-radius: 0.07rem;
            border: none;
        }
        .ipt .el-input__inner{
            width: 1rem;
        }
        .el-form-item__content, .el-form-item, .el-form-item__label, .el-input, .el-input__inner{
            line-height: 0.26rem;
            height: 0.26rem;
        }
        .el-form-item__label{
            font-size: 0.15rem;
            padding: 0 0.1rem 0 0;
        }
        .btn{
            display: -webkit-flex;
            &>div{
                cursor: pointer;
                width: 1rem;
                height: 0.3rem;
                line-height: 0.3rem;
                text-align: center;
                border-radius: 0.11rem;
            }
            .activeBtn{
                background:rgba(255,255,255,1);
                box-shadow:0px 0px 8px 0px rgba(216,232,230,1);
                border-radius: 0.11rem;
                color: #2CD0B9;
            }
        }
    }
    .content{
        border:1px solid rgba(207,213,201,1);
        border-radius: 0.18rem;
        margin: 0.05rem 0.1rem 0.2rem 0.05rem;
        .el-input__inner{
            text-align: center;
        }
        .mySelect .el-input__inner{
            // text-align: left;
            padding-right: 0.1rem !important;
            border: 1px solid rgba(206,212,190,0.4) !important;
        }
        .header{
            padding: 0.1rem;
            font-size: 0.17rem;
            display: -webkit-flex;
            justify-content: space-between;
            .el-checkbox__label, .el-radio__label{
                color: #333;
            }
            .btn{
                span{
                    width: 0.25rem;
                    height: 0.25rem;
                    text-align: center;
                    line-height: 0.25rem;
                    cursor: pointer;
                    display: inline-block;
                    border-radius: 4px;
                }
                span:nth-of-type(1){
                    background:rgba(254,231,227,1);
                }
                span:nth-of-type(2){
                    background:rgba(235,244,255,1);
                }
                span:nth-of-type(3){
                    background:rgba(232,247,236,1);
                }
                .icon-daoru1{
                    color: #5A8ACE;
                    font-size: 0.175rem;
                }
                .icon-xiazaijiangyiicon{
                    color: #76C681;
                }
                .icon-add{
                    color: #2CD0B9;
                }
            }
        }
        .el-form{
            margin: 0 0.1rem;
            .el-input__inner{
                padding: 0 0 0 0.05rem;
                border: none;
            }
            .el-input__inner:focus{
                border: 1px solid;
            }
            .readonly .el-input__inner:focus{
                border: none !important;
            }
        }
        .el-table .el-form-item{
            margin-bottom: 0;
        }
        .el-table th, .el-table td{
            padding: 0.01rem 0;
        }
    }
    .content2{
        padding: 0.2rem;
        border:1px solid rgba(207,213,201,1);
        border-radius: 0.18rem;
        margin: 0.05rem 0.1rem 0.15rem 0.05rem;
        .el-checkbox__label, .el-radio__label{
            color: #333;
        }
        .el-form-item__content, .el-form-item__label{
            line-height: 0.3rem;
        }
        .el-radio, .el-form-item{
            width: 2.5rem;
            margin-right: 0;
        }
        .el-input__inner{
            border: none;
            background: #ced4be;
            height: 0.26rem;
            line-height: 0.26rem;
            background:rgba(235,242,228,1);
            border-radius: 0.04rem;
            width: 1.2rem;
            padding-left: 0.05rem;
        }
        .import_line{
            margin: 0.2rem 0 0 2.5rem;
        }
        .header_title{
            display: -webkit-flex;
            justify-content: flex-start;
            border-radius: 0.04rem 0.07rem 0.07rem 0.07rem;
            &>div:nth-of-type(1){
                width: 3.5rem;
                padding: 0 0 0 0.1rem;
                color: #5F482E;
            }
            &>div:nth-of-type(2){
                flex: 1;
            }
        }
        .header2{
            padding: 0.2rem 0.1rem 0.1rem 0.1rem;
        }
        .header2:hover{
            box-shadow:0px 0px 17px 0px rgba(216,232,230,1);
        }
        .header_content{
            display: -webkit-flex;
            
        }
    }
    .footer{
        display: -webkit-flex;
        justify-content: center;
        &>div{
            width: 1.45rem;
            height: 0.45rem;
            background:rgba(44,208,185,1);
            border-radius: 0.16rem;
            text-align:center;
            line-height: 0.45rem;
            color: #fff;
        }
    }
    .button{
        cursor: pointer;
    }
    .button1{
        cursor: pointer;
        font-size: 0.16rem;
    }
}
/deep/ .el-form-item__error{
    width: 300%;
    text-align: right;
}
.nameTitle{
    display: -webkit-flex;
    // justify-content: space-between;
    align-items: center;
    width: 3rem;
    height: 0.2rem;
    font-size: 0.11rem;
    &>span:nth-of-type(1){
        flex: 1;
    }
    &>span:nth-of-type(2){
        min-width: 35px;
    }
}
.redborder{
    border: 1px solid red;
}
.icon-yingyong{
    font-size: 0.2rem;
    position: relative;
    top: 1px;
    color: #FB5D3F;
}
.disablebatchPut{
    pointer-events: none;
    cursor: default;
    .icon-yingyong{
        color: #ccc;
    }
}
.el-form{
    position: relative;
}
.numberLength{
    width: 50px;
    text-align: center;
    position: absolute;
    left: 145px;
    top: 27px;
    color: bule;
    font-size: 11px;
    z-index: 9999;
}
/deep/ .disableClass .el-checkbox__label{
    color: #ccc !important;
}
.checkFengji{
    width: 25px;
    height: 25px;
    background:rgba(240,246,247,1);
    border-radius: 9px;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
    margin: 0 auto;
}
.checkFengjiCheck .iconfont{
    color: #2CD0B9;
}
</style>