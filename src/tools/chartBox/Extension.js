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

    addAttributes() {
        return {
            id:{
              default:null
            },
            //是否为占位表
            placeholder:{
                default:false
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
        }
    },


    addCommands() {
        return {
            upDateChartOptions: (options) => ({ tr, commands  }) => {
                if(tr.selection?.node?.type?.name === 'custom-chart') {
                    return commands.updateAttributes('custom-chart', {options:options})
                }
            },
        }
    },

    parseHTML() {
        return [{tag: 'custom-chart'}]
    },

    renderHTML({node,HTMLAttributes}) {
        let attr = {
            src:HTMLAttributes.src,
            class:'chart'
        }
        return ['img', mergeAttributes(attr)]
    },
    addNodeView() {
        return VueNodeViewRenderer(Component);
    },
})
