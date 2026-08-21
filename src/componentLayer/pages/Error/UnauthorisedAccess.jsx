import React, { useState } from "react";
import {
  MdOutlineSecurity,
  MdArrowBack,
  MdKeyboardArrowDown,
  MdClose,
  MdCheckCircle,
  MdSend,
} from "react-icons/md";

import { BsKeyFill } from "react-icons/bs";
import { HiMiniCommandLine } from "react-icons/hi2";
import Teks_Shape from "../../../assets/images/FG-LOGO.png"
function UnauthorisedAccess() {
  const [showDetails, setShowDetails] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="h-100 d-flex flex-column justify-content-between ">
      {/* Header */}
      <header className="pt-4 text-center">
        <div className="d-inline-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded"
            style={{
              width: "50px",
              height: "50px",
              background: "#344d85",
              color: "#fff",
              fontWeight: "700",
            }}
          >
            <img src={Teks_Shape} alt="Future Gen" style={{ width: "40px", height: "40px" }} />
          </div>

          <div className="text-start">
            
            <h5 className="mb-0 fw-bold text-dark">Future Gen®</h5>

            <small className="text-muted text-uppercase">
              ERP Security Shield
            </small>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="h-100 d-flex justify-content-center px-3 pt-4">
        <div className="w-100" style={{ maxWidth: "700px" }}>
          <div className=" border-0 shadow-sm overflow-hidden rounded-4">
            {/* Top Border */}
            <div
              style={{
                height: "5px",
                background: "#dc3545",
              }}
            ></div>

            <div className="card-body text-center p-4 p-md-5">
              {/* Icon */}
              <div
                className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 mb-4"
                style={{
                  width: "90px",
                  height: "90px",
                }}
              >
                <MdOutlineSecurity
                  className="text-danger"
                  size={45}
                />
              </div>

              {/* Heading */}
              <h2 className="fw-bold mb-3">Access Denied</h2>

              <p className="text-muted mb-4">
                You don't have the required permissions to view this page. This area is restricted to authorized personnel only.
              </p>

              {/* Route */}


              {/* Buttons */}
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mb-4">
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                >
                  <MdArrowBack size={20} />
                  Go Back
                </button>

              </div>

              {/* Technical Details */}
            </div>
          </div>
        <footer className="text-center py-4">
            <small className="text-muted">
            If you believe this is an error, please contact system support.
            </small>
        </footer>
        </div>
      </div>

      {/* Footer */}

      {/* Modal */}
      {openModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="bg-white rounded-4 shadow w-100 overflow-hidden"
            style={{ maxWidth: "500px" }}
          >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between border-bottom p-3 bg-light">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 rounded bg-white border">
                  <MdSend size={18} />
                </div>

                <div>
                  <h6 className="mb-0 fw-bold">
                    Clearance Request
                  </h6>

                  <small className="text-muted">
                    Sent to Head Office Admin
                  </small>
                </div>
              </div>

              <button
                className="btn btn-sm btn-light"
                onClick={() => {
                  setOpenModal(false);
                  setSubmitted(false);
                }}
              >
                <MdClose size={18} />
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="p-4">
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Your Account
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value="info@futuregentechnologies.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Desired Access Level
                  </label>

                  <select className="form-select">
                    <option>Full Billing & Accounts Admin</option>
                    <option>
                      Financial Coordinator View Only
                    </option>
                    <option>
                      Center Branch Manager Access
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    State Reason for Request
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    required
                    placeholder="Enter reason..."
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn bg_primary text-white"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-5 text-center">
                <MdCheckCircle
                  className="text-success mb-3"
                  size={60}
                />

                <h5 className="fw-bold">
                  Request Sent Successfully
                </h5>

                <p className="text-muted small mb-4">
                  Your access request has been routed to the chief
                  administrator.
                </p>

                <button
                  className="btn btn-light"
                  onClick={() => {
                    setOpenModal(false);
                    setSubmitted(false);
                  }}
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UnauthorisedAccess;







// import React from 'react'
// import { MdHome } from "react-icons/md";
// import "../../../assets/css/Error.css"
// import { Link } from 'react-router-dom';
// import { useAuthContext } from '../../../dataLayer/hooks/useAuthContext';



// function UnauthorisedAccess() {
    
//            const { AuthState, DispatchAuth } = useAuthContext();
//            const profile = AuthState?.user?.profile;
//     return (
//         <div>
//             <div>
//                 <div className="">
//                     <div className="error-bg" id="auth-particles">
//                         <div className="auth-page-content">
//                             <div className="container">
//                                 <div className="row">
//                                     <div className="col-lg-12">
//                                         <div className="text-center mt-sm-5 pt-4">
//                                             <div className="mb-5 text-white-50">
//                                                 <h1 className="display-5 coming-soon-text">ERROR 422!</h1>
//                                                 <p className="fs-14 text_white">
//                                                     UnAuthorized Access</p>
//                                                 <div className="mt-4 pt-2">
//                                                     <Link to ={`${profile === "IIT Guwahati" ? '/student/cerficationlist':profile === "Trainer"?"/batchmanagement/trainer/dashboard":"/" }`}>
//                                                         <button className='btn btn-light'><a href="index.html"  ><MdHome /> Back to Home</a></button>
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default UnauthorisedAccess;



// import React from 'react'
// import { MdHome } from "react-icons/md";
// import "../../../assets/css/Error.css"
// import { Link } from 'react-router-dom';
// import { useAuthContext } from '../../../dataLayer/hooks/useAuthContext';



// function UnauthorisedAccess() {
    
//            const { AuthState, DispatchAuth } = useAuthContext();
//            const profile = AuthState?.user?.profile;
//     return (
//         <div>
//             <div>
//                 <div className="">
//                     <div className="error-bg" id="auth-particles">
//                         <div className="auth-page-content">
//                             <div className="container">
//                                 <div className="row">
//                                     <div className="col-lg-12">
//                                         <div className="text-center mt-sm-5 pt-4">
//                                             <div className="mb-5 text-white-50">
//                                                 <h1 className="display-5 coming-soon-text">ERROR 422!</h1>
//                                                 <p className="fs-14 text_white">
//                                                     UnAuthorized Access</p>
//                                                 <div className="mt-4 pt-2">
//                                                     <Link to ={`${profile === "IIT Guwahati" ? '/student/cerficationlist':'/'}`}>
//                                                         <button className='btn btn-light'><a href="index.html"  ><MdHome /> Back to Home</a></button>
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default UnauthorisedAccess;
