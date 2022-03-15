<template>
  <div class="template-box" @click="handleClick">
      <div class="thumnail"></div>
      <div class="messages">
          <div class="title">{{data.name}}</div>
          <div>创建人：{{data.author}}</div>
          <div>创建时间：{{data.createTime}}</div>
          <div>上次修改：{{data.updateTime}}</div>
      </div>

  </div>
</template>

<script>
export default {
    props:{
        data:{
            type:Object
        }
    },
    methods:{
        handleClick(){
            const {href} = this.$router.resolve({name:'templateViewer',params:{id:this.data.id},query:{type:this.data.type}})
            window.open(href,'_blank')
        }
    }

}
</script>

<style lang="scss" scoped>
.template-box{
    height: 320px;
    cursor: pointer;
    background: #ffffff;
    border-radius: 5px;
    padding: 6px 14px 0;
    transition: all .3s ease;
    box-shadow: 0 4px 22px 2px rgba(221,221,221,0.35);
    &:hover{
        transform: translateY(-10px);
        box-shadow: 0 4px 22px 2px rgb(220,220,220);
    }
    .thumnail{
        padding: 20px;
        width: 100%;
        height: 200px;
        background: url("~@/assets/imgs/tiptap/default_cover.png") no-repeat center/contain;
    }
    .messages{
        margin-top: 10px;
        font-size: 14px;
        color: #C5C5C5;
        line-height: 24px;
        .title{
            font-size: 18px;
            color: #444444;
        }
    }
}
</style>
