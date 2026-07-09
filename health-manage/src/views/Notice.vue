<template>
  <div class="notice-page">
    <h2>🔔 健康提醒</h2>
    
    <div class="tabs">
      <button @click="filter = 'all'" :class="{ active: filter === 'all' }">全部</button>
      <button @click="filter = 'unread'" :class="{ active: filter === 'unread' }">未读</button>
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
        <button v-if="item.isRead === 0" @click="markAsRead(item.id)" class="read-btn">标记已读</button>
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

onMounted(() => {
  loadNotices()
})
</script>

<style scoped>
.notice-page { padding: 20px; }
.tabs { display: flex; gap: 10px; margin-bottom: 20px; }
.tabs button { padding: 8px 20px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; }
.tabs button.active { background: #667eea; color: white; border-color: #667eea; }
.notice-item { background: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.notice-item.unread { border-left: 4px solid #667eea; }
.notice-title { font-weight: 600; margin-bottom: 4px; }
.notice-body { color: #555; font-size: 14px; margin-bottom: 6px; }
.notice-meta { display: flex; gap: 16px; font-size: 12px; color: #999; }
.read-btn { padding: 4px 14px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; }
</style>
