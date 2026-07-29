import { createContext, useReducer } from "react";

export const PermissionsContext = createContext();

const PermissionsProvider = ({ children }) => {
  const intialState = {
    role: "",
    roleId: null,
    description: "",
    permissions: [],
  };

  const permissionReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_PERMISSIONS":
        return {
          ...state,
          role: action?.payload?.role,
          description: action?.payload?.description,
          permissions: action?.payload?.permissions,
        };
      default:
        return state;
    }
  };

  const [permission, DispatchPermission] = useReducer(
    permissionReducer,
    intialState
  );

  return (
    <PermissionsContext.Provider value={{ permission, DispatchPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};
export default PermissionsProvider;
