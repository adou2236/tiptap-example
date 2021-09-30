<template>
  <div>
    外部文本：
    <br/>
    <el-input autofocus type="textarea" v-model="coverText"></el-input>
    <div v-if="type === 'variety'">
      变量内容:
      {{content}}
      <br/>
      <el-select v-model="content">
<!--        这里存后台不可存value，因为数据要根据变量表变化-->
        <el-option v-for="item in vars" :label="item.varKey" :value="item.varKey" :key="item.varKey">
          {{item.varKey}}
        </el-option>
      </el-select>
    </div>
    <div v-if="type === 'function'">
      函数内容:
      <br/>
      <button @click="changeFunction">插入/修改函数</button>
      <br/>
      {{functionJson.toString()}}
    </div>
    <tag-editor v-if="type === 'smart'" :mainEditor="editor"
                :rangeId="editor.getAttributes('custom-tag').id"></tag-editor>
    <function-tag-dialog v-model="visible"
                         v-if="visible"
                         :functionJson="functionJson"
                         @commit="getFunc"></function-tag-dialog>
  </div>
</template>

<script>
import TagEditor from "./tagEditor";
import {getFunctions, getVarsById} from "../../../request/api";
import FunctionTagDialog from "../../Dialog/functionTagDialog";
import {formateFunction, globalVar} from "../../../unit/baseType";
export default {
  name: "TagName",
  components: {FunctionTagDialog, TagEditor},
  props:{
    editor:Object,
    //生效范围ID，全局/局部
    rangeId:String
  },
  data(){
    return {
      vars:[],
      visible:false,
      functions:[],
      functionJson:{},
      data:[
        {type:'string',value:'这是一段常量'},
        {type:'request',value:'这是一段变量'},
        {type:'function',value:'这是一段公式'},
      ]
    }
  },
  computed:{
    type:{
      get(){
        return this.editor.getAttributes('custom-tag').type || ''
      }
    },
    varietyData:{
      get(){
        return this.editor.getAttributes('custom-tag').type || ''
      }
    },
    coverText:{
      get(){
        return this.editor.getAttributes('custom-tag').coverText || ''
      },
      set(v){
        this.editor.chain().updateAttributes('custom-tag', {coverText:v}).run()
        // this.editor.chain().focus().run()
        // this.editor.chain().updateAttributes('custom-tag', {coverText:v}).run()
      }
    },
    content:{
      get(){
        return this.editor.getAttributes('custom-tag').content || ''
      },
      set(v){
        this.editor.chain().updateAttributes('custom-tag', {content:v}).run()
      }
    }
  },
  async created() {
    this.functionJson = new formateFunction(this.content)
    this.vars = await this.getVars(this.rangeId)
  },
  methods:{
    async getVars(id){
      let {data} = await getVarsById(id)
      return data.content.data
    },
    handleFocus(){
      let type = this.editor.getAttributes('custom-tag').type || ''
      this.editor.chain().updateAttributes('custom-tag',{type:'variety'}).run()
      // this.editor.chain().updateAttributes('custom-tag',{type:type}).run()
    },
    changeType(){
      this.editor.chain().updateAttributes('custom-tag',{type:'variety'}).run()
    },
    getFunc(obj){
      this.functionJson = new formateFunction(obj)
      this.editor.chain().updateAttributes('custom-tag',{content:obj}).run()
      this.visible = false
    },
    changeFunction(){
      this.visible = true
    },
    editorOver(e){
      console.log("result",e)
    }
  }
}
</script>

<style lang="scss" scoped>



</style>
