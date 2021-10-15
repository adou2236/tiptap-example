<template>
  <el-collapse-item title="提示框配置" name="a-2">
    <el-form-item label="显示隐藏">
      <el-switch v-model="innerToolTip.show"></el-switch>
    </el-form-item>
    <el-form-item label="类型">
      <el-select v-model="innerToolTip.trigger">
        <el-option label="axis" value="axis"></el-option>
        <el-option label="item" value="item"></el-option>
      </el-select>
    </el-form-item>
<!--    <el-form-item label="内边距">-->
<!--      <el-input-number v-for="(item, index) in innerToolTip.padding" :key="index" v-model="innerToolTip.padding[index]"></el-input-number>-->
<!--    </el-form-item>-->
    <el-form-item label="背景色">
      <el-color-picker v-model="innerToolTip.backgroundColor" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item label="边框颜色">
      <el-color-picker v-model="innerToolTip.borderColor"></el-color-picker>
    </el-form-item>
    <el-form-item label="边框宽度">
      <el-input-number v-model="innerToolTip.borderWidth"></el-input-number>
    </el-form-item>
  </el-collapse-item>
</template>
<script>
import {deepCopy} from "../../../../unit/baseType";

export default {
  props:{
    tooltip: Object
  },
  data() {
    return {
      innerToolTip:deepCopy(this.tooltip)
    };
  },
  watch: {
    innerToolTip: {
      handler(to) {
        this.$emit('change', to)
      },
      immediate: false,
      deep: true
    }
  },
};
</script>
