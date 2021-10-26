<template>
  <div>
    <editor-content class="content-editor" :editor="editor"/>
  </div>
</template>

<script>
import {Editor, EditorContent} from '@tiptap/vue-2'
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import CustomerTag from "../../../tools/customerTag/Extension";

export default {
  name: "formula",
  components:{EditorContent},
  model:{
    prop:'defaultValue',
    event:'change'
  },
  props:{
    defaultValue:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return{
      editor:null,
      defaultProps:[
        StarterKit,
        Document,
        Paragraph,
        Text,
        CustomerTag,
      ],
    }
  },
  computed:{
    editorJson(){
      return{
        type:'doc',
        content:[{
          type:'paragraph',
          content:this.defaultValue || []
        }]
      }
    }
  },
  mounted(){
    this.editorInit()
  },
  methods:{
    editorInit(){
      let that = this
      this.editor = new Editor({
        extensions: this.defaultProps,
        content: this.editorJson,
        editable: true,
        onCreate({editor}){
        },
        onUpdate({editor}){
          let json = editor.getJSON()
          that.$emit('change',json.content[0].content)
        },
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
