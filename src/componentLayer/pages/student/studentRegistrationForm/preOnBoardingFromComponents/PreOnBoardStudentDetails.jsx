import React, { useState, useEffect } from 'react';
import { ERPApi } from '../../../../../serviceLayer/interceptor';

const PreOnBoardStudentDetails = ({ studentDetails = {}, steps, activeStep, onNavigate }) => {
    const initialState = {
        name: "", email: "", imageFile: "", filename: "", imagePerview: "",
        studentImg: "", aadharCardImage: "", aadharCardImageData: "",
        aadharImagePerview: "", aadharImageFile: "", aadharCardNumber: "",
        birthdate: "", mobilenumber: "", whatsappno: "", gender: "",
        maritalstatus: "", college: "", zipcode: "", country: "",
        state: "", native: "", area: "", parentsname: "", parentsnumber: ""
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [emailOtpModal, setEmailOtpModal] = useState(false);
    const [emailOtp, setEmailOtp] = useState("");
    const [emailOtpTimer, setEmailOtpTimer] = useState(120);
    const [emailOtpLoading, setEmailOtpLoading] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [otpIntervalId, setOtpIntervalId] = useState(null);

    // Load student details from localStorage first
    useEffect(() => {
        const storedData = localStorage.getItem('PreOnBoardStudentDetails');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setFormData(prev => ({ ...prev, ...parsedData }));
            
            // Check if email was verified in stored data
            if (parsedData.isEmailVerified) {
                setIsEmailVerified(true);
            }
        } else if (Object.keys(studentDetails).length > 0) {
            setFormData({ ...initialState, ...studentDetails });
        }
    }, [studentDetails]);

    // Check localStorage for email verification status
    useEffect(() => {
        // Only proceed if we have formData.email
        if (!formData.email) return;

        const storedEmailData = localStorage.getItem('emailVerification');
        if (storedEmailData) {
            const { email: storedEmail, isVerified } = JSON.parse(storedEmailData);
            
            // Only restore if emails match
            if (storedEmail === formData.email) {
                if (isVerified) {
                    // Email is verified, set the state
                    setIsEmailVerified(true);
                } else {
                    // Check for OTP session
                    const { timestamp, isMailSent } = JSON.parse(storedEmailData);
                    const timeDiff = Date.now() - timestamp;
                    
                    // Check if email was sent within last 5 minutes (300000 ms)
                    if (timeDiff < 300000 && isMailSent) {
                        const remainingTime = Math.max(0, 120 - Math.floor(timeDiff / 1000));
                        
                        if (remainingTime > 0) {
                            setEmailOtpTimer(remainingTime);
                            setEmailOtpModal(true);
                            
                            // Start timer with remaining time
                            const expiryTime = Date.now() + (remainingTime * 1000);
                            startEmailOtpTimer(expiryTime);
                        }
                    }
                }
            }
        }
    }, [formData.email]); // Run when email is available

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (name === "email") {
            // Only reset if email actually changes
            if (value !== formData.email) {
                setIsEmailVerified(false);
                
                // Clear email verification data when email changes
                localStorage.removeItem("emailVerification");
                
                // Update formData with isEmailVerified flag
                const updatedFormData = { ...formData, email: value, isEmailVerified: false };
                setFormData(updatedFormData);
                
                // Save to localStorage
                localStorage.setItem('PreOnBoardStudentDetails', JSON.stringify(updatedFormData));
                
                setEmailOtpModal(false);
                setEmailOtp("");
                
                // Clear any running timer
                if (otpIntervalId) {
                    clearInterval(otpIntervalId);
                    setOtpIntervalId(null);
                }
            }
        } else if (type === 'file') {
            handleFileChange(name, files);
        } else {
            const updatedFormData = { ...formData, [name]: value };
            setFormData(updatedFormData);
            
            // Save to localStorage on every change
            localStorage.setItem('PreOnBoardStudentDetails', JSON.stringify(updatedFormData));
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (name, files) => {
        const file = files[0];
        if (!file) return;
        const maxSize = 2 * 1024 * 1024;
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, [name]: "Only JPG, JPEG, PNG, or WEBP allowed" }));
            return;
        }
        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, [name]: "File size must be 2 MB or less" }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            let updatedFormData;
            
            if (name === "filename") {
                updatedFormData = {
                    ...formData, 
                    filename: file.name, 
                    imageFile: file,
                    imagePerview: reader.result, 
                    studentImg: base64Data
                };
            } else {
                updatedFormData = {
                    ...formData, 
                    aadharCardImage: file.name, 
                    aadharImageFile: file,
                    aadharImagePerview: reader.result, 
                    aadharCardImageData: base64Data
                };
            }
            
            setFormData(updatedFormData);
            localStorage.setItem('PreOnBoardStudentDetails', JSON.stringify(updatedFormData));
        };
        reader.readAsDataURL(file);
    };

    const namePatterns = /^[A-Za-z\s]+$/;
    const emailPatterns = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const aadhaarPattern = /^\d{12}$/;
    const zipcodePattern = /^\d{6}$/;
    
    const validateForm = () => {
        const fields = [
            'name', 'email', 'mobilenumber', 'whatsappno', 'aadharCardNumber',
            'birthdate', 'parentsname', 'parentsnumber',
            'college', 'zipcode', 'country', 'state', 'area', 'native',
            'gender', 'maritalstatus',
            'filename', 'aadharCardImage'
        ];

        for (let field of fields) {
            let error = '';
            const value = formData[field];

            switch (field) {
                case 'name':
                    if (!value?.trim()) error = 'Name is required';
                    else if (value.length < 3) error = 'Minimum 3 characters';
                    else if (!namePatterns.test(value)) error = 'Only alphabets allowed';
                    break;

                case 'parentsname':
                    if (!value?.trim()) error = 'Parent name is required';
                    else if (!namePatterns.test(value)) error = 'Only alphabets allowed';
                    break;

                case 'email':
                    if (!value?.trim()) error = 'Email is required';
                    else if (!emailPatterns.test(value)) error = 'Invalid email format';
                    break;

                case 'mobilenumber':
                case 'whatsappno':
                case 'parentsnumber':
                    if (!value) {
                        error = 'Mobile number is required';
                    }
                    else if (!/^\d+$/.test(value)) {
                        error = 'Only numbers allowed';
                    }
                    else if (value.length < 10) {
                        error = 'Mobile number must be 10 digits';
                    }
                    else if (value.length > 10) {
                        error = 'Mobile number must be exactly 10 digits';
                    }
                    else if (!/^[6-9]/.test(value)) {
                        error = 'Mobile number must start with 6, 7, 8, or 9';
                    }
                    break;

                case 'aadharCardNumber':
                    if (!value) error = 'Aadhaar number is required';
                    else if (!aadhaarPattern.test(value))
                        error = 'Aadhaar must be 12 digits';
                    break;

                case 'birthdate':
                    if (!value) error = 'Birthdate is required';
                    break;

                case 'college':
                    if (!value?.trim()) error = 'College is required';
                    break;

                case 'zipcode':
                    if (!value) error = 'Zipcode is required';
                    else if (!zipcodePattern.test(value))
                        error = 'Zipcode must be 6 digits';
                    break;

                case 'country':
                case 'state':
                case 'area':
                case 'native':
                    if (!value?.trim()) error = 'This fiels is required';
                    break;

                case 'gender':
                    if (!value) error = 'Gender is required';
                    break;

                case 'maritalstatus':
                    if (!value) error = 'Marital status is required';
                    break;

                case 'filename':
                    if (!formData.imagePerview)
                        error = 'Profile image is required';
                    break;

                case 'aadharCardImage':
                    if (!formData.aadharImagePerview)
                        error = 'Aadhaar image is required';
                    break;

                default:
                    break;
            }

            if (error) {
                setErrors({ [field]: error });
                return false;
            }
        }

        return true;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isEmailVerified) {
            setErrors(prev => ({
                ...prev,
                email: "Please verify email"
            }));
            return;
        }

        if (validateForm()) {
            // Save student details with verification status
            const updatedFormData = { ...formData, isEmailVerified: true };
            localStorage.setItem(
                "PreOnBoardStudentDetails",
                JSON.stringify(updatedFormData)
            );
            
            // Remove ONLY email verification session data (OTP related)
            // but keep the verified status in student details
            localStorage.removeItem('emailVerification');
            
            // Navigate to next step
            onNavigate(activeStep + 1);
        }
    };
    
    const sendEmailOtp = async () => {
        if (!formData.email) {
            setErrors(prev => ({ ...prev, email: "Enter email first" }));
            return;
        }

        // Validate email format
        if (!emailPatterns.test(formData.email)) {
            setErrors(prev => ({ ...prev, email: "Invalid email format" }));
            return;
        }

        setEmailError("");
        setEmailOtpLoading(true);

        try {
            const response = await ERPApi.post("/student/sendotp", {
                email: formData.email,
            });

            if (response.status === 200) {
                const expiryTime = Date.now() + 120 * 1000; // 2 minutes
                
                // Store email verification session data in localStorage
                localStorage.setItem("emailVerification", JSON.stringify({
                    email: formData.email,
                    timestamp: Date.now(),
                    isMailSent: true,
                    isVerified: false
                }));

                setEmailOtp("");
                setEmailOtpModal(true);
                startEmailOtpTimer(expiryTime);
            }
        } catch (error) {
            setEmailError(
                error?.response?.data?.message || "Failed to send OTP"
            );
        } finally {
            setEmailOtpLoading(false);
        }
    };
    
    const startEmailOtpTimer = (expiryTime) => {
        // Clear any existing interval
        if (otpIntervalId) {
            clearInterval(otpIntervalId);
        }

        const interval = setInterval(() => {
            const remaining = Math.floor((expiryTime - Date.now()) / 1000);

            if (remaining <= 0) {
                setEmailOtpTimer(0);
                clearInterval(interval);
                
                // Update localStorage to indicate OTP expired
                const emailData = localStorage.getItem('emailVerification');
                if (emailData) {
                    const parsed = JSON.parse(emailData);
                    localStorage.setItem('emailVerification', JSON.stringify({
                        ...parsed,
                        isMailSent: false
                    }));
                }
                
                // Close modal when timer expires
                setEmailOtpModal(false);
                setEmailError("OTP expired. Please request again.");
            } else {
                setEmailOtpTimer(remaining);
            }
        }, 1000);

        setOtpIntervalId(interval);
    };

    const verifyEmailOtp = async () => {
        if (!emailOtp || emailOtp.length !== 6) {
            setEmailError("Enter valid 6-digit OTP");
            return;
        }

        setEmailOtpLoading(true);

        try {
            const response = await ERPApi.post("/student/validateotp", {
                email: formData.email,
                emailOtp: emailOtp,
            });

            if (response.status === 200) {
                setIsEmailVerified(true);

                // Update student details with verification status
                const updatedFormData = { ...formData, isEmailVerified: true };
                setFormData(updatedFormData);
                localStorage.setItem('PreOnBoardStudentDetails', JSON.stringify(updatedFormData));

                // Update email verification data - mark as verified but keep for reference
                localStorage.setItem("emailVerification", JSON.stringify({
                    email: formData.email,
                    timestamp: Date.now(),
                    isMailSent: false,
                    isVerified: true
                }));

                setEmailOtpModal(false);
                
                // Clear timer
                if (otpIntervalId) {
                    clearInterval(otpIntervalId);
                    setOtpIntervalId(null);
                }
                
                setEmailError("");
            }
        } catch (error) {
            setEmailError(
                error?.response?.data?.message || "Invalid OTP"
            );
        } finally {
            setEmailOtpLoading(false);
        }
    };

    const handleCancelOtp = () => {
        setEmailOtpModal(false);
        
        // Clear timer
        if (otpIntervalId) {
            clearInterval(otpIntervalId);
            setOtpIntervalId(null);
        }
        
        // Update localStorage to indicate modal closed
        const emailData = localStorage.getItem('emailVerification');
        if (emailData) {
            const parsed = JSON.parse(emailData);
            localStorage.setItem('emailVerification', JSON.stringify({
                ...parsed,
                isMailSent: false
            }));
        }
    };

    const renderInput = (label, name, type = "text", maxLength = null) => {
        const inputType = type === "number" ? "text" : type;

        return (
            <div className="col-md-3 mb-3 text-start">
                <label className="form-label">{label} <span className="text-danger">*</span></label>
                <input
                    type={inputType}
                    name={name}
                    value={formData[name] || ""}
                    onChange={(e) => {
                        const { value } = e.target;

                        if (type === "number" && value !== "" && !/^\d+$/.test(value)) {
                            return;
                        }

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

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Email <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isEmailVerified}
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                placeholder="Enter email"
                            />
                            <button
                                type="button"
                                className={`btn ${isEmailVerified ? 'btn-success' : 'bg_primary border-start border-white text-white'}`}
                                disabled={isEmailVerified}
                                onClick={sendEmailOtp}
                            >
                                {isEmailVerified ? "Verified ✓" : "Send OTP"}
                            </button>
                        </div>
                        {errors.email && (
                            <div className="invalid-feedback d-block">{errors.email}</div>
                        )}
                    </div>
                    
                    {renderInput("Full Name", "name")}
                    {renderInput("Mobile", "mobilenumber", "number", 10)}
                    {renderInput("WhatsApp", "whatsappno", "number", 10)}
                    {renderInput("Aadhar Number", "aadharCardNumber", "number", 12)}
                    
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Profile Image <span className="text-danger">*</span></label>
                        <input 
                            type="file" 
                            name="filename" 
                            onChange={handleChange} 
                            className={`form-control ${errors.filename ? 'is-invalid' : ''}`} 
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                        />
                        {errors.filename && <div className="invalid-feedback">{errors.filename}</div>}
                        {formData.imagePerview && (
                            <img src={formData.imagePerview} alt="Preview" style={{width: '50px', height: '50px', marginTop: '5px'}} />
                        )}
                    </div>
                    
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Aadhar Image <span className="text-danger">*</span></label>
                        <input 
                            type="file" 
                            name="aadharCardImage" 
                            onChange={handleChange} 
                            className={`form-control ${errors.aadharCardImage ? 'is-invalid' : ''}`}
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                        />
                        {errors.aadharCardImage && <div className="invalid-feedback">{errors.aadharCardImage}</div>}
                        {formData.aadharImagePerview && (
                            <img src={formData.aadharImagePerview} alt="Preview" style={{width: '50px', height: '50px', marginTop: '5px'}} />
                        )}
                    </div>
                    
                    {renderInput("Birthdate", "birthdate", "date")}
                    {renderInput("Parent Name", "parentsname")}
                    {renderInput("Parent Contact", "parentsnumber", "number", 10)}
                    {renderInput("College", "college")}
                    {renderInput("Zipcode", "zipcode", "number", 6)}
                    {renderInput("Country", "country")}
                    {renderInput("State", "state")}
                    {renderInput("City/Area", "area")}
                    {renderInput("Native Place", "native")}
                    
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Gender <span className="text-danger">*</span></label>
                        <select 
                            name="gender" 
                            className={`form-select ${errors.gender ? 'is-invalid' : ''}`} 
                            onChange={handleChange} 
                            value={formData.gender}
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Marital Status <span className="text-danger">*</span></label>
                        <select 
                            name="maritalstatus" 
                            className={`form-select ${errors.maritalstatus ? 'is-invalid' : ''}`} 
                            onChange={handleChange} 
                            value={formData.maritalstatus}
                        >
                            <option value="">Select</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                        </select>
                    </div>
                </div>
                
                <div className="mt-4 d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" disabled={activeStep === 0} onClick={() => onNavigate(activeStep - 1)}>
                        Previous
                    </button>
                    <button type="submit" className="btn bg_primary">
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </form>
            
            {emailOtpModal && (
                <>
                    <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} />
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content p-3">
                                <h5 className="modal-title mb-3">Email Verification</h5>
                                <p className="text-muted small">OTP sent to: <strong>{formData.email}</strong></p>

                                <div className="d-flex gap-2 justify-content-center mb-3">
                                    {[...Array(6)].map((_, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            className="form-control text-center"
                                            style={{ width: "45px", height: "45px", fontSize: "18px" }}
                                            value={emailOtp[index] || ""}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                if (val.length > 1) return;
                                                
                                                const otpArray = [...emailOtp];
                                                otpArray[index] = val;
                                                const newOtp = otpArray.join("");
                                                setEmailOtp(newOtp);

                                                // Auto focus next
                                                if (val && e.target.nextSibling) {
                                                    e.target.nextSibling.focus();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Backspace" && !emailOtp[index] && e.target.previousSibling) {
                                                    e.target.previousSibling.focus();
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                                
                                <div className="text-center mt-2">
                                    {emailOtpTimer > 0 ? (
                                        <div className="text-muted">
                                            Time remaining: <strong>{Math.floor(emailOtpTimer / 60)}:{String(emailOtpTimer % 60).padStart(2, "0")}</strong>
                                        </div>
                                    ) : (
                                        <div className="text-danger">OTP expired</div>
                                    )}
                                </div>

                                {emailError && (
                                    <div className="alert alert-danger mt-2 py-2">{emailError}</div>
                                )}

                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={handleCancelOtp}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn bg_primary"
                                        type="button"
                                        disabled={emailOtpLoading || emailOtpTimer === 0 || emailOtp.length !== 6}
                                        onClick={verifyEmailOtp}
                                    >
                                        {emailOtpLoading ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default PreOnBoardStudentDetails;