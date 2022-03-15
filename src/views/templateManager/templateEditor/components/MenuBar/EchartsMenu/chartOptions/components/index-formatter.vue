<template>
  <div>
    <el-form-item label="单位换算：" label-width="90px">
      <el-input :disabled="disabled" v-model="formatter" />
    </el-form-item>
    <el-form-item label="小数点位数：">
      <el-input-number :disabled="disabled" :min="0" :step="1" step-strictly v-model="round" />
    </el-form-item>
  </div>
</template>

<script>
import { debounce } from '../../../../../unit/baseType';
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      round: null,
      formatter: "",
    };
  },
  created() {
    let reg = /(round\(=?)(\S*)(?=\,\d\))/;
    let reg1 = /(round\([^]*\,=?)(\S*)(?=\))/;
    try {
      this.formatter = this.value.match(reg)[2];
      this.round = this.value.match(reg1)[2];
    } catch (error) {
      this.formatter = this.value;
      this.round = null;
    }
  },
  watch: {
    formula:{
      handler:debounce(function(newVal, oldVal) {
        //TODO此处触发时机待优化
        if (this.value!==null&&newVal !== this.value) {
          this.$emit("change", newVal)
        }
      },500),
      immediate: false,
    },
    value:{
      handler(newVal, oldVal) {
        if(!newVal){
          this.formatter = '';
          this.round = null;
        }
        if (newVal&&newVal !== oldVal) {
          let reg = /(round\(=?)(\S*)(?=\,\d\))/;
          let reg1 = /(round\([^]*\,=?)(\S*)(?=\))/;
          try {
            this.formatter = newVal.match(reg)[2];
            this.round = newVal.match(reg1)[2];
          } catch (error) {
            this.formatter = newVal;
            this.round = null;
          }
        }
      },
      immediate:false
    }
  },
  computed: {
    formula() {
      if (this.round !== null) {
        return `round(${this.formatter||'X'},${this.round})`;
      } else {
        return this.formatter;
      }
    },
  },
};
</script>

<style>
</style>