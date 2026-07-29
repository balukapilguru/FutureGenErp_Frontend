import "../../../assets/css/Table.css";
import { AiFillEye } from "react-icons/ai";
import { RiEdit2Line } from "react-icons/ri";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { HiMiniPlus } from "react-icons/hi2";
import Button from "../../components/button/Button";
import BackButton from "../../components/backbutton/BackButton";
import { toast } from "react-toastify";
import { MdFilterList } from "react-icons/md";
import GateKeeper from "../../../rbac/GateKeeper";
import { Offcanvas } from "bootstrap";
import { usePermissionsProvider } from "../../../dataLayer/hooks/usePermissionsProvider";
import Pagination from "../../../utils/Pagination";
import PaginationInfo from "../../../utils/PaginationInfo";
import { ERPApi } from "../../../serviceLayer/interceptor.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../../../utils/Utils.jsx";
import CustomFilters from "../../../utils/CustomFilters.jsx";
import { BsLayoutThreeColumns, BsPersonCheckFill } from "react-icons/bs";
import CustomTable from "../../../utils/CustomTable.jsx";


export const userDataListLoader = async ({ request, params }) => {

  const url = new URL(request.url); // Extract the URL
  const queryParams = url.search;




  try {
    const [usersData, BranchesData, DepartmentData] =
      await Promise.all([
        ERPApi.get(`/user/list_user${queryParams ? queryParams : `?page=1&pageSize=10&search=`}`),
        ERPApi.get(`/settings/getbranch`),
        // ERPApi.post(`/roles/getroles?`, { page: 10, pageSize: 20, search: "" }),
        ERPApi.get(`/settings/getdepartment`),
      ]);

    const BranchsList = BranchesData?.data?.branchData.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    }));
    // const RolesList = RolesData?.data?.map((item)=>({
    //   label: item.role_name,
    //   value: item.id,
    // }));
    const DepartmentList = DepartmentData.data.data.map((item) => ({
      label: item?.department_name,
      value: item.department_name,
    }));
    const UsersList = usersData?.data;
    return { UsersList, BranchsList, DepartmentList };
  } catch (error) {
    console.error(error);
  }
};


export const UserListAction = async ({ request, params }) => {
  switch (request.method) {
    case "PUT": {
      const requestData = (await request.json()) || null;
      try {
        const response = await ERPApi.put(`/user/userstatus/${requestData.id}`, requestData);
        if (response.status === 200 || response.status === 204) {
          return new Response(JSON.stringify({ success: true, message: "User status updated successfully!" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ success: false, message: "Failed to update user status." }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "An error occurred while updating user status." }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
};


function UserData() {
  const { permission } = usePermissionsProvider();
  const { UsersList, BranchsList, DepartmentList } = useLoaderData();


  const navigation = useNavigation();
  let submit = useSubmit();
  let fetcher = useFetcher();


  const intialState = [
    {
      label: "Department",
      type: "select",
      inputname: "department",
      value: "",
      options: DepartmentList,
    },
    {
      label: "Branch",
      type: "select",
      value: "",
      inputname: "branch",
      options: BranchsList,
    },
    {
      label: "Status",
      type: "select",
      value: "",
      inputname: "user_status",
      options: [
        {
          label: "Active",
          value: 1,
        },
        {
          label: "Inactive",
          value: 0,
        },]
    }
  ];

  const [filterData, setFilterData] = useState(intialState)

  const [Qparams, setQParams] = useState({
    search: '',
    page: 1,
    pageSize: 10,
    branch: '',
    profile: '',
    department: '',
    user_status: '',
  });



  const handleSearch = (event) => {
    setQParams({
      ...Qparams,
      search: event.target.value,
    });
  };

  const handlePage = (page) => {
    setQParams({
      ...Qparams,
      page,
    });
  };

  const handlePerPageChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setQParams({
      ...Qparams,
      page: 1,
      pageSize: selectedValue,

    });
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    debouncedParams(Qparams);
  }, [Qparams]);

  const debouncedParams = useCallback(
    debounce((param) => {
      const searchParams = new URLSearchParams({
        page: param.page,
        pageSize: param.pageSize,
        search: param.search,
        'filter[branch]': param.branch || '',
        'filter[profile]': param.profile || '',
        'filter[department]': param.department || '',
        'filter[user_status]': param.user_status || '',
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );

  // useEffect(() => {
  //   if (fetcher.state === "idle" && !fetcher.data) {
  //     fetcher.load(".");
  //   }
  // }, [fetcher, navigation]);




  const [userstatus, setUser_Status] = useState("");
  const [text, setText] = useState("");
  const [id, setId] = useState("");
  const [userremarkshistory, setuser_remarks_history] = useState("");
  const [openModal, setOpenModal] = useState(false);


  const getDataInModal = (id, userStatus, userRemarkHistory) => {
    setId(id);
    setUser_Status(userStatus);
    setuser_remarks_history(userRemarkHistory);
    setOpenModal(true);
  };

  const [error, setError] = useState({});


  // Handle Active the user
  const handleActivate = async () => {
    if (!text) {
      toast.error("Please Enter the remarks");
      return;
    }

    if (userstatus === false) {
      const userStatus = true;
      const newUserRemarksHistory = [...userremarkshistory];
      const newObject = {
        Activate_remarks: text,
        date: new Date(),
      };
      newUserRemarksHistory.push(newObject);
      const updatedData = {
        user_status: userStatus,
        user_remarks_history: newUserRemarksHistory,
        id,
      };

      try {
        await fetcher.submit(updatedData, {
          method: "PUT",
          encType: "application/json",
        });
        toast.success("User activated successfully!");
        setText("");
        setOpenModal(false);
      } catch (error) {
        console.error(error)
        toast.error("Failed to activate user. Please try again.");
      }
    }
  };


  // handle Inactive the user
  const handleInActivate = async () => {
    if (!text) {
      toast.error("Please Enter the remarks");
      return;
    }
    if (userstatus === true) {
      const userStatus = false;
      const newUserRemarksHistory = [...userremarkshistory];
      const newObject = {
        Inactivate_remarks: text,
        date: new Date(),
      };
      newUserRemarksHistory.push(newObject);
      const updatedData = {
        user_status: userStatus,
        user_remarks_history: newUserRemarksHistory,
        id,
      };

      try {
        await fetcher.submit(updatedData, {
          method: "PUT",
          encType: "application/json",
        });
        toast.success("User deactivated successfully!");
        setText("");
        setOpenModal(false);
      }
      catch (error) {
        console.error(error)
        toast.error("Failed to deactivate user. Please try again.");
      }

    }
  };

  const userColumns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (UsersList?.currentPage - 1) * UsersList?.pageSize + index + 1,
      sortable: false,
    },

    {
      id: "name",
      header: "Name",
      accessor: (row) => row.fullname || "",
      sortable: true,
      hideable: true,
    },

    {
      id: "email",
      header: "Email",
      accessor: (row) => row.email || "",
      sortable: true,
      hideable: true,
    },

    {
      id: "phone",
      header: "Phone No",
      accessor: (row) => row.phonenumber || "",
      sortable: true,
      hideable: true,
    },

    {
      id: "designation",
      header: "Designation",
      accessor: (row) => row.designation || "",
      sortable: true,
      hideable: true,
    },

    {
      id: "department",
      header: "Department",
      accessor: (row) => row.department || "",
      sortable: true,
      hideable: true,
    },

    {
      id: "reportTo",
      header: "Report To",
      accessor: (row) => row.reportto || "",
      sortable: true,
      hideable: true,
    },

    {
      id: "profile",
      header: "Profile",
      accessor: (row) => row.profile || "",
      sortable: true,
      hideable: true,
    },

    {
      id: "branch",
      header: "Branch",
      accessor: (row) => row.branch || "",
      sortable: true,
      hideable: true,
    },
  ];
  const userActions = (user) => {
    const canShowActions = permission?.permissions?.some(
      (perm) =>
        perm.module === "User Mangement" &&
        perm.submenus?.some(
          (submenu) =>
            submenu.module === "User Details" &&
            (submenu.canRead || submenu.canUpdate || submenu.canDelete)
        )
    );

    if (!canShowActions) return null;

    return (
      <div className="d-flex align-items-center gap-2">
        <GateKeeper
          requiredModule="User Mangement"
          requiredPermission="all"
          submenumodule="User Details"
          submenuReqiredPermission="canRead"
        >
          <Link to={`/user/view/${user.id}`}>
            <AiFillEye className="eye_icon" title="View" size={18} />
          </Link>
        </GateKeeper>

        <GateKeeper
          requiredModule="User Mangement"
          requiredPermission="all"
          submenumodule="User Details"
          submenuReqiredPermission="canUpdate"
        >
          <Link to={`/user/edit/${user.id}`}>
            <RiEdit2Line className="edit_icon" title="Edit" size={18} />
          </Link>
        </GateKeeper>

        <GateKeeper
          requiredModule="User Mangement"
          requiredPermission="all"
          submenumodule="User Details"
          submenuReqiredPermission="canUpdate"
        >
          {user.user_status !== undefined && (
            <div className="form-check form-switch">
              <input
                className="form-check-input toggle_btn mt-2"
                type="checkbox"
                checked={!!user.user_status}
                onChange={() =>
                  getDataInModal(
                    user.id,
                    user.user_status,
                    user.user_remarks_history
                  )
                }
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              />
            </div>
          )}
        </GateKeeper>
      </div>
    );
  };



  return (
    <div>
      <BackButton heading="User Details" content="Back" to="/" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search input_bg_color select"
                        placeholder="Search for..."
                        name="search"
                        required
                        onChange={(e) => handleSearch(e)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="buttons_alignment">
                      <div className="fs-13 mt-2 text_color">
                        <button
                          className="btn btn-sm btn_primary fs-13 me-2  margin_top_12 button-res"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#columnOffcanvas"
                          title="Column Filter"
                        >
                          <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
                        </button>
                      </div>
                      <button
                        className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <MdFilterList className="me-1 mb-1" />
                        Filters
                      </button>

                      <GateKeeper
                        requiredModule="User Mangement"
                        requiredPermission="all"
                        submenumodule="User Details"
                        submenuReqiredPermission="canCreate"
                      >
                        <Button
                          type="button"
                          className="btn btn-sm btn-md btn_primary fs-13"
                        >
                          <Link to="/user/new" className="button_color">
                            <HiMiniPlus className="text_white " /> Add User
                          </Link>
                        </Button>
                      </GateKeeper>
                    </div>
                  </div>
                </div>

                <div
                  className="offcanvas offcanvas-end  bg_white"
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header ">
                    <h5
                      className="offcanvas-title  text_color"
                      id="offcanvasRightLabel"
                    >
                      Filters
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body p-2 bg_white">


                    <CustomFilters
                      filterData={filterData}
                      Qparams={Qparams}
                      setQParams={setQParams}
                      setFilterData={setFilterData}
                    />

                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive table-card table-container table-scroll border-0">

                  <CustomTable
                    data={UsersList?.reversedusers || []}
                    columns={userColumns}
                    actions={userActions}
                    enableColumnToggle
                  />

                </div>
                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                  <div className="col-sm mt-3">
                    <PaginationInfo
                      data={{
                        length: UsersList?.reversedusers?.length,
                        start: UsersList?.startUser,
                        end: UsersList?.endUser,
                        total: UsersList?.searchResultUsers,
                      }}
                      loading={navigation?.state === "loading"}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex justify-content-center pagination-res">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color pagination-select "
                        aria-label="Default select example"
                        required
                        onChange={(e) => handlePerPageChange(e)}
                        value={Qparams?.pageSize}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>

                    <div className="">
                      <Pagination
                        currentPage={UsersList?.currentPage}
                        totalPages={UsersList?.totalPages}
                        loading={navigation?.state === "loading"}
                        onPageChange={handlePage}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for activating inactivating users */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard={openModal}
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden={openModal}
      >
        <div className="modal-dialog modal-dialog-centered  ">
          <div className="modal-content">

            <div className="modal-body bg_white">
              <div className="d-flex justify-content-between">
                <label className="form-label fs-s fw-medium black_300">
                  Enter Remarks* :
                </label>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <textarea
                rows="4"
                cols="10"
                name="comment"
                form="usrform"
                className={
                  error && error.text
                    ? "form-control fs-s bg-form text_color input_bg_color error-input"
                    : "form-control fs-s bg-form text_color input_bg_color"
                }
                placeholder="Enter a message"
                onChange={(e) => setText(e.target.value)}
                value={text}
              ></textarea>
              <div style={{ height: "8px" }}>
                {error && error.text && (
                  <p className="text-danger m-0 fs-xs">{error.text}</p>
                )}
              </div>
            </div>
            <div className="p-2 d-flex justify-content-end bg_white">
              <button
                type="button"
                className="btn btn-secondary me-2"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {userstatus === false ? (
                <button
                  className="btn btn_primary"
                  onClick={() => handleActivate()}
                  data-bs-dismiss={openModal ? "" : "modal"}
                >
                  Activate
                </button>
              ) : null}

              {userstatus === true ? (
                <button
                  className="btn btn_primary"
                  onClick={() => handleInActivate()}
                  data-bs-dismiss={openModal ? "" : "modal"}
                >
                  Deactivate
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserData;


{/* <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
  <thead>
    <tr className="">
      <th scope="col" className="fs-13 lh-xs fw-600 ">
        S.No
      </th>
      <th scope="col" className="fs-13 lh-xs  fw-600  ">
        Name
      </th>
      <th scope="col" className="fs-13 lh-xs  fw-600  ">
        Email
      </th>
      <th scope="col" className="fs-13 lh-xs fw-600  ">
        Phone No
      </th>
      <th scope="col" className="fs-13 lh-xs  fw-600 ">
        Designation
      </th>
      <th scope="col" className="fs-13 lh-xs  fw-600">
        Department
      </th>
      <th scope="col" className="fs-13 lh-xs  fw-600 ">
        Report To
      </th>
      <th scope="col" className="fs-13 lh-xs  fw-600 ">
        Profile
      </th>
      <th scope="col" className="fs-13 lh-xs  fw-600 ">
        Branch
      </th>

      {permission?.permissions?.map((item) => {
        if (item.module === "User Mangement") {
          return item?.submenus?.map((submenu) => {
            if (
              submenu?.module === "User Details" &&
              (submenu?.canUpdate === true ||
                submenu?.canRead === true ||
                submenu?.canDelete === true)
            ) {
              return (
                <th
                  key={1}
                  scope="col"
                  className="fs-13 lh_xs 0 fw-600"
                >
                  Actions
                </th>
              );
            }
            return null;
          });
        }
        return null;
      })}
    </tr>
  </thead>
  <tbody className="">
    {UsersList?.reversedusers?.length > 0 ? (
      UsersList?.reversedusers.map((item, index) => {
        const userid = item?.id;
        const user = item;

        return (
          <>
            <tr
              key={index}
              className={item.user_status ? "" : "style"}
            >
              <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                {(UsersList?.currentPage - 1) *
                  UsersList.pageSize +
                  index +
                  1}
              </td>
              <td
                className="fs-13 black_300 lh-xs bg_light text-truncate"
                style={{ maxWidth: "120px" }}
                title={item.fullname}
              >
                {item.fullname}
              </td>
              <td
                className="fs-13 black_300 lh-xs bg_light text-truncate"
                style={{ maxWidth: "120px" }}
                title={item.email}
              >
                {item.email}
              </td>
              <td className="fs-13 black_300 lh-xs bg_light">
                {item.phonenumber}
              </td>
              <td
                className="fs-13 black_300 lh-xs bg_light text-truncate"
                style={{ maxWidth: "120px" }}
                title={item.designation}
              >
                {item.designation}
              </td>
              <td className="fs-13 black_300 lh-xs bg_light">
                {item.department}
              </td>
              <td
                className="fs-13 black_300 lh-xs bg_light text-truncate"
                style={{ maxWidth: "120px" }}
                title={item.reportto}
              >
                {item.reportto}
              </td>
              <td
                className="fs-13 black_300 lh-xs bg_light text-truncate"
                style={{ maxWidth: "120px" }}
                title={item.profile}
              >
                {item.profile}
              </td>
              <td className="fs-13 black_300 lh-xs bg_light">
                {item.branch}
              </td>
              {permission?.permissions.map((item) => {
                if (item.module === "User Mangement") {
                  return item?.submenus?.map((submenu) => {
                    if (
                      submenu?.module === "User Details" &&
                      (submenu?.canUpdate === true ||
                        submenu?.canRead === true ||
                        submenu?.canDelete === true)
                    ) {
                      return (
                        <td className="fs-14 text_mute bg_light lh-xs d-flex" key={1}>
                          <GateKeeper
                            requiredModule="User Mangement"
                            requiredPermission="all"
                            submenumodule="User Details"
                            submenuReqiredPermission="canRead"
                          >
                            <Link
                              to={`/user/view/${userid}`}
                            >
                              <AiFillEye
                                className="me-3 eye_icon"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="view"
                              />
                            </Link>
                          </GateKeeper>
                          <GateKeeper
                            requiredModule="User Mangement"
                            requiredPermission="all"
                            submenumodule="User Details"
                            submenuReqiredPermission="canUpdate"
                          >
                            <Link
                              to={`/user/edit/${userid}`}

                            >
                              <RiEdit2Line
                                className="edit_icon me-3"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Edit"
                              />
                            </Link>
                          </GateKeeper>

                          <GateKeeper
                            requiredModule="User Mangement"
                            requiredPermission="all"
                            submenumodule="User Details"
                            submenuReqiredPermission="canUpdate"
                          >
                            <div
                              className="form-check form-switch form-switch-right form-switch-md"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Toggle"
                            >
                              {user.user_status !==
                                undefined && (
                                  <input
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    className="form-check-input code-switcher toggle_btn"
                                    type="checkbox"
                                    id="FormValidationDefault"
                                    checked={
                                      user.user_status
                                        ? true
                                        : false
                                    }
                                    onChange={(e) =>
                                      getDataInModal(
                                        user.id,
                                        user.user_status,
                                        user.user_remarks_history
                                      )
                                    }
                                    data-bs-toggle="modal"
                                    data-bs-target="#staticBackdrop"
                                  />
                                )}
                            </div>
                          </GateKeeper>

                        </td>
                      );
                    }
                    return null; // Return null when the conditions are not met
                  });
                }
                return null;
              })}
            </tr>
          </>
        );
      })
    ) : (
      <tr>
        <td className="fs-13 black_300  lh-xs  bg_light">
          no data
        </td>
      </tr>
    )}
  </tbody>
</table> */}