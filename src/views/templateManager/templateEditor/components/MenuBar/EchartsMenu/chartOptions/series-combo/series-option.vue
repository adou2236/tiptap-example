<template>
  <el-form @submit.native.prevent size="mini" class="gray-box" label-position="left">
    {{clickTag.nodeName}}
    <slot></slot>
    <el-form-item label="图像类型：">
        <el-select v-model="series.type" @change="handleTypeChange">
          <el-option v-for="item in chartTypes" :label="item.label" :value="item.id" :key="item.id"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="散点类型：" v-if="series.type === 'scatter'">
      <el-select v-model="series.symbol" @change="scatterShapeChange">
        <el-option v-for="item in symbols" :label="item.label" :value="item.id" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="柱宽：" v-if="series.type === 'bar'||series.type === 'stackBar'">
      <el-input-number :min="1" :step="1" :step-strictly="true" v-model="series.barWidth" @change="barWidthChange"></el-input-number>
    </el-form-item>
    <el-form-item label="堆叠类型：" v-if="series.type === 'stackBar'||series.type === 'stackLine'">
        <el-radio-group v-model="additions.stackType">
          <el-radio label="value">数值堆叠</el-radio>
          <el-radio label="percentage">百分比堆叠</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="颜色：">
      <div class="color-setting">
        <color-picker v-show="currentColor != 'withRegion'" v-model="currentColor" @change="handleChange"></color-picker>
        <el-checkbox v-show="series.type !== 'line' && series.type !== 'stackLine'"
          :checked="currentColor == 'withRegion'" @change="colorMapChange">使用地域组颜色</el-checkbox>
      </div>
    </el-form-item>
    <el-form-item label="图例名称：">
      <el-checkbox v-model="showLegend">显示图例</el-checkbox>
      <el-input :disabled="!showLegend" placeholder="输入图例名称" v-model="rename"></el-input>
    </el-form-item>
    <el-checkbox-group v-model="orderIndex" @change="orderChange">
        <el-checkbox v-show="series.type === 'stackBar'||series.type === 'stackLine'" label="total">按照堆叠高度排序</el-checkbox>
        <el-checkbox  :label="index">按照本指标排序</el-checkbox>
    </el-checkbox-group>
    <i class="el-icon-circle-close close" @click="handleClose"></i>
  </el-form>
</template>

<script>
import { chartColor, deepCopy } from '../../../../../unit/baseType'
import ColorPicker from '../../../../color-picker.vue'
export default {
  components: { ColorPicker },
  name: "series-option",
  props:{
    //图形配置相关
    series:{
      type:Object,
    },
    additions:{
      type:Object,
    },
    clickTag:{
      type:Object
    },
    index:{
      type:[Number,String]
    }
  },
  data(){
    return{
      currentColor:this.additions.colorMap[this.index],
      orderIndex:[this.additions.orderIndex],
      symbols:[
        {id:'circle',label:'圆形'},
        {id:'rect',label:'矩形'},
      ],
      chartTypes:[
        {id:'scatter',label:'散点图'},
        {id:'bar',label:'柱状图'},
        {id:'line',label:'折线图'},
          //需要特殊处理
        {id:'stackBar',label:'堆叠柱状图'},
        {id:'stackLine',label:'堆叠折线图'},
      ]
    }
  },
  computed:{
    showLegend:{
      get(){
        return this.series.name != ''
      },
      set(v){
        if(v){
          this.series.name = null
        }else{
          this.series.name = ''
        }
      }
    },
    rename:{
      get(){
        return this.series.name||''
      },
      set(v){
        if(v==''){
          this.series.name = null
        }else{
          this.series.name = v
        }
      }
    }
  },
  methods:{
    handleClose(){
      this.$emit('close')
    },
    barWidthChange(v){
      this.series.barMaxWidth = v
    },
    scatterShapeChange(v){
      if(v === 'rect'){
        this.series.symbolSize = [15,8]
      }else{
        this.series.symbolSize = [10,10]
      }
    },
    handleChange(v){
      this.additions.colorMap.splice(this.index,1,this.currentColor)
    },
    colorMapChange(v){
      if(v){
        this.currentColor = 'withRegion'
      }else{
        this.currentColor = chartColor[this.index]
      }
      this.additions.colorMap.splice(this.index,1,this.currentColor)
    },
    handleTypeChange(v){
      if(v==='scatter'){
        this.series.symbolSize = [8,8]
        if(this.series.symbol === 'rect'){
          this.series.symbolSize = [15,8]
        }
      }else{
        this.series.symbolSize = undefined
      }
    },
    orderChange(v){
      let valueStr = v.splice(-1)
      this.orderIndex = valueStr
      this.additions.orderIndex = valueStr.toString()
    }
  }
}
</script>

<style lang="scss" scoped>
.gray-box{
  background: #F1F1F1;
  padding: 10px;
  margin-bottom: 20px;
  position: relative;
  .color-setting{
    height: 28px;
    display: flex;
    align-items: center;
    &>span{
      margin-right: 10px;
    }
  }
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 20px;
    &:hover{
      cursor: pointer;
      color: #f19d5f;
    }
  }
}

</style>
