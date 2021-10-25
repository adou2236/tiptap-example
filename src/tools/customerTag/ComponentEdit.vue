<template>
  <node-view-wrapper as="span" :class="['content',node.attrs.type]">
    {{node.attrs.coverText}}
  </node-view-wrapper>
</template>

<script>
import Vue from 'vue'
import { NodeViewWrapper, nodeViewProps, NodeViewContent } from '@tiptap/vue-2'
import {deepCopy, formateFunction} from "../../unit/baseType";
import {getVarsById} from "../../request/api";

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
    content:{
      //监听内容更改，重新获取result
      handler() {
        this.node.attrs.result = this.getResult(this.node)
      },
      deep: false,
    }
  },
  computed:{
    content(){
      return this.node.attrs.content
    }
  },
  async created(){
    let id = this.editor.options.content.id
    if(this.node.attrs.type === 'smart'&&this.node.attrs.id){
      id=this.node.attrs.id
    }
    this.vars = await this.getVars(id)
    if(this.node.attrs.type === 'function'){
      this.node.attrs.content = new formateFunction(this.node.attrs.content)
    }
    this.node.attrs.result = this.getResult(this.node)
  },
  mounted() {
  },
  methods: {
    async getVars(id){
      if(id){
        let {data} = await getVarsById(id)
        return data.content.data
      }

    },
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
  &.smart{
    background: #68cef8;
  }
  &.variety{
    background: #b38a8a;
  }
  &.function{
    background: #72a572;
  }
  &.formula{
    background: #cbcb86;
  }
  &.focus{
    outline: 3px solid #68cef8;
  }

}

</style>
