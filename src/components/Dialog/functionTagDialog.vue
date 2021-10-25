<template>
  <el-dialog :visible="visible" @open="handleOpen" @close="handleClose" append-to-body>
    <div >
      <div class="fnc">
        <div class="left">
          选择函数
          <el-select :value="selectedFuncId" value-key="id" @change="getParamsMsg">
            <el-option v-for="item in functions" :key="item.id" :value="item.id" :label="item.nameEn">
            </el-option>
          </el-select>
        </div>
        <div class="right">
          选择参数
          <div v-for="param in myParams" style="display: flex;margin-bottom: 5px">
            <el-select v-model="param.paramType">
              <el-option value="variety" label="变量">变量</el-option>
              <el-option value="const" label="常量">常量</el-option>
            </el-select>
            <el-input v-model="param.value" :placeholder="param.typeDesc"/>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取消</el-button>
    <el-button type="primary" @click="handleCommit">提交</el-button>
  </span>
  </el-dialog>
</template>

<script>
import {getFunctions} from "../../request/api";
import {formateFunction} from "../../unit/baseType";

export default {
  name: "functionTagDialog",
  model:{
    prop:'visible',
    event:'change'
  },
  props:{
    visible:false,
    functionJson:{
      type:Object,
      default:()=>{
        return{
          id:'',
          nameEn:'',
          params:[]
        }
      }
    }
  },
  data(){
    return{
      functions:[],
      paramsMessage:[],
      selectedFuncId:"",
      selectedFuncName:"",
      myParams:[]

    }
  },
  async mounted(){
    this.functions = await this.functionsInit()

  },
  methods:{
    handleOpen(){
      this.selectedFuncId = this.functionJson.id || ''
      this.selectedFuncName = this.functionJson.nameEn || ''
      this.myParams = this.functionJson.params || []
    },
    handleCommit(){
      let params = this.myParams.map(item=>{
        return{
          paramType:item.paramType,
          value:item.value
        }
      })
      let obj = {
        id:this.selectedFuncId,
        nameEn:this.selectedFuncName,
        params:params
      }
      this.$emit('commit',obj)
    },
    getParamsMsg(id){
      let item = this.functions.find(item=>item.id === id)
      this.myParams = item.params
      this.selectedFuncId = item.id
      this.selectedFuncName = item.nameEn
    },
    async functionsInit(){
      let {data} = await getFunctions()
      return data.content
    },
    handleClose(){
      this.$emit("change",false)
    }
  }
}
</script>

<style lang="scss" scoped>
.fnc{
  display: flex;
  .left{
    display: flex;
    flex-direction: column;
  }
  .right{
    display: flex;
    flex-direction: column;
  }
}

</style>
