<template>
  <el-form>
    <el-form-item>
      <div class="situation">
        <span class="delete" @click="handleRemove"></span>
        <span>情形{{ index + 1 }}：</span>
      </div>
    </el-form-item>
    <el-form-item >
      <div class="judgement-item">
        <inline-editor class="formula-ipt"
                  style="width:70%"
                  :value="data.formula"
                  @update="handleUpdateSituation"
                  @focus="handleFocus"
        ></inline-editor>
        <!-- <editor-content class="formula-ipt" :editor="editor"/> -->
        <el-select size="small" class="symbol" v-model="data.symbol">
          <el-option
            v-for="item in symbols"
            :key="item"
            :label="item"
            :value="item">
            {{ item }}
          </el-option>
        </el-select>
        <el-input-number size="small" class="stand-value" v-model="data.standValue"/>
      </div>
      <!-- <editor-content class="content-editor" :editor="editor"/> -->
    </el-form-item>
    <el-form-item class="result">
       <inline-editor class="formula-ipt"
                  :value="data.coverText"
                  @update="handleUpdateResult"
                  @focus="handleFocus"
        ></inline-editor>
      <!-- <el-input v-model="data.coverText" placeholder="此处输入结果" /> -->
    </el-form-item>
  </el-form>
</template>

<script>
import {Editor, EditorContent} from '@tiptap/vue-2'
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import CustomerTag from "../../../tools/customerTag/Extension";

export default {
  components: { EditorContent,InlineEditor:()=>import('../../inlineEditor.vue') },
  model: {
    prop: "data",
    event: "change",
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    data: {
      type: [Object, Array],
      default: () => [],
    },
  },
  data() {
    return {
      editor:null,
      defaultProps:[
        StarterKit,
        Document,
        Paragraph,
        Text,
        CustomerTag,
      ],
      symbols: ["==", ">", ">=", "<", "<=", "!="],
    };
  },
  computed:{
    situationJson(){
      return{
        type:'doc',
        content:[{
          type:'paragraph',
          content:this.data.formula || []
        }]
      }
    },
    resultJson(){
      return{
        type:'doc',
        content:[{
          type:'paragraph',
          content:this.data.coverText || []
        }]
      }
    }
  },
  mounted(){
    // this.editorInit()
  },
  methods: {
    handleUpdateSituation(json){
      this.data.formula = json
    },
    handleUpdateResult(json){
      this.data.coverText = json
    },
    handleFocus(editor){
      this.$emit('itemBeFocus',editor)
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
          that.data.formula = json.content[0].content
        },
        onFocus(){
          that.$emit('itemBeFocus',that.index)
        }
      })
    },
    handleRemove() {
      this.$emit("itemRemove", this.index);
    },
  },
};
</script>

<style lang="scss" scoped>
.situation{
  display: flex;
  align-items: center;
  .delete{
    cursor: pointer;
    margin-right: 10px;
    width:22px;
    height:22px;
    background:url('~@/assets/imgs/tiptap/delete.png') no-repeat center/contain
  }
}
.judgement-item{
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .symbol{
    width: 120px;
    margin-left: auto;
  }
  .stand-value{
    width: 120px;
    margin-left: auto;
  }
}
.formula-ipt{
    // /deep/.ProseMirror {
    //   border: 1px solid #e4e4e4;
    //   word-break: break-all;
    //   padding: 0 10px;
    //   width: 100%;
    //   border-radius: 4px;
    //   line-height: 40px;
    //   &.ProseMirror-focused{
    //     border-color: #1890ff;
    //   }
    // }
  }

</style>
