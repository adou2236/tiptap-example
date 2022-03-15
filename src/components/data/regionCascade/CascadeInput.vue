<template>
  <div class="cascade-input" ref="cascadeInput">
    <!-- <el-input
      v-model="tagValue"
      class="input"
      :placeholder="placeholder"
      multiple
      clearable
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <div slot="empty"></div>
    </el-input> -->
    <div tabindex="0" hidefocus="true"
      class="input"
      ref="customInput"
      :class="[{expand}]"
      @click="handleFocus"
      @blur="handleBlur">
        <el-tag v-for="(tag,index) in tagValue"
        :key="index"
        closable
        @close="handleClose(tag)"
        type="info">
        {{tag}}
      </el-tag>
      <i class="el-icon-d-arrow-left expand-icon" :class="[{expand}]" @click="handleInputExpand"></i>
    </div>
    <div
      ref="dropShow"
      v-show="dropShow"
      class="input-drop-down"
      :style="{ left: dropLeft + 'px', top: dropTop + 'px' }"
      @mouseenter="overDrop = true"
      @mouseleave="overDrop = false"
    >
      <div>
        <div class="search-ipt">
          <el-input
          size='mini'
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            onkeyup="this.value=this.value.replace(/[\d]/g,'')"
            v-model="inputValue"
            @input="handleInput"
          />
          <div
            class="left-inner"
            v-for="(item, index) in specialRegion.china"
            :key="index"
          >
            <el-checkbox
              :disabled="item.disabled"
              class="checkbox"
              v-model="item.selected"
              size="mini"
              @click.native.prevent.stop="specialRegionClick(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </div>
        </div>
        <div class="region-area">
          <div class="left">
            <div
              class="left-inner"
              v-for="(item, index) in ecoRegion"
              :key="index"
            >
              <h3>{{ item.label }}</h3>
              <div v-for="obj in item.children" :key="obj.label">
                <el-checkbox
                  :disabled="obj.disabled"
                  class="checkbox"
                  v-model="ecoRegionSelected[obj.id]"
                  size="mini"
                  @change="collectRegionClick(obj, ecoRegionSelected[obj.id])"
                >
                  {{ obj.label }}
                </el-checkbox>
              </div>
            </div>
          </div>
          <div class="right">
            <Cascade
              ref="cascade"
              v-model="cascadeValue"
              :multi="multi"
              :dataList="filterData"
              :trigger="trigger"
              :strictly="strictly"
              :titles="titles"
              :height="height"
              @expand="handleExpand"
            />
            <el-scrollbar>
              <div class="right-bottom">
                <div
                  v-for="(item, index) in specialRegion.adminRegion"
                  :key="index"
                >
                  <el-checkbox
                    :disabled="item.disabled"
                    class="checkbox"
                    v-model="item.selected"
                    size="mini"
                    @click.native.prevent.stop="specialRegionClick(item)"
                    >{{ item.label }}</el-checkbox
                  >
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="footer">
          <el-button
            @click="handleCancel"
            size="small"
            class="cancel"
            type="info"
            >清空</el-button
          >
          <el-button
            @click="handleConfirm"
            size="small"
            clas="confirm"
            type="primary"
            >确认</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cascade from "./Cascade";
import CascadeSearch from "./CascadeSearch";
import { economic, geography, china ,citys } from "../../../assets/js/region";
import { debounce, deepClone } from "../../../utils/util";
export default {
  name: "CascadeInput",
  components: { CascadeSearch, Cascade },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    titles: {
      type: Array,
      default: () => [],
    },
    trigger: {
      type: String,
      default: () => "click",
      validator: (value) => ["click", "hover"].includes(value),
    },
    multi: {
      type: Boolean,
    },
    placeholder: {
      type: String,
      default: () => "请选择",
    },
    strictly: {
      type: Boolean,
      default: () => true,
    },
    filterable: {
      type: Boolean,
      default: () => false,
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      inputValue: "",
      searchValue: "",
      expand:false,
      dropShow: false,
      overDrop: false,
      dropLeft: 0,
      dropTop: 0,
      dropLeftOrigin: 0,
      height: 0,
      searchWidth: 0,
      leftScroll:null,
      ecoRegion: [
        {
          id: "economic",
          label: "经济圈",
          children: economic,
        },
        {
          id: "geography",
          label: "地理区域",
          children: geography,
        },
        {
          id: "city",
          label: "城市",
          children: citys,
        },
      ],
      ecoRegionSelected:{}
    };
  },
  mounted() {
    window.addEventListener("resize", this.getHeight);
    this.leftScroll = document.querySelector('.data-metric-advance-wrapper').querySelector('.el-scrollbar__wrap')
    this.leftScroll.addEventListener('scroll',this.computedDropOffset)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getHeight);
    this.leftScroll.removeEventListener('scroll',this.computedDropOffset)
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
        filterData = this.dataList;
      }
      return filterData;
    },
    specialRegion() {
      return {
        china: [
          { id: "china", label: "中国", selected: this.value.includes("中国") },
        ],
        adminRegion: [
          {
            id: "hk",
            label: "香港特别行政区",
            selected: this.value.includes("香港特别行政区"),
          },
          {
            id: "am",
            label: "澳门特别行政区",
            selected: this.value.includes("澳门特别行政区"),
          },
          { id: "tw", label: "中国台湾", selected: this.value.includes("中国台湾") },
        ],
      };
    },
    ecoValue: function () {
      return function (obj) {
        return obj.province.every((item) => this.value.includes(item));
      };
    },
    tagValue: {
      get() {
        return this.value;
      },
      set(v) {
        let temp = this.value.filter((item) => v.includes(item));
        for (let key in this.specialRegion) {
          this.specialRegion[key].forEach((item) => {
            if (temp.every((obj) => obj !== item.label)) {
              item.selected = false;
            }
          });
        }
        this.$emit("change", temp);
      },
    },
    cascadeValue: {
      get() {
        return this.value;
      },
      set(val) {
        let alleconomic = []
        this.ecoRegion.forEach(item=>{
          alleconomic = alleconomic.concat(item.children)
        })
        alleconomic.forEach(item=>{
          if(item.province.every(v=>val.includes(v))){
            this.ecoRegionSelected[item.id] = true
          }else{
            this.ecoRegionSelected[item.id] = false
          }
        })
        this.$emit("change", val);
      },
    },
  },
  watch: {
    dropShow(val) {
      if (val) {
        setTimeout(() => {
          document.addEventListener("click", this.handleDocumentClick);
        }, 200);
        this.$nextTick(() => {
          this.computedDropOffset();
          this.getHeight();
        });
      } else {
        document.removeEventListener("click", this.handleDocumentClick);
      }
    },
  },
  methods: {
    handleInputExpand(){
      event.preventDefault()
      event.stopPropagation()
      this.expand = !this.expand
      this.$nextTick(()=>{
        this.computedDropOffset()
      })
    },
    handleClose(tag){
      event.preventDefault()
      event.stopPropagation()
      this.tagValue = this.tagValue.filter(item=>item!==tag)
    },
    handleCancel() {
      this.tagValue = [];
      for(let key in this.ecoRegionSelected){
        this.ecoRegionSelected[key] = false
      }
      this.dropShow = false;
    },
    handleConfirm() {
      this.dropShow = false;
    },
    handleInput: debounce(function (v) {
      this.searchValue = v.trim();
    }),
    initFilterList(list, func) {
      return list.filter((node) => {
        node.children = func(node)
          ? node.children
          : node.children && this.initFilterList(node.children, func);
        return func(node) || (node.children && node.children.length);
      });
    },
    collectRegionClick(obj, isSelected) {
      isSelected = !isSelected;
      let totalValue = [];
      if (isSelected) {
        let targetLabel = obj.province;
        totalValue = this.value.filter((item) => !targetLabel.includes(item));
      } else {
        let targetObj = obj.province;
        totalValue = [...new Set([...this.value, ...targetObj])];
      }
      this.$emit("change", totalValue);
    },
    specialRegionClick(e) {
      let totalValue = [];
      e.selected = !e.selected;
      if (e.selected) {
        totalValue = [...this.value, e.label];
      } else {
        totalValue = this.value.filter((item) => item !== e.label);
      }
      let alleconomic = []
      this.ecoRegion.forEach(item=>{
        alleconomic = alleconomic.concat(item.children)
      })
      alleconomic.forEach(item=>{
        if(item.province.every(v=>totalValue.includes(v))){
          this.ecoRegionSelected[item.id] = true
        }else{
          this.ecoRegionSelected[item.id] = false
        }
      })
      this.$emit("change", totalValue);
    },
    getHeight() {
      const winHeight = (document.documentElement || document.body)
        .clientHeight;
      let el = this.$refs.cascadeInput,
        top = 0;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      this.height = 280;
      this.searchWidth = this.$refs.cascadeInput.offsetWidth;
    },
    updateSearchList(nodes) {
      if (this.filterable) {
        this.initSearchList(nodes);
      }
    },
    initSearchList(list) {
      list.forEach((item) => {
        this.searchList.push(item);
        if (item.children) {
          this.initSearchList(item.children);
        }
      });
    },
    handleFocus() {
      this.dropShow = true;
    },
    handleBlur() {
      if (!this.overDrop) {
        this.inputValue = "";
        this.searchValue = "";
        this.dropShow = false;
      }
    },
    computedDropOffset() {
      let el = this.$refs.cascadeInput,
        left = 0,
        top = 0;
      while (el) {
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.offsetParent;
      }

      let leftScroll = document.querySelector('.data-metric-advance-wrapper').querySelector('.el-scrollbar__wrap')
      top-=leftScroll.scrollTop
      const winWidth = (document.documentElement || document.body).clientWidth;
      const cascadeWith = this.$refs.cascade.$el.offsetWidth;
      if (cascadeWith + this.dropLeftOrigin > winWidth) {
        const overflow = this.dropLeftOrigin + cascadeWith - winWidth;
        this.dropLeft = this.dropLeftOrigin - overflow;
      } else {
        this.dropLeft = left;
        this.dropLeftOrigin = left;
      }
      let inputHeight = this.$refs.customInput.offsetHeight
      this.dropTop = top + inputHeight;
    },
    handleDocumentClick(e) {
      let el = e.target,
        show = false;
      while (el) {
        if (el === this.$refs.cascadeInput) {
          show = true;
          break;
        } else {
          el = el.parentNode;
        }
      }
      this.dropShow = show;
    },
    handleExpand(node) {
      const winWidth = (document.documentElement || document.body).clientWidth;
      const cascadeWith = this.$refs.cascade.$el.offsetWidth;
      if (cascadeWith + this.dropLeftOrigin > winWidth) {
        const overflow = this.dropLeftOrigin + cascadeWith - winWidth;
        this.dropLeft = this.dropLeftOrigin - overflow;
      } else {
        this.dropLeft = this.dropLeftOrigin;
      }
      this.$emit("expand", node);
    },
  },
};
</script>

<style lang="scss" scoped>
.cascade-input {
  position: relative;
  .input {
    width: 100%;
    height: 30px;
    overflow: hidden ;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    color: #606266;
    outline: 0;
    padding: 0 40px 0 20px;
    z-index: 888;
    .el-tag{
      margin: 2px;
      height:24px;
      line-height:24px;
    }
    .expand-icon{
      position: absolute;
      z-index: 999;
      cursor: pointer;
      right: 10px ;
      top: 50%;
      width: 14px;
      height: 14px;
      margin: auto;
      transform: rotate(-90deg) translateY(-50%);
      transform-origin: top center;
      transition: all 0.3s ease;
      &.expand{
        transform: rotate(90deg) translateY(-50%)
      }
    }
    &.expand{
      min-height: 40px;
      height:auto;
    }
    &:hover{
      border-color: #C0C4CC;
    }
    &:focus{
      border-color: #1890ff;
    }
  }
  .input-drop-down {
    background: #fff;
    position: fixed;
    z-index: 999;
    border-radius: 8px;
    border: 1px solid #ececec;
    box-shadow: 0 7px 26px 1px rgba(183, 183, 183, 0.5);
    .search-ipt {
      height: 110px;
      border-bottom: 1px solid #ececec;
      padding: 20px;
      text-align: left;
      .el-checkbox {
        margin-top: 18px;
        padding: 0 28px;
      }


    }
    .region-area {
      display: flex;
      .left {
        width: 220px;
        border-right: 1px solid #ececec;
        padding: 25px 0px;
        text-align: left;
        .left-inner {
          h3 {
            font-size: 16px;
            padding-left: 25px;
            &:first-child {
              margin-top: 0;
            }
          }

          & > div {
            display: flex;
            position: relative;
            padding: 10px 10px 10px 25px;
            font-size: 13px;
            cursor: pointer;
            &:hover{
              background:#F5F7FD;
            }
          }
          .checkbox {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 8px;
          }
        }
      }
      .right {
        .right-bottom {
          height: 140px;
          border-top: 1px solid #ececec;
          display: flex;
          flex-direction: column;
          align-content: flex-start;
          text-align: left;
          & > div {
            display: flex;
            position: relative;
            padding: 10px 10px 10px 25px;
            font-size: 13px;
            cursor: pointer;
          }
          .checkbox {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 8px;
          }
        }
      }
    }
    .footer {
      height: 65px;
      border-top: 1px solid #ececec;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 40px;
      button {
        width: 110px;
      }
      .cancel {
        border: none;
        background: #e9e9e9;
        color: #929191;
      }
    }
  }
}
</style>
