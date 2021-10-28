<template>
  <el-form>
<!--    <el-form-item label="圆心位置-水平">-->
<!--      <el-input v-model="innerAdditions.center[0]"></el-input>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="圆心位置-垂直">-->
<!--      <el-input v-model="innerAdditions.center[1]"></el-input>-->
<!--    </el-form-item>-->
    <el-form-item label="内径">
      <el-input v-model="innerAdditions.radius[0]"></el-input>
    </el-form-item>
    <el-form-item label="外径">
      <el-input v-model="innerAdditions.radius[1]"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import {deepCopy} from "../../../../../unit/baseType";

export default {
  props:{
    additions:Object
  },
  data() {
    return {
      innerAdditions:deepCopy(this.additions)
    }
  },
  watch: {
    innerAdditions: {
      handler(to) {
        this.$emit("additionChange", to);
      },
      deep: true,
      immediate: false
    }
  },
  mounted(){
  },
  methods: {
    handleChangePosition(data, type) {
      let key = `${type}Type`
      this.grid[type] = this[key] == 1 ? data : data + '%'
    }
  }
}
</script>
