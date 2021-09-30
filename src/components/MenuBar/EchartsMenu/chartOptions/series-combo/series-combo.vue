<template>
  <el-collapse-item title="数据项配置" name="a-5">
    <el-form-item label="横坐标">
      <el-radio-group v-model="additions.xType" @change="typeChange">
        {{additions}}
        <el-radio label="region">地域</el-radio>
        <el-radio label="time">时间</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="additions.xType === 'region'" label="地域范围">
      <el-radio-group v-model="additions.xIndex">
        <el-radio label="regionCountry">31省</el-radio>
        <el-radio label="regionProvince">报区域告地域下辖</el-radio>
        <el-radio label="regionCity">报告区域所属地区</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="additions.xType === 'time'" label="时间范围">
      <el-input v-model="additions.xIndex" />月
    </el-form-item>
    <el-form-item label="纵坐标">
    </el-form-item>
    <el-form-item label="指标">
      <el-input></el-input>
    </el-form-item>
    <el-form-item v-if="additions.xType === 'region'" label="时间">
      <el-input></el-input>
    </el-form-item>
    <el-form-item v-if="additions.xType === 'time'" label="地域">
      <el-input></el-input>
    </el-form-item>
  </el-collapse-item>
</template>

<script>
export default {
  name: "series-combo",
  props:{
    //图表配置
    series:Array,
    //额外配置（辅助线，放大地区，标记大小）
    additions:Object,
    //数据项
    index:Object
  },
  methods:{
    //类型改变，指标初始化
    typeChange(value){
      if(value==='region'){
        this.additions.xIndex = "regionChina"
      }else if(value === 'time'){
        this.additions.xIndex = 12
      }
    }
  }
}
</script>

<style scoped>

</style>
