import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './ComponentEdit.vue'

export default Node.create({
    name: 'customerTag',
    group: 'inline',
    inline: true,
    content: 'text*',
    selectable: true,
    draggable: false,

    //添加里字段
    addAttributes() {
        return {
            type: {
                default: 'string',
            },
            index: {
                default: 'none',
                require: true
            }

        }
    },

    parseHTML() {
        return [
            {
                tag: 'customer-tag',
            },
        ]
    },

    renderHTML({node,HTMLAttributes}) {
        return ['span', mergeAttributes(HTMLAttributes),`${node.attrs.index}`]
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
