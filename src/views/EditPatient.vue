<template>
  <div class="edit-patient-page">

    <div class="page-header">
      <div>
        <button class="back-button" @click="$router.push('/patients')">
          ← Back to Patients
        </button>

        <h1>Edit Patient</h1>
        <p>Update the patient's information.</p>
      </div>
    </div>

    <div v-if="loading" class="message">
      Loading patient...
    </div>

    <div v-else-if="error" class="error-box">
      {{ error }}
    </div>

    <form v-else @submit.prevent="updatePatient" class="form-card">

      <div class="form-grid">

        <div class="form-group">
          <label>Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input
            v-model="form.phone"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label>Date of Birth</label>
          <input
            v-model="form.date_of_birth"
            type="date"
          />
        </div>

        <div class="form-group">
          <label>Gender</label>

          <select v-model="form.gender">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div class="form-group">
          <label>Blood Type</label>

          <select v-model="form.blood_type">
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div class="form-group">
          <label>Email</label>

          <input
            v-model="form.email"
            type="email"
          />
        </div>

        <div class="form-group full-width">
          <label>Address</label>

          <input
            v-model="form.address"
            type="text"
          />
        </div>

        <div class="form-group full-width">
          <label>Medical Notes</label>

          <textarea
            v-model="form.medical_notes"
            rows="5"
          ></textarea>
        </div>

      </div>

      <div v-if="saveError" class="error-box">
        {{ saveError }}
      </div>

      <div v-if="successMessage" class="success-box">
        {{ successMessage }}
      </div>

      <div class="actions">

        <button
          type="button"
          class="cancel-button"
          @click="$router.push('/patients')"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="save-button"
          :disabled="saving"
        >
          {{ saving ? "Saving..." : "Save Changes" }}
        </button>

      </div>

    </form>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const API_BASE_URL = "http://localhost:3000";

const loading = ref(true);
const saving = ref(false);

const error = ref("");
const saveError = ref("");
const successMessage = ref("");

const form = ref({
  name: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  blood_type: "",
  email: "",
  address: "",
  medical_notes: ""
});


const loadPatient = async () => {

  try {

    loading.value = true;
    error.value = "";

    const patientId = route.params.id;

    const response = await fetch(
      `${API_BASE_URL}/patients/${patientId}`
    );

    if (!response.ok) {
      throw new Error("Patient not found");
    }

    const patient = await response.json();

    form.value = {
      name: patient.name || "",
      phone: patient.phone || "",
      date_of_birth: patient.date_of_birth || "",
      gender: patient.gender || "",
      blood_type: patient.blood_type || "",
      email: patient.email || "",
      address: patient.address || "",
      medical_notes: patient.medical_notes || ""
    };

  } catch (err) {

    console.error(err);

    error.value =
      "Unable to load patient information.";

  } finally {

    loading.value = false;

  }
};


const updatePatient = async () => {

  try {

    saving.value = true;
    saveError.value = "";
    successMessage.value = "";

    const patientId = route.params.id;

    const response = await fetch(
      `${API_BASE_URL}/patients/${patientId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(form.value)
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update patient");
    }

    await response.json();

    successMessage.value =
      "Patient updated successfully.";

    setTimeout(() => {
      router.push("/patients");
    }, 800);

  } catch (err) {

    console.error(err);

    saveError.value =
      "Unable to update patient. Please try again.";

  } finally {

    saving.value = false;

  }
};


onMounted(() => {
  loadPatient();
});
</script>

<style scoped>

.edit-patient-page {
  padding: 30px;
  max-width: 1100px;
  margin: auto;
}

.page-header {
  margin-bottom: 25px;
}

.back-button {
  border: none;
  background: none;
  color: #287f95;
  cursor: pointer;
  font-size: 15px;
  margin-bottom: 15px;
}

h1 {
  margin: 0;
  color: #17324d;
}

.page-header p {
  color: #718096;
  margin-top: 8px;
}

.form-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.06);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #243b53;
}

input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #d8e1e8;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #2d8ca3;
}

textarea {
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
}

.cancel-button,
.save-button {
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 15px;
}

.cancel-button {
  background: #edf2f7;
  color: #425466;
}

.save-button {
  background: #27879a;
  color: white;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-box {
  margin-top: 20px;
  padding: 14px;
  border-radius: 10px;
  background: #fff1f1;
  color: #d32f2f;
}

.success-box {
  margin-top: 20px;
  padding: 14px;
  border-radius: 10px;
  background: #edf9f0;
  color: #24934a;
}

.message {
  padding: 30px;
  text-align: center;
}

@media (max-width: 700px) {

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .edit-patient-page {
    padding: 15px;
  }

}

</style>