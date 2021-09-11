<template>
  <el-collapse-item title="图形配置" name="3">
    <el-form-item label="圆心位置-水平">
      <el-input v-model="center[0]"></el-input>
    </el-form-item>
    <el-form-item label="圆心位置-垂直">
      <el-input v-model="center[1]"></el-input>
    </el-form-item>
    <el-form-item label="内径">
      <el-input v-model="radius[0]"></el-input>
    </el-form-item>
    <el-form-item label="外径">
      <el-input v-model="radius[1]"></el-input>
    </el-form-item>
  </el-collapse-item>
</template>
<script>
export default {
  props:{
    center: {
      type:Array,
      default:()=>['50%','50%']
    },
    radius: {
      type:Array,
      default:()=>['0%','70%']
    }
  },
  data() {
    return {
    }
  },
  watch: {
    // grid: {
    //   handler(to) {
    //     this.$emit('change', to)
    //   },
    //   immediate: true,
    //    deep: true
    // }
  },
  methods: {
    handleChangePosition(data, type) {
      let key = `${type}Type`
      this.grid[type] = this[key] == 1 ? data : data + '%'
    }
  }
}
</script>
