import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import * as Api from "./batchesUtils/utils/BatchesAPI";

export async function batchesLoader({ request, params }) {
  switch (params.list) {
    case "activelist":
      {
        try {
          const url = new URL(request.url);
          const baseUrl = `/batch/getbatches?filter[batchStatus]=active&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
          const [
            batchesData,
            trainerData,
            curriculumData,
            branchData,
            response,
          ] = await Promise.all([
            ERPApi.get(baseUrl),
            ERPApi.get(`batch/trainer?search=`),
            ERPApi.get(`/batch/curriculum`),
            ERPApi.get(`/settings/getbranch`),
            ERPApi.get(`/placement-preparation/forms`),
          ]);
          const forms = response.data?.forms || [];
          const options = forms.map((reg) => ({
            value: reg.uuid,
            label: reg.registrationformname,
          }));
          const Response = {
            batches: batchesData?.data,
            trainerData: trainerData?.data,
            curriculumData: curriculumData?.data,
            branchData: branchData?.data,
            regForms: options,
          };
          return Response;
        } catch (error) {
          toast.error("Unable to fetch data");
          return { batches: [], trainerData: [], curriculumData: [] };
          // return handleError(error)
        }
      }
      break;
    case "upcominglist":
      {
        try {
          const url = new URL(request.url);
          const baseUrl = `/batch/getbatches?filter[batchStatus]=upcoming&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
          const [batchesData, trainerData, curriculumData, branchData] =
            await Promise.all([
              ERPApi.get(baseUrl),
              ERPApi.get(`batch/trainer?search=`),
              ERPApi.get(`/batch/curriculum`),
              ERPApi.get(`/settings/getbranch`),
            ]);
          const Response = {
            batches: batchesData?.data,
            trainerData: trainerData?.data,
            curriculumData: curriculumData?.data,
            branchData: branchData?.data,
          };
          return Response;
        } catch (error) {
          toast.error("Unable to fetch data");
          return { batches: [], trainerData: [], curriculumData: [] };
        }
      }
      break;
    case "completedlist":
      {
        try {
          const url = new URL(request.url);
          const baseUrl = `/batch/getbatches?filter[batchStatus]=closed&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
          const [batchesData, trainerData, curriculumData, branchData] =
            await Promise.all([
              ERPApi.get(baseUrl),
              ERPApi.get(`batch/trainer?search=`),
              ERPApi.get(`/batch/curriculum`),
              ERPApi.get(`/settings/getbranch`),
            ]);
          const Response = {
            batches: batchesData?.data,
            trainerData: trainerData?.data,
            curriculumData: curriculumData?.data,
            branchData: branchData?.data,
          };
          return Response;
        } catch (error) {
          toast.error("Unable to fetch data");
          return { batches: [], trainerData: [], curriculumData: [] };
          // return handleError(error)
        }
      }

      break;

    case "pendingList":
      {
        try {
          const url = new URL(request.url);
          const baseUrl = `/batch/getbatches?filter[batchStatus]=ending&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
          const [batchesData, trainerData, curriculumData, branchData] =
            await Promise.all([
              ERPApi.get(baseUrl),
              ERPApi.get(`batch/trainer?search=`),
              ERPApi.get(`/batch/curriculum`),
              ERPApi.get(`/settings/getbranch`),
            ]);
          const Response = {
            batches: batchesData?.data,
            trainerData: trainerData?.data,
            curriculumData: curriculumData?.data,
            branchData: branchData?.data,
          };
          return Response;
        } catch (error) {
          toast.error("Unable to fetch data");
          return { batches: [], trainerData: [], curriculumData: [] };
          // return handleError(error)
        }
      }
      break;
    case "selfLearning": {
      try {
        const url = new URL(request.url);
        const baseUrl = `/batch/getbatches?filter[batchStatus]=self-learning&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
        const [batchesData, trainerData, curriculumData, branchData] =
          await Promise.all([
            ERPApi.get(baseUrl),
            ERPApi.get(`batch/trainer?search=`),
            ERPApi.get(`/batch/curriculum`),
            ERPApi.get(`/settings/getbranch`),
          ]);
        const Response = {
          batches: batchesData?.data,
          trainerData: trainerData?.data,
          curriculumData: curriculumData?.data,
          branchData: branchData?.data,
        };
        return Response;
      } catch (error) {
        toast.error("Unable to fetch data");
        return { batches: [], trainerData: [], curriculumData: [] };
        // return handleError(error)
      }
    }

    case "placementPreparation":
      {
        try {
          const url = new URL(request.url);
          const baseUrl = `/batch/getbatches?filter[batchStatus]=placement-preparation&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
          const [batchesData, trainerData, curriculumData, branchData] =
            await Promise.all([
              ERPApi.get(baseUrl),
              ERPApi.get(`batch/trainer?search=`),
              ERPApi.get(`/batch/curriculum`),
              ERPApi.get(`/settings/getbranch`),
            ]);
          const Response = {
            batches: batchesData?.data,
            trainerData: trainerData?.data,
            curriculumData: curriculumData?.data,
            branchData: branchData?.data,
          };
          return Response;
        } catch (error) {
          toast.error("Unable to fetch data");
          return { batches: [], trainerData: [], curriculumData: [] };
          // return handleError(error)
        }
      }
      break;
    case "demoBatches": // 👈 ADD HERE
      {
        try {
          const url = new URL(request.url);
          const baseUrl = `/batch/getbatches?filter[trainingMode]=DEMO_BATCH&filter[batchStatus]=active&${url.search.slice(1)}&page=1&pageSize=10`;

          const [batchesData, trainerData, curriculumData, branchData] =
            await Promise.all([
              ERPApi.get(baseUrl),
              ERPApi.get(`batch/trainer?search=`),
              ERPApi.get(`/batch/curriculum`),
              ERPApi.get(`/settings/getbranch`),
            ]);

          return {
            batches: batchesData?.data,
            trainerData: trainerData?.data,
            curriculumData: curriculumData?.data,
            branchData: branchData?.data,
          };
        } catch (error) {
          toast.error("Unable to fetch data");
          return { batches: [], trainerData: [], curriculumData: [] };
        }
      }
      break;

    default: {
      throw new Response("", { status: 405 });
    }
  }
}
