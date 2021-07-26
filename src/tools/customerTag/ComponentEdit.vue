<template>
  <node-view-wrapper class="vue-component">
    <span @click="handleClick"><node-view-content class="content" :class="[node.attrs.type]"/></span>
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
  mounted(){
  },

  methods: {
    handleClick(){
      this.editor.options.getTag(this)
    }

  },
})
</script>

<style lang="scss" scoped>
.vue-component{
  display: inline;
}
.content {
  margin: 0 3px;
  display: inline;
  &.string{
    background: #b38a8a;
  }
  &.formula{
    background: #72a572;
  }
  &.request{
    background: #cbcb86;
  }
}

</style>
