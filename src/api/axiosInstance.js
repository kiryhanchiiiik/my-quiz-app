import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://cdn.contentful.com/",
});
