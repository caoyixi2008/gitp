<template>
  <div class="target-page">
    <h2>🎯 健康目标</h2>

    <!-- 添加目标表单 -->
    <div class="add-target">
      <h3>设定新目标</h3>
      <div class="form-row">
        <input type="text" v-model="newTarget.title" placeholder="目标标题" />
        <select v-model="newTarget.goalType">
          <option value="weight_loss">减重</option>
          <option value="weight_gain">增重</option>
          <option value="exercise">运动</option>
          <option value="diet">饮食</option>
          <option value="sleep">睡眠</option>
        </select>
        <input type="number" v-model="newTarget.targetValue" placeholder="目标值" />
        <input type="text" v-model="newTarget.unit" placeholder="单位 (kg/分钟)" />
        <input type="date" v-model="newTarget.endDate" />
        <button @click="addGoal">添加目标</button>
      </div>
    </div>

    <!-- 目标列表 -->
    <div class="target-list">
      <h3>我的目标</h3>
      <ul>
        <li v-for="goal in goals" :key="goal.id">
          <strong>{{ goal.title }}</strong>
          <span>类型: {{ goal.goalType }}</span>
          <span>目标值: {{ goal.targetValue }} {{ goal.unit }}</span>
          <span>进度: {{ goal.currentValue || 0 }} {{ goal.unit }}</span>
          <span>状态: {{ goal.status || '进行中' }}</span>
          <button @click="deleteGoal(goal.id)">删除</button>
        </li>
      </ul>
      <p v-if="goals.length === 0">暂无目标</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '../utils/request'

const goals = ref([])
const newTarget = reactive({
  title: '',
  goalType: 'weight_loss',
  targetValue: '',
  unit: 'kg',
  endDate: ''
})

const loadGoals = async () => {
  try {
    const res = await request.get('/goal/list')
    goals.value = res.data.data || []
  } catch (e) {
    console.error('加载目标失败', e)
  }
}

const addGoal = async () => {
  if (!newTarget.title || !newTarget.targetValue) {
    alert('请填写完整信息')
    return
  }
  try {
    await request.post('/goal', {
      title: newTarget.title,
      goalType: newTarget.goalType,
      targetValue: Number(newTarget.targetValue),
      unit: newTarget.unit || 'kg',
      endDate: newTarget.endDate || null
    })
    alert('添加成功！')
    newTarget.title = ''
    newTarget.targetValue = ''
    loadGoals()
  } catch (e) {
    alert('添加失败')
  }
}

const deleteGoal = async (id) => {
  if (!confirm('确定删除吗？')) return
  try {
    await request.delete(`/goal/${id}`)
    loadGoals()
  } catch (e) {
    alert('删除失败')
  }
}

onMounted(() => {
  loadGoals()
})
</script>

<style scoped>
.target-page { padding: 20px; max-width: 800px; margin: 0 auto; }
.add-target { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.form-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.form-row input, .form-row select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; }
.form-row button { padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; }
.target-list ul { list-style: none; padding: 0; }
.target-list li { background: white; padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.target-list li button { margin-left: auto; padding: 4px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
</style>
