<template>
  <div>
<!--    占位数据:<input v-model="viewText"/><br/>-->

<!--    <div v-if="editor&&editor.isActive('content-box')">-->
<!--      <button @click="toogleBoxSize(editor.getAttributes('content-box').isSplit)" style="background: #fff200">段落{{contentActionText}}</button>-->
<!--      <button @click="boxTest">段落测试</button>-->
<!--    </div>-->
    <div v-if="editor&&editor.isActive('custom-tag')">
      标签类型：<select v-model="type">
        <option value ="string">常量标签</option>
        <option value ="formula">公式标签</option>
        <option value="request">函数标签</option>
      </select>
      <br/>
      外部文本：<textarea v-model="coverText"/>
      <br/>
      翻译文本：<textarea v-model="tagIndex"/>
<!--      <button @click="setTagAttr">确定</button>-->
    </div>
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
                  :index="chartIndex"
    ></echarts-menu>
<!--                      @renderChart="renderChart"-->
  </div>
</template>

<script>
import TableMenu from "./MenuBar/TableMenu";
import EchartsMenu from "./MenuBar/EchartsMenu/index.vue"
import {baseOptions} from "../unit/baseType";
export default {
  name: "objectEditor",
  components: {EchartsMenu, TableMenu},
  props:{
    editor:{
      type:Object
    },
  },
  data(){
    return{
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
    boxTest(){
      console.log(this.editor.chain().focus().getParagraphHtml().run())

    },
    toogleBoxSize(v){
      this.editor.chain().focus().updateAttributes('content-box',{isSplit:!v}).run()
    },
    renderChart(options){
      let base = new baseOptions(options)
      // this.editor.chain().updateAttributes('custom-chart', {options:base.options}).run()
      this.editor.chain().upDateChartOptions(base.options).run()
    },
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
