import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BackButton from "../../../components/backbutton/BackButton";
import Button from "../../../components/button/Button";
import { useFetcher, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useCoursePackage } from "../../../../dataLayer/hooks/useCoursePackage";
import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Select from "react-select";
import CurriculumListProvider from "../curriculum/CurriculumListProvider";
import Swal from "sweetalert2";

const CreateCourse = () => {
  const { DispatchCourse, getPaginatedCourses, getAllCourses } =
    useCourseContext();
  const { CurriculumState } = CurriculumListProvider();
  const { coursePackageState } = useCoursePackage();
  const { courseState } = useCourseContext();
  const { id } = useParams();

  const navigate = useNavigate();
  const {
    coursePackage = [],
    curriculum = [],
    courseByIdResponse = {}
  } = useLoaderData();
  const fetcher = useFetcher();


  const coursesCurriculumList = curriculum?.reversedCurriculums?.map(
    (item, index) => ({
      label: item.curriculumName,
      value: item.id,
    })
  );
  const [selectedCurriculums, setSelectedCurriculums] = useState([]);

  const handleCurriculumAdd = (value) => {
    setSelectedCurriculums(value);
    setError((prev) => ({
      ...prev,
      curriculum: "", // Reset error for the field being changed
    }));
  };

  const [formData, setFormData] = useState({
    course_name: "",
    course_package: "",
    course_package_id: null,
    fee: "",
    max_discount: "",
    createdBy: "",
  });


  const [loading, setLoading] = useState(false);

  const [createdBy, setCreatedBy] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return userData || "";
  });

  const [error, setError] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setFormData(courseByIdResponse);
        setSelectedCurriculums(
          courseByIdResponse?.curriculums.map((item) => ({
            label: item?.curriculumName,
            value: item?.id,
          }))
        );
        // try {
        //   const { data, status } = await ERPApi.get(`/batch/course/${id}`);
        //   if (status === 200) {
        //     setFormData(data);
        //     setSelectedCurriculums(
        //       data?.curriculums.map((item) => ({
        //         label: item?.curriculumName,
        //         value: item?.id,
        //       }))
        //     );
        //   }
        // } catch (error) {
        //   console.error(error);
        // }
      }
    };
    fetchData();
  }, [id]);


  const handleCousePackage = (e) => {
    setFormData((prev) => ({
      ...prev,
      course_package: e.target.options[e.target.selectedIndex].text,
      course_package_id: parseInt(e.target.value),
    }))
  }



  const handleChange = (e) => {
    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      [name]: "", // Reset error for the field being changed
    }));
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course_name) {
      setError((prev) => ({
        ...prev,
        course_name: "Course Name is Required",
      }));
      return;
    } else if (
      formData.course_name.trim() === "" ||
      formData.course_name.length < 3
    ) {
      setError((prev) => ({
        ...prev,
        course_name: "Course Name should be minimum 3 characters",
      }));
      return;
    } else if (!formData.course_package) {
      setError((prev) => ({
        ...prev,
        course_package: "Course Package is Required",
      }));
      return;
    } else if (!formData.fee) {
      setError((prev) => ({
        ...prev,
        fee: "Fee is Required",
      }));
      return;
    } else if (formData?.fee <= 0) {
      setError((prev) => ({
        ...prev,
        fee: "Fee must be Greater Than 0",
      }));
      return;
    } else if (!formData.max_discount) {
      setError((prev) => ({
        ...prev,
        max_discount: "Max Discount is Required",
      }));
      return;
    } else if (formData.max_discount <= 0) {
      setError((prev) => ({
        ...prev,
        max_discount: "Max Discount must be Greater than 0",
      }));
      return;
    } else if (selectedCurriculums?.length === 0) {
      setError((prev) => ({
        ...prev,
        curriculum: "Please Select the Curriculums",
      }));
      return;
    }

    if (parseFloat(formData.max_discount) > parseFloat(formData.fee)) {
      setError((prev) => ({
        ...prev,
        max_discount: "Max Discount Can't be Greater than Fee",
      }));
      return;
    }

    let user = {
      course_name: formData?.course_name,
      course_package: formData?.course_package,
      course_package_id: formData?.course_package_id,
      fee: formData?.fee,
      max_discount: formData.max_discount,
      createdby: createdBy?.user?.id,
      curriculumCollection: selectedCurriculums
        ? selectedCurriculums?.map((item) => item.value)
        : [],
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

    // setLoading((prev) => !prev);

    if (id) {
      const formdata = new FormData();
      formdata.set('id', id);
      formdata.set("type", "editCourse")
      formdata.set("payload", JSON.stringify(user));
      fetcher.submit(formdata, {
        method: "put",
        encType: "application/form-data"
      })
    } else {
      const formdata = new FormData();
      formdata.set("type", "createCourse")
      formdata.set("payload", JSON.stringify(user));
      fetcher.submit(formdata, {
        method: "post",
        encType: "application/form-data"
      })
    }
    // try {
    //   const apiUrl = id ? `/batch/course/${id}` : `/batch/course`;
    //   const titlecard = id ? "Updated!" : "Created!";
    //   const method = id ? "put" : "post";
    //   const successMessage = id
    //     ? "Course Updated Successfully"
    //     : "Course Created Successfully";

    //   const { data, status } = await toast.promise(
    //     ERPApi[method](apiUrl, user),
    //     {
    //       pending: id ? "Updating the Course..." : "Creating the Course...",
    //     }
    //   );
    //   if (status === (id ? 200 : 201)) {
    //     getPaginatedCourses();
    //     getAllCourses();
    //     navigate("/settings/courses");

    //     Swal.fire({
    //       title: titlecard,
    //       text: successMessage,
    //       icon: "success",
    //     });
    //   }
    // } catch (error) {
    //   const errorMessage1 = id
    //     ? "Course Updated Failed! Please Try Again!"
    //     : "Course Created Failed! Please Try Again!";
    //   const errorMessage = error?.response?.data?.message || errorMessage1;
    //   Swal.fire({
    //     title: "Error!",
    //     text: errorMessage,
    //     icon: "error",
    //   });
    // } 
    // finally {
    //   setLoading((prev) => !prev);
    // }
  };

  useEffect(() => {
    if (fetcher?.data?.status == 201 || fetcher?.data?.status == 200) {
      navigate("/settings/courses")
    }

  }, [fetcher])

  return (
    <div className="">
      {id && id ? (
        <BackButton heading="Update Course" content="Back" />
      ) : (
        <BackButton heading="Create Course" content="Back" />
      )}
      <div className="container-fluid">
        <div className="card border-0">
          <div className="card-body">
            <div className="live-prieview">
              <form>
                <div className="row d-flex">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        htmlFor="firstNameinput"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Course Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={
                          error && error.course_name
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color"
                        }
                        placeholder="Enter Course Name"
                        id="firstNameinput"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleChange}
                      />
                      <div style={{ height: "8px" }}>
                        {error && error.course_name && (
                          <p className="text-danger m-0 fs-xs">
                            {error.course_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-4 ">
                    <label className="form-label fs-s fw-medium text_color">
                      Course Package<span className="text-danger">*</span>
                    </label>
                    <select
                      className={
                        error && error.course_package
                          ? "form-control fs-s form-select text_color input_bg_color error-input"
                          : "form-control fs-s form-select text_color input_bg_color"
                      }
                      aria-label="Default select example"
                      placeholder="course_package*"
                      name="course_package"
                      id="course_package"
                      value={formData?.course_package_id || ""}
                      onChange={(e) => handleCousePackage(e)}
                      required
                    >
                      <option disabled className="fs-s" value="">
                        --Select--
                      </option>

                      {coursePackage &&
                        coursePackage?.coursePackageData?.map(
                          (item, index) => (
                            <option
                              key={item?.id}
                              value={item?.id}
                            >
                              {item?.coursepackages_name}
                            </option>
                          )
                        )}
                    </select>
                    <div style={{ height: "8px" }}>
                      {error && error.course_package && (
                        <p className="text-danger m-0 fs-xs">
                          {error.course_package}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="">
                      <label
                        for="lastNameinput"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Fee<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={
                          error && error.fee
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color"
                        }
                        placeholder="Enter Fee"
                        id="firstNameinput"
                        name="fee"
                        value={formData.fee}
                        onChange={handleChange}
                      />
                      <div style={{ height: "8px" }}>
                        {error && error.fee && (
                          <p className="text-danger m-0 fs-xs">{error.fee}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        for="lastNameinput"
                        className="form-label fs-s fw-medium text_color"
                      >
                        Max Discount<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={
                          error && error.max_discount
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color"
                        }
                        placeholder="Enter Max Discount"
                        id="firstNameinput"
                        name="max_discount"
                        value={formData.max_discount}
                        onChange={handleChange}
                      />
                      <div style={{ height: "8px" }}>
                        {error && error.max_discount && (
                          <p className="text-danger m-0 fs-xs">
                            {error.max_discount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className=" col-md-4 ">
                    <label className="form-label fs-s fw-medium black_300">
                      Curriculum<span className="text-danger">*</span>
                    </label>

                    <Select
                      className={` fs-s bg-form text_color input_bg_color ${error && error.curriculum
                        ? "error-input border border-red-500"
                        : ""
                        }`}
                      isMulti
                      options={coursesCurriculumList}
                      classNamePrefix="select"
                      value={selectedCurriculums}
                      onChange={(selectedOption) => {
                        handleCurriculumAdd(selectedOption);
                      }}
                    />
                    <div style={{ height: "8px" }}>
                      {error && error?.curriculum && (
                        <p className="text-danger m-0 fs-xs">
                          {error.curriculum}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="card border-0">
          <div className="card-body">
            <div className="d-flex justify-content-end">
              <Button
                className="btn btn-sm btn btn-sm btn-md btn_primary fs-13"
                onClick={handleSubmit}
                disabled={loading}
              >
                {/* Submit */}
                {id ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateCourse;
