
import { useState } from 'react'
import Teks_Logo from "../../../assets/images/Infoz-IT.svg";
import "../../../assets/css/Login.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from '../../../dataLayer/hooks/useAuthContext';


const ResetPassword = () => {
    const navigate1 =useNavigate();
    
    const { resetPassword } = useAuthContext();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token")


    const [values, setValues] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [error, setErrors] = useState({})



    const handleInput = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev, [name]: value
        }))
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!values.newPassword) {
            setErrors((prev) => ({ ...prev, newPassword: "Password is required" }));
            return;
        } else if (values.newPassword.length < 6) {
            setErrors((prev) => ({
                ...prev,
                newPassword: "Password should be at least 6 characters",
            }));
            return;
        } else if (!/(?=.*[A-Z])/.test(values.newPassword)) {
            setErrors((prev) => ({
                ...prev,
                newPassword: "Password should contain at least one uppercase letter",
            }));
            return;
        } else if (!/(?=.*[a-z])/.test(values.newPassword)) {
            setErrors((prev) => ({
                ...prev,
                newPassword: "Password should contain at least one lowercase letter",
            }));
            return;
        } else if (!/(?=.*\d)/.test(values.newPassword)) {
            setErrors((prev) => ({
                ...prev,
                newPassword: "Password should contain at least one number",
            }));
            return;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.newPassword)) {
            setErrors((prev) => ({
                ...prev,
                newPassword: "Password should contain at least one special character",
            }));
            return;
        }

        if (!values.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Confirm password is required",
            }));
            return;
        } else if (values.newPassword !== values.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Password must match",
            }));
        }

        if (values.confirmPassword === values.newPassword) {
            const confirmPassword = values.confirmPassword
            const newPassword = values.newPassword
            const updatedpassword = { confirmPassword, newPassword }
            resetPassword({ token, updatedpassword },navigate1)
        }
    }


    return (
        <div>
            <div className="login_bg_image w-full vh-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center mt-sm-5 mb-1 text-white-50">
                                <div>
                                    <Link
                                        className="d-inline-block auth-logo mt-5"
                                        to="/velzon/react/default">
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="justify-content-center row mt-3">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="mt-3 card">
                                <div className="p-4 card-body">
                                    <div className="text-center mt-2">
                                        <img src={Teks_Logo} alt="Login page logo" height="40" />
                                        <h5 className="login_welcome_text mt-3">Reset Password</h5>
                                    </div>
                                    <div className="p-2 mt-3">
                                        <form action="#" className="text-start">
                                            <div className="text-center">
                                                <label className='fs-13 fw-500 mb-2'>
                                                    {
                                                        email && email ? email : "...@gmail.com"
                                                    }

                                                </label>
                                            </div>
                                            <div className="mb-3 mt-2">
                                                <label htmlFor="newPassword" className="fs-13 fw-500 mb-2">
                                                    New Password<span className="text-danger">*</span>
                                                </label>
                                                <input

                                                    className={
                                                        error && error.newPassword
                                                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                                                            : "form-control fs-s bg-form text_color input_bg_color"
                                                    }
                                                    type="text"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    placeholder="Enter New Password"
                                                    onChange={handleInput}
                                                    required
                                                />

                                                <div style={{ height: "8px" }}>
                                                    {error.newPassword && (
                                                        <span className="text-danger text-start mail error-text fs-s">
                                                            {error.newPassword}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-0">
                                                <label
                                                    htmlFor="confirmPassword"
                                                    className="  fs-13 fw-500 mb-2"
                                                >
                                                    Confirm New Password<span className="text-danger">*</span>
                                                </label>
                                                <div className="position-relative auth-pass-inputgroup">
                                                    <input
                                                        className={
                                                            error && error.confirmPassword
                                                                ? "form-control fs-s bg-form text_color input_bg_color error-input"
                                                                : "form-control fs-s bg-form text_color input_bg_color"
                                                        }
                                                        type='text'
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        placeholder="Confirm Password"
                                                        onChange={handleInput}
                                                        required
                                                    />

                                                    <div style={{ height: "8px" }}>
                                                        {error.confirmPassword && (
                                                            <span className="text-danger text-start mail error-text fs-s">
                                                                {error.confirmPassword}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="btn btn-link position-absolute end-0 top-0 text-decoration-none "
                                                        type="button"
                                                        id="password-addon"
                                                    >
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <button
                                                    type="submit"
                                                    onClick={handleSubmit}
                                                    className="btn btn-success w-100 btn btn-success fs-s fw-500"
                                                >
                                                    Reset Password
                                                </button>
                                            </div>
                                            <div className="mt-2 text-center">
                                                <div className="signin-other-title">
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;
