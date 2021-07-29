<template>
  <div>
    <input placeholder="输入在线图片路径" v-model="imageUrl"/>
    <button @click="selectFile">或选择本地文件</button>
    <button @click="handleCommit">确定</button>
  </div>
</template>

<script>
export default {
  name: "imageUpload",
  data(){
    return {
      imageUrl
    }
  },
  mounted() {
  },
  methods:{
    selectFile(){

    },
    handleCommit(){

    }
  }
}
</script>

<style scoped>

</style>
