import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { TiWarning } from "react-icons/ti";
import TimeConverter from "../../../../utils/TimeConverter";
import CurriculumListProvider from "../../settings/curriculum/CurriculumListProvider";
import Select from "react-select";
import Button from "../../../components/button/Button";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MultiSearchSelect } from "../../../../utils/SearchSelect.jsx";

const AddBatch = ({
  show,
  handleClose,
  handleCloseForSubmit,
  branchData,
  curriculumData,
  regForms,
}) => {
  // const { BranchState } = useBranchContext();
  // const { courseState } = useCourseContext();
  // const { CurriculumState } = CurriculumListProvider();

  const [examOptions, setExamOptions] = useState([]);
  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  const [batchStatus, setBatchStatus] = useState({
    batchId: null,
    batchType: null,
  });

  const [registrationOptions, setRegistrationOptions] = useState(regForms);

  const queryParams = new URLSearchParams(window.location.search);
  const batchIDFromURL = queryParams.get("batchID");
  const batchTypeFromURL = queryParams.get("batchType");

  const [selectedRegForms, setSelectedRegForms] = useState([]);

  const handleCourseAdd = (value) => {
    setSelectedRegForms(value);
    // setError((prev) => ({
    //   ...prev,
    //   courses: "",
    // }));
  };

  useEffect(() => {
    if (batchIDFromURL && batchTypeFromURL) {
      setBatchStatus({
        batchId: parseInt(batchIDFromURL),
        batchType: batchTypeFromURL,
      });
    }
  }, [batchIDFromURL, batchTypeFromURL]);

  const isBranchListDisabled =
    ["Trainer", "Branch Manager", "Team Lead"].includes(
      userData?.user?.profile,
    ) ||
    !(
      userData?.user?.profile === "Admin" ||
      userData?.user?.profile === "Support" ||
      userData?.user?.profile === "Regional Manager"||
      userData?.user?.profile === "Operations" 
    ) ||
    batchStatus?.batchType;

  const isTrainerListDisabled =
    userData?.user?.profile === "Trainer" ||
    (userData?.user?.profile !== "Branch Manager" &&
      userData?.user?.profile !== "Support" &&
      userData?.user?.profile !== "Admin" &&
      userData?.user?.profile !== "Team Lead" &&
      userData?.user?.profile !== "Operations" &&
      userData?.user?.profile !== "Regional Manager") ||
    (batchStatus?.batchType &&
      batchStatus?.batchType !== "ActiveBatch" &&
      batchStatus?.batchType !== "UpcomingBatch" &&
      batchStatus?.batchType !== "PendingBatch");

  const isCurriculumDisable =
    batchStatus?.batchType &&
    (batchStatus?.batchType === "ActiveBatch" ||
      batchStatus?.batchType === "UpcomingBatch" ||
      batchStatus?.batchType === "PendingBatch");

  const isTrainigModeDisable =
    batchStatus?.batchType &&
    (batchStatus.batchType === "ActiveBatch" ||
      batchStatus.batchType !== "UpcomingBatch");

  const isBatchStartDateDisable =
    batchStatus?.batchType &&
    (batchStatus?.batchType === "ActiveBatch" ||
      batchStatus?.batchType !== "UpcomingBatch");

  const currentDate = new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);
  const [debouncedSessions, setDebouncedSessions] = useState(null);
  const [TrainerAvaliableDaysList, setTrainerAvaliableDaysList] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [TrainersList, setTrainersList] = useState([]);
  const [TrainerAvailableTimings, setTrainerAvailableTimings] = useState([
    { id: 1, time: "00:00-23:59" },
  ]);
  const [previousTrainerId, setPerviousTrainerId] = useState(null);
  const [sessionsCountByCurriculum, setSessionsCountByCurriculum] =
    useState(10);

  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState({
    batchData: false,
    errorBatchData: null,
    trainersList: false,
    errortrainerList: null,
    trainerAvailableDays: false,
    errorTrainerAvailableDays: null,
    endDate: false,
    errorEndDate: null,
  });

  const [BatchState, setBatchState] = useState({
    batchName: "",
    branchId: null,
    branchName: "",
    exam_collection: [],
    trainerId: null,
    trainerName: "",
    curriculumId: null,
    curriculumName: "",
    trainingMode: "",
    startDate: "",
    batchDuration: 60,
    startTime: "",
    endTime: "",
    daysCollection: [],
    totalSessions: null,
    endDate: "",
    maximumStudents: null,
    registrationFormIds: [],
  });

  // --- Helper to determine if time‑based fields should be shown ---
  // const isTimeBasedMode = ["online", "offline", "hybrid"].includes(BatchState?.trainingMode);
  const isTimeBasedMode = [
    "online",
    "offline",
    "hybrid",
    "placement-preparation",
    "DEMO_BATCH"
  ].includes(BatchState?.trainingMode);

  useEffect(() => {
    const fetchExams = async () => {
      if (!BatchState?.curriculumId) {
        return;
      }
      try {
        const response = await ERPApi.get(
          `/batch/curriculum/${BatchState.curriculumId}`,
        );
        const exams = response.data?.exams || [];
        setExamOptions(exams);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
        toast.error("Failed to fetch exams.");
      }
    };

    fetchExams();
  }, [BatchState?.curriculumId]);
  // useEffect(() => {
  //   const fetchRegistrations = async () => {
  //     if (
  //       BatchState?.branchId &&
  //       BatchState?.curriculumId &&
  //       BatchState?.trainingMode === "placement-preparation"
  //     ) {
  //       try {
  //         const response = await ERPApi.get(`/placement-preparation/forms`);


  //         const forms = response.data?.forms || [];
  //         const options = forms.map((reg) => ({
  //           value: reg.uuid,
  //           label: reg.registrationformname,
  //         }));

  //         setRegistrationOptions(options);
  //       } catch (error) {
  //         console.error("Failed to fetch registrations:", error);
  //         toast.error("Could not load registration options.");
  //         setRegistrationOptions([]);
  //       }
  //     }
  //   };

  //   fetchRegistrations();
  // }, [
  //   BatchState?.branchId,
  //   BatchState?.curriculumId,
  //   BatchState?.trainingMode,
  // ]);

  useEffect(() => {
    if (
      (userData?.user?.profile === "Branch Manager" ||
        userData?.user?.profile === "Counsellor" ||
        userData?.user?.profile === "Team Lead") &&
      batchStatus?.batchId === null
    ) {
      setBatchState((prev) => ({
        ...prev,
        branchName: userData?.user?.branch,
        branchId: userData?.user?.branchId,
      }));
    }
  }, [
    show,
    userData,
    setBatchState,
    //  courseState,
    batchStatus?.batchId,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (batchStatus?.batchId) {
        setLoading((prev) => !prev);
        try {
          const { data, status } = await ERPApi.get(
            `/batch/getbatch/${batchStatus?.batchId}`,
          );
          if (status === 200) {
            const batch = data?.getById;

            const days = batch?.daysCollection?.map((item) => ({
              label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
              value: item,
            }));
            const regForms = batch?.placementRegForm?.map((item) => ({
              label: item.registrationformname,
              value: item.uuid,
            }));
            setSelectedRegForms(regForms);
            setSelectedDays(days);
            FetchtheTainerList(batch?.curriculum?.id, batch?.branch?.id);
            FetchTrainerAvailableDays(
              batch?.users[0]?.id,
              batch?.startDate,
              batch?.startTime,
              batch?.endTime,
              batch?.id,
            );
            FetchEndDate(
              batch?.users[0]?.id,
              batch?.startDate,
              batch?.daysCollection,
              batch?.totalSessions,
              batch?.startTime,
              batch?.endTime,
              batch?.id,
            );
            setPerviousTrainerId(batch?.users[0]?.id);
            setSessionsCountByCurriculum(data?.copyCurriculumSession);
            setDebouncedSessions(batch?.totalSessions);
            setBatchState((prev) => ({
              ...prev,
              batchName: batch?.batchName,
              branchName: batch?.branch?.branch_name,
              branchId: batch?.branch?.id,
              trainerId: batch.users[0]?.id,
              trainerName: batch?.users[0]?.fullname,
              curriculumId: batch?.curriculum?.id,
              curriculumName: batch?.curriculum?.curriculumName,
              exam_collection: (batch?.exams || []).map((exam) => exam.id),
              trainingMode: batch?.trainingMode,
              startDate: batch?.startDate,
              batchDuration: batch?.batchDuration,
              startTime: batch?.startTime,
              endTime: batch?.endTime,
              totalSessions: batch?.totalSessions,
              daysCollection: batch?.daysCollection,
              endDate: batch?.endDate,
              maximumStudents: batch?.maximumStudents,
              // registrationFormIds: batch?.placementRegForm || [],
              registrationFormIds:
                batch?.placementRegForm?.map((item) => item.uuid) || [],
            }));
          }
        } catch (error) {
          const errorMessage = error?.response?.data?.message;
          setFetchError({
            batchData: true,
            errorBatchData: errorMessage
              ? errorMessage
              : "Error retrieving Batch data. Please try again later!",
          });
        } finally {
          setLoading((prev) => !prev);
        }
      }
    };
    fetchData();
    return () => {};
  }, [batchStatus?.batchId, show]);

  const handleChange = (e, field) => {
    if (field === "Branch") {
      const branchId = parseInt(e.target.value);
      setBatchState((prev) => ({
        ...prev,
        branchId: branchId,
        branchName: e.target.options[e.target.selectedIndex].text,
        curriculumName: "",
        curriculumId: null,
        trainerName: "",
        exam_collection: "",
        trainerId: null,
        trainingMode: "",
        startDate: "",
        batchDuration: 60,
        startTime: "",
        endTime: "",
        daysCollection: [],
        totalSessions: null,
        endDate: "",
        maximumStudents: null,
      }));
      setTrainersList([]);
      setSelectedDays([]);
      setErrors((prev) => ({
        ...prev,
        branchId: "",
        branchName: "",
      }));
      setFetchError({
        trainersList: false,
        errortrainerList: null,
      });
    } else if (field === "curriculum") {
      const curriculumId = parseInt(e.target.value);
      setBatchState((prev) => ({
        ...prev,
        curriculumName: e.target.options[e.target.selectedIndex].text,
        curriculumId: curriculumId,
        trainerName: "",
        exam_collection: [],
        trainerId: null,
        trainingMode: "",
        startDate: "",
        batchDuration: 60,
        startTime: "",
        endTime: "",
        daysCollection: [],
        totalSessions: null,
        endDate: "",
      }));
      setSelectedDays([]);
      setErrors((prev) => ({
        ...prev,
        curriculumName: "",
      }));
      setFetchError({
        trainersList: false,
        errortrainerList: null,
      });
      if (curriculumId && BatchState?.branchId) {
        FetchtheTainerList(curriculumId, BatchState?.branchId);
      }
    } else if (field === "exam_collection") {
      // This is coming from React Select, so `e` is the selected options array
      const selectedIds = (e || []).map((opt) => opt.value);

      setBatchState((prev) => ({
        ...prev,
        exam_collection: selectedIds,
      }));
      setErrors((prev) => ({
        ...prev,
        exam_collection: "",
      }));
    } else if (field === "registrationFormIds") {
      const selectedIds = (e || []).map((opt) => opt.value);
      setBatchState((prev) => ({
        ...prev,
        registrationFormIds: selectedIds,
      }));
      setErrors((prev) => ({ ...prev, registrationFormIds: "" }));
    } else if (field === "Trainer") {
      const trainerId = e.target.value;
      if (!batchStatus?.batchType) {
        setBatchState((prev) => ({
          ...prev,
          trainerId: parseInt(trainerId),
          trainerName: e.target.options[e.target.selectedIndex].text,
          trainingMode: "",
          startDate: "",
          batchDuration: 60,
          startTime: "",
          endTime: "",
          daysCollection: [],
          // totalSessions: null,
          endDate: "",
        }));
        setSelectedDays([]);
      } else {
        setBatchState((prev) => ({
          ...prev,
          trainerId: parseInt(trainerId),
          trainerName: e.target.options[e.target.selectedIndex].text,
          batchDuration: 60,
          startTime: "",
          endTime: "",
          daysCollection: [],
          // totalSessions: null,
          endDate: "",
        }));
        setSelectedDays([]);
      }
      setErrors((prev) => ({
        ...prev,
        trainerName: "",
      }));
      setFetchError((prev) => ({
        ...prev,
        trainerAvailableDays: false,
        errorTrainerAvailableDays: null,
      }));
    } else if (field === "TrainingMode") {
      const trainingMode = e.target.value;
      if (!batchStatus?.batchType) {
        setSelectedDays([]);
        setBatchState((prev) => ({
          ...prev,
          trainingMode: trainingMode,
          startDate: "",
          batchDuration: 60,
          startTime: "",
          endTime: "",
          daysCollection: [],
          // totalSessions: null,
          endDate: "",
        }));
      } else {
        setBatchState((prev) => ({
          ...prev,
          trainingMode: trainingMode,
        }));
      }
      setErrors((prev) => ({
        ...prev,
        trainingMode: "",
      }));
      setFetchError((prev) => ({
        ...prev,
        trainerAvailableDays: false,
        errorTrainerAvailableDays: null,
      }));
    } else if (field === "StartDate") {
      const startDate = e.target.value;
      // const today = new Date();
      // const selectedDate = new Date(startDate);
      // if (selectedDate.toDateString() === today.toDateString()) {
      //   let hours = today.getHours();
      //   let minutes = today.getMinutes();
      //   minutes = Math.ceil(minutes / 15) * 15;
      //   if (minutes === 60) {
      //     minutes = 0;
      //     hours = hours + 1;
      //   }
      //   const roundedCurrentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      //   const availableTimings = TrainerAvailableTimings.map((timing) => {
      //     const [start, end] = timing.time.split("-");
      //     const adjustedStart = roundedCurrentTime > start ? roundedCurrentTime : start;
      //     return { ...timing, time: `${adjustedStart}-${end}` };
      //   });
      //   setTrainerAvailableTimings(availableTimings);
      // }
      // else {
      //   setTrainerAvailableTimings([{ id: 1, time: "00:00-23:59" }]);
      // }

      checkCurrentDayTimings(startDate);
      setSelectedDays([]);
      // setBatchState((prev) => ({
      //   ...prev,
      //   startDate: startDate,
      //   batchDuration: 60,
      //   startTime: "",
      //   endTime: "",
      //   daysCollection: [],
      //   // totalSessions: null,
      //   endDate: "",
      // }));

      setBatchState((prev) => {
        let endDate = "";

        if (prev?.trainingMode === "self-learning" && startDate) {
          const date = new Date(startDate);
          date.setFullYear(date.getFullYear() + 1);

          // format back to YYYY-MM-DD
          endDate = date.toISOString().split("T")[0];
        }

        return {
          ...prev,
          startDate: startDate,
          batchDuration: 60,
          startTime: "",
          endTime: "",
          daysCollection: [],
          endDate: endDate,
        };
      });

      setErrors((prev) => ({
        ...prev,
        startDate: "",
      }));
      setFetchError((prev) => ({
        ...prev,
        trainerAvailableDays: false,
        errorTrainerAvailableDays: null,
      }));
    } else if (field === "daysCollection") {
      const selectedDays = e;
      setSelectedDays(selectedDays);
      const updatedSeletedDays = selectedDays.map((item) => item.value);
      setBatchState((prev) => ({
        ...prev,
        daysCollection: updatedSeletedDays,
        // totalSessions:null,
        endDate: "",
      }));
      setErrors((prev) => ({
        ...prev,
        daysCollection: "",
      }));
      setFetchError((prev) => ({
        ...prev,
        endDate: false,
        errorEndDate: null,
      }));
    } else if (field === "totalSessions" && e.target.value <= 365) {
      const totalSessions = e.target.value;
      if(totalSessions>365){
        setErrors((prev) => ({
          ...prev,
          totalSessions: "Max 365 days",
        }));
        return;
      }
      setBatchState((prev) => ({
        ...prev,
        totalSessions: parseInt(totalSessions),
        endDate: "",
      }));
      setErrors((prev) => ({
        ...prev,
        totalSessions: "",
      }));
      setFetchError((prev) => ({
        ...prev,
        endDate: false,
        errorEndDate: null,
      }));
      setDebouncedSessions(totalSessions);
    } else if (field === "maximumStudents") {
      const maximumStudents = e.target.value;
      setBatchState((prev) => ({
        ...prev,
        maximumStudents: maximumStudents ? parseInt(maximumStudents) : null,
      }));
      setErrors((prev) => ({
        ...prev,
        maximumStudents: "",
      }));
    } else if (field === "EndDate") {
      // New handler for manual end date
      setBatchState((prev) => ({ ...prev, endDate: e.target.value }));
      setErrors((prev) => ({ ...prev, endDate: "" }));
    } else {
      setBatchState((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    if (
      debouncedSessions &&
      debouncedSessions > 0 &&
      BatchState?.trainerId &&
      BatchState?.startDate &&
      BatchState?.daysCollection.length > 0 &&
      BatchState?.startTime &&
      BatchState?.endTime
    ) {
      const handler = setTimeout(() => {
        FetchEndDate(
          BatchState.trainerId,
          BatchState.startDate,
          BatchState.daysCollection,
          debouncedSessions,
          BatchState.startTime,
          BatchState.endTime,
        );
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [debouncedSessions, BatchState?.daysCollection]);

  // Fetching TrainersList
  const FetchtheTainerList = async (curriculumId, branchId) => {
    if (curriculumId && branchId) {
      setLoading((prev) => !prev);
      try {
        const { data, status } = await ERPApi.get(
          `/batch/gettrainerdetails?branchId=${branchId}&curriculumId=${curriculumId}`,
        );
        if (status === 200) {
          setTrainersList(data?.trainerDetails);

          if (!batchStatus.batchId || !batchStatus.batchType) {
            setBatchState((prev) => ({
              ...prev,
              totalSessions: data?.curriculumDuration,
            }));
            setSessionsCountByCurriculum(data?.curriculumDuration);
            setDebouncedSessions(data?.curriculumDuration);
          }
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message;
        setTrainersList([]);
        setFetchError({
          trainersList: true,
          errortrainerList: errorMessage
            ? errorMessage
            : "Something went wrong. Please try again to retrieve the Trainers",
        });
      } finally {
        setLoading((prev) => !prev);
      }
    }
  };

  // Fetching  Avaliable Days
  const FetchTrainerAvailableDays = async (
    trainerId,
    startDate,
    startTime,
    endTime,
    batchId,
  ) => {
    if (trainerId && startTime && endTime && startDate) {
      const BatchID = batchId
        ? batchId
        : batchStatus?.batchId
          ? batchStatus?.batchId
          : null;
      setLoading((prev) => !prev);
      try {
        const { data, status } = await ERPApi.get(
          `/batch/validate?startDate=${startDate}&trainerId=${trainerId}&timeSlot=${startTime}-${endTime}&batchId=${BatchID}`,
        );
        if (status === 200) {
          const days = data?.days?.map((item) => ({
            label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
            value: item,
          }));
          setTrainerAvaliableDaysList(days);
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message;
        setTrainerAvaliableDaysList([]);
        setFetchError({
          trainerAvailableDays: true,
          errorTrainerAvailableDays: errorMessage
            ? errorMessage
            : "Something went wrong. Please try again to retrieve the Avaliable Days",
        });
      } finally {
        setLoading((prev) => !prev);
      }
    }
  };

  // Fetching EndDate
  const FetchEndDate = async (
    trainerId,
    startDate,
    Days,
    totalSessions,
    startTime,
    endTime,
    batchId,
  ) => {
    if (trainerId && startDate && Days.length > 0 && totalSessions) {
      const days = Days.map((item) => item).join(",");

      const BatchID = batchId
        ? batchId
        : batchStatus?.batchId
          ? batchStatus?.batchId
          : null;
      setLoading((prev) => !prev);
      try {
        const { data, status } = await ERPApi.get(
          `/batch/validate?startDate=${startDate}&trainerId=${trainerId}&numberOfSessions=${totalSessions}&daysCollection=${days}&timeSlot=${startTime}-${endTime}&batchId=${BatchID}`,
        );
        if (status === 200) {
          setBatchState((prev) => ({
            ...prev,
            endDate: data?.endDate,
          }));
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message;
        setFetchError({
          endDate: true,
          errorEndDate: errorMessage
            ? errorMessage
            : "Something went wrong!. Please try again to retrieve the Avaliable Days",
        });
      } finally {
        setLoading((prev) => !prev);
      }
    }
  };

  const checkCurrentDayTimings = (value) => {
    const startDate = value;
    const today = new Date();
    const selectedDate = new Date(startDate);
    if (selectedDate.toDateString() === today.toDateString()) {
      let hours = today.getHours();
      let minutes = today.getMinutes();
      minutes = Math.ceil(minutes / 15) * 15;
      if (minutes === 60) {
        minutes = 0;
        hours = hours + 1;
      }
      const roundedCurrentTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      const availableTimings = TrainerAvailableTimings.map((timing) => {
        const [start, end] = timing.time.split("-");
        const adjustedStart =
          roundedCurrentTime > start ? roundedCurrentTime : start;
        return { ...timing, time: `${adjustedStart}-${end}` };
      });
      setTrainerAvailableTimings(availableTimings);
    } else {
      setTrainerAvailableTimings([{ id: 1, time: "00:00-23:59" }]);
    }
  };

  const handleTimingChange = (field, value) => {
    if (field === "batchDuration") {
      const batchDuration = value;
      setBatchState((prev) => ({
        ...prev,
        batchDuration: batchDuration,
        startTime: "",
        endTime: "",
        daysCollection: [],
        // totalSessions: null,
        endDate: "",
      }));
      setSelectedDays([]);
      setErrors((prev) => ({
        ...prev,
        batchDuration: "",
      }));
      setFetchError((prev) => ({
        ...prev,
        trainerAvailableDays: false,
        errorTrainerAvailableDays: null,
      }));
    } else if (field === "startTime") {
      const [hours, minutes] = value.split(":").map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      // Add batch duration (in minutes)
      date.setMinutes(date.getMinutes() + parseInt(BatchState?.batchDuration));
      // Format new endTime back to HH:mm format
      const newHours = String(date.getHours()).padStart(2, "0");
      const newMinutes = String(date.getMinutes()).padStart(2, "0");
      let et = `${newHours}:${newMinutes}`;

      const startTime = value;

      setBatchState((prev) => ({
        ...prev,
        startTime: startTime,
        endTime: et,
        daysCollection: [],
        // totalSessions: null,
        endDate: "",
      }));
      setSelectedDays([]);
      if (BatchState?.trainerId && BatchState?.startDate && startTime && et) {
        FetchTrainerAvailableDays(
          BatchState?.trainerId,
          BatchState?.startDate,
          startTime,
          et,
        );
      }
      setErrors((prev) => ({
        ...prev,
        startTime: "",
        endTime: "",
      }));
      setFetchError((prev) => ({
        ...prev,
        trainerAvailableDays: false,
        errorTrainerAvailableDays: null,
      }));
    }
  };

  function convertAvailableTimingsToSlots(availableTimings, splitDifference) {
    const convertedTimings = [];
    availableTimings?.forEach((slot) => {
      const [startTime, endTime] = slot.time.split("-"); // Split the time range
      let currentTime = startTime;
      while (currentTime <= endTime) {
        convertedTimings.push({ id: slot.id, time: currentTime });
        const [hours, mins] = currentTime.split(":").map(Number);
        const date = new Date();
        let beforeDate = date.getDate();
        date.setHours(hours);
        date.setMinutes(mins);
        date.setMinutes(date.getMinutes() + splitDifference); // Add 30 minutes
        let afterDate = date.getDate();
        const newHours = String(date.getHours()).padStart(2, "0");
        const newMinutes = String(date.getMinutes()).padStart(2, "0");
        if (
          beforeDate !== afterDate &&
          `${newHours}:${newMinutes}` === "00:00"
        ) {
          convertedTimings.push({ id: slot.id, time: "24:00" });
        }
        if (beforeDate === afterDate) {
          currentTime = `${newHours}:${newMinutes}`;
        } else if (beforeDate !== afterDate) {
          break;
        }
      }
    });
    return convertedTimings;
  }

  // const availableTimings = [
  //   { id: 1, time: "00:00-08:59" },
  //   { id: 2, time: "10:00-23:59" },
  // ];

  const [convertedTimings, setconvertedTimings] = useState();
  const [slotDuration, setSlotDuration] = useState(60);

  const generateAvailableTimngs = () => {
    const subtractTimeDifference = (availableTimings, difference) => {
      return availableTimings?.map((slot) => {
        const [startTime, endTime] = slot.time.split("-");
        // Convert endTime to minutes and subtract the difference
        const [endHours, endMinutes] = endTime.split(":").map(Number);
        let totalEndMinutes = endHours * 60 + (endMinutes || 0) - difference;

        // Handle cases where totalEndMinutes becomes negative
        if (totalEndMinutes < 0) totalEndMinutes = 0;

        const newEndHours = Math.floor(totalEndMinutes / 60)
          .toString()
          .padStart(2, "0");
        const newEndMinutes = (totalEndMinutes % 60)
          .toString()
          .padStart(2, "0");

        // Return the new slot with the updated end time
        return {
          ...slot,
          time: `${startTime}-${newEndHours}:${newEndMinutes}`,
        };
      });
    };
    const updatedTimings = subtractTimeDifference(
      TrainerAvailableTimings,
      slotDuration,
    );
    const convertedTimings = convertAvailableTimingsToSlots(updatedTimings, 15);
    setconvertedTimings(convertedTimings);
  };

  useEffect(() => {
    generateAvailableTimngs();
  }, [slotDuration, TrainerAvailableTimings]);

  const handleSubmitBatch = async (e) => {
    e.preventDefault();

    // Determine if the current mode requires time‑based fields
    const isTimeBased = ["online", "offline", "hybrid"].includes(
      BatchState?.trainingMode,
    );

    if (!BatchState?.branchName) {
      setErrors((prev) => ({
        ...prev,
        branchName: "Branch Name is required",
      }));
      return;
    } else if (!BatchState?.trainingMode) {
      setErrors((prev) => ({
        ...prev,
        trainingMode: "Training Mode is required",
      }));
      return;
    } else if (!BatchState?.curriculumName) {
      setErrors((prev) => ({
        ...prev,
        curriculumName: "curriculum is required",
      }));
      return;
    } else if (!BatchState?.trainerName) {
      setErrors((prev) => ({
        ...prev,
        trainerName: "Trainer Name is required",
      }));
      return;
    } else if (!BatchState?.startDate) {
      setErrors((prev) => ({
        ...prev,
        startDate: "Batch Start Date is required",
      }));
      return;
    } else if (isTimeBased && !BatchState?.batchDuration) {
      setErrors((prev) => ({
        ...prev,
        batchDuration: "Duration Date is required",
      }));
      return;
    } else if (isTimeBased && !BatchState?.startTime) {
      setErrors((prev) => ({
        ...prev,
        startTime: "Batch Start Time is required",
      }));
      return;
    } else if (isTimeBased && !BatchState?.endTime) {
      setErrors((prev) => ({
        ...prev,
        endTime: "Batch End Time is required",
      }));
      return;
    } else if (isTimeBased && BatchState?.daysCollection?.length === 0) {
      setErrors((prev) => ({
        ...prev,
        daysCollection: "Days are required",
      }));
      return;
    } else if (isTimeBased && !BatchState?.totalSessions) {
      setErrors((prev) => ({
        ...prev,
        totalSessions: "Sessions are required",
      }));
      return;
    } else if (
      isTimeBased &&
      BatchState?.totalSessions < sessionsCountByCurriculum
    ) {
      setErrors((prev) => ({
        ...prev,
        totalSessions: `Sessions must be ${sessionsCountByCurriculum} or More`,
      }));
      return;
    } else if (!BatchState?.endDate) {
      setErrors((prev) => ({
        ...prev,
        endDate: "Batch End Date is required",
      }));
      return;
    } else if (
      isTimeBased &&
      BatchState?.maximumStudents !== null &&
      BatchState?.maximumStudents <= 0
    ) {
      setErrors((prev) => ({
        ...prev,
        maximumStudents: "Maximum Students must be greater than zero",
      }));
      return;
    }
    if (selectedRegForms && selectedRegForms.length > 0) {
      const formIds = selectedRegForms.map((item) => item.value);

      setBatchState((prev) => ({
        ...prev,
        registrationFormIds: formIds,
      }));
    }

    if (!batchStatus.batchId) {
      Swal.fire({
        title: "Are you sure?",
        text: "This will create a new Batch with the Specified details. Proceed?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, create it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading((prev) => !prev);

          console.time("batchcreated");
          setBatchState((prev) => ({
            ...prev,
            registrationFormIds: [...selectedRegForms],
          }));
          try {
            const formIds = selectedRegForms.map((item) => item.value);

            const payload = {
              ...BatchState,
              registrationFormIds: formIds,
            };

            const { data, status } = await toast.promise(
              ERPApi.post(`/batch/createbatch`, payload),
              {
                pending: "Processing Batch Creation...",
              },
            );
            if (status === 201) {
              handleCloseForSubmit();
              Swal.fire({
                title: "Created!",
                text: "Batch Created successfully!",
                icon: "success",
              });
            }
          } catch (error) {
            console.error(error);
            const errorMessage =
              error?.response?.data?.message ||
              "Batch Creation failed. Please try again.";
            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
            });
          } finally {
            setLoading((prev) => !prev);
            console.timeEnd("batchcreated-Ended");
          }
        }
      });
    } else if (batchStatus?.batchId) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to update this batch?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading((prev) => !prev);
          try {
            const formIds = selectedRegForms.map((item) => item.value);

            const payload = {
              ...BatchState,
              registrationFormIds: formIds,
            };

            const { data, status } = await toast.promise(
              ERPApi.patch(
                BatchState?.trainerId === previousTrainerId
                  ? `/batch/updatebatch/${batchStatus?.batchId}`
                  : `/batch/updatetrainer/${batchStatus?.batchId}`,
                payload,
              ),
              {
                pending: "Updating Batch Details...",
              },
            );

            if (status === 200) {
              handleCloseForSubmit();
              Swal.fire({
                title: "Updated!",
                text: "Batch Updated successfully!",
                icon: "success",
              });
            }
          } catch (error) {
            console.error(error);
            const errorMessage =
              error?.response?.data?.message ||
              "Failed to Update batch. Please try again.";
            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
            });
          } finally {
            setLoading((prev) => !prev);
          }
        }
      });
    }
  };

  const errorMessage = fetchError
    ? fetchError.batchData
      ? fetchError.errorBatchData
      : fetchError.trainersList
        ? fetchError.errortrainerList
        : fetchError.trainerAvailableDays
          ? fetchError.errorTrainerAvailableDays
          : fetchError.endDate
            ? fetchError.errorEndDate
            : null
    : null;

  const fruits = [
    "apple",
    "banana",
    "orange",
    "apple",
    "orange",
    "banana",
    "apple",
  ];
  const occurrences = fruits.reduce((accumulator, currentValue) => {
    accumulator[currentValue] = (accumulator[currentValue] || 0) + 1;
    return accumulator;
  }, {});

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header closeButton={!loading}>
        <Modal.Title>
          {batchStatus?.batchType ? "Update Batch - " : "Add Batch"}{" "}
          {BatchState?.batchName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="row">
            <div className="col-lg-6">
              {/* Branch */}
              <div className="mb-3">
                <label className="form-label fs-s fw-medium black_300">
                  Branch <span className="text-danger">*</span>
                </label>
                <select
                  id="branchName"
                  name="branchName"
                  className={`form-control form-select input_bg_color ${
                    errors?.branchName ? "error-input" : ""
                  }`}
                  style={{
                    cursor:
                      isBranchListDisabled || loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onChange={(e) => handleChange(e, "Branch")}
                  value={BatchState?.branchId || ""}
                  disabled={isBranchListDisabled || loading}
                  required
                >
                  {branchData?.branchData?.length > 0 ? (
                    <>
                      <option value="" selected disabled>
                        Select the Branch
                      </option>
                      {branchData?.branchData?.map((item, index) => (
                        <option key={index} value={item?.id}>
                          {item?.branch_name}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="" disabled selected>
                      Branches Not Found
                    </option>
                  )}
                </select>
                <div className="response" style={{ height: "8px" }}>
                  {errors?.branchName && (
                    <p className="text-danger m-0 fs-xs">
                      {errors?.branchName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="col-lg-6">
              <div className="mb-3">
                <label
                  className="form-label fs-s fw-medium black_300"
                  htmlFor="curriculumName"
                >
                  Curriculum <span className="text-danger">*</span>
                </label>
                <select
                  id="curriculumName"
                  name="curriculumName"
                  className={`form-control form-select input_bg_color ${
                    errors?.curriculumName ? "error-input" : ""
                  }`}
                  style={{
                    cursor:
                      !BatchState?.branchId || isCurriculumDisable || loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onChange={(e) => handleChange(e, "curriculum")}
                  value={BatchState?.curriculumId || ""}
                  disabled={
                    !BatchState?.branchId || isCurriculumDisable || loading
                  }
                  required
                >
                  {curriculumData?.length > 0 ? (
                    <>
                      <option value="" disabled selected>
                        Select the Curriculum
                      </option>
                      {curriculumData?.map((item, index) => (
                        <option key={index} value={item?.id}>
                          {item?.curriculumName}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="" disabled selected>
                      Curriculum Not Found
                    </option>
                  )}
                </select>
                <div className="response" style={{ height: "8px" }}>
                  {errors?.curriculumName && (
                    <p className="text-danger m-0 fs-xs">
                      {errors?.curriculumName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Select Exam */}
            <div className="col-lg-6">
              <div className="mb-3">
                <label
                  className="form-label fs-s fw-medium black_300"
                  htmlFor="exam"
                >
                  Exam
                </label>
                <Select
                  id="exam_collection"
                  name="exam_collection"
                  isMulti
                  options={examOptions.map((item) => ({
                    value: item.id,
                    label: `${item.examType} (${item.examName})`,
                  }))}
                  value={(Array.isArray(BatchState?.exam_collection)
                    ? BatchState.exam_collection
                    : []
                  )
                    .map((id) => {
                      const found = examOptions.find((exam) => exam.id === id);
                      return found
                        ? { value: found.id, label: found.examName }
                        : null;
                    })
                    .filter(Boolean)}
                  onChange={(selectedOptions) =>
                    handleChange(selectedOptions, "exam_collection")
                  }
                  // classNamePrefix="react-select"
                  className={` ${
                    errors?.exam_collection ? "error-select" : ""
                  }`}
                />
              </div>
            </div>

            {/* Trainer */}
            <div className="col-lg-6">
              <div className="mb-3">
                <label
                  htmlFor="trainerName"
                  className="form-label fs-s fw-medium black_300"
                >
                  Trainer Name <span className="text-danger">*</span>
                </label>

                <select
                  id="trainerName"
                  name="trainerName"
                  className={`form-control form-select input_bg_color ${
                    errors?.trainerName ? "error-input" : ""
                  }`}
                  style={{
                    cursor:
                      !BatchState?.curriculumId ||
                      isTrainerListDisabled ||
                      loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onChange={(e) => handleChange(e, "Trainer")}
                  value={BatchState?.trainerId || ""}
                  disabled={
                    !BatchState?.curriculumId ||
                    loading ||
                    isTrainerListDisabled
                  }
                  required
                >
                  {fetchError?.trainersList === true ? (
                    <option value="" disabled selected>
                      Unable to Get data
                    </option>
                  ) : TrainersList?.length > 0 ? (
                    <>
                      <option value="" selected disabled>
                        Select the Trainer
                      </option>
                      {TrainersList?.map((item, index) => (
                        <option key={index} value={item?.id}>
                          {item?.fullname}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="" disabled selected>
                      No Trainers are Found
                    </option>
                  )}
                </select>
                <div className="response" style={{ height: "8px" }}>
                  {errors?.trainerName && (
                    <p className="text-danger m-0 fs-xs">
                      {errors?.trainerName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* mode of Training */}
            <div className="col-lg-6">
              <div className="mb-3">
                <label
                  htmlFor="trainingMode"
                  className="form-label fs-s fw-medium black_300"
                >
                  Training Mode <span className="text-danger">*</span>
                </label>
                <select
                  id="trainingMode"
                  name="trainingMode"
                  className={`form-control form-select input_bg_color ${
                    errors?.trainingMode ? "error-input" : ""
                  }`}
                  style={{
                    cursor:
                      !BatchState?.curriculumName ||
                      !BatchState?.trainerName ||
                      !BatchState?.branchName ||
                      isTrainigModeDisable ||
                      loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onChange={(e) => handleChange(e, "TrainingMode")}
                  value={BatchState?.trainingMode || ""}
                  disabled={
                    !BatchState?.curriculumName ||
                    !BatchState?.trainerName ||
                    !BatchState?.branchName ||
                    isTrainigModeDisable ||
                    loading
                  }
                  required
                >
                  <option value="" selected disabled>
                    Select the Training Mode{" "}
                  </option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="self-learning">Self Learning</option>
                  <option value="placement-preparation">
                    Placement Preparation
                  </option>
                   <option value="DEMO_BATCH">
                    DEMO BATCH
                  </option>
                </select>
                <div className="response" style={{ height: "8px" }}>
                  {errors?.trainingMode && (
                    <p className="text-danger m-0 fs-xs">
                      {errors?.trainingMode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Registration ID - shown only for placement‑preparation */}
            {BatchState?.trainingMode === "placement-preparation" && (
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label fs-s fw-medium black_300">
                    Registration Forms <span className="text-danger">*</span>
                  </label>
                  {/* <Select
                    id="registrationFormIds"
                    name="registrationFormIds"
                    isMulti
                    options={registrationOptions}
                    value={registrationOptions.filter((opt) =>
                      BatchState?.registrationFormIds?.includes(opt.value),
                    )}
                    onChange={(selected) =>
                      handleChange(selected, "registrationFormIds")
                    }
                    placeholder="Select registrations..."
                    isDisabled={
                      !BatchState?.branchId || !BatchState?.curriculumId
                    }
                  /> */}
                  <MultiSearchSelect
                    // 1. Maintain your error styling
                    className={`fs-s bg-form text_color input_bg_color `}
                    placeholder="Select Courses"
                    // 2. Value mapping: FIX HERE
                    // Added ?. and || [] to stop the "Cannot read properties of undefined (reading 'map')" error
                    value={selectedRegForms || []}
                    // 3. Initial list
                    defaultOptions={registrationOptions || []}
                    // 4. The API Search Logic
                    fetchOptions={async (search) => {
                      try {
                        const response = await ERPApi.get(
                          `/placement-preparation/forms`,
                          {
                            params: { search: search },
                          },
                        );
                        const forms = response.data?.forms || [];

                        const options = forms.map((reg) => ({
                          value: reg.uuid,
                          label: reg.registrationformname,
                        }));
                        return options || [];
                      } catch (err) {
                        console.error(err);
                        return []; // Always return array on error
                      }
                    }}
                    // 5. Handling Change
                    onChange={(fullObjects) => {
                      // Since your component returns (selected || []),
                      // fullObjects here will be the array of objects
                      handleCourseAdd(fullObjects);
                    }}
                  />
                  <div className="response" style={{ height: "8px" }}>
                    {errors?.registrationFormIds && (
                      <p className="text-danger m-0 fs-xs">
                        {errors.registrationFormIds}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Batch startDate */}
            <div className="col-lg-6">
              <div className="mb-1">
                <label
                  htmlFor="startDate"
                  className="form-label fs-s fw-medium black_300"
                >
                  Batch Start Date <span className="text-danger">*</span>
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className={`form-control input_bg_color ${
                    errors?.startDate ? `error-input` : ``
                  } `}
                  style={{
                    cursor:
                      !BatchState?.trainingMode ||
                      isBatchStartDateDisable ||
                      loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onChange={(e) => handleChange(e, "StartDate")}
                  value={BatchState?.startDate || ""}
                  disabled={
                    !BatchState?.trainingMode ||
                    isBatchStartDateDisable ||
                    loading
                  }
                  min={currentDate}
                  required
                />
                <div className="response" style={{ height: "8px" }}>
                  {errors.startDate && (
                    <p className="text-danger m-0 fs-xs">{errors.startDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Batch End Date - always visible, but editable only for placement‑preparation */}
            <div className="col-lg-4">
              <div className="mb-3">
                <label
                  htmlFor="endDate"
                  className="form-label fs-s fw-medium black_300"
                >
                  Batch End Date <span className="text-danger">*</span>
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className={`form-control input_bg_color ${
                    errors?.endDate ? "error-input" : ""
                  }`}
                  style={{ cursor: loading ? "not-allowed" : "not-allowed" }}
                  value={BatchState?.endDate}
                  onChange={(e) => handleChange(e, "EndDate")}
                  disabled={
                    loading ||
                    isTimeBasedMode ||
                    BatchState?.trainingMode === "self-learning"
                  }
                  required
                />
                <div className="response" style={{ height: "8px" }}>
                  {errors?.endDate && (
                    <p className="text-danger m-0 fs-xs">{errors?.endDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Batch Duration - shown only for time‑based modes */}
            {isTimeBasedMode && (
              <div className="col-lg-6 mb-1">
                <label
                  className="form-label fs-s text_color"
                  htmlFor="batchDuration"
                >
                  Batch Duration<span className="text-danger">*</span>
                </label>
                <select
                  id="batchDuration"
                  name="batchDuration"
                  className={`form-control form-select input_bg_color ${
                    errors.batchDuration ? "error-input" : ""
                  }`}
                  style={{
                    cursor:
                      !BatchState?.startDate || loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onChange={(e) => {
                    handleTimingChange("batchDuration", e.target.value);
                    setSlotDuration(e.target.value);
                  }}
                  value={BatchState?.batchDuration || ""}
                  disabled={!BatchState?.startDate || loading}
                  required
                >
                  <option value="" disabled className="fs-s">
                    Select Batch Duration
                  </option>
                  <option value="30">30 Mins</option>
                  <option value="60">60 Mins</option>
                  <option value="90">90 Mins</option>
                  <option value="120">120 Mins</option>
                  <option value="180">180 Mins</option>
                </select>

                <div className="response" style={{ height: "8px" }}>
                  {errors?.batchDuration && (
                    <p className="text-danger m-0 fs-xs">
                      {errors?.batchDuration}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Start Time - shown only for time‑based modes */}
            {isTimeBasedMode && (
              <div className="col-lg-6 mb-1">
                <label
                  htmlFor="startTime"
                  className="form-label fs-s fw-medium black_300"
                >
                  Batch Start Time <span className="text-danger">*</span>
                </label>
                <select
                  id="startTime"
                  name="startTime"
                  className={`form-control form-select input_bg_color ${
                    errors?.startTime ? "error-input" : ""
                  }`}
                  style={{
                    cursor:
                      !BatchState?.startDate ||
                      !BatchState?.batchDuration ||
                      loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onChange={(e) =>
                    handleTimingChange("startTime", e.target.value)
                  }
                  value={BatchState?.startTime || ""}
                  disabled={
                    !BatchState?.startDate ||
                    !BatchState?.batchDuration ||
                    loading
                  }
                  required
                >
                  {convertedTimings && convertedTimings?.length > 0 ? (
                    <>
                      <option value="" selected disabled>
                        Select the Start Time
                      </option>
                      {convertedTimings?.map((item, i) => (
                        <option key={i} value={item?.time}>
                          {TimeConverter(item?.time)}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="" disabled selected>
                      Start Time Not Available
                    </option>
                  )}
                </select>
                <div className="response" style={{ height: "8px" }}>
                  {errors?.startTime && (
                    <p className="text-danger m-0 fs-xs">{errors?.startTime}</p>
                  )}
                </div>
              </div>
            )}

            {/* EndTime - shown only for time‑based modes */}
            {isTimeBasedMode && (
              <div className="col-lg-6 mb-1">
                <label
                  htmlFor="endTime"
                  className="form-label fs-s fw-medium black_300"
                >
                  Batch End Time <span className="text-danger">*</span>
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="text"
                  className={`form-control input_bg_color ${
                    errors?.endTime ? "error-input" : ""
                  }`}
                  style={{ cursor: "not-allowed" }}
                  placeholder="Select the End Time"
                  value={
                    BatchState?.endTime
                      ? TimeConverter(BatchState?.endTime)
                      : ""
                  }
                  disabled
                />
                <div className="response" style={{ height: "8px" }}>
                  {errors?.endTime && (
                    <p className="text-danger m-0 fs-xs">{errors?.endTime}</p>
                  )}
                </div>
              </div>
            )}

            {/*Days Collection - shown only for time‑based modes */}
            {isTimeBasedMode && (
              <div className="col-lg-4">
                <div className="mb-3">
                  <label
                    htmlFor="daysCollection"
                    className="form-label fs-s fw-medium black_300"
                  >
                    Avaliable Day's <span className="text-danger">*</span>
                  </label>
                  <Select
                    id="daysCollection"
                    name="daysCollection"
                    className={` fs-s bg-form text_color input_bg_color ${
                      errors?.daysCollection
                        ? "error-input border border-red-500"
                        : ""
                    }`}
                    style={{
                      cursor:
                        !BatchState?.endTime ||
                        !BatchState?.startTime ||
                        loading
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        !BatchState?.endTime ||
                        !BatchState?.startTime ||
                        loading
                          ? 0.6
                          : 1,
                    }}
                    isMulti
                    options={TrainerAvaliableDaysList}
                    classNamePrefix="Days"
                    onChange={(e) => handleChange(e, "daysCollection")}
                    value={selectedDays}
                    isDisabled={
                      !BatchState?.endTime ||
                      !BatchState?.startTime ||
                      !BatchState?.startDate ||
                      loading
                    }
                  />
                  <div className="response" style={{ height: "8px" }}>
                    {errors?.daysCollection && (
                      <p className="text-danger m-0 fs-xs">
                        {errors?.daysCollection}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* No of sessions - shown only for time‑based modes */}
            {isTimeBasedMode && (
              <div className="col-lg-4">
                <div className="mb-3">
                  <label
                    htmlFor="totalSessions"
                    className="form-label fs-s fw-medium black_300"
                  >
                    No. of Sessions<span className="text-danger">*</span>{" "}
                    <IoMdInformationCircleOutline
                      title={`Sessions (min-${sessionsCountByCurriculum} , max-365)`}
                    />
                  </label>
                  <input
                    id="totalSessions"
                    name="totalSessions"
                    type="number"
                    className={`form-control input_bg_color ${
                      errors.totalSessions ? `error-input` : ``
                    } `}
                    style={{
                      cursor:
                        BatchState?.daysCollection?.length === 0 || loading
                          ? "not-allowed"
                          : "pointer",
                    }}
                    placeholder={`Sessions (Min-${sessionsCountByCurriculum},Max-365)`}
                    onChange={(e) => handleChange(e, "totalSessions")}
                    value={BatchState?.totalSessions || ""}
                    max={365}
                    disabled={
                      BatchState?.daysCollection?.length === 0 || loading
                    }
                    required
                  />
                  <div className="response" style={{ height: "8px" }}>
                    {errors?.totalSessions && (
                      <p className="text-danger m-0 fs-xs">
                        {errors?.totalSessions}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Maximum Students - shown only for time‑based modes */}
            {isTimeBasedMode && (
              <div className="col-lg-4">
                <div className="mb-3">
                  <label
                    htmlFor="maximumStudents"
                    className="form-label fs-s fw-medium black_300"
                  >
                    Maximum Students
                  </label>
                  <input
                    id="maximumStudents"
                    name="maximumStudents"
                    type="number"
                    className={`form-control input_bg_color ${
                      errors?.maximumStudents ? "error-input" : ""
                    }`}
                    placeholder="Enter maximum students"
                    onChange={(e) => handleChange(e, "maximumStudents")}
                    value={BatchState?.maximumStudents || ""}
                    required
                  />
                  <div className="response" style={{ height: "8px" }}>
                    {errors?.maximumStudents && (
                      <p className="text-danger m-0 fs-xs">
                        {errors?.maximumStudents}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* submit button */}
            <div className="col-lg-12 text-end">
              <div className="text-end">
                <Button
                  className="btn btn_primary"
                  onClick={handleSubmitBatch}
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Loading...{" "}
                      <span
                        className="spinner-border spinner-border-sm ms-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </>
                  ) : batchStatus?.batchId && batchStatus?.batchType ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </div>

            <div className="col-lg-12 text-start">
              <p className="fs-13 fw-500">
                {errorMessage && (
                  <>
                    <hr />
                    <div className="text-danger">
                      <TiWarning className="mb-1 text-danger" /> {errorMessage}
                    </div>
                  </>
                )}
              </p>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBatch;
