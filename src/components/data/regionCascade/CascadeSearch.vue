<template>
  <div class="cascade-search">
    <el-scrollbar class="scroll-container" :style="{height: height + 'px'}">
      <div
        class="list-item"
        :style="{width: width + 'px'}"
        :class="{selected: item.selected}"
        v-for="(item, index) in list"
        :key="index"
        @click="handleSelect(item)"
      >
        <span>{{item.label}}</span>
        <i class="icon el-icon-check" v-show="item.selected"></i>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "CascadeSearch",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
  methods: {
    handleSelect(item) {
      item.selected = !item.selected;
      this.$emit('select', item);
    }
  },
}
</script>

<style lang="scss" scoped>
  .cascade-search {
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      cursor: pointer;
      font-size: 13px;
      &:hover {
      }
      &.selected {
      }
    }
  }
</style>
