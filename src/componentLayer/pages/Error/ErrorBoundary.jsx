import React, { useEffect } from 'react'
import { MdHome } from 'react-icons/md';
import { Link, useNavigate, useRouteError } from 'react-router-dom';
import "../../../assets/css/Error.css"
import { useAuthContext } from '../../../dataLayer/hooks/useAuthContext';





const ErrorBoundary = () => {

    document.title = "Future Gen | ...oops";
    const error = useRouteError();


    const navigate = useNavigate();

    useEffect(() => {
        if (error?.status === 498 || error?.status === 401 || error?.response?.data?.isInvalidToken) {
            navigate("/auth/login");
        }
    }, [error, navigate]);

    const { AuthState } = useAuthContext();

    let routeLink = "/"
    if (AuthState?.user?.profile === "Admin") {
        routeLink = "/";
    }
    else if (AuthState?.user?.profile === "Trainer") {
        routeLink = "/batchmanagement/trainer/dashboard";
    }
    else if (AuthState?.user?.profile === "IIT Guwahati") {
        routeLink = "/student/cerficationlist";
    }





    const renderErrorContent = (message, linkText, linkTo) => (

        <>
            <div>
                <div className="">
                    <div className="error-bg" id="auth-particles">
                        <div className="auth-page-content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="text-center mt-sm-5 pt-4">
                                            <div className="mb-5 text-white-50">
                                                <h1 className="display-5 coming-soon-text">Oops! Sorry, an unexpected error has occurred.</h1>
                                                <p className="fs-14 text_white">{message || "Not Found"}</p>
                                                <div className="mt-4 pt-2">
                                                    <Link to={linkTo}>
                                                        <button className='btn btn-light'><MdHome /> {linkText}</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );


    return renderErrorContent(
        error?.statusText || error?.message,
        "Go Back Home",
        routeLink
    );
}

export default ErrorBoundary;
