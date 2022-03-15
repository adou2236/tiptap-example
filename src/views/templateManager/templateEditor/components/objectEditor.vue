<template>
  <div>
    <div class="object-title">属性</div>
    <div class="setting-area">
      <div class="left" :style="`width:${isHidden?'100%':'50%'}`">
        <el-scrollbar ref='scroll-bar'>
          <div style="padding:10px">
            <el-button class="whole-variety-admin" size="mini" @click="varsManager">全局变量管理</el-button>
            <tag-menu
            v-if="editor&&editor.isActive('custom-tag')"
            :key="editor.getAttributes('custom-tag').id"
            :attrs="editor.getAttributes('custom-tag')"
            :editor="editor"
            :range-id="rootId">
            </tag-menu>
            <div v-else-if="editor&&editor.isActive('custom-image')">
              图片属性<br/>
              <!--图片路径<input v-model="imageAttr.src" /><br/>-->
              图片宽<input v-model="imageAttr.width" />px<br/>
              图片高<input v-model="imageAttr.height" />px<br/>
              <button @click="setImageAttr">确定</button>
            </div>
            <table-menu v-else-if="editor&&editor.isActive('table')" :editor="editor"></table-menu>
            <echarts-menu
              v-else-if="editor&&editor.isActive('custom-chart')&&!editor.getAttributes('custom-chart').placeholder"
              @renderChart="renderChart"
              :key="editor.getAttributes('custom-chart').id"
              :editor="editor"
              :rootId="rootId"
              :attrs="chartAttrs">
            </echarts-menu>
            <!-- <div v-else-if="editor&&editor.isActive('template-table')">
              模板名称
              <el-input v-model="tableCustomType"/>
              <el-button @click="saveAsTemplate">保存至模板</el-button>
            </div> -->
            <base-menu v-else :baseData="baseData" @change="(e)=>$emit('baseDataChange',e)"></base-menu>
          </div>
        </el-scrollbar>
      </div>
      <var-menu :rootId="rootId" class="right" v-model="isHidden" :style="`width:${isHidden?'0':'50%'}`"></var-menu>
    </div>

    <var-manager-dialog
      v-model="managerDialog"
      v-if="managerDialog"
      :id="rootId">
    </var-manager-dialog>

  </div>
</template>

<script>
import TableMenu from "./MenuBar/TableMenu";
import EchartsMenu from "./MenuBar/EchartsMenu/index.vue"
import VarMenu from "./MenuBar/varMenu/index.vue"
import TagMenu from './MenuBar/tagMenu/tagMenu.vue'
import BaseMenu from './MenuBar/baseMenu/baseMenu.vue'
import VarManagerDialog from "./Dialog/varManagerDialog";
import {EventBus} from "../unit/eventBus";
import GroupEditorDialog from "./Dialog/groupEditorDialog";
import { docTemplateSave } from '@/request/templateApi';
export default {
  name: "objectEditor",
  components: {GroupEditorDialog, VarManagerDialog, EchartsMenu, TableMenu, VarMenu, TagMenu, BaseMenu},
  props:{
    editor:{
      type:Object
    },
    rootId:{
      type:String
    },
    baseData:{
      type:Object
    }
  },
  data(){
    return{
      managerDialog:false,
      groupDialogVisible:false,
      isHidden:false
    }
  },
  mounted() {
  },
  watch:{
    chartId(newVal,oldVal){
      if(newVal){
        this.$refs['scroll-bar'].$refs.wrap.scrollTop = 0
      }
    }
  },
  computed:{
    tableCustomType:{
      get(){
        return this.editor.getAttributes('template-table').customType
      },
      set(v){
        this.editor.chain().updateAttributes('template-table',{customType:v}).run()
      }
    },
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
    chartId(){
      return this.editor.getAttributes('custom-chart').id
    },
    chartAttrs: {
      get(){
        return this.editor.getAttributes('custom-chart')
      },
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
  methods:{
    saveAsTemplate() {
      this.$prompt("请输入模板描述", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          inputValidator: (v) => {
              let reg = /[`~!?@#$%^&*【】{}（）\[\]<>《》？！，。/；“”‘’,.;"'+-]/.test(v)
              if (reg) {
                  return false
              }
              if (v.length > 20) {
                  return false
              }
              return !!v && v.trim().length > 0
          }
      }).then(async ({ value }) => {
          this.saveLoading = true
          let data = {
              name: value,
              type: 2,
              doc: {
                  type: "template-table",
                  attrs: {
                    customType:this.editor.getAttributes('template-table').customType
                  }
              }
          }
          let res = await docTemplateSave(data)
          this.saveLoading = false
          if (res.data.code === 200) {
              this.$message.success("保存成功");
              let newValue = {
                  name: value,
                  id: res.data.data
              }
              EventBus.$emit('templateUpdate', newValue, 2)
          } else {
              this.$message.info(res.data.msg);
          }
      })
    },
    renderChart(v){
      EventBus.$emit('optionChange',v)
      this.editor.chain().updateAttributes('custom-chart',{options:v}).run()
    },
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

<style lang="scss" scoped>
.object-title{
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background: #F7F7F7;
  font-size: 18px;
}
.setting-area{
  background: #FFFFFF;
  display: flex;
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  .left{
    .whole-variety-admin{
      color:#36A4FD;
      border-color: #36A4FD;
      margin-bottom:20px;
      &:hover{
        background: #36A4FD;
        color:#FFF
      }
    }
  }
  .right{
    border-left: 1px solid #d8d8d8;
    transition: all ease 0.3s;
  }
}



</style>
