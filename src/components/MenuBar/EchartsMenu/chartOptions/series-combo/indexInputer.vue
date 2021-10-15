<template>
  <div class="input-area">
    <el-tag
        v-for="(tag,index) in list"
        :key="index"
        closable
        @close="handleClose(tag)">
      {{tag}}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: "indexInputer",
  model:{
    prop:'list',
    event:'change'
  },
  props:{
    /**
     * 是否可多选，多选状态下响应点击事件
     */
    multiple:{
      type:Boolean,
      default:true
    },
    /**
     * 键值对应关系
     */
    list:{
      type:Array,
      default:()=>[]
    }
  },
  methods:{
    handleClose(tag){
      let list = this.list
      list.splice(list.findIndex(item=>item=== tag),1)
      this.$emit('change',list)
    }
  }
}
</script>

<style scoped>
.input-area{
  border: 1px solid black;
  padding: 5px;
  min-height: 20px;
}

</style>
