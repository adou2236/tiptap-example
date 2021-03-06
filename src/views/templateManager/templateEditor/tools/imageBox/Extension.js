import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

export default Image.extend({
    name: 'custom-image',
    draggable:false,

    addAttributes() {
        return {
            ...Image.config.addAttributes(),
            width: {
                default: null,
            },
            height:{
                default: null
            }

        }
    },

    addCommands() {
        return {
            setCustomerImage: (options) => ({ tr, commands }) => {
                if(tr.selection?.node?.type?.name === 'custom-image') {
                    return commands.updateAttributes('custom-image', options)
                }
                else {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options
                    })
                }
            },
            setImageSize: (options) => ({ tr, commands  }) => {
                return commands.updateAttributes('custom-image', {width:options[0],height:options[1]})
            },
        }
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            'img',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
        ]
    },
    //TODO,图片大小设置
    // addNodeView() {
    //     return VueNodeViewRenderer(Component)
    // },
})
