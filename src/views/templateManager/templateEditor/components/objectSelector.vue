<template>
  <div class="object-selector" >
    <div  v-if="!isHidden" class="selector-title">
    插入
    <div class="tool-tag">
      <span v-for="item in toolBox"
        :key="item.id"
        :class="active === item.id?'active':''"
        @click="active = item.id">{{item.label}}</span>
    </div>
    </div>
    <el-scrollbar  v-if="!isHidden">
      <div v-show="active == 'base'" class="selector-container">
        <div v-for="item in objects" :key="item.id">
          <div class="title">{{item.label}}</div>
          <div class="tools">
            <div v-for="obj in item.children"
                :key="obj.id"
                 @click="$emit('objInsert',obj)">
                 <div class="thumbnail" :style="`background-image:url(${obj.icon})`"></div>
                <div class="name">{{obj.label}}</div>
            </div>
            <i></i>
            <i></i>
          </div>
        </div>
      </div>
      <div v-show="active == 'template'" class="selector-container">
        <div v-for="item in templates" :key="item.id">
          <div class="title">{{item.label}}</div>
          <div v-for="(obj,index) in item.children"
              class="template"
              :key="index"
              @click="handleTemplateInsert(obj)">
            <div class="name">{{obj.name}}</div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div @click="handleDraw" :class="isHidden?'drawer-btn filp':'drawer-btn'" ></div>
  </div>
</template>

<script>
import { getDocTemplateDetail, getDocTemplateList } from '@/request/templateApi'
import { EventBus } from '../unit/eventBus'

export default {
  name: "objectSelector",
  props:{
    //当前编辑器对象
    editor:{
      type:Object
    },
    objects:{
      type:Array,
      default:()=>[]
    },
    isHidden:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      toolBox:[
        {id:'base',label:'基础'},
        {id:'template',label:'模板'},
      ],
      templates:[
        {
          id:'smart',label:'智能文本模板',children:[]
        },
        {
          id:'chart',label:'图模板',children:[]
        },
        {
          id:'table',label:'表模板',children:[]
        },
      ],
      active:'base'
    }
  },
  async mounted(){
    this.eventBussListener()
    //TODO三类列表赋值待优化
    Promise.all([
      this.templateList(0),
      this.templateList(1),
      this.templateList(2),
    ]).then(res=>{
      this.templates[0].children = res[0]
      this.templates[1].children = res[1]
      this.templates[2].children = res[2]
    })
  },
  beforeDestroy(){
    EventBus.off()
  },
  methods:{
    eventBussListener(){
      EventBus.$on("templateUpdate", async (newValue,type) => {
        this.templates[type].children.push(newValue)
      });
    },
    async templateList(type){
      let list = []
      let data = {
        type:type
      }
      let res = await getDocTemplateList(data)
      if(res.data.code == 200){
        list = res.data.data
      }
      return list
    },
    async handleTemplateInsert(e){
      this.$emit('templateInsert',e)
    },
    handleDraw(){
      this.$emit('update:isHidden',!this.isHidden)
    },
    handleSelect(item){
      switch (item.id){
        case 'line':
          this.$emit("lineInsert");
          break
        case 'tag':
          this.$emit("tagInsert",item.type);
          break
        case 'complexTag':
          this.$emit("complexTagInsert",item.type);
          break
        case 'image':
          this.$emit("imageInsert");
          break
        case 'chart':
          this.$emit('chartInsert');
          break
        default:
          return
      }

    },
  },
}
</script>

<style lang="scss" scoped>
.object-selector{
  transition: all .3s ease;
  position: relative;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  .selector-title{
    background: #F7F7F7;
    padding: 20px 20px 0;
    font-size: 18px;

    .tool-tag{
      margin-top: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      &>span{
        color:#707070;
        font-size: 16px;
        margin-right:20px;
        padding: 8px 3px;
        cursor:pointer;
        &.active{
          color: #36a4fd;
          position: relative;
          &::after{
            content:'';
            background: #36a4fd;
            width:100%;
            height: 2px;
            position: absolute;
            bottom: 0;
            left: 0;
          }
        }
      }
    }
  }
  .selector-container{
    flex: 1;
    padding: 20px;
    .template{
       display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 10px;
      cursor: pointer;
      &:hover{
        outline: 1px solid #D8D8D8;
      }
    }
    .tools{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-around;
      &>i{
        width: 45%;
      }
      &>div{
        cursor: pointer;
        box-sizing: border-box;
        width: 45%;
        padding:10px 0;
        &:hover{
          outline: 1px solid #D8D8D8;
        }
        .thumbnail{
          background-repeat: no-repeat;
          object-fit: contain;
          width: 100%;
          height: 40px;
          background-size: 40px 40px;
          background-position: 50% 50%;
          margin: auto;
        }
        .name{
          font-size:12px;
          color:#707070;
          white-space: pre;
          text-align: center;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  .drawer-btn{
      position: absolute;
      cursor: pointer;
      right: 20px;
      top: 20px;
      right: 20px;
      white-space: nowrap;
      width: 20px;
      height: 20px;
      background: url("~@/assets/imgs/tiptap/drawBar.svg") no-repeat center/contain;
      transition: all ease 0.3s;
      &.filp{
        transform: rotate(180deg);
        right: -30px;
      }
    }
}


</style>
