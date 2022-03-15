<template>
<el-form @submit.native.prevent size="mini">
  <el-form-item label="图例显隐">
    <el-switch v-model="legend.show"></el-switch>
  </el-form-item>
</el-form>
    <!-- <el-form-item label="图例类型">
      <el-select v-model="innerLegend.icon" :disabled="!innerLegend.show">
        <el-option v-for="(item, index) in legendIcons" :key="index" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标记宽度">
      <el-input-number :disabled="!innerLegend.show" v-model="innerLegend.itemWidth"></el-input-number>
    </el-form-item>
    <el-form-item label="标记高度">
      <el-input-number :disabled="!innerLegend.show" v-model="innerLegend.itemHeight"></el-input-number>
    </el-form-item> -->
</template>
<script>

export default {
  props:{
    legend:Object
  },
  data() {
    return {
    };
  },
};
</script>
