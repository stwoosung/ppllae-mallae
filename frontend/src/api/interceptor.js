
export function setInterceptors(axiosService) {
  axiosService.interceptors.request.use(
    function (config) {
      config.headers["contentType"] = "application/json;";
      config.headers["withCredentials"] = true;
      
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  
  return axiosService;
}
