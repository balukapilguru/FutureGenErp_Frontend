import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";

export const batchManagementDashboardLoader = async ({ request, params }) => {
  try {
    const [
      branchListResponse,
      batchCountResponse,
      batchInfoResponse,
      upcomingBatchesResponse,
      matrixResponse,
      curriculums,
      regFormsresponse,
    ] = await Promise.allSettled([
      ERPApi.get(`/settings/getbranch`),
      ERPApi.get(`/batch/dashboard/batchcount`),
      ERPApi.get(`/batch/dashboard/batchinfo`),
      ERPApi.get(`/batch/dashboard/upcoming`),
      ERPApi.get(`/batch/dashboard/metrics`),
      ERPApi.get(`/batch/curriculum`),
      ERPApi.get(`/placement-preparation/forms`),
    ]);


    // Helper to handle individual results
    const getDataOrToast = (result, label) => {
      if (result.status === "fulfilled") {
        return result.value.data;
      } else {
        console.error(`${label} API failed:`, result.reason);
        // toast.error(`${label} data failed to load`);
        return null; // or [] / {} depending on what you expect
      }
    };

    return {
      branches: getDataOrToast(branchListResponse, "Branches"),
      batchCount: getDataOrToast(batchCountResponse, "Batch Count"),
      batchInfo: getDataOrToast(batchInfoResponse, "Batch Info"),
      upcomingBatches: getDataOrToast(
        upcomingBatchesResponse,
        "Upcoming Batches",
      ),
      metrics: getDataOrToast(matrixResponse, "Metrics"),
      curriculums: getDataOrToast(curriculums, "curriculums"),
      regForms: getDataOrToast(regFormsresponse, "response"),
    };
  } catch (error) {
    console.error("Dashboard loader unexpected error:", error);
    toast.error("Something went wrong while loading the dashboard");
    return {};
  }
};
