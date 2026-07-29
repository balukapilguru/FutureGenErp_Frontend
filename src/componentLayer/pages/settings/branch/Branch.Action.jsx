import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import axios, { Axios } from "axios";

export const BranchFromAction = async ({ request, params }) => {


  const url = new URL(request.url);
  const branchId = url.searchParams.get("branchId");



  switch (request.method) {
    case "POST":


      try {
        const contentType = request.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          // Handle JSON request
          const verificationIFSC = await request.json();

          const responsePromise = ERPApi.post(`/settings/validateifsc`, verificationIFSC);
          const response = await toast.promise(responsePromise, {
            pending: "Verifing the IFSC code, Please wait...",
            success: {
              render({ data }) {
                const successMessage = data?.response?.data?.message || "Verified IFSC  successfully!";
                return successMessage;
              },
            },
            error: {
              render({ data }) {
                const errorMessage = data?.response?.data?.message || "Something went wrong. Please try again.";
                return errorMessage;
              },
            },
          });

          if (response?.status === 201) {
            return { data: response?.data, status: response?.status, type: "VERIFY_IFSC" };
          }

        }

        else if (contentType && contentType.includes("multipart/form-data")) {
          // Handle FormData request
          const formData = await request.formData();

          const responsePromise = ERPApi.post(`/settings/addbranch`, formData);
          const response = await toast.promise(responsePromise, {
            pending: "Creating the Branch, Please wait...",
            success: {
              render({ data }) {
                const successMessage = data?.response?.data?.message || "Created the Branch successfully!";
                return successMessage;
              },
            },
            error: {
              render({ data }) {
                const errorMessage = data?.response?.data?.message || "Something went wrong. Please try again.";
                return errorMessage;
              },
            },
          });

          if (response?.status === 201) {
            return { data: response?.data, status: response?.status, type: "BRANCH_CREATION" };
          }
        }
        else {
          // Unsupported Content-Type
          throw new Error("Unsupported Content-Type");
        }
      } catch (error) {
        const contentType = request.headers.get("Content-Type");



        if (contentType && contentType.includes("application/json")) {

          const message = error?.response?.data?.message || "IFSC Verification Failed!";
          const statusCode = error?.response?.status || 500;
          const type = "VERIFY_IFSC";
          return { message, statusCode, type };

        }
        else if (contentType && contentType.includes("multipart/form-data")) {
          const message = error.response?.data?.message || "Branch Creation Failed!";
          const statusCode = error.response?.data?.status || 500;
          console.error("Error handling the request:", error);
          return { message, statusCode };

        }
      }
      break;


    case "PUT":
      try {

        // /settings/updatebranch/${id}
        const formData = await request.formData();
        const responsePromise = ERPApi.put(`/settings/updatebranch/${branchId ? branchId : params?.id}`, formData);
        const response = await toast.promise(responsePromise, {
          pending: "Updating the Branch, Please wait...",
          success: {
            render({ data }) {
              const successMessage = data?.response?.data?.message || "Updated the Branch successfully!";
              return successMessage;
            },
          },
          error: {
            render({ data }) {
              const errorMessage = data?.response?.data?.message || "Something went wrong. Please try again.";
              return errorMessage;
            },
          },
        });

        if (response?.status === 200) {
          return { data: response?.data, status: response?.status, type: "BRANCH_UPDATE" };
        }
      }
      catch (error) {
        const message = error.response?.data?.message || "Branch Creation Failed!";
        const statusCode = error.response?.data?.status || 500;
        console.error("Error handling the request:", error);
        return { message, statusCode };
      }
      break;

    case "PATCH":



      try {
        const data = await request.json();



        const responsePromise = ERPApi.patch(`/settings/addbank/${branchId ? branchId : null}`, data);
        const response = await toast.promise(responsePromise, {
          pending: "Branch Creating , Please wait...",
          success: {
            render({ data }) {
              const successMessage = data?.response?.data?.message || "Branch Created successfully!";
              return successMessage;
            },
          },
          error: {
            render({ data }) {
              const errorMessage = data?.response?.data?.message || "Something went wrong. Please try again.";
              return errorMessage;
            },
          },
        });

        if (response?.status === 201) {


          return { data: response?.data, status: response?.status, type: "BANK_DETAILS" };
        }

      }
      catch (error) {
        const message = error?.response?.data?.message || "Branch Creation Failed!";
        const statusCode = error?.response?.status || 500;
        const type = "BANK_DETAILS";
        return { message, statusCode, type };
      }

      break;





    default:
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      });
  }
};



export const BranchListAction = async ({ request, params }) => {
  switch (request.method) {
    case "DELETE":
      {
        const data = (await request.json()) || null;
        const branchId = data?.id
        // const
        try {
          const responsePromise = ERPApi.delete(`/settings/deletebranch/${branchId}`);
          const response = await toast.promise(responsePromise, {
            pending: "Branch Deleting.., Please wait...",
            success: {
              render({ data }) {
                const successMessage = data?.response?.data?.message || "Branches Deleted successfully!";
                return successMessage;
              },
            },
            error: {
              render({ data }) {
                const errorMessage = data?.response?.data?.message || "Something went wrong. Please try again!.";
                return errorMessage;
              },
            },
          });
          if (response?.status === 200) {
            return { data: response?.data, status: response?.status };
          }

        }
        catch (error) {
          const message = error?.response?.data?.message || "Branch Deleted Failed";
          const statusCode = error?.response?.status || 500;
          return { message, statusCode };
        }
      }
  }

}



