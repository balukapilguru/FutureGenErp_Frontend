import { usePermissionsProvider } from "../dataLayer/hooks/usePermissionsProvider.jsx";
import usePermissionCheck from "./usePermissionCheck.jsx";

const GateKeeper = ({
  requiredModule,
  requiredPermission,
  submenumodule,
  submenuReqiredPermission,
  children,
}) => {
  const { permission } = usePermissionsProvider();

  if (!permission) {
    throw new Error("permission context not provided");
  }

  if (permission?.permissions?.length > 0 && permission?.role) {
    const { allowed } = usePermissionCheck(
      requiredModule,
      requiredPermission,
      submenumodule,
      submenuReqiredPermission
    );
    return allowed ? children : null;
  }
};

export default GateKeeper;
