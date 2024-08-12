import axios from 'axios';

const API_URL = 'http://localhost:3000/api/metrics'; // Adjust this according to your backend's base URL

export const createMetric = async (data) => {
  const response = await axios.post(`${API_URL}/core-skill`, data);
  return response.data;
};

export const updateMetric = async (id, data) => {
  const response = await axios.put(`${API_URL}/update-skill/${id}`, data);
  return response.data;
};

export const getMetrics = async () => {
  const response = await axios.get(`${API_URL}/get-skills`);
  return response.data;
};

export const deleteMetric = async (id) => {
  const response = await axios.delete(`${API_URL}/delete-skill/${id}`);
  return response.data;
};
