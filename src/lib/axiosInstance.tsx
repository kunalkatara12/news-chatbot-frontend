import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
const baseUrl =
  import.meta.env.VITE_BACKEND_PATH || "http://localhost:2309/api/v1";
const apiClient = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
});

// ✅ Define common API methods with generics
const _get = <T = any,>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return apiClient.get<T>(url, config);
};

const _delete = <T = any,>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return apiClient.delete<T>(url, config);
};

const _put = <T = any,>(
  url: string,
  data: any = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return apiClient.put<T>(url, data, config);
};

const _post = <T = any,>(
  url: string,
  data: any = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  console.log(data);
  return apiClient.post<T>(url, data, config);
};

// ✅ Export API methods
export { _get, _delete, _put, _post };
export default apiClient;
