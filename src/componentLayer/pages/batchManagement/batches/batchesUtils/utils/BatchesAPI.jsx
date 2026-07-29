import { ERPApi } from "../../../../../../serviceLayer/interceptor.jsx";

// Active Batches
export const getActiveBatches = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `/batch/getbatches?filter[batchStatus]=active&page=${currentPage}&pageSize=${perPage}&search=${search}&filter[trainingMode]=${
    filters?.trainingMode
  }&filter[curriculum]=${
    filters?.curriculum?.value ? filters?.curriculum?.value : ""
  }&filter[branch]=${filters?.branch}&filter[trainer]=${
    filters?.trainerName?.value ? filters?.trainerName?.value : ""
  }&filter[startDate]=${filters?.fromDate}&filter[endDate]=${filters?.toDate}`;
  return ERPApi.get(url);
};

// Upcoming Batches
export const getUpCompingBatches = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `/batch/getbatches?filter[batchStatus]=upcoming&page=${currentPage}&pageSize=${perPage}&search=${search}&filter[trainingMode]=${
    filters?.trainingMode
  }&filter[curriculum]=${
    filters?.curriculum?.value ? filters?.curriculum?.value : ""
  }&filter[branch]=${filters?.branch}&filter[trainer]=${
    filters?.trainerName?.value ? filters?.trainerName?.value : ""
  }&filter[startDate]=${filters?.fromDate}&filter[endDate]=${filters?.toDate}`;
  return ERPApi.get(url);
};

// Completed Batches
export const getCompltedBatches = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `/batch/getbatches?filter[batchStatus]=closed&page=${currentPage}&pageSize=${perPage}&search=${search}&filter[trainingMode]=${
    filters?.trainingMode
  }&filter[curriculum]=${
    filters?.curriculum?.value ? filters?.curriculum?.value : ""
  }&filter[branch]=${filters?.branch}&filter[trainer]=${
    filters?.trainerName?.value ? filters?.trainerName?.value : ""
  }&filter[startDate]=${filters?.fromDate}&filter[endDate]=${filters?.toDate}`;
  return ERPApi.get(url);
};


// Pending Batches
export const getPendingBatches = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `/batch/getbatches?filter[batchStatus]=ending&page=${currentPage}&pageSize=${perPage}&search=${search}&filter[trainingMode]=${
    filters?.trainingMode
  }&filter[curriculum]=${
    filters?.curriculum?.value ? filters?.curriculum?.value : ""
  }&filter[branch]=${filters?.branch}&filter[trainer]=${
    filters?.trainerName?.value ? filters?.trainerName?.value : ""
  }&filter[startDate]=${filters?.fromDate}&filter[endDate]=${filters?.toDate}`;
  return ERPApi.get(url);
};
