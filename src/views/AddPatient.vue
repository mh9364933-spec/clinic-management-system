<template>
  <div class="add-patient-page">

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>Add New Patient</h1>
        <p>Create a new patient profile and save their information.</p>
      </div>

      <button class="back-btn" @click="goToPatients">
        ← Back to Patients
      </button>
    </div>


    <!-- Patient Form -->
    <div class="form-card">

      <form @submit.prevent="addPatient">

        <!-- Personal Information -->
        <div class="section">
          <div class="section-title">
            <span class="icon">👤</span>

            <div>
              <h2>Personal Information</h2>
              <p>Enter the patient's basic information.</p>
            </div>
          </div>


          <div class="form-grid">

            <!-- Full Name -->
            <div class="form-group">
              <label>
                Full Name <span>*</span>
              </label>

              <input
                v-model.trim="form.name"
                type="text"
                placeholder="Enter patient's full name"
              />

              <small v-if="errors.name">
                {{ errors.name }}
              </small>
            </div>


            <!-- Phone -->
            <div class="form-group">
              <label>
                Phone Number <span>*</span>
              </label>

              <input
                v-model.trim="form.phone"
                type="tel"
                placeholder="01xxxxxxxxx"
              />

              <small v-if="errors.phone">
                {{ errors.phone }}
              </small>
            </div>


            <!-- Date of Birth -->
            <div class="form-group">
              <label>Date of Birth</label>

              <input
                v-model="form.date_of_birth"
                type="date"
              />
            </div>


            <!-- Gender -->
            <div class="form-group">
              <label>Gender</label>

              <select v-model="form.gender">

                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

              </select>
            </div>


            <!-- Blood Type -->
            <div class="form-group">
              <label>Blood Type</label>

              <select v-model="form.blood_type">

                <option value="">
                  Select blood type
                </option>

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


            <!-- Email -->
            <div class="form-group">
              <label>Email</label>

              <input
                v-model.trim="form.email"
                type="email"
                placeholder="patient@email.com"
              />
            </div>

          </div>
        </div>


        <!-- Contact Information -->
        <div class="section">

          <div class="section-title">
            <span class="icon">📍</span>

            <div>
              <h2>Contact Information</h2>
              <p>Enter the patient's contact details.</p>
            </div>
          </div>


          <div class="form-group">

            <label>Address</label>

            <textarea
              v-model.trim="form.address"
              rows="3"
              placeholder="Enter patient's address"
            ></textarea>

          </div>

        </div>


        <!-- Medical Information -->
        <div class="section">

          <div class="section-title">
            <span class="icon">❤️</span>

            <div>
              <h2>Medical Information</h2>
              <p>Add important medical notes about the patient.</p>
            </div>
          </div>


          <div class="form-group">

            <label>Medical Notes</label>

            <textarea
              v-model.trim="form.medical_notes"
              rows="4"
              placeholder="Allergies, chronic diseases, previous medical history..."
            ></textarea>

          </div>

        </div>


        <!-- Error -->
        <div
          v-if="generalError"
          class="error-box"
        >
          {{ generalError }}
        </div>


        <!-- Actions -->
        <div class="form-actions">

          <button
            type="button"
            class="cancel-btn"
            @click="goToPatients"
          >
            Cancel
          </button>


          <button
            type="submit"
            class="save-btn"
            :disabled="loading"
          >
            {{ loading ? "Saving..." : "Save Patient" }}
          </button>

        </div>

      </form>

    </div>

  </div>
</template>


<script setup>

import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { createPatient } from "../services/api.js";


const router = useRouter();


// Loading state
const loading = ref(false);


// General error
const generalError = ref("");


// Validation errors
const errors = reactive({
  name: "",
  phone: ""
});


// Patient form
const form = reactive({

  name: "",

  phone: "",

  date_of_birth: "",

  gender: "",

  blood_type: "",

  email: "",

  address: "",

  medical_notes: ""

});


// Validate form
const validateForm = () => {

  errors.name = "";
  errors.phone = "";

  let valid = true;


  if (!form.name) {

    errors.name = "Patient name is required.";

    valid = false;

  }


  if (!form.phone) {

    errors.phone = "Phone number is required.";

    valid = false;

  }


  return valid;

};


// Add patient
const addPatient = async () => {

  generalError.value = "";


  // Stop if validation fails
  if (!validateForm()) {
    return;
  }


  loading.value = true;


  try {

    // Send patient data to API
    await createPatient(form);


    alert("Patient added successfully!");


    // Return to patients page
    router.push("/patients");


  } catch (error) {

    console.error(error);

    generalError.value =
      "Unable to add patient. Please try again.";

  } finally {

    loading.value = false;

  }

};


// Go back
const goToPatients = () => {

  router.push("/patients");

};

</script>


<style scoped>

* {
  box-sizing: border-box;
}


.add-patient-page {
  min-height: 100vh;
  padding: 35px;
  background: #f5f8fa;
}


/* Header */

.page-header {
  max-width: 1100px;
  margin: 0 auto 25px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}


.page-header h1 {
  margin: 0 0 7px;

  font-size: 30px;
  font-weight: 700;

  color: #19324d;
}


.page-header p {
  margin: 0;

  color: #718096;

  font-size: 15px;
}


.back-btn {
  border: none;

  background: white;

  color: #287f8f;

  padding: 11px 18px;

  border-radius: 10px;

  cursor: pointer;

  font-weight: 600;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}


.back-btn:hover {
  background: #eaf6f8;
}


/* Form Card */

.form-card {
  max-width: 1100px;

  margin: auto;

  background: white;

  border-radius: 18px;

  padding: 35px;

  box-shadow: 0 8px 30px rgba(26, 55, 77, 0.08);
}


/* Section */

.section {
  padding-bottom: 30px;

  margin-bottom: 30px;

  border-bottom: 1px solid #e7edf1;
}


.section:last-of-type {
  border-bottom: none;

  margin-bottom: 0;
}


.section-title {
  display: flex;

  align-items: center;

  gap: 14px;

  margin-bottom: 25px;
}


.icon {
  width: 45px;
  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #eaf6f8;

  border-radius: 12px;

  font-size: 21px;
}


.section-title h2 {
  margin: 0 0 4px;

  color: #19324d;

  font-size: 19px;
}


.section-title p {
  margin: 0;

  color: #8a99a6;

  font-size: 13px;
}


/* Grid */

.form-grid {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 22px;
}


/* Form */

.form-group {
  display: flex;

  flex-direction: column;

  gap: 8px;
}


.form-group label {
  color: #334e68;

  font-size: 14px;

  font-weight: 600;
}


.form-group label span {
  color: #e05252;
}


.form-group input,
.form-group select,
.form-group textarea {

  width: 100%;

  border: 1px solid #d9e2e8;

  border-radius: 10px;

  padding: 12px 14px;

  font-size: 14px;

  font-family: inherit;

  outline: none;

  transition: 0.2s;

  background: white;
}


.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {

  border-color: #4b9aaa;

  box-shadow: 0 0 0 3px rgba(75, 154, 170, 0.12);
}


.form-group textarea {
  resize: vertical;
}


.form-group small {
  color: #d9534f;

  font-size: 12px;
}


/* Error */

.error-box {

  margin-top: 20px;

  padding: 13px 16px;

  background: #fff1f1;

  color: #c0392b;

  border-radius: 10px;

  border: 1px solid #ffd4d4;

  font-size: 14px;
}


/* Buttons */

.form-actions {

  display: flex;

  justify-content: flex-end;

  gap: 12px;

  padding-top: 25px;
}


.cancel-btn,
.save-btn {

  padding: 12px 24px;

  border-radius: 10px;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  border: none;
}


.cancel-btn {

  background: #edf2f5;

  color: #526777;
}


.cancel-btn:hover {
  background: #e1e8ec;
}


.save-btn {

  background: #287f8f;

  color: white;
}


.save-btn:hover {
  background: #216d7b;
}


.save-btn:disabled {

  opacity: 0.6;

  cursor: not-allowed;
}


/* Responsive */

@media (max-width: 700px) {

  .add-patient-page {
    padding: 20px;
  }


  .page-header {
    flex-direction: column;

    align-items: flex-start;
  }


  .form-card {
    padding: 22px;
  }


  .form-grid {
    grid-template-columns: 1fr;
  }


  .form-actions {
    flex-direction: column;
  }


  .cancel-btn,
  .save-btn {
    width: 100%;
  }

}

</style>