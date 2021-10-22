<template>
  <div>
    外部文本：
    <br/>
    <el-input type="textarea" v-model="attrs.coverText" @input="(v)=>handleChange('coverText',v)"></el-input>
    <div v-if="attrs.type === 'variety'">
      变量内容:
      <br/>
      <el-select v-model="attrs.content" @change="(v)=>handleChange('content',v)">
<!--        这里存后台不可存value，因为数据要根据变量表变化-->
        <el-option v-for="item in vars" :label="item.varKey" :value="item.varKey" :key="item.varKey">
          {{item.varKey}}
        </el-option>
      </el-select>
    </div>
    <div v-if="attrs.type === 'function'">
      函数内容:{{functionJson.toString()}}
      <br/>
      <button @click="changeFunction">插入/修改函数</button>
      <br/>
    </div>
    <tag-editor v-if="attrs.type === 'smart'"
                v-model="attrs.content"
                :mainEditor="editor"
                :rangeId="attrs.id">
    </tag-editor>
    <br/>
    <button v-if="!isInner" @click="handleCommit">确认</button>
    <function-tag-dialog v-model="visible"
                         v-if="visible"
                         :functionJson="functionJson"
                         @commit="getFunc">
    </function-tag-dialog>
  </div>
</template>

<script>
import TagEditor from "./tagEditor";
import {getFunctions, getVarsById} from "../../../request/api";
import FunctionTagDialog from "../../Dialog/functionTagDialog";
import {deepCopy, formateFunction, globalVar} from "../../../unit/baseType";
export default {
  name: "TagName",
  components: {FunctionTagDialog, TagEditor},
  props:{
    editor:Object,
    //生效范围ID，全局/局部
    rangeId:String,
    isInner:Boolean
  },
  data(){
    return {
      vars:[],
      visible:false,
      functions:[],
      functionJson:{},
      attrs:{},
      data:[
        {type:'string',value:'这是一段常量'},
        {type:'request',value:'这是一段变量'},
        {type:'function',value:'这是一段公式'},
      ]
    }
  },
  computed:{
    coverText:{
      get(){
        return this.editor.getAttributes('custom-tag').coverText || ''
      },
      set(v){
        this.editor.chain().updateAttributes('custom-tag', {coverText:v}).run()
      }
    },
    content:{
      get(){
        return this.editor.getAttributes('custom-tag').content || ''
      },
      set(v){
        this.editor.chain().updateAttributes('custom-tag', {content:v}).run()
      }
    }
  },
  watch:{
    //内部编辑器则数据绑定
    // attrs:{
    //   handler(newVal,oldVal){
    //     if(this.isInner){
    //       console.log("aaa???",newVal)
    //       this.editor.chain().updateAttributes('custom-tag', newVal).run()
    //     }
    //   },
    //   deep:true,
    //   immediate:false,
    // }
  },
  async created() {
    this.functionJson = new formateFunction(this.content)
    this.vars = await this.getVars(this.rangeId);
    this.attrs = this.editor.getAttributes('custom-tag')
  },
  methods:{
    handleChange(type,value){
      if(this.isInner){
        this.editor.chain().updateAttributes('custom-tag', {[type]:value}).run()
      }
    },
    handleCommit(){
      this.editor.chain().focus().updateAttributes('custom-tag', this.attrs).run()
    },
    async getVars(id){
      if(id){
        let {data} = await getVarsById(id)
        return data?.content.data
      }else{
        return []
      }
    },
    getFunc(obj){
      this.functionJson = new formateFunction(obj)
      this.editor.chain().updateAttributes('custom-tag',{content:obj}).run()
      this.visible = false
    },
    changeFunction(){
      this.visible = true
    },
    editorOver(e){
      console.log("result",e)
    }
  }
}
</script>

<style lang="scss" scoped>



</style>
