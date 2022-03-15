<template>
  <div>
    <el-form>
      <el-form-item label="智能文本内容">
        <br/>
        <!-- 去掉局部变量统一使用全局变量 -->
        <tag-editor v-if="attrs.type === 'smart'"
                  v-model="innerContent"
                  @changeText="handleChangeText"
                  :mainEditor="editor"
                  :rangeId="rangeId">
        </tag-editor>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="handleCommit">确定</el-button> -->
        <el-button :loading="saveLoading" type="primary" @click="saveAsTemplate">保存至模板</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TagEditor from "./tagEditor";
import FunctionTagDialog from "../../Dialog/functionTagDialog";
import { deepCopy } from '../../../unit/baseType';
import { docTemplateSave } from '@/request/templateApi';
import { EventBus } from '../../../unit/eventBus';
export default {
  name: "TagName",
  components: {FunctionTagDialog, TagEditor},
  props:{
    editor:Object,
    //生效范围ID，全局/局部
    rangeId:String,
    attrs:Object
  },
  data(){
    return {
      vars:[],
      functions:[],
      functionJson:{},
      data:[
        {type:'string',value:'这是一段常量'},
        {type:'request',value:'这是一段变量'},
        {type:'function',value:'这是一段公式'},
      ],
      innerContent: deepCopy(this.attrs.content),
      saveLoading:false
    }
  },
  watch:{
    //内部编辑器则数据绑定
    innerContent:{
      handler(newVal,oldVal){
        let attrs = {
          content:newVal,
          coverText:this.coverText
        }
        this.editor.chain().setInnerAttribute(attrs).run()
      },
      deep:true,
      immediate:false,
    }
  },
  methods:{
    // handleCommit(){
    //   this.editor.chain().focus().updateAttributes('custom-tag', this.attrs).run()
    // },
    handleChangeText(text){
      this.coverText = text
    },
    saveAsTemplate(){
      this.$prompt("请输入模板描述",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal:false,
        inputValidator: (v) => {
          let reg = /[`~!?@#$%^&*【】{}（）\[\]<>《》？！，。/；“”‘’,.;"'+-]/.test(v)
          if(reg){
            return false
          }
          if(v.length>20){
            return false
          }
          return !!v&&v.trim().length>0
        }
      }).then(async ({value})=>{
        this.saveLoading = true
        let data = {
          name:value,
          type:0,
          doc:{
            type:"custom-tag",
            attrs:{
              type:'smart',
              content:this.innerContent,
              coverText:this.coverText
            }
          }
        }
        let res = await docTemplateSave(data)
        this.saveLoading = false
        if (res.data.code === 200) {
          this.$message.success("保存成功");
          let newValue = {
            name:value,
            id:res.data.data
          }
          EventBus.$emit('templateUpdate',newValue,0)
        }else{
          this.$message.info(res.data.msg);
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>



</style>
