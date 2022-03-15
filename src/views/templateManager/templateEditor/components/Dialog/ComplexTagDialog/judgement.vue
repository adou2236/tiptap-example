<template>
  <div class="judgement">
    <el-button style="margin-left:20px" size="mini" type="primary" plain  @click="addSituation">+添加情形</el-button>
    <el-scrollbar style="height:80%">
      <judgement-item
        style="padding:0 20px 20px"
        v-for="(item, index) in cases"
        v-model="cases[index]"
        :ref="`item${index}`"
        :key="index"
        :index="index"
        @itemRemove="itemRemove"
        @itemBeFocus="handleFocus"
      ></judgement-item>
      <div style="padding:0 20px">
        默认情况：
        <inline-editor
          :value="defaultCase.coverText"
          @focus="handleFocus"
          @update="handleUpdate"
        >
        </inline-editor>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import InlineEditor from '../../inlineEditor.vue';
import judgementItem from "./judgementItem.vue";
export default {
  components: { judgementItem, InlineEditor:()=>import('../../inlineEditor.vue') },
  model:{
    prop:'defaultValue',
    event:'change'
  },
  props:{
    defaultValue:{
      type:Array,
      default:()=>[]
    }
  },
  data() {
    return {
      cases: [],
      defaultCase: {
        type:'default',
        coverText:[]
      },
      activeIndex:0,
      activeEditor:null
    };
  },
  watch:{
    situations:{
      handler(v){
        this.$emit('change',v)
      },
      deep:true
    }
  },
  computed:{
    situations(){
      return[
        ...this.cases,
        this.defaultCase,
      ]
    }
  },
  mounted(){
    if(this.defaultValue){
      this.cases = this.defaultValue.filter(item=>item.type ==='case')
      this.defaultCase = this.defaultValue.filter(item=>item.type ==='default')[0]
    }
  },
  methods: {
    tagInsert(tag) {
      //TODO对选中的情形赋值
      // this.$refs[`item${this.activeIndex}`][0].editor.chain().focus().insertContent(tag).run();
      this.activeEditor.chain().focus().insertContent(tag).run();
    },
    handleFocus(e){
      this.activeEditor = e
    },
    itemBeFocus(index){
      this.activeIndex = index
    },
    itemRemove(index) {
      this.cases.splice(index, 1);
    },
    handleUpdate(data){
      this.defaultCase.coverText = data
    },
    addSituation() {
      let ca = {
        type: "case",
        formula: [], //公式
        symbol: "==", //判断符号
        standValue: "", //比较结果
        coverText: [],
      };
      this.cases.push(ca);
    },
  },
};
</script>

<style lang="scss" scoped>
.judgement {
  padding: 10px;
  height: 100%;
}
</style>
