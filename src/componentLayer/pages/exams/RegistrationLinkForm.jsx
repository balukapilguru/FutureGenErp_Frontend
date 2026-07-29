import React, { useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { ERPApi } from "../../../serviceLayer/interceptor";
import { toast } from "react-toastify";
import { FaClock, FaRegCalendarAlt,  }from "react-icons/fa";
import { GoCheckCircle } from "react-icons/go";


export const registrationFormLinkLoader = async ({ params }) => {
  try {
    const response = await ERPApi.get(`/registrationform/all`);
    const forms = response.data?.forms || [];
    const form = forms.find((f) => f.link === params.link);

    if (!form) throw new Response("Form not found", { status: 404 });

    const formResponse = await ERPApi.get(`/registrationform/getbyId/${form.id}`);
    return formResponse.data;
  } catch (error) {
    console.error("Error fetching registration form:", error);
    throw new Response("Form not found", { status: 404 });
  }
};

export const addRegistrationAction = async ({ request }) => {
  try {
    const formData = await request.json();
    return toast.promise(
      ERPApi.post(`/registrationform/studentform`, formData),
      {
        pending: "Submitting form...",
        success: "Form submitted successfully!",
        error: (error) =>
          error.response?.status === 400
            ? "You have already submitted this form."
            : "Error submitting form. Please try again.",
      }
    );
  } catch (error) {
    console.error("Error submitting registration form:", error);
    toast.error("Unexpected error occurred. Please try again.");
    return null;
  }
};

const RegistrationLinkForm = () => {
  const fetcher = useFetcher();
  const registrationFormData = useLoaderData();
  const [formData, setFormData] = useState(registrationFormData?.fieldsList || []);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (label, value) => {
    setFormData((prevData) =>
      prevData.map((field) =>
        field.label === label ? { ...field, value } : field
      )
    );
  };
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = formData.filter((field) => field.value.trim() === "");
    if (missingFields.length > 0) {
      toast.error(`Please fill all fields: ${missingFields.map(f => f.label).join(", ")}`);
      return;
    }
    const now = Date.now();
    const activeFrom = Date.parse(registrationFormData?.activeFrom);
    const activeTo = Date.parse(registrationFormData?.activeTo);
  
    if (now < activeFrom || now > activeTo) {
      setIsRegistrationClosed(true);
      return;
    }
    const payload = formData.reduce((acc, field) => {
      acc[field.label.toLowerCase().replace(/\s+/g, "")] = field.value;
      return acc;
    }, {});
    payload.formId = registrationFormData.id;
  
    fetcher.submit(payload, {
      method: "post",
      encType: "application/json",
    });
  };

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data !== undefined) {
      setShowSuccess(true);
    }
  }, [fetcher.state, fetcher.data]);

  if (showSuccess) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="card shadow p-4 rounded-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
     <div className="d-flex justify-content-center">
      <GoCheckCircle size={48} className="text-success mb-3" />
    </div>
          <h4 className="fw-bold">Registration Successful!</h4>
          <div className="bg-light border rounded p-3 my-3 text-start">
            <strong>Exam Details</strong>
            <div>Date: {registrationFormData?.examDate}</div>
            <div>Time: {registrationFormData?.examTime}</div>
            <div>Duration: {registrationFormData?.time} minutes</div>
          </div>
          <button className="btn btn-primary w-100" onClick={() => window.location.reload()}>
            ← Register Another Student
          </button>
        </div>
      </div>
    );
  }

  if (isRegistrationClosed) {
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="card shadow p-4 rounded-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
          <div className="mb-3">
            <FaRegCalendarAlt size={40} className="text-secondary" />
          </div>
          <h4 className="fw-bold">Registration Closed</h4>
          <p className="text-muted">
            This registration form is not currently active.
            <br />
            {/* Please check back between{" "}
            <strong>{registrationFormData?.activeFrom}</strong> and{" "}
            <strong>{registrationFormData?.activeTo}</strong>. */}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="card shadow-sm rounded-4" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="bg_primary text-white p-4 rounded-top-4">
          <h5 className="mb-0 fw-bold text-center">
            {registrationFormData?.registrationformname || "Registration Form"}
          </h5>
        </div>

        <div className="p-4 border-bottom">
          <div className="d-flex justify-content-around text-center flex-wrap gap-3">
            <div>
              <FaRegCalendarAlt className="me-2 text-primary" />
              <div className="fw-bold">{registrationFormData?.examDate}</div>
              <small className="text-muted">Exam Date</small>
            </div>
            <div>
              <FaClock className="me-2 text-primary" />
              <div className="fw-bold">{registrationFormData?.examTime}</div>
              <small className="text-muted">Exam Time</small>
            </div>
            <div>
              <FaClock className="me-2 text-primary" />
              <div className="fw-bold">{registrationFormData?.time} minutes</div>
              <small className="text-muted">Duration</small>
            </div>
            <div>
              <FaClock className="me-2 text-primary" />
              <div className="fw-bold">{registrationFormData?.activeTo}</div>
              <small className="text-muted">Closing Date</small>
            </div>
          </div>
        </div>

        <form className="p-4" onSubmit={handleSubmit}>
          {formData
            .filter((field) =>
              ![
                "Registration Form Title", "Description", "Exam Date",
                "Start Date", "End Date", "Duration", "examDate", "time",
                "activeFrom", "Exam Time", "Closing Date", "Duration (in minutes)"
              ].includes(field.label)
            )
            .map((field, index) => (
              <div className="mb-3" key={index}>
                <label className="form-label fw-semibold">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    className="form-select"
                    value={field.value}
                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="form-control"
                    placeholder={`Enter your ${field.label}`}
                    value={field.value}
                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                  />
                )}
              </div>
            ))}

          <button type="submit" className="btn btn_primary w-100 mt-2">
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationLinkForm;
