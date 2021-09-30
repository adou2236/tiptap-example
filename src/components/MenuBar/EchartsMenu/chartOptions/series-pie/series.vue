<template>
  <div class="series">
    <div v-for="(item,index) in items">
      数据项{{index+1}}
      <el-form-item label="数据指标">
        <el-input :value="items[index]" />
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  model:{
    prop:'items'
  },
  props:{
    items:Array,
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
