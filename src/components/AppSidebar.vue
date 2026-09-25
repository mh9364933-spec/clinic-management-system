<script setup>
import { useUiStore } from '../stores/ui'

const ui = useUiStore()

// على الموبايل: قفل السايدبار تلقائي بعد ما يدوس المستخدم على أي رابط
function handleLinkClick() {
  ui.closeSidebar()
}
</script>

<template>
  <!-- خلفية شفافة تظهر فقط على الموبايل/التابلت لما السايدبار يكون مفتوح -->
  <Transition name="fade">
    <div v-if="ui.isSidebarOpen" class="sidebar-overlay" @click="ui.closeSidebar()"></div>
  </Transition>

  <aside class="sidebar" :class="{ 'is-open': ui.isSidebarOpen }">
    <div class="logo">
      <div class="logo-icon">
        <i class="bi bi-heart-pulse"></i>
      </div>

      <div>
        <strong>MediCare</strong>
        <span>Clinic Dashboard</span>
      </div>
    </div>

    <nav>
      <p class="menu-title">MAIN MENU</p>

      <router-link to="/dashboard" @click="handleLinkClick">
        <i class="bi bi-grid"></i>
        Dashboard
      </router-link>

      <router-link to="/patients" @click="handleLinkClick">
        <i class="bi bi-people"></i>
        Patients
      </router-link>

      <router-link to="/appointments" @click="handleLinkClick">
        <i class="bi bi-calendar2-week"></i>
        Appointments
      </router-link>
    </nav>

    <div class="sidebar-bottom">
      <div class="clinic-status">
        <span class="online-dot"></span>
        <div>
          <strong>Clinic Online</strong>
          <small>System operational</small>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* هذا البلوك بيضيف بس سلوك الموبايل (off-canvas) فوق التصميم الأساسي
   الموجود في الـ CSS العام بتاع المشروع، من غير ما يغيّر شكل السايدبار
   على الديسكتوب خالص */

.sidebar-overlay {
  display: none;
}

/* تحديد بسيط لتظليل الرابط النشط تلقائياً حسب الصفحة الحالية،
   Vue Router بيضيف الكلاس ده لوحده بدون أي كود إضافي */
.sidebar nav a.router-link-active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 240px;
    max-width: 80vw;
    z-index: 70;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 8px 0 30px rgba(15, 23, 42, 0.15);
    overflow-y: auto;
  }

  .sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    z-index: 65;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>