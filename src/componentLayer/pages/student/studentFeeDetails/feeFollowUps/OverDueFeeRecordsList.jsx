import React, { useCallback, useEffect, useRef, useState } from 'react'

import PaginationInfo from '../../../../../utils/PaginationInfo';
import CustomFilters from '../../../../../utils/CustomFilters';
import GateKeeper from '../../../../../rbac/GateKeeper';
import { MdConnectWithoutContact, MdFilterList } from 'react-icons/md';
import { Link, useFetcher, useLoaderData, useNavigation, useSearchParams, useSubmit } from 'react-router-dom';
import { debounce } from '../../../../../utils/Utils';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { AiFillEye } from 'react-icons/ai';
import Pagination from '../../../../../utils/Pagination';
import { BiBookOpen, BiCheckCircle, BiExport } from 'react-icons/bi';
import * as XLSX from "xlsx";
import { toast } from 'react-toastify';
import { GrDocumentNotes, GrNotes } from "react-icons/gr";
import { FaClock, FaDollarSign, FaPhoneVolume, FaRegCalendarAlt, FaRupeeSign } from "react-icons/fa";
import { CiViewList } from 'react-icons/ci';
import Filter from '../../../../../utils/FilterWithSearchParams';
import SearchInputField from '../../../../../utils/SearchInputField';
import { Offcanvas } from 'bootstrap';
import CustomTable from '../../../../../utils/CustomTable';
import { BsLayoutThreeColumns } from 'react-icons/bs';



export const OverDueFeeRecordsListLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  const queryParams = url.search || "?page=1&pageSize=10&search=";
  try {
    const [
      OverDueFeeRecordsData,
      BranchesData,
      coursesData,
      counsellorsData,
      leadSourceData,
    ] = await Promise.all([
      ERPApi.get(`/fee/overduefeerecords${queryParams}`),
      ERPApi.get(`/settings/getbranch`),
      ERPApi.get(`/batch/course`, {
        params: {
          search: url.searchParams.get('course_label') ?? '',
        }
      }),
      ERPApi.get(`/user/userswithcounsellors`),
      ERPApi.get(`/settings/getleadsource`),
    ]);

    const BranchsList = BranchesData?.data?.branchData?.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    })) || [];

    const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
      label: item?.course_name,
      value: item.id,
    })) || [];

    const counsellorsList = counsellorsData?.data?.userswithcounselor?.map(
      (item) => ({
        label: item?.fullname,
        value: item.id,
      })
    ) || [];

    const leadSourceList = leadSourceData?.data?.leadSourceData?.map((item) => ({
      label: item?.leadsource,
      value: item?.leadsource,
    }))

    const OverDueFeeRecordsList = OverDueFeeRecordsData.data || [];


    return {
      leadSourceList,
      coursesList,
      BranchsList,
      counsellorsList,
      OverDueFeeRecordsList,

    };
  } catch (error) {
    console.error(error);
    return null;
  }
}


// app/routes/followuphistory.create.jsx

export async function OverDueFeeRecordsListAction({ request }) {
  const formData = await request.formData();
  const data = JSON.parse(formData.get('payload'));
  const installmentId = formData.get('installmentId');
  const payload = {
    note: data.notes,
    status: data.status,
    followUp_type: data.type,
    promise_amount: data.promisedAmount,
    promise_date: data.date,
    installment_id: installmentId,
  }
  // send to your backend API
  const response = await toast.promise(
    ERPApi.post("followuphistory/create", payload),
    {
      loading: "Saving follow-up history...",
      success: "Follow-up history created successfully!",
      error: (err) =>
        err?.response?.data?.message || "Failed to create follow-up history",
    }
  );

  return response;
}




const OverDueFeeRecordsList = () => {
  const data = useLoaderData();
  const submit = useSubmit();
  const fetcher = useFetcher();
  const today = new Date().toISOString().split("T")[0];

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    notes: '',
    date: today,
    promisedAmount: 0,
    type: 'Call',
    status: 'Pending',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: ""
    })
  };

  const [errors, setErrors] = useState({})
  const handleSubmit = (e, id) => {
    e.preventDefault();
    if (!formData.notes) {
      setErrors(prev => ({
        ...prev,
        notes: "Notes is required"
      }))
      return;
    } else if (formData.notes?.trim().replace(/\s+/g, "").length < 10) {
      setErrors(prev => ({
        ...prev,
        notes: "Notes must be at least 10 characters long"
      }))
      return;
    }
    if (formData?.promisedAmount > formData?.dueamount) {
      setErrors(prev => ({
        ...prev,
        promisedAmount: "Promised amount must be equal or less then due amount"
      }))
      return;
    }

    const payload = new FormData();
    payload.set('payload', JSON.stringify(formData));
    payload.set('installmentId', id);
    // return;
    // submit through fetcher
    fetcher.submit(payload, {
      method: 'POST',
      encType: 'application/form-data',
    });
    // Here you can handle the form submission, e.g., send it to an API.
  };

  // Open the modal
  const [activeInteractionItem, setActiveInteractionItem] = useState(null);
  const [notesStudentDetails, setNotesStudentDetails] = useState({
    studentName: "",
    dueamount: "",
    duedate: "",
  })
  const handleOpenModal = (item) => {
    // Set the specific item data so the form knows which student this is for
    setActiveInteractionItem(item);
    setNotesStudentDetails({
      studentName: item.studentDetails?.name,
      dueamount: item.dueamount,
      duedate: item.duedate
    })
    // Optional: Reset your formData here if needed
    setFormData({
      notes: '',
      date: today,
      type: 'Call',
      promisedAmount: '',
      status: 'Pending',
      dueamount: item?.dueamount
    });
  };

  const handleCloseModal = () => {
    setActiveInteractionItem(null);
    setFormData({
      notes: '',
      date: today,
      promisedAmount: 0,
      type: 'Call',
      status: 'Pending',
    });
  };

  useEffect(() => {
    if (fetcher.data?.status == 200)
      handleCloseModal();
  }, [fetcher.data])

  // Close the modal
  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   // Reset form on close
  //   setFormData({
  //     notes: '',
  //     date: today,
  //     promisedAmount: 0,
  //     type: 'Call',
  //     status: 'Pending',
  //   });
  // }

  const {
    leadSourceList = [],
    coursesList = [],
    BranchsList = [],
    counsellorsList = [],
    OverDueFeeRecordsList = [],
  } = data || {};


  const navigation = useNavigation();

  const initialState = [
    {
      label: "Admission From Date",
      type: "date",
      inputname: "filter[admissionFromDate]",
      value: "",
    },
    { label: " Admission To Date", type: "date", inputname: "filter[admissionToDate]", value: "" },
    {
      label: "From Date",
      type: "date",
      inputname: "filter[fromDate]",
      value: "",
      max: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
    },
    { label: "To Date", type: "date", inputname: "filter[toDate]", value: "", max: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] },
    // {
    //   label: "Course",
    //   type: "select",
    //   inputname: "course",
    //   value: "",
    //   options: coursesList,
    // },
    {
      label: "Course",
      type: "search-select",
      inputname: "filter[course]",
      urlParam: "filter[course]",
      urlSearchParam: "course_label",
      options: coursesList ?? [],
      fetchOptions: async (search) => {
        const coursesData = await ERPApi.get(`/batch/course`, {
          params: { search: search ? search : searchParams.get('course_label') ?? "" }
        });
        const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
          label: item?.course_name,
          value: item?.id,
        }));
        return coursesList || [];
      }
    },
    {
      label: "Counsellor",
      type: "select",
      inputname: "filter[enquiryTakenby]",
      value: "",
      options: counsellorsList,
    },
    {
      label: "Branch",
      type: "select",
      value: "",
      inputname: "filter[branch]",
      options: BranchsList,
    },
    {
      label: "Mode Of Training",
      type: "select",
      inputname: "filter[modeOfTraining]",
      value: "",
      options: [
        { label: "Online", value: "online" },
        // { label: "not Issued", value: " " },
        { label: "Offline", value: "offline" },
      ],
    },

    {
      label: "Lead Source",
      type: "select",
      inputname: "filter[leadsource]",
      value: "",
      options: leadSourceList,
    },
    {
      label: "Status",
      type: "select",
      inputname: "filter[status]",
      value: "",
      options: [
        { label: "All", value: 2 },
        { label: "Active", value: 1 },
        { label: "In Active", value: 0 },
      ],
    },

  ];


  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState(initialState);
  const HandleFilters = (index, name, value) => {
    setFilterData(prevState => {
      let showToast = false;

      let updated = prevState.map((item, idx) =>
        idx === index ? { ...item, value } : item
      );

      // When From Date changes
      if (name === "fromDate") {
        updated = updated.map(item => {
          if (item.inputname === "toDate") {
            if (item.value && item.value < value) {
              showToast = true;
              return {
                ...item,
                min: value,
                value: "", // reset invalid To Date
              };
            }

            return {
              ...item,
              min: value, // always update min
            };
          }
          return item;
        });
      }

      // Fire toast AFTER state calculation
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
    initialState.forEach(filter => {
      newSearchParams.delete(filter.urlParam || filter.inputname || filter?.urlSearchParam);
    });
    newSearchParams.delete("filter[course_label]");
    newSearchParams.delete("filter[course]_label");

    setSearchParams(newSearchParams);
  };

  const filterSubmit = () => {
    const offcanvasElement = document.getElementById("offcanvasRight");
    const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  };
  const [Qparams, setQParams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    fromDate: "",
    toDate: "",
    admissionFromDate: "",
    admissionToDate: "",
    branch: "",
    course: "",
    modeOfTraining: "",
    enquiryTakenby: "",
    leadsource: "",
    status: "",
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
        "filter[fromDate]": param.fromDate || "",
        "filter[toDate]": param.toDate || "",
        "filter[admissionFromDate]": param.admissionFromDate || "",
        "filter[admissionToDate]": param.admissionToDate || "",
        "filter[branch]": param.branch || "",
        "filter[course]": param.course || "",
        "filter[modeOfTraining]": param.modeOfTraining || "",
        "filter[enquiryTakenby]": param.enquiryTakenby || "",
        "filter[leadsource]": param.leadsource || "",
        "filter[status]": param.status || "",
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );


  const [excelLoading, setExcelLoading] = useState(false);

  const exportDueFeesToExcel = async (endpoint, showLoader = true) => {
    if (showLoader) setExcelLoading(true);

    try {
      const {
        search = "",
        page = 1,
        pageSize = 10,
        fromDate = "",
        toDate = "",
        admissionFromDate = "",
        admissionToDate = "",
        branch = "",
        course = "",
        modeOfTraining = "",
        enquiryTakenby = "",
        leadsource = "",
        status = "",
      } = Qparams || {};

      const baseUrl = import.meta.env.VITE_API_URL;

      const url = `${baseUrl}/fee/overduefeerecords?page=${page}&pageSize=${OverDueFeeRecordsList?.searchResultStudents}&search=${search}&filters[branch]=${branch}&filters[course]=${course}&filters[modeOfTraining]=${modeOfTraining}&filters[enquiryTakenby]=${enquiryTakenby}&filters[leadsource]=${leadsource}&filters[status]=${status}&filters[fromDate]=${fromDate}&filters[toDate]=${toDate}&filters[admissionFromDate]=${admissionFromDate}&filters[admissionToDate]=${admissionToDate}&filter[status]=${status}`;

      const { data } = await toast.promise(ERPApi.get(url), {
        pending: "Exporting data...",
        success: "Export successful!",
        error: "Export failed. Please try again.",
      });

      // Use correct data field from API
      const records = data?.overDueFeeRecords || [];

      const formattedData = records.map((item, index) => {
        const student = item.studentDetails || item; // adjust depending on API response
        const leadSource = (student.leadsource?.map(ls => ls.source) || []).join(", ") || "N/A";
        const courseName = student.courses || student.course?.[0]?.course_name || "";

        const BranchFriler = filterData?.find((filter) => filter.inputname === "branch");
        const branchLabel = BranchFriler?.options?.find((option) => option.value == branch)?.label || "";


        return {
          "S.No": index + 1,
          Name: student.name || "",
          Branch: student.branch || student.branches?.branch_name || "",
          Counsellor: student.user?.fullname || "",
          Contact: student.mobilenumber || student.email || "",
          Course: courseName,
          "Lead Source": leadSource,
          "Due Date": item.duedate || student.nextduedate || "",
          "Due Amount": item.dueamount || student.dueamount || 0,
          "Paid Status": item.paymentdone ? "Paid" : "Unpaid",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      worksheet["!cols"] = Array(formattedData[0]?.length || 10).fill({ wpx: 150 });

      const workbook = XLSX.utils.book_new();
      const sheetName = `OverDueFees`;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      const fileName = sheetName + ".xlsx";
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Something went wrong while exporting.");
    } finally {
      if (showLoader) setExcelLoading(false);
    }
  };

  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (OverDueFeeRecordsList?.currentPage - 1) * OverDueFeeRecordsList?.pageSize + index + 1,
    },
    {
      id: "name",
      header: "Name",
      accessor: (row) => row.studentDetails?.name || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "branch",
      header: "Branch",
      accessor: (row) => row.studentDetails?.branches?.branch_name || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "counsellor",
      header: "Counsellor",
      accessor: (row) => row.studentDetails?.user?.fullname || "N/A",
      sortable: true,
      hideable: true,
    },
    {
      id: "contact",
      header: "Contact",
      accessor: (row) => row.studentDetails?.mobilenumber || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "course",
      header: "Course",
      accessor: (row) => row.studentDetails?.course?.[0]?.course_name || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "leadSource",
      header: "Lead Source",
      accessor: (row) => row.studentDetails?.leadsource?.[0]?.source || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "dueDate",
      header: "Due Date",
      accessor: (row) => row.duedate || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "dueDays",
      header: "Due Days",
      accessor: (row) => {
        const msPerDay = 24 * 60 * 60 * 1000;
        const startDate = new Date(row.duedate);
        const today = new Date();
        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const dueDays = Math.floor((today - startDate) / msPerDay);

        return (
          <span className="badge text-danger">{dueDays}d overDue</span>
        );
      },
      sortable: true,
      hideable: true,
    },
    {
      id: "dueAmount",
      header: "Due Amount",
      accessor: (row) =>
        Number(parseFloat(row?.dueamount).toFixed(2)).toLocaleString("en-IN") || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "paidStatus",
      header: "Paid Status",
      accessor: (row) => {
        const installments = row.studentDetails?.totalinstallments?.[0];
        return installments
          ? `${installments.totalinstallmentspaid}/${installments.totalinstallments}`
          : "-";
      },
      sortable: true,
      hideable: true,
    },
  ];


  const actions = (row) => {
    const item = row;

    return (
      <div className="d-flex align-items-center gap-3">
        <GateKeeper
          requiredModule="Student Management"
          submenumodule="Fee Details"
          submenuReqiredPermission="canUpdate"
        >
          <Link to={`/student/feeUpdate?studentId=${item?.studentId}`}>
            <AiFillEye className="me-3" />
          </Link>
        </GateKeeper>

        <GrDocumentNotes
          onClick={() => handleOpenModal(item)}
          className="me-3"
          style={{ cursor: "pointer" }}
        />

        <Link
          to={`/student/feefollowUps/overdue/followupaction/${item.id}`}
          className="fw-bold"
        >
          <CiViewList />
        </Link>
      </div>
    );
  };


  const OverDueFeeRecordsListdata = OverDueFeeRecordsList?.overDueFeeRecords?.map((item) => ({
    ...item,
    rawItem: item,
  })) || [];



  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card border-0">
            <div className="card-header">
              <div className="row justify-content-between">
                <div className="col-sm-4">
                  <div className="search-box">
                    <SearchInputField />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="buttons_alignment">
                    <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
                      <div style={{ cursor: excelLoading ? "not-allowed" : "pointer" }}>
                        <button
                          className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
                          type="button"
                          onClick={() => exportDueFeesToExcel(Qparams)}
                          disabled={excelLoading}
                        ><BiExport className="me-1 mb-1" />
                          Export
                        </button>
                      </div>
                    </GateKeeper>
                    <button
                      className="btn btn-sm btn_primary fs-13 me-2  margin_top_12 button-res"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#columnOffcanvas"
                      title="Column Filter"
                    >
                      <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
                    </button>
                    <button
                      className="btn btn-sm btn_primary fs-13 me-1"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      <MdFilterList className="me-1 mb-1" />
                      Filters
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="offcanvas offcanvas-end bg_white text_color"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
              >
                <div className="offcanvas-header">
                  <h5
                    className="offcanvas-title"
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
                <div className="offcanvas-body p-2">
                  <Filter
                    filterData={filterData}
                    HandleFilters={HandleFilters}
                    filterReset={FilterReset}
                    filterSubmit={filterSubmit}
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive table-container table-scroll table-card  border-0">
                <CustomTable
                  data={OverDueFeeRecordsListdata}
                  columns={columns}
                  actions={actions}
                  enableColumnToggle={true}
                />


              </div>

              {/* pagination */}
              <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                <div className="col-sm">
                  <PaginationInfo
                    data={{
                      length: OverDueFeeRecordsList?.overDueFeeRecords?.length,
                      start: OverDueFeeRecordsList?.startStudent,
                      end: OverDueFeeRecordsList?.endStudent,
                      total: OverDueFeeRecordsList?.searchResultStudents,
                    }}
                    loading={navigation?.state === "loading"}
                  />
                </div>
                <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                  <div className="mt-3">
                    <select
                      className="form-select form-control me-3 text_color input_bg_color pagination-select"
                      aria-label="Default select example"
                      placeholder="Branch*"
                      name="branch"
                      id="branch"
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
                      currentPage={OverDueFeeRecordsList?.currentPage}
                      totalPages={OverDueFeeRecordsList?.totalPages}
                      loading={navigation?.state === "loading"}
                      onPageChange={handlePage}
                    />
                  </div>
                </div>
              </div>


              {/* Model */}
              {activeInteractionItem && (
                <div
                  className="modal fade show d-flex align-items-center justify-content-center"
                  style={{
                    display: 'block',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1050,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                  }}
                  tabIndex="-1"
                  aria-labelledby="newInteractionModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content shadow-lg rounded-4 border-0">
                      <div className="modal-header bg-light">
                        <h5 className="modal-title fw-bold" id="newInteractionModalLabel">
                          Notes: {activeInteractionItem?.name}
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={handleCloseModal}
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={(e) => handleSubmit(e, activeInteractionItem.id)}>
                          {/* Notes Field */}
                          <div className="mb-3">
                            <label htmlFor="notes" className="form-label fw-bold small main_color d-flex align-items-center">
                              <GrNotes size={15} className="me-1 erp-primary-color" />
                              Notes Summary:
                            </label>
                            <textarea
                              id="notes"
                              name="notes"
                              value={formData.notes}
                              onChange={handleChange}
                              className="form-control"
                              rows="3"
                              placeholder="e.g., Followed up on proposal..."
                              required
                            />
                            {errors.notes && <div className="text-danger mt-1 fs-12">{errors.notes}</div>}
                          </div>

                          {/* Row 1: Date & Type */}
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="date" className="form-label fw-bold small d-flex align-items-center">
                                <FaRegCalendarAlt size={15} className="me-1" />
                                Promised Date:
                              </label>
                              <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="form-control py-2"
                                min={today}
                                required
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <label htmlFor="type" className="form-label fw-bold small d-flex align-items-center">
                                {formData.type === 'Call' ? <FaPhoneVolume size={15} className="me-1" /> : <MdConnectWithoutContact size={15} className="me-1" />}
                                Interaction Type:
                              </label>
                              <select id="type" name="type" value={formData.type} onChange={handleChange} className="form-select" required>
                                <option value="Call">Call</option>
                                <option value="Counsel">Counsel (Meeting/Consultation)</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Direct Visit">Direct Visit</option>
                              </select>
                            </div>
                          </div>

                          {/* Row 2: Amount & Status */}
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="promisedAmount" className="form-label fw-bold small d-flex align-items-center">
                                <FaRupeeSign size={15} className="me-1" />
                                Promised Amount
                              </label>
                              <input
                                type="number"
                                name="promisedAmount"
                                value={formData.promisedAmount}
                                onChange={handleChange}
                                placeholder='Promised Amount'
                                className="form-control py-2"
                                min="0"
                                step="0.01"
                                required
                              />
                              {errors.promisedAmount && <div className="text-danger mt-1 fs-12">{errors.promisedAmount}</div>}
                            </div>

                            <div className="col-md-6 mb-3">
                              <label htmlFor="status" className="form-label fw-bold small d-flex align-items-center">
                                {formData.status === 'Closed' ? <BiCheckCircle size={15} className="me-1 text-success" /> : <FaClock size={15} className="me-1 text-warning" />}
                                Current Status:
                              </label>
                              <select name="status" value={formData.status} onChange={handleChange} className="form-select" required>
                                <option value="Pending">Pending</option>
                                <option value="Closed">Closed</option>
                                <option value="Promised">Payment Promised</option>
                                <option value="Visit Scheduled">Visit Scheduled</option>
                                <option value="Negotiating">Negotiating / Discount</option>
                                <option value="Busy">Busy / Call Back</option>
                                <option value="No Response">No Response</option>
                                <option value="Switch Off">Switch Off</option>
                                <option value="Delayed">Payment Delayed</option>
                                <option value="Resolved">Resolved / Paid</option>
                              </select>
                            </div>
                          </div>
                          {/* Row 2: Amount & Status */}
                          <div className="row">
                            <div className="col-12 mb-3">
                              <div
                                className="alert alert-primary py-1 px-2 mb-2"
                                role="alert"
                                style={{ fontSize: "0.8rem" }}
                              >
                                👤 {notesStudentDetails.studentName} |
                                💰 ₹{notesStudentDetails.dueamount} |
                                📅 {notesStudentDetails.duedate}
                              </div>

                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="d-flex justify-content-end pt-3 border-top">
                            <button
                              type="submit"
                              className="btn btn_primary d-flex align-items-center"
                              disabled={fetcher.state === 'submitting'}
                            >
                              {fetcher.state === 'submitting' ? 'Submitting...' : 'Submit'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverDueFeeRecordsList;




{/* <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
  <thead>
    <tr className="">
      <th
        scope="col"
        className="fs-13 lh-xs fw-600 "
      >
        S.No
      </th>
      <th
        scope="col"
        className="fs-13 lh-xs fw-600  "
      >
        Name
      </th>
      <th
        scope="col"
        className="fs-13 lh-xs  fw-600  "
      >
        Branch
      </th>
      <th
        scope="col"
        className="fs-13 lh-xs fw-600  "
      >
        Counsellor
      </th>
      <th
        scope="col"
        className="fs-13 lh-xs  fw-600  "
      >
        Contact
      </th>
      <th
        scope="col"
        className="fs-13 lh-xs  fw-600 "
      >
        Course
      </th>

      <th
        scope="col"
        className="fs-13 lh-xs  fw-600 "
      >
        Lead Source
      </th>
      <th
        scope="col"
        className="fs-13 lh-xs  fw-600 "
      >
        Due&nbsp;Date
      </th>
      <th
        scope="col"
        className="fs-13 lh-xs  fw-600 "
      >
        Due&nbsp;Days
      </th>
      <th
        scope="col"
        className="fs-13 lh-xs  fw-600 "
      >
        Due&nbsp;Amount
      </th>
      <th
        scope="col"
        className="fs-13 lh-xs  fw-600 "
      >
        Paid&nbsp;Status
      </th>
      <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
        <th
          scope="col"
          className="fs-13 lh-xs  fw-600 "
        >
          Action
        </th>
      </GateKeeper>
    </tr>
  </thead>
  <tbody>


    {
      OverDueFeeRecordsList?.overDueFeeRecords && OverDueFeeRecordsList?.overDueFeeRecords?.length > 0 ?
        OverDueFeeRecordsList?.overDueFeeRecords?.map((item, index) => {
          const msPerDay = 24 * 60 * 60 * 1000;

          const startDate = new Date(item.duedate);
          const today = new Date();

          startDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          const dueDays = Math.floor((today - startDate) / msPerDay);
          return (
            <tr key={index + 1}>
              <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                {(OverDueFeeRecordsList?.currentPage - 1) * OverDueFeeRecordsList.pageSize + index + 1}
              </td>
              <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }}>
                {item?.studentDetails?.name}
              </td>
              <td className="fs-13 black_300  lh-xs bg_light">
                {item?.studentDetails?.branches?.branch_name}
              </td>
              <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item?.studentDetails?.user?.fullname}>
                {item?.studentDetails?.user?.fullname}
              </td>
              <td className="fs-13 black_300  lh-xs bg_light">
                {item?.studentDetails?.mobilenumber}
              </td>
              <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item?.studentDetails?.course?.[0]?.course_name}>
                {item?.studentDetails?.course?.[0]?.course_name}
              </td>

              <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item?.studentDetails?.leadsource[0]?.source}>
                {item?.studentDetails?.leadsource[0]?.source}
              </td>
              <td className="fs-13 black_300  lh-xs bg_light ">
                {item?.duedate}
              </td>
              <td className="fs-13 black_300  lh-xs bg_light ">
                <span className="badge text-danger">{dueDays}d overDue</span>
              </td>
              <td className="fs-13 black_300  lh-xs  bg_light">
                {Number(
                  parseFloat(item?.dueamount).toFixed(2)
                ).toLocaleString("en-IN")}
              </td>
              <td className="fs-13 black_300  lh-xs bg_light ">
                {item?.studentDetails?.totalinstallments && item?.studentDetails?.totalinstallments.length > 0 ?
                  `${item?.studentDetails?.totalinstallments?.[0].totalinstallmentspaid}/${item?.studentDetails?.totalinstallments[0]?.totalinstallments}` :
                  '-'
                }
              </td>
              <td className="fs_14 text_mute bg_light lh-xs">
                <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
                  <Link to={`/student/feeUpdate?studentId=${item?.studentId}`}>
                    <AiFillEye className="me-3" />
                  </Link>
                </GateKeeper>

                <span>
                  <GrDocumentNotes
                    onClick={() => handleOpenModal(item)}
                    className="me-3"
                    style={{ cursor: 'pointer' }}
                  />
                </span>

                <Link to={`/student/feefollowUps/overdue/followupaction/${item.id}`} className='fw-bold'>
                  <CiViewList />
                </Link>
              </td>
            </tr>

          )
        })
        :
        (<tr>
          <td className="fs-13 black_300  lh-xs bg_light ">
            No Data
          </td>
        </tr>)
    }



  </tbody>
</table> */}