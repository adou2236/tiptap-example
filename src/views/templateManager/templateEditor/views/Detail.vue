<template>
  <div class="app">
    <Header :base-msg="baseMsg"
    @save="save"
    @clone="clone"
    @apply="apply"
    @overView="overView"></Header>
    <menu-bar v-if="editor" class="menu-bar" :editor="editor" />
    <div class="main-container">
      <!-- left module -->
      <object-selector
        v-if="editor"
        :style="`${isHidden?'width:0px;margin-right:40px':'width:13%'}`"
        :isHidden.sync="isHidden"
        :editor="editor"
        :objects="tools"
        @objInsert="objInsert"
        @templateInsert="templateInsert"
        @lineInsert="showLineSelector">
      </object-selector>
      <!-- middle module -->
      <div
        class="editor-content" >
        <el-scrollbar>
          <div class="editor-cotainer" style="width:90%;padding:20px 0;margin:0 auto">
            <div ref="editor" :style="`width:760px;margin:auto;transform:scale(${editorScale})`">
              <editor-content :editor="editor"/>
              <div class="new-line" @click="showLineSelector">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
            </div>

          </div>
        </el-scrollbar>
        <!-- <el-slider
        style="position:absolute;bottom:-40px;right:0;width:200px"
        size="mini"
        :min="0"
        :max="2"
        :step="0.01"
        v-model="editorScale" ></el-slider> -->
      </div>
      <!-- right module -->
      <object-editor
        v-if="editor"
        class="object-editor"
        :rootId="root_id"
        :baseData="baseData"
        :editor="editor"
        @baseDataChange="baseDataChange">
      </object-editor>
    </div>

    <over-view v-model="dialogVisible" :content="dialogContent"></over-view>

    <line-selector v-model="dialogVisible5" @commit="handleAddLine"></line-selector>

    <image-upload v-model="dialogVisible2" @imageCommit="imageCommit"></image-upload>

    <my-dialog v-model="dialogVisible3" >
      <vue-json-editor
          v-model="dialogContent"
          :showBtns="false"
          :mode="'code'"
          :modes="['code']"
          lang="zh"/>
    </my-dialog>
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
import Image from '@tiptap/extension-image'
import Focus from '@tiptap/extension-focus'

//自定义操作
import TableCell from '../tools/table-cell'
import FontColor from '../tools/font-color/font-color'
import FontWeight from '../tools/font-weight/font-weight'
import Italic from '../tools/italic/italic'
import Underline from '../tools/under-line/under-line'
import CenterLine from '../tools/center-line/center-line'
import FontSize from '../tools/font-size/font-size'

//自定义组件
import { Figure } from '../tools/figure/figure'
import { Figcaption } from '../tools/figure/figcaption'
import Title from "../tools/title/title";
import CustomerTag from '../tools/customerTag/Extension'
import ContentBox from "../tools/contentBox/Extension";
import MenuBar from '../components/MenuBar/MenuBar'
import ObjectEditor from "../components/objectEditor";
import ObjectSelector from "../components/objectSelector";
import myDialog from "../components/Dialog"
import imageUpload from "../components/Dialog/imageUpload";
import CustomImage from "../tools/imageBox/Extension"
import CustomChart from "../tools/chartBox/Extension"
import FigureChart from '../tools/chartBox/figureChart'
import FigureTable from '../tools/tableBox/figureTable'
import TemplateTable from '../tools/tableBox/templateTable'
import {optionsInit} from "../unit/baseType";
import ChartSelect from "../components/Dialog/chartSelect";


import vueJsonEditor from 'vue-json-editor'
import {mapMutations,mapState} from 'vuex';
import {getDoc, templateSave, templateClone} from "@/request/templateApi";
import OverView from "../components/Dialog/overView/overView";
import LineSelector from "../components/Dialog/lineSelector";
import ComplexTagDialog from "../components/Dialog/ComplexTagDialog/index"
import Header from './Editor/Header.vue'
import html2canvas from 'html2canvas'
import { templateApply } from '@/request/templateApi'
import { getDocTemplateDetail, getVarsById } from '@/request/templateApi'
import elementResizeDetectorMaker from "element-resize-detector";
import { defaultRegion } from '../components/MenuBar/EchartsMenu/chartOptions/components/regions'


const smart = require('@/assets/imgs/tiptap/smart.png')
const table = require('@/assets/imgs/tiptap/table.png')
const map = require('@/assets/imgs/tiptap/map.png')
const scatter = require('@/assets/imgs/tiptap/scatter.png')
const combo = require('@/assets/imgs/tiptap/combo.png')
const comboTime = require('@/assets/imgs/tiptap/comboTime.png')
const waterfall = require('@/assets/imgs/tiptap/waterfall.png')
const picture = require('@/assets/imgs/tiptap/picture.png')
const doubleAxis = require('@/assets/imgs/tiptap/doubleAxis.png')


export default {
  components: {
    LineSelector,
    OverView,
    ChartSelect,
    ObjectSelector,
    ObjectEditor,
    MenuBar,
    EditorContent,
    myDialog,
    imageUpload,
    vueJsonEditor,
    ComplexTagDialog,
    Header
  },
  data() {
    return {
      value:'',
      baseMsg:{},
      baseData:{},
      editor:null,
      isHidden:false,
      selectParagraph:null,
      //文档根id
      root_id:'',
      tools:[
        {
          id:'base',label:'基本元件',children:[
            {id:'image',type:'image',label:'插入图片',icon:picture},
            {id:'table',type:'table',label:'表格',icon:table},
            // {id:'template',type:'template',label:'特殊表格',icon:table},
          ]
        },
        {
          id:'text',label:'智能文本',children:[
            {id:'smart',type:'smart',label:'智能文本',icon:smart}
          ]
        },
        {
          id:'chart',label:'智能图表',children:[
            // {id:'pie',type:'chart',label:'饼图',icon:pie},
            {id:'map',type:'chart',label:'地图',icon:map},
            {id:'scatter',type:'chart',label:'散点图',icon:scatter},
            {id:'combo',type:'chart',label:'组合图\n(横轴为地域)',icon:combo},
            {id:'comboTime',type:'chart',label:'组合图\n(横轴为时间)',icon:combo},
            {id:'stack',type:'chart',label:'堆积图\n(横轴为地域)',icon:comboTime},
            {id:'stackTime',type:'chart',label:'堆积图\n(横轴为时间)',icon:comboTime},
            {id:'doubleAxis',type:'chart',label:'双轴图',icon:doubleAxis},
            {id:'waterfall',type:'chart',label:'变化图',icon:waterfall},
          ]
        },
        // {
        //   id:'editor',label:'编辑器',children:[
        //     {id:'free',type:'chart',label:'任意门'}
        //   ]
        // },
      ],
      defaultProps:[
        StarterKit.configure({
          bold:false,
          strike:false,
          blockquote:false,
        }),
        Title,
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
        CustomerTag,
        ContentBox,
        CustomChart,
        FigureChart,
        FigureTable,
        TemplateTable,
        CustomImage.configure({
          inline:true
        }),
        Image.configure({
          inline:true
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Table.configure({
          resizable:true,
          lastColumnResizable:false
        }),
        Focus.configure({
          className: 'focus',
          mode:'shallowest'
        }),
        TableRow,
        TableHeader,
        TableCell
      ],
      dialogVisible:false,
      dialogVisible2:false,
      dialogVisible3:false,
      dialogVisible5:false,
      dialogVisible6:false,
      dialogContent:'',
      dialogType:'string',
      complexTagType:'formula',
      fullLoading:null,
      editorScale:1
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
    let {data} = await this.getDoc(this.$route.params.id)
    this.baseMsg = data
    let {name = '',reportUpdateTime = [],type = ''} = data
    this.baseData = {
      name,
      reportUpdateTime,
      type
    }
    this.setBaseData(this.baseData)
    this.root_id = data.doc.id
    this.setRootId(this.root_id)
    await getVarsById(this.root_id)
    let that = this
    this.editor = new Editor({
      extensions: this.defaultProps,
      content: data.doc,
      editable: true,
      onCreate(){
        that.windowResize()
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
    this.domResizer()
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods:{
    ...mapMutations([
      'setGlobalVars',
      'setBaseData',
      'setRootId'
    ]),
    domResizer(){
      let editorDom = document.querySelector('.editor-content')
      let erd = elementResizeDetectorMaker();
      erd.listenTo(editorDom, this.windowResize);
    },
    windowResize(){
      let editorScale = 1
      let width = (document.querySelector('.editor-cotainer').offsetWidth)
      editorScale = Math.floor(width * 100 / 760) / 100
      this.editorScale = editorScale
      document.querySelector('.editor-cotainer').style.height = (this.$refs.editor.offsetHeight+60) * editorScale + 'px'
      if(editorScale>=1){
        this.$refs.editor.style['transform-origin'] = '50% 0 0 '
      }else{
        this.$refs.editor.style['transform-origin'] = '0 0 0 '
      }
    },
    baseDataChange(e){
      this.baseData = e
    },
    async templateInsert(e){
      let temp = await this.getTemplateDetail(e)
      if(temp){
         let timestamp = (new Date()).getTime()
        //这是文本
        let obj = temp.doc
        if(temp.type == 0){
          //文本模板插入
          obj.attrs.id = `${this.$route.params.id}_${timestamp}`
          this.editor.chain().focus().insertContent(obj).run()
        }else if(temp.type == 1){
          //图模板插入
          let attrs = {
            ...obj.attrs,
            id:`${this.$route.params.id}_${timestamp}`,
            title:"标题：",
            source:"资料来源："
          }
          this.editor.chain().focus().insertFigureChart(attrs).run()
        }else if(temp.type == 2){
          //特殊表模板插入
          let attrs = {
            ...obj.attrs,
            "id":`${this.$route.params.id}_${timestamp}`,
            "title":"标题：",
            "source":"资料来源：",
          }
          this.editor.chain().focus().insertTemplateTable(attrs).run()
        }
        this.fullLoading.close()
        this.fullLoading = null
      }
    },
    async getTemplateDetail(e){
      this.fullLoading = this.$loading({lock:true,background:'rgba(0,0,0,0.7)'})
      let params = {
        id:e.id
      }
      let {data} = await getDocTemplateDetail(params)
      if(data.code == 200){
        return data.data
      }
    },
    objInsert(obj){
      let type = obj.type
      switch(type){
        case 'image':
          this.handleInsertImage()
          break;
        case 'smart':
          this.handleAppendTag(obj.id)
          break;
        case 'table':
          this.handleInsertTable()
          break;
        case 'template':
          this.handleInsertTemplateTable()
          break;
        case 'chart':
          this.handleInsertChart(obj.id)
          break
      }

    },
    overView(){
      this.handleClick()
    },
    async apply(resolve){
      let data = {
        id: this.$route.params.id,
      }
      templateApply(data).then(res=>{
        if(res.data.code == 200){
          this.$message.success("应用成功")
        }
      }).catch(()=>{
        this.$message.error("应用失败")
      }).finally(()=>{
          resolve()
      })
    },
    async save(resolve){
      let data = {
        id: this.$route.params.id,
        ...this.baseData,
        doc:this.editor.getJSON()
      }
      templateSave(data).then(res=>{
        if(res.data.code == 200){
          this.$message.success("保存成功")
        }
      }).catch(()=>{
        this.$message.error("保存失败")
      }).finally(()=>{
          resolve()
      })

    },
    async clone(resolve){
      let data = {
        id: this.$route.params.id,
        doc:this.editor.getJSON()
      }
      templateClone(data).then(res=>{
        if(res.data.code == 200){
          this.$message.success("保存成功")
          this.$router.replace({name:'templateEditor',params:{id:res.data.data.id}})
        }
      }).catch(()=>{
        this.$message.error("保存失败")
      }).finally(()=>{
          resolve()
      })
    },
    //遍历全文图像并保存
    getChartDoms() {
      let that = this
      let eles = document.querySelectorAll('.chart') || []
      let i = 0
      let urls = []
      return new Promise((resolve,reject)=>{
        async function count(){
          if(i < eles.length-1){
            setTimeout(count)
          }
          do{
            let id = eles[i].id
            let url = await that.getBase64(eles[i])
            urls.push({
              id,
              url
            })
            i++
          }while(false)
          if(i >= eles.length){
            resolve(urls)
          }
        }
        count()
      })
    },
    async getBase64(ele){
      const width = ele.offsetWidth
      const height = ele.offsetHeight
      let canvas = await html2canvas(ele,{
        scale:2,
        width,
        height,
        backgroundColor:"#FFF"
      })
      return canvas.toDataURL()
    },
    getWholeDom(ele){
      if (ele.nodeName === 'FIGURE'||ele.nodeName === 'figure') {
        return ele
      }
      return this.getWholeDom(ele.offsetParent);
    },
    async getDoc(id){
      let {data} = await getDoc(id)
      return data
    },
    changeSize(){
      this.editor.chain().focus().setImageSize([100,100]).run()
    },
    imageCommit(url){
      this.editor.chain().focus().setCustomerImage({ src: url }).run()
      this.dialogVisible2 = false
    },
    showLineSelector(){
      //TODO先不做选择，默认插入单列
      this.editor.chain().focus().insertNewLine('single').run()
      // this.dialogVisible5 = true
    },
    //插入段落待修改
    handleAddLine(type='single'){
      this.editor.chain().focus().insertNewLine(type).run()
      // this.dialogVisible5 = true
    },
    handleAppendTag(type){
      let timestamp = (new Date()).getTime()
      let attrs = {
        "type":type,
        "coverText":'智能文本',
        "id":`${this.$route.params.id}_${timestamp}`,
        "content": []

      }
      this.editor.chain().insertSmartTag(attrs).run()
    },
    showComplexTagDialog(type){
      this.complexTagType = type
      this.dialogVisible6 = true
    },
    handleInsertTable(){
      let timestamp = (new Date()).getTime()
      let attrs = {
        "id":`${this.$route.params.id}_${timestamp}`,
        "title":"标题：",
        "source":"资料来源："
      }
      this.editor.chain().focus().insertFigureTable(attrs).run()
    },
    handleInsertTemplateTable(){
      let timestamp = (new Date()).getTime()
      this.$prompt("请输入模板描述", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          inputValidator: (v) => {
              let reg = /[`~!?@#$%^&*【】{}（）\[\]<>《》？！，。/；“”‘’,.;"'+-]/.test(v)
              if (reg) {
                  return false
              }
              if (v.length > 40) {
                  return false
              }
              return !!v && v.trim().length > 0
          }
      }).then(async ({ value }) => {
        let attrs = {
          "id":`${this.$route.params.id}_${timestamp}`,
          "title":"标题：",
          "source":"资料来源：",
          "customType": value
        }
        this.editor.chain().focus().insertTemplateTable(attrs).run()

      })

    },
    handleInsertChart(type){
      let timestamp = (new Date()).getTime()
      let xaxis = {
        xaxisType:'region',
        xaxisIndex:type==='map'?'provinces':defaultRegion(),
      }
      if(type == 'comboTime'||type == 'stackTime'){
        xaxis = {
          xaxisType : 'time',
          xaxisIndex:'10year',
        }
      }
      let index = {
        //图类型
        type:type,
        ...xaxis,
        //纵坐标指标/饼状图数值
        items:[]
      }
      if(type == 'free'){
        index = {
          type:type,
          customType:''
        }
      }
      let attrs = {
        "index": index,
        "id":`${this.$route.params.id}_${timestamp}`,
        "src": "#",
        "options": optionsInit(type),
        "title":"标题：",
        "source":"资料来源："
      }
      this.editor.chain().focus().insertFigureChart(attrs).run()
    },
    handleInsertImage(){
      this.dialogVisible2 = true
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
  width: 100vw;
  height: 100vh;
  overflow:hidden;
  box-sizing: border-box;
  position: relative;
  /deep/.el-scrollbar{
    height:100%
  }
}
.menu-bar{
  display: flex;
  height: 50px;
  align-items: center;
  flex: 0 0 auto;
  flex-wrap: wrap;
  padding: 0 50px;
  border-bottom: 2px solid #062B61;
  background: #FFFFFF;
}
.main-container{
  display: flex;
  justify-content: space-between;
  background: #F3F3F3;
  position: absolute;
  min-width:1200px;
  top: 120px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x:auto;
  .editor-content{
    flex-grow: 1;
    margin: 20px 1%;
    box-sizing: border-box;
    background: #FFFFFF;
    transition: all ease 0.3s;
    .operation-menu{
      position: absolute;
      right: 0;
      top: 0;
    }
    .new-line{
      width: 100%;
      margin:auto;
      padding: 15px;
      text-align: center;
      cursor: pointer;
      border: 1px dashed #DCDCDC;
      box-sizing: border-box;
      i{
        font-size: 24px;
        color:#36A4FD
      }
    }
  }
  .object-editor{
    width: 35%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }
}

/deep/.ProseMirror {
  width: 100%;
  > * + * {
    margin-top: 0.75em;
  }
  &:focus-visible {
      outline: none;
  }
  figure {
    margin: 0;
    flex: 1;
    position: relative;
  }
  figcaption {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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
    height: 506px;
  }
  .template-table{
    text-align:center;
    border: 2px solid #000;
    padding: 10px;
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
      border: 2px solid #000000;
      padding: 3px 5px;
      vertical-align: middle;
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
.ProseMirror-hideselection *::selection {
    background: transparent;
    color:#000
}
.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>
