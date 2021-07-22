<template>
  <node-view-wrapper class="outter-content">
    <node-view-content class="content"/>
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
    selected(newValue) {
      if (newValue) {
        console.log("聚焦")
      } else {
        console.log("失去焦点")
      }
    },
  },
  mounted() {
  },
  methods: {
    handleDelete(){
      this.deleteNode()
    }
  },
})
</script>

<style lang="scss" scoped>
.outter-content{
  position: relative;
  .content {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px dashed black;

  }
  &.focus>.content{
    border: 1px solid blueviolet;
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
