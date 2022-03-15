<template>
  <el-dialog
      title="变量管理"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :before-close="handleClose">
    <div v-loading="loading">
      <el-button size="mini" @click="addRow">添加变量</el-button>
      <el-table :data="vars"  height="300"
                border style="width: 100%">
        <el-table-column label="变量类型" width="150">
          <template slot-scope="{row}">
            <el-select v-model="row.keyType" :disabled="!!row.stable">
              <el-option label="指标" :value="1">指标</el-option>
              <el-option label="时间" :value="2">时间</el-option>
              <el-option label="区域类型" :value="3">区域类型</el-option>
              <el-option label="区域" :value="4">区域</el-option>
              <el-option label="区域数组" :value="11">区域数组</el-option>
              <el-option label="季度" :value="9">季度</el-option>
              <el-option label="更新频率" :value="10">更新频率</el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="变量名称">
          <template slot-scope="{row}">
            <el-input
                v-model="row.varKey"
                :disabled="!!row.stable"
                style="width: 100%"
                :maxlength="25" />
          </template>
        </el-table-column>
        <el-table-column label="默认值">
          <template slot-scope="scope">
            <multy-type-selector
              :value="vars[scope.$index]"
              :key="scope.row.uniqueId"
              :type="scope.row.keyType"
              :indexList="indexList"
              :geos="geos"
              @change="(v)=>rowChange(scope.$index,v)"
            ></multy-type-selector>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="120">
          <template slot-scope="scope">
            <el-button
                @click.native.prevent="deleteRow(scope.$index, vars)"
                :disabled="!!scope.row.stable"
                type="text"
                size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="commit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getGeoTree, getVarsById, varsSave} from "@/request/templateApi";
import {mapState} from "vuex";
import { getIndexTree } from '@/request/templateApi';
import { deepCopy } from '../../unit/baseType';
import multyTypeSelector from './multyTypeSelector.vue';

export default {
  components: { multyTypeSelector },
  name: "varManagerDialog",
  model:{
    prop:'dialogVisible',
    event:'change'
  },
  props:{
    dialogVisible:{
      type:Boolean,
      default:false
    },
    id:{
      type:String,
      default:null
    },
  },
  data(){
    return{
      vars:[],
      indexList:[],
      keyword:'',
      remoteOptions:[],
      searching:false,
      geos:[],
      loading:false,
    }
  },
  async mounted(){
    this.loading = true
    Promise.all([
      this.getVars(this.id),
      this.getGeos(),
      this.getIndexTree()
    ]).then(res=>{
      this.vars = deepCopy(res[0]).map((item,index)=>{
        return{
          ...item,
          uniqueId:index
        }
      })
      this.geos = res[1]
      this.indexList = res[2]
      this.loading = false
    })
  },
  computed:{

  },
  methods:{
    rowChange(index,value){
      let {varKey} = this.vars[index]
      this.vars[index] = {
        ...value,
        varKey,
      }

    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    async getGeos(){
      let {data} = await getGeoTree()
      return [data.data]
    },
    async getIndexTree(){
      let {data} = await getIndexTree()
      return data.data.children
    },
    //TODO头部插入数据，效率待优化
    addRow(){
      let maxId = 0
      this.vars.forEach(item=>{
        if(item.uniqueId>maxId){
          maxId = item.uniqueId
        }
      })
      let newData = {
        uniqueId: Number(maxId) + 1,
        varKey: "",
        varValue: "",
        keyType: 1,
        valueType: 0,  // 扩展变量值  0:常量  1:其它
        extra:{}
      }
      // this.vars.push(newData)
      this.vars.splice(0,0,newData)
    },
    //获取全局或者局部变量列表
    async getVars(id){
      let {data} = await getVarsById(id)
      return data.data.data
    },
   /**
     * 更改全局或者局部变量，事件上浮通知父组件更新
     */
    async commit(){
      let data = {
        segmentId:this.id,
        data:this.vars
      }
      this.loading = true
      let res = await varsSave(data)
      this.loading = false
      if(res.data.code == 200){
        this.$message.success("保存成功")
        this.$emit('varsListUpdate',this.vars)
        this.handleClose()
      }else{
        this.$message.error("保存失败")
      }
    },
    handleClose(){
      this.$emit('change',false)
    }
  }
}
</script>

<style scoped>

</style>
