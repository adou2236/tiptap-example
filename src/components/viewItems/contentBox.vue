<template>
  <div class="line">
    <div @focus="handleFocus(item)" @blur="handleBlur"
         contenteditable="true"
         :class="[model,'content-box']"
         :id="item.id"
         v-for="item in itemData" v-html="item.data"></div>
  </div>
</template>

<script>
export default {
  name: "contentBox",
  props:{
    model:{
      type:String,
      default:"edit"
    },
    itemData:{
      type:Array,
      default: ()=>[]
    }
  },
  methods:{
    handleFocus(object){
      this.$emit('itemFocus',object)

    },
    handleBlur(){
      console.log("失去焦点")
    }
  }

}
</script>

<style scoped>
.line{
  display: flex;
}
.edit.content-box{
  padding: 10px 20px;
  margin-bottom: 10px;
  min-height: 80px;
  border: 1px dashed black;
  flex: 1;
  cursor:pointer;
  text-align: left;
}
[contenteditable]:focus{
  outline-color: red;
  cursor: text;
}



</style>
