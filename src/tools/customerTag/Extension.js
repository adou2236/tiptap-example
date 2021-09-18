import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './ComponentEdit.vue'

export default Node.create({
    name: 'custom-tag',
    group: 'inline',
    inline: true,
    selectable: true,
    draggable: true,

    //添加里字段
    addAttributes() {
        return {
            type: {
                default: 'variety',
            },
            coverText:{
                default:"新建文本"
            },
            content: {
                default: {},
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
    addCommands() {
        return {
            //设置翻译后文本的样式
            setInnerAttribute: (options) => ({commands}) => {
                console.log(options)
            },
            //标签文字加粗
            toggleBold: (options) => ({ chain }) => {
                if(tr.selection?.node?.type?.name === 'custom-tag') {
                    return commands.updateAttributes('custom-image', options)
                }
                else {
                    return chain()
                        .setMark('textStyle', { fontFamily: null })
                        .removeEmptyTextStyle()
                        .run()
                }
            },
        }
    },
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
        // console.log("Node",node,this)
        return ['span', mergeAttributes(HTMLAttributes),`${node.attrs.index}`]
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
