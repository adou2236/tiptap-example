import {Node, mergeAttributes, getSchema} from '@tiptap/core'
import {generateHTML, VueNodeViewRenderer} from '@tiptap/vue-2'
import Component from './ComponentEdit.vue'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

export default Node.create({
    name: 'custom-tag',
    group: 'inline',
    inline: true,
    selectable: true,
    draggable: false,

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
            },

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
        // 深度优先递归执行❌太难
        //将数据分解为表达式与结果，翻译时计算结果值
        const {result} = node.attrs
        return ['span', mergeAttributes(),`${result}`]
    },



    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
