<script setup>
import AppSidebar from './AppSidebar.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />

    <div class="main-area">
      <main class="page-container">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.main-area {
  margin-inline-start: 240px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* نفس نقطة التوقف اللي في AppSidebar.vue: لما السايدبار يبقى عائم
   (off-canvas) على التابلت/الموبايل، مفيش داعي لهامش ثابت للمحتوى */
@media (max-width: 900px) {
  .main-area {
    margin-inline-start: 0;
  }
}
</style>