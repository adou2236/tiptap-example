<template>
  <el-dialog 
    :visible="visible" 
    @close="handleClose">
    <div class="uploader" v-loading="loading">
      <input @change="selectFile" 
            type="file"
           id="file-input"
           name="fileContent"
           accept=".png,.jpg"/>
      <img width="250px" alt="图片" v-if="imageUrl" :src="imageUrl"/>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取消</el-button>
        <el-button type="primary" size="mini" @click="handleCommit">确定</el-button>
    </span>
  </el-dialog>  
</template>

<script>
import * as ImgCompress from '@/utils/compress.js'
export default {
  name: "imageUpload",
  model:{
    prop:'visible',
    event:'change'
  },
  props:{
    visible:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      imageUrl:'',
      loading:false,
      maxSize:1//图片最大空间
    }
  },
  methods:{
    handleClose(){
      this.$emit('change',false)
    },
    selectFile(e){
      this.loading = true
      let file = e.target.files[0]
      let fileReader = new FileReader();  
      if(file.size/1024/1024 > this.maxSize){
        ImgCompress.photoCompress(file,{quality:0.2},(base64Codes)=>{
          const blob = ImgCompress.convertBase64UrlToBlob(base64Codes)
          const { lastModified, type } = file
          const compress_file = new File([blob],file.name,{type:type,lastModified:lastModified})
          fileReader.readAsDataURL(compress_file)
          fileReader.onload = (result)=>{
            this.imageUrl = result.target.result
            this.loading=false
          }
        })
      }else{
        fileReader.readAsDataURL(file)
        fileReader.onload = (result)=>{
          this.imageUrl = result.target.result
          this.loading=false
        }
      }
    },
    handleCommit(){
      this.$emit('imageCommit',this.imageUrl)

    }
  }
}
</script>

<style scoped>
.uploader{
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
