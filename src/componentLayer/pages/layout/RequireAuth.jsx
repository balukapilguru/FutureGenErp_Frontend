import { Navigate, Outlet, useLoaderData, useLocation } from "react-router-dom";
import PanelLayout from "./PanelLayout";
import { useAuthContext } from "../../../dataLayer/hooks/useAuthContext";
import { useEffect, useRef, useState } from "react";

import { usePermissionsProvider } from "../../../dataLayer/hooks/usePermissionsProvider";

const isTokenExpired = (token) => {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      return true; // Invalid token format
    }
    const payload = JSON.parse(atob(tokenParts[1])); // Decoding the payload
    const exp = payload.exp * 1000; // Expiration time in milliseconds
    if (exp < Date.now()) {
      // localStorage.removeItem("data")
      // localStorage.removeItem("password")
      // DispatchAuth({ type: "SET_USER", payload: {} })
      // DispatchAuth({ type: "SET_TOKEN", payload: "" })
      // DispatchAuth({ type: "SET_ROLE", payload: {} })
      // DispatchAuth({ type: "SET_PASSWORD_LOCALSTORAGE", payload: "" })
      // toast.error("Your Session is Expired");
      return exp < Date.now(); // Check if the token is expired
    }
  } catch (e) {
    return true; // Error decoding token
  }
};

export const requireDataLoader = async () => {
  const UserData = localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data"))
    : null;
  if (!UserData) {
    window.location.href = "/auth/login";
    return null;
  }
  return UserData;
};

const RequireAuth = () => {
  const { AuthState } = useAuthContext();
  const data = useLoaderData();

  const { DispatchPermission } = usePermissionsProvider();

  const updatePermissionsToChildren = () => {
    if (
      data?.role?.length > 0 &&
      permissionsState &&
      permissionsState.permissions
    ) {
      const updatedPermissions = permissionsState.permissions.map((perm) => {
        const updatedSubmenus = perm.submenus.map((submenu) => {
          if (data?.role?.length > 0) {
            const matchingGetSubmenu = data?.role?.find(
              (getPerm) => getPerm.module === submenu.module,
            );
            if (matchingGetSubmenu) {
              // Update the submenu object if there's a match in getPermissions
              return {
                ...submenu,
                ...matchingGetSubmenu,
              };
            }
          }
          return submenu; // Return the original submenu if no match found
        });

        // Check if any submenu item has any key pair value set to true
        const anyTrue = updatedSubmenus.some((sub) =>
          Object.values(sub).some((value) => value === true),
        );

        // Update the permissions.all value to true if any submenu item has any key pair value set to true
        const updatedPerm = {
          ...perm,
          submenus: updatedSubmenus,
          all: anyTrue, // Set permissions.all to true if any submenu item has any key pair value set to true
        };

        return updatedPerm;
      });

      setPermissionsState({
        ...permissionsState,
        permissions: updatedPermissions,
        role: data.user?.profile,
        description: data?.user?.description,
      });
    } else {
      console.error(
        "getPermissions or permissions.permissions is undefined or null.",
      );
    }
  };

  useEffect(() => {
    updatePermissionsToChildren();
  }, [data]);

  const getInitialState = () => {
    return {
      role: "",
      description: "",
      permissions: [
        {
          module: "Dashboard",
          all: false,
          submenus: [
            {
              module: "Dashboard",
              all: false,
              // canCreate: false,
              canRead: false,
              // canUpdate: false,
              // canDelete: false,
            },
          ],
        },
        {
          module: "User Mangement",
          all: false,
          submenus: [
            {
              module: "User Details",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },
        {
          module: "Tickets Mangement",
          all: false,
          submenus: [
            {
              module: "Tickets Details",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },
        {
          module: "Exam Mangement",
          all: false,
          submenus: [
            {
              module: "Exam Details",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Registration Form",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },
        {
          module: "Student Management",
          all: false,
          submenus: [
            {
              module: "Enrolled Students",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
            {
              module: "Abroad Study",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
            {
              module: "PG Certification",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
            {
              module: "Fee Details",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
            {
              module: "Certificate",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
            {
              module: "Requested Certificate",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
            {
              module: "Issued Certificate",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
            {
              module: "refund",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
            {
              module: "feedback",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
            {
              module: "Installment",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              // canDelete: false,
            },
          ],
        },

        {
          module: "Batch Management",
          all: false,
          submenus: [
            {
              module: "Batch",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Active Batches",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Upcoming Batches",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Completed Batches",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Pending Batches",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Self Learning Batches",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Placement Preparation Batches",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Demo Batches",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Attendance",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },

            {
              module: "Placed Students",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Exam",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },
        {
          module: "Demo batches",
          all: false,
          submenus: [
            {
              module: "Registration Form",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Custom Fields",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Batches",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },
        {
          module: "Reports",
          all: false,
          submenus: [
            {
              module: "Report Data",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },

        {
          module: "Referrals",
          all: false,
          submenus: [
            {
              module: "Referrals Data",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },
        {
          module: "Vouchers",
          all: false,
          submenus: [
            {
              module: "Vouchers Data",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },
        {
          module: "Wallet",
          all: false,
          submenus: [
            {
              module: "Withdrawal Requests",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },

        {
          module: "Settings",
          all: false,
          submenus: [
            {
              module: "Roles",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Branch",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Course Package",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Courses",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Admission Fee",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Departments",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Lead Sources",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },

            {
              module: "Organization Profile",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Curriculum",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Bank Details",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Issues",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Entity",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Entity Branch",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
            {
              module: "Entity User",
              all: false,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            },
          ],
        },
      ],
    };
  };

  const [permissionsState, setPermissionsState] = useState(() =>
    getInitialState(),
  );

  useEffect(() => {
    DispatchPermission({
      type: "UPDATE_PERMISSIONS",
      payload: permissionsState,
    });
  }, [
    permissionsState.role,
    permissionsState.description,
    permissionsState.permissions,
  ]);

  const location = useLocation();
  const isAuthenticated =
    AuthState.token && AuthState.password && !isTokenExpired(AuthState.token);

  if (!isAuthenticated) {
    return <Navigate to={"/auth/login"} state={{ from: location }} replace />;
  }

  return (
    <div className="app">
      <PanelLayout>
        <Outlet />
      </PanelLayout>
    </div>
  );
};

export default RequireAuth;

// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import PanelLayout from "./PanelLayout";
// import { useAuthContext } from "../../../dataLayer/hooks/useAuthContext";

// const isTokenExpired = (token) => {

//   try {
//     const tokenParts = token.split('.');
//     if (tokenParts.length !== 3) {
//       return true; // Invalid token format
//     }
//     const payload = JSON.parse(atob(tokenParts[1])); // Decoding the payload
//     const exp = payload.exp * 1000; // Expiration time in milliseconds
//     if (exp < Date.now()) {
//       // localStorage.removeItem("data")
//       // localStorage.removeItem("password")
//       // DispatchAuth({ type: "SET_USER", payload: {} })
//       // DispatchAuth({ type: "SET_TOKEN", payload: "" })
//       // DispatchAuth({ type: "SET_ROLE", payload: {} })
//       // DispatchAuth({ type: "SET_PASSWORD_LOCALSTORAGE", payload: "" })
//       // toast.error("Your Session is Expired");
//       return exp < Date.now()  // Check if the token is expired
//     }
//   }
//   catch (e) {
//     return true; // Error decoding token
//   }
// };

// const RequireAuth = () => {
//   const { AuthState, DispatchAuth } = useAuthContext();
//   const location = useLocation();

//   // Check if the user is authenticated and the token is not expired

//   const isAuthenticated = AuthState.token && AuthState.password && !isTokenExpired(AuthState.token);

//   if (!isAuthenticated) {
//     return (
//       <Navigate
//         to={"/auth/login"}
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   return (
//     <div className="app">
//       <PanelLayout>
//         <Outlet />
//       </PanelLayout>
//     </div>
//   );
// };

// export default RequireAuth;
