import BackButton from "../../../components/backbutton/BackButton";
import { useState, useRef, useEffect, useCallback } from "react";
import Button from "../../../components/button/Button";
import Swal from "sweetalert2";
import { redirect, useNavigate, useSubmit } from "react-router-dom";
import { json } from "react-router-dom";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import { toast } from "react-toastify";
import { useLoaderData, useFetcher } from "react-router-dom";
import { debounce } from "../../../../utils/Utils";
import { IoInformationCircleOutline } from "react-icons/io5";

//Action//
export const addPlacedStudentsAction = async ({ params, request }) => {
  if (request.method === "POST") {
    try {
      const formData = await request.formData();

      formData.forEach((value, key) => {

      });

      const placementData = {
        placementAt: formData.get("company"),
        designation: formData.get("designation"),
        CTC: parseInt(formData.get("ctc")),
        studentID: parseInt(formData.get("studentID")),
        userID: parseInt(formData.get("userID")),
        studentImg: formData.get("studentImg"),
        filename: formData.get("filename"),
      };

      const response = await toast.promise(
        ERPApi.post(`/studentplace/createplacement`, placementData),
        {
          pending: "Creating Student Placement",
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Added successfully",
          icon: "success",
          text: "A placed student Added successfully",
        });
        //toast.success("Student placement created successfully");
        return redirect("/batchmanagement/placedstudents");
      } else {
        return { error: "Error submitting Placement Data" }, { status: 500 };
      }
    } catch (error) {
      if (error.response.status === 400) {
        Swal.fire({
          title: "Oops...",
          icon: "error",
          text: "Student is already placed and cannot be placed again",
        });
        //toast.error("Student is already placed and cannot be placed again.");
        return { error: "Student Add Placed" }, { status: 400 };
      } else if (error.response.status === 404) {
        toast.error("Student Not Found");
        return { error: "Student Not Found" }, { status: 404 };
      } else {
        console.error("API error:", error);
        return { error: "Internal Server Error" }, { status: 500 };
      }
    }
  } else if (request.method === "PUT") {
    // const data = await request.json();
    // if (data.type === "GET_STUDENT_DATA") {
    //   const responsePromise = ERPApi.get(
    //     `fee/updatingduedateanddueamount/${data?.regNo}`
    //   );
    //   const response = await toast.promise(responsePromise, {
    //     pending:
    //       "Updating the input fields...",
    //     success: {
    //       render({ data }) {
    //         const successMessage =
    //           data?.response?.data?.message ||
    //           "Updated the DueDate and DueAmount Of Installments successfully!";
    //         return successMessage;
    //       },
    //     },
    //     error: {
    //       render({ data }) {
    //         const errorMessage =
    //           data?.response?.data?.message ||
    //           "Something went wrong. Please try again.";
    //         return errorMessage;
    //       },
    //     },
    //   });
    //   if (response?.status === 200) {
    //     return { data: response?.data, status: response?.status };
    //   }
    // }
  }
};

export const addPlacedStudentListLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  const queryParams = url.search;

  const studentId = url.searchParams.get("regNo") || null;
  try {
    const response = studentId
      ? await toast.promise(
        ERPApi.get(`/studentrefunds/getstudentdata/${studentId}`),
        {
          pending: "Processing Student Details...",
        }
      )
      : ERPApi.get(`/studentrefunds/getstudentdata/${studentId}`);

    const { data, status } = response;
    return { data };
  } catch (error) {
    console.error("Error fetching student data:", error);

    return null;
  }
};

const AddPlacedStudent = () => {
  const studentDetails = useLoaderData()?.data;

  const submit = useSubmit();
  const fetcher = useFetcher();


  const [error, setError] = useState({});

  const [regNumber, setRegNumber] = useState();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    company: "",
    designation: "",
    ctc: "",
    studentID: "",
    userID: "",
    regNo: "",
    profile: null,
    base64: "",
    filename: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataMain = new FormData();

    let isValid = true;

    setErrors({
      company: "",
      designation: "",
      ctc: "",
      profile: "",
    });

    // Validation for rating and description
    if (formData.company === "") {
      setErrors((prev) => ({
        ...prev,
        company: "Required Company Name",
      }));
      isValid = false;
    } else if (formData.designation === "") {
      setErrors((prev) => ({
        ...prev,
        designation: "Designation is required.",
      }));
      isValid = false;
    } else if (formData.ctc === "") {
      setErrors((prev) => ({
        ...prev,
        ctc: "CTC required.",
      }));

      isValid = false;
    }
    if (!formData.base64) {
      setErrors((prev) => ({
        ...prev,
        profile: "Profile Image is required",
      }));

      isValid = false;
    }

    // If form is valid, proceed with the fetch request
    if (isValid) {


      setErrors({
        company: "",
        designation: "",
        ctc: "",
        profile: "",
      });
      formDataMain.append("company", formData.company);
      formDataMain.append("designation", formData.designation);
      formDataMain.append("ctc", formData.ctc);
      formDataMain.append("studentID", studentDetails?.id);
      formDataMain.append(
        "userID",
        JSON.parse(localStorage.getItem("data"))?.user?.id
      );
      formDataMain.append("filename", formData.filename);
      formDataMain.append("studentImg", formData.base64);
      // Fetch request to submit the form data
      Swal.fire({
        title: "Are you sure?",
        text: "This will create a student placement with the specified details. Proceed?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, create it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          fetcher.submit(formDataMain, {
            method: "POST",
            encType: "multipart/form-data",
          });
        }
      });
    }
  };

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setFormData((prev) => ({
      ...prev,
      regNo: userInput,
    }));
    setRegNumber(userInput);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ctc" && value.length > 10) {
      return;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: "", // Reset error for the field being changed
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profile: "Only JPG and PNG files are allowed",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profile: "Image size should be less than 2MB",
      }));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];

      setFormData((prev) => ({
        ...prev,
        profile: file,
        base64: base64String,
        filename: file.name,
      }));

      setErrors((prev) => ({
        ...prev,
        profile: "",
      }));
    };

    reader.readAsDataURL(file);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    debouncedParams(regNumber);
    if (!studentDetails) {
      setFormData((prev) => ({
        ...prev,
        company: "",
        designation: "",
        ctc: "",
        studentID: "",
        userID: "",
        regNo: "",
      }));
    }
  }, [regNumber]);

  const debouncedParams = useCallback(
    debounce((param) => {
      const searchParams = new URLSearchParams({
        regNo: param,
      }).toString();
      if (param.length >= 10) {

        submit(`?${searchParams}`, { method: "get", action: "." });
      }
    }, 500),
    []
  );

  // const handleKeyDown = (event) => {
  //   if (event.keyCode === 38 || event.keyCode === 40) {
  //     event.preventDefault(); // Prevent default behavior of arrow keys
  //   }
  // };

  //getting suggestions//
  return (
    <div>
      {10 && 10 ? (
        <BackButton heading="Add Placed Students" content="Back" />
      ) : (
        <BackButton heading="User Form" content="Back" />
      )}
      <div className="container-fluid">
        <div className="card border-0">
          <div className="align-items-center"></div>
          <div className="card-body">
            <div className="live-prieview">
              <fetcher.Form method="post" onSubmit={handleSubmit}>
                <div className="row d-flex">
                  <div className="col-md-4">
                    <div className="mb-3" style={{ position: "relative" }}>
                      <label
                        for="firstNameinput"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Registraion Number<span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control fs-s bg-form text_color input_bg_color text-capitalize placedstudentsinput"
                        //value={studentDetails.registrationnumber}

                        type="text"
                        value={regNumber}
                        onChange={handleInputChange}
                        placeholder="Enter Registraion Number"
                      />

                      <div style={{ height: "8px" }}>
                        {error && error.fullname && (
                          <p className="text-danger m-0 fs-xs">
                            {error.fullname}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="email"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={
                          error && error.email
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color"
                        }
                        placeholder="Enter Name"
                        id="firstNameinput"
                        name="email"
                        value={studentDetails ? studentDetails?.name : ""}
                        disabled="true"
                      />
                      <div style={{ height: "8px" }}>
                        {error && error.email && (
                          <p className="text-danger m-0 fs-xs">{error.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="email"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Email Id<span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={
                          error && error.email
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color"
                        }
                        placeholder="Enter Email Id"
                        id="firstNameinput"
                        name="email"
                        value={studentDetails ? studentDetails?.email : ""}
                        disabled="true"
                      />
                      <div style={{ height: "8px" }}>
                        {error && error.email && (
                          <p className="text-danger m-0 fs-xs">{error.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="lastNameinput"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Phone Number<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        maxLength="10"
                        className={
                          error && error.phonenumber
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color"
                        }
                        placeholder="Enter Phone Number"
                        id="firstNameinput"
                        name="phonenumber"
                        pattern="[0-9]{10}"
                        value={
                          studentDetails ? studentDetails?.mobilenumber : ""
                        }
                        disabled="true"
                      />
                      <div style={{ height: "8px" }}>
                        {error && error.phonenumber && (
                          <p className="text-danger m-0 fs-xs">
                            {error.phonenumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="lastNameinput"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Branch<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          error && error.designation
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                        }
                        placeholder="Enter Branch"
                        id="designationNameinput"
                        name="designation"
                        value={studentDetails ? studentDetails?.branch : ""}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="lastNameinput"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Course<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          error && error.designation
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                        }
                        placeholder="Enter Course"
                        id="designationNameinput"
                        name="designation"
                        value={studentDetails ? studentDetails?.courses : ""}
                        disabled="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="lastNameinput"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Positioned Company<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          error && error.designation
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                        }
                        placeholder="Enter Company Name"
                        id="designationNameinput"
                        name="company"
                        onChange={handleChange}
                        value={studentDetails ? formData.company : ""}
                        disabled={!studentDetails}
                      />
                      {errors.company && (
                        <p className="text-danger m-0 fs-xs">
                          {errors.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="lastNameinput"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Designation<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          error && error.designation
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                        }
                        placeholder="Enter Designation"
                        id="designationNameinput"
                        name="designation"
                        onChange={handleChange}
                        value={studentDetails ? formData.designation : ""}
                        disabled={!studentDetails}
                      />
                      {errors.designation && (
                        <p className="text-danger m-0 fs-xs">
                          {errors.designation}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3 position-relative">
                      <label
                        htmlFor="designationNameinput"
                        className="form-label fs-s fw-medium black_300"
                      >
                        CTC<span className="text-danger">*</span>
                      </label>

                      <div className="position-relative">
                        <input
                          type="number"
                          className={
                            error && error.designation
                              ? "form-control fs-s bg-form text_color input_bg_color error-input pe-5"
                              : "form-control fs-s bg-form text_color input_bg_color text-capitalize pe-5"
                          }
                          placeholder="Enter CTC"
                          id="designationNameinput"
                          name="ctc"
                          max="10"
                          //onKeyDown={(event) => handleKeyDown(event)}
                          required
                          onChange={handleChange}
                          value={studentDetails ? formData.ctc : ""}
                          disabled={!studentDetails}
                        />

                        {/* Icon inside input field */}
                        <span
                          className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
                          title="Enter the CTC in the format 5.5 or fully, without any special characters or spaces."
                        >
                          <IoInformationCircleOutline className="fs-5" />
                        </span>
                      </div>

                      {errors.ctc && (
                        <p className="text-danger m-0 fs-xs">{errors.ctc}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fs-s fw-medium black_300">
                        Profile Image <span className="text-danger">*</span>
                      </label>

                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="form-control"
                        onChange={handleProfileChange}
                        disabled={!studentDetails}
                      />

                      {formData.profile && (
                        <div className="mt-2 text-center">
                          <img
                            src={URL.createObjectURL(formData.profile)}
                            alt="Preview"
                            className="rounded-circle"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              border: "2px solid #ddd",
                            }}
                          />
                        </div>
                      )}

                      {errors.profile && (
                        <p className="text-danger m-0 fs-xs">
                          {errors.profile}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" ">
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      className={"btn_primary"}
                      onClick={(e) => handleSubmit(e)}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </fetcher.Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlacedStudent;
