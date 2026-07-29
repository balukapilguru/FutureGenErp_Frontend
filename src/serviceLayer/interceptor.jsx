import axios from "axios";

// import Error from "../componentLayer/pages/Error/Error";
// import { useNavigate } from 'react-router-dom';

const ERPApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor
ERPApi.interceptors.request.use(
  (config) => {
    const data = JSON.parse(localStorage.getItem("data"));
    const mToken = JSON.parse(localStorage.getItem("mToken"));

    if (data?.token) {
      config.headers.Authorization = `${data?.token}`;
      
    }
    if (mToken) {
      config.headers[`x-m-access-token`] = `${mToken?.mToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// ERPApi.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         const navigate = useNavigate()
//         if (error.response && error.response.status === 400) {
//             return Promise.reject(error);
//         }
//         return Promise.reject(error);
//     }
// );

const setupInterceptors = (navigate) => {
  ERPApi.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // if (error) {
      //     const message = error.message;
      //     if (message === "Network Error") {
      //         navigate('/500');
      //     }
      // }

      // if (error.response) {
      //     const status = error.response.status;
      //     if (status >= 500 && status < 600) {
      //         navigate('/500');
      //     }
      //     // if (status === 400 ) {
      //     //     navigate('/500');
      //     // }
      // }

      return Promise.reject(error);
    }
  );
};

export { ERPApi, setupInterceptors };



