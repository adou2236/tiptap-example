<template>
  <node-view-wrapper class="vue-component">
    <span class="content" contenteditable="true">{{ node.attrs.surface }}</span>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-2'

export default {
  components: {
    NodeViewWrapper,
  },

  props: nodeViewProps,

  methods: {
    handleClick(){
      console.log("点击了")
    }

  },
}
</script>

<style lang="scss" scoped>
.vue-component{
  display: inline;
}
.content {
  margin: 0 3px;
  background: rosybrown;
  display: inline;
  &:focus-visible {
    outline: none;
    background: #42b983;
  }
}

</style>
