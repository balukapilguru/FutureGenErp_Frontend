import React, { useEffect, useState } from 'react'
import { RiEdit2Line } from 'react-icons/ri';
import { NavLink, useLoaderData, useSearchParams } from 'react-router-dom';
import GateKeeper from '../../../../../rbac/GateKeeper';
import BackButton from '../../../../components/backbutton/BackButton';
import SearchInputField from '../../../../../utils/SearchInputField';
import { HiMiniPlus } from 'react-icons/hi2';
import CustomTable from '../../../../../utils/CustomTable';
import Pagination from '../../../../../utils/Pagination';
import PaginationInfo from '../../../../../utils/PaginationInfo';
import { MdFilterList } from 'react-icons/md';
import Filter from '../../../../../utils/FilterWithSearchParams';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { Offcanvas } from 'react-bootstrap';

const EntityUsers = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [BranchsList, setBranchList] = useState()

    const { usersList, entitiesOptions } = useLoaderData();
    const initialFilterData = [
        // {
        //     label: "Entity",
        //     type: "select",
        //     inputname: "entity_id",
        //     value: "",
        //     options: entitiesOptions,
        // },
        {
            label: "Entity",
            type: "search-select",
            inputname: "entity_id",
            urlParam: "entity_id",
            urlSearchParam: "entity_label",
            options: entitiesOptions ?? [],
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
        {
            label: "Branches",
            type: "select",
            inputname: "branch_id",
            value: "",
            options: BranchsList,
        },
    ];
    const [filterData, setFilterData] = useState(initialFilterData);
    useEffect(() => { setFilterData(initialFilterData) }, [BranchsList])

    

    const columns = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) =>
                (usersList?.pagination?.currentPage - 1) *
                usersList?.pagination?.pageSize +
                index +
                1,
        },
        { id: "name", header: "Name", accessor: "name" },
        { id: "email", header: "Email", accessor: "email" },
        {
            id: "entity",
            header: "Entity",
            accessor: (row) => row?.branch?.entity?.name, // Format createdAt to a readable string
        },
        {
            id: "branch",
            header: "Branch",
            accessor: (row) => row?.branch?.branch_name, // Format createdAt to a readable string
        },

    ];

    const actions = (item, handleDelete) => (
        <div className="d-flex align-items-center">
            <GateKeeper
                requiredModule="Reports"
                submenumodule="Report Data"
                submenuReqiredPermission="canUpdate"
            >
                <NavLink
                    to={`update-entity-user/${item.id}`}
                    className="fw-medium"
                >
                    <RiEdit2Line />
                </NavLink>
            </GateKeeper>
        </div>
    );

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
    };

    // Function to fetch and store branch data
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



    const HandleFilters = (index, name, value) => {
        setFilterData((prev) =>
            prev.map((item, idx) =>
                idx === index
                    ? {
                        ...item,
                        [name]: value, // Dynamically update the property based on the `name` (key)
                    }
                    : item
            )
        );
    };

    useEffect(() => {
        if (filterData?.[0]?.["entity_id"]) {
            const branches = fetchAndStoreBranches()
            // if (branches?.length < 0) {
            //     setBranchList(branches)
            // }
        }
    }, [filterData?.[0]?.["entity_id"]]);

    const filterReset = () => {
        const resetFilterData = filterData?.map((item) => ({
            ...item,
            value: "",
        }));
        setFilterData(resetFilterData);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        initialFilterStructure.forEach(filter => {
            newSearchParams.delete(filter.urlParam || filter.inputname);
        });
        newSearchParams.delete("entity_id_label");
        newSearchParams.set("page", "1");

        setSearchParams(newSearchParams);
    };

    const filterSubmit = () => {
        const offcanvasElement = document.getElementById("offcanvasRight");
        const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
            offcanvasInstance.hide();
        }
    };



    return (
        <div>
            <BackButton heading="Entity Users" content="Back" />
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <div className="row justify-content-between">
                            <div className="col-sm-4">
                                <div className="search-box">
                                    <SearchInputField />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="buttons_alignment">
                                    <div className="fs-13 me-1 ">
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
                                                <Filter
                                                    filterData={filterData}
                                                    HandleFilters={HandleFilters}
                                                    filterReset={filterReset}
                                                    filterSubmit={filterSubmit}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <GateKeeper
                                        requiredModule="Reports"
                                        submenumodule="Report Data"
                                        submenuReqiredPermission="canCreate"
                                    >
                                        <NavLink
                                            to="create-entity-user"
                                            className="btn btn_primary fs-13"
                                        >
                                            <HiMiniPlus /> Add User
                                        </NavLink>
                                    </GateKeeper>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive table-card  border-0">
                            <div className="table-container table-scroll">
                                <CustomTable
                                    data={usersList?.data || []}
                                    columns={columns}
                                    actions={actions}
                                />
                            </div>
                        </div>
                        {/* pagination start */}

                        <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                            <div className="col-sm">
                                <PaginationInfo
                                    data={{
                                        length: usersList?.data?.searchResultStudents,
                                        start: usersList?.pagination?.start,
                                        end: usersList?.pagination?.end,
                                        total: usersList?.pagination?.totalResult,
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
                                        value={usersList?.pagination?.pageSize}
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
                                        currentPage={usersList?.pagination?.currentPage}
                                        totalPages={usersList?.pagination?.totalPages}
                                        // loading={referrals?.loading}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EntityUsers
