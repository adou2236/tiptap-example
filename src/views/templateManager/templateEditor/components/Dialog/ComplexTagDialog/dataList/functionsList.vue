<template>
  <div >
    函数
    <ul class="list">
      <el-scrollbar >
          <el-tooltip v-for="(item,index) in functionsList" :key="index"
          placement="left"
          :content="item.nameZh">
            <li @click="handleClick(item)">{{item.nameEn}}</li>
          </el-tooltip>
      </el-scrollbar>
    </ul>
  </div>
</template>

<script>
export default {
  name: "functionsList",
  props:{
    functionsList:{
      type:Array,
      default:()=>[]
    }
  },
  methods:{
    handleClick(item){
      this.$emit('commit',item)
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

.list{
  overflow-y: auto;
  padding: 0;
  height: 80%;
}
li{
  list-style: none;
  cursor: pointer;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color:#979797
}
li:hover{
  background: #D8D8D8;
}
</style>
