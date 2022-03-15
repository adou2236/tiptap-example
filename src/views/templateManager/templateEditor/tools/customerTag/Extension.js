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
            setInnerAttribute: (attrs) => ({tr,commands,chain,state}) => {
                let {selection} = tr
                if(selection?.node?.type?.name === 'custom-tag') {
                    return chain().updateAttributes('custom-tag', attrs).setNodeSelection(selection.from).run()
                }
            },
            insertSmartTag:(attrs) => ({chain,tr,commands}) => {
                let {selection} = tr
                return chain().insertContent({
                    type: 'custom-tag',
                    attrs: attrs,
                }).setNodeSelection(selection.from)
            },
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

    //本地翻译使用，目前已废除
    renderHTML({node,HTMLAttributes}) {
        const {text} = node.attrs
        return ['span', mergeAttributes(),`${text}`]
    },

    renderText({node}){
        const {coverText = ''} = node.attrs
        return coverText
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
