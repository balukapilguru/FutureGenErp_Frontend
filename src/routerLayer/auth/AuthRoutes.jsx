import Login from "../../componentLayer/pages/auth/Login"
import ForgotPassword from "../../componentLayer/pages/auth/ForgotPassword"
import ChangePassword from "../../componentLayer/pages/auth/ChangePassword"

import ResetPassword from '../../componentLayer/pages/auth/ResetPassword';
import RegistrationLinkForm, { addRegistrationAction, registrationFormLinkLoader } from "../../componentLayer/pages/exams/RegistrationLinkForm";
const AuthRoutes = [
    { path: "login", element: <Login /> },
    { path: "forgotpassword", element: <ForgotPassword /> },
    { path: "changepassword", element: <ChangePassword /> },
    { path: "resetpassword", element: <ResetPassword /> },
    { path: "studentForm/:link", element: <RegistrationLinkForm /> , loader : registrationFormLinkLoader, action: addRegistrationAction },
    
];

export default AuthRoutes;



// import React from 'react'
// import { Route, Routes } from 'react-router-dom';
// import Login from "../../componentLayer/pages/auth/Login"
// import ForgotPassword from "../../componentLayer/pages/auth/ForgotPassword"
// import ChangePassword from "../../componentLayer/pages/auth/ChangePassword"
// import Error from '../../componentLayer/pages/Error/Error';
// import ResetPassword from '../../componentLayer/pages/auth/ResetPassword';
// const AuthRoutes = () => {
//     return (
//         <Routes>
//             <Route path='*' element={<Error />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/forgotpassword" element={<ForgotPassword />} />
//             <Route path="/changepassword" element={<ChangePassword />} />
//             <Route path="/resetpassword" element={<ResetPassword />} />

//         </Routes>
//     )
// }

// export default AuthRoutes
