import axios from "axios";
import { setInterceptors } from "./interceptor";

function createAxiosService() {
  const axiosService = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
      
    },
  });

  return setInterceptors(axiosService);
}


const axiosService = createAxiosService();

export { axiosService };
