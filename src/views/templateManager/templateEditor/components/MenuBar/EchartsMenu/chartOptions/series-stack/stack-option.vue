<template>
    <el-form @submit.native.prevent size="mini" class="gray-box" label-position="left">
      {{clickTag.nodeName}}
      <slot></slot>
      <el-form-item label="颜色:">
        <div class="color-setting">
          <color-picker v-model="currentColor" @change="handleChange"></color-picker>
        </div>
      </el-form-item>
      <el-form-item label="图例名称">
        <el-checkbox v-model="showLegend">显示图例</el-checkbox>
        <el-input :disabled="!showLegend" placeholder="输入图例名称" v-model="rename"></el-input>
      </el-form-item>
      <el-checkbox-group v-model="orderIndex" @change="orderChange">
        <el-checkbox label="total">按照堆叠高度排序</el-checkbox>
        <el-checkbox :label="index">按照本指标排序</el-checkbox>
      </el-checkbox-group>
      <i class="el-icon-circle-close close" @click="handleClose"></i>
    </el-form>
</template>

<script>
import { chartColor, deepCopy } from '../../../../../unit/baseType'
import ColorPicker from '../../../../color-picker.vue'
export default {
  components: { ColorPicker },
  name: "stack-option",
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
        return this.series?.name || ''
      },
      set(v){
        if(v == ''){
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
    handleChange(){
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
