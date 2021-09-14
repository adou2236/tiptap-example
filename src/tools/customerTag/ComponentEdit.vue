<template>
  <node-view-wrapper  class="vue-component">
    <span class="content" :class="[node.attrs.type]" >
      {{node.attrs.coverText}}
    </span>
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
    contentChange(v){
      console.log(v)
    }
  },
})
</script>

<style lang="scss" scoped>
.vue-component{
  display: inline;
}
.content {
  padding: 0 3px;
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
