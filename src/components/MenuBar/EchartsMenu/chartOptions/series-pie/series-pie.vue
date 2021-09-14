<template>
  <el-collapse-item title="数据项配置" name="7">
    <el-button @click="addSeriesItem" type="primary" size="mini" >添加数据项</el-button>
    <series v-model="index.items"></series>
  </el-collapse-item>
</template>

<script>
import {deepCopy} from "../../../../../unit/baseType";
import Series from "./series";

export default {
  name: "series-pie",
  components: {Series},
  props:{
    series:Array,
    index:Object
  },
  methods:{
    addSeriesItem() {
      //饼状图，数据指标是数组结构
      let newIndex = parseInt(Math.random()*100)
      this.index.items.push(newIndex)
    }
  }
}
</script>

<style scoped>

</style>
