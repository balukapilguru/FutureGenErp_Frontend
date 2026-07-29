import React, { useEffect, useState } from "react";
import BackButton from "../../../components/backbutton/BackButton";
import Button from "../../../components/button/Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
const options = { hour: "2-digit", minute: "2-digit" };

const RefundView = () => {
  const { id } = useParams();
  let role = JSON.parse(localStorage.getItem("data")).user.profile;
  const [refundData, setRefundData] = useState([]);
  const [status, setStatus] = useState();
  const [newStatus, setNewStatus] = useState({
    remarks: "",
    status: "",
    refund: "",
  });
  const [regionalManager, setRegionalManger] = useState({
    remarks: "",
    status: "",
    refund: "",
  });
  const [accounts, setAccounts] = useState({
    status: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      const response = await ERPApi.get(
        `${import.meta.env.VITE_API_URL}/studentrefunds/singlerefundview/${id}`
      );
      if (response && response.data) {
        setStatus(response.data[0].refund[0].status);
        setRefundData(response.data[0].refund[0]);
      }
      setRefundData({
        ...response.data[0].refund[0],
        time: new Date(response.data[0].refund[0].time).toLocaleTimeString(
          [],
          options
        ),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (roleToUpdate) => {
    if (isSaving) return;

    setIsSaving(true);
    const user = JSON.parse(localStorage.getItem("data")).user;
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let updatedData;
    if (roleToUpdate === "Support") {
      updatedData = {
        ...newStatus,
        user: user.fullname,
        role: user.profile,
        date: currentDate,
        time: currentTime,
      };
    } else if (roleToUpdate === "Regional Manager") {
      updatedData = {
        ...regionalManager,
        user: user.fullname,
        role: user.profile,

        date: currentDate,
        time: currentTime,
      };
    } else if (roleToUpdate === "Accounts") {
      updatedData = {
        ...accounts,
        user: user.fullname,
        role: user.profile,
        date: currentDate,
        time: currentTime,
      };
    }

    // let updatedStatus = [...status];
    // updatedStatus.push(updatedData);
    let updatedStatus = [...status, updatedData];
    let updatedRefund = {
      refund: [{ ...refundData, status: updatedStatus }],
      registrationnumber: id,
    };

    ERPApi.put(
      `${import.meta.env.VITE_API_URL}/studentrefunds/refundpermissions/${id}`,
      updatedRefund
    )
      .then((response) => {
        fetchData();

        if (roleToUpdate === "Support") {
          setNewStatus({ remarks: "", status: "", refund: "" });
        } else if (roleToUpdate === "Regional Manager") {
          setRegionalManger({ remarks: "", status: "", refund: "" });
        } else if (roleToUpdate === "Accounts") {
          setAccounts({ status: "" });
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };
  const getLatestStatus = (role) => {
    return status?.filter((item) => item.role === role).slice(-1)[0] || {};
  };

  const latestSupportStatus = getLatestStatus("Support") || { status: "NA" };
  const latestRegionalManagerStatus = getLatestStatus("Regional Manager") || {
    status: "NA",
  };
  const latestAccountsStatus = getLatestStatus("Accounts") || { status: "NA" };

  return (
    <div>
      <BackButton heading="Refund View" content="Back" to="/" />
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="table-responsive table-scroll">
                  <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                    <tbody className="fs-13 ">
                      <tr className="lh-400">
                        <td className="ps-0 black_300 fw-500 fs-13">
                          Registration number
                        </td>
                        <td className="text-mute fs-14 ps-2 fw-500">
                          <b className=" fw-500 fs-13 pe-2"> :</b>
                          {refundData.registrationnumber}
                        </td>
                      </tr>
                      <tr className="lh-500">
                        <td className="ps-0 black_300 fw-500 fs-13">
                          Student Name
                        </td>
                        <td className="text-mute fs-14 ps-2 fw-500">
                          <b className=" fw-500 fs-13 pe-2"> :</b>
                          {refundData.name}
                        </td>
                      </tr>
                      <tr className="lh-500 overflow_refundview">
                        <td className="ps-0 black_300 fw-500 fs-13">
                          Enrolled Course
                        </td>
                        <td className="text-mute fs-14 ps-2 fw-500 ">
                          <b className="fw-500 fs-13 pe-2"> :</b>
                          {refundData.courses}
                        </td>
                      </tr>
                      <tr className="lh-500">
                        <td className="ps-0 black_300 fw-500 fs-13">
                          Batch Timing
                        </td>
                        <td className="text-mute fs-14 ps-2 fw-500 ">
                          <b className=" fw-500 fs-13 pe-2"> :</b>
                          {refundData.batchtimings}
                        </td>
                      </tr>
                      <tr className="lh-500">
                        <td className="ps-0 black_300 fw-500 fs-13">
                          Admission Date
                        </td>
                        <td className="text-mute fs-14 ps-2 fw-500 ">
                          <b className=" fw-500 fs-13 pe-2"> :</b>
                          {refundData.admissiondate}
                        </td>
                      </tr>

                      <tr className="lh-500 overflow_refundview">
                        <td className="ps-0 black_300 fw-500 fs-13">
                          Email Id
                        </td>
                        <td className="text-mute fs-14 ps-2 fw-500">
                          <b className=" fw-500 fs-13 pe-2"> :</b>
                          {refundData.email}
                        </td>
                      </tr>

                      <tr className="lh-500">
                        <td className="ps-0 black_300 fw-500 fs-13">Support</td>

                        <td className="text-mute fs-14 ps-2 fw-500">
                          <b className="fw-500 fs-13 pe-2"> :</b>
                          {role === "Support" || role === "Admin"
                            ? latestSupportStatus.status
                            : "NA"}
                        </td>
                      </tr>
                      <tr className="lh-500">
                        <td className="ps-0 black_300 fw-500 fs-13">
                          Accounts
                        </td>
                        <td className="text-mute fs-14 ps-2 fw-500">
                          <b className="fw-500 fs-13 pe-2"> :</b>
                          {role === "Accounts" || role === "Admin"
                            ? latestAccountsStatus.status
                            : "NA"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                  <tbody className="fs-13 ">
                    <tr className="lh-500">
                      <td className="ps-0 black_300  fw-500 fs-13">
                        Phone Number
                      </td>
                      <td className="text-mute fs-14 ps-2 fw-500">
                        <b className=" fw-500 fs-13 pe-2"> :</b>
                        {refundData.mobilenumber}
                      </td>
                    </tr>
                    <tr className="lh-500">
                      <td className="ps-0 black_300 fw-500 fs-13">Branch</td>
                      <td className="text-mute fs-14 ps-2 fw-500 ">
                        <b className=" fw-500 fs-13 pe-2"> :</b>
                        {refundData.branch}
                      </td>
                    </tr>
                    <tr className="lh-500">
                      <td className="ps-0 black_300 fw-500 fs-13">
                        Counsellor Name
                      </td>
                      <td className="text-mute fs-14 ps-2 fw-500 ">
                        <b className=" fw-500 fs-13 pe-2"> :</b>
                        {refundData.enquirytakenby}
                      </td>
                    </tr>
                    <tr className="lh-500">
                      <td className="ps-0 black_300 fw-500 fs-13">
                        Total Course Fee
                      </td>
                      <td className="text-mute fs-14 ps-2 fw-500 ">
                        <b className=" fw-500 fs-13 pe-2"> :</b>
                        {refundData.finaltotal}
                      </td>
                    </tr>
                    <tr className="lh-500">
                      <td className="ps-0 black_300 fw-500 fs-13">Fee Paid</td>
                      <td className="text-mute fs-14 ps-2 fw-500 ">
                        <b className=" fw-500 fs-13 pe-2"> :</b>
                        {refundData.totalpaidamount}
                      </td>
                    </tr>
                    <tr className="lh-500">
                      <td className="ps-0 black_300 fw-500 fs-13">
                        Due Amount
                      </td>
                      <td className="text-mute fs-14 ps-2 fw-500 ">
                        <b className=" fw-500 fs-13 pe-2"> :</b>
                        {refundData.dueamount}
                      </td>
                    </tr>
                    <tr className="lh-500">
                      <td className="ps-0 black_300 fw-500 fs-13">
                        Regional Manager
                      </td>
                      <td className="text-mute fs-14 ps-2 fw-500">
                        <b className="fw-500 fs-13 pe-2"> :</b>
                        {role === "Regional Manager" || role === "Admin"
                          ? latestRegionalManagerStatus.status
                          : "NA"}
                      </td>
                    </tr>

                    <tr className="lh-500">
                      <td className="ps-0 black_300 fw-500 fs-13">
                        Reason For Refund
                      </td>
                      <td className="text-mute fs-14 ps-2 fw-500 overflow_refundview">
                        <b className=" fw-500 fs-13 pe-2"> :</b>
                        {refundData.comment}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {/* {role === "Admin" && <h6>Admin</h6>}
            {role === "Support" && <h6>Support</h6>} */}
            {/* {role === "Regional Manager" && <h6>Regional Manager</h6>}
              {role === "Accounts" && <h6>Accounts</h6>} */}

            {/*------------------ support Status -----------------------------------*/}
            {(role === "Admin" ||
              role === "Support" ||
              role === "Regional Manager" ||
              role === "Accounts") && (
              // {(role === "Admin" || role === "Support") && (
              <div className="row">
                <div className="col-lg-4 col-md-12">
                  <label className="form-label fs-s fw-medium black_300">
                    support Status
                  </label>
                  <select
                    className="form-select form-control me-3"
                    aria-label="Default select example"
                    placeholder=""
                    name=""
                    id="support"
                    required
                    onChange={(e) =>
                      setNewStatus((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    value={newStatus.status}
                    disabled={role !== "Support" && role !== "Admin"}
                  >
                    <option value="" disabled>
                      Select the options
                    </option>
                    <option value="Inprogress">Inprogress</option>
                    <option value="Approved">Approved</option>
                    <option value="Disapproved">Disapproved</option>
                  </select>
                </div>
                <div className="col-lg-4">
                  <label className="form-label fs-s fw-medium black_300">
                    support Remarks
                  </label>
                  <textarea
                    type="text"
                    className=" form-control"
                    placeholder="Enter reasons"
                    rows="1"
                    name="description"
                    required
                    onChange={(e) =>
                      setNewStatus((prev) => ({
                        ...prev,
                        remarks: e.target.value,
                      }))
                    }
                    value={newStatus.remarks}
                    disabled={role !== "Support" && role !== "Admin"}
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label fs-s fw-medium black_300">
                    support Refund Amount
                  </label>
                  <input
                    className="input_bg_color form-control"
                    type="number"
                    onChange={(e) =>
                      setNewStatus((prev) => ({
                        ...prev,
                        refund: e.target.value,
                      }))
                    }
                    value={newStatus.refund}
                    disabled={role !== "Support" && role !== "Admin"}
                  />
                </div>
                <div className="col-lg-4 text-start my-2">
                  <Button
                    className="btn_primary"
                    onClick={() => handleSubmit("Support")}
                  >
                    Save Support
                  </Button>
                </div>
              </div>
            )}
            {/* ----------------------------------  Regional Manager ------------------------------------- */}
            {(role === "Admin" ||
              role === "Support" ||
              role === "Regional Manager" ||
              role === "Accounts") && (
              // {(role === "Admin" || role === "Regional Manager") && (
              <div className="row mt-2">
                <div className="col-lg-4 col-md-12">
                  <label className="form-label fs-s fw-medium black_300">
                    Regional Manager Status
                  </label>
                  <select
                    className="form-select form-control me-3"
                    aria-label="Default select example"
                    placeholder=""
                    name=""
                    id="support"
                    required
                    onChange={(e) =>
                      setRegionalManger((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    value={regionalManager.status}
                    disabled={role !== "Regional Manager" && role !== "Admin"}
                  >
                    <option value="" disabled>
                      Select the options
                    </option>
                    <option value="Inprogress">Inprogress</option>
                    <option value="Approved">Approved</option>
                    <option value="Disapproved">Disapproved</option>
                  </select>
                </div>
                <div className="col-lg-4">
                  <label className="form-label fs-s fw-medium black_300">
                    Regional Manager Remarks
                  </label>
                  <textarea
                    type="text"
                    className=" form-control"
                    placeholder="Enter reasons"
                    rows="1"
                    name="description"
                    required
                    onChange={(e) =>
                      setRegionalManger((prev) => ({
                        ...prev,
                        remarks: e.target.value,
                      }))
                    }
                    value={regionalManager.remarks}
                    disabled={role !== "Regional Manager" && role !== "Admin"}
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label fs-s fw-medium black_300">
                    Regional Manager Refund Amount
                  </label>
                  <input
                    className="input_bg_color form-control"
                    type="number"
                    onChange={(e) =>
                      setRegionalManger((prev) => ({
                        ...prev,
                        refund: e.target.value,
                      }))
                    }
                    value={regionalManager.refund}
                    disabled={role !== "Regional Manager" && role !== "Admin"}
                  />
                </div>
                <div className="col-lg-4 text-start my-2">
                  <Button
                    className="btn_primary"
                    onClick={() => handleSubmit("Regional Manager")}
                  >
                    Save Regional Manager
                  </Button>
                </div>
              </div>
            )}
            {/* ----------------------------  Accounts  -------------------------------------------- */}
            {(role === "Admin" ||
              role === "Support" ||
              role === "Regional Manager" ||
              role === "Accounts") && (
              // {(role === "Admin" || role === "Accounts") && (
              <div className="row mt-2">
                <div className="col-lg-4 col-md-12">
                  <label className="form-label fs-s fw-medium black_300">
                    Accounts Status
                  </label>
                  <select
                    className="form-select form-control me-3"
                    aria-label="Default select example"
                    placeholder=""
                    name=""
                    id="support"
                    required
                    onChange={(e) =>
                      setAccounts((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    value={accounts.status}
                    disabled={role !== "Accounts" && role !== "Admin"}
                  >
                    <option value="" disabled>
                      Select the options
                    </option>
                    <option value="Inprogress">Inprogress</option>
                    <option value="Approved">Approved</option>
                    <option value="Disapproved">Disapproved</option>
                  </select>
                </div>
                <div className="col-lg-12 text-start mt-2">
                  <Button
                    className="btn_primary"
                    onClick={() => handleSubmit("Accounts")}
                  >
                    Save Accounts
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive table-card  border-0">
                  <div className="table-scroll table-container">
                    <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                      <thead className="table-light">
                        <tr className="shadow-sm bg-body-tertiary rounded">
                          <th scope="col" className="fs-13 lh-xs fw-600">
                            User
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600 ">
                            Role
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600 ">
                            Status
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600 ">
                            Remarks
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600 ">
                            Refund Amount
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600 ">
                            Date
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600 ">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {refundData?.status?.map((item, index) => (
                          <tr key={index}>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.user}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.role}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.status}
                            </td>

                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.remarks}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.refund}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.date}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* <div className="card">
          <div className="card-body">
            <div className="row">
             {role === "Admin" && <h6>Admin</h6>}
               {role === "Support" && <h6>Support</h6>}
              {role === "Regional Manager" && <h6>Regional Manager</h6>}
              {role === "Accounts" && <h6>Accounts</h6>}
              
              <div className="col-lg-4 col-md-12">
               <div></div>
               <label className="form-label fs-s fw-medium black_300">
                  Status
                </label>
                <select
                  className="form-select form-control me-3"
                  aria-label="Default select example"
                  placeholder=""
                  name=""
                  id="support"
                  required
                  onChange={(e) =>
                    setNewStatus((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  value={newStatus.status}
                >
                  <option value="" disabled>Select the options</option>
                  <option value="Inprogress">Inprogress</option>
                  <option value="Approved">Approved</option>
                  <option value="Disapproved">Disapproved</option>
                </select>
              </div>

              {( role === "Admin" ||role === "Support" || role === "Regional Manager" ) && (
                <div className="col-lg-4">
                  <label className="form-label fs-s fw-medium black_300">
                    Remarks
                  </label>
                  <textarea
                    type="text"
                    className=" form-control"
                    placeholder="Enter reasons"
                    rows="1"
                    name="description"
                    required
                    onChange={(e) =>
                      setNewStatus((prev) => ({
                        ...prev,
                        remarks: e.target.value,
                      }))
                    }
                    value={newStatus.remarks}
                  />
                </div>
              )}
              {(  role === "Admin" || role === "Support"  ) && (
                <div className="col-lg-4">
                  <label className="form-label fs-s fw-medium black_300">
                    Refund Amount
                  </label>
                  <input
                    className="input_bg_color form-control"
                    type="number"
                    onChange={(e) =>
                      setNewStatus((prev) => ({
                        ...prev,
                        refund: e.target.value,
                      }))
                    }
                    value={newStatus.refund}
                  />
                </div>
              )}
              {/* <div className="col-lg-4">
              <label className="form-label fs-s fw-medium black_300">Date</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) =>
                  setNewStatus((prev) => ({
                    ...prev,
                    date: e.target.value
                  }))
                }
                value={newStatus.date}
              />
            </div>
            <div className="col-lg-4">
              <label className="form-label fs-s fw-medium black_300">Time</label>
              <input
                type="time"
                className="form-control"
                onChange={(e) =>
                  setNewStatus((prev) => ({
                    ...prev,
                    time: e.target.value
                  }))
                }
                value={newStatus.time}
              />
            </div> 
              <div className="col-lg-4 text-start mt-2">
                <Button className={"btn_primary mt-4"} onClick={handleSubmit}>
                  Save
                </Button>

              </div>
            </div>
          </div>
        </div> */}

      {/* // const handleSubmit = async (e) => { */}
      {/* //   if (isSaving) return; // Prevent multiple clicks

  //   setIsSaving(true);
  //   let updatedData = { ...newStatus };
  //   updatedData.user = JSON.parse(localStorage.getItem("data")).user.fullname;
  //   updatedData.role = JSON.parse(localStorage.getItem("data")).user.profile;
  //   updatedData.date = new Date().toISOString().slice(0, 10); // Set current date
  //   updatedData.time = new Date().toLocaleTimeString([], options);

  //   let Updatedstatus = [...status];
  //   Updatedstatus.push(updatedData);

  //   let updatedRefund = { */}
      {/* //     refund: [{ ...refundData, status: Updatedstatus }],
  //     registrationnumber: id,
  //   };


  //   ERPApi.put(
  //     `${import.meta.env.VITE_API_URL}/studentrefunds/refundpermissions/${id}`,
  //     updatedRefund
  //   )
  //     .then((response) => { */}
      {/* //     
  //       // Add any logic to display the response in Postman
  //       fetchData();
  //       setNewStatus({ */}
      {/* //         remarks: "",
  //         status: "",
  //         refund: "",
  //         date: "",
  //         time: "",
  //       });
  //     })
  //     .catch((error) => { */}
      {/* //       console.error("Error updating data:", error);
  //     });
  // }; */}
    </div>
  );
};

export default RefundView;
