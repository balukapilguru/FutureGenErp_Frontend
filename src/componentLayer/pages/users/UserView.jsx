import { useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import "../../../assets/css/UserView.css";
import BackButton from "../../components/backbutton/BackButton";
import { ERPApi } from "../../../serviceLayer/interceptor";
import Defaultimg from "../../../assets/images/student_idCard_images/Defaultimg.jpg";
import { MdFilterList } from "react-icons/md";
import PaginationInfo from "../../../../src/utils/PaginationInfo";
import Pagination from "../../../utils/Pagination";
import { debounce } from "../../../utils/Utils";
import CustomFilters from "../../../utils/CustomFilters";
// export const userViewLoader = async ({ params }) => {
//   try {
//     const { data, status } = await ERPApi.get(`/user/viewuser/${params?.id}`);
//     if (status === 200) {
//       const userData = data?.user;
//       return { userData }
//     }
//   }
//   catch (error) {
//     console.error(error);
//   }
// }

export const userViewLoader = async ({ request, params }) => {
  const url = new URL(request.url); // Extract the URL
  const queryParams = url.search;
  try {
    const [userResponse, newApiResponse] = await Promise.all([
      ERPApi.get(`/user/viewuser/${params?.id}`),
      //ERPApi.get(`/auth/users/${params?.id}`),
      ERPApi.get(
        `/auth/users/${params?.id}${
          queryParams ? queryParams : `?page=1&pageSize=10`
        }`
      ),
      // ERPApi.get(`auth/users/100?endDate=2025-01-27&startDate=2025-01-24&pageSize=15`) 
    ]);


    //const { data: newApiData, status: newApiStatus } = newApiResponse;
    if (newApiResponse?.status === 200 || userResponse.status === 200) {
      const paginationList = newApiResponse?.data
      const userActivity = newApiResponse?.data?.user;
      const userDatat = userResponse?.data?.user;
      const data = {
        userActivity: userActivity,
        userDatat: userDatat,
        paginationList: paginationList,
      };
      return { data };
    }
    if (userResponse.status === 200) {
      const userDatat = userResponse?.data?.user;

      return { userDatat };
    }

    // Returning only the user data as per your original logic
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const UserView = () => {
  let submit = useSubmit();
  const navigation = useNavigation();
  const data = useLoaderData();

  const activity = data?.data?.paginationList;

  const singleUser = data?.data?.userDatat;
  
  const paginationList = data?.data?.paginationList;


  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });
  const userId = userData?.user?.id;
  const initialFilterData = [
    { label: "From Date", type: "date", inputname: "startDate", value: "" },
    { label: "TO Date", type: "date", inputname: "endDate", value: "" },
    
  ];
  const [filterData, setFilterData] = useState(initialFilterData);
  const [Qparams, setQParams] = useState({
    page: 1,
    pageSize: 10,
    startDate: "",
    endDate : "",
  });

  const handlePage = (page) => {
    setQParams({
      ...Qparams,
      page,
    });
  };
  const handlePerPageChange = (event) => {
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
        "startDate": param.startDate || "",
        "endDate": param.endDate || "",
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );


  return (
    
    <div>
      <BackButton
        heading={`${
          userId === Number(singleUser?.id) ? `User Profile` : "User View"
        }`}
        content="Back"
        to="/"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 mt-2 profile_view text-center">
            <div className="card h-auto">
              <div className="rounded-top">
                <div className="btn_primary text-center rounded-top">
                  <h6 className="py-2 mb-0">Welcome to Teks Academy</h6>
                </div>
                <div className="my-2">

                  {singleUser?.userProfileImage ? <img
                    src={
                      singleUser?.userProfileImage
                        
                    }
                    alt="user-img"
                    className="profile-img rounded-circle thumbnail"
                  /> : <img
                  src={
                    
                       Defaultimg
                  }
                  alt="user-img"
                  className="profile-img rounded-circle thumbnail" />}
                  
                </div>
                <div className="ps-1">
                  <h3 className="black_300 mb-0">{singleUser?.fullname}</h3>
                  {/* <p className="black_300 mb-1 fs-s ms-1">
                    {singleUser.designation}
                  </p>
                  */}
                  <p className="text-mute fs-lg fw-500 mb-1">
                    {singleUser?.profile}
                  </p>
                  <p className="text-mute fs-lg fw-500 mb-3">
                    {singleUser?.branch}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 mt-2 profile_view">
            <div className="card h-100">
              <div className="card-body">
                <ul className="nav mb-3 nav-tabs" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="card card_animate nav-link active"
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      OverView
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="card card_animate nav-link ms-3"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                    >
                      Remarks
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="card card_animate nav-link ms-3"
                      id="pills-Activities-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-Activities"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                    >
                      Activities
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    tabIndex="0"
                  >
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="lh-400">
                          <p className="ps-0 black_300 fw-600 mt-0 mb-0">
                            About
                          </p>
                          <p className="text-mute mt-0 fs-13">
                            Hi I&apos;m {singleUser?.fullname},{" "}
                            {singleUser?.aboutuser}
                          </p>
                        </div>
                        <p className="ps-0 black_300 fw-600 mt-0 mb-1">
                          Profile
                        </p>
                        <div className="profile_bg table-scroll">
                          <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                            <tbody className="fs-13">
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Full Name
                                </td>
                                <td
                                  className="text-mute text-truncate"
                                  style={{ maxWidth: "200px" }}
                                  title={singleUser?.fullname}
                                >
                                  <span className="ms-5">: </span>
                                  {singleUser?.fullname}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Email
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.email}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Phone No
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.phonenumber}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Designation
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.designation}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Department
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.department}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Report To
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.reportto}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Profile
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.profile}
                                </td>
                              </tr>
                              <tr className="lh-400">
                                <td
                                  className="ps-0 black_300 fw-500"
                                  scope="row"
                                >
                                  Branch
                                </td>
                                <td className="text-mute">
                                  <span className="ms-5">: </span>
                                  {singleUser?.branch}
                                </td>
                              </tr>
                              {/* <tr className="lh-400">
                            <td className="ps-0 black_300 fw-500" scope="row">
                              Course
                            </td>
                            <td className="text-mute">
                              <span className="ms-5">: </span>
                            Python , Testing
                            </td>
                          </tr> */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade "
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                    tabIndex="0"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <table className="table table-nowrap">
                          <thead className="">
                            <tr className="">
                              <th className="text_color fs-14">Date</th>
                              <th className=" text_color fs-14">Status</th>
                              <th scope="col" className=" text_color fs-14">
                                Review
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {singleUser?.user_remarks_history &&
                              singleUser?.user_remarks_history.map(
                                (userstatus, index) => {
                                  const date = new Date(userstatus?.date);
                                  const day = date.getUTCDate();
                                  const monthIndex = date.getUTCMonth();
                                  const year = date.getUTCFullYear();

                                  const monthAbbreviations = [
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec",
                                  ];
                                  // Formatting the date
                                  const Formatteddate = `${
                                    day < 10 ? "0" : ""
                                  }${day}-${
                                    monthAbbreviations[monthIndex]
                                  }-${year}`;
                                  return (
                                    <tr key={index}>
                                      <td className="table-cell-heading text_color fs-14">
                                        {Formatteddate}
                                      </td>

                                      {userstatus?.Activate_remarks && (
                                        <td className="table-cell-heading text_color fs-14">
                                          Active
                                        </td>
                                      )}
                                      {userstatus?.Inactivate_remarks && (
                                        <td className="table-cell-heading text_color fs-14">
                                          Inactive
                                        </td>
                                      )}
                                      {userstatus?.Activate_remarks && (
                                        <td className="table-cell-heading text_color fs-14">
                                          {userstatus?.Activate_remarks}
                                        </td>
                                      )}
                                      {userstatus?.Inactivate_remarks && (
                                        <td className="table-cell-heading text_color fs-14">
                                          {userstatus?.Inactivate_remarks}
                                        </td>
                                      )}
                                    </tr>
                                  );
                                }
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade "
                    id="pills-Activities"
                    role="tabpanel"
                    aria-labelledby="pills-Activities-tab"
                    tabIndex="0"
                  >
                    <div className="text-end">
                    <button
                      className="btn btn-sm btn_primary fs-13 me-1 margin_top_12 button-res  mb-2"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      <MdFilterList className="me-1 mb-1" />
                      Filters
                    </button>
                    </div>
                
                    <div
                      className="offcanvas offcanvas-end  bg_white"
                      id="offcanvasRight"
                      aria-labelledby="offcanvasRightLabel"
                    >
                      <div className="offcanvas-header">
                        <h5
                          className="offcanvas-title text_color"
                          id="offcanvasRightLabel"
                        >
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
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12">
                        <table className="table table-nowrap">
                          <thead className="">
                            <tr className="">
                              <th className="text_color fs-14">SN</th>
                              {/* <th className=" text_color fs-14">Name</th> */}
                              <th scope="col" className=" text_color fs-14">
                                Event
                              </th>
                              <th scope="col" className=" text_color fs-14">
                                Date & Time
                              </th>
                              <th scope="col" className=" text_color fs-14">
                              Device Type
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {activity?.activities.length === 0 ? (
                              <tr>
                                <td
                                  colSpan="4"
                                  className="table-cell-heading text_color fs-14 text-center"
                                >
                                  No Activity Found
                                </td>
                              </tr>
                            ) : (
                              activity?.activities.map((userstatus, index) => {
                                const date = new Date(userstatus?.updatedAt);
                                // Get hours and minutes from the date
                                let hours = date.getHours();
                                let minutes = date.getMinutes();

                                // Determine AM or PM
                                const ampm = hours >= 12 ? "PM" : "AM";

                                // Convert to 12-hour format
                                hours = hours % 12 || 12; // the hour '0' should be '12'

                                // Format minutes to always be two digits
                                minutes =
                                  minutes < 10 ? "0" + minutes : minutes;

                                // Combine hours, minutes, and AM/PM
                                const timeIn12HourFormat = `${hours}:${minutes} ${ampm}`;
                                const day = date.getUTCDate();
                                const monthIndex = date.getUTCMonth();
                                const year = date.getUTCFullYear();

                                const monthAbbreviations = [
                                  "Jan",
                                  "Feb",
                                  "Mar",
                                  "Apr",
                                  "May",
                                  "Jun",
                                  "Jul",
                                  "Aug",
                                  "Sep",
                                  "Oct",
                                  "Nov",
                                  "Dec",
                                ];

                                // Formatting the date
                                const formattedDate = `${
                                  day < 10 ? "0" : ""
                                }${day}-${
                                  monthAbbreviations[monthIndex]
                                }-${year}`;

                                return (
                                  <tr key={index}>
                                    <td className="table-cell-heading text_color fs-14">
                                      {index + 1}
                                    </td>
                                    <td className="table-cell-heading text_color fs-14">
                                      {userstatus.status}
                                    </td>
                                    <td className="table-cell-heading text_color fs-14">
                                      {`${formattedDate}, ${timeIn12HourFormat}`}
                                    </td>
                                    <td className="table-cell-heading text_color fs-14">
                                      {userstatus.deviceType}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                      <div className="col-sm">
                        <PaginationInfo
                          data={{
                            length: paginationList?.totalActivities,
                            start: paginationList?.startActivities,
                            end: paginationList?.endActivities,
                            total: paginationList?.totalActivities,
                          }}
                          loading={navigation?.state === "loading"}
                        />
                      </div>
                      <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                        <div className="mt-2">
                          <select
                            className="form-select form-control me-3 input_bg_color pagination-select "
                            aria-label="Default select example"
                            required
                            onChange={(e) => handlePerPageChange(e)}
                            value={Qparams?.pageSize}
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="75">75</option>
                            <option value="100">100</option>
                          </select>
                        </div>

                        <div className="">
                          <Pagination
                            currentPage={paginationList?.currentPage}
                            totalPages={paginationList?.totalPages}
                            loading={navigation?.state === "loading"}
                            onPageChange={handlePage}
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
      </div>
    </div>
  );
};
export default UserView;
