import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { ERPApi } from '../../../../../serviceLayer/interceptor'
import { SearchSelect } from "../../../../../utils/SearchSelect";

const PreOnBoardAdmissionDetails = ({ steps, activeStep, onNavigate, coursePackages = [], courses = [], leadSources = [] }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedLeadSource, setSelectedLeadSource] = useState(null);


    const initialState = {
        enquirydate: "", enquirytakenby: "", enquirytakenbyId: "",
        coursepackage: "", coursepackageId: "", courses: "", coursesId: "",
        leadsource: "", leadsourceId: "", branch: "", branchId: "",
        modeoftraining: "", admissiondate: "", validitystartdate: "",
        validityenddate: "", voucherCode: "", referralName: "", referralMobile: "",
        user_id: null
    };
    const currentDate = new Date().toISOString().split("T")[0];

    const [admissionDetails, setAdmissionDetails] = useState(initialState);
    const [errors, setErrors] = useState({});

    // Voucher States
    const [verifyVoucherLoading, setVerifyVoucherLoading] = useState(false);
    const [isVoucherVerified, setIsVoucherVerified] = useState(localStorage.getItem("voucherVerified") === "true");
    const [voucherResponseData, setVoucherResponseData] = useState(null);

    // Load persisted data
    useEffect(() => {
        const storedData = localStorage.getItem("PreOnBoardAdmissionDetails");
        const userData = JSON.parse(localStorage.getItem("data"));
        const storedVoucher = JSON.parse(localStorage.getItem("VoucherData"));

        let baseData = storedData ? JSON.parse(storedData) : initialState;

        if (userData) {
            baseData = {
                ...baseData,
                enquirytakenby: userData?.user?.fullname || "",
                enquirytakenbyId: userData?.user?.id || "",
                branch: userData?.user?.branch_setting?.branch_name || "",
                branchId: userData?.user?.branch_setting?.id || "",
                user_id: userData?.user?.id || null
            };
        }
        setAdmissionDetails(baseData);
        setSelectedLeadSource({
            label: baseData?.leadsource,
            value: baseData?.leadsourceId,
        })
        if (storedVoucher) {
            setVoucherResponseData({ success: { status: true, message: localStorage.getItem("voucherSuccessMessage"), voucherDetails: storedVoucher } });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedDetails = { ...admissionDetails, [name]: value };

        // Auto-calculate End Date when Start Date is changed
        if (name === "validitystartdate" && value) {
            const startDate = new Date(value);
            if (!isNaN(startDate)) {
                const endDate = new Date(startDate);
                endDate.setFullYear(startDate.getFullYear() + 1); // Sets it to 1 year later

                // Format to YYYY-MM-DD for the date input
                const formattedEndDate = endDate.toISOString().split("T")[0];
                updatedDetails.validityenddate = formattedEndDate;
            }
        }

        setAdmissionDetails(updatedDetails);
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (selected, field) => {
        if (field === "coursepackage") {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.set("coursepackage", selected.value);
                return params;
            });
        }

        setAdmissionDetails(prev => ({
            ...prev,
            [field]: selected?.label || "",
            [`${field}Id`]: selected?.value || ""
        }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const verifyVoucherCode = async (code) => {
        if (!code) {
            setErrors(prev => ({ ...prev, voucherCode: "Enter a code first" }));
            return;
        }
        setErrors((prev) => ({ ...prev, voucherCode: "" }));
        setVerifyVoucherLoading(true);
        try {
            const studentDetails = JSON.parse(localStorage.getItem('PreOnBoardStudentDetails'));
            const response = await ERPApi.post('student/checkvoucher', {
                voucherCode: code,
                phone_number: studentDetails?.mobilenumber
            });

            if (response.status === 200) {
                const data = response.data.data;
                setVoucherResponseData({
                    success: { status: true, message: response.data.message || "Verified", voucherDetails: data },
                    failed: { status: false, message: "" }
                });
                localStorage.setItem("voucherVerified", "true");
                localStorage.setItem("VoucherData", JSON.stringify(data));
                localStorage.setItem("voucherCode", data.voucherCode);
                localStorage.setItem("voucherSuccessMessage", response.data.message);
                setIsVoucherVerified(true);
            }
        } catch (error) {
            setVoucherResponseData({
                failed: { status: true, message: error?.response?.data?.message || "Verification failed" }
            });
        } finally {
            setVerifyVoucherLoading(false);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        const required = ['enquirydate', 'coursepackageId', 'coursesId', 'leadsourceId', 'modeoftraining', 'admissiondate', 'validitystartdate', 'validityenddate'];

        required.forEach(field => {
            if (!admissionDetails[field]) newErrors[field === 'coursepackageId' ? 'coursepackage' : field] = "Required";
        });

        // Referral Validation
        const referralSources = ["Business Partner", "Employee Referral", "Student Referral"];
        if (admissionDetails.leadsource.length == 0) {
            newErrors.leadsource = "Required"
        }
        if (!admissionDetails.coursesId) {
            newErrors.courses = "Required"
        }
        if (referralSources.includes(admissionDetails.leadsource)) {
            if (!admissionDetails.referralName) newErrors.referralName = "Required";
            if (!admissionDetails.referralMobile) newErrors.referralMobile = "Required";
        }

        // Voucher Validation
        if (admissionDetails.voucherCode && !isVoucherVerified) {
            newErrors.voucherCode = "Please verify the voucher code";
        }

        // if (admissionDetails.validityenddate < admissionDetails.validitystartdate) {
        //     newErrors.validityenddate = "End date must be after start date";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const voucherDetails = JSON.parse(localStorage.getItem("VoucherData"));
            const finalData = {
                ...admissionDetails,
                ...(isVoucherVerified && voucherDetails?.voucher_id ? { voucher_id: voucherDetails.voucher_id } : {}),
                ...(isVoucherVerified && voucherDetails?.voucherLeadId ? { voucherLeadId: voucherDetails.voucherLeadId } : {})
            };
            localStorage.setItem("PreOnBoardAdmissionDetails", JSON.stringify(finalData));
            onNavigate(activeStep + 1);
        }
    };

    const renderInput = (label, name, type = "text", maxLength = null) => {
        // Determine the actual HTML input type
        // If it's "number", we use "text" to support maxLength and custom digit validation
        const inputType = type === "number" ? "text" : type;

        return (
            <div className="col-md-3 mb-3 text-start">
                <label className="form-label text-nowrap">{label} <span className="text-danger">*</span></label>
                <input
                    type={inputType}
                    name={name}
                    value={admissionDetails[name] || ""}
                    onChange={(e) => {
                        const { value } = e.target;

                        // 1. Numeric Validation: only allow digits (0-9)
                        if (type === "number" && value !== "" && !/^\d+$/.test(value)) {
                            return;
                        }

                        // 2. Length Validation: Blocks typing if length exceeds maxLength
                        if (maxLength && value.length > maxLength) {
                            return;
                        }

                        handleChange(e);
                    }}
                    className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                    placeholder={type === "date" ? "" : `Enter ${label}`}
                />
                {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
            </div>
        );
    };

    const showReferralFields = ["Business Partner", "Employee Referral", "Student Referral"].includes(admissionDetails.leadsource);

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Enquiry Date <span className="text-danger">*</span></label>
                    <input type="date" max={currentDate} name="enquirydate" value={admissionDetails.enquirydate} onChange={handleChange} className={`form-control ${errors.enquirydate ? "is-invalid" : ""}`} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Enquiry taken by <span className="text-danger">*</span></label>
                    <input type="text" readOnly={true} name="enquirytakenby" value={admissionDetails.enquirytakenby} onChange={handleChange} className={`form-control `} />
                </div>


                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Course Package <span className="text-danger">*</span></label>
                    <Select options={coursePackages}
                        value={coursePackages.find(op => op.value === admissionDetails.coursepackageId)}
                        onChange={(val) => handleSelectChange(val, "coursepackage")} />
                    {errors.coursepackage && <small className="text-danger">{errors.coursepackage}</small>}
                </div>

                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Course <span className="text-danger">*</span></label>
                    <Select options={courses}
                        value={courses.find(op => op.value === admissionDetails.coursesId)}
                        onChange={(val) => handleSelectChange(val, "courses")} />
                    {errors.courses && <small className="text-danger">{errors.courses}</small>}
                </div>

                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Lead Source <span className="text-danger">*</span></label>
                    {/* <Select options={leadSources}
                        value={leadSources.find(op => op.value === admissionDetails.leadsourceId)}
                        onChange={(val) => handleSelectChange(val, "leadsource")} /> */}
                    <SearchSelect
                        className="fs-s bg-form text_color input_bg_color"
                        placeholder="Select Lead Source"
                        value={
                            selectedLeadSource
                        }
                        defaultOptions={leadSources.length ? leadSources : true}
                        onChange={(selectedOption, val) => {
                            handleSelectChange(val, "leadsource")
                            setSelectedLeadSource(val)
                        }
                        }
                        fetchOptions={async (search) => {
                            try {
                                const res = await ERPApi.get(`/settings/getleadsource`, {
                                    params: { search: search || "" },
                                });

                                const data = res?.data?.leadSourceData || [];

                                return data.map((item) => ({
                                    label: item?.leadsource,
                                    value: item?.id,
                                }));
                            } catch (error) {
                                console.error("Error fetching lead sources:", error);
                                return [];
                            }
                        }}
                    />
                    {errors.leadsource && <small className="text-danger">{errors.leadsource}</small>}
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Branch <span className="text-danger">*</span></label>
                    <input type="text" readOnly={true} name="branch" value={admissionDetails.branch} onChange={handleChange} className={`form-control`} />
                </div>

                {/* Conditional Referral Fields */}
                {showReferralFields && (
                    <>
                        {renderInput("Referral Name", "referralName", "text")}
                        {renderInput("Referral Mobile", "referralMobile", "number", 10)}
                        {/* <div className="col-md-3 mb-3">
                            <label className="form-label text-nowrap">Referral Name *</label>
                            <input type="text" name="referralName" value={admissionDetails.referralName} onChange={handleChange} className={`form-control ${errors.referralName ? "is-invalid" : ""}`} />
                            {errors.referralName && <small className="text-danger">{errors.referralName}</small>}
                        </div> */}
                        {/* <div className="col-md-3 mb-3">
                            <label className="form-label text-nowrap">Referral Mobile *</label>
                            <input type="text" name="referralMobile" value={admissionDetails.referralMobile} onChange={handleChange} className={`form-control ${errors.referralMobile ? "is-invalid" : ""}`} />
                            {errors.referralMobile && <small className="text-danger">{errors.referralMobile}</small>}
                        </div> */}
                    </>
                )}

                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Voucher Code (Optional)</label>
                    <div className="input-group">
                        <input
                            type="text"
                            name="voucherCode"
                            className={`form-control ${errors.voucherCode ? "is-invalid" : ""}`}
                            disabled={isVoucherVerified}
                            style={isVoucherVerified ? { cursor: "not-allowed" } : {}}
                            value={localStorage.getItem("voucherCode") || admissionDetails.voucherCode?.toUpperCase() || ""}
                            onChange={handleChange}
                        />
                        {!isVoucherVerified && (
                            <button className="btn btn_primary" type="button" onClick={() => verifyVoucherCode(admissionDetails.voucherCode)}>
                                {verifyVoucherLoading ? "..." : "Verify"}
                            </button>
                        )}
                    </div>
                    {/* Voucher Feedback */}
                    <div style={{ height: "15px" }}>
                        {errors.voucherCode && <p className="text-danger m-0 fs-xs small">{errors.voucherCode}</p>}
                        {isVoucherVerified ? (
                            <p className="text-success m-0 fs-xs small">{localStorage.getItem("voucherSuccessMessage") || "Verified"}</p>
                        ) : (
                            voucherResponseData?.failed?.status && <p className="text-danger m-0 fs-xs small">{voucherResponseData.failed.message}</p>
                        )}
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Mode Of Training <span className="text-danger">*</span></label>
                    <select name="modeoftraining" value={admissionDetails.modeoftraining} onChange={handleChange} className={`form-select ${errors.modeoftraining ? "is-invalid" : ""}`}>
                        <option value="">Select</option>
                        <option value="offline">Offline</option>
                        <option value="online">Online</option>
                    </select>
                    {errors.modeoftraining && <small className="text-danger">{errors.modeoftraining}</small>}
                </div>

                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Admission Date <span className="text-danger">*</span></label>
                    <input type="date" max={currentDate} name="admissiondate" value={admissionDetails.admissiondate} onChange={handleChange} className="form-control" />
                    {errors.admissiondate && <small className="text-danger">{errors.admissiondate}</small>}
                </div>

                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Validity Start <span className="text-danger">*</span></label>
                    <input
                        type="date"
                        name="validitystartdate"
                        value={admissionDetails.validitystartdate}
                        onChange={handleChange}
                        max={currentDate}
                        className={`form-control ${errors.validitystartdate ? "is-invalid" : ""}`}
                    />
                    {errors.validitystartdate && <small className="text-danger">{errors.validitystartdate}</small>}
                </div>

                <div className="col-md-3 mb-3">
                    <label className="form-label text-nowrap">Validity End <span className="text-danger">*</span></label>
                    <input
                        type="date"
                        name="validityenddate"
                        value={admissionDetails.validityenddate}
                        onChange={handleChange}
                        className={`form-control ${errors.validityenddate ? "is-invalid" : ""}`}
                        // Block the field if start date exists
                        readOnly={!!admissionDetails.validitystartdate}
                        style={admissionDetails.validitystartdate ? { backgroundColor: "#e9ecef", cursor: "not-allowed" } : {}}
                    />
                    {errors.validityenddate && <small className="text-danger">{errors.validityenddate}</small>}
                </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={() => onNavigate(activeStep - 1)}>Previous</button>
                <button type="submit" className="btn bg_primary border-start border-white text-white">
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </form>
    );
};

export default PreOnBoardAdmissionDetails;






































// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import Select from "react-select";

// const PreOnBoardAdmissionDetails = ({
//     steps = [],
//     coursePackages = [],
//     courses = [],
//     leadSources = []
// }) => {

//     const initialState = {
//         enquirydate: "",
//         enquirytakenby: "",
//         enquirytakenbyId: "",
//         coursepackage: "",
//         coursepackageId: "",
//         courses: "",
//         coursesId: "",
//         leadsource: "",
//         leadsourceId: "",
//         branch: "",
//         branchId: "",
//         modeoftraining: "",
//         admissiondate: "",
//         validitystartdate: "",
//         validityenddate: "",
//         user_id: null
//     };

//     const [searchParams, setSearchParams] = useSearchParams();
//     const activeTabFromUrl = searchParams.get("active");
//     const [activeStep, setActiveStep] = useState(
//         parseInt(activeTabFromUrl)
//     );

//     const [selectedCoursePackage, setSelectedCoursePackage] = useState({ label: "", value: "" })
//     const [selectedCourse, setSelectedCourse] = useState({ label: "", value: "" })
//     const [selectedLeadSource, setSelectedLeadSource] = useState({ label: "", value: "" })

//     const [admissionDetails, setAdmissionDetails] = useState(initialState);
//     const [errors, setErrors] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // ========================================
//     // Load from LocalStorage
//     // ========================================
//     useEffect(() => {
//         const storedData = localStorage.getItem(
//             "PreOnBoardAdmissionDetails"
//         );
//         const parsedData = JSON.parse(storedData)
//         if (storedData) {
//             setAdmissionDetails(parsedData);
//             setSelectedCoursePackage({
//                 label: parsedData.coursepackage,
//                 value: parsedData.coursepackageId,
//             })
//             setSelectedCourse({
//                 label: parsedData.courses,
//                 value: parsedData.coursesId,
//             })
//             setSelectedLeadSource({
//                 label: parsedData.leadsource,
//                 value: parsedData.leadsourceId,
//             })
//         }
//     }, []);

//     // ========================================
//     // Sync Step with URL
//     // ========================================
//     // useEffect(() => {
//     //     if (activeTabFromUrl) {
//     //         const tabFromUrl = parseInt(activeTabFromUrl);
//     //         // Only update if it's different from current activeStep
//     //         if (tabFromUrl !== activeStep) {
//     //             setActiveStep(tabFromUrl);
//     //         }
//     //     }
//     // }, [activeTabFromUrl]);

//     useEffect(() => {
//         // Only update URL if it's different from current URL param
//         setSearchParams(prev => {
//             const currentActive = prev.get("active");

//             if (currentActive === String(activeStep)) {
//                 return prev;
//             }

//             const params = new URLSearchParams(prev);
//             params.set("active", activeStep);
//             return params;
//         });
//     }, [activeStep]);


//     // ========================================
//     // Auto Bind User + Branch
//     // ========================================
//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem("data"));

//         if (userData) {
//             setAdmissionDetails(prev => ({
//                 ...prev,
//                 enquirytakenby: userData?.user?.fullname || "",
//                 enquirytakenbyId: userData?.user?.id || "",
//                 branch: userData?.user?.branch_setting?.branch_name || "",
//                 branchId: userData?.user?.branch_setting?.id || "",
//                 user_id: userData?.user?.id || null
//             }));
//         }
//     }, []);

//     // ========================================
//     // Handle Input Change
//     // ========================================
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setAdmissionDetails(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: "" }));
//         }
//     };

//     // ========================================
//     // Handle React Select
//     // ========================================
//     const handleSelectChange = (selected, field) => {
//         // If the field is "coursepackage", update the search params
//         if (field === "coursepackage") {
//             setSelectedCoursePackage(selected);
//             setSearchParams((prev) => {
//                 const newParams = new URLSearchParams(prev);
//                 newParams.set("coursepackage", selected.value); // Set the coursepackage value in search params
//                 return newParams; // Don't forget to return the updated params!
//             });
//         }
//         if (field == "course") {
//             setSelectedCourse({
//                 label: selected.label,
//                 value: selected.value
//             })
//         }
//         if (field == "leadsource") {
//             setSelectedLeadSource({
//                 label: selected.label,
//                 value: selected.value
//             })
//         }

//         // Update the form state for the selected field
//         setAdmissionDetails(prev => ({
//             ...prev,
//             [field]: selected?.label || "",  // Store the label of the selected option
//             [`${field}Id`]: selected?.value || "" // Store the value (ID) of the selected option
//         }));

//         // Clear any existing validation errors for the field
//         if (errors[field]) {
//             setErrors(prev => ({ ...prev, [field]: "" }));
//         }
//     };


//     // ========================================
//     // Validation
//     // ========================================
//     const validateForm = () => {
//         let newErrors = {};

//         if (!admissionDetails.enquirydate)
//             newErrors.enquirydate = "Please select enquiry date";

//         if (!admissionDetails.coursepackageId)
//             newErrors.coursepackage = "Please select course package";

//         if (!admissionDetails.coursesId)
//             newErrors.courses = "Please select course";

//         if (!admissionDetails.leadsourceId)
//             newErrors.leadsource = "Please select lead source";

//         if (!admissionDetails.modeoftraining)
//             newErrors.modeoftraining = "Please select mode of training";

//         if (!admissionDetails.admissiondate)
//             newErrors.admissiondate = "Please select admission date";

//         if (!admissionDetails.validitystartdate)
//             newErrors.validitystartdate =
//                 "Please select validity start date";

//         if (!admissionDetails.validityenddate)
//             newErrors.validityenddate =
//                 "Please select validity end date";

//         if (
//             admissionDetails.validitystartdate &&
//             admissionDetails.validityenddate &&
//             admissionDetails.validityenddate <
//             admissionDetails.validitystartdate
//         ) {
//             newErrors.validityenddate =
//                 "Validity end date must be greater than start date";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // ========================================
//     // Submit
//     // ========================================
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         if (validateForm()) {
//             localStorage.setItem(
//                 "PreOnBoardAdmissionDetails",
//                 JSON.stringify(admissionDetails)
//             );
//             // Get current step and increment
//             const nextStep = activeStep + 1;
//             setActiveStep(nextStep);
//             // Update URL params directly to avoid race condition
//             setSearchParams(prev => {
//                 const params = new URLSearchParams(prev);
//                 params.set("active", nextStep);
//                 return params;
//             });
//         }

//         setIsSubmitting(false);
//     };

//     return (
//         <form>
//             <div className="row">

//                 {/* Enquiry Date */}
//                 <div className="col-md-3 mb-3">
//                     <label>Enquiry Date *</label>
//                     <input
//                         type="date"
//                         name="enquirydate"
//                         value={admissionDetails.enquirydate}
//                         onChange={handleChange}
//                         className={`form-control ${errors.enquirydate ? "is-invalid" : ""}`}
//                     />
//                     {errors.enquirydate && (
//                         <div className="invalid-feedback">
//                             {errors.enquirydate}
//                         </div>
//                     )}
//                 </div>

//                 {/* Enquiry Taken By */}
//                 <div className="col-md-3 mb-3">
//                     <label>Enquiry Taken By *</label>
//                     <input
//                         type="text"
//                         value={admissionDetails.enquirytakenby}
//                         disabled
//                         className="form-control"
//                     />
//                 </div>

//                 {/* Course Package */}
//                 <div className="col-md-3 mb-3">
//                     <label>Course Package *</label>
//                     <Select
//                         options={coursePackages}
//                         value={selectedCoursePackage}
//                         onChange={(val) =>
//                             handleSelectChange(val, "coursepackage")
//                         }
//                     />
//                     {errors.coursepackage && (
//                         <div className="text-danger small">
//                             {errors.coursepackage}
//                         </div>
//                     )}
//                 </div>

//                 {/* Course */}
//                 <div className="col-md-3 mb-3">
//                     <label>Course *</label>
//                     <Select
//                         options={courses}
//                         selectedCourse
//                         onChange={(val) =>
//                             handleSelectChange(val, "courses")
//                         }
//                     />
//                     {errors.courses && (
//                         <div className="text-danger small">
//                             {errors.courses}
//                         </div>
//                     )}
//                 </div>

//                 {/* Lead Source */}
//                 <div className="col-md-3 mb-3">
//                     <label>Lead Source *</label>
//                     <Select
//                         options={leadSources}
//                         value={selectedLeadSource}
//                         onChange={(val) =>
//                             handleSelectChange(val, "leadsource")
//                         }
//                     />
//                     {errors.leadsource && (
//                         <div className="text-danger small">
//                             {errors.leadsource}
//                         </div>
//                     )}
//                 </div>

//                 {/* Branch */}
//                 <div className="col-md-3 mb-3">
//                     <label>Branch *</label>
//                     <input
//                         type="text"
//                         value={admissionDetails.branch}
//                         disabled
//                         className="form-control"
//                     />
//                 </div>

//                 {/* Mode */}
//                 <div className="col-md-3 mb-3">
//                     <label>Mode Of Training *</label>
//                     <select
//                         name="modeoftraining"
//                         value={admissionDetails.modeoftraining}
//                         onChange={handleChange}
//                         className={`form-select ${errors.modeoftraining ? "is-invalid" : ""}`}
//                     >
//                         <option value="">Select</option>
//                         <option value="offline">Offline</option>
//                         <option value="online">Online</option>
//                     </select>
//                     {errors.modeoftraining && (
//                         <div className="invalid-feedback">
//                             {errors.modeoftraining}
//                         </div>
//                     )}
//                 </div>

//                 {/* Admission Date */}
//                 <div className="col-md-3 mb-3">
//                     <label>Admission Date *</label>
//                     <input
//                         type="date"
//                         name="admissiondate"
//                         value={admissionDetails.admissiondate}
//                         onChange={handleChange}
//                         className={`form-control ${errors.admissiondate ? "is-invalid" : ""}`}
//                     />
//                     {errors.admissiondate && (
//                         <div className="invalid-feedback">
//                             {errors.admissiondate}
//                         </div>
//                     )}
//                 </div>

//                 {/* Validity Start */}
//                 <div className="col-md-3 mb-3">
//                     <label>Validity Start Date *</label>
//                     <input
//                         type="date"
//                         name="validitystartdate"
//                         value={admissionDetails.validitystartdate}
//                         onChange={handleChange}
//                         className={`form-control ${errors.validitystartdate ? "is-invalid" : ""}`}
//                     />
//                     {errors.validitystartdate && (
//                         <div className="invalid-feedback">
//                             {errors.validitystartdate}
//                         </div>
//                     )}
//                 </div>

//                 {/* Validity End */}
//                 <div className="col-md-3 mb-3">
//                     <label>Validity End Date *</label>
//                     <input
//                         type="date"
//                         name="validityenddate"
//                         value={admissionDetails.validityenddate}
//                         onChange={handleChange}
//                         className={`form-control ${errors.validityenddate ? "is-invalid" : ""}`}
//                     />
//                     {errors.validityenddate && (
//                         <div className="invalid-feedback">
//                             {errors.validityenddate}
//                         </div>
//                     )}
//                 </div>

//             </div>

//             <div className="mt-4 d-flex justify-content-between">
//                 <button
//                     className="btn btn-secondary"
//                     disabled={activeStep === 0}
//                     onClick={() => {
//                         const nextStep = activeStep - 1;
//                         setSearchParams(prev => {
//                             const params = new URLSearchParams(prev);
//                             params.set("active", nextStep);
//                             return params;
//                         });
//                     }}
//                 >
//                     Previous
//                 </button>
//                 <button
//                     className="btn btn-primary"
//                     type="submit"
//                     onClick={handleSubmit}
//                 >
//                     {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default PreOnBoardAdmissionDetails;
