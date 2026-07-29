import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdFilterList, MdIncompleteCircle } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import AddBatch from "./AddBatch.jsx";
import { HiMiniPlus } from "react-icons/hi2";
import BackButton from "../../../components/backbutton/BackButton";
import feerecordimg from "../../../../assets/images/feedetails/fee_records.png";
import useBatchesProvider from "./batchesUtils/useBatchesProvider.jsx";
import Usedebounce from "../../../../dataLayer/hooks/useDebounce/Usedebounce.jsx";
import Pagination from "../../../../utils/Pagination.jsx";
import PaginationInfo from "../../../../utils/PaginationInfo.jsx";
import { RiEdit2Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext.jsx";
import GateKeeper from "../../../../rbac/GateKeeper.jsx";
import FormattedDate from "../../../../utils/FormattedDate.jsx";
import TimeConverter from "../../../../utils/TimeConverter.jsx";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsPeopleFill } from "react-icons/bs";
import AssignStudents from "./AssignStudents.jsx";
import { toast } from "react-toastify";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider.jsx";
import Select from "react-select";
import BatchCloseButton from "./BatchCloseButton.jsx";
import { IoLockClosedSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";

const Batches = () => {
  const navigate = useNavigate();
  const { permission } = usePermissionsProvider();
  const { BranchState } = useBranchContext();
  const { list } = useParams();

  const {
    BatchesState: {
      ActiveBatchesList,
      UpcomingBatchesList,
      CompletedBatchesList,
      PendingBatchesList,
    },
    DispatchBatches,
    getPaginatedActiveBatches,
    getPaginatedUpcomingBatchs,
    getPaginatedCompletedBatches,
    getPaginatedPendingBatches,
  } = useBatchesProvider();
  const { debouncesetSearch, debouncesetPage } = Usedebounce(DispatchBatches);
  const [showModal1, setShowModal1] = useState(false);

  const [showModal, setShowModal] = useState({
    assignStudents: false,
    closeBatch: false,
  });

  const [batchID, setBatchID] = useState(null);
  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  const handleEditClick = (id, batchType) => {
    setShowModal1(true);
    setBatchID(id);
    addQueryParams(id, batchType);
  };

  const handleAssignStudents = (id, batchName) => {
    setShowModal((prev) => ({
      ...prev,
      assignStudents: true,
    }));
    const queryParams = new URLSearchParams();
    queryParams.append("batchID", id);
    queryParams.append("batchName", batchName);
    navigate({
      pathname: `/batchmanagement/batches/${list}`,
      search: `?${queryParams.toString()}`,
    });
  };

  const [batchForCloseBatch, setBatchForCloseBatch] = useState({
    batchId: null,
    batchName: null,
  });

  const handleCloseBatchButton = (item) => {
    setShowModal((prev) => ({
      ...prev,
      closeBatch: true,
    }));
    setBatchForCloseBatch((prev) => ({
      ...prev,
      batchId: item?.id,
      batchName: item?.batchName,
    }));
  };

  const handleCloseModal1 = () => {
    setShowModal1(false);
    navigate({ pathname: window.location.pathname });
  };

  const handleCloseForSubmit = () => {
    setShowModal1(false);
    navigate({ pathname: window.location.pathname });

    const pathName = window.location.pathname

    if(pathName ==="/batchmanagement/batches/pendingList"){
    getPaginatedPendingBatches();
    }
    else if(pathName ==="/batchmanagement/batches/activelist"){
      getPaginatedActiveBatches();
    }
    else if(pathName ==="/batchmanagement/batches/upcominglist"){
      getPaginatedUpcomingBatchs();
    }

    // getPaginatedActiveBatches();
  };

  const handleCloseAssignStudents = () => {
    setShowModal((prev) => ({
      ...prev,
      assignStudents: false,
    }));
    navigate({ pathname: window.location.pathname });
  };

  const handleCloseAssignStudentSubmit = () => {
    setShowModal((prev) => ({
      ...prev,
      assignStudents: false,
    }));
    navigate({ pathname: window.location.pathname });
    if (activeTabs.ActiveBatches === true) {
      getPaginatedActiveBatches();
    } else if (activeTabs.UpcomingBatches === true) {
      getPaginatedUpcomingBatchs();
    }
  };

  const handleCloseBatchtoClose = () => {
    setShowModal((prev) => ({
      ...prev,
      closeBatch: false,
    }));
    setBatchForCloseBatch({
      batchId: null,
      batchName: null,
    });
  };

  const handleCloseBatchtoSubmit = () => {
    setShowModal((prev) => ({
      ...prev,
      closeBatch: false,
    }));
    setBatchForCloseBatch({
      batchId: null,
      batchName: null,
    });
    getPaginatedActiveBatches();
  };

  useEffect(() => {
    if (showModal1 === false) {
      navigate({ pathname: window.location.pathname });
    }
  }, [showModal1]);

  const addQueryParams = (id, batchType) => {
    const queryParams = new URLSearchParams();
    queryParams.append("batchID", id);
    queryParams.append("batchType", batchType);
    navigate({
      pathname: `/batchmanagement/batches/${list}`,
      search: `?${queryParams.toString()}`,
    });
  };

  function generateTimeOptions() {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const timeValue = `${formattedHour}:${formattedMinute}`;
        options.push(
          <option key={timeValue} value={timeValue}>
            {TimeConverter(timeValue)}
          </option>
        );
      }
    }
    return options;
  }

  const [activeTabs, setActiveTable] = useState({
    ActiveBatches: list === "activelist" ? true : false,
    UpcomingBatches: list === "upcominglist" ? true : false,
    CompletedBatches: list === "completedlist" ? true : false,
    PendingBatches: list === "pendinglist" ? true : false,
  });

  const [curriculumList, setCurriculumList] = useState({
    activeBatches: [],
    upcomingBatches: [],
    completedBatches: [],
    pendingBatches: [],
  });

  const [trinersList, setTrinersList] = useState({
    activeBatches: [],
    upcomingBatches: [],
    completedBatches: [],
    pendingBatches: [],
  });

  const [queryBatchesSearch, setQueryBatchesSearch] = useState({
    ActiveBatches: { curriculum: "", trainerName: "" },
    UpcomingBatches: { curriculum: "", trainerName: "" },
    CompletedBatches: { curriculum: "", trainerName: "" },
    PendingBatches: { curriculum: "", trainerName: "" },
  });

  const handleQuerySearch = (value, batchType, field) => {
    if (field === "curriculum") {
      setQueryBatchesSearch((prevFilters) => ({
        ...prevFilters,
        [batchType]: {
          ...prevFilters[batchType],
          [field]: value,
        },
      }));
    } else if (field === "trainerName") {
      setQueryBatchesSearch((prevFilters) => ({
        ...prevFilters,
        [batchType]: {
          ...prevFilters[batchType],
          [field]: value,
        },
      }));
    }
  };

  useEffect(() => {
    if (activeTabs.ActiveBatches === true) {
      const handler = setTimeout(() => {
        fetchCurriculumList(
          queryBatchesSearch.ActiveBatches.curriculum,
          "activeBatches"
        );
      }, 500);
      return () => clearTimeout(handler);
    } else if (activeTabs.UpcomingBatches === true) {
      const handler = setTimeout(() => {
        fetchCurriculumList(
          queryBatchesSearch.UpcomingBatches.curriculum,
          "upcomingBatches"
        );
      }, 500);
      return () => clearTimeout(handler);
    } else if (activeTabs.CompletedBatches === true) {
      const handler = setTimeout(() => {
        fetchCurriculumList(
          queryBatchesSearch.CompletedBatches.curriculum,
          "completedBatches"
        );
      }, 500);
      return () => clearTimeout(handler);
    } else if (activeTabs.PendingBatches === true) {
      const handler = setTimeout(() => {
        fetchCurriculumList(
          queryBatchesSearch.PendingBatches.curriculum,
          "pendingBatches"
        );
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [
    queryBatchesSearch.ActiveBatches.curriculum,
    queryBatchesSearch.UpcomingBatches.curriculum,
    queryBatchesSearch.CompletedBatches.curriculum,
    queryBatchesSearch.PendingBatches.curriculum,
    activeTabs,
  ]);

  useEffect(() => {
    if (activeTabs.ActiveBatches === true) {
      const handler = setTimeout(() => {
        fetchTrinersList(
          queryBatchesSearch.ActiveBatches.trainerName,
          "activeBatches"
        );
      }, 500);
      return () => clearTimeout(handler);
    } else if (activeTabs.UpcomingBatches === true) {
      const handler = setTimeout(() => {
        fetchTrinersList(
          queryBatchesSearch.UpcomingBatches.trainerName,
          "upcomingBatches"
        );
      }, 500);
      return () => clearTimeout(handler);
    } else if (activeTabs.CompletedBatches === true) {
      const handler = setTimeout(() => {
        fetchTrinersList(
          queryBatchesSearch.CompletedBatches.trainerName,
          "completedBatches"
        );
      }, 500);
      return () => clearTimeout(handler);
    } else if (activeTabs.PendingBatches === true) {
      const handler = setTimeout(() => {
        fetchTrinersList(
          queryBatchesSearch.PendingBatches.trainerName,
          "pendingBatches"
        );
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [
    queryBatchesSearch.ActiveBatches.trainerName,
    queryBatchesSearch.UpcomingBatches.trainerName,
    queryBatchesSearch.CompletedBatches.trainerName,
    queryBatchesSearch.PendingBatches.trainerName,
    activeTabs,
  ]);

  const fetchCurriculumList = async (value, batchType) => {
    try {
      const { data, status } = await ERPApi.get(
        `/batch/curriculum/filter?search=${value}`
      );

      if (status === 200) {
        const curriculumList = data?.map((item) => ({
          label: item.curriculumName,
          value: item.id,
        }));

        setCurriculumList((prevCurriculumList) => ({
          ...prevCurriculumList,
          [batchType]: curriculumList,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrinersList = async (value, batchType) => {
    try {
      const { data, status } = await ERPApi.get(
        `batch/trainer?search=${value}`
      );

      if (status === 200) {
        const trainersList = data?.users?.map((item) => ({
          label: item.fullname,
          value: item.id,
        }));
        setTrinersList((prev) => ({
          ...prev,
          [batchType]: trainersList,
        }));
      }
    } catch (error) {}
  };

  const [searchBatches, setSearchBatches] = useState({
    ActiveBatch: "",
    UpcomingBatch: "",
    CompltedBatch: "",
    PendingBatches: "",
  });

  // handle Search
  const handleSearch = (e, batch) => {
    const contextMap = {
      ActiveBatch: "ACTIVE_BATCHES_LIST",
      UpcomingBatch: "UPCOMING_BATCHES_LIST",
      CompltedBatch: "COMPLETED_BATCHES_LIST",
      PendingBatches: "PENDING_BATCHES_LIST",
    };
    const context = contextMap[batch];

    setSearchBatches((prev) => ({
      ...prev,
      [batch]: e.target.value,
    }));

    if (!context) return; // Exit if batch does not match any key in contextMap
    debouncesetSearch({ context, data: e.target.value });
  };

  // Handle PageSize
  const handlePerPage = (e, batches) => {
    const selectedValue = parseInt(e.target.value, 10);
    const batchContexts = {
      ActiveBatches: "ACTIVE_BATCHES_LIST",
      UpcomingBatches: "UPCOMING_BATCHES_LIST",
      CompletedBatches: "COMPLETED_BATCHES_LIST",
      PendingBatches: "PENDING_BATCHES_LIST",
    };

    const context = batchContexts[batches];
    if (context) {
      DispatchBatches({
        type: "SET_PER_PAGE",
        payload: {
          context: context,
          data: selectedValue,
        },
      });
    }
  };

  const [batchFilters, setBatchFilters] = useState({
    ActiveBatches: {
      fromDate: "",
      toDate: "",
      branch: "",
      curriculum: null,
      trainingMode: "",
      trainerName: null,
      startTime: "",
      endTime: "",
    },
    UpcomingBatches: {
      fromDate: "",
      toDate: "",
      branch: "",
      curriculum: null,
      trainingMode: "",
      trainerName: null,
      startTime: "",
      endTime: "",
    },
    CompletedBatches: {
      fromDate: "",
      toDate: "",
      branch: "",
      curriculum: null,
      trainingMode: "",
      trainerName: null,
      startTime: "",
      endTime: "",
    },
    PendingBatches: {
      fromDate: "",
      toDate: "",
      branch: "",
      curriculum: null,
      trainingMode: "",
      trainerName: null,
      startTime: "",
      endTime: "",
    },
  });

  const handleFilters = (e, batchType) => {
    const { name, value } = e.target;
    setBatchFilters((prevFilters) => ({
      ...prevFilters,
      [batchType]: {
        ...prevFilters[batchType],
        [name]: value,
      },
    }));
  };

  const handleQueryFilters = (e, batchType, filter) => {
    if (filter === "curriculum") {
      setBatchFilters((prevFilters) => ({
        ...prevFilters,
        [batchType]: {
          ...prevFilters[batchType],
          [filter]: e,
        },
      }));
    } else if (filter === "trainerName") {
      setBatchFilters((prevFilters) => ({
        ...prevFilters,
        [batchType]: {
          ...prevFilters[batchType],
          [filter]: e,
        },
      }));
    }
  };

  const FiltersReset = (batches) => {
    const resetFields = {
      ActiveBatches: {
        fromDate: "",
        toDate: "",
        branch: "",
        curriculum: null,
        trainingMode: "",
        trainerName: null,
        startTime: "",
        endTime: "",
      },
      UpcomingBatches: {
        fromDate: "",
        toDate: "",
        branch: "",
        curriculum: null,
        trainingMode: "",
        trainerName: null,
        startTime: "",
        endTime: "",
      },
      CompletedBatches: {
        fromDate: "",
        toDate: "",
        branch: "",
        curriculum: null,
        trainingMode: "",
        trainerName: null,
        startTime: "",
        endTime: "",
      },
      PendingBatches: {
        fromDate: "",
        toDate: "",
        branch: "",
        curriculum: null,
        trainingMode: "",
        trainerName: null,
        startTime: "",
        endTime: "",
      },
    };

    // Update the state based on the batches parameter
    if (resetFields[batches]) {
      setBatchFilters({
        ...batchFilters,
        [batches]: { ...resetFields[batches] },
      });
      const contextString =
        batches
          .split(/(?=[A-Z])/)
          .join("_")
          .toUpperCase() + "_LIST";
      DispatchBatches({
        type: "SET_FILTERS",
        payload: {
          context: contextString,
          data: { ...resetFields[batches] },
        },
      });
    }
  };

  //  handle the FilterSubmit
  const FiltersSubmit = (batches) => {
    const resetFields = {
      ActiveBatches: {
        fromDate: batchFilters?.ActiveBatches.fromDate,
        toDate: batchFilters?.ActiveBatches.toDate,
        branch: batchFilters?.ActiveBatches.branch,
        trainerName: batchFilters?.ActiveBatches?.trainerName,
        trainingMode: batchFilters?.ActiveBatches?.trainingMode,
        curriculum: batchFilters?.ActiveBatches?.curriculum,
        startTime: batchFilters?.ActiveBatches?.startTime,
        endTime: batchFilters?.ActiveBatches?.endTime,
      },
      UpcomingBatches: {
        fromDate: batchFilters?.UpcomingBatches.fromDate,
        toDate: batchFilters?.UpcomingBatches.toDate,
        branch: batchFilters?.UpcomingBatches.branch,
        curriculum: batchFilters?.UpcomingBatches?.curriculum,
        trainingMode: batchFilters?.UpcomingBatches?.trainingMode,
        trainerName: batchFilters?.UpcomingBatches.trainerName,
        startTime: batchFilters?.UpcomingBatches?.startTime,
        endTime: batchFilters?.UpcomingBatches?.endTime,
      },
      CompletedBatches: {
        fromDate: batchFilters?.CompletedBatches.fromDate,
        toDate: batchFilters?.CompletedBatches.toDate,
        branch: batchFilters?.CompletedBatches.branch,
        curriculum: batchFilters?.CompletedBatches?.curriculum,
        trainingMode: batchFilters?.CompletedBatches?.trainingMode,
        trainerName: batchFilters?.CompletedBatches.trainerName,
        startTime: batchFilters?.CompletedBatches?.startTime,
        endTime: batchFilters?.CompletedBatches?.endTime,
      },
      PendingBatches: {
        fromDate: batchFilters?.PendingBatches.fromDate,
        toDate: batchFilters?.PendingBatches.toDate,
        branch: batchFilters?.PendingBatches.branch,
        curriculum: batchFilters?.PendingBatches?.curriculum,
        trainingMode: batchFilters?.PendingBatches?.trainingMode,
        trainerName: batchFilters?.PendingBatches.trainerName,
        startTime: batchFilters?.PendingBatches?.startTime,
        endTime: batchFilters?.PendingBatches?.endTime,
      },
    };
    // Update the state based on the batches parameter
    if (resetFields[batches]) {
      setBatchFilters({
        ...batchFilters,
        [batches]: { ...resetFields[batches] },
      });
      const contextString =
        batches
          .split(/(?=[A-Z])/)
          .join("_")
          .toUpperCase() + "_LIST";
      DispatchBatches({
        type: "SET_FILTERS",
        payload: {
          context: contextString,
          data: { ...resetFields[batches] },
        },
      });
    }
  };

  // handle the Pagination
  const handleActiveBatchCurrentPage = (page) => {
    debouncesetPage({ context: "ACTIVE_BATCHES_LIST", data: page });
  };

  const handleUpcomingBatchesCurrentPage = (page) => {
    debouncesetPage({ context: "UPCOMING_BATCHES_LIST", data: page });
  };

  const handleCompletedBatchesCurrentPage = (page) => {
    debouncesetPage({ context: "COMPLETED_BATCHES_LIST", data: page });
  };
  const handlePendingBatchesCurrentPage = (page) => {
    debouncesetPage({ context: "PENDING_BATCHES_LIST", data: page });
  };

  // handle the Tabs

  const handleTabs = (batches) => {
    setActiveTable((prevState) => ({
      ...prevState, // Spread the previous state
      ActiveBatches: batches === "ActiveBatches",
      UpcomingBatches: batches === "UpcomingBatches",
      CompletedBatches: batches === "CompletedBatches",
      PendingBatches: batches === "PendingBatches",
    }));
    if (batches === "ActiveBatches") {
      getPaginatedActiveBatches();
    } else if (batches === "UpcomingBatches") {
      getPaginatedUpcomingBatchs();
    } else if (batches === "CompletedBatches") {
      getPaginatedCompletedBatches();
    } else if (batches === "PendingBatches") {
      getPaginatedPendingBatches();
    }
    setSearchBatches({
      ActiveBatch: "",
      UpcomingBatch: "",
      CompltedBatch: "",
      PendingBatches: "",
    });
  };

  // useEffect(() => {

  //   const { ActiveBatches, UpcomingBatches, CompletedBatches } = activeTabs;
  //   if (ActiveBatches) {
  //     getPaginatedActiveBatches();
  //   } else if (UpcomingBatches) {
  //     getPaginatedUpcomingBatchs();
  //   } else if (CompletedBatches) {
  //     getPaginatedCompletedBatches();
  //   }
  // }, [activeTabs]);

  const handleDeleteBatchByID = async (id, batchesType) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Batch",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const batchID = { id: id };
        const BatchesType = batchesType;

        try {
          const { data, status } = await toast.promise(
            ERPApi.delete(`/batch/deletebatch/${id}`, id),
            {
              pending: "Processing Batch Deleting...",
            }
          );
          if (status === 200) {
            if (BatchesType === "ACTIVE_BATCHES_LIST") {
              getPaginatedActiveBatches();
            } else if (BatchesType === "UPCOMING_BATCHES_LIST") {
              getPaginatedUpcomingBatchs();
            } else if (BatchesType === "PENDING_BATCHES_LIST") {
              getPaginatedPendingBatches();
            } else {
              getPaginatedCompletedBatches();
            }
            Swal.fire({
              title: "Deleted!",
              text: "Batch deleted Successfully.",
              icon: "success",
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the batch. Please try again.",
            icon: "error",
          });
        }
      }
    });
  };
  const getColor = (percent) => {
    if (percent === 0) return "#07bc0c";
    if (percent >= 1 && percent <= 9) return "#8e8c8c";
    if (percent >= 10 && percent <= 49) return "#f1c40f";
    if (percent >= 50 && percent <= 89) return "#eb6329";
    if (percent >= 90 && percent <= 100) return "#da3412";
  };
  return (
    <div>
      <BackButton heading="Batches" content="Back" to="/" />
      <div className="container-fluid mt-3">
        <ul
          className="nav gap-3 nav-tabs d-flex justify-content-center"
          id="pills-tab"
          role="tablist"
        >
          {/* active batches */}

          <GateKeeper
            requiredModule="Batch Management"
            submenumodule="Active Batches"
            submenuReqiredPermission="canRead"
          >
            <li className="nav-item w_100" role="presentation">
              <Link to="/batchmanagement/batches/activelist">
                <button
                  className={`bg_white nav-link  card card_animate w_100 ${activeTabs.ActiveBatches ? "active" : ""
                    }`}
                  type="button"
                  role="tab"
                  aria-selected={activeTabs.ActiveBatches}
                  onClick={() => handleTabs("ActiveBatches")}
                >
                  <div className="text-start ">
                    <div className="d-flex justify-content-between align-items-center ">
                      <div>
                        <span className="fs_20 fw-500 me-2">
                          Active Batches
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="avatar-md">
                          <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                            <img
                              src={feerecordimg}
                              className="img-fluid"
                              width="100px"
                              height="100px"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </Link>
            </li>
          </GateKeeper>

          {/* upcoming batches*/}
          <GateKeeper
            requiredModule="Batch Management"
            submenumodule="Upcoming Batches"
            submenuReqiredPermission="canRead"
          >
            <li className="nav-item w_100" role="presentation">
              <Link to="/batchmanagement/batches/upcominglist">
                <button
                  className={`nav-link  card card_animate w_100 ${activeTabs?.UpcomingBatches ? "active" : ""
                    }`}
                  type="button"
                  role="tab"
                  aria-selected={activeTabs.UpcomingBatches}
                  onClick={() => handleTabs("UpcomingBatches")}
                >
                  <div className="text-start">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fs_20 fw-500 me-2">
                          UpComing Batches
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="avatar-md">
                          <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                            <img
                              src={feerecordimg}
                              className="img-fluid"
                              width="100px"
                              height="100px"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </Link>
            </li>
          </GateKeeper>

          {/* completed batches */}
          <GateKeeper
            requiredModule="Batch Management"
            submenumodule="Completed Batches"
            submenuReqiredPermission="canRead"
          >
            <li className="nav-item w_100" role="presentation">
              <Link to="/batchmanagement/batches/completedlist">
                <button
                  className={`nav-link card card_animate w_100 ${activeTabs?.CompletedBatches ? "active" : ""
                    }`}
                  type="button"
                  role="tab"
                  aria-selected={activeTabs?.CompletedBatches}
                  onClick={() => handleTabs("CompletedBatches")}
                >
                  <div className="text-start">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fs_20 fw-500 me-2">
                          Completed Batches
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="avatar-md">
                          <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                            <img
                              src={feerecordimg}
                              className="img-fluid"
                              width="100px"
                              height="100px"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </Link>
            </li>
          </GateKeeper>

          {/* active batches */}

          <GateKeeper
            requiredModule="Batch Management"
            submenumodule="Pending Batches"
            submenuReqiredPermission="canRead"
          >
            <li className="nav-item w_100" role="presentation">
              <Link to="/batchmanagement/batches/pendingList">
                <button
                  className={`bg_white nav-link  card card_animate w_100 ${activeTabs.PendingBatches ? "active" : ""
                    }`}
                  type="button"
                  role="tab"
                  aria-selected={activeTabs.PendingBatches}
                  onClick={() => handleTabs("PendingBatches")}
                >
                  <div className="text-start ">
                    <div className="d-flex justify-content-between align-items-center ">
                      <div>
                        <span className="fs_20 fw-500 me-2">
                          Ending Soon
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="avatar-md">
                          <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                            <img
                              src={feerecordimg}
                              className="img-fluid"
                              width="100px"
                              height="100px"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </Link>
            </li>
          </GateKeeper>
        </ul>

        <div className="tab-content mt-3" id="pills-tabContent">
          <div className="row">
            <div className="col-xl-12">
              <div className="card-header">
                <div className="row justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      <input
                        type="search"
                        className="form-control search input_bg_color select"
                        placeholder="Search with BatchId"
                        name="search"
                        value={
                          activeTabs?.ActiveBatches === true
                            ? searchBatches?.ActiveBatch
                            : activeTabs?.UpcomingBatches === true
                              ? searchBatches?.UpcomingBatch
                              : activeTabs?.CompletedBatches === true
                                ? searchBatches?.CompltedBatch
                                : activeTabs?.PendingBatches === true
                                  ? searchBatches?.PendingBatches
                                  : ""
                        }
                        required
                        onChange={(e) =>
                          handleSearch(
                            e,
                            activeTabs?.ActiveBatches === true
                              ? "ActiveBatch"
                              : activeTabs?.UpcomingBatches === true
                                ? "UpcomingBatch"
                                : activeTabs?.CompletedBatches === true
                                  ? "CompltedBatch"
                                  : activeTabs?.PendingBatches === true
                                    ? "PendingBatches"
                                    : null
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="buttons_alignment">
                      <div className="fs-13 me-3 mt-2"></div>
                      <button
                        className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <MdFilterList className="me-1 mb-1 text_white" />
                        Filters
                      </button>

                      {activeTabs?.ActiveBatches === true &&
                        (userData?.user?.profile === "Admin" ||
                          userData?.user?.profile === "Regional Manager" ||
                          userData?.user?.profile === "Branch Manager" ||
                          userData?.user?.profile === "Support" ||
                          userData?.user?.profile === "Counsellor" ||
                          userData?.user?.profile === "Team Lead") && (
                          <GateKeeper
                            requiredModule="Batch Management"
                            submenumodule="Batch"
                            submenuReqiredPermission="canCreate"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                setShowModal1(true);
                                setBatchID(null);
                              }}
                              className="btn btn-sm btn-md btn_primary fs-13"
                            >
                              <HiMiniPlus className="text_white" />
                              Create Batch
                            </button>
                          </GateKeeper>
                        )}
                    </div>
                  </div>
                </div>
                <div
                  className="offcanvas offcanvas-end bg_light"
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">
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
                    {/*  Batch Start Date */}
                    <div>
                      <label className="form-label fs-s fw-medium text_color">
                        Batch Start Date
                      </label>
                      <input
                        className="  form-control input_bg_color  date_input_color "
                        id="rdob"
                        type="date"
                        name="fromDate"
                        value={
                          activeTabs?.ActiveBatches === true
                            ? batchFilters?.ActiveBatches?.fromDate
                            : activeTabs?.UpcomingBatches === true
                              ? batchFilters?.UpcomingBatches?.fromDate
                              : activeTabs?.CompletedBatches === true
                                ? batchFilters?.CompletedBatches?.fromDate
                                : activeTabs?.PendingBatches === true
                                  ? batchFilters?.PendingBatches?.fromDate
                                  : ""
                        }
                        onChange={(e) =>
                          handleFilters(
                            e,
                            activeTabs?.ActiveBatches === true
                              ? "ActiveBatches"
                              : activeTabs?.UpcomingBatches === true
                                ? "UpcomingBatches"
                                : activeTabs?.CompletedBatches === true
                                  ? "CompletedBatches"
                                  : activeTabs?.PendingBatches === true
                                    ? "PendingBatches"
                                    : ""
                          )
                        }
                        required
                      />
                    </div>

                    {/*  Batch End Date */}
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Batch End Date
                      </label>
                      <input
                        className=" form-control input_bg_color  date_input_color "
                        id="rdob"
                        type="date"
                        name="toDate"
                        value={
                          activeTabs?.ActiveBatches === true
                            ? batchFilters?.ActiveBatches?.toDate
                            : activeTabs?.UpcomingBatches === true
                              ? batchFilters?.UpcomingBatches?.toDate
                              : activeTabs?.CompletedBatches === true
                                ? batchFilters?.CompletedBatches?.toDate
                                : activeTabs?.PendingBatches === true
                                  ? batchFilters?.PendingBatches?.toDate
                                  : ""
                        }
                        onChange={(e) =>
                          handleFilters(
                            e,
                            activeTabs?.ActiveBatches === true
                              ? "ActiveBatches"
                              : activeTabs?.UpcomingBatches === true
                                ? "UpcomingBatches"
                                : activeTabs?.CompletedBatches === true
                                  ? "CompletedBatches"
                                  : activeTabs?.PendingBatches === true
                                    ? "PendingBatches"
                                    : ""
                          )
                        }
                        required
                      />
                    </div>

                    {/* batch start Time */}
                    {/* <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Batch Start Time
                      </label>
                      <select
                        className="form-select form-control bg_input input_bg_color black_300 select"
                        id="startTime"
                        name="startTime"
                        value={activeTabs?.ActiveBatches === true ? batchFilters?.ActiveBatches?.startTime : activeTabs?.UpcomingBatches === true ? batchFilters?.UpcomingBatches?.startTime : activeTabs?.CompletedBatches === true ? batchFilters?.CompletedBatches?.startTime : ""}
                        onChange={(e) => handleFilters(e, activeTabs?.ActiveBatches === true ? "ActiveBatches" : activeTabs?.UpcomingBatches === true ? "UpcomingBatches" : activeTabs?.CompletedBatches === true ? "CompletedBatches" : "")}
                        required
                      >
                        <option value="" disabled selected>
                          Select the Batch Start Time
                        </option>
                        {generateTimeOptions()}



                      </select>
                    </div> */}
                    {/* batch end Time */}
                    {/* <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Batch End Time
                      </label>
                      <select
                        className="form-select form-control bg_input input_bg_color black_300 select"
                        id="endTime"
                        name="endTime"
                        value={activeTabs?.ActiveBatches === true ? batchFilters?.ActiveBatches?.endTime : activeTabs?.UpcomingBatches === true ? batchFilters?.UpcomingBatches?.endTime : activeTabs?.CompletedBatches === true ? batchFilters?.CompletedBatches?.endTime : ""}
                        onChange={(e) => handleFilters(e, activeTabs?.ActiveBatches === true ? "ActiveBatches" : activeTabs?.UpcomingBatches === true ? "UpcomingBatches" : activeTabs?.CompletedBatches === true ? "CompletedBatches" : "")}
                        required
                      >
                        <option value="" disabled selected>
                          Select the Batch End Time
                        </option>
                        {generateTimeOptions()}
                      </select>
                    </div> */}

                    {(userData?.user?.profile === "Admin" ||
                      userData?.user?.profile === "Regional Manager" ||
                      userData?.user?.profile === "Support") && (
                        <div className="mt-2">
                          <label className="form-label fs-s fw-medium text_color">
                            Branch
                          </label>
                          <select
                            className="form-select form-control bg_input input_bg_color black_300 select"
                            id="branch"
                            name="branch"
                            value={
                              activeTabs?.ActiveBatches === true
                                ? batchFilters?.ActiveBatches?.branch
                                : activeTabs?.UpcomingBatches === true
                                  ? batchFilters?.UpcomingBatches?.branch
                                  : activeTabs?.CompletedBatches === true
                                    ? batchFilters?.CompletedBatches?.branch
                                    : activeTabs?.PendingBatches === true
                                      ? batchFilters?.PendingBatches?.branch
                                      : ""
                            }
                            onChange={(e) =>
                              handleFilters(
                                e,
                                activeTabs?.ActiveBatches === true
                                  ? "ActiveBatches"
                                  : activeTabs?.UpcomingBatches === true
                                    ? "UpcomingBatches"
                                    : activeTabs?.CompletedBatches === true
                                      ? "CompletedBatches"
                                      : activeTabs?.PendingBatches === true
                                        ? "PendingBatches"
                                        : ""
                              )
                            }
                            required
                          >
                            <option value="" disabled selected>
                              Select the Branch
                            </option>
                            {BranchState?.branches?.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.branch_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                    {/* curriculum */}

                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Curriculum
                      </label>

                      <Select
                        id="curriculum"
                        name="curriculum"
                        placeholder="Search the Curriculum"
                        classNamePrefix="Search"
                        className="fs-s bg-form text_color input_bg_color"
                        options={
                          activeTabs?.ActiveBatches === true
                            ? curriculumList?.activeBatches
                            : activeTabs?.UpcomingBatches === true
                              ? curriculumList.upcomingBatches
                              : activeTabs?.CompletedBatches === true
                                ? curriculumList?.completedBatches
                                : activeTabs?.PendingBatches === true
                                  ? curriculumList?.pendingBatches
                                  : []
                        }
                        onChange={(e) =>
                          handleQueryFilters(
                            e,
                            activeTabs?.ActiveBatches === true
                              ? "ActiveBatches"
                              : activeTabs?.UpcomingBatches === true
                                ? "UpcomingBatches"
                                : activeTabs?.CompletedBatches === true
                                  ? "CompletedBatches"
                                  : activeTabs?.PendingBatches === true
                                    ? "PendingBatches"
                                    : "",
                            "curriculum"
                          )
                        }
                        value={
                          activeTabs?.ActiveBatches === true
                            ? batchFilters?.ActiveBatches?.curriculum
                            : activeTabs?.UpcomingBatches === true
                              ? batchFilters?.UpcomingBatches?.curriculum
                              : activeTabs?.CompletedBatches === true
                                ? batchFilters?.CompletedBatches?.curriculum
                                : activeTabs?.PendingBatches === true
                                  ? batchFilters?.PendingBatches?.curriculum
                                  : ""
                        }
                        onInputChange={(inputValue) =>
                          handleQuerySearch(
                            inputValue,
                            activeTabs?.ActiveBatches === true
                              ? "ActiveBatches"
                              : activeTabs?.UpcomingBatches === true
                                ? "UpcomingBatches"
                                : activeTabs?.CompletedBatches === true
                                  ? "CompletedBatches"
                                  : activeTabs?.PendingBatches === true
                                    ? "PendingBatches"
                                    : "",
                            "curriculum"
                          )
                        }
                        isClearable
                      />
                    </div>

                    {userData?.user?.profile !== "Trainer" && (
                      <div>
                        <label className="form-label fs-s fw-medium text_color">
                          Trainer
                        </label>

                        <Select
                          id="trainerName"
                          name="trainerName"
                          placeholder="Search the Trainer"
                          classNamePrefix="Search"
                          className="fs-s bg-form text_color input_bg_color"
                          options={
                            activeTabs?.ActiveBatches === true
                              ? trinersList?.activeBatches
                              : activeTabs?.UpcomingBatches === true
                                ? trinersList?.upcomingBatches
                                : activeTabs?.CompletedBatches === true
                                  ? trinersList?.completedBatches
                                  : activeTabs?.PendingBatches === true
                                    ? trinersList?.pendingBatches
                                    : []
                          }
                          onChange={(e) =>
                            handleQueryFilters(
                              e,
                              activeTabs?.ActiveBatches === true
                                ? "ActiveBatches"
                                : activeTabs?.UpcomingBatches === true
                                  ? "UpcomingBatches"
                                  : activeTabs?.CompletedBatches === true
                                    ? "CompletedBatches"
                                    : activeTabs?.PendingBatches === true
                                      ? "PendingBatches"
                                      : "",
                              "trainerName"
                            )
                          }
                          value={
                            activeTabs?.ActiveBatches === true
                              ? batchFilters?.ActiveBatches?.trainerName
                              : activeTabs?.UpcomingBatches === true
                                ? batchFilters?.UpcomingBatches?.trainerName
                                : activeTabs?.CompletedBatches === true
                                  ? batchFilters?.CompletedBatches?.trainerName
                                  : activeTabs?.PendingBatches === true
                                    ? batchFilters?.PendingBatches?.trainerName
                                    : ""
                          }
                          onInputChange={(inputValue) =>
                            handleQuerySearch(
                              inputValue,
                              activeTabs?.ActiveBatches === true
                                ? "ActiveBatches"
                                : activeTabs?.UpcomingBatches === true
                                  ? "UpcomingBatches"
                                  : activeTabs?.CompletedBatches === true
                                    ? "CompletedBatches"
                                    : activeTabs?.PendingBatches === true
                                      ? "PendingBatches"
                                      : "",
                              "trainerName"
                            )
                          }
                          isClearable
                        />
                      </div>
                    )}

                    {/* trainingMode */}
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Training Mode
                      </label>
                      <select
                        className="form-select form-control bg_input input_bg_color black_300 select"
                        id="trainingMode"
                        name="trainingMode"
                        value={
                          activeTabs?.ActiveBatches === true
                            ? batchFilters?.ActiveBatches?.trainingMode
                            : activeTabs?.UpcomingBatches === true
                              ? batchFilters?.UpcomingBatches?.trainingMode
                              : activeTabs?.CompletedBatches === true
                                ? batchFilters?.CompletedBatches?.trainingMode
                                : activeTabs?.PendingBatches === true
                                  ? batchFilters?.PendingBatches?.trainingMode
                                  : ""
                        }
                        onChange={(e) =>
                          handleFilters(
                            e,
                            activeTabs?.ActiveBatches === true
                              ? "ActiveBatches"
                              : activeTabs?.UpcomingBatches === true
                                ? "UpcomingBatches"
                                : activeTabs?.CompletedBatches === true
                                  ? "CompletedBatches"
                                  : activeTabs?.PendingBatches === true
                                    ? "PendingBatches"
                                    : ""
                          )
                        }
                        required
                      >
                        <option value="" disabled selected>
                          Select the Training Mode
                        </option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                      <button
                        className="btn btn-sm btn_primary"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={() =>
                          FiltersReset(
                            activeTabs?.ActiveBatches === true
                              ? "ActiveBatches"
                              : activeTabs?.UpcomingBatches === true
                                ? "UpcomingBatches"
                                : activeTabs?.CompletedBatches === true
                                  ? "CompletedBatches"
                                  : activeTabs?.PendingBatches === true
                                    ? "PendingBatches"
                                    : ""
                          )
                        }
                      >
                        Clear
                      </button>
                    </div>
                    <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                      <button
                        className="btn btn-sm btn_primary"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={() =>
                          FiltersSubmit(
                            activeTabs?.ActiveBatches === true
                              ? "ActiveBatches"
                              : activeTabs?.UpcomingBatches === true
                                ? "UpcomingBatches"
                                : activeTabs?.CompletedBatches === true
                                  ? "CompletedBatches"
                                  : activeTabs?.PendingBatches === true
                                    ? "PendingBatches"
                                    : ""
                          )
                        }
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="table-responsive table-card table-container table-scroll border-0">
                    <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                      <thead>
                        <tr className="">
                          <th scope="col" className="fs-13 lh-xs fw-600 ">
                            S.No
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Batch Number
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Branch
                          </th>
                          <th
                            scope="col"
                            className="fs-13 lh-xs  fw-600  text-truncate"
                            style={{ maxWidth: "80px" }}
                            title="Curriculum"
                          >
                            Curriculum
                          </th>
                          <th
                            scope="col"
                            className="fs-13 lh-xs  fw-600  text-truncate"
                            style={{ maxWidth: "80px" }}
                            title="Trainer Name"
                          >
                            Trainer
                          </th>
                          <th
                            scope="col"
                            className="fs-13 lh-xs fw-600 text-truncate"
                            style={{ maxWidth: "50px" }}
                            title="Start Date - End Date"
                          >
                            Start Date - End Date
                          </th>
                          <th
                            className="fs-13 lh-xs  fw-600  text-truncate"
                            style={{ maxWidth: "50px" }}
                            title="Batch Timings"
                          >
                            Batch Timings
                          </th>
                          <th
                            scope="col"
                            className="fs-13 lh-xs  fw-600  text-truncate"
                            style={{ maxWidth: "80px" }}
                            title="Total sessions/completed Session"
                          >
                            Sessions
                          </th>

                          <th
                            scope="col"
                            className="fs-13 lh-xs  fw-600 text-truncate "
                            style={{ maxWidth: "80px" }}
                            title="Total students"
                          >
                            Students
                          </th>
                          <th
                            scope="col"
                            className="fs-13 lh-xs  fw-600 text-truncate "
                            style={{ maxWidth: "80px" }}
                            title="Progress"
                          >
                            Progress
                          </th>
                          {(activeTabs?.ActiveBatches ||
                            activeTabs?.UpcomingBatches ||
                            activeTabs?.CompletedBatches ||
                            activeTabs?.PendingBatches) &&
                            permission?.permissions?.map((subItem) => {
                              if (subItem.module === "Batch Management") {
                                const currentTab = activeTabs?.ActiveBatches
                                  ? "Active Batches"
                                  : activeTabs?.UpcomingBatches
                                    ? "Upcoming Batches"
                                    : "Completed Batches";
                                return subItem?.submenus?.map((submenu) => {
                                  if (
                                    submenu?.module === currentTab &&
                                    (submenu?.canUpdate ||
                                      submenu?.canRead ||
                                      submenu?.canDelete)
                                  ) {
                                    return (
                                      <th key={1}
                                        scope="col"
                                        className="fs-13 lh-xs text-center fw-600 "
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
                        {(
                          activeTabs?.ActiveBatches === true
                            ? ActiveBatchesList?.PaginatedActiveBatches &&
                            ActiveBatchesList?.PaginatedActiveBatches
                              ?.length > 0
                            : activeTabs?.UpcomingBatches === true
                              ? UpcomingBatchesList?.PaginatedUpcomingBatches &&
                              UpcomingBatchesList?.PaginatedUpcomingBatches
                                ?.length > 0
                              : activeTabs?.CompletedBatches === true
                                ? CompletedBatchesList?.PaginatedCompletedBatches &&
                                CompletedBatchesList?.PaginatedCompletedBatches
                                  .length > 0
                                : activeTabs?.PendingBatches === true
                                  ? PendingBatchesList?.PaginatedPendingBatches &&
                                  PendingBatchesList?.PaginatedPendingBatches
                                    .length > 0
                                  : null
                        ) ? (
                          (
                            activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.loading
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.loading
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.loading
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.loading
                                    : null
                          ) ? (
                            <tr>
                              <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                Loading...
                              </td>
                            </tr>
                          ) : (
                            (activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.PaginatedActiveBatches
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.PaginatedUpcomingBatches
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.PaginatedCompletedBatches
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.PaginatedPendingBatches
                                    : []
                            )?.map((item, index) => {
                              const totalSessions =
                                item?.copyCurriculum?.modules?.reduce(
                                  (total, module) =>
                                    total + module?.moduleDuration,
                                  0
                                );
                              // const totalCompletedSessions = item?.copyCurriculum?.modules?.filter(module => module.isCompleted===true)
                              //   .reduce((total, module) => total + module.moduleDuration, 0);

                              const ifModulesCompleted =
                                item?.copyCurriculum?.modules.length > 0
                                  ? item?.copyCurriculum?.modules?.every(
                                    (module) => module.isCompleted === true
                                  )
                                  : false;

                              let isDisabled = false;

                              if (userData?.user?.profile !== "Admin") {
                                if (userData?.user?.profile === "Trainer") {
                                  isDisabled =
                                    ifModulesCompleted === false ? true : false;
                                } else {
                                  isDisabled = true;
                                }
                              }

                              return (
                                <tr key={index}>
                                  <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                    {activeTabs?.ActiveBatches === true
                                      ? (ActiveBatchesList?.currentPage - 1) *
                                      ActiveBatchesList?.perPage +
                                      index +
                                      1
                                      : activeTabs?.UpcomingBatches === true
                                        ? (UpcomingBatchesList?.currentPage - 1) *
                                        UpcomingBatchesList?.perPage +
                                        index +
                                        1
                                        : activeTabs?.CompletedBatches === true
                                          ? (CompletedBatchesList?.currentPage -
                                            1) *
                                          CompletedBatchesList?.perPage +
                                          index +
                                          1
                                          : activeTabs?.PendingBatches === true
                                            ? (PendingBatchesList?.currentPage -
                                              1) *
                                            PendingBatchesList?.perPage +
                                            index +
                                            1
                                            : 0}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.batchName}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.branch?.branch_name}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "120px" }}
                                    title={item?.curriculum?.curriculumName}
                                  >
                                    {item?.copyCurriculum?.curriculumName}
                                  </td>

                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "120px" }}
                                    title={item?.users[0]?.fullname}
                                  >
                                    {item?.users[0]?.fullname}
                                  </td>

                                  <td className="fs-13 black_300  lh-xs bg_light ">
                                    {FormattedDate(item?.startDate)} -{" "}
                                    {FormattedDate(item?.endDate)}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "130px" }}
                                  >
                                    {TimeConverter(
                                      item?.startTime,
                                      item?.endTime
                                    )}
                                  </td>

                                  <td
                                    className="fs-13 black_300  lh-xs bg_light"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="right"
                                    title="Completed Session/Total Sessions"
                                  >
                                    {item?.actualSessionCount}/{totalSessions}
                                  </td>

                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "70px" }}
                                    title={item?.students?.length}
                                  >
                                    {item?.students?.length}
                                  </td>
                                  <td
                                    style={{
                                      color: getColor(
                                        Number(
                                          (
                                            (item.copyCurriculum
                                              .completedModuleCount /
                                              item.copyCurriculum
                                                .totalModuleCount) *
                                            100
                                          ).toFixed(1)
                                        )
                                      ),
                                    }}
                                    className="fs-13 lh-xs bg_light"
                                  >
                                    {item?.copyCurriculum?.totalModuleCount
                                      ? (
                                        (item.copyCurriculum
                                          .completedModuleCount /
                                          item.copyCurriculum
                                            .totalModuleCount) *
                                        100
                                      ).toFixed(1) + " %"
                                      : "0.00 %"}
                                  </td>
                                  {/*  */}
                                  {(activeTabs?.ActiveBatches ||
                                    activeTabs?.UpcomingBatches ||
                                    activeTabs?.CompletedBatches ||
                                    activeTabs?.PendingBatches
                                  ) &&
                                    permission?.permissions?.map((subItem) => {
                                      if (
                                        subItem.module === "Batch Management"
                                      ) {
                                        const currentTab =
                                          activeTabs?.ActiveBatches
                                            ? "Active Batches"
                                            : activeTabs?.UpcomingBatches
                                              ? "Upcoming Batches"
                                            : activeTabs?.PendingBatches
                                              ? "Pending Batches"
                                              : "Completed Batches";
                                        const currentTabSlug =
                                          activeTabs?.ActiveBatches
                                            ? "ActiveBatch"
                                            : activeTabs?.UpcomingBatches
                                              ? "UpcomingBatch"
                                            : activeTabs?.PendingBatches
                                              ? "PendingBatch"
                                              : "CompletedBatch";

                                        const currentTabSlug1 =
                                          activeTabs?.ActiveBatches
                                            ? "active"
                                            : activeTabs?.UpcomingBatches
                                              ? "upcoming"
                                            : activeTabs?.PendingBatches
                                              ? "pending"
                                              : "completed";
                                        const currentTabList =
                                          activeTabs?.ActiveBatches
                                            ? "ACTIVE_BATCHES_LIST"
                                            : activeTabs?.UpcomingBatches
                                              ? "UPCOMING_BATCHES_LIST"
                                            : activeTabs?.PendingBatches
                                              ? "PENDING_BATCHES_LIST"
                                              : "COMPLETED_BATCHES_LIST";

                                        return subItem?.submenus?.map(
                                          (submenu) => {
                                            if (
                                              submenu?.module === currentTab &&
                                              (submenu?.canRead ||
                                                submenu?.canUpdate ||
                                                submenu?.canDelete)
                                            ) {
                                              return (
                                                <td className="fs-13 black_300 lh-xs bg_light" key={1}>
                                                  {/* Assign Students Button */}
                                                  <GateKeeper
                                                    requiredModule="Batch Management"
                                                    submenumodule={currentTab}
                                                    submenuReqiredPermission="canUpdate"
                                                  >
                                                    {!activeTabs?.CompletedBatches && (
                                                      <BsPeopleFill
                                                        className="fs-13 me-3"
                                                        title="Assign Batch"
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                          handleAssignStudents(
                                                            item?.id,
                                                            item?.batchName
                                                          )
                                                        }
                                                      />
                                                    )}
                                                  </GateKeeper>

                                                  {/* Edit Button */}
                                                  <GateKeeper
                                                    requiredModule="Batch Management"
                                                    submenumodule={currentTab}
                                                    submenuReqiredPermission="canUpdate"
                                                  >
                                                    {!activeTabs?.CompletedBatches && (
                                                      <RiEdit2Line
                                                        className="edit_icon table_icons me-3"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Edit Batch"
                                                        type="button"
                                                        onClick={() =>
                                                          handleEditClick(
                                                            item?.id,
                                                            currentTabSlug
                                                          )
                                                        }
                                                      />
                                                    )}
                                                  </GateKeeper>

                                                  {/* Delete Button */}
                                                  <GateKeeper
                                                    requiredModule="Batch Management"
                                                    submenumodule={currentTab}
                                                    submenuReqiredPermission="canDelete"
                                                  >
                                                    <MdDelete
                                                      className="delete_icon table_icons me-3 cursor-pointer"
                                                      title="Delete Batch"
                                                      onClick={() =>
                                                        handleDeleteBatchByID(
                                                          item?.id,
                                                          currentTabList
                                                        )
                                                      }
                                                    />
                                                  </GateKeeper>

                                                  {/* Close Batch Button*/}
                                                  <GateKeeper
                                                    requiredModule="Batch Management"
                                                    submenumodule={currentTab}
                                                    submenuReqiredPermission="canUpdate"
                                                  >
                                                    {(activeTabs?.ActiveBatches ===
                                                      true || activeTabs?.PendingBatches ===
                                                      true) && (
                                                        <IoLockClosedSharp
                                                          title="Close Batch"
                                                          className="fs-13 black_300 me-3"
                                                          style={{
                                                            cursor: isDisabled
                                                              ? "not-allowed"
                                                              : "pointer",
                                                            opacity: isDisabled
                                                              ? 0.5
                                                              : 1,
                                                          }}
                                                          onClick={
                                                            !isDisabled
                                                              ? () =>
                                                                handleCloseBatchButton(
                                                                  item
                                                                )
                                                              : undefined
                                                          }
                                                        />
                                                      )}
                                                  </GateKeeper>

                                                  {/* Launch Link */}
                                                  <GateKeeper
                                                    requiredModule="Batch Management"
                                                    submenumodule={currentTab}
                                                    submenuReqiredPermission="canRead"
                                                  >
                                                    <Link
                                                      to={`/batchmanagement/${list}/launch/${currentTabSlug1}/${item?.id}`}
                                                    >
                                                      <FaArrowRightLong title="View"/>
                                                    </Link>
                                                  </GateKeeper>
                                                </td>
                                              );
                                            }
                                            return null;
                                          }
                                        );
                                      }
                                      return null;
                                    })}
                                </tr>
                              );
                            })
                          )
                        ) : (
                          <tr>
                            <td className="fs-13 black_300  lh-xs bg_light ">
                              no data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                    <div className="col-sm">
                      <PaginationInfo
                        data={{
                          length:
                            activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.PaginatedActiveBatches
                                ?.length
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.PaginatedUpcomingBatches
                                  ?.length
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.PaginatedCompletedBatches
                                    ?.length
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.PaginatedPendingBatches
                                      ?.length
                                    : null,
                          start:
                            activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.startBatch
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.startBatch
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.startBatch
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.startBatch
                                    : null,
                          end:
                            activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.endBatch
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.endBatch
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.endBatch
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.endBatch
                                    : null,
                          total:
                            activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.searchResultBatches
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.searchResultBatches
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.searchResultBatches
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.searchResultBatches
                                    : null,
                        }}
                        loading={ActiveBatchesList?.loading}
                      />
                    </div>
                    <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                      <div className="mt-2">
                        <select
                          className="form-select form-control me-3 input_bg_color pagination-select "
                          aria-label="Default select example"
                          required
                          onChange={(e) =>
                            handlePerPage(
                              e,
                              activeTabs?.ActiveBatches === true
                                ? "ActiveBatches"
                                : activeTabs?.UpcomingBatches === true
                                  ? "UpcomingBatches"
                                  : activeTabs?.CompletedBatches === true
                                    ? "CompletedBatches"
                                    : activeTabs?.PendingBatches === true
                                      ? "PendingBatches"
                                      : null
                            )
                          }
                          value={
                            activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.perPage
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.perPage
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.perPage
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.perPage
                                    : ""
                          }
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
                          currentPage={
                            activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.currentPage
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.currentPage
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.currentPage
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.currentPage
                                    : null
                          }
                          totalPages={
                            activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.totalPages
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.totalPages
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.totalPages
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.totalPages
                                    : null
                          }
                          loading={
                            activeTabs?.ActiveBatches === true
                              ? ActiveBatchesList?.loading
                              : activeTabs?.UpcomingBatches === true
                                ? UpcomingBatchesList?.loading
                                : activeTabs?.CompletedBatches === true
                                  ? CompletedBatchesList?.loading
                                  : activeTabs?.PendingBatches === true
                                    ? PendingBatchesList?.loading
                                    : null
                          }
                          onPageChange={
                            activeTabs?.ActiveBatches === true
                              ? handleActiveBatchCurrentPage
                              : activeTabs?.UpcomingBatches === true
                                ? handleUpcomingBatchesCurrentPage
                                : activeTabs?.CompletedBatches === true
                                  ? handleCompletedBatchesCurrentPage
                                  : activeTabs?.PendingBatches === true
                                    ? handlePendingBatchesCurrentPage
                                    : null
                          }
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

      {showModal1 === true && batchID === null && (
        <AddBatch
          show={showModal1}
          handleClose={handleCloseModal1}
          handleCloseForSubmit={handleCloseForSubmit}
        />
      )}

      {showModal1 === true && batchID !== null && (
        <AddBatch
          show={showModal1}
          handleClose={handleCloseModal1}
          handleCloseForSubmit={handleCloseForSubmit}
          batchID={batchID}
        />
      )}

      {showModal.assignStudents === true && (
        <AssignStudents
          show={showModal.assignStudents}
          handleClose={handleCloseAssignStudents}
          handleSubmitClose={handleCloseAssignStudentSubmit}
        />
      )}

      {showModal?.closeBatch === true &&
        batchForCloseBatch.batchId !== null && (
          <BatchCloseButton
            batch={batchForCloseBatch}
            show={showModal?.closeBatch}
            handleClose={handleCloseBatchtoClose}
            handleSubmitClose={handleCloseBatchtoSubmit}
          />
        )}
    </div>
  );
};

export default Batches;
