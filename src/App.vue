<template>
  <div style="padding:20px">
    <h1>健康管理系统</h1>
    <!-- 今日健康概览 -->
<div class="summary-box">

  <div class="card">
    <h3>🏃 今日运动</h3>
    <p>{{ totalSport }} 分钟</p>
  </div>

  <div class="card">
    <h3>🍔 今日摄入</h3>
    <p>{{ totalCal }} kcal</p>
  </div>

  <div class="card">
    <h3>🎯 剩余建议</h3>
    <p>{{ 2000 - totalCal }} kcal</p>
  </div>

</div>

    <!-- 🏃 运动模块 -->
    <h2>运动记录</h2>

    <input v-model="sportType" placeholder="运动类型（如跑步）" />
    <input v-model="sportTime" placeholder="时间（分钟）" />
    <button @click="addSport">添加运动</button>

    <ul>
  <li v-for="(item, index) in sportList" :key="index">

    {{ item.type }} - {{ item.time }} 分钟

    <button @click="deleteSport(index)">
      删除
    </button>

  </li>
</ul>

    <hr />

    <!-- 🍔 饮食模块 -->
    <h2>饮食记录</h2>

    <input v-model="foodName" placeholder="食物名称" />
    <input v-model="foodCal" placeholder="卡路里（kcal）" />
    <button @click="addFood">添加饮食</button>

    <ul>
  <li v-for="(item, index) in foodList" :key="index">

    {{ item.name }} - {{ item.cal }} kcal

    <button @click="deleteFood(index)">
      删除
    </button>

  </li>
</ul>

    <hr />
<!-- 📈 健康数据分析 -->
<h2>健康数据分析</h2>
<!-- 🔔 健康提醒 -->
<h2>健康提醒</h2>

<div class="notice-box">

  <p>💧 今天记得多喝水</p>

  <p>🏃 今天运动目标完成了吗？</p>

  <p>🌙 保持规律作息</p>

</div>

<div id="healthChart" style="width:100%;height:400px;"></div>
    <!-- 📊 统计模块 -->
    <h2>今日统计</h2>

    <p>总运动时间：{{ totalSport }} 分钟</p>
    <p>总摄入卡路里：{{ totalCal }} kcal</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

/* ===== 运动数据 ===== */
const sportType = ref('')
const sportTime = ref('')
const sportList = ref([])

/* 添加运动 */
function addSport() {
  if (!sportType.value || !sportTime.value) {
    alert('请填写完整运动信息')
    return
  }

  sportList.value.push({
    type: sportType.value,
    time: Number(sportTime.value)
  })

  sportType.value = ''
  sportTime.value = ''
}

function deleteSport(index){

  sportList.value.splice(index,1)

}
/* ===== 饮食数据 ===== */
const foodName = ref('')
const foodCal = ref('')
const foodList = ref([])

/* 添加饮食 */
function addFood() {
  if (!foodName.value || !foodCal.value) {
    alert('请填写完整饮食信息')
    return
  }

  foodList.value.push({
    name: foodName.value,
    cal: Number(foodCal.value)
  })

  foodName.value = ''
  foodCal.value = ''
}
function deleteFood(index){

  foodList.value.splice(index,1)

}

/* ===== 统计 ===== */
const totalSport = computed(() => {
  return sportList.value.reduce((sum, item) => sum + item.time, 0)
})

const totalCal = computed(() => {
  return foodList.value.reduce((sum, item) => sum + item.cal, 0)
})
let chart


onMounted(()=>{

  chart = echarts.init(
    document.getElementById('healthChart')
  )


  updateChart()

})


function updateChart(){

  chart.setOption({

    title:{
      text:'健康数据趋势'
    },

    tooltip:{},

    xAxis:{
      type:'category',
      data:['今日']
    },

    yAxis:{
      type:'value'
    },

    series:[

      {
        name:'运动分钟',
        type:'line',
        data:[totalSport.value]
      },

      {
        name:'摄入热量',
        type:'bar',
        data:[totalCal.value]
      }

    ]

  })

}


watch(
  [totalSport,totalCal],
  ()=>{
    updateChart()
  }
)
</script>

<style>
body {
  margin: 0;
  background: #f5f7fb;
  font-family: "Microsoft YaHei", sans-serif;
}

div {
  box-sizing: border-box;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

h2 {
  color: #409EFF;
  margin-top: 25px;
}

input {
  width: 180px;
  padding: 10px;
  margin: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  outline: none;
}

input:focus {
  border-color: #409EFF;
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background: #409EFF;
  color: white;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #66b1ff;
}

ul {
  padding-left: 20px;
}

li {
  margin: 8px 0;
  background: white;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,.08);
}

hr {
  margin: 30px 0;
  border: none;
  border-top: 1px solid #ddd;
}

p {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.summary-box{
    display:flex;
    gap:20px;
    margin-bottom:30px;
}

.card{
    flex:1;
    background:white;
    padding:20px;
    border-radius:12px;
    text-align:center;
    box-shadow:0 3px 10px rgba(0,0,0,.08);
}

.card h3{
    color:#409EFF;
}

.card p{
    font-size:26px;
    color:#ff6b6b;
}
.notice-box{

  background:white;
  padding:20px;
  border-radius:12px;
  box-shadow:0 3px 10px rgba(0,0,0,.08);

}

.notice-box p{

  margin:15px 0;
  font-size:18px;

}
</style>