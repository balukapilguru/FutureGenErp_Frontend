import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFetcher, useLoaderData, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/backbutton/BackButton";
import Button from "../../../components/button/Button";
import { useCoursePackage } from "../../../../dataLayer/hooks/useCoursePackage";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";
const CreateCoursePackage = () => {
  const { getAllCoursePackages, DispatchCourseState } = useCoursePackage();
  const fetcher = useFetcher()
  const coursePackage = useLoaderData();
  const navigate = useNavigate();
  const { id } = useParams()
  const [createdBy, setCreatedBy] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return userData || "";
  });
  const [formData, setFormData] = useState(() => {
    if (id) {
      const data = coursePackage?.coursePackage[0].data;
      return {
        coursepackages_name: data.coursepackages_name || "",
        createdby: data.createdby || createdBy?.username || createdBy || "",
      };
    }
    return {
      coursepackages_name: "",
      createdby: createdBy?.username || createdBy || "",
    };
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (id) {
  //     // Fetch branch for editing
  //     ERPApi.get(
  //       `${import.meta.env.VITE_API_URL}/settings/getcoursepackages/${id}`
  //     )
  //       .then((response) => {
  //         setFormData({
  //           coursepackages_name: response?.data?.coursepackages_name || "",
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching course details:", error);
  //       });
  //   }
  // }, [id]);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      [name]: "", // Reset error for the field being changed
    }));
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (
  //     !formData.coursepackages_name ||
  //     formData.coursepackages_name.trim() === "" ||
  //     formData.coursepackages_name.length < 3
  //   ) {
  //     setError((prev) => ({
  //       ...prev,
  //       coursepackages_name:
  //         "Enter the Course Package (Minimum 3 Characters Required)",
  //     }));
  //     return;
  //   }
  //   let user = {
  //     coursepackages_name: formData.coursepackages_name,
  //     createdby: createdBy?.user?.fullname,
  //   };
  //   user = [user];

  //   const dataWithTitleCase = user.map((item) => {
  //     const newItem = {};

  //     for (const key in item) {
  //       if (Object.prototype.hasOwnProperty.call(item, key)) {
  //         if (typeof item[key] === "string" && key !== "email") {
  //           newItem[key] = item[key]
  //             .split(" ")
  //             .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //             .join(" ");
  //         } else {
  //           newItem[key] = item[key];
  //         }
  //       }
  //     }
  //     return newItem;
  //   });

  //   user = dataWithTitleCase[0];

  //   if (!id) {
  //     setLoading((prev) => !prev);
  //     try {
  //       const { data, status } = await toast.promise(
  //         ERPApi.post(`/settings/addcoursespackages`, user),
  //         {
  //           pending: "Course Packages Creating...",
  //         }
  //       );

  //       if (status === 201) {
  //         DispatchCourseState({ type: "CREATE_COURSE_PACKAGE", payload: data });
  //         getAllCoursePackages();
  //         navigate("/settings/coursepackage");
  //         Swal.fire({
  //           title: "Created!",
  //           text: "Course Package Created Successfully.",
  //           icon: "success",
  //         });
  //       }
  //     } catch (error) {
  //       const errorMessage =
  //         error?.response?.data?.message ||
  //         "Create Course Package Failed!. Please try again.";
  //       Swal.fire({
  //         title: "Error!",
  //         text: errorMessage,
  //         icon: "error",
  //       });
  //     } finally {
  //       setLoading((prev) => !prev);
  //     }
  //   }

  //   if (id) {
  //     setLoading((prev) => !prev);
  //     try {
  //       const { data, status } = await toast.promise(
  //         ERPApi.patch(`/settings/updatecoursepackages/${id}`, user),
  //         {
  //           pending: "Course Packages Updating...",
  //         }
  //       );

  //       if (status === 200) {
  //         DispatchCourseState({ type: "CREATE_COURSE_PACKAGE", payload: data });
  //         getAllCoursePackages();
  //         navigate("/settings/coursepackage");

  //         Swal.fire({
  //           title: "Created!",
  //           text: "Course Package Updated Successfully.",
  //           icon: "success",
  //         });
  //       }
  //     } catch (error) {
  //       const errorMessage =
  //         error?.response?.data?.message ||
  //         "Update Course Package Failed!. Please try again.";
  //       Swal.fire({
  //         title: "Error!",
  //         text: errorMessage,
  //         icon: "error",
  //       });
  //     } finally {
  //       setLoading((prev) => !prev);
  //     }
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.coursepackages_name || formData.coursepackages_name.trim().length < 3) {
      setError({ coursepackages_name: "Enter at least 3 characters" });
      return;
    }
    const user = {
      coursepackages_name: formData.coursepackages_name
        .split(" ")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      createdby: createdBy?.user?.fullname || createdBy?.fullname || "",
    };

    const formDataObj = new FormData();
    formDataObj.set("actionType", id ? "update" : "create");
    if (id) formDataObj.set("id", id);
    formDataObj.set("data", JSON.stringify(user));

    fetcher.submit(formDataObj, {
      method: "post",
    });
  };

  useEffect(() => {
    if (fetcher?.data?.status == 200 || fetcher?.data?.status == 201)
      navigate("/settings/coursepackage")
  }, [fetcher.data])
  return (
    <div>
      {id && id ? (
        <BackButton heading="Update Course Packages" content="Back" />
      ) : (
        <BackButton heading="Create Course Packages" content="Back" />
      )}
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-5">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label
                      for="firstNameinput"
                      className="form-label fs-s fw-medium text_color"
                    >
                      Course Package Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={
                        error && error.coursepackages_name
                          ? "form-control fs-s bg-form text_color input_bg_color error-input"
                          : "form-control fs-s bg-form text_color input_bg_color"
                      }
                      placeholder="Enter Package Name"
                      id="firstNameinput"
                      name="coursepackages_name"
                      value={formData.coursepackages_name}
                      onChange={handlechange}
                    />
                    <div style={{ height: "8px" }}>
                      {error && error.coursepackages_name && (
                        <p className="text-danger m-0 fs-xs">
                          {error.coursepackages_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className=" ">
                    <div className="d-flex justify-content-end">
                      <Button
                        className={"btn_primary"}
                        onClick={handleSubmit}
                        disabled={loading}
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
    </div>
  );
};
export default CreateCoursePackage;
