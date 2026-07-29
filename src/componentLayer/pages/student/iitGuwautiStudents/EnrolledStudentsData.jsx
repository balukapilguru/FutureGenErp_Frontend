

import PaginationInfo from '../../../../utils/PaginationInfo';
import Pagination from '../../../../utils/Pagination';
import FormattedDate from '../../../../utils/FormattedDate';
import BackButton from '../../../components/backbutton/BackButton';
import { useFetcher, useLoaderData, useLocation, useNavigate, useNavigation, useSubmit } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ERPApi } from '../../../../serviceLayer/interceptor';
import { debounce } from '../../../../utils/Utils';
import CustomTable from '../../../../utils/CustomTable';
import { BsLayoutThreeColumns } from 'react-icons/bs';


export const pgCertificationDataLoader = async ({ request }) => {
    const url = new URL(request.url); // Extract the URL
    const queryParams = url.search;

    const response = await ERPApi.get(`/student/post_graduation_certification_program${queryParams ? queryParams : `?page=1&pageSize=10&search=`}`);
    return {
        students: response?.data || [],
    };
};

const EnrolledStudentsData = () => {
    let submit = useSubmit();
    const loaderData = useLoaderData() || { students: [], };
    const { students, } = loaderData;
    const navigation = useNavigation()


    const [Qparams, setQParams] = useState({
        search: '',
        page: 1,
        pageSize: 10,
    });

    const handleSearch = (event) => {
        setQParams({
            ...Qparams,
            search: event.target.value,
        });
    };
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
                search: param.search,
            }).toString();

            submit(`?${searchParams}`, { method: "get", action: "." });

        }, 500),
        []
    );
    const columns = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) =>
                (Qparams.page - 1) * Qparams.pageSize + index + 1,
        },
        {
            id: "studentName",
            header: "Student Name",
            accessor: (row) => (
                <span className="text-truncate" style={{ maxWidth: "150px" }} title={row.name}>
                    {row.name}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "regNo",
            header: "Registration Number",
            accessor: (row) => row.registrationnumber || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "branch",
            header: "Branch",
            accessor: (row) => row.branch || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "course",
            header: "Course",
            accessor: (row) => (
                <span
                    className="text-truncate"
                    style={{ maxWidth: "120px" }}
                    title={row.course?.[0]?.course_name || row.courses}
                >
                    {row.course?.[0]?.course_name || row.courses}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "counsellor",
            header: "Counsellor",
            accessor: (row) => (
                <span className="text-truncate" style={{ maxWidth: "120px" }} title={row.enquirytakenby}>
                    {row.enquirytakenby}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "mobile",
            header: "Mobile",
            accessor: (row) => row.mobilenumber || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "email",
            header: "Email",
            accessor: (row) => (
                <span className="text-truncate" style={{ maxWidth: "150px" }} title={row.email}>
                    {row.email}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "joiningDate",
            header: "Joining Date",
            accessor: (row) => FormattedDate(row.admissiondate) || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "trainingMode",
            header: "Training Mode",
            accessor: (row) => row.modeoftraining || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "bookingAmount",
            header: "Booking Amount",
            accessor: (row) => row.finaltotal || "-",
            sortable: true,
            hideable: true,
        },
    ];


    const data = students?.students?.map((item) => ({
        ...item,
        rawItem: item, // keep original row if needed later
    })) || [];

    return (
        <div>
            <BackButton heading="PG Certification Students" content="Back" disable="true" />
            <div className="container-fluid">
                <div className="row response">
                    <div className="col-xl-12">
                        <div className="card border-0">
                            <div className="card-header">
                                <div className=" row d-flex justify-content-between">
                                    <div className="col-sm-4">
                                        <div className="search-box">
                                            <input
                                                type="text"
                                                className="form-control search input_bg_color text_color"
                                                placeholder="Search for..."
                                                name="search"
                                                required
                                                onChange={handleSearch}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6 response-btn">
                                        <div className="buttons_alignment ">
                                            <button
                                                className="btn btn-sm btn_primary fs-13 me-2  margin_top_12 button-res"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#columnOffcanvas"
                                                title="Column Filter"
                                            >
                                                <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
                                            </button>
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
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive table-card table-container table-scroll border-0">
                                    <CustomTable
                                        data={data}
                                        columns={columns}
                                        enableColumnToggle={true}
                                    />

                                </div>

                                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                                    <div className="col-sm">
                                        <PaginationInfo
                                            data={{
                                                length: students?.length,
                                                start: students?.startStudent,
                                                end: students?.endStudent,
                                                total: students?.searchResultStudents,
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
                                                currentPage={students?.currentPage}
                                                totalPages={students?.totalPages}
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
    )
}

export default EnrolledStudentsData





// < table className = "table table-centered align-middle  table-nowrap equal-cell-table table-hover" >
//                                     <thead>
//                                         <tr className="">
//                                             <th scope="col" className="fs-13 lh-xs fw-600  ">
//                                                 S.No
//                                             </th>
//                                             <th scope="col" className="fs-13 lh-xs  fw-600  ">
//                                                 Student&nbsp;Name
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs  fw-600  text-truncate"
//                                                 title="Registration Number"
//                                                 style={{ maxWidth: "120px" }}
//                                             >
//                                                 Registration&nbsp;Number
//                                             </th>
//                                             <th scope="col" className="fs-13 lh-xs  fw-600  ">
//                                                 Branch
//                                             </th>
//                                             <th scope="col" className="fs-13 lh-xs fw-600  ">
//                                                 Course
//                                             </th>
//                                             <th scope="col" className="fs-13 lh-xs fw-600 ">
//                                                 Counsellor
//                                             </th>
//                                             <th scope="col" className="fs-13 lh-xs  fw-600 ">
//                                                 Mobile
//                                             </th>
//                                             <th scope="col" className="fs-13 lh-xs  fw-600 ">
//                                                 Email
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs  fw-600 text-truncate"
//                                                 title=" Training Mode"
//                                                 style={{ maxWidth: "70px" }}
//                                             >
//                                                 Joining&nbsp;Date
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs  fw-600 text-truncate"
//                                                 title=" Training Mode"
//                                                 style={{ maxWidth: "70px" }}
//                                             >
//                                                 Training&nbsp;Mode
//                                             </th>

//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs  fw-600 text-truncate"
//                                                 title="Booking Amount"
//                                                 style={{ maxWidth: "70px" }}
//                                             >
//                                                 Booking&nbsp;Amount
//                                             </th>

//                                         </tr>
//                                     </thead>
//                                     <tbody className="">

//                                         {students?.students && students?.students.length > 0 ? (
//                                             students?.students.map((item, index) => (
//                                                 <tr key={item.id}>
//                                                     <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                                                         {(Qparams.page - 1) * Qparams.pageSize + index + 1}
//                                                     </td>
//                                                     <td
//                                                         className="fs-13 black_300  lh-xs bg_light text-truncate"
//                                                         style={{ maxWidth: "150px" }}
//                                                         title={item?.name}
//                                                     >
//                                                         {item?.name}
//                                                     </td>
//                                                     <td className="fs-13 black_300  lh-xs bg_light">
//                                                         {item?.registrationnumber}
//                                                     </td>
//                                                     <td className="fs-13 black_300  lh-xs bg_light">
//                                                         {item?.branch}
//                                                     </td>
//                                                     <td
//                                                         className="fs-13 black_300  lh-xs bg_light text-truncate"
//                                                         style={{ maxWidth: "120px" }}
//                                                         title={item.course[0]?.course_name
//                                                             ? item?.course[0]?.course_name
//                                                             : item?.courses}
//                                                     >
//                                                         {item.course[0]?.course_name
//                                                             ? item?.course[0]?.course_name
//                                                             : item?.courses}
//                                                     </td>
//                                                     <td
//                                                         className="fs-13 black_300  lh-xs bg_light text-truncate"
//                                                         style={{ maxWidth: "120px" }}
//                                                         title={item?.enquirytakenby}
//                                                     >
//                                                         {item?.enquirytakenby}
//                                                     </td>
//                                                     <td className="fs-13 black_300  lh-xs bg_light ">
//                                                         {item?.mobilenumber}
//                                                     </td>
//                                                     <td
//                                                         className="fs-13 black_300  lh-xs bg_light text-truncate"
//                                                         style={{ maxWidth: "150px" }}
//                                                         title={item?.email}
//                                                     >
//                                                         {item?.email}
//                                                     </td>
//                                                     <td
//                                                         className="fs-13 black_300 lh-xs bg_light text-truncate"
//                                                         title={item.date}
//                                                         style={{ maxWidth: "100px" }}
//                                                     >
//                                                         {FormattedDate(item?.admissiondate)}
//                                                     </td>
//                                                     <td className="fs-13 black_300 lh-xs bg_light">
//                                                         {item?.modeoftraining}
//                                                     </td>

//                                                     <td className="fs-13 black_300 lh-xs bg_light">
//                                                         {item?.finaltotal}
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td className="fs-13 black_300 fw-500 lh-xs bg_light " colSpan="10">
//                                                     No data available
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </ >