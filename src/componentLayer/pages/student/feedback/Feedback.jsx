import React, { useEffect, useState, useRef, useCallback } from "react";
import "../../../../assets/css/Table.css";
import BackButton from "../../../components/backbutton/BackButton";
import { MdFilterList } from "react-icons/md";
import { toast } from "react-toastify";
import Pagination from "../../../../utils/Pagination";
import PaginationInfo from "../../../../utils/PaginationInfo";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";
import {
  useLoaderData,
  useSubmit,
  useNavigation,
  useFetcher,
} from "react-router-dom";
import { debounce } from "../../../../utils/Utils";
import CustomFilters from "../../../../utils/CustomFilters";
import { IoEye } from "react-icons/io5";

export const feedbackLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  const queryParams = url.search;


  console;
  try {
    const [usersData, BranchesData, coursesData] = await Promise.all([
      ERPApi.get(
        `/student/list-review${
          queryParams ? queryParams : `?page=1&pageSize=10&search=`
        }`
      ),
      ERPApi.get(`/settings/getbranch`),
      ERPApi.get(`/batch/course`),
    ]);

    const BranchsList = BranchesData?.data?.branchData?.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    }));

    const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
      label: item?.course_name,
      value: item.id,
    }));

    const Users = usersData?.data;
    return { Users, BranchsList, coursesList };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const Feedback = () => {
  const data = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const { Users = [], BranchsList = [], coursesList = [] } = data || {};
  const UsersList = Users.data;

  const initialFilterData = [
    { label: "From Date", type: "date", inputname: "startDate", value: "" },
    { label: "TO Date", type: "date", inputname: "endDate", value: "" },
    {
      label: "Branch",
      type: "select",
      inputname: "branchId",
      value: "",
      options: BranchsList,
    },
    {
      label: "Course",
      type: "select",
      inputname: "courseId",
      value: "",
      options: coursesList,
    },

    {
      label: "Rating",
      type: "select",
      inputname: "studentRating",
      value: "",
      options: [
        {
          label: "1",
          value: 1,
        },
        {
          label: "2",
          value: 2,
        },
        {
          label: "3",
          value: 3,
        },
        {
          label: "4",
          value: 4,
        },
        {
          label: "5",
          value: 5,
        },
      ],
    },
    
  ];

  const [filterData, setFilterData] = useState(initialFilterData);

  const [Qparams, setQParams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    branchId: "",
    courseId: "",
    endDate: "",

    startDate: "",
    studentRating: "",
  });
  const handleSearch = (event) => {
    setQParams({
      ...Qparams,
      search: event.target.value,
    });
  };
  const handlePageChange = (page) => {
    setQParams({
      ...Qparams,
      page,
    });
  };
  const handlePerPage = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setQParams({
      ...Qparams,
      page: 1,
      pageSize: selectedValue,
    });
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    debouncedParams(Qparams);
  }, [Qparams]);

  const debouncedParams = useCallback(
    debounce((param) => {
      const searchParams = new URLSearchParams({
        page: param.page,
        pageSize: param.pageSize,
        search: param.search,
        "filter[branchId]": param.branchId || "",
        "filter[courseId]": param.courseId || "",
        "filter[startDate]": param.startDate || "",
        "filter[endDate]": param.endDate || "",
        "filter[studentRating]": param.studentRating || "",
        
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );

  const showModel = (description) => {
    Swal.fire({
      html: `
          <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
            <div><p >${description}</p>
            
            
          </div>
        `,

      
    });
  }

  return (
    <div>
      <BackButton
        heading="Students Feedback"
        content="Back"
        to="/student/requestedcertificate"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for..."
                        name="search"
                        required
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex justify-content-end">
                      <div className="fs-13 me-3 mt-2"></div>

                      <button
                        className="btn btn_primary fs-13 me-2 "
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        {" "}
                        <MdFilterList className="me-1 mb-1" /> Filters
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="offcanvas offcanvas-end  "
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">
                      Filters
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body p-2">
                    <CustomFilters
                      filterData={filterData}
                      Qparams={Qparams}
                      setQParams={setQParams}
                      setFilterData={setFilterData}
                      BranchsList={BranchsList}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-container table-scroll table-responsive table-card  border-0">
                  <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                    <thead>
                      <tr className="">
                        <th
                          scope="col"
                          className="fs-13 lh-xs fw-600 black_300 "
                        >
                          S.No
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600  "
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600  "
                        >
                          Branch
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600  "
                        >
                          Course
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600  "
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600  "
                        >
                          Mobile
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600  "
                        >
                          Rating
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 "
                          title="Course Certificate Status"
                          style={{ maxWidth: "120px" }}
                        >
                          Feedback
                        </th>

                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 "
                          title="Internship Certificate Status"
                          style={{ maxWidth: "120px" }}
                        >
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {UsersList.length > 0 ? (
                        UsersList.map((item, index) => {
                          const userid = item?.id;
                          const user = item;

                          return (
                            <>
                              <tr key={index}>
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {(Users?.currentPage - 1) * Users?.pageSize +
                                    index +
                                    1}
                                </td>
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {item?.students?.name}
                                </td>
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {item?.students?.branch}
                                </td>
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {item?.students?.courses}
                                </td>

                                <td
                                  className="fs-13 black_300 lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "120px" }}
                                  title={item?.students?.email}
                                >
                                  {item?.students?.email}
                                </td>
                                <td className="fs-13 black_300 lh-xs bg_light">
                                  {item?.students?.mobilenumber}
                                </td>
                                <td
                                  className="fs-13 black_300 lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "120px" }}
                                >
                                  {item.studentRating}
                                </td>
                                <td
                                  className="fs-13 black_300 lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "120px" }}
                                  title={item.Description}
                                >
                                  {item.Description}
                                </td>

                                <td>
                                  <button
                                    onClick={() => showModel(item.Description)}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      padding: 0,
                                      cursor: "pointer",
                                      color: "#405189"
                                    }}
                                  >
                                    <IoEye />
                                  </button>
                                </td>
                              </tr>
                            </>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="12"
                            className="table-cell-heading text_color fs-14 text-center"
                          >
                            no reviews found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: Users?.data?.length,
                        start: Users.startreview,
                        end: Users.endreview,
                        total: Users.totalReviews,
                      }}
                      loading={navigation?.state === "loading"}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color pagination-select"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                        onChange={(e) => handlePerPage(e)}
                        value={Users?.pageSize}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>

                    <div className="ram">
                      <Pagination
                        currentPage={Users?.currentPage}
                        totalPages={Users?.totalPages}
                        loading={navigation?.state === "loading"}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Feedback;
