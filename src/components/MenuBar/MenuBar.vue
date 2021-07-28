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
import FontSizePicker from "./FontSizePicker"
import FontFamilyPicker from "./FontFamilyPicker";
import TableSelector from './TableSelector'

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
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive('bold'),
        },
        {
          icon: 'italic',
          title: '斜体',
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.isActive('italic'),
        },
        {
          icon: 'strikethrough',
          title: '删除线',
          action: () => this.editor.chain().focus().toggleStrike().run(),
          isActive: () => this.editor.isActive('strike'),
        },
        {
          icon: 'underline',
          title: '下划线',
          action: () => this.editor.chain().focus().toggleUnderline().run(),
          isActive: () => this.editor.isActive('underline'),
        },
        {
          icon: 'font-family',
          title: '字体',
          selector: true,
          components: FontFamilyPicker,
          options:[
            {label:"隶书", id:"LiSu"},
            {label:"幼圆", id:"YouYuan"},
            {label:"华文细黑", id:"STXihei"},
            {label:"华文楷体", id:"STKaiti"},
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
          options:['red','blue','black','pink'],
          action: (param) => this.editor.chain().focus().setFontColor(param).run(),
          isActive: () => this.editor.getAttributes("textStyle").fontColor,
        },
        {
          icon: 'font-size',
          title: '字号',
          selector: true,
          components: FontSizePicker,
          options:['12px','13px','14px','15px','16px','17px','18px','19px','20px'],
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
          icon: 'paragraph',
          title: '正文',
          action: () => this.editor.chain().focus().setParagraph().run(),
          isActive: () => this.editor.isActive('paragraph'),
        },
        {
          icon: 'list-unordered',
          title: '列表',
          action: () => this.editor.chain().focus().toggleBulletList().run(),
          isActive: () => this.editor.isActive('bulletList'),
        },
        {
          icon: 'list-ordered',
          title: '有序列表',
          action: () => this.editor.chain().focus().toggleOrderedList().run(),
          isActive: () => this.editor.isActive('orderedList'),
        },
        {
          icon: 'code-box-line',
          title: '代码块',
          action: () => this.editor.chain().focus().toggleCodeBlock().run(),
          isActive: () => this.editor.isActive('codeBlock'),
        },
        {
          type: 'divider',
        },
        {
          icon: 'layout-grid-line',
          title: '表格',
          selector: true,
          components: TableSelector,
          action: ({row,col}) => {
            this.editor.chain().focus().insertTable({rows:row,cols:col,withHeaderRow: false}).run()
          },
        },
        {
          type: 'divider',
        },
        {
          icon: 'double-quotes-l',
          title: '引用',
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
          isActive: () => this.editor.isActive('blockquote'),
        },
        {
          icon: 'separator',
          title: '水平分割线',
          action: () => this.editor.chain().focus().setHorizontalRule().run(),
        },
        {
          type: 'divider',
        },
        {
          icon: 'text-wrap',
          title: '强制换行',
          action: () => this.editor.chain().focus().setHardBreak().run(),
        },
        {
          icon: 'format-clear',
          title: '清除样式',
          action: () => this.editor.chain()
              .focus()
              .clearNodes()
              .unsetAllMarks()
              .run(),
        },
        {
          type: 'divider',
        },
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
