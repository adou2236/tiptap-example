<template>
  <div>
    <button @click="handleFocus">聚焦</button>
    外部文本：
    <br/>
    <el-input autofocus type="textarea" v-model="coverText"></el-input>
    <div v-if="type === 'variety'">
      变量内容:
      <br/>
      <el-select v-model="content">
        <el-option label="date" value="date">date</el-option>
        <el-option label="area" value="area">area</el-option>
        <el-option label="index" value="index">index</el-option>
      </el-select>
    </div>
    <div v-if="type === 'function'">
      函数内容:
      <br/>
      <button @click="changeFunction">插入/修改函数</button>
      <br/>
      {{functionJson.toString()}}
    </div>
    <tag-editor v-if="type === 'smart'" :mainEditor="editor"></tag-editor>
    <function-tag-dialog v-model="visible"
                         v-if="visible"
                         :functionJson="functionJson"
                         @commit="getFunc"></function-tag-dialog>
  </div>
</template>

<script>
import TagEditor from "./tagEditor";
import {getFunctions} from "../../../request/api";
import FunctionTagDialog from "../../Dialog/functionTagDialog";
import {formateFunction} from "../../../unit/baseType";
export default {
  name: "TagName",
  components: {FunctionTagDialog, TagEditor},
  props:{
    editor:Object
  },
  data(){
    return {
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
  },
  methods:{
    handleFocus(){
      let type = this.editor.getAttributes('custom-tag').type || ''
      console.log(type)
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
