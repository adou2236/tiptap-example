<template>
  <div style="position: relative">
    <button class="color-block" @click.stop="showPicker">
      <svg class="remix" :style="`fill:${isActive()||'#000'}`">
        <use :xlink:href="require('remixicon/fonts/remixicon.symbol.svg') + `#ri-font-color`" />
      </svg>
    </button>
    <div class="select-pane" v-if="visible">
      <span class="select-item" v-for="(item,index) in options"
            @click="handleClick(item)"
            :class="isActive()===item?'is-active':''"
            :key="index" :style="`background:${item}`"/>
    </div>
  </div>

</template>

<script>

export default {
  name: "ColorPicker",
  props:{
    isActive:{
      type: Function,
      default: null,
    },
    options:{
      type:Array,
      default: ()=>['red','blue']
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
    background-color: #0D0D0D;
    /deep/svg{
      fill: #FFFFFF!important;
    }
  }

}
.select-pane{
  display: flex;
  background: #FFFFFF;
  border: 1px solid black;
  position: absolute;
  top: 1.75rem;
  border-radius: 0.5rem;
  left: 0;
  width: 10rem;
  flex-wrap: wrap;
  z-index: 100;
  .select-item{
    cursor: pointer;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #FFFFFF;
    margin: 2px;
    box-sizing: border-box;
    &.is-active,
    &:hover{
      border: 2px solid #757575;
    }
  }
}

</style>
