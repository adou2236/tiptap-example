<template>
  <el-dialog :visible="visible" @close="handleClose">
    <div >
      <div class="fnc">
        <div class="left">
          选择函数
          <el-select :value="selectedFunc" value-key="id" @change="getParamsMsg">
            <el-option v-for="item in functions" :key="item.id" :value="item" :label="item.nameZh">
            </el-option>
          </el-select>
        </div>
        <div class="right">
          选择参数
          <div v-for="param in myParams" style="display: flex;margin-bottom: 5px">
            <el-select v-model="param.kind">
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
          name:'',
          params:[]
        }
      }
    }
  },
  data(){
    return{
      functions:[],
      paramsMessage:[],
      selectedFunc:{},
      myParams:[]

    }
  },
  async mounted(){
    this.functions = await this.functionsInit()
    this.selectedFunc = this.functionJson.name || ''
    this.myParams = this.functionJson.params || []
  },
  methods:{
    handleCommit(){
      let params = this.myParams.map(item=>{
        return{
          kind:item.kind,
          value:item.value
        }
      })
      let obj = {name:this.selectedFunc,params:params}
      this.$emit('commit',obj)
    },
    getParamsMsg(item){

      this.myParams = item.params
      this.selectedFunc = item.nameEn
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
