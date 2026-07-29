import React, { useEffect, useState } from 'react';
import { useNavigation, useLoaderData, useSearchParams, Link, useFetcher } from 'react-router-dom';


import BackButton from '../../../../components/backbutton/BackButton';
import CustomTable from '../../../../../../src/utils/CustomTable';
import Pagination from '../../../../../../src/utils/Pagination';
import SearchInputField from '../../../../../../src/utils/SearchInputField';
import Filters from '../../../../../../src/utils/FilterWithSearchParams';
import { VoucherGrid } from './VoucherCards';
import { FaCheck, FaExclamationCircle, FaListAlt, FaRegCheckCircle, FaRegListAlt, FaTag, FaUserAlt, FaUserSlash } from 'react-icons/fa';
import Filter from '../../../../../../src/utils/FilterWithSearchParams';
import { MdFilterList } from 'react-icons/md';
import PaginationInfo from '../../../../../utils/PaginationInfo';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { Offcanvas } from 'bootstrap';
import { BsLayoutThreeColumns } from 'react-icons/bs';
import { SearchSelect } from '../../../../../utils/SearchSelect';
import { HiMiniPlus } from 'react-icons/hi2';
import { BiLink } from 'react-icons/bi';
import { FaLinkSlash } from 'react-icons/fa6';

const StatusBadge = ({ status }) => {
    const badgeClasses = {
        active: "badge bg-success text-white",
        enrolled: "badge bg-success text-white",
        expired: "badge bg-warning text-white",
        pending: "badge bg-warning text-white",
        inactive: "badge bg-secondary text-white",
    };

    return (
           <span
  className={`${badgeClasses[status] || badgeClasses.Used} px-2 py-0.5 rounded-2`}
>
  {status
    ? `${status.charAt(0).toUpperCase()}${status.slice(1).toLowerCase()}`
    : "N/A"}
</span>
 
    );
};


const StatCard = ({ title, value, icon: Icon, colorClass, iconBg, isActive, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`card p-4 rounded-2xl shadow-sm mb-4 cursor-pointer ${isActive ? 'border-primary bg-light' : 'border-light'} transition-all`}
        >
            <div className="d-flex justify-content-between">
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-primary text-white' : iconBg} ${colorClass}`}>
                    <Icon size={16} />
                </div>
                {isActive && (
                    <div className="bg-primary text-white p-1 rounded-circle">
                        <FaCheck size={12} />
                    </div>
                )}
            </div>
            <div className="mt-3">
                <p className={`text-muted mb-0 small text-uppercase`}>{title}</p>
                <h3 className={`text-dark ${isActive ? 'text-primary' : ''}`}>{value}</h3>
            </div>
        </div>
    );
};

export default function VouchersDashboard() {
    const navigation = useNavigation();
    const fetcher = useFetcher();
    const [searchParams, setSearchParams] = useSearchParams();
    const { voucherdata = {}, entityList = {}, registrationFormData = [] } = useLoaderData();
    const data = JSON.parse(localStorage.getItem('data'));
    const [activeTab, setActiveTab] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTableView, setIsTableView] = useState(false);
    const [branchList, setBranchList] = useState([]);
    const currentTab = searchParams.get("filter")
    const [vocherData, setVoucherData] = useState({
        razorpayLink: "",
        registrationFormId: "",
    })
    const [showVocherPopup, setShowVocherPopup] = useState()
    const [vocherLoading, setVocherLoading] = useState()
    const [errorMessage, setErrorMessage] = useState({
        registrationFormId: "",
        razorpayLink: "",
    })


    const validateVoucherData = () => {
        let errors = {};

        if (!vocherData?.voucherClaimType) {
            errors.voucherClaimType = "Please select voucher type";
        }

        if (vocherData?.voucherClaimType === "pay_register") {
            if (!selectedFormId) {
                errors.registrationFormId = "Registration Form is required";
            }
            if (!vocherData?.razorpayLink) {
                errors.razorpayLink = "Razorpay Link is required";
            }
            if (!vocherData?.baseUrl) {
                errors.baseUrl = "Base URL is required";
            }
        }

        if (vocherData?.voucherClaimType === "exam_register") {
            if (!selectedFormId) {
                errors.registrationFormId = "Registration Form is required";
            }
        }

        if (vocherData?.voucherClaimType === "website_register") {
            if (!vocherData?.baseUrl) {
                errors.baseUrl = "Base URL is required";
            }
        }

        setErrorMessage(errors);

        return Object.keys(errors).length === 0;
    };


    const handelSubmitVocher = () => {

        const isValid = validateVoucherData();

        if (!isValid) return;

        const formdata = new FormData();

        formdata.set("registrationFormId", selectedFormId || "");
        formdata.set("razorpayLink", vocherData?.razorpayLink || "");
        formdata.set("voucherCodeId", vocherData?.item?.id);
        formdata.set("voucherClaimType", vocherData?.voucherClaimType);
        formdata.set("baseUrl", vocherData?.baseUrl || "");

        fetcher.submit(formdata, {
            method: "patch",
            encType: "application/form-data"
        });
    };


    useEffect(() => {
        if (fetcher?.data?.status == 200) {
            setShowVocherPopup(false);
            setVocherLoading(false);
            setVoucherData({
                razorpayLink: "",
                registrationFormId: "",
                item: null
            })
            setSelectedFormId(null)
        }
    }, [fetcher])


    const initialFilterData = [
        // {
        //     label: "Entity",
        //     type: "select",
        //     inputname: "entity_id",
        //     value: "",
        //     options: entityList,
        // },
        {
            label: "Entity",
            type: "search-select",
            inputname: "entity_id",
            urlParam: "entity_id",
            urlSearchParam: "entity_label",
            options: entityList ?? [],
            fetchOptions: async (search) => {
                const entityResponse = await ERPApi.get(`entity/getallentities`, {
                    params: { search: search ? search : searchParams.get('entity_id_label') ?? "" }
                });
                const entities = entityResponse?.data?.data?.map((item) => (
                    { label: item.name, value: item.id }
                ))

                // Map different keys here
                return entities || [];
            }
        },
    ];
    const initialLeadsFilterData = [
        // {
        //     label: "Entity",
        //     type: "select",
        //     inputname: "entity_id",
        //     value: "",
        //     options: entityList,
        // },
        {
            label: "Entity",
            type: "search-select",
            inputname: "entity_id",
            urlParam: "entity_id",
            urlSearchParam: "entity_label",
            options: entityList ?? [],
            fetchOptions: async (search) => {
                const entityResponse = await ERPApi.get(`entity/getallentities`, {
                    params: { search: search ? search : searchParams.get('entity_id_label') ?? "" }
                });
                const entities = entityResponse?.data?.data?.map((item) => (
                    { label: item.name, value: item.id }
                ))

                // Map different keys here
                return entities || [];
            }
        },
        // {
        //     label: "Branch",
        //     type: "select",
        //     inputname: "branch_id",
        //     value: "",
        //     options: branchList,
        // },
        {
            label: "From Date",
            type: "date",
            inputname: "fromDate",
            value: searchParams.get("FromDate") ?? "",
        },
        {
            label: "To Date",
            type: "date",
            inputname: "toDate",
            value: searchParams.get("ToDate") ?? "",
        },
        {
            label: "Status",
            type: "select",
            inputname: "status",
            value: "",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Enrolled", value: "enrolled" }
            ],
        },
    ];


    const voucherColumns = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) => (
                <span className="">
                    {(voucherdata?.pagination?.currentPage - 1) * voucherdata?.pagination?.pageSize + index + 1}
                </span>
            ),
        },
        {
            id: "voucherCode",
            header: "Voucher Code",
            accessor: "voucherCode",
            sortable: true,
            hideable: true,
        },
        {
            id: "entity",
            header: "Entity",
            accessor: (row) => (
                <span title={row?.entity?.name ?? "N/A"}>{row?.entity?.name ?? "N/A"}</span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "valueType",
            header: "Value Type",
            accessor: (row) => (
                <span title={row?.valueType ?? "N/A"}>{row?.valueType?.slice(0, 1).toUpperCase() + row?.valueType?.slice(1)?.toLowerCase()}</span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "configuration",
            header: "Value",
            accessor: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800" title={row.valueType === "amount" ? `₹${Number(row.amount ?? 0).toLocaleString("en-IN")}` : `${row.percentage}%`}>
                        {row.valueType === "amount"
                            ? `₹${Number(row.amount ?? 0).toLocaleString("en-IN")}`
                            : `${row.percentage}%`}
                    </span>
                </div>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "validity",
            header: "Validity",
            accessor: (row) => (
                <div className="flex flex-col text-sm" title={`${row.validity_start_date} to ${row.validity_end_date}`}>
                    <span>{row.validity_start_date}</span>
                    <span className="text-slate-400 text-xs">
                        {" "} to {row.validity_end_date}
                    </span>
                </div>
            ),
            sortable: false,
            hideable: true,
        },
        {
            id: "createdAt",
            header: "Created Date",
            accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
            sortable: true,
            hideable: true,
        },
        {
            id: "status",
            header: "Status",
            accessor: (row) => {
                const today = new Date();
                const endDate = new Date(row.validity_end_date);

                const status =
                    endDate < today ? "expired" : "active";

                return <StatusBadge status={status} />;
            },
            sortable: false,
            hideable: true,
        },
    ];
    const studentColumns = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) => (
                <span className="">
                    {(voucherdata?.pagination?.currentPage - 1) * voucherdata?.pagination?.pageSize + index + 1}
                </span>
            ),
        },
        {
            id: "studentName",
            header: "Student Name",
            accessor: "studentName",
            sortable: true,
            hideable: true,
        },
        {
            id: "email",
            header: "Email",
            accessor: (row) => (
                <div className="text-sm text-slate-700">{row.email}</div>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "phone_number",
            header: "Phone Number",
            accessor: (row) => (
                <div className="text-sm text-slate-700">{row.phone_number}</div>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "entity_id",
            header: "Entity",
            accessor: (row) => (
                <div className="text-sm text-slate-700">{row.voucher?.entity?.name}</div>
            ),
            sortable: true,
            hideable: true,
        },
        // {
        //     id: "branch_id",
        //     header: "Branch ID",
        //     accessor: (row) => (
        //         <div className="text-sm text-slate-700">{row.branch_id}</div>
        //     ),
        // },
        {
            id: "voucherId",
            header: "Voucher",
            accessor: (row) => (
                <div className="text-sm text-slate-700">
                    {row.voucher?.voucherCode || "N/A"}
                </div>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "createdAt",
            header: "Lead Date",
            accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            id: "status",
            header: "Status",
            accessor: (row) => {
                // Example: active if voucherId exists, else inactive
                const status = row.status;
                return <StatusBadge status={status} />;
            },
            sortable: true,
            hideable: true,
        },
    ];


    const handlePerPage = (e) => {
        const selectedvalue = parseInt(e.target.value, 10);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("pageSize", selectedvalue.toString());
        newSearchParams.set("page", 1);
        setSearchParams(newSearchParams);
    };

    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("page", page.toString());
        setSearchParams(newSearchParams);

        debouncesetPage({ context: "ENROLLED_STUDENTS", data: page });
    };

    const tabs = [
        { id: "all", label: "Total Vouchers", count: voucherdata?.filters?.totalVouchers || 0, icon: FaTag },
        { id: "active", label: "Active Vouchers", count: voucherdata?.filters?.activeVouchers || 0, icon: FaRegCheckCircle },
        { id: "expired", label: "Expired Vouchers", count: voucherdata?.filters?.expiredVouchers || 0, icon: FaExclamationCircle },
        { id: "voucherLeads", label: "Vouchers Leads", count: voucherdata?.filters?.voucherLeads, icon: FaUserAlt },
    ];

    const tabChange = (tabId) => {
        const currentTab = searchParams.get("filter");

        // Only update if the current tab is different from the desired tabId
        if (tabId !== currentTab) {
            if (tabId !== "all") {
                setActiveTab(tabId);
                setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.delete("search")
                    params.delete("entity_id")
                    params.set("filter", tabId); // Update filter parameter
                    return params;
                });
            } else {
                // If 'all', remove the filter parameter
                setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.delete("filter");
                    params.delete("search")
                    params.delete("entity_id")
                    return params;
                });
                setActiveTab(tabId);
            }
        }
    };



    const getCurrentTime = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) return "Morning";
        else if (currentHour < 18) return "Afternoon";
        else return "Evening";
    };



    const [filterData, setFilterData] = useState(initialFilterData);
    const [leadsFilterData, setLeadsFilterData] = useState(initialLeadsFilterData);

    const HandleFilters = (index, name, value) => {
        setFilterData((prev) =>
            prev.map((item, idx) =>
                idx == index
                    ? {
                        ...item,
                        [name]: value,  // same pattern as handleFilters
                    }
                    : item
            )
        );
    };



    const FilterReset = () => {

        const resetFilterData = filterData?.map(item => ({
            ...item,
            value: "",
        }));
        setFilterData(resetFilterData);

        setSearchParams(prevParams => {
            const newSearchParams = new URLSearchParams(prevParams);

            initialFilterData.forEach(filter => {
                newSearchParams.delete(filter.urlParam || filter.inputname);
            });
            initialLeadsFilterData.forEach(filter => {
                newSearchParams.delete(filter.urlParam || filter.inputname);
            });
            newSearchParams.delete("entity_id_label");

            newSearchParams.set("page", "1");

            return newSearchParams;
        });
    };


    const filterSubmit = () => {
        const offcanvasElement = document.getElementById("offcanvasRight");
        const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
            offcanvasInstance.hide();
        }
    };
    // when ever the entity change this will update the Branches
    useEffect(() => { setLeadsFilterData(initialLeadsFilterData) }, [branchList])

    // Branch Fetching Function
    const fetchAndStoreBranches = async (url) => {
        try {
            // Fetching data from the API
            const response = await ERPApi.get(`branch/getbranchbyentityid/${filterData?.[0]?.["entity_id"]}`);

            // Check if response contains valid data
            if (response?.data?.data) {
                // Mapping the response data into desired format
                const entities = response?.data?.data?.map(item => ({
                    label: item.branch_name, // Assuming 'name' is the branch's name
                    value: item.id    // Assuming 'id' is the branch's ID
                }));
                // if (entities?.length > 0) {
                setBranchList(entities)
                // }

                // Return the mapped entities
                return entities;
            } else {
                throw new Error('No data available');
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            return []; // Return an empty array in case of error
        }
    };

    // when ever the entity change this will store the Branches in state and above UseEffect will update the initial state 
    // useEffect(() => {
    //     if (filterData?.[0]?.["entity_id"]) {
    //         fetchAndStoreBranches()
    //     }
    // }, [filterData?.[0]?.["entity_id"]]);


    useEffect(() => {
        if (currentTab) {
            setActiveTab(currentTab)
        }
    }, [currentTab])


    const [copiedRowId, setCopiedRowId] = useState(null);



    const copyToClipboardReferalLink = (link, rowId) => {
        if (!link) return;

        navigator.clipboard.writeText(link).then(() => {
            setCopiedRowId(rowId);

            // Reset check icon after 2 seconds
            setTimeout(() => setCopiedRowId(null), 2000);
        });
    };

    // const actions = (row) => {
    //     const form = row;
    //     if (!form) return null;

    //     return (
    //         <div className="d-flex align-items-center gap-2">
    //             {/* Copy Form Link */}
    //             {(form?.voucherClaimType || currentTab === "expired") ? <HiMiniPlus style={{ cursor: "not-allowed" }} className="text-success cursor-not-allowed" title="Exam Already Activated" /> :
    //                 <HiMiniPlus
    //                     onClick={() => {
    //                         setShowVocherPopup(true);
    //                         setVoucherData(prev => ({
    //                             ...prev,
    //                             item: form
    //                         }))
    //                     }}
    //                     className="text-primary cursor-pointer"
    //                 />
    //             }
    //             {
    //                 row?.razorpayLink ?
    //                     (<span>
    //                         {copiedRowId === row.id ? (
    //                             <FaCheck size={16} strokeWidth={0.5} className="text-green-600 text-sm text-success" />
    //                         ) : (
    //                             <BiLink
    //                                 className="w-4 h-4 cursor-pointer text-blue-600"
    //                                 onClick={() =>
    //                                     copyToClipboardReferalLink(row?.razorpayLink, row.id)
    //                                 }
    //                                 size={16}
    //                             />
    //                         )}

    //                     </span>) : (
    //                         <span className="text-sm text-slate-400 text-danger cursor_pointer_not_allowed italic" title='link not available'><FaLinkSlash className='cursor-not-allowed' /></span>
    //                     )
    //             }
    //         </div>
    //     );
    // };

    // Store options in state

    const getCopyLink = (form) => {
        if (!form) return "";

        switch (form.voucherClaimType) {
            case "pay_register":
                return form.baseUrl && form.voucherCode && form.razorpayLink
                    ? `${form.baseUrl.replace(/\/$/, "")}?razorpayUrl=${form.razorpayLink}`
                    : "";

            case "exam_register":
                return `https://teksacademy.com/registrationForm/${form?.registrationform?.link}` || "";

            case "website_register":
                return form.baseUrl
                    ? `${form.baseUrl.replace(/\/$/, "")}?voucherCode=${form.voucherCode}&entity_id=${form?.entity_id}${form?.crmSourceId ? `&crmSourceId=${form?.crmSourceId}`:""}`
                    : "";
            case "website_register_exam":
                return form.baseUrl
                    ? `${form.baseUrl.replace(/\/$/, "")}?registrationForm=https://teksacademy.com/registrationForm/${form?.registrationform?.link}`
                    : "";

            default:
                return `https://business.teksacademy.com/student-voucher-form/${form?.entity_id}${form?.crmSourceId ? `?crmSourceId=${form?.crmSourceId}`:""}` || "";
        }
    };



    const actions = (row) => {
        const form = row;
        if (!form) return null;

        // Plus button logic
        const hasValidVoucherType =
            form?.voucherClaimType &&
            ["pay_register", "exam_register", "website_register", "website_register_exam"]
                .includes(form.voucherClaimType);

        const isDisabled = hasValidVoucherType || currentTab === "expired";

        // Copy link logic
        const copyLink = getCopyLink(form);

        return (
            <div className="d-flex align-items-center gap-2">

                {/* Add Voucher */}
                {isDisabled ? (
                    <HiMiniPlus
                        style={{ cursor: "not-allowed" }}
                        className="text-success cursor-not-allowed"
                        title={
                            currentTab === "expired"
                                ? "Form Expired"
                                : "Voucher Already Activated"
                        }
                    />
                ) : (
                    <HiMiniPlus
                        onClick={() => {
                            setShowVocherPopup(true);
                            setVoucherData(prev => ({
                                ...prev,
                                item: form
                            }));
                        }}
                        className="text-primary cursor-pointer"
                    />
                )}

                {/* Copy Link Section */}
                {copyLink ? (
                    <span>
                        {copiedRowId === row.id ? (
                            <FaCheck size={16} className="text-success" />
                        ) : (
                            <BiLink
                                className="cursor-pointer text-primary"
                                onClick={() =>
                                    copyToClipboardReferalLink(copyLink, row.id)
                                }
                                size={16}
                            />
                        )}
                    </span>
                ) : (
                    <span
                        className="text-danger cursor_pointer_not_allowed"
                        title="Link not available"
                    >
                        <FaLinkSlash className="cursor-not-allowed" />
                    </span>
                )}
            </div>
        );
    };



    const [formOptions, setFormOptions] = useState([]);
    const [isExamForVoucher, setIsExamForVoucher] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState(null);

    const mapFormsToOptions = (forms = []) =>
        forms.map(item => ({
            label: item.registrationformname,
            value: item.id
        }));

    useEffect(() => {
        setFormOptions(mapFormsToOptions(registrationFormData));
    }, [registrationFormData]);

    const fetchRegistrationForms = async (search) => {
        const res = await ERPApi.get("/registrationform/all", {
            params: { search }
        });

        const mapped = mapFormsToOptions(res?.data?.forms || []);

        // 🔥 store searched data in state
        setFormOptions(mapped);

        return mapped;
    };


    return (
        <div>
            <BackButton heading="Vouchers" content="Back" />
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <div className="row justify-content-between">
                            {/* <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Good {getCurrentTime()}, {data?.user?.name}</h4>
                            </div> */}
                            <div className="card-body">
                                <ul className="row nav mb-3 nav-tabs nav-justified mb-3 nav-fill" id="pills-tab" role="tablist">
                                    {tabs.map((tab) => (
                                        <li
                                            className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
                                            role="presentation"
                                            key={tab.id}
                                        >
                                            <button
                                                className={`card nav-link card_animate ${activeTab === tab.id ? 'active' : ''}`}
                                                data-bs-toggle="pill"
                                                data-bs-target={`#pills-${tab.id}`}
                                                type="button"
                                                role="tab"
                                                aria-controls={`pills-${tab.id}`}
                                                aria-selected={activeTab === tab.id}
                                                onClick={() => tabChange(tab.id)}
                                            >
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <p className="text-start text-uppercase fw-medium text-mute text-truncate fs-12">{tab.label}</p>
                                                    </div>
                                                    <div className="flex-shrink-0 text-end">
                                                        <h5 className={`text-${tab.colorClass} fs-12 mb-0`}></h5>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
                                                    <div className="text-start">
                                                        <h4 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                                                            <span className="counter-value" data-target={tab.count}>
                                                                {tab.count}
                                                            </span>
                                                        </h4>
                                                        <Link to="" className="fs-xs fw-500 mb-0">
                                                            View {tab.label}
                                                        </Link>
                                                    </div>
                                                    <div className="avatar-md p-4 flex-shrink-0">
                                                        <span className={`avatar-title rounded fs-3`}>
                                                            <tab.icon className={`${tab.colorClass} fs-20`} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-sm-4">
                                <div className="search-box">
                                    <SearchInputField />
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
                                    <div className="fs-13 me-3 ">
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
                                                {currentTab === "voucherLeads" ? (
                                                    <Filter
                                                        filterData={leadsFilterData}
                                                        HandleFilters={HandleFilters}
                                                        filterReset={FilterReset}
                                                        filterSubmit={filterSubmit}
                                                    />
                                                ) : (
                                                    <Filter
                                                        filterData={filterData}
                                                        HandleFilters={HandleFilters}
                                                        filterReset={FilterReset}
                                                        filterSubmit={filterSubmit}
                                                    />
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive table-card  border-0">
                            <div className="table-container table-scroll">
                                {searchParams.get("filter") !== "voucherLeads" ? (
                                    <CustomTable data={voucherdata?.data} columns={voucherColumns} actions={actions} loading={navigation.state} enableColumnToggle={true} />
                                ) : (
                                    <CustomTable data={voucherdata?.data} columns={studentColumns} loading={navigation.state} enableColumnToggle={true} />

                                )}
                            </div>
                        </div>
                        {/* pagination start */}

                        <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                            <div className="col-sm">
                                <PaginationInfo
                                    data={{
                                        length: voucherdata?.data?.length,
                                        start: voucherdata?.pagination?.start,
                                        end: voucherdata?.pagination?.end,
                                        total: voucherdata?.pagination?.totalResults,
                                    }}
                                // loading={false}
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
                                        onChange={handlePerPage}
                                        value={voucherdata?.pagination?.pageSize}
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
                                        currentPage={voucherdata?.pagination?.currentPage}
                                        totalPages={voucherdata?.pagination?.totalPages}
                                        // loading={voucherdata?.loading}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {showVocherPopup && (
                            <div
                                className="modal fade show d-block"
                                style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                                tabIndex="-1"
                            >
                                <div className="modal-dialog modal-dialog-centered modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">
                                                Add Registration for {vocherData?.item?.voucherCode}
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => {
                                                    setShowVocherPopup(false);
                                                    setVoucherData((prev) => ({
                                                        ...prev,
                                                        voucherClaimType: "",
                                                        registrationFormId: "",
                                                        razorpayLink: "",
                                                        baseUrl: "",
                                                    }));
                                                }}
                                            ></button>
                                        </div>

                                        <div className="modal-body">

                                            {/* Voucher Type Radio Buttons */}
                                            <div className="mb-4">
                                                <label className="form-label fw-semibold">
                                                    Voucher Type <span className="text-danger">*</span>
                                                </label>

                                                <div className="form-check">
                                                    <input
                                                        id="pay_register"
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="voucherClaimType"
                                                        value="pay_register"
                                                        checked={vocherData?.voucherClaimType === "pay_register"}
                                                        onChange={(e) => {
                                                            setVoucherData((prev) => ({
                                                                ...prev,
                                                                voucherClaimType: e.target.value,
                                                                registrationFormId: "",
                                                                razorpayLink: "",
                                                                baseUrl: "",
                                                            }));
                                                            setErrorMessage((prev) => ({
                                                                ...prev,
                                                                voucherClaimType: "",
                                                            }));
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label cursor-pointer"
                                                        htmlFor="pay_register"
                                                    >
                                                        Pay, Register & Get Voucher
                                                    </label>
                                                </div>


                                                <div className="form-check">
                                                    <input
                                                        id="exam_register"
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="voucherClaimType"
                                                        value="exam_register"
                                                        checked={vocherData?.voucherClaimType === "exam_register"}
                                                        onChange={(e) => {
                                                            setVoucherData((prev) => ({
                                                                ...prev,
                                                                voucherClaimType: e.target.value,
                                                                registrationFormId: "",
                                                                razorpayLink: "",
                                                                baseUrl: "",
                                                            }));
                                                            setErrorMessage((prev) => ({
                                                                ...prev,
                                                                voucherClaimType: "",
                                                            }));
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label cursor-pointer"
                                                        htmlFor="exam_register"
                                                    >
                                                        Register, write Exam & Get Voucher
                                                    </label>
                                                </div>


                                                <div className="form-check">
                                                    <input
                                                        id="website_register"
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="voucherClaimType"
                                                        value="website_register"
                                                        checked={vocherData?.voucherClaimType === "website_register"}
                                                        onChange={(e) => {
                                                            setSelectedFormId("");
                                                            setVoucherData((prev) => ({
                                                                ...prev,
                                                                voucherClaimType: e.target.value,
                                                                registrationFormId: "",
                                                                razorpayLink: "",
                                                                baseUrl: "",
                                                            }));
                                                            setErrorMessage((prev) => ({
                                                                ...prev,
                                                                voucherClaimType: "",
                                                            }));
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label cursor-pointer"
                                                        htmlFor="website_register"
                                                    >
                                                        Get Voucher Through Website Registration
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        id="website_register_exam"
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="voucherClaimType"
                                                        value="website_register_exam"
                                                        checked={vocherData?.voucherClaimType === "website_register_exam"}
                                                        onChange={(e) => {
                                                            setSelectedFormId("");
                                                            setVoucherData((prev) => ({
                                                                ...prev,
                                                                voucherClaimType: e.target.value,
                                                                registrationFormId: "",
                                                                razorpayLink: "",
                                                                baseUrl: "",
                                                            }));
                                                            setErrorMessage((prev) => ({
                                                                ...prev,
                                                                voucherClaimType: "",
                                                            }));
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label cursor-pointer"
                                                        htmlFor="website_register"
                                                    >
                                                        Get Voucher Through Website Registration Exam
                                                    </label>
                                                </div>


                                                {errorMessage?.voucherClaimType && (
                                                    <div className="text-danger mt-1">
                                                        {errorMessage.voucherClaimType}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="row">

                                                {/* 1️⃣ Pay Register */}
                                                {vocherData?.voucherClaimType === "pay_register" && (
                                                    <>
                                                        <div className="col-md-4 mb-3">
                                                            <label className="form-label">
                                                                Registration Form <span className="text-danger">*</span>
                                                            </label>
                                                            <SearchSelect
                                                                placeholder="Search Registration Form"
                                                                value={selectedFormId}
                                                                defaultOptions={formOptions}
                                                                fetchOptions={fetchRegistrationForms}
                                                                onChange={(value) => {
                                                                    setSelectedFormId(value);
                                                                    setVoucherData((prev) => ({
                                                                        ...prev,
                                                                        registrationFormId: value,
                                                                    }));
                                                                    setErrorMessage((prev) => ({
                                                                        ...prev,
                                                                        registrationFormId: "",
                                                                    }));
                                                                }}
                                                            />
                                                            {errorMessage?.registrationFormId && (
                                                                <div className="text-danger mt-1">
                                                                    {errorMessage.registrationFormId}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="col-md-4 mb-3">
                                                            <label className="form-label">
                                                                Razorpay Link <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control py-2"
                                                                value={vocherData?.razorpayLink || ""}
                                                                onChange={(e) => {
                                                                    setVoucherData((prev) => ({
                                                                        ...prev,
                                                                        razorpayLink: e.target.value,
                                                                    }));
                                                                    setErrorMessage((prev) => ({
                                                                        ...prev,
                                                                        razorpayLink: "",
                                                                    }));
                                                                }}
                                                                placeholder="Razorpay Link"
                                                            />
                                                            {errorMessage?.razorpayLink && (
                                                                <div className="text-danger mt-1">
                                                                    {errorMessage.razorpayLink}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="col-md-4 mb-3">
                                                            <label className="form-label">
                                                                Base URL <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control py-2"
                                                                value={vocherData?.baseUrl || ""}
                                                                onChange={(e) => {
                                                                    setVoucherData((prev) => ({
                                                                        ...prev,
                                                                        baseUrl: e.target.value,
                                                                    }));
                                                                    setErrorMessage((prev) => ({
                                                                        ...prev,
                                                                        baseUrl: "",
                                                                    }));
                                                                }}
                                                                placeholder="Base URL"
                                                            />
                                                            {errorMessage?.baseUrl && (
                                                                <div className="text-danger mt-1">
                                                                    {errorMessage.baseUrl}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                                {/* 1️⃣ Pay Register */}
                                                {vocherData?.voucherClaimType === "website_register_exam" && (
                                                    <>
                                                        <div className="col-md-4 mb-3">
                                                            <label className="form-label">
                                                                Registration Form <span className="text-danger">*</span>
                                                            </label>
                                                            <SearchSelect
                                                                placeholder="Search Registration Form"
                                                                value={selectedFormId}
                                                                defaultOptions={formOptions}
                                                                fetchOptions={fetchRegistrationForms}
                                                                onChange={(value) => {
                                                                    setSelectedFormId(value);
                                                                    setVoucherData((prev) => ({
                                                                        ...prev,
                                                                        registrationFormId: value,
                                                                    }));
                                                                    setErrorMessage((prev) => ({
                                                                        ...prev,
                                                                        registrationFormId: "",
                                                                    }));
                                                                }}
                                                            />
                                                            {errorMessage?.registrationFormId && (
                                                                <div className="text-danger mt-1">
                                                                    {errorMessage.registrationFormId}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="col-md-4 mb-3">
                                                            <label className="form-label">
                                                                Base URL <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control py-2"
                                                                value={vocherData?.baseUrl || ""}
                                                                onChange={(e) => {
                                                                    setVoucherData((prev) => ({
                                                                        ...prev,
                                                                        baseUrl: e.target.value,
                                                                    }));
                                                                    setErrorMessage((prev) => ({
                                                                        ...prev,
                                                                        baseUrl: "",
                                                                    }));
                                                                }}
                                                                placeholder="Base URL"
                                                            />
                                                            {errorMessage?.baseUrl && (
                                                                <div className="text-danger mt-1">
                                                                    {errorMessage.baseUrl}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                {/* 2️⃣ Register Exam */}
                                                {vocherData?.voucherClaimType === "exam_register" && (
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Registration Form <span className="text-danger">*</span>
                                                        </label>
                                                        <SearchSelect
                                                            placeholder="Search Registration Form"
                                                            value={selectedFormId}
                                                            defaultOptions={formOptions}
                                                            fetchOptions={fetchRegistrationForms}
                                                            onChange={(value) => {
                                                                setSelectedFormId(value);
                                                                setVoucherData((prev) => ({
                                                                    ...prev,
                                                                    registrationFormId: value,
                                                                }));
                                                                setErrorMessage((prev) => ({
                                                                    ...prev,
                                                                    registrationFormId: "",
                                                                }));
                                                            }}
                                                        />
                                                        {errorMessage?.registrationFormId && (
                                                            <div className="text-danger mt-1">
                                                                {errorMessage.registrationFormId}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* 3️⃣ Website Registration */}
                                                {vocherData?.voucherClaimType === "website_register" && (
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">
                                                            Base URL <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control py-2"
                                                            value={vocherData?.baseUrl || ""}
                                                            onChange={(e) => {
                                                                setVoucherData((prev) => ({
                                                                    ...prev,
                                                                    baseUrl: e.target.value,
                                                                }));
                                                                setErrorMessage((prev) => ({
                                                                    ...prev,
                                                                    baseUrl: "",
                                                                }));
                                                            }}
                                                            placeholder="Base URL"
                                                        />
                                                        {errorMessage?.baseUrl && (
                                                            <div className="text-danger mt-1">
                                                                {errorMessage.baseUrl}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                        {/* Footer */}
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary py-1"
                                                onClick={() => {
                                                    setShowVocherPopup(false);
                                                    setVoucherData((prev) => ({
                                                        ...prev,
                                                        voucherClaimType: "",
                                                        registrationFormId: "",
                                                        razorpayLink: "",
                                                        baseUrl: "",
                                                    }));
                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                className={`btn btn_primary ${vocherLoading ? "cursor_pointer_not_allowed" : "cursor-pointer"
                                                    }`}
                                                onClick={() => handelSubmitVocher()}
                                                disabled={
                                                    vocherLoading ||
                                                    !vocherData?.voucherClaimType ||
                                                    (vocherData?.voucherClaimType === "pay_register" &&
                                                        (!vocherData?.registrationFormId ||
                                                            !vocherData?.razorpayLink ||
                                                            !vocherData?.baseUrl)) ||
                                                    (vocherData?.voucherClaimType === "exam_register" &&
                                                        !vocherData?.registrationFormId) ||
                                                    (vocherData?.voucherClaimType === "website_register" &&
                                                        !vocherData?.baseUrl)
                                                }
                                            >
                                                {vocherLoading ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
// <div className="container-fluid bg-light py-4">
//     <BackButton heading="Dashboard" content="Back" />
//     <div className="row">
//         <div className="col-12">
//             {/* Main Card Container */}
//             <div className="card shadow-sm">
//                 <div className="card-header d-flex justify-content-between align-items-center">
//                     <h4 className="mb-0">Good {getCurrentTime()}, {data?.user?.name}</h4>
//                 </div>

//                 {/* Metric Tabs */}
//                 <div className="card-body">
//                     <ul className="row nav mb-3 nav-tabs nav-justified mb-3 nav-fill" id="pills-tab" role="tablist">
//                         {tabs.map((tab) => (
//                             <li
//                                 className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
//                                 role="presentation"
//                                 key={tab.id}
//                             >
//                                 <button
//                                     className={`card nav-link card_animate ${activeTab === tab.id ? 'active' : ''}`}
//                                     data-bs-toggle="pill"
//                                     data-bs-target={`#pills-${tab.id}`}
//                                     type="button"
//                                     role="tab"
//                                     aria-controls={`pills-${tab.id}`}
//                                     aria-selected={activeTab === tab.id}
//                                     onClick={() => tabChange(tab.id)}
//                                 >
//                                     <div className="d-flex align-items-center justify-content-between">
//                                         <div className="flex-grow-1 overflow-hidden">
//                                             <p className="text-start text-uppercase fw-medium text-mute text-truncate fs-12">{tab.label}</p>
//                                         </div>
//                                         <div className="flex-shrink-0 text-end">
//                                             <h5 className={`text-${tab.colorClass} fs-12 mb-0`}></h5>
//                                         </div>
//                                     </div>
//                                     <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
//                                         <div className="text-start">
//                                             <h4 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
//                                                 <span className="counter-value" data-target={tab.count}>
//                                                     {tab.count}
//                                                 </span>
//                                             </h4>
//                                             <Link to="" className="fs-xs fw-500 mb-0">
//                                                 View {tab.label}
//                                             </Link>
//                                         </div>
//                                         <div className="avatar-md p-4 flex-shrink-0">
//                                             <span className={`avatar-title rounded fs-3`}>
//                                                 <tab.icon className={`${tab.colorClass} fs-20`} />
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 {/* Action Bar (Search & Filter) */}
//                 <div className="card-body">
//                     <div className="d-flex flex-column flex-md-row justify-content-between gap-4">
//                         <SearchInputField placeholder={"Search Voucher"} />
//                         <div className="d-flex gap-3">
//                             <button
//                                 className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
//                                 type="button"
//                                 data-bs-toggle="offcanvas"
//                                 data-bs-target="#offcanvasRight"
//                                 aria-controls="offcanvasRight"
//                             >
//                                 <MdFilterList className="me-1 mb-1" />
//                                 Filters
//                             </button>
//                             <div
//                                 className="offcanvas offcanvas-end  bg_white"
//                                 id="offcanvasRight"
//                                 aria-labelledby="offcanvasRightLabel"
//                             >
//                                 <div className="offcanvas-header ">
//                                     <h5
//                                         className="offcanvas-title  text_color"
//                                         id="offcanvasRightLabel"
//                                     >
//                                         Filters
//                                     </h5>
//                                     <button
//                                         type="button"
//                                         className="btn-close"
//                                         data-bs-dismiss="offcanvas"
//                                         aria-label="Close"
//                                     ></button>
//                                 </div>
//                                 <div className="offcanvas-body p-2 bg_white">
//                                     <Filter
//                                         filterData={filterData}
//                                         HandleFilters={HandleFilters}
//                                         filterReset={FilterReset}
//                                         filterSubmit={filterSubmit}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Table or Grid View */}
//                 <div className="card-body">

//                     {searchParams.get("filter") !== "voucherLeads" ? (
//                         <CustomTable data={voucherdata?.data} columns={voucherColumns} loading={navigation.state} />
//                     ) : (
//                         <CustomTable data={voucherdata?.data} columns={studentColumns} loading={navigation.state} />

//                     )}
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
