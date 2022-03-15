<template>
  <div style="text-align:center">
    <div class="collapse-options" :style="state ? 'height:auto' : 'height:0px'">
      <slot></slot>
    </div>
    <el-button  @click="handleOpen" type="text">
        {{ stateText }}
        <i :style="state?'transform:rotate(-90deg)':'transform:rotate(90deg)'" class="el-icon-d-arrow-right el-icon--right"></i>
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: false,
    };
  },
  computed: {
    stateText() {
      return this.state ? "收起" : "展开";
    },
  },
  methods: {
    handleOpen() {
      this.state = !this.state;
    },
  },
};
</script>

<style lang="scss" scoped>
.collapse-options{
    overflow: hidden;
    transition: all ease 0.3s;
}


</style>
