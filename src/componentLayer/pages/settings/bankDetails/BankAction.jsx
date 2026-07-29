import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import { redirect } from "react-router-dom";

//bankdetails post and edit
export const bankDetailsAction = async ({ request, params }) => {
  const formData = await request.formData();
  const type = formData.get("type");

  if (type === "ifscverify") {
    const IFSC = formData.get("IFSC");

    try {
      const { data } = await toast.promise(
        ERPApi.post('/settings/validateifsc', { IFSC }),
        {
          pending: "verifying IFSC...",
          success: "IFSC verifying successfully!",
          error: "Failed to verify IFSC.",
        }
      );
    
      return data;
    } catch (error) {
      console.error("IFSC Verification Error:", error);
      toast.error("IFSC verification failed.");
      return { success: false, message: "IFSC verification failed." };
    }
  }

  if (type === "bankDetails") {
    const bankDetails = Object.fromEntries(formData.entries());
    delete bankDetails.type;
    const { id } = params;

    try {
      const response = await toast.promise(
        id 
          ? ERPApi.patch(`/bank/updateById/${id}`, bankDetails, {
              headers: { 'Content-Type': 'application/json' },
            })
          : ERPApi.post('/bank/add', bankDetails),
        {
          pending: id ? "Updating..." : "Creating...",
          success: id ? "Updated successfully!" : "Created successfully!",
          error: id ? "Failed to update." : "Failed to create.",
        }
      );
    
      return redirect("/settings/bankDetails");
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred.");
      return { success: false, message: id ? "Bank update failed." : "Bank creation failed." };
    }
  }

  return { success: false, message: "Invalid action type." };
};

//delete bank details 
export const bankDetailsDeleteAction = async ({ request }) => {
  const data = (await request.json()) || null;
  const bankId = data?.id
  const response = await ERPApi.delete(`/bank/delete/${bankId}`)
  await toast.promise(
    Promise.resolve(response),
    {
      pending: "Deleting...",
      success: "Deleted Successfully"
    })
  return response.data
}