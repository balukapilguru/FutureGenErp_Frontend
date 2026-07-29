import React, { useEffect, useState } from 'react'
import FeeDetailFirstTable from './feeDetailsTables/FeeDetailFirstTable'
import FeeDetailsSecoundTable from './feeDetailsTables/FeeDetailsSecoundTable'
import { getCouncellersListInTotalEnrollments } from '../../dashboard/DashboardUtils/utils/DashboardAPIs'
import { getCurrentMonthDates } from '../utils/DataUtilities'
import FeeDetailsStudentTable from './feeDetailsTables/FeeDetailsStudentTable'

const FeeDetailsTables = ({
    userData,
    FirstTableData,
    secondTableData,
    handleCouncellorSubmitfeeDetails,
    activeCouncellorFeeDetails,
    activeBranchFeeDetails,
    handleBranchSubmitFeeDetails,
    StudentData

}) => {


    const [branchData, setBranchData] = useState()
    useEffect(() => {
        setBranchData(FirstTableData?.branches)
    }, [FirstTableData])


    //||||||||||||||||||||||||||||||||||||||||||||||||||||||
    ///////////////////////First Table Data/////////////////
    //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\




    //////////////////////////////////////////////////////
    //********************Student Table Data and Functions
    // **************************************************** */





    return (
        <div>
            {userData &&
                userData?.user &&
                userData?.user?.profile !== "Counsellor" &&
                userData?.user?.profile !== "counsellor" && (
                    <>
                        {/* FeeDetails Branches Table */}
                        <FeeDetailFirstTable
                            branchData={branchData}
                            handleBranchSubmitFeeDetails={handleBranchSubmitFeeDetails}
                            activeBranchFeeDetails={activeBranchFeeDetails}
                        />

                        {/* Feedetails TopRated Councellors && Councellors Table */}

                        <FeeDetailsSecoundTable
                            secoundTableData={secondTableData}
                            activeCouncellorFeeDetails={activeCouncellorFeeDetails}
                            handleCouncellorSubmitfeeDetails={handleCouncellorSubmitfeeDetails}
                        />
                    </>
                )}
            <FeeDetailsStudentTable studentData={StudentData} />
        </div>
    )
}

export default FeeDetailsTables
