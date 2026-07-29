import React, { useEffect, useMemo } from "react";
import { Link, useFetcher, useLoaderData, useSearchParams } from "react-router-dom"; // ✅ CHANGED: useSearchParams added, useSubmit removed
import { HiMiniPlus } from "react-icons/hi2";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { AiFillEye } from "react-icons/ai";
import { RiEdit2Line } from "react-icons/ri";
import { IoLinkSharp } from "react-icons/io5";
import GateKeeper from "../../../rbac/GateKeeper";
import { useState } from "react";
import BackButton from "../../components/backbutton/BackButton";
import SearchInputField from "../../../utils/SearchInputField";
import PaginationInfo from "../../../utils/PaginationInfo";
import Pagination from "../../../utils/Pagination";
import CustomTable from "../../../utils/CustomTable";
import Filter from "../../../utils/FilterWithSearchParams";
import {MdDelete, MdFilterList} from "react-icons/md";
import { Offcanvas } from "bootstrap";
import { ERPApi } from "../../../serviceLayer/interceptor";
import { formatDateTime } from "../../../utils/Utils";

const Demoform = () => {
  const loaderData = useLoaderData() || {};
  const { registrationFormData, usersWithCounsellorsData, branchData, trainersData } = loaderData;
  const fetcher = useFetcher();
  console.log("Loader Data in Component:", usersWithCounsellorsData);
  const userdata = JSON.parse(localStorage.getItem("data"));

  const role = userdata?.user?.profile;
  // const EnquirytakenByData = useMemo(
  //   () =>
  //     usersWithCounsellorsData?.userswithcounselor?.map((item) => ({
  //       label: item?.fullname,
  //       value: item?.id,
  //     })) || [],
  //   [usersWithCounsellorsData?.userswithcounselor],
  // );

  const FbranchData = useMemo(
    () =>
      branchData?.branchData?.map((item) => ({
        label: item?.branch_name,
        value: item?.id,
      })) || [],
    [branchData],
  );

  // ✅ CHANGED: using useSearchParams instead of useSubmit + state
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ CHANGED: read values directly from URL
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const [Qparams, setQParams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
  });
  const search = searchParams.get("search") || ""
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);
      return {
        ...params,
        search: value,
        page: 1,
      };
    });
  };
  // ✅ CHANGED: update page using URL params
  const handlePage = (page) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);
      return {
        ...params,
        page,
      };
    });
  };

  // ✅ CHANGED: update pageSize using URL params
  const handlePerPageChange = (e) => {
    const pageSize = parseInt(e.target.value, 10);

    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);
      return {
        ...params,
        page: 1,
        pageSize,
      };
    });
  };

  const handleStatusToggle = (form) => {
    const newStatus = form.isActive === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? "activate" : "deactivate";

    Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${statusText} the form "${form.formName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${statusText} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        fetcher.submit(
          {
            id: form.uuid,
            type: "updateStatus",
            isActive: newStatus,
          },
          { method: "PATCH", encType: "application/json" }
        );
      }
    });
  };

  const handleDeleteForm = (form) => {

    Swal.fire({
      title: `Are you sure?`,
      text: `You want to Delete the form "${form.formName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, Delete it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        fetcher.submit(
            {
              id: form.uuid,
              type: "delete",
            },
            { method: "DELETE", encType: "application/json" }
        );
      }
    });
  };


  const isFormActive = (activeFrom, activeTo) => {
    const now = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    const from = new Date(activeFrom).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    const to = new Date(activeTo).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    return now >= from && now <= to;
  };

  const forms = registrationFormData?.data || registrationFormData?.forms || [];
  const paginationMeta = registrationFormData;
  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(new Date(timestamp));
  };
  // const formatDateLocal = (date) => {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (paginationMeta?.currentPage - 1) * paginationMeta?.pageSize +
        index +
        1,
    },
    {
      id: "formName",
      header: "Form Name",
      accessor: (row) => row.formName || "-",
      Cell: ({ row }) => {
        const form = row?.original;
        return (
          <div
            className="d-flex align-items-center gap-2 text-truncate"
            title={form.formName}
          >
            <span
              className={`d-inline-block rounded-circle ${isFormActive(form.activeFrom, form.activeTo)
                ? "bg-success"
                : "bg-danger"
                }`}
            />
            <span className="text-truncate" style={{ maxWidth: "180px" }}>
              {form.formName}
            </span>
          </div>
        );
      },
    },
    {
      id: "description",
      header: "Description",
      accessor: (row) => row.description || "-",
      Cell: ({ row }) => (
        <span
          className="text-truncate"
          style={{ maxWidth: "120px" }}
          title={row.original.description}
        >
          {row.original.description}
        </span>
      ),
    },
    {
      id: "trainer",
      header: "Trainer",
      accessor: (row) => { return <span>{row?.batch !== null ? row?.batch?.users?.[0]?.fullname : "-"}</span> },
    },
    {
      id: "createdBy",
      header: "Created By",
      accessor: (row) => { return <span>{row.creator?.fullname || "-"}</span> },
    },
    {
      id: "createdAt",
      header: "Created On",
      accessor: (row) => { return <span>{formatDateTime(row.createdAt)}</span> },
    },
    {
      id: "startDate",
      header: "Start Date",
      accessor: (row) => row.activeFrom || "-",
    },
    {
      id: "closingDate",
      header: "Closing Date",
      accessor: (row) => row.activeTo || "-",
    },
  ];

  const actions = (row) => {
    const form = row;
    if (!form) return null;

    return (
      <div className="d-flex align-items-center gap-2">
        <GateKeeper
          requiredModule="Demo batches"
          requiredPermission="all"
          submenumodule="Registration Form"
          submenuReqiredPermission="canRead"
        >
          <span
            className="text-primary"
            title="Copy Form Link"
            onClick={() => {
              const fullLink = `https://teksacademy.com/demo/registration/${form.uuid}`;
              navigator.clipboard.writeText(fullLink);
              toast.success("Link copied to clipboard!");
            }}
            style={{ cursor: "pointer" }}
          >
            <IoLinkSharp className="eye_icon fw-600 table_icons text-primary" />
          </span>
        </GateKeeper>
        <GateKeeper
          requiredModule="Demo batches"
          requiredPermission="all"
          submenumodule="Registration Form"
          submenuReqiredPermission="canUpdate"
        >
          <Link to={`edit/${form.uuid}`}>
            <RiEdit2Line className="eye_icon fw-600 table_icons" title="Edit" />
          </Link>
        </GateKeeper>
        <GateKeeper
          requiredModule="Demo batches"
          requiredPermission="all"
          submenumodule="Registration Form"
          submenuReqiredPermission="canRead"
        >
          <Link to={`view/${form?.uuid}`}>
            <AiFillEye
              className="eye_icon table_icons"
              title="View Registrations"
            />
          </Link>
        </GateKeeper>
        <GateKeeper
            requiredModule="Demo batches"
            requiredPermission="all"
            submenumodule="Registration Form"
            submenuReqiredPermission="canUpdate"
        >
          <MdDelete onClick={()=>handleDeleteForm(form)} className="text-danger cursor-pointer"/>
        </GateKeeper>
        <GateKeeper
          requiredModule="Demo batches"
          requiredPermission="all"
          submenumodule="Registration Form"
          submenuReqiredPermission="canUpdate"
        >
          <div className="form-check form-switch" style={{ paddingLeft: "2.5rem" }}>
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id={`status-switch-${form.uuid}`}
              checked={form.isActive === 1}
              onChange={() => handleStatusToggle(form)}
              style={{ cursor: "pointer" }}
            />
            <label
              className="form-check-label"
              htmlFor={`status-switch-${form.uuid}`}
              style={{ fontSize: "0.85rem" }}
            ></label>
          </div>
        </GateKeeper>
      </div>
    );
  };


  // Filter section start here
  const initialFilterStructure = [
    {
      label: "Counsellor",
      type: "search-select",
      inputname: "enquiryTakenby",
      urlParam: "enquiryTakenby",
      value: "",
      options: usersWithCounsellorsData ?? [],
      fetchOptions: async (search) => {
        const counsellors = await ERPApi.get(`/user/list_user`, {
          params: { search: search ? search : searchParams.get('enquiryTakenby') ?? "" }
        });
        const trainerList = counsellors?.data?.reversedusers?.map((item) => ({
          label: item?.fullname,
          value: item?.id,
        }));

        // Map different keys here
        return trainerList || [];
      }
    },

    {
      label: "From Date",
      type: "date",
      inputname: "fromDate",
      value: "",
    },
    {
      label: "To Date",
      type: "date",
      inputname: "toDate",
      value: "",
    },
    {
      label: "Trainer",
      type: "search-select",
      inputname: "trainer",
      urlParam: "trainer",
      value: "",
      options: trainersData ?? [],
      fetchOptions: async (search) => {
        const trainers = await ERPApi.get(`/batch/trainer`, {
          params: { search: search ? search : searchParams.get('trainer') ?? "" }
        });
        const trainerList = trainers?.data?.users?.map((item) => ({
          label: item?.fullname,
          value: item?.id,
        }));

        // Map different keys here
        return trainerList || [];
      }
    },
    {
      label: "Branch",
      type: "search-select",
      value: "",
      inputname: "branch",
      urlParam: "branch",
      options: branchData ?? [],
      fetchOptions: async (search) => {
        const branch = await ERPApi.get(`/settings/getbranch`, {
          params: { search: search ? search : searchParams.get('branch') ?? "" }
        });
        console.log("Branch API Response:", branch);
        const branchList = branch?.data?.branchData?.map((item) => ({
          label: item?.branch_name,
          value: item?.id,
        }));

        // Map different keys here
        return branchList || [];
      }
    }
  ]

  const [filterData, setFilterData] = useState(initialFilterStructure);


  useEffect(() => {
    setFilterData((prevState) =>
      prevState.map((item) => {
        if (item.inputname === "lead") {
          return { ...item, options: FleadSourceData };
        }
        // if (item.inputname === "enquiry") {
        //   return { ...item, options: EnquirytakenByData };
        // }
        // if (item.inputname === "branch") {
        //   return { ...item, options: FbranchData };
        // }
        if (item.inputname === "course") {
          return { ...item, options: FcoursesData };
        }
        if (item.inputname === "coursepackage") {
          return { ...item, options: coursesPackageData };
        }
        return item;
      }),
    );
  }, [
    // EnquirytakenByData, 
    branchData]);


  const HandleFilters = (index, name, value) => {
    setFilterData((prevState) => {
      let showToast = false;
      let updated = prevState.map((item, idx) =>
        idx === index ? { ...item, value } : item,
      );
      if (name === "fromDate") {
        updated = updated.map((item) => {
          if (item.inputname === "toDate") {
            if (item.value && item.value < value) {
              showToast = true;
              return {
                ...item,
                min: value,
                value: "",
              };
            }
            return {
              ...item,
              min: value,
            };
          }
          return item;
        });
      }
      if (showToast) {
        toast.warning("To Date cannot be earlier than From Date");
      }
      return updated;
    });
  };

  const FilterReset = () => {
    const resetFilterData = filterData?.map((item) => ({
      ...item,
      value: "",
    }));
    setFilterData(resetFilterData);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    initialFilterStructure.forEach((filter) => {
      newSearchParams.delete(
        filter.urlParam || filter.inputname || filter?.urlSearchParam,
      );
    });
    newSearchParams.delete("filter[trainer_label]");
    newSearchParams.delete("enquiryTakenby_label");
    setSearchParams(newSearchParams);
  };

  const filterSubmit = () => {
    const offcanvasElement = document.getElementById("offcanvasRight");
    const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  };

  return (
    <div>
      <BackButton heading="Registration Form" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row d-flex justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      <SearchInputField
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by name, description, start date, closing date"
                      />
                    </div>


                    <div
                      className="offcanvas offcanvas-end bg_white"
                      id="offcanvasRight"
                      aria-labelledby="offcanvasRightLabel"
                    >
                      <div className="offcanvas-body p-2 bg_white">
                        <Filter
                          filterData={filterData}
                          HandleFilters={HandleFilters}
                          filterReset={FilterReset}
                          filterSubmit={filterSubmit}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 text-end">
                    <GateKeeper
                      requiredModule="Demo batches"
                      requiredPermission="all"
                      submenumodule="Registration Form"
                      submenuReqiredPermission="canCreate"
                    >
                      <button type="button" className="btn btn-sm btn_primary fs-13">
                        <Link
                          to="create"
                          className="button_color"
                        >
                          <HiMiniPlus /> Create
                        </Link>
                      </button>
                    </GateKeeper>
                    <GateKeeper
                      requiredModule="Demo batches"
                      requiredPermission="all"
                      submenumodule="Custom Fields"
                      submenuReqiredPermission="canCreate"
                    >
                      <button
                        type="button"
                        className="btn btn-sm btn_primary fs-13 ms-2"
                      >
                        <Link
                          to="Customfields"
                          className="button_color"
                        >
                          <HiMiniPlus /> Fields
                        </Link>
                      </button>
                    </GateKeeper>
                    {role === "Admin" && (
                      <button
                        className="btn btn-sm btn_primary fs-13 ms-2 margin_top_12 button-res"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <MdFilterList className="me-1 mb-1" />
                        Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="table-responsive table-card border-0">
                  <div className="table-container table-scroll">
                    <CustomTable
                      data={forms}
                      columns={columns}
                      actions={actions}
                      tableClassName="table table-centered align-middle table-nowrap equal-cell-table table-hover"
                    />
                  </div>
                </div>

                <div className="mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: forms.length,
                        start: paginationMeta?.start,
                        end: paginationMeta?.end,
                        total: paginationMeta?.totalRecords,
                      }}
                      loading={false}
                    />
                  </div>

                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color pagination-select"
                        onChange={handlePerPageChange}
                        value={pageSize} // ✅ CHANGED
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>

                    <div>
                      <Pagination
                        currentPage={currentPage} // ✅ CHANGED
                        totalPages={Number(paginationMeta?.totalPages) || 1}
                        loading={false}
                        onPageChange={handlePage} // ✅ CHANGED
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demoform;