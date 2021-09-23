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
    <div v-show="item.type === 'bar'">
      <el-form-item label="柱条背景显示">
        <el-switch v-model="item.showBackground"></el-switch>
      </el-form-item>
      <el-form-item label="柱条宽度">
        <el-input-number v-model="item.barWidth" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="边框颜色">
        <el-color-picker v-model="item.itemStyle.borderColor"></el-color-picker>
      </el-form-item>
      <el-form-item label="边框宽度">
        <el-input-number v-model="item.itemStyle.borderWidth" :step="0.5"></el-input-number>
      </el-form-item>
      <el-form-item label="圆角">
        <el-input-number v-model="item.itemStyle.borderRadius" :step="1"></el-input-number>
      </el-form-item>
    </div>
    <div v-show="item.type === 'line'">
      <el-form-item label="平滑曲线">
        <el-switch v-model="item.smooth"></el-switch>
      </el-form-item>
      <el-form-item label="线条宽度">
        <el-input-number v-model="item.lineStyle.width" :max="10" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="线条颜色">
        <el-color-picker v-model="item.lineStyle.color"></el-color-picker>
      </el-form-item>
      <el-form-item label="区域颜色">
        <el-color-picker v-model="item.areaStyle.color"></el-color-picker>
      </el-form-item>
    </div>
    <el-form-item label="边框类型">
      <el-select v-model="item.itemStyle.borderType">
        <el-option label="solid" value="solid"></el-option>
        <el-option label="dashed" value="dashed"></el-option>
        <el-option label="dotted" value="dotted"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="项目阴影">
      <el-input-number v-model="item.itemStyle.shadowBlur" :step="1"></el-input-number>
    </el-form-item>
    <el-form-item label="项目阴影颜色">
      <el-color-picker v-model="item.itemStyle.shadowColor"></el-color-picker>
    </el-form-item>
  </div>
</template>

<script>
export default {
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
