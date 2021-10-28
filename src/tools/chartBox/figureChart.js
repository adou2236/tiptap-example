import CustomChart from "./Extension"
import { mergeAttributes } from '@tiptap/core'
import {VueNodeViewRenderer} from "@tiptap/vue-2";
import { Figure } from '../figure/figure'
import { Figcaption } from '../figure/figcaption'
import {optionsInit} from "../../unit/baseType";


export default Figure.extend({
    name: 'figure-chart',
    draggable:false,

    addAttributes() {
        return {
            // id:{
            //     default:null
            // },
        }
    },

    addCommands() {
        return {
            ...this.parent?.(),
            insertFigureChart:(attrs) => ({tr,commands}) => {
                return commands.insertContent({
                    type: 'figure-chart',
                    attrs: {
                        ...attrs,
                        class:'chart'
                    },
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
                                    text: attrs.title,
                                },
                            ],
                        },
                        {
                            type:'custom-chart',
                            attrs: attrs
                        },
                        {
                            type: 'figcaption',
                            attrs:{
                                'type':"chart-source",
                            },
                            content: [
                                {
                                    type: 'text',
                                    text: attrs.source,
                                },
                            ],
                        },
                    ],
                })
            },
            setChartIndex:(index) => ({tr}) => {
                tr.curSelection.node.attrs.index = index
                return false
            },
            setChartOption:(option) => ({tr}) => {
                tr.curSelection.node.attrs.options = option
                return false
            }

        }
    },

    parseHTML() {
        return [{tag: 'figure-chart'}]

    },

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
