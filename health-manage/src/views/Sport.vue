<template>
  <div class="sport-page">
    <h2>🏃 运动记录</h2>

    <!-- 添加运动表单 -->
    <div class="add-form">
      <h3>记录运动</h3>
      <div class="form-row">
        <select v-model="newSport.sportType" @change="onSportTypeChange">
          <option value="">选择运动类型</option>
          <option value="跑步">跑步</option>
          <option value="游泳">游泳</option>
          <option value="跳绳">跳绳</option>
          <option value="走路">走路</option>
          <option value="爬山">爬山</option>
          <option value="骑自行车">骑自行车</option>
          <option value="打篮球">打篮球</option>
          <option value="打羽毛球">打羽毛球</option>
          <option value="瑜伽">瑜伽</option>
          <option value="快走">快走</option>
          <option value="自定义">✏️ 自定义</option>
        </select>

        <input v-if="newSport.sportType === '自定义'"
               v-model="newSport.customSportName"
               placeholder="输入运动名称"
               class="custom-input" />

        <input type="number" v-model="newSport.duration" placeholder="时长(分钟)" />
        <input type="date" v-model="newSport.recordDate" />

        <input v-if="newSport.sportType === '自定义'"
               type="number"
               v-model="newSport.customCaloriesPerMin"
               placeholder="消耗(千卡/分钟)"
               class="custom-input" />

        <button @click="addSport">添加</button>
      </div>
      <p v-if="newSport.sportType === '自定义'" class="hint">
        💡 消耗量 = 时长 × 消耗系数
      </p>
    </div>

    <!-- 今日汇总 -->
    <div class="summary">
      <span>今日总消耗：<strong>{{ totalCalories }}</strong> 千卡</span>
    </div>

    <!-- 运动列表 -->
    <div class="record-list">
      <h3>今日运动</h3>
      <ul>
        <li v-for="item in sportList" :key="item.id">
          <span class="sport-name">{{ item.sportType }}</span>
          <span v-if="item.isCustom" class="custom-badge">✏️ 自定义</span>
          <span>{{ item.duration }} 分钟</span>
          <span>🔥 {{ item.calories }} 千卡</span>
          <span>{{ item.recordDate }}</span>
          <button @click="deleteSport(item.id)">删除</button>
        </li>
      </ul>
      <p v-if="sportList.length === 0">暂无运动记录</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '../utils/request'

const sportList = ref([])
const newSport = ref({
  sportType: '',
  customSportName: '',
  duration: '',
  recordDate: '',
  customCaloriesPerMin: ''
})

const totalCalories = computed(() => {
  return sportList.value.reduce((sum, item) => sum + (item.calories || 0), 0)
})

const presetCalories = {
  '跑步': 10,
  '游泳': 8,
  '跳绳': 12,
  '走路': 4,
  '爬山': 7,
  '骑自行车': 6,
  '打篮球': 8,
  '打羽毛球': 7,
  '瑜伽': 3,
  '快走': 5
}

const onSportTypeChange = () => {}

const loadSport = async () => {
  try {
    const res = await request.get('/sport/list', {
      params: { userId: 1, date: newSport.value.recordDate || getToday() }
    })
    sportList.value = res.data.data || []
  } catch (e) {
    console.error('加载运动记录失败', e)
  }
}

const addSport = async () => {
  let sportType = newSport.value.sportType
  let caloriesPerMin = presetCalories[sportType] || 5
  let isCustom = false

  if (sportType === '自定义') {
    if (!newSport.value.customSportName) {
      alert('请输入运动名称')
      return
    }
    if (!newSport.value.customCaloriesPerMin || newSport.value.customCaloriesPerMin <= 0) {
      alert('请输入有效的消耗系数（千卡/分钟）')
      return
    }
    sportType = newSport.value.customSportName
    caloriesPerMin = Number(newSport.value.customCaloriesPerMin)
    isCustom = true
  }

  if (!sportType || !newSport.value.duration || !newSport.value.recordDate) {
    alert('请填写完整信息')
    return
  }

  const calories = Math.round(Number(newSport.value.duration) * caloriesPerMin)

  try {
    const res = await request.post('/sport/add', {
      userId: 1,
      sportType: sportType,
      duration: Number(newSport.value.duration),
      calories: calories,
      recordDate: newSport.value.recordDate
    })
    if (res.data.code === 0) {
      alert('添加成功！')
      newSport.value.sportType = ''
      newSport.value.customSportName = ''
      newSport.value.duration = ''
      newSport.value.customCaloriesPerMin = ''
      loadSport()
    } else {
      alert(res.data.message || '添加失败')
    }
  } catch (e) {
    alert('添加失败')
  }
}

const deleteSport = async (id) => {
  if (!confirm('确定删除吗？')) return
  try {
    await request.delete('/sport/delete', { params: { id, userId: 1 } })
    loadSport()
  } catch (e) {
    alert('删除失败')
  }
}

const getToday = () => {
  return new Date().toISOString().slice(0, 10)
}

onMounted(() => {
  newSport.value.recordDate = getToday()
  loadSport()
})
</script>

<style scoped>
.sport-page { padding: 20px; max-width: 800px; margin: 0 auto; }
.add-form { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.form-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.form-row select, .form-row input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
.form-row select { min-width: 130px; }
.form-row input { min-width: 100px; }
.form-row .custom-input { min-width: 140px; }
.form-row button { padding: 8px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.hint { font-size: 12px; color: #888; margin-top: 6px; }
.summary { background: #f0f4ff; padding: 12px 20px; border-radius: 8px; margin-bottom: 20px; font-size: 16px; }
.record-list ul { list-style: none; padding: 0; }
.record-list li { background: white; padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.record-list li .sport-name { font-weight: 600; min-width: 60px; }
.record-list li .custom-badge { font-size: 11px; background: #f0f0f0; padding: 2px 8px; border-radius: 10px; color: #666; }
.record-list li button { margin-left: auto; padding: 4px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
</style>
