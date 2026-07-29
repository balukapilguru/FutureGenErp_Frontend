// import BackButton from "../../../components/backbutton/BackButton";
// import Filter from "../../../../utils/Filter";
// import { BiExport } from "react-icons/bi";
// import { MdFilterList } from "react-icons/md";
// import Button from "../../../components/button/Button";
// import { Link } from "react-router-dom";
// import { HiMiniPlus } from "react-icons/hi2";
// import { useLoaderData, useSubmit, useNavigation } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import { ERPApi } from "../../../../serviceLayer/interceptor";
// import PaginationInfo from "../../../../utils/PaginationInfo";
// import Pagination from "../../../../utils/Pagination";
// import { useState, useRef, useEffect, useCallback } from "react";
// import { debounce } from "../../../../utils/Utils";
// import CustomFilters from "../../../../utils/CustomFilters";

// export const StudentActivityLoader = async ({ request, params }) => {
//   const url = new URL(request.url);
//   const queryParams = url.search;
//   try {
//     const { data, status } = await ERPApi.get(
//       `/auth/student/studentactivity/${params?.id}${
//         queryParams ? queryParams : "?page=1&pageSize=10"
//       }`
//     );

//     if (status === 200) {
      
//       return { data };
//     }
//   } catch {
//     console.error("error");
//     return null;
//   }
// };

// const StudentActivity = () => {
//   const data = useLoaderData();
//     const navigation = useNavigation();
  
//   const submit = useSubmit();
//   const studentactivity = data?.data;


//   const initialFilterData = [
//     { label: "From Date", type: "date", inputname: "startDate", value: "" },
//     { label: "TO Date", type: "date", inputname: "endDate", value: "" },
//   ];

//   const [filterData, setFilterData] = useState(initialFilterData);

//   const [Qparams, setQParams] = useState({
//     page: 1,
//     pageSize: 10,
//     endDate: "",
//     startDate: "",
//   });

//   const handlePageChange = (page) => {
//     setQParams({
//       ...Qparams,
//       page,
//     });
//   };
//   const handlePerPage = (event) => {
//     const selectedValue = parseInt(event.target.value, 10);
//     setQParams({
//       ...Qparams,
//       page: 1,
//       pageSize: selectedValue,
//     });
//   };

//   const isFirstRender = useRef(true);

//   useEffect(() => {
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       return;
//     }
//     debouncedParams(Qparams);
//   }, [Qparams]);

//   const debouncedParams = useCallback(
//     debounce((param) => {
//       const searchParams = new URLSearchParams({
//         page: param.page,
//         pageSize: param.pageSize,
//         "startDate": param.startDate || "",
//         "endDate": param.endDate || "",
//       }).toString();

//       submit(`?${searchParams}`, { method: "get", action: "." });
//     }, 500),
//     []
//   );

//   return (
//     <div>
      
      
//         <div className="row response">
//           <div className="col-xl-12">
//             <div className="card border-0">
//               <div className="card-header">
//                 <div className=" row d-flex justify-content-between">
//                   <div className="col-sm-4"></div>
//                   <div className="col-sm-6 response-btn">
//                     <div className="buttons_alignment ">
//                       <button
//                         className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
//                         type="button"
//                         data-bs-toggle="offcanvas"
//                         data-bs-target="#offcanvasRight"
//                         aria-controls="offcanvasRight"
//                       >
//                         <MdFilterList className="me-1 mb-1" />
//                         Filters
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 <div
//                   className="offcanvas offcanvas-end  bg_white"
//                   id="offcanvasRight"
//                   aria-labelledby="offcanvasRightLabel"
//                 >
//                   <div className="offcanvas-header ">
//                     <h5
//                       className="offcanvas-title  text_color"
//                       id="offcanvasRightLabel"
//                     >
//                       Filters
//                     </h5>
//                     <button
//                       type="button"
//                       className="btn-close"
//                       data-bs-dismiss="offcanvas"
//                       aria-label="Close"
//                     ></button>
//                   </div>
//                   <div className="offcanvas-body p-2 bg_white">
//                     <CustomFilters
//                       filterData={filterData}
//                       Qparams={Qparams}
//                       setQParams={setQParams}
//                       setFilterData={setFilterData}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="card-body">
//                 <div className="table-responsive table-card table-container table-scroll border-0">
//                   <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
//                     <thead>
//                       <tr className="">
//                         <th scope="col" className="fs-13 lh-xs fw-600  ">
//                           S.No
//                         </th>
//                         <th scope="col" className="fs-13 lh-xs  fw-600  ">
//                           Event
//                         </th>
//                         <th
//                           scope="col"
//                           className="fs-13 lh-xs  fw-600  text-truncate"
//                           title="Registration Number"
//                           style={{ maxWidth: "120px" }}
//                         >
//                           Date & Time
//                         </th>
//                         <th scope="col" className="fs-13 lh-xs  fw-600  ">
//                           Location
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="">
//                       {studentactivity?.user &&
//                       studentactivity?.user.length > 0 ? (
//                         false ? (
//                           <tr>
//                             <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                               Loading...
//                             </td>
//                           </tr>
//                         ) : (
//                           studentactivity?.user?.map(
//                             (item, index) => {

//                               const date = new Date(item?.createdAt);
//                               const day = date.getUTCDate();
//                               const monthIndex = date.getUTCMonth();
//                               const year = date.getUTCFullYear();

//                               const monthAbbreviations = [
//                                 "Jan",
//                                 "Feb",
//                                 "Mar",
//                                 "Apr",
//                                 "May",
//                                 "Jun",
//                                 "Jul",
//                                 "Aug",
//                                 "Sep",
//                                 "Oct",
//                                 "Nov",
//                                 "Dec",
//                               ];
                              
//                               const Formatteddate = `${
//                                 day < 10 ? "0" : ""
//                               }${day}-${
//                                 monthAbbreviations[monthIndex]
//                               }-${year}`;
//                               let hours = date.getHours();
//                               let minutes = date.getMinutes();

//                               const period = hours >= 12 ? "PM" : "AM";

                              
//                               hours = hours % 12;
//                               hours = hours ? hours : 12; 

                              
//                               minutes = minutes < 10 ? "0" + minutes : minutes;

                              
//                               const time = `${hours}:${minutes} ${period}`;


//                               return (
//                                 <tr key={item.id}>
//                                   <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                                     {(studentactivity?.currentPage - 1) *
//                                       studentactivity.pageSize +
//                                       index +
//                                       1}
//                                   </td>
//                                   <td
//                                     className="fs-13 black_300  lh-xs bg_light text-truncate"
//                                     style={{ maxWidth: "150px" }}
//                                     title={item.name}
//                                   >
//                                     {item?.status}
//                                   </td>
//                                   <td className="fs-13 black_300  lh-xs bg_light">
//                                     {Formatteddate + " " + time}
//                                   </td>
//                                   <td className="fs-13 black_300  lh-xs bg_light">
//                                     {item?.city}
//                                   </td>
//                                 </tr>
//                               );
//                             }
//                           )
//                         )
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan="4"
//                             className="table-cell-heading text_color fs-14 text-center"
//                           >
//                             No Activity Found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start ">
//                   <div className="col-sm">
//                     <PaginationInfo
//                       data={{
//                         length:
//                           studentactivity?.user?.length,
//                         start: studentactivity?.startActivities,
//                         end: studentactivity?.endActivities,
//                         total: studentactivity?.totalActivities,
//                       }}
//                       loading={navigation?.state === "loading"}
//                     />
//                   </div>
//                   <div className="col-sm-auto mt-3 mt-sm-0  d-flex">
//                     <div className="mt-2">
//                       <select
//                         className="form-select form-control me-3 input_bg_color  pagination-select"
//                         aria-label="Default select example"
//                         placeholder="Branch*"
//                         name="branch"
//                         id="branch"
//                         required
//                         onChange={handlePerPage}
//                         value={studentactivity?.perPage}
//                       >
//                         <option value="10">10</option>
//                         <option value="25">25</option>
//                         <option value="50">50</option>
//                         <option value="75">75</option>
//                         <option value="100">100</option>
//                       </select>
//                     </div>
//                     <div className="">
//                       <Pagination
//                         currentPage={studentactivity?.currentPage}
//                         totalPages={studentactivity?.totalPages}
//                         loading={navigation?.state === "loading"}
//                         onPageChange={handlePageChange}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
      
      
//     </div>
//   );
// };

// export default StudentActivity;
