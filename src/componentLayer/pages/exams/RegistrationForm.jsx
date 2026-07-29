import React, { useCallback, useEffect, useRef, useState } from "react";
import BackButton from "../../components/backbutton/BackButton";
import GateKeeper from "../../../rbac/GateKeeper";
import { Link, useFetcher, useLoaderData, useSubmit } from "react-router-dom";
import { HiMiniPlus } from "react-icons/hi2";
import { ERPApi } from "../../../serviceLayer/interceptor";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { AiFillEye } from "react-icons/ai";
import { RiEdit2Line, RiSendPlaneFill } from "react-icons/ri";
import { IoLinkSharp } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import PaginationInfo from "../../../utils/PaginationInfo";
import Pagination from "../../../utils/Pagination";
import { debounce } from "../../../utils/Utils";
import CustomTable from "../../../utils/CustomTable";

export const registrationFormLoader = async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const search = searchParams.get("search") || "";
    const query = new URLSearchParams({
        page,
        pageSize,
        search,
    });
    try {
        const [formResponse, examResponse] = await Promise.all([
            ERPApi.get(`/registrationform/all?${query.toString()}`),
            ERPApi.get(`/exam/allexams?filter[isTeksExam]=0`),
        ]);
        const registrationFormData = formResponse?.data;
        const listOfExams = examResponse?.data;
        return { registrationFormData, listOfExams };
    } catch (error) {
        console.error(error);
        return { registrationFormData: null, listOfExams: [] };
    }
};

export const registrationFormAction = async ({ request }) => {
    const data = await request.json();
    if (!data) return null;

    if (data.type === "delete") {
        const deletePromise = ERPApi.delete(`registrationform/delete/${data.id}`);
        const response = await toast.promise(deletePromise, {
            pending: "Deleting...",
            success: "Deleted Successfully",
            error: "Failed to delete",
        });
        return response.data;
    }
    if (data.type === "updateExam") {
        try {
            const updatePromise = ERPApi.patch(`/registrationform/edit/${data.formId}`, {
                examID: data.examId,
            });
            const response = await toast.promise(
                updatePromise,
                {
                    pending: "Updating...",
                    success: "Exam Updated",
                    //error: "Failed to update exam",
                }
            );
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Something went wrong";
            toast.error(message);
            return null;
        }
    }
    if (data.type === "sendExamLink") {
        const sendPromise = ERPApi.post("/registrationform/examlinks", {
            formId: data.formId,
        });
        const response = await toast.promise(sendPromise, {
            pending: "Sending...",
            success: "Exam Link Sent!",
            error: "Failed to send link",
        });
        return response.data;
    }
    return null;
};

const RegistrationForm = () => {
    const registrationFormData = useLoaderData()?.registrationFormData;
    const listOfExams = useLoaderData()?.listOfExams;
    const fetcher = useFetcher();
    let submit = useSubmit();
    const handleExamDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you won't be able to revert this Form",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let data = { id, type: "delete" };
                try {
                    await fetcher.submit(data, {
                        method: "DELETE",
                        encType: "application/json",
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };
    const [Qparams, setQParams] = useState({
        search: "",
        page: 1,
        pageSize: 10,
        isTeksExam: '',
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
                search: param.search,
            });
            searchParams.set('filter[isTeksExam]', param.isTeksExam || '');

            submit(`?${searchParams.toString()}`, { method: "get", action: "." });
        }, 500),
        []
    );
    const isFormActive = (activeFrom, activeTo) => {
        const now = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        const from = new Date(activeFrom).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        const to = new Date(activeTo).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        return now >= from && now <= to;
    };

    const handleExamSelection = (e, form, fetcher, listOfExams, setForm) => {
        const selectedExamId = e.target.value;
        if (!selectedExamId) {
            return;
        }
        const previousExamId = form.examId;
        fetcher.submit(
            {
                formId: form.id,
                examId: selectedExamId,
                type: "updateExam",
            },
            {
                method: "patch",
                encType: "application/json",
            }
        ).then(response => {
            if (response instanceof Error) {
                console.error("Error updating exam:", response);
                e.target.value = previousExamId || "";
                setForm(prevForm => ({
                    ...prevForm,
                    examId: null,
                    exam: null,
                }));
                toast.error("Failed to update exam. Please try again.");
            } else {
            }
        });
    };

    const columns = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) =>
                (registrationFormData?.currentPage - 1) *
                registrationFormData?.pageSize +
                index +
                1,
        },
        {
            id: "formName",
            header: "Form Name",
            accessor: (row) => row.registrationformname || "-",
            Cell: ({ row }) => {
                const form = row.original;
                return (
                    <div className="d-flex align-items-center gap-2 text-truncate" title={form.registrationformname}>
                        <span
                            className={`d-inline-block rounded-circle ${isFormActive(form.activeFrom, form.activeTo) ? "bg-success" : "bg-danger"}`}
                            style={{ height: "6px", width: "6px", flexShrink: 0, marginTop: "1px" }}
                            title={isFormActive(form.activeFrom, form.activeTo) ? "Active" : "Inactive"}
                        />
                        <span className="text-truncate" style={{ maxWidth: "180px" }}>
                            {form.registrationformname}
                        </span>
                    </div>
                );
            },
            sortable: true,
            hideable: true,
        },
        {
            id: "description",
            header: "Description",
            accessor: (row) => row.description || "-",
            Cell: ({ row }) => (
                <span className="text-truncate" style={{ maxWidth: "120px" }} title={row.original.description}>
                    {row.original.description}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "responses",
            header: "Responses",
            accessor: (row) => row.responses ?? 0,
            sortable: true,
            hideable: true,
        },
        {
            id: "startDate",
            header: "Start Date",
            accessor: (row) => row.activeFrom || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "closingDate",
            header: "Closing Date",
            accessor: (row) => row.activeTo || "-",
            sortable: true,
            hideable: true,
        },
        {
            id: "addExam",
            header: "Add Exam",
            accessor: (row) => {
                const form = row; // <- ensure this points to actual data
                return (
                    <div className="input-group input-group-sm">
                        <select
                            className="form-select"
                            defaultValue={form.examId || ""}
                            onChange={(e) => handleExamSelection(e, form, fetcher, listOfExams)}
                            disabled={!!form.examID}
                            style={{
                                cursor: !!form.examID ? "not-allowed" : "pointer",
                            }}
                        >
                            {form.exam?.examName ? (
                                <option value={form.examId}>{form.exam.examName}</option>
                            ) : (
                                <>
                                    <option value="">Select Exam</option>
                                    {listOfExams.exams.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.examName}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>
                );
            },
            sortable: true,
            hideable: true,
        }

    ];

    const actions = (row) => {
        const form = row;
        if (!form) return null;

        return (
            <div className="d-flex align-items-center gap-2">
                {/* Copy Form Link */}
                <span
                    className="text-primary"
                    title="Copy Form Link"
                    onClick={() => {
                        const fullLink = `https://teksacademy.com/registrationForm/${form.link}`;
                        navigator.clipboard.writeText(fullLink);
                        toast.success("Link copied to clipboard!");
                    }}
                    style={{ cursor: "pointer" }}
                >
                    <IoLinkSharp className="me-2 eye_icon fw-600 table_icons text-primary" />
                </span>

                {/* Edit */}
                <Link to={`/exam/createRegistrationForm/${form.id}`}>
                    <RiEdit2Line className="me-3 eye_icon fw-600 table_icons" title="Edit" />
                </Link>

                {/* View */}
                <Link to={`/exam/studentDataView/${form.id}`}>
                    <AiFillEye className="eye_icon table_icons me-3" title="View" />
                </Link>

                {/* Delete */}
                <MdDelete
                    className="text-danger table_icons me-3"
                    title="Delete"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleExamDelete(form.id)}
                />

                {/* Send Exam Link */}
                <RiSendPlaneFill
                    className={`eye_icon table_icons ${!form.examID || form.responses === 0 ? "text-muted" : "text-primary"}`}
                    title={
                        !form.examID
                            ? "Exam not assigned"
                            : form.responses === 0
                                ? "No responses available"
                                : "Send Exam Link"
                    }
                    onClick={(e) => {
                        e.preventDefault();
                        if (!form.examID || form.responses === 0) return;
                        fetcher.submit(
                            { formId: form.id, type: "sendExamLink" },
                            { method: "post", encType: "application/json" }
                        );
                    }}
                    style={{ cursor: "pointer" }}
                />

                {/* Copy Exam Link */}
                <span
                    title={
                        !form.examID
                            ? "Exam not assigned"
                            : form.responses === 0
                                ? "No responses available"
                                : "Copy Exam Link"
                    }
                    onClick={() => {
                        if (!form.examID || form.responses === 0) return;
                        const fullLink = `https://teksacademy.com/exam/${form.id}/${form.link}`;
                        navigator.clipboard.writeText(fullLink);
                        toast.success("Link copied to clipboard!");
                    }}
                    style={{ cursor: "pointer" }}
                >
                    <FaRegCopy
                        className={`me-2 ms-3 eye_icon fw-500 table_icons ${!form.examID || form.responses === 0 ? "text-muted" : "text-primary"}`}
                    />
                </span>
            </div>
        );
    };


    return (
        <div>
            <BackButton heading="Registration Form" content="Back" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card border-0">
                            <div className="card-header">
                                <div className="row d-flex justify-content-between">
                                    <div className="col-sm-4"></div>
                                    <div className="col-md-6 text-end">
                                        <GateKeeper
                                            requiredModule="Exam Mangement"
                                            requiredPermission="all"
                                            submenumodule="Registration Form"
                                            submenuReqiredPermission="canCreate"
                                        >
                                            <button
                                                type="button"
                                                className="btn btn-sm btn_primary fs-13"
                                            >
                                                <Link
                                                    to="/exam/createRegistrationForm"
                                                    className="button_color"
                                                >
                                                    <HiMiniPlus /> Create
                                                </Link>
                                            </button>
                                        </GateKeeper>
                                        <GateKeeper
                                            requiredModule="Exam Mangement"
                                            requiredPermission="all"
                                            submenumodule="Registration Form"
                                            submenuReqiredPermission="canCreate"
                                        >
                                            <button
                                                type="button"
                                                className="btn btn-sm btn_primary fs-13 ms-2"
                                            >
                                                <Link
                                                    to="/exam/customRegistrationfrom"
                                                    className="button_color"
                                                >
                                                    <HiMiniPlus /> Fields
                                                </Link>
                                            </button>
                                        </GateKeeper>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive table-card border-0">
                                    <div className="table-container table-scroll">
                                        <CustomTable
                                            data={registrationFormData?.forms || []}
                                            columns={columns}
                                            actions={actions}
                                            enableColumnToggle={true}
                                        />

                                    </div>
                                </div>
                                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                                    <div className="col-sm">
                                        <PaginationInfo
                                            data={{
                                                length: registrationFormData?.length,
                                                start: registrationFormData?.startData,
                                                end: registrationFormData?.endData,
                                                total: registrationFormData?.totalRecords,
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
                                                currentPage={Number(registrationFormData?.currentPage) || 1}
                                                totalPages={Number(registrationFormData?.totalPages) || 1}
                                                loading={navigation.state === 'loading'}
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
    );
};

export default RegistrationForm;
{/* <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
    <thead className="z-1">
        <tr>
            <th scope="col" className="fs-13 lh-xs fw-600">
                S.No
            </th>
            <th scope="col" className="fs-13 lh-xs fw-600">
                Form Name
            </th>
            <th scope="col" className="fs-13 lh-xs fw-600">
                Description
            </th>
            <th scope="col" className="fs-13 lh-xs fw-600">
                Responses
            </th>
            <th scope="col" className="fs-13 lh-xs fw-600">
                Start Date
            </th>
            <th scope="col" className="fs-13 lh-xs fw-600">
                Closing Date
            </th>
            <th scope="col" className="fs-13 lh-xs fw-600">
                Add Exam
            </th>
            <th scope="col" className="fs-13 lh-xs fw-600">
                Actions
            </th>
        </tr>
    </thead>
    <tbody>

        {registrationFormData?.forms?.length > 0 ? (
            registrationFormData.forms.map((form, index) => (
                <tr key={form.id}>
                    <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                        {index + 1}
                    </td>
                    <td className="fs-13 black_300 lh-xs bg_light">
                        <div className="d-flex align-items-center gap-2 text-truncate" title={form.registrationformname}>
                            <span
                                className={`d-inline-block rounded-circle ${isFormActive(form.activeFrom, form.activeTo) ? "bg-success" : "bg-danger"}`}
                                style={{ height: "6px", width: "6px", flexShrink: 0, marginTop: "1px" }}
                                title={isFormActive(form.activeFrom, form.activeTo) ? "Active" : "Inactive"}
                            />
                            <span className="text-truncate" style={{ maxWidth: "180px" }}>
                                {form.registrationformname}
                            </span>
                        </div>
                    </td>

                    <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }} title={form.description}>
                        {form.description}
                    </td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                        {form.responses}
                    </td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                        {form.activeFrom}
                    </td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                        {form.activeTo}
                    </td>
                    <td>
                        <div className="input-group input-group-sm" >
                            <select
                                className="form-select"
                                defaultValue={form.examId || ""}
                                onChange={(e) => handleExamSelection(e, form, fetcher, listOfExams)} // Pass parameters
                                disabled={!!form.examID}
                                style={{
                                    cursor: !!form.examID ? "not-allowed" : "pointer",
                                }}
                            >
                                {form.exam?.examName ? (
                                    <option value={form.examId}>
                                        {form.exam.examName}
                                    </option>
                                ) : (
                                    <>
                                        <option value="">Select Exam</option>
                                        {listOfExams.exams.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.examName}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>
                    </td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                        <span
                            className="text-primary"
                            title="Copy Form Link"
                            // title={
                            //     new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                            //         new Date(form.activeTo).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) ||
                            //         new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                            //         new Date(form.examEndDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
                            //         ? "Form or Exam has expired"
                            //         : "Copy Form Link"
                            // }
                            // className={`text-decoration-underline text-truncate ${new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                            //     new Date(form.activeTo).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) ||
                            //     new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                            //     new Date(form.examEndDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
                            //     ? "text-muted"
                            //     : "text-primary"
                            //     }`}
                            // style={{
                            //     cursor:
                            //         new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                            //             new Date(form.activeTo).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) ||
                            //             new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                            //             new Date(form.examEndDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
                            //             ? "not-allowed"
                            //             : "pointer",
                            // }}
                            onClick={() => {
                                // const nowDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
                                // const activeToDate = new Date(form.activeTo).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
                                // const examEndDate = new Date(form.examEndDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
                                // if (nowDate > activeToDate || nowDate > examEndDate) return;
                                const fullLink = `https://teksacademy.com/registrationForm/${form.link}`;
                                navigator.clipboard.writeText(fullLink);
                                toast.success("Link copied to clipboard!");
                            }}
                        >
                            <IoLinkSharp
                                className="me-2 eye_icon fw-600 table_icons text-primary"
                                // className={`me-2 eye_icon fw-600 table_icons ${new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                                //     new Date(form.activeTo).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) ||
                                //     new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                                //     new Date(form.examDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
                                //     ? "text-muted"
                                //     : "text-primary"
                                //     }`}
                                // data-bs-toggle="tooltip"
                                // data-bs-placement="top"
                                // title={
                                //     new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                                //         new Date(form.activeTo).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) ||
                                //         new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                                //         new Date(form.examDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
                                //         ? "Form or Exam has expired"
                                //         : "Copy Form Link"
                                // }

                                // title={
                                //     new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                                //         new Date(form.activeTo).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) ||
                                //         new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) >
                                //         new Date(form.examDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
                                //         ? "Form or Exam has expired"
                                //         : "Copy Form Link"
                                // }
                                title="Copy Form Link"
                            />
                        </span>
                        <Link
                            to={`/exam/createRegistrationForm/${form.id}`}
                            className="me-2 edit_icons"
                        >
                            <RiEdit2Line
                                className="me-3 ms-3 eye_icon fw-600  edit_icons"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="edit"
                            />
                        </Link>
                        <Link to={`/exam/studentDataView/${form.id}`}>
                            <AiFillEye
                                className="eye_icon table_icons me-3"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="view"
                            />
                        </Link>
                        <MdDelete
                            className=" fw-600  text-danger table_icons me-3 ms-2"
                            title="Delete"
                            onClick={(e) => {
                                e.preventDefault();
                                handleExamDelete(form?.id);
                            }}
                            style={{ cursor: "pointer" }}
                        />
                        <RiSendPlaneFill
                            className={`me-2 ms-3 eye_icon fw-500 table_icons ${!form.examID || form.responses === 0
                                ? "text-muted"
                                : "text-primary"
                                }`}
                            // className={`eye_icon fw-600 table_icons ms-3 me-3 ${form.responses === 0 || !form.examID || isExamDateExpired(form.examDate)
                            //     ? "text-muted"
                            //     : "text-primary"
                            //     }`}
                            // data-bs-toggle="tooltip"
                            // data-bs-placement="top"
                            // title={
                            //     !form.examID
                            //         ? "Exam not assigned"
                            //         : form.responses === 0
                            //             ? "No responses available"
                            //             : isExamDateExpired(form.examDate)
                            //                 ? "Exam date has passed"
                            //                 : "Send Exam Link"
                            // }
                            title={
                                !form.examID
                                    ? "Exam not assigned"
                                    : form.responses === 0
                                        ? "No responses available"
                                        : "Send Exam Link"
                            }
                            // style={{
                            //     cursor:
                            //         form.responses === 0 || !form.examID || isExamDateExpired(form.examDate)
                            //             ? "not-allowed"
                            //             : "pointer",
                            // }}
                            onClick={(e) => {
                                e.preventDefault();
                                // if (form.responses === 0 || !form.examID || isExamDateExpired(form.examDate)) return;
                                if (form.responses === 0 || !form.examID) return;
                                fetcher.submit(
                                    {
                                        formId: form.id,
                                        type: "sendExamLink",
                                    },
                                    {
                                        method: "post",
                                        encType: "application/json",
                                    }
                                );
                            }}
                        />
                        <span
                            title={
                                !form.examID
                                    ? "Exam not assigned"
                                    : form.responses === 0
                                        ? "No responses available"
                                        : "Copy Exam Link"}

                            // className={`text-decoration-underline text-truncate ${!form.examID || form.responses === 0 || isExamDateExpired(form.examDate)
                            //     ? "text-muted"
                            //     : "text-primary"
                            //     }`}
                            // style={{
                            //     cursor:
                            //         !form.examID || form.responses === 0 || isExamDateExpired(form.examDate)
                            //             ? "not-allowed"
                            //             : "pointer",
                            // }}
                            onClick={() => {
                                // if (!form.examID || form.responses === 0 || isExamDateExpired(form.examDate)) return;
                                if (!form.examID || form.responses === 0) return;
                                const fullLink = `https://teksacademy.com/exam/${form.id}/${form.link}`;
                                navigator.clipboard.writeText(fullLink);
                                toast.success("Link copied to clipboard!");
                            }}
                        >
                            <FaRegCopy
                                // className={`me-2 ms-3 eye_icon fw-500 table_icons ${!form.examID || form.responses === 0 || isExamDateExpired(form.examDate)
                                //     ? "text-muted"
                                //     : "text-primary"
                                //     }`}
                                className={`me-2 ms-3 eye_icon fw-500 table_icons ${!form.examID || form.responses === 0
                                    ? "text-muted"
                                    : "text-primary"
                                    }`}
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                // title={
                                //     !form.examID
                                //         ? "Exam not assigned"
                                //         : form.responses === 0
                                //             ? "No responses available"
                                //             : isExamDateExpired(form.examDate)
                                //                 ? "Exam has expired"
                                //                 : "Copy Exam Link"
                                // }
                                title={
                                    !form.examID
                                        ? "Exam not assigned"
                                        : form.responses === 0
                                            ? "No responses available"
                                            : "Copy Exam Link"
                                }
                            />
                        </span>

                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="7" className="text-center">
                    No registration forms found.
                </td>
            </tr>
        )}
    </tbody>
</table> */}