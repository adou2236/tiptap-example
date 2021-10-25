<template>
  <div>
    智能文本内容:
    <div>
      <button @click="tagInsert('variety')">插入变量</button>
      <button @click="tagInsert('function')">插入公式</button>
      <button @click="varsManager">局部变量管理</button>
    </div>
    <br/>
    <editor-content class="content-editor" :editor="editor"/>
    <br/>
    <tag-menu v-show="editor&&editor.isActive('custom-tag')"
              :key="editor.getAttributes('custom-tag').id"
              :editor="editor"
              :isInner="true"
              :rangeId="rangeId">
    </tag-menu>
    <var-manager-dialog v-model="managerDialog"
                        v-if="managerDialog"
                        :id="rangeId">
    </var-manager-dialog>
  </div>
</template>

<script>

import {Editor,EditorContent} from "@tiptap/vue-2";
import CustomerTag from "../../../tools/customerTag/Extension";
import StarterKit from '@tiptap/starter-kit'
import VarManagerDialog from "../../Dialog/varManagerDialog";
import Focus from "@tiptap/extension-focus";



export default {
  name: "tagEditor",
  components: {VarManagerDialog, EditorContent},
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
      defaultProps:[
        StarterKit,
        CustomerTag,
        Focus.configure({
          // className: 'focus',
          mode: 'all',
        }),
      ],
    }
  },
  watch:{
    // editorJson:{
    //   handler(newVal,oldVal){
    //     if(this.editor){
    //       console.log("是因为你吗")
    //       this.editor.commands.setContent(newVal)
    //     }
    //   },
    //   deep:true,
    //   immediate:false,
    // },
  },
  computed:{
    editorJson(){
      return{
        type:'doc',
        content:[{
          type:'paragraph',
          content:this.content || []
        }]
      }
    }
  },
  created() {
    const that = this
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
  },
  mounted(){
    /**
     * TODO 获取当前智能文本的id
     */
  },
  methods:{
    varsManager(){
      this.managerDialog = true
    },
    tagInsert(type){
      let text = prompt("输入占位字符","新建文本")
      this.editor.chain().focus().insertContent({
        "type":"custom-tag",
        "attrs":{
          "type":type,
          "coverText":text,
          "content":type==='variety'?'':[]
        },
      }).run()
    },
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
.edit-content{
  border: 1px solid #D8D8D8;
  .tag{
    margin: 0 5px;
  }
  .varity{
    background: #baf13a;
  }
  .function{
    background: #68cef8;
  }
}

</style>
