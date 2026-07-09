<template>
  <div class="report-page">
    <h2>📊 健康报表</h2>

    <div class="filter-row">
      <input type="date" v-model="selectedDate" @change="loadReport" />
    </div>

    <div class="summary-cards">
      <div class="card">
        <div class="card-label">🍽️ 总摄入</div>
        <div class="card-value">{{ totalIntake }} 千卡</div>
      </div>
      <div class="card">
        <div class="card-label">🏃 总消耗</div>
        <div class="card-value">{{ totalBurned }} 千卡</div>
      </div>
      <div class="card">
        <div class="card-label">⚖️ 净摄入</div>
        <div class="card-value" :class="{ negative: netCalories < 0 }">
          {{ netCalories }} 千卡
        </div>
      </div>
    </div>

    <div class="section">
      <h3>🏃 运动记录</h3>
      <ul>
        <li v-for="item in sportList" :key="item.id">
          {{ item.sportType }} - {{ item.duration }} 分钟 - 🔥 {{ item.calories }} 千卡 - {{ item.recordDate }}
        </li>
        <li v-if="sportList.length === 0">暂无运动记录</li>
      </ul>
    </div>

    <div class="section">
      <h3>🍔 饮食记录</h3>
      <ul>
        <li v-for="item in dietList" :key="item.id">
          {{ item.foodName }} - {{ item.calories }} 千卡 - {{ item.mealType }} - {{ item.recordDate }}
        </li>
        <li v-if="dietList.length === 0">暂无饮食记录</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '../utils/request'

const sportList = ref([])
const dietList = ref([])
const selectedDate = ref('')

const totalIntake = computed(() => {
  return dietList.value.reduce((sum, item) => sum + item.calories, 0)
})

const totalBurned = computed(() => {
  return sportList.value.reduce((sum, item) => sum + item.calories, 0)
})

const netCalories = computed(() => {
  return totalIntake.value - totalBurned.value
})

const getToday = () => {
  return new Date().toISOString().slice(0, 10)
}

const loadReport = async () => {
  const date = selectedDate.value || getToday()
  try {
    const sportRes = await request.get('/sport/list', {
      params: { userId: 1, date }
    })
    sportList.value = sportRes.data.data || []

    const dietRes = await request.get('/diet/list', {
      params: { userId: 1, date }
    })
    dietList.value = dietRes.data.data || []
  } catch (e) {
    console.error('加载报表失败', e)
  }
}

onMounted(() => {
  selectedDate.value = getToday()
  loadReport()
})
</script>

<style scoped>
.report-page { padding: 20px; }
.filter-row { margin-bottom: 20px; }
.filter-row input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; }
.summary-cards { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.summary-cards .card { background: white; padding: 16px 24px; border-radius: 12px; flex: 1; min-width: 120px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.card-label { font-size: 14px; color: #888; }
.card-value { font-size: 24px; font-weight: 700; }
.card-value.negative { color: #e74c3c; }
.section { background: white; padding: 16px 20px; border-radius: 12px; margin-bottom: 16px; }
.section ul { list-style: none; padding: 0; }
.section li { padding: 8px 0; border-bottom: 1px solid #f1f3f5; }
</style>
