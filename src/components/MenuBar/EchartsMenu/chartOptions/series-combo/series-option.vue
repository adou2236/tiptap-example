<template>
  <div>
    <div class="gray-box">
      第{{index}}项
      <div>颜色
        <el-color-picker size="mini" v-model="series.color"></el-color-picker>
      </div>
      <div>图像类型
        <el-select v-model="series.type" @change="handleTypeChange">
          <el-option v-for="item in chartTypes" :label="item.label" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </div>
      <div v-if="series.type === 'scatter'">散点类型
        <el-select v-model="series.symbol">
          <el-option v-for="item in symbols" :label="item.label" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </div>
<!--      <div>-->
<!--        <el-checkbox :checked="additions.sortIndex === index" @change="handleChange" :label="index" label="按照此项排序"></el-checkbox>-->
<!--      </div>-->
    </div>

  </div>
</template>

<script>
export default {
  name: "series-option",
  props:{
    //序号
    index:{
      type:Number
    },
    //数据相关
    item:{
      type:Object,
    },
    //图形配置相关
    series:{
      type:Object,
    },
    additions:{
      type:Object,
    }
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
