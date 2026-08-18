import React, { useEffect, useState, useRef } from "react";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import infozit from "../../../../assets/images/FG-LOGO.png";
import "../../../../assets/css/IEPCertificate.css";
import { IoLocationOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { RiGlobalLine } from "react-icons/ri";
import { IoIosCall } from "react-icons/io";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { useParams } from "react-router-dom";
import sign from "../../../../assets/images/certificate_images/bhaskarsir-sign.png";
import { useLoaderData } from "react-router-dom";



export const iepCertificateLoader = async({params}) => {
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


const IEPCertificate = () => {
  const componentRefff = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRefff.current,
  });
  // const [certificatePrint, setCertificatePrint] = useState("");
  const data = useLoaderData()
  const certificatePrint = data?.studentData;
  const { id } = useParams();

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

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const suffix = getDaySuffix(day);
    return `${day}${suffix} ${month} ${year}`;
  };

  return (
    <div>
      <BackButton heading="IEP Certificate Print" content="Back" />
      <div className="container">
        <div className="text-end p-3">
          <Button className="btn btn_primary me-2 " onClick={handlePrint}>
            <MdLocalPrintshop /> Print
          </Button>
        </div>
        <div className="card">
          <div className="container-fluid " ref={componentRefff}>
            {certificatePrint && (
              <div className=" p-4 me-1">
                <div className="">
                  <div className="row">
                    <div className=" content-width mt-4">
                      <div className=" infoz-img text-end">
                        <img src={infozit} className="w-50 " alt="" />
                      </div>
                      <div className="border-infoz">
                        <div className="border-blue"></div>
                      </div>
                      <div className=" ">
                        <p className=" text-end p-1 mt-4 0 me-3">
                          Date:{" "}
                          {new Date(
                            certificatePrint?.certificate_status?.[0]?.issuedDate
                          )
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-")}
                        </p>
                      </div>

                      <div className=" iep-font px-5">
                        <div className=" ">
                          <p className="black_300 text-center m-0">
                            This is to certify that {""}
                            <span className="fw-600">
                              {certificatePrint?.name}
                            </span>{" "}
                            {""}
                            has successfully completed
                          </p>

                          <h6 className="black_300 text-center iep-color  mt-2">
                            "Industry Exposure Program"
                          </h6>

                          <p className="black_300">
                            From{" "}
                            <span>
                              "
                              {formatDate(
                                certificatePrint?.certificate_status[0]?.iep
                                  ?.iepStartDate
                              )}
                            </span>{" "}
                            to{" "}
                            <span>
                              {formatDate(
                                certificatePrint?.certificate_status[0]?.iep
                                  ?.iepEndDate
                              )}
                            </span>
                            ". During this program he/she gained valuable insights
                            into various aspects of the IT Industry, which
                            includes
                          </p>
                        </div>
                        <div className="ps-4">
                          <ul className="black_300 no-bullets">
                            <li>1. Project Demonstration</li>
                            <li>2. Involvement in Project Development</li>
                            <li>3. Industry Specific Skills</li>
                            <li>4. Workplace Etiquette</li>
                            <li>5. Time Management</li>
                            <li>6. Peer Group Communication</li>
                          </ul>
                        </div>

                        <div className="">
                          <p className="black_300">
                            In recognition of your dedication, commitment and
                            exceptional effort throughout our one-month IT
                            training program, we commend your unwavering pursuit
                            of knowledge and practical skills. Your enthusiasm
                            and dedication have set you apart as an exceptional
                            participant.
                          </p>

                          <p className="black_300">
                            We believe the knowledge and skills you have gained
                            will be the foundation of your future success in the
                            IT Industry.
                          </p>

                          <p className="black_300">
                            Hearty Congratulations! We extend our best wishes
                            for your journey in the dynamic realm of Information
                            Technology.
                          </p>
                        </div>

                        <div className="">
                          <p className="black_300">Best Wishes</p>
                        </div>

                        <div className="row ">
                          <div className="no-line-height ">
                            <img src={sign} className="iep-sign" />
                            <h6 className="black_300">Bhaskar Saragadam</h6>
                            <h6 className="black_300">Project Manager</h6>
                            <h6 className="black_300">
                              Future Gen (A Unit of Kapil Knowledge Hub
                              Pvt Ltd)
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="address-iep p-2 mt-4 mb-5">
                        <h6 className="">
                          <IoLocationOutline className="ms-5" />{" "}
                          F.No:501,502,5th floor, Amsri Faust Building,
                          Secunderabad-500003
                        </h6>
                        <div className="d-flex justify-content-around">
                          <h6 className="">
                            <RiGlobalLine className="me-1" />
                            www.futuregentechnologies.com
                          </h6>
                          <h6 className="">
                            <CiMail className="me-1" />
                            info@futuregentechnologies.com
                          </h6>
                          <h6 className="">
                            <IoIosCall className="me-1" />
                             +91 98489 47799
                          </h6>
                        </div>
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

export default IEPCertificate;
