<template>
  <div>
    <el-form-item label="柱条背景显示">
      <el-switch v-model="item.showBackground"></el-switch>
    </el-form-item>
    <el-form-item label="柱条宽度">
      <el-input-number v-model="item.barWidth" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="边框颜色">
      <el-color-picker v-model="item.itemStyle.borderColor"></el-color-picker>
    </el-form-item>
    <el-form-item label="边框宽度">
      <el-input-number v-model="item.itemStyle.borderWidth" :step="0.5"></el-input-number>
    </el-form-item>
    <el-form-item label="边框类型">
      <el-select v-model="item.itemStyle.borderType">
        <el-option label="solid" value="solid"></el-option>
        <el-option label="dashed" value="dashed"></el-option>
        <el-option label="dotted" value="dotted"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="圆角">
      <el-input-number v-model="item.itemStyle.borderRadius" :step="1"></el-input-number>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "barOpt",
  props:{
    item:{
      type:Object
    }
  }
}
</script>

<style scoped>

</style>
