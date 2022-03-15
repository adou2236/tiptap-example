<template>
  <el-form @submit.native.prevent size="mini" label-position="left">
    <el-form-item label="横轴标题" label-width="90px">
      <el-input placeholder="请输入横坐标轴名称" v-model="options.xAxis.name" />
    </el-form-item>
    <el-form-item label="横轴标题位置">
      <div class="inline-form">
        <el-form-item label="横向位置">
          <el-input-number v-model="options.additions.xNameTop" />
        </el-form-item>
        <el-form-item label="纵向位置">
          <el-input-number v-model="options.additions.xNameLeft" />
        </el-form-item>
      </div>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "xAxisOption",
  props: {
    options: Object,
    chartType:String
  },
  data(){
    return{
      scales:[
        {id:'',label:'无单位'},
        {id:'%',label:'百分号'},
        {id:'‰',label:'千分号'},
      ]
    }
  },
  computed:{
    scale:{
      get(){
        let v = ''
        try {
          v = this.options.xAxis.axisLabel.formatter.split('{value}')[1]
        } catch (error) {
          v = ''
        }
        return v
      },
      set(v){
        let {xAxis} = this.options
        xAxis.axisLabel = {
          formatter : `{value}${v}`
        }
        this.options.xAxis = xAxis
        console.log(this.options.xAxis)
      }
    }
  },
};
</script>
