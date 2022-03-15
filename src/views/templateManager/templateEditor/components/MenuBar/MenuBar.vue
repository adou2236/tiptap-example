<template>
  <div>
    <template v-for="(item, index) in items">
      <div class="divider" v-if="item.type === 'divider'" :key="index" />
      <menu-item v-else :key="index" v-bind="item" />
    </template>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'
import ColorPicker from "./ColorPicker";
import NormalPicker from "./NormalPicker"
import {chartColor} from "../../unit/baseType";

export default {
  components: {
    MenuItem,
  },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      items: [
        {
          icon: 'bold',
          title: '加粗',
          action: () => this.editor.chain().focus().toggleFontWeight().run(),
          isActive: () => this.editor.getAttributes("textStyle").fontWeight,
        },
        {
          icon: 'italic',
          title: '斜体',
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.getAttributes("textStyle").italic,
        },
        {
          icon: 'strikethrough',
          title: '删除线',
          action: () => this.editor.chain().focus().toggleCenterline().run(),
          isActive: () => this.editor.getAttributes("textStyle").centerLine,
        },
        {
          icon: 'underline',
          title: '下划线',
          action: () => this.editor.chain().focus().toggleUnderline().run(),
          isActive: () => this.editor.getAttributes("textStyle").underLine,
        },
        {
          icon: 'emphasis-cn',
          title: '字体',
          selector: true,
          components: NormalPicker,
          options:[
            {label:'Arial', id:"Arial"},
            {label:'黑体', id:"SimHei"},
            {label:'宋体', id:"SimSun"},
            {label:"楷体", id:"KaiTi"},
            {label:"隶书", id:"LiSu"},
            {label:"幼圆", id:"YouYuan"},
            {label:"华文细黑", id:"STXihei"},
            {label:"华文宋体", id:"STSong"},
            {label:"华文中宋", id:"STZhongsong"},
            {label:"华文仿宋", id:"STFangsong"},
            {label:"方正舒体", id:"FZShuTi"},
            {label:"方正姚体", id:"FZYaoti"},
            {label:"华文彩云", id:"STCaiyun"},
            {label:"华文琥珀", id:"STHupo"},
            {label:"华文隶书", id:"STLiti"},
            {label:"华文行楷", id:"STXingkai"},
            {label:"华文新魏", id:"STXinwei"},
          ],
          action: (param) => this.editor.chain().focus().setFontFamily(param).run(),
          isActive: () => this.editor.getAttributes("textStyle").fontFamily,
        },
        {
          icon: 'font-color',
          title: '颜色',
          selector: true,
          components: ColorPicker,
          options:[...chartColor,'#FFFFFF'],
          action: (param) => this.editor.chain().focus().setFontColor(param).run(),
          isActive: () => this.editor.getAttributes("textStyle").fontColor,
        },
        {
          icon: 'font-size',
          title: '字号',
          selector: true,
          components: NormalPicker,
          options:[
            {id:'34px',label:'一号'},
            {id:'32px',label:'小一'},
            {id:'29px',label:'二号'},
            {id:'24px',label:'小二'},
            {id:'22px',label:'三号'},
            {id:'20px',label:'小三'},
            {id:'18px',label:'四号'},
            {id:'16px',label:'小四'},
            {id:'14px',label:'五号'},
            {id:'12px',label:'小五'},
          ],
          action: (param) => this.editor.chain().focus().setFontSize(param).run(),
          isActive: () => this.editor.getAttributes("textStyle").fontSize,
        },
        {
          type: 'divider',
        },
        {
          icon: 'align-left',
          title: '左对齐',
          action: () => this.editor.chain().focus().setTextAlign('left').run(),
          isActive: () => this.editor.isActive({ textAlign: 'left' }),
        },
        {
          icon: 'align-center',
          title: '居中对齐',
          action: () => this.editor.chain().focus().setTextAlign('center').run(),
          isActive: () => this.editor.isActive({ textAlign: 'center' }),
        },
        {
          icon: 'align-right',
          title: '右对齐',
          action: () => this.editor.chain().focus().setTextAlign('right').run(),
          isActive: () => this.editor.isActive({ textAlign: 'right' }),
        },
        {
          icon: 'align-justify',
          title: '两端对齐',
          action: () => this.editor.chain().focus().setTextAlign('justify').run(),
          isActive: () => this.editor.isActive({ textAlign: 'justify' }),
        },
        {
          type: 'divider',
        },
        {
          icon: 'heading',
          title: '总标题',
          action: () => this.editor.chain().focus().toggleTitle().run(),
          isActive: () => this.editor.isActive('title'),
        },
        {
          icon: 'h-1',
          title: '标题1',
          action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 1 }),
        },
        {
          icon: 'h-2',
          title: '标题2',
          action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 2 }),
        },
        {
          icon: 'h-3',
          title: '标题3',
          action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 3 }),
        },
        {
          icon: 'h-4',
          title: '标题4',
          action: () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 4 }),
        },
        {
          icon: 'h-5',
          title: '标题5',
          action: () => this.editor.chain().focus().toggleHeading({ level: 5 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 5 }),
        },
        {
          icon: 'paragraph',
          title: '正文',
          action: () => this.editor.chain().focus().setParagraph().run(),
          isActive: () => this.editor.isActive('paragraph'),
        },
        // {
        //   icon: 'list-unordered',
        //   title: '列表',
        //   action: () => this.editor.chain().focus().toggleBulletList().run(),
        //   isActive: () => this.editor.isActive('bulletList'),
        // },
        // {
        //   icon: 'list-ordered',
        //   title: '有序列表',
        //   action: () => this.editor.chain().focus().toggleOrderedList().run(),
        //   isActive: () => this.editor.isActive('orderedList'),
        // },
        // {
        //   icon: 'code-box-line',
        //   title: '代码块',
        //   action: () => this.editor.chain().focus().toggleCodeBlock().run(),
        //   isActive: () => this.editor.isActive('codeBlock'),
        // },
        // {
        //   icon: 'line-height',
        //   title: '行间距',
        //   selector: true,
        //   components: NormalPicker,
        //   options:[
        //     {id:'1em',label:'1'},
        //     {id:'1.15em',label:'1.15'},
        //     {id:'1.5em',label:'1.5'},
        //     {id:'2em',label:'2'},
        //     {id:'2.5em',label:'2.5'},
        //     {id:'3em',label:'3'},
        //   ],
        //   action: (param) => this.editor.chain().focus().setLineHeight(param).run(),
        //   isActive: () => this.editor.getAttributes("textStyle").lineHeight,
        // },
        // {
        //   type: 'divider',
        // },
        // {
        //   icon: 'double-quotes-l',
        //   title: '引用',
        //   action: () => this.editor.chain().focus().toggleBlockquote().run(),
        //   isActive: () => this.editor.isActive('blockquote'),
        // },
        // {
        //   icon: 'separator',
        //   title: '水平分割线',
        //   action: () => this.editor.chain().focus().setHorizontalRule().run(),
        // },
        {
          type: 'divider',
        },
        // {
        //   icon: 'text-wrap',
        //   title: '强制换行',
        //   action: () => this.editor.chain().focus().setHardBreak().run(),
        // },
        {
          icon: 'format-clear',
          title: '清除样式',
          action: () => this.editor.chain()
              .focus()
              .clearNodes()
              .unsetAllMarks()
              .run(),
        },
        // {
        //   type: 'divider',
        // },
        {
          icon: 'arrow-go-back-line',
          title: '撤销',
          action: () => this.editor.chain().focus().undo().run(),
        },
        {
          icon: 'arrow-go-forward-line',
          title: '反撤销',
          action: () => this.editor.chain().focus().redo().run(),
        },
        // {
        //   type: 'divider',
        // },
        // {
        //   icon: 'layout-column-line',
        //   title: '分栏',
        //   action: () => {
        //     this.editor.chain().focus().toggleSplit().run()
        //   },
        //   isActive: () => this.editor.getAttributes('content-box').isSplit,
        // },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.divider {
  width: 2px;
  height: 1.25rem;
  background-color: rgba(0, 0, 0, 0.1);
  margin-left: 0.5rem;
  margin-right: 0.75rem;
}
</style>
