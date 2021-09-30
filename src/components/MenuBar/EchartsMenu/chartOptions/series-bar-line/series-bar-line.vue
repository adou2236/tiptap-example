<template>
  <el-collapse-item title="数据项配置" name="a-2">
    <el-button @click="addSeriesItem" type="primary" size="mini" >添加数据项</el-button>
    <series v-for="(item,num) in series" :index="num" :item="item" :items="index.items"></series>
  </el-collapse-item>
</template>

<script>
import Series from "./series";
import {deepCopy,labSeriesInit} from "../../../../../unit/baseType";

export default {
  name: "series-bar-line",
  components: {Series},
  props:{
    series:Array,
    index:Object
  },
  data(){
    return{
    }
  },
  methods:{
    //添加项目
    addSeriesItem() {
      let copyData = labSeriesInit()
      this.series.push(copyData)
      this.index.items.push(null)
    }
  }
}
</script>

<style scoped>

</style>
