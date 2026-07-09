<template>
  <div class="target-page">
    <h2>🎯 健康目标</h2>
    
    <!-- 添加目标表单 -->
    <div class="add-target">
      <h3>设定新目标</h3>
      <div class="form-row">
        <select v-model="newTarget.goalType">
          <option value="">请选择目标类型</option>
          <option value="weight_loss">减重</option>
          <option value="weight_gain">增重</option>
          <option value="exercise">运动</option>
          <option value="diet">饮食</option>
          <option value="sleep">睡眠</option>
        </select>
        <input type="text" v-model="newTarget.title" placeholder="目标标题" />
        <input type="number" v-model="newTarget.targetValue" placeholder="目标值" />
        <input type="text" v-model="newTarget.unit" placeholder="单位 (如 kg, 分钟)" />
        <input type="date" v-model="newTarget.startDate" placeholder="开始日期" />
        <input type="date" v-model="newTarget.endDate" placeholder="结束日期" />
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
          <span>当前进度: {{ goal.currentValue || 0 }} {{ goal.unit }}</span>
          <span>状态: {{ goal.status || '进行中' }}</span>
          <button @click="deleteGoal(goal.id)">删除</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '../utils/request'

const goals = ref([])
const newTarget = reactive({
  title: '',
  goalType: '',
  targetValue: '',
  unit: '',
  startDate: '',
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
  if (!newTarget.title || !newTarget.goalType || !newTarget.targetValue || !newTarget.unit) {
    alert('请填写完整的目标信息（标题、类型、目标值、单位）')
    return
  }

  try {
    const res = await request.post('/goal', {
      title: newTarget.title,
      goalType: newTarget.goalType,
      targetValue: Number(newTarget.targetValue),
      unit: newTarget.unit,
      startDate: newTarget.startDate || null,
      endDate: newTarget.endDate || null
    })
    if (res.data.code === 200) {
      alert('目标添加成功！')
      newTarget.title = ''
      newTarget.goalType = ''
      newTarget.targetValue = ''
      newTarget.unit = ''
      newTarget.startDate = ''
      newTarget.endDate = ''
      loadGoals()
    } else {
      alert(res.data.message || '添加失败')
    }
  } catch (e) {
    alert('网络错误，请检查后端是否启动')
  }
}

const deleteGoal = async (id) => {
  if (!confirm('确定要删除这个目标吗？')) return
  try {
    const res = await request.delete(`/goal/${id}`)
    if (res.data.code === 200) {
      alert('删除成功')
      loadGoals()
    } else {
      alert(res.data.message || '删除失败')
    }
  } catch (e) {
    alert('网络错误')
  }
}

onMounted(() => {
  loadGoals()
})
</script>

<style scoped>
.target-page {
  padding: 20px;
}
.add-target {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.form-row input,
.form-row select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.form-row button {
  padding: 8px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.target-list ul {
  list-style: none;
  padding: 0;
}
.target-list li {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.target-list li strong {
  min-width: 80px;
}
.target-list li button {
  margin-left: auto;
  padding: 4px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
