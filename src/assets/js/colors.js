const DEFAULT_COLOR = [
    "#A60922",
    "#1362B0",
    "#C29D2B",
    "#1EA288",
    "#898989",
    "#F79646",
    "#000000",
] /** 图表用到的调色盘 */

const TEMPLATE_THEME =  {
    backgroundColor: "rgb(255,255,255)",
    color: DEFAULT_COLOR,
    grid: {
        left: "6%",
        right: "6%",
        bottom: "6%",
        containLabel: true,
    },
    tooltip:{
        borderColor:'#FFFFFF',
        textStyle: {
          fontFamily: 'KaiTi'
        },
    },
    legend: {
        icon:'rect',
        itemWidth:10,
        itemHeight:10,
        padding:[0,20],
        textStyle:{
            color:"#000",
            fontFamily:'KaiTi',
        }
    },
    categoryAxis: {
        nameTextStyle:{
            color:"#000",
            fontSize:18,
        },
        axisLine: {
            lineStyle: {
                color: 'rgb(188,190,192)'
            }
        },
        axisLabel:{
            interval:0,
            fontSize:16,
            color:"#000"
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: true,
        },
    },
    valueAxis: {
        nameTextStyle:{
            color:"#000",
            fontSize:18,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'rgb(188,190,192)'
            }
        },
        splitLine: {
            show: false,
        },
        axisTick: {
            show: true
        },
        axisLabel: {
            show:true,
            fontSize:16,
            color:"#000"
        }

    },
    line: {
        symbol: 'none',
        lineStyle:{
            width:2
        },
        label:{
            textBorderColor:'#000'
        },
        legend:{
            // icon:'rect',
            // itemWidth:10,
            // itemHeight:0
        }
    },
    bar: {
        barMaxWidth: 6,
    },
    textStyle:{
        fontFamily:'KaiTi',
        fontSize:16,
        textBorderColor:'#000'
    },
    markLine:{
        label:{
            textBorderColor:'#000'
        }
    },
    graphic:{
        style:{
            fontSize:14
        }
    }
}


export {
    DEFAULT_COLOR,
    TEMPLATE_THEME,
}
