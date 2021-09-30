<template>
  <div>
    智能文本内容：
    <div>
      <button @click="tagInsert('variety')">插入变量</button>
      <button @click="tagInsert('function')">插入公式</button>
      <button @click="varsManager">局部变量管理</button>
    </div>
    <editor-content class="content-editor" :editor="editor"/>
    <tag-menu v-show="editor&&editor.isActive('custom-tag')" :editor="editor"
              :rangeId="rangeId"></tag-menu>
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
import TagMenu from '../tagMenu/tagMenu.vue'
import VarManagerDialog from "../../Dialog/varManagerDialog";



export default {
  name: "tagEditor",
  components: {VarManagerDialog, EditorContent},
  model:{
    prop:'content',
    event:"change"
  },
  props:{
    //外层编辑器对象
    mainEditor:Object,
    content:Array,
    rangeId:String
  },
  data(){
    return{
      managerDialog:false,
      editor:null,
      defaultProps:[
        StarterKit,
        CustomerTag,
      ],
    }
  },
  created() {
    const that = this
    let content = this.mainEditor.getAttributes("custom-tag").content
    let json = {
      type:'doc',
      content:[{
        type:'paragraph',
        content:content
      }]
    }
    this.editor = new Editor({
      extensions: this.defaultProps,
      content: json,
      editable: true,
      onCreate({editor}){
      },
      onUpdate({editor}){
        let json = editor.getJSON()
        that.mainEditor.chain().updateAttributes('custom-tag',{content:json.content[0].content}).run()
      },
    })
  },
  mounted(){
    /**
     * TODO 获取当前智能文本的id
     */
    console.log("加载",this.rangeId)
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
    editorOver(e){
      let result = []
      const nodes = e.target.childNodes
      nodes.forEach(item=>{
        result.push({
          type:item.dataset?.type || 'const'
        })
        console.log(item.innerText)
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.content-editor{
  border: 1px solid red;
  padding: 20px;
  /deep/.ProseMirror {
    &:focus-visible {
      outline: none;
    }
  }
}
.edit-content{
  border: 1px solid red;
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
