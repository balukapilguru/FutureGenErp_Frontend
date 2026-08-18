import React, { useEffect, useState, useRef } from "react";
import "../../../../assets/css/InternshipCertificate.css";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import { MdLocalPrintshop } from "react-icons/md";
import tekslogo from "../../../../assets/images/certificate_images/Tesks_Logo.png";
import { useReactToPrint } from "react-to-print";
import img5 from "../../../../assets/images/certificate_images/isocert.png";
import img1 from "../../../../assets/images/certificate_images/NASSCOM.png";
import img2 from "../../../../assets/images/certificate_images/NSDC.png";
import img3 from "../../../../assets/images/certificate_images/ISO.png";
import img4 from "../../../../assets/images/certificate_images/Skill_india.png";
import sign from "../../../../assets/images/certificate_images/Zaheer_Sir_Signature 2.png";
import bgimg from "../../../../assets/images/certificate_images/internship-certificate_png.png";
import badge from "../../../../assets/images/certificate_images/badge.png";
import backgoundimg from "../../../../assets/images/certificate_images/InternHeading.png";
import icon1 from "../../../../assets/images/certificate_images/telephone-call.svg";
import icon2 from "../../../../assets/images/certificate_images/envelope (3).svg";
import { useParams } from "react-router-dom";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import infozit from "../../../../assets/images/FG-LOGO.png";
import { useLoaderData } from "react-router-dom";

export const intrernshipCertificateLoader = async ({ params }) => {

  try {
    const { data, status } = await ERPApi.get(
      `/sc/getstudentcertificate/${params?.id}`
    );
    if (status === 200) {
      const studentData = data?.student;

      return { studentData };
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
};

const IntrernshipCertificate = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: landscape !important;
      }
      
    `,
  });
  const data = useLoaderData();
  const certificatePrint = data?.studentData;


  const internShipStartDate = new Date( data?.studentData?.certificate_status[0]?.internShip?.internShipStartDate);
  const internShipEndDate = new Date(data?.studentData?.certificate_status[0]?.internShip?.internShipEndDate);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });


  //const [certificatePrint, setCertificatePrint] = useState("");
  // const [interShipDates, setInterShipDates] = useState({
  //   internShipStartDate: null,
  //   internShipEndDate: null,
  // });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (id) {
  //       try {
  //         const { data, status } = await ERPApi.get(
  //           `${import.meta.env.VITE_API_URL}/sc/getstudentcertificate/${id}`
  //         );
  //         if (status === 200) {
  //           setCertificatePrint(data?.student);
  //           setInterShipDates({
  //             internShipStartDate: new Date(
  //               data?.student?.certificate_status[0]?.internShip?.internShipStartDate
  //             ),
  //             internShipEndDate: new Date(
  //               data?.student?.certificate_status[0]?.internShip?.internShipEndDate
  //             ),
  //           });
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

  const startYear = internShipStartDate?.getFullYear();
  const startMonth = internShipStartDate?.getMonth();
  const endYear = internShipEndDate?.getFullYear();
  const endMonth = internShipEndDate?.getMonth();
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;





  return (
    <div>
      <BackButton heading="InternshipCertificate" content="Back" />
      <div className="text-end">
        <Button className="btn btn_primary me-3" onClick={handlePrint}>
          <MdLocalPrintshop /> Print
        </Button>
      </div>
      <div className="card">
        <div className="container">
          <div className="" ref={componentRef}>
            {certificatePrint && (
              <div className="">
                <div className="test position-relative">
                  <img src={bgimg} alt="certificate" className="" />
                  <div className="logos position-absolute">
                    <img src={infozit} className="infoimg" alt="" />
                  </div>
                  <div>
                    <header className="headers d-flex flex-row justify-content-center align-items-start mt-5 position-absolute">
                      <div className=" d-flex flex-column justify-content-center align-items-center">
                        <h3 className="fs-34 mt-2">CERTIFICATE</h3>
                        <div className="d-flex justify-content-center">
                          <img
                            className="bg-colorinter"
                            src={backgoundimg}
                            alt=""
                          />
                        </div>
                        {/* <p className="headers-colorposition-relative">OF INTERNSHIP</p> */}
                        <p className="internship-p ">
                          THIS CERTIFICATE IS PRESENTED TO
                        </p>
                      </div>
                      <img src={badge} alt="" srcSet="" className="badge-css" />
                    </header>
                  </div>
                  <div className="internship-info">
                    <h4 className="internship-name text-center">
                      {" "}
                      {certificatePrint?.name}
                    </h4>
                  </div>
                  <div className="inter-info">
                    <p className="position-absolute completion-info">
                      For his/her successful completion of the internship
                      program at <span>Future Gen </span>as the role{" "}
                      <span> {certificatePrint?.courses} Intern</span> for the
                      duration of{" "}
                      <span>
                        {totalMonths ? totalMonths : null}{" "}
                        {totalMonths
                          ? totalMonths === 1
                            ? "month"
                            : "months"
                          : null}{" "}
                      </span>
                      {totalMonths ? (
                        totalMonths === 1 ? (
                          <span>
                            in{" "}
                            {formatDate(
                              certificatePrint?.certificate_status[0]
                                ?.internShip?.internShipStartDate
                            )}
                          </span>
                        ) : (
                          <>
                            from{" "}
                            <span>
                              {" "}
                              {new Date(
                                certificatePrint?.certificate_status[0]?.internShip?.internShipStartDate
                              )
                                .toLocaleString("en-US", { month: "short" })
                                .toUpperCase()}
                              {"  "}
                              {new Date(
                                certificatePrint.certificate_status[0]?.internShip?.internShipStartDate
                              ).getFullYear()}
                            </span>{" "}
                            to{" "}
                            <span>
                              {" "}
                              {formatDate(
                                certificatePrint?.certificate_status[0]
                                  ?.internShip?.internShipEndDate
                              )}
                            </span>
                          </>
                        )
                      ) : null}
                      . He/She is found to be hardworking, diligent, and sincere
                      in all his/her duties assigned during the internship
                      program. We wish all the best for your future endeavors.
                    </p>
                  </div>
                  <div className="internship-date">
                    <div className="date-lefts text-center">
                      <p className="dts fw-600">
                        {new Date(
                          certificatePrint?.certificate_status?.[0]?.issuedDate
                        )
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </p>
                      <p className="fw-100 fs-20 isueddate">ISSUED DATE</p>
                    </div>
                  </div>
                  <div className="internship-dates">
                    <div className="date-rights text-center">
                      <img src={sign} alt="" />
                      <p className="">SIGNATURE</p>
                    </div>
                  </div>
                  <h4 className="association text-center position-absolute">
                    Associated with
                  </h4>
                  <div className="image-container ">
                    <div className="image-row">
                      <img src={img1} alt="" className="imgs1" />
                      {/* <img src={img4} alt="" className="imgs2" />
                      <img src={img2} alt="" className="imgs3" /> */}
                      <img src={img5} alt="" className="imgs4" />
                    </div>
                    <div className="border-section">
                      <div className="mt-2">
                        <h6>
                          <span className="iconImg1 ms-4">
                            <img src={icon2} alt="" />
                          </span>
                          <span className="email-info">info@infozit.com</span>
                        </h6>
                        <h6>
                          <span className="iconImg ms-4">
                            <img src={icon1} alt="" />
                          </span>
                          <span className="phone-info">+91-6281160120</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntrernshipCertificate;
