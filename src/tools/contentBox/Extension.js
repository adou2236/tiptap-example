import {Node, mergeAttributes, getSchema, getHTMLFromFragment} from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './ContentBox.vue'
import {optionsInit} from "../../unit/baseType";


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
            insertNewLine: (type='single') => ({ editor,chain,commands }) => {
                let content = {}
                if(type === 'single'){
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
                                                            "fontColor": "red",
                                                            "fontSize": "20px",
                                                        }
                                                    }
                                                ],
                                                text: '标题',
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
                                                text: '来源',
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
                                                            "fontColor": "red",
                                                            "fontSize": "20px",
                                                        }
                                                    }
                                                ],
                                                text: '标题',
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
                                                text: '来源',
                                            },
                                        ],
                                    },
                                ],
                            }
                        ]
                    }

                }
                let position = editor.getCharacterCount()+2
                return commands.insertContentAt(position,content)
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
