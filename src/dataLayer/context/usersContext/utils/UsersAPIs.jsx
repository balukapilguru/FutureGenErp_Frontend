import axios from "axios";
import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";

// Total Users List
export const getAllUsers = () => {
  const url = `${import.meta.env.VITE_API_URL}/user/userdata`;
  return axios.get(url);
};

// Paginated Users list
export const getPaginatedUsers = (currentPage, perPage, search, filters) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/user/list_user?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[branch]=${
    filters.branch
  }&filter[profile]=${filters.profile}&filter[department]=${
    filters.department
  }`;
  return ERPApi.get(url);
};

// Create User
export const createUser = (createUser) => {
  const url = "";
  return toast.promise();
};

// Councellers list
export const getAllCouncellers = () => {
  const url = `${import.meta.env.VITE_API_URL}/user/userswithcounsellors`;
  return ERPApi.get(url);
};

// without Counsellors list
export const getAllUsersWithOutCouncellers = () => {
  const url = `${import.meta.env.VITE_API_URL}/user/userswithoutcounsellors`;
  return ERPApi.get(url);
};

// Single User by ID
export const getSingleUserById = (UserId) => {
  const url = `${import.meta.env.VITE_API_URL}/user/viewuser/32`;
  return ERPApi.get(url);
};
