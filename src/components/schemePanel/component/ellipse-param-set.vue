<template>
  <el-dialog
      title="椭圆参数设置"
      :visible.sync="visible"
      :modal="true"
      :modal-append-to-body = "false"
      width="4rem"
      :custom-class="'ellipse-param-set ' + (projectUnfold ? 'unfold' : '')"
      :close-on-click-modal="false"
      :before-close="handleClose">
    <div class="title">
      <el-form ref="form" :model="form" :rules="rules" label-width="1rem">
        <el-form-item label="主风向 :" prop="direction">
          <el-select v-model="form.direction" placeholder="0°(N)">
            <el-option v-for="item in deirections" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item ref="rLong" label="长半径 :" prop="radiusLong">
          <el-input v-model="form.radiusLong" type="number" class="ipt" placeholder="请输入风机直径倍数"></el-input>
          D
        </el-form-item>
        <el-form-item ref="rShort" label="短半径 :" prop="radiusShort">
          <el-input v-model="form.radiusShort" type="number" class="ipt" placeholder="请输入风机直径倍数"></el-input>
          D
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit">{{$t('m.confirm')}}</el-button>
        </span>
  </el-dialog>
</template>
<script>

  import {
    verifyFileName,
    validateAzNumber,
    validateWGS84X,
    validateWGS84Y,
    valUTMX,
    validateCoordinateX,
    validateCoordinateY,
    validateHeight,
    validateFile
  } from "@/utils/validate"
  import {mapState} from "vuex";
  import {postMastTimTxt} from "@/api/server.request.js"

  export default {
    name: 'ellipseParamSet',
    props: ['wtList'],
    components: {},
    data() {
      const Reg = /^(([1-9][0-9]*)|(([0]\.\d{1}|[1-9][0-9]*\.\d{1})))$/;
      const validate = (rule, value, callback) => {
        if(value < 1 || value > 10){
          callback(new Error('[1, 10]'));
        } else if (!Reg.test(value)) {
          callback(new Error('允许输入到小数点后一位'));
        } else if (this.form.radiusLong < this.form.radiusShort){
          callback(new Error('长半径必须大于等于短半径'));
        } else {
          if (rule.field == 'radiusLong' && this.$refs.rShort.validateMessage == '长半径必须大于等于短半径') {
            this.$refs.form.validateField('radiusShort');
          }
          if (rule.field == 'radiusShort' && this.$refs.rLong.validateMessage == '长半径必须大于等于短半径') {
            this.$refs.form.validateField('radiusLong');
          }
          callback();
        }
      };
      return {
        waitingMinute: false,
        visible: false,
        deirections: [
          {label: '0°（N）', value: 0},
          {label: '22.5°（NNE）', value: 22.5},
          {label: '45°（NE）', value: 45},
          {label: '67.5°（ENE）', value: 67.5},
          {label: '90°（E）', value: 90},
          {label: '112.5°（ESE）', value: 112.5},
          {label: '135°（SE）', value: 135},
          {label: '157.5°（SSE）', value: 157.5},
          {label: '180°（S）', value: 180},
          {label: '202.5°（SSW）', value: 202.5},
          {label: '225°（SW）', value: 225},
          {label: '247.5°（WSW）', value: 247.5},
          {label: '270°（W）', value: 270},
          {label: '292.5°（WNW）', value: 292.5},
          {label: '315°（NW）', value: 315},
          {label: '337.5°（NNW）', value: 337.5},
        ],
        form: {
          direction: 45,
          radiusLong: '',
          radiusShort: ''
        },
        rules: {
          direction: [
            {required: true, message: this.$t('m.validateDirection'), trigger: ['blur', 'change']},
          ],
          radiusLong: [
            {required: true, message: this.$t('m.validateRadiusLong'), trigger: 'blur'},
            {validator: validate, trigger: ['blur', 'change']},
          ],
          radiusShort: [
            {required: true, message: this.$t('m.validateRadiusShort'), trigger: 'blur'},
            {validator: validate, trigger: ['blur', 'change']},
          ],
        },
        activeBtn: true,
        submitForm: null
      }
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        fanAddVisible: state => state.projectUpload.fanAddVisible,
        projectUnfold: state => state.projectUpload.projectUnfold,
        ellipseForm: state => state.projectUpload.ellipseForm,
        renderSet: state => state.projectUpload.renderSet,
        pptModel: state => state.app.pptModel
      })
    },
    watch: {
      waitingMinute() {
        this.$store.dispatch('handleLoading', {loading: this.waitingMinute, text: this.$t('m.uploading')});
      },
    },
    mounted() {

    },
    beforeDestroy() {
    },
    methods: {
      openDialog() {
        this.pptModel && Object.keys(this.ellipseForm).length && (this.form = JSON.parse(JSON.stringify(this.ellipseForm)))
        this.submitForm && (this.form = JSON.parse(JSON.stringify(this.submitForm)))
        this.visible = true
      },
      handleClose(done) {
        done()
        this.$refs.form.clearValidate()
      },
      onSubmit () {
        let vm = this
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitForm = JSON.parse(JSON.stringify(this.form))
            this.$store.commit("setEllipseForm", this.submitForm)
            this.visible = false
            gwmap.wtLayer.loadWtEllipse(vm.form, vm.wtList)
          }
        });
      },
      clearForm () {
        this.$refs.form && this.$refs.form.resetFields()
        this.submitForm = null
        this.form = Object.assign({}, {
          direction: 45,
          radiusLong: '',
          radiusShort: ''
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .ellipse-param-set {
    left: -0.34rem;
    &.unfold {
      left: -2.3rem;
    }
    .title {
      display: flex;
      justify-content: center;
      padding: 0 0.1rem 0 0;
      .el-input__inner {
        width: 1.9rem;
        background: rgba(235, 242, 228, 1);
        border-radius: 0.07rem;
        border: none;
        font-size: 0.1rem;
      }
      .el-form-item__content {
        width: 2.35rem;
        .el-input {
          width: 1.9rem;
        }
      }
      .el-form-item{
        margin-bottom: 0.18rem;
      }
      .el-form-item__content, .el-form-item, .el-form-item__label, .el-input, .el-input__inner {
        line-height: 0.26rem;
        height: 0.26rem;
      }
      .el-form-item__label {
        font-size: 0.15rem;
        padding: 0 0.1rem 0 0;
        color: #333333;
      }
      .btn {
        display: flex;
        & > div {
          cursor: pointer;
          width: 1rem;
          height: 0.3rem;
          line-height: 0.3rem;
          text-align: center;
          border-radius: 0.11rem;
        }
      }
    }
    
  }
</style>
