import React, { useEffect, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import BackButton from '../../../components/backbutton/BackButton';
import PreOnBoardStudentDetails from './preOnBoardingFromComponents/PreOnBoardStudentDetails';
import PreOnBoardStudentEducation from './preOnBoardingFromComponents/PreOnBoardStudentEducation';
import PreOnBoardAdmissionDetails from './preOnBoardingFromComponents/PreOnBoardAdmissionDetails';
import PreOnBoardFeeDetails from './preOnBoardingFromComponents/PreOnBoardFeeDetails';
import PreOnBoardBillingDetails from './preOnBoardingFromComponents/PreOnBoardBillingDetails';
import PreOnBoardOtherDetails from './preOnBoardingFromComponents/PreOnBoardOtherDetails';
import PreOnBoardPreview from './preOnBoardingFromComponents/PreOnBoardPreview';
 
const PreOnBoardingRegistrationForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useLoaderData();
  const { preOnBoardStudentData, coursePackageList, leadSourceList, courseData } = data;
 
  // Sync state with URL parameter 'active'
  const activeTabFromUrl = searchParams.get('active');
  const [activeStep, setActiveStep] = useState(
    activeTabFromUrl ? parseInt(activeTabFromUrl) : 0
  );
 
  useEffect(()=>{
    const PreOnBoardAdmissionDetails = JSON.parse(localStorage.getItem("PreOnBoardAdmissionDetails"))
    if(PreOnBoardAdmissionDetails && PreOnBoardAdmissionDetails.coursepackageId){
      setSearchParams((prev)=> {
        const newParams = new URLSearchParams(prev);
        newParams.set("coursepackage",PreOnBoardAdmissionDetails.coursepackageId)
        return newParams;
      })
    }
  },[])
 
  // Update state whenever URL changes
  useEffect(() => {
    const parsed = parseInt(activeTabFromUrl);
    if (!isNaN(parsed) && parsed !== activeStep) {
      setActiveStep(parsed);
    }
  }, [activeTabFromUrl, activeStep]);
 
  // Centralized Navigation Function
  // Centralized Navigation Function
  const handleNavigate = (newStep) => {
    setSearchParams(prev => {
      // 1. Create a new URLSearchParams object from the current one
      const params = new URLSearchParams(prev);
 
      // 2. ONLY update the 'active' parameter
      params.set("active", newStep);
 
      // 3. Return the merged params so other keys (coursepackage, etc.) stay put
      return params;
    });
  };
 
  const [coursesData, setCourseData] = useState([]);
  useEffect(() => {
    const FilteredCoursesOptions = courseData?.map((item) => ({
      label: item?.course_name,
      value: item.id,
    }));
    setCourseData(FilteredCoursesOptions);
  }, [courseData]);
 
  const steps = [
    "Student Details", "Education Details", "Admission Details",
    "Fee Details", "Billing Details", "Others Details", "Preview"
  ];
 
  const arrowStyle = {
    position: 'absolute',
    right: '-10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '0',
    height: '0',
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderLeft: '10px solid #405189',
  };
const disabledStep = {
  pointerEvents: "none",
  cursor: "default",
};
  // Helper to render steps with injected navigation props
  const renderStepContent = (step) => {
    const commonProps = {
      steps,
      activeStep: step,
      onNavigate: handleNavigate
    };
 
    switch (step) {
      case 0:
        return <PreOnBoardStudentDetails {...commonProps} studentDetails={preOnBoardStudentData} />;
      case 1:
        return <PreOnBoardStudentEducation {...commonProps} />;
      case 2:
        return <PreOnBoardAdmissionDetails {...commonProps} coursePackages={coursePackageList} leadSources={leadSourceList} courses={coursesData} />;
      case 3:
        return <PreOnBoardFeeDetails {...commonProps} courses={courseData} />;
      case 4:
        return <PreOnBoardBillingDetails {...commonProps} />;
      case 5:
        return <PreOnBoardOtherDetails {...commonProps} />;
      case 6:
        return <PreOnBoardPreview {...commonProps} />;
      default:
        return <div className="p-4"><h4>Component for Step {step} coming soon...</h4></div>;
    }
  };
 
  return (
    <div>
      <BackButton heading="Pre On Boarding Registration Form" content="Back" />
 
      {/* Step Progress Bar */}
  <div className="d-flex flex-wrap border-bottom bg-light mt-0">
  {steps.map((step, index) => {
    const isActive = activeStep === index;
    const isDisabled = index > activeStep; // block NEXT tabs
 
    return (
      <div
        key={index}
        className={`p-2 flex-fill text-center text-nowrap ${
          isActive
            ? "bg_primary border-start border-white text-white position-relative"
            : "text-muted"
        }`}
        style={{
          transition: "0.3s",
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
        onClick={() => {
          if (isDisabled) return; // 🚫 block click
          handleNavigate(index);
        }}
      >
        {step}
        {isActive && <div style={arrowStyle}></div>}
      </div>
    );
  })}
</div>
 
      {/* Form Content */}
      <div className="p-4 border border-top-0 bg-white">
        {renderStepContent(activeStep)}
      </div>
    </div>
  );
};
 
export default PreOnBoardingRegistrationForm;
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
// import React, { useEffect, useState } from 'react'
// import BackButton from '../../../components/backbutton/BackButton'
// import PreOnBoardStudentDetails from './preOnBoardingFromComponents/PreOnBoardStudentDetails';
// import { useLoaderData, useSearchParams } from 'react-router-dom';
// import { use } from 'react';
// import PreOnBoardStudentEducation from './preOnBoardingFromComponents/PreOnBoardStudentEducation';
// import PreOnBoardAdmissionDetails from './preOnBoardingFromComponents/PreOnBoardAdmissionDetails';
// import PreOnBoardFeeDetails from './preOnBoardingFromComponents/PreOnBoardFeeDetails';
 
// const PreOnBoardingRegistrationForm = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const data = useLoaderData();
//   const { preOnBoardStudentData, coursePackageList, leadSourceList, courseData,
//   } = data;
//   const activeTabFromUrl = searchParams.get('active');
//   const [activeStep, setActiveStep] = useState(
//     activeTabFromUrl ? parseInt(activeTabFromUrl) : 0
//   );
 
//   // Sync URL → state, only if different
//   useEffect(() => {
//     const parsed =parseInt(activeTabFromUrl);
//     if (parsed !== activeStep) {
//       setActiveStep(parsed);
//     }
//   }, [activeTabFromUrl, activeStep]);
 
//   // Sync state → URL, only if different
//   // useEffect(() => {
//   //   if (String(activeStep) !== activeTabFromUrl) {
//   //     const queryParams = new URLSearchParams();
//   //     queryParams.set('active', activeStep);
//   //     setSearchParams(queryParams);
//   //   }
//   // }, [activeStep, activeTabFromUrl]);
 
//   const [coursesData, setCourseData] = useState()
//   useEffect(() => {
//     const FilteredCoursesOptions = courseData?.map((item) => ({
//       label: item?.course_name,
//       value: item.id,
//     }));
//     setCourseData(FilteredCoursesOptions)
//   }, [courseData])
 
//   // Simple Arrow Styling for the active tab (matching your image)
//   const arrowStyle = {
//     position: 'absolute',
//     right: '-10px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     width: '0',
//     height: '0',
//     borderTop: '10px solid transparent',
//     borderBottom: '10px solid transparent',
//     borderLeft: '10px solid #405189', // Bootstrap Primary Blue
//     // zIndex:1
//   };
 
//   // Placeholder Components
//   const EmailForm = () => <div><h4>Email Information</h4><input className="form-control" placeholder="Enter Email" /></div>;
//   const StudentDetails = () => <div><h4>Student Information</h4><input className="form-control" placeholder="Full Name" /></div>;
 
 
 
//   const steps = ["Student Details",
//     "Education Details", "Admission Details", "Fee Details",
//     "Billing Details", "Others Details", "Preview"
//   ];
 
//   // Function to render the specific form based on step
//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0: return <PreOnBoardStudentDetails steps={steps} currentActiveStep={activeStep} studentDetails={preOnBoardStudentData} />;
//       case 1: return <PreOnBoardStudentEducation steps={steps} />;
//       case 2: return <PreOnBoardAdmissionDetails steps={steps} coursePackages={coursePackageList} leadSources={leadSourceList} courses={coursesData} />;
//       case 3: return <PreOnBoardFeeDetails steps={steps} courses={courseData} />;
//       default: return <EmailForm />;
//     }
//   };
 
//   return (
//     <div>
//       <BackButton heading="Pre On Boarding Registration Form" content="Back" />
//       {/* Step Progress Bar */}
//       <div className="d-flex flex-wrap border-bottom bg-light mt-0">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             // onClick={() => setActiveStep(index)}
//             className={` p-2 flex-fill text-center text-nowrap ${activeStep === index ? 'bg_primary border-start border-white text-white position-relative' : 'text-muted'}`}
//             style={{ cursor: 'pointer', transition: '0.3s' }}
//           >
//             {step}
//             {activeStep === index && (
//               <div style={arrowStyle}></div>
//             )}
//           </div>
//         ))}
//       </div>
 
//       {/* Form Content */}
//       <div className="p-4 border border-top-0 bg-white">
//         {renderStepContent(activeStep)}
 
//         {/* <div className="mt-4 d-flex justify-content-between">
//           <button
//             className="btn btn-secondary"
//             disabled={activeStep === 0}
//             onClick={() => setActiveStep(activeStep - 1)}
//           >
//             Previous
//           </button>
//           <button
//             className="btn btn-primary"
//             onClick={() => activeStep === steps.length - 1 ? alert("Submitted!") : setActiveStep(activeStep + 1)}
//           >
//             {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//           </button>
//         </div> */}
//       </div>
//     </div>
//   );
 
// }
 
// export default PreOnBoardingRegistrationForm
 
 