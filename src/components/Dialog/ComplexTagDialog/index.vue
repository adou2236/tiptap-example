<template>
  <el-dialog :visible="dialogVisible"
             @open="handleOpen"
             @close="handleClose">
    <div class="dialog-content">
      <div class="left">
        <vars-list :vars-list="varsList" @commit="varReceive"></vars-list>
        <functions-list :functions-list="functionsList" @commit="functionReceive"></functions-list>
      </div>
      <div class="main">
        <formula ref="innerEditor" v-model="defaultValue"></formula>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleCommit">确定</el-button>
    </span>
    <function-tag-dialog
        v-model="functionInsertDialog"
        :function-json="defaultFunction" @commit="fucSetting"></function-tag-dialog>
  </el-dialog>
</template>

<script>
import Formula from "./formula";
import {getFunctions, getVarsById} from "../../../request/api";
import VarsList from "./dataList/varsList";
import FunctionsList from "./dataList/functionsList";
import FunctionTagDialog from "../functionTagDialog";
import {formateFunction} from "../../../unit/baseType";
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
    areaId:{
      type:String,
      default:''
    },
    type:{
      type:String,
      default:'formula'
    }
  },
  data(){
    return {
      defaultValue:[],
      varsList:[],
      functionsList:[],
      defaultFunction:{},
      functionInsertDialog:false
    }
  },
  methods:{
    fucSetting(result){
      let json = new formateFunction(result)
      this.$refs.innerEditor.editor.chain().focus().insertContent({
        "type":"custom-tag",
        "attrs":{
          "type":'function',
          "coverText":json.toString(),
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
      this.varsList = await this.getVarsList(this.areaId)
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
      this.$emit('commit',this.type,this.defaultValue)
    }

  }
}
</script>

<style lang="scss" scoped>
.dialog-content{
  display: flex;

}


</style>
