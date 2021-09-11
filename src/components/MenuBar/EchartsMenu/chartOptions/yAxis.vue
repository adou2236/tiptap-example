<template>
  <el-collapse-item title="y轴配置" name="5">
    <el-form-item label="坐标名称">
      <el-input v-model="yAxis.name"/>
    </el-form-item>
    <el-form-item label="名称坐标间隔">
      <el-input v-model="yAxis.nameGap"/>
    </el-form-item>
    <el-form-item label="轴线显隐">
      <el-switch v-model="yAxis.axisLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="轴线颜色">
      <el-color-picker :disabled="!yAxis.axisLine.show" v-model="yAxis.axisLine.lineStyle.color"></el-color-picker>
    </el-form-item>
    <el-form-item label="轴线宽度">
      <el-input-number :disabled="!yAxis.axisLine.show" v-model="yAxis.axisLine.lineStyle.width"></el-input-number>
    </el-form-item>
    <el-form-item label="轴线风格">
      <el-select :disabled="!yAxis.axisLine.show" v-model="yAxis.axisLine.lineStyle.type">
        <el-option label="solid" value="solid"></el-option>
        <el-option label="dashed" value="dashed"></el-option>
        <el-option label="dotted" value="dotted"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分割线显隐">
      <el-switch v-model="yAxis.splitLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="分割线颜色">
      <el-color-picker v-model="yAxis.splitLine.lineStyle.color"></el-color-picker>
    </el-form-item>
    <el-form-item label="分割线宽度">
      <el-input-number v-model="yAxis.splitLine.lineStyle.width"></el-input-number>
    </el-form-item>
  </el-collapse-item>
</template>
<script>
export default {
  props:{
    yAxis:Object,
  },
  data() {
    return {
    };
  },
  watch: {
    yAxis: {
      handler(to) {
        this.$emit("change", to);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
