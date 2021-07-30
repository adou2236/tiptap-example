<template>
  <node-view-wrapper :style="{height:'200px'}" class="vue-component">
    <vue-draggable-resizable :w="width" :h="height"
                             :draggable="false" @resizing="onResize"
                             :parent="true">
      <img :width="node.attrs.width" :height="node.attrs.height" :src="node.attrs.src"/>
    </vue-draggable-resizable>
    <div style="clear: both"></div>
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
  mounted() {
    console.log(this)
  },
  methods:{
    onDrag(){

    },
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
