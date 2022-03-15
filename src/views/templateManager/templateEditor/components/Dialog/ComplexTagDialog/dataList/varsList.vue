<template>
  <div >
    变量
    <ul class="list">
      <el-scrollbar >
        <li v-for="(item,index) in varsList"
            :key="index"
            @click="handleClick(item)">{{item.varKey}}</li>
      </el-scrollbar>
    </ul>
  </div>

</template>

<script>
export default {
  name: "varsList",
  props:{
    varsList:{
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

<style scoped>
*{
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}
.list{
  overflow: auto;
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
