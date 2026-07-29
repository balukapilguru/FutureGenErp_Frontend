import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
export const getDemoRegistrationsLoader = async ({ request,params }) => {
  const {formUuid} = params;
  const url = new URL(request.url);
  try {
    const response = await ERPApi.get(`/demo-enrollment/registrations/form/${formUuid}${url.search}`);
    const demoRegistrations = response.data
    return {demoRegistrations};
  } catch (error) {
    const demoRegistrations = {}
    console.error(error, "Demo Batches error");
    return demoRegistrations
  }
}