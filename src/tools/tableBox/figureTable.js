import CustomChart from "./Extension"
import { mergeAttributes } from '@tiptap/core'
import {VueNodeViewRenderer} from "@tiptap/vue-2";
import { Figure } from '../figure/figure'
import { Figcaption } from '../figure/figcaption'
import {optionsInit} from "../../unit/baseType";


export default Figure.extend({
    name: 'figure-table',
    content: 'figcaption table',
    draggable:false,

    addAttributes() {
        return {
            id:{
                default:null
            },
        }
    },

    addCommands() {
        return {
            ...this.parent?.(),
            insertFigureTable:(row,col) => ({chain,tr,commands}) => {
                return chain().insertContent({
                    type: 'figure-table',
                    attrs: {
                        class:'table'
                    },
                    content: [
                        {
                            type: 'figcaption',
                            attrs:{
                                'type':"table-title",
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
                                    text: "表格标题",
                                },
                            ],
                        },
                        {
                            type: 'table',
                            content: [
                                {
                                    type: 'tableRow',
                                    content: [
                                        {
                                            type: 'tableCell',
                                            content: [
                                                {
                                                    type: 'paragraph',
                                                    content: [
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            type: 'tableCell',
                                            content: [
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                })
            },
        }
    },

    // // parseHTML() {
    // //     return [{tag: 'figure-table'}]
    //
    // },

    // renderHTML({node,HTMLAttributes}) {
    //     console.log("aaa",HTMLAttributes)
    //     let attr = {
    //         src:HTMLAttributes.src,
    //         class:'chart'
    //     }
    //     const {title,source} = node.attrs
    //     return ['div',mergeAttributes({class:'chart'}),
    //         ['div',mergeAttributes({class:'title'}),title],
    //         ['img', mergeAttributes(attr)],
    //         ['div',mergeAttributes({class:'source'}),source]
    //     ]
    // },
})
