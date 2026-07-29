import { ERPApi } from "../../../../serviceLayer/interceptor";

export const RolesListLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  const payload = {
    ...Object.fromEntries(url.searchParams)
  };

  try {
    const { data, status } = await ERPApi.post(`/roles/getroles`, payload);
    // const { data, status } = await ERPApi.post(`/roles/getallpaginatedroles`, payload);

    // Check if the response status is OK (200)
    if (status === 200) {
      const rolesList = data || {};
      return { rolesList };
    } else {
      throw new Error("Failed to fetch roles");
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { rolesList: {} };
    ;
  }
};
