<script setup>
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'edit-profile', 'logout'])

const auth = useAuthStore()

function close() {
  emit('update:modelValue', false)
}

function handleLogout() {
  emit('logout')
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="scrim" @click.self="close"></div>
    </Transition>

    <Transition name="slide">
      <aside v-if="modelValue" class="drawer" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <div class="drawer-header">
          <h2 id="profile-title">My Profile</h2>
          <button class="icon-btn" @click="close" aria-label="Close">✕</button>
        </div>

        <div class="profile-block">
          <img :src="auth.doctor.avatar" alt="" class="drawer-avatar" />
          <div class="profile-name">{{ auth.doctor.name }}</div>
          <span class="specialty-badge">{{ auth.doctor.specialty }}</span>
        </div>

        <div class="info-list">
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{ auth.doctor.email || '—' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone</span>
            <span class="info-value">{{ auth.doctor.phone || '—' }}</span>
          </div>
        </div>

        <div class="drawer-actions">
          <button class="btn-primary" @click="emit('edit-profile')">Edit Profile</button>
          <button class="btn-danger" @click="handleLogout">Log Out</button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  z-index: 100;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  max-width: 360px;
  background: #fff;
  z-index: 101;
  box-shadow: -12px 0 40px rgba(15, 23, 42, 0.15);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.drawer-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.icon-btn {
  border: none;
  background: #f1f5f9;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  color: #475569;
}

.profile-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 0 24px;
  border-bottom: 1px solid #f1f5f9;
}

.drawer-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 14px;
  background: #dbeafe;
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.specialty-badge {
  margin-top: 8px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
}

.info-list {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.info-value {
  font-size: 14px;
  color: #0f172a;
}

.drawer-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 11px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-danger {
  background: #fff;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 11px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.btn-danger:hover {
  background: #fef2f2;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 400px) {
  .drawer {
    padding: 18px;
  }
  .drawer-avatar {
    width: 72px;
    height: 72px;
  }
}
</style>