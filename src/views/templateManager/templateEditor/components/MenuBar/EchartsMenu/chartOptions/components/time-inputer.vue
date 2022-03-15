<template>
  <div class="time-inputer">
    <el-select placeholder="选择时间"
    :disabled="disabled"
    style="width:calc(80% - 80px)"
    v-model="selectedVar"
    @change="varChange"
    value-key="varKey">
      <el-option v-for="(item, index) in options" :key="index" :value="item" :label="item.varKey"></el-option>
    </el-select>
    <!--
        :disabled="!selectedTag"
       -->
    <el-input-number
      v-model="pass"
      :disabled="disabled"
      @change="passChange"
      controls-position="right"
      :min="0"
      size="mini"
      style="width:80px;margin: 0 10px"
    />{{ updateFrequency }}前
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getVarsById } from '@/request/templateApi'
import { deepCopy } from '../../../../../unit/baseType';
export default {
  model:{
    prop:'value',
    event:'change'
  },
  props:{
    value:{
      type:Object
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      options: [],
      selectedVar:{},
      pass:0
    };
  },
  async created(){
    this.options = await this.getAllVar()
    if(this.value){
      this.selectedVar = deepCopy(this.value)
      this.pass = this.value?.pass * -1 || 0
    }
  },
  watch:{
    // combinVar:{
    //   handler(v){
    //     if(this.value){
    //       debounce(this.$emit('change',[v]),500)
    //     }
    //   },
    //   immediate:false,
    //   deep:true
    // }
    value:{
      handler(newVal,oldVal){
        if(newVal){
          this.selectedVar = deepCopy(newVal)
          this.pass = newVal?.pass * -1 || 0
        }
      },
      immediate:false,
      deep:true
    }
  },
  computed: {
    ...mapState({
      baseData: (state) => state.templateStore.baseData,
      rootId: (state) => state.templateStore.rootId,
    }),
    updateFrequency() {
      return this.baseData.type == 5 ? "季" : "年";
    },
    // combinVar(){
    //   return {
    //     ...this.selectedVar,
    //     pass:this.pass * -1,
    //   }
    // }
  },
  methods:{
    varChange(v){
      this.$emit('change',{
        ...v,
        pass:this.pass * -1
      })
    },
    passChange(v){
      this.$emit('change',{
        ...this.selectedVar,
        pass:v * -1
      })
    },
    async getAllVar(){
      let list = []
      let {data} = await getVarsById(this.rootId)
      list = data.data.data.filter(item=>{return item.keyType == 2})
      return list
    },
  }
};
</script>

<style scoped>
.time-inputer {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
}
</style>
