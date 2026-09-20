const API_BASE_URL = "http://localhost:3000/api";


export const createPatient = async (patientData) => {

  const response = await fetch(
    `${API_BASE_URL}/patients`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(patientData)
    }
  );


  if (!response.ok) {

    throw new Error(
      "Failed to create patient"
    );

  }


  return await response.json();

};