<template>
  <div class="container">
    <h1>健康管理系统</h1>
    <p class="welcome">
  欢迎使用个人健康管理系统，记录健康生活每一天！
</p>
<HealthScore :score="healthScore" />
    <!-- 今日健康概览 -->
<SummaryCard
  :sport="totalSport"
  :cal="totalCal"
/>

    <!-- 🏃 运动模块 -->
    <SportRecord
  :list="sportList"

  :sportDate="sportDate"

  :sportType="sportType"

  :sportTime="sportTime"


  @update:sportDate="sportDate=$event"

  @update:sportType="sportType=$event"

  @update:sportTime="sportTime=$event"


  @add="addSport"

  @delete="deleteSport"
/>

    <hr />

    <!-- 🍔 饮食模块 -->
    <FoodRecord

  :list="foodList"

  :foodDate="foodDate"

  :foodName="foodName"

  :foodCal="foodCal"



  @update:foodDate="foodDate=$event"

  @update:foodName="foodName=$event"

  @update:foodCal="foodCal=$event"



  @add="addFood"

  @delete="deleteFood"

/>

    <hr />
<!-- 📈 健康数据分析 -->
<h2>健康数据分析</h2>
<!-- 🔔 健康提醒 -->
<h2>健康提醒</h2>

<HealthNotice 
  :sport="totalSport"
  :cal="totalCal"
/>
<HealthChart

  :dates="chartDates"

  :sport="sportData"

  :food="foodData"

/>


<footer>
  © 2026 个人健康管理系统 | 武汉大学课程设计
</footer>

</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

import HealthScore from './components/HealthScore.vue'
import HealthNotice from './components/HealthNotice.vue'
import SummaryCard from './components/SummaryCard.vue'
import SportRecord from './components/SportRecord.vue'
import FoodRecord from './components/FoodRecord.vue'
import HealthChart from './components/HealthChart.vue'

/* ===== 运动数据 ===== */
const sportDate = ref('')

const sportType = ref('')

const sportTime = ref('')
const sportList = ref(
  JSON.parse(localStorage.getItem('sportList')) || []
)

/* 添加运动 */
function addSport() {
  if (!sportDate.value || !sportType.value || !sportTime.value) {
    alert('请填写完整运动信息')
    return
  }

  sportList.value.push({
  date: sportDate.value,
  type: sportType.value,
  time: Number(sportTime.value)
})

  sportDate.value = ''
sportType.value = ''
sportTime.value = ''
}

function deleteSport(index){

  sportList.value.splice(index,1)

}
/* ===== 饮食数据 ===== */
const foodDate = ref('')

const foodName = ref('')

const foodCal = ref('')
const foodList = ref(
  JSON.parse(localStorage.getItem('foodList')) || []
)

/* 添加饮食 */
function addFood() {
 if (!foodDate.value || !foodName.value || !foodCal.value)  {
    alert('请填写完整饮食信息')
    return
  }

  foodList.value.push({
  date: foodDate.value,
  name: foodName.value,
  cal: Number(foodCal.value)
})

  foodDate.value = ''
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
const healthScore = computed(() => {

  let score = 100

  // 运动不足扣分
  if(totalSport.value < 30){
    score -= 20
  }

  // 热量过高扣分
  if(totalCal.value > 2000){
    score -= 20
  }

  // 防止出现负数
  if(score < 0){
    score = 0
  }

  return score

})
const chartDates = computed(() => {
  const dates = [
    ...sportList.value.map(item => item.date),
    ...foodList.value.map(item => item.date)
  ]

  return [...new Set(dates)].sort()
})

const sportData = computed(() => {
  return chartDates.value.map(date => {
    return sportList.value
      .filter(item => item.date === date)
      .reduce((sum, item) => sum + item.time, 0)
  })
})

const foodData = computed(() => {
  return chartDates.value.map(date => {
    return foodList.value
      .filter(item => item.date === date)
      .reduce((sum, item) => sum + item.cal, 0)
  })
})



  {
    deep:true
  }

watch(
  sportList,
  () => {
    localStorage.setItem(
      'sportList',
      JSON.stringify(sportList.value)
    )
  },
  { deep: true }
)

watch(
  foodList,
  () => {
    localStorage.setItem(
      'foodList',
      JSON.stringify(foodList.value)
    )
  },
  { deep: true }
)
</script>

<style>
.container{
    max-width:1100px;
    margin:0 auto;
    padding:30px;
}
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





.welcome{
    text-align:center;
    color:#666;
    margin-top:-15px;
    margin-bottom:25px;
}

footer{
    text-align:center;
    color:#999;
    margin-top:40px;
    font-size:14px;
}

</style>