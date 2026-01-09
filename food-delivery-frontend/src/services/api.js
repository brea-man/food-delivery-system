import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend later
});

export const getCommissions = () => api.get('/commissions');
export const getReports = () => api.get('/reports');

export default api;
