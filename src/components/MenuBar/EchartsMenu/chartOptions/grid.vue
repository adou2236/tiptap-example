<template>
  <el-collapse-item title="边距配置" name="s-3">
    <el-form-item label="上边距">
      <el-radio-group v-model="topType">
        <el-radio-button label="1" value="1">绝对值</el-radio-button>
        <el-radio-button label="2" value="2">百分比</el-radio-button>
      </el-radio-group>
      <el-slider v-if="topType == 2" v-model="top" @change="handleChangePosition(top, 'top')"></el-slider>
      <el-input-number v-model="top" controls-position="right" @change="handleChangePosition(top, 'top')" :min="0" :max="topType == 1 ? 1000 : 100"></el-input-number>
    </el-form-item>
    <el-form-item label="右边距">
      <el-radio-group v-model="rightType">
        <el-radio-button label="1" value="1">绝对值</el-radio-button>
        <el-radio-button label="2" value="2">百分比</el-radio-button>
      </el-radio-group>
      <el-slider v-if="rightType == 2" v-model="right" @change="handleChangePosition(right, 'right')"></el-slider>
      <el-input-number v-model="right" controls-position="right" @change="handleChangePosition(right, 'right')" :min="0" :max="rightType == 1 ? 1000 : 100"></el-input-number>
    </el-form-item>
    <el-form-item label="下边距">
      <el-radio-group v-model="bottomType">
        <el-radio-button label="1" value="1">绝对值</el-radio-button>
        <el-radio-button label="2" value="2">百分比</el-radio-button>
      </el-radio-group>
      <el-slider v-if="bottomType == 2" v-model="bottom" @change="handleChangePosition(bottom, 'bottom')"></el-slider>
      <el-input-number v-model="bottom" controls-position="right" @change="handleChangePosition(bottom, 'bottom')" :min="0" :max="bottomType == 1 ? 1000 : 100"></el-input-number>
    </el-form-item>
    <el-form-item label="左边距">
      <el-radio-group v-model="leftType">
        <el-radio-button label="1" value="1">绝对值</el-radio-button>
        <el-radio-button label="2" value="2">百分比</el-radio-button>
      </el-radio-group>
      <el-slider v-if="leftType == 2" v-model="left" @change="handleChangePosition(left, 'left')"></el-slider>
      <el-input-number v-model="left" controls-position="right" @change="handleChangePosition(left, 'left')" :min="0" :max="leftType == 1 ? 1000 : 100"></el-input-number>
    </el-form-item>
  </el-collapse-item>
</template>
<script>
export default {
  props:{
    grid: Object
  },
  data() {
    return {
      top:this.grid.top,
      bottom:this.grid.top,
      left:this.grid.left,
      right:this.grid.right,
      topType: '1',
      leftType: '1',
      rightType: '1',
      bottomType: '1',
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
