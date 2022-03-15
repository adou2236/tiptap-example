<template>
  <div >
    <div v-loading="loading">
      <el-button size="mini" type="text" @click="tagInsert('variety')">插入变量</el-button>
      <el-button size="mini" type="text" @click="tagInsert('function')">插入表达式</el-button>
      <el-button size="mini" type="text" @click="tagInsert('formula')">插入公式</el-button>
      <el-button size="mini" type="text" @click="tagInsert('judgement')">插入逻辑判断</el-button>
      <!-- <el-button disabled size="mini" type="text" >插入循环语句</el-button> -->
      <!-- <el-button size="mini" type="text" @click="varsManager">局部变量管理</el-button> -->
    </div>
    <inline-editor ref="inline-editor"
                   :value="content"
                   :range-id="rangeId"
                   @update="handleUpdate"
                   @updateText="handleUpdateText"
                   :varsList="varsList"
                   :functionsList="functionsList">
    </inline-editor>
    <var-manager-dialog v-model="managerDialog"
                        v-if="managerDialog"
                        :id="rangeId"
                        @varsListUpdate="varsListUpdate">
    </var-manager-dialog>

  </div>
</template>

<script>

import {EditorContent} from "@tiptap/vue-2";
import VarManagerDialog from "../../Dialog/varManagerDialog";
import InlineEditor from "../../inlineEditor";
import { getFunctions, getVarsById } from '@/request/templateApi';




export default {
  name: "tagEditor",
  components: {InlineEditor, VarManagerDialog, EditorContent},
  model:{
    prop:"content",
    event:"change"
  },
  props:{
    //外层编辑器对象
    mainEditor:Object,
    content:{
      type:Array,
      default:()=>[]
    },
    rangeId:String
  },
  data(){
    return{
      managerDialog:false,
      innerContent:[],
      editor:null,
      varsList:[],
      functionsList:[],
      loading:false,
    }
  },
  async created(){
    this.loading = true
    Promise.all([
      this.getRangeVarietyList(this.rangeId),
      this.getRangeFunctionList()
    ]).then(res=>{
      this.varsList = res[0]
      this.functionsList = res[1]
      this.loading = false
    })
  },
  methods:{
    //此处的变量层层递进使用
     //获取局部变量列表
    async getRangeVarietyList(rangeId){
      let {data} = await getVarsById(rangeId)
      return data.data.data
    },
    //获取局部函数列表
    async getRangeFunctionList(rangeId){
      let {data} = await getFunctions()
      return data.data
    },
    //修改后同步更新
    varsListUpdate(list){
      this.varsList = list
    },
    handleUpdate(json){
      this.$emit('change',json)
    },
    handleUpdateText(text){
      this.$emit('changeText',text)
    },
    varsManager(){
      this.managerDialog = true
    },
    tagInsert(type){
      this.$refs['inline-editor'].tagType = type
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
