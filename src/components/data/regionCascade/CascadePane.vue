<template>
  <div class="cascade-pane">
    <div class="header" v-if="title">
      <span>{{ title }}</span>
      <el-checkbox v-show="showAllCheck" class="level-select" v-model="isAllCheck">全选</el-checkbox>
    </div>
    <el-scrollbar class="scroll-container" :style="{ height: height + 'px' }">
      <div class="cascade-content">
        <div
          class="cascade-item"
          v-for="item in nodes"
          :key="item.id"
          :class="{
            selected: item.selected,
            active: expand.id === item.id,
            multi,
            disabled: item.disabled,
          }"
          @click="handleClick(item)"
          @mouseenter="handleMouseEnter(item)"
        >
          <div class="item-content">
            <div class="left">
              <el-checkbox
                :disabled="item.disabled"
                class="checkbox"
                v-if="multi"
                v-model="item.selected"
                size="mini"
                @click.native.prevent.stop="handleCheckboxClick(item)"
              ></el-checkbox>
              <i
                class="icon el-icon-check"
                v-else-if="!item.children && item.selected"
              ></i>
              <span class="text">{{ item.label }}{{item.sa}}</span>
            </div>
            <i class="icon el-icon-arrow-right" v-if="item.children"></i>
          </div>
        </div>
      </div>
      <div class="extra">
        <slot name="extra"></slot>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { deepClone } from "../../../utils/util";
export default {
  name: "CascadePane",
  props: {
    value: {
      type: Array,
    },
    nodes: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
    },
    trigger: {
      type: String,
      default: () => "click",
      validator: (value) => ["click", "hover"].includes(value),
    },
    multi: {
      type: Boolean,
    },
    strictly: {
      type: Boolean,
    },
    height: {
      type: Number,
      default: () => 300,
    },
    maxCount:{
      type:Number,
      default:NaN
    },
    showAllCheck: {
      type: Boolean,
      default:true
    }
  },
  data() {
    return {
      expand: {},
    };
  },
  computed: {
    isAllCheck: {
      get() {
        return this.nodes.every((item) => item.selected);
      },
      set(val) {
        let set = deepClone(this.value);
        if (val) {
          for (let i = 0; i < this.nodes.length; i++) {
            if (set.every((item) => item !== this.nodes[i].label)) {
              set.push(this.nodes[i].label);;
            }
          }
        } else {
          for (let i = 0; i < this.nodes.length; i++) {
            let index = set.findIndex(item=>{
              return item === this.nodes[i].label
            })
            set.splice(index,1)
          }
        }
        this.$emit("change", set);
      },
    },
  },
  methods: {
    handleClick(item) {
      if (this.trigger === "click") {
        this.handleTrigger(item);
      } else if (this.multi) {
        this.handleCheckboxClick(item);
      }
      if (
        !item.children &&
        !this.multi &&
        !item.disabled &&
        !item.selected &&
        strictly
      ) {
        //父子关联
        this.nodes.forEach((n) => (n.selected = false));
        item.selected = true;
        this.$emit("change", item);
      }
    },
    handleMouseEnter(item) {
      if (this.trigger === "hover") {
        this.handleTrigger(item);
      }
    },
    handleTrigger(item) {
      this.expand = item;
      this.$emit("expand", item);
    },
    handleCheckboxClick(item) {
      if (item.disabled) return;
      if(!item.selected&&this.maxCount>0&&this.value.length>=this.maxCount){
        this.$message("超出最大选择数量")
        return
      }
      item.selected = !item.selected;
      let ret = [];
      if (item.selected) {
        // item.children && this.selectChildrenAll(item.children, true);
        ret = [...this.value, item.label];
      } else {
        // item.children && this.selectChildrenAll(item.children, false);
        ret = this.value.filter((v) => v !== item.label);
      }
      this.$emit("change", ret);
    },
    selectChildrenAll(list, bool) {
      list.forEach((item) => {
        item.disabled = bool;
        if (item.children) {
          this.selectChildrenAll(item.children, bool);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cascade-pane {
  min-width: 180px;
  .header {
    position: relative;
    height: 40px;
    padding: 0 25px;
    line-height: 40px;
    text-align: center;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFF;
  }
  .scroll-container {
    .cascade-content {
      .cascade-item {
        position: relative;
        padding: 10px 10px 10px 25px;
        font-size: 13px;
        cursor: pointer;
        &:hover{
          background: #F5F7FD ;
        }
        .item-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left {
            display: flex;
            align-items: baseline;
            .checkbox {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 8px;
            }
            .icon {
              position: absolute;
              left: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.cascade-pane {
  .el-checkbox__inner {
    width: 10px;
    height: 10px;
    background: transparent;
    border: 1px solid #73798a;
    border-radius: 0;
    &::after {
      width: 2px;
      height: 5px;
      top: 0;
      left: 2px;
    }
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background: rgba(115, 121, 138, 0.5);
    border-color: rgba(115, 121, 138, 0.5);
    &::after {
      content: "";
      transform: rotate(45deg) scaleY(1);
      width: 2px;
      height: 5px;
      position: absolute;
      top: 0;
      left: 2px;
      box-sizing: content-box;
      border: 1px solid rgba(39, 49, 69, 0.5);
      border-left: 0;
      border-top: 0;
    }
  }
}
</style>
