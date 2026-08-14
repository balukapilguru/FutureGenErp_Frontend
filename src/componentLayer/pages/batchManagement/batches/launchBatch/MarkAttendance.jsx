import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import QRCodeGenerator from "../../../../../utils/QRCodeGenerator";
import { useSearchParams } from "react-router-dom";

const MarkAttendance = ({ show, handleClose, BatchState }) => {
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presentStudents, setPresentStudents] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  let todayDate = new Date();
  todayDate = todayDate.getFullYear() + "-" + String(todayDate.getMonth() + 1).padStart(2, "0") + "-" + String(todayDate.getDate()).padStart(2, "0");
  const [qrData, setQrData] = useState(`BatchId=${BatchState?.id},date=${todayDate}`);

  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("batchType"), "searchParams")

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (BatchState?.id) {
  //       setLoading((prev) => !prev);
  //       try {
  //         const [students, presentStudentsList] = await Promise.all([
  //           ERPApi.get(`/batch/getstudents?batchId=${BatchState?.id}`),
  //           ERPApi.get(
  //             `/batch/attendance?trainerId=${
  //               BatchState?.users[0]?.id
  //             }&batchId=${
  //               BatchState?.id
  //             }&date=${new Date().toLocaleDateString()} `
  //           ),
  //         ]);
  //         const [Demostudents, DemoPresentStudentsList] = await Promise.all([
  //           ERPApi.get(`/demo-enrollment/registrations?todayOnly=true&batchId=${BatchState?.id}`),
  //           ERPApi.get(
  //             `/demo-enrollment/demo-batch/attendance?batchId=1305&batchId=${
  //               BatchState?.id
  //             }&date=${new Date().toLocaleDateString()} `
  //           ),
  //         ]);

  //         console.log(DemoPresentStudentsList,Demostudents,"DemoData",students, presentStudentsList)
  //         if (students?.status === 200 && presentStudentsList?.status === 200) {
  //           setStudentList(students?.data?.reversedStudents);
  //           setPresentStudents(presentStudentsList?.data?.attendance);
  //         }
  //       } catch (error) {
  //         console.error(error)
  //       } finally {
  //         setLoading((prev) => !prev);
  //       }
  //     }
  //   };
  //   fetchData();
  // }, [BatchState?.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!BatchState?.id) return;

      setLoading(true);
      const batchType = searchParams.get("batchType");
      const date = new Date().toLocaleDateString('en-US');

      
      try {
        let studentsResponse, attendanceResponse;

        if (batchType === "DEMO_BATCH") {
          setQrData(`https//:teksacademy.com/DemoAttendance?BatchId=${BatchState?.id}&date=${todayDate}`)
          // Fetch Demo Data
         const [studentsResponse, attendanceResponse] = await Promise.all([
            ERPApi.get(`/demo-enrollment/registrations?listType=TODAY&batchId=${BatchState.id}`),
            ERPApi.get(`/demo-enrollment/demo-batch/attendance?batchId=${BatchState.id}&date=${date}`)
          ]);

          if (studentsResponse?.status === 200 && attendanceResponse?.status === 200) {
            // Note: Demo API returns 'data' array based on your console log
            setStudentList(studentsResponse.data?.data || []);
            setPresentStudents(attendanceResponse.data?.attendance || []);
          }
        } else {
          // Fetch Regular Data
          [studentsResponse, attendanceResponse] = await Promise.all([
            ERPApi.get(`/batch/getstudents?batchId=${BatchState.id}`),
            ERPApi.get(`/batch/attendance?trainerId=${BatchState?.users[0]?.id}&batchId=${BatchState.id}&date=${date}`)
          ]);

          if (studentsResponse?.status === 200 && attendanceResponse?.status === 200) {
            setStudentList(studentsResponse.data?.reversedStudents || []);
            setPresentStudents(attendanceResponse.data?.attendance || []);
          }
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BatchState?.id, searchParams]);


  const handleSubmitAttendance = async (id) => {
    if (!id) return;

    const batchType = searchParams.get("batchType");
    const isDemo = batchType === "DEMO_BATCH";

    // 1. Determine the correct URL
    const url = isDemo
      ? `/demo-enrollment/attendance/mark`
      : `/batch/attendance`;

    // 2. Format today's date to YYYY-MM-DD (as required by your demo payload)
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // 3. Construct the specific body for Demo vs Regular
    const body = isDemo ? {
      batchId: BatchState?.id,
      studentId: id,
      date: formattedDate, // Matches your payload: "2026-04-17"
      mode: "manual"       // Added as per your demo requirements
    } : {
      batchId: BatchState?.id,
      studentId: id,
      trainerId: BatchState?.users[0]?.id,
    };

    setAttendanceLoading(true);
    try {
      // Note: Based on your error, ensure the backend is ready for the "date" key
      const { status } = await ERPApi.post(url, body);

      // Check for 201 (Created) or 200 (OK)
      if (status === 201 || status === 200) {
        setPresentStudents((prev) => {
          if (prev.includes(id)) {
            return prev.filter((item) => item !== id);
          } else {
            return [...prev, id];
          }
        });
      }
    } catch (error) {
      console.error("Attendance Update Failed:", error.response?.data || error.message);
      // If you still see the Sequelize error, the backend likely expects 
      // the date key to be named "markedAt" instead of "date"
    } finally {
      setAttendanceLoading(false);
    }
  };
  // const handleSubmitAttendance = async (id) => {
  //   if (id) {
  //     const body = {
  //       batchId: BatchState?.id,
  //       studentId: id,
  //       trainerId: BatchState?.users[0]?.id,
  //     };
  //     setAttendanceLoading((prev) => !prev);
  //     try {
  //       const { data, status } = await ERPApi.post(`/batch/attendance`, body);
  //       if (status === 201) {
  //         if (presentStudents?.includes(id)) {
  //           let updatedStudents = [...presentStudents];
  //           updatedStudents = updatedStudents?.filter((item) => item !== id);
  //           setPresentStudents(updatedStudents);
  //         } else {
  //           let updatedStudents = [...presentStudents];
  //           updatedStudents?.push(id);
  //           setPresentStudents(updatedStudents);
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error)
  //     } finally {
  //       setAttendanceLoading((prev) => !prev);
  //     }
  //   }
  // };
  const [showList, setShowList] = useState(false);



  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
     
      dialogClassName="modal-dialog-centered"
      size="lg"
    >
      <Modal.Header closeButton >
        <Modal.Title>
          <h5>Mark Attendance :{new Date().toLocaleDateString()}</h5>
        </Modal.Title>
        <button
          className="btn btn_primary fs-13 ms-5"
          onClick={() => setShowList((prev) => !prev)}
        >
          {showList && <span>Show QR</span>}
          {!showList && <span>Hide QR</span>}
        </button>
      </Modal.Header>
      <Modal.Body>
        {showList && (
          <div className="card-body " style={{height:"400px"}}>
            <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
              <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                <thead>
                  <tr className="">
                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                      S.No
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                      Student Name
                    </th>
                    <th
                      scope="col"
                      className="fs-13 lh-xs fw-600 text-truncate"
                    >
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentList && studentList?.length > 0 ? (
                    loading ? (
                      <tr>
                        <td className="fs-13 black_300  lh-xs bg_light">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      studentList?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                              {index + 1}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {item?.name}
                            </td>

                            <td className="fs-13 black_300 lh-xs bg_light ">
                              <div
                                className="form-check form-switch"
                                style={{
                                  cursor: attendanceLoading
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                              >
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  disabled={attendanceLoading === true}
                                  id={`flexSwitchCheckChecked-${item.id}`}
                                  checked={presentStudents?.includes(item?.id)}
                                  onChange={() =>
                                    handleSubmitAttendance(item?.id)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )
                  ) : (
                    <tr>
                      <td className="fs-13 black_300  lh-xs bg_light">
                        no data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!showList && (
          <div className="card-body">
            <QRCodeGenerator
              data={qrData}
            />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MarkAttendance;
