<template>

  <div class="app-layout">

    <AppSidebar />

    <div class="main-area">

      <AppNavbar />

      <main>

        <router-view />

      </main>

    </div>

  </div>

</template>

<script setup>

import AppSidebar from "./components/AppSidebar.vue";
import AppNavbar from "./components/AppNavbar.vue";

</script>