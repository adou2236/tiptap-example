<template>
    <editor-content ref="container" class="inner-content" :editor="editor" />
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import CodeBlock from "@tiptap/extension-code-block";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";

//自定义操作
import TableCell from "@/views/templateManager/templateEditor/tools/table-cell";
import FontColor from "@/views/templateManager/templateEditor/tools/font-color/font-color";
import FontWeight from "@/views/templateManager/templateEditor/tools/font-weight/font-weight";
import Italic from "@/views/templateManager/templateEditor/tools/italic/italic";
import Underline from "@/views/templateManager/templateEditor/tools/under-line/under-line";
import CenterLine from "@/views/templateManager/templateEditor/tools/center-line/center-line";
import FontSize from "@/views/templateManager/templateEditor/tools/font-size/font-size";
import LineHeight from "@/views/templateManager/templateEditor/tools/line-height/line-height";

//自定义组件
import { Figure } from "@/views/templateManager/templateEditor/tools/figure/figure";
import { Figcaption } from "@/views/templateManager/templateEditor/tools/figure/figcaption";
import Title from "@/views/templateManager/templateEditor/tools/title/title";
import CustomerTag from "@/views/templateManager/templateEditor/tools/customerTag/Extension";
import ContentBox from "@/views/templateManager/templateEditor/tools/contentBox/Extension";
import CustomImage from "@/views/templateManager/templateEditor/tools/imageBox/Extension";
import CustomChart from "@/views/templateManager/templateEditor/tools/chartBox/Extension";
import FigureChart from "@/views/templateManager/templateEditor/tools/chartBox/figureChart";
import FigureTable from "@/views/templateManager/templateEditor/tools/tableBox/figureTable";
import TemplateTable from "@/views/templateManager/templateEditor/tools/tableBox/templateTable";
import { getDoc, partCheck } from "@/request/templateApi";
export default {
  name: "overView",
  components: { EditorContent },
  props: {
    offsetTop: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
    },
    id: {
      type: [String, Number],
    },
    date: {
      type: [String, Number],
    },
    area: {
      type: String,
    },
    quarter: {
      type: String,
    },
    updatefreq: {
      type: String,
    },
    targetAreas: {
      type: String,
    },
    origin:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      docLoading:false,
      defaultProps: [
        StarterKit,
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
        LineHeight,
        CustomerTag,
        ContentBox,
        CustomChart,
        FigureChart,
        FigureTable,
        TemplateTable,
        CustomImage.configure({
          inline: true,
        }),
        Image.configure({
          inline: true,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      currentPath: "",
      currentPath2: "",
      currentPath3: "",
      cataDataPage: [],
      cataDataChart: [],
      cataDataTable: [],
      editor: null,
    };
  },
  computed:{
    watcher(){
      return{
        id:this.id,
        date:this.date,
        area:this.area,
        quarter:this.quarter,
        updatefreq:this.updatefreq,
        targetAreas:this.targetAreas,
      }
    }
  },
  watch: {
    watcher:{
      handler(){
        this.docInit()
      },
      deep:true,
      immediate:true
    },
    offsetTop(e) {
      this.scrollTo(e);
    },
  },
  async mounted() {

  },
  methods: {
    async docInit(){
      if(this.editor){
        this.editor.destroy()
      }
      const that = this
      let { doc } = await this.getDoc(this.id);
      this.editor = new Editor({
        extensions: this.defaultProps,
        content: doc,
        editable: false,
        onCreate() {
          that.$nextTick(()=>{
            that.$emit('renderDone')
          })
        },
      });
    },
    async getDoc(id) {
      let params = {
        id: id,
        customVars: [
          {
            varKey: "报告年份",
            varValue: this.date,
          },
          {
            varKey: "报告范围",
            varValue: this.area,
          },
          {
            varKey: "季度",
            varValue: this.quarter,
          },
          {
            varKey: "更新频率",
            varValue: this.updatefreq,
          },
          {
            varKey: "对标城市",
            varValue: this.targetAreas,
          },
        ],
      };
      if(this.origin){
        let {data} = await getDoc(id)
        return data.data
      }else{
        let { data } = await partCheck(params);
        return data.data;
      }

    },



  },
};
</script>

<style lang="scss" scoped>

.inner-content {
    width: 760px;
    user-select: none;
    margin: auto;
    /deep/.ProseMirror {
      outline: none;
      .outter-content{
        margin: 0;
      }
      .content{
        border: none;
        margin:0
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
        margin: 0;
      }

      code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
      }

      pre {
        background: #0d0d0d;
        color: #fff;
        font-family: "JetBrainsMono", monospace;
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
      .chart {
        height:506px
      }

      .template-table{
        text-align:center;
        border: 2px solid #000;
        font-size: 14px;
        font-family: KaiTi;
        padding: 10px;
      }

      blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0d0d0d, 0.1);
      }

      hr {
        border: none;
        border-top: 2px solid rgba(#0d0d0d, 0.1);
        margin: 2rem 0;
      }
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
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
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
  }
</style>
