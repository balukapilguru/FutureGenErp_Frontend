import React, { useState, useEffect } from "react";

const PreOnBoardOtherDetails = ({ steps, activeStep, onNavigate }) => {
    const initialState = {
        admissionremarks: "",
        assets: [],
        tshirtSize: ""
    };

    const [otherDetails, setOtherDetails] = useState(initialState);
    const [errors, setErrors] = useState({});

    // Logic for showing Mac/T-shirt (adjust based on your actual business rule)
    // For example: only show if a specific course package is selected in Step 2
    const [shouldShowMacAndTshirt, setShouldShowMacAndTshirt] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem("PreOnBoardOtherDetails");
        if (storedData) {
            setOtherDetails(JSON.parse(storedData));
        }

        // Check if we should show T-shirt/Mac based on Admission Step data
        const admissionData = JSON.parse(localStorage.getItem("PreOnBoardAdmissionDetails"));
        if (admissionData?.coursepackage?.toLowerCase().includes("pro") ||
            admissionData?.coursepackage?.toLowerCase().includes("master")) {
            setShouldShowMacAndTshirt(true);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setOtherDetails((prev) => {
                const currentAssets = [...prev.assets];
                if (checked) {
                    currentAssets.push(name);
                } else {
                    const index = currentAssets.indexOf(name);
                    if (index > -1) currentAssets.splice(index, 1);
                }
                return { ...prev, assets: currentAssets };
            });
        } else {
            setOtherDetails((prev) => ({ ...prev, [name]: value }));
        }

        // Clear error when user types
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!otherDetails.admissionremarks) {
            newErrors.admissionremarks = "Admission Remarks is required";
        } else if (otherDetails.admissionremarks.trim().replace(/\s/g, "").length < 3) {
            newErrors.admissionremarks = "Remarks must be at least 3 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            localStorage.setItem("PreOnBoardOtherDetails", JSON.stringify(otherDetails));
            onNavigate(activeStep + 1);
        }
    };

    const assetList = [
        { id: "linkedIn", label: "LinkedIn" },
        { id: "paidInternship", label: "Paid Internship" },
        { id: "employmentDocument", label: "Employment Document" },
        { id: "bag", label: "Bag" },
        { id: "laptop", label: "Laptop" },
        { id: "lms", label: "LMS" },
        { id: "courseMaterial", label: "Course Material" },
    ];

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Remarks Input */}
                <div className="col-lg-12 mb-4">
                    <label className="form-label fw-bold">Remarks <span className="text-danger">*</span></label>
                    <textarea
                        name="admissionremarks"
                        className={`form-control ${errors.admissionremarks ? "is-invalid" : ""}`}
                        placeholder="Enter your Remarks"
                        rows="3"
                        value={otherDetails.admissionremarks}
                        onChange={handleInputChange}
                    />
                    {errors.admissionremarks && <div className="invalid-feedback">{errors.admissionremarks}</div>}
                </div>

                {/* Assets Checkboxes */}
                <div className="col-lg-6 mb-3">
                    <label className="form-label fw-bold d-block mb-2">Assets Issued</label>
                    <div className="row shadow-sm p-3 border rounded bg-light mx-0">
                        {assetList.map((asset) => (
                            <div className="col-md-6 mb-2" key={asset.id}>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={asset.id}
                                        name={asset.id}
                                        checked={otherDetails.assets.includes(asset.id)}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor={asset.id}>
                                        {asset.label}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conditional Mac and T-shirt section */}
                {shouldShowMacAndTshirt && (
                    <div className="col-lg-6 mb-3">
                        <label className="form-label fw-bold d-block mb-2">Premium Assets</label>
                        <div className="row shadow-sm p-3 border rounded bg-light mx-0">
                            <div className="col-md-6 mb-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="mac"
                                        name="mac"
                                        checked={otherDetails.assets.includes("mac")}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="mac">MacBook Issued</label>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <label className="form-label small">T-shirt Size</label>
                                <select
                                    className="form-select"
                                    name="tshirtSize"
                                    value={otherDetails.tshirtSize}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Size</option>
                                    {["xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl"].map(size => (
                                        <option key={size} value={size}>{size.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={() => onNavigate(activeStep - 1)}>
                    Previous
                </button>
                <button type="submit" className="btn bg_primary px-4">
                    {activeStep === steps.length - 1 ? 'Finish' : 'Continue to Preview'}
                </button>
            </div>
        </form>
    );
};

export default PreOnBoardOtherDetails;