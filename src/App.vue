<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/AppNavbar.vue'
</script>

<template>
  <div class="app-shell">
    <!-- الشريط العلوي يظل ثابتاً في كل الصفحات -->
    <NavBar />

    <!-- هنا يتم عرض الصفحة الحالية حسب الرابط (Dashboard, Patients, Appointments...) -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}


</style>
