<template>
  <div v-if="selector">
    <component :is="components" :options="options" :icon="icon" :isActive="isActive" @action="action"/>
  </div>
  <div v-else>
    <button
        class="menu-item"
        :class="{ 'is-active': isActive ? isActive(): null }"
        @click="action"
        :title="title">
      <svg class="remix">
        <use :xlink:href="require('remixicon/fonts/remixicon.symbol.svg') + `#ri-${icon}`" />
      </svg>
    </button>
  </div>

</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    selector: {
      type: Boolean,
      default: false
    },
    components:{
      type:Object
    },
    options:{
      type:[Array,String],
    },
    action: {
      type: Function,
      required: true,
    },

    isActive: {
      type: Function,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 1.75rem;
  height: 1.75rem;
  color: #062B61;
  border: none;
  background-color: transparent;
  border-radius: 0.4rem;
  padding: 0.25rem;
  margin-right: 0.25rem;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  &.is-active,
  &:hover {
    color: #FFF;
    background-color: #062B61;
  }
}
</style>
