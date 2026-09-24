import axios from 'axios';

const API_BASE_URL = "http://localhost:3000";

// إنشاء كائن Axios موحد عشان يشتغل مع .get و .post و .put و .delete
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// لو حبيت تسيب الدوال المنفصلة كمان عشان لو فيه مكان تاني بينادي عليها:
export const createPatient = async (patientData) => {
  const response = await api.post("/patients", patientData);
  return response.data;
};