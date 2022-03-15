
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

const arrayDiff = function(arr1,arr2){
  let aSet = new Set(arr1)
  let bSet = new Set(arr2)
  return Array.from(new Set(arr1.concat(arr2).filter(v => !aSet.has(v) || !bSet.has(v))))
}

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
  this.nameEn = content.nameEn;
  this.params = content.params
  this.id = content.id
  this.__proto__.toString = () => {
    if(this.nameEn&&this.params){
      let paramsStr = content.params.map(item=>item.value).toString()
      return `${content.nameEn}(${paramsStr})`
    }else return ''
  }
}

const functionToText = function(content){
  let {nameEn,params} = content;
  if(nameEn&&params){
    let paramsStr = params.map(item=>item.value).toString()
    return `${nameEn}(${paramsStr})`
  }else return ''

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
    bottom: '3%',
    top: '6%',
    containLabel:true
  },
  "legend": {
    show: true,
    top:'6%'
  },
  "graphic":[],
}
//图像初始化选项，柱状图折线图混用
const optionsInitLAB = function(){
  return {
    ...base,
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
//饼图初始化
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
//散点图初始化
const optionsInitSCATTER = function(){
  let series = []
  return {
    ...base,
    "xAxis": {
      name:'',
      min:null,
      max:null,
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      axisLine: {
        "show": true,
      },
      splitLine: {
        show:false,
      },
      axisLabel:{
        formatter:'{value}'
      }
    },
    "yAxis": {
      name:'',
      min:null,
      max:null,
      nameRotate:90,
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      axisLine: {
        show: true,
      },
      splitLine: {
        show:false,
      },
      axisLabel:{
        formatter:'{value}'
      }
    },
    tooltip:{
      show:true,
      formatter:'{b}<br/>{c}',
      trigger: 'item',  //axis, item, none
      padding: [5, 10, 5, 10], // 上右下左
      backgroundColor: '#FFFFFF',
      borderColor: '#333',
      borderWidth: 0,
      regressArea:false,//线性回归相关域
      textStyle:{
        color:"#000",
      }
    },
    series: series,
    //针对散点图的额外属性
    "additions":{
      symbolSize: 6,//标记大小
      labShow:true,//标签显隐
      labLine:true,//标签连接线
      labPosX:10,//标签位置
      labPosY:0,//标签位置
      //坐标名称偏移量
      xNameLeft:-150,
      xNameTop:0,
      yNameLeft:-110,
      yNameTop:5,
      locationPin:[],//凸显某个地区boolean/string
      markLine:[],//辅助线array
      //分组
      group:[]
    }
  }
}
//组合图初始化-地域
const optionsInitCOMBO = function(type){
  return {
    ...base,
    "xAxis": {
      "show": true,
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      data:[],
    },
    "yAxis": {
      "show": true,
      min:null,
      max:null,
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      axisLabel:{
        formatter:'{value}'
      }
    },
    tooltip:{
      show:true,
      trigger: 'axis',  //axis, item, none
      textStyle:{
        color:"#000",
      }
    },
    "series": [
    ],
    //针对复杂组合图的额外属性
    "additions":{
      //数据使用多维度，通过xAxis.data的值来改变顺序
      orderIndex:0,//排序指标，默认第一个
      orderType:type == 'time'?'none':'desc',//时间轴的默认不排序
      stackType:'value',//堆叠类型value 数值堆叠 percentage 百分比堆叠
      markLine:[],//辅助线array
      //坐标名称偏移量
      xNameLeft:-150,
      xNameTop:0,
      yNameLeft:0,
      yNameTop:0,
      //分组
      group:[],
      //系列数据数字标签显示方式
      labelShowing:[],
      //分组默认颜色
      colorMap:chartColor,
    }
  }
}
//堆叠柱状图初始化
const optionsInitSTACK = function(type){
  return {
    ...base,
    xAxis: {
      show: true,
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      data:[],
    },
    yAxis: {
      show: true,
      min:null,
      max:null,
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      axisLabel:{
        formatter:'{value}'
      }
    },
    tooltip:{
      show:true,
      trigger: 'axis',  //axis, item, none
      textStyle:{
        color:"#000",
      }
    },
    series: [
    ],
    //针对复杂组合图的额外属性
    additions:{
      reverse:false,//是否反转坐标系
      //数据使用多维度，通过xAxis.data的值来改变顺序
      orderIndex:0,//排序指标，默认第一个
      orderType:type == 'time'?'none':'desc',//时间轴的默认不排序
      stackType:'value',//堆叠类型value 数值堆叠 percentage 百分比堆叠
      markLine:[],//辅助线array
      showValue:'none',//是否在柱内显示数据 none、number、percentage
      reverse:false,//反转坐标轴
      //坐标名称偏移量
      xNameLeft:-150,
      xNameTop:0,
      yNameLeft:0,
      yNameTop:0,
      //分组
      group:[],
      //分组默认颜色
      colorMap:chartColor,
    }
  }

}
// 地图初始化
const optionsInitMAP = function(){
  return {
    ...base,
    grid: {
      right: 10,
      top: 0,
      bottom: 0,
      width: '20%'
    },
    tooltip:{
      show:true,
      formatter: '{b}:{c}',
      trigger: 'item',  //axis, item, none
      padding: [5, 10, 5, 10], // 上右下左
      backgroundColor: '#FFFFFF',
      borderColor: '#333',
      borderWidth: 0,
      textStyle:{
        color:"#000",
      }
    },
    xAxis: {
      show:false
    },
    yAxis: {
      type: 'category',
      show:false,
      inverse: true,
      data: []
    },
    geo:{
      map:'china',
      label:{
        show:true,
      },
      regions:[]
    },
    series: [{
      type: "map",
      map:'china',
      geoIndex:0,
      data:[]
    },{
      type: 'bar',
      barWidth:0,
      tooltip:{
        show:false
      },
      itemStyle:{
        color:'transparent'
      },
      label:{
        show:true,
        color:'#000',
        position:'insideLeft',
        formatter:'{b}:{c}'
      },
      data: []
    }],
    "additions":{
      dataType:'number',
      orderType:'desc',
      //分组
      group:[]
    }
  }
}

//瀑布图初始化
const optionsInitWATERFALL = function(){
  return {
    ...base,
    "xAxis": {
      "show": true,
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      data:[],
    },
    "yAxis": {
      "show": true,
      min:null,
      max:null,
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      axisLabel:{
        formatter:'{value}'
      }
    },
    legend:{
      show:false
    },
    tooltip:{
      show:true,
      trigger: 'axis',  //axis, item, none,
      formatter:'变化量\n{b}:{c1}',
      textStyle:{
        color:"#000",
      }
    },
    "series": [
    ],
    //针对复杂组合图的额外属性
    "additions":{
      //数据使用多维度，通过xAxis.data的值来改变顺序
      orderIndex:0,//排序指标，默认第一个
      orderType:'none',//排序规则none desc insc
      groupBy:false,//是否按照地域组分组
      markLine:[],//辅助线array
      //坐标名称偏移量
      xNameLeft:-150,
      xNameTop:0,
      yNameLeft:0,
      yNameTop:0,
      //分组
      group:[],
      //分组默认颜色
      colorMap:chartColor,
    }
  }
}

//双轴组合图初始化
const optionsInitDOUBLEAXIS = function(){
  return {
    ...base,
    tooltip:{
      show:true,
      trigger: 'axis',  //axis, item, none
      textStyle:{
        color:"#000",
      }
    },
    "xAxis": {
      show: true,
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      data:[],
    },
    "yAxis": [
      {
      show: true,
      min:null,
      max:null,
      nameRotate:90,
      position:'left',
      nameTextStyle:{
        verticalAlign: "bottom",
        align:'left',
      },
      axisLabel:{
        formatter:'{value}'
      }
     },{
        show: true,
        min:null,
        max:null,
        nameRotate:90,
        position:'right',
        nameTextStyle:{
          verticalAlign: "bottom",
          align:'left',
        },
        axisLabel:{
          formatter:'{value}'
        }
      }
    ],
    "series": [
    ],
    //针对复杂组合图的额外属性
    "additions":{
      //数据使用多维度，通过xAxis.data的值来改变顺序
      orderIndex:0,//排序指标，默认第一个
      orderType:'desc',
      stackType:'value',//堆叠类型value 数值堆叠 percentage 百分比堆叠
      markLine:[],//辅助线array
      //坐标名称偏移量
      xNameLeft:-150,
      xNameTop:0,
      yNameLeft:[-110,-110],
      yNameTop:[5,5],
      //分组
      group:[],
      //分组默认颜色
      colorMap:chartColor,
    }
  }
}

//自由编辑图
const optionsInitFree = function(){
  return {}
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
    //复杂组合图-地域
    case 'combo':
      return optionsInitCOMBO()
    //复杂组合图-时间
    case 'comboTime':
      return optionsInitCOMBO('time')
    //堆叠图-地域
    case 'stack':
      return optionsInitSTACK()
    //堆叠图-时间
    case 'stackTime':
      return optionsInitSTACK('time')
    //瀑布柱状图
    case 'waterfall':
      return optionsInitWATERFALL()
    //双轴组合图
    case 'doubleAxis':
      return optionsInitDOUBLEAXIS()
    case 'free':
      return optionsInitFree()
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


const chartColor=  [
    "#A60922",
    "#1362B0",
    "#C29D2B",
    "#1EA288",
    "#898989",
    "#F79646",
    "#000000",
]

const objectArrayUnique = function(array,key){
  const map = new Map()
  return array.filter(item=>!map.has(item[key]) && map.set(item[key],1))
}


export {deepCopy,baseOptions,optionsInitLAB,
  optionsInit,indexInit,labSeriesInit,
  formateFunction,functionToText,debounce,arrayDiff,
  objectArrayUnique,chartColor}

