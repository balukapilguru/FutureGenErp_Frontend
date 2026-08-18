import React, { useState, useEffect, useRef } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import { IoMdArrowBack, IoMdCheckmark, IoMdMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { PiAtBold } from "react-icons/pi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ERPApi } from "../../../../../serviceLayer/interceptor";
import { useAuthContext } from "../../../../../dataLayer/hooks/useAuthContext";

const formatSimpleDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
};

const PreOnBoardPreview = ({ activeStep, onNavigate }) => {
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const componentRefff = useRef();

    const [allData, setAllData] = useState({
        student: {}, education: {}, admission: {}, billing: {}, others: {}, rawFees: []
    });


    useEffect(() => {
        const student = JSON.parse(localStorage.getItem("PreOnBoardStudentDetails")) || {};
        const education = JSON.parse(localStorage.getItem("PreOnBoardStudentEducation")) || {};
        const admission = JSON.parse(localStorage.getItem("PreOnBoardAdmissionDetails")) || {};
        const billing = JSON.parse(localStorage.getItem("PreOnBoardBillingSummary")) || {};
        const others = JSON.parse(localStorage.getItem("PreOnBoardOtherDetails")) || {};
        const rawFees = JSON.parse(localStorage.getItem("PreOnBoardFeeDetails")) || [];

        setAllData({ student, education, admission, billing, others, rawFees });
    }, []);


    const handlePDFAndCleanup = async (responseData) => {

        // Check if registration number exists in the response
        const registrationNumber = responseData?.studentId?.registrationnumber ||
            responseData?.registrationnumber ||
            responseData?.student?.registrationnumber ||
            "N/A";
        const input = componentRefff.current;
        if (!input) return;

        try {
            // Create a temporary div with the response data for PDF generation
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = input.innerHTML; // Clone the structure

            // You might need to update the registration number in the cloned content
            // This is a bit complex - better to use the next approach

            // Using higher scale for PDF quality
            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/jpeg", 0.7);
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const pdfBlob = pdf.output("blob");
            const pdfFile = new File([pdfBlob], `Student_Application_${registrationNumber}.pdf`, { type: "application/pdf" });
            const formData = new FormData();
            formData.append("pdf", pdfFile);
            formData.append("email", responseData?.email || allData.student?.email || "");
            formData.append("mobilenumber", responseData?.mobilenumber || allData.student?.mobilenumber || "");
            formData.append("studentName", responseData?.name || allData.student?.name || "");
            formData.append("registrationNumber", registrationNumber);

            await toast.promise(ERPApi.post(`/student/sendstudentpdf`, formData), {
                pending: "Sending Application PDF...",
                success: "PDF sent successfully!",
                error: "Failed to send PDF"
            });

            localStorage.removeItem("PreOnBoardStudentDetails")
            localStorage.removeItem("PreOnBoardStudentEducation")
            localStorage.removeItem("PreOnBoardAdmissionDetails")
            localStorage.removeItem("PreOnBoardBillingSummary")
            localStorage.removeItem("PreOnBoardOtherDetails")
            localStorage.removeItem("PreOnBoardFeeDetails")
            localStorage.removeItem("mailSent")
            localStorage.removeItem("emailVerified")
            localStorage.removeItem("emailVerificationState")
            localStorage.removeItem("voucherVerified");
            localStorage.removeItem("voucherSuccessMessage");
            localStorage.removeItem("voucherCode");
            localStorage.removeItem("voucherAmount");
            localStorage.removeItem("VoucherData");
            await Swal.fire({ title: "Enrollment Successful!", icon: "success" });
            navigate(`/student/feeUpdate?studentId=${responseData?.studentId?.id}`);
        } catch (error) {
            // navigate(`/student/feeUpdate?studentId=${responseData?.studentId?.id}`);
        }
    };

    const handleSubmitEnrollment = () => {
        const assetKeys = {};
        if (allData.others.assets) {
            allData.others.assets.forEach(a => assetKeys[a] = "on");
        }

        const finalPayload = {
            ...allData.student, ...allData.education, ...allData.admission, ...allData.others, ...assetKeys,
            leadsource: [{ source: allData.admission.leadsource, name: allData.admission.referralName || "", mobileNumber: allData.admission.referralMobile || "" }],
            feedetails: allData.rawFees?.map(f => ({ ...f, feetype: f.feetype === "Course Fee" ? "fee" : f.feetype })),
            feedetailsbilling: allData.billing.feedetailsbilling,
            totaldiscount: allData.billing.totaldiscount,
            grosstotal: allData.billing.grosstotal,
            totalfeewithouttax: allData.billing.totalfeewithouttax,
            totaltax: allData.billing.totaltax,
            grandtotal: allData.billing.grandtotal,
            materialfee: allData.billing.materialfee,
            finaltotal: allData.billing.finaltotal,
            dueamount: allData.billing.finaltotal,
            status: 1,
            totalinstallments: 0,
            certificate_status: [{ courseStartDate: "", courseEndDate: "", certificateStatus: "", requistedDate: "", issuedDate: "" }]
        };

        fetcher.submit({ type: "CREATE_ENROLLEMENT", enrollementData: JSON.stringify(finalPayload) }, { method: "post" });
    };

    useEffect(() => {

        if (fetcher.state === "idle" && fetcher.data?.success && fetcher.data?.type === "CREATE_ENROLLEMENT") {

            const responseData = fetcher.data.data;   // flat response

            setAllData(prev => ({

                ...prev,   // keep all existing nested objects (education, admission, ...)

                student: {

                    ...prev.student,   // keep all original student fields

                    // Add/update fields from the flat response

                    id: responseData.id || responseData.studentId?.id || prev.student.id,

                    registrationnumber: responseData.registrationnumber ||

                        responseData.studentId?.registrationnumber ||

                        responseData.student?.registrationnumber ||

                        prev.student.registrationnumber,

                    name: responseData.name || prev.student.name,

                    email: responseData.email || prev.student.email,

                    mobilenumber: responseData.mobilenumber || prev.student.mobilenumber,

                    // add any other fields that might have been updated

                }

            }));

            // Wait a moment for the state to propagate, then generate PDF

            setTimeout(() => {

                handlePDFAndCleanup(responseData);

            }, 100);

        }

    }, [fetcher.state, fetcher.data]);

    // const updateHiddenDivWithResponseData = (responseData) => {
    //     const hiddenDiv = componentRefff.current;
    //     if (!hiddenDiv) return;

    //     // Find the registration number element in the hidden div and update it
    //     // This is a bit hacky but will work
    //     const regNumberElements = hiddenDiv.querySelectorAll('td');
    //     for (let el of regNumberElements) {
    //         if (el.textContent.includes('Reg Number')) {
    //             // Find the next td element which contains the registration number
    //             const nextTd = el.nextElementSibling;
    //             if (nextTd) {
    //                 nextTd.textContent = responseData?.studentId?.registrationnumber || 
    //                                      responseData?.registrationnumber || 
    //                                      responseData?.student?.registrationnumber || 
    //                                      "N/A";
    //             }
    //             break;
    //         }
    //     }
    // };

    // Then in your useEffect:
    // useEffect(() => {
    //     if (fetcher.state === "idle" && fetcher.data?.success && fetcher.data?.type === "CREATE_ENROLLEMENT") {
    //         const responseData = fetcher.data.data;
    //         setAllData(responseData);

    //         // Update the hidden div content with the registration number
    //         setTimeout(() => {
    //             handlePDFAndCleanup(responseData);
    //         }, 100);
    //     }
    // }, [fetcher.state, fetcher.data]);
    // Shared Template Component (The exact UI from Application 6)
    const FullApplicationHTML = ({ data }) => {
        const BirthDate = formatSimpleDate(data.student?.birthdate);
        const EnquiryDate = formatSimpleDate(data.admission?.enquirydate);
        const AdmissionDate = formatSimpleDate(data.admission?.admissiondate);
        const CourseStartDate = formatSimpleDate(data.admission?.validitystartdate);
        const ExpectedEndDate = formatSimpleDate(data.admission?.validityenddate);
        const { AuthState } = useAuthContext();
        const branchLogoImage = AuthState?.user
        const branchLogo = branchLogoImage?.branch_setting?.logoName
            ? `https://teksacademy.s3.ap-south-1.amazonaws.com/branches/logos/${branchLogoImage?.branch_setting?.logoName}`
            : null;

        return (
            <div className="application-template bg-white p-5 text-dark text-start" style={{ fontFamily: "serif", fontSize: "13px", lineHeight: "1.4" }}>
                <div className="row border-bottom pb-2">
                    <div className="col-7">
                        <h5 className="fw-bold m-0" style={{ fontSize: "18px" }}>Futuregen Technologies Private Limited</h5>
                        <p className="m-0 small">PAN : AALFF5087H</p>
                        <p className="m-0 small"><IoMdMail />  info@futuregentechnologies.com</p>
                        <p className="m-0 small"><IoCall /> 91 98489 47799</p>
                        <p className="m-0 small"><PiAtBold /> www.futuregentechnologies.com</p>
                    </div>
                    <div className="col-5 text-end">
                        <img src={branchLogo} alt="Logo" style={{ width: "180px" }} />
                        <p className="fw-bold mt-2 me-4">Branch: {data.admission?.branch}</p>
                    </div>
                </div>

                <h6 className="text-center p-1 mt-3 border bg_primary text white fw-bold">STUDENT DETAILS</h6>
                <div className="row g-0 border">
                    <div className="col-8">
                        <table className="table table-sm table-bordered mb-0 border-0">
                            <tbody>
                                <tr><td className="bg-light fw-bold w-40">Name</td><td>{data.student?.name}</td></tr>
                                <tr><td className="bg-light fw-bold">Parent Name</td><td>{data.student?.parentsname}</td></tr>
                                <tr><td className="bg-light fw-bold">Date of Birth</td><td>{BirthDate}</td></tr>
                                <tr><td className="bg-light fw-bold">Gender</td><td>{data.student?.gender}</td></tr>
                                <tr>
                                    <td className="bg-light fw-bold">Marital Status</td>
                                    <td>{data.student?.maritalstatus}</td>
                                </tr>
                                <tr><td className="bg-light fw-bold">College/Company</td><td>{data.student?.college}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-4 text-center p-2 border-start">
                        <img src={data.student?.imagePerview} style={{ width: "120px", height: "140px", objectFit: "cover" }} alt="Student" />
                    </div>
                </div>

                <h6 className="text-center p-1 mt-3 border bg_primary text white fw-bold">CONTACT DETAILS</h6>
                <table className="table table-sm table-bordered">
                    <tbody>
                        <tr>
                            <td className="bg-light fw-bold">Country</td>
                            <td>{data.student?.country}</td>
                            <td className="bg-light fw-bold">Native Place</td>
                            <td>{data.student?.native}</td>
                        </tr>

                        <tr>
                            <td className="bg-light fw-bold">State</td>
                            <td>{data.student?.state}</td>
                            <td className="bg-light fw-bold">Area</td>
                            <td>{data.student?.area}</td>
                        </tr>

                        <tr>
                            <td className="bg-light fw-bold">Mobile Number</td>
                            <td>{data.student?.mobilenumber}</td>
                            <td className="bg-light fw-bold">WhatsApp Number</td>
                            <td>{data.student?.whatsappno}</td>
                        </tr>

                        <tr>
                            <td className="bg-light fw-bold">Present Address</td>
                            <td>{data.student?.area}</td>
                            <td className="bg-light fw-bold">Pincode</td>
                            <td>{data.student?.zipcode}</td>
                        </tr>

                        <tr>
                            <td className="bg-light fw-bold">Email Address</td>
                            <td colSpan="3">{data.student?.email}</td>
                        </tr>
                    </tbody>
                </table>
                <h6 className="text-center p-1 mt-3 border bg_primary text white fw-bold">
                    EDUCATIONAL DETAILS
                </h6>

                <table className="table table-sm table-bordered text-center">
                    <thead className="bg-light fw-bold">
                        <tr>
                            <td>S.No</td>
                            <td>Education</td>
                            <td>Marks (%)</td>
                            <td>Academic Year</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>{data.education?.educationtype}</td>
                            <td>{data.education?.marks}</td>
                            <td>{data.education?.academicyear}</td>
                        </tr>
                    </tbody>
                </table>
                <h6 className="text-center p-1 mt-3 border bg_primary text white fw-bold">
                    ADMISSION DETAILS
                </h6>

                <table className="table table-sm table-bordered">
                    <tbody>
                        <tr>
                            <td className="bg-light fw-bold">Enquiry Taken</td>
                            <td>{EnquiryDate || "No Date"}</td>
                            <td className="bg-light fw-bold">Reg Number</td>
                            <td>
                                {data.studentId?.registrationnumber ||
                                    data.registrationnumber ||
                                    data.student?.registrationnumber ||
                                    "N/A"}
                            </td>
                        </tr>

                        <tr>
                            <td className="bg-light fw-bold">Enquiry Taken By</td>
                            <td>{data.admission?.enquirytakenby}</td>
                            <td className="bg-light fw-bold">Lead Source</td>
                            <td>{data.admission?.leadsource}</td>
                        </tr>

                        <tr>
                            <td className="bg-light fw-bold">Course Package</td>
                            <td>{data.admission?.coursepackage}</td>
                            <td className="bg-light fw-bold">Course</td>
                            <td>{data.admission?.courses}</td>
                        </tr>

                        <tr>
                            <td className="bg-light fw-bold">Admission Date</td>
                            <td>{AdmissionDate || "No Date"}</td>
                            <td className="bg-light fw-bold">Mode Of Training</td>
                            <td>{data.admission?.modeoftraining}</td>
                        </tr>

                        <tr>
                            <td className="bg-light fw-bold">Expected End Date</td>
                            <td>{ExpectedEndDate || "No Date"}</td>
                            <td className="bg-light fw-bold">Course Start Date</td>
                            <td>{CourseStartDate || "No Date"}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ height: "58px" }}></div>
                <div style={{ height: "58px" }}></div>
                <h6 className="text-center p-1 mt-3 border bg_primary text white fw-bold">FEE DETAILS</h6>
                <table className="table table-sm table-bordered text-center">
                    <thead className="bg-light fw-bold">
                        <tr><td>Fee Type</td><td>Amount</td><td>Discount</td><td>Tax</td><td>Total</td></tr>
                    </thead>
                    <tbody>
                        {data.rawFees?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.feetype}</td>
                                <td>{item.amount}</td>
                                <td>{item.discount}</td>
                                <td>{item.taxamount}</td>
                                <td className="fw-bold">{item.totalamount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h6 className="text-center p-1 mt-3 border bg_primary text white fw-bold">
                    ASSETS
                </h6>

                <table className="table table-sm table-bordered">
                    <tbody>
                        <tr>
                            <td className="bg-light fw-bold">Provided</td>
                            <td>
                                {Array.isArray(data.others?.assets)
                                    ? data.others.assets.join(", ")
                                    : data.others?.assets}
                            </td>
                            <td className="bg-light fw-bold">Issue Date</td>
                            <td>{data.admission?.admissiondate}</td>
                        </tr>

                        <tr>
                            <td className="bg-light fw-bold">Comments</td>
                            <td colSpan="3">{data.others?.admissionremarks}</td>
                        </tr>
                    </tbody>
                </table>

                <h6 className="text-center p-1 mt-3 border bg_primary text-white fw-bold">
                    TERMS AND CONDITIONS
                </h6>

                <div className="border p-3" style={{ fontSize: "11px", lineHeight: "1.5" }}>

                    <p className="fw-bold">1. Admission:</p>
                    <p className="ms-3">1. Students must provide all required documents and information during the admission process.</p>
                    <p className="ms-3">2. Admission will be confirmed only after payment of the booking amount, as decided by the management from time to time.</p>

                    <p className="fw-bold mt-2">2. Fees:</p>
                    <p className="ms-3">1. Students shall pay the course fees as per the due dates/terms mentioned. Fees shall not be refundable/non-transferable/non-adjustable under any circumstances.</p>
                    <p className="ms-3">2. Late payment of fees shall attract penal interest @1.5% per month.</p>
                    <p className="ms-3">3. Teks Academy reserves the right to cancel admission in case of non-payment of fees.</p>
                    <p className="ms-3">4. Course fees may vary based on merit and other relevant factors determined by the Academy.</p>

                    <p className="fw-bold mt-2">3. Course Material:</p>
                    <p className="ms-3">1. Course material is the intellectual property of the Academy and cannot be reproduced for commercial purposes.</p>
                    <p className="ms-3">2. Any damage or loss of material will attract additional charges.</p>

                    <p className="fw-bold mt-2">4. Attendance:</p>
                    <p className="ms-3">1. Regular attendance is essential for successful course completion.</p>
                    <p className="ms-3">2. Continuous absence of 3 classes without intimation may lead to termination.</p>
                    <p className="ms-3">3. Make-up classes are subject to availability and not guaranteed.</p>

                    <p className="fw-bold mt-2">5. Conduct:</p>
                    <p className="ms-3">1. Students must behave respectfully and not damage Academy property.</p>
                    <p className="ms-3">2. Harassment or bullying may lead to expulsion.</p>
                    <p className="ms-3">3. Use of drugs or alcohol is strictly prohibited.</p>

                    <p className="fw-bold mt-2">6. Certification:</p>
                    <p className="ms-3">1. Certificates are awarded based on Academy criteria.</p>
                    <p className="ms-3">2. Certificate does not guarantee employment.</p>

                    <p className="fw-bold mt-2">7. Liability:</p>
                    <p className="ms-3">1. The Academy is not responsible for injury, loss, or damage within premises or offsite activities.</p>
                    <p className="ms-3">2. Students are responsible for their personal belongings.</p>

                    <p className="fw-bold mt-2">8. Change in Policies:</p>
                    <p className="ms-3">1. Policies, fees, curriculum, and structure may change without prior notice.</p>
                    <p className="ms-3">2. Revised policies apply to all students.</p>

                    <p className="fw-bold mt-2">9. Dispute Resolution:</p>
                    <p className="ms-3">1. Disputes shall be resolved amicably. Unresolved disputes fall under the jurisdiction of Hyderabad, Telangana courts.</p>

                    <p className="fw-bold mt-2">10. Termination of Admission:</p>
                    <p className="ms-3">1. The Academy reserves the right to terminate admission at any time.</p>
                    <p className="ms-3">2. Refund, if any, depends on Academy discretion.</p>

                    <p className="fw-bold mt-2">11. No Placement Guarantee:</p>
                    <p className="ms-3">1. The Academy does not guarantee placements but may assist with guidance.</p>

                    <p className="fw-bold mt-2">12. Using ID Card:</p>
                    <p className="ms-3">1. Students must carry their ID card at all times.</p>

                    <p className="fw-bold mt-2">13. Copying Institute Content:</p>
                    <p className="ms-3">1. Distributing Academy material or promoting other institutes is prohibited and may lead to legal action.</p>

                    <p className="fw-bold mt-2">14. Teaching Staff:</p>
                    <p className="ms-3">1. Trainer allocation depends on availability.</p>
                    <p className="ms-3">2. Students cannot demand a specific trainer.</p>

                    <p className="fw-bold mt-2">15. Course Curriculum:</p>
                    <p className="ms-3">1. Curriculum may be updated without prior notice.</p>
                    <p className="ms-3">2. Students must stay updated.</p>

                    <p className="fw-bold mt-2">16. Course Duration:</p>
                    <p className="ms-3">1. Duration may vary based on attendance and methodology.</p>
                    <p className="ms-3">2. Duration may change without notice.</p>

                    <p className="fw-bold mt-2">17. Paid Internship Support:</p>
                    <p className="ms-3">1. Internship assistance may be provided.</p>
                    <p className="ms-3">2. No guarantee of internship or job placement.</p>
                    <p className="ms-3">3. Separate fee may apply.</p>
                    <p className="ms-3">4. Academy not liable for disputes with internship provider.</p>

                    <p className="fw-bold mt-2">18. Project Assignment:</p>
                    <p className="ms-3">1. Practice projects may be provided.</p>
                    <p className="ms-3">2. Projects may be capstone/live/previous.</p>
                    <p className="ms-3">3. Students must complete within given timeframe.</p>

                    <p className="fw-bold mt-2">19. Intellectual Property:</p>
                    <p className="ms-3">1. Intellectual property created during live projects belongs to the Academy.</p>
                    <p className="ms-3">2. Academy may use it for promotional/educational purposes.</p>
                    <p className="ms-3">3. Academy will not claim ownership over student's personal intellectual property.</p>

                    <p className="fw-bold mt-3">PRIVACY POLICY:</p>

                    <p className="fw-bold mt-2">1. Information Collection:</p>
                    <p className="ms-3">We collect personal information at enrollment.</p>

                    <p className="fw-bold mt-2">2. Use of Information:</p>
                    <p className="ms-3">Used for communication, materials, and certification.</p>

                    <p className="fw-bold mt-2">3. Information Sharing:</p>
                    <p className="ms-3">We do not share personal data except as required by law.</p>

                    <p className="fw-bold mt-2">4. Security:</p>
                    <p className="ms-3">We take reasonable measures to protect information.</p>

                    <p className="fw-bold mt-2">5. Cookies:</p>
                    <p className="ms-3">Website may use cookies for tracking and improvement.</p>

                    <p className="fw-bold mt-2">6. Data Retention:</p>
                    <p className="ms-3">Information retained as long as necessary or until deletion request.</p>

                    <p className="fw-bold mt-2">7. Modification:</p>
                    <p className="ms-3">Policy may be modified without notice.</p>

                    <p className="mt-3">
                        By signing this form, you acknowledge that you have read and agreed to the Terms & Conditions and Privacy Policy.
                    </p>

                </div>

                <div className="row mt-5 text-center">
                    <div className="col-6"><p className="border-top pt-2">Counsellor Signature</p></div>
                    <div className="col-6"><p className="border-top pt-2">Student Signature</p></div>
                </div>
            </div>
        );
    };

    return (
        <div className="preview-container pb-5">
            {/* 1. VISIBLE UI PREVIEW */}
            <div className="shadow-lg mx-auto my-4 bg-white rounded overflow-hidden" style={{ maxWidth: "900px" }}>
                <FullApplicationHTML data={allData} />
            </div>

            {/* Controls */}
            <div className="d-flex justify-content-between px-5">
                <button className="btn btn-secondary px-4" onClick={() => onNavigate(activeStep - 1)}>
                    <IoMdArrowBack /> Back
                </button>
                <button className="btn btn-success px-5 fw-bold" onClick={handleSubmitEnrollment} disabled={fetcher.state !== "idle"}>
                    {fetcher.state !== "idle" ? "Submitting..." : "Confirm & Submit"} <IoMdCheckmark />
                </button>
            </div>

            {/* 2. HIDDEN PDF SOURCE (Identical to UI) */}
            <div ref={componentRefff} style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "210mm" }}>
                <FullApplicationHTML data={allData} />
            </div>
        </div>
    );
};

export default PreOnBoardPreview;








































// import React, { useState, useEffect } from "react";
// import { useFetcher } from "react-router-dom";
// import { IoMdArrowBack, IoMdCheckmark } from "react-icons/io";

// const PreOnBoardPreview = ({ activeStep, onNavigate }) => {
//     const fetcher = useFetcher();
//     const [allData, setAllData] = useState({
//         student: {},
//         education: {},
//         admission: {},
//         billing: {},
//         others: {}
//     });

//     useEffect(() => {
//         // Gather all data from localStorage
//         const student = JSON.parse(localStorage.getItem("PreOnBoardStudentDetails")) || {};
//         const education = JSON.parse(localStorage.getItem("PreOnBoardStudentEducation")) || {};
//         const admission = JSON.parse(localStorage.getItem("PreOnBoardAdmissionDetails")) || {};
//         const billing = JSON.parse(localStorage.getItem("PreOnBoardBillingSummary")) || {};
//         const others = JSON.parse(localStorage.getItem("PreOnBoardOtherDetails")) || {};

//         setAllData({ student, education, admission, billing, others });
//     }, []);

//     // const handleSubmitEnrollment = () => {
//     //     const finalPayload = {
//     //         ...allData.student,
//     //         ...allData.education,
//     //         ...allData.admission,
//     //         ...allData.others,
//     //         feedetails: allData.billing.feedetailsbilling, // match key names
//     //         grandtotal: allData.billing.finaltotal
//     //     };

//     //     fetcher.submit(
//     //         {
//     //             enrollementData: JSON.stringify(finalPayload)
//     //         },
//     //         { method: "post" } // Default encType is 'application/x-www-form-urlencoded'
//     //     );
//     // };


//     const handleSubmitEnrollment = () => {
//         // 1. Pull all data chunks from localStorage
//         const student = JSON.parse(localStorage.getItem("PreOnBoardStudentDetails")) || {};
//         const education = JSON.parse(localStorage.getItem("PreOnBoardStudentEducation")) || {};
//         const admission = JSON.parse(localStorage.getItem("PreOnBoardAdmissionDetails")) || {};
//         const billing = JSON.parse(localStorage.getItem("PreOnBoardBillingSummary")) || {};
//         const others = JSON.parse(localStorage.getItem("PreOnBoardOtherDetails")) || {};
//         const rawFees = JSON.parse(localStorage.getItem("PreOnBoardFeeDetails")) || [];

//         // 2. Format Lead Source as an array of objects (as per old structure)
//         const formattedLeadSource = [{
//             source: admission.leadsource,
//             name: admission.referralName || "",
//             mobileNumber: admission.referralMobile || ""
//         }];

//         // 3. Map Assets to individual "on" keys
//         const assetKeys = {};
//         if (others.assets) {
//             others.assets.forEach(asset => {
//                 assetKeys[asset] = "on";
//             });
//         }

//         // 4. Construct the Final Payload to match the OLD structure exactly
//         const finalPayload = {
//             // --- Personal & Personal Address ---
//             ...student,

//             // --- Education & Academic ---
//             ...education,

//             // --- Admission Details ---
//             ...admission,
//             leadsource: formattedLeadSource, // Array of objects
//             leadsourceId: admission.leadsourceId,

//             // --- Fee Details (The Raw Input List) ---
//             feedetails: rawFees.map(f => ({
//                 ...f,
//                 feetype: f.feetype === "Course Fee" ? "fee" : f.feetype // Rename back to 'fee' for API
//             })),

//             // --- Fee Details Billing (The 70/30 Split List) ---
//             feedetailsbilling: billing.feedetailsbilling,

//             // --- Totals & Financials ---
//             totaldiscount: billing.totaldiscount,
//             grosstotal: billing.grosstotal,
//             totalfeewithouttax: billing.totalfeewithouttax,
//             totaltax: billing.totaltax,
//             grandtotal: billing.grandtotal,
//             materialfee: billing.materialfee,
//             finaltotal: billing.finaltotal,
//             dueamount: billing.finaltotal,

//             // --- Others & Assets ---
//             ...others,
//             ...assetKeys, // Individual keys like linkedIn: "on"

//             // --- Boilerplate keys required by old structure ---
//             addfee: false,
//             duedatetype: "",
//             installments: [],
//             totalpaidamount: 0,
//             nextduedate: null,
//             status: 1,
//             admissionFee: [],
//             initialpayment: [],
//             extra_discount: [],
//             student_status: [],
//             refund: null,
//             certificate_status: [
//                 {
//                     courseStartDate: "",
//                     courseEndDate: "",
//                     certificateStatus: "",
//                     requistedDate: "",
//                     issuedDate: ""
//                 }
//             ],
//             totalinstallments: 0
//         };

//         // 5. Submit to Action
//         fetcher.submit(
//             {
//                 type: "CREATE_ENROLLEMENT",
//                 enrollementData: JSON.stringify(finalPayload)
//             },
//             { method: "post" }
//         );
//     };

//     const { student, education, admission, billing, others } = allData;

//     return (
//         <div className="preview-container">
//             <div className="card shadow-sm p-4">
//                 <div className="row border-bottom pb-3 mb-4">
//                     {/* Profile Section */}
//                     <div className="col-md-3 text-center">
//                         <img
//                             src={student.imagePerview}
//                             alt="Profile"
//                             className="img-thumbnail shadow-sm"
//                             style={{ width: "150px", height: "150px", objectFit: "cover", border: "4px solid #b3b9d0" }}
//                         />
//                     </div>

//                     {/* Basic Info Table */}
//                     <div className="col-md-9">
//                         <div className="row mt-2">
//                             <div className="col-md-6">
//                                 <p className="mb-1"><strong>Name:</strong> {student.name}</p>
//                                 <p className="mb-1"><strong>Email:</strong> {student.email}</p>
//                                 <p className="mb-1"><strong>Contact:</strong> {student.mobilenumber}</p>
//                                 <p className="mb-1"><strong>DOB:</strong> {student.birthdate}</p>
//                             </div>
//                             <div className="col-md-6">
//                                 <p className="mb-1"><strong>Aadhar:</strong> {student.aadharCardNumber}</p>
//                                 <p className="mb-1"><strong>Gender:</strong> {student.gender}</p>
//                                 <p className="mb-1"><strong>Parent:</strong> {student.parentsname} ({student.parentsnumber})</p>
//                                 <p className="mb-1"><strong>Native:</strong> {student.native}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Academic & Admission Details */}
//                 <div className="row mb-4">
//                     <div className="col-md-6 border-end">
//                         <h6 className="text-primary fw-bold">Academic Info</h6>
//                         <p className="mb-1"><strong>Education:</strong> {education.educationtype}</p>
//                         <p className="mb-1"><strong>Percentage:</strong> {education.marks}%</p>
//                         <p className="mb-1"><strong>Year:</strong> {education.academicyear}</p>
//                         <p className="mb-1"><strong>College:</strong> {student.college}</p>
//                     </div>
//                     <div className="col-md-6 ps-4">
//                         <h6 className="text-primary fw-bold">Admission Info</h6>
//                         <p className="mb-1"><strong>Package:</strong> {admission.coursepackage}</p>
//                         <p className="mb-1"><strong>Course:</strong> {admission.courses}</p>
//                         <p className="mb-1"><strong>Branch:</strong> {admission.branch}</p>
//                         <p className="mb-1"><strong>Mode:</strong> {admission.modeoftraining}</p>
//                     </div>
//                 </div>

//                 {/* Fee Table */}
//                 <div className="mb-4">
//                     <h6 className="text-primary fw-bold">Fee Breakdown</h6>
//                     <div className="table-responsive">
//                         <table className="table table-sm table-bordered">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th>Type</th>
//                                     <th>Excl. GST</th>
//                                     <th>Tax (18%)</th>
//                                     <th>Incl. GST</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {billing.feedetailsbilling?.map((item, idx) => (
//                                     <tr key={idx}>
//                                         <td>{item.feetype}</td>
//                                         <td>{Number(item.feewithouttax).toFixed(2)}</td>
//                                         <td>{Number(item.feetax).toFixed(2)}</td>
//                                         <td className="fw-bold">{Number(item.feewithtax).toFixed(2)}</td>
//                                     </tr>
//                                 ))}
//                                 <tr className="table-secondary">
//                                     <td colSpan="3" className="text-end fw-bold">Grand Total</td>
//                                     <td className="fw-bold text-success">{billing.finaltotal}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Remarks & Assets */}
//                 <div className="bg-light p-3 rounded">
//                     <p className="mb-1"><strong>Remarks:</strong> {others.admissionremarks}</p>
//                     <p className="mb-0">
//                         <strong>Issued Assets:</strong> {others.assets?.join(", ") || "None"}
//                         {others.tshirtSize && ` (T-Shirt Size: ${others.tshirtSize.toUpperCase()})`}
//                     </p>
//                 </div>
//             </div>

//             {/* Navigation Controls */}
//             <div className="mt-4 d-flex justify-content-between">
//                 <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => onNavigate(activeStep - 1)}
//                 >
//                     <IoMdArrowBack className="me-2" /> Go Back
//                 </button>

//                 <button
//                     type="button"
//                     className="btn btn-success px-5"
//                     onClick={handleSubmitEnrollment}
//                     disabled={fetcher.state === "submitting" || fetcher.state === "loading"}
//                 >
//                     {fetcher.state === "submitting" ? (
//                         "Submitting..."
//                     ) : (
//                         <>
//                             <IoMdCheckmark className="me-2" /> Confirm & Submit Enrollment
//                         </>
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PreOnBoardPreview;
