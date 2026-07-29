import { toast } from "react-toastify";
import { ERPApi } from "../../../../../serviceLayer/interceptor";
import Swal from "sweetalert2";

// This function handles the final API submission for the enrollment
export const preOnBoardAdmissionAction = async ({ request }) => {
    const formData = await request.formData();
    
        const enrollmentData = JSON.parse(formData.get("enrollementData"));

        try {
            // Using your toast.promise for the API call
            const { data, status } = await toast.promise(
                ERPApi.post(`/student/student_form`, enrollmentData), 
                {
                    pending: "Creating An Enrollment..., Please wait...",
                }
            );

            if (status === 201) {
                // 1. Success! Clear the local storage keys to reset the form for next time
                const keysToRemove = [
                    "PreOnBoardStudentDetails", 
                    "PreOnBoardStudentEducation", 
                    "PreOnBoardAdmissionDetails", 
                    "PreOnBoardBillingSummary", 
                    "PreOnBoardOtherDetails", 
                    "PreOnBoardFeeDetails",
                    "voucherVerified", 
                    "VoucherData", 
                    "voucherCode", 
                    "voucherAmount",
                    "voucherSuccessMessage"
                ];
                keysToRemove.forEach(key => localStorage.removeItem(key));

                // 2. Return success response to the component
                return {
                    success: true,
                    message: "Enrollment Created Successfully",
                    data: data,
                    status: 201,
                    type: "CREATE_ENROLLEMENT",
                };
            }
        } catch (error) {
            console.error("Enrollment Error:", error);
            const errorMessage = error?.response?.data?.message || 
                "We encountered an issue while trying to Create Enrollment. Please Check Everything and Try again....";

            // Show your custom SweetAlert on failure
            Swal.fire({
                title: "Enrollment Failed!",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Retry",
            });

            // Return error as JSON response
            return {
                success: false,
                message: errorMessage,
                status: error?.response?.status || 500
            };
        }
    
    return null;
};