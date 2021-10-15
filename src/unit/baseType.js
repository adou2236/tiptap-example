import {defaultColor, geography} from "../assets/maps";

const isType = function (type) {
  return function (arg) {
    return Object.prototype.toString.call(arg) === `[object ${type}]`;
  };
};
export const isFunction = isType('Function');

export const isObject = isType('Object');

export const isString = isType('String');

export const isArray = isType('Array');

export const isDate = isType('Date');


const debounce = function(fn, delay = 500) {
  var timer;
  return function () {
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args); // this 指向vue
    }, delay);
  };
}

const formateFunction = function(content){
  this.name = content.name;
  this.params = content.params
  this.__proto__.toString = () => {
    if(this.name&&this.params){
      let paramsStr = content.params.map(item=>item.value).toString()
      return `${content.name}(${paramsStr})`
    }else return ''
  }
}

const deepCopy = function(data) {
  if (!Array.isArray(data) && !isObject(data)) {
    return data;
  } else if (Array.isArray(data)) {
    return data.map(item => deepCopy(item));
  } else if (isObject(data)) {
    let ret = {};
    Object.keys(data).forEach(key => {
      ret[key] = deepCopy(data[key]);
    });
    return ret;
  }
}
const removeData = function(objAry, key) {
  delete objAry.xAxis.data
  objAry.series.forEach(item=>{
    delete item['data']
  })
}
const baseOptions = function(param){
  removeData(param,'data')
  this.options = param
  this.getxAxisData = () => {
    return this.options
  }
  return this
}
//通用图像属性
const base = {
  "grid": {
    left: 50,
    right: 50,
    bottom: 50,
    top: 50,
  },
  "legend": {
    show: true,
    icon: 'circle',
    itemWidth: 20,
    itemHeight: 5,
  },
  "graphic":[],
}
//图像初始化选项，柱状图折线图混用
const optionsInitLAB = function(){
  return {
    ...base,
    "tooltip": {
      show: true,
      trigger: 'axis',  //axis, item, none
      padding: [5, 10, 5, 10], // 上右下左
      backgroundColor: "#FFFFFF",
      borderColor: "#333",
      borderWidth: 0
    },
    "xAxis": {
      "data": [],
      "show": true,
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "",
          "width": 1,
          "type": "solid"
        },
      },
      splitLine: {
        show:false,
        lineStyle: {
          color: "",
          width: 0
        }
      },
    },
    "yAxis": {
      axisLine: {
        show: true,
        lineStyle: {
          color: "",
          width: 1,
          type: "solid"
        }
      },
      splitLine: {
        show:false,
        lineStyle: {
          color: "",
          width: 0
        }
      }
    },
    "series": [
    ],
  }
}
const optionsInitPIE = function(){
  return {
    ...base,
    "tooltip": {
      show: true,
      trigger: 'item',  //axis, item, none
    },
    "series": {
      "type": 'pie',
      data:[]
    },
    additions:{
      "radius": ['0%', '70%'],//内外半径
      "center": ['50%', '50%'],//中心位置
    }
  }
}
const optionsInitSCATTER = function(){
  let series = []
  geography.forEach((item,index)=>{
    series.push(
        {
          type: 'scatter',
          name:item.label,
          label:{
            show:true,
            position:[0,0],
            formatter:'{b}'
          },
          labelLine:{
            show:false
          },
          itemStyle:{
            color:defaultColor[index]
          },
          items:item.children,
        }
    )

  })

  return {
    ...base,
    "xAxis": {
      "show": true,
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "",
          "width": 1,
          "type": "solid"
        },
      },
      splitLine: {
        show:false,
        lineStyle: {
          color: "",
          width: 0
        }
      }
    },
    "yAxis": {
      axisLine: {
        show: true,
        lineStyle: {
          color: "",
          width: 1,
          type: "solid"
        }
      },
      splitLine: {
        show:false,
        lineStyle: {
          color: "",
          width: 0
        }
      }
    },
    tooltip:{
      show:true,
      formatter:'{b}<br/>{c}',
      trigger: 'item',  //axis, item, none
      padding: [5, 10, 5, 10], // 上右下左
      backgroundColor: '#FFFFFF',
      borderColor: '#333',
      borderWidth: 0
    },
    series: series,
    //针对散点图的额外属性
    "additions":{
      symbolSize: 10,
      locationPin:false,//凸显某个地区boolean/string
      markLine:[],//辅助线array
    }
  }
}

const optionsInitCOMBO = function(){
  return {
    ...base,
    "xAxis": {
      "show": true,
      data:[],
    },
    "yAxis": {
      "show": true,
    },
    tooltip:{
      show:true,
      trigger: 'axis',  //axis, item, none
    },
    "series": [
    ],
    //针对复杂组合图的额外属性
    "additions":{
      //数据使用多维度，通过xAxis.data的值来改变顺序
      sortIndex:0,//排序指标，默认第一个
      markLine:[],//辅助线array
    }
  }
}

const optionsInitMAP = function(){
  return {
    ...base,
    tooltip:{
      show:true,
      // formatter:'{b}<br/>{c}',
      trigger: 'item',  //axis, item, none
      padding: [5, 10, 5, 10], // 上右下左
      backgroundColor: '#FFFFFF',
      borderColor: '#333',
      borderWidth: 0
    },
    geo: {
      map: 'china',
    },
    series: [{
      type: 'map',
      map: 'china',
    }],
  }
}

const optionsInit = function(type){
  switch (type) {
    //简单柱线组合图
    case 'lab':
      return optionsInitLAB()
    //简单饼状图
    case 'pie':
      return optionsInitPIE()
    //复杂气泡图
    case 'scatter':
      return optionsInitSCATTER()
    //复杂地图
    case 'map':
      return optionsInitMAP()
    //复杂组合图
    case 'combo':
      return optionsInitCOMBO()
  }

}

//柱线图单项初始化
const labSeriesInit = function () {
  return {
      "type": 'line',
      //堆叠指数
      "stack": false,
      "lineStyle":{
        color:'#333',
        width:1
      },
      "itemStyle":{
        color:'#333',
        borderColor:'',
        borderWidth:'',
        borderRadius:''
      },
      "areaStyle":{
        color:'transparent'
      }
    }

}

//指标项初始化
const indexInit = function (type){
  switch(type){
    case 'pie':
      return{
        type:type,
        xAxis:'',
        items:[]
      }
    case 'combo':{
      return{

      }
    }

  }
  return {
    type:type,
    xAxis:'',
    items:[]
  }
}

//31省数据模拟
const regionData = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3]
const timeData = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3]

const chartColor=  [
    "rgb(166,9,34)",
    "rgb(19,98,176)",
    "rgb(194,157,27)",
    "rgb(30,162,136)",
    "rgb(137,137,137)",
    "rgb(247,150,70)",
    "rgb(0,0,0)",
]
//研报图表默认风格
const REPORT_THEME = {
  // backgroundColor:"rgba(188,190,192,0.6)",
  backgroundColor:"#FFFFFF",
  color:chartColor,
  tooltip:{
    padding: [5, 10, 5, 10], // 上右下左
    backgroundColor: '#FFFFFF',
    borderColor: '#333',
    borderWidth: 0
  },
  categoryAxis:{
    axisLine:{
      show:true,
      lineStyle:{
        color:'rgb(188,190,192)'
      }
    },
    axisLabel:{
      interval:0,
      rotate:90
    },
  },
  valueAxis:{
    axisLine:{
      show:true,
      lineStyle:{
        color:'rgb(188,190,192)'
      }
    },
    splitLine:{
      show:false
    }
  }

}


export {deepCopy,baseOptions,optionsInitLAB,
  optionsInit,indexInit,labSeriesInit,
  formateFunction,regionData,debounce,
  chartColor,REPORT_THEME}

