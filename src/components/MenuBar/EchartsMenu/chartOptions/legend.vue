<template>
  <el-collapse-item title="图例配置" name="s-2">
    <el-form-item label="图例显隐">
      <el-switch v-model="innerLegend.show"></el-switch>
    </el-form-item>
    <el-form-item label="图例类型">
      <el-select v-model="innerLegend.icon" :disabled="!innerLegend.show">
        <el-option v-for="(item, index) in legendIcons" :key="index" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标记宽度">
      <el-input-number :disabled="!innerLegend.show" v-model="innerLegend.itemWidth"></el-input-number>
    </el-form-item>
    <el-form-item label="标记高度">
      <el-input-number :disabled="!innerLegend.show" v-model="innerLegend.itemHeight"></el-input-number>
    </el-form-item>
  </el-collapse-item>
</template>
<script>
import {deepCopy} from "../../../../unit/baseType";

export default {
  props:{
    legend:Object
  },
  data() {
    return {
      legendIcons: ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'],
      innerLegend:deepCopy(this.legend)
    };
  },
  watch: {
    innerLegend: {
      handler(to) {
        this.$emit("change", to);
      },
      deep: true,
      immediate: false
    }
  }
};
</script>
