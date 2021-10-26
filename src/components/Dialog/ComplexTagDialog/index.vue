<template>
  <el-dialog :visible="dialogVisible"
             width="1200px"
             @close="handleClose">
    <div class="dialog-content">
      <div class="left">
        <vars-list :vars-list="varsList" @commit="varReceive"></vars-list>
        <functions-list :functions-list="functionsList" @commit="functionReceive"></functions-list>
      </div>
      <div class="main">
        <formula ref="innerEditor" v-model="modelValue"></formula>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleCommit">确定</el-button>
    </span>
    <function-tag-dialog
        v-if="functionInsertDialog"
        v-model="functionInsertDialog"
        :defaultValue="defaultFunction"
        @commit="fucSetting"></function-tag-dialog>
  </el-dialog>
</template>

<script>
import Formula from "./formula";
import {getFunctions, getVarsById} from "../../../request/api";
import VarsList from "./dataList/varsList";
import FunctionsList from "./dataList/functionsList";
import FunctionTagDialog from "../functionTagDialog";
import {deepCopy} from "../../../unit/baseType";
export default {
  name: "index",
  components: {FunctionTagDialog, FunctionsList, VarsList, Formula},
  model:{
    prop:'dialogVisible',
    event:'change'
  },
  props:{
    dialogVisible:{
      type:Boolean,
      default:false
    },
    //局部ID
    rangeId:{
      type:String,
      default:''
    },
    type:{
      type:String,
      default:'formula'
    },
    defaultValue:{
      type:[Object,Array,String]
    }
  },
  data(){
    return {
      modelValue:deepCopy(this.defaultValue),
      varsList:[],
      functionsList:[],
      defaultFunction:{},
      functionInsertDialog:false
    }
  },
  mounted(){
    this.handleOpen()
  },
  methods:{
    fucSetting(result){
      let json = result
      this.$refs.innerEditor.editor.chain().focus().insertContent({
        "type":"custom-tag",
        "attrs":{
          "type":'function',
          "coverText":'这是一个函数',
          "content":json
        },
      }).run()
      this.functionInsertDialog = false
    },
    varReceive(e){
      this.$refs.innerEditor.editor.chain().focus().insertContent({
        "type":"custom-tag",
        "attrs":{
          "type":'variety',
          "coverText":e.varValue,
          "content":e.varKey
        },
      }).run()
    },
    functionReceive(e){
      this.defaultFunction = e
      this.functionInsertDialog = true

    },
    async handleOpen(){
      this.varsList = await this.getVarsList(this.rangeId)
      this.functionsList = await this.getFunctionsList()
    },
    async getVarsList(id){
      let {data} = await getVarsById(id)
      return data.content.data
    },
    async getFunctionsList(){
      let {data} = await getFunctions()
      return data.content
    },
    handleClose(){
      this.$emit('change',false)
    },
    handleCommit(){
      this.$emit('commit',this.type,this.modelValue)
    }

  }
}
</script>

<style lang="scss" scoped>
.dialog-content{
  display: flex;

}


</style>
