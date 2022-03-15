<template>
  <el-popover v-model="visible">
    <color-panel v-model="selectedColor" :tColor="colorMap"></color-panel>
    <div slot="reference"
         class="color-block"
         :style="`background:${defaultColor}`"></div>
  </el-popover>
</template>

<script>
import {chartColor} from "../unit/baseType";
import colorPanel from './color-panel.vue';

export default {
  components: { colorPanel },
  name: "color-picker",
  model:{
    prop:'defaultColor',
    event:'change'
  },
  props:{
    defaultColor:{
      type:String,
    }
  },
  data(){
    return{
      colorMap:[...chartColor,"#FFFFFF"],
      visible:false
    }
  },
  computed:{
    selectedColor:{
      get(){
        return this.defaultColor
      },
      set(v){
        this.handleClick(v)
      }
    }
  },
  methods:{
    handleClick(item){
      this.$emit('change',item)
    },
  }
}
</script>

<style lang="scss" scoped>
.color-block{
  width: 1rem;
  height: 1rem;
  text-align: center;
  border: none;
  cursor: pointer;
  position: relative;
  border: 1px solid black;
}
.select-pane{
  display: flex;
  background: #FFFFFF;
  border-radius: 0.5rem;
  width: 10rem;
  flex-wrap: wrap;
  z-index: 100;
  .select-item{
    cursor: pointer;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid #c0c0c0;
    margin: 2px;
    box-sizing: border-box;
    &.is-active,
    &:hover{
      border: 2px solid #5a5a5a;
    }
  }
}

</style>
