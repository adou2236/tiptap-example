import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './ContentBox.vue'

export default Node.create({
    name: 'contentBox',
    group: 'block',
    inline: false,
    content: 'block*',
    defining: true,
    isolating: true,
    draggable: false,

    //添加里字段
    addAttributes() {
        return {
        }
    },

    parseHTML() {
        return [{tag: 'div'}]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
