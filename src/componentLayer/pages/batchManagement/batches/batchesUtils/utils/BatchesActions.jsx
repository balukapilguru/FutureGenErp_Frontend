


import * as ActionTypes from "./BatchesActionTypes"

export const setLoading = (context) => ({
    type: ActionTypes.SET_LOADING,
    payload: { context: context }
})

// Active Batches List
export const setPaginatedActiveBatches=(data, context)=>({
    type: ActionTypes.SET_PAGINATED_BATCHES,
    payload:{data:data, context:context}
})


export const setPaginatedUpcomingBatches=(data, context)=>({
    type: ActionTypes.SET_PAGINATED_BATCHES,
    payload:{data:data, context:context}
})

export const setPaginatedCompltedBatches=(data, context)=>({
    type: ActionTypes.SET_PAGINATED_BATCHES,
    payload:{data:data, context:context}
})

export const setPaginatedPendingBatches=(data, context)=>({
    type: ActionTypes.SET_PAGINATED_BATCHES,
    payload:{data:data, context:context}
})




