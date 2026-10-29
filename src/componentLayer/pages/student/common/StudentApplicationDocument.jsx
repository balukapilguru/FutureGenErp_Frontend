import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import fgLogo from "../../../../assets/images/FG-LOGO.png";
import DefaultBG from "../../../../assets/images/student_idCard_images/DefaultimgBG.png";
import StudentTermsAndConditions from "../StudentTermsAndConditions";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const DetailTable = ({ title, rows }) => (
  <section className="student-data mt-3">
    <h5 className="caption text-center p-2">{title}</h5>
    <table className="table table-bordered align-middle mb-0">
      <tbody>
        {rows.map(([label, value], index) => (
          <tr key={`${label}-${index}`}>
            <td className="fs-13 fw-600 bg-head application-tbl-td">{label}</td>
            <td className="fs-13 application-tbl-td">
              {typeof value === "object" && value !== null && !React.isValidElement(value)
                ? value?.name || value?.source || JSON.stringify(value)
                : value || ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

const StudentApplicationDocument = ({ data = {} }) => {
  const student = data || {};
  const fees = Array.isArray(student.feedetails) ? student.feedetails : [];

  return (
    <div className="page">
      <div className="application">
        <div className="row align-items-center justify-content-between">
          <div className="col-6">
            <h5 className="fw-600 fs_18">Future Gen Technologies Private Limited</h5>
            <p className="mb-1 fs-14">PAN: AALFF5087H</p>
            <p className="mb-1 fs-14">info@futuregentechnologies.com</p>
            <p className="mb-1 fs-14">91 98489 47799</p>
            <p className="mb-1 fs-14">www.futuregentechnologies.com</p>
          </div>
          <div className="col-5 text-center">
            <img src={fgLogo} alt="Future Gen Technologies" className="w-75" />
            <p className="fs-14 mt-2">Branch: {student.branch || "Kukatpally, Hyderabad"}</p>
          </div>
        </div>

        <h5 className="caption text-center p-2 mt-3">Student Details</h5>
        <div className="row">
          <div className="col-8">
            <table className="table table-bordered align-middle mb-0">
              <tbody>
                {[
                  ["Name", student.name],
                  ["Parent Name", student.parentsname],
                  ["Date of Birth", formatDate(student.birthdate)],
                  ["Gender", student.gender],
                  ["Marital Status", student.maritalstatus],
                  ["College/Company", student.college],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td className="fs-13 fw-600 bg-head application-tbl-td">{label}</td>
                    <td className="fs-13 application-tbl-td">{value || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-4 text-center">
            <img
              src={student.studentImg
                ? `https://futuregen.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/${student.studentImg}`
                : DefaultBG}
              alt="Student"
              crossOrigin="anonymous"
              className="w-50 admform-sd"
            />
          </div>
        </div>

        <DetailTable title="Student Contact Details" rows={[
          ["Country", student.country], ["Native Place", student.native],
          ["State", student.state], ["Area", student.area],
          ["Mobile Number", student.mobilenumber], ["Whatsapp Number", student.whatsappno],
          ["Email Address", student.email], ["Pincode", student.zipcode],
        ]} />
        <DetailTable title="Educational Details" rows={[
          ["Education", student.educationtype], ["Marks", student.marks],
          ["Academic Year", student.academicyear],
        ]} />
        <DetailTable title="Admission Details" rows={[
          ["Enquiry Taken", formatDate(student.enquirydate)], ["Registration Number", student.registrationnumber],
          ["Enquiry Taken By", student.enquirytakenby],
          [
            "Lead Source",
            Array.isArray(student.leadsource)
              ? student.leadsource.map((item) => (typeof item === "object" ? item?.source || item?.name || JSON.stringify(item) : item)).filter(Boolean).join(", ")
              : typeof student.leadsource === "object" && student.leadsource !== null
              ? student.leadsource?.source || student.leadsource?.name || ""
              : student.leadsource,
          ],
          ["Course Package", student.coursepackage],
          [
            "Course",
            Array.isArray(student.courses)
              ? student.courses.map((item) => (typeof item === "object" ? item?.course_name || item?.name || JSON.stringify(item) : item)).filter(Boolean).join(", ")
              : typeof student.courses === "object" && student.courses !== null
              ? student.courses?.course_name || student.courses?.name || ""
              : student.courses,
          ],
          ["Admission Date", formatDate(student.admissiondate)], ["Mode of Training", student.modeoftraining],
          ["Expected End Date", formatDate(student.validityenddate)], ["Course Start Date", formatDate(student.validitystartdate)],
        ]} />

        <section className="student-data mt-3">
          <h5 className="caption text-center p-2">Fee Details</h5>
          <table className="table table-bordered align-middle mb-0">
            <thead><tr><th>Fee Type</th><th>Amount</th><th>Discount</th><th>Tax</th><th>Total Fee</th></tr></thead>
            <tbody>{fees.map((fee, index) => (
              <tr key={`${fee.feetype}-${index}`}>
                <td>{fee.feetype}</td><td>{fee.amount}</td><td>{fee.discount}</td>
                <td>{fee.taxamount}</td><td>{fee.totalamount}</td>
              </tr>
            ))}</tbody>
          </table>
        </section>
        <DetailTable title="Assets" rows={[
          ["Provided", Array.isArray(student.assets) ? student.assets.join(", ") : student.assets],
          ["Issue Date", formatDate(student.admissiondate)], ["Comments", student.admissionremarks],
        ]} />
        <section className="terms-and-condition mt-4">
          <h5 className="caption text-center p-2">Terms and condition</h5>
          <div className="application-tbl-td p-3"><StudentTermsAndConditions /></div>
        </section>
        <div className="row mt-5 text-center">
          <div className="col-6"><p className="border-top pt-2">Counsellor Signature</p></div>
          <div className="col-6"><p className="border-top pt-2">Student Signature</p></div>
        </div>
      </div>
    </div>
  );
};

export const generateStudentApplicationPdf = async (element, filename) => {
  await document.fonts?.ready;
  const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" });
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const marginX = 10;
  const marginY = 14;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginX * 2;
  const contentHeight = pageHeight - marginY * 2;
  const pixelsPerMm = canvas.width / contentWidth;
  const sliceHeight = Math.floor(contentHeight * pixelsPerMm);

  for (let sourceY = 0, pageIndex = 0; sourceY < canvas.height; sourceY += sliceHeight, pageIndex += 1) {
    const height = Math.min(sliceHeight, canvas.height - sourceY);
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = height;
    pageCanvas.getContext("2d").drawImage(canvas, 0, sourceY, canvas.width, height, 0, 0, canvas.width, height);
    if (pageIndex > 0) pdf.addPage();
    pdf.addImage(pageCanvas, "JPEG", marginX, marginY, contentWidth, height / pixelsPerMm, undefined, "FAST");
  }

  const pdfBlob = pdf.output("blob");
  return {
    pdf,
    pdfBlob,
    pdfFile: new File([pdfBlob], filename, { type: "application/pdf" }),
  };
};

export default StudentApplicationDocument;
