<template>
  <el-dialog :visible="visible"
             title="插入表达式"
             append-to-body
             width="800px"
             :close-on-click-modal="false"
             @close="handleClose">
    <el-form class="forms" :inline="true" label-position="top">
      <el-form-item label="选择表达式">
        <el-select :value="selectedFuncId" value-key="id" @change="getParamsMsg">
          <el-option v-for="item in functionsList" :key="item.id" :value="item.id" :label="item.nameEn" >
            <el-tooltip :key="item.id"  placement="left" :content="item.nameZh">
              <div style="width:100%;height:100%">{{item.nameEn}}</div>
            </el-tooltip>
          </el-option>
      </el-select>
      </el-form-item>
      <el-form-item style="margin-left:40px" label="选择参数">
        <div v-for="(param,index) in myParams" :key="index" style="display: flex;margin-bottom: 5px">
        <span class="discription" v-show="param.typeDesc">{{param.typeDesc}}:</span>
        <el-select style="width:100px;margin-right:10px" v-model="param.paramType">
          <el-option value="variety" label="变量">变量</el-option>
          <el-option value="const" label="常量">常量</el-option>
        </el-select>
        <template v-if="param.paramType == 'variety'">
          <el-select style="width:200px" v-model="param.value" placeholder="选择变量">
            <el-option
            v-for="(item,index) in varsList.filter(obj=>obj.keyType==param.type)"
            :disabled="item.keyType!=param.type"
            :key="index" :value="item.varKey">
            </el-option>
          </el-select>
        </template>
        <!-- TODO重新确定常量结构 -->
        <template v-else>
          <multy-type-selector
            v-show="param.paramType"
            :value="param"
            :key="index"
            showingValue="value"
            :type="param.type"
            :indexList="indexList"
            :placeholder="param.typeDesc"
            :geos="geos"
            @change="(e)=>handleChange(index,e)" ></multy-type-selector>
        </template>
      </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleCommit">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getFunctions} from "@/request/templateApi";
import multyTypeSelector from './multyTypeSelector.vue';
import { getGeoTree, getIndexTree } from '@/request/templateApi';
import { deepCopy } from '../../unit/baseType';

export default {
  components: { multyTypeSelector },
  name: "functionTagDialog",
  model:{
    prop:'visible',
    event:'change'
  },
  props:{
    visible:false,
    defaultValue:{
      type:[String,Object,Array],
      default:()=>{
        return{
          id:'',
          nameEn:'',
          params:[]
        }
      }
    },
    functionsList:{
      type:Array,
      default:()=>[]
    },
    varsList:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return{
      paramsMessage:[],
      selectedFuncId:"",
      selectedFuncName:"",
      myParams:[],
      geos:[],
      indexList:[]
    }
  },
  async mounted(){
    await Promise.all([
      this.getGeos(),
      this.getIndexTree()
    ]).then(res=>{
      this.geos = res[0]
      this.indexList = res[1]
    })
    this.handleOpen()
  },
  methods:{
    handleChange(a,b){
      if(this.myParams[a].type == 1){
        this.myParams[a].value = b.extra.nodeName
      }else{
        this.myParams[a].value = b.value
      }
      this.myParams[a].extra = b.extra
    },
    async getGeos(){
      let {data} = await getGeoTree()
      return [data.data]
    },
    async getIndexTree(){
      let {data} = await getIndexTree()
      return data.data.children
    },
    handleOpen(){
      this.selectedFuncId = this.defaultValue?.id || ''
      this.selectedFuncName = this.defaultValue?.nameEn || ''
      this.myParams = deepCopy(this.defaultValue?.params) || []
    },
    handleCommit(){
      let params = this.myParams.map(item=>{
        return{
          paramType:item.paramType,
          type:item.type,
          value:item.value,
          extra:item.extra
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
      let item = this.functionsList.find(item=>item.id === id)
      this.myParams = item.params.map(item=>{
        return{
          ...item,
          extra:{},
          value:"",
          paramType:"variety"
        }
      })
      this.selectedFuncId = item.id
      this.selectedFuncName = item.nameEn
    },
    async functionsInit(){
      let {data} = await getFunctions()
      return data.data
    },
    handleClose(){
      this.$emit("change",false)
    }
  }
}
</script>

<style lang="scss" scoped>

.discription{
  width: 80px;
  font-size: 16px;
}
/deep/.el-form-item__label{
  font-size: 16px;
}
/deep/.el-dialog__header{
  border-bottom: 1px solid #E4E4E4;
}
</style>
