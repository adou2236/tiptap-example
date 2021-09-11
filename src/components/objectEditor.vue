<template>
  <div>
<!--    占位数据:<input v-model="viewText"/><br/>-->
    <div v-if="editor&&editor.isActive('custom-tag')">
      标签类型：<select v-model="type">
        <option value ="string">常量标签</option>
        <option value ="formula">公式标签</option>
        <option value="request">函数标签</option>
      </select><br/>
        内部数据：<input v-model="tagIndex"/>
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
    //如何改变里内容
    type:{
      get(){
        return this.editor.getAttributes('custom-tag').type || ''
      },
      set(v){
        this.editor.chain().focus().updateAttributes('custom-tag',{type:v}).run()
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
        return this.editor.getAttributes('custom-chart').index || []
      },
      set(v){
        // this.editor.chain().updateAttributes('custom-chart',{index:v}).run()
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
