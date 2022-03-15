y<template>
    <div class="content">
    <custom-input style="padding:0 20px" placeholder="请输入搜索内容" v-model="keyword"></custom-input>
    <el-scrollbar style="height:100%">
        <div v-if="data.length>0" class="catalogue">
        <div v-for="item in data" v-show="!keyword||item.label.indexOf(keyword)>0"
            :key="item.key" :title="item.label"
            :style="`padding-left:${10*(item.level-1)}px`"
            @click="rePosition(item)">{{item.label}}</div>
    </div>
    <div class="empty" v-else>无</div>
    </el-scrollbar>
    </div>
</template>

<script>
import customInput from '../../../components/base/custom-input.vue'
export default {
  components: { customInput },
    props:{
        name:{
            type:String,
            default:'目录'
        },
        data:{
            type:Array,
            default:()=>[]
        }
    },
    data(){
        return{
            keyword:''
        }
    },
    methods:{
        rePosition(item){
            this.$emit('rePosition',item)
        }
    }

}
</script>

<style lang="scss" scoped>
.title{
        background: #F7F7F7;
        height: 40px;
        line-height: 40px;
        padding:  0 15px;
        font-size: 16px;
        color: #333333;
        font-weight: bold;
    }
.content{
    display: flex;
    width: 100%;
    flex-direction: column;
    height: calc(100% - 100px);
}
.catalogue{
    flex: 1;
    padding: 0 20px;
    &>div:hover{
        background: rgba(54, 164, 253, 0.2);
    }
    &>div{
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        height: 34px;
        line-height: 34px;
        height: auto;
        cursor: pointer;
        align-items: center;
    }
}
.empty{
    text-align: center;
    line-height: 34px;
}

</style>
