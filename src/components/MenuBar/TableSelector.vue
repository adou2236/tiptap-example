<template>
  <div style="position: relative">
    <button class="color-block" @click.stop="showPicker">
      <svg class="remix">
        <use :xlink:href="require('remixicon/fonts/remixicon.symbol.svg') + `#ri-layout-grid-line`" />
      </svg>
    </button>
    <div class="select-pane" v-if="visible" @click="setTable" @mouseleave="changeCell(0,0)">
      <div class="row" v-for="row in maxRows" :key="row">
        <span class="cell" v-for="col in maxCols" :id="`${row}-${col}`" :key="`${row}-${col}`" @mouseover="changeCell(row,col)"
              :class="row<=selectedRow&&col<=selectedCol?'color-cell':''"
        />
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "TableSelector",
  data(){
    return{
      maxCols:10,
      maxRows:10,
      selectedRow:0,
      selectedCol:0,
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
    setTable(){
      if(this.selectedRow&&this.selectedCol){
        let params = {
          row:this.selectedRow,col:this.selectedCol
        }
        this.$emit('action',params)
      }
    },
    changeCell(row,col){
      this.selectedRow = row
      this.selectedCol = col
    },
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
  flex-direction: column;
  background: #FFFFFF;
  border: 1px solid black;
  position: absolute;
  top: 1.75rem;
  border-radius: 0.5rem;
  left: 0;
  padding: 0.25rem;
  z-index: 100;
  width: auto;
  .row{
    display: flex;
    flex-wrap: nowrap;
    //&:nth-child(10n+10){
    //  .cell{
    //    border-bottom: 1px solid black;
    //  }
    //}
    .cell{
      width: 1rem;
      height: 1rem;
      margin: 2px;
      border: 1px solid black;
      //border-bottom: none;
      //border-right: none;
      &.color-cell{
        border-color: red;
      }
      //&:nth-child(10n+10){
      //  border-right: 1px solid black;
      //}
    }
  }

}

</style>

