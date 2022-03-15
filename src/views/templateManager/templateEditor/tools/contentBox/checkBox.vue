<template>
  <div class="check-box" v-if="visible" >
    <div class="header">
      测试结果
      <span @click="reCheck" class="reCheck-btn">刷新</span>
      <i @click="close" class="el-icon-error close-btn"></i>
    </div>
    <div v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: "checkBox",
  model:{
    prop:'visible',
    event:'change'
  },
  props:{
    visible:{
      type:Boolean,
      default:false
    },
    content:{
      type:String,
      default:"空"
    }
  },
  methods:{
    reCheck(){
      this.$emit('reCheck')
    },
    close(){
      this.$emit('change',false)
    }
  }
}
</script>

<style lang="scss" scoped>
.check-box{
  background: #F1F1F1;
  padding: 0 10px 10px;
  margin-bottom: 10px;
  .header{
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    border-bottom: 1px solid #DFDFDF;
    position: relative;
    .reCheck-btn{
      position: absolute;
      cursor: pointer;
      top: 50%;
      right: 25px;
      transform: translateY(-50%);
      margin-right: 20px;
    }
    .close-btn{
      font-size: 20px;
      position: absolute;
      cursor: pointer;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
      color: #36A4FD;
    }
  }
}
</style>
