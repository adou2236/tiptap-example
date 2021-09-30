<template>
  <div>
    <el-form-item label="平滑曲线">
      <el-switch v-model="item.smooth"></el-switch>
    </el-form-item>
    <el-form-item label="线条宽度">
      <el-input-number v-model="item.lineStyle.width" :max="10" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="线条颜色">
      <el-color-picker v-model="item.lineStyle.color"></el-color-picker>
    </el-form-item>
    <el-form-item label="区域颜色">
      <el-color-picker v-model="item.areaStyle.color"></el-color-picker>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "line",
  props:{
    item:{
      type:Object
    }
  }
}
</script>

<style scoped>

</style>
