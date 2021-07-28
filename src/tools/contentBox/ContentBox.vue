<template>
  <node-view-wrapper class="outter-content">
    <div @click="handleClick"><node-view-content  class="content"/></div>
    <div @click="handleDelete" class="delete-icon">删除</div>
  </node-view-wrapper>
</template>

<script>
import Vue from 'vue'
import { NodeViewWrapper, nodeViewProps, NodeViewContent } from '@tiptap/vue-2'

export default Vue.extend({
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  props: nodeViewProps,
  data(){
    return {
      isFocus:false
    }
  },
  watch:{
  },
  mounted() {
    // console.log(this)
  },
  methods: {
    handleClick(){
      this.editor.options.getParagraph(this)
    },
    handleDelete(){
      this.deleteNode()
    }
  },
})
</script>

<style lang="scss" scoped>
.outter-content{
  position: relative;
  &.focus{
    .content{
      border: 1px solid blueviolet;
    }
  }
  .content {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px dashed black;

  }
  &:hover{
    .delete-icon{
      visibility: visible;
    }
  }
  .delete-icon{
    visibility: hidden;
    position: absolute;
    right: 0;
    top: 0;
  }
}



</style>
