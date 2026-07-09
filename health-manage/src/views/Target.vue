<template>
  <div class="target-page">
    <h2>🎯 健康目标</h2>
    
    <!-- 添加目标表单 -->
    <div class="add-target">
      <h3>设定新目标</h3>
      <div class="form-row">
        <select v-model="newTarget.type">
          <option value="">请选择目标类型</option>
          <option value="WEIGHT">体重目标</option>
          <option value="EXERCISE">每周运动次数</option>
          <option value="STEPS">每日步数</option>
        </select>
        <input type="number" v-model="newTarget.value" placeholder="目标值" />
        <input type="date" v-model="newTarget.deadline" />
        <button @click="addTarget">添加目标</button>
      </div>
    </div>

    <!-- 目标列表 -->
    <div class="target-list">
      <h3>我的目标</h3>
      <div v-for="item in targets" :key="item.id" class="target-card">
        <div class="target-info">
          <span class="target-type">{{ item.type }}</span>
          <span class="target-value">目标：{{ item.value }}</span>
          <span class="target-current">当前：{{ item.current }}</span>
          <span class="target-deadline">截止：{{ item.deadline }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
          <span class="progress-text">{{ item.progress }}%</span>
        </div>
        <button @click="deleteTarget(item.id)" class="delete-btn">删除</button>
      </div>
      <div v-if="targets.length === 0" class="empty-tip">暂无目标，赶快设定一个吧！</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'

// 目标列表
const targets = ref([])

// 新目标表单
const newTarget = reactive({
  type: '',
  value: '',
  deadline: ''
})

// 加载目标列表
const loadTargets = async () => {
  try {
    const res = await axios.get('/api/goal/list')
    if (res.data.code === 0) {
      targets.value = res.data.data || []
    } else {
      alert(res.data.msg || '加载目标列表失败')
    }
  } catch (error) {
    alert('网络错误，请确认后端已启动')
  }
}

// 添加目标
const addTarget = async () => {
  if (!newTarget.type || !newTarget.value || !newTarget.deadline) {
    alert('请完整填写目标信息')
    return
  }

  try {
    const res = await axios.post('/api/goal', {
      targetType: newTarget.type,
      targetValue: newTarget.value,
      deadline: newTarget.deadline
    })
    if (res.data.code === 0) {
      alert('目标添加成功')
      newTarget.type = ''
      newTarget.value = ''
      newTarget.deadline = ''
      loadTargets()
    } else {
      alert(res.data.msg || '添加失败')
    }
  } catch (error) {
    alert('网络错误，请确认后端已启动')
  }
}

// 删除目标
const deleteTarget = async (id) => {
  if (!confirm('确定要删除这个目标吗？')) return

  try {
    const res = await axios.delete(`/api/goal/${id}`)
    if (res.data.code === 0) {
      alert('删除成功')
      loadTargets()
    } else {
      alert(res.data.msg || '删除失败')
    }
  } catch (error) {
    alert('网络错误，请确认后端已启动')
  }
}

onMounted(() => {
  loadTargets()
})
</script>

<style scoped>
.target-page h2 {
  margin-bottom: 20px;
  color: #333;
}
.add-target {
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 24px;
}
.add-target h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #555;
}
.form-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.form-row select,
.form-row input {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  flex: 1;
  min-width: 120px;
}
.form-row select:focus,
.form-row input:focus {
  outline: none;
  border-color: #667eea;
}
.form-row button {
  padding: 10px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.form-row button:hover {
  background: #5a6fd6;
}
.target-list h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #555;
}
.target-card {
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 12px;
}
.target-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}
.target-type {
  font-weight: 600;
  color: #333;
}
.progress-bar {
  height: 24px;
  background: #e9ecef;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 12px;
  transition: width 0.3s;
}
.progress-text {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 600;
  color: #333;
}
.delete-btn {
  margin-top: 10px;
  padding: 6px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.delete-btn:hover {
  background: #c82333;
}
.empty-tip {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 16px;
}
</style>