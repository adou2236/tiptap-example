<template>
  <div>
    选择图表类型
    <div class="type-box">
      简单图
      <div class="line-box">
        <div v-for="item in simpleChart"  @click="selectType = item.id" :key="item.id" :class="selectType === item.id?'type active':'type'">{{item.label}}</div>
      </div>
      复杂图
      <div class="line-box">
        <div v-for="item in advanceChart"  @click="selectType = item.id" :key="item.id" :class="selectType === item.id?'type active':'type'">{{item.label}}</div>
      </div>
    </div>
    <button @click="handleCommit">确定</button>
  </div>
</template>

<script>
export default {
  name: "chartSelect",
  data(){
    return{
      selectType:'lab',
      simpleChart:[
        {id:'lab',label:'柱状+折线'},
        {id:'pie',label:'饼状图'},
      ],
      advanceChart:[
        {id:'scatter',label:'区域气泡图'},
        {id:'map',label:'热力图'},
        {id:'combo',label:'区域组合图'},
        {id:'cluster',label:'区域簇状柱状图'},
        {id:'stack',label:'区域堆叠柱状图'},
      ],
    }
  },
  methods:{
    handleCommit(){
      this.$emit('commit',this.selectType)
    }
  }
}
</script>

<style lang="scss" scoped>
.type-box{
  .line-box{
    display: flex;
    flex-wrap: wrap;
  }
  .type{
    width: 200px;
    height: 200px;
    margin: 10px;
    border: 1px solid black;
    text-align: center;
    &.active{
      border-color: red;
    }
  }
}


</style>
