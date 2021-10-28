<template>
  <el-form>
    <el-form-item label="地图">
      <el-radio-group v-model="innerIndex.xaxisIndex">
        <el-radio label="provinces">31省</el-radio>
        <el-radio label="childAreas">报区域告地域下辖</el-radio>
        <el-radio label="csj">长三角</el-radio>
        <el-radio label="yga">粤港澳</el-radio>
        <el-radio label="jjj">京津冀</el-radio>
        <el-radio label="cy">成渝</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="指标">
      <index-inputer v-model="xIndex"></index-inputer>
    </el-form-item>
    <el-form-item label="时间">
      <index-inputer type="variety" v-model="time"></index-inputer>
    </el-form-item>
  </el-form>

</template>

<script>
import IndexInputer from "../series-combo/indexInputer";
import {deepCopy} from "../../../../../unit/baseType";
export default {
  name: "series-map",
  components: {IndexInputer},
  props:{
    series:Array,
    index:Object,
  },
  data(){
    return{
      innerIndex:deepCopy(this.index),
      innerSeries:deepCopy(this.series),
      innerAdditions:deepCopy(this.additions),
      //横坐标指标
      xIndex: [...new Set(this.index.items.map(item=>item.indicator))].map(obj=>{
        return {indicator:obj,dataType:'index'}
      }),
      //选择的时间变量
        time: [...new Set(this.index.items.map(item=>item.time))].map(obj=>{
        return {varKey:obj,dataType:'variety'}
      }),
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
    comboIndex:{
      handler(v){
        let data = {
          ...this.innerIndex,
          items:v
        }
        this.$emit('indexChange',data)
      },
      immediate:false,
      deep:true
    }
  },
  computed:{
    comboIndex:{
      get(){
        let result = []
        try {
          result[0] = {
            "time": this.time[0].varKey,    //时间
            "timeType": "var",   // var:变量  const:常量
            "indicator": this.xIndex[0].indicator,
            "indicatorType": "const"
          }
        }catch (e) {
          result = []
        }
        return result
      }
    },
    locationPinArr:{
      get(){
        return this.innerAdditions.locationPin ? this.innerAdditions.locationPin.toString() : ''
      },
      set(v){
        this.innerAdditions.locationPin = v.split(',')
      }
    }
  },
  created(){
    // this.indexInit()
  },
  methods: {
    // indexInit(){
    //   this.xIndex = this.innerIndex.items[0].indicator || ''
    //   this.time = this.innerIndex.items[0].time
    // },
    handleRemove(tag) {
      this.selectedIndex = this.selectedIndex.filter(obj => obj !== tag)
    },
  }
}
</script>

<style scoped>

</style>
