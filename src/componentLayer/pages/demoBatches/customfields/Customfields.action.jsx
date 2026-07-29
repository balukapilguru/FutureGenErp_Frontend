import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";


// ----------------------------------------------------------------------
// Loader – fetches custom fields (questions)
export const customFieldsLoader = async ({ request }) => {
  const url = new URL(request.url);


  try {
    const response = await ERPApi.get(`/demo-enrollment/questions${url.search}`);

    return {
      customFieldsData: response?.data || { data: [] }
    };

  } catch (error) {
    console.error("Error loading custom fields:", error);

    return {
      customFieldsData: { data: [] }
    };
  }
};
// ----------------------------------------------------------------------
// Action – handles create (POST) and delete (DELETE)
export const customFieldsAction = async ({ request }) => {
    
    const data = await request.json();
    if (!data) return null;

    if (request.method === "DELETE" || data.type === "delete") {
        const deletePromise = ERPApi.delete(`/demo-enrollment/questions/${data.id}`);
        const response = await toast.promise(deletePromise, {
            pending: "Deleting...",
            success: "Deleted Successfully",
            error: "Failed to delete",
        });
        return response.data;
    }

    if (request.method === "POST") {
        try {
            const response = await ERPApi.post(`/demo-enrollment/questions`, data);
            if (response.status === 201) {
                
                return { success: true };
            } else {
                return { error: "Error submitting input" };
            }
        } catch (error) {
            console.error("API error:", error);
            if (error.status === 409) {
                toast.error("Field name already exists");
                return { error: "Field name already exists" };
            }
            return { error: "Internal Server Error" };
        }
    }
    return null;
};

// ----------------------------------------------------------------------
// Additional action for updating a custom field
export const updateCustomFieldAction = async ({ request, params }) => {
    const data = await request.json();
    const { id } = params;
    
    if (!data) return null;

    try {
        const response = await ERPApi.patch(`/demo-enrollment/questions/${id}`, data);
        if (response.status === 200) {
            toast.success("Custom field updated successfully");
            return { success: true };
        }
        return { error: "Error updating field" };
    } catch (error) {
        console.error("API error:", error);
        if (error.status === 409) {
            toast.error("Field name already exists");
            return { error: "Field name already exists" };
        }
        return { error: "Internal Server Error" };
    }
};

// ----------------------------------------------------------------------
// Loader for fetching a single custom field for editing
export const customFieldLoader = async ({ params }) => {
    const { id } = params;
    
    try {
        const response = await ERPApi.get(`/demo-enrollment/questions/${id}`);
        return { customField: response.data };
    } catch (error) {
        console.error("Error loading custom field:", error);
        return { customField: null };
    }
};

// ----------------------------------------------------------------------
// Action for bulk operations if needed
// export const bulkCustomFieldsAction = async ({ request }) => {
//     const data = await request.json();
    
//     if (!data) return null;

//     try {
//         const response = await ERPApi.post(`/placement-preparation/questions/bulk`, data);
//         toast.success("Bulk operation completed successfully");
//         return response.data;
//     } catch (error) {
//         console.error("API error:", error);
//         toast.error("Bulk operation failed");
//         return { error: "Bulk operation failed" };
//     }
// };