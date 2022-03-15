import { Figure } from '../figure/figure'


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
            insertFigureChart:(attrs) => ({chain,tr,commands}) => {
                let {selection} = tr
                return chain().insertContent({
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
                }).setNodeSelection(selection.from+7)
            },
            setChartIndex:(index) => ({tr}) => {
                tr.curSelection.node.attrs.index = index
                return false
            },
            setChartOption:(option) => ({tr}) => {
                tr.curSelection.node.attrs.options = option
                return false
            },
            saveToImage:() => (as) =>{
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
