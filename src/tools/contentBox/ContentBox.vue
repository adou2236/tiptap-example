<template>
  <node-view-wrapper class="outter-content" >
    <node-view-content class="content"/>
    <button @click.stop="showOptions" class="delete-icon">
      <svg class="remix">
        <use :xlink:href="require('remixicon/fonts/remixicon.symbol.svg') + `#ri-more-fill`" />
      </svg>
      <div class="items" :style="{visibility:drawShow?'visible':'hidden'}">
        <button
          class="item"
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(item.id)">
          {{ item.label }}
        </button>
      </div>
    </button>

  </node-view-wrapper>
</template>

<script>
import Vue from 'vue'
import { NodeViewWrapper, nodeViewProps, NodeViewContent } from '@tiptap/vue-2'
import { getHTMLFromFragment, getSchema, } from '@tiptap/core'


export default Vue.extend({
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  props: nodeViewProps,
  data(){
    return {
      drawShow:false,
      isFocus:false,
      items:[
        // {id:'insert',label:'插入'},
        {id:'delete',label:'删除'},
        {id:'check',label:'检查'},
      ],
      listener:null
    }
  },
  watch:{
  },
   mounted(){
    window.addEventListener('click',this.hidePicker)
  },
  beforeDestroy() {
    window.removeEventListener('click',this.hidePicker)
  },
  methods: {
    selectItem(id){
      if(id === 'delete'){
        this.deleteNode()
      }else if(id === 'insert'){
        console.log("插入")
      }else if(id === 'check'){
        const schema = getSchema(this.editor.extensionManager.extensions)
        console.log(getHTMLFromFragment(this.node,schema))
      }
    },
    hidePicker(){
      this.drawShow=false
    },
    showOptions(){
      this.drawShow = true
    },
  },
})
</script>

<style lang="scss" scoped>
.outter-content{
  position: relative;
  &.focus{
    .content{
      border: 1px solid blueviolet;
    }
  }
  .content {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px dashed black;

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
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    .remix{
      width: 100%;
      height: 100%;
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
      box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.1),
        0px 10px 20px rgba(0, 0, 0, 0.1),
      ;
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
}



</style>
