import React, { useCallback, useEffect, useRef, useState } from 'react'
import GateKeeper from '../../../../../rbac/GateKeeper';
import { MdFilterList } from 'react-icons/md';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { debounce } from '../../../../../utils/Utils';
import { Link, useFetcher, useLoaderData, useNavigation, useSearchParams, useSubmit } from 'react-router-dom';
import { AiFillEye } from 'react-icons/ai';
import PaginationInfo from '../../../../../utils/PaginationInfo';
import Pagination from '../../../../../utils/Pagination';
import CustomFilters from '../../../../../utils/CustomFilters';
import CustomTable from '../../../../../utils/CustomTable';
import Filter from '../../../../../utils/FilterWithSearchParams';
import { Offcanvas } from 'bootstrap';
import SearchInputField from '../../../../../utils/SearchInputField';
import { BsLayoutThreeColumns } from 'react-icons/bs';



export const NoDueRecordsListLoader = async ({ request, params }) => {
    const url = new URL(request.url); // Extract the URL
    const queryParams = url.search;
    try {
        const [
            NoDueRecordersData,
            BranchesData,
            coursesData,
            counsellorsData,
            leadSourceData,
        ] = await Promise.all([
            ERPApi.get(
                `/fee/noduefeerecords${queryParams ? queryParams : `?page=1&pageSize=10&search=`
                }`
            ),
            ERPApi.get(`/settings/getbranch`),
            ERPApi.get(`/batch/course`),
            ERPApi.get(`/user/userswithcounsellors`),
            ERPApi.get(`/settings/getleadsource`),
        ]);

        const BranchsList = BranchesData?.data?.branchData?.map((item) => ({
            label: item?.branch_name,
            value: item.id,
        })) || [];

        const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
            label: item?.course_name,
            value: item.id,
        })) || [];

        const counsellorsList = counsellorsData?.data?.userswithcounselor?.map(
            (item) => ({
                label: item?.fullname,
                value: item.id,
            })
        ) || [];

        const leadSourceList = leadSourceData?.data?.leadSourceData?.map((item) => ({
            label: item?.leadsource,
            value: item?.leadsource,
        }))

        const NoDueRecordsList = NoDueRecordersData.data || [];

        return {
            leadSourceList,
            coursesList,
            BranchsList,
            counsellorsList,
            NoDueRecordsList,

        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

const NoDueFeeRecordsList = () => {
    const data = useLoaderData();
    const submit = useSubmit();
    const fetcher = useFetcher();

    const { leadSourceList = [], coursesList = [], BranchsList = [], counsellorsList = [], NoDueRecordsList = [], } = data || {};



    const navigation = useNavigation();

    const initialState = [
        {
            label: "From Date",
            type: "date",
            inputname: "filter[admissionFromDate]",
            value: "",
        },
        { label: "TO Date", type: "date", inputname: "filter[admissionToDate]", value: "" },
        // {
        //     label: "Course",
        //     type: "select",
        //     inputname: "course",
        //     value: "",
        //     options: coursesList,
        // },
        {
            label: "Course",
            type: "search-select",
            inputname: "filter[course]",
            urlParam: "filter[course]",
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
        {
            label: "Counsellor",
            type: "select",
            inputname: "filter[enquiryTakenby]",
            value: "",
            options: counsellorsList,
        },
        {
            label: "Branch",
            type: "select",
            value: "",
            inputname: "filter[branch]",
            options: BranchsList,
        },
        {
            label: "Mode Of Training",
            type: "select",
            inputname: "filter[modeOfTraining]",
            value: "",
            options: [
                { label: "Online", value: "online" },
                // { label: "not Issued", value: " " },
                { label: "Offline", value: "offline" },
            ],
        },

        {
            label: "Lead Source",
            type: "select",
            inputname: "filter[leadsource]",
            value: "",
            options: leadSourceList,
        },

    ];

    const [filterData, setFilterData] = useState(initialState);

    const [Qparams, setQParams] = useState({
        search: "",
        page: 1,
        pageSize: 10,
        admissionFromDate: "",
        admissionToDate: "",
        branch: "",
        course: "",
        modeOfTraining: "",
        enquiryTakenby: "",
        leadsource: "",
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
                "filter[admissionFromDate]": param.admissionFromDate || "",
                "filter[admissionToDate]": param.admissionToDate || "",
                "filter[branch]": param.branch || "",
                "filter[course]": param.course || "",
                "filter[modeOfTraining]": param.modeOfTraining || "",
                "filter[enquiryTakenby]": param.enquiryTakenby || "",
                "filter[leadsource]": param.leadsource || "",
            }).toString();

            submit(`?${searchParams}`, { method: "get", action: "." });
        }, 500),
        []
    );

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
        const offcanvasElement = document.getElementById("offcanvasRightSide");
        const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
            offcanvasInstance.hide();
        }
    };

    const columns = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) =>
                (NoDueRecordsList?.currentPage - 1) * NoDueRecordsList?.pageSize + index + 1,
        },
        {
            id: "name",
            header: "Name",
            accessor: (row) => (
                <span className="text-truncate" style={{ maxWidth: "150px" }} title={row.name}>
                    {row.name}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "branch",
            header: "Branch",
            accessor: (row) => row.branches?.branch_name || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "counsellor",
            header: "Counsellor",
            accessor: (row) => row.enquirytakenby || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "contact",
            header: "Contact",
            accessor: (row) => row.mobilenumber || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "course",
            header: "Course",
            accessor: (row) => (
                <span className="text-truncate" style={{ maxWidth: "120px" }} title={row.courses}>
                    {row.courses}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "leadSource",
            header: "Lead Source",
            accessor: (row) => row.leadsource?.[0]?.source || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "doj",
            header: "Date of Joining",
            accessor: (row) => row.admissiondate || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "totalFee",
            header: "Total Fee",
            accessor: (row) => row.finaltotal?.toLocaleString("en-IN") || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "feePaid",
            header: "Fee Paid",
            accessor: (row) => row.totalpaidamount?.toLocaleString("en-IN") || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "dueDate",
            header: "Due Date",
            accessor: (row) => row.nextduedate || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "dueAmount",
            header: "Due Amount",
            accessor: (row) => row.dueamount?.toLocaleString("en-IN") || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "installments",
            header: "Installments",
            accessor: (row) =>
                row.totalinstallments?.[0]
                    ? `${row.totalinstallments[0].totalinstallmentspaid}/${row.totalinstallments[0].totalinstallments}`
                    : "-",
            sortable: true,
            hideable: true,
        },
    ];

    const NoDueRecordsListData = NoDueRecordsList?.students?.map((item) => ({
        ...item,
        rawItem: item,   // keep original data for actions
    })) || [];

    const actions = (row) => {
        const item = row;

        return (
            <GateKeeper
                requiredModule="Student Management"
                submenumodule="Fee Details"
                submenuReqiredPermission="canUpdate"
            >
                <Link to={`/student/feeUpdate?studentId=${item?.id}`}>
                    <AiFillEye className="eye_icon me-3" title="view" />
                </Link>
            </GateKeeper>
        );
    };



    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card border-0">
                        <div className="card-header">
                            <div className="row justify-content-between">
                                <div className="col-sm-4">
                                    <div className="search-box">
                                        <SearchInputField />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="buttons_alignment">
                                        <div className="fs-13 mt-2 text_color">
                                            <button
                                                className="btn btn-sm btn_primary fs-13 me-2  margin_top_12 button-res"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#columnOffcanvas"
                                                title="Column Filter"
                                            >
                                                <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
                                            </button>
                                        </div>

                                        <button
                                            className="btn btn-sm btn_primary fs-13 me-2"
                                            type="button"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasRightSide"
                                            aria-controls="offcanvasRightSide"
                                        >
                                            <MdFilterList className="me-1 mb-1" />
                                            Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="offcanvas offcanvas-end  bg_white text_color"
                                id="offcanvasRightSide"
                                aria-labelledby="offcanvasRightLabel"
                            >
                                <div className="offcanvas-header">
                                    <h5
                                        className="offcanvas-title"
                                        id="offcanvasRightLabel"
                                    >
                                        Filters
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close "
                                        data-bs-dismiss="offcanvas"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="offcanvas-body p-2">
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
                            <div className="table-responsive table-container table-scroll table-card  border-0">
                                <CustomTable
                                    data={NoDueRecordsListData}
                                    columns={columns}
                                    actions={actions}
                                    enableColumnToggle={true}
                                />

                            </div>
                            <div className=" mt-4 align-items-center d-flex justify-content-between row text-center text-sm-start">
                                <div className="col-sm">

                                    <PaginationInfo
                                        data={{
                                            length: NoDueRecordsList?.students?.length,
                                            start: NoDueRecordsList?.startStudent,
                                            end: NoDueRecordsList?.endStudent,
                                            total: NoDueRecordsList?.searchResultStudents,
                                        }}
                                        loading={navigation?.state === "loading"}
                                    />

                                </div>
                                <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                                    <div className="mt-2">
                                        <select
                                            className="form-select form-control me-3 text_color input_bg_color pagination-select"
                                            aria-label="Default select example"
                                            placeholder="Branch*"
                                            name="branch"
                                            id="branch"
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
                                            currentPage={NoDueRecordsList?.currentPage}
                                            totalPages={NoDueRecordsList?.totalPages}
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
    )
}

export default NoDueFeeRecordsList;



{/* <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
    <thead className="">
        <tr className="">
            <th scope="col" className="fs-13 lh-xs fw-600  ">
                S.No
            </th>
            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                Name
            </th>
            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                Branch
            </th>
            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                Counsellor
            </th>
            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                Contact
            </th>
            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                Course
            </th>
            <th scope="col" className="fs-13 lh-xs fw-600  ">
                Lead Source
            </th>
            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                Date&nbsp;of&nbsp;Joining
            </th>
            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                Total&nbsp;Fee
            </th>
            <th scope="col" className="fs-13 lh-xs fw-600 ">
                Fee&nbsp;Paid
            </th>
            <th scope="col" className="fs-13 lh-xs  fw-600 ">
                Due&nbsp;Date
            </th>
            <th scope="col" className="fs-13 lh-xs  fw-600 ">
                Due&nbsp;Amount
            </th>

            <th scope="col" className="fs-13 lh-xs  fw-600 ">
                Installments
            </th>
            <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
                <th scope="col" className="fs-13 lh-xs fw-600 ">
                    Action
                </th>
            </GateKeeper>
        </tr>
    </thead>
    <tbody className="">


        {
            NoDueRecordsList?.students && NoDueRecordsList?.students?.length > 0 ?

                NoDueRecordsList?.students?.map((item, index) => {

                    return (
                        <tr key={index + 1}>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                {(NoDueRecordsList?.currentPage - 1) *
                                    NoDueRecordsList?.pageSize +
                                    index +
                                    1}

                            </td>
                            <td
                                className="fs-13 black_300  lh-xs bg_light text-truncate"
                                style={{ maxWidth: "150px" }}
                                title={item?.name}
                            >
                                {item?.name}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.branches?.branch_name}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.enquirytakenby}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.mobilenumber}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light  text-truncate" style={{ maxWidth: "120px" }} title={item.courses} >
                                {item?.courses}
                            </td>

                            <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }}
                                title={item?.leadsource[0]?.source}
                            >
                                {item?.leadsource[0]?.source}
                            </td>

                            <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.admissiondate}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.finaltotal?.toLocaleString("en-IN")}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.totalpaidamount?.toLocaleString("en-IN")}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.nextduedate}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.dueamount?.toLocaleString("en-IN")}
                            </td>

                            <td className="fs-13 black_300  lh-xs bg_light ">
                                {
                                    item?.totalinstallments[0]
                                        ?.totalinstallmentspaid
                                }{" "}
                                /{" "}
                                {
                                    item?.totalinstallments[0]
                                        ?.totalinstallments
                                }
                            </td>


                            <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
                                <td className="fs-14 text_mute bg_light   lh-xs">
                                    <Link
                                        to={`/student/feeUpdate?studentId=${item?.id}`}



                                    // to={`/student/feeview/${item?.id}`}
                                    >
                                        <AiFillEye className=" eye_icon me-3" data-bs-toggle="tooltip" data-bs-placement="top" title="view" />
                                    </Link>
                                </td>
                            </GateKeeper>
                        </tr>
                    );
                })

                :
                (<tr>
                    <td className="fs-13 black_300  lh-xs bg_light ">
                        No Data
                    </td>
                </tr>)
        }


    </tbody>
</table> */}