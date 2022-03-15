<template>
  <el-dialog
    title="选择对标城市"
    :visible="dialogVisible"
    width="800px"
    @close="handleClose"
    @open="handleOpen"
  >
    <div class="body">
      <div class="tags-area">
        <el-tag
          v-for="(tag, index) in cascadeValue"
          :key="index"
          :closable="true"
          @close="removeCity(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>
      <div class="cascader-area">
        <el-input v-model="searchValue"
            placeholder="请输入搜索内容" />
        <cascade
          ref="cascade"
          class="cascade"
          v-model="cascadeValue"
          :multi="true"
          :dataList="filterData"
          trigger="hover"
          :strictly="false"
          :titles="['省/市', '市/区', '县']"
          :height="300"
          :max-count="10"
          :showAllCheck="false"
        />
      </div>
    </div>
    <span slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleCommit">智能生成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Cascade from '../../components/data/regionCascade/Cascade.vue';
import { getRegionTree } from "@/request/Api";
import { deepClone } from '../../utils/util';
export default {
  components: { Cascade },
  model: {
    prop: "dialogVisible",
    event: "change",
  },
  props: {
    cityList: {
      type: Array,
      default: () => [],
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchValue: "",
      cascadeValue: [],
      dataList: [],
      defaultProps: {
        expandTrigger: "hover",
        multiple: true,
        checkStrictly: false,
        emitPath: false,
        value: "label",
      },
    };
  },
  computed: {
    filterData() {
      let key = this.searchValue;
      let filterData = [];
      if (key) {
        let list = deepClone(this.dataList);
        const filterMethod = function (obj) {
          return obj.label.includes(key);
        };
        filterData = this.initFilterList(list, filterMethod);
      } else {
        filterData = deepClone(this.dataList);
      }
      return filterData;
    },
  },
  async mounted() {
    let list = await this.regionInit();
    this.dataList = list.map((item) => {
      return {
        ...item,
        disabled: true,
      };
    });
  },
  methods: {
    removeCity(tag) {
      this.cascadeValue = this.cascadeValue.filter((item) => item != tag);
    },
    handleOpen() {
      //   this.$nextTick(() => {
      //     this.$refs.cascade.handleExpand();
      //   });
    },
    async regionInit() {
      let { data } = await getRegionTree();
      let result = [];
      if (data.code === 200) {
        result = data.data;
      }
      return result;
    },
    initFilterList(list, func) {
      return list.filter((node) => {
        node.children = func(node)
          ? node.children
          : node.children && this.initFilterList(node.children, func);
        return func(node) || (node.children && node.children.length);
      });
    },
    handleClose() {
      this.$emit("change", false);
    },
    handleCommit() {
      this.$emit('handleCommit',this.cascadeValue)
    },
  },
};
</script>

<style lang="scss" scoped>
.body{
  padding: 0 80px;
}
.tags-area{
    margin-bottom: 10px;
    padding: 10px;
    min-height: 60px;
    &>*{
        margin: 5px;
    }
}
.cascader-area{
    &>div{
        margin-bottom: 10px;
    }
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
/deep/.el-dialog__header {
    border-bottom: 1px solid #e4e4e4;
  }

</style>
