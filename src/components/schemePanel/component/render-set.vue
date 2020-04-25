<template>
  <el-dialog
      title="渲染设置"
      :visible.sync="visible"
      width="4rem"
      :modal="true"
      :modal-append-to-body = "false"
      :custom-class="'render-set ' + (projectUnfold ? 'unfold' : '')"
      :close-on-click-modal="false"
      :before-close="handleClose">
    <div class="title">
      <el-form ref="form" :model="form" :rules="formRules" label-width="0.8rem">
        <el-form-item label="列名 :">
          <el-select v-model="form.columnName">
            <el-option v-for="item in columnNames" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则 :" prop="ruleName" class="form-group">
          <el-select v-model="form.ruleName" @change="ruleNameChange">
            <el-option v-for="item in rules" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="['>', '<', '==', '<>'].includes(form.ruleName)" prop="ruleValue" class="rule-value" :class="form.ruleName == '<>' ? 'two-input' : ''">
          <el-input v-model="form.ruleValue" type="number" class="ipt" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="maxValue" v-if="form.ruleName == '<>'" class="max-value">
          <el-input v-model="form.maxValue" type="number" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="格式 :" class="form-group">
          <el-select v-model="form.color">
            <el-option v-for="item in colors" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <div class="ipt color-block" :style="{'background-color': form.color}">T001</div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">{{$t('m.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {mapState} from "vuex";
  import { windParam } from '@/config/scheme-config.js'

  export default {
    name: 'renderSet',
    props: {},
    components: {},
    data() {
      return {
        waitingMinute: false,
        visible: false,
        columnNames: windParam.columnNames,
        rules: windParam.rules,
        colors:windParam.colors,
        form: {
          columnName: 'elevation',
          ruleName: '>',
          ruleValue: '',
          maxValue: '',
          color: '#FB5D3F'
        },
        formRules: {
          ruleValue: [
            {required: true, message: '请输入', trigger: ['blur', 'change']},
          ],
          maxValue: [
            {required: true, message: '请输入', trigger: ['blur', 'change']},
          ]
        },
        activeBtn: true
      }
    },
    computed: {
      ...mapState({
        projectInfo: state => state.app.projectInfo,
        fanAddVisible: state => state.projectUpload.fanAddVisible,
        projectUnfold: state => state.projectUpload.projectUnfold,
        renderSet: state => state.projectUpload.renderSet
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
        this.renderSet.length && (this.form = JSON.parse(JSON.stringify(this.renderSet[this.renderSet.length - 1])))
        this.visible = true
      },
      handleClose(done) {
        done()
        this.$refs.form.clearValidate()
      },
      validateForm () {
        let bool = false;
        if (['>', '<', '=='].includes(this.form.ruleName) && (this.form.ruleValue || (this.form.ruleValue === 0))){
          bool = true
        } else if(this.form.ruleName == '<>' && (this.form.ruleValue || (this.form.ruleValue === 0)) && (this.form.maxValue || (this.form.maxValue === 0)) && this.form.ruleValue <= this.form.maxValue){
          bool = true
        } else if(['aboveAvg', 'belowAvg', '>10%', '<10%'].includes(this.form.ruleName)){
          bool = true
        }
        return bool
      },
      ruleNameChange () {
        this.form.ruleValue = ''
        this.form.maxValue = ''
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let arr = this.renderSet
            let index = arr.map(v=>{return v.columnName}).indexOf(this.form.columnName)
            if(index > -1) {
              arr.splice(index, 1)
            }
            arr.push(this.form)
            this.$store.commit('setRenderSet', JSON.parse(JSON.stringify(arr)))
            this.visible = false
          }
        });
      },
      clearForm () {
        this.$refs.form && this.$refs.form.resetFields()
        this.form = Object.assign({}, {
          columnName: 'elevation',
          ruleName: '>',
          ruleValue: '',
          maxValue: '',
          color: '#FB5D3F'
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .render-set {
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
      .el-select{
        .el-input__suffix{
          top:3px;
        }
        .is-focus{
          .el-input__suffix{
            top:-2px;
          }
        }
      }
      .form-group{
        .el-form-item__content{
          display: flex;
          .el-select{
            margin-right: 0.03rem;
            .el-input, .el-input__inner{
              width: 1.1rem;
            }
          }
          .ipt, .ipt .el-input__inner{
            width: 0.77rem;
          }
          
          .color-block{
            height: 0.26rem;
            border-radius: 0.07rem;
            color: #fff;
            text-align: center;
          }
        }
        &.is-error{
          .el-select{
            .el-input__inner{
              border-color: transparent !important;
            }
          }
        }

        &.two-input{
          .el-form-item__content{
            .ipt, .ipt .el-input__inner{
              width: 0.5rem;
            }
            .ipt .el-input__inner{
              padding: 0 0.05rem;
            }
            .ipt:last-child{
              margin-left: 0.03rem;
            }
            .el-form-item__error{
              padding-right: 0.7rem;
            }
          }
        }
      }
      .rule-value{
        margin-top: -0.44rem;
        margin-left: 1.13rem;
        .el-form-item__content{
          width: 0.77rem;
          .el-input__inner{
            width: 0.77rem;
          }
        }
        &.two-input{
          .el-form-item__content{
            .ipt, .ipt .el-input__inner{
              width: 0.5rem;
            }
            .ipt .el-input__inner{
              padding: 0 0.05rem;
            }
            .ipt:last-child{
              margin-left: 0.03rem;
            }
            .el-form-item__error{
              padding-right: 0.24rem;
            }
          }
        }
      }
      .max-value{
        margin-top: -0.44rem;
        margin-left: 1.7rem;
        .el-form-item__content{
          width: 0.56rem;
          .el-input__inner{
            width: 0.5rem;
          }
        }
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
