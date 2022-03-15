import { Figure } from '../figure/figure'



export default Figure.extend({
    name: 'figure-table',
    // content: 'figcaption table templateTable',
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
            insertFigureTable:(attrs) => ({chain,tr,commands}) => {
                let {selection} = tr
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
                                                "fontColor": "#A60922",
                                                "fontSize": "20px",
                                                "fontFamily":"KaiTi",
                                                "fontWeight":true
                                            }
                                        }
                                    ],
                                    text: attrs.title,
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
                                                {
                                                    type: 'paragraph',
                                                    content: [
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'figcaption',
                            attrs:{
                                'type':"table-source",
                            },
                            content: [
                                {
                                    type: 'text',
                                    marks: [
                                        {
                                            "type": "textStyle",
                                            "attrs": {
                                                "fontFamily":"KaiTi",
                                                "fontSize": "18px",
                                            }
                                        }
                                    ],
                                    text: attrs.source,
                                },
                            ],
                        },
                    ],
                }).focus(selection.from+9).run()
            },
            insertTemplateTable:(attrs) => ({chain,tr,commands}) => {
                return chain().insertContent({
                    type: 'figure-table',
                    attrs: {
                        class:'table',
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
                                                "fontColor": "#A60922",
                                                "fontSize": "20px",
                                                "fontFamily":"KaiTi",
                                                "fontWeight":true
                                            }
                                        }
                                    ],
                                    text: attrs.title,
                                },
                            ],
                        },
                        {
                            type: 'template-table',
                            attrs: {
                                customType:attrs.customType
                            }
                        },
                        {
                            type: 'figcaption',
                            attrs:{
                                'type':"table-source",
                            },
                            content: [
                                {
                                    type: 'text',
                                    marks: [
                                        {
                                            "type": "textStyle",
                                            "attrs": {
                                                "fontFamily":"KaiTi",
                                                "fontSize": "18px",
                                            }
                                        }
                                    ],
                                    text: attrs.source,
                                },
                            ],
                        },
                    ],
                })

            },
            figureTableCellMerge:() => (chain,tr,commands) => {

            }
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
