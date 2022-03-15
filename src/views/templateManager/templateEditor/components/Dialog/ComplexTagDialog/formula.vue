<template>
  <div class="formula">
    <editor-content class="content-editor" :editor="editor"/>
    <!-- <div class="top">
      <div class="top-left"> -->
        <!-- <inline-editor ref="inline-editor"
                    class="content-editor"
                   :value="content"
                   :range-id="rangeId"
                   @update="handleUpdate">
        </inline-editor> -->
      <!-- </div> -->
      <!-- <div class="top-right">待完成部分</div> -->
    <!-- </div> -->
    <!-- <div class="bottom">
      测试部分
    </div> -->
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
    tagInsert(tag){
      this.editor.chain().focus().insertContent(tag).run()
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
.formula{
  height: 100%;
  padding: 40px;
  // .top{
  //   display: flex;
  //   border-bottom: 1px solid #e4e4e4;
  //   .top-left{
  //     padding: 40px;
  //     border-right: 1px solid #e4e4e4;
  //   }
  //   .top-right{
  //     flex: 1;

  //   }
  // }

}
.content-editor{
  border: 1px solid #e4e4e4;
  padding: 10px;
  height: 100%;
  /deep/.ProseMirror {
    word-break: break-all;
    width: 100%;
    line-height: 20px;
    height:100%;
    &:focus-visible {
      outline: none;
    }
  }
}

</style>
