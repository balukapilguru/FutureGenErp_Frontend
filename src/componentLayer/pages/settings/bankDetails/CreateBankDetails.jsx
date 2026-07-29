import React, { useEffect, useState } from "react";
import BackButton from "../../../components/backbutton/BackButton";
import Button from "../../../components/button/Button";
import { useFetcher, useLoaderData, useNavigate, useParams } from "react-router-dom";

const CreateBankDetails = () => {
    const loaderData = useLoaderData();
    const { id } = useParams();
    const fetcher = useFetcher()
    const [isIFSCVerified, setIsIFSCVerified] = useState(false);

    const [formData, setFormData] = useState(() => {
        if (id && loaderData) {
            return {
                bankName: loaderData?.bankName || '',
                bankBranchName: loaderData?.bankBranchName || '',
                accountHolderName: loaderData?.accountHolderName || '',
                confirmAccountNumber: loaderData?.accountNumber || '',
                accountNumber: loaderData?.accountNumber || '',
                accountType: loaderData?.accountType || '',
                IFSC: loaderData?.IFSC || '',
                bankAddress: loaderData?.bankAddress || '',
                contactNumber: loaderData?.contactNumber || '',
                additionalNotes: loaderData?.additionalNotes || '',
            };
        } else {
            return {
                bankName: "",
                bankBranchName: "",
                accountHolderName: "",
                accountNumber: "",
                accountType: "",
                IFSC: "",
                bankAddress: "",
                contactNumber: "",
                additionalNotes: "",
                confirmAccountNumber: ""
            };
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError((prev) => ({
            ...prev,
            [name]: "",
        }));
        if (name === "contactNumber" && value.length > 10) {
            return;
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleIFSCVerification = () => {
        const regexIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        const IFSCString = formData.IFSC ? formData.IFSC.toString() : "";

        if (!IFSCString?.trim()) {
            setError((prev) => ({
                ...prev,
                IFSC: "IFSC is required",
            }));
            return;
        } else if (!regexIFSC.test(IFSCString?.trim())) {
            setError((prev) => ({
                ...prev,
                IFSC: "Enter a valid IFSC",
            }));
            return;
        }
        const data = new FormData();
        data.append("IFSC", formData?.IFSC);
        data.append("type", "ifscverify");

        setLoading(true);
        fetcher.submit(data, { method: "post" });
    };

    useEffect(() => {
        if (fetcher.data) {
            setLoading(false);
            if (fetcher.data.success) {
                const { bankName, bankBranchName } = fetcher.data.data;
                setFormData((prev) => ({
                    ...prev,
                    bankName: bankName || "",
                    bankBranchName: bankBranchName || "",
                }));
                setError((prev) => ({
                    ...prev,
                    IFSC: "",
                }));
                setIsIFSCVerified(true);
            }
        }
    }, [fetcher.data]);


    const validateForm = () => {
        let newErrors = {};
        if (!formData.IFSC?.trim()) {
            setError({ IFSC: "IFSC is required." });
            return false;
        }
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.IFSC?.trim())) {
            setError({ IFSC: "Enter a valid IFSC." });
            return false;
        }

        // Bank Name Validation
        if (!formData.bankName) {
            setError({ bankName: "Bank name is required." });
            return false;
        }
        else if (formData.bankName.length < 3) {
            setError({ bankName: "Bank name must be at least 3 characters long." });
            return false;
        }

        // Branch Name Validation
        if (!formData.bankBranchName) {
            setError({ bankBranchName: "Branch name is required." });
            return false;
        }

        // Account Holder Name Validation
        if (!formData.accountHolderName) {
            setError({ accountHolderName: "Account Holder name is required." });
            return false;
        }
        else if (formData.accountHolderName.length < 3) {
            setError({ accountHolderName: "At least 3 characters required." });
            return false;
        }

        // Account Number Validation
        if (!formData.accountNumber) {
            setError({ accountNumber: "Account number is required." });
            return false;
        } else if (!/^\d+$/.test(formData.accountNumber)) {
            setError({ accountNumber: "Account number must contain only numbers." });
            return false;
        } else if (formData.accountNumber.length < 8) {
            setError({ accountNumber: "Account no. min 8 digits." });
            return false;
        } else if (formData.accountNumber.length > 18) {
            setError({ accountNumber: "Account no. max 18 digits." });
            return false;
        }

        if (!formData.confirmAccountNumber) {
            setError({ confirmAccountNumber: "Confirm the Account Number" })
            return false
        } else if (formData.accountNumber !== formData.confirmAccountNumber) {
            setError({ confirmAccountNumber: "Account numbers do not match." });
            return false;
        }


        // Account Type Validation
        if (!formData.accountType) {
            setError({ accountType: "Account type is required." });
            return false;
        }

        // Bank Address Validation
        if (!formData.bankAddress) {
            setError({ bankAddress: "City is required." });
            return false;
        } else if (formData.bankAddress.length < 3) {
            setError({ bankAddress: "City must be at least 3 characters long." });
            return false;
        }

        // Contact Info Validation 
        if (!formData.contactNumber) {
            setError({ contactNumber: "Contact number must be 10 digits." });
            return false;
        } else if (!/^\d+$/.test(formData.contactNumber)) {
            setError({ contactNumber: "Contact number must contain only numbers." });
            return false;
        } else if (!/^\d{10}$/.test(formData.contactNumber)) {
            setError({ contactNumber: "Contact Number must be 10 digit." });
            return false;
        } else if (!/^[1-9]\d{9}$/.test(formData.contactNumber)) {
            setError({ contactNumber: "Cannot start with 0, enter 10 digits." });
            return false;
        }

        setError({});
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const bankDetails = {
            bankName: formData.bankName,
            bankBranchName: formData.bankBranchName,
            accountHolderName: formData.accountHolderName,
            accountNumber: formData.accountNumber,
            accountType: formData?.accountType,
            IFSC: formData?.IFSC,
            bankAddress: formData.bankAddress,
            contactNumber: formData.contactNumber,
            additionalNotes: formData.additionalNotes
        };

        const data = new FormData();
        Object.entries(bankDetails).forEach(([key, value]) => {
            if (value !== undefined) {
                data.append(key, value);
            }
        });
        data.append("type", "bankDetails")
        const method = id ? 'patch' : 'post';
        fetcher.submit(data, { method: method });
        setError({});
    };

    return (
        <div>
            <BackButton
                heading={id ? "Update Bank Details" : "Create Bank Details"}
                content="Back"
            />
            <div className="container-fluid">
                <div className="card border-0">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row d-flex">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="IFSC"
                                                className="form-label fs-s fw-medium black_300"
                                            >
                                                IFSC Code <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={
                                                    error && error.IFSC
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                        : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                }
                                                placeholder="Enter the IFSC Code"
                                                id="IFSC"
                                                name="IFSC"
                                                value={formData?.IFSC.toUpperCase()}
                                                onChange={handleChange}
                                            />

                                            <div style={{ height: "8px" }}>
                                                {error && error.IFSC && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {error.IFSC}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-3 mt-4">
                                        <div className="p-1">
                                            <Button
                                                type="button"
                                                className={"btn_primary"}
                                                onClick={() => handleIFSCVerification()}
                                                disabled={fetcher.state === "submitting"}
                                                style={{ cursor: fetcher.state === "submitting" ? "not-allowed" : "" }}
                                            >
                                                Verify
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Name */}
                                <div className="col-md-4">
                                    <label className="form-label fs-s fw-medium text_color">
                                        Bank Name<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={
                                            error && error.bankName
                                                ? "form-control fs-s bg-form text_color input_bg_color error-input"
                                                : "form-control fs-s bg-form text_color input_bg_color"
                                        }
                                        name="bankName"
                                        placeholder="Enter Bank Name"
                                        value={formData?.bankName}
                                        onChange={handleChange}
                                        disabled
                                        style={{ cursor: "not-allowed" }}
                                    />
                                    <div style={{ height: "8px" }}>
                                        {error && error.bankName && (
                                            <p className="text-danger m-0 fs-xs">
                                                {error.bankName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Branch Name */}
                                <div className="col-md-4">
                                    <label className="form-label fs-s fw-medium text_color">
                                        Bank Branch Name<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={
                                            error && error.bankBranchName
                                                ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                        }
                                        name="bankBranchName"
                                        placeholder="Enter Branch Name"
                                        value={formData?.bankBranchName}
                                        onChange={handleChange}
                                        disabled
                                        style={{ cursor: "not-allowed" }}

                                    />
                                    <div style={{ height: "8px" }}>
                                        {error && error.bankBranchName && (
                                            <p className="text-danger m-0 fs-xs">
                                                {error.bankBranchName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Account Holder Name */}
                                <div className="col-md-4">
                                    <label className="form-label fs-s fw-medium text_color">
                                        Account Holder Name<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={
                                            error && error.accountHolderName
                                                ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                        }
                                        name="accountHolderName"
                                        placeholder="Enter Account Holder Name"
                                        value={formData.accountHolderName}
                                        onChange={handleChange}
                                    />
                                    <div style={{ height: "8px" }}>
                                        {error && error.accountHolderName && (
                                            <p className="text-danger m-0 fs-xs">
                                                {error.accountHolderName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* Account Number */}
                                <div className="col-md-4 mt-2">
                                    <label className="form-label fs-s fw-medium text_color">
                                        Account Number<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className={
                                            error && error.accountNumber
                                                ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                        }
                                        name="accountNumber"
                                        placeholder="Enter Account Number"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                    />
                                    <div style={{ height: "8px" }}>
                                        {error && error.accountNumber && (
                                            <p className="text-danger m-0 fs-xs">
                                                {error.accountNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Confirm Number */}
                                <div className="col-md-4 mt-2">
                                    <label className="form-label fs-s fw-medium text_color">
                                        Confirm Account Number<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className={
                                            error && error.confirmAccountNumber
                                                ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                        }
                                        name="confirmAccountNumber"
                                        placeholder="Enter Confirm Account Number"
                                        value={formData.confirmAccountNumber}
                                        onChange={handleChange}
                                    />
                                    <div style={{ height: "8px" }}>
                                        {error && error.confirmAccountNumber && (
                                            <p className="text-danger m-0 fs-xs">
                                                {error.confirmAccountNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* Account Type */}
                                <div className="col-md-4 mt-2">
                                    <label className="form-label fs-s fw-medium text_color">
                                        Account Type<span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={
                                            error && error.accountType
                                                ? "form-control form-select fs-s bg-form text_color input_bg_color error-input "
                                                : "form-control form-select fs-s bg-form text_color input_bg_color text-capitalize"
                                        }
                                        name="accountType"
                                        value={formData.accountType}
                                        onChange={handleChange}
                                    >
                                        <option value="">--Select--</option>
                                        <option value="Savings">Savings</option>
                                        <option value="Checking">Checking</option>
                                        <option value="Current">Current</option>
                                    </select>
                                    <div style={{ height: "8px" }}>
                                        {error && error.accountType && (
                                            <p className="text-danger m-0 fs-xs">
                                                {error.accountType}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* bankAddress */}
                                <div className="col-md-4 mt-2">
                                    <label className="form-label fs-s fw-medium text_color">
                                        City<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={
                                            error && error.bankAddress
                                                ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                        }
                                        name="bankAddress"
                                        placeholder="Enter City"
                                        value={formData.bankAddress}
                                        onChange={handleChange}
                                    />
                                    <div style={{ height: "8px" }}>
                                        {error && error.bankAddress && (
                                            <p className="text-danger m-0 fs-xs">
                                                {error.bankAddress}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* contactNumber */}
                                <div className="col-md-4 mt-2">
                                    <label className="form-label fs-s fw-medium text_color">
                                        Contact Number<span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className={
                                            error && error.contactNumber
                                                ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                        }
                                        name="contactNumber"
                                        placeholder="Enter Contact Number"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        maxLength={10}
                                    />
                                    <div style={{ height: "8px" }}>
                                        {error && error.contactNumber && (
                                            <p className="text-danger m-0 fs-xs">
                                                {error.contactNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* additionalNotes */}
                                <div className="col-md-4 mt-2">
                                    <label className="form-label fs-s fw-medium text_color">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        type="text"
                                        className={
                                            error && error.additionalNotes
                                                ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                        }
                                        name="additionalNotes"
                                        placeholder="Enter Additional Notes"
                                        value={formData.additionalNotes}
                                        onChange={handleChange}
                                    />

                                </div>
                                {/* Submit Button */}

                                <div className="card-body d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        name="bankDetails"
                                        className="btn btn-sm btn-md btn_primary fs-13"
                                        // onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {id ? "Update" : "Create"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBankDetails;
