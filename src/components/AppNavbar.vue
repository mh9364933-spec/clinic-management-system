
  <script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useNotificationsStore } from '../stores/notifications'
import { useUiStore } from '../stores/ui'
import LoginModal from './LoginModal.vue'
import ProfileDrawer from './ProfileDrawer.vue'
import NotificationDropdown from './NotificationDropdown.vue'

const auth = useAuthStore()
const notifications = useNotificationsStore()
const ui = useUiStore()

const showLoginModal = ref(false)
const showProfileDrawer = ref(false)

function handleLogin(profile) {
  auth.login(profile)
  notifications.push('Logged in', `Welcome back, ${profile.name}.`)
}

function handleLogout() {
  auth.logout()
  notifications.push('Logged out', 'You have been signed out of MediCare.')
}

function handleEditProfile() {
  showProfileDrawer.value = false
  showLoginModal.value = true
}
</script>

<template>
  <div>
    <header class="topbar">
      <div class="topbar-left">
        <!-- يظهر فقط على الموبايل والتابلت لفتح/قفل القائمة الجانبية -->
        <button class="menu-btn" @click="ui.toggleSidebar()" aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div class="brand">
          <div class="brand-title">Medical Center</div>
          <div class="brand-subtitle">Clinic Management System</div>
        </div>
      </div>

      <div class="topbar-right">
        <NotificationDropdown v-if="auth.isAuthenticated" />

        <button v-if="!auth.isAuthenticated" class="login-btn" @click="showLoginModal = true">
          Log In
        </button>

        <button v-else class="profile-btn" @click="showProfileDrawer = true">
          <img :src="auth.doctor.avatar" alt="" class="profile-avatar" />
          <span class="profile-text">
            <span class="profile-name">{{ auth.doctor.name }}</span>
            <span class="profile-role">{{ auth.doctor.specialty || 'Doctor' }}</span>
          </span>
        </button>
      </div>
    </header>

    <LoginModal v-model="showLoginModal" @submit="handleLogin" />
    <ProfileDrawer
      v-model="showProfileDrawer"
      @logout="handleLogout"
      @edit-profile="handleEditProfile"
    />
  </div>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 32px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 40;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0; /* allows brand text to truncate instead of overflowing */
}

.menu-btn {
  display: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  background: #f1f5f9;
  color: #334155;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.brand {
  min-width: 0;
}

.brand-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-subtitle {
  font-size: 13px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.login-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.login-btn:hover {
  background: #1d4ed8;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 10px;
  min-width: 0;
}

.profile-btn:hover {
  background: #f8fafc;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #dbeafe;
  flex-shrink: 0;
}

.profile-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
  min-width: 0;
}

.profile-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.profile-role {
  font-size: 12px;
  color: #94a3b8;
}

/* Tablet: show the hamburger, tighten padding */
@media (max-width: 900px) {
  .topbar {
    padding: 14px 20px;
  }
  .menu-btn {
    display: flex;
  }
}

/* Mobile: hide the subtitle and the doctor's name/specialty text,
   keep just the avatar + bell so nothing overflows a small screen */
@media (max-width: 560px) {
  .topbar {
    padding: 12px 14px;
  }
  .brand-subtitle {
    display: none;
  }
  .brand-title {
    font-size: 17px;
  }
  .profile-text {
    display: none;
  }
  .login-btn {
    padding: 9px 16px;
    font-size: 13px;
  }
}
</style>