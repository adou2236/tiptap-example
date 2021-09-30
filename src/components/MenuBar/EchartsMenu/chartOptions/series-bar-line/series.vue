<template>
  <div class="series">
    数据项{{index+1}}
    <el-form-item label="数据指标">
      <el-input v-model="items[index]" />
    </el-form-item>
    <el-form-item label="图像类型">
      <el-select v-model="item.type">
        <el-option label="bar" value="bar"></el-option>
        <el-option label="line" value="line"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="堆叠指数">
      <el-select v-model="item.stack">
        <el-option label="不堆叠" :value="false">不堆叠</el-option>
        <el-option :value="'1'">1</el-option>
        <el-option :value="'2'">2</el-option>
        <el-option :value="'3'">3</el-option>
        <el-option :value="'4'">4</el-option>
        <el-option :value="'5'">5</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="颜色">
      <el-color-picker v-model="item.itemStyle.color"></el-color-picker>
    </el-form-item>
    <bar-opt v-show="item.type === 'bar'" :item="item"></bar-opt>
    <line-opt v-show="item.type === 'line'" :item="item"></line-opt>
    <el-form-item label="项目阴影">
      <el-input-number v-model="item.itemStyle.shadowBlur" :step="1"></el-input-number>
    </el-form-item>
    <el-form-item label="项目阴影颜色">
      <el-color-picker v-model="item.itemStyle.shadowColor"></el-color-picker>
    </el-form-item>
  </div>
</template>

<script>
import barOpt from '../series/bar-opt.vue'
import lineOpt from '../series/line-opt.vue'
import scatterOpt from '../series/scatter-opt.vue'
export default {
  components:{barOpt,lineOpt,scatterOpt},
  props:{
    index:Number,
    item:Object,
    items:Array
  },
  name: "series",
  methods:{
    changeStack(value){
      if(value === false){
        this.item.stack = '1'
      }else{
        this.item.stack = false
      }

    }
  }
}
</script>

<style scoped>
.series{
  background: #c9c7c7;
  margin-top: 10px;
}

</style>
