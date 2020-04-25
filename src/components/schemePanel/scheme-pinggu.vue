<template>
  <div class="scheme-pinggu">
    <el-dialog
        :visible.sync="visible"
        width="12rem"
        :modal="true"
        :modal-append-to-body = "false"
        :close-on-click-modal="false"
        :before-close="handleClose">
      <div slot="title">
        {{ schemeInfo && schemeInfo.scheme_name }}
        <i title="查看详细参数" @click="openParamSet" class="iconfont icon-canshupeizhi"></i>
        <i title="编辑" @click="disabled = !disabled" class="iconfont icon-bianji2" :class="{active: !disabled}"></i>
      </div>
      <el-row>
        <el-col :span="8">
          <div class="grid-content label180">
            <div class="thead">{{ $t('m.majorEconomicIndicators') }}</div>
            <el-form :model="economic" :rules="rules" ref="economic" label-width="100px" :disabled="disabled">
              <el-form-item prop="capacity" :label="$t('m.capacity2')">
                <el-input type="number" v-model="economic.capacity"></el-input>
                <span class="unit">MW</span>
              </el-form-item>
              <el-form-item prop="equivalent_hours" :label="$t('m.equalHours')" disabled>
                <el-input type="number" v-model="economic.equivalent_hours"></el-input>
                <span class="unit">H</span>
              </el-form-item>
              <el-form-item prop="static_total_investment" :label="$t('m.staticTotalInvestment')">
                <el-input type="number" v-model="economic.static_total_investment"></el-input>
                <span class="unit">万元</span>
              </el-form-item>
              <el-form-item prop="unite_static_total_investment" :label="$t('m.unitStaticInvestment')">
                <el-input type="number" v-model="economic.unite_static_total_investment"></el-input>
                <span class="unit">元/KW</span>
              </el-form-item>
              <el-form-item prop="unite_dynamic_total_investment" :label="$t('m.totalInvestmentPerUnitDynamic')">
                <el-input type="number" v-model="economic.unite_dynamic_total_investment"></el-input>
                <span class="unit">元/KW</span>
              </el-form-item>
              <el-form-item prop="fan_price" class="price" :label="$t('m.fanPrice')">
                <el-input type="number" v-model="economic.fan_price"></el-input>
                <span class="unit">元/KW</span>
              </el-form-item>
              <el-form-item prop="tower_price" class="price" :label="$t('m.towerDrumPrice')">
                <el-input type="number" v-model="economic.tower_price"></el-input>
                <span class="unit">元/KW</span>
              </el-form-item>
              <el-form-item prop="basic_price" class="price" :label="$t('m.basedPrice')">
                <el-input type="number" v-model="economic.basic_price"></el-input>
                <span class="unit">元/KW</span>
              </el-form-item>
              <el-form-item prop="average_tariff_inclusive" :label="$t('m.averageTariffPrice')">
                <el-input type="number" v-model="economic.average_tariff_inclusive"></el-input>
                <span class="unit">元/kWh</span>
              </el-form-item>
              <el-form-item prop="static_vat_cit" label="静态度电成本(含VAT&CIT)">
                <el-input type="number" v-model="economic.static_vat_cit"></el-input>
                <span class="unit">元/kWh</span>
              </el-form-item>
              <el-form-item prop="lcoe" label="LCOE(平准化度电成本)">
                <el-input type="number" v-model="economic.lcoe"></el-input>
                <span class="unit">元/kWh</span>
              </el-form-item>
              <el-form-item prop="pt" label="PT(投资回收期)">
                <el-input type="number" v-model="economic.pt"></el-input>
                <span class="unit">年</span>
              </el-form-item>
              <el-form-item prop="total_investment_value" label="全投资净现值">
                <el-input type="number" v-model="economic.total_investment_value" ></el-input>
                <span class="unit">万年</span>
              </el-form-item>
              <el-form-item prop="capital_found_value" label="资本金净现值">
                <el-input type="number" v-model="economic.capital_found_value" ></el-input>
                <span class="unit">万年</span>
              </el-form-item>
              <el-form-item prop="p_i_r_r" label="PIRR(全投资内部收益率)">
                <el-input type="number" v-model="economic.p_i_r_r" ></el-input>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item prop="e_i_r_r" label="EIRR(资本金内部收益率)">
              <el-input type="number" v-model="economic.e_i_r_r" ></el-input>
              <span class="unit">%</span>
            </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content label150">
            <div class="thead">{{ $t('m.summaryOfProjectEstimates') }}</div>
              <el-form :model="budget" :rules="rules" ref="budget" label-width="100px" :disabled="disabled">
                <el-row>
                <el-col :span="11">
                  <el-form-item class="form-group" label="一：施工辅助工程">
                    <el-input disabled type="number" v-model="engineAssistance"></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="assistanceTrafficFee" label="1：施工交通工程">
                    <el-input type="number" v-model.number="budget.assistanceTrafficFee" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="assistancePowerFee" label="2：施工供电工程">
                    <el-input type="number" v-model.number="budget.assistancePowerFee" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="assistanceWaterFee" label="3：施工供水工程">
                    <el-input type="number" v-model.number="budget.assistanceWaterFee" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="assistanceOtherFee" label="4：其他施工辅助工程">
                    <el-input type="number" v-model.number="budget.assistanceOtherFee" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item class="form-group" label="三：建筑工程">
                    <el-input type="number" disabled v-model="constructionInstall"></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="electricEngineering" label="1：发电场工程">
                    <el-input type="number" v-model.number="budget.electricEngineering" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="boosterSubstationProject" label="2：升压变电站工程">
                    <el-input type="number" v-model.number="budget.boosterSubstationProject" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="housingConstructionProject" label="3：房屋建筑工程">
                    <el-input type="number" v-model.number="budget.housingConstructionProject" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="trafficEngineering" label="4：交通工程">
                    <el-input type="number" v-model.number="budget.trafficEngineering" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="otherEngineering" label="5：其他工程">
                    <el-input type="number" v-model.number="budget.otherEngineering" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item class="form-group" label="五：基本预备费">
                    <el-input type="number" disabled v-model="basicReserveFundsFee"></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="sendPowerProjectFee" label="1：送出工程">
                    <el-input type="number" v-model.number="budget.sendPowerProjectFee" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="projectStaticInvestment" label="2：工程静态投资合计">
                    <el-input type="number" v-model.number="budget.projectStaticInvestment" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item></el-form-item>
                  <el-form-item></el-form-item>
                </el-col>
                <el-col :span="13" class="right-cont">
                  <el-form-item class="form-group" label="二：设备及安装工程">
                    <el-input type="number" disabled v-model="equipment_install"></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="electricalEquipmentInstall" label="1：发电场设备及安装工程">
                    <el-input type="number" v-model.number="budget.electricalEquipmentInstall" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="equipmentInstallationBoosterSubstation" label="2：升压变电站设备及安装工程">
                    <el-input type="number" v-model.number="budget.equipmentInstallationBoosterSubstation" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="controlProtectionEquipmentInstall" label="3：控制保护设备及安装工程">
                    <el-input type="number" v-model.number="budget.controlProtectionEquipmentInstall" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="otherEquipmentInstall" label="4：其他设备及安装工程">
                    <el-input type="number" v-model.number="budget.otherEquipmentInstall" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item class="form-group" label="四：其他费用">
                    <el-input type="number" disabled v-model="otherFee"></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="projectConstructionLandFee" label="1：项目建设用地费">
                    <el-input type="number" v-model.number="budget.projectConstructionLandFee" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="projectConstructionManagementFee" label="2：项目建设管理费">
                    <el-input type="number" v-model.number="budget.projectConstructionManagementFee" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="productionPreparationFee" label="3：生产准备费">
                    <el-input type="number" v-model.number="budget.productionPreparationFee" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="surveyDesignFee" label="4：勘察设计费">
                    <el-input type="number" v-model.number="budget.surveyDesignFee" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="otherTax" label="5：其他税费">
                    <el-input type="number" v-model.number="budget.otherTax" ></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item class="form-group" label="六：差价预备费">
                    <el-input type="number" v-model="budget.reservePriceDiff"></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item class="form-group" label="七：建设期利息">
                    <el-input type="number" v-model="budget.interestConstruction"></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item class="form-group" label="八：工程总投资">
                    <el-input type="number" v-model="budget.totalProjectInvestment"></el-input>
                    <span class="unit">万元</span>
                  </el-form-item>
                  <el-form-item prop="staticInvestmentPerkW" label="1：单位千瓦静态投资">
                    <el-input type="number" v-model.number="budget.staticInvestmentPerkW" ></el-input>
                    <span class="unit">元/KW</span>
                  </el-form-item>
                  <el-form-item prop="dymaticInvestmentPerkW" label="2：单位千瓦动态投资">
                    <el-input type="number" v-model.number="budget.dymaticInvestmentPerkW" ></el-input>
                    <span class="unit">元/KW</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!disabled" type="primary" @click="onSubmit">{{$t('m.pingguSubmit')}}</el-button>
      </span>
    </el-dialog>
    
    <evaluation-render-set ref="evaRenderSet"></evaluation-render-set>
  </div>
</template>
<script>
  import {mapState} from "vuex"
  import {getEvaluationResult, updateEvaluationResult } from "@/api/server.request.js"
  export default {
    name: 'scheme-pinggu',
    components: {
      'evaluation-render-set': () => import('@/components/schemePanel/component/evaluation-render-set.vue'),
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
        visible: true,
        disabled: true,
        economic: {
          capacity: '',
          equivalent_hours: '',
          static_total_investment: '',
          unite_static_total_investment: '',
          unite_dynamic_total_investment: '',
          fan_price: '',
          tower_price: '',
          basic_price: '',
          average_tariff_inclusive: '',
          static_vat_cit: '',
          lcoe: '',
          pt: '',
          total_investment_value: '',
          capital_found_value: '',
          p_i_r_r: '',
          e_i_r_r: ''
        },
        budget: {
          engineAssistance: '',
          assistanceTrafficFee: '',
          assistancePowerFee: '',
          assistanceWaterFee: '',
          assistanceOtherFee: '',
          constructionInstall: '',
          electricEngineering: '',
          boosterSubstationProject: '',
          housingConstructionProject: '',
          trafficEngineering: '',
          otherEngineering: '',
          basicReserveFundsFee: '',
          sendPowerProjectFee: '',
          projectStaticInvestment: '',
          equipment_install: '',
          electricalEquipmentInstall: '',
          equipmentInstallationBoosterSubstation: '',
          controlProtectionEquipmentInstall: '',
          otherEquipmentInstall: '',
          otherFee: '',
          projectConstructionLandFee: '',
          projectConstructionManagementFee: '',
          productionPreparationFee: '',
          surveyDesignFee: '',
          otherTax: '',
          reservePriceDiff: '',
          interestConstruction: '',
          totalProjectInvestment: '',
          staticInvestmentPerkW: '',
          dymaticInvestmentPerkW: ''
        },
        rules: {
          capacity:[
            // {required: true, message: this.$t('m.iptProjectCapacity'), trigger: 'blur'},
            // {validator: validate, trigger: 'blur'}
          ],
        },
      }
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        schemeId: state => Number(state.app['scheme_id']),
        schemeInfo: state => state.app.schemeInfo,
        schemeMemu: state => state.projectUpload.schemeMemu,
      }),
      engineAssistance:function(){
        return this.budget.assistanceTrafficFee + this.budget.assistancePowerFee + this.budget.assistanceWaterFee + this.budget.assistanceOtherFee;
      },
      constructionInstall:function(){
        return this.budget.electricEngineering + this.budget.boosterSubstationProject + this.budget.housingConstructionProject + this.budget.trafficEngineering + this.budget.otherEngineering;
      },
      basicReserveFundsFee:function(){
        return this.budget.sendPowerProjectFee + this.budget.projectStaticInvestment;
      },
      equipment_install:function(){
        return this.budget.electricalEquipmentInstall + this.budget.equipmentInstallationBoosterSubstation + this.budget.controlProtectionEquipmentInstall + this.budget.otherEquipmentInstall;
      },
      otherFee:function(){
        return this.budget.projectConstructionLandFee + this.budget.projectConstructionManagementFee + this.budget.productionPreparationFee + this.budget.surveyDesignFee + this.budget.otherTax;
      },
      // totalProjectInvestment:function(){
      //   return this.budget.staticInvestmentPerkW + this.budget.dymaticInvestmentPerkW;
      // }
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
      this.init()
      this.getData()
    },
    beforeDestroy() {
    },
    methods: {
      init () {
      },
      getData () {
        let vm = this;
        getEvaluationResult({
          project_id: vm.projectInfo.project_id,
          scheme_id: vm.schemeId
        }).then((res)=>{
          if(res.code != 200){
            this.$message.error(res.message)
            return
          }
          this.economic = Object.assign({}, vm.economic, {
            capacity: this.projectInfo && this.projectInfo.design_capacity || '',
            equivalent_hours: this.schemeInfo && this.schemeInfo.equal_hours || ''
          }, res.data.output_rate_rate);
          this.budget = Object.assign({}, vm.budget, res.data.evaluation_budgetary_estimates);
        })
      },
      handleClose () {
        this.visible = false
        this.$store.commit('componentScheme', null)
        this.$store.commit('setSchemeMemu', {
          type: 'pinggu',
          active: false
        })
      },
      openParamSet () {
        this.$refs.evaRenderSet.openDialog()
      },
      onSubmit () {
        let vm = this
        let p1 = new Promise((resolve, reject) => {
          vm.$refs["economic"].validate((valid) => {
            if (valid) {
              resolve('ok')
            }
          });
        })
        let p2 = new Promise((resolve, reject) => {
          vm.$refs["budget"].validate((valid) => {
            if (valid) {
              resolve('ok')
            }
          });
        })
        Promise.all([p1, p2]).then((res)=>{
          vm.budget.engineAssistance = vm.engineAssistance
          vm.budget.constructionInstall = vm.constructionInstall
          vm.budget.basicReserveFundsFee = vm.basicReserveFundsFee
          vm.budget.equipment_install = vm.equipment_install
          vm.budget.otherFee = vm.otherFee
          // vm.budget.totalProjectInvestment = vm.totalProjectInvestment
          updateEvaluationResult({
            project_id: vm.projectInfo.project_id,
            scheme_id: vm.schemeId,
            evaluation_budgetary_estimates: vm.budget,
            output_rate_rate: vm.economic
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
          }).then((res)=>{
            if(res.code != 200){
              vm.$message.error(res.message)
              return
            }
            vm.$message({
              type: 'success',
              message: res.message,
              duration: 1000
            });
            vm.visible = false
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .scheme-pinggu {
    /deep/.v-modal{
      background: rgba(0,0,0,0.3) !important;
      /*z-index: 2002 !important;*/
    }
    /deep/.el-dialog__header{
      .iconfont{
        width: 0.33rem;
        height: 0.3rem;
        background-color: #ffffff;
        border-radius: 0.08rem;
        text-align: center;
        font-size: 0.18rem;
        line-height: 0.36rem;
        cursor: pointer;
        margin-left: 0.2rem;
        &.active{
          color: #2CD0B9;
        }
      }
    }
    /deep/.grid-content{
      border: 1px solid #CFD5C9;
      border-radius: 0.16rem;
      padding: 0.08rem;
      padding-bottom: 0;
      margin-right: -1px;
      .thead{
        height: 0.3rem;
        line-height: 0.3rem;
        padding: 0 0.1rem;
        background-color: #F0F7F2;
        border-radius: 0.04rem;
        font-size: 0.14rem;
        color: #333;
        margin-bottom: 0.06rem;
      }
      /deep/.el-form-item{
        border-bottom: 1px solid #DEE4D7;
        margin-bottom: 0;
        &.price{
          .el-form-item__label{
            padding-left: 0.48rem;
          }
        }
        &:last-child{
          border-bottom: none;
        }
        .el-form-item__label{
          padding-left: 0.04rem;
        }
        .el-form-item__label,
        .el-form-item__content{
          color: #333;
          text-align: left;
          height: 0.3rem;
          line-height: 0.3rem;
        }
        .el-input{
          width: 0.8rem;
          .el-input__inner{
            border: none !important;
            height: 0.3rem;
            line-height: 0.3rem;
            padding: 0 0.08rem;
          }
          &.is-disabled{
            .el-input__inner{
              background: transparent;
              cursor: auto;
              color: #5F482E;
            }
          }
        }
        &.form-group{
          .el-form-item__label,
          .el-form-item__content{
            color: #2CD0B9;
          }
          .el-form-item__label{
            padding-left: 0 !important;
          }
        }
      }
      &.label180{
        /deep/.el-form-item{
          .el-form-item__label{
            width: 2.1rem !important;
            padding-right: 0;
          }
          .el-form-item__content{
            margin-left: 2.1rem !important;
          }
        }
      }
      &.label150{
        /deep/.el-form-item{
          .el-form-item__label{
            width: 2rem !important;
            padding-right: 0;
            padding-left: 0.25rem;
          }
          .el-form-item__content{
            margin-left: 2rem !important;
          }
        }
      }
      .right-cont{
        /deep/.el-form-item{
          .el-form-item__label{
            width: 2.6rem !important;
          }
          .el-form-item__content{
            margin-left: 2.6rem !important;
          }
        }
      }
    }
    /deep/.el-button--primary{
      width: unset;
      min-width: 1.5rem;
    }
  }

</style>
