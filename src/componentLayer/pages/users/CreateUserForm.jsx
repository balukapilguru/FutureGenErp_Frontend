import React, { useEffect, useState, useRef } from "react";
import "../../../assets/css/Forms.css";
import { useBranchContext } from "../../../dataLayer/hooks/useBranchContext";
import { useDepartmentContext } from "../../../dataLayer/hooks/useDepartmentContext";
import { useRoleContext } from "../../../dataLayer/hooks/useRoleContext";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../../components/button/Button";
import { useUserContext } from "../../../dataLayer/hooks/useUserContext";
import { useLoaderData, useNavigate, useParams } from "react-router";
import BackButton from "../../components/backbutton/BackButton";
import Select from "react-select";
import { useCourseContext } from "../../../dataLayer/hooks/useCourseContext";
import { ERPApi } from "../../../serviceLayer/interceptor.jsx";
import { RiExportFill } from "react-icons/ri";
import { MultiSearchSelect, SearchSelect } from "../../../utils/SearchSelect.jsx";

function CreateUserForm() {
  // const { BranchState } = useBranchContext();
  // const { DepartmentState } = useDepartmentContext();
  // const {
  //   UsersState: { TotalUsersWithOutCountellers },
  // } = useUserContext();
  // const { RoleState } = useRoleContext();
  // const { courseState } = useCourseContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const loaderData = useLoaderData() || {};

  const {
    branches = [],
    users = [],
    departments = [],
    courses = [],
    roles = [],
    AllRoles = [],
    user = null, // only exists in editUserLoader
  } = loaderData;


  const coursesList = courses?.map((course, index) => ({
    label: course.course_name,
    value: course.id,
  }));

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCourseAdd = (value) => {
    setSelectedCourses(value);
    setError((prev) => ({
      ...prev,
      courses: "",
    }));
  };

  const [imageAccept, setimageAccept] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // useEffect(() => {
  //   if (id) {
  //     axios
  //       .get(`${import.meta.env.VITE_API_URL}/user/viewuser/${id}`)
  //       .then((response) => {
  //         setFormData(response?.data?.user);
  //         setSelectedCourses(
  //           response.data.user.courses.map((item) => ({
  //             label: item?.course_name,
  //             value: item?.id,
  //           }))
  //         );
  //         setimageAccept(true);

  //       })

  //       .catch((error) => {
  //         console.error("Error fetching course details:", error);
  //       });
  //   }
  // }, [id]);


  // useEffect(() => {
  //   if (id) {
  //     if (user) {
  //       setFormData(user?.user);
  //       setSelectedCourses(
  //         user?.user.courses.map((item) => ({
  //           label: item?.course_name,
  //           value: item?.id,
  //         }))
  //       );
  //       setimageAccept(true);
  //     }
  //   }
  // }, [user]);

  // the above code is commented for the custom select change for the courses


  useEffect(() => {
    if (id && user) {
      setFormData(user?.user);
      console.log("User data in useEffect:", user);

      // Map your API response to the format the Select component needs
      const initialCourses = user?.user.courses.map((item) => ({
        label: item?.course_name,
        value: item?.id,
      })) || [];
      setSelectedDepartment({
        label: user?.user.department,
        value: user?.user.department,
      });

      setSelectedCourses(initialCourses);
      setimageAccept(true);
    }
  }, [user, id]);

  const [formData, setFormData] = useState({
    branch: "",
    fullname: "",
    email: "",
    phonenumber: "",
    designation: "",
    department: "",
    reportto: "",
    branchId: null,
    profile: "",
    aboutuser: "",
    reporttoid: "",
    userProfileImage: null,
    // slots: "",
  });



  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
    if (name === "phonenumber" && value.length > 10) {
      return;
    }
    if (name === "profile") {
      setSelectedCourses([]);
      // setFormData((prev) => ({
      //   ...prev,
      //   slots: "",
      // }));
    }

    if (name === "branchId") {
      setFormData((prev) => ({
        ...prev,
        branch: e.target.options[e.target.selectedIndex].text,
      }));
    }

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
        // [name]: name === "slots" ? Number(value) : value,
      };
    });
  };

  ///--------------start image function--------------------//
  const fileInputRef = useRef(null);

  const [studentImage, setStudentImage] = useState(null);
  const [fileUpdate, setFileupdate] = useState(false);
  const handleFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setFileupdate(Boolean(file));
    if (!file) {
      // If no file is selected, set the error message
      setError((prev) => ({
        ...prev,
        // userProfileImage: "Image is required", 
      }));

      return;
    }

    setError((prev) => ({
      ...prev,
      userProfileImage: "",
    }));

    try {
      // Check the file size (if you want to restrict it to a max size before resizing)
      const maxFileSizeInBytes = 45 * 1024; // 45 KB
      if (file.size > maxFileSizeInBytes) {
        // Resize the image if it exceeds the allowed size
        const resizedImage = await resizeImage(file, maxFileSizeInBytes);
        // Get the dimensions of the resized image (if needed)
        const { width, height } = await getImageSize(resizedImage);

        // Optionally log the resized file size
        const sizeInKB = (resizedImage.size / 1024).toFixed(2);

        // Set the resized image in the state
        // setStudentImage(resizedImage);

        // Update formData with the resized image file
        setFormData((prev) => ({
          ...prev,
          userProfileImage: resizedImage, // Store the file in formData as 'userProfileImage'
        }));
      } else {
        // If the file size is already acceptable, no resizing is necessary
        // setStudentImage(file);

        // Set the file directly in formData
        setFormData((prev) => ({
          ...prev,
          userProfileImage: file,
        }));
      }
    } catch (error) {
      setError((prev) => ({
        ...prev,
        userProfileImage: "Error processing image",
      }));
    }
  };

  const getImageSize = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = (error) => {
        reject(error);
      };

      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const resizeImage = async (file, targetSize) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.src = URL.createObjectURL(file);

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    let width = img.width;
    let height = img.height;
    let resizedFile = file;

    while (resizedFile.size > targetSize) {
      width *= 0.9;
      height *= 0.9;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.85);
      });

      resizedFile = new File([blob], file.name, { type: blob.type });
    }

    return resizedFile;
  };

  const changeInputtype = (e) => {
    e.preventDefault();
    // setFormData((prev) => ({
    //   ...prev,
    //   userProfileImage: null,
    // }));
    setimageAccept(false);
  };

  //--------------end image function--------------------//
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullname || formData.fullname.trim() === "") {
      setError((prev) => ({
        ...prev,
        fullname: "Full name required",
      }));
      return;
    } else if (formData.fullname.length <= 2) {
      setError((prev) => ({
        ...prev,
        fullname: "Enter minimum 3 characters",
      }));
      return;
    }

    if (!formData.email || formData.email.trim() === "") {
      setError((prev) => ({
        ...prev,
        email: "Email required",
      }));
      return;
    } else if (formData.email) {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(formData.email)) {
        setError((prev) => ({
          ...prev,
          email: "Enter valid email",
        }));
        return;
      }
    }

    if (!formData.phonenumber || formData.phonenumber.trim() === "") {
      setError((prev) => ({
        ...prev,
        phonenumber: "Phone number required",
      }));
      return;
    } else if (formData.phonenumber.length !== 10) {
      setError((prev) => ({
        ...prev,
        phonenumber: "Incorrect mobile number",
      }));
      return;
    }

    if (!formData.designation || formData.designation.trim() === "") {
      setError((prev) => ({
        ...prev,
        designation: "Designation is required",
      }));
      return;
    } else if (formData.designation.length <= 2) {
      setError((prev) => ({
        ...prev,
        designation: "Enter minimum 3 characters",
      }));
      return;
    }

    if (!formData.department || formData.department.trim() === "") {
      setError((prev) => ({
        ...prev,
        department: "Department is required",
      }));
      return;
    }

    if (!formData.reporttoid) {
      setError((prev) => ({
        ...prev,
        reporttoid: "Report to is required",
      }));
      return;
    }

    if (!formData.profile || formData.profile.trim() === "") {
      setError((prev) => ({
        ...prev,
        profile: "Role is required",
      }));
      return;
    }
    if (!formData.branchId || formData.branch.trim() === "") {
      setError((prev) => ({
        ...prev,
        branchId: "Branch is required",
      }));
      return;
    }

    if (!formData.profile || formData.profile === "Trainer") {
      if (!selectedCourses || selectedCourses.length <= 0) {
        setError((prev) => ({
          ...prev,
          courses: "Courses is required",
        }));
        return;
      }
    }

    // if (!formData.profile || formData.profile === "Trainer") {
    //   if (!formData.slots) {
    //     setError((prev) => ({
    //       ...prev,
    //       slots: "Slots is required",
    //     }));
    //     return;
    //   }
    // }

    const selectedCourseValues = selectedCourses.map((course) => course.value);
    let user = {
      branch: formData?.branch,
      fullname: formData?.fullname,
      email: formData?.email,
      phonenumber: formData?.phonenumber,
      designation: formData?.designation,
      department: formData?.department,
      reportto: "",
      profile: formData?.profile,
      user_remarks_history: [],
      aboutuser: formData?.aboutuser,
      reporttoid: formData?.reporttoid,
      courses: selectedCourseValues,
      // slots: formData?.slots ? formData?.slots : 0,
      branchId: parseInt(formData?.branchId),
      userProfileImage: formData.userProfileImage,
    };


    if (!fileUpdate) {
      for (let key in user) {
        if (
          user.hasOwnProperty(key) &&
          e.target.innerText === "Update" &&
          key === "userProfileImage"
        ) {
          delete user[key]; // Delete 'userProfileImage' if a is true
        }
      }
    }

    user = [user];
    const dataWithTitleCase = user.map((item) => {
      const newItem = {};

      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          if (
            typeof item[key] === "string" &&
            key !== "email" &&
            key != "userProfileImage" &&
            key !== "courses"

          ) {
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

    const formDataWithTitleCase = user;
    const formDataToSend = new FormData();

    for (const key in formDataWithTitleCase) {
      if (Object.prototype.hasOwnProperty.call(formDataWithTitleCase, key)) {
        formDataToSend.append(key, formDataWithTitleCase[key]);
      }
    }

    setLoading((prev) => !prev);
    try {
      const apiMethod = id ? ERPApi.put : ERPApi.post;
      const endpoint = id ? `/user/updateuser/${id}` : `/user/create-user`;
      const successMessage = id
        ? "User Updated Successfully"
        : "User Created Successfully";

      const { data, status } = await toast.promise(
        apiMethod(endpoint, formDataToSend),
        {
          pending: "Processing: Verifying User Data",
          success: successMessage,
        }
      );
      if (status === 200) {
        navigate("/user/list");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to process user. Please try again."
      );
    } finally {
      setLoading((prev) => !prev);
    }
  };


  return (
    <div>
      {id && id ? (
        <BackButton heading="Edit User Details" content="Back" />
      ) : (
        <BackButton heading="User Form" content="Back" />
      )}
      <div className="container-fluid">
        <div className="card border-0">
          <div className="align-items-center"></div>
          <div className="card-body">
            <div className="live-prieview">
              <form>
                <div className="row d-flex">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="firstNameinput"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Full Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          error && error.fullname
                            ? "form-control fs-s bg-form text_color input_bg_color error-input "
                            : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                        }
                        placeholder="Enter Full Name"
                        id="firstNameinput"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
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
                        value={formData?.email}
                        readOnly={!!id}
                        // disabled={formData.email}
                        onChange={handleChange}
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
                        for="rphoto"
                        className="form-label fs-s fw-medium black_300"
                      >
                        Choose your photo
                      </label>
                      {imageAccept ? (
                        <input
                          className={
                            error && error?.userProfileImage
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          id="rphoto"
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileChange}
                        />
                      ) : (
                        <input
                          className={
                            error && error?.userProfileImage
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          id="rphoto"
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileChange}
                        />
                      )}

                      <div className="response" style={{ height: "8px" }}>
                        {error && error.userProfileImage && (
                          <p className="text-danger m-0 fs-xs">
                            {error.userProfileImage}
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
                        pattern="[0-9]{10}" // Added inputMode attribute here to restrict input to numeric characters
                        value={formData.phonenumber}
                        onChange={handleChange}
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
                        value={formData.designation}
                        onChange={handleChange}
                      />
                      <div style={{ height: "8px" }}>
                        {error && error.designation && (
                          <p className="text-danger m-0 fs-xs">
                            {error.designation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-4 ">
                    <label className="form-label fs-s fw-medium black_300">
                      Department<span className="text-danger">*</span>
                    </label>
                    {/* <select
                      className={
                        error && error.department
                          ? "form-control fs-s bg-form text_color input_bg_color error-input "
                          : "form-control fs-s bg-form text_color input_bg_color select form-select text-capitalize"
                      }
                      aria-label=""
                      placeholder=""
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled selected className="">
                        {" "}
                        Select the Department{" "}
                      </option>
                      {departments &&
                        departments?.data?.length > 0 &&
                        departments?.data?.map((item, index) => (
                          <option key={index}>{item.department_name}</option>
                        ))}
                    </select> */}
                    <SearchSelect
                      className={
                        error && error.department
                          ? "form-control fs-s bg-form text_color input_bg_color error-input"
                          : "form-control fs-s bg-form text_color input_bg_color"
                      }
                      placeholder="Select the Department"
                      value={selectedDepartment}
                      defaultOptions={
                        departments?.data?.length
                          ? departments?.data?.map((item) => ({
                            label: item.department_name,
                            value: item.id, // make sure your API returns id
                          }))
                          : true
                      }
                      onChange={(value, option) => {
                        handleChange({
                          target: {
                            name: "department",
                            value: option?.label, // same behavior as old select
                          },
                        });

                        setSelectedDepartment(option);

                        // clear error
                        setError((prev) => ({
                          ...prev,
                          department: "",
                        }));
                      }}
                      fetchOptions={async (search) => {
                        try {
                          const res = await ERPApi.get(`/settings/getdepartment`, {
                            params: { search: search || "" },
                          });

                          const data = res?.data?.data || [];

                          return data.map((item) => ({
                            label: item.department_name,
                            value: item.id,
                          }));
                        } catch (error) {
                          console.error("Error fetching departments:", error);
                          return [];
                        }
                      }}
                    />
                    <div style={{ height: "8px" }}>
                      {error && error.department && (
                        <p className="text-danger m-0 fs-xs">
                          {error.department}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className=" col-md-4 ">
                    <label className="form-label fs-s fw-medium black_300">
                      Report To<span className="text-danger">*</span>
                    </label>
                    <select
                      className={
                        error && error.reporttoid
                          ? "form-control fs-s bg-form text_color input_bg_color error-input "
                          : "form-control fs-s bg-form text_color input_bg_color select form-select text-capitalize"
                      }
                      aria-label="Default select example"
                      placeholder="Report To*"
                      name="reporttoid"
                      id="reporttoid"
                      value={formData.reporttoid}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled selected>
                        {" "}
                        Select the Report To{" "}
                      </option>

                      {users &&
                        users.length > 0
                        ? users.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item?.fullname}
                          </option>
                        ))
                        : null}
                    </select>

                    <div style={{ height: "8px" }}>
                      {error && error.reporttoid && (
                        <p className="text-danger m-0 fs-xs">
                          {error.reporttoid}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className=" col-md-4 ">
                    <label className="form-label fs-s fw-medium black_300">
                      Role<span className="text-danger">*</span>
                    </label>
                    <select
                      className={
                        error && error.profile
                          ? "form-control fs-s bg-form text_color input_bg_color error-input"
                          : "form-control fs-s bg-form text_color input_bg_color select form-select text-capitalize"
                      }
                      aria-label="Default select example"
                      placeholder="profile*"
                      name="profile"
                      id="profile"
                      value={formData.profile}
                      onChange={handleChange}
                      required

                    >
                      <option value="" disabled selected>
                        {" "}
                        Select the Role{" "}
                      </option>
                      {AllRoles &&
                        AllRoles?.length > 0 &&
                        AllRoles?.map((item, index) => {
                          return (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          );
                        })}
                    </select>
                    <div style={{ height: "8px" }}>
                      {error && error.profile && (
                        <p className="text-danger m-0 fs-xs">{error.profile}</p>
                      )}
                    </div>
                  </div>
                  <div className=" col-md-4 ">
                    <label className="form-label fs-s fw-medium black_300">
                      Branch<span className="text-danger">*</span>
                    </label>
                    <select
                      className={
                        error && error.branchId
                          ? "form-control fs-s bg-form text_color input_bg_color error-input"
                          : "form-control fs-s bg-form text_color input_bg_color  select form-select "
                      }
                      aria-label="Default select example"
                      name="branchId"
                      id="branchId"
                      value={formData.branchId}
                      onChange={handleChange}
                      required
                    >
                      <option
                        value=""
                        style={{ opacity: "0.5" }}
                        disabled
                        selected
                      >
                        {" "}
                        Select the Branch{" "}
                      </option>
                      {/* Here Removed the BranchState replaced branches coming from loaders in any error case replace and uncomment above context */}
                      {branches &&
                        branches?.branchData?.length > 0 &&
                        branches?.branchData?.map((item) => (
                          <option value={item.id}>{item.branch_name}</option>
                        ))}
                    </select>
                    <div style={{ height: "8px" }}>
                      {error && error.branchId && (
                        <p className="text-danger m-0 fs-xs">
                          {error.branchId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="firstNameinput"
                        className="form-label fs-s fw-medium black_300"
                      >
                        About
                        {/* <span className="text-danger">*</span> */}
                      </label>
                      <textarea
                        type="text"
                        className={
                          "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                        }
                        placeholder="Enter About the User"
                        id="firstNameinput"
                        name="aboutuser"
                        value={formData.aboutuser}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {formData.profile === "Trainer" && (
                    <div className=" col-md-4 ">
                      <label className="form-label fs-s fw-medium black_300">
                        Courses<span className="text-danger">*</span>
                      </label>

                      {/* <Select
                        className={` fs-s bg-form text_color input_bg_color ${error && error.courses
                          ? "error-input border border-red-500"
                          : ""
                          }`}
                        isMulti
                        options={coursesList}
                        classNamePrefix="select"
                        value={selectedCourses}
                        onChange={(selectedOption) => {
                          handleCourseAdd(selectedOption);
                        }}
                      /> */}

                      <MultiSearchSelect
                        // 1. Maintain your error styling
                        className={`fs-s bg-form text_color input_bg_color ${error?.courses ? "error-input border border-red-500" : ""
                          }`}
                        placeholder="Select Courses"

                        // 2. Value mapping: FIX HERE 
                        // Added ?. and || [] to stop the "Cannot read properties of undefined (reading 'map')" error
                        value={selectedCourses || []}

                        // 3. Initial list
                        defaultOptions={coursesList || []}

                        // 4. The API Search Logic
                        fetchOptions={async (search) => {
                          try {
                            const coursesData = await ERPApi.get(`/batch/course`, {
                              params: { search: search ? search : searchParams.get('course_label') ?? "" }
                            });
                            const list = coursesData?.data?.reversedCourses?.map((item) => ({
                              label: item?.course_name,
                              value: item?.id,
                            }));
                            return list || [];
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

                      <div style={{ height: "8px" }}>
                        {error && error?.courses && (
                          <p className="text-danger m-0 fs-xs">
                            {error.courses}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* {
                    formData.profile === "Trainer" &&
                    <div className=" col-md-4 ">
                      <label className="form-label fs-s fw-medium black_300">
                        Slots<span className="text-danger">*</span>
                      </label>
                      <select
                        className={
                          error && error.slots
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color  select form-select "
                        }
                        aria-label="Default select example"
                        // placeholder="slots*"
                        // style={{ color: "black" }}
                        name="slots"
                        id="slots"
                        value={formData?.slots}
                        onChange={handleChange}
                        required
                      >
                        <option value="" style={{ opacity: "0.5" }} disabled selected >
                          {" "}
                          Select the Slots{" "}
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>

                      </select>
                      <div style={{ height: "8px" }}>
                        {error && error.slots && (
                          <p className="text-danger m-0 fs-xs">{error.slots}</p>
                        )}
                      </div>
                    </div>
                  } */}
                </div>
                <div className=" ">
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      className={"btn_primary"}
                      onClick={(e) => handleSubmit(e)}
                      disabled={loading}
                      style={{ cursor: loading ? "not-allowed" : "pointer" }}
                    >
                      {id ? "Update" : "Submit"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUserForm;
