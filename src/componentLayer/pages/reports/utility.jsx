import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa";
import { generateCSVData } from "./generateCSVData";

const ReportComponent = ({ id, TotalStudents }) => {
  const [reportForm, setReportForm] = useState();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [organizedData, setOrganizedData] = useState({});

  useEffect(() => {
    if (id) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/reports/getreport/${id}`)
        .then((response) => {
          if (response.data) {
            const filtered = response.data.report.reports[0];
            setReportForm(filtered);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    debugger;
    if (TotalStudents && reportForm && reportForm.filter) {
      const filteredResults = TotalStudents.filter((item) => {
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

  useEffect(() => {
    debugger;
    if (filteredStudents) {
      let organizedData = {};
      if (reportForm) {
        const { dimensions } = reportForm;
        if (Object.keys(dimensions).length === 3) {
          organizedData = filteredStudents.reduce((acc, student) => {
            const dim1 = student[dimensions.dimension1] || "Unknown";
            const dim2 = student[dimensions.dimension2] || "Unknown";
            const dim3 = student[dimensions.dimension3] || "Unknown";
            if (!acc[dim1]) acc[dim1] = {};
            if (!acc[dim1][dim2]) acc[dim1][dim2] = {};
            if (!acc[dim1][dim2][dim3]) acc[dim1][dim2][dim3] = [];
            acc[dim1][dim2][dim3].push(student);
            return acc;
          }, {});
        } else if (Object.keys(dimensions).length === 2) {
          organizedData = filteredStudents.reduce((acc, student) => {
            const dim1 = student[dimensions.dimension1] || "Unknown";
            const dim2 = student[dimensions.dimension2] || "Unknown";
            if (!acc[dim1]) acc[dim1] = {};
            if (!acc[dim1][dim2]) acc[dim1][dim2] = [];
            acc[dim1][dim2].push(student);
            return acc;
          }, {});
        } else if (Object.keys(dimensions).length === 1) {
          organizedData = filteredStudents.reduce((acc, student) => {
            const dim1 = student[dimensions.dimension1] || "Unknown";
            if (!acc[dim1]) acc[dim1] = [];
            acc[dim1].push(student);
            return acc;
          }, {});
        }
        setOrganizedData(organizedData);
      }
    }
  }, [filteredStudents, reportForm]);

  return (
    <div>
      {organizedData && (
        <CSVLink
          data={generateCSVData(organizedData, reportForm)}
          filename={`Reportdata_${id}.csv`}
          target="_blank"
        >
          <FaDownload className="me-1" />
        </CSVLink>
      )}
    </div>
  );
};

export default ReportComponent;
