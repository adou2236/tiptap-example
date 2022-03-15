import {Node, mergeAttributes, getSchema, getHTMLFromFragment} from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './ContentBox.vue'


export default Node.create({
    name: 'content-box',
    group: 'block',
    inline: false,
    content: 'block*',
    defining: true,
    isolating: true,
    draggable: false,




    //添加里字段
    addAttributes() {
        return {
            isSplit: {
                default:false
            }
        }
    },
    addCommands() {
        return {
            toggleSplit:(node) => (as) => {
                let {tr,editor,commands,view} =  as
                let {isSplit} = editor.getAttributes('content-box')
                let content = {}
                if(isSplit){
                    content  = {
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
                }else{
                    content = {
                        "type":"content-box",
                        "attrs":{
                            "isSplit":true
                        },
                        "content":[
                            {
                                type: 'figure-chart',
                                content: [
                                    {
                                        type: 'figcaption',
                                        attrs:{
                                            'type':"chart-title",
                                        },
                                        content: [
                                            {
                                                type: 'text',
                                                marks: [
                                                    {
                                                        "type": "textStyle",
                                                        "attrs": {
                                                            "fontColor": "#A60922",
                                                            "fontSize": "16px",
                                                            "fontFamily":"KaiTi",
                                                            "fontWeight":true
                                                        }
                                                    }
                                                ],
                                                text: '标题：',
                                            },
                                        ],
                                    },
                                    {
                                        type:'custom-chart',
                                        attrs: {
                                            placeholder:true
                                        }
                                    },
                                    {
                                        type: 'figcaption',
                                        attrs:{
                                            'type':"chart-source",
                                        },
                                        content: [
                                            {
                                                type: 'text',
                                                text: '资料来源',
                                                marks: [
                                                    {
                                                        "type": "textStyle",
                                                        "attrs": {
                                                            "fontFamily":"KaiTi",
                                                        }
                                                    }
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'figure-chart',
                                content: [
                                    {
                                        type: 'figcaption',
                                        attrs:{
                                            'type':"chart-title",
                                        },
                                        content: [
                                            {
                                                type: 'text',
                                                marks: [
                                                    {
                                                        "type": "textStyle",
                                                        "attrs": {
                                                            "fontColor": "#A60922",
                                                            "fontSize": "16px",
                                                            "fontFamily":"KaiTi",
                                                            "fontWeight":true
                                                        }
                                                    }
                                                ],
                                                text: '标题：',
                                            },
                                        ],
                                    },
                                    {
                                        type:'custom-chart',
                                        attrs: {
                                            placeholder:true
                                        }
                                    },
                                    {
                                        type: 'figcaption',
                                        attrs:{
                                            'type':"chart-source",
                                        },
                                        content: [
                                            {
                                                type: 'text',
                                                text: '资料来源',
                                                marks: [
                                                    {
                                                        "type": "textStyle",
                                                        "attrs": {
                                                            "fontFamily":"KaiTi",
                                                        }
                                                    }
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            }
                        ]
                    }
                }
                return false
            },
            insertNewLine: (type='single',pos='end',from,size) => ({ editor,commands,chain }) => {
                let content  = {
                    "type":"content-box",
                    "attrs":{
                        "isSplit":false
                    },
                    "content":[
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": "left",
                            }
                        }
                    ]
                }
                let position = editor.getCharacterCount()+2
                if(pos == 'above'){
                    position = from
                }else if(pos == 'below'){
                    position = from+size
                }
                return chain().insertContentAt(position,content).focus(position+2)
            },
        }
    },

    parseHTML() {
        return [{tag: 'content-box'}]
    },

    renderHTML({HTMLAttributes}) {
        return ['div', mergeAttributes(HTMLAttributes),0]
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
