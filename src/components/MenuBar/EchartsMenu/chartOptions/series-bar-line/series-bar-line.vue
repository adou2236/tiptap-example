<template>
  <el-collapse-item title="数据项配置" name="7">
    <el-button @click="addSeriesItem" type="primary" size="mini" >添加数据项</el-button>
    <series v-for="(item,index) in series" :index="index" :item="item"></series>
  </el-collapse-item>
</template>

<script>
import Series from "./series";
import {deepCopy} from "../../../../../unit/baseType";
export default {
  name: "series-bar-line",
  components: {Series},
  props:{
    series:Array
  },
  data(){
    return{
    }
  },
  methods:{
    //添加项目
    addSeriesItem() {
      let copyData = deepCopy(this.series[0])
      let newSeries = { ...copyData,dataIndex:undefined}
      this.series.push(newSeries)
    }
  }
}
</script>

<style scoped>

</style>
