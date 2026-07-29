import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import Swal from "sweetalert2";
import { redirect } from "react-router-dom";


export const StudentRegistrationFromAction = async ({ request, params }) => {

    const requestData = await request.json();
    const type = requestData.type;




    switch (request.method) {
        case "POST":

            if (type === "SEND_OTP_TO_EMAIL") {
                {
                    const updatedData = {
                        email: requestData.email
                    };
                    try {
                        const { data, status } = await toast.promise(ERPApi.post(`/student/sendotp`, updatedData), {
                            pending: "Sending OTP to Email Address., Please wait...",
                        });

                        if (status === 200) {
                            return {
                                success: true,
                                message: "Send OTP to Email Address Successfully",
                                data: data,
                                status: 200,
                                type: "SEND_OTP_TO_EMAIL",
                            }
                        }

                    } catch (error) {
                        console.error(error)
                        const errorMessgae = error?.response?.data?.message || "We encountered an issue while trying to send the OTP to your email. Please check your email address and try again."
                        Swal.fire({
                            title: "Email Sending Failed!",
                            text: errorMessgae,
                            icon: "error",
                            confirmButtonText: "Retry",
                        });
                        return new Response(JSON.stringify({ success: false, message: errorMessgae }), {
                            status: 500,
                            headers: { "Content-Type": "application/json" },
                        });
                    }
                }
            }

            else if (type === "VERIFY_OTP_TO_EMAIL") {
                {
                    const updatedData = {
                        email: requestData.email,
                        emailOtp: requestData.emailOtp
                    };



                    try {
                        const { data, status } = await toast.promise(ERPApi.post(`/student/validateotp`, updatedData), {
                            pending: "Verifing the OTP..., Please wait...",
                        });

                        if (status === 200) {
                            return {
                                success: true,
                                message: "OTP Verified Successfully!",
                                data: data,
                                status: 200,
                                type: "VERIFY_OTP_TO_EMAIL",
                            }
                        }

                    } catch (error) {
                        console.error(error);
                        const errorMessgae = error?.response?.data?.message || "The OTP you entered is incorrect or expired. Please try again."
                        Swal.fire({
                            title: "OTP Verification Failed!",
                            text: errorMessgae,
                            icon: "error",
                            confirmButtonText: "Retry",
                        });
                        return new Response(JSON.stringify({ success: false, message: errorMessgae }), {
                            status: 500,
                            headers: { "Content-Type": "application/json" },
                        });
                    }
                }

            }


            else if (type === "CREATE_ENROLLEMENT") {
                {
                    const updatedData = requestData.enrollementData



                    try {
                        const { data, status } = await toast.promise(ERPApi.post(`/student/student_form`, updatedData), {
                            pending: "Creating An Enrollment..., Please wait...",
                        });

                        if (status === 201) {

                            

                            return {
                                success: true,
                                message: "Enrollment Created Successfully",
                                data: data,
                                status: 200,
                                type: "CREATE_ENROLLEMENT",
                            }
                        }

                    } catch (error) {
                        console.error(error,"Student Enrollment Error")
                        const errorMessgae = error?.response?.data?.error || "We encountered an issue while trying to Create Enrollment. Please Check Everything and Try again...."
                        Swal.fire({
                            title: "Enrollment Failed!",
                            text: errorMessgae,
                            icon: "error",
                            confirmButtonText: "Retry",
                        });
                        return new Response(JSON.stringify({ success: false, message: errorMessgae }), {
                            status: 500,
                            headers: { "Content-Type": "multipart/form-data" },
                        });
                    }
                }
            }

            else if (type === "GET_COURSES_LIST") {
                {
                    const coursepackageId = requestData?.coursepackageId
                    try {

                        const { data, status } = await toast.promise(ERPApi.get(`batch/course/getcoursesfromcoursepackage/${coursepackageId}`), {
                            pending: "Courses Loading.., Please wait...",
                        });

                        if (status === 200) {
                            return {
                                success: true,
                                message: "Courses Loaded Successfully",
                                data: data,
                                type: "GET_COURSES_LIST",
                                status: status,
                            }
                        }

                    } catch (error) {

                        console.error(error)
                        return new Response(JSON.stringify({ success: false, message: "An error occurred while updating user status." }), {
                            status: 500,
                            headers: { "Content-Type": "application/json" },
                        });
                    }
                }
            }



            break;

        case "PUT":
            {
                const requestData = (await request.json()) || null;
                try {
                    const response = await ERPApi.put(`/user/userstatus/${requestData.id}`, requestData);
                    if (response.status === 200 || response.status === 204) {
                        return new Response(JSON.stringify({ success: true, message: "User status updated successfully!" }), {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        });
                    }
                    return new Response(JSON.stringify({ success: false, message: "Failed to update user status." }), {
                        status: response.status,
                        headers: { "Content-Type": "application/json" },
                    });
                } catch (error) {
                    return new Response(JSON.stringify({ success: false, message: "An error occurred while updating user status." }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }
            break;


        case "PATCH":
            {
                const requestData = (await request.json()) || null;
                try {
                    const response = await ERPApi.put(`/user/userstatus/${requestData.id}`, requestData);
                    if (response.status === 200 || response.status === 204) {
                        return new Response(JSON.stringify({ success: true, message: "User status updated successfully!" }), {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        });
                    }
                    return new Response(JSON.stringify({ success: false, message: "Failed to update user status." }), {
                        status: response.status,
                        headers: { "Content-Type": "application/json" },
                    });
                } catch (error) {
                    return new Response(JSON.stringify({ success: false, message: "An error occurred while updating user status." }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }
            break;



        default: {
            throw new Response("", { status: 405 });
        }
    }
};