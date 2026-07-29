import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import CustomPage from '../../../utils/Custompage';

const DemoBatches = () => {
    const { demoBatches } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const handleNavigate = (row) => {
  navigate(
    `/batchmanagement/demoBatches/launch/Demo_Batches/${row.id}?batchType=DEMO_BATCH`
  );
};
    console.log(demoBatches, "fksjdlfksdj")
    const BATCH_COLUMNS = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index, meta) => (demoBatches.currentPage - 1) * demoBatches.pageSize + index + 1,
        },
        {
            id: "batchName",
            header: "Batch Name",
            accessor: (row) => row.batchName,
        },
        {
            id: "trainer",
            header: "Trainer",
            accessor: (row) => row.users?.[0]?.fullname || "Not Assigned",
        },
        {
            id: "timings",
            header: "Timings",
            accessor: (row) => `${row.startTime} - ${row.endTime}`,
        },
        {
            id: "branch",
            header: "Branch",
            accessor: (row) => row.branch?.branch_name,
        },
        {
  id: "actions",
  header: "Overview",
  accessor: (row) => (
    <button
      className="btn btn-sm btn_primary"
      onClick={() => handleNavigate(row)}
    >
      View
    </button>
  ),
}
    ];

    const BATCH_FILTERS = [
        { inputname: "fromDate", label: "Start Date", type: "date", value: "" },
        { inputname: "branchId", label: "Branch", type: "select", options: [], value: "" },
    ];

    // Mapping Pagination from your JSON
    const pagination = {
        start: demoBatches?.startBatch || 1,
        totalPages: demoBatches?.totalPages || 1,
        end: demoBatches?.endBatch || 10,
        searchResult: demoBatches?.totalBatches || 0,
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage);
        setSearchParams(params);
    };
    const handlePerPageChange = (e) => {
        const pageSize = parseInt(e.target.value, 10);

        setSearchParams((prev) => {
            const params = Object.fromEntries(prev);
            return {
                ...params,
                page: 1,
                pageSize,
            };
        });
    };

    return (
        <CustomPage
            // 1. Data & Columns
            tableData={demoBatches?.reversedBatches || []}
            tableColum={BATCH_COLUMNS}
            heading="Demo Batches"

            // 2. Search Config
            isSearch={true}
            searchPlaceHolder="Search Batch Name..."

            // 3. Filter Config
            // isFilter={true}
            // InitialFilterData={BATCH_FILTERS}

            // 4. Pagination Config
            tablePagination={{
                ...pagination,
            }}
            onPageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}

        />
    );
};

export default DemoBatches;