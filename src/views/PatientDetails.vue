<template>

  <div class="page-container">

    <div class="page-header">

      <div>

        <button
          class="back-link"
          @click="$router.push('/patients')"
        >
          <i class="bi bi-arrow-left"></i>
          Back to Patients
        </button>

        <h2>Patient Profile</h2>

      </div>

      <button
        class="secondary-btn"
        @click="editPatient"
      >
        <i class="bi bi-pencil"></i>
        Edit Patient
      </button>

    </div>

    <div
      v-if="loading"
      class="loading-box"
    >
      Loading patient profile...
    </div>

    <template v-else-if="patient">

      <!-- Patient Header -->

      <div class="profile-header-card">

        <div class="profile-avatar">

          {{ patient.name?.charAt(0) }}

        </div>

        <div class="profile-main">

          <h2>
            {{ patient.name }}
          </h2>

          <p>
            Patient ID: #{{ patient.id }}
          </p>

        </div>

        <div class="profile-info">

          <div>
            <span>Phone</span>
            <strong>{{ patient.phone }}</strong>
          </div>

          <div>
            <span>Blood Type</span>
            <strong>
              {{ patient.blood_type || "N/A" }}
            </strong>
          </div>

        </div>

      </div>

      <!-- Information Grid -->

      <div class="details-grid">

        <!-- Personal Information -->

        <div class="dashboard-card">

          <div class="card-title-row">

            <div>

              <h4>Personal Information</h4>

              <p>
                Basic patient information
              </p>

            </div>

            <i class="bi bi-person"></i>

          </div>

          <div class="info-list">

            <div>
              <span>Full Name</span>
              <strong>
                {{ patient.name }}
              </strong>
            </div>

            <div>
              <span>Gender</span>
              <strong>
                {{ patient.gender || "N/A" }}
              </strong>
            </div>

            <div>
              <span>Date of Birth</span>
              <strong>
                {{ patient.date_of_birth || "N/A" }}
              </strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {{ patient.email || "N/A" }}
              </strong>
            </div>

            <div>
              <span>Address</span>
              <strong>
                {{ patient.address || "N/A" }}
              </strong>
            </div>

          </div>

        </div>

        <!-- Medical Information -->

        <div class="dashboard-card">

          <div class="card-title-row">

            <div>

              <h4>Medical Information</h4>

              <p>
                Medical history and notes
              </p>

            </div>

            <i class="bi bi-heart-pulse"></i>

          </div>

          <div class="medical-box">

            <h5>Medical Notes</h5>

            <p>
              {{
                patient.medical_notes ||
                "No medical notes available."
              }}
            </p>

          </div>

        </div>

      </div>

      <!-- Appointments -->

      <div class="dashboard-card">

        <div class="card-title-row">

          <div>

            <h4>Appointment History</h4>

            <p>
              Previous and current appointments
            </p>

          </div>

        </div>

        <div
          v-if="appointments.length === 0"
          class="empty-box"
        >
          <i class="bi bi-calendar-x"></i>
          <p>No appointment history.</p>
        </div>

        <div
          v-else
          class="history-list"
        >

          <div
            v-for="appointment in appointments"
            :key="appointment.id"
            class="history-row"
          >

            <div>

              <strong>
                {{ appointment.date }}
              </strong>

              <span>
                {{ appointment.time }}
              </span>

            </div>

            <div>

              {{ appointment.reason }}

            </div>

            <StatusBadge
              :status="appointment.status"
            />

          </div>

        </div>

      </div>

    </template>

    <div
      v-else
      class="empty-box"
    >
      <i class="bi bi-person-x"></i>
      <p>Patient not found.</p>
    </div>

  </div>

</template>

<script setup>

import { ref, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";

import { api } from "../services/api";

import StatusBadge from "../components/StatusBadge.vue";

const route = useRoute();
const router = useRouter();

const patient = ref(null);
const appointments = ref([]);

const loading = ref(false);

const getPatient = async () => {

  loading.value = true;

  try {

    const patientResponse =
      await api.get(
        `/patients/${route.params.id}`
      );

    patient.value =
      patientResponse.data;

    const appointmentsResponse =
      await api.get(
        `/appointments?patient_id=${route.params.id}`
      );

    appointments.value =
      appointmentsResponse.data;

  } catch (error) {

    console.error(error);

  } finally {

    loading.value = false;

  }

};

const editPatient = () => {

  router.push(
    `/patients/${route.params.id}/edit`
  );

};

onMounted(getPatient);

</script>