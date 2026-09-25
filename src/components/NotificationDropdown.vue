<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNotificationsStore } from '../stores/notifications'
import { timeAgo } from '../utils/time'

const store = useNotificationsStore()
const open = ref(false)
const rootEl = ref(null)

function toggle() {
  open.value = !open.value
}

function handleClickOutside(e) {
  if (open.value && rootEl.value && !rootEl.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="rootEl" class="notif-root">
    <button class="bell-btn" @click="toggle" aria-label="Notifications">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="store.unreadCount > 0" class="badge">{{ store.unreadCount }}</span>
    </button>

    <Transition name="dropdown">
      <div v-if="open" class="dropdown">
        <div class="dropdown-header">
          <span class="dropdown-title">Notifications</span>
          <button class="link-btn" @click="store.markAllRead()">Mark all as read</button>
        </div>

        <div v-if="store.sorted.length === 0" class="empty-state">No notifications</div>

        <ul v-else class="notif-list">
          <li
            v-for="n in store.sorted"
            :key="n.id"
            class="notif-item"
            :class="{ unread: !n.read }"
            @click="store.markRead(n.id)"
          >
            <div class="notif-dot" v-if="!n.read"></div>
            <div class="notif-body">
              <div class="notif-title">{{ n.title }}</div>
              <div class="notif-message">{{ n.message }}</div>
              <div class="notif-time">{{ timeAgo(n.createdAt) }}</div>
            </div>
          </li>
        </ul>

        <button v-if="store.sorted.length" class="clear-btn" @click="store.clearAll()">
          Clear all notifications
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notif-root {
  position: relative;
}

.bell-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #fff;
}

.dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 320px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
  border: 1px solid #f1f5f9;
  z-index: 60;
  overflow: hidden;
}

/* على الموبايل: نخلي الدروب داون يمتد شبه كامل الشاشة بدل عرض ثابت
   وبيتحاذى بمنتصف الشاشة تقريباً عشان مايخرجش برا الحواف */
@media (max-width: 420px) {
  .dropdown {
    position: fixed;
    top: 64px;
    left: 12px;
    right: 12px;
    width: auto;
    max-width: none;
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.dropdown-title {
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
}

.link-btn {
  border: none;
  background: none;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.empty-state {
  padding: 28px 16px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}

.notif-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
}

.notif-item:hover {
  background: #f8fafc;
}

.notif-item.unread {
  background: #eff6ff;
}

.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
  margin-top: 6px;
  flex-shrink: 0;
}

.notif-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.notif-message {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.notif-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
}

.clear-btn {
  width: 100%;
  border: none;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  padding: 12px;
  cursor: pointer;
}

.clear-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>