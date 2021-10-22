<template>
  <el-dialog
      :visible="dialogVisible"
      @close="handleClose">
    <div class="type-box">
      选择图表类型
      <div class="line-box">
        <div v-for="item in advanceChart"  @click="selectType = item.id" :key="item.id" :class="selectType === item.id?'type active':'type'">{{item.label}}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleCommit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "chartSelect",
  model:{
    prop:'dialogVisible',
    event:'change'
  },
  props:{
    dialogVisible:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      selectType:'lab',
      advanceChart:[
        {id:'pie',label:'饼状图'},
        {id:'scatter',label:'区域气泡图'},
        {id:'map',label:'热力图'},
        {id:'combo',label:'区域组合图'},
      ],
    }
  },
  methods:{
    handleClose(){
      this.$emit("change",false)
    },
    handleCommit(){
      this.$emit('commit',this.selectType)
      this.handleClose()
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
