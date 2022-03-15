<template>
  <div style="position: relative">
    <el-popover
      width="150">
     <div class="select-pane" >
      <div class="select-item" v-for="(item,index) in options"
           :key="index"
           :class="isActive()===item.id?'is-active':''"
           @click="handleClick(item.id)">{{ item.label }}</div>
    </div>
      <button class="color-block" slot="reference">
      <svg class="remix" :style="`fill:${isActive()}`">
        <use :xlink:href="require('remixicon/fonts/remixicon.symbol.svg') + `#ri-${icon}`" />
      </svg>
    </button>
    </el-popover>
  </div>

</template>

<script>

export default {
  name: "NormalPicker",
  props:{
    isActive:{
      type: Function,
      default: null,
    },
    icon:{
      type:String
    },
    options:{
      type:Array,
      default: ()=>[
      ]
    }
  },
  data(){
    return{
      visible:false
    }
  },
  mounted(){
    window.addEventListener('click',this.hidePicker)
  },
  beforeDestroy() {
    window.removeEventListener('click',this.hidePicker)
  },
  methods:{
    handleClick(item){
      this.$emit('action',item)
    },
    showPicker(){
      this.visible=!this.visible
    },
    hidePicker(){
      this.visible=false
    }
  }
}
</script>

<style lang="scss" scoped>
.color-block{
  width: 1.75rem;
  height: 1.75rem;
  text-align: center;
  border: none;
  background-color: transparent;
  border-radius: 0.4rem;
  font-size: 1.25rem;
  padding: 0.25rem;
  margin-right: 0.25rem;
  cursor: default;
  position: relative;
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
  .color-line{
    width: 80%;
    height: 2px;
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
  }
  &:hover {
    color: #FFF;
    background-color: #062B61;
    /deep/svg{
      fill: #FFFFFF!important;
    }
  }

}
.select-pane{
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  flex-wrap: wrap;
  z-index: 100;
  .select-item{
    font-size: 14px;
    padding: 5px;
    cursor: pointer;
    box-sizing: border-box;
    &.is-active,
    &:hover{
      background: #062B61;
      color: #FFFFFF;
    }
  }
}

</style>
