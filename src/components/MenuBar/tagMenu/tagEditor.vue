<template>
  <div>
    智能文本内容:
    <div>
      <el-button size="mini" type="text" @click="tagInsert('variety')">插入变量</el-button>
      <el-button size="mini" type="text" @click="tagInsert('function')">插入公式</el-button>
      <el-button size="mini" type="text" @click="tagInsert('formula')">插入函数</el-button>
      <el-button disabled size="mini" type="text" >插入逻辑判断</el-button>
      <el-button disabled size="mini" type="text" >插入循环语句</el-button>
      <el-button size="mini" type="text" @click="varsManager">局部变量管理</el-button>
    </div>
    <inline-editor ref="inline-editor"
                   :value="content"
                   :range-id="rangeId"
                   @update="handleUpdate">
    </inline-editor>
<!--    <editor-content class="content-editor" :editor="editor"/>-->
<!--    <tag-menu v-show="editor&&editor.isActive('custom-tag')"-->
<!--              :key="editor.getAttributes('custom-tag').id"-->
<!--              :editor="editor"-->
<!--              :isInner="true"-->
<!--              :rangeId="rangeId">-->
<!--    </tag-menu>-->
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
import InlineEditor from "../../inlineEditor";




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
    }
  },
  methods:{
    handleUpdate(e){
      this.$emit('change',e)
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
