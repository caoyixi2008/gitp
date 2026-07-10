<template>
  <div class="report-page">
    <h2>📊 健康报表</h2>

    <div class="filter-row">
      <label>选择日期：</label>
      <input type="date" v-model="selectedDate" @change="loadReport" />
    </div>

    <!-- 柱状图 -->
    <div class="chart-container">
      <div ref="chartRef" class="chart"></div>
    </div>

    <!-- 汇总卡片 -->
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

    <!-- 运动记录 -->
    <div class="section">
      <h3>🏃 运动记录（{{ selectedDate }}）</h3>
      <ul>
        <li v-for="item in sportList" :key="item.id">
          {{ item.sportType }} - {{ item.duration }} 分钟 - 🔥 {{ item.calories }} 千卡
        </li>
        <li v-if="sportList.length === 0">暂无运动记录</li>
      </ul>
    </div>

    <!-- 饮食记录 -->
    <div class="section">
      <h3>🍔 饮食记录（{{ selectedDate }}）</h3>
      <ul>
        <li v-for="item in dietList" :key="item.id">
          {{ item.foodName }} - {{ item.calories }} 千卡 - {{ item.mealType }}
        </li>
        <li v-if="dietList.length === 0">暂无饮食记录</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import request from '../utils/request'
import * as echarts from 'echarts'

const sportList = ref([])
const dietList = ref([])
const selectedDate = ref('')
const chartRef = ref(null)
let chartInstance = null

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

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance) return
  const option = {
    title: {
      text: '今日摄入 vs 消耗',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['摄入', '消耗', '净摄入'],
      axisLabel: { fontSize: 14 }
    },
    yAxis: {
      type: 'value',
      name: '千卡',
      nameTextStyle: { fontSize: 13 }
    },
    series: [
      {
        name: '热量',
        type: 'bar',
        data: [
          { value: totalIntake.value, itemStyle: { color: '#f39c12' } },
          { value: totalBurned.value, itemStyle: { color: '#3498db' } },
          { value: netCalories.value, itemStyle: { color: netCalories.value >= 0 ? '#2ecc71' : '#e74c3c' } }
        ],
        barWidth: '40%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c} 千卡',
          fontSize: 13
        }
      }
    ]
  }
  chartInstance.setOption(option)
  chartInstance.resize()
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

    await nextTick()
    updateChart()
  } catch (e) {
    console.error('加载报表失败', e)
  }
}

watch([totalIntake, totalBurned, netCalories], () => {
  updateChart()
})

onMounted(async () => {
  selectedDate.value = getToday()
  await loadReport()
  setTimeout(initChart, 100)
})

window.addEventListener('resize', () => {
  chartInstance?.resize()
})
</script>

<style scoped>
.report-page { padding: 20px; max-width: 900px; margin: 0 auto; }
.filter-row { margin-bottom: 20px; display: flex; gap: 12px; align-items: center; }
.filter-row input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; }

.chart-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.chart {
  width: 100%;
  height: 320px;
}

.summary-cards { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.summary-cards .card { background: white; padding: 16px 24px; border-radius: 12px; flex: 1; min-width: 120px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.card-label { font-size: 14px; color: #888; }
.card-value { font-size: 24px; font-weight: 700; }
.card-value.negative { color: #e74c3c; }

.section { background: white; padding: 16px 20px; border-radius: 12px; margin-bottom: 16px; }
.section h3 { margin-bottom: 12px; }
.section ul { list-style: none; padding: 0; }
.section li { padding: 8px 0; border-bottom: 1px solid #f1f3f5; }
</style>
