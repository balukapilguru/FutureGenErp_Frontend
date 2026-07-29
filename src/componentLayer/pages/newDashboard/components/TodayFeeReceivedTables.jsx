import React from 'react'
import TodayFeeFirstTable from './todayFeeReceivedTables/TodayFeeFirstTable';
import TodayFeeSecondTable from './todayFeeReceivedTables/TodayFeeSecondTable';
import TodayFeeStudentTable from './todayFeeReceivedTables/TodayFeeStudentTable';

const TodayFeeReceivedTables = ({
    userData,
    branchTableData,
    counsellorTableData,
    studentTableData,
    handleBranchTodayFeeRecevied,
    todayFeedetailsActiveBranch,
    activeCouncellorTodayFeeRecevied,
    handleCouncellorIdTodayFeeRecevied

}) => {
    return (
        <div>
            {userData &&
                userData?.user &&
                userData?.user?.profile !== "Counsellor" &&
                userData?.user?.profile !== "counsellor" && (
                    <>
                        {/* Today Fee Recevied Branches Table */}
                        <TodayFeeFirstTable
                            todayFeeBranchesList={branchTableData}
                            handleBranchTodayFeeRecevied={handleBranchTodayFeeRecevied}
                            activeBranchTodayFeeRecevied={todayFeedetailsActiveBranch}
                        />

                        {/* Feedetails TopRated Councellors && Councellors Table */}

                        <TodayFeeSecondTable
                            todayFeeCounsellorList={counsellorTableData}
                            activeCouncellorTodayFeeRecevied={activeCouncellorTodayFeeRecevied}
                            handleCouncellorIdTodayFeeRecevied={handleCouncellorIdTodayFeeRecevied}
                        />

                    </>
                )}

            {/* Feedetails Students  table */}
            <TodayFeeStudentTable TodayFeeStudentTableData={studentTableData} />
        </div>
    )
}

export default TodayFeeReceivedTables