<template>
  <div class="multi-type">
    <el-cascader
      v-if="type == 1"
      :placeholder="placeholder"
      v-model="innerRow.extra.nodeId"
      :show-all-levels="false"
      :props="defaultProps"
      :options="indexList">
      <template slot-scope="{ node, data }">
        <span @click="indexSelect(innerRow, data,node)">{{ node.label }}</span>
      </template>
    </el-cascader>
    <!-- <el-date-picker
      v-else-if="type == 2"
      :placeholder="placeholder"
      v-model="innerRow[showingValue]"
      type="year"
      value-format="yyyy"
    >
    </el-date-picker> -->
    <el-input
      v-else-if="type == 2"
      :placeholder="placeholder"
      v-model="innerRow[showingValue]"
    />
    <el-input
        v-model="innerRow[showingValue]"
        :placeholder="placeholder"
        v-else-if="type == 3"/>
    <el-cascader
      v-model="innerRow[showingValue]"
      :placeholder="placeholder"
      v-else-if="type == 4"
      :options="geos"
      :props="{
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'label',
        label: 'label',
        emitPath: false,
      }"
      clearable
    >
    </el-cascader>
    <el-select
      v-else-if="type == 6"
      :placeholder="placeholder"
      v-model="innerRow[showingValue]"
    >
      <el-option label="升序" value="ASC"></el-option>
      <el-option label="降序" value="DESC"></el-option>
    </el-select>
    <el-input
      v-else-if="type == 7"
      :placeholder="placeholder"
      v-model="innerRow[showingValue]"/>
    <el-select
      v-else-if="type == 9"
      :placeholder="placeholder"
      v-model="innerRow[showingValue]">
      <el-option label="第一季度" value="1"></el-option>
      <el-option label="第二季度" value="2"></el-option>
      <el-option label="第三季度" value="3"></el-option>
      <el-option label="第四季度" value="4"></el-option>
    </el-select>
    <el-select
      v-else-if="type == 10"
      :placeholder="placeholder"
      v-model="innerRow[showingValue]"
    >
      <el-option label="年频" value="year"></el-option>
      <el-option label="季频" value="quarter"></el-option>
    </el-select>
    <el-cascader
      v-else-if="type == 11"
      :placeholder="placeholder"
      :value="getTargetAreas(innerRow[showingValue])"
      :options="geos"
      :props="{
        expandTrigger: 'hover',
        checkStrictly: true,
        multiple: true,
        value: 'label',
        label: 'label',
        emitPath: false,
      }"
      clearable
      collapse-tags
      :show-all-levels="false"
      @change="(e) => setTargetAreas(innerRow, e)"
    >
    </el-cascader>
    <el-select
      v-else-if="type == 14"
      :placeholder="placeholder"
      v-model="innerRow[showingValue]">
      <el-option label="东部" value="东部"></el-option>
      <el-option label="西部" value="西部"></el-option>
      <el-option label="东北" value="东北"></el-option>
      <el-option label="中部" value="中部"></el-option>
    </el-select>
    <el-select
      v-else-if="type == 15"
      :placeholder="placeholder"
      v-model="innerRow[showingValue]">
      <el-option label="求和" value="sum"></el-option>
      <el-option label="平均" value="avg"></el-option>
      <el-option label="中位数" value="mid"></el-option>
    </el-select>
    <el-select
      v-else-if="type == 16"
      :placeholder="placeholder"
      v-model="innerRow[showingValue]">
      <el-option label=">" value=">"></el-option>
      <el-option label="<" value="<"></el-option>
      <el-option label="=" value="="></el-option>
      <el-option label=">=" value=">="></el-option>
      <el-option label="<=" value="<="></el-option>
    </el-select>
    <el-input
      v-else
      :placeholder="placeholder"
      v-model="innerRow[showingValue]" />
  </div>
</template>

<script>
import { deepCopy } from "../../unit/baseType";
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    type: {
      type: [String, Number],
      default: "1",
    },
    placeholder:{
        type:String,
        default:''
    },
    //指标
    indexList: {
      type: Array,
      default: () => [],
    },
    //地区
    geos: {
      type: Array,
      default: () => [],
    },
    //绑定值
    value: {
      type: Object,
      default: () => {
        return {
          varValue: "",
          value:"",
          extra: {},
        };
      },
    },
    showingValue:{
      type:String,
      default:'varValue'
    }
  },
  data() {
    return {
      innerRow: deepCopy(this.value),
      defaultProps: {
        expandTrigger: "hover",
        label: "nodeName",
        multiple: false,
        value: "nodeId",
        emitPath: false,
        leaf: "isSelect",
      },
    };
  },
  watch: {
    innerRow: {
      handler(v) {
        this.$emit("change", v);
      },
      deep: true,
    },
  },
  methods: {
    setTargetAreas(row, value) {
      row[this.showingValue] = value.join("、");
    },
    getTargetAreas(value) {
      return [...new Set(value.split("、"))];
    },
    //全量赋值使用到
    indexSelect(row, data, node) {
      if(data.isSelect){
        row.extra = deepCopy(data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.multi-type{
    width: 200px;
    &>div{
        width: 100%;
    }
}
</style>
