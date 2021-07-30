<template>
  <div
      class="bubble-menu"
      v-if="editor&&editor.isActive('table')"
  >
    <button @click="editor.chain().focus().deleteColumn().run()" :disabled="!editor.can().deleteColumn()">
      删除当前列
    </button>
    <button @click="editor.chain().focus().deleteRow().run()" :disabled="!editor.can().deleteRow()">
      删除当前行
    </button>
    <button @click="editor.chain().focus().addColumnBefore().run()" :disabled="!editor.can().addColumnBefore()">
      前插入列
    </button>
    <button @click="editor.chain().focus().addColumnAfter().run()" :disabled="!editor.can().addColumnAfter()">
      后插入列
    </button>
    <button @click="editor.chain().focus().addRowBefore().run()" :disabled="!editor.can().addRowBefore()">
      上插入行
    </button>
    <button @click="editor.chain().focus().addRowAfter().run()" :disabled="!editor.can().addRowAfter()">
      下插入行
    </button>
    <button @click="editor.chain().focus().toggleHeaderColumn().run()" :disabled="!editor.can().toggleHeaderColumn()">
      整列切换表头
    </button>
    <button @click="editor.chain().focus().toggleHeaderRow().run()" :disabled="!editor.can().toggleHeaderRow()">
      整行切换表头
    </button>
    <button @click="editor.chain().focus().toggleHeaderCell().run()" :disabled="!editor.can().toggleHeaderCell()">
      单元格切换
    </button>
  </div>
</template>

<script>
export default {
  name: "TableMenu",
  props:{
    editor:{
      type:Object
    },
  },
  mounted(){
  },
  methods:{

    stopBubble(e) {
      if (e && e.preventDefault && e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault()
      } else { //<=ie8
        window.event.cancelBubble = true;
        window.event.returnValue = false;
      }
    },
  }
}
</script>

<style scoped>


</style>
