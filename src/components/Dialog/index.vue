<template>
  <div class="dialog" v-show="visible" >
    <div v-if="type === 'string'" class="content">
      <pre>
        {{content}}
      </pre>
    </div>
    <div v-else-if="type === 'dom'" class="content" v-html="content">
    </div>
    <div class="close" @click="close">X</div>
  </div>
</template>

<script>
export default {
  name: "index",
  model:{
    prop:'visible',
    event:'change'
  },
  props:{
    visible:{
      type:Boolean,
      default:false
    },
    content:{
      type:[String,Object],
    },
    type:{
      type:String,
      default:'string'
    }
  },
  methods:{
    close(){
      this.$emit('change',false)
    }
  }
}
</script>

<style scoped>
.dialog{
  position: absolute;
  width: 80vw;
  height: 80vh;
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid black;
}
.close{
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
.content{
  height: 100%;
  overflow: scroll;
}

</style>
