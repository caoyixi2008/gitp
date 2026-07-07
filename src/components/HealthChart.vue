<template>

  <div 
    id="healthChart"
    class="chart"
  ></div>

</template>


<script setup>

import { onMounted, watch } from 'vue'
import * as echarts from 'echarts'


const props = defineProps({

  dates:{
    type:Array,
    default:()=>[]
  },


  sport:{
    type:Array,
    default:()=>[]
  },


  food:{
    type:Array,
    default:()=>[]
  }


})


let chart


function updateChart(){

  if(!chart) return


  chart.setOption({

    title:{
      text:'健康数据趋势'
    },


    tooltip:{},


    xAxis:{
      type:'category',
      data:props.dates
    },


    yAxis:{
      type:'value'
    },


    series:[

      {

        name:'运动分钟',

        type:'line',

        data:props.sport

      },


      {

        name:'摄入热量',

        type:'bar',

        data:props.food

      }


    ]

  })

}



onMounted(()=>{

  chart = echarts.init(
    document.getElementById('healthChart')
  )


  updateChart()

})



watch(

  ()=>[
    props.dates,
    props.sport,
    props.food
  ],


  ()=>{

    updateChart()

  },


  {
    deep:true
  }

)


</script>



<style scoped>


.chart{

  width:100%;

  height:400px;

  background:white;

  border-radius:12px;

  padding:15px;

  margin-top:15px;

}


</style>