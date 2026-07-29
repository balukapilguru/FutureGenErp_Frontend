import React, { useEffect, useState, useRef } from "react";
import "../../../../assets/css/CertificatePrint.css";
import logo1 from "../../../../assets/images/certificate_images/Hologram-Sticker_png_Updated.png";
import sign from "../../../../assets/images/certificate_images/Zaheer_Sir_Signature 2.png";
import img1 from "../../../../assets/images/certificate_images/NASSCOM.png";
import img2 from "../../../../assets/images/certificate_images/NSDC.png";
import img3 from "../../../../assets/images/certificate_images/ISO.png";
import img4 from "../../../../assets/images/certificate_images/Skill_india.png";
import img5 from "../../../../assets/images/certificate_images/MSME_logo.png";
import tekslogo from "../../../../assets/images/certificate_images/Tesks_Logo.png";
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
    const options = { month: "short", year: "numeric" };
    return new Date(dateString).toLocaleString("en-Us", options).toUpperCase();
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
      <div className="contain" ref={componentRef}>
        {certificatePrint && (
          <div className="Outerline1 mb-5">
            <div className="outerborder">
              <div className="innerborder">
                <div className="section">
                  <div className="logo">
                    <img src={tekslogo} alt="" />
                  </div>
                  <header className="header">
                    <h2>
                      <span>C</span>ERTIFICATE
                    </h2>
                    <p>This is to certify that</p>
                  </header>

                  <div className="certificate-info" action="">
                    <div className="name">
                      <p>Mr./Ms</p>
                      <div className="studname">
                        <h4
                          className="studname"
                          style={{
                            fontSize: getNameFontSize(
                              certificatePrint.name.length
                            ),
                          }}
                        >
                          {certificatePrint?.name}
                        </h4>
                      </div>
                    </div>
                    <div className="infor">
                      <p className="para">
                        has successfully completed Real Time Training on
                      </p>
                      <h4
                        className="courses"
                        style={{
                          fontSize: getCourseFontSize(
                            certificatePrint?.courses?.length
                          ),
                        }}
                      >
                        {certificatePrint?.courses.toUpperCase()}
                      </h4>
                    </div>
                    <div className="period">
                      <div className="d-block">
                        <p>during the period of </p>
                      </div>
                      <h4 className="from">
                        {formatDate(
                          certificatePrint?.certificate_status[0]
                            ?.courseStartDate
                        )}
                      </h4>
                      <p className="d-block">to </p>
                      <h4 className="to d-block">
                        {formatDate(
                          certificatePrint?.certificate_status[0]?.courseEndDate
                        )}
                      </h4>
                    </div>
                    <div className="grade ">
                      <p className="grade-start">with</p>
                      <h4 className="gradeA"> A+ </h4>
                      <p className="grade-end">Grade</p>
                    </div>
                  </div>
                  <div className="id">
                    <h5>ID:{certificatePrint?.registrationnumber}</h5>
                  </div>
                  <div className="sign-date">
                    <div className="date-left">
                      <p className="dt">
                        {new Date(
                          certificatePrint?.certificate_status?.[0]?.issuedDate
                        )
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </p>
                      <p className="mt-3" style={{ color: "#2a619d" }}>DATE</p>
                    </div>
                    <div className="hologram-sticker  ">
                      <img src={logo1} alt="" />
                    </div>
                    <div>
                      <QRCode
                        className="mt-5 qrcode"
                        style={{ height: "70px", width: "70px" }}
                        value={`https://teksacademy.com/verifyCertificate/${certificatePrint?.registrationnumber}`}
                      />
                    </div>

                    <div className="sign-right">
                      <img src={sign} alt="" />
                      <p style={{ color: "#2a619d" }}>SIGNATURE</p>
                    </div>
                  </div>
                  <div className="cname">
                    <img src={img1} className="img1" alt="" />
                    <img src={img2} className="img2" alt="" />
                    <img src={img3} className="img3" alt="" />
                    <img src={img4} className="img4" alt="" />
                    <img src={img5} className="img5" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CertificatePrint;
