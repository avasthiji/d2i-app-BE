import axios from "axios";

const API_URL = "http://localhost:3000/api/user"; // Base URL for user-related API endpoints

// Fetch user data by ID
export const fetchUserData = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};
