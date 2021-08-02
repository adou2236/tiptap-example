<template>
  <div class="dialog content" v-show="visible" >
    <slot class="content"></slot>
    <div class="close" @click="close">X</div>
  </div>
</template>

<script>
import imageUpload from "./imageUpload";
export default {
  name: "index",
  components:{
    imageUpload
  },
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
      type:[String,Object],
    },
    type:{
      type:String,
      default:'string'
    }
  },
  methods:{
    close(){
      this.$emit('change',false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog{
  position: absolute;
  width: 80vw;
  height: 80vh;
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid black;
}
.close{
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
.content{
  height: 100%;
  overflow: scroll;


}
</style>
<style scoped>
.content >>> p{
  margin: 0;
}
.content >>> table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  overflow: hidden;
}
.content >>> td, th {
  min-width: 1em;
  border: 2px solid #ced4da;
  padding: 3px 5px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}
.content >>>  th {
  min-width: 1em;
  border: 2px solid #ced4da;
  padding: 3px 5px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
  font-weight: bold;
  text-align: left;
  background-color: #f1f3f5;
}
.content >>> .chart{
  width: 100%;
}
</style>

