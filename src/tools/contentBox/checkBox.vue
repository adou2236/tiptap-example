<template>
  <div class="check-box" v-if="visible" >
    <div class="header">
      检查结果
      <span @click="reCheck" class="reCheck-btn">刷新</span>
      <span @click="close" class="close-btn">X</span>
    </div>
    <div v-html="content">aaaaa</div>
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
  background: rgba(117, 117, 117, 0.14);
  padding: 10px;
  margin-bottom: 10px;
  .header{
    height: 20px;
    border-bottom: 1px solid black;
    position: relative;
    .reCheck-btn{
      position: absolute;
      cursor: pointer;
      top: 50%;
      right: 25px;
      transform: translateY(-50%);
    }
    .close-btn{
      position: absolute;
      cursor: pointer;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
    }
  }
}
</style>
