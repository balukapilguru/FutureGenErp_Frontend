import { ERPApi } from "../../../../serviceLayer/interceptor"

export const departmentLoader = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const response = await ERPApi.get(`/settings/getdepartment${url.search}`);

        return {
            DepartmentList: response?.data || []  // Return the data, or an empty array if not present
        };
    } catch (error) {
        console.error('Error loading departments:', error); // Log the error for debugging
        return {
            DepartmentList: []  // Return an empty array in case of an error
        };
    }
};
export const departmentCreateLoader = async ({ params }) => {
  const { id } = params;

  if (!id) return null;

  try {
    const response = await ERPApi.get(
      `${import.meta.env.VITE_API_URL}/settings/getdepartment/${id}`
    );
    return {
        department: response.data
    };
  } catch (error) {
    console.error("Error fetching department details:", error);
    // Optionally, throw to let React Router errorElement handle it
    throw error;
  }
};
