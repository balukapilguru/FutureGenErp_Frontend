import React from "react";
import "../../../../assets/css/StudentApplicationPrint.css";
import { useReactToPrint } from "react-to-print";
import { IoMdMail } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import useFormattedDate from "../../../../dataLayer/hooks/useFormattedDate";
import { PiAtBold } from "react-icons/pi";
import { useFetcher, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DefaultBG from "../../../../assets/images/student_idCard_images/DefaultimgBG.png";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { useLoaderData } from "react-router-dom";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext.jsx";
import fgLogo from "../../../../assets/images/FG-LOGO.png";

export const studentApplicationPrintLoader = async ({ params }) => {
  try {
    const { data, status } = await ERPApi.get(
      `/student/viewstudentdata/${params?.id}`
    );
    if (status === 200) {
      const studentData = data?.student[0];
      return { studentData };
    }
  } catch (error) {
    console.error(error);
    return null
  }
};

export const studentApplicationPrintAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    return toast.promise(
      ERPApi.post(`/student/sendstudentpdf`, formData),
      {
        pending: "Sending PDF...",
        success: "PDF sent successfully!",
        error: "Failed to send PDF ",
      }
    );
  } catch (error) {
    console.error("Error sending PDF:", error);
    toast.error("An error occurred while sending the PDF.");
    return { success: false, message: "An error occurred while sending the PDF." };
  }
};

const StudentApplicationPrint = () => {
  const { AuthState } = useAuthContext()
  const fetcher = useFetcher()
  const data = useLoaderData();
  const [isSubmitting, setIsSubmitting] = useState()
  const studentdata = data?.studentData;
  const componentRefff = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRefff.current,
  });

  let BirthDate = useFormattedDate(studentdata?.birthdate);
  let EnquiryDate = useFormattedDate(studentdata?.enquirydate);
  let AdmissionDate = useFormattedDate(studentdata?.admissiondate);
  let CourseStartDate = useFormattedDate(studentdata?.validitystartdate);
  let ExpectedEndDate = useFormattedDate(studentdata?.validityenddate);
  let IssueDate = useFormattedDate(studentdata?.admissiondate);

  const branchLogoImage = AuthState?.user
  
  const branchImage = studentdata?.branches?.logoName
  const branchLogo = branchImage
    ? `https://teksacademy.s3.ap-south-1.amazonaws.com/branches/logos/${branchImage}`
    : null;
  const handleDownloadPDF = async () => {
    setIsSubmitting(true);
    const input = componentRefff.current;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    await pdf.html(input, {
      margin: [10, 10, 10, 10],
      autoPaging: "text",
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#ffffff",
      },
      x: 8,
      y: 8,
      width: 194,
    });

    const pdfBlob = pdf.output("blob");

    const pdfFile = new File([pdfBlob], "Student_Application.pdf", { type: "application/pdf" });

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("email", studentdata?.email || "");
    formData.append("mobilenumber", studentdata?.mobilenumber || "");
    formData.append("studentName", studentdata?.name)
    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  return (
    <div>
      <BackButton heading="Student Application Print" content="Back" />
      <div className="container-fluid p-4">
        <div className="card">
          <div className="text-end p-3">
            <Button className="btn btn_primary me-2 " onClick={handlePrint}>
              <MdLocalPrintshop /> Print
            </Button>
            <Button className="btn btn_primary me-2 " onClick={handleDownloadPDF} disabled={fetcher.state === "submitting"}>
              {fetcher.state === "submitting" ? "Sending..." : "Send PDF"}
            </Button>
          </div>
          <div className="container-fluid " ref={componentRefff}>
            <div className="page">
              <div className="application">
                <div className="row justify-content-between align-items-center">
                  <div className="col-12 col-md-5 col-lg-5 col-xl-5">
                    <h5 className="black_300 fw-600 fs_18 p-0 ms-3">
                      Futuregen Technologies Private Limited
                    </h5>
                    <p className="p-0 fs-14 black_300 ms-3">
                      {" "}
                      PAN : AALFF5087H
                    </p>
                    <p className="p-0 fs-14 black_300 ">
                      {" "}
                      <IoMdMail className="fs-16 ms-3" />  info@futuregentechnologies.com
                    </p>
                    <p className="p-0 fs-14 black_300">
                      <IoCall className="fs-16 ms-3" />
                      91 98489 47799{" "}
                    </p>
                    <p className="p-0 fs-14 black_300">
                      {" "}
                      <PiAtBold className="fs-16 ms-3" />
                      www.futuregentechnologies.com
                    </p>
                  </div>
                  <div className=" col-md-6 col-lg-6 col-xl-6 text-center ">
                    <img
                      src= {fgLogo}
                      alt="Branch Logo"
                      className=" w-75 "

                    />
                    <p className="fs-15 mt-4 black_300">
                      {/* <b className="">Branch:</b> {studentdata?.branch} */}
                       <b className="">Branch:</b> Kukatpally, Hyderabad
                    </p>
                  </div>
                  <div className=" mt-3 ">
                    <div className="">
                      <h5 className=" text-center caption p-2">
                        Student Details
                      </h5>
                    </div>

                    <div className="row student-data">
                      <div className="col-12 col-md-7 col-lg-8 col-xl-8 ">
                        <div className="">
                          <div className="table table-responsive  table-bordered  d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody className="">
                                <tr className="">
                                  <td
                                    className="fs-13 black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Name
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td ">
                                    {studentdata?.name}
                                  </td>
                                </tr>
                                <tr
                                  className="application-tbl-td"
                                  style={{
                                    border: "1px solid var(--erp-text-color)",
                                  }}
                                >
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td bg-head w-35"
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Parent Name
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {studentdata?.parentsname}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td bg-head w-35 w-35"
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Date of Birth
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {BirthDate}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td bg-head w-35"
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Gender
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {studentdata?.gender}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td bg-head w-35"
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Marital Status
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {studentdata?.maritalstatus}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td bg-head w-35 "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    College/Company
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td college-wrap">
                                    {studentdata?.college}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className=" col-12 col-md-5 col-lg-4 col-xl-4  text-center mt-2">
                        {!studentdata?.studentImg && (
                          <img src={DefaultBG} alt="photo" />
                        )}

                        {studentdata?.studentImg && (
                          <img
                            // src={`https://teksacademyimages.s3.amazonaws.com/${studentdata?.studentImg}`}
                            src={`https://teksacademy.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/${studentdata?.studentImg}`}
                            className="w-50 admform-sd  "
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className=" student-data mt-3">
                    <div className="">
                      <h5 className=" text-center caption p-2">
                        Student Contact Details
                      </h5>
                    </div>

                    <div className="row">
                      <div className="col-12 col-lg-12 col-sm-6 col-md-12">
                        <div className="">
                          <div className="table table-responsive   d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody>
                                <tr className="application-tbl-td ">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Country
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.country}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Native&nbsp;Place
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.native}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    State
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.state}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Area
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.area}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Mobile&nbsp;Number
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.mobilenumber}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Whatsapp&nbsp;Number
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.whatsappno}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Present&nbsp;Address
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.area}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Pincode
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {studentdata?.zipcode}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Email&nbsp;Address
                                  </td>

                                  <td
                                    className="fs-13 black_300 application-tbl-td "
                                    colSpan={3}
                                  >
                                    {studentdata?.email}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="  mt-3 ">
                    <div className="">
                      <h5 className=" text-center caption p-2">
                        {" "}
                        Educational Details
                      </h5>
                    </div>

                    <div className="row">
                      <div className="col-12 col-lg-12 col-sm-6 col-md-12">
                        <div className="">
                          <div className="table table-responsive   d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody>
                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    S.No
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Education
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Marks(Percentage)
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Academic Year
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td className="fs-13 black_300 application-tbl-td ">
                                    1
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.educationtype}
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.marks}
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.academicyear}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" mt-3 ">
                    <div className="">
                      <h5 className=" text-center admission_detail caption p-2">
                        {" "}
                        Admission Details
                      </h5>
                    </div>

                    <div className="student-data row">
                      <div className="col-12 col-lg-12 col-sm-6 col-md-12">
                        <div className="">
                          <div className="table table-responsive   d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody>
                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Enquiry&nbsp;Taken
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {EnquiryDate ? EnquiryDate : "No Date"}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Reg&nbsp;Number
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {studentdata?.registrationnumber}
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    className="fs-14  black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Enquiry&nbsp;Taken By
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {studentdata?.enquirytakenby}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Lead&nbsp;Source
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {Array.isArray(studentdata?.leadsource) ? (
                                      studentdata.leadsource.map((source) => (
                                        <td
                                          className="borderleft"
                                          key={source.id}
                                        >
                                          {source.source}
                                        </td>
                                      ))
                                    ) : (
                                      <td className="borderleft">
                                        {studentdata?.leadsource}
                                      </td>
                                    )}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Course&nbsp;Package
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {studentdata?.coursepackage}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Course
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {studentdata?.courses}
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Admission&nbsp;Date
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {AdmissionDate ? AdmissionDate : "No Date"}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Mode&nbsp;Of&nbsp;Training
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.modeoftraining}
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Expected&nbsp;End&nbsp;Date
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {ExpectedEndDate
                                      ? ExpectedEndDate
                                      : "No Date"}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Course&nbsp;Start&nbsp;Date
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {CourseStartDate
                                      ? CourseStartDate
                                      : "No Date"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" mt-3 ">
                    <div className="">
                      <h5 className=" text-center fee_detail caption p-2">
                        Fee Details
                      </h5>
                    </div>

                    <div className="row student-data">
                      <div className="col-12 col-lg-12 col-sm-6 col-md-12">
                        <div className="">
                          <div className="table table-responsive   d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody>
                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Fee&nbsp;Type
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Fee&nbsp;Amount
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Discount
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Tax
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Total&nbsp;Fee
                                  </td>
                                </tr>

                                {studentdata?.feedetails &&
                                  studentdata?.feedetails.map((item, index) => (
                                    <tr key={index}>
                                      <td className="fs-13 black_300 application-tbl-td">
                                        {item.feetype}
                                      </td>

                                      <td className="fs-13 black_300 application-tbl-td">
                                        {Number(
                                          parseFloat(item.amount).toFixed(2)
                                        ).toLocaleString("en-IN")}
                                      </td>

                                      <td className="fs-13 black_300 application-tbl-td">
                                        {item.discount &&
                                          Number(
                                            parseFloat(item.discount).toFixed(2)
                                          ).toLocaleString("en-IN")}

                                        {!item.discount && <>0</>}
                                      </td>

                                      <td className="fs-13 black_300 application-tbl-td">
                                        {" "}
                                        {Number(
                                          parseFloat(item.taxamount).toFixed(2)
                                        ).toLocaleString("en-IN")}
                                      </td>

                                      <td className="fs-13 black_300 application-tbl-td">
                                        {Number(
                                          parseFloat(item.totalamount).toFixed(
                                            2
                                          )
                                        ).toLocaleString("en-IN")}{" "}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="  mt-3 ">
                    <div className="">
                      <h5 className=" text-center caption  asset p-2">
                        {" "}
                        Assets
                      </h5>
                    </div>

                    <div className="row student-data">
                      <div className="col-12 col-lg-12 col-sm-6 col-md-12">
                        <div className="">
                          <div className="table table-responsive   d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody>
                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Provided
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata &&
                                      Array.isArray(studentdata.assets) &&
                                      studentdata.assets.map((item, index) => (
                                        <React.Fragment key={index}>
                                          {item}

                                          {index !==
                                            studentdata.assets.length - 1 && (
                                              <span>, </span>
                                            )}
                                        </React.Fragment>
                                      ))}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Issue&nbsp;Date
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {IssueDate}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  {" "}
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgrounColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Comments
                                  </td>
                                  <td
                                    className="fs-13 black_300 application-tbl-td "
                                    colSpan={4}
                                  >
                                    {studentdata?.admissionremarks}
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    className="fs-13 black_300 fw-600 text-start application-tbl-td "
                                    colSpan={5}
                                    rowSpan={3}
                                  >
                                    For&nbsp;Office&nbsp;Purpose
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="row justify-content-center mt-4 "> */}

                  <div className="col-lg-12   terms-and-condition mt-4">
                    <div className="application-tbl-td ">
                      <h5 className=" text-center caption p-2 m-0 me-0 ms-0">
                        Terms and condition
                      </h5>
                    </div>

                    <div className="application-tbl-td p-3">
                      <div className=" ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          {" "}
                          1.Admission:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. Students must provide all required documents and
                          information during the admission process.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2. Admission will be confirmed only after payment of
                          the booking amount, as decided by the management from
                          time to time.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300"> 2. Fees:</h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. Students shall pay the course fees as per the due
                          dates / terms mentioned overleaf. Fees shall not
                          refundable/non-transferable/non-adjustable, under any
                          circumstances.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.Late payment of fees shall attract penal interest
                          @1.5% per month.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3.Teks academy reserves its right to cancel the
                          admission, in case of non-payment of fees, as per the
                          agreed due dates.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          4. Course fees may vary from student to student, based
                          on their merit and other relevant factors as
                          determined by the Teks Academy (“Academy)
                          administration, at its sole discretion.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          {" "}
                          3. Course Material:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. The course material provided by the Academy is the
                          intellectual property of Teks Academy and cannot be
                          reproduced or used for commercial purposes without
                          written permission of the Academy.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.Any damage or loss of course material will be the
                          responsibility of the student and shall attract
                          additional charges for extra material copy of the
                          course material as decided by the administration from
                          time to time.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          {" "}
                          4. Attendence:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. Regular attendance is essential for successfully
                          completing the course and obtaining a certificate.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.In case of Continuous absence of 3 classes, without
                          intimation, Academy reserves its right, to terminate
                          the admission.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3.In case of absence, Make-up / Extra classes may be
                          arranged at the discretion of the Academy and subject
                          to availability of resources. For clarity, the Academy
                          is not obliged to provide the makeup/extra classes.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300 ">5. Conduct</h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.Students must conduct themselves respectfully
                          towards the Academy staff, fellow students, and not
                          spoil the Academy's property.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.Any form of harassment, discrimination, or bullying
                          will not be tolerated and may lead to immediate
                          expulsion of the student from the Academy.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3.Use of drugs or alcohol within the Academy's
                          premises is strictly prohibited and shall lead to
                          immediate expulsion from the Academy.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300 next-page  student-data">
                          6. Certification :
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.Certificates will be awarded to students who
                          successfully complete the course as per the Academy's
                          criteria, as decided by the management from time to
                          time.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The certificate does not guarantee employment or
                          acceptance/admission into any institution.student from
                          the Academy.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">7. Liablity:</h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.The Academy is not responsible for any injury, loss,
                          or damage to the students or their belongings within
                          the Academy's premises or during any offsite activit
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.Students must take responsibility for their personal
                          safety and belongings while attending classes at the
                          Academy or any other location.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          8. Change in Policies:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.The Academy may revise its policies, rules and
                          regulations, course structure, fees, timings, or any
                          other aspect of the Academy at its sole discretion
                          from time to time, without prior notice to the
                          students.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.Such revised policies will be applicable to all
                          existing and new students.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          9. Dispute Resolutions:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.Any dispute arising out of or related to these terms
                          and conditions shall be resolved amicably through
                          mutual discussion and agreement between the Academy
                          and the student. Any unresolved dispute shall be
                          subject to the jurisdiction of the courts of
                          Hyderabad, Telangana, India.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          10. Termination of Admission:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.The Academy reserves the right to terminate the
                          admission of any student at any time, without
                          assigning any reason.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.In such cases, Academy may at its sole discretion,
                          refund a portion of the fees that completely depends
                          on Academy’s decision and on the duration of the
                          course completed by the student.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          11. No Placemets Guarantee
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.The Academy does not provide any placement guarantee
                          to the students but may assist them in finding
                          suitable job opportunities through guidance,
                          counseling.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600  black_300">
                          12. Using Id Card
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.Each student will be issued an identification card
                          (ID card) by the Academy, and it must be carried by
                          the student at all times while attending classes or
                          any other activities conducted by the Academy.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300 ">
                          13. Copiying Institute Content
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.Distributing any of the any other Academy's /
                          Coaching centers brochures /course material, including
                          lectures, notes, presentations, or any other content,
                          promoting of any other coaching institutes is strictly
                          prohibited. Any violation of this rule may lead to
                          immediate expulsion from the Academy and legal action
                          may be taken against the student.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300 next-page  student-data">
                          14. Teaching Staff:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.While the Academy will endeavor to provide training
                          with a specific teaching staff member, there is no
                          commitment to do so.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The Academy reserves the right to assign trainers
                          based on availability, and students cannot demand a
                          specific trainer.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          15. Course Curriculum
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. The Academy reserves the right to update the course
                          curriculum at its discretion, without any prior notice
                          to the students.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.Students are expected to keep themselves updated
                          with any changes in the course curriculum.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          16. Course Duration:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. The course duration may vary from batch to batch,
                          depending on factors such as students' attendance,
                          training methodology, and other relevant factors as
                          determined by the Academy.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The Academy reserves the right to change the course
                          duration at any time without prior notice.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          17. Paid Internship Support:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. The Academy may assist students in finding suitable
                          paid internships based on their skills and interests.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The Academy will not guarantee any specific
                          internship or job placement.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3.The Academy may charge a separate fee for providing
                          internship support services.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          4.The Academy will not be liable for any issues or
                          disputes that arise between the student and the
                          internship provider.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          18. Project Assignment:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.The Academy may provide practice projects to the
                          students for upgrading their learning and skill
                          development.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The projects assigned may be either Capstone, live
                          or previously completed projects, depending on
                          availability and suitability.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3.Students must complete the project within the given
                          time frame and submit it to the Academy for
                          evaluation.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600  black_300">
                          19. Intellectual Property:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.All intellectual property created by students during
                          the live project or internship belongs to the Academy.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The Academy may use such intellectual property for
                          promotional or educational purposes, at its sole
                          discretion.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3.The Academy will not claim any ownership rights over
                          the student's intellectual property.
                        </p>
                      </div>

                      <div className="ps-4 student-data">
                        {" "}
                        <h5 className="fs-14 fw-600 next-page student-data  pb-2 black_300">
                          Privacy Policy:
                        </h5>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300  student-data">
                          1. Information Collection :
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We collect personal information such as name, email
                          address, phone number, and other details from students
                          at the time of enrollment.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          2. Use Of Information:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We use the information collected to contact students
                          regarding course updates, provide course materials,
                          and issue certificates of completion.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          3. Information Sharing:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We do not share personal information with any third
                          parties without the student's consent, except as
                          required by law.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">4. Security:</h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We take reasonable measures to ensure the security of
                          the personal information collected from students.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">5. Cookies:</h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We use cookies on our website to track user behavior
                          and improve the user experience. Students can disable
                          cookies in their web browser if they choose to do so.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          6. Data Retention :
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We retain personal information for as long as
                          necessary to provide the course and related services,
                          or until the student requests that their information
                          be deleted.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          7.Modification:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We reserve the right to modify this privacy policy at
                          any time without prior notice.
                        </p>
                      </div>

                      <div className="p-4">
                        <p className="black_300 fs-14 ">
                          By signing this form, you acknowledge that you have
                          read, understood, and agree to abide by the terms and
                          conditions and privacy policy.{" "}
                        </p>

                        <p className="black_300 fs-14 ">
                          Further I hereby give my consent for Kapil Group of
                          Companies or Teks Academy and its affiliates, to send
                          their promotional emails/communication to me.
                        </p>
                      </div>
                      <div className=" ps-4 row">
                        <div className="col-6">
                          <h6 className="fs-14 fw-600 p-2 black_300">Date :</h6>
                          <h6 className="fs-14 fw-600 p-2 black_300">
                            {" "}
                            Place :
                          </h6>
                        </div>
                        <div className="col-6">
                          <h6 className="fs-14 fw-600 p-2 black_300">
                            Counsellor Signature :{" "}
                          </h6>
                          <h6 className="fs-14 fw-600 p-2 black_300">
                            {" "}
                            Student Signature :{" "}
                          </h6>
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
    </div>
  );
};

export default StudentApplicationPrint;
