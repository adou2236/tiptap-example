<template>
  <div>
    <div v-if="editor">
      <button @click="editor.chain().focus().setFontColor('#958DF1').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontColor: '#958DF1' })}">
        设置颜色
      </button>
      <button @click="editor.chain().focus().setFontFamily('serif').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'serif' }) }">
        字体
      </button>
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        加粗
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        斜体
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        横线
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
        下划线
      </button>
      <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
        代码
      </button>
      <button @click="editor.chain().focus().unsetAllMarks().run()">
        清除样式
      </button>
      <button @click="editor.chain().focus().clearNodes().run()">
        clear nodes
      </button>
      <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
        paragraph
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        h1
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        h2
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        h3
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        h4
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
        h5
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
        h6
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        列表
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        数字列表
      </button>
      <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
        代码块
      </button>
      <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        引用块
      </button>
      <button @click="editor.chain().focus().setHorizontalRule().run()">
        水平分割线
      </button>
      <button @click="editor.chain().focus().setHardBreak().run()">
        强制换行
      </button>
      <button @click="editor.chain().focus().undo().run()">
        撤销
      </button>
      <button @click="editor.chain().focus().redo().run()">
        反撤销
      </button>
    </div>
    <div style="display: flex">
      <div style="width: 20%">插入对象工具栏</div>
      <editor-content class="editor-content" :editor="editor"/>
      <object-editor style="width: 20%" :current-object="selectNode"></object-editor>
    </div>
    <div @click="handleAppendLine">添加新的一行</div>
    <div @click="handleAppendTag">添加占位符</div>
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
import CustomerTag from './tools/font-color/customerTag/Extension'
import ContentBox from "./tools/font-color/contentBox/Extension";
import Focus from '@tiptap/extension-focus'
import ObjectEditor from "./components/objectEditor";

export default {
  components: {
    ObjectEditor,
    EditorContent,
  },

  data() {
    return {
      editor:null,
      editors: [],
      selectNode:null,
      json: {
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
      }
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
      getObject(v){
        that.selectNode = v
      }
    })

  },

  beforeDestroy() {
    this.editor.destroy()
  },
  methods:{
    handleAppendLine(){
      // const {size} = this.editor.view.state.doc.content
      // const transaction = this.editor.state.tr.insertText('content-box', size )
      // this.editor.view.dispatch(transaction)
      this.editor.commands.focus('end')
      this.editor.commands.insertContent({
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
.editor-content{
  width: 60%;
  margin: auto;
  margin-bottom: 10px;
  /deep/.ProseMirror{
    padding: 15px;
    &:focus-visible{
      outline: none;
    }
  }
}
.ProseMirror {
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
