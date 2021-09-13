<template>
  <div>
    选择图表类型
    <div class="type-box">
      <div v-for="item in chartType"  @click="selectType = item.id" :key="item.id" :class="selectType === item.id?'type active':'type'">{{item.label}}</div>
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
      chartType:[
        {id:'lab',label:'柱状+折线'},
        {id:'pie',label:'饼状图'},
        {id:'scatter',label:'中国地区气泡图'},
        {id:'map',label:'热力图'},
      ]
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
  display: flex;
  flex-wrap: wrap;
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
