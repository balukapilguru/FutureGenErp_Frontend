import React, { useState, useEffect } from 'react';

const PreOnBoardStudentEducation = ({ educationDetails = {}, steps, activeStep, onNavigate }) => {
    const initialState = {
        educationtype: "",
        marks: "",
        academicyear: ""
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedData = localStorage.getItem('PreOnBoardStudentEducation');
        if (storedData) {
            setFormData({ ...initialState, ...JSON.parse(storedData) });
        } else if (educationDetails && Object.keys(educationDetails).length > 0) {
            setFormData({ ...initialState, ...educationDetails });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const fields = ['educationtype', 'marks', 'academicyear'];
        const newErrors = {};

        for (let field of fields) {
            const value = formData[field];

            if (!value) {
                newErrors[field] = 'This field is required';
            }

            // ✅ Percentage: exactly 2 digits (10-99) OR with decimal (e.g., 75.5)
            else if (field === 'marks') {
                // Allow numbers with optional decimal point and up to 2 digits before and after decimal
                if (!/^\d{1,2}(\.\d{1,2})?$/.test(value)) {
                    newErrors[field] = 'Percentage must be between 0-99 with up to 2 decimal places';
                } else {
                    const numValue = parseFloat(value);
                    if (numValue < 0 || numValue > 99) {
                        newErrors[field] = 'Percentage must be between 0 and 99';
                    }
                }
            }

            // ✅ Academic Year as DATE (YYYY-MM-DD)
            else if (field === 'academicyear') {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    newErrors[field] = 'Invalid date';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            localStorage.setItem('PreOnBoardStudentEducation', JSON.stringify(formData));
            onNavigate(activeStep + 1);
        }
    };

    // const renderInput = (label, name, type = "text") => {
    //     if (name === "educationtype") {
    //         return (
    //             <div className="col-md-3 mb-3" key={name}>
    //                 <label className="form-label">{label} <span className="text-danger">*</span></label>
    //                 <select
    //                     name={name}
    //                     value={formData[name]}
    //                     onChange={handleChange}
    //                     className={`form-select ${errors[name] ? 'is-invalid' : ''}`}
    //                 >
    //                     <option value="">Select</option>
    //                     <option value="B.Tech">B.Tech</option>
    //                     <option value="MCA">MCA</option>
    //                     <option value="SSC">SSC</option>
    //                     <option value="Other">Other</option>
    //                 </select>
    //                 {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    //             </div>
    //         );
    //     }

    //     if (name === "academicyear") {
    //         return (
    //             <div className="col-md-3 mb-3" key={name}>
    //                 <label className="form-label">{label} <span className="text-danger">*</span></label>
    //                 <input
    //                     type="date"
    //                     name={name}
    //                     value={formData[name]}
    //                     onChange={handleChange}
    //                     className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
    //                 />
    //                 {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    //             </div>
    //         );
    //     }

    //     // For marks (percentage)
    //     return (
    //         <div className="col-md-3 mb-3" key={name}>
    //             <label className="form-label">{label} <span className="text-danger">*</span></label>
    //             <input
    //                 type="text"
    //                 name={name}
    //                 value={formData[name]}
    //                 onChange={(e) => {
    //                     // Allow digits and optional decimal point
    //                     const value = e.target.value;
    //                     if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
    //                         handleChange(e);
    //                     }
    //                 }}
    //                 placeholder="e.g., 85.5"
    //                 className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
    //             />
    //             {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    //         </div>
    //     );
    // };


    const renderInput = (
        label,
        name,
        type = "text",
        maxLength = null,
        min = null,
        max = null
    ) => {

        // Special case: Education Type (Select)
        if (name === "educationtype") {
            return (
                <div className="col-md-3 mb-3" key={name}>
                    <label className="form-label">
                        {label} <span className="text-danger">*</span>
                    </label>
                    <select
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        className={`form-select ${errors[name] ? 'is-invalid' : ''}`}
                    >
                        <option value="">Select</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="MCA">MCA</option>
                        <option value="SSC">SSC</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors[name] && (
                        <div className="invalid-feedback">{errors[name]}</div>
                    )}
                </div>
            );
        }

        // If type is number → use text to allow maxLength
        const inputType = type === "number" ? "text" : type;

        return (
            <div className="col-md-3 mb-3" key={name}>
                <label className="form-label">
                    {label} <span className="text-danger">*</span>
                </label>

                <input
                    type={inputType}
                    name={name}
                    value={formData[name] || ""}
                    min={type === "date" ? min : undefined}
                    max={type === "date" ? max : undefined}
                    onChange={(e) => {
                        const { value } = e.target;

                        // ✅ NUMBER VALIDATION (digits only)
                        if (type === "number" && value !== "" && !/^\d+$/.test(value)) {
                            return;
                        }

                        // ✅ MARKS VALIDATION (decimal allowed)
                        if (name === "marks") {
                            if (!/^\d*\.?\d{0,2}$/.test(value) && value !== "") {
                                return;
                            }
                        }

                        // ✅ MAX LENGTH VALIDATION
                        if (maxLength && value.length > maxLength) {
                            return;
                        }

                        handleChange(e);
                    }}
                    placeholder={
                        type === "date" ? "" : `Enter ${label}`
                    }
                    className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                />

                {errors[name] && (
                    <div className="invalid-feedback">{errors[name]}</div>
                )}
            </div>
        );
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {renderInput("Education Type", "educationtype")}
                {renderInput("Percentage (%)", "marks","text",2)}
                {renderInput("Academic Year", "academicyear","text",4)}
            </div>
            <div className="mt-4 d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={() => onNavigate(activeStep - 1)}>
                    Previous
                </button>
                <button type="submit" className="btn bg_primary">
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </form>
    );
};

export default PreOnBoardStudentEducation;





























// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { NumberInput } from '../../../../../utils/Utils';

// const PreOnBoardStudentEducation = ({ educationDetails = {}, steps }) => {
//     const [searchParams, setSearchParams] = useSearchParams();
//     const activeTabFromUrl = searchParams.get('active');
//     const [activeStep, setActiveStep] = useState(activeTabFromUrl ? parseInt(activeTabFromUrl) : 0);

//     const initialState = {
//         educationtype: "",
//         marks: "",
//         academicyear: ""
//     };

//     const [formData, setFormData] = useState(initialState);
//     const [errors, setErrors] = useState({});

//     // ========================================
//     // Step from URL
//     // ========================================
//     useEffect(() => {
//         if (activeTabFromUrl !== null) {
//             setActiveStep(parseInt(activeTabFromUrl));
//         }
//     }, [activeTabFromUrl]);

//     useEffect(() => {
//         setSearchParams(prev => {
//             const currentActive = prev.get("active");

//             if (currentActive === String(activeStep)) {
//                 return prev; // no update needed
//             }

//             const params = new URLSearchParams(prev);
//             params.set("active", activeStep);
//             return params;
//         });
//     }, [activeStep]);


//     // ========================================
//     // Load localStorage or API data
//     // ========================================
//     useEffect(() => {
//         const storedData = localStorage.getItem('PreOnBoardStudentEducation');
//         if (storedData) {
//             const parsedData = JSON.parse(storedData);
//             setFormData({ ...initialState, ...parsedData });
//             return; // stop if localStorage exists
//         }
//         if (educationDetails && Object.keys(educationDetails).length > 0) {
//             setFormData({ ...initialState, ...educationDetails });
//         }
//     }, []);

//     // ========================================
//     // Handle Input Changes
//     // ========================================
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: "" }));
//         }
//     };

//     // ========================================
//     // Validation (Old style - stop at first error)
//     // ========================================
//     const validateForm = () => {
//         const fields = ['educationtype', 'marks', 'academicyear'];
//         const newErrors = {}; // ✅ collect all errors

//         for (let field of fields) {
//             const value = formData[field];
//             let error = '';

//             switch (field) {
//                 case 'educationtype':
//                     if (!value) error = 'Select education type';
//                     break;

//                 case 'marks':
//                     if (!value) error = 'Percentage required';
//                     else if (!/^\d{1,2}$/.test(value)) error = 'Percentage must be 1-2 digits';
//                     break;

//                 case 'academicyear':
//                     if (!value) error = 'Academic year required';
//                     else if (!/^[2-9]\d{3}$/.test(value)) error = 'Invalid Year';
//                     break;

//                 default:
//                     break;
//             }

//             if (error) {
//                 newErrors[field] = error;
//             }
//         }

//         setErrors(newErrors); // ✅ set all errors at once

//         return Object.keys(newErrors).length === 0; // ✅ return true only if no errors
//     };


//     // ========================================
//     // Submit Handler
//     // ========================================
//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (validateForm()) {
//             localStorage.setItem('PreOnBoardStudentEducation', JSON.stringify(formData));
//             const step = searchParams.get('active');
//             setActiveStep(Number(step) + 1);
//         }
//     };

//     // ========================================
//     // Render Inputs
//     // ========================================
//     const renderInput = (label, name, type = "text") => {
//         const maxLengths = { marks: 2, academicyear: 4 };

//         // Education Type Dropdown
//         if (name === "educationtype") {
//             return (
//                 <div className="col-md-3 mb-3">
//                     <label className="form-label text-nowrap">{label} *</label>
//                     <select
//                         name={name}
//                         value={formData[name]}
//                         onChange={handleChange}
//                         className={`form-select ${errors[name] ? 'is-invalid' : ''}`}
//                     >
//                         <option value="">Select</option>
//                         <option value="B.Tech">B.Tech</option>
//                         <option value="MCA">MCA</option>
//                         <option value="SSC">SSC</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
//                 </div>
//             );
//         }

//         // Number Input
//         // if (type === "number") {
//         //     return (
//         //         <div className="col-md-3 mb-3">
//         //             <label className="form-label text-nowrap">{label} *</label>
//         //             <NumberInput
//         //                 maxLength={maxLengths[name] || undefined}
//         //                 value={formData[name]}
//         //                 placeholder={label}
//         //                 onChange={(value) => handleChange({ target: { name, value } })}
//         //             />
//         //             {errors[name] && <div className='text-sm text-danger'>{errors[name]}</div>}
//         //         </div>

//         //     );
//         // }

//         // Default Text Input
//         return (
//             <div className="col-md-3 mb-3">
//                 <label className="form-label text-nowrap">{label} *</label>
//                 <input
//                     type={type}
//                     name={name}
//                     value={formData[name]}
//                     placeholder={label}
//                     onChange={handleChange}
//                     maxLength={maxLengths[name] || undefined}
//                     className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
//                 />
//                 {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
//             </div>
//         );
//     };

//     return (
//         <div className="card-body px-0">
//             <form onSubmit={handleSubmit}>
//                 <div className="row">
//                     {renderInput("Education Type", "educationtype")}
//                     {renderInput("Percentage", "marks", "number")}
//                     {renderInput("Academic Year", "academicyear", "number")}
//                 </div>

//                 <div className="mt-4 d-flex justify-content-between">
//                     <button
//                         className="btn btn-secondary"
//                         disabled={activeStep === 0}
//                         onClick={() => setActiveStep(activeStep - 1)}
//                         type="button"
//                     >
//                         Previous
//                     </button>
//                     <button
//                         className="btn btn-primary"
//                         type="submit"
//                     >
//                         {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default PreOnBoardStudentEducation;
