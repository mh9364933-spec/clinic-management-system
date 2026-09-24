<template>
  <AppLayout>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h2>Patients</h2>
        <p>Manage all registered patients.</p>
      </div>

      <button class="primary-btn" @click="$router.push('/patients/add')">
        <i class="bi bi-person-plus"></i>
        Add Patient
      </button>
    </div>

    <!-- Search -->
    <div class="filter-card">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input v-model="search" type="text" placeholder="Search by name, phone or ID..." />
      </div>
    </div>

    <!-- Patients Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-box">Loading patients...</div>

      <div v-else-if="filteredPatients.length === 0" class="empty-box">
        <i class="bi bi-person-x"></i>
        <p>No patients found.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="patients-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Blood Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="patient in filteredPatients" :key="patient.id">
              <td>
                <PatientCard :patient="patient" compact />
              </td>
              <td>{{ patient.phone }}</td>
              <td>{{ patient.gender }}</td>
              <td>{{ calculateAge(patient.date_of_birth) }}</td>
              <td>
                <span class="blood-badge">{{ patient.blood_type || "N/A" }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="icon-btn view" title="View" @click="viewPatient(patient.id)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="icon-btn edit" title="Edit" @click="editPatient(patient.id)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="icon-btn delete" title="Delete" @click="deletePatient(patient.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { api } from "../services/api";

import AppLayout from "../components/AppLayout.vue";
import PatientCard from "../components/PatientCard.vue";

const router = useRouter();

const patients = ref([]);
const search = ref("");
const loading = ref(false);

const getPatients = async () => {
  loading.value = true;
  try {
    const response = await api.get("/patients");
    patients.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const filteredPatients = computed(() => {
  const keyword = search.value.toLowerCase().trim();

  if (!keyword) {
    return patients.value;
  }

  return patients.value.filter((patient) => {
    return (
      patient.name?.toLowerCase().includes(keyword) ||
      patient.phone?.includes(keyword) ||
      String(patient.id).includes(keyword)
    );
  });
});

const calculateAge = (birthDate) => {
  if (!birthDate) {
    return "N/A";
  }

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

const viewPatient = (id) => {
  router.push(`/patients/${id}`);
};

const editPatient = (id) => {
  router.push(`/patients/${id}/edit`);
};

const deletePatient = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this patient?");
  if (!confirmed) return;

  try {
    await api.delete(`/patients/${id}`);
    patients.value = patients.value.filter((patient) => patient.id !== id);
  } catch (error) {
    console.error(error);
    alert("Failed to delete patient.");
  }
};

onMounted(getPatients);
</script>

<style scoped>
/* Responsive additions only — everything else (page-container, primary-btn,
   filter-card, table-card, blood-badge...) keeps using your global styles */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
}

@media (max-width: 560px) {
  .page-header {
    align-items: flex-start;
  }
  .page-header .primary-btn {
    width: 100%;
    justify-content: center;
  }
  /* الجدول بيفضل بعرضه الطبيعي جوه container بيسمح بالسكرول الأفقي
     بدل ما يتكسر أو يزنق نفسه في عرض الموبايل الضيق */
  .patients-table {
    min-width: 640px;
  }
}
</style>