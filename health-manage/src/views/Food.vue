<template>
  <div class="food-page">
    <h2>🍔 饮食记录</h2>
    
    <!-- 添加饮食表单 -->
    <div class="add-form">
      <h3>记录饮食</h3>
      <div class="form-row">
        <input type="text" v-model="newFood.foodName" placeholder="食物名称" />
        <input type="number" v-model="newFood.calories" placeholder="热量(千卡)" />
        <select v-model="newFood.mealType">
          <option value="早餐">早餐</option>
          <option value="午餐">午餐</option>
          <option value="晚餐">晚餐</option>
          <option value="加餐">加餐</option>
        </select>
        <input type="date" v-model="newFood.recordDate" />
        <button @click="addFood">添加</button>
      </div>
    </div>

    <!-- 今日汇总 -->
    <div class="summary">
      <span>今日总热量：<strong>{{ totalCalories }}</strong> 千卡</span>
    </div>

    <!-- 饮食列表 -->
    <div class="record-list">
      <h3>今日饮食</h3>
      <ul>
        <li v-for="item in foodList" :key="item.id">
          <span>{{ item.foodName }}</span>
          <span>{{ item.calories }} 千卡</span>
          <span>{{ item.mealType }}</span>
          <span>{{ item.recordDate }}</span>
          <button @click="deleteFood(item.id)">删除</button>
        </li>
      </ul>
      <p v-if="foodList.length === 0">暂无饮食记录</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '../utils/request'

const foodList = ref([])
const newFood = ref({
  foodName: '',
  calories: '',
  mealType: '午餐',
  recordDate: ''
})

const totalCalories = computed(() => {
  return foodList.value.reduce((sum, item) => sum + item.calories, 0)
})

const loadFood = async () => {
  try {
    const res = await request.get('/diet/list', {
      params: { userId: 1, date: newFood.value.recordDate || getToday() }
    })
    foodList.value = res.data.data || []
  } catch (e) {
    console.error('加载饮食记录失败', e)
  }
}

const addFood = async () => {
  if (!newFood.value.foodName || !newFood.value.calories || !newFood.value.recordDate) {
    alert('请填写完整信息')
    return
  }
  try {
    await request.post('/diet/add', {
      userId: 1,
      foodName: newFood.value.foodName,
      calories: Number(newFood.value.calories),
      mealType: newFood.value.mealType,
      recordDate: newFood.value.recordDate
    })
    alert('添加成功！')
    newFood.value.foodName = ''
    newFood.value.calories = ''
    loadFood()
  } catch (e) {
    alert('添加失败')
  }
}

const deleteFood = async (id) => {
  if (!confirm('确定删除吗？')) return
  try {
    await request.delete('/diet/delete', { params: { id, userId: 1 } })
    loadFood()
  } catch (e) {
    alert('删除失败')
  }
}

const getToday = () => {
  return new Date().toISOString().slice(0, 10)
}

onMounted(() => {
  newFood.value.recordDate = getToday()
  loadFood()
})
</script>

<style scoped>
.food-page { padding: 20px; }
.add-form { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.form-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.form-row input, .form-row select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; }
.form-row button { padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; }
.summary { background: #f0f4ff; padding: 12px 20px; border-radius: 8px; margin-bottom: 20px; }
.record-list ul { list-style: none; padding: 0; }
.record-list li { background: white; padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.record-list li button { margin-left: auto; padding: 4px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
</style>
