<template>
  <el-collapse-item title="数据项配置" name="a-4">
<!--    <el-form-item label="横坐标指标">-->
<!--      <el-input v-model="index.items[0]"></el-input>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="纵坐标指标">-->
<!--      <el-input v-model="index.items[1]"></el-input>-->
<!--    </el-form-item>-->
    <el-form-item label="标记大小">
      <el-input-number v-model="innerAdditions.symbolSize"></el-input-number>
    </el-form-item>
    <el-form-item label="标签显隐">
      <el-switch v-model="innerAdditions.labShow"></el-switch>
    </el-form-item>
<!--    <el-form-item label="标签位置" :disabled="!innerAdditions.labShow">-->
<!--      <el-input v-model="innerAdditions.labPosX"></el-input>-->
<!--      <el-input v-model="innerAdditions.labPosY"></el-input>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="标签连线显隐">-->
<!--      <el-switch v-model="innerAdditions.labLine"></el-switch>-->
<!--    </el-form-item>-->
    <el-form-item label="横坐标指标">
      <index-inputer v-model="xIndex"></index-inputer>
    </el-form-item>
    <el-form-item label="纵坐标指标">
      <index-inputer v-model="yIndex"></index-inputer>
    </el-form-item>
    <el-form-item label="时间">
      <index-inputer type="variety" v-model="time"></index-inputer>
    </el-form-item>
    <el-form-item label="地域范围">
      <el-radio-group v-model="innerIndex.xaxisIndex">
        <el-radio label="provinces">31省</el-radio>
        <el-radio label="childAreas">报区域告地域下辖</el-radio>
        <el-radio label="regionAreas">报告区域所属地区</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-table :data="innerAdditions.group" size="mini">
      <el-table-column label="地区" prop="label"></el-table-column>
      <el-table-column label="颜色">
        <template slot-scope="{row}">
          <el-color-picker size="mini" v-model="row.color"></el-color-picker>
        </template>
      </el-table-column>
      <el-table-column label="数据标签">
        <template slot-scope="{row}">
          <el-radio-group v-model="row.labelFormatter">
            <el-radio label="{c}">数值</el-radio>
            <el-radio label="{b}">地域</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
    </el-table>
    <el-divider></el-divider>
    <el-form-item label="突出地区，逗号分隔">
      <el-input v-model="locationPinArr"></el-input>
    </el-form-item>
    <el-form-item label="参考线">
      <el-button @click="addMarkLine">添加参考线</el-button>
    </el-form-item>
    <el-table :data="innerAdditions.markLine" size="mini">
      <el-table-column label="名称">
        <template slot-scope="{row}">
          <el-input size="mini" v-model="row.name"/>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="{row}">
          <el-select size="mini" v-model="row.axis">
            <el-option value="xAxis" label="x轴">x轴</el-option>
            <el-option value="yAxis" label="y轴">y轴</el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="数值">
        <template slot-scope="{row}">
          <el-input size="mini" v-model="row.value"/>
        </template>
      </el-table-column>
    </el-table>

  </el-collapse-item>
</template>

<script>
import {geography} from "../../../../../assets/maps";
import IndexInputer from "../series-combo/indexInputer";
import {chartColor, deepCopy} from "../../../../../unit/baseType";

export default {
  name: "series-scatter",
  components: {IndexInputer},
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
      geography,
      group:[],
      innerIndex:deepCopy(this.index),
      innerSeries:deepCopy(this.series),
      innerAdditions:deepCopy(this.additions),
      //横坐标指标
      xIndex: '',
      //纵坐标指标
      yIndex: '',
      //选择的时间
      time: ''
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
        if(this.time&&this.xIndex){
          result[0] = {
            "time": this.time,    //时间
            "timeType": "var",   // var:变量  const:常量
            "indicator": this.xIndex,
            "indicatorType": "const"
          }
        }
        if(this.time&&this.yIndex){
          result[1] = {
            "time": this.time,    //时间
            "timeType": "var",   // var:变量  const:常量
            "indicator": this.yIndex,
            "indicatorType": "const"
          }
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
    // this.groupInit()
    this.indexInit()
  },
  methods:{
    indexInit(){
      this.xIndex = this.innerIndex.items[0].indicator || ''
      this.yIndex = this.innerIndex.items[1].indicator || ''
      this.time = this.innerIndex.items[0].time
    },
    groupInit(){
      this.group = [
        {id: 'west', label: '西部', children:['新疆','甘肃','内蒙古','西藏','青海','宁夏','陕西','四川','重庆','云南','贵州','广西'], color: chartColor[0], labelFormatter: "{b}"},
        {id: 'east', label: '东部', children:['北京','上海','天津','河北','山东','江苏','浙江','福建','广东'], color: chartColor[1], labelFormatter: "{b}"},
        {id: 'center', label: '中部', children:['山西','河南','湖北','安徽','湖南','江西','海南'], color: chartColor[2], labelFormatter: "{b}"},
        {id: 'north-east', label: '东北部', children:['黑龙江','吉林','辽宁'], color: chartColor[3], labelFormatter: "{b}"},
      ]
      this.innerAdditions.group = this.group
    },
    addMarkLine(){
      this.additions.markLine.push({
        name:'新参考线',
        axis:'xAxis',
        value:0,
      })
    }

  }
}
</script>

<style scoped>

</style>
