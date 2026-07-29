import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
import "../../../../assets/css/StudentIdCard.css";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import html2canvas from "html2canvas"; // To generate canvas for ID card
import logo from "../../../../assets/images/student_idCard_images/Tesks_Logo.png";
import Defaultimg from "../../../../assets/images/student_idCard_images/DefaultimgBG.png";
import { useLoaderData } from "react-router-dom";
import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext";

export const studentIdCardLoader = async ({ params }) => {
  try {
    const { data, status } = await ERPApi.get(
      `/student/viewstudentdata/${params?.id}`
    );
    if (status === 200) {
      const studentData = data?.student[0];
      return { studentData };
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
};

const StudentIdCard = () => {
  const { AuthState } = useAuthContext()
  const data = useLoaderData();
  const StudentIdCard = data?.studentData;
  const componentRefff = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);

  const branchLogoImage = AuthState?.user
  const branchImage = StudentIdCard?.branches?.logoName


  const branchLogo = branchImage
    ? `https://teksacademy.s3.ap-south-1.amazonaws.com/branches/logos/${branchImage}`
    : null;
  // const downloadIdCard = () => {
  //   if (!imageLoaded) {
  //     alert("Please wait, the image is still loading.");
  //     return;
  //   }

  //   html2canvas(componentRefff.current, {
  //     useCORS: true,
  //     allowTaint: false,
  //     scale: 2,
  //     logging: true,
  //   }).then((canvas) => {
  //     canvas.toBlob((blob) => {
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = `student_id_card_${
  //         StudentIdCard?.name || "unknown"
  //       }.png`;
  //       link.click();
  //     });
  //   });
  // };

  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };


  const downloadIdCard = async () => {
    if (!imageLoaded) {
      alert("Please wait, the image is still loading.");
      return;
    }

    const img = componentRefff.current.querySelector("img");

    if (img && img.src.startsWith("http")) {
      const base64 = await getBase64FromUrl(img.src);
      img.setAttribute("src", base64);
    }

    html2canvas(componentRefff.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
    }).then((canvas) => {
      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `student_id_card_${StudentIdCard?.name || "unknown"}.png`;
        link.click();
      });
    });
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const year = date.getUTCFullYear();
    const monthAbbreviations = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day < 10 ? "0" : ""}${day}-${monthAbbreviations[monthIndex]
      }-${year}`;
  };

  const handlePrint = useReactToPrint({
    content: () => componentRefff.current,
  });


  return (
    <div>
      <BackButton heading="Student Id Card" content="Back" />
      <div className="container-fluid">
        <div className="text-end p-3">
          <Button className="btn btn_primary me-2" onClick={handlePrint}>
            <MdLocalPrintshop /> Print
          </Button>
          <Button
            className="btn btn_primary me-2"
            onClick={downloadIdCard}
            disabled={!imageLoaded} // Disable button until image is loaded
          >
            Download ID Card
          </Button>
        </div>

        <div className="studentid">
          <div className="idcard1" ref={componentRefff}>
            <div className="teksimg">
              <img className="mb-4" src={branchLogo ? branchLogo : logo} alt="Logo" />
            </div>
            <div className="card_Content">
              <div className="studid-photo text-center">
                <img
                  src={
                    StudentIdCard?.studentImg
                      ? `https://teksacademy.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/${StudentIdCard?.studentImg}`
                      : Defaultimg
                  }
                  alt="Student Img"
                  onLoad={() => setImageLoaded(true)} // Mark image as loaded
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = Defaultimg; // Fallback to default image
                    setImageLoaded(true); // Treat fallback as loaded
                  }}
                // crossOrigin="anonymous" // Enable cross-origin for external images
                />
              </div>

              <p className="student_name">{StudentIdCard?.name}</p>
              <div className="student-info text-left">
                <p className="fs-14 black_300">
                  Registration No: {StudentIdCard?.registrationnumber}
                </p>
                <p className="fs-14 black_300">
                  Course: {StudentIdCard?.courses}
                </p>
                <p className="fs-14 black_300">
                  Branch: {StudentIdCard?.branch}
                </p>
                <p className="fs-14 black_300">
                  Valid Upto:{" "}
                  {StudentIdCard?.validityenddate
                    ? formatDate(StudentIdCard.validityenddate)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCard;

// import React from "react";
// import logo from "../../../../assets/images/student_idCard_images/Tesks_Logo.png";
// import Defaultimg from "../../../../assets/images/student_idCard_images/Defaultimg.jpg";
// import detail from "../../../../assets/images/student_idCard_images/Courses&details.png";
// import { useReactToPrint } from "react-to-print";
// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { MdLocalPrintshop } from "react-icons/md";
// import { useEffect } from "react";
// import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
// import "../../../../assets/css/StudentIdCard.css";
// import Button from "../../../components/button/Button";
// import BackButton from "../../../components/backbutton/BackButton";
// import axios from "axios";
// import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
// function StudentIdCard() {
//   const componentRefff = React.useRef();
//   const [StudentIdCard, setStudentIdCard] = useState("");
//   const { id } = useParams("");
//   const { studentState, Dispatchstudents } = useStudentsContext();
//   useEffect(() => {
//     const fetchData = async () => {
//       if (id) {
//         try {
//           const { data, status } = await ERPApi.get(
//             `${import.meta.env.VITE_API_URL}/student/viewstudentdata/${id}`
//           );
//           if (status === 200) {
//             setStudentIdCard(data?.student[0]);
//           }
//         } catch (error) {}
//       }
//     };

//     fetchData();
//     // Clean-up function
//     return () => {
//       // Perform any clean-up operations here if needed
//     };
//   }, [id]);
//   const handlePrint = useReactToPrint({
//     content: () => componentRefff.current,
//   });

//   return (
//     <div>
//       <BackButton heading="Student Id Card" content="Back" />
//       <div className="container-fluid">
//         <div className="text-end p-3">
//           <Button className="btn btn_primary me-2 " onClick={handlePrint}>
//             <MdLocalPrintshop /> Print
//           </Button>
//         </div>

//         <div className="studentid" ref={componentRefff}>
//           <div className="idcard1">
//             <div className="row bg-white">
//               <div className="col-6 col-md-6 col-lg-6 col-xl-6">
//                 <div className="student-info  ">
//                   <div className="teksimg">
//                     <img className="mb-4 " src={logo} alt="" />
//                   </div>
//                   <p className="fs-14 black_300">
//                     {" "}
//                     Name: {StudentIdCard?.name}
//                   </p>
//                   <p className=" fs-14 black_300">
//                     {" "}
//                     Course: {StudentIdCard?.courses}
//                   </p>
//                   <p className=" fs-14 black_300">
//                     {" "}
//                     Registration No: {StudentIdCard?.registrationnumber}
//                   </p>

//                   <p className="fs-14 black_300">
//                     {" "}
//                     Branch: {StudentIdCard?.branch}
//                   </p>
//                 </div>
//               </div>
//               <div className="studid-photo col-6 col-md-6 col-lg-6 col-xl-6">
//                 <div className=" stuimg">
//                   {!StudentIdCard?.studentImg && (
//                     <img src={Defaultimg} alt="photo" />
//                   )}
//                   {StudentIdCard?.studentImg && (
//                     <img
//                       className=" w-75"
//                       // src={`https://teksacademyimages.s3.amazonaws.com/${StudentIdCard?.studentImg}`}
//                       src={`https://teksacademy.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/${StudentIdCard?.studentImg}`}
//                       alt="photo"
//                     />
//                   )}
//                 </div>

//                 <p className="mb-5" style={{ color: "#2a619d" }}>
//                   Valid Upto:
//                 </p>
//               </div>
//             </div>

//             <div className="idcard2  w-100 m-auto mt-3 ">
//               <div className="d-flex flex-column justify-content-center p-4">
//                 {/* <img className=" tekslogo m-auto " src={logo} alt=""></img> */}

//                 <img className="detail  m-auto" src={detail} alt=""></img>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StudentIdCard;
