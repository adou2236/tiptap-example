<template>
  <div>
    标签焦点{{editor.isActive('custom-tag')}}
    表格焦点{{editor.isActive('custom-chart')}}
    <button @click="varsManager">全局变量管理</button>
    <tag-menu v-if="editor&&editor.isActive('custom-tag')" :editor="editor" :range-id="'15_root'">
    </tag-menu>
    <div v-else-if="editor&&editor.isActive('custom-image')">
      图片属性<br/>
      图片路径<input v-model="imageAttr.src" /><br/>
      图片宽<input v-model="imageAttr.width" />px<br/>
      图片高<input v-model="imageAttr.height" />px<br/>
      <button @click="setImageAttr">确定</button>
    </div>
    <table-menu v-else-if="editor&&editor.isActive('table')" :editor="editor"></table-menu>
    <echarts-menu v-else-if="editor&&editor.isActive('custom-chart')"
                  :editor="editor"
                  :options="chartOptions"
                  :index="chartIndex">
    </echarts-menu>
    <var-manager-dialog v-model="managerDialog"
                        v-if="managerDialog"
                        :id="'15_root'">
    </var-manager-dialog>
  </div>
</template>

<script>
import TableMenu from "./MenuBar/TableMenu";
import EchartsMenu from "./MenuBar/EchartsMenu/index.vue"
import TagMenu from './MenuBar/tagMenu/tagMenu.vue'
import {baseOptions} from "../unit/baseType";
import VarManagerDialog from "./Dialog/varManagerDialog";
export default {
  name: "objectEditor",
  components: {VarManagerDialog, EchartsMenu, TableMenu},
  props:{
    editor:{
      type:Object
    },
  },
  data(){
    return{
      managerDialog:false
    }
  },
  mounted() {
  },
  computed:{
    contentActionText(){
      return this.editor.getAttributes('content-box').isSplit?'合并':'分两列'
    },
    //如何改变里内容
    type:{
      get(){
        return this.editor.getAttributes('custom-tag').type || ''
      },
      set(v){
        this.editor.chain().updateAttributes('custom-tag',{type:v}).run()
      }
    },
    chartOptions: {
      get(){
        return this.editor.getAttributes('custom-chart').options
      },
      set(){
      }
    },
    chartIndex:{
      get(){
        return this.editor.getAttributes('custom-chart').index || {}
      },
      set(v){
      }
    },
    coverText:{
      get(){
        return this.editor.getAttributes('custom-tag').coverText || ''
      },
      set(v){
        this.editor.chain().updateAttributes('custom-tag',{coverText:v}).run()
      }
    },
    tagIndex:{
      get(){
        return this.editor.getAttributes('custom-tag').index || ''
      },
      set(v){
        this.editor.chain().updateAttributes('custom-tag',{index:v}).run()
      }
    },
    tagAttr:{
      get(){
        return{
          type:this.editor.getAttributes('custom-tag').type,
          index:this.editor.getAttributes('custom-tag').index,
          coverText:this.editor.getAttributes('custom-tag').coverText,
        }
      },
      set(){

      }

    },
    imageAttr:{
      get(){
        return{
          src:this.editor.getAttributes('custom-image').src,
          width:this.editor.getAttributes('custom-image').width,
          height:this.editor.getAttributes('custom-image').height,
        }
      },
      set(){

      }
    }
  },
  watch:{
    currentObject(v){
      console.log(v)
    }
  },
  methods:{
    varsManager(){
      this.managerDialog = true
    },
    toogleBoxSize(v){
      this.editor.chain().focus().updateAttributes('content-box',{isSplit:!v}).run()
    },
    // renderChart(options){
    //   let base = new baseOptions(options)
    //   // this.editor.chain().updateAttributes('custom-chart', {options:base.options}).run()
    //   this.editor.chain().upDateChartOptions(base.options).run()
    // },
    // renderChart(){
    //   let data = {
    //     index:this.chartIndex+1
    //   }
    //   this.editor.chain().focus().setChartOptions('custom-chart',data).run()
    // },
    setTagAttr(){
      let data = {
        type:this.tagAttr.type,
        index:this.tagAttr.index,
        coverText:this.tagAttr.coverText,
      }
      this.editor.chain().focus().updateAttributes('custom-tag',data).run()
    },
    setImageAttr(){
      let data = {
        width:this.imageAttr.width,
        height:this.imageAttr.height,
        src:this.imageAttr.src,
      }
      this.editor.chain().focus().updateAttributes('custom-image',data).run()
    }
  }
}
</script>

<style scoped>

</style>
