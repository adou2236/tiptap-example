import {mergeAttributes, Node} from '@tiptap/core'
import {VueNodeViewRenderer} from "@tiptap/vue-2";
import Component from "./chartBox.vue";

export default Node.create({
    name: 'custom-chart',
    group: 'block',
    // inline: false,
    selectable: true,
    draggable: false,
    atom: true,
    //查询表格所用到的指标
    //方案一：配置存本地，数据通过请求获得
    //方案二：配置与数据参数均通过请求获取，通过两个请求完成绘图✅

    addAttributes() {
        return {
            //后台所用数据
            index:{
                default:{}
            },
            //完成绘图后生成的base64
            src:{
                default:"#"
            },
            options:{
                default:{}
            }
        }
    },

    addCommands() {
        return {
            upDateChartOptions: (options) => ({ tr, commands  }) => {
                let isChange = JSON.stringify(options) !== JSON.stringify(tr.selection?.node?.attrs?.options)
                if(tr.selection?.node?.type?.name === 'custom-chart'&&isChange) {
                    return commands.updateAttributes('custom-chart', {options:options})
                }
            },
        }
    },

    parseHTML() {
        return [{tag: 'custom-chart'}]
    },

    renderHTML({HTMLAttributes}) {
        let attr = {
            src:HTMLAttributes.src,
            class:'chart'
        }
        return ['img', mergeAttributes(attr)]
    },
    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
})
