import React, { useEffect, useState, useRef } from "react";
import "../../../../assets/css/CertificatePrint.css";
import logo1 from "../../../../assets/images/certificate_images/Hologram-Sticker_png_Updated.png";
import sign from "../../../../assets/images/certificate_images/Zaheer_Sir_Signature 2.png";
import img1 from "../../../../assets/images/certificate_images/NASSCOM.png";
import img2 from "../../../../assets/images/certificate_images/NSDC.png";
import img3 from "../../../../assets/images/certificate_images/ISO.png";
import img4 from "../../../../assets/images/certificate_images/Skill_india.png";
import img5 from "../../../../assets/images/certificate_images/MSME_logo.png";
import fgLogo from "../../../../assets/images/FG-LOGO.png";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import Button from "../../../components/button/Button";
import { MdLocalPrintshop } from "react-icons/md";
import BackButton from "../../../components/backbutton/BackButton";
import QRCode from "qrcode.react";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { useLoaderData } from "react-router-dom";
export const certificatePrintLoader = async({params}) => {
  try {
    const { data, status } = await ERPApi.get(
      `/sc/getstudentcertificate/${params?.id}`
    );
    if (status === 200) {
      const studentData = data?.student
      return { studentData };
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
  }

}



const CertificatePrint = () => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //const [certificatePrint, setCertificatePrint] = useState("");
  const data =  useLoaderData()
  const certificatePrint = data?.studentData
  const { id } = useParams();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (id) {
  //       try {
  //         const { data, status } = await ERPApi.get(
  //           `${import.meta.env.VITE_API_URL}/sc/getstudentcertificate/${id}`
  //         );
  //         if (status === 200) {
  //           setCertificatePrint(data?.student);
  //         }
  //       } catch (error) {}
  //     }
  //   };
  //   fetchData();
  // }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getNameFontSize = (nameLength) => {
    if (nameLength <= 30) {
      return "30px"; // Standard font size for shorter names
    } else if (nameLength <= 50) {
      return "24px"; // Slightly smaller font size for medium-length names
    } else {
      return "18px"; // Smaller font size for longer names
    }
  };

  const getCourseFontSize = (courseLength) => {
    if (courseLength <= 40) {
      return "24px";
    } else if (courseLength <= 24) {
      return "16px";
    } else {
      return "22px";
    }
  };

  return (
    <div>
      <BackButton heading="Certificate" content="Back" />
      <div className="text-end p-3">
        <Button className="btn btn_primary me-2" onClick={handlePrint}>
          <MdLocalPrintshop /> Print
        </Button>
      </div>
      <div className="cert-page-wrap" ref={componentRef}>
        {certificatePrint && (
          <div className="cert-outer-box">
            
            <div className="cert-inner-box">

              {/* TOP CONTENT */}
              <div className="cert-content-top">

                {/* LOGO */}
                <div className="cert-logo-section">
                  <img src={fgLogo} alt="FutureGen Technologies Logo" className="cert-logo-img" />
                </div>

                {/* CERTIFICATE HEADING */}
                <div className="cert-heading-section">
                  <h1 className="cert-title">CERTIFICATE</h1>
                </div>

                {/* CERTIFY TEXT */}
                <div className="cert-certify-text">
                  <p>This is to certify that</p>
                </div>

                {/* STUDENT NAME */}
                <div className="cert-name-section">
                  <h2
                    className="cert-student-name"
                    style={{ fontSize: getNameFontSize(certificatePrint?.name?.length || 0) }}
                  >
                    {certificatePrint?.name?.toUpperCase()}
                  </h2>
                  <div className="cert-name-underline"></div>
                </div>

                {/* COURSE COMPLETION PARAGRAPH */}
                <div className="cert-body-text">
                  <p>
                    has successfully completed the{" "}&nbsp;
                    <strong
                      style={{ fontSize: getCourseFontSize(certificatePrint?.courses?.length || 0) }}
                    >
                      {certificatePrint?.courses?.toUpperCase()}
                    </strong>{" "}
                    &nbsp;course during the period of{" "}
                    <strong>
                      {formatDate(certificatePrint?.certificate_status?.[0]?.courseStartDate)}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {formatDate(certificatePrint?.certificate_status?.[0]?.courseEndDate)}
                    </strong>{" "}
                    and has successfully fulfilled the requirements of the prescribed training
                    program, including practical training, hands-on exercises, and
                    project-oriented learning.
                  </p>
                </div>

                {/* CERTIFICATE ID */}
                <div className="cert-id-section">
                  <p className="cert-id-text">
                    Certificate ID: <strong>{certificatePrint?.registrationnumber}</strong>
                  </p>
                </div>

                {/* DATE + DIRECTOR ROW */}
                <div className="cert-sign-row">
                  <div className="cert-sign-left">
                    <div className="cert-sign-value">
                      {new Date(certificatePrint?.certificate_status?.[0]?.issuedDate)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, ".")}
                    </div>
                    <div className="cert-sign-line"></div>
                    <div className="cert-sign-label">Date of Issue:</div>
                  </div>
                  <div className="cert-sign-right">
                    <img src={sign} alt="Director Signature" className="cert-sign-img" />
                    <div className="cert-sign-line"></div>
                    <div className="cert-sign-label">Director</div>
                  </div>
                </div>

              </div>{/* end cert-content-top */}

              {/* BOTTOM LOGOS — anchored to bottom */}
              <div className="cert-bottom-logos">
                <img src={img2} className="cert-bottom-logo cert-nsdc" alt="NSDC" />
                <img src={img3} className="cert-bottom-logo cert-iso" alt="ISO" />
                <img src={img1} className="cert-bottom-logo cert-nasscom" alt="nasscom" />
                <img src={img5} className="cert-bottom-logo cert-msme" alt="MSME" />
                <img src={img4} className="cert-bottom-logo cert-skillindia" alt="Skill India" />
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CertificatePrint;
