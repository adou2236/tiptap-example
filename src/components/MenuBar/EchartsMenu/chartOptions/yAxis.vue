<template>
    <el-form-item label="坐标名称">
      <el-input v-model="innerYAxis.name"/>
    </el-form-item>
    <el-form-item label="名称坐标间隔">
      <el-input v-model="innerYAxis.nameGap"/>
    </el-form-item>
<!--    <el-form-item label="轴线显隐">-->
<!--      <el-switch v-model="innerYAxis.axisLine.show"></el-switch>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="轴线颜色">-->
<!--      <el-color-picker :disabled="!innerYAxis.axisLine.show" v-model="innerYAxis.axisLine.lineStyle.color"></el-color-picker>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="轴线宽度">-->
<!--      <el-input-number :disabled="!innerYAxis.axisLine.show" v-model="innerYAxis.axisLine.lineStyle.width"></el-input-number>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="轴线风格">-->
<!--      <el-select :disabled="!innerYAxis.axisLine.show" v-model="innerYAxis.axisLine.lineStyle.type">-->
<!--        <el-option label="solid" value="solid"></el-option>-->
<!--        <el-option label="dashed" value="dashed"></el-option>-->
<!--        <el-option label="dotted" value="dotted"></el-option>-->
<!--      </el-select>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="分割线显隐">-->
<!--      <el-switch v-model="innerYAxis.splitLine.show"></el-switch>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="分割线颜色">-->
<!--      <el-color-picker v-model="innerYAxis.splitLine.lineStyle.color"></el-color-picker>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="分割线宽度">-->
<!--      <el-input-number v-model="innerYAxis.splitLine.lineStyle.width"></el-input-number>-->
<!--    </el-form-item>-->
</template>
<script>
import {deepCopy} from "../../../../unit/baseType";

export default {
  props:{
    yAxis:Object,
  },
  data() {
    return {
      innerYAxis:deepCopy(this.yAxis)
    };
  },
  watch: {
    innerYAxis: {
      handler(to) {
        this.$emit("change", to);
      },
      deep: true,
      immediate: false
    }
  }
};
</script>
