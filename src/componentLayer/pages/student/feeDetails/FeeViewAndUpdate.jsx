import { HiMiniPlus } from "react-icons/hi2";
import BackButton from "../../../components/backbutton/BackButton";
import Button from "../../../components/button/Button";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import { Link, useFetcher, useLoaderData } from "react-router-dom";
import GaugeChart from "./GaugeChart";
import { MdCreditScore, MdInfo } from "react-icons/md";
import FormattedDate from "../../../../utils/FormattedDate";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LiaRupeeSignSolid } from "react-icons/lia";
import Swal from "sweetalert2";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";

export const FeeViewAndUpdateLoader = async ({ request, params }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");

    try {
        const [singleStudentData] = await Promise.all([
            ERPApi.get(`/student/viewstudentdata/${studentId}`),
        ]);
        const studentData = singleStudentData?.data?.student[0] || null;
        return { studentData };
    } catch (error) {
        console.error(error);
        return {
            studentData: null,
            error: "Failed to fetch student data. Please try again later.",
        };
    }
};

export const FeeViewAndUpdateAction = async ({ request, params }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");


    // /fee/numOfInstallments/4168

    switch (request.method) {
        case "PUT":
            {
                const data = await request.json();

                const submitType = data?.type;


                try {
                    if (submitType === "UPDATE_DUEDATE_DUEAMOUNT") {
                        const responsePromise = ERPApi.put(
                            `fee/updatingduedateanddueamount/${studentId}`,
                            data
                        );
                        const response = await toast.promise(responsePromise, {
                            pending:
                                "Updating the DueAmount and DueDate of Installments , Please wait...",

                        });

                        if (response?.status === 200) {
                            Swal.fire({
                                title: "Installments Updated!",
                                text: "The Due Dates and Due Amounts for all Installments have been successfully Updated.",
                                icon: "success",
                                confirmButtonColor: "#3085d6",
                            });
                            return { data: response?.data, status: response?.status };
                        }
                    }


                    else if (submitType === "INSTALLMENT_UPDATE") {

                        const IntallmentPromiseErp = ERPApi.put(`/fee/updateInstallment/${studentId}`, data?.installments);
                        // const InstallmentPromiseKapli = ERPApi.put(`/fee/updateInstallment/${studentId}`, data?.installments);


                        const [IntallmentDataErp] = await toast.promise(
                            Promise.all([IntallmentPromiseErp]),
                            {
                                pending: `Updating the Installment Payment of ₹ ${data?.installments?.paidamount}, Please wait...`,
                            }
                        );

                        if (IntallmentDataErp?.status === 200) {
                            localStorage.removeItem("paymentLink");
                            Swal.fire({
                                title: "Payment Successful!",
                                text: `The installment of ₹${data?.installments?.paidamount} has been successfully Updated.`,
                                icon: "success",
                                confirmButtonColor: "#3085d6",
                            });
                            return {
                                IntallmentDataErp: IntallmentDataErp?.data,
                                status: 200
                            };
                        }
                    }

                    else if (submitType === "APPLY_DISCOUNT") {
                        const responsePromise = ERPApi.put(`/fee/addExtraDiscount/${studentId}`,
                            data?.extraDiscount
                        );
                        const response = await toast.promise(responsePromise, {
                            pending: "Adding Discount to DueAmount, Please wait...",
                        });


                        if (response?.status === 200) {
                            Swal.fire({
                                title: "Discount Applied successfully!",
                                text: `A discount has been successfully Applied.`,
                                icon: "success",
                            });
                            return { data: response?.data, status: response?.status };
                        }
                    }
                } catch (error) {
                    console.error(error, "Transaction ID is required for non-cash payments")
                    const message = error?.response?.data?.message;
                    const statusCode = error.response?.data?.status;

                    if (submitType === "UPDATE_DUEDATE_DUEAMOUNT") {
                        Swal.fire({
                            title: "Update Failed!",
                            text: "An error occurred while Updating DueDate and DueAmount of Installments. Please try again.",
                            icon: "error",
                            confirmButtonColor: "#d33",
                        });
                        return { message, statusCode };
                    } else if (submitType === "INSTALLMENT_UPDATE") {
                        Swal.fire({
                            title: "Payment Failed!",
                            text: "There was an Issue Processing the Installment Payment. Please try again.",
                            icon: "error",
                            confirmButtonColor: "#d33",
                        });
                        return { message, statusCode };
                    }
                    else if (submitType === "APPLY_DISCOUNT") {
                        Swal.fire({
                            title: "Discount Failed!",
                            text: "An error occurred while Applying Discount. Please try again.",
                            icon: "error",
                            confirmButtonColor: "#d33",
                        });
                        return { message, statusCode };
                    }

                    return { message, statusCode };
                }
            }
            break;

        case "POST":
            {
                const data = await request.json();
                const submitType = data?.type;
                try {

                    if (submitType === "ADMISSION_FEE") {
                        // Define both API calls
                        const admissionFeeErp = ERPApi.post(`fee/admissionfee/${studentId}`, data);
                        // const admissionFeeKapil = ERPApi.post(`fee/admissionfee/${studentId}`, data); // Replace with actual API URL

                        // Execute both API calls concurrently
                        const [admissionResponseErp] = await toast.promise(
                            Promise.all([admissionFeeErp]),
                            {
                                pending: "Processing the Admission Fee, Please wait...",
                            }
                        );


                        // Check if both API responses are successful
                        if (admissionResponseErp?.status === 201) {
                            Swal.fire({
                                title: "Payment Successful!",
                                text: `The Admission fee of ₹${data?.admissionAmount} has been Paid successfully.`,
                                icon: "success",
                                confirmButtonColor: "#3085d6",
                            });
                            return {
                                admissionData: admissionResponseErp?.data,
                                status: 201
                            };
                        }
                    }



                    else if (submitType === "NO_OF_INSTALLMENTS_UPDATE") {
                        const responsePromise = ERPApi.post(
                            `fee/numOfInstallments/${studentId}`,
                            data
                        );
                        const response = await toast.promise(responsePromise, {
                            pending: "Updating the No Of Installments, Please wait...",
                        });

                        if (response?.status === 201) {
                            Swal.fire({
                                title: "Installment Updated!",
                                text: `The number of installments has been successfully updated to ${data?.installmentNumber}.`,
                                icon: "success",
                                confirmButtonColor: "#3085d6",
                            });

                            return { data: response?.data, status: response?.status };
                        }
                    }
                } catch (error) {
                    console.error(error, "skdjflsdjflsdkjfl")
                    const message = error?.response?.data?.message;
                    const statusCode = error.response?.data?.status;
                    if (submitType === "ADMISSION_FEE") {
                        Swal.fire({
                            title: "Payment Failed!",
                            text: message,
                            icon: "error",
                            confirmButtonColor: "#d33",
                        });
                        return { message, statusCode };
                    } else if (submitType === "NO_OF_INSTALLMENTS_UPDATE") {
                        Swal.fire({
                            title: "Update Failed!",
                            text: "An error occurred while Updating the Installments. Please try again.",
                            icon: "error",
                            confirmButtonColor: "#d33",
                        });
                        return { message, statusCode };
                    }

                    return { message, statusCode };
                }
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

const FeeViewAndUpdate = () => {
    const fetcher = useFetcher();
    const admissionfetcher = useFetcher();

    const data = useLoaderData();
    const { studentData } = data;

    const [userData, setUserData] = useState(() => {
        const data = JSON.parse(localStorage.getItem("data"));
        return data || "";
    });


    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
        return `${year}-${month}-${day}`;
    };

    const [admissionState, setAdmissionState] = useState({
        admissionAmount: 0,
        paiddate: new Date().toISOString().substr(0, 10),
        modeofpayment: "",
        transactionID: "",
        vendarName: "",
    });

    const [NoOfInstallments, setNoOfInstallments] = useState(null);
    const [Installments, setInstallments] = useState([]);

    const allInstallmentDueAmount =
        Installments && Installments.length > 0
            ? Installments.reduce(
                (total, item) => total + (Number(item?.dueamount) || 0),
                0
            ).toLocaleString("en-IN")
            : "0";
    const dueAmount = studentData?.dueamount ? Number(studentData.dueamount) : 0;
    const formattedDueAmount = dueAmount.toLocaleString("en-IN");
    const formattedInstallmentDue = allInstallmentDueAmount
        ? allInstallmentDueAmount.toLocaleString("en-IN")
        : 0;
    const textColor =
        formattedDueAmount !== formattedInstallmentDue ? "red" : "green";

    const showDueDateAndDueAmount = studentData?.installments?.every(
        (item) => (!item.dueamount || item.dueamount <= 0) && !item.duedate
    );







    useEffect(() => {
        if (studentData) {
            if (studentData?.admissionFee && studentData?.admissionFee?.length == 0) {
                let feedetails = studentData?.feedetails;
                let admissiondetails = feedetails?.filter(
                    (item) => item?.feetype === "Admission Fee"
                );
                let getAdmissionFee = admissiondetails[0]?.totalamount;
                setAdmissionState((prev) => ({
                    ...prev,
                    admissionAmount: getAdmissionFee,
                }));
            }
            if (studentData?.installments?.length > 0) {
                setInstallments(studentData?.installments);
            }
        }
    }, [studentData, studentData?.installments]);

    // Admission Fee

    const handleSubmitAdmissionFee = async () => {
        if (
            !admissionState.admissionAmount ||
            admissionState.admissionAmount <= 0
        ) {
            toast.error("Please Enter a valid Admission Fee Amount.");
            return;
        } else if (!admissionState.paiddate) {

            toast.error("Please Select the payment date.");
            return;
        } else if (!admissionState?.modeofpayment) {

            toast.error("Please Select a Mode of payment.");
            return;
        } else if (admissionState?.modeofpayment === "loan") {
            if (!admissionState.vendarName) {
                toast.error("Vendar Name is Required");
                return;
            }
            if (!admissionState?.transactionID) {
                toast.error("Transaction Id is Required");
                return;

            }
            if (admissionState?.transactionID?.replace(/\s/g, '').length < 3) {
                toast.error("Invalid Transaction Id");
                return;
            }
        }
        // else if (admissionState?.modeofpayment !== "loan" || admissionState?.modeofpayment !== "Cash") {

        //     // if (!admissionState?.transactionID) {
        //     //     toast.error("Transaction Id is Required");
        //     //     return;

        //     // }
        //     // if(admissionState?.transactionID?.replace(/\s/g, '').length<3){
        //     //     toast.error("Invalid Transaction Id");
        //     //     return;                                
        //     // }
        // }

        Swal.fire({
            title: "Confirm Admission Fee Payment",
            html: `Are you sure you want to Pay the Admission Fee of <strong>₹${admissionState?.admissionAmount}</strong>?<br>
                   Once confirmed, the Due Amount will be Updated Accordingly.<br><br>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Proceed with Payment",
            cancelButtonText: "No, Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const data = {
                        ...admissionState,
                        studentId: studentData?.id,
                        type: "ADMISSION_FEE",
                    };

                    await admissionfetcher.submit(data, {
                        method: "POST",
                        encType: "application/json",
                    });
                } catch (error) {
                    console.error(error);
                }
            } else {
                toast.info("Admission fee payment was canceled.");
            }
        });
    };

    useEffect(() => {
        if (admissionfetcher?.data?.status) {
            localStorage.removeItem("paymentLink");
        }
    }, [admissionfetcher])

    // Ṇo of Installments Update

    const handleNoOfInstallmentsSubmit = async () => {
        if (!NoOfInstallments) {
            toast.error("Please enter No of Installments");
            return;
        } else if (NoOfInstallments <= 0) {
            toast.error("No of Installments should be greater than 0");
            return;
        }

        let installments = Array(parseInt(NoOfInstallments))
            .fill()
            .map((_, index) => ({
                id: Date.now(),
                installmentNumber: index + 1,
                duedate: "",
                dueamount: 0,
                paidamount: 0,
                paiddate: "",
                modeofpayment: "",
                transactionID: "",
                paymentdone: false,
                subInstallmentNumber: 0,
                // Invoice generation purpose
                invoice: {
                    studentInvoiceNo: "",
                    adminInvoiceNo: "",
                    FeeDetails: [
                        {
                            feeType: "",
                            courseType: "",
                            HSNTYPE: 99843,
                            beforeTaxAmount: 0,
                            taxPer: 0,
                            taxAmount: 0,
                            afterTaxTotalAmount: 0,
                        },
                        {
                            feeType: "",
                            courseType: "",
                            HSNTYPE: 99843,
                            beforeTaxAmount: 0,
                            taxPer: 0,
                            taxAmount: 0,
                            afterTaxTotalAmount: 0,
                        },
                    ],
                    beforeTaxTotalAmount: 0,
                    totalTaxAmount: 0,
                    finalAmount: 0,
                    taxDetails: [
                        {
                            HSNAC: "",
                            taxableValue: 0,
                            CGSTRate: 0,
                            CGSTAmount: 0,
                            SGSTRate: 0,
                            SGSTAmount: 0,
                            totalTaxAmount: 0,
                        },
                    ],
                },
            }));

        let totalinstallments = [
            {
                totalinstallments: parseInt(NoOfInstallments),
                totalinstallmentspaid: 0,
                totalinstallmentsleft: parseInt(NoOfInstallments),
            },
        ];

        Swal.fire({
            title: "Confirm Installments Update",
            html: `Are you sure you want to update the number of installments to <strong>${NoOfInstallments}</strong>?<br>
                   Once confirmed, the installment plan will be updated accordingly.<br><br>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update Installments",
            cancelButtonText: "No, Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const data = {
                        studentId: studentData?.id,
                        installmentNumber: NoOfInstallments,
                        type: "NO_OF_INSTALLMENTS_UPDATE",
                    };

                    await fetcher.submit(data, {
                        method: "POST",
                        encType: "application/json",
                    });
                } catch (error) {
                    console.error(error);
                }
            } else {
                toast.info("Installments Update was canceled.");
            }
        });
    };



    const handleInstallmentUpdate = (index, name, value) => {
        setInstallments((prevInstallments) => {
            const updatedInstallments = [...prevInstallments];
            updatedInstallments[index] = {
                ...updatedInstallments[index],
                [name]: value,
            };
            if (
                (updatedInstallments[index]?.paiddate == null ||
                    updatedInstallments[index]?.paiddate == "") &&
                updatedInstallments[index]?.paidamount > 0
            ) {
                updatedInstallments[index].paiddate = getCurrentDate();
            }
            return updatedInstallments;
        });
    };


    // UPDATE DUEDATE AND DUEAmount
    const handleUpdateDueDateAndDueAmountInstallments = async () => {
        if (Installments?.length > 0) {
            for (let i = 0; i < Installments.length; i++) {
                if (!Installments[i]?.duedate) {
                    toast.error(`Please Select Installment-${i + 1} Date`);
                    return;
                }
            }

            for (let i = 0; i < Installments.length; i++) {
                if (!Installments[i]?.dueamount) {
                    toast.error(`Please Enter Installment-${i + 1} Amount`);
                    return;
                }
            }
        }

        let totalInstallmentAmountUpdated = 0;
        let validateUpdatedDueDateAndDueAmount = true;

        for (let i = 0; i < Installments?.length; i++) {
            if (!Installments[i].duedate || !Installments[i].dueamount) {
                validateUpdatedDueDateAndDueAmount = false;
            }
            totalInstallmentAmountUpdated =
                totalInstallmentAmountUpdated + parseFloat(Installments[i].dueamount);
        }

        if (
            validateUpdatedDueDateAndDueAmount &&
            Number(studentData?.dueamount) === totalInstallmentAmountUpdated
        ) {
            const installments = Installments.map((item, index) => {
                return {
                    id: item?.id,
                    studentId: item?.studentId,
                    user_id: item?.user_id,
                    duedate: item?.duedate,
                    dueamount: item?.dueamount,
                    installmentNumber: item?.installmentNumber,
                };
            });

            Swal.fire({
                title: "Confirm Installment Due Date & Amount Update",
                html: `Are you sure you want to Update the DueDate and DueAmount for the following Installments?<br><br>
                       ${installments
                        .map(
                            (item) =>
                                `<strong>Due Date:</strong> ${new Date(item?.duedate).toLocaleDateString("en-GB").replace(/\//g, "-")} | <strong>Due Amount:</strong> ₹ ${Number(item?.dueamount || 0).toLocaleString("en-IN")} /-`
                        )
                        .join("<br>")}
                       <br><br>Once confirmed, the Installment details will be Updated Accordingly.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Update Installments",
                cancelButtonText: "No, Cancel",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const data = {
                            installments,
                            type: "UPDATE_DUEDATE_DUEAMOUNT",
                        };

                        await fetcher.submit(data, {
                            method: "PUT",
                            encType: "application/json",
                        });
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    toast.info("Installments DueDate and DueAmount Update was canceled.");
                }
            });
        } else if (Number(studentData.dueamount) != totalInstallmentAmountUpdated) {
            toast.error(
                "Sum of all installment amount Should be equal to due amount"
            );
        } else if (!validateUpdatedDueDateAndDueAmount) {
            toast.error("Add Due Date and Due Amount");
        }
    };


    const [suggestInstallmentState, setSuggestInstallments] = useState([]);

    useEffect(() => {
        if (Installments?.length > 0 && studentData) {
            const adjustedInstallmentsLength = Installments.filter(
                (item) => !item?.dueamount
            ).length;
            const addedDueAmount = Installments.reduce(
                (total, item) => total + (Number(item?.dueamount) || 0),
                0
            );
            let dueAmount = studentData.dueamount - addedDueAmount;
            dueAmount = Math.max(dueAmount, 0);
            const suggestInstallments = Installments.map((item) => {
                let eachInstallmentAmount = 0;
                if (!item.dueamount && adjustedInstallmentsLength > 0) {
                    eachInstallmentAmount = Math.max(
                        dueAmount / adjustedInstallmentsLength,
                        0
                    );
                }
                return {
                    installmentNumber: item.installmentNumber,
                    dueamount: item?.dueamount
                        ? item?.dueamount
                        : eachInstallmentAmount.toFixed(0),
                };
            });
            setSuggestInstallments(suggestInstallments);
        }
    }, [Installments, studentData]);

    // Installment Update
    const handleInstallmentSubmit = async (index) => {
        // Validate required fields first
        if (!Installments[index]?.paidamount) {
            toast.error("Please Enter Paid Amount");
            return;
        }
        if (!Installments[index]?.paiddate) {
            toast.error("Please Select the Paid Date");
            return;
        }
        if (!Installments[index]?.modeofpayment) {
            toast.error("Please Select Mode Of Payment");
            return;
        }
        // Transaction ID is required for all payment modes except Cash and loan
        const requiresTransactionID =
            Installments[index]?.modeofpayment !== "Cash" &&
            Installments[index]?.modeofpayment !== "loan" &&
            Installments[index]?.modeofpayment !== "";
        if (requiresTransactionID && !Installments[index]?.transactionID) {
            toast.error("Please Enter Transaction ID");
            return;
        }

        if (
            Installments[index]?.paidamount > 0 &&
            Installments[index]?.paiddate &&
            Installments[index]?.modeofpayment
        ) {
            if (
                Installments[index].paidamount > 0 &&
                Installments[index].paidamount <= parseInt(studentData?.dueamount)
            ) {
                Swal.fire({
                    title: "Confirm Installment Payment",
                    html: `Are you sure you want to pay the Installment of <strong>₹${Installments[index].paidamount}</strong>?<br>
                           Once Confirmed, the Due Amount will be Updated accordingly.<br><br>`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Pay Installment",
                    cancelButtonText: "No, Cancel",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const InstallmentData = Installments[index];

                            const payInstallmentData = {
                                installmentId: InstallmentData?.id,
                                paidamount: InstallmentData?.paidamount,
                                paiddate: InstallmentData?.paiddate,
                                transactionID: InstallmentData?.transactionID,
                                modeofpayment: InstallmentData?.modeofpayment,
                                vendarName: InstallmentData?.vendarName
                            }

                            const data = {
                                installments: payInstallmentData,
                                studentId: studentData?.id,
                                type: "INSTALLMENT_UPDATE",
                            };

                            await fetcher.submit(data, {
                                method: "PUT",
                                encType: "application/json",
                            });

                        } catch (error) {
                            console.error(error);
                        }
                    } else {
                        toast.info("Installment payment canceled.");
                    }
                });
            } else {
                if (Installments[index].paidamount > parseInt(studentData?.dueamount)) {
                    toast.error(
                        "Installment Amount cannot be greater than Total Due Amount"
                    );
                    return;
                } else if (Installments[index].paidamount == 0) {
                    toast.error("Paying Amount should be greater than 0");
                    return;
                } else {
                    toast.error("Error");
                    return;
                }
            }
        }
    };

    const [extraDiscount, setExtraDiscount] = useState(null);

    //  Discount 

    const handleApplyDiscountSubmit = async () => {
        if (!extraDiscount) {
            return toast.error("Please enter a discount amount before applying.");
        } else if (extraDiscount == 0) {
            return toast.error("Discount amount cannot be zero! Please enter a valid amount.");
        } else if (extraDiscount < 0) {
            return toast.error("Discount amount must be a positive number.");
        } else if (extraDiscount > studentData?.dueamount) {
            return toast.error(
                `The Discount Amount Cannot Exceed the Total Due Amount of ₹${studentData?.dueamount} /-`
            );
        }

        // Show Swal modal with SINGLE input field for discount remarks
        const { value: discountRemarks } = await Swal.fire({
            title: "Confirm Discount",
            html: `Are you sure you want to Apply a Discount of <strong>₹${extraDiscount}</strong>?<br>
                   This will reduce the Total Due Amount.<br><br>
                   <strong>New Due Amount: ₹${studentData?.dueamount - extraDiscount}</strong>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Apply Discount",
            cancelButtonText: "No, cancel",
            input: "text",  // ✅ This adds the single input field
            inputPlaceholder: "Enter reason for Discount",
            inputValidator: (value) => {
                if (!value) {
                    return "You must enter a discount reason!";
                }
            }
        });

        // If user confirms and enters a remark
        if (discountRemarks) {
            try {
                const payDiscount = {
                    Discount: extraDiscount,
                    Discount_remarks: discountRemarks, // Save user input
                    date: new Date().toISOString().split("T")[0],
                };

                const data = {
                    extraDiscount: payDiscount,
                    studentId: studentData?.id,
                    type: "APPLY_DISCOUNT",
                };

                await fetcher.submit(data, {
                    method: "PUT",
                    encType: "application/json",
                });

                setExtraDiscount(null)




            } catch (error) {
                console.error(error);
            }
        } else {
            toast.info("Discount Canceled.");
        }
    };

    let serialNumber = 0;
    const isLinkSend = localStorage.getItem("paymentLink")

    const generatePaymentLink = async (installment, isInstallment) => {
        if (isInstallment) {
            try {
                const response = await toast.promise(
                    ERPApi.post("/fee/admissionpaymentlink", {
                        studentId: studentData.id,
                    }),
                    {
                        pending: "Sending payment link...",
                        success: "Payment link Sent successfully 🎉",
                        error: "Failed to send payment link ❌",
                    }
                );
                if (response?.status == 200) {
                    localStorage.setItem("paymentLink", "true");
                }
                return response.data; // useful if caller needs it
            } catch (error) {
                console.error("Payment link error:", error);
                throw error; // important if caller wants to react
            }
        }
        const payload = {
            installmentId: installment.id,
            studentId: installment.studentId,
        };
        try {
            const response = await toast.promise(
                ERPApi.post("student/installmentpaymentlink", payload),
                {
                    pending: "Sending payment link...",
                    success: "Payment link Sent successfully 🎉",
                    error: "Failed to send payment link ❌",
                }
            );

            if (response.data.success) {
                localStorage.setItem("paymentLink", "true");
            }
            return response.data; // useful if caller needs it
        } catch (error) {
            console.error("Payment link error:", error);
            throw error; // important if caller wants to react
        }
    };



    return (
        <div>
            <BackButton heading="Fee View" content="Back" />
            <div className="container-fluid">
                {/* STUDENT DETAILS */}
                <div className="row">
                    <div className="col-lg-7 col-md-12 col-sm-12">
                        <div className="card border-0">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <div>
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color"
                                            >
                                                Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                disabled
                                                type="text"
                                                className="form-control fs-s bg-form txt-color date_input_color"
                                                placeholder="Name of the Student"
                                                value={studentData?.name}
                                                style={{ cursor: "not-allowed" }}
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color"
                                            >
                                                Discount Amount<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                disabled
                                                type="number"
                                                className="form-control fs-s bg-form txt-color date_input_color"
                                                placeholder="Name of the Discount Amount"
                                                value={
                                                    studentData?.extra_discount?.length > 0
                                                        ? studentData?.extra_discount?.reduce(
                                                            (total, item) => total + (item?.Discount || 0),
                                                            0
                                                        )
                                                        : 0
                                                }
                                                style={{ cursor: "not-allowed" }}
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color black_300"
                                            >
                                                Course<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control fs-s bg-form txt-color date_input_color"
                                                placeholder="Enter the Course Name"
                                                value={studentData?.course[0]?.course_name}
                                                disabled
                                                style={{ cursor: "not-allowed" }}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color"
                                            >
                                                Admission Date<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control fs-s bg-form txt-color date_input_color"
                                                placeholder="Enter the Admission Date"
                                                value={studentData?.admissiondate}
                                                disabled
                                                style={{ cursor: "not-allowed" }}
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color"
                                            >
                                                Branch<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="name"
                                                className="form-control fs-s bg-form txt-color date_input_color"
                                                placeholder="Enter the Branch"
                                                value={studentData?.branch}
                                                disabled
                                                style={{ cursor: "not-allowed" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="">
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color"
                                            >
                                                Total Booking Amount
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control fs-s bg-form txt-color date_input_color"
                                                placeholder="Enter The Total Booking Amount"
                                                style={{ cursor: "not-allowed" }}
                                                value={studentData?.finaltotal}
                                                disabled
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color"
                                            >
                                                Final Amount After Discount
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control fs-s bg-form txt-color date_input_color"
                                                placeholder="Enter The Total Amount"
                                                style={{ cursor: "not-allowed" }}
                                                value={
                                                    studentData?.finaltotal -
                                                    (studentData?.extra_discount?.length > 0
                                                        ? studentData?.extra_discount.reduce(
                                                            (total, item) => total + (item?.Discount || 0),
                                                            0
                                                        )
                                                        : 0)
                                                }
                                                disabled
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color"
                                            >
                                                Paid Amount<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control fs-s bg-form txt-color date_input_color"
                                                placeholder="Enter The Paid Amount"
                                                style={{ cursor: "not-allowed" }}
                                                value={studentData?.totalpaidamount}
                                                disabled
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color"
                                            >
                                                Due Amount<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control fs-sbg-form txt-color date_input_color"
                                                placeholder="Enter the Due Amount"
                                                style={{ cursor: "not-allowed" }}
                                                value={studentData?.dueamount}
                                                disabled
                                            />
                                        </div>

                                        {
                                            userData?.user?.profile === "Admin" && (
                                                <>


                                                </>
                                            )

                                        }


                                        <div className="mt-3">
                                            <label
                                                htmlFor="firstNameinput"
                                                className="form-label fs-s fw-medium txt-color"
                                            >
                                                Add Extra Discount {" "} <BsInfoCircle title="Atleast Pay One Installment Then only  Enabled the Discount" />
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control fs-s bg-form txt-color date_input_color"
                                                placeholder="Enter Discount Amount"
                                                onChange={(e) =>
                                                    setExtraDiscount(parseFloat(e.target.value))
                                                }
                                                required
                                                value={extraDiscount ? extraDiscount : null}
                                                onWheel={(e) => e.target.blur()} // Disable changing value with mouse scroll
                                                disabled={!(Installments[0]?.paymentdone === true) || studentData?.dueamount == 0 || userData?.user?.profile !== "Admin"}
                                                style={{ cursor: (!(Installments[0]?.paymentdone === true) || studentData?.dueamount == 0) ? 'not-allowed' : "" }}
                                            />
                                        </div>
                                        <div className=" mb-4 pb-3">
                                            <div className="text-end mt-4">
                                                <Button
                                                    className="btn btn_primary"
                                                    onClick={() => handleApplyDiscountSubmit()}
                                                    disabled={!(Installments[0]?.paymentdone === true) || !extraDiscount}
                                                    style={{ cursor: !(Installments[0]?.paymentdone === true) ? 'not-allowed' : "" }}
                                                >
                                                    {<HiMiniPlus />} Add Extra Discount
                                                </Button>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {studentData && <GaugeChart studentData={studentData} />}
                </div>

                {/* ADDMISSION FEE AND INSTALLMENT FEE */}
                <div className="row">
                    <div className="card border-0">
                        <div className="card-header">
                            <div className="row">
                                {/* ADDMISSION FEE */}

                                {studentData &&
                                    studentData?.admissionFee &&
                                    studentData?.admissionFee?.length == 0 && (
                                        <div className="accordion" id="accordionExample">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingFive">
                                                    <button
                                                        className="accordion-button"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapseTwo"
                                                        aria-expanded="true"
                                                        aria-controls="collapseTwo"
                                                    >
                                                        Admission Fee
                                                    </button>
                                                </h2>
                                                <div
                                                    id="collapseTwo"
                                                    className="accordion-collapse collapse show"
                                                    aria-labelledby="headingFive"
                                                    data-bs-parent="#accordionExample"
                                                >
                                                    <div className="accordion-body">
                                                        <div className="table-responsive table-card table-scroll border-0">
                                                            <table className="table table-centered align-middle table-nowrap equal-cell-table">
                                                                <thead>
                                                                    <tr className="">
                                                                        <th
                                                                            scope="col"
                                                                            className="fs-13 lh_xs fw-600 black_300 "
                                                                        >
                                                                            Admission Fee
                                                                        </th>
                                                                        <th
                                                                            scope="col"
                                                                            className="fs-13 lh_xs black_300 fw-600  "
                                                                        >
                                                                            Paid Date<span className="text-danger">*</span>
                                                                        </th>
                                                                        <th
                                                                            scope="col"
                                                                            className="fs-13 lh_xs black_300 fw-600  "
                                                                        >
                                                                            Mode of Payment<span className="text-danger">*</span>
                                                                        </th>

                                                                        {admissionState?.modeofpayment === "loan" && (
                                                                            <th
                                                                                scope="col"
                                                                                className="fs-13 lh_xs black_300 fw-600  "
                                                                            >
                                                                                Vender Name<span className="text-danger">*</span>
                                                                            </th>
                                                                        )}
                                                                        {admissionState?.modeofpayment === "paymentLink" && (
                                                                            <th
                                                                                scope="col"
                                                                                className="fs-13 lh_xs black_300 fw-600  "
                                                                            >
                                                                                Payment Link<span className="text-danger">*</span>
                                                                            </th>
                                                                        )}
                                                                        {admissionState?.modeofpayment !== "Cash" && admissionState?.modeofpayment !== "" && (
                                                                            <th
                                                                                scope="col"
                                                                                className="fs-13 lh_xs black_300 fw-600  "
                                                                            >
                                                                                Transaction ID<span className="text-danger">*</span>
                                                                            </th>
                                                                        )}

                                                                    </tr>
                                                                </thead>
                                                                <tbody className="">
                                                                    {/* 1st row */}
                                                                    <tr>
                                                                        <td className="fs-13 black_300 fw-500 lh_xs bg_light ">
                                                                            {/* Admission Fee */}
                                                                            <input
                                                                                type="number"
                                                                                className="w-100 form-control fs-s bg-form txt-color"
                                                                                placeholder="Enter admission fee"
                                                                                required
                                                                                id="admissionAmount"
                                                                                name="admissionAmount"
                                                                                value={admissionState?.admissionAmount}
                                                                                disabled
                                                                                style={{ cursor: "not-allowed" }}
                                                                                // onChange={handleInputChange}
                                                                                onChange={(e) =>
                                                                                    setAdmissionState((prev) => ({
                                                                                        ...prev,
                                                                                        admissionAmount: parseInt(
                                                                                            e.target.value
                                                                                        ),
                                                                                    }))
                                                                                }
                                                                                onWheel={(e) => e.target.blur()}
                                                                            />
                                                                        </td>
                                                                        <td className="fs-13 black_300  lh_xs bg_light">
                                                                            {/* Paid Date */}
                                                                            <input
                                                                                type="date"
                                                                                className="w-100 form-control fs-s bg-form txt-color"
                                                                                placeholder="18-Mar-2026"
                                                                                required
                                                                                id="paiddate"
                                                                                name="paiddate"
                                                                                value={admissionState?.paiddate}
                                                                                onChange={(e) =>
                                                                                    setAdmissionState((prev) => ({
                                                                                        ...prev,
                                                                                        paiddate: e.target.value,
                                                                                    }))
                                                                                }
                                                                                max={
                                                                                    new Date().toISOString().split("T")[0]
                                                                                }
                                                                            />
                                                                        </td>
                                                                        <td className="fs-13 black_300  lh_xs bg_light">
                                                                            {/* modeofpayment */}
                                                                            <select
                                                                                className="form-select form-select-lg mb-3 fs-13 mt-3"
                                                                                aria-label=".form-select-lg example"
                                                                                name="modeofpayment"
                                                                                id="modeofpayment"
                                                                                value={admissionState?.modeofpayment}
                                                                                onChange={(e) =>
                                                                                    setAdmissionState((prev) => ({
                                                                                        ...prev,
                                                                                        modeofpayment: e.target.value,
                                                                                    }))
                                                                                }
                                                                                required
                                                                            >
                                                                                <option value="" disabled selected>
                                                                                    {" "}
                                                                                    Select the mode of payment{" "}
                                                                                </option>
                                                                                <option value="UPI">UPI</option>
                                                                                <option value="Cash">Cash</option>
                                                                                <option value="Bank Transfer">
                                                                                    Bank Transfer{" "}
                                                                                </option>
                                                                                <option value="loan">
                                                                                    Loan{" "}
                                                                                </option>
                                                                                <option value="paymentLink">
                                                                                    Payment Link{" "}
                                                                                </option>
                                                                            </select>
                                                                        </td>
                                                                        {admissionState?.modeofpayment === "loan" && (
                                                                            <td className="fs-13 black_300  lh_xs bg_light">
                                                                                <select
                                                                                    className="form-select form-select-lg fs-13"
                                                                                    name="vendarName"
                                                                                    id="vendarName"
                                                                                    value={admissionState?.vendarName || ""}
                                                                                    onChange={(e) =>
                                                                                        setAdmissionState((prev) => ({
                                                                                            ...prev,
                                                                                            vendarName: e.target.value,
                                                                                        }))
                                                                                    }
                                                                                    required
                                                                                >
                                                                                    <option value="" disabled>
                                                                                        Vendor Name
                                                                                    </option>
                                                                                    <option value="Bajaj Finance">Bajaj Finance</option>
                                                                                    <option value="Northern Arc">Northern Arc</option>
                                                                                    <option value="Fibe">Fibe</option>

                                                                                </select>
                                                                            </td>
                                                                        )}
                                                                        {admissionState?.modeofpayment === "paymentLink" && (
                                                                            <td className="fs-13 black_300  lh_xs bg_light">
                                                                                <button
                                                                                    className="btn btn_primary"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        generatePaymentLink(
                                                                                            null,
                                                                                            true
                                                                                        );
                                                                                    }}
                                                                                    disabled={isLinkSend == "true" || isLinkSend == true}
                                                                                >Payment Link</button>
                                                                            </td>
                                                                        )}
                                                                        {admissionState?.modeofpayment !== "Cash" && admissionState?.modeofpayment !== "" &&
                                                                            <td className="fs-13 black_300  lh_xs bg_light">
                                                                                {/* Transation ID */}
                                                                                <input
                                                                                    type="text"
                                                                                    className="w-100 form-control fs-s bg-form txt-color"
                                                                                    placeholder="Enter Transation ID"
                                                                                    name="transactionID"
                                                                                    id="transactionID"
                                                                                    required
                                                                                    value={admissionState?.transactionID}
                                                                                    onChange={(e) =>
                                                                                        setAdmissionState((prev) => ({
                                                                                            ...prev,
                                                                                            transactionID: e.target.value,
                                                                                        }))
                                                                                    }
                                                                                />
                                                                            </td>}
                                                                        <td className="fs-13 black_300 lh_xs bg_light flex-row d-flex mt-3"></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div className="col d-flex justify-content-end mt-3 mb-2">
                                                                {/* submit the admission fee */}
                                                                <Button
                                                                    className="btn btn_primary"
                                                                    // onClick={handleAdmissionFee}
                                                                    onClick={() => handleSubmitAdmissionFee()}
                                                                    disabled={fetcher.state === "submitting"}
                                                                    style={{
                                                                        cursor:
                                                                            fetcher.state === "submitting"
                                                                                ? "not-allowed"
                                                                                : "",
                                                                    }}
                                                                >
                                                                    Update
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* HANDLE NUMBER OF INSTALLMENTS */}

                                {studentData &&
                                    studentData &&
                                    studentData?.admissionFee.length > 0 &&
                                    studentData?.admissionFee[0]?.paymentdone === true &&
                                    studentData?.installments?.length === 0 &&
                                    studentData?.totalinstallments?.length === 0 && (
                                        <>
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2
                                                        className="accordion-header"
                                                        id="No_of_Installments"
                                                    >
                                                        <button
                                                            className="accordion-button"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapseNo_of_Installments"
                                                            aria-expanded="true"
                                                            aria-controls="collapseNo_of_Installments"
                                                        >
                                                            <h6> No Of Fee Installments :</h6>
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapseNo_of_Installments"
                                                        className="accordion-collapse collapse show"
                                                        aria-labelledby="No_of_Installments"
                                                        data-bs-parent="#accordionExample"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className=" ">
                                                                <div className="card border mt-3">
                                                                    <div className="flex-row d-flex justify-content-start my-2">
                                                                        <div className="  ms-3">
                                                                            <label
                                                                                htmlFor="firstNameinput"
                                                                                className="form-label fs-s fw-medium txt-color"
                                                                            >
                                                                                <h6> No Of Fee Installments :</h6>
                                                                            </label>
                                                                        </div>
                                                                        <div className=" col-lg-6 col-md-6  ms-3">
                                                                            <input
                                                                                type="number"
                                                                                className="form-control fs-s bg-form txt-color"
                                                                                placeholder="Enter No.of Installments"
                                                                                value={NoOfInstallments}
                                                                                onChange={(e) => {
                                                                                    let value = parseInt(
                                                                                        e.target.value,
                                                                                        10
                                                                                    );
                                                                                    if (
                                                                                        !isNaN(value) &&
                                                                                        value > 0 &&
                                                                                        value <= 20
                                                                                    ) {
                                                                                        setNoOfInstallments(value);
                                                                                    } else if (e.target.value === "") {
                                                                                        setNoOfInstallments("");
                                                                                    }
                                                                                }}
                                                                                min="1"
                                                                                max="20"
                                                                                onWheel={(e) => e.target.blur()} // Disable changing value with mouse scroll
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col d-flex justify-content-end mb-2 me-1">
                                                                        <Button
                                                                            className="btn btn_primary"
                                                                            onClick={() =>
                                                                                handleNoOfInstallmentsSubmit()
                                                                            }
                                                                            disabled={fetcher.state === "submitting"}
                                                                            style={{
                                                                                cursor:
                                                                                    fetcher.state === "submitting"
                                                                                        ? "not-allowed"
                                                                                        : "",
                                                                            }}
                                                                        >
                                                                            Submit
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                {/* HANDLE DUEDATE AND DUEAMOUNT */}

                                {studentData?.installments?.length > 0 &&
                                    studentData?.admissionFee?.length > 0 ? (
                                    showDueDateAndDueAmount ? (
                                        <div className="row">
                                            <div className="col-lg-6">
                                                {studentData?.dueamount > 0 &&
                                                    Installments?.length > 0 &&
                                                    Array.isArray(Installments) &&
                                                    Installments.map((installment, index) => {
                                                        return (
                                                            <div className="mt-2" key={index + 1}>
                                                                <h2 className="">
                                                                    <h5
                                                                        className="accordion-button collapsed"
                                                                        type="button"
                                                                    >
                                                                        Installment :{" "}
                                                                        {installment?.installmentNumber}
                                                                    </h5>
                                                                </h2>
                                                                <div>
                                                                    <div className="">
                                                                        <form>
                                                                            <div className="row">
                                                                                {/* Installment Date */}
                                                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                                                    <div className="mb-3">
                                                                                        <label
                                                                                            htmlFor="firstNameinput"
                                                                                            className="form-label fs-s fw-medium txt-color"
                                                                                        >
                                                                                            Installment Date
                                                                                            <span className="text-danger">
                                                                                                *
                                                                                            </span>
                                                                                        </label>


                                                                                        <input
                                                                                            type="date"
                                                                                            className="form-control fs-s bg-form txt-color"
                                                                                            placeholder="Installment Date"
                                                                                            name="duedate"
                                                                                            id="duedate"
                                                                                            onChange={(e) =>
                                                                                                handleInstallmentUpdate(index, "duedate", e.target.value)
                                                                                            }
                                                                                            value={installment?.duedate}
                                                                                            required
                                                                                            min={
                                                                                                index === 0
                                                                                                    ? new Date().toISOString().split("T")[0] // First installment starts from today
                                                                                                    : Installments[index - 1]?.duedate // Second installment onwards starts one day after the previous installment
                                                                                                        ? new Date(
                                                                                                            new Date(Installments[index - 1].duedate).setDate(
                                                                                                                new Date(Installments[index - 1].duedate).getDate() + 1
                                                                                                            )
                                                                                                        )
                                                                                                            .toISOString()
                                                                                                            .split("T")[0]
                                                                                                        : new Date().toISOString().split("T")[0]
                                                                                            }
                                                                                            max={
                                                                                                Installments[index + 1]?.duedate // If there's a next installment, max should be one day before it
                                                                                                    ? new Date(
                                                                                                        new Date(Installments[index + 1].duedate).setDate(
                                                                                                            new Date(Installments[index + 1].duedate).getDate() - 1
                                                                                                        )
                                                                                                    )
                                                                                                        .toISOString()
                                                                                                        .split("T")[0]
                                                                                                    : null // If it's the last installment, no max restriction
                                                                                            }
                                                                                        />


                                                                                    </div>
                                                                                </div>

                                                                                {/* Installment Amount */}
                                                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                                                    <div className="mb-3">
                                                                                        <label
                                                                                            htmlFor="firstNameinput"
                                                                                            className="form-label fs-s fw-medium txt-color"
                                                                                        >
                                                                                            Installment Amount
                                                                                            <span className="text-danger">
                                                                                                *
                                                                                            </span>
                                                                                        </label>
                                                                                        <input
                                                                                            type="number"
                                                                                            className="form-control fs-s bg-form txt-color"
                                                                                            placeholder="Installment Amount"
                                                                                            name="dueamount"
                                                                                            id="dueamount"
                                                                                            onChange={(e) =>
                                                                                                handleInstallmentUpdate(
                                                                                                    index,
                                                                                                    "dueamount",
                                                                                                    parseFloat(e.target.value)
                                                                                                )
                                                                                            }
                                                                                            value={installment?.dueamount}
                                                                                            required
                                                                                            onWheel={(e) => e.target.blur()} // Disable changing value with mouse scroll
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                <div className="d-flex justify-content-end mt-3 mb-3">
                                                    <Button
                                                        className="btn btn_primary p-2"
                                                        onClick={
                                                            handleUpdateDueDateAndDueAmountInstallments
                                                        }
                                                        style={{
                                                            cursor:
                                                                fetcher.state === "submitting"
                                                                    ? "not-allowed"
                                                                    : "",
                                                        }}
                                                        disabled={
                                                            fetcher.state === "submitting"
                                                                ? "not-allowed"
                                                                : ""
                                                        }
                                                    >
                                                        Update
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Installment Summary Section */}
                                            <div className="col-lg-6 border pt-2">
                                                <div className="text-center">
                                                    <h5 className="mb-2">Total Installments Amount</h5>
                                                </div>
                                                <div className="card border border-1 sm-shadow p-3">
                                                    <p className="fs-s fw-medium txt-color fw-bold">
                                                        Note: Installments Suggestions
                                                    </p>
                                                    <div className="row d-flex justify-content-center text-center">
                                                        {suggestInstallmentState?.length > 0 &&
                                                            suggestInstallmentState.map((item, index) => (
                                                                <div
                                                                    className="col-6 mb-2 fs-s fw-medium txt-color mx-auto"
                                                                    key={index}
                                                                >
                                                                    Installment - {item?.installmentNumber} :{" "}
                                                                    <LiaRupeeSignSolid />
                                                                    {Number(item?.dueamount || 0).toLocaleString(
                                                                        "en-IN"
                                                                    )}{" "}
                                                                    /-
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>

                                                {/* Installments List */}
                                                {Installments?.length > 0 &&
                                                    Installments.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="mt-3 d-flex justify-content-evenly"
                                                        >
                                                            <div>
                                                                <p>Installment {index + 1}</p>
                                                            </div>
                                                            <div>
                                                                <p>
                                                                    <LiaRupeeSignSolid />{" "}
                                                                    {Number(item?.dueamount || 0).toLocaleString(
                                                                        "en-IN"
                                                                    )}{" "}
                                                                    /-
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                <hr />
                                                <div className="d-flex justify-content-evenly">
                                                    <p
                                                        className="sidebar_color fs-18 fw-600"
                                                        style={{ color: textColor }}
                                                    >
                                                        Total: <LiaRupeeSignSolid /> {formattedDueAmount} /-
                                                    </p>
                                                    <p
                                                        className="sidebar_color fs-18 fw-600"
                                                        style={{ color: textColor }}
                                                    >
                                                        ===
                                                    </p>
                                                    <p
                                                        className="sidebar_color fs-18 fw-600"
                                                        style={{ color: textColor }}
                                                    >
                                                        <LiaRupeeSignSolid /> {formattedInstallmentDue} /-
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                ) : null}

                                {/* HANDLE INSTALLMENT */}

                                {studentData?.installments?.length > 0 &&
                                    studentData?.admissionFee?.length > 0 ? (
                                    !showDueDateAndDueAmount ? (
                                        <div className="accordion" id="accordionExampleOne">
                                            {studentData &&
                                                studentData?.dueamount > 0 &&
                                                studentData?.installments.length > 0 &&
                                                Installments &&
                                                Installments.length > 0 &&
                                                Array.isArray(Installments) &&
                                                Installments?.map((installment, index) => {
                                                    if (installment?.paymentdone === true) {
                                                        return null;
                                                    }
                                                    const collapseId = `collapse_${index}`;
                                                    const headingId = `heading_${index}`;

                                                    return (
                                                        <div
                                                            className="accordion-item mt-2"
                                                            key={index + 1}
                                                        >
                                                            <h2 className="accordion-header" id={headingId}>
                                                                <button
                                                                    className="accordion-button collapsed"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#${collapseId}`}
                                                                    aria-expanded="false"
                                                                    aria-controls="collapseTen"
                                                                >
                                                                    Installment{"  "}{" "}
                                                                    {installment?.installmentNumber}
                                                                    {installment?.subInstallmentNumber ? (
                                                                        <>/ {installment?.subInstallmentNumber}</>
                                                                    ) : null}
                                                                </button>
                                                            </h2>
                                                            <div
                                                                id={collapseId}
                                                                className="accordion-collapse collapse"
                                                                aria-labelledby={headingId}
                                                                data-bs-parent="#accordionExampleOne"
                                                            >
                                                                <div className="accordion-body">
                                                                    <form>
                                                                        <div className="row">
                                                                            <div className=" col-lg-3 col-md-6 col-sm-12 ">
                                                                                {/* installment Date */}
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        htmlFor="firstNameinput"
                                                                                        className="form-label fs-s fw-medium txt-color"
                                                                                    >
                                                                                        Installment Date
                                                                                        <span className="text-danger">
                                                                                            *
                                                                                        </span>
                                                                                    </label>
                                                                                    <input
                                                                                        disabled
                                                                                        style={{ cursor: "not-allowed" }}
                                                                                        type="date"
                                                                                        className="form-control fs-s bg-form txt-color"
                                                                                        placeholder="Installment Date"
                                                                                        name="Installment Date"
                                                                                        // value={value}
                                                                                        // onChange={(e) =>
                                                                                        //     handleInstallmentUpdate(
                                                                                        //         index,
                                                                                        //         "duedate",
                                                                                        //         e.target.value
                                                                                        //     )
                                                                                        // }
                                                                                        value={installment.duedate}
                                                                                        // min={getCurrentDate()}
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {/* installment amount */}
                                                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        htmlFor="firstNameinput"
                                                                                        className="form-label fs-s fw-medium txt-color"
                                                                                    >
                                                                                        Installment Amount
                                                                                        <span className="text-danger">
                                                                                            *
                                                                                        </span>
                                                                                    </label>
                                                                                    <input
                                                                                        disabled
                                                                                        style={{ cursor: "not-allowed" }}
                                                                                        type="number"
                                                                                        className="form-control fs-s bg-form txt-color"
                                                                                        placeholder="Installment Amount"
                                                                                        name="Installment Amount"
                                                                                        // onChange={(e) =>
                                                                                        //     handleInstallmentUpdate(
                                                                                        //         index,
                                                                                        //         "dueamount",
                                                                                        //         parseFloat(e.target.value)
                                                                                        //     )
                                                                                        // }
                                                                                        value={installment.dueamount}
                                                                                        required
                                                                                        onWheel={(e) => e.target.blur()} // Disable changing value with mouse scroll
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {/* PAID DATE */}

                                                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        htmlFor="firstNameinput"
                                                                                        className="form-label fs-s fw-medium txt-color"
                                                                                    >
                                                                                        Paid Date
                                                                                        <span className="text-danger">
                                                                                            *
                                                                                        </span>
                                                                                    </label>
                                                                                    <input
                                                                                        type="date"
                                                                                        className="form-control fs-s bg-form txt-color"
                                                                                        placeholder="Paid Date"
                                                                                        // Disable the next installment's input field if current installment's payment is not done
                                                                                        disabled={
                                                                                            studentData &&
                                                                                            studentData?.installments[
                                                                                            index
                                                                                            ] &&
                                                                                            index > 0 &&
                                                                                            !studentData?.installments[
                                                                                                index - 1
                                                                                            ].paymentdone
                                                                                        }
                                                                                        style={{
                                                                                            cursor:
                                                                                                studentData &&
                                                                                                    studentData.installments[
                                                                                                    index
                                                                                                    ] &&
                                                                                                    index > 0 &&
                                                                                                    !studentData.installments[
                                                                                                        index - 1
                                                                                                    ].paymentdone
                                                                                                    ? "not-allowed"
                                                                                                    : "auto",
                                                                                        }}
                                                                                        name="paiddate"
                                                                                        onChange={(e) =>
                                                                                            handleInstallmentUpdate(
                                                                                                index,
                                                                                                "paiddate",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            installment.paiddate ||
                                                                                            getCurrentDate()
                                                                                        }
                                                                                        max={getCurrentDate()}
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {/* PAID AMOUNT */}

                                                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        htmlFor="firstNameinput"
                                                                                        className="form-label fs-s fw-medium txt-color"
                                                                                    >
                                                                                        Paid Amount
                                                                                        <span className="text-danger">
                                                                                            *
                                                                                        </span>
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form-control fs-s bg-form txt-color"
                                                                                        placeholder="Paid Amount"
                                                                                        name="paidamount"
                                                                                        onChange={(e) =>
                                                                                            handleInstallmentUpdate(
                                                                                                index,
                                                                                                "paidamount",
                                                                                                parseFloat(e.target.value)
                                                                                            )
                                                                                        }
                                                                                        value={installment?.paidamount}
                                                                                        required
                                                                                        // Disable the next installment's input field if current installment's payment is not done
                                                                                        disabled={
                                                                                            studentData &&
                                                                                            studentData?.installments[
                                                                                            index
                                                                                            ] &&
                                                                                            index > 0 &&
                                                                                            !studentData?.installments[
                                                                                                index - 1
                                                                                            ].paymentdone
                                                                                        }
                                                                                        style={{
                                                                                            cursor:
                                                                                                studentData &&
                                                                                                    studentData?.installments[
                                                                                                    index
                                                                                                    ] &&
                                                                                                    index > 0 &&
                                                                                                    !studentData?.installments[
                                                                                                        index - 1
                                                                                                    ].paymentdone
                                                                                                    ? "not-allowed"
                                                                                                    : "auto",
                                                                                        }}
                                                                                        onWheel={(e) => e.target.blur()} // Disable changing value with mouse scroll
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {/* MODE OF PAYMENT */}

                                                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        htmlFor="firstNameinput"
                                                                                        className="form-label fs-s fw-medium txt-color"
                                                                                    >
                                                                                        Mode Of Payment
                                                                                        <span className="text-danger">
                                                                                            *
                                                                                        </span>
                                                                                    </label>
                                                                                    <select
                                                                                        className="form-select form-select-lg mb-3 fs-13"
                                                                                        aria-label=".form-select-lg example"
                                                                                        // Disable the next installment's input field if current installment's payment is not done
                                                                                        disabled={
                                                                                            studentData &&
                                                                                            studentData?.installments[
                                                                                            index
                                                                                            ] &&
                                                                                            index > 0 &&
                                                                                            !studentData.installments[
                                                                                                index - 1
                                                                                            ].paymentdone
                                                                                        }
                                                                                        style={{
                                                                                            cursor:
                                                                                                studentData &&
                                                                                                    studentData.installments[
                                                                                                    index
                                                                                                    ] &&
                                                                                                    index > 0 &&
                                                                                                    !studentData.installments[
                                                                                                        index - 1
                                                                                                    ].paymentdone
                                                                                                    ? "not-allowed"
                                                                                                    : "auto",
                                                                                        }}
                                                                                        name="modeofpayment"
                                                                                        onChange={(e) =>
                                                                                            handleInstallmentUpdate(
                                                                                                index,
                                                                                                "modeofpayment",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            installment?.modeofpayment
                                                                                                ? installment?.modeofpayment
                                                                                                : null
                                                                                        }
                                                                                        required
                                                                                    >
                                                                                        <option value="" disabled selected>
                                                                                            {" "}
                                                                                            Select the mode of payment{" "}
                                                                                        </option>
                                                                                        <option value="UPI">UPI</option>
                                                                                        <option value="Cash">Cash</option>
                                                                                        <option value="Bank Transfer">
                                                                                            Bank Transfer
                                                                                        </option>
                                                                                        <option value="loan">Loan</option>
                                                                                        <option value="paymentLink">Payment Link</option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                            {/* VENDOR LOAN NAME */}
                                                                            {installment?.modeofpayment === "loan" && (
                                                                                <div className="col-lg-3 col-md-6 col-sm-12">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label fs-s fw-medium txt-color">
                                                                                            Vendor Loan
                                                                                            <span className="text-danger">*</span>
                                                                                        </label>
                                                                                        <select
                                                                                            className="form-select form-select-lg mb-3 fs-13"
                                                                                            name="vendarName"
                                                                                            id="vendarName"
                                                                                            value={installment?.vendarName || ""}
                                                                                            onChange={(e) =>
                                                                                                setInstallments((prev) =>
                                                                                                    prev.map((inst, i) =>
                                                                                                        i === index ? { ...inst, vendarName: e.target.value } : inst
                                                                                                    )
                                                                                                )
                                                                                            }
                                                                                            required
                                                                                        >
                                                                                            <option value="" disabled>
                                                                                                Select Loan Vendor
                                                                                            </option>
                                                                                            <option value="Bajaj Finance">Bajaj Finance</option>
                                                                                            <option value="Northern Arc">Northern Arc</option>
                                                                                            <option value="Fibe">Fibe</option>
                                                                                        </select>
                                                                                        
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* TRANSATION ID */}
                                                                            {installment?.modeofpayment !== "Cash" && installment?.modeofpayment !== "" && (
                                                                                <div className="col-lg-3 col-md-6 col-sm-12">
                                                                                    <div className="mb-3">
                                                                                        <label
                                                                                            htmlFor="firstNameinput"
                                                                                            className="form-label fs-s fw-medium txt-color"
                                                                                        >
                                                                                            Transaction ID
                                                                                            <span className="text-danger">
                                                                                                *
                                                                                            </span>
                                                                                        </label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control fs-s bg-form txt-color"
                                                                                            // Disable the next installment's input field if current installment's payment is not done
                                                                                            disabled={
                                                                                                studentData &&
                                                                                                studentData?.installments[
                                                                                                index
                                                                                                ] &&
                                                                                                index > 0 &&
                                                                                                !studentData?.installments[
                                                                                                    index - 1
                                                                                                ].paymentdone
                                                                                            }
                                                                                            style={{
                                                                                                cursor:
                                                                                                    studentData &&
                                                                                                        studentData?.installments[
                                                                                                        index
                                                                                                        ] &&
                                                                                                        index > 0 &&
                                                                                                        !studentData?.installments[
                                                                                                            index - 1
                                                                                                        ]?.paymentdone
                                                                                                        ? "not-allowed"
                                                                                                        : "auto",
                                                                                            }}
                                                                                            placeholder="Transaction ID"
                                                                                            name="transactionID"
                                                                                            onChange={(e) =>
                                                                                                handleInstallmentUpdate(
                                                                                                    index,
                                                                                                    "transactionID",
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                            value={installment?.transactionID}
                                                                                            required
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {installment?.modeofpayment === "paymentLink" && (
                                                                                <div className={`col-lg-3 col-md-6 col-sm-12 mt-4 ${isLinkSend ? "cursor-not-allowed" : "cursor-pointer "}`}
                                                                                    title={isLinkSend ? "Payment Link Already Sent" : ""}>
                                                                                    <button
                                                                                        className={`${isLinkSend ? "cursor-not-allowed" : "cursor-pointer "} btn btn_primary`}
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            generatePaymentLink(installment);
                                                                                        }}
                                                                                        disabled={isLinkSend}
                                                                                    >
                                                                                        Payment Link
                                                                                    </button>

                                                                                </div>
                                                                            )}

                                                                        </div>

                                                                        {/* HANDLE INSTALLMENT UPDATE CLICK */}

                                                                        <Button
                                                                            className="btn btn_primary"
                                                                            onClick={() =>
                                                                                handleInstallmentSubmit(index)
                                                                            }
                                                                            disabled={
                                                                                fetcher.state === "submitting" ||
                                                                                (studentData &&
                                                                                    studentData?.installments[index] &&
                                                                                    index > 0 &&
                                                                                    !studentData?.installments[index - 1]
                                                                                        .paymentdone)
                                                                            }
                                                                            style={{
                                                                                cursor:
                                                                                    fetcher.state === "submitting" ||
                                                                                        (studentData &&
                                                                                            studentData?.installments[index] &&
                                                                                            index > 0 &&
                                                                                            !studentData?.installments[
                                                                                                index - 1
                                                                                            ].paymentdone)
                                                                                        ? "not-allowed"
                                                                                        : "auto",
                                                                            }}
                                                                        >
                                                                            Update
                                                                        </Button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ) : null
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DISPLAY PAID FEE INVOICES */}

                <div className="row">
                    <div className="card border-0">
                        <div className="card-header">
                            <div className="row">
                                <div className="accordion" id="accordionExam">
                                    <div className="accordion-item mt-2">
                                        <h2 className="accordion-header" id="headingFour">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseTwenty"
                                                aria-expanded="false"
                                                aria-controls="collapseTwenty"
                                            >
                                                Paid Fee
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseTwenty"
                                            className="accordion-collapse collapse p-3 "
                                            aria-labelledby="headingThree"
                                            data-bs-parent="#accordionExam"
                                        >
                                            <div className="accordion-body ">
                                                <div className="table-responsive table-card table-scroll border-0">
                                                    <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                                        <thead>
                                                            <tr className="">
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh_xs fw-600  "
                                                                >
                                                                    S.No
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh_xs  fw-600  "
                                                                >
                                                                    Fee Type
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh_xs black_300 fw-600  "
                                                                >
                                                                    Due Date
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh_xs black_300 fw-600  "
                                                                >
                                                                    Due Amount
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh_xs black_300 fw-600"
                                                                >
                                                                    Paid Amount
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh_xs black_300 fw-600"
                                                                >
                                                                    Paid Date
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh_xs black_300 fw-600"
                                                                >
                                                                    Mode of Payment
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh_xs black_300 fw-600"
                                                                >
                                                                    Transaction ID
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh_xs black_300 fw-600"
                                                                >
                                                                    Invoice
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {studentData &&
                                                                studentData?.admissionFee &&
                                                                studentData?.admissionFee?.length > 0 ? (
                                                                studentData?.admissionFee?.map(
                                                                    (item, index) => {
                                                                        if (!item) {
                                                                            return (
                                                                                <>
                                                                                    <tr>
                                                                                        <td className="fs-13 black_300 fw-500 lh_xs bg_light ">
                                                                                            No Data Found
                                                                                        </td>
                                                                                    </tr>
                                                                                </>
                                                                            );
                                                                        }

                                                                        return (
                                                                            <tr key={index + 1}>
                                                                                <td className="fs-13 black_300 fw-500 lh_xs bg_light ">
                                                                                    {index + 1}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    Admission Fee
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    -
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    -
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {item?.admissionAmount}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {FormattedDate(item?.paiddate)}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {item?.modeofpayment}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {item?.transactionID}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light flex-row d-flex">
                                                                                    {item?.invoice &&
                                                                                        item?.invoice?.adminInvoiceNo
                                                                                            ?.length > 0 ? (
                                                                                        <Link
                                                                                            to={`/student/invoice/${studentData?.id}/${index}/Admission Fee/admininvoice`}
                                                                                            className="hover-container"
                                                                                        >
                                                                                            <MdCreditScore
                                                                                                className="eye_icon"
                                                                                                title="Admin"
                                                                                            />
                                                                                        </Link>
                                                                                    ) : (
                                                                                        <>
                                                                                            {/* <Link
                                                                                                to={`/student/invoice/${studentData?.id}/${index}/Admission Fee/admininvoice`}
                                                                                                className="hover-container"
                                                                                            >
                                                                                                <MdCreditScore
                                                                                                    className="eye_icon"
                                                                                                    title="admin"
                                                                                                />
                                                                                            </Link>
                                                                                            <Link
                                                                                                to={`/student/invoice/${studentData?.id}/${index}/Admission Fee/studentinvoice`}
                                                                                            >
                                                                                                <MdCreditScore
                                                                                                    className="eye_icon ms-3"
                                                                                                    title="student"
                                                                                                />
                                                                                            </Link> */}
                                                                                        </>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <tr>
                                                                    <td className="fs-13 black_300 fw-500 lh_xs bg_light ">
                                                                        No Data Found
                                                                    </td>
                                                                </tr>
                                                            )}

                                                            {studentData &&
                                                                studentData?.installments?.length > 0
                                                                ? studentData?.installments?.map(
                                                                    (item, index) => {

                                                                        if (item.paidamount < 1) {
                                                                            return null;
                                                                        }
                                                                        serialNumber++;

                                                                        return (
                                                                            <tr key={index + 1}>
                                                                                <td className="fs-13 black_300 fw-500 lh_xs bg_light ">
                                                                                    {serialNumber + 1}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    Installment{" "}
                                                                                    {item?.installmentNumber}{" "}
                                                                                    {item?.subInstallmentNumber ? (
                                                                                        <>
                                                                                            / {item?.subInstallmentNumber}
                                                                                        </>
                                                                                    ) : null}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {FormattedDate(item?.duedate)}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {Number(
                                                                                        parseFloat(
                                                                                            item?.dueamount
                                                                                        ).toFixed(2)
                                                                                    ).toLocaleString("en-IN")}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {Number(
                                                                                        item?.paidamount
                                                                                    ).toLocaleString("en-IN")}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {FormattedDate(item?.paiddate)}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {item?.modeofpayment}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light">
                                                                                    {item?.transactionID}
                                                                                </td>
                                                                                <td className="fs-13 black_300  lh_xs bg_light flex-row d-flex">
                                                                                    {item?.invoice &&
                                                                                        item?.invoice?.adminInvoiceNo
                                                                                            ?.length > 0 ? (
                                                                                        <Link
                                                                                            to={`/student/invoice/${studentData?.id}/${index}/Installment/admininvoice`}
                                                                                        >
                                                                                            <MdCreditScore
                                                                                                className="eye_icon"
                                                                                                title="admin"
                                                                                            />
                                                                                        </Link>
                                                                                    ) : (
                                                                                        <>
                                                                                            {/* <Link
                                                                                                to={`/student/invoice/${studentData?.id}/${index}/Installment/admininvoice`}
                                                                                            >
                                                                                                <MdCreditScore
                                                                                                    className="eye_icon"
                                                                                                    title="admin"
                                                                                                />
                                                                                            </Link>
                                                                                            <Link
                                                                                                to={`/student/invoice/${studentData?.id}/${index}/Installment/studentinvoice`}
                                                                                            >
                                                                                                <MdCreditScore
                                                                                                    className="eye_icon ms-3 "
                                                                                                    title="student"
                                                                                                />
                                                                                            </Link> */}
                                                                                        </>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )
                                                                : null}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeeViewAndUpdate;

// "initialpayment": [
//                 {
//                     "initialamount": 499,
//                     "paiddate": "2025-01-29",
//                     "modeofpayment": "UPI",
//                     "transactionID": "006827333802",
//                     "paymentdone": true,
//                     "invoice": {
//                         "studentInvoiceNo": "TV0125-1244/1",
//                         "adminInvoiceNo": "TV0125-1244/1",
//                         "FeeDetails": [
//                             {
//                                 "feeType": "Admission Fee",
//                                 "courseType": "Offline",
//                                 "HSNTYPE": 99843,
//                                 "beforeTaxAmount": 422.88,
//                                 "taxPer": 18,
//                                 "taxAmount": 76.12,
//                                 "afterTaxTotalAmount": 499
//                             }
//                         ],
//                         "beforeTaxTotalAmount": 422.88,
//                         "totalTaxAmount": 76.12,
//                         "finalAmount": 499,
//                         "taxDetails": [
//                             {
//                                 "HSNAC": "Offline",
//                                 "beforeTaxAmount": 0,
//                                 "taxableValue": 422.88,
//                                 "CGSTRate": 9,
//                                 "CGSTAmount": 38.06,
//                                 "SGSTRate": 9,
//                                 "SGSTAmount": 38.06,
//                                 "totalTaxAmount": 76.12
//                             }
//                         ]
//                     }
//                 }
//             ]

// "admissionFee": {
//     "id": 4348,
//     "admissionAmount": 500,
//     "paiddate": null,
//     "modeOfPayment": null,
//     "transactionId": null,
//     "paymentDone": true,
//     "invoice": {
//         "FeeDetails": [
//             {
//                 "taxPer": 18,
//                 "HSNTYPE": 99843,
//                 "feeType": "Admission Fee",
//                 "taxAmount": 76.27,
//                 "courseType": "Online",
//                 "beforeTaxAmount": 423.73,
//                 "afterTaxTotalAmount": 500
//             }
//         ],
//         "taxDetails": [
//             {
//                 "HSNAC": "Online",
//                 "CGSTRate": 9,
//                 "SGSTRate": 9,
//                 "CGSTAmount": 38.13,
//                 "SGSTAmount": 38.13,
//                 "taxableValue": 423.73,
//                 "totalTaxAmount": 76.27,
//                 "beforeTaxAmount": 423.73
//             }
//         ],
//         "finalAmount": 500,
//         "adminInvoiceId": "TH0225-1415/1",
//         "totalTaxAmount": 76.27,
//         "beforeTaxTotalAmount": 423.73
//     }
