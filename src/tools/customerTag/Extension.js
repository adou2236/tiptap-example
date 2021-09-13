import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './ComponentEdit.vue'

export default Node.create({
    name: 'custom-tag',
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
                tag: 'custom-tag',
            },
        ]
    },
    // addCommands() {
    //     return {
    //         //设置翻译后文本的样式
    //         setInnerAttribute: (options) => ({commands}) => {
    //             console.log(options)
    //         },
    //     }
    // },
    // addProseMirrorPlugins () {
    //     const that = this
    //     return [
    //         new Plugin({
    //             key: new PluginKey('eventHandler'),
    //             props: {
    //                 handleKeyDown (view, pos) {
    //                     if(pos.code === 'Space'||pos.code === 'Enter'){
    //                         that.editor.chain().focus().editorOver().run()
    //                     }
    //                 }
    //             }
    //         })
    //     ]
    // },

    renderHTML({node,HTMLAttributes}) {
        //此处增加翻译逻辑
        console.log("Node",node,this)
        return ['span', mergeAttributes(HTMLAttributes),`${node.attrs.index}`]
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
