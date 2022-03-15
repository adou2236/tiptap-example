<template>
  <div>
    <editor-content class="content-editor" :editor="editor"/>
    <!-- 变量编辑 -->
    <variety-tag-dialog v-if="varietyDialogShow"
                        v-model="varietyDialogShow"
                        :varsList="varsList"
                        :defaultValue="defaultValue"
                        :range-id="rangeId"
                        @commit="(data)=>tagInsertCommit('variety',data)">
    </variety-tag-dialog>
    <!-- 公式判断 -->
    <function-tag-dialog  v-if="functionDialogShow"
                          v-model="functionDialogShow"
                          :functionsList="functionsList"
                          :varsList="varsList"
                          :defaultValue="defaultValue"
                          @commit="(data)=>tagInsertCommit('function',data)">
    </function-tag-dialog>
    <!-- 其他复杂文本（函数，逻辑判断，循环语句） -->
    <complex-tag-dialog v-if="complexDialogShow"
                        v-model="complexDialogShow"
                        :defaultValue="defaultValue"
                        :varsList="varsList"
                        :functionsList="functionsList"
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
import { functionToText } from '../unit/baseType';
import { throttle } from '../../../../utils/util';

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
      type:[String,Number]
    },
    varsList:{
      type:Array,
      default:()=>[]
    },
    functionsList:{
      type:Array,
      default:()=>[]
    }
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
      let arrayValue = []
      if(Array.isArray(this.value)){
        arrayValue = this.value
      }else{
        arrayValue = [{type:'text',text:this.value}]
      }
      return{
        type:'doc',
        content:[{
          type:'paragraph',
          content:arrayValue || []
        }]
      }
    }
  },
  watch:{
    value:{
      handler(){
        this.editor.chain().setContent(this.editorJson).focus().run()
      },
      deep:true
    }
  },
  methods:{
    tagInsertCommit(type,e){
      //表现值赋值
      let coverText = ''
      if(type === 'variety'){
        coverText = e.varKey
      }else if(type === 'function'){
        coverText = functionToText(e)
      }else if(type === 'formula'){
         coverText=this.formulaToText(e)
      }else if(type === 'judgement'){
        coverText = this.judgementToText(e)
      }else{
        coveText = 'undefined'
      }
      this.editor.chain().focus().insertContent({
        "type":"custom-tag",
        "attrs":{
          "type":type,
          "coverText":coverText,
          "content":e
        },
      }).run()
      this.tagType = null
    },
    formulaToText(value){
      let result = ''
      value.forEach(obj=>{
        let type = obj.type
        switch(type){
          case 'custom-tag':
            result += obj?.attrs.coverText
            break;
          case 'text':
            result += obj?.text
            break;
          default:
            result += 'undefined'
        }
      })
      return result
    },
    judgementToText(obj){
      let result = 'switch{'
      let cases = obj.filter(item=>item.type === 'case') || []
      let defaultCase = obj.find(item=>item.type === 'default') || null
      cases.forEach(item=>{
        result+=`case (${this.formulaToText(item.formula)}${item.symbol}${item.standValue}): return ${this.formulaToText(item.coverText)};`
      })
      result += `default: return ${this.formulaToText(defaultCase.coverText)}}`
      return result
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
          //此处获取json与内部纯文本
          throttle(()=>{
            let json = editor.getJSON()
            let text = editor.getText()
            that.$emit('update',json.content[0]?.content || '')
            that.$emit('updateText',text || '')
          },500)()
        },
        onTagDoubleClick({attrs}){
          that.tagType = attrs.type
          that.defaultValue = attrs.content
        },
        onFocus({editor}){
          that.$emit('focus',editor)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content-editor{
  border: 1px solid #E2E2E2;
  border-radius: 5px;
  padding: 0 10px;
  height: 100%;
  background: #FFF;
  /deep/.ProseMirror {
    width: 100%;
    line-height:28px;
    word-break: break-all;
    &:focus-visible {
      outline: none;
    }
  }
}

</style>
