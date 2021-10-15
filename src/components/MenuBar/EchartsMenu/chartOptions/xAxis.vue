<template>
  <el-collapse-item title="x轴配置" name="s-5">
    <el-form-item label="坐标名称">
      <el-input v-model="innerXAxis.name"/>
    </el-form-item>
    <el-form-item label="名称坐标间隔">
      <el-input v-model="innerXAxis.nameGap"/>
    </el-form-item>
<!--    <el-form-item label="轴线显隐">-->
<!--      <el-switch v-model="innerXAxis.axisLine.show"></el-switch>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="轴线颜色">-->
<!--      <el-color-picker :disabled="!innerXAxis.axisLine.show" v-model="innerXAxis.axisLine.lineStyle.color"></el-color-picker>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="轴线宽度">-->
<!--      <el-input-number :disabled="!innerXAxis.axisLine.show" v-model="innerXAxis.axisLine.lineStyle.width"></el-input-number>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="轴线风格">-->
<!--      <el-select :disabled="!innerXAxis.axisLine.show" v-model="innerXAxis.axisLine.lineStyle.type">-->
<!--        <el-option label="solid" value="solid"></el-option>-->
<!--        <el-option label="dashed" value="dashed"></el-option>-->
<!--        <el-option label="dotted" value="dotted"></el-option>-->
<!--      </el-select>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="分割线显隐">-->
<!--      <el-switch v-model="innerXAxis.splitLine.show"></el-switch>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="分割线颜色">-->
<!--      <el-color-picker v-model="innerXAxis.splitLine.lineStyle.color"></el-color-picker>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="分割线宽度">-->
<!--      <el-input-number v-model="innerXAxis.splitLine.lineStyle.width"></el-input-number>-->
<!--    </el-form-item>-->
  </el-collapse-item>
</template>
<script>
import {deepCopy} from "../../../../unit/baseType";

export default {
  name: 'xAxisOption',
  props: {
    xAxis:Object,
  },
  data() {
    return {
      innerXAxis:deepCopy(this.xAxis)
    };
  },
  watch: {
    innerXAxis: {
      handler(to) {
        this.$emit("change", to);
      },
      deep: true,
      immediate: false
    }
  },
  mounted() {
    // this.xAxis.data = this.xAxisData
  }
};
</script>
