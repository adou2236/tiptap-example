<template>
  <node-view-wrapper
      as="span"
      :class="['content',node.attrs.type]">
    {{node.attrs.coverText}}
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
    return{
      //相对局部变量表
      vars:[],
    }
  },
  watch:{
    // content:{
    //   //监听内容更改，重新获取result
    //   handler() {
    //     this.node.attrs.result = this.getResult(this.node)
    //   },
    //   deep: false,
    // }
  },
  computed:{
    content(){
      return this.node.attrs.content
    }
  },
  mounted() {
  },
  methods: {
    //异步请求接口
    //智能文本翻译递归实现
    getResult(node,from='outter'){
      let result = ''
      let nodeType = node.type
      //！==inner只对独立的变量进行翻译，智能文本中的变量不翻译
      if(nodeType === 'custom-tag'||nodeType.name === 'custom-tag'){
        //自定义标签处理方法
        let type = node.attrs.type
        let content = node.attrs.content
        if(type === "variety"&&content){
          //变量处理
          result += this.vars.find(item=>item.varKey === content)?.varValue||'未知变量'
        }else if(type === "smart"&&content){
          //智能文本处理
          content.forEach(item=>{
            result+=this.getResult(item,"inner")
          })
        }
      }else if(nodeType === 'text'){
        //纯文本处理
        result += node.text
      }
      return result
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
  background: #FDE3E3;
  color: #F47171;
  cursor: pointer;
  &.smart{
    background: #E1F1FF;
    color: #36A4FD;
  }
  &.focus{
    outline: 3px solid #68cef8;
  }

}

</style>
