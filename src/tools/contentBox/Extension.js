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
            getParagraphHtml: () => (node) => {
                console.log(this)
                console.log(node)
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
