import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './ContentBox.vue'
import Paragraph from '@tiptap/extension-paragraph'


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
            getParagraphHtml: (node) => ({tr}) => {
                console.log(tr.selectAll)
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
