import * as ActionTypes from "./DashboardActionTypes";

// loading of api's
export const setLoading = (context) => ({
    type: ActionTypes.SET_LOADING,
    payload: { context: context }
})

// Total Enrollment Details

export const setTotalEnrollmentDetails = (data, context) => ({           // branchs in total enrollements
    type: ActionTypes.SET_PAGINATED_TOTAL_ENROLLMENT_DETAILS,
    payload: { data: data, context: context }
})
export const setCouncellersInTotalEnrollments = (data, context) => ({    // enrollements councellers
    type: ActionTypes.SET_PAGINATED_TOTAL_ENROLLMENT_DETAILS,
    payload: { data: data, context: context }
})
export const setStudentsInTotalEnrollments = (data, context) => ({       // total enrollment students
    type: ActionTypes.SET_PAGINATED_TOTAL_ENROLLMENT_DETAILS,
    payload: { data: data, context: context }
})

export const setTotalEnrollemetGraph = (data, context) => ({             //enrollement Graph
    type: ActionTypes.SET_PAGINATED_TOTAL_ENROLLMENT_DETAILS,
    payload: { data: data, context: context }
})





// Fee Details

export const setTotalFeeDetails = (data, context) => ({       //  branch list  in fee details
    type: ActionTypes.SET_PAGINATED_FEE_DETAILS,
    payload: { data: data, context: context }
})
export const setCouncellorsInFeeDetails = (data, context) => ({   // fee details councellers list
    type: ActionTypes.SET_PAGINATED_FEE_DETAILS,
    payload: { data: data, context: context }
})
export const setStudentsListInFeeDetails = (data, context) => ({    // fee daetils students list
    type: ActionTypes.SET_PAGINATED_FEE_DETAILS,
    payload: { data: data, context: context }
})

export const setTotalFeeDetailsGraph = (data, context) => ({             //enrollement Graph
    type: ActionTypes.SET_PAGINATED_FEE_DETAILS,
    payload: { data: data, context: context }
})



// Total Users

export const setAllBranchesListOfTotalUsers = (data, context) => ({         // Users branches list
    type: ActionTypes.SET_PAGINATED_TOTAL_USERS,
    payload: { data: data, context: context }
})
export const setAllBranchwiseUsersList = (data, context) => ({                // users branch wise
    type: ActionTypes.SET_PAGINATED_TOTAL_USERS,
    payload: { data: data, context: context }
})


// Todays Fee Received


export const setTodayFeeReceivedByBranchWise = (data, context) => ({       //  branch list  in fee details
    type: ActionTypes.SET_PAGINATED_TODAY_FEE_RECEVIED,
    payload: { data: data, context: context }
})

export const setTodayFeeReceivedByCouncellorWise = (data, context) => ({       //  branch list  in fee details
    type: ActionTypes.SET_PAGINATED_TODAY_FEE_RECEVIED,
    payload: { data: data, context: context }
})

export const setTodayFeeReceivedByStudentsWise = (data, context) => ({       //  branch list  in fee details
    type: ActionTypes.SET_PAGINATED_TODAY_FEE_RECEVIED,
    payload: { data: data, context: context }
})