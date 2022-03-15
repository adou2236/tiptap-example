import Table from '@tiptap/extension-table'
import {mergeAttributes, Node} from '@tiptap/core'



export default Node.create({
    name: 'template-table',
    draggable:false,

    addAttributes() {
        return {
            customType: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [{tag: 'template-table'}]
    },

    renderHTML({ node, HTMLAttributes }) {
        let attr = {
            src:HTMLAttributes.src,
            class:'template-table'
        }
        return [
            'div',
            mergeAttributes(attr),
            '模板表格'
        ]
    },

})
