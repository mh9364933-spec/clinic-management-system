<template>

  <div class="page-container">

    <div class="page-header">

      <div>
        <h2>Appointments</h2>
        <p>Manage today's clinic appointments.</p>
      </div>

      <button
        class="primary-btn"
        @click="showModal = true"
      >
        <i class="bi bi-calendar-plus"></i>
        New Appointment
      </button>

    </div>

    <!-- Filters -->

    <div class="filter-card">

      <div class="filter-group">

        <label>Date</label>

        <input
          v-model="selectedDate"
          type="date"
        />

      </div>

      <div class="filter-group">

        <label>Status</label>

        <select v-model="selectedStatus">

          <option value="all">
            All
          </option>

          <option value="waiting">
            Waiting
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

      </div>

    </div>

    <!-- Appointment List -->

    <div class="table-card">

      <div
        v-if="loading"
        class="loading-box"
      >
        Loading appointments...
      </div>

      <div
        v-else-if="filteredAppointments.length === 0"
        class="empty-box"
      >
        <i class="bi bi-calendar-x"></i>
        <p>No appointments found.</p>
      </div>

      <div
        v-else
        class="table-responsive"
      >

        <table class="patients-table">

          <thead>

            <tr>

              <th>Time</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            <tr
              v-for="appointment in filteredAppointments"
              :key="appointment.id"
            >

              <td>
                <strong>
                  {{ appointment.time }}
                </strong>
              </td>

              <td>

                <PatientCard
                  :patient="appointment.patient"
                  compact
                />

              </td>

              <td>
                {{ appointment.doctor }}
              </td>

              <td>
                {{ appointment.reason }}
              </td>

              <td>

                <StatusBadge
                  :status="appointment.status"
                />

              </td>

              <td>

                <div class="action-buttons">

                  <button
                    v-if="appointment.status === 'waiting'"
                    class="icon-btn complete"
                    title="Mark Completed"
                    @click="
                      updateStatus(
                        appointment.id,
                        'completed'
                      )
                    "
                  >
                    <i class="bi bi-check-lg"></i>
                  </button>

                  <button
                    v-if="appointment.status === 'waiting'"
                    class="icon-btn cancel"
                    title="Cancel"
                    @click="
                      updateStatus(
                        appointment.id,
                        'cancelled'
                      )
                    "
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>

                  <button
                    class="icon-btn delete"
                    title="Delete"
                    @click="
                      deleteAppointment(
                        appointment.id
                      )
                    "
                  >
                    <i class="bi bi-trash"></i>
                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

    <!-- Add Appointment Modal -->

    <div
      v-if="showModal"
      class="modal-overlay"
      @click.self="showModal = false"
    >

      <div class="custom-modal">

        <div class="modal-header">

          <div>
            <h3>New Appointment</h3>
            <p>Create a new booking.</p>
          </div>

          <button
            class="close-btn"
            @click="showModal = false"
          >
            ×
          </button>

        </div>

        <form @submit.prevent="addAppointment">

          <div class="form-group">

            <label>Patient</label>

            <select
              v-model="appointmentForm.patient_id"
              required
            >

              <option value="">
                Select Patient
              </option>

              <option
                v-for="patient in patients"
                :key="patient.id"
                :value="patient.id"
              >
                {{ patient.name }}
              </option>

            </select>

          </div>

          <div class="form-group">

            <label>Date</label>

            <input
              v-model="appointmentForm.date"
              type="date"
              required
            />

          </div>

          <div class="form-group">

            <label>Time</label>

            <input
              v-model="appointmentForm.time"
              type="time"
              required
            />

          </div>

          <div class="form-group">

            <label>Doctor</label>

            <input
              v-model="appointmentForm.doctor"
              type="text"
              placeholder="Doctor name"
              required
            />

          </div>

          <div class="form-group">

            <label>Reason</label>

            <textarea
              v-model="appointmentForm.reason"
              rows="3"
              placeholder="Reason for visit"
            ></textarea>

          </div>

          <div class="form-actions">

            <button
              type="button"
              class="secondary-btn"
              @click="showModal = false"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="primary-btn"
            >
              Save Appointment
            </button>

          </div>

        </form>

      </div>

    </div>

  </div>

</template>

<script setup>

import { ref, computed, onMounted } from "vue";

import { api } from "../services/api";

import PatientCard from "../components/PatientCard.vue";
import StatusBadge from "../components/StatusBadge.vue";

const appointments = ref([]);
const patients = ref([]);

const loading = ref(false);

const showModal = ref(false);

const selectedStatus = ref("all");

const selectedDate = ref(
  new Date()
    .toISOString()
    .split("T")[0]
);

const appointmentForm = ref({

  patient_id: "",
  date: "",
  time: "",
  doctor: "",
  reason: "",
  status: "waiting"

});

const getData = async () => {

  loading.value = true;

  try {

    const appointmentsResponse =
      await api.get("/appointments");

    const patientsResponse =
      await api.get("/patients");

    appointments.value =
      appointmentsResponse.data;

    patients.value =
      patientsResponse.data;

  } catch (error) {

    console.error(error);

  } finally {

    loading.value = false;

  }

};

// const filteredAppointments = computed(() => {

//   return appointments.value.filter(
//     appointment => {

//       const dateMatch =
//         !selectedDate.value ||
//         appointment.date === selectedDate.value;

//       const statusMatch =
//         selectedStatus.value === "all" ||
//         appointment.status === selectedStatus.value;

//       return dateMatch && statusMatch;

//     }
//   );

// }); 




const filteredAppointments = computed(() => {

  return appointments.value
    .filter(appointment => {

      const dateMatch =
        !selectedDate.value ||
        appointment.date === selectedDate.value;

      const statusMatch =
        selectedStatus.value === "all" ||
        appointment.status === selectedStatus.value;

      return dateMatch && statusMatch;

    })
    .map(appointment => {

      const patient = patients.value.find(
        patient =>
          String(patient.id) ===
          String(appointment.patient_id)
      );

      return {
        ...appointment,
        patient
      };

    });

});





const addAppointment = async () => {

  try {

    const response =
      await api.post(
        "/appointments",
        appointmentForm.value
      );

    appointments.value.push(
      response.data
    );

    showModal.value = false;

    appointmentForm.value = {

      patient_id: "",
      date: "",
      time: "",
      doctor: "",
      reason: "",
      status: "waiting"

    };

  } catch (error) {

    console.error(error);

    alert("Unable to create appointment.");

  }

};

const updateStatus = async (
  id,
  status
) => {

  try {

    const response =
      await api.put(
        `/appointments/${id}`,
        { status }
      );

    const index =
      appointments.value.findIndex(
        appointment =>
          appointment.id === id
      );

    if (index !== -1) {

      appointments.value[index] = {
        ...appointments.value[index],
        ...response.data
      };

    }

  } catch (error) {

    console.error(error);

    alert("Unable to update appointment.");

  }

};

const deleteAppointment = async (id) => {

  const confirmed =
    window.confirm(
      "Are you sure you want to delete this appointment?"
    );

  if (!confirmed) return;

  try {

    await api.delete(
      `/appointments/${id}`
    );

    appointments.value =
      appointments.value.filter(
        appointment =>
          appointment.id !== id
      );

  } catch (error) {

    console.error(error);

  }

};

onMounted(getData);

</script>