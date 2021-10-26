<template>
  <div>
    变量
    <ul>
      <li v-for="item in varsList" @click="handleClick(item)">{{item.varKey}}</li>
    </ul>
  </div>

</template>

<script>
export default {
  name: "varsList",
  props:{
    varsList:{
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
