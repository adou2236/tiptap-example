<template>
 <div class="editor-Viewer">
   <div @click="handleClick">当前模式{{model}}</div>
   <content-box :model="model" v-for="item in totalData"
                :key="item.id"
                :itemData="item.lineData"
                @itemFocus="(object)=>$emit('itemFocus',object)"></content-box>
   <div class="add-new-item">
     <span @click="add('single')">单列</span>
     <span @click="add('double')">双列</span>
   </div>
 </div>
</template>

<script>
import ContentBox from "./viewItems/contentBox";
import {ItemType,LineType} from "../unit/baseType";
export default {
  name: "editorViewer",
  components: {ContentBox},
  props:{
    model:{
      type:String,
      default:'edit'
    },
    totalData:{
      type:Array,
      default:()=>[]
    }
  },
  methods:{
    handleClick(){
      this.$emit('changeModel')
    },
    add(model){
      if(model === 'single'){
        let newLine = new LineType
        // this.totalData
      }else{

      }
    }
  }
}
</script>

<style scoped>
.editor-Viewer{
  width: 100%;
  height: 100%;
  border: 1px solid black;
  padding: 20px;
}
.add-new-item{
  width: 100%;
  border: 1px dashed black;
}

</style>
