
import * as ActionTypes from "./utils/BatchesActionTypes"


const BatchesReducer = (state, action) => {

    switch (action.type) {

        case ActionTypes.SET_PAGINATED_BATCHES:

            if (action?.payload?.context === "ACTIVE_BATCHES_LIST") {

                const reducerData = action?.payload?.data;
                return {
                    ...state,
                    ActiveBatchesList: {
                        ...state.ActiveBatchesList,
                        PaginatedActiveBatches: reducerData?.reversedBatches,
                        searchResultBatches: reducerData?.searchResultBatches,
                        perPage: reducerData?.pageSize,
                        totalBatches: reducerData?.totalBatches,
                        totalPages: reducerData?.totalPages,
                        startBatch: reducerData?.startBatch,
                        endBatch: reducerData?.endBatch,
                        currentPage: reducerData?.currentPage,
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_BATCHES_LIST") {
                const reducerData = action?.payload?.data;

                return {
                    ...state,
                    UpcomingBatchesList: {
                        ...state.UpcomingBatchesList,
                        PaginatedUpcomingBatches: reducerData?.reversedBatches,
                        searchResultBatches: reducerData?.searchResultBatches,
                        perPage: reducerData?.pageSize,
                        totalBatches: reducerData?.totalBatches,
                        totalPages: reducerData?.totalPages,
                        startBatch: reducerData?.startBatch,
                        endBatch: reducerData?.endBatch,
                        currentPage: reducerData?.currentPage,
                    }
                }
            }
            else if (action?.payload?.context === "COMPLETED_BATCHES_LIST") {
                const reducerData = action?.payload?.data;
                return {
                    ...state,
                    CompletedBatchesList: {
                        ...state.CompletedBatchesList,
                        PaginatedCompletedBatches: reducerData?.reversedBatches,
                        searchResultBatches: reducerData?.searchResultBatches,
                        perPage: reducerData?.pageSize,
                        totalBatches: reducerData?.totalBatches,
                        totalPages: reducerData?.totalPages,
                        startBatch: reducerData?.startBatch,
                        endBatch: reducerData?.endBatch,
                        currentPage: reducerData?.currentPage,
                    }
                }
            }
            else if (action?.payload?.context === "PENDING_BATCHES_LIST") {
                const reducerData = action?.payload?.data;
                return {
                    ...state,
                    PendingBatchesList: {
                        ...state.PendingBatchesList,
                        PaginatedPendingBatches: reducerData?.reversedBatches,
                        searchResultBatches: reducerData?.searchResultBatches,
                        perPage: reducerData?.pageSize,
                        totalBatches: reducerData?.totalBatches,
                        totalPages: reducerData?.totalPages,
                        startBatch: reducerData?.startBatch,
                        endBatch: reducerData?.endBatch,
                        currentPage: reducerData?.currentPage,
                    }
                }
            }
            break;

        case ActionTypes?.DELETE_BATCH:
            if (action?.payload?.context === "ACTIVE_BATCHES_LIST") {
                let batchID = action?.payload?.data?.id;
                batchID = parseInt(batchID);
                return {
                    ...state,
                    ActiveBatchesList: {
                        ...state.ActiveBatchesList,
                        PaginatedActiveBatches: state?.ActiveBatchesList?.PaginatedActiveBatches?.filter((batch) => batch?.id !== batchID)
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_BATCHES_LIST") {
                let batchID = action?.payload?.data?.id;
                batchID = parseInt(batchID);
                return {
                    ...state,
                    UpcomingBatchesList: {
                        ...state.UpcomingBatchesList,
                        PaginatedUpcomingBatches: state.UpcomingBatchesList.PaginatedUpcomingBatches.filter((batch) => batch.id !== batchID)
                    }
                }
            }
            else if (action?.payload?.context === "COMPLETED_BATCHES_LIST") {
                let batchID = action?.payload?.data?.id;
                batchID = parseInt(batchID);
                return {
                    ...state,
                    CompletedBatchesList: {
                        ...state.CompletedBatchesList,
                        PaginatedCompletedBatches: state.CompletedBatchesList.PaginatedCompletedBatches.filter((batch) => batch.id !== batchID)
                    }
                }
            }
            else if (action?.payload?.context === "PENDING_BATCHES_LIST") {
                let batchID = action?.payload?.data?.id;
                batchID = parseInt(batchID);
                return {
                    ...state,
                    PendingBatchesList: {
                        ...state.PendingBatchesList,
                        PaginatedPendingBatches: state.PendingBatchesList.PaginatedPendingBatches.filter((batch) => batch.id !== batchID)
                    }
                }
            }
            break;

        case ActionTypes.SET_LOADING:
            if (action?.payload?.context === "ACTIVE_BATCHES_LIST") {

                return {
                    ...state,
                    ActiveBatchesList: {
                        ...state.ActiveBatchesList,
                        loading: !state.ActiveBatchesList.loading
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_BATCHES_LIST") {
                return {
                    ...state,
                    UpcomingBatchesList: {
                        ...state?.UpcomingBatchesList,
                        loading: !state.UpcomingBatchesList.loading
                    }
                }
            }

            else if (action?.payload?.context === "COMPLETED_BATCHES_LIST") {
                return {
                    ...state,
                    CompletedBatchesList: {
                        ...state.CompletedBatchesList,
                        loading: !state.CompletedBatchesList.loading
                    }
                }
            }

            else if (action?.payload?.context === "PENDING_BATCHES_LIST") {
                return {
                    ...state,
                    PendingBatchesList: {
                        ...state.PendingBatchesList,
                        loading: !state.PendingBatchesList.loading
                    }
                }
            }

            break;


        case ActionTypes.SET_SEARCH:
            if (action.payload.context === "ACTIVE_BATCHES_LIST") {
                return {
                    ...state,
                    ActiveBatchesList: {
                        ...state.ActiveBatchesList,
                        search: action.payload.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_BATCHES_LIST") {
                return {
                    ...state,
                    UpcomingBatchesList: {
                        ...state?.UpcomingBatchesList,
                        search: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }
            else if (action?.payload?.context === "COMPLETED_BATCHES_LIST") {
                return {
                    ...state,
                    CompletedBatchesList: {
                        ...state.CompletedBatchesList,
                        search: action.payload.data,
                        currentPage: 1,
                    }
                }
            }
            else if (action?.payload?.context === "PENDING_BATCHES_LIST") {
                return {
                    ...state,
                    PendingBatchesList: {
                        ...state.PendingBatchesList,
                        search: action.payload.data,
                        currentPage: 1,
                    }
                }
            }

            break;

        case ActionTypes?.SET_PER_PAGE:
            if (action?.payload?.context === "ACTIVE_BATCHES_LIST") {
                return {
                    ...state,
                    ActiveBatchesList: {
                        ...state.ActiveBatchesList,
                        perPage: action.payload.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_BATCHES_LIST") {
                return {
                    ...state,
                    UpcomingBatchesList: {
                        ...state?.UpcomingBatchesList,
                        perPage: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "COMPLETED_BATCHES_LIST") {
                return {
                    ...state,
                    CompletedBatchesList: {
                        ...state?.CompletedBatchesList,
                        perPage: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "PENDING_BATCHES_LIST") {
                return {
                    ...state,
                    PendingBatchesList: {
                        ...state?.PendingBatchesList,
                        perPage: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            break;


        case ActionTypes.SET_CUSTOM_PAGE:

            if (action.payload?.context === "ACTIVE_BATCHES_LIST") {
                return {
                    ...state,
                    ActiveBatchesList: {
                        ...state.ActiveBatchesList,
                        currentPage: action.payload.data,
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_BATCHES_LIST") {
                return {
                    ...state,
                    UpcomingBatchesList: {
                        ...state?.UpcomingBatchesList,
                        currentPage: action?.payload?.data
                    }
                }
            }

            else if (action?.payload.context === "COMPLETED_BATCHES_LIST") {
                return {
                    ...state,
                    CompletedBatchesList: {
                        ...state?.CompletedBatchesList,
                        currentPage: action.payload.data
                    }
                }
            }

            else if (action?.payload.context === "PENDING_BATCHES_LIST") {
                return {
                    ...state,
                    PendingBatchesList: {
                        ...state?.PendingBatchesList,
                        currentPage: action.payload.data
                    }
                }
            }
            break;

        case ActionTypes.SET_FILTERS:

            if (action?.payload?.context === "ACTIVE_BATCHES_LIST") {

                return {
                    ...state,
                    ActiveBatchesList: {
                        ...state?.ActiveBatchesList,
                        filters: action?.payload?.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_BATCHES_LIST") {
                return {
                    ...state,
                    UpcomingBatchesList: {
                        ...state?.UpcomingBatchesList,
                        filters: action?.payload?.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            else if (action?.payload?.context === "COMPLETED_BATCHES_LIST") {
                return {
                    ...state,
                    CompletedBatchesList: {
                        ...state.CompletedBatchesList,
                        filters: action.payload.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            else if (action?.payload?.context === "PENDING_BATCHES_LIST") {
                return {
                    ...state,
                    PendingBatchesList: {
                        ...state.PendingBatchesList,
                        filters: action.payload.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }
            break;

            
        default:
            return state;
    }

}
export default BatchesReducer;