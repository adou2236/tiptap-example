<template>
  <el-dialog :visible="dialogVisible"
             title="编辑地域组"
             @open="handleOpen"
             @close="handleClose">
    <div class="dialog-content">
      <div class="group-list">
        <div class="list-header">
            地域组：
            <i class="el-icon-edit-outline" @click="groupNameChange"></i>
            <i class="el-icon-circle-plus-outline" @click="groupAdd"></i>
            <i class="el-icon-delete" @click="groupRemove"></i>
            <i class="el-icon-top" @click="groupUp"></i>
            <i class="el-icon-bottom" @click="groupDown"></i>
          </div>
        <div class="list-selector" style="height:180px">
          <div v-for="item in groupList"
                :key="item.groupName"
                :class="item.groupName === chooseId?'list active':'list'"
                @click="handleClick(item)">
              {{item.groupName}}
          </div>
        </div>
        <div class="list-header">
            保存的分组：
        </div>
        <div class="saved-selector">
          <div v-for="item in defaultTemplate"
                :key="item.templateId"
                class="list"
                @click="useTemplate(item)">
              {{item.templateName}}
          </div>
        </div>
      </div>
      <div class="group-list">
        <div class="list-header">
          可选地域
        </div>
        <el-checkbox-group :disabled="groupList.length<=0" class="list-selector" v-model="checkboxValue1">
            <el-checkbox v-for="item in restRegions" :key="item" :label="item">{{ item }}</el-checkbox>
        </el-checkbox-group>
        <div class="transfer-footer">
          <el-button size="mini"
                   type="primary"
                   class="conform-btn"
                   @click="handleSelect">确认</el-button>
        </div>

      </div>
      <div class="group-list">
        <div class="list-header">
          已选地域
        </div>
        <el-checkbox-group class="list-selector" v-model="checkboxValue2">
          <el-checkbox v-for="item in currentGroup" :key="item" :label="item">{{ item }}</el-checkbox>
        </el-checkbox-group>
        <div class="transfer-footer">
          <el-button
                   size="mini"
                   type="danger"
                   class="delete-btn"
                   @click="handleRemove">删除</el-button>
        </div>
      </div>
    </div>
     <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取消</el-button>
      <el-button size="mini"  type="primary" @click="handleCommit">确定</el-button>
      <el-button class="save-btn" size="mini" type="primary" @click="saveAsTemplate">保存为地域组模板</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {province} from "../../assets/maps";
import {chartGroupSave, getChartGroup} from "@/request/templateApi";
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
      checkboxValue2:[],
      defaultTemplate:[]

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
    useTemplate(v){
      this.groupList = v.content.map((item,index)=>{
        return{
          ...item,
          color:chartColor[index],
          labelFormatter:'{b}'
        }
      })
    },
    saveAsTemplate(){
      this.$prompt('请输入模板名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async({ value }) => {
        let query = {
          templateName:value,
          content:this.groupList
        }
        let {data} = await chartGroupSave(query)
        if(data.code == 200){
          this.$message.success("保存成功")
          this.defaultTemplate.push(query)
        }else{
          this.$message.success("保存失败")
        }
      })
    },
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
    async handleOpen(){
      this.groupList = this.additions.group
      if(this.groupList.length>0){
        this.chooseId = this.groupList[0].groupName
      }
      let {data} = await getChartGroup()
      this.defaultTemplate = data.data.data
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
/deep/.el-dialog__header{
  border-bottom: 1px solid #E4E4E4;
}
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
    outline: 1px solid #D8D8D8;
    .list-header{
      height: 40px;
      line-height: 40px;
      margin: 0;
      padding-left: 15px;
      border-bottom: 1px solid #EBEEF5;
      box-sizing: border-box;
      color: #000;
      font-size: 16px;
      &>i{
        width:20px;
        height:20px;
        margin: 0 5px;
        font-size: 20px;
        color: #36A4FD;
        cursor: pointer;
      }
    }
    .saved-selector{
      height: 120px;
      display: flex;
      flex-direction: column;
      overflow-y:auto;
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
      height: 50px;
      line-height: 50px;
      padding: 0 18px;
      border-top:1px solid #D8D8D8;
      .conform-btn{
        background:#FFF;
        color: #36A4FD;
        &:hover{
          color:#FFF;
          background: #36A4FD;
        }
      }
      .delete-btn{
        background:#FFF;
        color: #FB2222;
        &:hover{
          color:#FFF;
          background: #FB2222;
        }
      }
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
.save-btn{
  position: absolute;
  bottom: 20px;
  left: 20px;
}


</style>
