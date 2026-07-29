import React, { useContext, useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Teks_Logo from "../../../assets/images/Teks_Logo.svg";
import "../../../assets/css/Login.css";
import { AuthContext } from "../../../dataLayer/context/authContext/AuthContextProvider";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { LoginAdmin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate1 = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setErrors((prev) => ({
      ...prev,
      [name]: "", // Reset error for the field being changed
    }));
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (values.email) {
      setErrors({ ...errors, email: "" });
    } else if (email_pattern.test(values.email)) {
      setErrors({ ...errors, email: "" });
    }
    if (values.password) {
      setErrors({ ...errors, password: "" });
    }
  }, [values.email, values.password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!values.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!email_pattern.test(values.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email" }));
      return false;
    }
    if (!values.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    }

    if (!errors.email && !errors.password && values.email && values.password) {
      LoginAdmin(values,navigate1);
    }
  };

  return (
    <div>
      <div className="login_bg_image w-full vh-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center mt-sm-5 mb-1 text-white-50">
                <div>
                  
                    <img src={Teks_Logo} alt="Login page logo" height="40" />
                </div>
              </div>
            </div>
          </div>
          <div className="justify-content-center row mt-3">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="mt-3 card">
                <div className="p-4 card-body">
                  <div className="text-center mt-2">
                    <h5 className="login_welcome_text">Welcome Back!</h5>
                    {/* <p className="text-mute login_welcome_description">
                      Sign in to continue to TeksAcademy.
                    </p> */}
                  </div>
                  <div className="p-2 mt-4">
                    <form action="#" className="text-start">
                      <div className="mb-3">
                        <label htmlFor="email" className="  fs-13 fw-500 mb-2">
                          Email<span className="text-danger">*</span>
                        </label>
                        <input
                          name="email"
                          placeholder="Enter email address"
                          type="email"
                          id="email"
                          className={
                            
                            errors && errors.email
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          aria-invalid="false"
                          onChange={handleInput}
                        />
                        <div style={{ height: "8px" }}>
                          {errors.email && (
                            <span className="text-danger text-start mail error-text fs-s">
                              {errors.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-0">
                        <label
                          htmlFor="password-input"
                          className="  fs-13 fw-500 mb-2"
                        >
                          Password<span className="text-danger">*</span>
                        </label>
                        <div className="position-relative auth-pass-inputgroup">
                          <input
                            name="password"
                            id="password-input"
                            placeholder="Enter Password"
                            type={showPassword ? "text" : "password"}
                            className={
                              errors && errors.password
                                ? "form-control fs-s bg-form text_color input_bg_color error-input"
                                : "form-control fs-s bg-form text_color input_bg_color"
                            }
                            onChange={handleInput}
                          />
                          <div style={{ height: "8px" }}>
                            {errors.password && (
                              <span className="text-danger text-start mail error-text fs-s">
                                {errors.password}
                              </span>
                            )}
                          </div>
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none "
                            type="button"
                            id="password-addon"
                          >
                            {showPassword ? (
                              <FaRegEye
                                onClick={toggleShowPassword}
                                className="black_color"
                              />
                            ) : (
                              <FaRegEyeSlash
                                onClick={toggleShowPassword}
                                className="black_color"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="form-check mt-3">
                        <input
                          id="auth-remember-check"
                          type="checkbox"
                          className="form-check-input"
                        />
                        <label
                          htmlFor="auth-remember-check"
                          className="form-check-label  fs-13 fw-500"
                        >
                          Remember me
                        </label>
                        <div className="float-end">
                          <span className="text-mute fs-13 fw-500">
                            <Link
                              to="/auth/forgotpassword"
                              style={{ cursor: "pointer", color: "#0ea5ec" }}
                            >
                              Forgot password?
                            </Link>
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          type="submit"
                          className="btn btn-success w-100 btn btn-success fs-s fw-500"
                          onClick={handleSubmit}
                        >
                          Log In
                        </button>
                      </div>
                      <div className="mt-2 text-center">
                        <div className="signin-other-title">
                          {/* <h5 className="fs-13 mb-4 title fw-500">
                            Sign In with
                          </h5> */}
                        </div>
                        {/* <div>
                          <button
                            className="btn btn-primary btn-icon me-1"
                            title="Facebook"
                          >
                         
                            <FaFacebookF />
                          </button>
                          <button
                            className="btn btn-danger btn-icon me-1"
                            title="Gmail"
                          >
                    
                            <FaGoogle />
                          </button>
                          <button
                            className="btn-icon btn btn-dark me-1"
                            title="GitHub"
                          >
                          
                            <FaGithub />
                          </button>
                          <button
                            className="btn-icon btn btn-info"
                            title="Twitter"
                          >
                           
                            <GrTwitter className="text-white" />
                          </button>
                        </div> */}
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
  );
};
export default Login;
