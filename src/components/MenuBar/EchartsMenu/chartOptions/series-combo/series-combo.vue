<template>
  <el-collapse-item title="数据项配置" name="a-5">
    <el-form-item label="横坐标">
      <el-radio-group v-model="innerIndex.xaxisType" @change="typeChange">
        <el-radio label="region">地域</el-radio>
        <el-radio label="time">时间</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="innerIndex.xaxisType === 'region'" label="地域范围">
      <el-radio-group v-model="innerIndex.xaxisIndex">
        <el-radio label="provinces">31省</el-radio>
        <el-radio label="childAreas">报区域告地域下辖</el-radio>
        <el-radio label="regionAreas">报告区域所属地区</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="innerIndex.xaxisType === 'time'" label="时间范围">
      <el-input v-model="innerIndex.xaxisIndex" />月
    </el-form-item>
<!--    <el-form-item label="纵坐标">-->
<!--    </el-form-item>-->
    <el-form-item label="指标">
      <index-inputer :multiple="true" v-model="selectedIndex"></index-inputer>
    </el-form-item>
    <el-form-item v-if="innerIndex.xaxisType === 'region'" label="时间">
      <index-inputer :multiple="true" type="variety" v-model="selectedVar"></index-inputer>
    </el-form-item>
    <el-form-item v-if="innerIndex.items.length>0" label="图形配置">
      <series-option v-for="(item,index) in index.items" :index="index"
                     :item="item"
                     :additions="additions"
                     :series="innerSeries[index]">
      </series-option>
    </el-form-item>
  </el-collapse-item>
</template>

<script>
import {getIndexList} from "../../../../../request/api";
import {EventBus} from "../../../../../unit/eventBus";
import IndexInputer from "./indexInputer";
import SeriesOption from "./series-option";
import {deepCopy} from "../../../../../unit/baseType";

export default {
  name: "series-combo",
  components: {SeriesOption, IndexInputer},
  props:{
    //图表配置
    series:Array,
    //额外配置（辅助线，放大地区，标记大小）
    additions:Object,
    //数据项
    index:Object
  },
  data(){
    return{
      indexOptions:[],
      innerIndex:deepCopy(this.index),
      innerSeries:deepCopy(this.series),
      innerAdditions:deepCopy(this.additions),
      isFocus:false,
      //选择的指标
      selectedIndex:[...new Set(this.index.items.map(item=>item.indicator))],
      //选择的变量
      selectedVar:[...new Set(this.index.items.map(item=>item.time))],
    }
  },
  watch:{
    innerAdditions: {
      handler(to) {
        this.$emit("additionChange", to);
      },
      deep: true,
      immediate: false
    },
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
        this.seriesInit()
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
    // this.eventBusListener()
  },
  methods:{
    seriesInit(){
      let series = []
      this.comboIndex.forEach((item,index)=>{
        if(this.innerSeries[index]){
          series.push(this.innerSeries[index])
        }else{
          series.push({
            "name": item.time+item.indicator,//指标名称
            "type": "bar",//图表名称
            "symbol":'circle',
            "barWidth": 10,//样式值，根据类型有所不同
            "colorByRegion": false//是否按照区域划分颜色
          })
        }
      })
      this.innerSeries = series
    },
    eventBusListener(){
      EventBus.$on("indexSelect", (item) => {
        if(this.selectedIndex.some(obj=>obj===item.indicator)){
          this.selectedIndex = this.selectedIndex.filter(obj=>obj!==item.indicator)
        }else{
          this.selectedIndex.push(item.indicator)
        }
      });
      EventBus.$on("varSelect", (item) => {
        if(this.selectedVar.some(obj=>obj===item.varKey)){
          this.selectedVar = this.selectedVar.filter(obj=>obj!==item.varKey)
        }else{
          this.selectedVar.push(item.varKey)
        }
      });
    },
    //类型改变，指标初始化
    typeChange(value){
      if(value==='region'){
        this.innerIndex.xaxisIndex = "region"
      }else if(value === 'time'){
        this.innerIndex.xaxisIndex = 12
      }
    }
  }
}
</script>

<style scoped>

</style>
