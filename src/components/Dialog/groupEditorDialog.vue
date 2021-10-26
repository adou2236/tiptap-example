<template>
  <el-dialog :visible="dialogVisible"
             title="插入函数"
             @open="handleOpen"
             @close="handleClose">
    <div class="dialog-content">
      <div class="group-list">
        <div class="list-header">
          地域组
          <span @click="groupNameChange">改名</span>
          <span @click="groupAdd">添加</span>
          <span @click="groupRemove">删除</span>
          <span @click="groupUp">上移</span>
          <span @click="groupDown">下移</span>
        </div>
        <div v-for="item in groupList"
             :class="item.groupId === chooseId?'list active':'list'"
             @click="handleClick(item)" >{{item.groupName}}</div>
      </div>
      <el-transfer
          class="group-selector"
          filterable
          v-model="currentGroup"
          :titles="['可选地域', '已选地域']"
          :props="{
            key: 'key',
            label: 'key'
          }"
          :data="option"
          @left-check-change="leftChange"
          @right-check-change="rightChange"
          @change="handleChange">
        <el-button class="transfer-footer" slot="left-footer" size="small" @click="handleSelect">确认</el-button>
        <el-button class="transfer-footer" slot="right-footer" size="small" @click="handleRemove">删除</el-button>
      </el-transfer>
    </div>
     <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleCommit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {province} from "../../assets/maps";
import {chartGroupSave, getChartGroup} from "../../request/api";
import {arrayDiff} from "../../unit/baseType";
export default {
  name: "groupEditorDialog",
  model:{
    prop:'dialogVisible',
    event:'change'
  },
  props:{
    dialogVisible:{
      type:Boolean,
      default:false
    },
    chartId:{
      type:String,
      default:''
    }
  },
  data(){
    return{
      option:province.map(item=>{
        return {key:item}
      }),
      disable:false,
      chooseId:'',
      groupList:[],
      temporaryLeftList:[],
      temporaryRightList:[]

    }
  },
  computed:{
    currentGroup:{
      get(){
        let list = []
        if(this.groupList.length>0&&this.chooseId){
          list = this.groupList.find(item=>item.groupId === this.chooseId).areas
        }
        return list
      },
      set(e){
        //TODO分组数量变化后，默认选中第一条
        //无分组则不允许穿梭操作
        //分组变动之后需要将已选择的区域从待选项中去除
        this.groupList.find(item=>item.groupId === this.chooseId).areas = e
      }
    }
  },
  methods:{
    groupUp(){
      let index = this.groupList.findIndex(item=>item.groupId === this.chooseId)
      if (index != 0) {
        this.groupList[index] = this.groupList.splice(index - 1, 1, this.groupList[index])[0];
      }
    },
    groupDown(){
      let index = this.groupList.findIndex(item=>item.groupId === this.chooseId)
      if (index != this.groupList.length - 1) {
        this.groupList[index] = this.groupList.splice(index + 1, 1, this.groupList[index])[0];
      }
    },
    groupNameChange(){
      this.$prompt('请输入新的名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if(this.groupList.some(item=>item.groupName === value)){
          this.$message.error('分组名称重复')
        }else{
          this.groupList.find(item=>item.groupId === this.chooseId).groupName = value
        }
      })
    },
    groupRemove(){
      let removeId = this.chooseId
      this.groupList = this.groupList.filter(item=>item.groupId !== removeId)
      this.chooseId = this.groupList[0]?.groupId || ''
    },
    groupAdd(){
      let timestamp = (new Date()).getTime()
      let groupId = `${this.chartId}_group_${timestamp}`
      this.$prompt('请输入分组名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        console.log(groupId)
        if(this.groupList&&this.groupList.some(item=>item.groupName === value)){
          this.$message.error('分组名称重复')
        }else{
          this.groupList.push({groupId:groupId,groupName:value,areas:[]})
        }
      })
    },
    async handleOpen(){
      this.groupList = await this.groupInit()
      if(this.groupList.length>0){
        this.chooseId = this.groupList[0].groupId
      }
    },
    async groupInit(){
      let {data} = await getChartGroup(this.chartId)
      return data.content.content
    },
    leftChange(e){
      this.temporaryLeftList = e
    },
    rightChange(e){
      this.temporaryRightList = e
    },
    handleSelect(){
      let list = new Set([...this.currentGroup,...this.temporaryLeftList])
      console.log(list)
      this.currentGroup = [...list]
      this.temporaryLeftList = []
      this.temporaryRightList = []
    },
    handleRemove(){
      this.currentGroup = arrayDiff(this.currentGroup,this.temporaryRightList)
      this.temporaryLeftList = []
      this.temporaryRightList = []
    },
    handleChange(e){
      console.log(e)
    },
    handleClick(item){
      this.chooseId = item.groupId
    },
    handleCommit(){
      let query = {
        chartId:this.chartId,
        content:this.groupList
      }
      chartGroupSave(query).then(res=>{
        this.$message.success('保存成功')
      })
    },
    handleClose(){
      this.$emit('change',false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content{
  display: flex;
  width: 100%;
  /deep/.el-transfer__buttons{
    display: none;
  }
  .group-list{
    flex: 1;
    overflow: hidden;
    background: #FFF;
    display: inline-block;
    vertical-align: middle;
    max-height: 100%;
    box-sizing: border-box;
    position: relative;
    .list-header{
      height: 40px;
      line-height: 40px;
      background: #F5F7FA;
      margin: 0;
      padding-left: 15px;
      border-bottom: 1px solid #EBEEF5;
      box-sizing: border-box;
      color: #000;
    }
    .list{
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      padding: 0 5px;
      cursor: pointer;
      &:hover{
        background: #EBEEF5;
      }
      &.active{
        background: #EBEEF5;
      }

    }
  }
  .group-selector{
    flex: 2;
    text-align: left;
    display: inline-block;
    /deep/.el-transfer-panel{
      border: none;

    }
  }
}


</style>
