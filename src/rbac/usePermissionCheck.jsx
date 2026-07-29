import { usePermissionsProvider } from "../dataLayer/hooks/usePermissionsProvider";

const usePermissionCheck = (
  requiredModule,
  requiredPermission,
  submenumodule,
  submenuReqiredPermission
) => {
  const { permission } = usePermissionsProvider();

  if (!permission) {
    throw new Error("Permissions context not provided");
  }
  if (permission?.permissions?.length > 0 && permission?.role) {
    const allowed = permission?.permissions?.some((item) => {
      // Check for the top-level module and permission
      if (
        !submenumodule &&
        item.module === requiredModule &&
        item[requiredPermission]
      ) {
        return true;
      }

      // Check if submenumodule is an array or a single value
      if (Array.isArray(submenumodule)) {
        return (
          item.module === requiredModule &&
          item.submenus?.some(
            (submenu) =>
              submenumodule.includes(submenu.module) &&
              submenu[submenuReqiredPermission]
          )
        );
      } else if (typeof submenumodule === "string") {
        return (
          item.module === requiredModule &&
          item.submenus?.some(
            (submenu) =>
              submenu.module === submenumodule &&
              submenu[submenuReqiredPermission]
          )
        );
      }
      return false;
    });
    return { allowed };
  }
};

export default usePermissionCheck;
