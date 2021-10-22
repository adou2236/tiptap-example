import Table from '@tiptap/extension-table'
import { mergeAttributes } from '@tiptap/core'
import {VueNodeViewRenderer} from "@tiptap/vue-2";
import { Figure } from '../figure/figure'
import { Figcaption } from '../figure/figcaption'


export default Figure.extend({
    name: 'custom-table',
    draggable:false,

    addCommands() {
        return {
            ...this.parent?.(),
            insertCustomTable:(option) => ({tr,commands}) => {
                return commands.insertContent({
                    type: 'custom-table',
                    content: [
                        {
                            type: 'figcaption',
                            content: [
                                {
                                    type: 'text',
                                    text: '文章标题',
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
                                                        {
                                                            type: 'text',
                                                            text: 'cell 1',
                                                        },
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
                                                        {
                                                            type: 'text',
                                                            text: 'cell 2',
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                })
            },
            setTableTitle: (title) => ({ tr, commands }) => {
                if(tr.selection?.node?.type?.name === 'custom-table') {
                    return commands.updateAttributes('custom-table', {title:title})
                }
            },
        }
    },

    //TODO,图片大小设置
    // addNodeView() {
    //     return VueNodeViewRenderer(Component)
    // },
})
