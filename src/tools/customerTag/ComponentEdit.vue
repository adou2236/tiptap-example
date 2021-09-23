<template>
  <node-view-wrapper as="span" :class="['content',node.attrs.type]">
    {{node.attrs.coverText}}
  </node-view-wrapper>
</template>

<script>
import Vue from 'vue'
import { NodeViewWrapper, nodeViewProps, NodeViewContent } from '@tiptap/vue-2'
import {deepCopy, formateFunction} from "../../unit/baseType";

export default Vue.extend({
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  props: nodeViewProps,
  watch:{
    content:{
      //监听内容更改，重新获取result
      async handler(v) {
        this.node.attrs.result = await this.getResult(v)
      },
      deep: true,
    }

  },
  computed:{
    content(){
      return this.node.attrs.content
    }
  },
  async created(){
    if(this.node.attrs.type === 'function'){
      this.node.attrs.content = new formateFunction(this.node.attrs.content)
    }
    this.node.attrs.result = await this.getResult()
  },
  methods: {
    //异步请求接口
    getResult(content){
      return new Promise((resolve,reject)=>{
        setTimeout(()=>{
          if(content){
            resolve("更改内容重新请求")
          }else{
            resolve("异步获取结果")
          }
        },1000)
      })

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
  &.smart{
    background: #68cef8;
  }
  &.variety{
    background: #b38a8a;
  }
  &.function{
    background: #72a572;
  }
  &.request{
    background: #cbcb86;
  }
}

</style>
