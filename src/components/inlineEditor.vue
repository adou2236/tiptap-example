<template>
  <div>
    <editor-content class="content-editor" :editor="editor"/>
    <variety-tag-dialog v-if="varietyDialogShow"
                        v-model="varietyDialogShow"
                        :defaultValue="defaultValue"
                        :range-id="rangeId"
                        @commit="(data)=>tagInsertCommit('variety',data)">
    </variety-tag-dialog>
    <function-tag-dialog  v-if="functionDialogShow"
                          v-model="functionDialogShow"
                          :defaultValue="defaultValue"
                          @commit="(data)=>tagInsertCommit('function',data)">
    </function-tag-dialog>
    <complex-tag-dialog v-if="complexDialogShow"
                        v-model="complexDialogShow"
                        :defaultValue="defaultValue"
                        :range-id="rangeId"
                        :type="tagType"
                        @commit="tagInsertCommit">
    </complex-tag-dialog>
  </div>


</template>

<script>
import {Editor, EditorContent} from '@tiptap/vue-2'
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import CustomerTag from "../tools/customerTag/Extension";
import VarietyTagDialog from "./Dialog/varietyTagDialog";
import FunctionTagDialog from "./Dialog/functionTagDialog";
import ComplexTagDialog from "./Dialog/ComplexTagDialog/index"
import {Plugin, PluginKey} from "prosemirror-state";


export default {
  name: "inlineEditor",
  components:{FunctionTagDialog, VarietyTagDialog, ComplexTagDialog, EditorContent},
  model:{
    prop:'value',
    event:'change'
  },
  props:{
    value:{
      type:[String,Array]
    },
    rangeId:{
      type:String
    },
  },
  data(){
    return{
      editor:null,
      tagType:null,
      dialogShow:false,
      defaultValue:null,
      defaultProps:[
        StarterKit,
        Document,
        Paragraph,
        Text,
        CustomerTag,
      ],
    }
  },
  created(){
    this.editorInit()
  },
  computed:{
    varietyDialogShow:{
      get(){
        return this.tagType === 'variety'
      },
      set(v){
        if(!v){
          this.tagType = null
        }
      },
    },
    functionDialogShow:{
      get(){
        return this.tagType === 'function'
      },
      set(v){
        if(!v){
          this.tagType = null
        }
      },
    },
    complexDialogShow:{
      get(){
        return this.tagType&&this.tagType !== 'variety'&&this.tagType!=='function'
      },
      set(v){
        if(!v){
          this.tagType = null
        }
      },
    },
    editorJson(){
      return{
        type:'doc',
        content:[{
          type:'paragraph',
          content:this.value || []
        }]
      }
    }
  },
  methods:{
    //获取局部变量列表
    getRangeVarietyList(rangeId){

    },
    //获取局部函数列表
    getRangeFunctionList(rangeId){

    },
    tagInsertCommit(type,e){
      console.log("插入的数据",e)
      this.editor.chain().focus().insertContent({
        "type":"custom-tag",
        "attrs":{
          "type":type,
          "coverText":type,
          "content":e
        },
      }).run()
      this.tagType = null
    },
    editorInit(){
      let that = this
      this.editor = new Editor({
        extensions: this.defaultProps,
        content: this.editorJson,
        editable: true,
        editorProps: {
          handleKeyDown(view,event) {
            return event.key == 'Enter';
          },
        },
        onCreate({editor}){
        },
        onUpdate({editor}){
          let json = editor.getJSON()
          that.$emit('update',json.content[0].content)
        },
        onTagDoubleClick({attrs}){
          that.tagType = attrs.type
          that.defaultValue = attrs.content
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content-editor{
  border: 1px solid #D8D8D8;
  padding: 20px;
  /deep/.ProseMirror {
    &:focus-visible {
      outline: none;
    }
  }
}

</style>
