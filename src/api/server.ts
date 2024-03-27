import axios, { AxiosError, AxiosInstance } from "axios";

// Function to determine the base URL based on the environment
const determineBaseUrl = () => {
  if (import.meta.env.MODE === "production") {
    return "https://api.mirai-cares.com/";
    // return "https://fkuy7wira5n3shbvxt3xy3wfqm0jhvzq.lambda-url.ap-northeast-1.on.aws";
  } else if (import.meta.env.MODE === "development") {
    // Development URL; adjust as needed test-api
    return "http://localhost:8000";
  }

  return "https://fkuy7wira5n3shbvxt3xy3wfqm0jhvzq.lambda-url.ap-northeast-1.on.aws";
  // return "http://localhost:8000/";
};

// Define base URL using the function
export const baseUrl = determineBaseUrl();

// Google Maps and MYS Org Code - ensure these are set in your environment
export const googleMapApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
// export const mysOrgCode = process.env.REACT_APP_MYSORG_CODE;

// Creating an Axios instance
const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  // ... other settings (like headers, timeout, etc.)
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  // },
});

// Interceptor to enforce HTTPS
instance.interceptors.request.use(
  (config) => {
    // Ensuring config and config.url exist, then replacing http with https
    config.url = config.url && config.url.replace(/^http:/, "https:");
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Exporting the configured Axios instance
export { instance as axiosInstance };
