<template>
  <div class="series">
    <div v-for="(item,index) in dataIndex">
      数据项{{index+1}}
      <el-form-item label="数据指标">
        <el-input v-model="dataIndex[index]" />
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  model:{
    prop:'dataIndex'
  },
  props:{
    dataIndex:Array,
  },
  name: "series"
}
</script>

<style scoped>
.series{
  background: #c9c7c7;
  margin-top: 10px;
}

</style>
