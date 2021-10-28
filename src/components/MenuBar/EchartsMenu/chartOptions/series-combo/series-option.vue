<template>
    <el-form class="gray-box">
<!--      <div>颜色-->
<!--        <el-color-picker size="mini" v-model="series.color"></el-color-picker>-->
<!--      </div>-->
      {{clickTag.dataType==='index'?clickTag.indicator:clickTag.varKey}}
      <el-form-item label="图像类型">
          <el-select v-model="series.type" @change="handleTypeChange">
            <el-option v-for="item in chartTypes" :label="item.label" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="散点类型" v-if="series.type === 'scatter'">
        <el-select v-model="series.symbol">
          <el-option v-for="item in symbols" :label="item.label" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
<!--      <div>-->
<!--        <el-checkbox :checked="additions.sortIndex === index" @change="handleChange" :label="index" label="按照此项排序"></el-checkbox>-->
<!--      </div>-->
    </el-form>
</template>

<script>
export default {
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
  },
  data(){
    return{
      symbols:[
        {id:'circle',label:'圆形'},
        {id:'rect',label:'矩形'}
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
  methods:{
    handleTypeChange(v){
    },
    handleChange(v){
      if(v){
        this.additions.sortIndex = this.index
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gray-box{
  background: #d4d4d4;
  padding: 10px;
}

</style>
