import React, { useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { IoBookOutline } from "react-icons/io5";
import { useParams, useSearchParams } from "react-router-dom";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import { IoIosArrowRoundForward } from "react-icons/io";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import for table functionality

const BatchAttendance = () => {
  const { batchId } = useParams();
  const [displayattendanceName, setDisplayAttendanceName] = useState("Topic");
  const [parentTableData, setParentTableData] = useState([]);
  const [childTableData, setChildTableData] = useState([]);
  const [parentHeaders, setParentHeaders] = useState([]);
  const [childHeaders, setChildHeaders] = useState([]);
  const [searchParams,setSearchParams] = useSearchParams();
  console.log(searchParams.get("batchType"),"searchParams")

  

  const GetParentTableData = async () => {
    if (batchId && displayattendanceName === "Topic") {
      try {
        const response = await ERPApi.get(
          `/batch/attendance/topics?batchId=${batchId}`
        );
        const transformedData = response?.data?.result?.map((item, index) => ({
          SNo: index + 1,
          Date: item.date,
          ModuleName: item?.data?.moduleDetails?.moduleName?.trim(),
          Topics: item?.data?.topicDetails?.map((topic) => topic.topicName),
        }));
        setParentHeaders(Object.keys(transformedData[0] || {}));
        setParentTableData(transformedData);
        setChildHeaders([]);
        setChildTableData([]);
      } catch (error) {
        console.error("Error fetching module:", error);
      }
    } else if (batchId && displayattendanceName === "Student") {
      try {
        const response = await ERPApi.get(
          `/batch/getstudents?batchId=${batchId}`
        );
        let studentList = response?.data?.reversedStudents || [];
        studentList = studentList?.map((student, index) => {
          return {
            SNo: index + 1,
            Id: student?.id,
            Name: student?.name,
          };
        });
        setParentHeaders(Object.keys(studentList[0] || {}));
        setParentTableData(studentList);
        setChildHeaders([]);
        setChildTableData([]);
      } catch (error) {
        console.error("Error fetching module:", error);
      }
    }
  };
  const GetChildTableData = async (data) => {
    if (!batchId) {
      console.warn("Batch ID is missing.");
      return;
    }

    try {
      if (displayattendanceName === "Topic") {
        const [attendanceResponse, studentsListResponse] = await Promise.all([
          ERPApi.get(
            `/batch/attendance/students?batchId=${batchId}&markedAt=${data?.Date}`
          ),
          ERPApi.get(`/batch/getstudents?batchId=${batchId}`),
        ]);

        const AttendanceData = attendanceResponse?.data?.attendance || [];
        const studentList = studentsListResponse?.data?.reversedStudents || [];
        const allStudentsWithAttendance = studentList?.map((student, index) => {
          const isPresent = AttendanceData?.some(
            (presentStudent) => presentStudent.id === student.id
          );

          return {
            SNo: index + 1,
            Name: student?.name,
            Mode: "Online",
            Attendance: isPresent ? "Present" : "Absent",
          };
        });

        if (allStudentsWithAttendance.length > 0) {
          setChildHeaders(Object.keys(allStudentsWithAttendance[0]));
          setChildTableData(allStudentsWithAttendance);
        } else {
          console.warn("No attendance data found for the specified date.");
          setChildHeaders([]);
          setChildTableData([]);
        }
      } else if (displayattendanceName === "Student") {
        const [attendance] = await Promise.all([
          ERPApi.get(
            `/batch/attendance/dates?batchId=${batchId}&studentId=${data?.Id}`
          ),
        ]);

        const allDatesStudentAttendance = attendance?.data?.output?.map(
          (item, index) => {
            return {
              SNo: index + 1,
              Date: item?.date,
              Topics: item?.topics?.map((topic) => topic.topicName),
              //  Mode:"Online",
              Attendance: item?.isPresent ? "Present" : "Absent",
            };
          }
        );

        if (allDatesStudentAttendance.length > 0) {
          setChildHeaders(Object.keys(allDatesStudentAttendance[0]));
          setChildTableData(allDatesStudentAttendance);
        } else {
          console.warn("No attendance data found for the specified date.");
          setChildHeaders([]);
          setChildTableData([]);
        }
      }
    } catch (error) {
      console.error("Error fetching attendance or student data:", error);
    }
  };

  useEffect(() => {
    GetParentTableData();
  }, [batchId, displayattendanceName]);
  const [isStudent, setIsStudent] = useState(false);
  const handleToggleChange = (e) => {
    const isChecked = e.target.checked;
    setIsStudent(isChecked);
    handleDisplayAttendance(isChecked ? "Student" : "Topic");
  };

  const handleDisplayAttendance = (name) => {
    setDisplayAttendanceName(name);
  };

  const generatePDF = async (data) => {
    const [attendance] = await Promise.all([
      ERPApi.get(
        `/batch/attendance/dates?batchId=${batchId}&studentId=${data?.Id}`
      ),
    ]);

    const allDatesStudentAttendance = attendance?.data?.output?.map(
      (item, index) => {
        return {
          SNo: index + 1,
          Date: item?.date,
          Topics: item?.topics?.map((topic) => topic.topicName).join(", "),
          Attendance: item?.isPresent ? "Present" : "Absent",
        };
      }
    );
    const batchInfo = attendance?.data?.batchInfo;
    const studentInfo = attendance?.data?.studentInfo;

    const doc = new jsPDF();

    // Title Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${studentInfo?.name} Attendance Report`, 105, 10, {
      align: "center",
    });

    // Personal Details Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const details = [
      `Full Name: ${studentInfo?.name || "N/A"}`,
      `Email: ${studentInfo?.email || "N/A"}`,
      `Phone No: ${studentInfo?.mobilenumber || "N/A"}`,
      `Registration No: ${studentInfo?.registrationnumber || "N/A"}`,
      `Course: ${
        studentInfo?.course.map((course) => course.course_name).join(", ") ||
        "N/A"
      }`,
      `Branch: ${studentInfo?.branches?.branch_name || "N/A"}`,
      `Batch Name: ${batchInfo?.batchName || "N/A"}`,
      `Batch Start Date: ${batchInfo?.startDate || "N/A"}`,
      `Batch End Date: ${batchInfo?.endDate || "N/A"}`,
      `Trainer Name: ${
        batchInfo?.users?.map((user) => user.fullname).join(", ") || "N/A"
      }`,
      `Curriculum: ${batchInfo?.copyCurriculum?.curriculumName || "N/A"}`,
    ];

    details.forEach((detail, index) => {
      doc.text(detail, 14, 20 + index * 5);
    });

    // Add Student Image (Right Side)
    if (studentInfo?.studentImg) {
      // Validate the URL or Base64 string
      const imageUrl = `https://teksacademy.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/${studentInfo.studentImg}`;

      // Load the image and then add it to the PDF
      const image = new Image();
      image.src = imageUrl;

      // Wait for the image to load before adding it to the PDF
      image.onload = () => {
        const imageWidth = 40; // Adjust width
        const imageHeight = 40; // Adjust height
        const imageX = 150; // X-axis position
        const imageY = 20; // Y-axis position

        // Add the image to the PDF when it's loaded
        doc.addImage(imageUrl, "JPEG", imageX, imageY, imageWidth, imageHeight);

        // Now generate the table section and save the PDF after the image is added
        doc.autoTable({
          head: [["S:No", "Date", "Topics", "Attendance"]],
          body: allDatesStudentAttendance?.map((student) => [
            student.SNo,
            student.Date,
            student.Topics,
            student.Attendance,
          ]),
          startY: 80,
          styles: {
            fontSize: 10,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [64, 81, 137], // Correct RGB for #405189
            textColor: 255, // White text
          },
        });

        // Save the PDF after all the content is added
        doc.save(`${data.Name}_Attendance_Report.pdf`);
      };

      // Handle image loading errors
      image.onerror = () => {
        console.error("Failed to load the student image.");
      };
    } else {
      // If there is no image, generate the table and save the PDF
      doc.autoTable({
        head: [["S:No", "Date", "Topics", "Attendance"]],
        body: allDatesStudentAttendance?.map((student) => [
          student.SNo,
          student.Date,
          student.Topics,
          student.Attendance,
        ]),
        startY: 80,
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [64, 81, 137], // Correct RGB for #405189
          textColor: 255, // White text
        },
      });

      // Save the PDF without image
      doc.save(`${data.Name}_Attendance_Report.pdf`);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-sm-4">
              <div className="search-box">
                {/* <input
                  type="text"
                  className="form-control search input_bg_color text_color"
                  placeholder="Search for..."
                  name="search"
                  required
                /> */}
              </div>
            </div>
            <div className="col-lg-4"></div>
            <div className="col-lg-4 d-flex justify-content-end align-items-center">
              <input
                type="checkbox"
                id="toggle"
                className="toggleCheckbox"
                checked={isStudent}
                onChange={handleToggleChange}
              />
              <label htmlFor="toggle" className="toggleContainer d-flex">
                <div
                  className={`fw-500 fs-14 ${!isStudent ? "active" : ""}`}
                  style={{ color: !isStudent ? "#000" : "#aaa" }}
                >
                  <IoBookOutline className="fs-16" /> Topic
                </div>
                <div
                  className={`fw-500 fs-14 ${isStudent ? "active" : ""}`}
                  style={{ color: isStudent ? "#000" : "#aaa" }}
                >
                  <PiStudentBold className="fs-16" /> Student
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <div className="card-body">
                <div className="table-responsive table-card  table-scroll border-0">
                  <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                    <thead>
                      <tr>
                        {parentHeaders?.map((header, index) => (
                          <th key={index} className="fs-13 lh-xs fw-600">
                            {header}
                          </th>
                        ))}
                        <th className="fs-13 lh-xs fw-600 ">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parentTableData?.length === 0 ? (
                        <tr>
                          <td
                            colSpan={parentHeaders.length}
                            className="text-center"
                          >
                            No data available
                          </td>
                        </tr>
                      ) : (
                        parentTableData?.map((topic, index) => (
                          <tr key={index}>
                            {parentHeaders?.map((header, idx) => (
                              <td
                                key={idx}
                                className="fs-13 black_300 lh-xs bg_light module-name"
                              >
                                {Array.isArray(topic[header]) ? (
                                  <ul
                                    className="list-unstyled mb-0 text-truncate"
                                    style={{ width: "150px" }}
                                    title={topic[header]
                                      ?.map((item) => item)
                                      .join(" , ")}
                                  >
                                    
                                    {
                                      topic[header]?.map((item)=>(item))
                                    }

                                    
                                  </ul>
                                ) : (
                                  <li
                                    className={`${
                                      header === "ModuleName"
                                        ? "text-truncate"
                                        : ""
                                    }`}
                                    style={{
                                      width: `${
                                        header === "ModuleName" ? "120px" : null
                                      }`,
                                    }}
                                    title={topic[header]}
                                  >
                                    {topic[header]}
                                  </li>
                                )}
                              </td>
                            ))}
                            <td>
                              <IoIosArrowRoundForward
                                onClick={() => GetChildTableData(topic)}
                                className="cursor-pointer"
                              />
                              {displayattendanceName === "Student" && (
                                <button
                                  className="btn btn_primary fs-7 ms-2"
                                  onClick={() => generatePDF(topic)}
                                >
                                  PDF
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                <thead>
                  <tr>
                    {childHeaders?.map((header, index) => (
                      <th key={index} className="fs-13 lh-xs fw-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {childTableData?.length === 0 ? (
                    <tr>
                      <td colSpan={childHeaders.length} className="text-center">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    childTableData?.map((topic, index) => (
                      <tr key={index}>
                        {childHeaders?.map((header, idx) => (
                          <td
                            key={idx}
                            className="fs-13 black_300 lh-xs bg_light"
                          >
                            {Array.isArray(topic[header]) ? (
                              <ul
                                className="list-unstyled mb-0 text-truncate"
                                style={{ width: "150px" }}
                                title={topic[header]?.map((item) => item)}
                              >
                                
                                {
                                      topic[header]?.map((item)=>(item))
                                    }
                              </ul>
                            ) : (
                              topic[header]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchAttendance;
