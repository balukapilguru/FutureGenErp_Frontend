import { useEffect, useReducer } from "react";
import BatchesReducer from "./BatchesReducer";
import { initialState } from "./utils/BatchesConfig";
import * as Actions from "./utils/BatchesActions";
import * as Api from "./utils/BatchesAPI";


const useBatchesProvider = () => {

    const [BatchesState, DispatchBatches] = useReducer(BatchesReducer, initialState);

    const getPaginatedActiveBatches = async () => {
        const { filters, perPage, search, currentPage } = BatchesState.ActiveBatchesList;
        DispatchBatches(Actions.setLoading("ACTIVE_BATCHES_LIST"))
        try {
            const { data, status } = await Api.getActiveBatches(currentPage, perPage, search, filters);
            if (status === 200) {
                DispatchBatches(Actions.setPaginatedActiveBatches(data, "ACTIVE_BATCHES_LIST"))
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            DispatchBatches(Actions.setLoading("ACTIVE_BATCHES_LIST"))
        }
    }


    const getPaginatedUpcomingBatchs = async () => {
        const { filters, perPage, search, currentPage } = BatchesState?.UpcomingBatchesList;
        DispatchBatches(Actions.setLoading("UPCOMING_BATCHES_LIST"))
        try {
            const { data, status } = await Api.getUpCompingBatches(currentPage, perPage, search, filters)
            if (status === 200) {
                DispatchBatches(Actions.setPaginatedUpcomingBatches(data, "UPCOMING_BATCHES_LIST"))
            }
        }
        catch (error) {
        }
        finally {
            DispatchBatches(Actions.setLoading("UPCOMING_BATCHES_LIST"))
        }
    }

    const getPaginatedCompletedBatches = async () => {
        const { filters, perPage, search, currentPage } = BatchesState?.CompletedBatchesList;
        DispatchBatches(Actions.setLoading("COMPLETED_BATCHES_LIST"))
        try {
            const { data, status } = await Api.getCompltedBatches(currentPage, perPage, search, filters);
            if (status === 200) {
                DispatchBatches(Actions.setPaginatedCompltedBatches(data, "COMPLETED_BATCHES_LIST"))
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            DispatchBatches(Actions.setLoading("COMPLETED_BATCHES_LIST"))
        }
    }

    const getPaginatedPendingBatches = async () => {
        const { filters, perPage, search, currentPage } = BatchesState?.PendingBatchesList;
        DispatchBatches(Actions.setLoading("PENDING_BATCHES_LIST"))
        try {
            const { data, status } = await Api.getPendingBatches(currentPage, perPage, search, filters);
            if (status === 200) {
                DispatchBatches(Actions.setPaginatedPendingBatches(data, "PENDING_BATCHES_LIST"))
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            DispatchBatches(Actions.setLoading("PENDING_BATCHES_LIST"))
        }
    }


 

    useEffect(() => {
        getPaginatedActiveBatches();
    }, [BatchesState.ActiveBatchesList.search,
    BatchesState.ActiveBatchesList.perPage,
    BatchesState.ActiveBatchesList.currentPage,
    BatchesState.ActiveBatchesList.filters
    ]);


    useEffect(() => {
        getPaginatedUpcomingBatchs();
    }, [BatchesState.UpcomingBatchesList.search,
    BatchesState.UpcomingBatchesList.perPage,
    BatchesState.UpcomingBatchesList.currentPage,
    BatchesState.UpcomingBatchesList.filters
    ]);

    useEffect(() => {
        getPaginatedCompletedBatches();
    }, [BatchesState.CompletedBatchesList.search,
    BatchesState.CompletedBatchesList.perPage,
    BatchesState.CompletedBatchesList.currentPage,
    BatchesState.CompletedBatchesList.filters
    ]);


    useEffect(() => {
        getPaginatedPendingBatches();
    }, [BatchesState.PendingBatchesList.search,
    BatchesState.PendingBatchesList.perPage,
    BatchesState.PendingBatchesList.currentPage,
    BatchesState.PendingBatchesList.filters
    ]);



    return {
        BatchesState,
        DispatchBatches,
        getPaginatedActiveBatches,
        getPaginatedUpcomingBatchs,
        getPaginatedCompletedBatches,
        getPaginatedPendingBatches,
    }


}
export default useBatchesProvider;