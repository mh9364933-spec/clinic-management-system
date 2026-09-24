import {
  createRouter,
  createWebHistory
} from "vue-router";

import Dashboard from "../views/Dashboard.vue";
import Patients from "../views/Patients.vue";
import AddPatient from "../views/AddPatient.vue";
import Appointments from "../views/Appointments.vue";
import PatientDetails from "../views/PatientDetails.vue";
import EditPatient from "../views/EditPatient.vue";

const routes = [

  {
    path: "/",
    redirect: "/dashboard"
  },

  {
    path: "/dashboard",
    component: Dashboard
  },

  {
    path: "/patients",
    component: Patients
  },

  {
    path: "/patients/add",
    component: AddPatient
  },

{
  path: "/patients/:id/edit",
  component: EditPatient
},



  {
    path: "/patients/:id",
    component: PatientDetails
  },

  {
    path: "/appointments",
    component: Appointments
  }

];

const router =
  createRouter({

    history:
      createWebHistory(),

    routes

  });

export default router;