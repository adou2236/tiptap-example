<template>
  <div class="object-selector" :style="`width: ${isHidden?'20px':'20%'}`">
    <div v-if="!isHidden">
      <button v-for="(item,index) in objects" :key="index" @click="handleSelect(item)">{{item.name}}</button>
    </div>
    <div @click="handleDraw" class="drawer-btn">{{ optionText }}</div>
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
    },
  },
  data(){
    return{
      isHidden:false
    }
  },
  computed:{
    optionText(){
      return this.isHidden?'展开':'收起'
    }
  },
  methods:{
    handleDraw(){
      this.isHidden = !this.isHidden
    },
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
  },
}
</script>

<style lang="scss" scoped>
.object-selector{
  position: relative;
  overflow: hidden;
  transition: all .3s ease;
  .drawer-btn{
    position: absolute;
    cursor: pointer;
    right: 0;
    top: 20px;
  }
}


</style>
