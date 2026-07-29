export const initialState = {
    dashboard: null,
    TotalEnrollementDetails: {
        filters: {
            fromDate: "",
            toDate: "",
        },
        filterDate: "",

        loading: false,
        // default month Enrollemnts
        totalNoOfEnrollements: null,
        totalBookingAmount: null,
        totalFeeReceived: null,
        totalFeeYetTOReceived: null,

        PaginatedBranchs: [],                  // branch, enrollments, bookingamount, feeReceived, feeYetTOReceived, 
        PaginatedTopRatedCouncellers: [],             // According to the Branch, it will coming,
        // PaginatedDasboardStudents: [],         // According to the Councellers, it will coming,
    },


    BranchwiseCouncellers: {
        sendBranchDetails: "",
        paginatedBranchwiseCouncellers: [],
        loading: false,
    },

    CouncellerwiseStudents: {
        sendCouncellerDetails: "",
        paginatedCouncellerwiseStudents: [],
        loading: false,
    },


    TotalFeeDetails: {
        filters: {
            fromDate: "",
            toDate: "",
        },
        filterDate :{
            admissionFromDate: "",
            admissionToDate: "",
            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
            toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
        },
        loading: false,
        totalFeeReceived: null,
        totalFeeYetTOReceived: null,
        totalBookingAmount: null,
        PaginatedBranchs: [],                       // total branchs list
        PaginatedTopRatedCouncellers: [],                   // councellers according to  branch(note : get by paticular branch id)
        PaginatedDasboardStudents: [],              // students according to councellers (note : get by councellers id)
    },

    FeeDetailsBranchwiseCouncellers: {
        sendBranchDetails: "",
        paginatedFeeDetailsBranchwiseCouncellers: [],
        loading: false,
    },

    FeeDetailsCouncellerwiseStudents: {
        sendCouncellerDetails: "",
        paginatedFeeDetailsCouncellerwiseStudents: [],
        loading: false,
    },


    TotalUsersInDashboad: {
        loading: false,
        totalNoOfUsers: null,
        totalNoOfActiveUsers: null,
        totalNoOfInActiveUsers: null,
        paginatedBranchesList: [],
        TotalNoOfBranches: null,
    },

    UsersListInBranchWise: {

        branchDetails: "",
        loading: false,
        paginatedUsersListInBranchWise: [],
        totalUsers: null,
    },

    //Enrollment graph
    TotalEnrollmentGraph: {
        loading: false,
        branch: "",
        yearlyEnrollments: null,
        currentmonthEnrollments: null,
        lastMonthEnrollments: null,
        totalEnrollments: null,
        difference: null,
        progressPercentageBranches: null,
        progressEnrollementsCount: null,
        progressPercentageCounsellors: null,

        // new feilds added
        totalBookingAmount: null,
        lastMonthBookingAmount: null,
        lastMonthEnrollmentsAsOnDate: null,
        currentMonthBookingAmountAsOnDate: null,
        currentMonthFeeRecievedAsOnDate: null,

    },


    // feeDetails Graph

    TotalFeeDetailsGraph: {
        loading: false,
        branch: "",
        overallEnrollments: null,

        yearlyFeeReceived: null,      // months
        yearlyFeeYetRecevie: null,     // months

        feeReceiveddifference: null,              // percentage difference
        feeYetToReceiveddifference: null,         // percentage difference

        lastMonthFeeReceived: null,                //last month  fee received
        lastMonthFeeYetToReceived: null,          // last month  fee wnat to recive


        currentFeeReceived: null,               // current fee received
        currentFeeYetToReceived: null,     // current month fee want to recive

        totalFeeReceived: null,
        totalFeeYetToReceive: null,

        totalYearlyFeeReceivedAmount: null,        // year
        totalYearlyFeeYetToReceivedAmount: null,    // year
        progressiveFeeRecevied: null,
        progressiveFeeYettoRecevie: null,
        progressiveFeeReceviedCounsellors: null,


        // new feilds added

        lastThreeMonthsFeeReceived: null,
        lastThreeMonthsFeeYetToReceive: null,


        lastMonthFeeReceivedAsOnDate:null,

        withoutGstCurrentFeeReceived:null,     // new feild withoutGstCurrentFeeReceived

    
        

    },


    // Today Fee Recevied Tab

    TodayFeeRecevied: {
        loading: false,
        todayOverallFeeReceived: null,
        paginatedBranchesList: [],
        paginatedTopRatedCouncellors: [],
        filters: {
            fromDate: new Date().toISOString().split('T')[0],
            toDate: new Date().toISOString().split('T')[0],
        }
    },

    TodayFeeReceviedByCouncellors: {
        paginatedCouncellorsList: [],
        loading: false,
        
        filters:{
            fromDate: new Date().toISOString().split('T')[0],
            toDate: new Date().toISOString().split('T')[0],
            branch:null,
        }
    },
    TodayFeeReceviedByStudents: {
        paginatedStudentsList: [],
        loading: false,
        filters:{
            fromDate: new Date().toISOString().split('T')[0],
            toDate: new Date().toISOString().split('T')[0],
            enquirytakenby:null,
        }
    },

    //liveUsers Count and Students 

    LiveUsersCount : {
        userCount: null,
        activeUsers : [],
        studentcount : null,
        activestudents : [],
        loading:false,
    }
}