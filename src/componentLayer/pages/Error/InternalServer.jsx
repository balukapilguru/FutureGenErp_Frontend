import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../dataLayer/hooks/useAuthContext';


function InternalServer() {
    const { AuthState, DispatchAuth } = useAuthContext();
    const profile = AuthState?.user?.profile;

    const navigate = useNavigate();
    const handleReload = (e) => {
    
        if (profile === "IIT Guwahati") {
            navigate("/student/cerficationlist");
            window.location.reload();
        }
        else if(profile !== "IIT Guwahati"){
            navigate("/");
            window.location.reload();
        }

    }


    return (
        <div>
            <div className="auth-page-wrapperr py-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="auth-page-contentt overflow-hidden p-0">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-xl-4 text-center">
                                <div className="error-500 position-relativee">
                                    <img src="https://themesbrand.com/velzon/html/master/assets/images/error500.png" alt="" className="img-fluid error-500-img error-img" />
                                    <h1 className="title text-muted">500</h1>
                                </div>
                                <div>
                                    <h5>Internal Server Error!</h5>
                                    <p className="text-mutedd w-75 mx-auto">Server Error 500. We're not exactly sure what happened, but our servers say something is wrong.</p>
                                    <button className="btn btn-success" onClick={(e) => handleReload(e)}>Reload</button>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default InternalServer