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
             :class="item.groupName === chooseId?'list active':'list'"
             @click="handleClick(item)" >{{item.groupName}}</div>
      </div>
      <div class="group-list">
        <div class="list-header">
          可选地域
        </div>
        <el-checkbox-group :disabled="groupList.length<=0" class="list-selector" v-model="checkboxValue1">
            <el-checkbox v-for="item in restRegions" :label="item">{{ item }}</el-checkbox>
        </el-checkbox-group>
        <el-button class="transfer-footer"
                   size="mini"
                   @click="handleSelect">确认</el-button>
      </div>
      <div class="group-list">
        <div class="list-header">
          已选地域
        </div>
        <el-checkbox-group class="list-selector" v-model="checkboxValue2">
          <el-checkbox v-for="item in currentGroup" :label="item">{{ item }}</el-checkbox>
        </el-checkbox-group>
        <el-button class="transfer-footer"
                   size="mini"
                   @click="handleRemove">删除</el-button>
      </div>
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
import {arrayDiff, chartColor} from "../../unit/baseType";
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
    },
    additions:{
      type:Object,
    }
  },
  data(){
    return{
      province,
      disable:false,
      chooseId:'',
      groupList:[],
      temporaryLeftList:[],
      temporaryRightList:[],
      checkboxValue1:[],
      checkboxValue2:[]

    }
  },
  computed:{
    //剩余可选组
    restRegions(){
      let allSelected = this.groupList.map(item=>item.areas)
      if(allSelected.length>0){
        allSelected = allSelected.reduce(function (a, b) { return a.concat(b)} );
      }
      return arrayDiff(province,allSelected)
    },
    currentGroup:{
      get(){
        let list = []
        if(this.groupList.length>0&&this.chooseId){
          list = this.groupList.find(item=>item.groupName === this.chooseId).areas
        }
        return list
      },
      set(e){
        this.groupList.find(item=>item.groupName === this.chooseId).areas = e
      }
    }
  },
  methods:{
    groupUp(){
      let index = this.groupList.findIndex(item=>item.groupName === this.chooseId)
      if (index != 0) {
        this.groupList[index] = this.groupList.splice(index - 1, 1, this.groupList[index])[0];
      }
    },
    groupDown(){
      let index = this.groupList.findIndex(item=>item.groupName === this.chooseId)
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
          this.groupList.find(item=>item.groupName === this.chooseId).groupName = value
        }
      })
    },
    groupRemove(){
      let removeId = this.chooseId
      this.groupList = this.groupList.filter(item=>item.groupName !== removeId)
      this.chooseId = this.groupList[0]?.groupName || ''
    },
    groupAdd(){
      this.$prompt('请输入分组名称', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
      }).then(({ value }) => {
        if(this.groupList&&this.groupList.some(item=>item.groupName === value)){
          this.$message.error('分组名称重复')
        }else{
          let length = this.groupList.length
          this.chooseId = value
          let newGroup = {
            groupName:value,
            areas:[],
            color:chartColor[length],
            labelFormatter:'{b}'
          }
          this.groupList.push(newGroup)
        }
      })
    },
    handleOpen(){
      this.groupList = this.additions.group
      if(this.groupList.length>0){
          this.chooseId = this.groupList[0].groupName
      }

    },
    handleSelect(){
      let list = new Set([...this.currentGroup,...this.checkboxValue1])
      this.currentGroup = [...list]
      this.checkboxValue1 = []
      this.checkboxValue2 = []
    },
    handleRemove(){
      this.currentGroup = arrayDiff(this.currentGroup,this.checkboxValue2)
      this.checkboxValue1 = []
      this.checkboxValue2 = []
    },
    handleClick(item){
      this.chooseId = item.groupName
    },
    handleCommit(){
      this.additions.group = this.groupList
      this.$emit('additionChange',this.additions)
      this.$message.success('保存成功')
      this.handleClose()
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
    .list-selector{
      height: 300px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      .el-checkbox{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding: 0 5px;
        cursor: pointer;
        &:hover{
          background: #EBEEF5;
        }
      }
    }
    .transfer-footer{
      height: 40px;
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
