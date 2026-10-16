import React from "react";
import StudentTermsAndConditions from "../StudentTermsAndConditions";
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
import html2canvas from "html2canvas";
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
    ? `https://futuregen.s3.ap-south-1.amazonaws.com/branches/logos/${branchImage}`
    : null;
  const studentImageUrl = studentdata?.studentImg
    ? `https://futuregen.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/${studentdata.studentImg}`
    : null;
  const handleDownloadPDF = async () => {
    setIsSubmitting(true);
    const input = componentRefff.current;
    if (!input) {
      setIsSubmitting(false);
      return;
    }

    await document.fonts?.ready;
    let canvas;
    try {
      const studentPhoto = input.querySelector(".admform-sd");
      if (studentdata?.studentImg && studentPhoto) {
        await studentPhoto.decode();
      }

      canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
    } catch (error) {
      console.error("Unable to prepare the student application PDF:", error);
      toast.error(error.message || "Unable to prepare the PDF. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
    const margin = 10;
    const contentWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    const contentHeight = pdf.internal.pageSize.getHeight() - margin * 2;
    const maxSliceHeight = Math.floor(canvas.width * (contentHeight / contentWidth));
    const inputBounds = input.getBoundingClientRect();
    const pixelScale = canvas.width / inputBounds.width;
    const breakPoints = Array.from(input.querySelectorAll("tr, h5, li, .terms-and-condition p"))
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        const y = element.matches("h5") ? bounds.top : bounds.bottom;
        return Math.round((y - inputBounds.top) * pixelScale);
      })
      .filter((y) => y > 0 && y < canvas.height)
      .sort((a, b) => a - b);

    let sourceY = 0;
    let pageIndex = 0;
    while (sourceY < canvas.height) {
      const targetEnd = Math.min(sourceY + maxSliceHeight, canvas.height);
      const safeEnd = breakPoints.filter((point) => point > sourceY && point <= targetEnd).at(-1);
      const safeBreakIsNearPageEnd = safeEnd && safeEnd >= targetEnd - maxSliceHeight * 0.12;
      const sliceEnd = targetEnd === canvas.height
        ? canvas.height
        : safeBreakIsNearPageEnd ? safeEnd : targetEnd;
      const sliceHeight = sliceEnd - sourceY;
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      pageCanvas.getContext("2d").drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      );

      if (pageIndex > 0) pdf.addPage();
      const renderedHeight = (sliceHeight / canvas.width) * contentWidth;
      pdf.addImage(pageCanvas, "PNG", margin, margin, contentWidth, renderedHeight);
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, margin, contentWidth, contentHeight);
      sourceY = sliceEnd;
      pageIndex += 1;
    }

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
                      Future Gen Technologies Private Limited
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
                            src={studentImageUrl}
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

                  <div className="asset-section mt-4">
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
                      <StudentTermsAndConditions />
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
