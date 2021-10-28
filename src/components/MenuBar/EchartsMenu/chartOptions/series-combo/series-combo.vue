<template>
  <el-form>
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
    <el-form-item label="指标">
      <index-inputer :tag-clickable="multiple==='index'"
                     :multiple="multiple === 'both'||multiple==='index'"
                     v-model="selectedIndex"
                     @tagClick="handleTagClick"
      ></index-inputer>
    </el-form-item>
    {{multiple}}
    <el-form-item v-if="innerIndex.xaxisType === 'region'" label="时间">
      <index-inputer :tag-clickable="multiple==='var'"
                     :multiple="multiple === 'both'||multiple==='var'"
                     type="variety"
                     v-model="selectedVar"
                     @tagClick="handleTagClick"
      ></index-inputer>
    </el-form-item>
    <series-option  v-if="clickTag"
                    :additions="additions"
                    :clickTag="clickTag"
                    :series="innerSeries[clickTagIndex]">
    </series-option>
  </el-form>
</template>

<script>
import {getIndexList} from "../../../../../request/api";
import {EventBus} from "../../../../../unit/eventBus";
import IndexInputer from "./indexInputer";
import SeriesOption from "./series-option";
import {deepCopy} from "../../../../../unit/baseType";
import {dataAttach} from "../../../../../tools/chartBox/units";

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
      selectedIndex:[...new Set(this.index.items.map(item=>item.indicator))].map(obj=>{
        return {indicator:obj,dataType:'index'}
      }),
      //选择的变量
      selectedVar:[...new Set(this.index.items.map(item=>item.time))].map(obj=>{
        return {varKey:obj,dataType:'variety'}
      }),
      clickTag:null,
      clickTagIndex:null,
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
    multiple(){
      let indexCount = this.selectedIndex.length
      let varCount = this.selectedVar.length
      if(indexCount===1&&varCount>1){
        return 'var'
      }else if(varCount === 1&&indexCount>1){
        return 'index'
      }else {
        return 'both'
      }

    },
    //时间与指标的组合指标
    comboIndex:{
      get(){
        let result = []
        let index = this.selectedIndex
        let time = this.selectedVar
        try {
          for(let i = 0;i<time.length;i++){
            for(let j = 0;j<index.length;j++){
              result.push({
                "time":time[i].varKey,    //时间
                "timeType":"var",   // var:变量  const:常量
                "indicator": index[j].indicator,
                "indicatorType": "const"
              })
            }
          }
        }catch (e) {
        }
        return result
      }
    },
  },
  async mounted() {
    this.eventBusListener()
  },
  methods:{
    eventBusListener(){
      console.log("接收到配置项改变")
      EventBus.$on("optionChange", async (option,id) => {
        this.innerAdditions = deepCopy(option)
      });
    },
    handleTagClick(tag){
      if(tag.dataType === 'index'){
        this.clickTagIndex = this.selectedIndex.findIndex(item=>item.indicator === tag.indicator)
        this.clickTag = this.selectedIndex[this.clickTagIndex]
      }else{
        this.clickTagIndex = this.selectedVar.findIndex(item=>item.varKey === tag.varKey)
        this.clickTag = this.selectedVar[this.clickTagIndex]
      }
    },
    seriesInit(){
      this.clickTag = null
      this.clickTagIndex = null
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
