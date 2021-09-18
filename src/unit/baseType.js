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

const formateFunction = function(name,params){
  this.name = name;
  this.params = params
  this.__proto__.toString = () => {
    if(this.name&&this.params){
      let paramsStr = params.map(item=>item.value).toString()
      return `${name}(${paramsStr})`
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
  "backgroundColor":"",
  "title": {
    "show": true,
    "text": "",
    "textStyle": {
      "color": "#333",
      "fontSize": 18,
      "fontWeight": "normal",
      "fontStyle": "normal"
    },
    "left": 20,
    "top": 20,
    "right": 20,
    "bottom": 20,
    "subtext": ""
  },
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
      // {
      //   "type": 'line',
      //   "lineStyle":{
      //     color:'#333',
      //     width:1
      //   },
      //   "itemStyle":{
      //     color:'#333',
      //     borderColor:'',
      //     borderWidth:'',
      //     borderRadius:''
      //   },
      //   "areaStyle":{
      //     color:'transparent'
      //   }
      // }
    ],
  }
}
const optionsInitPIE = function(){
  return {
    ...base,
    "tooltip": {
      show: true,
      trigger: 'item',  //axis, item, none
      padding: [5, 10, 5, 10], // 上右下左
      backgroundColor: "#FFFFFF",
      borderColor: "#333",
      borderWidth: 0
    },
    "series": [
      {
        "type": 'pie',
        "radius": ['0%', '70%'],//内外半径
        "center": ['50%', '50%'],//中心位置
      }
    ],
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

const optionsInit = function (type){
  if(type === 'lab'){
    return optionsInitLAB()
  }else if(type === 'pie'){
    return optionsInitPIE()
  }else if(type === 'scatter'){
    return optionsInitSCATTER()
  }else if(type === 'map'){
    return optionsInitMAP()
  }
}

//柱线图单项初始化
const labSeriesInit = function () {
  return {
      "type": 'line',
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

const indexInit = function (type){
  return {
    type:type,
    xAxis:'',
    items:[]
  }
}

export {deepCopy,baseOptions,optionsInitLAB,optionsInit,indexInit,labSeriesInit,formateFunction}

