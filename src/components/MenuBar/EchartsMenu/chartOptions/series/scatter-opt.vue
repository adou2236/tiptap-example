<template>
  <div>
    <el-form-item label="散点类型">
      <el-select v-model="item.symbol">
        <el-option :value="'rect'">矩形</el-option>
        <el-option :value="'circle'">圆形</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="图形大小">
      <el-input-number v-model="item.symbolSize[0]" :min="1"></el-input-number>
      <el-input-number v-model="item.symbolSize[1]" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="图形颜色">
      <el-color-picker v-model="item.itemStyle.color"></el-color-picker>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "scatterOpt",
  props:{
    item:{
      type:Object
    }
  }
}
</script>

<style scoped>

</style>
