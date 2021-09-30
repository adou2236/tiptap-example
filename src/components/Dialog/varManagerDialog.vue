<template>
  <el-dialog
      title="变量管理"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose">
    <div>
      <button @click="addRow">添加变量</button>
      <el-table :data="vars">
        <el-table-column label="变量类型">
          <template slot-scope="{row}">
            <el-select v-model="row.keyType">
              <el-option label="指标" :value="1">指标</el-option>
              <el-option label="时间" :value="2">时间</el-option>
              <el-option label="区域类型" :value="3">区域类型</el-option>
              <el-option label="区域" :value="4">区域</el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="变量名称">
          <template slot-scope="{row}">
            <el-input :maxlength="25" v-model="row.varKey"/>
          </template>
        </el-table-column>
        <el-table-column label="默认值">
          <template slot-scope="{row}">
            <el-select
                v-if="row.keyType == 1"
                v-model="row.varValue"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="searching">
              <el-option
                  v-for="item in remoteOptions"
                  :key="item.indicator"
                  :label="item.indicator"
                  :value="item.indicator">
              </el-option>
            </el-select>
            <el-date-picker v-if="row.keyType == 2" v-model="row.varValue"></el-date-picker>
            <el-cascader
                v-model="row.varValue"
                v-if="row.keyType == 4"
                :options="geos"
                :props="{ checkStrictly: true,value:'label',label:'label',emitPath:false }"
                clearable></el-cascader>
          </template>

        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="commit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getGeoTree, getIndexList, getVarsById, varsSave} from "../../request/api";
import {mapState} from "vuex";

export default {
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
    }
  },
  data(){
    return{
      vars:[],
      keyword:'',
      remoteOptions:[],
      searching:false,
      geos:[]
    }
  },
  async mounted(){
    Promise.all([
      this.getVars(this.id),
      this.getGeos()
    ]).then(res=>{
      this.vars = res[0]
      this.geos = res[1]
    })
  },
  computed:{
  },
  methods:{
    async getGeos(){
      let {data} = await getGeoTree()
      return [data.content]
    },
    async remoteMethod(query){
      this.searching = true
      let params = {
        "keyword":query,
        "pageNum":1,
        "pageSize":100
      }
      let {data} = await getIndexList(params)
      this.searching = false
      this.remoteOptions = data.content.data

    },
    addRow(){
      let newData = {
        "varKey": "",
        "varValue": "",
        "keyType": 1,
        "valueType": 0  // 扩展变量值  0:常量  1:其它
      }
      this.vars.push(newData)
    },
    //获取全局或者局部变量列表
    async getVars(id){
      let {data} = await getVarsById(id)
      return data.content.data
    },
   /**
     * 更改全局或者局部变量，事件上浮通知父组件更新
     */
    async commit(){
      let data = {
        segmentId:this.id,
        data:this.vars
      }
      let res = await varsSave(data)
      if(res.data.statusCode == 200){
        this.$message.success("保存成功")
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
