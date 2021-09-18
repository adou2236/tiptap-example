<template>
  <div>
    外部文本：
    <br/>
    <button @click="changeType">改变类型</button>
    <el-input type="textarea" v-model="coverText"></el-input>
    <div v-if="type === 'variety'">
      变量内容
      <select>
        <option>date</option>
        <option>area</option>
        <option>index</option>
      </select>
    </div>
    <div v-if="type === 'function'">
      函数内容
      <button @click="changeType">改变type</button>
      <button @click="changeFunction">插入函数</button>
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
        console.log(this.editor)
        return this.editor.getAttributes('custom-tag').content || ''
      }
    }
  },
  async created() {
    this.functionJson = new formateFunction(this.content.name,this.content.params)
  },
  methods:{
    handleFocus(){
      console.log("聚焦")
      this.editor.chain().focus().updateAttributes('custom-tag',{type:"variety"}).run()
    },
    changeType(){
      this.editor.chain().updateAttributes('custom-tag',{type:'variety'}).run()
    },
    getFunc(obj){
      this.functionJson = new formateFunction(obj.name,obj.params)
      this.editor.chain().focus().updateAttributes('custom-tag',{content:obj}).run()
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
