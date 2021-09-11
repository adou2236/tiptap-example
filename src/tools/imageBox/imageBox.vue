<template>
  <node-view-wrapper class="vue-component">
<!--    <img :width="node.attrs.width" :height="node.attrs.height" :src="node.attrs.src"/>-->
  </node-view-wrapper>

</template>

<script>
import { NodeViewWrapper, nodeViewProps, NodeViewContent } from '@tiptap/vue-2'
import ResizeContent from "../../components/ResizeContent";
export default {
  name: "imageBox",
  components: {
    ResizeContent,
    NodeViewWrapper,
    NodeViewContent
  },
  props: nodeViewProps,
  data(){
    return{
      width:this.node.attrs.width,
      height: this.node.attrs.height
    }
  },
  methods:{
    onResize(top,left,width,height){
      console.log(width,height)
      this.editor.chain().focus().setImageSize([width,height]).run()
    }
  }
}
</script>

<style scoped>
.vue-component{
  display: flex;
}

</style>
