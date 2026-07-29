import React, { useEffect, useState } from 'react'
import TodayFeeReceivedTables from './TodayFeeReceivedTables'
import { getStudentsListInFeeDetails, getTodayDate } from '../utils/DataUtilities';

const TodayFeeReceived = ({ userData, branchData, counsellorData, handleBranchTodayFeeRecevied, todayFeedetailsActiveBranch }) => {
    const [studentData, setStudendData] = useState()
    const [activeCouncellorTodayFeeRecevied, setActiveCouncellorTodayFeeRecevied] = useState();
    const handleCouncellorIdTodayFeeRecevied = async (enquirytakenby) => {
        const today = getTodayDate();
        setActiveCouncellorTodayFeeRecevied(enquirytakenby);
        const response = await getStudentsListInFeeDetails({
            enquirytakenby: enquirytakenby,
            fromDate: today,
            toDate: today
        })
        setStudendData(response?.data?.students)
    };
    useEffect(() => {
        setStudendData([])
    }, [counsellorData])


    useEffect(() => {
        if (userData?.user?.profile === "Counsellor" ||
            userData?.user?.profile === "counsellor") {
            const fetchStudents = async () => {
                const today = getTodayDate();
                const response = await getStudentsListInFeeDetails({
                    enquirytakenby: userData?.user?.id,
                    fromDate: today,
                    toDate: today
                })
                setStudendData(response?.data?.students)
            }
            fetchStudents()
        }
    }, [])



    return (
        <div>
            <TodayFeeReceivedTables
                userData={userData}
                branchTableData={branchData}
                counsellorTableData={counsellorData}
                handleBranchTodayFeeRecevied={handleBranchTodayFeeRecevied}
                todayFeedetailsActiveBranch={todayFeedetailsActiveBranch}
                activeCouncellorTodayFeeRecevied={activeCouncellorTodayFeeRecevied}
                handleCouncellorIdTodayFeeRecevied={handleCouncellorIdTodayFeeRecevied}
                studentTableData={studentData}
            />
        </div>
    )
}

export default TodayFeeReceived