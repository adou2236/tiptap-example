<template>
  <el-collapse-item title="自定义图像" name="8">
    <el-button @click="addGraphic">添加图形</el-button>
    拖拽改变位置
    <div v-for="(item,index) in graphic" :key="item.id">
      图形{{index+1}}<el-button size="mini" @click="handleDelete(item.id)">删除</el-button>
      <el-input v-model="item.style.text"/>
    </div>
  </el-collapse-item>
</template>

<script>
export default {
  name: "index",
  props:{
    graphic:Array
  },
  mounted() {
    console.log("重新加载")
  },
  methods:{
    handleDelete(id){
      console.log("id",id)
      this.$emit('deleteGraphic',id)
    },
    addGraphic(){
      this.$emit('addGraphic')
    }
  }
}
</script>

<style scoped>

</style>
