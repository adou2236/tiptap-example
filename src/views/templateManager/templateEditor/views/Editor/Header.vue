<template>
  <div class="editor-head">
      <div class="title">{{baseMsg.name}}</div>
      <div class="button-group">
        <el-button v-show="environment === 'development'" @click="handleOverview" type="primary">json</el-button>
        <!-- <el-button  disabled type="primary">生成报告</el-button> -->
        <el-button @click="handleClone" type="primary">保存为新版本</el-button>
        <el-button @click="handleSave" type="primary">保存</el-button>
        <el-button @click="handleApply" type="primary">应用</el-button>
        <i class="el-icon-error" @click="handleClose"></i>
      </div>
  </div>
</template>

<script>
export default {
  props:{
    baseMsg:{
      type:Object,
    }
  },
  data(){
    return{
      fullLoading: null,
      environment: process.env.NODE_ENV
    }
  },
  methods:{
    handleClose(){
      window.close()
    },
    handleApply(){
      this.loadingStart()
      this.$emit('apply',()=>{
        this.fullLoading.close()
      })
    },
    handleClone(){
      this.loadingStart()
      this.$emit('clone',()=>{
        this.fullLoading.close()
      })
    },
    handleSave(){
      this.loadingStart()
      this.$emit('save',()=>{
        this.fullLoading.close()
      })
    },
    handleOverview(){
      this.$emit('overView')
    },
    loadingStart(){
      this.fullLoading = this.$loading({
        lock:true,
        text: '正在保存',
        background:'rgba(0,0,0,0.7)'
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.editor-head{
    height: 70px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 50px;
    border-bottom: 1px solid #DADADA;
    background: #FFFFFF;
    .title{
      font-size: 20px;
      font-weight: bold;
      color: #1B1B1B;
    }
    .button-group{
      display: flex;
      align-items: center;
      &>*{
        margin-left: 20px;
      }
      i{
        font-size: 25px;
        color: #DADADA;
        cursor: pointer;
        &:hover{
          color: #062B61;
        }
      }
    }

}

</style>
