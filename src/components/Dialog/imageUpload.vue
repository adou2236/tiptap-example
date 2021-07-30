<template>
  <div>
    <input placeholder="输入在线图片路径" v-model="imageUrl"/><br/>
    或者<br/>
    <input @change="selectFile" type="file"
           id="file-input"
           name="fileContent"
           accept=".png,.jpg"
    />
    <br/>
    <img width="120px" alt="图片" v-if="imageUrl" :src="imageUrl"/>
    <br/>
    <button @click="handleCommit">确定</button>
  </div>
</template>

<script>
export default {
  name: "imageUpload",
  data(){
    return {
      imageUrl:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  mounted() {
  },
  methods:{
    selectFile(e){
      let file = e.target.files[0]
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = (result) => {
        this.imageUrl = result.target.result
      }
    },
    handleCommit(){
      this.$emit('imageCommit',this.imageUrl)

    }
  }
}
</script>

<style scoped>

</style>
