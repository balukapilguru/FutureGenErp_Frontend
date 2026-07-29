import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  useFetcher,
  useLoaderData,
  useParams,
  useSearchParams,
} from "react-router-dom";
import GateKeeper from "../../../../rbac/GateKeeper";
import BackButton from "../../../components/backbutton/BackButton";
import feerecordimg from "../../../../assets/images/feedetails/fee_records.png";
import { debounce } from "../../../../utils/Utils";
import { MdFilterList } from "react-icons/md";
import { HiMiniPlus } from "react-icons/hi2";
import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
import Select from "react-select";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiEdit2Line } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { BsLayoutThreeColumns, BsPeopleFill } from "react-icons/bs";
import { IoLockClosedSharp } from "react-icons/io5";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider";
import FormattedDate from "../../../../utils/FormattedDate";
import TimeConverter from "../../../../utils/TimeConverter";
import AddBatch from "./AddBatch";
import AssignStudents from "./AssignStudents";
import BatchCloseButton from "./BatchCloseButton";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Pagination from "../../../../utils/Pagination";
import CustomTable from "../../../../utils/CustomTable";

export const handleDeleteBatchByIDAction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const batchesType = formData.get("batchesType");

  try {
    const { status } = await ERPApi.delete(`/batch/deletebatch/${id}`, id);

    if (status === 200) {
      Swal.fire({
        title: "Deleted!",
        text: "Batch deleted successfully.",
        icon: "success",
      });
      return { success: true, batchesType };
    }
  } catch (error) {
    console.error(error,"Batch Delete Error");
    Swal.fire({
      title: "Error!",
      text: error?.response?.data?.message || "There was an error deleting the batch. Please try again.",
      icon: "error",
    });
    return { error: true };
  }
};

export const Batch = () => {
  const { list } = useParams();
  const fetcher = useFetcher();

  const { BranchState } = useBranchContext();
  const { permission } = usePermissionsProvider();
  const { trainerData, curriculumData, batches, branchData,regForms=[] } = useLoaderData();
  const {
    reversedBatches,
    currentPage,
    pageSize,
    totalPages,
    endBatch,
    searchResultBatches,
    startBatch,
    totalBatches,
  } = batches;
  //  States section
  const defaultFilters = {
    fromDate: "",
    toDate: "",
    branch: "",
    curriculum: null,
    trainingMode: "",
    trainerName: null,
    startTime: "",
    endTime: "",
  };

  const [searchBatches, setSearchBatches] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [curriculumList, setCurriculumList] = useState([]);
  const [trainersList, setTrainersList] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [showModal1, setShowModal1] = useState(false);
  const [batchID, setBatchID] = useState(null);
  const [batchForCloseBatch, setBatchForCloseBatch] = useState({
    batchId: null,
    batchName: null,
  });
  const [showModal, setShowModal] = useState({
    assignStudents: false,
    closeBatch: false,
  });

  const [querySearch, setQuerySearch] = useState({
    curriculum: "",
    trainerName: "",
  });
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const newpageSize = searchParams.get("pageSize");

  // Match with options

  // Data section
  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  //  functions section

  const debouncedSetSearchParams = useCallback(
    debounce((value) => {
      const params = new URLSearchParams(searchParams);
      params.set("search", value || "");
      setSearchParams(params);
    }, 500),
    [searchParams, setSearchParams],
  );

  // 🔹 handle search input
  const handleSearch = (e) => {
    setSearchBatches(e.target.value);
    const value = e.target.value;

    debouncedSetSearchParams(value);
  };

  const handleFilters = (e, type) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [`filter[${type}]`]: value,
    }));
  };

  const handleQueryFilters = (value, filter) => {
    const newvalue = value.value || "";
    setFilters((prev) => ({
      ...prev,
      [`filter[${filter}]`]: newvalue,
    }));
    if (filter === "trainer") {
      const trainer = trainersList.find((opt) => opt.value == newvalue);
      setSelectedTrainer(trainer);
    } else if (filter === "curriculum") {
      const curriculum = curriculumList.find((opt) => opt.value == newvalue);
      setSelectedCurriculum(curriculum);
    }
  };

  const handleQuerySearch = (value, field) => {
    setQuerySearch((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchTrinersList = async (value) => {
    try {
      const { data, status } = await ERPApi.get(
        `batch/trainer?search=${value}`,
      );

      if (status === 200) {
        const list =
          data?.users?.map((item) => ({
            label: item.fullname,
            value: item.id,
          })) || [];

        setTrainersList(list);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCurriculumList = async (value) => {
    try {
      const { data, status } = await ERPApi.get(
        `/batch/curriculum/filter?search=${value}`,
      );

      if (status === 200) {
        const list =
          data?.map((item) => ({
            label: item.curriculumName,
            value: item.id,
          })) || [];

        setCurriculumList(list);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const FiltersReset = () => {
    setFilters(defaultFilters);
    setSelectedTrainer(null);
    setSelectedCurriculum(null);

    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);

      Object.keys(filters).forEach((key) => {
        if (key.startsWith("filter[")) {
          updatedParams.delete(key);
        }
      });

      return updatedParams; // ✅ keep other params untouched
    });
  };

  const FiltersSubmit = () => {
    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        params[key] = value;
      }
    });

    setSearchParams((prevParams) => {
      const currentParams = Object.fromEntries(prevParams.entries());
      return { ...currentParams, ...params };
    });
  };

  const getColor = (percent) => {
    if (percent === 0) return "#07bc0c";
    if (percent >= 1 && percent <= 9) return "#8e8c8c";
    if (percent >= 10 && percent <= 49) return "#f1c40f";
    if (percent >= 50 && percent <= 89) return "#eb6329";
    if (percent >= 90 && percent <= 100) return "#da3412";
  };

  const addQueryParams = (id, batchType) => {
    // Copy existing params
    const params = Object.fromEntries([...searchParams]);

    // Add new params
    params.batchID = id;
    params.batchType = batchType;

    // Update the search params in URL
    setSearchParams(params);

    // Navigate with same pathname + updated query params
    // navigate({
    //     pathname: `/batchmanagement/batches/${list}`,
    //     search: `?${new URLSearchParams(params).toString()}`,
    // });
  };
  const handleAssignStudents = (id, batchName,trainingMode) => {
    setShowModal((prev) => ({
      ...prev,
      assignStudents: true,
    }));

    // Copy existing params
    const params = Object.fromEntries([...searchParams]);

    // Add new params
    params.batchID = id;
    params.batchName = batchName;
    params.trainingMode = trainingMode

    // Update URL query params
    setSearchParams(params);

    // navigate({
    //     pathname: `/batchmanagement/batches/${list}`,
    //     search: `?${new URLSearchParams(params).toString()}`,
    // });
  };
  const handleEditClick = (id, type) => {
    setShowModal1(true);
    setBatchID(id);
    addQueryParams(id, type);
  };
  const handleCloseModal1 = () => {
    setShowModal1(false);

    // ✅ Clear specific query parameters
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("batchID");
    newParams.delete("batchName");
    newParams.delete("trainingMode");
    
    // ✅ Apply the cleaned params
    setSearchParams(newParams);
  };
  
  const handleCloseForSubmit = () => {
    setShowModal1(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("batchID");
    newParams.delete("trainingMode");
    newParams.delete("batchName");

    // ✅ Apply the cleaned params
    setSearchParams(newParams);
    // navigate({ pathname: window.location.pathname });

    // const pathName = window.location.pathname

    // if (pathName === "/batchmanagement/batches/pendingList") {
    //     getPaginatedPendingBatches();
    // }
    // else if (pathName === "/batchmanagement/batches/activelist") {
    //     getPaginatedActiveBatches();
    // }
    // else if (pathName === "/batchmanagement/batches/upcominglist") {
    //     getPaginatedUpcomingBatchs();
    // }

    // getPaginatedActiveBatches();
  };

  const handleCloseAssignStudents = () => {
    setShowModal((prev) => ({
      ...prev,
      assignStudents: false,
    }));

    // ✅ Clear specific search params
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("batchID");
    newParams.delete("batchName");
    newParams.delete("trainingMode");

    setSearchParams(newParams); // ✅ Apply the updated params
  };

  const handleCloseAssignStudentSubmit = () => {
    setShowModal((prev) => ({
      ...prev,
      assignStudents: false,
    }));
    // navigate({ pathname: window.location.pathname });
    // if (activeTabs.ActiveBatches === true) {
    //     getPaginatedActiveBatches();
    // } else if (activeTabs.UpcomingBatches === true) {
    //     getPaginatedUpcomingBatchs();
    // }
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

    const params = Object.fromEntries([...searchParams]);

    // add/replace pageSize param
    params.pageSize = selectedValue;
    params.page = 1;
    setSearchParams(params);
    // const context = batchContexts[batches];
    // if (context) {
    //     DispatchBatches({
    //         type: "SET_PER_PAGE",
    //         payload: {
    //             context: context,
    //             data: selectedValue,
    //         },
    //     });
    // }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (querySearch.trainerName) {
        fetchTrinersList(querySearch.trainerName);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [querySearch.trainerName]);

  useEffect(() => {
    const list =
      trainerData?.users?.map((item) => ({
        label: item.fullname,
        value: item.id,
      })) || [];
    const curriculunlist =
      curriculumData?.reversedCurriculums?.map((item) => ({
        label: item.curriculumName,
        value: item.id,
      })) || [];

    setCurriculumList(curriculunlist);
    setTrainersList(list);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (querySearch.curriculum) {
        fetchCurriculumList(querySearch.curriculum);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [querySearch.curriculum]);

  const handleDeleteBatchByID = (id, type) => {
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
        fetcher.submit({ id, batchesType: type }, { method: "delete" });
      }
    });
  };

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
    // getPaginatedActiveBatches();
  };

  const handleChangePage = (page) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      // update page param
      newParams.set("page", page);

      return newParams;
    });
  };

  // this is for blocking future dates in active batch filter
  const today = new Date().toISOString().split("T")[0];

  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      id: "batchName",
      header: "Batch Number",
      accessor: "batchName",
      sortable: true,
      hideable: true,
    },
    {
      id: "branch",
      header: "Branch",
      accessor: (row) => row.branch || "N/A",
      sortable: true,
      hideable: true,
    },
    {
      id: "curriculum",
      header: "Curriculum",
      accessor: (row) => (
        <span
          className="text-truncate"
          style={{ maxWidth: "120px" }}
          title={row.curriculum}
        >
          {row.curriculum}
        </span>
      ),
      sortable: true,
      hideable: true,
    },
    {
      id: "trainer",
      header: "Trainer",
      accessor: (row) => (
        <span
          className="text-truncate"
          style={{ maxWidth: "120px" }}
          title={row.trainer}
        >
          {row.trainer}
        </span>
      ),
      sortable: true,
      hideable: true,
    },
    {
      id: "trainingMode",
      header: "Training Mode",
      accessor: (row) => (
        <span
          className="text-truncate"
          style={{ maxWidth: "140px !important" }}
          title={row.trainingMode}
        >
          {row.trainingMode}
        </span>
      ),
      sortable: true,
      hideable: true,
    },
    {
      id: "startdates",
      header: "Start Date",
      accessor: (row) => `${row.startDate}`,
      sortable: true,
      hideable: true,
    },
    {
      id: "enddates",
      header: "End Date",
      accessor: (row) => `${row.endDate}`,
      sortable: true,
      hideable: true,
    },
    {
      id: "timings",
      header: "Batch Timings",
      accessor: (row) =>
        row?.startTime &&
        row?.endTime &&
        row.startTime !== "Invalid date" &&
        row.endTime !== "Invalid date"
          ? TimeConverter(row.startTime, row.endTime)
          : "N/A",
      sortable: true,
      hideable: true,
    },
    {
      id: "sessions",
      header: "Sessions",
      accessor: (row) => `${row.completedSessions}/${row.totalSessions}`,
      sortable: true,
      hideable: true,
    },
    {
      id: "students",
      header: "Students",
      accessor: (row) => row.studentsCount,
      sortable: true,
      hideable: true,
    },
    {
      id: "progress",
      header: "Progress",
      accessor: (row) => (
        <span
          style={{
            color: getColor(Number(row.progress)),
          }}
        >
          {row.progress} %
        </span>
      ),
      sortable: true,
      hideable: true,
    },
  ];
  const data =
    reversedBatches?.map((item) => {
      const totalSessions =
        item?.copyCurriculum?.modules?.reduce(
          (total, module) => total + module?.moduleDuration,
          0,
        ) || 0;

      const progress = item?.copyCurriculum?.totalModuleCount
        ? (
            (item.copyCurriculum.completedModuleCount /
              item.copyCurriculum.totalModuleCount) *
            100
          ).toFixed(1)
        : "0.00";

      return {
        id: item.id,
        batchName: item.batchName,
        branch: item?.branch?.branch_name,
        curriculum: item?.copyCurriculum?.curriculumName,
        trainer: item?.users?.[0]?.fullname,
        trainingMode: item?.trainingMode,
        startDate: item?.startDate,
        endDate: item?.endDate,
        startTime: item?.startTime,
        endTime: item?.endTime,
        completedSessions: item?.actualSessionCount,
        totalSessions,
        studentsCount: item?.totalStudentCount || 0,
        progress,
        // rawItem: item, // 👈 keep original row for actions
      };
    }) || [];

  const actions = (row) => {
    const item = row;

    const batchTabConfig = {
      activelist: {
        tab: "Active Batches",
        slug: "ActiveBatch",
        slug1: "active",
        listKey: "ACTIVE_BATCHES_LIST",
        showAssignAndEdit: true,
        showCloseBatch: true,
      },
      upcominglist: {
        tab: "Upcoming Batches",
        slug: "UpcomingBatch",
        slug1: "upcoming",
        listKey: "UPCOMING_BATCHES_LIST",
        showAssignAndEdit: true,
        showCloseBatch: false,
      },
      pendingList: {
        tab: "Pending Batches",
        slug: "PendingBatch",
        slug1: "pending",
        listKey: "PENDING_BATCHES_LIST",
        showAssignAndEdit: true,
        showCloseBatch: true,
      },
      completedlist: {
        tab: "Completed Batches",
        slug: "CompletedBatch",
        slug1: "completed",
        listKey: "COMPLETED_BATCHES_LIST",
        showAssignAndEdit: false,
        showCloseBatch: false,
      },
      selfLearning: {
        tab: "Self Learning Batches",
        slug: "SelfLearning",
        slug1: "self-learning",
        listKey: "SELF_LEARNING_BATCHES_LIST",
        showAssignAndEdit: true,
        showCloseBatch: true,
      },
      placementPreparation: {
        tab: "Placement Preparation Batches",
        slug: "PlacementPrepration",
        slug1: "Placement_Preparation",
        listKey: "Placement_Preparation_BATCHES_LIST",
        showAssignAndEdit: true,
        showCloseBatch: true,
      },
      demoBatches: {
        tab: "Demo Batches",
        slug: "Demo Batches",
        slug1: "Demo_Batches",
        listKey: "Demo_Batches_BATCHES_LIST",
        showAssignAndEdit: true,
        showCloseBatch: true,
      },
    };

    const currentTabConfig = batchTabConfig[list];

    

    let isDisabled = false;
    if (userData?.user?.profile !== "Admin") {
      if (userData?.user?.profile === "Trainer") {
        isDisabled = !item?.copyCurriculum?.modules?.every(
          (module) => module.isCompleted,
        );
      } else {
        isDisabled = true;
      }
    }

    return (
      <div className="d-flex align-items-center gap-3">
        <GateKeeper
          requiredModule="Batch Management"
          submenumodule={currentTabConfig.tab}
          submenuReqiredPermission="canUpdate"
        >
          {currentTabConfig.showAssignAndEdit && (
            <BsPeopleFill
              title="Assign Batch"
              className=" cursor-pointer"
              onClick={() => handleAssignStudents(item.id, item.batchName,item?.trainingMode)}
            />
          )}
        </GateKeeper>

        <GateKeeper
          requiredModule="Batch Management"
          submenumodule={currentTabConfig.tab}
          submenuReqiredPermission="canUpdate"
        >
          {currentTabConfig.showAssignAndEdit && (
            <RiEdit2Line
              title="Edit Batch"
              className="edit_icon table_icons me-1 cursor-pointer"
              onClick={() => handleEditClick(item.id, currentTabConfig.slug)}
            />
          )}
        </GateKeeper>

        <GateKeeper
          requiredModule="Batch Management"
          submenumodule={currentTabConfig.tab}
          submenuReqiredPermission="canDelete"
        >
          <MdDelete
            title="Delete Batch"
            className="delete_icon table_icons me-1 cursor-pointer"
            onClick={() =>
              handleDeleteBatchByID(item.id, currentTabConfig.listKey)
            }
          />
        </GateKeeper>

        <GateKeeper
          requiredModule="Batch Management"
          submenumodule={currentTabConfig.tab}
          submenuReqiredPermission="canUpdate"
        >
          {currentTabConfig.showCloseBatch && (
            <IoLockClosedSharp
              title="Close Batch"
              style={{
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.5 : 1,
              }}
              onClick={
                !isDisabled ? () => handleCloseBatchButton(item) : undefined
              }
            />
          )}
        </GateKeeper>

        <GateKeeper
          requiredModule="Batch Management"
          submenumodule={currentTabConfig.tab}
          submenuReqiredPermission="canRead"
        >
           <Link
            className="me-2"
            to={`/batchmanagement/${list}/launch/${item?.trainingMode == "self-learning" ? "selfLearning" : currentTabConfig.slug1}/${item.id}${item?.trainingMode == "DEMO_BATCH" ? "?batchType=DEMO_BATCH" : "" }`}
          >
            <FaArrowRightLong title="View" />
          </Link>
        </GateKeeper>
      </div>
    );
  };

  return (
    <div>
      <BackButton heading="Batches" content="Back" to="/" />
      <div className="container-fluid mt-5">
        <ul
          className="nav gap-1 mb-5 nav-tabs d-flex justify-content-center"
          id="pills-tab"
          role="tablist"
        >
          {/* active batches */}
          <GateKeeper
            requiredModule="Batch Management"
            submenumodule="Active Batches"
            submenuReqiredPermission="canRead"
          >
            <li className="nav-item w_100  rounded-md"  role="presentation" >
              <Link to="/batchmanagement/batches/activelist">
                <button
                  className={`bg_white nav-link  card card_animate w_100 ${
                    list == "activelist" ? "active" : ""
                  }`}
                  type="button"
                  role="tab"
                  aria-selected={list == "activelist"}
                >
                  <div className="text-start  ">
                    <div className="d-flex justify-content-between align-items-center ">
                      <div>
                        <span className="fs_20 fw-500 me-2">
                          Active Batches
                        </span>
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
                  className={`nav-link  card card_animate w_100 ${
                    list == "upcominglist" ? "active" : ""
                  }`}
                  type="button"
                  role="tab"
                  aria-selected={list == "upcominglist"}
                >
                  <div className="text-start">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fs_20 fw-500 me-2">
                          UpComing Batches
                        </span>
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
                  className={`nav-link card card_animate w_100 ${
                    list == "completedlist" ? "active" : ""
                  }`}
                  type="button"
                  role="tab"
                  aria-selected={list == "completedlist"}
                >
                  <div className="text-start">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fs_20 fw-500 me-2">
                          Completed Batches
                        </span>
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
                  className={`bg_white nav-link  card card_animate w_100 ${
                    list == "pendingList" ? "active" : ""
                  }`}
                  type="button"
                  role="tab"
                  aria-selected={list == "pendingList"}
                >
                  <div className="text-start ">
                    <div className="d-flex justify-content-between align-items-center ">
                      <div>
                        <span className="fs_20 fw-500 me-2">Ending Soon</span>
                      </div>
                     
                    </div>
                  </div>
                </button>
              </Link>
            </li>
          </GateKeeper>
          {/* self-learning batches */}

          <GateKeeper
            requiredModule="Batch Management"
            submenumodule="Pending Batches"
            submenuReqiredPermission="canRead"
          >
            <li className="nav-item w_100" role="presentation">
              <Link to="/batchmanagement/batches/selfLearning">
                <button
                  className={`bg_white nav-link  card card_animate w_100 ${
                    list == "selfLearning" ? "active" : ""
                  }`}
                  type="button"
                  role="tab"
                  aria-selected={list == "selfLearning"}
                >
                  <div className="text-start ">
                    <div className="d-flex justify-content-between align-items-center ">
                      <div>
                        <span className="fs_20 fw-500 me-2">Self Learning</span>
                      </div>
                     
                    </div>
                  </div>
                </button>
              </Link>
            </li>
          </GateKeeper>

          {/* placement preparation
           */}
          <GateKeeper
            requiredModule="Batch Management"
            submenumodule="Pending Batches"
            submenuReqiredPermission="canRead"
          >
            <li className="nav-item w_100" role="presentation">
              <Link to="/batchmanagement/batches/placementPreparation">
                <button
                  className={`bg_white nav-link card card_animate w_100 ${
                    list === "placementPreparation" ? "active" : ""
                  }`}
                  type="button"
                  role="tab"
                  aria-selected={list === "placementPreparation"}
                >
                  <div className="text-start ">
                    <div className="d-flex justify-content-between align-items-center ">
                      <div>
                        <span className="fs_20 fw-500 me-2">
                          Placement Preparation
                        </span>
                      </div>
                     
                    </div>
                  </div>
                </button>
              </Link>
            </li>
          </GateKeeper>
          <GateKeeper
            requiredModule="Batch Management"
            submenumodule="Pending Batches"
            submenuReqiredPermission="canRead"
          >
            <li className="nav-item w_100" role="presentation">
              <Link to="/batchmanagement/batches/demoBatches">
                <button
                  className={`bg_white nav-link card card_animate w_100 ${
                    list === "demoBatches" ? "active" : ""
                  }`}
                  type="button"
                  role="tab"
                  aria-selected={list === "demoBatches"}
                >
                  <div className="text-start ">
                    <div className="d-flex justify-content-between align-items-center ">
                      <div>
                        <span className="fs_20 fw-500 me-2">
                          Demo Batches
                        </span>
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
                        value={searchBatches}
                        required
                        onChange={(e) => handleSearch(e)}
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
                      <button
                        className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#columnOffcanvas"
                        title="Column Filter"
                      >
                        <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
                      </button>

                      {(list == "activelist") === true &&
                        (userData?.user?.profile === "Admin" ||
                          userData?.user?.profile === "Regional Manager" ||
                          userData?.user?.profile === "Branch Manager" ||
                          userData?.user?.profile === "Support" ||
                          userData?.user?.profile === "Counsellor" ||
                         userData?.user?.profile === "Operations" ||
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
                {/* Filter Section */}
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
                        className="form-control input_bg_color date_input_color"
                        id="rdob"
                        type="date"
                        name="fromDate"
                        max={list == "activelist" ? today : undefined}
                        value={filters?.["filter[startDate]"] || ""}
                        onChange={(e) => handleFilters(e, "startDate")}
                        required
                      />
                    </div>

                    {/*  Batch End Date */}
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Batch End Date
                      </label>
                      <input
                        className="form-control input_bg_color date_input_color"
                        id="rdob"
                        type="date"
                        name="toDate"
                        value={filters?.["filter[endDate]"] || ""}
                        onChange={(e) => handleFilters(e, "endDate")}
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
                          value={filters?.["filter[branch]"] || ""}
                          onChange={(e) => handleFilters(e, "branch")}
                          required
                        >
                          <option value="" disabled>
                            Select the Branch
                          </option>
                          {branchData?.branchData?.map((item, index) => (
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
                        options={curriculumList || []}
                        onChange={(e) => handleQueryFilters(e, "curriculum")}
                        value={selectedCurriculum || ""}
                        onInputChange={(inputValue) =>
                          handleQuerySearch(inputValue, "curriculum")
                        }
                        // isClearable
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
                          options={trainersList || []}
                          onChange={(e) => handleQueryFilters(e, "trainer")}
                          value={selectedTrainer || ""}
                          onInputChange={(inputValue) =>
                            handleQuerySearch(inputValue, "trainerName")
                          }
                          // isClearable
                        />
                      </div>
                    )}

                    {/* trainingMode */}
                    {(list === "activelist" || list === "upcominglist" || list === "completedlist" || list === "pendingList")&&
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Training Mode
                      </label>
                      <select
                        className="form-select form-control bg_input input_bg_color black_300 select"
                        id="trainingMode"
                        name="trainingMode"
                        value={
                          filters?.["filter[trainingMode]"] ||
                          querySearch.trainerName ||
                          ""
                        }
                        onChange={(e) => handleFilters(e, "trainingMode")}
                        required
                      >
                        <option value="" disabled>
                          Select the Training Mode
                        </option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="self-learning">Self Learning</option>
                        <option value="placement-preparation">
                          Placement Preparation
                        </option>
                         <option value="DEMO_BATCH">
                          Demo Batch
                        </option>
                      </select>
                    </div>
                    }
                    {/* Buttons */}
                    <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                      <button
                        className="btn btn-sm btn_primary"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={() => FiltersReset()}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                      <button
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        className="btn btn-sm btn_primary"
                        onClick={FiltersSubmit}
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
                    <CustomTable
                      data={data}
                      columns={columns}
                      actions={actions}
                      enableColumnToggle={true}
                    />
                  </div>
                  <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                    <div className="col-sm">
                      <PaginationInfo
                        data={{
                          length: reversedBatches?.length || null,
                          start: startBatch,
                          end: endBatch,
                          total: searchResultBatches,
                        }}
                        // loading={ActiveBatchesList?.loading}
                      />
                    </div>
                    <div className="col-sm-auto mt-3 mt-sm-0 d-flex justify-content-between pagination-res">
                      <div className="mt-2">
                        <select
                          className="form-select form-control me-3 input_bg_color pagination-select "
                          aria-label="Default select example"
                          required
                          onChange={(e) => handlePerPage(e)}
                          value={(newpageSize && newpageSize) || pageSize}
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
                          currentPage={currentPage}
                          totalPages={totalPages}
                          loading={false}
                          onPageChange={handleChangePage}
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
          curriculumData={curriculumData?.reversedCurriculums}
          branchData={branchData}
          regForms={regForms}
        />
      )}

      {showModal1 === true && batchID !== null && (
        <AddBatch
          show={showModal1}
          handleClose={handleCloseModal1}
          handleCloseForSubmit={handleCloseForSubmit}
          batchID={batchID}
          curriculumData={curriculumData?.reversedCurriculums}
          branchData={branchData}
          regForms={regForms}
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

// {/* <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
//     <thead>
//         <tr>
//             <th scope="col" className="fs-13 lh-xs fw-600 ">
//                 S.No
//             </th>
//             <th scope="col" className="fs-13 lh-xs  fw-600  ">
//                 Batch Number
//             </th>
//             <th scope="col" className="fs-13 lh-xs  fw-600  ">
//                 Branch
//             </th>
//             <th
//                 scope="col"
//                 className="fs-13 lh-xs  fw-600  text-truncate"
//                 style={{ maxWidth: "80px" }}
//                 title="Curriculum"
//             >
//                 Curriculum
//             </th>
//             <th
//                 scope="col"
//                 className="fs-13 lh-xs  fw-600  text-truncate"
//                 style={{ maxWidth: "80px" }}
//                 title="Trainer Name"
//             >
//                 Trainer
//             </th>
//             <th
//                 scope="col"
//                 className="fs-13 lh-xs  fw-600  text-truncate"
//                 style={{ maxWidth: "80px" }}
//                 title="Training Mode"
//             >
//                 Training Mode
//             </th>
//             <th
//                 scope="col"
//                 className="fs-13 lh-xs fw-600 text-truncate"
//                 style={{ maxWidth: "50px" }}
//                 title="Start Date - End Date"
//             >
//                 Start Date - End Date
//             </th>
//             <th
//                 className="fs-13 lh-xs  fw-600  text-truncate"
//                 style={{ maxWidth: "50px" }}
//                 title="Batch Timings"
//             >
//                 Batch Timings
//             </th>
//             <th
//                 scope="col"
//                 className="fs-13 lh-xs  fw-600  text-truncate"
//                 style={{ maxWidth: "80px" }}
//                 title="Total sessions/completed Session"
//             >
//                 Sessions
//             </th>

//             <th
//                 scope="col"
//                 className="fs-13 lh-xs  fw-600 text-truncate "
//                 style={{ maxWidth: "80px" }}
//                 title="Total students"
//             >
//                 Students
//             </th>
//             <th
//                 scope="col"
//                 className="fs-13 lh-xs  fw-600 text-truncate "
//                 style={{ maxWidth: "80px" }}
//                 title="Progress"
//             >
//                 Progress
//             </th>
//             {permission?.permissions?.some(
//                 (subItem) => subItem.module === "Batch Management"
//             ) && <th
//                 scope="col"
//                 className="fs-13 lh-xs  fw-600 text-truncate "
//                 style={{ maxWidth: "80px" }}
//                 title="Progress"
//             >Actions</th>}
//         </tr>
//     </thead>

//     <tbody>
//         {reversedBatches?.length > 0 ? (
//             reversedBatches.map((item, index) => {
//                 const totalSessions = item?.copyCurriculum?.modules?.reduce(
//                     (total, module) => total + module?.moduleDuration,
//                     0
//                 );

//                 const rowIndex = (currentPage - 1) * pageSize + index + 1;

//                 const ifModulesCompleted =
//                     item?.copyCurriculum?.modules?.length > 0
//                         ? item.copyCurriculum.modules.every((module) => module.isCompleted)
//                         : false;

//                 let isDisabled = false;
//                 if (userData?.user?.profile !== "Admin") {
//                     if (userData?.user?.profile === "Trainer") {
//                         isDisabled = !ifModulesCompleted;
//                     } else {
//                         isDisabled = true;
//                     }
//                 }

//                 // Batch Tab Config based on `list`
//                 const batchTabConfig = {
//                     activelist: {
//                         tab: "Active Batches",
//                         slug: "ActiveBatch",
//                         slug1: "active",
//                         listKey: "ACTIVE_BATCHES_LIST",
//                         showAssignAndEdit: true,
//                         showCloseBatch: true,
//                     },
//                     upcominglist: {
//                         tab: "Upcoming Batches",
//                         slug: "UpcomingBatch",
//                         slug1: "upcoming",
//                         listKey: "UPCOMING_BATCHES_LIST",
//                         showAssignAndEdit: true,
//                         showCloseBatch: false,
//                     },
//                     pendingList: {
//                         tab: "Pending Batches",
//                         slug: "PendingBatch",
//                         slug1: "pending",
//                         listKey: "PENDING_BATCHES_LIST",
//                         showAssignAndEdit: true,
//                         showCloseBatch: true,
//                     },
//                     completedlist: {
//                         tab: "Completed Batches",
//                         slug: "CompletedBatch",
//                         slug1: "completed",
//                         listKey: "COMPLETED_BATCHES_LIST",
//                         showAssignAndEdit: false,
//                         showCloseBatch: false,
//                     },
//                 };

//                 const currentTabConfig = batchTabConfig[list];

//                 return (
//                     <tr key={item.id}>
//                         <td className='fs-13 black_300 fw-500 lh-xs bg_light' >{rowIndex}</td>
//                         <td className='fs-13 black_300  lh-xs bg_light'>{item?.batchName}</td>
//                         <td className='fs-13 black_300  lh-xs bg_light'>{item?.branch?.branch_name}</td>
//                         <td
//                             className="fs-13 black_300  lh-xs bg_light text-truncate"
//                             style={{ maxWidth: "120px" }}
//                             title={item?.curriculum?.curriculumName}>
//                             {item?.copyCurriculum?.curriculumName}
//                         </td>
//                         <td
//                             className="fs-13 black_300  lh-xs bg_light text-truncate"
//                             style={{ maxWidth: "120px" }}
//                             title={item?.users?.[0]?.fullname}>
//                             {item?.users?.[0]?.fullname}
//                         </td>
//                         <td className='fs-13 black_300  lh-xs bg_light'>{item?.trainingMode}</td>
//                         <td className="fs-13 black_300  lh-xs bg_light ">
//                             {FormattedDate(item?.startDate)} - {FormattedDate(item?.endDate)}
//                         </td>
//                         <td
//                             className="fs-13 black_300  lh-xs bg_light text-truncate"
//                             style={{ maxWidth: "130px" }}
//                         >{TimeConverter(item?.startTime, item?.endTime)}</td>
//                         <td className="fs-13 black_300  lh-xs bg_light"
//                             data-bs-toggle="tooltip"
//                             data-bs-placement="right"
//                             title="Completed Session/Total Sessions">
//                             {item?.actualSessionCount}/{totalSessions}
//                         </td>
//                         <td
//                             className="fs-13 black_300  lh-xs bg_light text-truncate"
//                             style={{ maxWidth: "70px" }}
//                             title={item?.students?.length}
//                         >{item?.students?.length}</td>
//                         <td
//                             className="fs-13 lh-xs bg_light"
//                             style={{
//                                 color: getColor(
//                                     Number(
//                                         (
//                                             (item.copyCurriculum.completedModuleCount /
//                                                 item.copyCurriculum.totalModuleCount) *
//                                             100
//                                         ).toFixed(1)
//                                     )
//                                 ),
//                             }}
//                         >
//                             {item?.copyCurriculum?.totalModuleCount
//                                 ? (
//                                     (item.copyCurriculum.completedModuleCount /
//                                         item.copyCurriculum.totalModuleCount) *
//                                     100
//                                 ).toFixed(1) + " %"
//                                 : "0.00 %"}
//                         </td>

//                         {/* Actions Column */}
//                         <td>
//                             {permission?.permissions?.map((subItem) => {
//                                 if (
//                                     subItem.module === "Batch Management" &&
//                                     subItem.submenus?.some(
//                                         (submenu) =>
//                                             submenu.module === currentTabConfig?.tab &&
//                                             (submenu.canRead || submenu.canUpdate || submenu.canDelete)
//                                     )
//                                 ) {
//                                     return (
//                                         <>
//                                             {/* Assign Students */}
//                                             <GateKeeper
//                                                 requiredModule="Batch Management"
//                                                 submenumodule={currentTabConfig.tab}
//                                                 submenuReqiredPermission="canUpdate"
//                                             >
//                                                 {currentTabConfig?.showAssignAndEdit && (
//                                                     <BsPeopleFill
//                                                         className="fs-13 me-3"
//                                                         title="Assign Batch"
//                                                         style={{ cursor: "pointer" }}
//                                                         onClick={() =>
//                                                             handleAssignStudents(item?.id, item?.batchName)
//                                                         }
//                                                     />
//                                                 )}
//                                             </GateKeeper>

//                                             {/* Edit */}
//                                             <GateKeeper
//                                                 requiredModule="Batch Management"
//                                                 submenumodule={currentTabConfig.tab}
//                                                 submenuReqiredPermission="canUpdate"
//                                             >
//                                                 {currentTabConfig?.showAssignAndEdit && (
//                                                     <RiEdit2Line
//                                                         className="edit_icon table_icons me-3 cursor-pointer"
//                                                         title="Edit Batch"
//                                                         onClick={() =>
//                                                             handleEditClick(item?.id, currentTabConfig.slug)
//                                                         }
//                                                     />
//                                                 )}
//                                             </GateKeeper>

//                                             {/* Delete */}
//                                             <GateKeeper
//                                                 requiredModule="Batch Management"
//                                                 submenumodule={currentTabConfig.tab}
//                                                 submenuReqiredPermission="canDelete"
//                                             >
//                                                 <MdDelete
//                                                     className="delete_icon table_icons me-3 cursor-pointer"
//                                                     title="Delete Batch"
//                                                     onClick={() =>
//                                                         handleDeleteBatchByID(
//                                                             item?.id,
//                                                             currentTabConfig.listKey
//                                                         )
//                                                     }
//                                                 />
//                                             </GateKeeper>

//                                             {/* Close Batch */}
//                                             <GateKeeper
//                                                 requiredModule="Batch Management"
//                                                 submenumodule={currentTabConfig.tab}
//                                                 submenuReqiredPermission="canUpdate"
//                                             >
//                                                 {currentTabConfig?.showCloseBatch && (
//                                                     <IoLockClosedSharp
//                                                         title="Close Batch"
//                                                         className="fs-13 black_300 me-3"
//                                                         style={{
//                                                             cursor: isDisabled ? "not-allowed" : "pointer",
//                                                             opacity: isDisabled ? 0.5 : 1,
//                                                         }}
//                                                         onClick={
//                                                             !isDisabled
//                                                                 ? () => handleCloseBatchButton(item)
//                                                                 : undefined
//                                                         }
//                                                     />
//                                                 )}
//                                             </GateKeeper>

//                                             {/* View/Launch */}
//                                             <GateKeeper
//                                                 requiredModule="Batch Management"
//                                                 submenumodule={currentTabConfig.tab}
//                                                 submenuReqiredPermission="canRead"
//                                             >
//                                                 <Link
//                                                     to={`/batchmanagement/${list}/launch/${currentTabConfig.slug1}/${item?.id}`}
//                                                 >
//                                                     <FaArrowRightLong title="View" />
//                                                 </Link>
//                                             </GateKeeper>
//                                         </>
//                                     );
//                                 }
//                                 return null;
//                             })}
//                         </td>
//                     </tr>
//                 );
//             })
//         ) : (
//             <tr>
//                 <td colSpan={11} className="text-center">
//                     No data
//                 </td>
//             </tr>
//         )}
//     </tbody>
// </table> */}
