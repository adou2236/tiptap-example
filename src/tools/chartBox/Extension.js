import {mergeAttributes, Node} from '@tiptap/core'
import {VueNodeViewRenderer} from "@tiptap/vue-2";
import Component from "./chartBox.vue";

export default Node.create({
    name: 'custom-chart',
    group: 'block',
    inline: false,
    content: 'block*',
    selectable: true,
    defining: true,
    isolating: true,
    draggable: false,
    atom:true,
    //查询表格所用到的指标
    //方案一：配置存本地，数据通过请求获得
    //方案二：配置与数据参数均通过请求获取，通过两个请求完成绘图✅
    addAttributes() {
        return {
            index:{
                default:1
            },
            //完成绘图后生成的base64
            src:{
                default:"#"
            }
        }
    },

    // addCommands() {
    //     return {
    //         setCustomerImage: (options) => ({ tr, commands }) => {
    //             if(tr.selection?.node?.type?.name === 'custom-image') {
    //                 return commands.updateAttributes('custom-image', options)
    //             }
    //             else {
    //                 return commands.insertContent({
    //                     type: this.name,
    //                     attrs: options
    //                 })
    //             }
    //         },
    //         setImageSize: (options) => ({ tr, commands  }) => {
    //             return commands.updateAttributes('custom-image', {width:options[0],height:options[1]})
    //         },
    //     }
    // },

    parseHTML() {
        return [{tag: 'custom-chart'}]
    },

    renderHTML({HTMLAttributes}) {
        let attr = {
            ...HTMLAttributes,
            class:'chart'
        }
        return ['img', mergeAttributes(attr)]
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
