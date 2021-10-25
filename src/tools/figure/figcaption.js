import { Node, mergeAttributes } from '@tiptap/core'

export const Figcaption = Node.create({
    name: 'figcaption',

    addAttributes() {
        return {
            "type":{
                default:null
            },
        }
    },

    defaultOptions: {
        HTMLAttributes: {},
    },

    content: 'inline*',

    selectable: false,

    draggable: false,

    parseHTML() {
        return [
            {
                tag: 'figcaption',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['figcaption', mergeAttributes(HTMLAttributes), 0]
    },
})
