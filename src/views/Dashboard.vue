<template>
  <div class="layout">
    <!-- استخدام AppSidebar المعتمد في المشروع -->
    <AppSidebar
      :is-open="isSidebarOpen"
      active-key="dashboard"
      @close="isSidebarOpen = false"
      @navigate="handleNavigate"
    />

    <div class="main-area">
      <!-- استخدام AppNavbar المعتمد في المشروع -->
      <AppNavbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="page-container">
        <!-- Welcome Section -->
        <div class="page-header">
          <div>
            <h2>Welcome back, Dr. Sarah 👋</h2>
            <p class="welcome-sub">Here's what's happening at the clinic today, {{ todayLabel }}</p>
          </div>
          <button class="primary-btn" @click="goToAddPatient">
            <i class="bi bi-plus-lg"></i>
            Add Patient
          </button>
        </div>

        <div v-if="loading" class="loading-box">Loading dashboard data...</div>
        <div v-if="errorMsg" class="empty-box"><i class="bi bi-exclamation-triangle"></i><p>{{ errorMsg }}</p></div>

        <!-- Statistics Cards باستخدام مكون StatCard الخاص بزميلك -->
        <section class="stats-grid">
          <StatCard
            title="Total Patients"
            :value="stats.totalPatients"
            icon="bi-people"
          />
          <StatCard
            title="Today's Appointments"
            :value="stats.todayAppointments"
            icon="bi-calendar3"
          />
          <StatCard
            title="Waiting Patients"
            :value="stats.waitingPatients"
            icon="bi-hourglass-split"
          />
          <StatCard
            title="Completed Appointments"
            :value="stats.completedAppointments"
            icon="bi-check-circle"
          />
        </section>

        <!-- Two-column: Appointments + Waiting -->
        <section class="content-grid">
          <!-- Today's Appointments -->
          <div class="dashboard-card">
            <div class="card-title-row">
              <div>
                <h4>Today's Appointments</h4>
                <p>{{ todaysAppointments.length }} appointment(s)</p>
              </div>
              <i class="bi bi-calendar3"></i>
            </div>

            <div v-if="todaysAppointments.length" class="history-list">
              <div
                v-for="appointment in todaysAppointments"
                :key="appointment.id"
                class="history-row"
              >
                <div>
                  <strong>{{ appointment.time }}</strong>
                </div>
                <div class="appt-patient">
                  {{ patientName(appointment.patient_id) }}
                  <span class="appt-reason" v-if="appointment.reason">— {{ appointment.reason }}</span>
                </div>
                <StatusBadge :status="appointment.status" />
              </div>
            </div>
            <div v-else-if="!loading" class="empty-box">
              <i class="bi bi-calendar-x"></i>
              <p>No appointments for today.</p>
            </div>
          </div>

          <!-- Waiting Patients -->
          <div class="dashboard-card">
            <div class="card-title-row">
              <div>
                <h4>Waiting List</h4>
                <p>{{ waitingList.length }} patient(s)</p>
              </div>
              <i class="bi bi-hourglass-split"></i>
            </div>

            <div v-if="waitingList.length" class="waiting-list">
              <PatientCard
                v-for="entry in waitingList"
                :key="entry.appointment.id"
                :patient="entry.patient"
                :appointment="entry.appointment"
              />
            </div>
            <div v-else-if="!loading" class="empty-box">
              <i class="bi bi-person-check"></i>
              <p>No patients currently waiting.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// تعديل المسارات وأسماء المكونات للتوافق مع شجرة المشروع
import AppSidebar from '../components/AppSidebar.vue'
import AppNavbar from '../components/AppNavbar.vue'
import StatCard from '../components/StatCard.vue'
import PatientCard from '../components/PatientCard.vue'
import StatusBadge from '../components/StatusBadge.vue'

const router = useRouter()
const isSidebarOpen = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const patients = ref([])
const appointments = ref([])

const todayLabel = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
)

const patientsById = computed(() => {
  const map = {}
  patients.value.forEach(p => { map[p.id] = p })
  return map
})

function patientName(patientId) {
  return patientsById.value[patientId]?.name || 'Unknown patient'
}

const todaysAppointments = computed(() => {
  const todayISO = new Date().toISOString().slice(0, 10)
  return appointments.value.filter(a => !a.date || a.date === todayISO)
})

const waitingList = computed(() =>
  todaysAppointments.value
    .filter(a => a.status === 'waiting')
    .map(a => ({ appointment: a, patient: patientsById.value[a.patient_id] }))
    .filter(entry => entry.patient)
)

const stats = reactive({
  totalPatients: 0,
  todayAppointments: 0,
  waitingPatients: 0,
  completedAppointments: 0,
})

function recalcStats() {
  stats.totalPatients = patients.value.length
  stats.todayAppointments = todaysAppointments.value.length
  stats.waitingPatients = waitingList.value.length
  stats.completedAppointments = todaysAppointments.value.filter(
    a => a.status === 'completed'
  ).length
}

// تعديل جلب البيانات باستخدام fetch ليتوافق مع طريقة api.js
async function fetchDashboardData() {
  loading.value = true
  errorMsg.value = ''
  try {
    const [patientsRes, appointmentsRes] = await Promise.all([
      fetch('http://localhost:3000/api/patients'),
      fetch('http://localhost:3000/api/appointments')
    ])

    if (!patientsRes.ok || !appointmentsRes.ok) {
      throw new Error('Failed to fetch data')
    }

    patients.value = await patientsRes.data ? await patientsRes.json() : []
    appointments.value = await appointmentsRes.data ? await appointmentsRes.json() : []
    
    recalcStats()
  } catch (error) {
    errorMsg.value = 'Failed to load dashboard data.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

function goToAddPatient() {
  router.push('/patients/add')
}

function handleNavigate(key) {
  const routeMap = {
    dashboard: '/dashboard',
    patients: '/patients',
    appointments: '/appointments',
    reports: '/reports',
    settings: '/settings',
  }
  if (routeMap[key]) router.push(routeMap[key])
}

onMounted(fetchDashboardData)
</script>

<style scoped>
.welcome-sub {
  margin: 4px 0 0;
  color: var(--text-muted, #8b96ad);
  font-size: 0.9rem;
}

.main-area {
  margin-inline-start: 240px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 18px;
  align-items: start;
}

.appt-patient {
  flex: 1;
}

.appt-reason {
  color: var(--text-muted, #8b96ad);
  font-size: 0.8rem;
}

.waiting-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 480px;
  overflow-y: auto;
}

@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .main-area { margin-inline-start: 0; }
  .content-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>