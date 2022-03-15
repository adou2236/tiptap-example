<template>
  <el-dialog :visible="dialogVisible"
             width="1200px"
             :title="'插入'+nameMap[type]"
             custom-class="dialog"
             top="10vh"
             @close="handleClose">
    <div class="dialog-content">
      <div class="left">
        <vars-list :vars-list="varsList" @commit="varReceive"></vars-list>
        <functions-list :functions-list="functionsList" @commit="functionReceive"></functions-list>
      </div>
      <div class="main">
        <formula v-if="type == 'formula'" ref="innerEditor" v-model="modelValue"></formula>
        <judgement v-else-if="type == 'judgement'"
                   ref="innerEditor"
                   v-model="modelValue"></judgement>
         <span class="footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleCommit">确定</el-button>
          </span>
      </div>
    </div>
    <function-tag-dialog
        v-if="functionInsertDialog"
        v-model="functionInsertDialog"
        :defaultValue="defaultFunction"
        :functions-list="functionsList"
        :varsList="varsList"
        @commit="fucSetting">
    </function-tag-dialog>
  </el-dialog>
</template>

<script>
import Formula from "./formula";
import Judgement from "./judgement";
import VarsList from "./dataList/varsList";
import FunctionsList from "./dataList/functionsList";
import FunctionTagDialog from "../functionTagDialog";
import {deepCopy, formateFunction, functionToText} from "../../../unit/baseType";
export default {
  name: "index",
  components: {FunctionTagDialog, FunctionsList, VarsList, Formula, Judgement},
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
    },
    varsList:{
      type:Array,
      default:()=>{}
    },
    functionsList:{
      type:Array,
      default:()=>{}
    }
  },
  data(){
    return {
      nameMap:{
        'formula':'公式',
        'judgement':'逻辑判断'
      },
      modelValue:deepCopy(this.defaultValue),
      defaultFunction:{},
      functionInsertDialog:false
    }
  },
  mounted(){
  },
  methods:{
    fucSetting(result){
      let normalText = functionToText(result)
      let tag = {
        "type":"custom-tag",
        "attrs":{
          "type":'function',
          "coverText":normalText,
          "content":result
        },
      }
      this.$refs.innerEditor.tagInsert(tag)
      this.functionInsertDialog = false
    },
    varReceive(e){
       let tag = {
        "type":"custom-tag",
        "attrs":{
          "type":'variety',
          "coverText":e.varKey,
          "content":e.varValue
        },
      }
      this.$refs.innerEditor.tagInsert(tag)
    },
    functionReceive(e){
      let params = e.params.map(item=>{
        return{
          ...item,
          extra:{},
          value:'',
          paramType:'variety'
        }
      })
      e.params = params
      this.defaultFunction = e
      this.functionInsertDialog = true

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

/deep/.el-dialog__header{
  border-bottom: 1px solid #E4E4E4;
}

/deep/.dialog{
  .el-dialog__body{
    padding: 0;
  }
}
.dialog-content{
  display: flex;
  height: 600px;
  .left{
    padding:20px;
    width: 250px;
    border-right:1px solid #E4E4E4;
    box-sizing: border-box;
    &>div{
      height: 50%;
    }
  }
  .main{
    flex:1;
    position: relative;
    padding-bottom: 60px;
    .footer{
      position: absolute;
      right: 20px;
      bottom: 20px;

    }
  }
}



</style>
