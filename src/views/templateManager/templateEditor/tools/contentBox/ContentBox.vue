<template>
  <node-view-wrapper class="outter-content" >
    <node-view-content class="content" :data-issplit="node.attrs.isSplit"/>
    <el-dropdown size="mini"
                 class="delete-icon"
                 trigger="hover"
                 :disabled="!editor.view.editable"
                 @command="selectItem">
      <span class="el-dropdown-link" v-show="editor.view.editable">
        <svg class="remix">
            <use :xlink:href="require('remixicon/fonts/remixicon.symbol.svg') + `#ri-more-fill`" />
        </svg>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
            class="item"
            v-for="(item, index) in items"
            :key="index"
            :command="item.id">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <check-box v-model="checkBoxVisible" :content="checkContent" @reCheck="selectItem('check')"></check-box>
    <line-selector v-model="newLineDialog" @commit="handleAddLine"></line-selector>
  </node-view-wrapper>
</template>

<script>
import Vue from 'vue'
import {NodeViewContent, nodeViewProps, NodeViewWrapper} from '@tiptap/vue-2'
import {generateHTML, getSchema} from '@tiptap/core'
import CheckBox from "./checkBox";
import {partCheck} from "@/request/templateApi";
import LineSelector from '../../components/Dialog/lineSelector.vue';


export default Vue.extend({
  components: {
    CheckBox,
    NodeViewWrapper,
    NodeViewContent,
    LineSelector
  },
  props: nodeViewProps,
  data(){
    return {
      isFocus:false,
      checkBoxVisible:false,
      checkContent:'空',
      newLineDialog:false,
      items:[
        {id:'insertAbove',label:'上方插入单元'},
        {id:'insertBelow',label:'下方插入单元'},
        // {id:'moveAbove',label:'上移'},
        // {id:'moveBelow',label:'下移'},
        {id:'delete',label:'删除'},
        {id:'check',label:'测试'},
      ],
      linePos:'end',
      listener:null
    }
  },
  methods: {
    handleAddLine(type='single'){
      let from = this.getPos()
      let size = this.node.nodeSize
      this.editor.chain().insertNewLine(type,this.linePos,from,size).run()
      // this.newLineDialog = false
    },
    async selectItem(id){
      if(id === 'delete'){
        this.deleteNode()
      }else if(id === 'insertAbove'){
        this.linePos = 'above'
        // this.newLineDialog = true
        this.handleAddLine()
      }else if(id === 'insertBelow'){
        this.linePos = 'below'
        // this.newLineDialog = true
        this.handleAddLine()
      }else if(id === 'moveAbove'){
        let from = this.getPos()
        let size = this.node.nodeSize
        let dom = this.$el
      }else if(id === 'moveBelow'){
      }else if(id === 'check'){
        let {content} = this.node.content
        let data = {
          id:this.$route.params.id,
          doc:{
            type:'content-box',
            content:content
          }
        }
        let res = await partCheck(data)
        let transContent = ''
        if(res.data.code == 200&&res.data.data.doc){
          transContent = res.data.data.doc
        }else{
          transContent = {
            type:'content-box',
            content:[{type:'text',text:'翻译失败'}]
          }
        }
        this.checkContent = generateHTML(transContent, this.editor.extensionManager.extensions)
        this.checkBoxVisible = true
      }
    },
    getPartTransJson(json){
      let data = {
        id:this.$route.params.id,
        doc:json
      }
      partCheck(data).then(res=>{
        console.log(res)
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.outter-content{
  position: relative;
  &.focus{
    .content{
      border-color: #36A4FD;
    }
  }
  .content {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px dashed #CDCDCD;
  }
  .content[data-issplit=true]{
    display:flex;
    /deep/.chart{
      height: 250px;
    }
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
    width: 1.5rem;
    height: 1.5rem;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    .remix{
      width: 100%;
      height: 100%;
    }
  }
  .items{
    position: absolute;
    top: 2rem;
    left: -1rem;
    z-index: 2000;
    border-radius: 0.25rem;
    background: white;
    color: rgba(black, 0.8);
    overflow: hidden;
    font-size: 0.9rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    .item{
      display: block;
      width: 100%;
      text-align: left;
      white-space: nowrap;
      background: transparent;
      border: none;
      padding: 0.2rem 0.5rem;
      &:hover{
        background: #baf13a;
      }
    }
  }
}



</style>
