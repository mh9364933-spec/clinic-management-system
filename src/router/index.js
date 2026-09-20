import {
  createRouter,
  createWebHistory
} from "vue-router";

import AddPatient from "../views/AddPatient.vue";


const routes = [

  {
    path: "/patients/add",

    name: "AddPatient",

    component: AddPatient
  }

];


const router = createRouter({

  history: createWebHistory(),

  routes

});


export default router;