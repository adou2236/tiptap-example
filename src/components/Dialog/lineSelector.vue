<template>
  <el-dialog
      title="选择类型"
      :visible="dialogVisible"
      width="30%"
      @close="handleClose">
    <el-radio-group v-model="type">
      <el-radio label="single">单列</el-radio>
      <el-radio label="double">双列</el-radio>
    </el-radio-group>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleCommit">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
export default {
  name: "lineSelector",
  model:{
    prop:'dialogVisible',
    event:'change',
  },
  props:{
    dialogVisible:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      type:'single'
    }
  },
  methods:{
    handleCommit(){
      this.$emit('commit',this.type)
    },
    handleClose(){
      this.$emit('change',false)
    }
  }
}
</script>

<style scoped>

</style>
