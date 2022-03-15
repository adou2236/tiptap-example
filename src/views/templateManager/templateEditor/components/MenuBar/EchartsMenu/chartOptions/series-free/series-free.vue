<template>
  <div>
    <p>指标</p>
    <vue-json-editor
      class="index"
      v-model="innerIndex"
      :showBtns="false"
      :mode="'code'"
      :modes="['code']"
      lang="zh"
      @json-change="(e)=>onJsonChange('chartIndex',e)"
    />
    <p>配置</p>
    <vue-json-editor
      class="options"
      v-model="innerOptions"
      :showBtns="false"
      :mode="'code'"
      :modes="['code']"
      lang="zh"
      @json-change="(e)=>onJsonChange('chartOptions',e)"
    />
  </div>
</template>


<script>
import vueJsonEditor from "vue-json-editor";
import { deepCopy } from "../../../../../unit/baseType";
export default {
  components: { vueJsonEditor },
  props: {
    //指标
    index: Object,
    //配置
    options: Object,
  },
  data(){
    return{
      innerIndex:this.index,
      innerOptions:this.options,
    }
  },
  methods: {
    onJsonChange(type,value) {
      this.$emit('dataChange',type,value)
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
