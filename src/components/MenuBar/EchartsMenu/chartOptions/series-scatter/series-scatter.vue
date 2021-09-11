<template>
  <el-collapse-item title="数据项配置" name="7">
    <el-form-item label="横坐标指标">
      <el-input v-model="series[0].dataIndex[0]"></el-input>
    </el-form-item>
    <el-form-item label="纵坐标指标">
      <el-input v-model="series[0].dataIndex[1]"></el-input>
    </el-form-item>
    <el-form-item label="标记大小">
      <el-input v-model="series[0].symbolSize"></el-input>
    </el-form-item>
<!--    <el-form-item label="突出显示报告地域">-->
<!--      <el-switch v-model="series[0].label.show"></el-switch>-->
<!--    </el-form-item>-->
    <el-form-item label="标签显隐">
      <el-switch v-model="series[0].label.show"></el-switch>
    </el-form-item>
    <el-form-item label="标签位置" :disabled="!series[0].label.show">
      <el-input-number v-model="series[0].label.position[0]"></el-input-number>
      <el-input-number v-model="series[0].label.position[1]"></el-input-number>
    </el-form-item>
    <el-form-item label="标签连线显隐">
      <el-switch v-model="series[0].labelLine.show"></el-switch>
    </el-form-item>

  </el-collapse-item>
</template>

<script>

export default {
  name: "series-scatter",
  props:{
    series:Array
  },
  methods:{

  }
}
</script>

<style scoped>

</style>
