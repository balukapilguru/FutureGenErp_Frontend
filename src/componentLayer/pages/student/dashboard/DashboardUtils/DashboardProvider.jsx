
import  { useEffect, useReducer } from "react";
import DashboardReducer from "./DashboardReducer";
import { initialState } from "./utils/DasboardConfig";
import * as Actions from "./utils/DashboardActions"
import * as api from "./utils/DashboardAPIs"



const DashboardProvider = () => {
    const [Dashboardstate, DispatchDashboard] = useReducer(DashboardReducer, initialState)

    const userData = JSON.parse(localStorage.getItem("data"));



    //  ENROLLMENT BRANCHES
    const getTotalEnrollemtDetails = async () => {
        const { filterDate } = Dashboardstate?.TotalEnrollementDetails;
        DispatchDashboard(Actions.setLoading("TOTAL_ENROLLMENT_DETAILS"))
        try {
            const { data, status } = await api.getTotalEnrollmentDeatils(filterDate)
            if (status === 200) {
                DispatchDashboard(Actions.setTotalEnrollmentDetails(data, "TOTAL_ENROLLMENT_DETAILS"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("TOTAL_ENROLLMENT_DETAILS"))
        }
    }

    //  enrollemnt councellers
    const getCouncellersListInTotalEnrollments = async () => {
        const { sendBranchDetails } = Dashboardstate.BranchwiseCouncellers;
        const { filterDate } = Dashboardstate?.TotalEnrollementDetails;
        const mergedObject = { ...sendBranchDetails, ...filterDate };
        DispatchDashboard(Actions.setLoading("TOTAL_ENROLLMENTS_DETAILS_BRANCH_WISE_COUNCELLERS"))

        try {
            const { data, status } = await api.getCouncellersListInTotalEnrollments(mergedObject)
            if (status === 200) {
                DispatchDashboard(Actions.setCouncellersInTotalEnrollments(data, "TOTAL_ENROLLMENTS_DETAILS_BRANCH_WISE_COUNCELLERS"))
            }
        }
        catch (error) {
            console.error(error)
        }
        
        finally {
            DispatchDashboard(Actions.setLoading("TOTAL_ENROLLMENTS_DETAILS_BRANCH_WISE_COUNCELLERS"))
        }

    }

    //  enrollemt students
    const getStudentsListInTotalEnrollments = async () => {
        const { sendCouncellerDetails } = Dashboardstate.CouncellerwiseStudents;
        const { filterDate } = Dashboardstate?.TotalEnrollementDetails;
        const mergedObject = { ...sendCouncellerDetails, ...filterDate };

        DispatchDashboard(Actions.setLoading("TOTAL_ENROLLMENTS_DETAILS_COUNCELLOR_WISE_STUDENTS"))
        try {
            const { data, status } = await api.getStudentsListInTotalEnrollments(mergedObject)
            if (status === 200) {
                DispatchDashboard(Actions.setStudentsInTotalEnrollments(data, "TOTAL_ENROLLMENTS_DETAILS_COUNCELLOR_WISE_STUDENTS"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("TOTAL_ENROLLMENTS_DETAILS_COUNCELLOR_WISE_STUDENTS"))
        }
    }


    //  fee details branches
    const getTotalFeeDetails = async () => {
        const { filterDate } = Dashboardstate.TotalFeeDetails;


        DispatchDashboard(Actions.setLoading("TOTAL_FEE_DETAILS"))
        try {
            const { data, status } = await api.getTotalFeeDetails(filterDate)
            if (status === 200) {
                DispatchDashboard(Actions.setTotalFeeDetails(data, "TOTAL_FEE_DETAILS"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("TOTAL_FEE_DETAILS"))
        }
    }

    //  feeDetails councellors
    const getCouncellorsListInFeeDetails = async () => {
        const { sendBranchDetails } = Dashboardstate?.FeeDetailsBranchwiseCouncellers;
        const { filterDate } = Dashboardstate.TotalFeeDetails;
        const mergedObject = { ...sendBranchDetails, ...filterDate }

        DispatchDashboard(Actions.setLoading("FEE_DETAILS_BRANCH_WISE_COUNCELLORS"))
        try {
            const { data, status } = await api.getCouncellorsListInFeeDetails(mergedObject);
            if (status === 200) {
                DispatchDashboard(Actions.setCouncellorsInFeeDetails(data, "FEE_DETAILS_BRANCH_WISE_COUNCELLORS"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("FEE_DETAILS_BRANCH_WISE_COUNCELLORS"))
        }
    }

    // fee details students

    const getStudentsListInFeeDetails = async () => {
        const { sendCouncellerDetails } = Dashboardstate?.FeeDetailsCouncellerwiseStudents;
        const { filterDate } = Dashboardstate.TotalFeeDetails;
        const mergedObject = { ...sendCouncellerDetails, ...filterDate }



        DispatchDashboard(Actions.setLoading("FEE_DETAILS_COUNCELLORS_WISE_STUDENTS"))

        try {
            const { data, status } = await api.getStudentsListInFeeDetails(mergedObject);
            if (status === 200) {
                DispatchDashboard(Actions.setStudentsListInFeeDetails(data, "FEE_DETAILS_COUNCELLORS_WISE_STUDENTS"))
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            DispatchDashboard(Actions.setLoading("FEE_DETAILS_COUNCELLORS_WISE_STUDENTS"))
        }
    }


    const getAllBranchesListOfTotalUsers = async () => {
        DispatchDashboard(Actions.setLoading("TOTAL_USERS_BRACHES_LIST"))
        try {
            const { data, status } = await api.getAllBranchesListOfTotalUsers();
            if (status === 200) {
                DispatchDashboard(Actions.setAllBranchesListOfTotalUsers(data, "TOTAL_USERS_BRACHES_LIST"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("TOTAL_USERS_BRACHES_LIST"))
        }
    }


    const getAllBranchwiseUsersList = async () => {
        const { branchDetails } = Dashboardstate?.UsersListInBranchWise
        DispatchDashboard(Actions.setLoading("ALL_USERS_LIST_IN_BRANCH_WISE"))
        try {
            const { data, status } = await api.getAllBranchwiseUsersList(branchDetails);
            if (status === 200) {
                DispatchDashboard(Actions.setAllBranchwiseUsersList(data, "ALL_USERS_LIST_IN_BRANCH_WISE"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("ALL_USERS_LIST_IN_BRANCH_WISE"))
        }
    }


    // enrollment Graph

    const totalEnrollmentGraph = async () => {
        const { branch } = Dashboardstate?.TotalEnrollmentGraph;
        DispatchDashboard(Actions.setLoading("TOTAL_ENROLLMENTS_GRAPH"))
        try {
            const { status, data } = await api.getTotalEnrollemetGraph(branch)
            if (status === 200) {
                DispatchDashboard(Actions.setTotalEnrollemetGraph(data, "TOTAL_ENROLLMENTS_GRAPH"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("TOTAL_ENROLLMENTS_GRAPH"))
        }
    }


    // FeeDetails Graph

    const totalFeeDetailsGraph = async () => {
        const { branch } = Dashboardstate?.TotalFeeDetailsGraph;
        DispatchDashboard(Actions.setLoading("TOTAL_FEEDETAILS_GRAPH"))
        try {
            const { status, data } = await api.getFeeDetailsGraph(branch)
            if (status === 200) {
                DispatchDashboard(Actions.setTotalFeeDetailsGraph(data, "TOTAL_FEEDETAILS_GRAPH"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("TOTAL_FEEDETAILS_GRAPH"))
        }
    }


    //  Today Fee Details Tabs Function 
    // today feeRecieved by Branchwise

    const getTodayFeeRecievedByBranchwise = async () => {
        const { filters } = Dashboardstate.TodayFeeRecevied;

        DispatchDashboard(Actions.setLoading("TODAY_FEE_RECEIVED"))
        try {
            const { data, status } = await api.getTodayFeeReceivedByBranchWise(filters)
            if (status === 200) {
                DispatchDashboard(Actions.setTodayFeeReceivedByBranchWise(data, "SET_TODAY_FEE_RECEIVED"))
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            DispatchDashboard(Actions.setLoading("TODAY_FEE_RECEIVED"))
        }
    }


    const getTodayFeeReceivedByCouncellorsWise = async () => {
        const { filters } = Dashboardstate.TodayFeeReceviedByCouncellors;
        DispatchDashboard(Actions.setLoading("TODAY_FEE_RECEIVED_BY_COUNCELLORSWISE"))
        try {
            const { data, status } = await api.getTodayFeeReceivedByCouncellorWise(filters)
            if (status === 200) {
                DispatchDashboard(Actions.setTodayFeeReceivedByCouncellorWise(data, "SET_TODAY_FEE_RECEIVED_BY_COUNCELLORSWISE"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("TODAY_FEE_RECEIVED_BY_COUNCELLORSWISE"))
        }
    }


    const getTodayFeeReceivedByStudentsWise = async () => {
        const { filters } = Dashboardstate.TodayFeeReceviedByStudents;
        DispatchDashboard(Actions.setLoading("TODAY_FEE_RECEIVED_BY_STUDENTS_WISE"))
        try {
            const { data, status } = await api.getTodayFeeReceivedByStudentsWise(filters)
            if (status === 200) {
                DispatchDashboard(Actions.setTodayFeeReceivedByStudentsWise(data, "SET_TODAY_FEE_RECEIVED_BY_STUDENTS_WISE"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchDashboard(Actions.setLoading("TODAY_FEE_RECEIVED_BY_STUDENTS_WISE"))
        }
    }



    useEffect(() => {
        getTotalEnrollemtDetails();
       
        getAllBranchesListOfTotalUsers();
        totalEnrollmentGraph();
        totalFeeDetailsGraph();
        getTodayFeeRecievedByBranchwise();
    }, []);

    useEffect(() => {
        getTotalEnrollemtDetails();
    }, [Dashboardstate?.TotalEnrollementDetails?.filterDate])

    useEffect(() => {
        getCouncellersListInTotalEnrollments();
    }, [Dashboardstate?.BranchwiseCouncellers?.sendBranchDetails,
    Dashboardstate?.TotalEnrollementDetails?.filterDate,
    ])

    useEffect(() => {
        getStudentsListInTotalEnrollments();
    }, [Dashboardstate?.CouncellerwiseStudents?.sendCouncellerDetails,
    Dashboardstate?.TotalEnrollementDetails?.filterDate,
    ])


    useEffect(() => {
        totalEnrollmentGraph();
    }, [Dashboardstate?.TotalEnrollmentGraph?.branch])



    // Total FeeDetails  

    useEffect(() => {
        getTotalFeeDetails();
    }, [Dashboardstate?.TotalFeeDetails?.filterDate
    ])

    useEffect(() => {
        getCouncellorsListInFeeDetails();
    }, [Dashboardstate?.FeeDetailsBranchwiseCouncellers?.sendBranchDetails,
    Dashboardstate?.TotalFeeDetails?.filterDate])


    useEffect(() => {
        getStudentsListInFeeDetails();
    }, [Dashboardstate?.FeeDetailsCouncellerwiseStudents?.sendCouncellerDetails,
    Dashboardstate?.TotalFeeDetails?.filterDate])


    useEffect(() => {
        totalFeeDetailsGraph();
    }, [Dashboardstate?.TotalFeeDetailsGraph?.branch]);



    // Today Fee Received

    useEffect(() => {
        getTodayFeeReceivedByCouncellorsWise();
    }, [Dashboardstate?.TodayFeeReceviedByCouncellors?.filters])


    useEffect(() => {
        getTodayFeeReceivedByStudentsWise();
     
    }, [Dashboardstate?.TodayFeeReceviedByStudents?.filters])







    // total users

    useEffect(() => {
        getAllBranchwiseUsersList();
    }, [Dashboardstate?.UsersListInBranchWise?.branchDetails])






    return {
        Dashboardstate,
        DispatchDashboard,
        getTotalEnrollemtDetails,
        getTotalFeeDetails,
        getCouncellersListInTotalEnrollments,
        getStudentsListInTotalEnrollments,
        getCouncellorsListInFeeDetails,
        getAllBranchesListOfTotalUsers,
        getAllBranchwiseUsersList,
        getStudentsListInFeeDetails,
        totalEnrollmentGraph,
        totalFeeDetailsGraph
    }
}

export default DashboardProvider;