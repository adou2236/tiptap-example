<template>
  <div>
<!--    占位数据:<input v-model="viewText"/><br/>-->

    标签类型：<select v-model="type">
      <option value ="string">常量标签</option>
      <option value ="formula">公式标签</option>
      <option value="request">函数标签</option>
    </select><br/>
    内部数据：<input v-model="index"/>
  </div>
</template>

<script>
export default {
  name: "objectEditor",
  props:{
    currentObject:{
      type:Object,
    }
  },
  computed:{
    //如何改变里内容
    type:{
      get(){
        return this.currentObject?.node?.attrs?.type || ''
      },
      set(v){
        this.currentObject.updateAttributes({type:v})
      }

    },
    index:{
      get(){
        return this.currentObject?.node?.attrs?.index || ''
      },
      set(v){
        this.currentObject.updateAttributes({index:v})
      }

    },
    viewText:{
      get(){
        return  this.currentObject?.node?.textContent || ''
      },
      //如何改变表内容
      set(v){
        this.currentObject.updateAttributes({textContent:v})
      }

    }

  },
  watch:{
    currentObject(v){
      console.log(v)
    }
  }
}
</script>

<style scoped>

</style>
