import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useFetcher, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import GateKeeper from "../../../rbac/GateKeeper";
import { HiMiniPlus } from "react-icons/hi2";
import BackButton from "../../components/backbutton/BackButton";
import { ERPApi } from "../../../serviceLayer/interceptor";
import PaginationInfo from "../../../utils/PaginationInfo";
import Pagination from "../../../utils/Pagination";
import { debounce } from "../../../utils/Utils";
import { RiEdit2Line } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { AiFillEye } from "react-icons/ai";
import { IoAddCircleSharp } from "react-icons/io5";
import CustomTable from "../../../utils/CustomTable";

export const examDataLoader = async ({ request }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const search = searchParams.get("search") || "";
    const isTeksExam = searchParams.get("filter[isTeksExam]") || "";

    const query = new URLSearchParams({
      page,
      pageSize,
      search,
    });

    if (isTeksExam) {
      query.append("filter[isTeksExam]", isTeksExam);
    }

    const response = await ERPApi.get(`/exam/all?${query.toString()}`);
    const examData = response.data;

    return {
      exams: examData?.exams || [],
      totalRecords: examData?.totalRecords || 0,
      totalPages: examData?.totalPages || 1,
      currentPage: examData?.currentPage || 1,
      pageSize: examData?.pageSize || 10,
      startData: examData?.startData || 0,
      endData: examData?.endData || 0,
    };
  } catch (error) {
    console.error(error);
    return {
      exams: [],
      totalRecords: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
      startData: 0,
      endData: 0,
    };
  }
};


export const examDeleteAction = async ({ request }) => {
  const data = (await request.json()) || null;
  const examId = data?.id;
  const response = await ERPApi.delete(`exam/delete/${examId}`);
  await toast.promise(Promise.resolve(response), {
    pending: "Deleting...",
    success: "Deleted Successfully",
  });
  return response.data;
};
const Exams = () => {
  const examData = useLoaderData();
  const navigation = useNavigation()
  const fetcher = useFetcher();
  let submit = useSubmit();
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
  const toggleFilter = () => {
    setQParams((prev) => ({
      ...prev,
      page: 1,
      isTeksExam: prev.isTeksExam === '1' ? '0' : '1'
    }))
  }

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

  const handleExamDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you won't be able to revert this Exam",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let data = { id };
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
  const isTeksExam = Qparams.isTeksExam === '1';
  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (examData?.currentPage - 1) *
        examData?.pageSize +
        index +
        1,
    },

    {
      id: "examType",
      header: "Exam Title",
      accessor: (row) => row?.examType || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "examName",
      header: "Exam Name",
      accessor: (row) => row?.examName || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "attempts",
      header: "No of Attempts",
      accessor: (row) => row?.attempts ?? "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "noOfQuestions",
      header: "No of Questions",
      accessor: (row) => row?.noOfQuestions ?? "-",
      sortable: true,
      hideable: true,
    },
  ];

  const actions = (row) => {
    const exam = row;
    if (!exam) return null;

    const hasQuestions = exam?.examQuestions?.length > 0;

    return (
      <div className="d-flex align-items-center gap-2">
        {/* ADD QUESTIONS */}
        <Link
          to={hasQuestions ? "#" : `/exam/addquestion/${exam.id}`}
          onClick={(e) => hasQuestions && e.preventDefault()}
          title={hasQuestions ? "Questions already added" : "Add Questions"}
          style={{
            pointerEvents: hasQuestions ? "none" : "auto",
            opacity: hasQuestions ? 0.5 : 1,
            cursor: hasQuestions ? "not-allowed" : "pointer",
          }}
        >
          <IoAddCircleSharp className="eye_icon fw-500 table_icons text_primary" />
        </Link>

        {/* EDIT */}
        <Link to={`/exam/createExam/${exam.id}`} title="Edit">
          <RiEdit2Line className="edit_icon table_icons" />
        </Link>

        {/* VIEW */}
        <Link to={`/exam/view/${exam.id}`} title="View">
          <AiFillEye className="eye_icon table_icons" />
        </Link>

        {/* DELETE */}
        <MdDelete
          className="text-danger table_icons"
          title="Delete"
          style={{ cursor: "pointer" }}
          onClick={() => handleExamDelete(exam?.id)}
        />
      </div>
    );
  };

  return (
    <div>
      <BackButton heading="Exams" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header p-sm-3 p-0">
                <div className="row">
                  <div className="col-12 d-flex justify-content-end align-items-center">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        id="toggleExamType"
                        className="toggleCheckbox me-2"
                        checked={isTeksExam}
                        onChange={toggleFilter}
                      />
                      <label htmlFor="toggleExamType" className="toggleContainer d-flex me-3">
                        <div
                          className={`fw-500 fs-14 ${!isTeksExam ? 'active' : ''}`}
                          style={{ color: !isTeksExam ? '#000' : '#aaa' }}
                        >
                          External Exam
                        </div>
                        <div
                          className={`fw-500 fs-14 ms-2 ${isTeksExam ? 'active' : ''}`}
                          style={{ color: isTeksExam ? '#000' : '#aaa' }}
                        >
                          Internal Exam
                        </div>
                      </label>
                      <GateKeeper
                        requiredModule="Exam Mangement"
                        requiredPermission="all"
                        submenumodule="Exam Details"
                        submenuReqiredPermission="canCreate"
                      >
                        <Link to="/exam/createExam" className="btn btn-sm btn_primary fs-13 button_color">
                          <HiMiniPlus /> Create
                        </Link>
                      </GateKeeper>
                    </div>
                  </div>
                </div>

              </div>
              <div className="card-body">
                <div className="table-responsive table-card border-0">
                  <div className="table-container table-scroll">
                    <CustomTable
                      data={examData?.exams || []}
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
                        length: examData?.length,
                        start: examData?.startData,
                        end: examData?.endData,
                        total: examData?.totalRecords,
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
                        currentPage={Number(examData?.currentPage) || 1}
                        totalPages={Number(examData?.totalPages) || 1}
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

export default Exams;









{/* <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
  <thead>
    <tr>
      <th scope="col" className="fs-13 lh-xs fw-600">
        S.No
      </th>
      <th scope="col" className="fs-13 lh-xs fw-600">
        Exam Title
      </th>
      <th scope="col" className="fs-13 lh-xs fw-600">
        Exam Name
      </th>
      <th scope="col" className="fs-13 lh-xs fw-600">
        No of Attempts
      </th>
      <th scope="col" className="fs-13 lh-xs fw-600">
        No of Questions
      </th>
      <th scope="col" className="fs-13 lh-xs fw-600">
        Action
      </th>
    </tr>
  </thead>
  <tbody>
    {examData?.exams?.length > 0 ? (
      examData.exams.map((exam, index) => (
        <tr key={exam.id}>
          <td className="fs-13 black_300 fw-500 lh-xs bg_light">
            {(examData.currentPage - 1) * examData.pageSize + index + 1}
          </td>
          <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }}>
            {exam.examType}
          </td>
          <td className="fs-13 black_300 lh-xs bg_light text-truncate">
            {exam.examName}
          </td>
          <td className="fs-13 black_300 lh-xs bg_light text-truncate">
            {exam.attempts}
          </td>
          <td className="fs-13 black_300 lh-xs bg_light text-truncate">
            {exam.noOfQuestions}
          </td>
          <td className="fs-13 black_300 lh-xs bg_light text-truncate">
            <Link
              to={exam.examQuestions?.length === 0 ? `/exam/addquestion/${exam.id}` : "#"}
              onClick={(e) => {
                if (exam.examQuestions?.length > 0) e.preventDefault();
              }}
              style={{
                pointerEvents: exam.examQuestions?.length > 0 ? "none" : "auto",
                opacity: exam.examQuestions?.length > 0 ? 0.5 : 1,
                cursor: exam.examQuestions?.length > 0 ? "not-allowed" : "pointer",
              }}
              title={
                exam.examQuestions?.length > 0
                  ? "Questions already added"
                  : "Add Questions"
              }
            >
              <IoAddCircleSharp
                className="eye_icon fw-500 table_icons me-3 text_primary"
              />
            </Link>
            <Link to={`/exam/createExam/${exam.id}`}>
              <RiEdit2Line
                className="edit_icon table_icons me-3"
                title="Edit"
              />
            </Link>
            <Link to={`/exam/view/${exam.id}`}>
              <AiFillEye
                className="eye_icon table_icons me-3"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="view"
              />
            </Link>
            <MdDelete
              className="text-danger table_icons me-4"
              title="Delete"
              onClick={(e) => {
                e.preventDefault();
                handleExamDelete(exam?.id);
              }}
            />
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" className="text-center">
          No exams found.
        </td>
      </tr>
    )}
  </tbody>
</table> */}