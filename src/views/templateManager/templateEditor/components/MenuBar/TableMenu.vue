<template>
  <div class="bubble-menu">
    <div>
       <el-button size="small" @click="editor.chain().focus().addRowBefore().run()" :disabled="!editor.can().addRowBefore()">
        在上方插入行
      </el-button>
      <el-button size="small" @click="editor.chain().focus().addRowAfter().run()" :disabled="!editor.can().addRowAfter()">
        在下方插入行
      </el-button>
      <el-button size="small" @click="editor.chain().focus().deleteRow().run()" :disabled="!editor.can().deleteRow()">
        删除当前行
      </el-button>
    </div>
    <div>
      <el-button size="small" @click="editor.chain().focus().addColumnBefore().run()" :disabled="!editor.can().addColumnBefore()">
        在左侧插入列
      </el-button>
      <el-button size="small" @click="editor.chain().focus().addColumnAfter().run()" :disabled="!editor.can().addColumnAfter()">
        在右侧插入列
      </el-button>
      <el-button size="small" @click="editor.chain().focus().deleteColumn().run()" :disabled="!editor.can().deleteColumn()">
        删除当前列
      </el-button>
    </div>
    <div>
      <el-button size="small" @click="editor.chain().focus().mergeCells().run()" :disabled="!editor.can().mergeCells()">
        合并单元格
      </el-button>
      <el-button size="small" @click="editor.chain().focus().splitCell().run()" :disabled="!editor.can().splitCell()">
        拆分单元格
      </el-button>
    </div>
    <div style="justify-content:flex-start">
      <color-picker  v-model="cellColor"></color-picker>
      <span style="margin-left:10px">背景色</span>
    </div>
  </div>
</template>

<script>
import colorPicker from '../color-picker.vue';
export default {
  components: { colorPicker },
  name: "TableMenu",
  props:{
    editor:{
      type:Object
    },
    attrs: {
      type: Object
    }
  },
  data(){
    return{
      saveLoading:false,
    }
  },
  mounted(){
  },
  computed:{
    cellColor:{
      get(){
        return this.editor.getAttributes('tableCell').backgroundColor
      },
      set(v){
        this.editor.chain().focus().setCellAttribute('backgroundColor', v).run()
      }
    }

  },
  methods:{
    saveAsTemplate() {
        this.$prompt("请输入模板描述", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            inputValidator: (v) => {
                let reg = /[`~!?@#$%^&*【】{}（）\[\]<>《》？！，。/；“”‘’,.;"'+-]/.test(v)
                if (reg) {
                    return false
                }
                if (v.length > 20) {
                    return false
                }
                return !!v && v.trim().length > 0
            }
        }).then(async ({ value }) => {
            this.saveLoading = true
            let data = {
                name: value,
                type: 2,
                doc: {

                }
            }
        })
    },
    handleClick2(e){
      this.stopBubble(e)
      this.editor.chain().focus().mergeCells().run()
    },
    handleClick(e){
      event.stopPropagation()
      this.editor.chain().focus().mergeCells().run()
    },
    handleChange(v){
      console.log(v)
    },
    stopBubble(e) {
      if (e && e.preventDefault && e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault()
      } else { //<=ie8
        window.event.cancelBubble = true;
        window.event.returnValue = false;
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.bubble-menu>div{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  &:first-child{
    button{
      border-color: #F47171;
      color: #F47171;
    }
    button:hover{
      color:#FFF;
      background: #F47171;
    }
  }
  &:nth-child(2){
     button{
      border-color: #F79646;
      color: #F79646;
    }
    button:hover{
      color:#FFF;
      background: #F79646;
    }
  }
  &:nth-child(3){
     button{
      border-color: #1362B0;
      color: #1362B0;
    }
    button:hover{
      color:#FFF;
      background: #1362B0;
    }
  }
  button{
    width: 100px;
    margin:  0 0 15px;
    &[disabled]{
      background: #FFF !important;
      color: #B5B5B5 !important;
      border-color: #B5B5B5 !important;
    }
  }
}

</style>
