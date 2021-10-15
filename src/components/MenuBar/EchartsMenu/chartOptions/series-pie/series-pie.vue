<template>
  <el-collapse-item title="数据项配置" name="a-3">
    <el-form-item label="地区">
      <el-radio-group v-model="innerIndex.xaxisIndex">
        <el-radio label="provinces">31省</el-radio>
        <el-radio label="childAreas">报区域告地域下辖</el-radio>
        <el-radio label="regionAreas">报告区域所属地区</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="指标">
      <index-inputer v-model="selectedIndex"></index-inputer>
    </el-form-item>
    <el-form-item label="时间">
      <index-inputer v-model="selectedVar"></index-inputer>
    </el-form-item>
<!--    <series :items="index.items"></series>-->
  </el-collapse-item>
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
      //选择的指标
      selectedIndex:[...new Set(this.index.items.map(item=>item.indicator))],
      //选择的变量
      selectedVar:[...new Set(this.index.items.map(item=>item.time))],
    }
  },
  watch:{
    innerSeries:{
      handler(v,from){
        console.log(v)
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
        let index = this.selectedIndex
        let time = this.selectedVar
        for(let i = 0;i<time.length;i++){
          for(let j = 0;j<index.length;j++){
            result.push({
              "time":time[i],    //时间
              "timeType":"var",   // var:变量  const:常量
              "indicator": index[j],
              "indicatorType": "const"
            })
          }
        }
        return result
      }
    },
  },
  async mounted() {
    this.eventBusListener()
  },
  methods: {
    seriesInit() {
      let series = []
      console.log(this.comboIndex,this.innerIndex)
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
    eventBusListener() {
      EventBus.$on("indexSelect", (item) => {
        if (this.selectedIndex.some(obj => obj === item.indicator)) {
          this.selectedIndex = this.selectedIndex.filter(obj => obj !== item.indicator)
        } else {
          this.selectedIndex.push(item.indicator)
        }
      });
      EventBus.$on("varSelect", (item) => {
        if (this.selectedVar.some(obj => obj === item.varKey)) {
          this.selectedVar = this.selectedVar.filter(obj => obj !== item.varKey)
        } else {
          this.selectedVar.push(item.varKey)
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
