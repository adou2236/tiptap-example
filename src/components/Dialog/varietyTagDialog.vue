<template>
  <el-dialog :visible="dialogVisible"
             title="插入变量"
             append-to-body
              @close="handleClose">
   <el-select v-model="modelValue">
     <el-option v-for="item in varsList" :value="item.varValue" :label="item.varKey"></el-option>
   </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleCommit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getFunctions, getVarsById} from "../../request/api";

export default {
  name: "varietyTagDialog",
  model:{
    prop:'dialogVisible',
    event:'change'
  },
  props:{
    dialogVisible:{
      type:Boolean,
      default:false
    },
    rangeId:{
      type:String,
      default:''
    },
    defaultValue:{
      type:[String,Object]
    }
  },
  data(){
    return{
      value:'',
      varsList:[],
      modelValue:this.defaultValue
    }
  },
  mounted(){
    this.handleOpen()
  },
  methods:{
    handleCommit(){
      this.$emit('commit',this.modelValue)
    },
    handleClose(){
      this.$emit('change',false)
    },
    async handleOpen(){
      this.varsList = await this.getVarsList(this.rangeId)
    },
    async getVarsList(id){
      let {data} = await getVarsById(id)
      return data.content.data
    },
  }
}
</script>

<style scoped>

</style>
