<template>
  <div>
    <menu-bar v-if="editor" class="menu-bar" :editor="editor" />
    <div style="display: flex;margin-top: 20px">
      <object-selector style="width: 20%"
                       :editor="editor"
                       :objects="tools"
                       @lineInsert="handleAddLine"
                       @tagInsert="handleAppendTag"
      ></object-selector>
      <div class="editor-content">
        <editor-content :editor="editor"/>
        <div class="new-line" @click="handleAddLine(true)">+</div>
      </div>
      <object-editor style="width: 20%" :current-object="selectNode"></object-editor>
    </div>
    <div style="font-family: serif" @click="handleClick">JSON输出</div>
    <div style="font-family: serif" @click="handleClick2">html输出</div>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import CodeBlock from '@tiptap/extension-code-block'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import FontFamily from '@tiptap/extension-font-family'
import FontColor from './tools/font-color/font-color'
import FontSize from './tools/font-size/font-size'
import CustomerTag from './tools/customerTag/Extension'
import ContentBox from "./tools/contentBox/Extension";
import Focus from '@tiptap/extension-focus'
import MenuBar from './components/MenuBar/MenuBar'
import ObjectEditor from "./components/objectEditor";
import ObjectSelector from "./components/objectSelector";

export default {
  components: {
    ObjectSelector,
    ObjectEditor,
    MenuBar,
    EditorContent,
  },

  data() {
    return {
      editor:null,
      selectNode:null,
      selectParagraph:null,
      json:{
        "type":"doc",
        "content":[
          {
            "type":"contentBox",
            "content":[
              {
                "type":"paragraph",
                "content":[
                  {
                    "type":"text",
                    "text":"第一段"
                  }
                ]
              },
              {
                "type":"paragraph",
                "content":[
                  {
                    "type":"text",
                    "marks":[
                      {
                        "type":"textStyle",
                        "attrs":{
                          "fontFamily":null,
                          "fontColor":"red"
                        }
                      }
                    ],
                    "text":"第二段"
                  }
                ]
              },
              {
                "type":"paragraph",
                "content":[
                  {
                    "type":"text",
                    "text":"第三段"
                  }
                ]
              }
            ]
          },
          {
            "type":"contentBox",
            "content":[
              {
                "type":"paragraph",
                "content":[
                  {
                    "type":"text",
                    "text":"第一段"
                  }
                ]
              },
              {
                "type":"paragraph",
                "content":[
                  {
                    "type":"text",
                    "text":"第二段"
                  }
                ]
              },
              {
                "type":"paragraph",
                "content":[
                  {
                    "type":"text",
                    "text":"第三段"
                  },
                  {
                    "type":"customerTag",
                    "attrs":{
                      "type":"string",
                      "index":"economic"
                    },
                    "content":[
                      {
                        "type":"text",
                        "text":"asd"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      tools:[
        {id:'line',name:'插入段落'},
        {id:'tag',name:'插入文本'},
      ]
    }
  },

  mounted() {
    let that = this
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Text,
        CodeBlock,
        TextStyle,
        FontFamily,
        Underline,
        FontColor,
        FontSize,
        CustomerTag,
        ContentBox,
        Focus.configure({
          className: 'focus',
          mode: 'shallowest',
        }),
      ],
      content: this.json,
      editable: true,
      onFocus({ editor, event }) {
        that.handleFocus(editor,event)
      },
      getTag(v){
        that.selectNode = v
      },
      getParagraph(v){
        that.selectParagraph = v
      }
    })

  },

  beforeDestroy() {
    this.editor.destroy()
  },
  methods:{
    handleSelect(){

    },
    handleAddLine(append=false){
      let position = this.editor.getCharacterCount()+2
      if(this.selectParagraph&&!append){
        position = this.selectParagraph.getPos() + this.selectParagraph.node.nodeSize
      }
      console.log(position)
      this.editor.commands.insertContentAt(position,{
        "type":"contentBox",
        "content":[{
          "type":"paragraph",
          "content":[]
        }]
      })

    },
    handleAppendTag(){
      let type = prompt("输入标签类型",)
      let text = prompt("输入占位字符",)
      if(type){
        this.editor.commands.insertContent({
          "type":"customerTag",
          "attrs":{
            "type":type,
            "index":"economic"
          },
          "content":[
            {
              "type":"text",
              "text":text
            }
          ]
        })
      }

    },
    handleFocus(v){
      this.editor = v
    },
    handleClick(){
      console.log(JSON.stringify(this.editor.getJSON()))
    },
    handleClick2(){
      console.log(JSON.stringify(this.editor.getHTML()))
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-bar{
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  flex-wrap: wrap;
  padding: 0.25rem;
  border-bottom: 3px solid #0D0D0D;
}
.editor-content{
  width: 60%;
  margin: auto;
  margin-bottom: 10px;
  /deep/.ProseMirror{
    &:focus-visible{
      outline: none;
    }
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


  ul,
  ol {
    padding: 0 1rem;
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
    height: auto;
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

</style>
<style>
</style>
