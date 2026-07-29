import React, { useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import { useRoleContext } from "../../../../dataLayer/hooks/useRoleContext";
import BackButton from "../../../components/backbutton/BackButton";
import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext";
import { IoIosArrowDown } from "react-icons/io";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";

export const CreateRole = () => {
  const { AuthState } = useAuthContext();

  const { id } = useParams();

  const [getPermissions, settheGetPermissions] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const { data, status } = await ERPApi.get(
            `${import.meta.env.VITE_API_URL}/roles/getrolebyid/${id}`,
          );
          if (status === 200) {
            // settheGetPermissions(data?.role?.Permissions)
            settheGetPermissions(data);
          }
        } catch (error) {}
      }
    };
    fetchData();
  }, [id]);

  const { RoleState, createRole, DispatchRoleState, getAllPaginatedRoles } =
    useRoleContext();

  const navigate = useNavigate();

  const getInitialState = () => {
    return {
      role: "",
      description: "",
      // selectedDashboard: '',
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

  const [permission, setPermissions] = useState(() => getInitialState());
  const [sendPermissions, setSendPermissions] = useState();

  // selectedDashboard

  const updatePermissions = () => {
    if (getPermissions && permission && permission.permissions) {
      const updatedPermissions = permission.permissions.map((perm) => {
        const updatedSubmenus = perm.submenus.map((submenu) => {
          const matchingGetSubmenu = getPermissions.role?.Permissions.find(
            (getPerm) => getPerm.module === submenu.module,
          );
          if (matchingGetSubmenu) {
            // Update the submenu object if there's a match in getPermissions
            return {
              ...submenu,
              ...matchingGetSubmenu,
            };
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

      setPermissions({
        ...permission,
        permissions: updatedPermissions,
        role: getPermissions.role?.name,
        description: getPermissions?.role?.description,
        // selectedDashboard:getPermissions?.role?.selectedDashboard
      });
    } else {
    }
  };

  useEffect(() => {
    updatePermissions();
  }, [getPermissions && id]);

  useEffect(() => {
    setSendPermissions(formatPermissions(permission?.permissions));
  }, [permission]);

  const formatPermissions = (permissions) => {
    let sendPermissions = [];
    permissions.forEach(({ module, all, submenus }) => {
      if (submenus) {
        submenus.forEach(({ module: submenuModule, ...submenuPermissions }) => {
          sendPermissions.push({
            module: submenuModule,
            all,
            ...submenuPermissions,
          });
        });
      }
    });
    return sendPermissions;
  };

  const handletoggle = (permissionType, moduleIndex, submenuIndex) => {
    if (
      permissionType === "all" &&
      moduleIndex !== undefined &&
      submenuIndex === undefined
    ) {
      const newValue = !permission.permissions[moduleIndex].all;
      permission.permissions[moduleIndex].all = newValue;

      permission.permissions[moduleIndex].submenus.forEach((submenu) => {
        if (submenu?.all !== undefined && submenu?.all !== null)
          submenu.all = newValue;
        if (submenu?.canCreate !== undefined && submenu?.canCreate !== null)
          submenu.canCreate = newValue;
        if (submenu?.canRead !== undefined && submenu?.canRead !== null)
          submenu.canRead = newValue;
        if (submenu?.canUpdate !== undefined && submenu?.canUpdate !== null)
          submenu.canUpdate = newValue;
        if (submenu?.canDelete !== undefined && submenu?.canDelete !== null)
          submenu.canDelete = newValue;
      });
    }
    if (
      permissionType === "all" &&
      moduleIndex !== undefined &&
      submenuIndex !== undefined
    ) {
      const newValue =
        !permission.permissions[moduleIndex].submenus[submenuIndex].all;
      permission.permissions[moduleIndex].submenus[submenuIndex].all = newValue;
      let setsubmenuPermission = [
        permission.permissions[moduleIndex].submenus[submenuIndex],
      ];
      setsubmenuPermission.forEach((submenu) => {
        if (submenu.all !== undefined && submenu.all !== null)
          submenu.all = newValue;
        if (submenu.canCreate !== undefined && submenu.canCreate !== null)
          submenu.canCreate = newValue;
        if (submenu.canRead !== undefined && submenu.canRead !== null)
          submenu.canRead = newValue;
        if (submenu.canUpdate !== undefined && submenu.canUpdate !== null)
          submenu.canUpdate = newValue;
        if (submenu.canDelete !== undefined && submenu.canDelete !== null)
          submenu.canDelete = newValue;
      });
    }
    if (
      permissionType === "canCreate" &&
      moduleIndex !== undefined &&
      submenuIndex !== undefined
    ) {
      const newValue =
        !permission.permissions[moduleIndex].submenus[submenuIndex].canCreate;
      let setsubmenuPermission = [
        permission.permissions[moduleIndex].submenus[submenuIndex],
      ];
      setsubmenuPermission.forEach((submenu) => {
        if (submenu.canCreate !== undefined && submenu.canCreate !== null)
          submenu.canCreate = newValue;

        if (!newValue) {
          if (submenu.all !== undefined && submenu.all !== null)
            submenu.all = false;
        }

        if (!newValue || newValue) {
          if (submenu.canRead !== undefined && submenu.canRead !== null)
            submenu.canRead = true;
        }
      });
    }
    if (
      permissionType === "canRead" &&
      moduleIndex !== undefined &&
      submenuIndex !== undefined
    ) {
      const newValue =
        !permission.permissions[moduleIndex].submenus[submenuIndex].canRead;
      let setsubmenuPermission = [
        permission.permissions[moduleIndex].submenus[submenuIndex],
      ];

      setsubmenuPermission.forEach((submenu) => {
        if (!newValue) {
          if (submenu.all !== undefined && submenu.all !== null)
            submenu.all = newValue;
          if (submenu.canCreate !== undefined && submenu.canCreate !== null)
            submenu.canCreate = newValue;
          if (submenu.canRead !== undefined && submenu.canRead !== null)
            submenu.canRead = newValue;
          if (submenu.canUpdate !== undefined && submenu.canUpdate !== null)
            submenu.canUpdate = newValue;
          if (submenu.canDelete !== undefined && submenu.canDelete !== null)
            submenu.canDelete = newValue;
        } else if (newValue) {
          if (submenu.canRead !== undefined && submenu.canRead !== null)
            submenu.canRead = newValue;
        }
      });
    }
    if (
      permissionType === "canUpdate" &&
      moduleIndex !== undefined &&
      submenuIndex !== undefined
    ) {
      const newValue =
        !permission.permissions[moduleIndex].submenus[submenuIndex].canUpdate;
      let setsubmenuPermission = [
        permission.permissions[moduleIndex].submenus[submenuIndex],
      ];
      setsubmenuPermission.forEach((submenu) => {
        if (submenu.canUpdate !== undefined && submenu.canUpdate !== null)
          submenu.canUpdate = newValue;

        if (!newValue) {
          if (submenu.all !== undefined && submenu.all !== null)
            submenu.all = false;
        }
        if (!newValue || newValue) {
          if (submenu.canRead !== undefined && submenu.canRead !== null)
            submenu.canRead = true;
        }
      });
    }
    if (
      permissionType === "canDelete" &&
      moduleIndex !== undefined &&
      submenuIndex !== undefined
    ) {
      const newValue =
        !permission.permissions[moduleIndex].submenus[submenuIndex].canDelete;
      let setsubmenuPermission = [
        permission.permissions[moduleIndex].submenus[submenuIndex],
      ];

      setsubmenuPermission.forEach((submenu) => {
        if (submenu.canDelete !== undefined && submenu.canDelete !== null)
          submenu.canDelete = newValue;

        if (!newValue) {
          if (submenu.all !== undefined && submenu.all !== null)
            submenu.all = false;
        }
        if (!newValue || newValue) {
          if (submenu.canRead !== undefined && submenu.canRead !== null)
            submenu.canRead = true;
        }
      });
    }
    if (
      (permissionType === "canDelete" ||
        permissionType === "canUpdate" ||
        permissionType === "canRead" ||
        permissionType === "canCreate") &&
      moduleIndex !== undefined &&
      submenuIndex !== undefined
    ) {
      const submenu =
        permission.permissions[moduleIndex].submenus[submenuIndex];
      const newValueCreate =
        submenu?.canCreate !== undefined && submenu?.canCreate !== null
          ? submenu.canCreate
          : true;
      const newValueRead =
        submenu?.canRead !== undefined && submenu?.canRead !== null
          ? submenu.canRead
          : true;
      const newValueUpdate =
        submenu?.canUpdate !== undefined && submenu?.canUpdate !== null
          ? submenu.canUpdate
          : true;
      const newValueDelete =
        submenu?.canDelete !== undefined && submenu?.canDelete !== null
          ? submenu.canDelete
          : true;
      let allPermissionsTrue =
        newValueCreate && newValueRead && newValueUpdate && newValueDelete;
      if (allPermissionsTrue) {
        permission.permissions[moduleIndex].submenus[submenuIndex].all = true;
      }
    }
    if (moduleIndex !== undefined) {
      const modulePermissions = permission.permissions[moduleIndex];
      let anyPermissionTrue = false;

      for (const submenu of modulePermissions.submenus) {
        if (
          submenu.canDelete ||
          submenu.canUpdate ||
          submenu.canRead ||
          submenu.canCreate
        ) {
          anyPermissionTrue = true;
          break; // Exit loop if any permission is true
        }
      }

      // Set the 'all' permission based on anyPermissionTrue
      modulePermissions.all = anyPermissionTrue;
    }

    // need in the future
    // if( (permissionType === "canRead"|| permissionType === "canCreate") && moduleIndex === 0 &&
    // submenuIndex === 0){
    //   const submenu = permission.permissions[0].submenus[0];

    //   const submenuRead = submenu.canRead;
    //   const submenucreate= submenu.canCreate;

    //   if(permissionType === "canRead") {
    //     permission.permissions[0].submenus[0].canRead = submenuRead;
    //   }
    //   if(permissionType === "canCreate"){
    //     permission.permissions[0].submenus[0].canRead = false;
    //     permission.permissions[0].all = true;
    //   }
    //   if(permissionType === "canCreate"){

    //     if(submenu.canCreate === false && submenu.canRead === false &&submenu.canUpdate === false && submenu.canDelete === false ){
    //       permission.permissions[0].all = false;
    //     }
    //   }

    // }
    // Update state or perform other necessary actions
    setPermissions({ ...permission }); // Update state
  };

  const [error, seterrors] = useState({
    role: "",
    description: "",
  });

  useEffect(() => {
    if (permission.role) {
      seterrors((prev) => ({
        ...prev,
        role: "",
      }));
    } else if (permission.role.length >= 3) {
      seterrors((prev) => ({
        ...prev,
        role: "",
      }));
    }

    if (permission.description) {
      seterrors((prev) => ({
        ...prev,
        description: "",
      }));
    } else if (permission.description.length >= 3) {
      seterrors((prev) => ({
        ...prev,
        description: "",
      }));
    }
    if (permission.selectedDashboard) {
      seterrors((prev) => ({
        ...prev,
        selectedDashboard: "",
      }));
    }
  }, [permission.role, permission.description, permission.selectedDashboard]);

  const handleSubmit = async () => {
    if (!permission.role) {
      seterrors((prev) => {
        return {
          ...prev,
          role: "Please Enter the Role",
        };
      });
      return false;
    } else if (permission.role.length < 3) {
      seterrors((prev) => ({
        ...prev,
        role: "Role must be at least 3 characters",
      }));
      return false;
    }

    if (!permission.description) {
      seterrors((prev) => ({
        ...prev,
        description: "Please Enter the Description",
      }));
      return false;
    } else if (permission.description.length < 3) {
      seterrors((prev) => ({
        ...prev,
        description: "Description should have atleast 3 characters",
      }));
      return false;
    }

    // if (!(
    //   permission?.role === "Admin" ||
    //   permission?.role === "Regional Manager" ||
    //   permission?.role === "Branch Manager" ||
    //   permission?.role === "Counsellor" ||
    //   permission?.role === "Support" ||
    //   permission?.role === "Accounts" ||
    //   permission?.role === "Trainer" ||
    //   permission?.role === "Team Lead" ||
    //   permission?.role === "Student" ||
    //   permission?.role === "Human Resource"
    // )) {
    //   if (!permission.selectedDashboard) {
    //     seterrors((prev) => ({
    //       ...prev,
    //       selectedDashboard: 'Please Select  the required Dashboard',
    //     }));
    //     return false;
    //   }
    // }

    let user = {
      role: permission.role,
      description: permission.description,
      createdBy: AuthState?.user?.fullname,
      // selectedDashboard:permission?.selectedDashboard ? permission?.selectedDashboard : ""
    };

    let permissionObj = {
      permissions: sendPermissions,
    };

    user = [user];
    const dataWithTitleCase = user.map((item) => {
      const newItem = {};
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          if (typeof item[key] === "string" && key !== "email") {
            newItem[key] = item[key]
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          } else {
            newItem[key] = item[key];
          }
        }
      }
      return newItem;
    });
    user = dataWithTitleCase[0];
    let permissions = { ...sendPermissions };

    let userpermissionData = {
      ...user,
      ...permissionObj,
    };

    setLoading((prev) => !prev);
    try {
      const apiMethod = id ? ERPApi.put : ERPApi.post;
      const endpoint = id ? `/roles/update-role/${id}` : `/roles/create-role`;
      const successMessage = id
        ? "Role Updated Successfully"
        : "Role Created Successfully";

      const { data, status } = await toast.promise(
        apiMethod(endpoint, userpermissionData),
        {
          pending: "Processing: Verifing the Role Permissions..",
          success: successMessage,
        },
      );
      if (status === 200 || status === 201) {
        navigate("/settings/roles");
        getAllPaginatedRoles();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to process user. Please try again.",
      );
    } finally {
      setLoading((prev) => !prev);
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var toggleButtons = document.querySelectorAll('[data-toggle="collapse"]');
    toggleButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var icon = button.querySelector(".collapse-icon");
        icon.classList.toggle("collapsed");
      });
    });
  });

  const isAllTrueForModule = (moduleName) => {
    const module = permission.permissions.find(
      (perm) => perm.module === moduleName,
    );
    return module && module.all;
  };

  return (
    <div>
      {id && id ? (
        <BackButton heading=" Update Role" content="Back" />
      ) : (
        <BackButton heading=" Create Role" content="Back" />
      )}

      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-xxl-3 col-md-6">
                <div>
                  <div className="form-group text-start black_300">
                    <label
                      className="form-label fs-s black_300 "
                      for="example-text-input"
                    >
                      Role Name<span className="text-danger">*</span>
                    </label>
                    <input
                      // className="form-control fs-s bg-form text_color input_bg_color"
                      className={
                        error && error?.role && error?.role.length > 0
                          ? "form-control fs-s bg-form text_color input_bg_color error-input"
                          : "form-control fs-s bg-form text_color input_bg_color"
                      }
                      style={id && id ? { cursor: "not-allowed" } : undefined}
                      type="text"
                      placeholder="Enter Role Name"
                      id="role"
                      name="role"
                      autoComplete="role"
                      required
                      value={permission.role}
                      onChange={(e) => {
                        setPermissions({
                          ...permission,
                          role: e.target.value,
                        });
                      }}
                      disabled={id}
                    />
                    {error.role && error.role.length > 0 && (
                      <p className="text-danger m-0 fs-xs">{error?.role}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-md-6">
                <div>
                  <div className="form-group text-start black_300">
                    <label
                      className="form-label fs-s"
                      for="example-text-input "
                    >
                      Role Description<span className="text-danger">*</span>
                    </label>
                    <input
                      // className="form-control fs-s bg-form text_color input_bg_color "
                      className={
                        error &&
                        error?.description &&
                        error?.description.length > 0
                          ? "form-control fs-s bg-form text_color input_bg_color error-input"
                          : "form-control fs-s bg-form text_color input_bg_color"
                      }
                      placeholder="Enter Role Discription"
                      id="description"
                      name="description"
                      type="text"
                      autoComplete="description"
                      required
                      value={permission?.description}
                      onChange={(e) => {
                        setPermissions({
                          ...permission,
                          description: e.target.value,
                        });
                      }}
                    />
                    {error.description && error.description.length > 0 && (
                      <p className="text-danger m-0 fs-xs">
                        {error?.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* {
                (
                  !(
                    permission?.role === "Admin" ||
                    permission?.role === "Regional Manager" ||
                    permission?.role === "Branch Manager" ||
                    permission?.role === "Counsellor" ||
                    permission?.role === "Support" ||
                    permission?.role === "Accounts" ||
                    permission?.role === "Trainer" ||
                    permission?.role === "Team Lead" ||
                    permission?.role === "Student" ||
                    permission?.role === "Human Resource"
                  )
                ) && (
                  <div className="col-xxl-3 col-md-6">
                    <div>
                      <div className="form-group text-start black_300">
                        <label className="form-label fs-s fw-medium black_300">
                          Required Dashboard<span className="text-danger">*</span>
                        </label>
                        <select
                          className={
                            error && error?.selectedDashboard && error?.selectedDashboard.length > 0
                              ? "form-control fs-s bg-form text_color input_bg_color error-input  select form-select"
                              : "form-control fs-s bg-form text_color input_bg_color  select form-select"
                          }
                          aria-label="Default select example"
                          placeholder="selectedDashboard*"
                          name="selectedDashboard"
                          id="selectedDashboard"
                          value={permission?.selectedDashboard}
                          onChange={(e) => {
                            setPermissions({
                              ...permission,
                              selectedDashboard: e.target.value,
                            });
                          }}
                          required
                        >


                          <option value="" disabled selected>
                            Select the Required Dashboard
                          </option>
                          {isAllTrueForModule('Student Management') && <option value="Sales">Sales</option>}
                          {isAllTrueForModule('Batch Management') && <option value="Trainer">Trainer</option>}
                          {isAllTrueForModule('HR Management') && <option value="Human Resource">Human Resource</option>}
                          {isAllTrueForModule('Student Management') && isAllTrueForModule('Batch Management') && isAllTrueForModule('HR Management') && (
                            <>
                              <option value="Support">Support</option>
                              <option value="Account">Account</option>
                            </>
                          )}
                        </select>
                        {
                          error?.selectedDashboard && error?.selectedDashboard.length > 0 && (
                            <p className="text-danger m-0 fs-xs">
                              {error?.selectedDashboard}
                            </p>
                          )
                        }
                      </div>
                    </div>
                  </div>
                )
              } */}
            </div>
            <div className="row mt-5 d-flex justify-content-center">
              <div className="col-lg-10">
                <div className="table-responsive table-card roles-table table-scroll border-0">
                  <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                    <thead className="border-end border-start border-1 border">
                      <tr className="border-end border-start border-1 border">
                        <th
                          scope="col"
                          className="fs-13 lh-xs fw-600 border-end border-1 border"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="text-center fs-13 lh-xs  fw-600 border-end border-1 border"
                        >
                          All
                        </th>
                        <th
                          scope="col"
                          className="text-center fs-13 lh-xs fw-600 border-end border-1 border"
                        >
                          Create
                        </th>
                        <th
                          scope="col"
                          className="text-center fs-13 lh-xs fw-600 border-end border-1 border"
                        >
                          Read
                        </th>
                        <th
                          scope="col"
                          className="text-center fs-13 lh-xs fw-600 border-end border-1 border"
                        >
                          Update
                        </th>
                        <th
                          scope="col"
                          className="text-center fs-13 lh-xs fw-600 border-end border-1 border"
                        >
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="border-end border-start border-1 border">
                      {/* Permissions */}
                      {permission &&
                        permission?.permissions.map((item, index) => {
                          return (
                            <>
                              {/* First row for modules */}
                              <tr
                                style={{ height: "50px" }}
                                className="border-end border-start border-1 border"
                              >
                                <td
                                  className="fs-13 lh-500 black_300 border-end border-1 border fw-600"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#submenu_${index}`}
                                  aria-expanded="false"
                                  aria-controls={`submenu_${index}`}
                                >
                                  <span className="cursor-pointer">
                                    {" "}
                                    {item.module}{" "}
                                    <IoIosArrowDown className=" ms-1 collapse-icon text_color fs-13" />{" "}
                                  </span>
                                </td>

                                <td className="fs-13 black_300 fw-500 lh-xs bg_light border-end border-start border-1 border text-center">
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`flexSwitchCheckDefault_${index}`}
                                      checked={item.all}
                                      value={item.all} // Add value to checkbox
                                      onChange={() =>
                                        handletoggle("all", index)
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`flexSwitchCheckDefault_${index}`}
                                    ></label>
                                  </div>
                                </td>

                                {/* Empty cells */}
                                <td className="fs-13 lh-500 black_300 border-end border-1 border"></td>
                                <td className="fs-13 lh-500 black_300 border-end border-1 border "></td>
                                <td className="fs-13 lh-500 black_300 border-end border-1 border"></td>
                                <td className="fs-13 lh-500 black_300 border-end border-1 border"></td>
                              </tr>

                              {/* Second row for submenu items */}
                              {item.submenus.map((submenu, subIndex) => {
                                return (
                                  <tr
                                    style={{ height: "50px" }}
                                    className="collapse"
                                    id={`submenu_${index}`}
                                    key={subIndex}
                                  >
                                    <td className="fs-13 lh-500 black_300 border-end border-1 border ps-4">
                                      {submenu.module}
                                    </td>

                                    {/* You can map submenu items here */}
                                    {/* Add the necessary logic to map submenu items */}

                                    <td className="fs-13 lh-500 black_300 border-end border-1 border ">
                                      {submenu.hasOwnProperty("all") &&
                                      submenu.all !== null ? (
                                        <div className="form-check form-switch">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`allCheckbox_${index}_${subIndex}`}
                                            checked={submenu.all}
                                            value={submenu.all} // Add value to checkbox
                                            onChange={() =>
                                              handletoggle(
                                                "all",
                                                index,
                                                subIndex,
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor={`allCheckbox_${index}_${subIndex}`}
                                          ></label>
                                        </div>
                                      ) : (
                                        <div className="form-check form-switch">
                                          NA
                                        </div>
                                      )}
                                    </td>

                                    <td className="fs-13 lh-500 black_300 border-end border-1 border ">
                                      {submenu.hasOwnProperty("canCreate") &&
                                      submenu.canCreate !== null ? (
                                        <div className="form-check form-switch">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`allCheckbox_${index}_${subIndex}`}
                                            checked={submenu.canCreate}
                                            value={submenu.canCreate} // Add value to checkbox
                                            onChange={() =>
                                              handletoggle(
                                                "canCreate",
                                                index,
                                                subIndex,
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor={`allCheckbox_${index}_${subIndex}`}
                                          ></label>
                                        </div>
                                      ) : (
                                        <div className="form-check form-switch">
                                          NA
                                        </div>
                                      )}
                                    </td>
                                    <td className="fs-13 lh-500 black_300 border-end border-1 border ">
                                      {submenu.hasOwnProperty("canRead") &&
                                      submenu?.canRead !== null ? (
                                        <div className="form-check form-switch">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`allCheckbox_${index}_${subIndex}`}
                                            checked={submenu.canRead}
                                            value={submenu.canRead} // Add value to checkbox
                                            onChange={() =>
                                              handletoggle(
                                                "canRead",
                                                index,
                                                subIndex,
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor={`allCheckbox_${index}_${subIndex}`}
                                          ></label>
                                        </div>
                                      ) : (
                                        <div className="form-check form-switch">
                                          NA
                                        </div>
                                      )}
                                    </td>

                                    <td className="fs-13 lh-500 black_300 border-end border-1 border">
                                      {submenu.hasOwnProperty("canUpdate") &&
                                      submenu.canUpdate !== null ? (
                                        <div className="form-check form-switch">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`allCheckbox_${index}_${subIndex}`}
                                            checked={submenu.canUpdate}
                                            value={submenu.canUpdate} // Add value to checkbox
                                            onChange={() =>
                                              handletoggle(
                                                "canUpdate",
                                                index,
                                                subIndex,
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor={`allCheckbox_${index}_${subIndex}`}
                                          ></label>
                                        </div>
                                      ) : (
                                        <div className="form-check form-switch">
                                          NA
                                        </div>
                                      )}
                                    </td>

                                    <td className="fs-13 lh-500 black_300 border-end border-1 border">
                                      {submenu.hasOwnProperty("canDelete") &&
                                      submenu.canDelete !== null ? (
                                        <div className="form-check form-switch">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`allCheckbox_${index}_${subIndex}`}
                                            checked={submenu.canDelete}
                                            value={submenu.canDelete} // Add value to checkbox
                                            onChange={() =>
                                              handletoggle(
                                                "canDelete",
                                                index,
                                                subIndex,
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor={`allCheckbox_${index}_${subIndex}`}
                                          ></label>
                                        </div>
                                      ) : (
                                        <div className="form-check form-switch">
                                          NA
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className=" "></div>

          <div className=" ">
            <div className="d-flex justify-content-end my-3 mx-2">
              <Button
                className={"btn_primary"}
                onClick={handleSubmit}
                disabled={loading}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                {id ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
