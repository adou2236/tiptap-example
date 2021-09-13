<template>
  <el-collapse-item title="数据项配置" name="7">
    <el-form-item label="横坐标指标">
      <el-input v-model="series[0].dataIndex[0]"></el-input>
    </el-form-item>
    <el-form-item label="纵坐标指标">
      <el-input v-model="series[0].dataIndex[1]"></el-input>
    </el-form-item>
    <el-form-item label="标记大小">
      <el-input-number v-model="additions.symbolSize"></el-input-number>
    </el-form-item>
    <el-form-item label="标签显隐">
      <el-switch v-model="labShow"></el-switch>
    </el-form-item>
    <el-form-item label="标签位置" :disabled="!labShow">
      <el-input v-model="labPosX"></el-input>
      <el-input v-model="labPosY"></el-input>
    </el-form-item>
    <el-form-item label="标签连线显隐">
      <el-switch v-model="labLine"></el-switch>
    </el-form-item>
    <el-form-item label="地域范围">
    </el-form-item>
    <el-table :data="geography" size="mini">
      <el-table-column label="地区" prop="label"></el-table-column>
      <el-table-column label="颜色">
        <template slot-scope="{row}">
          <el-color-picker size="mini" v-model="series.find(item=>item.name === row.label).itemStyle.color"></el-color-picker>
        </template>
      </el-table-column>
      <el-table-column label="数据标签">
        <template slot-scope="{row}">
          <el-radio-group v-model="series.find(item=>item.name === row.label).label.formatter">
            <el-radio label="{c}">数值</el-radio>
            <el-radio label="{b}">地域</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>

    </el-table>
    <el-divider></el-divider>
    <el-form-item label="突出地区，逗号分隔">
      <el-input v-model="locationPin"></el-input>
    </el-form-item>
    <el-form-item label="参考线">
      <el-button @click="addMarkLine">添加参考线</el-button>
    </el-form-item>
    <el-table :data="additions.markLine" size="mini">
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

export default {
  name: "series-scatter",
  props:{
    series:Array,
    additions:Object
  },
  data(){
    return{
      geography
    }
  },
  computed:{
    locationPin:{
      get(){
        return this.additions.locationPin ? this.additions.locationPin.toString() : ''
      },
      set(v){
        console.log( v.split(','))
        this.additions.locationPin = v.split(',')
      }
    },
    labLine:{
      get(){
        return this.series[0].labelLine.show
      },
      set(v){
        this.series.forEach(item=>{
          item.labelLine.show = v
        })

      }
    },
    labPosX:{
      get(){
        return this.series[0].label.position[0]
      },
      set(v){
        this.series.forEach(item=>{
          item.label.position[0] = v
        })
      }
    },
    labPosY:{
      get(){
        return this.series[0].label.position[1]
      },
      set(v){
        this.series.forEach(item=>{
          item.label.position[1] = v
        })
      }
    },
    labShow:{
      get(){
        return this.series[0].label.show
      },
      set(v){
        this.series.forEach(item=>{
          item.label.show = v
        })

      }
    },
    symbolSize:{
      get(){
        return this.series[0].symbolSize
      },
      set(v){
        this.series.forEach(item=>{
          item.symbolSize = v
        })
      }
    }

  },
  methods:{
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
