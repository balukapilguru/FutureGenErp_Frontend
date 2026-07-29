import React, { useEffect, useState } from "react";
// import "../../../../assets/css/CreateUserForm.css"
import Button from "../../../components/button/Button";
import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/backbutton/BackButton";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
function RefundForm() {
  // const { studentState } = useStudentsContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    registrationnumber: "",
    name: "",
    mobilenumber: "",
    email: "",
    courses: "",
    branch: "",
    batchtimings: "",
    enquirytakenby: "",
    trainername: "",
    admissiondate: "",
    finaltotal: "",
    totalpaidamount: "",
    dueamount: "",
    comment: "",
    status: [],
    chat: [],
    date: new Date(),
  });
  const [errorState, setErrorState] = useState({});

  // useEffect(() => {
  //   if (formData.registrationnumber.length >= 13) {
  //     if (studentState.TotalStudents && formData.registrationnumber) {
  //       const filteredResults = studentState.TotalStudents.filter(
  //         (item) =>
  //           item.registrationnumber.toLowerCase() ===
  //           formData.registrationnumber.toLowerCase()
  //       );

  //       const response = axios.get(`${import.meta.env.VITE_API_URL}/studentrefunds/getstudentdata/${formData.registrationnumber}`);

  //       if (filteredResults && filteredResults.length > 0) {
  //         let filterstudentwithregistrationid = filteredResults[0];
  //         setFormData((prev) => ({
  //           ...prev,
  //           name: filterstudentwithregistrationid.name,
  //           mobilenumber: filterstudentwithregistrationid.mobilenumber,
  //           email: filterstudentwithregistrationid.email,
  //           courses: filterstudentwithregistrationid.courses,
  //           branch: filterstudentwithregistrationid.branch,
  //           enquirytakenby: filterstudentwithregistrationid.enquirytakenby,
  //           admissiondate: filterstudentwithregistrationid?.admissiondate,
  //           finaltotal: filterstudentwithregistrationid.finaltotal,
  //           totalpaidamount: filterstudentwithregistrationid.totalpaidamount,
  //           dueamount: filterstudentwithregistrationid.dueamount,
  //         }));
  //       }
  //       if (filteredResults && filteredResults.length < 1) {
  //         // let filterstudentwithregistrationid = filteredResults[0]
  //         setFormData((prev) => ({
  //           ...prev,
  //           name: "",
  //           mobilenumber: "",
  //           email: "",
  //           courses: "",
  //           branch: "",
  //           batchtimings: "",
  //           enquirytakenby: "",
  //           trainername: "",
  //           admissiondate: "",
  //           finaltotal: "",
  //           totalpaidamount: "",
  //           dueamount: "",
  //           comment: "",
  //         }));
  //       }
  //     }
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       name: "",
  //       mobilenumber: "",
  //       email: "",
  //       courses: "",
  //       branch: "",
  //       batchtimings: "",
  //       enquirytakenby: "",
  //       trainername: "",
  //       admissiondate: "",
  //       finaltotal: "",
  //       totalpaidamount: "",
  //       dueamount: "",
  //       comment: "",
  //     }));
  //   }
  // }, [formData.registrationnumber]);



  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (formData.registrationnumber.length >= 13) {
  //         if (studentState.TotalStudents && formData.registrationnumber) {
  //           const { data, status } = await axios.get(
  //             `${import.meta.env.VITE_API_URL}/studentrefunds/getstudentdata/${
  //               formData.registrationnumber
  //             }`
  //           );

  //           let filteredResults;
  //           if (status === 200) {
  //             filteredResults = [data];
  //           }
  //           if (filteredResults && filteredResults.length > 0) {
  //             let filterstudentwithregistrationid = filteredResults[0];
  //             setFormData((prev) => ({
  //               ...prev,
  //               name: filterstudentwithregistrationid?.name,
  //               mobilenumber: filterstudentwithregistrationid?.mobilenumber,
  //               email: filterstudentwithregistrationid?.email,
  //               courses: filterstudentwithregistrationid?.courses,
  //               branch: filterstudentwithregistrationid?.branch,
  //               enquirytakenby: filterstudentwithregistrationid?.enquirytakenby,
  //               admissiondate: filterstudentwithregistrationid?.admissiondate,
  //               finaltotal: filterstudentwithregistrationid?.finaltotal,
  //               totalpaidamount:
  //                 filterstudentwithregistrationid?.totalpaidamount,
  //               dueamount: filterstudentwithregistrationid?.dueamount,
  //             }));
  //           }
  //           if (filteredResults && filteredResults.length < 1) {
  //             // let filterstudentwithregistrationid = filteredResults[0]
  //             setFormData((prev) => ({
  //               ...prev,
  //               name: "",
  //               mobilenumber: "",
  //               email: "",
  //               courses: "",
  //               branch: "",
  //               batchtimings: "",
  //               enquirytakenby: "",
  //               trainername: "",
  //               admissiondate: "",
  //               finaltotal: "",
  //               totalpaidamount: "",
  //               dueamount: "",
  //               comment: "",
  //             }));
  //           }
  //         }
  //       } else {
  //         setFormData((prev) => ({
  //           ...prev,
  //           name: "",
  //           mobilenumber: "",
  //           email: "",
  //           courses: "",
  //           branch: "",
  //           batchtimings: "",
  //           enquirytakenby: "",
  //           trainername: "",
  //           admissiondate: "",
  //           finaltotal: "",
  //           totalpaidamount: "",
  //           dueamount: "",
  //           comment: "",
  //         }));
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, [formData.registrationnumber]);

  const handleFormData = (e) => {
    const { name, value } = e.target;
    if (name === "batchtimings") {
      const selectedTime = new Date(`2000-01-01T${value}`);
      const minTime = new Date(`2000-01-01T09:00`);
      const maxTime = new Date(`2000-01-01T19:00`);

      if (selectedTime < minTime || selectedTime > maxTime) {
        setFormData((prev) => ({ ...prev, [name]: "" }));

        setErrorState((prev) => ({
          ...prev,
          [name]: "Batch timings should be between 9:00 AM and 7:00 PM",
        }));
        return;
      }
    }
    if (name === "mobilenumber" && value.length > 10) {
      return;
    }
    if (name === "name" && /\d/.test(value)) {
      return;
    }
    if (name === "finaltotal" && /[a-zA-Z]/.test(value)) {
      return;
    }
    if (name === "totalpaidamount" && /[a-zA-Z]/.test(value)) {
      return;
    }
    if (name === "dueamount" && /[a-zA-Z]/.test(value)) {
      return;
    }
    if (name === "comment" && /\d/.test(value)) {
      return;
    }
    if (name === "comment" && /[^a-zA-Z\s]/.test(value)) {
      return;
    }
    if (name === "branch" && /\d/.test(value)) {
      return;
    }
    if (name === "courses" && /\d/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorState((prev) => ({
      ...prev,
      [name]: "", // Reset error for the field being changed
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.registrationnumber || formData.registrationnumber === "") {
      setErrorState((prev) => ({
        ...prev,
        registrationnumber: "Registration Number is required",
      }));
      return;
    }
    if (!formData.name || formData.name === "") {
      return setErrorState((prev) => ({ ...prev, name: "Name is required" }));
    }
    if (!formData.mobilenumber || formData.mobilenumber === "") {
      return setErrorState((prev) => ({
        ...prev,
        mobilenumber: "Mobile Number is required",
      }));
    } else {
      if (formData.mobilenumber.length != 10) {
        return setErrorState((prev) => ({
          ...prev,
          mobilenumber: "Invalid Mobile number",
        }));
      }
    }

    if (!formData.email || formData.email === "") {
      setErrorState((prev) => ({ ...prev, email: "Email is required" }));
      return;
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(formData.email)) {
        setErrorState((prev) => ({ ...prev, email: "Invalid Email Address" }));
        return;
      }
    }
    if (!formData.courses || formData.courses === "") {
      return setErrorState((prev) => ({
        ...prev,
        courses: "Enrolled Course is required",
      }));
    }
    if (!formData.branch || formData.branch === "") {
      return setErrorState((prev) => ({
        ...prev,
        branch: "Branch is required",
      }));
    }
    if (!formData.enquirytakenby || formData.enquirytakenby === "") {
      return setErrorState((prev) => ({
        ...prev,
        enquirytakenby: "Counsellor name is required",
      }));
    }
    if (!formData.admissiondate) {
      return setErrorState((prev) => ({
        ...prev,
        admissiondate: "Admission Date is required",
      }));
    }
    if (!formData.finaltotal || formData.finaltotal === "") {
      return setErrorState((prev) => ({
        ...prev,
        finaltotal: "Total Course Fee is required",
      }));
    }

    if (!formData.totalpaidamount || formData.totalpaidamount === "") {
      return setErrorState((prev) => ({
        ...prev,
        totalpaidamount: "Fee paid is required",
      }));
    }

    if (!formData.dueamount || formData.dueamount === "") {
      return setErrorState((prev) => ({
        ...prev,
        dueamount: "Due Amount is required",
      }));
    }

    if (!formData.batchtimings || formData.batchtimings === "") {
      return setErrorState((prev) => ({
        ...prev,
        batchtimings: "Batch Timings is required",
      }));
    }

    if (!formData.comment || formData.comment === "") {
      return setErrorState((prev) => ({
        ...prev,
        comment: "Reason for refund is required",
      }));
    }

    let refund = {
      refund: [formData],
      registrationnumber: formData.registrationnumber,
    };

    try {
      const { data, status } = await toast.promise(
        ERPApi.post(
          `${import.meta.env.VITE_API_URL}/studentrefunds/studentfeerefund`,
          refund
        ),
        {
          loading: "Loading...",
          success: "Refund form submitted successfully",
          error: "Refund form not submitted",
        }
      );

      if (status === 201) {
        navigate("/refund/refunddata");
      }
    } catch (error) {}
  };

  return (
    <div>
      <BackButton heading="Refund Form" content="Back" to="/" />
      <div className="container-fluid">
        <div className="card border-0">
          <div></div>
          <div className="card-body">
            <div className="live-prieview">
              <form onSubmit={handleSubmit}>
                <div className="row d-flex">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="registrationnumber"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Registration number
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          errorState && errorState.registrationnumber
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Enter Registration number"
                        id="registrationnumber"
                        name="registrationnumber"
                        onChange={handleFormData}
                        value={formData.registrationnumber}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.registrationnumber && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.registrationnumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="name"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Student Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          errorState && errorState.name
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Enter Student name"
                        id="name"
                        name="name"
                        onChange={handleFormData}
                        value={formData.name}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.name && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="mobilenumber"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Phone Number<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={
                          errorState && errorState.mobilenumber
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Enter Phone Number"
                        id="mobilenumber"
                        name="mobilenumber"
                        onChange={handleFormData}
                        value={formData.mobilenumber}
                        max="10"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.mobilenumber && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.mobilenumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="email"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Email Id<span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={
                          errorState && errorState.email
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Enter Email"
                        id="email"
                        name="email"
                        onChange={handleFormData}
                        value={formData.email}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.email && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="courses"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Enrolled Course<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          errorState && errorState.courses
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Enter Enrolled Course"
                        id="courses"
                        name="courses"
                        onChange={handleFormData}
                        value={formData.courses}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.courses && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.courses}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="branch"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Branch<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          errorState && errorState.branch
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Enter Branch"
                        id="branch"
                        name="branch"
                        onChange={handleFormData}
                        value={formData.branch}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.branch && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.branch}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="enquirytakenby"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Counsellor Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          errorState && errorState.enquirytakenby
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Enter counsellor name"
                        id="enquirytakenby"
                        name="enquirytakenby"
                        onChange={handleFormData}
                        value={formData?.enquirytakenby}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.enquirytakenby && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.enquirytakenby}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="admissiondate"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Admission Date<span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={
                          errorState && errorState.admissiondate
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color date_input_color "
                        }
                        id="admissiondate"
                        placeholder="Enter admission fee"
                        name="admissiondate"
                        onChange={handleFormData}
                        value={formData?.admissiondate}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.admissiondate && (
                          <p className="text-danger m-0 fs-xs ">
                            {errorState?.admissiondate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="finaltotal"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Total Course Fee<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          errorState && errorState.finaltotal
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Total Course Fee"
                        id="finaltotal"
                        name="finaltotal"
                        onChange={handleFormData}
                        value={formData.finaltotal}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.finaltotal && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.finaltotal}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="totalpaidamount"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Fee Paid<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          errorState && errorState.totalpaidamount
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Fee Paid"
                        id="totalpaidamount"
                        name="totalpaidamount"
                        onChange={handleFormData}
                        value={formData.totalpaidamount}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.totalpaidamount && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.totalpaidamount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="dueamount"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Due Amount<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          errorState && errorState.dueamount
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Due Amount"
                        id="dueamount"
                        name="dueamount"
                        onChange={handleFormData}
                        value={formData.dueamount}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.dueamount && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.dueamount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="batchtimings"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Batch Timing<span className="text-danger">*</span>
                      </label>
                      <input
                        type="time"
                        className={
                          errorState && errorState.batchtimings
                            ? "form-control input_bg_color error-input date_input_color"
                            : "form-control input_bg_color date_input_color"
                        }
                        placeholder="Batch Time"
                        id="batchtimings"
                        name="batchtimings"
                        onChange={handleFormData}
                        value={formData.batchtimings}
                        min="09:00" // Minimum time allowed (9:00 AM)
                        max="19:00" // Maximum time allowed (7:00 PM)
                      />

                      <div style={{ height: "8px" }}>
                        {errorState && errorState.batchtimings && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.batchtimings}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="">
                      <label
                        for="comment"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Reason For Refund<span className="text-danger">*</span>
                      </label>
                      <textarea
                        type="text"
                        className={
                          errorState && errorState.comment
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        placeholder="Reason For Refund"
                        id="comment"
                        rows="3"
                        name="comment"
                        onChange={handleFormData}
                        // value={formData.email}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.comment && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="trainername"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Trainer Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control fs-s bg-form input_bg_color text_color"
                        placeholder="Enter Trainer Name"
                        id="trainername"
                        name="trainername"
                        onChange={handleFormData}
                        value={formData.trainername}
                      />
                    </div>
                  </div> */}
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    type={"submit"}
                    className={"btn_primary"}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundForm;
