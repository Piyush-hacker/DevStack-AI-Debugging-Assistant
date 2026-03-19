import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000
});

export const getApiErrorMessage = (
  error,
  fallbackMessage = "Something went wrong while talking to the API."
) => {
  const apiMessage = error?.response?.data?.error?.message;

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage.trim();
  }

  if (error?.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }

  return fallbackMessage;
};

export default api;
