import React, { useContext, useEffect, useState } from "react";
import Teks_Logo from "../../../assets/images/Teks_Logo.svg";
import "../../../assets/css/Login.css";
import { AuthContext } from "../../../dataLayer/context/authContext/AuthContextProvider";
import gif from "../../../assets/images/GIF_01.gif";
import { Link, useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const { Forgotpassword } = useContext(AuthContext);

  const navigate1 = useNavigate();
  const [values, setValues] = useState({
    email: "",
  });

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const [errors, seterrors] = useState({
    email: "",
  });

  useEffect(() => {
    if (values.email) {
      seterrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  }, [values.email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!values.email) {
      seterrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!email_pattern.test(values.email)) {
      seterrors((prev) => ({ ...prev, email: "Enter valid email" }));
      return false;
    }

    if (!errors.email && values.email) {
      const email = values.email;
      Forgotpassword({ email },navigate1);
    }
  };

  return (
    <div>
      <div className="login_bg_image w-full vh-100">
        <div className="container p-4">
          <div className="row pt-4 ">
            <div className="col-lg-12 mt-4 mt-sm-0">
              <div className="text-center mt-sm-5  mb-1 text-white-50">
                <div>
                  <a
                    className="d-inline-block auth-logo"
                    href="/velzon/react/default"
                  >
                    <img
                      src={Teks_Logo}
                      alt="Login page logo"
                      height="40"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="justify-content-center row mt-3">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="mt-2 card">
                <div className=" card-body">
                  <div className="text-center mt-2">
                    <h5 className="login_welcome_text">Forgot Password?</h5>
                    {/* <p className="text-mute login_welcome_description">
                      Reset password with us.
                    </p> */}
                  </div>
                  <div className="p-2 mt-4">
                    <form action="#" className="text-start">
                      <div className="mb-3 text-center d-flex flex-column align-items-center gap-2">
                        <img src={gif} width={100} height="auto" alt="" />
                        <span className="reset-password-message mt-3">
                          Enter your email and instructions will be sent to you!
                        </span>
                      </div>

                      <div className="mb-3">
                        <label for="email" className="form-label fs-13 fw-500">
                          Email<span className="text-danger">*</span>
                        </label>
                        <input
                          name="email"
                          placeholder="Enter email address"
                          type="email"
                          className={
                            errors && errors.email
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          aria-invalid={errors.email ? "true" : "false"}
                          onChange={handleInput}
                        />
                        <div style={{ height: "8px" }}>
                          {errors.email && (
                            <span className="text-danger fs-13">
                              {errors.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          type="submit"
                          className="btn btn-success w-100 btn btn-success fs-13 fw-500"
                          onClick={handleSubmit}
                        >
                          Request Reset Link
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <div className="signin-other-title">
                          <h5 className="fs-13  title   custom-href">
                            I remember my password{" "}
                            <Link to="/auth/login">Login</Link>
                          </h5>
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
  );
};
export default ForgotPassword;
