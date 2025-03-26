import axios from "axios";

export const BASE_REST_API_URL='http://161.97.130.81:8195/api/';

axios.interceptors.request.use(
  function (config) {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] =token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const loginUser = (auth) => {
  return axios.post(BASE_REST_API_URL + 'auth/login-basic', null, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  });
};
export const storeToken=(token)=>localStorage.setItem("token", token)
export const getToken=()=>localStorage.getItem("token")

// store login items
export const storeSuperAdmin=(superAdmin)=>localStorage.setItem("superAdmin", superAdmin)
export const accountId=(accountId)=>localStorage.setItem("accountId", accountId)
export const accountName=(accountName)=>localStorage.setItem("accountName", accountName)
export const firstName=(firstName)=>localStorage.setItem("firstName", firstName)
export const coordinator=(coordinator)=>localStorage.setItem("coordinator", coordinator)
export const permissions=(permissions)=>localStorage.setItem("permissions", permissions)
export const storeRoles=(roles)=>localStorage.setItem("roles", roles)




export const logout=()=>{
    localStorage.clear();
    sessionStorage.clear();
  }
