<template>
  <el-dialog :visible="dialogVisible"
              title="插入变量"
              append-to-body
              width="610px"
              style="border-radius:10px"
              :close-on-click-modal="false"
              @close="handleClose">
   <el-select class="variety-selector" v-model="modelValue">
     <el-option v-for="item in varsList" :key="item.id"
                :value="item.varValue+item.varKey"
                :label="item.varKey"></el-option>
   </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleCommit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

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
      type:[String,Number],
      default:''
    },
    defaultValue:{
      type:[String,Object],
      default:()=>{
        return{}
      }
    },
    varsList:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return{
      value:'',
      modelValue:''
    }
  },
  mounted(){
    this.modelValue = this.defaultValue?.varValue+this.defaultValue?.varKey || ''
  },
  methods:{
    handleCommit(){
      let choosedVar = this.varsList.find(item=>item.varValue+item.varKey === this.modelValue)
      this.$emit('commit',choosedVar)
    },
    handleClose(){
      this.$emit('change',false)
    },
  }
}
</script>

<style lang="scss" scoped>

.variety-selector{
  width: 60%;
  left: 50%;
  transform: translateX(-50%);
}
/deep/.el-dialog__header{
  border-bottom: 1px solid #E4E4E4;
}


</style>
