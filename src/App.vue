<template>
  <div class="container">
    <h1>健康管理系统</h1>
    <p class="welcome">
  欢迎使用个人健康管理系统，记录健康生活每一天！
</p>
<HealthScore :score="healthScore" />
    <!-- 今日健康概览 -->
    <div class="date-box">

  📅 查看日期：

  <input
    type="date"
    v-model="currentDate"
  />

</div>
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
<WeightRecord

  :list="weightList"

  :weightDate="weightDate"

  :weight="weight"

  @update:weightDate="weightDate=$event"

  @update:weight="weight=$event"

  @add="addWeight"

  @delete="deleteWeight"

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
import { ref, computed, watch, onMounted } from 'vue'
import request from './utils/request'

import HealthScore from './components/HealthScore.vue'
import HealthNotice from './components/HealthNotice.vue'
import SummaryCard from './components/SummaryCard.vue'
import SportRecord from './components/SportRecord.vue'
import FoodRecord from './components/FoodRecord.vue'
import HealthChart from './components/HealthChart.vue'
import WeightRecord from './components/WeightRecord.vue'

/* ===== 运动数据 ===== */
const sportDate = ref('')
// 当前查看日期
const currentDate = ref(
  new Date().toISOString().slice(0,10)
)
const sportType = ref('')

const sportTime = ref('')
const sportList = ref([])

/* 添加运动 */
async function addSport() {

  if (!sportDate.value || !sportType.value || !sportTime.value) {
    alert('请填写完整运动信息')
    return
  }

  await request.post('/sport/add', {

    userId:1,

    sportType:sportType.value,

    duration:Number(sportTime.value),

    recordDate:sportDate.value

  })


  alert('添加成功')


  loadSport()


  sportDate.value=''
  sportType.value=''
  sportTime.value=''

}

async function loadSport(){

  const res = await request.get('/sport/list',{

    params:{
      userId:1,
      date:currentDate.value
    }

  })


  sportList.value = res.data.data

}
async function deleteSport(id){

  await request.delete('/sport/delete',{

    params:{
      id:id,
      userId:1
    }

  })


  loadSport()

}

/* ===== 饮食数据 ===== */
const foodDate = ref('')

const foodName = ref('')

const foodCal = ref('')
const foodList = ref([])
const weightDate = ref('')

const weight = ref('')

const weightList = ref([])

/* 添加饮食 */
async function addFood(){

  if(!foodDate.value || !foodName.value || !foodCal.value){

    alert('请填写完整饮食信息')
    return

  }


  try{

    await request.post('/diet/add',{

      userId:1,

      foodName:foodName.value,

      calories:Number(foodCal.value),

      mealType:'其他',

      recordDate:foodDate.value

    })


    alert('添加成功')

    loadFood()


    foodDate.value=''
    foodName.value=''
    foodCal.value=''


  }catch(error){

    console.log(error)

    alert('添加失败')

  }

}
async function loadFood(){

  try{

    const res = await request.get('/diet/list',{

      params:{

        userId:1,

        date:currentDate.value

      }

    })


    foodList.value=res.data.data


  }catch(error){

    console.log(error)

  }

}

async function deleteFood(id){

  try{

    await request.delete('/diet/delete',{

      params:{

        id:id,

        userId:1

      }

    })


    loadFood()


  }catch(error){

    console.log(error)

  }

}
async function addWeight(){

  if(!weightDate.value || !weight.value){

    alert('请填写完整体重信息')

    return

  }


  try{

    await request.post('/user/weight',{

      weight:Number(weight.value),

      date:weightDate.value

    })


    alert('添加成功')


    loadWeight()


    weightDate.value=''

    weight.value=''


  }catch(error){

    console.log(error)

    alert('添加失败')

  }

}
async function loadWeight(){

  try{

    const res = await request.get('/user/weight/history')


    weightList.value=res.data.data


  }catch(error){

    console.log(error)

  }

}

async function loadNotice(){

  try{

    const res = await request.get('/notice/list',{

      params:{

        userId:1

      }

    })


    console.log(res.data.data)


  }catch(error){

    console.log(error)

  }

}
async function deleteWeight(id){

  try{

    await request.delete(`/user/weight/${id}`)


    loadWeight()


  }catch(error){

    console.log(error)

  }

}

/* ===== 统计 ===== */
const totalSport = computed(() => {

  return sportList.value

    .filter(item => item.date === currentDate.value)

    .reduce((sum,item)=>sum + item.time,0)

})

const totalCal = computed(() => {

  return foodList.value

    .filter(item => item.date === currentDate.value)

    .reduce((sum,item)=>sum + item.cal,0)

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








onMounted(()=>{

  loadSport()

  loadFood()

  loadWeight()

  loadNotice()

  if(totalSport.value < 30){

    setTimeout(()=>{

      alert('🏃 今日运动不足30分钟，建议增加运动量！')

    },500)

  }


  if(totalCal.value > 2000){

    setTimeout(()=>{

      alert('🍔 今日热量摄入偏高，请注意饮食控制！')

    },1000)

  }

})

  
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
.date-box{

  background:white;

  padding:15px;

  margin-bottom:20px;

  border-radius:12px;

  font-size:18px;

}
</style>