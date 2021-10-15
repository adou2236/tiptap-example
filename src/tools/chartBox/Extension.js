import {mergeAttributes, Node} from '@tiptap/core'
import {VueNodeViewRenderer} from "@tiptap/vue-2";
import Component from "./chartBox.vue";

export default Node.create({
    name: 'custom-chart',
    group: 'block',
    content: 'block*',
    selectable: true,
    draggable: false,
    atom: true,
    //查询表格所用到的指标
    //方案一：配置存本地，数据通过请求获得
    //方案二：配置与数据参数均通过请求获取，通过两个请求完成绘图✅

    addAttributes() {
        return {
            id:{
              default:null
            },
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
            },
            title:{
                default:'标题'
            },
            source:{
                default:'来源'
            }
        }
    },


    addCommands() {
        return {
            upDateChartOptions: (options) => ({ tr, commands  }) => {
                if(tr.selection?.node?.type?.name === 'custom-chart') {
                    console.log("能执行")
                    return commands.updateAttributes('custom-chart', {options:options})
                }
            },
        }
    },

    parseHTML() {
        return [{tag: 'custom-chart'}]
    },

    renderHTML({node,HTMLAttributes}) {
        // console.log(HTMLAttributes)
        let attr = {
            src:HTMLAttributes.src,
            class:'chart'
        }
        const {title,source} = node.attrs
        return ['div',
                ['div',mergeAttributes({class:'title'}),title],
                ['img', mergeAttributes(attr)],
                ['div',mergeAttributes({class:'source'}),
                source]]
    },
    addNodeView() {
        return VueNodeViewRenderer(Component);
    },
})
