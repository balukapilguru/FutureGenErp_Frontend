import  { createContext, useEffect, useReducer } from "react";

import RoleReducer from "./RoleReducer";

import { ERPApi } from "../../../serviceLayer/interceptor.jsx";

export const RoleContext = createContext();

const RoleContextProvider = ({ children }) => {


  const initialState = {
    RolesData: {
      paginatedRolesData: [],
      searchResultRoles: null,
      pageSize: 10,
      totalRolesCount: null,
      totalPages: null,
      loading: false,
      startRole: null,
      endRole: null,
      search: "",
      page: 1,
      AllRoles: null,
    },
  };

  const [RoleState, DispatchRoleState] = useReducer(RoleReducer, initialState);

  const getAllPaginatedRoles = async () => {
    DispatchRoleState({ type: "SET_LOADING" });
    const { pageSize, search, page } = RoleState?.RolesData;
    const pageSizeobj = { pageSize };
    const searchobj = { search };
    const pageobj = { page };

    const mergObj = { ...pageSizeobj, ...searchobj, ...pageobj };

    try {
      const { data, status } = await ERPApi.post(
        `${import.meta.env.VITE_API_URL}/roles/getroles`,
        mergObj
      );

      if (status === 200) {
        DispatchRoleState({ type: "SET_PAGINATED_ROLES", payload: data });
      }
    } catch (error) {
      console.error(error);
    } finally {
      DispatchRoleState({ type: "SET_LOADING" });
    }
  };

  const createRole = async (roledetails) => {
    try {
      // const { data, status } = await ERPApi.post();
      // if (status === 200) {
      //     DispatchRoleState({ type: "CREATE_ROLE", payload: data })
      //     getAllPaginatedRoles();
      // }
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   createRole();
  //   getAllPaginatedRoles();
  // }, []);

  // useEffect(() => {
  //   getAllPaginatedRoles();
  // }, [
  //   RoleState.RolesData.search,
  //   RoleState.RolesData?.page,
  //   RoleState.RolesData?.pageSize,
  // ]);

  return (
    <RoleContext.Provider
      value={{ RoleState, DispatchRoleState, getAllPaginatedRoles, createRole }}
    >
      {children}
    </RoleContext.Provider>
  );
};
export default RoleContextProvider;
