import { toast } from "react-toastify";
import { ERPApi } from "../../../serviceLayer/interceptor";

export const reportDataAction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  try {
    const { data, status } = await ERPApi.delete(`/reports/deletereport/${id}`);

    if (status === 200) {
      toast.success("Report deleted successfully!");
      return Response.json({ success: true });
    } else {
      toast.error("Failed to delete report. Please try again.");
      return Response.json({ success: false });
    }
  } catch (error) {
    console.error("Error deleting report:", error);
    toast.error("Failed to delete report. Please try again.");
    return Response.json({ success: false, error: error.message });
  }
};
