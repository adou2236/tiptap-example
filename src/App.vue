<template>
  <div>
    <menu-bar v-if="editor" class="menu-bar" :editor="editor" />
    <table-menu :editor="editor"></table-menu>
    <div style="display: flex;margin-top: 20px">
      <object-selector style="width: 20%"
                       :editor="editor"
                       :objects="tools"
                       @lineInsert="handleAddLine"
                       @tagInsert="handleAppendTag"
                       @imageInsert="handleInsertImage"
      ></object-selector>
      <div class="editor-content">
        <editor-content :editor="editor"/>
        <div class="new-line" @click="handleAddLine(true)">+</div>
      </div>
      <object-editor style="width: 20%" :current-object="selectNode"></object-editor>
    </div>
    <div @click="handleClick">JSON输出</div>
    <div @click="handleClick2">html输出</div>
    <my-dialog v-model="dialogVisible" >
      <dl v-html="dialogContent">
        {{dialogContent}}
      </dl>
    </my-dialog>
    <my-dialog v-model="dialogVisible2">
      <image-upload @imageCommit="imageCommit"></image-upload>
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
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import Focus from '@tiptap/extension-focus'
import Image from '@tiptap/extension-image'


import TableCell from './tools/table-cell'
import FontColor from './tools/font-color/font-color'
import FontSize from './tools/font-size/font-size'
import LineHeight from "./tools/line-height/line-height";


import CustomerTag from './tools/customerTag/Extension'
import ContentBox from "./tools/contentBox/Extension";
import MenuBar from './components/MenuBar/MenuBar'
import ObjectEditor from "./components/objectEditor";
import ObjectSelector from "./components/objectSelector";
import myDialog from "./components/Dialog"
import imageUpload from "./components/Dialog/imageUpload";
import TableMenu from "./components/MenuBar/TableMenu";
import CustomImage from "./tools/imageBox/Extension"


export default {
  components: {
    TableMenu,
    ObjectSelector,
    ObjectEditor,
    MenuBar,
    EditorContent,
    myDialog,
    imageUpload,
  },

  data() {
    return {
      value:'',
      editor:null,
      selectNode:null,
      selectParagraph:null,
      json: {
        "type":"doc",
        "content":[
          {
            "type":"contentBox",
            "content":[
              {
                "type":"paragraph",
                "attrs":{
                  "textAlign":"left"
                },
                "content":[
                  {
                    "type":"text",
                    "text":"第一段"
                  }
                ]
              },
              {
                "type":"paragraph",
                "attrs":{
                  "textAlign":"left"
                },
                "content":[
                  {
                    "type":"text",
                    "marks":[
                      {
                        "type":"textStyle",
                        "attrs":{
                          "fontFamily":null,
                          "fontColor":"red",
                          "fontSize":null,
                          "lineHeight":null
                        }
                      }
                    ],
                    "text":"第二段"
                  }
                ]
              },
              {
                "type":"paragraph",
                "attrs":{
                  "textAlign":"left"
                },
                "content":[
                  {
                    "type":"text",
                    "text":"第三段"
                  }
                ]
              },
              {
                "type":"paragraph",
                "attrs":{
                  "textAlign":"left"
                },
                "content":[
                  {
                    "type":"custom-image",
                    "attrs":{
                      "src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACGklEQVRYR+2YP2gTURzHP7+XxvpvMulgERQsiIPgJgpC29ilKnRUB0dBUGjdtKY87VAXC0oddHFyyiBW3EwoBESQTA51cBNBjSdVKxjTu59IUUqb9F1yVwn0bn3f3+99+Lwf944TOvyRDucjAYx6Qg0N7uu3W7+bYBbIASbqJiHrX6Xr9ZMfylPVlfmGgJmcHUGDxyEbxxZTYfRL8eYdJ2B2IH9ORR7FtnPoRnrVK03eSgBDC1sTTAy27265MjGYGFw24HgPflJ0HORrq75EdRsieaCvcW0sMygzXunG5Vbh/uZ35fJXROX2BgJSFXQiQLw2IHcKjAP7NxKwDa6wJbEccdjN2sltMsAaYk4t1X5WXK66utN9qDwDetbPxmvwvZeZ30uh4LsA/6xnBideAEf/JyAKZUTmnYAa7BFk2JlL7mK3Ikci3hmMjLO2QQIYVWpiMDEY6oM1qqZ16jfxDAbAEzAz3Tt4WVv0D4FcRDgLbAmvPH6Di8BDE5i71Tn7djVI9vi13dqVviSiFxSybtC4AJV3CPf8wNxfmLMLro17T9vtv3745xUZBQ40z0cHrIjq9OdvHwtUHtRdYGvWrTXZMsOq/hjIYNtXXebE9YME5jWQAgLQWSNMV4uT5ZahmhT09NvDQUrHUD3zb07FDHlF+3xlSdN/1JmB/BFFjqXUPG00X3GBZodsry75I0jqjVeypdV9O/4n+m8P4GA4mIoMyQAAAABJRU5ErkJggg==",
                      "alt":null,
                      "title":null,
                      "width":200,
                      "height":200
                    }
                  }
                ]
              },
              {
                "type":"table",
                "content":[
                  {
                    "type":"tableRow",
                    "content":[
                      {
                        "type":"tableHeader",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"Name"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type":"tableHeader",
                        "attrs":{
                          "colspan":3,
                          "rowspan":1,
                          "colwidth":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"Description"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type":"tableRow",
                    "content":[
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"Cyndi Lauper"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"singer"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"songwriter"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"actress"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type":"tableRow",
                    "content":[
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"Philipp Kühn"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"designer"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"developer"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"maker"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type":"tableRow",
                    "content":[
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"Hans Pagel"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":1,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"wrote this"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type":"tableCell",
                        "attrs":{
                          "colspan":2,
                          "rowspan":1,
                          "colwidth":null,
                          "backgroundColor":null
                        },
                        "content":[
                          {
                            "type":"paragraph",
                            "attrs":{
                              "textAlign":"left"
                            },
                            "content":[
                              {
                                "type":"text",
                                "text":"that’s it"
                              }
                            ]
                          }
                        ]
                      }
                    ]
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
                "attrs":{
                  "textAlign":"left"
                },
                "content":[
                  {
                    "type":"text",
                    "text":"第一段"
                  }
                ]
              },
              {
                "type":"paragraph",
                "attrs":{
                  "textAlign":"left"
                },
                "content":[
                  {
                    "type":"text",
                    "text":"第二段"
                  }
                ]
              },
              {
                "type":"paragraph",
                "attrs":{
                  "textAlign":"left"
                },
                "content":[
                  {
                    "type":"text",
                    "text":"第三段"
                  },
                  {
                    "type":"customerTag",
                    "attrs":{
                      "type":"string",
                      "index":"被翻译的文本"
                    },
                    "content":[
                      {
                        "type":"text",
                        "text":"这是一段常量文本"
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
        {id:'image',name:'插入图片'},
        {id:'chart',name:'插入表格'},
      ],
      defaultProps:[
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
        LineHeight,
        CustomerTag,
        ContentBox,
        CustomImage.configure({
          inline:true
        }),
        Image.configure({
          inline:true
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Focus.configure({
          className: 'focus',
          mode: 'shallowest',
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell
      ],
      dialogVisible:false,
      dialogVisible2:false,
      dialogContent:'',
      dialogType:'string',
    }
  },

  mounted() {
    let that = this
    this.editor = new Editor({
      extensions: this.defaultProps,
      content: this.json,
      editable: true,
      onCreate(){
        console.log("初始化")
      },
      onUpdate(){
        console.log("数据更新")
      },
      onFocus({ editor, event }) {
        that.handleFocus(editor,event)
      },
      getTag(v){
        that.selectNode = v
      },
      getParagraph(v){
        that.selectParagraph = v
      },
    })

  },

  beforeDestroy() {
    this.editor.destroy()
  },
  methods:{
    changeSize(){
      this.editor.chain().focus().setImageSize([100,100]).run()
    },
    imageCommit(url){
      this.editor.chain().focus().setCustomerImage({ src: url }).run()
      this.dialogVisible2 = false
    },
    handleSelect(){

    },
    handleAddLine(append=false){
      let position = this.editor.getCharacterCount()+2
      if(this.selectParagraph&&!append){
        position = this.selectParagraph.getPos() + this.selectParagraph.node.nodeSize
      }
      this.editor.commands.insertContentAt(position,{
        "type":"contentBox",
        "content":[{
          "type":"paragraph",
          "content":[]
        }]
      })

    },
    handleAppendTag(){
      let text = prompt("输入占位字符",)
      this.editor.commands.insertContent({
        "type":"customerTag",
        "attrs":{
          "type":"string",
          "index":"被翻译的文本"
        },
        "content":[
          {
            "type":"text",
            "text":text
          }
        ]
      })

    },
    handleInsertImage(){
      this.dialogVisible2 = true
    },
    handleFocus(v){
      this.editor = v
    },
    handleClick(){
      console.log(JSON.stringify(this.editor.getJSON()))
    },
    handleClick2(){
      this.dialogContent = `<div>${this.editor.getHTML()}</div>`
      this.dialogVisible = true
    },
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

  //img {
  //  max-width: 100%;
  //  height: auto;
  //}

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



</style>
<style>
.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>
