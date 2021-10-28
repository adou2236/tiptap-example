<template>
  <el-form>
    <el-form-item label="地区">
      <el-radio-group v-model="innerIndex.xaxisIndex">
        <el-radio label="provinces">31省</el-radio>
        <el-radio label="childAreas">报区域告地域下辖</el-radio>
        <el-radio label="regionAreas">报告区域所属地区</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="指标">
      {{comboIndex}}
      <index-inputer v-model="dataIndex"></index-inputer>
    </el-form-item>
    <el-form-item label="时间">
      <index-inputer type="variety" v-model="time"></index-inputer>
    </el-form-item>
  </el-form>

<!--    <series :items="index.items"></series>-->
</template>

<script>
import {deepCopy} from "../../../../../unit/baseType";
import Series from "./series";
import IndexInputer from "../series-combo/indexInputer";
import {EventBus} from "../../../../../unit/eventBus";

export default {
  name: "series-pie",
  components: {IndexInputer, Series},
  props:{
    series:Object,
    index:Object,
  },
  data(){
    return{
      innerIndex:deepCopy(this.index),
      innerSeries:deepCopy(this.series),
      //指标
      dataIndex: [...new Set(this.index.items.map(item=>item.indicator))].map(obj=>{
        return {indicator:obj,dataType:'index'}
      }),
      //选择的时间变量
      time: [...new Set(this.index.items.map(item=>item.time))].map(obj=>{
        return {varKey:obj,dataType:'variety'}
      }),
    }
  },
  watch:{
    innerSeries:{
      handler(v,from){
        this.$emit('seriesChange',v)
      },
      immediate:false,
      deep:true
    },
    comboIndex:{
      handler(v){
        let data = {
          ...this.innerIndex,
          items:v
        }
        // this.seriesInit()
        this.$emit('indexChange',data)
      },
      immediate:false,
      deep:true
    }
  },
  computed:{
    //时间与指标的组合指标
    comboIndex:{
      get(){
        let result = []
        try {
          let index = this.dataIndex
          let time = this.time
          result[0]={
            "time":time[0].varKey,    //时间
            "timeType":"var",   // var:变量  const:常量
            "indicator": index[0].indicator,
            "indicatorType": "const"
          }
        }catch (e) {
          result = []
        }
        return result
      }
    },
  },
  created(){
    // this.indexInit()
  },
  methods: {
    seriesInit() {
      let series = []
      this.comboIndex.forEach((item, index) => {
        if (this.innerSeries[index]) {
          series=this.innerSeries[index]
        } else {
          series={
            "type": "pie",//图表类型
            "data":[],//数据
          }
        }
      })
      console.log(series)
      this.innerSeries = series
    },
    handleRemove(tag) {
      this.selectedIndex = this.selectedIndex.filter(obj => obj !== tag)
    },
  }
}
</script>

<style scoped>

</style>
