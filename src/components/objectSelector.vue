<template>
  <div>
    <button v-for="(item,index) in objects" :key="index" @click="handleSelect(item)">{{item.name}}</button>
  </div>
</template>

<script>
export default {
  name: "objectSelector",
  props:{
    //当前编辑器对象
    editor:{
      type:Object
    },
    objects:{
      type:Array,
      default:()=>[]
    }
  },
  methods:{
    handleSelect(item){
      switch (item.id){
        case 'line':
          this.$emit("lineInsert");
          break
        case 'tag':
          this.$emit("tagInsert",item.type);
          break
        case 'image':
          this.$emit("imageInsert");
          break
        case 'chart':
          this.$emit('chartInsert');
          break
        default:
          return

      }

    },
  }
}
</script>

<style lang="scss" scoped>

</style>
