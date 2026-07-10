<template>
  <div class="notice-page">
    <h2>🔔 健康提醒</h2>

    <div class="toolbar">
      <div class="tabs">
        <button @click="filter = 'all'" :class="{ active: filter === 'all' }">全部</button>
        <button @click="filter = 'unread'" :class="{ active: filter === 'unread' }">未读</button>
      </div>
      <button @click="generateReminder" class="gen-btn">⚡ 生成提醒</button>
    </div>

    <div class="notice-list">
      <div v-for="item in filteredList" :key="item.id" class="notice-item" :class="{ unread: item.isRead === 0 }">
        <div class="notice-content">
          <div class="notice-title">{{ item.title }}</div>
          <div class="notice-body">{{ item.content }}</div>
          <div class="notice-meta">
            <span>{{ item.noticeType || '健康' }}</span>
            <span>{{ item.createdAt }}</span>
          </div>
        </div>
        <div class="notice-actions">
          <button v-if="item.isRead === 0" @click="markAsRead(item.id)" class="read-btn">标记已读</button>
          <button @click="deleteNotice(item.id)" class="delete-btn">删除</button>
        </div>
      </div>
      <p v-if="filteredList.length === 0">暂无提醒</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '../utils/request'

const notices = ref([])
const filter = ref('all')
const generating = ref(false)

const filteredList = computed(() => {
  if (filter.value === 'unread') {
    return notices.value.filter(item => item.isRead === 0)
  }
  return notices.value
})

const loadNotices = async () => {
  try {
    const res = await request.get('/notice/list', { params: { userId: 1 } })
    notices.value = res.data.data || []
  } catch (e) {
    console.error('加载提醒失败', e)
  }
}

const markAsRead = async (id) => {
  try {
    await request.put('/notice/read', null, { params: { id, userId: 1 } })
    loadNotices()
  } catch (e) {
    alert('操作失败')
  }
}

const deleteNotice = async (id) => {
  if (!confirm('确定删除这条提醒吗？')) return
  try {
    await request.delete('/notice/delete', { params: { id, userId: 1 } })
    loadNotices()
  } catch (e) {
    alert('删除失败')
  }
}

const generateReminder = async () => {
  generating.value = true
  try {
    const today = new Date().toISOString().slice(0, 10)
    const sportRes = await request.get('/sport/list', { params: { userId: 1, date: today } })
    const sportList = sportRes.data.data || []
    const totalSport = sportList.reduce((sum, item) => sum + item.duration, 0)

    const dietRes = await request.get('/diet/list', { params: { userId: 1, date: today } })
    const dietList = dietRes.data.data || []
    const totalCal = dietList.reduce((sum, item) => sum + item.calories, 0)

    let generated = 0
    if (totalSport < 30) {
      await request.post('/notice/add', {
        userId: 1,
        title: '🏃 运动提醒',
        content: `今日运动仅 ${totalSport} 分钟，建议运动 30 分钟以上！`,
        noticeType: '运动'
      })
      generated++
    }
    if (totalCal > 2000) {
      await request.post('/notice/add', {
        userId: 1,
        title: '🍔 饮食提醒',
        content: `今日摄入 ${totalCal} 千卡，建议控制在 2000 千卡以内！`,
        noticeType: '饮食'
      })
      generated++
    }
    if (generated === 0) {
      await request.post('/notice/add', {
        userId: 1,
        title: '✅ 健康日报',
        content: `今日运动 ${totalSport} 分钟，摄入 ${totalCal} 千卡，继续保持！`,
        noticeType: '健康'
      })
    }
    alert(`生成了 ${generated || 1} 条提醒！`)
    loadNotices()
  } catch (e) {
    console.error('生成提醒失败', e)
    alert('生成提醒失败，请检查后端是否启动')
  } finally {
    generating.value = false
  }
}

onMounted(() => {
  loadNotices()
})
</script>

<style scoped>
.notice-page { padding: 20px; max-width: 800px; margin: 0 auto; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.tabs { display: flex; gap: 10px; }
.tabs button { padding: 8px 20px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; }
.tabs button.active { background: #667eea; color: white; border-color: #667eea; }
.gen-btn { padding: 8px 20px; background: #2ecc71; color: white; border: none; border-radius: 6px; cursor: pointer; }
.gen-btn:hover { background: #27ae60; }
.gen-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.notice-item { background: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
.notice-item.unread { border-left: 4px solid #667eea; }
.notice-title { font-weight: 600; margin-bottom: 4px; }
.notice-body { color: #555; font-size: 14px; margin-bottom: 6px; }
.notice-meta { display: flex; gap: 16px; font-size: 12px; color: #999; }
.notice-actions { display: flex; gap: 8px; }
.read-btn { padding: 4px 14px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; }
.delete-btn { padding: 4px 14px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
.delete-btn:hover { background: #c0392b; }
</style>
