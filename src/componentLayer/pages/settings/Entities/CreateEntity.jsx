import React, { useEffect, useState } from 'react';
import Button from '../../../components/button/Button';
import { useFetcher, useLoaderData, useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/backbutton/BackButton';

const CreateEntity = () => {
    const { entityId } = useParams();
    const { entityData: editEntityData = {} } = useLoaderData() ?? {};
    const fetcher = useFetcher();
    const navigate = useNavigate();

    const [entityData, setEntityData] = useState({
        name: "",
        email: "",
        phone_number: null,
        entityImage: null,
        bankName: "",
        IFSC_code: "",
        accountNumber: "",
        branchName: "",
        bankHolderName: "",
        upiId: "", // New UPI ID field (optional)
    });

    const [error, setError] = useState({
        name: "",
        email: "",
        phone_number: null,
        entityImage: null,
        bankName: "",
        IFSC_code: "",
        accountNumber: "",
        branchName: "",
        bankHolderName: "",
        upiId: "",
    });

    useEffect(() => {
        if (entityId) {
            setEntityData(prev => ({
                ...prev,
                name: editEntityData.name,
                email: editEntityData.email,
                phone_number: editEntityData.phone_number,
                bankName: editEntityData.bankName,
                IFSC_code: editEntityData.IFSC_code,
                accountNumber: editEntityData.accountNumber,
                branchName: editEntityData.branchName,
                bankHolderName: editEntityData.bankHolderName,
                upiId: editEntityData.upiId || "", // Load existing UPI ID if available
            }));
        }
    }, []);

    const validateEntityData = () => {
        const errors = {};

        // Validate Name
        if (!entityData?.name?.trim() || entityData?.name?.trim().replace(/\s/g, "").length < 3) {
            errors.name = "Name must be 3+ characters, not empty or spaces.";
        }

        // Validate Email
        if (!entityData?.email || !/\S+@\S+\.\S+/.test(entityData?.email)) {
            errors.email = "Please provide a valid email address.";
        }

        // Validate Phone Number
        if (!entityData?.phone_number) {
            errors.phone_number = "Phone number is required.";
        } else if (!/^\d{10}$/.test(entityData.phone_number)) {
            errors.phone_number = "Phone number must be exactly 10 digits.";
        } else if (entityData.phone_number?.toString().startsWith("0")) {
            errors.phone_number = "Phone number cannot start with 0.";
        }

        // Validate Bank Name
        if (entityData.bankName?.trim() && entityData.bankName.trim().replace(/\s/g, "").length < 3) {
            errors.bankName = "Bank Name must be at least 3 characters long.";
        }

        // Validate IFSC Code
        const regexIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (entityData.IFSC_code && !regexIFSC.test(entityData.IFSC_code)) {
            errors.IFSC_code = "Enter a valid IFSC code.";
        }

        // Validate Account Number
        if (entityData.accountNumber) {
            if (entityData.accountNumber?.trim()?.replace(/\s/g, "")?.length < 4) {
                errors.accountNumber = "Account Number must be at least 4 characters.";
            }
        }

        // Validate Branch Name
        if (entityData.branchName?.trim()) {
            if (entityData.branchName.trim().replace(/\s/g, "").length < 3) {
                errors.branchName = "Branch Name must be at least 3 characters.";
            }
        }

        // Validate Bank Holder Name
        if (entityData.bankHolderName?.trim()) {
            if (entityData.bankHolderName.trim().replace(/\s/g, "").length < 3) {
                errors.bankHolderName = "Bank Holder Name must be at least 3 characters.";
            }
        }
        // Validate UPI ID (optional field but if provided, it should be valid)
        if (entityData.upiId && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(entityData.upiId)) {
            errors.upiId = "Enter a valid UPI ID (e.g., john.doe@upi).";
        }

        setError(errors);
        return errors;
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setEntityData({ ...entityData, [name]: value });
        setError({ ...error, [name]: "" });
    };

    const handleSubmitEntityData = () => {
        const errors = validateEntityData();

        // Check if there are any validation errors
        if (Object.keys(errors).length > 0) {
            console.error("Validation failed:", errors);
            return; // Stop if validation fails
        }

        const formdata = new FormData();
        formdata.set("name", entityData.name);
        formdata.set("email", entityData.email);
        formdata.set("phone_number", entityData.phone_number);
        formdata.set("entityImage", entityData.entityImage);
        formdata.set("bankName", entityData.bankName);
        formdata.set("IFSC_code", entityData.IFSC_code);
        formdata.set("accountNumber", entityData.accountNumber);
        formdata.set("branchName", entityData.branchName);
        formdata.set("bankHolderName", entityData.bankHolderName);
        formdata.set("upiId", entityData.upiId); // Optional field, only if provided
        formdata.set("type", entityId ? "edit" : "create");

        if (entityId) {
            fetcher.submit(formdata, {
                method: "put",
                encType: "application/form-data"
            });
        } else {
            fetcher.submit(formdata, {
                method: "post",
                encType: "application/form-data"
            });
        }
    };

    useEffect(() => {
        if (fetcher?.data?.status === 200 || fetcher?.data?.status === 201) {
            navigate("/settings/entity");
        }
    }, [fetcher]);

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError({ ...error, image: "Please upload a valid image (JPEG, PNG, GIF)" });
                return;
            }

            // Validate file size (max 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            if (file.size > maxSize) {
                setError({ ...error, entityImage: "Image size should be less than 2MB" });
                return;
            }

            setEntityData({ ...entityData, entityImage: file });
            setError({ ...error, entityImage: "" });
        }
    };



    return (
        <div>
            {entityId ? (
                <BackButton heading="Edit Entity" content="Back" />
            ) : (
                <BackButton heading="Entity Form" content="Back" />
            )}
            <div className="container-fluid">
                <div className="card border-0">
                    <div className="card-body">
                        <div className="live-prieview">
                            <form>
                                <div className="row d-flex">
                                    {/* Name Field */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label fs-s fw-medium black_300">
                                                Entity Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={error && error.name ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color text-capitalize"}
                                                placeholder="Enter Entity Name"
                                                id="name"
                                                name="name"
                                                value={entityData.name}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.name && <p className="text-danger m-0 fs-xs">{error.name}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label fs-s fw-medium black_300">
                                                Email Id<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className={error && error.email ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color"}
                                                placeholder="Enter Email Id"
                                                id="email"
                                                name="email"
                                                value={entityData.email}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.email && <p className="text-danger m-0 fs-xs">{error.email}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone Number Field */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="phone_number" className="form-label fs-s fw-medium black_300">
                                                Phone Number<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={10}
                                                className={error && error.phone_number ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color"}
                                                placeholder="Enter Phone Number"
                                                name="phone_number"
                                                value={entityData.phone_number || ""}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.phone_number && <p className="text-danger m-0 fs-xs">{error.phone_number}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Entity Image */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label fs-s fw-medium black_300">
                                                Entity Image
                                            </label>
                                            <input
                                                type="file"
                                                className={error && error.entityImage ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color"}
                                                placeholder="Upload Entity Image"
                                                id="entityImage"
                                                name="entityImage"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <div className="text-muted fs-xs mt-1">
                                                Supported formats: JPEG, PNG, GIF (Max 2MB)
                                            </div>
                                            <div style={{ height: "8px" }}>
                                                {error && error.entityImage && <p className="text-danger m-0 fs-xs">{error.entityImage}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Bank Name Field */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="bankName" className="form-label fs-s fw-medium black_300">
                                                Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                className={error && error.bankName ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color"}
                                                placeholder="Enter Bank Name"
                                                name="bankName"
                                                value={entityData.bankName}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.bankName && <p className="text-danger m-0 fs-xs">{error.bankName}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* IFSC Code Field */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="IFSC_code" className="form-label fs-s fw-medium black_300">
                                                IFSC Code
                                            </label>
                                            <input
                                                type="text"
                                                className={error && error.IFSC_code ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color"}
                                                placeholder="Enter IFSC Code"
                                                name="IFSC_code"
                                                value={entityData.IFSC_code}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.IFSC_code && <p className="text-danger m-0 fs-xs">{error.IFSC_code}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Number Field */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="accountNumber" className="form-label fs-s fw-medium black_300">
                                                Bank A/C No.
                                            </label>
                                            <input
                                                type="text"
                                                className={error && error.accountNumber ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color"}
                                                placeholder="Enter Account Number"
                                                name="accountNumber"
                                                value={entityData.accountNumber}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.accountNumber && <p className="text-danger m-0 fs-xs">{error.accountNumber}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Branch Name Field */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="branchName" className="form-label fs-s fw-medium black_300">
                                               Bank Branch
                                            </label>
                                            <input
                                                type="text"
                                                className={error && error.branchName ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color"}
                                                placeholder="Enter Branch Name"
                                                name="branchName"
                                                value={entityData.branchName}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.branchName && <p className="text-danger m-0 fs-xs">{error.branchName}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Holder Name Field */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="bankHolderName" className="form-label fs-s fw-medium black_300">
                                                Bank Holder Name
                                            </label>
                                            <input
                                                type="text"
                                                className={error && error.bankHolderName ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color"}
                                                placeholder="Enter Bank Holder Name"
                                                name="bankHolderName"
                                                value={entityData.bankHolderName}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.bankHolderName && <p className="text-danger m-0 fs-xs">{error.bankHolderName}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* UPI ID Field */}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="upiId" className="form-label fs-s fw-medium black_300">
                                                UPI ID (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                className={error && error.upiId ? "form-control fs-s bg-form text_color input_bg_color error-input" : "form-control fs-s bg-form text_color input_bg_color"}
                                                placeholder="Enter UPI ID"
                                                name="upiId"
                                                value={entityData.upiId}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.upiId && <p className="text-danger m-0 fs-xs">{error.upiId}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="d-flex justify-content-end mt-3">
                                    <Button
                                        className={"btn_primary"}
                                        onClick={(e) => handleSubmitEntityData(e)}
                                        disabled={fetcher.state !== "idle"}
                                        style={{ cursor: fetcher.state === "submitting" ? "not-allowed" : "pointer" }}
                                    >
                                        {entityId ? fetcher.state === "submitting" ? "Updating" : "Update" : fetcher.state === "submitting" ? "Submitting" : "Submit"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEntity;
