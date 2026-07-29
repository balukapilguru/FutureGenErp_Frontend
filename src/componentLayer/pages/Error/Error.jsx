import React, { useState } from 'react'
import { MdHome } from "react-icons/md";
import "../../../assets/css/Error.css"
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../dataLayer/hooks/useAuthContext';


const Error=()=> {

       const { AuthState, DispatchAuth } = useAuthContext();
       const profile = AuthState?.user?.profile;

  return (
    <div>
    <div className="">
        <div className="error-bg" id="auth-particles">
            <div className="auth-page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center mt-sm-5 pt-4">
                                <div className="mb-5 text-white-50">
                                    <h1 className="display-5 coming-soon-text">ERROR 404!</h1>
                                    <p className="fs-14 text_white">Please check back in sometime</p>
                                    <div className="mt-4 pt-2">
                                    <Link to ={`${profile === "IIT Guwahati" ? '/student/cerficationlist':'/'}`}>
                                    <button className='btn btn-light'><a href="index.html"  ><MdHome /> Back to Home</a></button> 
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
  )
}

export default Error