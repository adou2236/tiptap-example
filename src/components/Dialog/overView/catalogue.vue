<template>
  <div>
    <ul v-if="cataData.length>0">
      <li v-for="item in cataData" :key="item.key"
          :class="item.key == currentPath?'active':''"
          :style="`padding-left:${(item.level-1)*10}px`"
          @click="handleClick(item)">
        {{item.label}}
      </li>
    </ul>
    <div v-else>未找到目录</div>
  </div>

</template>

<script>
export default {
  name: "catalogue",
  props:{
    cataData:{
      type:Array,
      default:()=>[]
    },
    currentPath:{
      type:[String,Number],
      default:0,
    }
  },
  data(){
    return{

    }
  },
  methods:{
    handleClick(item){
      this.$emit("scrollTo",item)
    }
  }
}
</script>

<style lang="scss" scoped>
ul{
  padding: 0;
}
li{
  list-style: none;
  cursor: pointer;
  &.active{
    background: #c2c2c2;
  }
  &:hover{
    background: #c2c2c2;
  }
}

</style>
