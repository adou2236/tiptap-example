import {Node, mergeAttributes, getSchema} from '@tiptap/core'
import {generateHTML, VueNodeViewRenderer} from '@tiptap/vue-2'
import { Plugin, PluginKey } from 'prosemirror-state'
import Component from './ComponentEdit.vue'

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
            //文本id，由id获取局部变量
            id: {
                default:null
            },
            coverText:{
                default:"新建文本"
            },
            content: {
                default: {},
            },
            text:{
                default:''
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
        }
    },
    addProseMirrorPlugins () {
        const that = this
        return [
            new Plugin({
                key: new PluginKey('eventHandler'),
                props: {
                    handleDoubleClickOn(view, pos, node, event) {
                        if(node?.type?.name === 'custom-tag'){
                            that.editor.options.onTagDoubleClick(node)
                        }
                    },

                }
            })
        ]
    },

    renderHTML({node,HTMLAttributes}) {
        //此处增加翻译逻辑
        // 深度优先递归执行❌太难
        //将数据分解为表达式与结果，翻译时计算结果值
        const {text} = node.attrs
        return ['span', mergeAttributes(),`${text}`]
    },



    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
