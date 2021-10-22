<template>
  <div class="app">
    <menu-bar v-if="editor" class="menu-bar" :editor="editor" />
    <div class="main-container">
      <object-selector v-if="editor"
                       :editor="editor"
                       :objects="tools"
                       @lineInsert="showLineSelector"
                       @tagInsert="handleAppendTag"
                       @imageInsert="handleInsertImage"
                       @chartInsert="handleSelectChart">
      </object-selector>
      <div class="editor-content">
        <editor-content :editor="editor"/>
        <div class="new-line" @click="showLineSelector">+</div>
      </div>
      <object-editor style="width: 40%" v-if="editor" :rootId="root_id" :editor="editor"></object-editor>
    </div>
    <div>
      <button @click="handleClick">JSON输出</button>
      <button @click="handleClick2">html输出</button>
      <button @click="save">保存</button>
    </div>

    <over-view v-model="dialogVisible" :content="dialogContent"></over-view>

    <line-selector v-model="dialogVisible5" @commit="handleAddLine"></line-selector>

    <my-dialog v-model="dialogVisible2">
      <image-upload @imageCommit="imageCommit"></image-upload>
    </my-dialog>
    <my-dialog v-model="dialogVisible3" >
      <vue-json-editor
          v-model="dialogContent"
          :showBtns="false"
          :mode="'code'"
          :modes="['code']"
          lang="zh"/>
    </my-dialog>
    <chart-select v-model="dialogVisible4"
                  @commit="handleInsertChart">
    </chart-select>
  </div>
</template>

<script>
import {Editor, EditorContent} from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import CodeBlock from '@tiptap/extension-code-block'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import Focus from '@tiptap/extension-focus'
import Image from '@tiptap/extension-image'

//自定义操作
import TableCell from '../tools/table-cell'
import FontColor from '../tools/font-color/font-color'
import FontWeight from '../tools/font-weight/font-weight'
import Italic from '../tools/italic/italic'
import Underline from '../tools/under-line/under-line'
import CenterLine from '../tools/center-line/center-line'
import FontSize from '../tools/font-size/font-size'
import LineHeight from "../tools/line-height/line-height";

//自定义组件
import { Figure } from '../tools/figure/figure'
import { Figcaption } from '../tools/figure/figcaption'
import CustomerTag from '../tools/customerTag/Extension'
import ContentBox from "../tools/contentBox/Extension";
import MenuBar from '../components/MenuBar/MenuBar'
import ObjectEditor from "../components/objectEditor";
import ObjectSelector from "../components/objectSelector";
import myDialog from "../components/Dialog"
import imageUpload from "../components/Dialog/imageUpload";
import TableMenu from "../components/MenuBar/TableMenu";
import CustomImage from "../tools/imageBox/Extension"
import CustomChart from "../tools/chartBox/Extension"
import CustomTable from '../tools/tableBox/Extension'
import {optionsInit} from "../unit/baseType";
import ChartSelect from "../components/Dialog/chartSelect";


import vueJsonEditor from 'vue-json-editor'
import {mapMutations,mapState} from 'vuex';
import {getDoc, getVarsById, templateSave} from "../request/api";
import OverView from "../components/Dialog/overView/overView";
import LineSelector from "../components/Dialog/lineSelector";



export default {
  components: {
    LineSelector,
    OverView,
    ChartSelect,
    TableMenu,
    ObjectSelector,
    ObjectEditor,
    MenuBar,
    EditorContent,
    myDialog,
    imageUpload,
    vueJsonEditor
  },
  data() {
    return {
      value:'',
      editor:null,
      selectParagraph:null,
      //文档根id
      root_id:'',
      tools:[
        {id:'line',name:'插入段落'},
        {id:'tag',name:'插入变量',type:'variety'},
        {id:'tag',name:'插入公式',type:'function'},
        {id:'tag',name:'插入智能文本',type:'smart'},
        {id:'image',name:'插入图片'},
        {id:'chart',name:'插入表格'},
      ],
      defaultProps:[
        StarterKit,
        Figure,
        Figcaption,
        Document,
        Paragraph,
        Text,
        CodeBlock,
        TextStyle,
        FontFamily,
        Underline,
        CenterLine,
        FontWeight,
        Italic,
        FontColor,
        FontSize,
        LineHeight,
        CustomerTag,
        ContentBox,
        CustomChart,
        CustomImage.configure({
          inline:true
        }),
        Image.configure({
          inline:true
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        // Focus.configure({
        //   className: 'focus',
        //   mode: 'deepest',
        // }),
        CustomTable,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell
      ],
      dialogVisible:false,
      dialogVisible2:false,
      dialogVisible3:false,
      dialogVisible4:false,
      dialogVisible5:false,
      dialogContent:'',
      dialogType:'string',
    }
  },
  watch:{

  },
  computed:{
    ...mapState([
      'vars',
    ]),
  },
  async mounted() {
    // await this.getVars("15_root")
    let {content} = await this.getDoc(this.$route.params.id)
    this.root_id = content.doc.id

    this.editor = new Editor({
      extensions: this.defaultProps,
      content: content.doc,
      editable: true,
      onCreate({editor}){
      },
      onUpdate({editor}){
        //数据更新监听
        let json = editor.getJSON()
        if(json.content.some(item=>item.type !== 'content-box')){
          json.content = json.content.filter(line=>{
            return line.type === "content-box"
          })
          editor.chain().setContent(json).focus().run()
        }
      },
    })


  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods:{
    ...mapMutations([
      'setGlobalVars',
    ]),
    save(){
      let data = {
        id: this.$route.params.id,
        doc:this.editor.getJSON()
      }
      templateSave(data).then(res=>{
        console.log(res)
      })

    },
    async getVars(id){
      let {data} = await getVarsById(id)
      return data.content.data
    },
    async getDoc(id){
      let {data} = await getDoc(id)
      return data
    },
    handleOptions(){


    },
    newYourEditor(){
      console.log("换行逻辑")
    },
    changeSize(){
      this.editor.chain().focus().setImageSize([100,100]).run()
    },
    imageCommit(url){
      this.editor.chain().focus().setCustomerImage({ src: url }).run()
      this.dialogVisible2 = false
    },
    showLineSelector(){
      this.dialogVisible5 = true
    },
    //插入段落待修改
    handleAddLine(type='single'){
      let content = {}
      if(type === 'single'){
        content = {
          "type":"content-box",
          "attrs":{
            "isSplit":false
          },
          "content":[
            {
              "type": "paragraph",
              "content":''
            }
          ]
        }
      }else if(type === 'double'){
        content = {
          "type":"content-box",
          "attrs":{
            "isSplit":true
          },
          "content":[
            {
              "type": "custom-chart",
              "attrs":{
                'placeholder':"true"
              },
              "content":''
            },
            {
              "type": "custom-chart",
              "attrs":{
                'placeholder':"true"
              },
              "content":''
            }
          ]
        }
      }
      let position = this.editor.getCharacterCount()+2
      this.editor.chain().focus().insertContentAt(position,content).run()
      this.dialogVisible5 = false
      //在中间插入
      // if(!append){
      //   this.editor.chain().focus().insertContent({
      //     "type":"content-box",
      //     "content":[
      //       {
      //         "type": "paragraph",
      //         "content":''
      //       }
      //     ]
      //   }).run()
      // }else{
      //
      // }
    },
    handleAppendTag(type){
      let text = prompt("输入占位字符","新建文本")
      let timestamp = (new Date()).getTime()
      if(text){
        this.editor.chain().focus().insertContent({
          "type":"custom-tag",
          "attrs":{
            "type":type,
            "coverText":text,
            "id":`${this.$route.params.id}_${timestamp}`,
            "content":type==='variety'?'':[]
          },
        }).run()
      }
    },
    handleSelectChart(){
      this.dialogVisible4 = true
    },
    handleInsertChart(type){
      let timestamp = (new Date()).getTime()
      let index = {
        //图类型
        type:type,
        //横坐标类型/饼状图扇叶
        xaxisType:'region',
        //横坐标指标(地域或者时间)
        xaxisIndex:'provinces',
        //纵坐标指标/饼状图数值
        items:[]
      }
      this.editor.chain().focus().insertContent({
        type:'custom-chart',
        attrs: {
          "index": index,
          "id":`${this.$route.params.id}_${timestamp}`,
          "src": "",
          "options": optionsInit(type)
        }
      }).run()
      this.dialogVisible4 = false
    },
    handleInsertImage(){
      this.dialogVisible2 = true
    },
    handleFocus(v){
      this.editor = v
    },
    handleClick(){
      // this.editor.editable = true
      this.dialogContent = this.editor.getJSON()
      this.dialogVisible3 = true
      // this.editor.editable = false
    },
    handleClick2(){
      const result = this.editor.getHTML()
      this.dialogContent = result
      this.dialogVisible = true
      // this.editor.setEditable(false)
      // this.editor.editable = false
    },
  }
}
</script>
<style lang="scss" scoped>
.app{
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
}
.menu-bar{
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  flex-wrap: wrap;
  padding: 0.25rem;
  border-bottom: 3px solid #0D0D0D;
}
.main-container{
  flex: 1;
  display: -webkit-box;
  margin-top: 20px;
  overflow-x: scroll;
}
.editor-content{
  width: 60%;
  padding: 0 10px;
  overflow-y: auto;
  box-sizing: border-box;
  /deep/.ProseMirror {
    &:focus-visible {
      outline: none;
    }
  }
  .operation-menu{
    position: absolute;
    right: 0;
    top: 0;
  }
  .new-line{
    width: 100%;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    border: 1px dashed black;
    box-sizing: border-box;
  }
}
/deep/.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
  figure {
    margin: 0;
    padding: 0.5rem;
  }


  ul,
  ol {
    padding: 0 1rem;
  }
  p {
    margin: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    &.ProseMirror-selectednode {
      outline: 3px solid #68cef8;
    }
  }
  .chart{
    height: 400px;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
button.is-active { background: black; color: white; }
pre {
  background: #0D0D0D;
  color: #FFF;
  font-family: 'JetBrainsMono', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;

  code {
    color: inherit;
    padding: 0;
    background: none;
    font-size: 0.8rem;
  }
}
/deep/.ProseMirror {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }
  }
}

.tableWrapper {
  overflow-x: auto;
}
/deep/ .jsoneditor-menu{
  display: none;
}
/deep/ .jsoneditor-outer{
  height: 700px;
}



</style>
<style>
.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>
