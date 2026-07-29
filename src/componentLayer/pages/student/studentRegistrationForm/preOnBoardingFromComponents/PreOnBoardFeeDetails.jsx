import React, { useState, useEffect } from "react";
import { MdDelete, MdOutlineDeleteOutline } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
 
const PreOnBoardFeeDetails = ({ courses = [], steps , onNavigate}) => {
    const initialState = {
        id: "",
        feetype: "",
        amount: "",
        discount: 0
    };
 
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTabFromUrl = searchParams.get("active");
    const [activeStep, setActiveStep] = useState(
        activeTabFromUrl ? parseInt(activeTabFromUrl) : 0
    );
    const [feeData, setFeeData] = useState(initialState);
    const [feeList, setFeeList] = useState([]);
    const [errors, setErrors] = useState({});
 
    // Load From LocalStorage
    useEffect(() => {
        const storedFees = localStorage.getItem("PreOnBoardFeeDetails");
        if (storedFees) {
            setFeeList(JSON.parse(storedFees));
        }
    }, []);
 
    // Save To LocalStorage Whenever feeList Changes
    useEffect(() => {
        localStorage.setItem("PreOnBoardFeeDetails", JSON.stringify(feeList));
    }, [feeList]);
 
    const handleChange = (event) => {
        const { name, value } = event.target;
        setErrors(prev => ({ ...prev, [name]: "" }));
 
        if (name === "feetype" && value === "Admission Fee") {
            setFeeData({
                id: Date.now(),
                feetype: value,
                amount: 500,
                discount: 0
            });
        }
        else if (name === "feetype" && value === "Course Fee") {
            const preAdmissionData = JSON.parse(localStorage.getItem('PreOnBoardAdmissionDetails'));
            let selectedCourse = courses.find(
                (course) => course.id === preAdmissionData?.coursesId
            );
 
            if (!selectedCourse) {
                setErrors({ feetype: "Please select course first" });
                return;
            }
 
            const voucherData = JSON.parse(localStorage.getItem("VoucherData"));
            const isVoucherVerified = localStorage.getItem("voucherVerified") === "true";
 
            const fee = Number(selectedCourse.fee) || 0;
            let discountAmount = 0;
 
            // VOUCHER LOGIC
            if (isVoucherVerified && voucherData) {
                const discountType = voucherData?.valueType;
                const percentage = Number(voucherData?.percentage) || 0;
                const amount = Number(voucherData?.amount) || 0;
 
                discountAmount = discountType === "percentage"
                    ? Math.round(fee * (percentage / 100))
                    : amount;
            }
 
            setFeeData({
                id: Date.now(),
                feetype: value,
                amount: fee,
                discount: discountAmount || 0,
                isVoucher: isVoucherVerified // custom flag to disable input
            });
        }
        else if (name === "discount") {
            const numericValue = parseInt(value) || 0;
            setFeeData(prev => ({ ...prev, discount: numericValue }));
        }
        else if (name === "amount") {
            const numericValue = parseInt(value) || 0;
            setFeeData(prev => ({ ...prev, amount: numericValue }));
        }
    };
 
    const handleSubmit = (e) => {
        e.preventDefault();
 
        if (!feeData.feetype || !feeData.amount) {
            toast.error("Please fill required fields");
            return;
        }
 
        // PREVENT DUPLICATES
        if (feeList.some(f => f.feetype === feeData.feetype)) {
            toast.error(`${feeData.feetype} already added`);
            return;
        }
 
        // VALIDATION LOGIC
        let save = true;
        const isVoucherVerified = localStorage.getItem("voucherVerified") === "true";
 
        if (feeData.feetype === "Course Fee") {
            const preAdmissionData = JSON.parse(localStorage.getItem('PreOnBoardAdmissionDetails'));
            let courseMatch = courses.find(
                (c) => c.course_name === preAdmissionData?.courses &&
                    c.course_package === preAdmissionData?.coursepackage
            );
 
            if (courseMatch) {
                // If NO valid voucher, check max_discount limit
                if (!isVoucherVerified) {
                    const maxAllowed = parseInt(courseMatch.max_discount) || 0;
                    if (feeData.discount > maxAllowed) {
                        save = false;
                        toast.error(`Discount cannot be greater than ${maxAllowed}`);
                        return;
                    }
                }
            }
        }
 
        if (save) {
            // TAX CALCULATION (Exact logic from your old code)
            const netAmount = feeData.amount - feeData.discount;
            const actualFee = (netAmount * 100) / 118;
            const taxAmount = netAmount - actualFee;
 
            const feeEntry = {
                ...feeData,
                taxamount: taxAmount.toFixed(2),
                totalamount: netAmount
            };
 
            setFeeList(prev => [...prev, feeEntry]);
            setFeeData(initialState);
            toast.success(`${feeData.feetype} added to list`);
        }
    };
 
    const handleFinalStep = () => {
        if (feeList.length < 2) {
            toast.warn("Please add both Admission and Course fees");
            return;
        }
 
        // GENERATE BILLING SUMMARY FOR NEXT STEP (70/30 Split)
        let grosstotal = 0;
        let totaldiscount = 0;
        let totalfeewithouttax = 0;
        let totaltax = 0;
        let grandtotal = 0;
        let materialfee = 0;
        const billingArray = [];
 
        feeList.forEach((item) => {
            if (item.feetype === "Admission Fee") {
                grosstotal += item.amount;
                totalfeewithouttax += (item.totalamount * 100) / 118;
                totaltax += item.totalamount - ((item.totalamount * 100) / 118);
                grandtotal += item.totalamount;
                billingArray.push({
                    id: item.id,
                    feetype: "Admission Fee",
                    feewithtax: item.totalamount,
                    feewithouttax: (item.totalamount * 100) / 118,
                    feetax: item.totalamount - ((item.totalamount * 100) / 118)
                });
            } else if (item.feetype === "Course Fee") {
                const taxablePart = item.totalamount * 0.7;
                const materialPart = Math.round(item.totalamount * 0.3);
                const courseBase = (taxablePart * 100) / 118;
                const courseTax = taxablePart - courseBase;
 
                grosstotal += item.amount;
                totaldiscount += item.discount;
                totalfeewithouttax += courseBase;
                totaltax += courseTax;
                grandtotal += taxablePart;
                materialfee += materialPart;
 
                billingArray.push({
                    id: item.id + "_course",
                    feetype: "Course Fee",
                    feewithtax: taxablePart,
                    feewithouttax: courseBase,
                    feetax: courseTax
                });
                billingArray.push({
                    id: item.id + "_material",
                    feetype: "Material Fee",
                    feewithtax: materialPart,
                    feewithouttax: materialPart,
                    feetax: 0
                });
            }
        });
 
        const billingData = {
            feedetailsbilling: billingArray,
            totaldiscount, grosstotal, totalfeewithouttax, totaltax, grandtotal, materialfee,
            finaltotal: grandtotal + materialfee
        };
 
        localStorage.setItem("PreOnBoardBillingSummary", JSON.stringify(billingData));
 
        // Navigation Logic
        const nextStep = activeStep + 1;
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set("active", nextStep);
            return params;
        });
    };
 
    return (
        <div className="fee-form">
            <div className="row text-start">
                <div className="col-md-3 mb-3">
                    <label className="form-label fw-semi">Fee Type</label>
                    <select name="feetype" value={feeData.feetype} onChange={handleChange} className="form-select">
                        <option value="">Select</option>
                        {!feeList.some(f => f.feetype === "Admission Fee") && <option value="Admission Fee">Admission Fee</option>}
                        {!feeList.some(f => f.feetype === "Course Fee") && <option value="Course Fee">Course Fee</option>}
                    </select>
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label fw-semi">Amount</label>
                    <input type="number" name="amount" value={feeData.amount} onChange={handleChange} className="form-control" readOnly />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="form-label fw-semi">Discount</label>
                    <input
                        type="number"
                        name="discount"
                        value={feeData.discount}
                        onChange={handleChange}
                        className="form-control"
                        disabled={feeData.isVoucher || feeData.feetype === "Admission Fee"}
                    />
                </div>
                <div className="col-md-3 mb-3 pt-4">
                    <button type="button" className={`btn btn-success w-100 mt-1 ${feeList.length==2 ? "cursor_pointer_not_allowed" : "" }`} disabled={feeList.length==2} onClick={handleSubmit}>Add Fee</button>
                </div>
            </div>
 
            <table className="table table-bordered mt-3 text-center">
                <thead className="table-light">
                    <tr >
                        <th className="fw-normal">Fee Type</th>
                        <th className="fw-normal">Amount</th>
                        <th className="fw-normal">Discount</th>
                        <th className="fw-normal">Tax (18%)</th> {/* Added Column */}
                        <th className="fw-normal">Net</th>
                        <th className="fw-normal">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {feeList.map((fee) => (
                        <tr key={fee.id}>
                            <td>{fee.feetype}</td>
                            <td>{fee.amount}</td>
                            <td>{fee.discount}</td>
                            <td className="text-primary">{fee.taxamount}</td> {/* Added Cell */}
                            <td>{fee.totalamount}</td>
                            <td>
                                <button
                                    type="button"
                                    className="btn  btn-sm"
                                    onClick={() => setFeeList(feeList.filter(f => f.id !== fee.id))}
                                >
                                   < MdOutlineDeleteOutline className="text-danger" size={20}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
 
            <div className="mt-4 d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={() => onNavigate(activeStep - 1)}>Previous</button>
                <button className="btn  bg_primary" onClick={handleFinalStep}>Next</button>
            </div>
        </div>
    );
};
 
export default PreOnBoardFeeDetails;
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
 
// const PreOnBoardFeeDetails = ({
//     courses = [], steps
// }) => {
 
//     const initialState = {
//         id: "",
//         feetype: "",
//         amount: "",
//         discount: 0
//     };
//     const [searchParams, setSearchParams] = useSearchParams();
//     const activeTabFromUrl = searchParams.get("active");
//     const [activeStep, setActiveStep] = useState(
//         activeTabFromUrl ? parseInt(activeTabFromUrl) : 0
//     );
//     const [feeData, setFeeData] = useState(initialState);
//     const [feeList, setFeeList] = useState([]);
//     const [errors, setErrors] = useState({});
 
//     // =========================================
//     // Load From LocalStorage
//     // =========================================
//     useEffect(() => {
//         const storedFees = localStorage.getItem("PreOnBoardFeeDetails");
//         if (storedFees) {
//             setFeeList(JSON.parse(storedFees));
//         }
//     }, []);
 
//     // =========================================
//     // Save To LocalStorage Whenever feeList Changes
//     // =========================================
//     useEffect(() => {
//         localStorage.setItem(
//             "PreOnBoardFeeDetails",
//             JSON.stringify(feeList)
//         );
//     }, [feeList]);
 
//     // =========================================
//     // Handle Change
//     // =========================================
//     const handleChange = (event) => {
//         const { name, value } = event.target;
 
//         setErrors(prev => ({ ...prev, [name]: "" }));
 
//         if (name === "feetype" && value === "Admission Fee") {
//             setFeeData({
//                 id: Date.now(),
//                 feetype: value,
//                 amount: 500,
//                 discount: 0
//             });
//         }
 
//         else if (name === "feetype" && value === "Course Fee") {
//             const preAdmissionData = JSON.parse(localStorage.getItem('PreOnBoardAdmissionDetails'));
//             let selectedCourse = courses.find(
//                 (course) => course.id === preAdmissionData?.coursesId
//             );
 
//             if (!selectedCourse) {
//                 setErrors({ feetype: "Please select course first" });
//                 return;
//             }
 
//             const voucherData = JSON.parse(localStorage.getItem("VoucherData"));
//             const discountType = voucherData?.valueType ?? null;
 
//             const fee = Number(selectedCourse.fee) || 0;
//             const percentage = Number(voucherData?.percentage) || 0;
//             const amount = Number(voucherData?.amount) || 0;
 
//             const discountAmount =
//                 discountType === "percentage"
//                     ? Math.round(fee * (percentage / 100))
//                     : amount;
 
//             setFeeData({
//                 id: Date.now(),
//                 feetype: value,
//                 amount: fee,
//                 discount: discountAmount || 0
//             });
//         }
 
//         else if (name === "discount") {
 
//             const numericValue = parseInt(value) || 0;
 
//             if (numericValue > feeData.amount) {
//                 setErrors({ discount: "Discount cannot exceed amount" });
//                 return;
//             }
 
//             setFeeData(prev => ({
//                 ...prev,
//                 discount: numericValue
//             }));
//         }
 
//         else if (name === "amount") {
 
//             const numericValue = parseInt(value) || 0;
 
//             setFeeData(prev => ({
//                 ...prev,
//                 amount: numericValue
//             }));
//         }
//     };
 
//     // =========================================
//     // Validation
//     // =========================================
//     const validateForm = () => {
 
//         let newErrors = {};
 
//         if (!feeData.feetype)
//             newErrors.feetype = "Please select fee type";
 
//         if (!feeData.amount)
//             newErrors.amount = "Please enter amount";
 
//         if (feeData.discount > feeData.amount)
//             newErrors.discount = "Discount cannot exceed amount";
 
//         setErrors(newErrors);
 
//         return Object.keys(newErrors).length === 0;
//     };
 
//     // =========================================
//     // Submit (Add Fee)
//     // =========================================
//     const handleSubmit = (e) => {
//         e.preventDefault();
 
//         if (validateForm()) {
 
//             setFeeList(prev => [...prev, feeData]);
//             localStorage.getItem("preOnBoardingFeeDetails", feeData)
//             const nextStep = activeStep + 1;
//             setActiveStep(nextStep);
//             // Update URL params directly to avoid race condition
//             setSearchParams(prev => {
//                 const params = new URLSearchParams(prev);
//                 params.set("active", nextStep);
//                 return params;
//             });
//         }
//     };
 
//     // =========================================
//     // Delete Fee
//     // =========================================
//     const handleDelete = (id) => {
//         const updatedList = feeList.filter(fee => fee.id !== id);
//         setFeeList(updatedList);
//     };
 
//     return (
//         <form onSubmit={handleSubmit}>
//             <div className="row">
 
//                 {/* Fee Type */}
//                 <div className="col-md-3 mb-3">
//                     <label>Fee Type *</label>
//                     <select
//                         name="feetype"
//                         value={feeData.feetype}
//                         onChange={handleChange}
//                         className={`form-select ${errors.feetype ? "is-invalid" : ""}`}
//                     >
//                         <option value="">Select</option>
//                         <option value="Admission Fee">Admission Fee</option>
//                         <option value="Course Fee">Course Fee</option>
//                     </select>
//                     {errors.feetype && (
//                         <div className="invalid-feedback">
//                             {errors.feetype}
//                         </div>
//                     )}
//                 </div>
 
//                 {/* Amount */}
//                 <div className="col-md-3 mb-3">
//                     <label>Amount *</label>
//                     <input
//                         type="number"
//                         name="amount"
//                         value={feeData.amount}
//                         onChange={handleChange}
//                         className={`form-control ${errors.amount ? "is-invalid" : ""}`}
//                     />
//                 </div>
 
//                 {/* Discount */}
//                 <div className="col-md-3 mb-3">
//                     <label>Discount</label>
//                     <input
//                         type="number"
//                         name="discount"
//                         value={feeData.discount}
//                         onChange={handleChange}
//                         className={`form-control ${errors.discount ? "is-invalid" : ""}`}
//                     />
//                 </div>
 
//                 {/* Net Amount */}
//                 <div className="col-md-3 mb-3">
//                     <label>Net Amount</label>
//                     <input
//                         type="number"
//                         value={(feeData.amount || 0) - (feeData.discount || 0)}
//                         disabled
//                         className="form-control"
//                     />
//                 </div>
 
//             </div>
 
//             <button type="submit" className="btn btn-primary mb-3">
//                 Add Fee
//             </button>
 
//             {/* Fee List Table */}
//             {feeList.length > 0 && (
//                 <table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th>Fee Type</th>
//                             <th>Amount</th>
//                             <th>Discount</th>
//                             <th>Net</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {feeList.map((fee) => (
//                             <tr key={fee.id}>
//                                 <td>{fee.feetype}</td>
//                                 <td>{fee.amount}</td>
//                                 <td>{fee.discount}</td>
//                                 <td>{fee.amount - fee.discount}</td>
//                                 <td>
//                                     <button
//                                         type="button"
//                                         className="btn btn-danger btn-sm"
//                                         onClick={() => handleDelete(fee.id)}
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
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
 
// export default PreOnBoardFeeDetails;
 
 