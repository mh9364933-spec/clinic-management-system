<template>

  <aside class="sidebar">

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

      <p class="menu-title">
        MAIN MENU
      </p>

      <router-link to="/dashboard">

        <i class="bi bi-grid"></i>

        Dashboard

      </router-link>

      <router-link to="/patients">

        <i class="bi bi-people"></i>

        Patients

      </router-link>

      <router-link to="/appointments">

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