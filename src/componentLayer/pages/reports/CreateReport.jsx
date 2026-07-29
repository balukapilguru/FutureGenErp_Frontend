import React, { useEffect, useState } from "react";
import { useContext } from "react";
import "../../../assets/css/CreateReport.css";
import Button from "../../components/button/Button";
import { HiMiniPlus } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import BackButton from "../../components/backbutton/BackButton";
import { useStudentsContext } from "../../../dataLayer/hooks/useStudentsContext";
import axios from "axios";
import { toast } from "react-toastify";

function CreateReport() {
  const navigate = useNavigate();
  const [createdBy, setCreatedBy] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return userData?.user?.fullname || "";
  });
  const { id } = useParams();
  // const { students } = useStudentsContext();
  const {
    studentState,
    studentState: { EnrolledStudents, TotalStudents, getAllReports },
    Dispatchstudents,
  } = useStudentsContext();

  const [customDates, setCustomDates] = useState(false);
  const handleDateFilterChange = (event) => {
    const selectedValue = event.target.value;
    // Update customMonth state based on the selected value
    setCustomDates(selectedValue === "customDates");
  };

  const [organizedData, setOrganizedData] = useState(null);

  // const [reportData, setReportData]= useState(null);

  const [reportForm, setReportForm] = useState({
    reportName: "",
    reportType: "One Dimensional",
    description: "",
    dateFilter: "",
    dateRangeType: "",
    dateRange: { fromDate: "", toDate: "" },
    dimensions: { dimension1: "" },
    metrics: "",
    createdBy: createdBy,
    createdAt: new Date(),
    filter: [],
  });

  // Number Of Enrollments
  // Fee Received Amount
  // Fee Yet To Receive
  // Total Booking Amount

  let [filters, setFilters] = useState([]);

  useEffect(() => {
    setReportForm((prevForm) => ({
      ...prevForm,
      filter: filters,
    }));
  }, [filters]);

  // let [subFilterOptions, setSubFilterOptions] = useState()

  const [filteredStudents, setFilteredStudents] = useState();

  useEffect(() => {
    if (TotalStudents && reportForm && reportForm.filter) {
      const filteredResults = TotalStudents?.filter((item) => {
        let allConditionsMet = true;
        reportForm.filter.forEach((filter) => {
          let conditionMet = false;

          if (item.hasOwnProperty(filter.filter)) {
            conditionMet = item[filter.filter] === filter.subFilter;
          } else {
            conditionMet = true;
          }
          allConditionsMet = allConditionsMet && conditionMet;
        });

        const dateCondition =
          reportForm.dateRange.fromDate && reportForm.dateRange.toDate
            ? item.admissiondate >= reportForm.dateRange.fromDate &&
              item.admissiondate <= reportForm.dateRange.toDate
            : true;

        return allConditionsMet && dateCondition;
      });

      setFilteredStudents(filteredResults);
    }
  }, [TotalStudents, reportForm]);

  // TransformData of Report------------
  // function transformData(data,dimensions ) {
  //   const result = [];
  //   for (const key in data) {
  //     const dim1 = dimensions?.dimension1 && key;
  //     const dim2 = [];
  //     const dim3 = [];
  //     const metric=[];

  //     for (const subdimKey in data[key]) {
  //       if(dimensions?.dimension2){
  //         dim2.push(subdimKey);
  //       }

  //       const innerKeys = Object.keys(data[key][subdimKey]);

  //       if(dimensions?.dimension3){
  //         dim3.push(...innerKeys);
  //       }
  //     }

  //     result.push({
  //       dim1: dim1,
  //       dim2: dim2,
  //       dim3: dim3
  //     });
  //   }
  //   return result;
  // }

  function transformData(data, dimensions, metrics) {
    const result = [];
    for (const key in data) {
      const dim1 = dimensions?.dimension1 && key;
      const dim2 = [];
      const dim3 = [];
      const dim4 = [];

      if (
        dimensions?.dimension1 &&
        !dimensions?.dimension2 &&
        !dimensions?.dimension3
      ) {
        if (metrics === "Fee Yet To Receive") {
          if (Array.isArray(data[key])) {
            dim4[0] = data[key].reduce(
              (sum, item) => sum + (item?.dueamount || 0),
              0
            );
          }
        }
        if (metrics === "Fee Received Amount") {
          if (Array.isArray(data[key])) {
            dim4[0] = data[key].reduce(
              (sum, item) => sum + (item?.totalpaidamount || 0),
              0
            );
          }
        }
        if (metrics === "Total Booking Amount") {
          if (Array.isArray(data[key])) {
            dim4[0] = data[key].reduce(
              (sum, item) => sum + (item?.finaltotal || 0),
              0
            );
          }
        }
        if (metrics === "Number Of Enrollments") {
          if (Array.isArray(data[key])) {
            dim4.push(data[key]?.length);
          }
        }
      }

      for (const subdimKey in data[key]) {
        if (dimensions?.dimension2) {
          dim2.push(subdimKey);
        }
        const innerKeys = Object.keys(data[key][subdimKey]);
        if (dimensions?.dimension3) {
          dim3.push(...innerKeys);
        }
        // Check if the value is an array and add it to the metric array

        if (data[key][subdimKey]) {
          if (
            dimensions?.dimension1 &&
            dimensions?.dimension2 &&
            !dimensions?.dimension3
          ) {
            if (metrics === "Fee Yet To Receive") {
              if (Array.isArray(data[key][subdimKey])) {
                const totalDueAmount = data[key][subdimKey].reduce(
                  (sum, item) => sum + item.dueamount,
                  0
                );
                dim4.push(totalDueAmount);
              }
            }
            if (metrics === "Fee Received Amount") {
              if (Array.isArray(data[key][subdimKey])) {
                const totalPaidAmount = data[key][subdimKey].reduce(
                  (sum, item) => sum + item.totalpaidamount,
                  0
                );
                dim4.push(totalPaidAmount);
              }
            }
            if (metrics === "Total Booking Amount") {
              if (Array.isArray(data[key][subdimKey])) {
                const totalFinalTotal = data[key][subdimKey].reduce(
                  (sum, item) => sum + item.finaltotal,
                  0
                );
                dim4.push(totalFinalTotal);
              }
            }
            if (metrics === "Number Of Enrollments") {
              const nestedArray = data?.[key]?.[subdimKey];
              if (Array.isArray(nestedArray)) {
                const itemCount = nestedArray.length;
                dim4.push(itemCount);
              }
            }
          }
        }

        if (data[key][subdimKey]) {
          for (const minsubdimkey in data[key][subdimKey]) {
            if (
              dimensions?.dimension1 &&
              dimensions?.dimension2 &&
              dimensions?.dimension3
            ) {
              if (metrics === "Fee Yet To Receive") {
                if (Array.isArray(data[key][subdimKey][minsubdimkey])) {
                  const totalDueAmount = data[key][subdimKey][
                    minsubdimkey
                  ].reduce((sum, item) => sum + item.dueamount, 0);
                  dim4.push(totalDueAmount);
                }
              }
              if (metrics === "Fee Received Amount") {
                if (Array.isArray(data[key][subdimKey][minsubdimkey])) {
                  const totalPaidAmount = data[key][subdimKey][
                    minsubdimkey
                  ].reduce((sum, item) => sum + item.totalpaidamount, 0);
                  dim4.push(totalPaidAmount);
                }
              }
              if (metrics === "Total Booking Amount") {
                if (Array.isArray(data[key][subdimKey][minsubdimkey])) {
                  const totalFinalTotal = data[key][subdimKey][
                    minsubdimkey
                  ].reduce((sum, item) => sum + item.finaltotal, 0);
                  dim4.push(totalFinalTotal);
                }
              }
              if (metrics === "Number Of Enrollments") {
                const nestedArray = data?.[key]?.[subdimKey]?.[minsubdimkey];
                if (Array.isArray(nestedArray)) {
                  const itemCount = nestedArray.length;
                  dim4.push(itemCount);
                }
              }
            }
          }
        }
      }

      result.push({
        dim1: dim1,
        dim2: dim2,
        dim3: dim3,
        dim4: dim4,
      });
    }
    return { result };
  }

  const { result } = transformData(
    organizedData,
    reportForm.dimensions,
    reportForm.metrics
  );
  const reportData = result;

  // useEffect(()=>{
  //   if(reportdata){
  //     setReportForm(prevForm => ({
  //       ...prevForm,
  //       reportData: reportdata
  //     }));
  //   }
  // },[reportdata])

  useEffect(() => {
    if (filteredStudents) {
      let organizedData;
      if (reportForm) {
        if (Object.keys(reportForm.dimensions).length == 3) {
          organizedData = filteredStudents.reduce((acc, student) => {
            const dim1 = student[reportForm.dimensions.dimension1] || "Unknown";
            const dim2 = student[reportForm.dimensions.dimension2] || "Unknown";
            const dim3 = student[reportForm.dimensions.dimension3] || "Unknown";

            if (!acc[dim1]) {
              acc[dim1] = {};
            }

            if (!acc[dim1][dim2]) {
              acc[dim1][dim2] = {};
            }
            if (!acc[dim1][dim2][dim3]) {
              acc[dim1][dim2][dim3] = [];
            }

            acc[dim1][dim2][dim3].push(student);
            return acc;
          }, {});
        }
        if (Object.keys(reportForm.dimensions).length == 2) {
          organizedData = filteredStudents.reduce((acc, student) => {
            const dim1 = student[reportForm.dimensions.dimension1] || "Unknown";
            const dim2 = student[reportForm.dimensions.dimension2] || "Unknown";

            if (!acc[dim1]) {
              acc[dim1] = {};
            }

            if (!acc[dim1][dim2]) {
              acc[dim1][dim2] = [];
            }

            acc[dim1][dim2].push(student);
            return acc;
          }, {});
        }
        if (Object.keys(reportForm.dimensions).length == 1) {
          organizedData = filteredStudents.reduce((acc, student) => {
            const dim1 = student[reportForm.dimensions.dimension1] || "Unknown";
            if (!acc[dim1]) {
              acc[dim1] = [];
            }
            acc[dim1].push(student);
            return acc;
          }, {});
        }
        setOrganizedData(organizedData);
      }
    }
  }, [filteredStudents, reportForm]);

  const handleFilterChange = (event, index) => {
    const { name, value } = event.target;
    const updatedFilters = [...filters];
    updatedFilters[index] = {
      ...updatedFilters[index],
      [name]: value,
    };
    setFilters(updatedFilters);
    // if (name === "operator") {
    //   let filterName = filters[index].filter
    // }
  };

  const handleFilterDelete = (index) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };
  const handleAddFilter = () => {
    setFilters([...filters, { filter: "", operator: "", subFilter: "" }]);
  };
  useEffect(() => {});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      let [parentProperty, nestedProperty] = name.split(".");
      setReportForm((prevForm) => ({
        ...prevForm,
        [parentProperty]: {
          ...prevForm[parentProperty],
          [nestedProperty]: value,
        },
      }));
    } else {
      if (name === "reportType") {
        setReportForm((prevForm) => ({
          ...prevForm,
          dimensions: {
            dimension1: "",
          },
        }));
      }
      if (name === "dateRangeType") {
        let currentDate = new Date();
        let fromDate = "";
        let toDate = "";

        if (value === "lastmonth") {
          currentDate = new Date();
          currentDate.setMonth(currentDate.getMonth() - 1);
          currentDate.setDate(1);
          fromDate = currentDate.toISOString().split("T")[0];
          currentDate = new Date();
          currentDate.setDate(0);

          toDate = currentDate.toISOString().split("T")[0];
        } else if (value === "currentmonth") {
          currentDate = new Date();

          currentDate.setDate(1);

          fromDate = currentDate.toISOString().split("T")[0];
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(0);

          toDate = currentDate.toISOString().split("T")[0];
        } else {
          fromDate = "";
          toDate = "";
        }

        setReportForm((prevForm) => ({
          ...prevForm,
          dateRange: {
            fromDate,
            toDate,
          },
          [name]: value,
        }));
      } else {
        setReportForm((prevForm) => ({ ...prevForm, [name]: value }));
      }
    }
  };
  // handleSubmit -----------
  const [error, setError] = useState({
    reportName: "",
    reportType: "",
    description: "",
    dateRangeType: "",
    dateRange: {
      fromDate: "",
      toDate: "",
    },
    dimensions: { dimension1: "" },
    metrics: "",
  });
  useEffect(() => {
    const updatedErrors = {};

    if (reportForm.reportName && reportForm.reportName.length >= 3) {
      updatedErrors.reportName = "";
    }

    if (reportForm.description && reportForm.description.length >= 10) {
      updatedErrors.description = "";
    }

    if (reportForm.dateRangeType && reportForm.dateRangeType.trim() !== "") {
      updatedErrors.dateRangeType = "";
    }

    if (
      reportForm.dateRange.fromDate &&
      reportForm.dateRange.fromDate.trim() !== ""
    ) {
      updatedErrors.dateRange = { ...updatedErrors.dateRange, fromDate: "" };
    }

    if (
      reportForm.dateRange.toDate &&
      reportForm.dateRange.toDate.trim() !== ""
    ) {
      updatedErrors.dateRange = { ...updatedErrors.dateRange, toDate: "" };
    }

    if (
      reportForm.dimensions.dimension1 &&
      reportForm.dimensions.dimension1.trim() !== ""
    ) {
      updatedErrors.dimensions = {
        ...updatedErrors.dimensions,
        dimension1: "",
      };
    }

    if (reportForm.metrics && reportForm.metrics.trim() !== "") {
      updatedErrors.metrics = "";
    }

    setError((prev) => ({ ...prev, ...updatedErrors }));
  }, [reportForm]);

  // useEffect(() => {
  //   if (reportForm.reportName && reportForm.reportName.length >= 3) {
  //     setError((prev) => ({
  //       ...prev,
  //       reportName: "",
  //     }));
  //   }
  // }, [reportForm.reportName, setError]);

  // useEffect(() => {
  //   if (reportForm.description && reportForm.description.length >= 10) {
  //     setError((prev) => ({
  //       ...prev,
  //       description: "",
  //     }));
  //   }
  // }, [reportForm.description]);

  // useEffect(() => {
  //   if (reportForm.dateRangeType && reportForm.dateRangeType.trim() !== "") {
  //     setError((prev) => ({
  //       ...prev,
  //       dateRangeType: "",
  //     }));
  //   }
  // }, [reportForm.dateRangeType]);
  // useEffect(() => {
  //   if (reportForm.dateRange.fromDate && reportForm.dateRange.fromDate.trim() !== "") {
  //     setError((prev) => ({
  //       ...prev,
  //       dateRange: {
  //         ...prev.dateRange,
  //         fromDate: "",
  //       },
  //     }));
  //   }
  // }, [reportForm.dateRange.fromDate]);

  // useEffect(() => {
  //   if (reportForm.dateRange.toDate && reportForm.dateRange.toDate.trim() !== "") {
  //     setError((prev) => ({
  //       ...prev,
  //       dateRange: {
  //         ...prev.dateRange,
  //         toDate: "",
  //       },
  //     }));
  //   }
  // }, [reportForm.dateRange.toDate]);

  // useEffect(() => {
  //   if (reportForm.dimensions.dimension1 && reportForm.dimensions.dimension1.trim() !== "") {
  //     setError((prev) => ({
  //       ...prev,
  //       dimensions: {
  //         ...prev.dimensions,
  //         dimension1: "",
  //       },
  //     }));
  //   }
  // }, [reportForm.dimensions.dimension1]);

  // useEffect(() => {
  //   if (reportForm.metrics && reportForm.metrics.trim() !== "") {
  //     setError((prev) => ({
  //       ...prev,
  //       metrics: "",
  //     }));
  //   }
  // }, [reportForm.metrics]);

  // useEffect(() => {
  //   if (filter.filter && filter.filter.trim() !== "") {
  //     setError((prev) => ({
  //       ...prev,
  //       filter: "",
  //     }));
  //   }
  // }, [filter.filter]);

  // useEffect(() => {
  //   if (filter.operator && filter.operator.trim() !== "") {
  //     setError((prev) => ({
  //       ...prev,
  //       operator: "",
  //     }));
  //   }
  // }, [filter.operator]);

  // useEffect(() => {
  //   if (filter.subFilter && filter.subFilter.trim() !== "") {
  //     setError((prev) => ({
  //       ...prev,
  //       subFilter: "",
  //     }));
  //   }
  // }, [filter.subFilter]);

  const handleSubmit = async () => {
    // e.preventDefault(e);
    // reportName-------
    if (!reportForm.reportName || reportForm.reportName.trim().length < 3) {
      setError((prev) => ({
        ...prev,
        reportName: "Report Name required",
      }));
      return false;
    }

    // description--------
    if (!reportForm.description || reportForm.description.trim().length < 10) {
      setError((prev) => ({
        ...prev,
        description: "Enter minimum 10 characters",
      }));
      return false;
    }

    // dateRangeType----------
    if (!reportForm.dateRangeType || reportForm.dateRangeType.trim() === "") {
      setError((prev) => ({
        ...prev,
        dateRangeType: "Select Date Range is required",
      }));
      return false;
    }
    // fromDate-----------
    if (
      !reportForm.dateRange.fromDate ||
      reportForm.dateRange.fromDate.trim() === ""
    ) {
      setError((prev) => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          fromDate: "From Date is required",
        },
      }));
      return false;
    }

    // toDate---------
    if (
      !reportForm.dateRange.toDate ||
      reportForm.dateRange.toDate.trim() === ""
    ) {
      setError((prev) => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          toDate: "To Date is required",
        },
      }));
      return false;
    }
    // dimension1---
    if (
      !reportForm.dimensions.dimension1 ||
      reportForm.dimensions.dimension1.trim() === ""
    ) {
      setError((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          dimension1: "Dimensions is required",
        },
      }));
      return;
    }
    // metrics----
    if (!reportForm.metrics || reportForm.metrics.trim() === "") {
      setError((prev) => ({
        ...prev,
        metrics: "Select a metric",
      }));
      return false;
    }

    let reports = [];
    let reportsdata = reportData;
    reports.push(reportForm);

    let user = {
      // reportName: reportForm.reportName,
      // reportType:reportForm.reportType,
      // description: reportForm.description,
      // dateRangeType: reportForm.dateRangeType,
      // fromDate: reportForm.dateRange.fromDate,
      // toDate: reportForm.dateRange.toDate,
      // dimension1: reportForm.dimension1,
      // metrics: reportForm.metrics,
      // createdby: createdBy?.user?.fullname

      reportName: "Enrollments",
      reportType: "twodimensional",
      description: "Enrollment",
      dateFilter: "",
      dateRangeType: "lastmonth",
      dateRange: {
        fromDate: "2023-12-01",
        toDate: "2023-12-31",
      },
      dimensions: {
        dimension1: "courses",
        dimension2: "branch",
        dimension3: "",
      },
      metrics: "noOfEnrollments",
      createdBy: "Bhaskar",
      createdAt: "2023-12-21T05:15:33.799Z",
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

    let updatedData = {
      reports,
      reportsdata,
    };

    if (!id) {
      try {
        const { data, status } = await toast.promise(
          axios.post(
            // createreport
            `${import.meta.env.VITE_API_URL}/reports/createreport`,
            updatedData
          ),
          {
            loading: "Loading...",
            success: "Report created Successfully",
            error: "Report not Created",
          }
        );
        if (status === 201) {
          Dispatchstudents({ type: "CREATE_REPORT", payload: data });
          navigate("/reports/reportsdata");
          getAllReports();
          // navigate("/reports/reportsdata");
        }
      } catch (error) {}
    }

    if (id) {
      try {
        const { data, status } = await toast.promise(
          axios.put(
            `${import.meta.env.VITE_API_URL}/reports/updatereport/${id}`,
            user
          ),
          {
            loading: "Loading...",
            success: "Report Updated Successfully",
            error: "Report not Updated",
          }
        );

        if (status === 200) {
          Dispatchstudents({ type: "CREATE_REPORT", payload: data });
          navigate("/reports/reportsdata");
          getAllReports();
        }
      } catch (error) {}
    }
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   let reports = []
  //   reports.push(reportForm)
  //   let updatedData = {
  //     reports
  //   }
  //   const updateContext = {
  //     reports
  //   };
  //   axios
  //     .post(
  //       `${import.meta.env.VITE_API_URL}/reports/createreport`,
  //       updatedData
  //     )
  //     .then((res) => {
  //       if (res.data.updated) {
  //         alert("Report Added");

  //         navigate(`/reports`);

  //       } else {
  //         alert("Try Again");
  //       }
  //     });
  // };
  // --------------
  const handleAddDimension = () => {
    const dimensionsLength = reportForm.dimensions
      ? Object.keys(reportForm.dimensions).length
      : 0;
    if (dimensionsLength < 3) {
      const dimensionKey = `dimension${
        Object.keys(reportForm.dimensions).length + 1
      }`;
      setReportForm((prevForm) => ({
        ...prevForm,
        dimensions: {
          ...prevForm.dimensions,
          [dimensionKey]: "",
        },
      }));
    } else {
      alert("More Than 3 Dimensions are not allowed");
    }
  };

  const handleDeleteDimension = (dimension) => {
    const newDimensions = { ...reportForm.dimensions };
    delete newDimensions[dimension];

    const originalObject = newDimensions;
    const transformedObject = {};
    Object.entries(originalObject).forEach(([key, value], index) => {
      let newDimensionName = `dimension${index + 1}`;
      transformedObject[newDimensionName] = value;
    });

    setReportForm((prevForm) => ({
      ...prevForm,
      dimensions: transformedObject,
    }));
  };
  const handleMoveDimension = (dimension, direction) => {
    const dimensionsArray = Object.keys(reportForm.dimensions);
    const index = dimensionsArray.indexOf(dimension);
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < dimensionsArray.length) {
      const newDimensionsArray = [...dimensionsArray];
      // Swap the dimensions
      [newDimensionsArray[index], newDimensionsArray[newIndex]] = [
        newDimensionsArray[newIndex],
        newDimensionsArray[index],
      ];

      const newInputValues = {};
      newDimensionsArray.forEach((dimensionKey) => {
        newInputValues[dimensionKey] = reportForm.dimensions[dimensionKey];
      });
      const originalObject = newInputValues;
      const transformedObject = {};
      Object.entries(originalObject).forEach(([key, value], index) => {
        let newDimensionName = `dimension${index + 1}`;
        transformedObject[newDimensionName] = value;
      });

      setReportForm((prevForm) => ({
        ...prevForm,
        dimensions: transformedObject,
      }));
    }
  };
  return (
    <div>
      <BackButton heading="Create Report" content="Back" />
      <div className="container-fluid">
        <div className="mt-2">
          <form className="createreport">
            <div className="row">
              <div className="col-lg-6">
                <div className="card  ">
                  <div className="card-body">
                    <h5 className="pb-2 black_300">Basic Information</h5>
                    <div className="row px-2">
                      <div className=" col-md-6 col-lg-6 col-xl-6">
                        <label className="form-label fs-s  black_300">
                          Report's Name
                        </label>
                        <input
                          type="text"
                          className={
                            error && error.reportName
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Enter Report Name"
                          name="reportName"
                          value={reportForm.reportName}
                          onChange={handleInputChange}
                        />
                        <div style={{ height: "8px" }}>
                          {error && error.reportName && (
                            <p className="text-danger m-0 fs-xs">
                              {error.reportName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className=" col-md-6 col-lg-6 col-xl-6">
                        <form variant="standard" className="w-100">
                          <label className="form-label fs-s  black_300">
                            Report Type
                          </label>
                          <select
                            className="form-control fs-s bg-form text_color input_bg_color select form-select"
                            name="reportType"
                            value={reportForm.reportType}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="One Dimensional">
                              One Dimensional
                            </option>
                            <option value="Multi Dimensional">
                              Multi Dimensional
                            </option>
                          </select>
                        </form>
                      </div>
                    </div>
                    <div className="row px-2 mt-3 ">
                      <span className="label-family fw-light my-2 fs-14 black_300">
                        Report Description
                      </span>
                      <div className="col-md-12">
                        <textarea
                          type="text"
                          className={
                            error && error.description
                              ? "form-control fs-s bg-form input_bg_color text_color error-input"
                              : "form-control fs-s bg-form input_bg_color text_color"
                          }
                          placeholder="Enter Text...."
                          rows="3"
                          name="description"
                          value={reportForm?.description}
                          onChange={handleInputChange}
                        />
                        <div style={{ height: "8px" }}>
                          {error && error.description && (
                            <p className="text-danger m-0 fs-xs">
                              {error.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row px-2 mt-3">
                      <div className="col-12 col-md-4 col-lg-4 col-xl-4 ">
                        <label className="form-label fs-s black_300">
                          Date Range
                        </label>
                        <form variant="standard">
                          <select
                            className={
                              error && error.dateRangeType
                                ? "form-control input_bg_color form-select error-input"
                                : "form-control input_bg_color form-select"
                            }
                            name="dateRangeType"
                            value={reportForm.dateRangeType}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>
                              Choose
                            </option>
                            <option value="lastmonth">Last Month</option>
                            <option value="currentmonth">Current Month</option>
                            <option value="customDates">Custom Dates</option>
                          </select>
                          <div style={{ height: "8px" }}>
                            {error && error.dateRangeType && (
                              <p className="text-danger m-0 fs-xs">
                                {error.dateRangeType}
                              </p>
                            )}
                          </div>
                        </form>
                      </div>
                      <div className="col-12 col-md-4 col-lg-4 col-xl-4">
                        <label className="form-label fs-s black_300">
                          From
                        </label>
                        <div className="text-start">
                          <input
                            className={
                              error.dateRange.fromDate
                                ? "form-control fs-s bg-form input_bg_color date_input_color error-input"
                                : "form-control fs-s bg-form input_bg_color date_input_color"
                            }
                            type="date"
                            id="exampleInputdate border_none"
                            name="dateRange.fromDate"
                            value={reportForm.dateRange.fromDate}
                            onChange={handleInputChange}
                          />
                          <div style={{ height: "8px" }}>
                            {error.dateRange.fromDate && (
                              <p className="text-danger m-0 fs-xs">
                                {error.dateRange.fromDate}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-lg-4 col-xl-4">
                        <label className="form-label fs-s black_300">To</label>
                        <div className="text-start">
                          <input
                            className={
                              error.dateRange.toDate
                                ? "form-control fs-s bg-form input_bg_color date_input_color error-input"
                                : "form-control fs-s bg-form input_bg_color date_input_color"
                            }
                            type="date"
                            id="exampleInputdate border_none"
                            name="dateRange.toDate"
                            value={reportForm.dateRange.toDate}
                            onChange={handleInputChange}
                          />
                          <div style={{ height: "8px" }}>
                            {error.dateRange.toDate && (
                              <p className="text-danger m-0 fs-xs">
                                {error.dateRange.toDate}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* dimensions start*/}
                <div className="mt-3">
                  <div className="card ">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h5 className="pb-2 black_300">Dimensions</h5>
                        <div>
                          {reportForm.reportType === "Multi Dimensional" &&
                            Object.keys(reportForm.dimensions).length < 3 && (
                              <Button
                                className={"btn_primary"}
                                onClick={handleAddDimension}
                              >
                                {<HiMiniPlus />} Add Dimensions
                              </Button>
                            )}
                        </div>
                      </div>
                      {reportForm.reportType === "One Dimensional" && (
                        <div className="col-8 col-md-8 col-lg-8 col-xl-8  pb-1 mt-2">
                          <form variant="standard" className="w-100">
                            <select
                              name="dimensions.dimension1"
                              className={
                                error.dimensions.dimension1
                                  ? "form-control fs-s bg-form text_color input_bg_color select form-select error-input"
                                  : "form-control fs-s bg-form text_color input_bg_color select form-select"
                              }
                              value={reportForm.dimensions.dimension1}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="" disabled selected>
                                Choose
                              </option>

                              <option value="branch">Branch</option>
                              <option value="enquirytakenby">Counsellor</option>
                              <option value="courses">Course</option>
                              <option value="coursepackage">
                                Course Package
                              </option>
                              <option value="modeoftraining">
                                Mode of Training
                              </option>
                              <option value="state">State</option>
                              <option value="educationtype">
                                Education Type
                              </option>
                              <option value="academicyear">
                                Academic Year
                              </option>
                              <option value="leadsource">Lead Source</option>
                            </select>
                            <div style={{ height: "8px" }}>
                              {error.dimensions.dimension1 && (
                                <p className="text-danger m-0 fs-xs">
                                  {error.dimensions.dimension1}
                                </p>
                              )}
                            </div>
                          </form>
                        </div>
                      )}
                      {reportForm.reportType === "Multi Dimensional" && (
                        <div>
                          {Object.keys(reportForm.dimensions).map(
                            (dimension, index) => (
                              <div className="row">
                                <div className="col-8 col-md-8 col-lg-8 col-xl-8 px-3 pb-1">
                                  <div key={dimension}>
                                    <select
                                      name={`dimensions.${dimension}`}
                                      className={
                                        error.dimensions.dimension1
                                          ? "form-control fs-s bg-form text_color input_bg_color select form-select error-input"
                                          : "form-control fs-s bg-form text_color input_bg_color select form-select"
                                      }
                                      value={reportForm.dimensions[dimension]}
                                      onChange={handleInputChange}
                                      required
                                    >
                                      <option value="" disabled selected>
                                        Choose
                                      </option>
                                      <option value="branch">branch</option>
                                      <option value="enquirytakenby">
                                        counsellor
                                      </option>
                                      <option value="courses">course</option>
                                      <option value="coursepackage">
                                        course package
                                      </option>
                                      <option value="modeoftraining">
                                        Mode of training
                                      </option>
                                      <option value="state">State</option>
                                      <option value="educationtype">
                                        Education Type
                                      </option>
                                      <option value="academicyear">
                                        Academic year
                                      </option>
                                      <option value="leadsource">
                                        Lead source
                                      </option>
                                    </select>
                                    <div style={{ height: "8px" }}>
                                      {error.dimensions.dimension1 && (
                                        <p className="text-danger m-0 fs-xs">
                                          {error.dimensions.dimension1}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4 m-auto">
                                  {Object.keys(reportForm.dimensions).length >
                                    1 && (
                                    <div className="d-flex justify-content-evenly">
                                      <FaArrowUp
                                        className="black_300 table_icons me-3"
                                        onClick={() =>
                                          handleMoveDimension(dimension, "up")
                                        }
                                      />
                                      <FaArrowDown
                                        className="black_300 table_icons me-3"
                                        onClick={() =>
                                          handleMoveDimension(dimension, "down")
                                        }
                                      />
                                      <MdDelete
                                        className="black_300 table_icons me-3"
                                        onClick={() =>
                                          handleDeleteDimension(dimension)
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* dimensions end */}

                  {/* metrics start */}
                  <div className="mt-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="pb-2 black_300">All Metrics</h5>
                        <div className="col-8 col-md-8 col-lg-8 col-xl-8 pb-1 mt-4">
                          <form variant="standard" className="w-100">
                            <select
                              name="metrics"
                              className={
                                error && error.metrics
                                  ? "form-control fs-s bg-form text_color input_bg_color select form-select error-input"
                                  : "form-control fs-s bg-form text_color input_bg_color select form-select"
                              }
                              value={reportForm.metrics}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="" disabled selected>
                                Choose
                              </option>
                              <option value="Number Of Enrollments">
                                Number of Enrollments
                              </option>
                              <option value="Fee Received Amount">
                                Fee Received Amount{" "}
                              </option>
                              <option value="Fee Yet To Receive">
                                Fee Yet To Receive
                              </option>
                              <option value="Total Booking Amount">
                                Total Booking Amount
                              </option>
                            </select>
                            <div style={{ height: "8px" }}>
                              {error.metrics && (
                                <p className="text-danger m-0 fs-xs">
                                  {error.metrics}
                                </p>
                              )}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* metrics end */}

                  {/* filters start */}
                  <div className="mt-3">
                    <div className="card ">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h5 className=" black_300">Filters</h5>
                          <Button
                            className={"btn_primary"}
                            onClick={handleAddFilter}
                          >
                            {<HiMiniPlus />} Add Filters
                          </Button>
                        </div>
                        {filters &&
                          filters.map((filter, index) => {
                            let filterName = filters[index].filter;
                            const groupDataAndCalculatePercentage = (
                              data,
                              key
                            ) => {
                              if (!Array.isArray(data)) {
                                return {};
                              }
                              return data.reduce((result, item) => {
                                const value = item[key];
                                if (!result.includes(value)) {
                                  result.push(value);
                                }
                                return result;
                              }, []);
                            };
                            let subFilterOptions =
                              groupDataAndCalculatePercentage(
                                TotalStudents && TotalStudents,
                                filterName
                              );

                            return (
                              <div className="row" key={index}>
                                <div className="col-12 col-md-6 col-lg-4 col-xl-4 px-3 mb-2">
                                  <label className="form-label fs-s  black_300">
                                    Filter
                                  </label>
                                  <select
                                    className="form-select form-control bg_input input_bg_color black_300 select"
                                    name="filter"
                                    value={filter.filter}
                                    onChange={(event) =>
                                      handleFilterChange(event, index)
                                    }
                                    required
                                  >
                                    <option value="" hidden disabled>
                                      select
                                    </option>
                                    <option value="branch">Branch</option>
                                    <option value="enquirytakenby">
                                      Counsellor
                                    </option>
                                    <option value="coursepackage">
                                      Course Package
                                    </option>
                                    <option value="courses">Courses</option>
                                    <option value="modeoftraining">
                                      Mode of Training
                                    </option>
                                  </select>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3 col-xl-3 ">
                                  {filter.filter && (
                                    <div variant="standard" className="w-100">
                                      <label className="form-label fs-s  black_300">
                                        Comparison
                                      </label>
                                      <select
                                        className="form-select form-control bg_input input_bg_color black_300 select"
                                        name="operator"
                                        value={filter.operator}
                                        onChange={(event) =>
                                          handleFilterChange(event, index)
                                        }
                                      >
                                        <option value="" hidden disabled>
                                          select
                                        </option>
                                        <option value="equalto">
                                          Equal To
                                        </option>
                                      </select>
                                    </div>
                                  )}
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                                  {filter.operator && (
                                    <div variant="standard" className="w-100">
                                      <label className="form-label fs-s  black_300">
                                        {" "}
                                        Sub-Filter
                                      </label>
                                      <select
                                        className="form-select form-control bg_input input_bg_color black_300 select"
                                        name="subFilter"
                                        value={filter.subFilter}
                                        onChange={(event) =>
                                          handleFilterChange(event, index)
                                        }
                                      >
                                        {subFilterOptions &&
                                          subFilterOptions.map(
                                            (subFilter, subIndex) => (
                                              <option
                                                key={subIndex}
                                                value={subFilter}
                                              >
                                                {subFilter}
                                              </option>
                                            )
                                          )}
                                      </select>
                                    </div>
                                  )}
                                </div>
                                <div className="col-12 col-md-6 col-lg-1 col-xl-1 mt-4 pt-1 text-end ">
                                  <MdDelete
                                    className="black_300 table_icons me-3"
                                    onClick={() => handleFilterDelete(index)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  {/* filters end */}
                  <div className="text-end report-footer mb-4">
                    <Button
                      type="submit"
                      className={"btn_primary"}
                      onClick={handleSubmit}
                    >
                      Create Report
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="black_300 mb-3"> Report Preview</h5>
                    {/* dimensions data start */}
                    {organizedData && reportForm.dimensions.dimension1 && (
                      <div className="table-responsive table-card  border-0 mt-2">
                        <div className="table-container table-scroll">
                          <table className="table table-centered align-middle table-nowrap equal-cell-table">
                            <thead>
                              <tr>
                                <th className="fs-13 lh-xs fw-600 text-center">
                                  {reportForm.dimensions.dimension1 === "" && (
                                    <span></span>
                                  )}
                                  {reportForm.dimensions.dimension1 ===
                                    "branch" && <span>Branch</span>}
                                  {reportForm.dimensions.dimension1 ===
                                    "enquirytakenby" && <span>Counselor</span>}
                                  {reportForm.dimensions.dimension1 ===
                                    "courses" && <span>Course</span>}
                                  {reportForm.dimensions.dimension1 ===
                                    "coursepackage" && (
                                    <span>Course Package</span>
                                  )}
                                  {reportForm.dimensions.dimension1 ===
                                    "modeoftraining" && (
                                    <span>Mode Of Training</span>
                                  )}
                                  {reportForm.dimensions.dimension1 ===
                                    "state" && <span>State</span>}
                                  {reportForm.dimensions.dimension1 ===
                                    "educationtype" && (
                                    <span>Education Type</span>
                                  )}
                                  {reportForm.dimensions.dimension1 ===
                                    "academicyear" && (
                                    <span>Academic Year</span>
                                  )}
                                  {reportForm.dimensions.dimension1 ===
                                    "leadsource" && <span>Lead Source</span>}
                                </th>
                                {reportForm.dimensions.dimension2 && (
                                  <th className="fs-13 lh-xs fw-600 text-center">
                                    {reportForm.dimensions.dimension2 ===
                                      "" && <span></span>}
                                    {reportForm.dimensions.dimension2 ===
                                      "branch" && <span>Branch</span>}
                                    {reportForm.dimensions.dimension2 ===
                                      "enquirytakenby" && (
                                      <span>Counselor</span>
                                    )}
                                    {reportForm.dimensions.dimension2 ===
                                      "courses" && <span>Course</span>}
                                    {reportForm.dimensions.dimension2 ===
                                      "coursepackage" && (
                                      <span>Course Package</span>
                                    )}
                                    {reportForm.dimensions.dimension2 ===
                                      "modeoftraining" && (
                                      <span>Mode Of Training</span>
                                    )}
                                    {reportForm.dimensions.dimension2 ===
                                      "state" && <span>State</span>}
                                    {reportForm.dimensions.dimension2 ===
                                      "educationtype" && (
                                      <span>Education Type</span>
                                    )}
                                    {reportForm.dimensions.dimension2 ===
                                      "academicyear" && (
                                      <span>Academic Year</span>
                                    )}
                                    {reportForm.dimensions.dimension2 ===
                                      "leadsource" && <span>Lead Source</span>}
                                  </th>
                                )}
                                {reportForm.dimensions.dimension3 && (
                                  <th className="fs-13 lh-xs fw-600 text-center">
                                    {reportForm.dimensions.dimension3 ===
                                      "" && <span></span>}
                                    {reportForm.dimensions.dimension3 ===
                                      "branch" && <span>Branch</span>}
                                    {reportForm.dimensions.dimension3 ===
                                      "enquirytakenby" && (
                                      <span>Counselor</span>
                                    )}
                                    {reportForm.dimensions.dimension3 ===
                                      "courses" && <span>Course</span>}
                                    {reportForm.dimensions.dimension3 ===
                                      "coursepackage" && (
                                      <span>Course Package</span>
                                    )}
                                    {reportForm.dimensions.dimension3 ===
                                      "modeoftraining" && (
                                      <span>Mode Of Training</span>
                                    )}
                                    {reportForm.dimensions.dimension3 ===
                                      "state" && <span>State</span>}
                                    {reportForm.dimensions.dimension3 ===
                                      "educationtype" && (
                                      <span>Education Type</span>
                                    )}
                                    {reportForm.dimensions.dimension3 ===
                                      "academicyear" && (
                                      <span>Academic Year</span>
                                    )}
                                    {reportForm.dimensions.dimension3 ===
                                      "leadsource" && <span>Lead Source</span>}
                                  </th>
                                )}
                                <th className="fs-13 lh-xs fw-600 ">
                                  {reportForm.metrics}
                                  <br />
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {organizedData &&
                                reportForm.dimensions.dimension1 &&
                                !reportForm.dimensions.dimension2 &&
                                !reportForm.dimensions.dimension3 &&
                                Object.entries(organizedData).map(
                                  ([dim1, students]) => {
                                    let metrics = 0;
                                    if (
                                      reportForm.metrics ===
                                      "Number Of Enrollments"
                                    ) {
                                      metrics = students.length;
                                    }
                                    if (
                                      reportForm.metrics ===
                                      "Fee Received Amount"
                                    ) {
                                      if (Array.isArray(students)) {
                                        students.forEach((student) => {
                                          metrics += student.totalpaidamount;
                                        });
                                      }
                                    }
                                    if (
                                      reportForm.metrics ===
                                      "Fee Yet To Receive"
                                    ) {
                                      if (Array.isArray(students)) {
                                        students.forEach((student) => {
                                          metrics += student.dueamount;
                                        });
                                      }
                                    }
                                    if (
                                      reportForm.metrics ===
                                      "Total Booking Amount"
                                    ) {
                                      if (Array.isArray(students)) {
                                        students.forEach((student) => {
                                          metrics += student.finaltotal;
                                        });
                                      }
                                    }
                                    return (
                                      <tr
                                        key={dim1}
                                        className="border-botttom border border-1"
                                      >
                                        <td className="fs-13 lh-xs fw-400  ">
                                          {dim1}
                                          <br />
                                        </td>
                                        <td className="fs-13 lh-xs  fw-400  ">
                                          {metrics}
                                          <br />
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              {reportForm.dimensions.dimension1 &&
                                reportForm.dimensions.dimension2 &&
                                !reportForm.dimensions.dimension3 && (
                                  <React.Fragment>
                                    {Object.entries(organizedData).map(
                                      ([dim1, dim1Data]) => (
                                        <React.Fragment key={dim1}>
                                          {/* Header row for each Branch */}

                                          {Object.entries(dim1Data).map(
                                            ([dim2, students], index2) => {
                                              let metrics = 0;
                                              if (
                                                reportForm.metrics ===
                                                "Number Of Enrollments"
                                              ) {
                                                metrics = students.length;
                                              } else if (
                                                reportForm.metrics ===
                                                "Fee Received Amount"
                                              ) {
                                                if (Array.isArray(students)) {
                                                  students.forEach(
                                                    (student) => {
                                                      metrics +=
                                                        student.totalpaidamount;
                                                    }
                                                  );
                                                }
                                              } else if (
                                                reportForm.metrics ===
                                                "Fee Yet To Receive"
                                              ) {
                                                if (Array.isArray(students)) {
                                                  students.forEach(
                                                    (student) => {
                                                      metrics +=
                                                        student.dueamount;
                                                    }
                                                  );
                                                }
                                              } else if (
                                                reportForm.metrics ===
                                                "Total Booking Amount"
                                              ) {
                                                if (Array.isArray(students)) {
                                                  students.forEach(
                                                    (student) => {
                                                      metrics +=
                                                        student.finaltotal;
                                                    }
                                                  );
                                                }
                                              }

                                              return (
                                                <tr
                                                  className="border-bottom border-1"
                                                  key={dim1 + dim2}
                                                >
                                                  {index2 === 0 && (
                                                    <td
                                                      rowSpan={
                                                        Object.entries(dim1Data)
                                                          .length
                                                      }
                                                      className="fs-13 text-black-300 bg-light border-end align-top text-center"
                                                    >
                                                      {dim1}
                                                    </td>
                                                  )}
                                                  <td className="fs-13 text-black-300 bg-light border-end align-top text-center">
                                                    {dim2}
                                                  </td>
                                                  <td className="fs-13 text-black-300 bg-light border-end align-top text-center">
                                                    {metrics}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </React.Fragment>
                                      )
                                    )}
                                  </React.Fragment>
                                )}

                              {/* {reportForm.dimensions.dimension1 &&
                                reportForm.dimensions.dimension2 &&
                                reportForm.dimensions.dimension3 &&
                                Object.entries(organizedData).map(([dim1, dim1Data]) => ( 
                                  <React.Fragment key={dim1}>
                                    <tr>
                                      <td rowSpan={Object.keys(dim1Data).reduce((acc, dim2) => acc + Object.keys(dim1Data[dim2]).length, 0)} className="fs-13 black_300 lh-xs bg_light">
                                        {dim1}
                                      </td>
                                      {Object.entries(dim1Data).map(([dim2, dim2Data], index2) =>
                                        Object.entries(dim2Data).map(([dim3, students], index3) => {
                                          let metrics = 0;
                                          if (reportForm.metrics === 'Number Of Enrollments') {
                                            metrics = students.length;
                                          } else if (reportForm.metrics === 'Fee Received Amount') {
                                            if (Array.isArray(students)) {
                                              students.forEach((student) => {
                                                metrics += student.totalpaidamount;
                                              });
                                            }
                                          } else if (reportForm.metrics === 'Fee Yet To Receive') {
                                            if (Array.isArray(students)) {
                                              students.forEach((student) => {
                                                metrics += student.dueamount;
                                              });
                                            }
                                          } else if (reportForm.metrics === 'Total Booking Amount') {
                                            if (Array.isArray(students)) {
                                              students.forEach((student) => {
                                                metrics += student.finaltotal;
                                              });
                                            }
                                          }
                                          return (
                                            <tr className="border-bottom border-1" key={dim1 + dim2 + dim3}>
                                              {index3 === 0 && (
                                                <td rowSpan={Object.keys(dim2Data).length} className="fs-13 black_300 lh-xs bg_light">
                                                  {dim2}
                                                </td>
                                              )}
                                              <td className="fs-13 black_300 lh-xs bg_light">
                                                {dim3}
                                              </td>
                                              <td className="fs-13 black_300 lh-xs bg_light">
                                                {metrics}
                                              </td>
                                            </tr>
                                          );
                                        })
                                      )}
                                    </tr>
                                  </React.Fragment>
                                ))} */}
                              {reportForm.dimensions.dimension1 &&
                                reportForm.dimensions.dimension2 &&
                                reportForm.dimensions.dimension3 &&
                                Object.entries(organizedData).map(
                                  ([dim1, dim1Data]) => (
                                    <React.Fragment key={dim1}>
                                      {Object.entries(dim1Data).map(
                                        ([dim2, dim2Data], index2) =>
                                          Object.entries(dim2Data).map(
                                            ([dim3, students], index3) => {
                                              let metrics = 0;
                                              if (
                                                reportForm.metrics ===
                                                "Number Of Enrollments"
                                              ) {
                                                metrics = students.length;
                                              } else if (
                                                reportForm.metrics ===
                                                "Fee Received Amount"
                                              ) {
                                                if (Array.isArray(students)) {
                                                  students.forEach(
                                                    (student) => {
                                                      metrics +=
                                                        student.totalpaidamount;
                                                    }
                                                  );
                                                }
                                              } else if (
                                                reportForm.metrics ===
                                                "Fee Yet To Receive"
                                              ) {
                                                if (Array.isArray(students)) {
                                                  students.forEach(
                                                    (student) => {
                                                      metrics +=
                                                        student.dueamount;
                                                    }
                                                  );
                                                }
                                              } else if (
                                                reportForm.metrics ===
                                                "Total Booking Amount"
                                              ) {
                                                if (Array.isArray(students)) {
                                                  students.forEach(
                                                    (student) => {
                                                      metrics +=
                                                        student.finaltotal;
                                                    }
                                                  );
                                                }
                                              }

                                              return (
                                                <tr
                                                  className="border-bottom border-1"
                                                  key={dim1 + dim2 + dim3}
                                                >
                                                  {index2 === 0 &&
                                                    index3 === 0 && (
                                                      <td
                                                        rowSpan={Object.keys(
                                                          dim1Data
                                                        ).reduce(
                                                          (acc, dim2) =>
                                                            acc +
                                                            Object.keys(
                                                              dim1Data[dim2]
                                                            ).length,
                                                          0
                                                        )}
                                                        className="fs-13 text-black-300 bg-light border-end align-top pt-2 "
                                                      >
                                                        {dim1}
                                                      </td>
                                                    )}
                                                  {index3 === 0 && (
                                                    <td
                                                      rowSpan={
                                                        Object.keys(dim2Data)
                                                          .length
                                                      }
                                                      className="fs-13 text-black-300 bg-light border-end align-top text-center"
                                                    >
                                                      {dim2}
                                                    </td>
                                                  )}
                                                  <td className="fs-13 text-black-300 bg-light border-end align-top text-center">
                                                    {dim3}
                                                  </td>
                                                  <td className="fs-13 text-black-300 bg-light border-end align-top text-center">
                                                    {metrics}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )
                                      )}
                                    </React.Fragment>
                                  )
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReport;

// const data ={
// ram:{
//   online:{ java:{},python:{}, c:{}},
//   online:{python:{}},
//   offline:{C:{}}
// },
// krishna:{
//   offline:{},
//   offline:{ }
// },

// sita:{
//   online:{ python:{}, aws:{}},
//   online:{ java:{}, sharp:{} }
// }
// }
// {
//   "dim1": "sita",
//   "dim2": [
//     "online",
//     "online"
//   ],
//   "dim3": [
//     "python",
//     "aws",
//     "java",
//     "sharp"
//   ]
// },
// {
//   "dim1": "krishna",
//   "dim2": [
//     "offline",
//     "offline"
//   ],
//   "dim3": []
// },
// {
//   "dim1": "ram",
//   "dim2": [
//     "online",
//     "online",
//     "offline"
//   ],
//   "dim3": [
//     "java",
//     "python",
//     "c",
//     "python",
//     "c"
//   ]
// }

// const data = {
//   ram: {
//     online: { java: [], python: [], c: [] },
//     online: { python: [] },
//     offline: { c: [] }
//   },
//   krishna: {
//     offline: {java:[]},
//     offline: {react:[]},
//   },
//   sita: {
//     online: { python: [], aws: [] },
//     online: { java: [], sharp: [] },
//   }
// };

// const data = {
//   ram: {
//     online: [],
//     online: [],
//     offline:[]
//   },
//   krishna: {
//     offline: [],
//     offline: [],
//   },
//   sita: {
//     online: [],
//     online: [],
//   }
// };

// const data = {
//   ram: [],
//   krishna: [],
//   sita: []
// };

// const data1 = {
//   ram: {
//     online: { java: [1, 2], python: [3, 4], c: [5, 6] },
//     online: { python: [7, 8] },
//     offline: { c: [9, 10] }
//   },
//   krishna: {
//     offline: { java: [11, 12] },
//     offline: { react: [13, 14] },
//   },
//   sita: {
//     online: { python: [15, 16], aws: [17, 18] },
//     online: { java: [19, 20], sharp: [21, 22] },
//   }
// };

// const dimensions1 = {
//   dimension1: "sita",
//   dimension2: "online",
//   dimension3: ""
// };
