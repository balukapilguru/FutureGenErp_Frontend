import { useState } from "react";
import Button from "../../../components/button/Button";
import TotalUsersFirstTable from "./totalUsers/TotalUsersFirstTable";
import { getAllBranchwiseUsersList } from "../utils/DataUtilities";
import { useNavigate } from "react-router-dom";

const TotalUsers = ({
    AllBranchesTableData,
    ActiveUsersTabledData,
    StudentsTableData,
    // UsersListInBranchWise,
    totalUsersCount
}) => {
    const navigate = useNavigate()
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [UsersListInBranchWise,setUsersListInBranchWise] = useState()
    const [activeUsersInTotalUsers, setactiveUsersInTotalUsers] = useState()
    const handleBranchSubmitInUsers = async (branch) => {
        setactiveUsersInTotalUsers(branch);
        const response = await getAllBranchwiseUsersList({branch:branch})
        setUsersListInBranchWise(response.data?.users)
    };
    return (
        <div>
            <div>
                <div className=" row ">
                    <TotalUsersFirstTable
                        branchesTableData={AllBranchesTableData}
                        handleBranchSubmitInUsers={handleBranchSubmitInUsers}
                        activeUsersInTotalUsers={activeUsersInTotalUsers}
                        AllBranchesTableData={AllBranchesTableData}
                    />
                    {/* Live Users Table */}
                    <div className="col-lg-6"
                        style={activeUsersInTotalUsers ? { order: 3 } : {}}
                    >
                        <div className="card">
                            <div className="card-header">
                                <div className="card-body">
                                    <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="fs-13">
                                                Active {isDarkMode ? "Users" : "Students"}:{" "}
                                                {isDarkMode
                                                    ? totalUsersCount?.userCount
                                                    : totalUsersCount?.studentcount}
                                            </span>
                                            <span className="fs-13">Total {isDarkMode ? "Users" : "Students"} : { }
                                                {isDarkMode
                                                    ? totalUsersCount?.totalactiveCount
                                                    : totalUsersCount?.totalStudentCount}
                                            </span>
                                            <div>
                                                <div>
                                                    <div>
                                                        <Button
                                                            togglable={true}
                                                            selected={isDarkMode}
                                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                                            className={
                                                                isDarkMode
                                                                    ? " text-light"
                                                                    : "bg-light text-secondary btn-success"
                                                            }
                                                            style={{ backgroundColor: isDarkMode && "#405189" }}

                                                        >
                                                            {isDarkMode ? "Students" : "Users"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                            <thead>
                                                <tr className="">
                                                    <th
                                                        scope="col"
                                                        className="fs-13 lh-xs fw-600 "
                                                    >
                                                        S.No
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="fs-13 lh-xs  fw-600  "
                                                    >
                                                        Name
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="fs-13 lh-xs  fw-600  "
                                                    >
                                                        Mobile
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isDarkMode ? (
                                                    ActiveUsersTabledData &&
                                                        ActiveUsersTabledData?.length > 0 ? (
                                                        ActiveUsersTabledData.map(
                                                            (item, index) => {
                                                                const branch = item?.branchId;

                                                                return (
                                                                    <tr
                                                                        key={index}
                                                                        className={
                                                                            activeUsersInTotalUsers ===
                                                                                item?.branch
                                                                                ? "table-active"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                                            {index + 1}
                                                                        </td>
                                                                        <td
                                                                            className="fs-13 black_300  lh-xs bg_light"
                                                                            style={{ cursor: "pointer" }}
                                                                            // onClick={() =>
                                                                            //     handleBranchSubmitInUsers(
                                                                            //         branch
                                                                            //     )
                                                                            // }
                                                                        >
                                                                            {item?.fullname}
                                                                        </td>
                                                                        <td className="fs-13 black_300  lh-xs bg_light">
                                                                            {item?.phonenumber}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                                No data
                                                            </td>
                                                        </tr>
                                                    )
                                                ) : StudentsTableData &&
                                                    StudentsTableData.length > 0 ? (
                                                    StudentsTableData.map(
                                                        (item, index) => {
                                                            const branch = item?.branchId;

                                                            return (
                                                                <tr
                                                                    key={index}
                                                                    className={
                                                                        activeUsersInTotalUsers ===
                                                                            item?.branch
                                                                            ? "table-active"
                                                                            : ""
                                                                    }
                                                                >
                                                                    <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td
                                                                        className="fs-13 black_300  lh-xs bg_light"
                                                                        style={{ cursor: "pointer" }}
                                                                        // onClick={() =>
                                                                        //     handleBranchSubmitInUsers(
                                                                        //         branch
                                                                        //     )
                                                                        // }
                                                                    >
                                                                        {item?.name}
                                                                    </td>
                                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                                        {item?.mobilenumber}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td className="fs-13 black_300  lh-xs bg_light">
                                                            No data
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Live Users Table */}
                    <div className="col-lg-6"
                    style={activeUsersInTotalUsers ? { order: 2 } : {}}
                    >
                        {/* Branchwise Councelloers */}
                        {UsersListInBranchWise &&
                            UsersListInBranchWise?.length > 0 && (
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-body">
                                            <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                                <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                                    <thead>
                                                        <tr className="">
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs fw-600  "
                                                            >
                                                                S.No
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs fw-600  "
                                                            >
                                                                Username
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs fw-600  "
                                                            >
                                                                Profile
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {UsersListInBranchWise &&
                                                            UsersListInBranchWise?.length > 0 ? (

                                                            UsersListInBranchWise?.map(
                                                                (item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                                                {index + 1}
                                                                            </td>
                                                                            <td className="fs-13 black_300  lh-xs bg_light" style={{ cursor: "pointer" }} onClick={() => navigate(`/user/view/${item.id}`)}>
                                                                                {item?.fullname}
                                                                            </td>
                                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                                                {item?.profile}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )

                                                        ) : (
                                                            <tr className="fs-13 black_300  lh-xs bg_light">
                                                                No data / Select the Branch
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TotalUsers
