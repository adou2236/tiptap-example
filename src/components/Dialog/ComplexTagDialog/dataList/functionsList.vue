<template>
  <div>
    函数
    <ul>
      <li v-for="item in functionsList" @click="handleClick(item)">{{item.nameEn}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "functionsList",
  props:{
    functionsList:{
      type:Array,
      default:()=>[]
    }
  },
  methods:{
    handleClick(item){
      this.$emit('commit',item)
    }
  }
}
</script>

<style scoped>

</style>
