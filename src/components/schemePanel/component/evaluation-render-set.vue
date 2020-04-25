<template>
  <div class="evaluation-render-set">
    <el-dialog
        :visible.sync="visible"
        width="12.2rem"
        top="5vh"
        :close-on-click-modal="false"
        :before-close="handleClose">
      <div slot="title">
        {{ schemeInfo && schemeInfo.scheme_name }}
        <i @click="visible = false" class="iconfont icon-fanhui"></i>
      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="8">
            <div class="grid-content label80">
              <div class="thead">{{ $t('m.projectParameters') }}</div>
              <el-form-item label="总容量" disabled>
                <el-input type="number" v-model="form.project_capacity"></el-input>
                <span class="unit">MW</span>
              </el-form-item>
              <el-form-item prop="province" label="所在区域">
                <el-select v-model="form.province">
                  <el-option v-for="item in options.province" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="distribut" label="是否分散式项目">
                <el-radio-group v-model="form.distribut">
                  <el-radio :label= 1 >是</el-radio>
                  <el-radio :label= 0 >否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.distribut!=0" prop="ten_switching" label="10kV开关站">
                <el-input type="number" v-model="form.ten_switching"></el-input>
                <span class="unit">座</span>
              </el-form-item>
              <el-form-item v-if="form.distribut!=0" prop="thirtyfive_switching" label="35kV开关站">
                <el-input type="number" v-model="form.thirtyfive_switching"></el-input>
                <span class="unit">座</span>
              </el-form-item>
              <el-form-item prop="terrain" label="地形">
                <el-select v-model="form.terrain">
                  <el-option v-for="item in options.terrain" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="irrType" label="投资基准" class="irrType">
                <el-radio-group v-model="form.irrType">
                  <el-radio v-for="item in options.irr_type" :key="item" :label="item"></el-radio>
                </el-radio-group>
                <div class="input-cont">
                  <el-input v-for="item in options.irr_type" :key="item" :class="item == form.irrType ? 'active' : ''" placeholder="请输入内容" v-model="form.irrValue"></el-input>
                </div>
              </el-form-item>
            </div>
            <div class="grid-content label180">
              <div class="thead">{{ $t('m.marketInformation') }}</div>
              <el-form-item class="form-group" label="电价参数"></el-form-item>
              <el-form-item prop="feedinTariffs" label="常规模式上网电价(含税)">
                <el-input type="number" v-model="form.feedinTariffs"></el-input>
                <span class="unit">元/kWh</span>
              </el-form-item>
              <el-form-item prop="power_limiting_rate" label="限电率">
                <el-input type="number" v-model="form.power_limiting_rate"></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="power_limiting_year" label="限电年数">
                <el-input type="number" v-model="form.power_limiting_year"></el-input>
                <span class="unit">年</span>
              </el-form-item>
              <el-form-item prop="market_year" label="市场交易年限">
                <el-input type="number" v-model="form.market_year"></el-input>
                <span class="unit">年</span>
              </el-form-item>
              <el-form-item prop="market_power_ratio" label="市场交易比例">
                <el-input type="number" v-model="form.market_power_ratio"></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="tradingPrice" label="市场交易电价">
                <el-input type="number" v-model="form.tradingPrice"></el-input>
                <span class="unit">元/kWh</span>
              </el-form-item>
              <el-form-item class="form-group" label="融资参数"></el-form-item>
              <el-form-item prop="financing_way" label="融资方式">
                <el-select v-model="form.financing_way">
                  <el-option v-for="item in options.financing_way" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="deadline" label="期限(含宽限期)">
                <el-input type="number" v-model="form.deadline"></el-input>
                <span class="unit">年</span>
              </el-form-item>
              <el-form-item prop="longtermFinancingGraceYears" label="宽限期限">
                <el-input type="number" v-model="form.longtermFinancingGraceYears"></el-input>
                <span class="unit">年</span>
              </el-form-item>
              <el-form-item prop="graceInterestRateWithTax" label="宽限期利率含税">
                <el-input type="number" v-model="form.graceInterestRateWithTax"></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="loanInterestRateWithTax" label="贷款期利率(含税)">
                <el-input type="number" v-model="form.loanInterestRateWithTax"></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="mode_repayment" label="还款方式">
                <el-select v-model="form.mode_repayment">
                  <el-option v-for="item in options.mode_repayment" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="interestTaxDeduction" label="利息税可抵扣">
                <el-radio-group v-model="form.interestTaxDeduction">
                  <el-radio :label=1>是</el-radio>
                  <el-radio :label=0>否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content label100">
              <div class="thead">{{ $t('m.planParameters') }}</div>
              <el-table ref="table" :data="tableData">
                <el-table-column label="机型" prop="name"></el-table-column>
                <el-table-column v-for="(param, index) in paramList" :key="param.pool" :label="param.pool">
                  <template slot-scope="scope">
                    <!--{{scope.row['pool' + index]}}-->
                      <el-input type="number" v-model.number="scope.row['pool' + index]"></el-input>
                  </template>
                  
                </el-table-column>
                <el-table-column prop="unit"></el-table-column>
              </el-table>
              <el-form-item prop="cut_hour" label="等效小时数">
                <el-input type="number" v-model="form.cut_hour"></el-input>
                <span class="unit">h</span>
              </el-form-item>
            </div>
            <div class="grid-content label80">
              <div class="thead">{{ $t('m.operationalParameters') }}</div>
              <el-form-item prop="operation" label="是否代维">
                <el-radio-group v-model="form.operation">
                  <el-radio :label=1>是</el-radio>
                  <el-radio :label=0>否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.operation!=0" prop="warrantyPeriod" label="质保期限">
                <el-input type="number" v-model="form.warrantyPeriod"></el-input>
                <span class="unit">年</span>
              </el-form-item>
              <el-form-item v-if="form.operation!=0" prop="warrantyFee" label="质保期费用">
                <el-input type="number" v-model="form.warrantyFee"></el-input>
                <span class="unit">元/KW</span>
              </el-form-item>
              <el-form-item v-if="form.operation!=0" prop="outWarrantyFee" label="质保外费用">
                <el-input type="number" v-model="form.outWarrantyFee"></el-input>
                <span class="unit">元/KW</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content label150">
              <div class="thead">{{ $t('m.budgetaryEstimateOfParameters') }}</div>
              <el-form-item class="form-group" label="工程信息"></el-form-item>
              <el-form-item prop="nbooster" label="是否新建升压站">
                <el-radio-group v-model="form.nbooster">
                  <el-radio :label=1 >是</el-radio>
                  <el-radio :label= 0 >否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="construction_time" label="工 期">
                <el-input type="number" v-model="form.construction_time"></el-input>
                <span class="unit">月</span>
              </el-form-item>
            </div>
            <div class="grid-content label150">
              <el-form-item class="form-group" label="价格信息"></el-form-item>
              <el-form-item prop="towerUnitPrice" label="钢塔单价">
                <el-input type="number" v-model="form.towerUnitPrice"></el-input>
                <span class="unit">元/t</span>
              </el-form-item>
              <el-form-item prop="anchor_price" label="锚栓单价">
                <el-input type="number" v-model="form.anchor_price"></el-input>
                <span class="unit">元/t</span>
              </el-form-item>
              <el-form-item prop="concreteCushionUnitPrice" label="垫层混凝土">
                <el-input type="number" v-model="form.concreteCushionUnitPrice"></el-input>
                <span class="unit">元/m³</span>
              </el-form-item>
              <el-form-item prop="base_reinforcement" label="基础混凝土">
                <el-input type="number" v-model="form.base_reinforcement"></el-input>
                <span class="unit">元/m³</span>
              </el-form-item>
              <el-form-item prop="foundation_concrete1" label="基础钢筋">
                <el-input type="number" v-model="form.foundation_concrete1"></el-input>
                <span class="unit">元/t</span>
              </el-form-item>
            </div>
            <div class="grid-content label150">
              <el-form-item class="form-group" label="基础工程"></el-form-item>
              <el-form-item prop="pit_road" label="场内道路长度">
                <el-input type="number" v-model="form.pit_road"></el-input>
                <span class="unit">km</span>
              </el-form-item>
              <el-form-item prop="innerRoadWidth" label="场内道路宽度">
                <el-input type="number" v-model="form.innerRoadWidth"></el-input>
                <span class="unit">km</span>
              </el-form-item>
              <el-form-item prop="innerRoadPrice" label="场内道路单价">
                <el-input type="number" v-model="form.innerRoadPrice"></el-input>
                <span class="unit">万元/km</span>
              </el-form-item>
              <el-form-item prop="setline_len" label="集电线路长度">
                <el-input type="number" v-model="form.setline_len"></el-input>
                <span class="unit">km</span>
              </el-form-item>
              <el-form-item prop="boosterArea" label="升压站占地">
                <el-input type="number" v-model="form.boosterArea"></el-input>
                <span class="unit">m³</span>
              </el-form-item>
            </div>
            <div class="grid-content label150">
              <el-form-item class="form-group" label="其他费用"></el-form-item>
              <el-form-item prop="basicReserveFundsRatio" label="基本预备费">
                <el-input type="number" v-model="form.basicReserveFundsRatio"></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="projectPreConstructionRate" label="工程前期费">
                <el-input type="number" v-model="form.projectPreConstructionRate"></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="specialReportPreparationRate" label="专题报告编制费">
                <el-input type="number" v-model="form.specialReportPreparationRate"></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="projectInsuranceRate" label="工程保险费">
                <el-input type="number" v-model="form.projectInsuranceRate"></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="sparePartsFeeRate" label="备品备件购置费">
                <el-input type="number" v-model="form.sparePartsFeeRate"></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="combinedRunningCostRate" label="联合试运转费">
                <el-input type="number" v-model="form.combinedRunningCostRate"></el-input>
                <span class="unit">%</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">{{$t('m.evaParamSubmit')}}</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>
<script>
  import {mapState} from "vuex"
  import { getEvaluationOutputParams, getEvaluationOutput, updateEvaluationOutput } from "@/api/server.request.js"
  export default {
    name: 'evaluation-render-set',
    components: {
    },
    props: {},
    data() {
      const Reg = /^(([1-9][0-9]*)|(([0]\.\d{1}|[1-9][0-9]*\.\d{1})))$/;
      const validate = (rule, value, callback) => {
        if (Reg.test(value)) {
          callback();
        } else callback(new Error('项目容量为正数，允许输入到小数点后一位'));
      };
      return {
        visible: false,
        disabled: false,
        options: {},
        form: {
          cut_hour: '',
          project_capacity: '',
          province: '',
          terrain: '',
          irrType: '',
          irrValue: '',
          
          feedinTariffs: '',
          power_limiting_rate: '',
          power_limiting_year: '',
          market_year: '',
          market_power_ratio: '',
          tradingPrice: '',
          
          financing_way: '',
          deadline: '',
          longtermFinancingGraceYears: '',
          graceInterestRateWithTax: '',
          loanInterestRateWithTax: '',
          mode_repayment: '',
          interestTaxDeduction: '',
          
          operation: '',
          warrantyPeriod: '',
          warrantyFee: '',
          outWarrantyFee: '',

          nbooster: '',
          distribut: '',
          ten_switching: '',
          thirtyfive_switching: '',
          construction_time: '',

          towerUnitPrice: '',
          anchor_price: '',
          concreteCushionUnitPrice: '',
          base_reinforcement: '',
          foundation_concrete1: '',

          pit_road: '',
          innerRoadWidth: '',
          innerRoadPrice: '',
          setline_len: '',
          boosterArea: '',

          basicReserveFundsRatio: '',
          projectPreConstructionRate: '',
          specialReportPreparationRate: '',
          projectInsuranceRate: '',
          sparePartsFeeRate: '',
          combinedRunningCostRate: '',
        },
        rules: {
          project_capacity:[
            // {required: true, message: this.$t('m.iptProjectCapacity'), trigger: 'blur'},
            // {validator: validate, trigger: 'blur'}
          ],
        },
        tableData: [],
        nameList: [
          {value: 'single_capacity', label: '单机容量', unit: 'MW'},
          {value: 'fannum', label: '风机台数', unit: '台'},
          {value: 'unit_price', label: '机组单价', unit: '元/kw'},
          {value: 'tower_weight', label: '塔架重量', unit: 't'},
          {value: 'anchor_weight', label: '锚栓重量', unit: 't'},
          {value: 'concreteCushionAmount', label: '基础垫层', unit: 'm³/台'},
          {value: 'concreteAmount', label: '基础混凝土', unit: 'm³/台'},
          {value: 'steelBarAmount', label: '基础钢筋', unit: 't/台'},
          // {value: 'equalHours', label: '等效小时数', unit: 'h'},
        ],
        paramList: []
      }
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        schemeId: state => Number(state.app['scheme_id']),
        schemeInfo: state => state.app.schemeInfo,
        schemeMemu: state => state.projectUpload.schemeMemu,
      })
    },
    watch: {
      schemeMemu: {
        handler(val, oldVal) {
          this.windData = val[2].children
        },
        deep: true
      }
    },
    mounted() {
      this.getEvaluationOutputParams()
    },
    beforeDestroy() {
    },
    methods: {
      handleClose () {
        this.visible = false
      },
      openDialog () {
        this.visible = true
        this.getData()
      },
      getEvaluationOutputParams () {
        let vm = this
        getEvaluationOutputParams({
          project_id: vm.projectInfo.project_id,
          scheme_id: vm.schemeId
        }).then((res)=>{
          if(res.code != 200){
            this.$message.error(res.message)
            return
          }
          this.options = res.data
        })
      },
      getData () {
        let vm = this;
        getEvaluationOutput({
          project_id: vm.projectInfo.project_id,
          scheme_id: vm.schemeId
        }).then((res)=>{
          if(res.code != 200){
            this.$message.error(res.message)
            return
          }
          this.form = Object.assign(vm.form, res.data.engineering_params || {}, res.data.new_param || {}, res.data.project_params || {}, res.data.wind_params || {});
          this.paramList = res.data.turbine_params || []
          this.initData()
        })
      },
      initData () {
        // table纵向展示数据渲染
        let vm = this;
        this.tableData = this.nameList.map(v => {
          let obj = {}
          vm.paramList.map((w,k) => {
            obj['pool' + k] = w[v.value] || null
          })
          return Object.assign({
            name: v.label,
            key: v.value,
            unit: v.unit
          }, obj)
        })
        // console.log(vm.tableData)
      },
      onSubmit () {
        let vm = this
        vm.$refs["form"].validate((valid) => {
          if (valid) {
            // 合成方案参数
            let turbine_params = {
              pool: '[' + vm.paramList.map(v=>{return v.pool}) + ']'
            }
            vm.tableData.forEach(v => {
              turbine_params[v.key] = '['+Object.keys(v).filter(w=>{return w.startsWith('pool')}).map(w => {
                return v[w]
              })+']'
            })
            updateEvaluationOutput(Object.assign({
              project_id: vm.projectInfo.project_id,
              scheme_id: vm.schemeId,
            }, vm.form, turbine_params), {
              headers: {
                'Content-Type': 'application/json'
              },
            }).then((res)=>{
              if(res.code != 200){
                this.$message.error(res.message)
                return
              }
              vm.$message({
                type: 'success',
                message: res.message,
                duration: 1000
              });
              this.visible = false
            })
          }
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
.evaluation-render-set{
  /deep/.grid-content{
    margin-bottom: -1px;
    &.label80{
      /deep/.el-form-item{
        .el-form-item__label{
          width: 1.4rem !important;
        }
        .el-form-item__content{
          margin-left: 1.4rem !important;
        }
      }
    }
    &.label100{
      /deep/.el-form-item{
        .el-form-item__label{
          width: 1.44rem !important;
        }
        .el-form-item__content{
          margin-left: 1.44rem !important;
          .el-input {
            width: 1.5rem;
          }
        }
      }
    }
  }
  /deep/.el-dialog__body{
    max-height: calc(90vh - 1rem);
    overflow: auto;
  }
  /deep/.el-form-item.irrType{
    margin-bottom: 0.3rem;
    border-bottom: 1px solid #DEE4D7 !important;
    .el-radio-group{
      .el-radio{
        display: block;
        margin-right: 0;
      }
    }
    .input-cont{
      display: inline-block;
      width: 0.8rem;
      padding-left: 0.2rem;
      vertical-align: middle;
      .el-input{
        opacity: 0;
        &.active{
          opacity: 1;
        }
      }
    }
    .el-input__inner{
      width: 0.8rem;
    }
  }
  /deep/.el-form-item .el-select{
    .el-input{
      width: 1.6rem;
    }
  }
  /deep/.el-radio-group{
    .el-radio{
      padding: 0.04rem 0;
      color: #2CD0B9;
      margin-right: 0.15rem;
      .el-radio__inner{
        border-radius: 2px;
      }
      .el-radio__input.is-checked .el-radio__inner{
        border: 1px solid #CFD5C9;
        background: transparent;
        &::after{
          width: 0.06rem;
          height: 0.06rem;
          background: #2cd0b9;
          border-radius: 1px;
        }
      }
    }
  }
  /deep/.el-table{
    .el-input {
      width: 0.8rem;
      .el-input__inner {
        border: none !important;
        height: 0.22rem;
        line-height: 0.22rem;
        padding: 0 0.08rem;
      }
    }
    th,td{
      border-bottom: 1px solid #DEE4D7;
    }
    tr:last-child{
      td{
        /*border-bottom: none;*/
      }
    }
    thead{
      tr,th{
        background-color: transparent;
        color: #5F482E
      }
    }
    th:first-child,
    td:first-child{
      text-align: left;
      width: 1rem;
      .cell{
        padding-left: 0.04rem;
      }
    }
    th:last-child,
    td:last-child{
      width: 0.6rem;
      text-align: left;
    }
  }
}
</style>
