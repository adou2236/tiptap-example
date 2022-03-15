<template>
  <div style="position: relative">
    <el-popover>
      <color-panel v-model="selectedColor" :tColor="options"></color-panel>
      <button class="color-block" slot="reference" >
        <svg class="remix" :style="`fill:${isActive()||'#000'}`">
          <use :xlink:href="require('remixicon/fonts/remixicon.symbol.svg') + `#ri-font-color`" />
        </svg>
      </button>
    </el-popover>
  </div>

</template>

<script>
import ColorPanel from '../color-panel.vue'

export default {
  name: "ColorPicker",
  components:{ColorPanel},
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
    }
  },
  computed:{
    selectedColor:{
      get(){
        return this.isActive() || ''
      },
      set(v){
        this.handleClick(v)
      }
    }
  },
  methods:{
    handleClick(item){
      this.$emit('action',item)
    },

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
  background: #FFFFFF;
  display: flex;
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
