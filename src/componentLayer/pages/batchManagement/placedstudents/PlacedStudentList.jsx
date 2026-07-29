import {
  Link,
  useLoaderData,
  useNavigation,
  useSubmit,
  useFetcher,
  redirect,
  useSearchParams,
} from "react-router-dom";
import { HiMiniPlus } from "react-icons/hi2";
import Button from "../../../components/button/Button.jsx";
import BackButton from "../../../components/backbutton/BackButton.jsx";
import { toast } from "react-toastify";
import { MdFilterList } from "react-icons/md";
import GateKeeper from "../../../../rbac/GateKeeper.jsx";
import Pagination from "../../../../utils/Pagination.jsx";
import PaginationInfo from "../../../../utils/PaginationInfo.jsx";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../../../../utils/Utils.jsx";
import CustomFilters from "../../../../utils/CustomFilters.jsx";
import { BsLayoutThreeColumns, BsPersonCheckFill } from "react-icons/bs";
import "../../../../../src/assets/css/Table.css";
import { Offcanvas } from "bootstrap";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Filter from "../../../../utils/FilterWithSearchParams.jsx";
import CustomTable from "../../../../utils/CustomTable.jsx";

export const PlacedStudentListAction = async ({ request, params }) => {
  try {
    // Parse the body to get the JSON
    const formData = await request.json();
    const id = formData.id; // Now you have the id
    const response = await toast.promise(
      ERPApi.delete(`/studentplace/deleteplacement/${id}`),
      {
        pending: "Deleting student placement...",
      }
    );

    if (response.status === 200) {

      Swal.fire({
        title: "Deleted successfully!",
        text: `A Placed Student Deleted Successfully`,
        icon: "success",
      });

      return redirect("/batchmanagement/placedstudents");
    } else {
      return { error: "Error in Deleting Student" }, { status: 500 };
    }
  } catch (error) {
    console.error("Error in action:", error);
    return {
      status: 500,
      body: { error: "Failed to delete student" },
    };
  }
};

export const PlacedStudentListLoader = async ({ request, params }) => {
  const url = new URL(request.url); // Extract the URL
  const queryParams = url.search;

  try {
    const [trainerStudents, BranchesData, coursesData, dummyData] =
      await Promise.all([
        ERPApi.get(
          `/studentplace/list_place${queryParams ? queryParams : `?page=1&pageSize=10&search=`
          }`
        ),
        ERPApi.get(`/settings/getbranch`),
        ERPApi.get(`/batch/course`, {
          params: {
            search: url.searchParams.get('course_label') || ''
          }
        }),
        ERPApi.get(`/studentplace/trainerslist`),
      ]);


    const BranchsList = BranchesData?.data?.branchData?.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    }));

    const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
      label: item?.course_name,
      value: item?.id,
    }));

    return {
      coursesList,
      BranchsList,
      trainerStudents,
      dummyData,
    };
  } catch {
    console.error("error");
    return null;
  }
};

const PlacedStudentList = () => {
  const data = useLoaderData();
  const coursesList = data?.coursesList;
  const BranchsList = data?.BranchsList;
  const trainerStudents = data?.trainerStudents;
  const dummyData = data?.dummyData?.data?.data;
  const fetcher = useFetcher();
  const studentList = trainerStudents?.data;

  const submit = useSubmit();
  const navigation = useNavigation();

  const trainer = localStorage.getItem("data");
  const profile = JSON.parse(trainer).user.profile;

  const initialFilterData = [
    {
      label: "From Date",
      type: "date",
      inputname: "filters[FromDate]",
      value: "",
    },
    {
      label: "TO Date",
      type: "date",
      inputname: "filters[ToDate]",
      value: "",
    },
    // {
    //   label: "Course",
    //   type: "select",
    //   inputname: "course",
    //   value: "",
    //   options: coursesList,
    // },
    {
      label: "Course",
      type: "search-select",
      inputname: "filters[courses]",
      urlParam: "filters[courses]",
      urlSearchParam: "course_label",
      options: coursesList ?? [],
      fetchOptions: async (search) => {
        const coursesData = await ERPApi.get(`/batch/course`, {
          params: { search: search ? search : searchParams.get('course_label') ?? "" }
        });
        const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
          label: item?.course_name,
          value: item?.id,
        }));

        // Map different keys here
        return coursesList || [];
      }
    },
  ];

  if (profile === "Admin") {
    initialFilterData.push(
      {
        label: "Branch",
        type: "select",
        inputname: "filters[branchId]",
        value: "",
        options: BranchsList,
      },
      {
        label: "Trainer",
        type: "select",
        inputname: "filters[trainer]",
        value: "",
        options: dummyData,
      }
    );
  }

  const [filterData, setFilterData] = useState(initialFilterData);
  const [searchParams, setSearchParams] = useSearchParams();
  const HandleFilters = (index, name, value) => {
    setFilterData(prevState => {
      let showToast = false;

      let updated = prevState.map((item, idx) =>
        idx === index ? { ...item, value } : item
      );

      // When From Date changes
      if (name === "fromDate") {
        updated = updated.map(item => {
          if (item.inputname === "toDate") {
            if (item.value && item.value < value) {
              showToast = true;
              return {
                ...item,
                min: value,
                value: "", // reset invalid To Date
              };
            }

            return {
              ...item,
              min: value, // always update min
            };
          }
          return item;
        });
      }

      // Fire toast AFTER state calculation
      if (showToast) {
        toast.warning("To Date cannot be earlier than From Date");
      }

      return updated;
    });
  };



  const FilterReset = () => {
    const resetFilterData = filterData?.map((item) => ({
      ...item,
      value: "",
    }));
    setFilterData(resetFilterData);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    initialFilterStructure.forEach(filter => {
      newSearchParams.delete(filter.urlParam || filter.inputname || filter?.urlSearchParam);
    });
    newSearchParams.delete("filter[course_label]");

    setSearchParams(newSearchParams);
  };

  const filterSubmit = () => {
    const offcanvasElement = document.getElementById("offcanvasRight");
    const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  };


  const [Qparams, setQParams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    branch: "",
    course: "",
    FromDate: "",
    trainer: "",
    ToDate: "",
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
        "filters[branchId]": param.branch || "",
        "filters[courses]": param.course || "",
        "filters[Fromdate]": param.FromDate || "",
        "filters[Todate]": param.ToDate || "",
        "filters[userID]": param.trainer || "",
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );

  const deleteStudent = (data) => {
    const deleteId = {
      id: data,
    };

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Placed Student",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        fetcher.submit(deleteId, {
          method: "DELETE",
          encType: "application/json",
        });
      }
    });
  };


  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (studentList?.currentPage - 1) *
        studentList?.pageSize +
        index +
        1,
    },

    {
      id: "name",
      header: "Name",
      accessor: (row) => row?.student?.name || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "registrationNo",
      header: "Registration No",
      accessor: (row) => row?.student?.registrationnumber || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "email",
      header: "Email",
      accessor: (row) => row?.student?.email || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "phone",
      header: "Phone No",
      accessor: (row) => row?.student?.mobilenumber || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "branch",
      header: "Branch",
      accessor: (row) => row?.student?.branch || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "course",
      header: "Course",
      accessor: (row) => row?.student?.courses || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "placedAt",
      header: "Placed At",
      accessor: (row) => row?.placementAt || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "designation",
      header: "Designation",
      accessor: (row) => row?.designation || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "ctc",
      header: "CTC",
      accessor: (row) => row?.CTC || "-",
      sortable: true,
      hideable: true,
    },
  ];

  const actions = (row) => {
    const item = row;
    if (!item) return null;

    return (
      <GateKeeper
        requiredModule="Batch Management"
        requiredPermission="all"
        submenumodule="Placed Students"
        submenuReqiredPermission="canDelete"
      >
        <button
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "rgb(220 53 73)",
          }}
          onClick={() => deleteStudent(item?.studentID)}
          title="Delete"
        >
          <MdDelete />
        </button>
      </GateKeeper>
    );
  };


  return (
    <div>
      <BackButton heading="Placed Students" content="Back" to="/" />
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
                        className="form-control search input_bg_color select"
                        placeholder="Search for..."
                        name="search"
                        required
                        onChange={(e) => handleSearch(e)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="buttons_alignment">
                      <div className="fs-13 me-2 mt-2 text_color">
                        <button
                          className="btn btn-sm btn_primary fs-13  margin_top_12 button-res"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#columnOffcanvas"
                          title="Column Filter"
                        >
                          <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
                        </button>
                      </div>
                      <button
                        className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <MdFilterList className="me-1 mb-1" />
                        Filters
                      </button>

                      <GateKeeper
                        requiredModule="Batch Management"
                        requiredPermission="all"
                        submenumodule="Placed Students"
                        submenuReqiredPermission="canCreate"
                      >
                        <Button
                          type="button"
                          className="btn btn-sm btn-md btn_primary fs-13"
                        >
                          <Link to="addplacedstudents" className="button_color">
                            <HiMiniPlus className="text_white " /> Add Recruited
                            Student
                          </Link>
                        </Button>
                      </GateKeeper>
                    </div>
                  </div>
                </div>

                <div
                  className="offcanvas offcanvas-end  bg_white"
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header ">
                    <h5
                      className="offcanvas-title  text_color"
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
                  <div className="offcanvas-body p-2 bg_white">
                    <Filter
                      filterData={filterData}
                      HandleFilters={HandleFilters}
                      filterReset={FilterReset}
                      filterSubmit={filterSubmit}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive table-card table-container table-scroll border-0">
                  <CustomTable
                    data={studentList?.data || []}
                    columns={columns}
                    actions={actions}
                    enableColumnToggle={true}
                  />

                </div>
                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: studentList?.data?.length,
                        start: studentList?.startplacement,
                        end: studentList?.endplacement,
                        total: studentList?.searchResultUsers,
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
                        onChange={(e) => handlePerPage(e)}
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
                        currentPage={trainerStudents?.data?.currentPage}
                        totalPages={trainerStudents?.data?.totalPages}
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

export default PlacedStudentList;





// {/* <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
//   <thead>
//     <tr className="">
//       <th scope="col" className="fs-13 lh-xs fw-600 ">
//         S.No
//       </th>
//       <th scope="col" className="fs-13 lh-xs  fw-600  ">
//         Name
//       </th>
//       <th scope="col" className="fs-13 lh-xs  fw-600  ">
//         Registration No
//       </th>
//       <th scope="col" className="fs-13 lh-xs  fw-600  ">
//         Email
//       </th>
//       <th scope="col" className="fs-13 lh-xs fw-600  ">
//         Phone No
//       </th>
//       <th scope="col" className="fs-13 lh-xs  fw-600 ">
//         Branch
//       </th>
//       <th scope="col" className="fs-13 lh-xs  fw-600 ">
//         Course
//       </th>
//       <th scope="col" className="fs-13 lh-xs  fw-600">
//         Placed At
//       </th>
//       <th scope="col" className="fs-13 lh-xs  fw-600 ">
//         Designation
//       </th>
//       <th scope="col" className="fs-13 lh-xs  fw-600 ">
//         CTC
//       </th>

//       <GateKeeper
//         requiredModule="Batch Management"
//         requiredPermission="all"
//         submenumodule="Placed Students"
//         submenuReqiredPermission="canDelete"
//       >


//         <th scope="col" className="fs-13 lh-xs  fw-600 ">
//           Action&apos;s
//         </th>
//       </GateKeeper>

//       {/* {permission?.permissions?.map((item) => {
//                         if (item.module === "User Mangement") {
//                           return item?.submenus?.map((submenu) => {
//                             if (
//                               submenu?.module === "User Details" &&
//                               (submenu?.canUpdate === true ||
//                                 submenu?.canRead === true ||
//                                 submenu?.canDelete === true)
//                             ) {
//                               return (
//                                 <th
//                                   key={1}
//                                   scope="col"
//                                   className="fs-13 lh_xs 0 fw-600"
//                                 >
//                                   Actions
//                                 </th>
//                               );
//                             }
//                             return null;
//                           });
//                         }
//                         return null;
//                       })} */}
//     </tr>
//   </thead>
//   <tbody className="">
//     {studentList?.data?.length > 0 ? (
//       studentList?.data?.map((item, index) => {
//         const userid = item?.id;
//         const user = item;

//         return (
//           <>
//             <tr key={index}>
//               <td className="fs-13 black_300 fw-500 lh-xs bg_light">
//                 {(studentList.currentPage - 1) *
//                   studentList.pageSize +
//                   index +
//                   1}
//               </td>
//               <td
//                 className="fs-13 black_300 lh-xs bg_light text-truncate"
//                 style={{ maxWidth: "120px" }}
//                 title={item.student.name}
//               >
//                 {item?.student?.name}
//               </td>
//               <td
//                 className="fs-13 black_300 lh-xs bg_light text-truncate"
//                 style={{ maxWidth: "120px" }}
//                 title={item.student.registrationnumber}
//               >
//                 {item?.student?.registrationnumber}
//               </td>

//               <td
//                 className="fs-13 black_300 lh-xs bg_light text-truncate"
//                 style={{ maxWidth: "120px" }}
//                 title={item?.student?.email}
//               >
//                 {item?.student?.email}
//               </td>
//               <td className="fs-13 black_300 lh-xs bg_light">
//                 {item?.student?.mobilenumber}
//               </td>
//               <td
//                 className="fs-13 black_300 lh-xs bg_light text-truncate"
//                 style={{ maxWidth: "120px" }}
//                 title={item?.student?.branch}
//               >
//                 {item?.student?.branch}
//               </td>
//               <td className="fs-13 black_300 lh-xs bg_light">
//                 {item?.student?.courses}
//               </td>
//               <td
//                 className="fs-13 black_300 lh-xs bg_light text-truncate"
//                 style={{ maxWidth: "120px" }}
//               >
//                 {item?.placementAt}
//               </td>
//               <td
//                 className="fs-13 black_300 lh-xs bg_light text-truncate"
//                 style={{ maxWidth: "120px" }}
//                 title={item.profile}
//               >
//                 {item?.designation}
//               </td>
//               <td className="fs-13 black_300 lh-xs bg_light">
//                 {item?.CTC}
//               </td>
//               <GateKeeper
//                 requiredModule="Batch Management"
//                 requiredPermission="all"
//                 submenumodule="Placed Students"
//                 submenuReqiredPermission="canDelete"
//               >
//                 <td className="fs-13 black_300 lh-xs bg_light">
//                   <button
//                     style={{
//                       background: "none",
//                       border: "none",
//                       padding: "0",
//                       cursor: "pointer",
//                       color: "rgb(220 53 73)",
//                     }}
//                     onClick={() =>
//                       deleteStudent(item?.studentID)
//                     }
//                   >
//                     <MdDelete />
//                   </button>
//                 </td>
//               </GateKeeper>
//             </tr>
//           </>
//         );
//       })
//     ) : (
//       <tr>
//         <td
//           colSpan="12"
//           className="table-cell-heading text_color fs-14 text-center"
//         >
//           No Students Found
//         </td>
//       </tr>
//     )}
//   </tbody>
// </table> */}