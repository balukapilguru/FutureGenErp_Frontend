import React from "react";

import "../../../../assets/css/FeeAdminInvoice.css";
import { useReactToPrint } from "react-to-print";
import { useLoaderData } from "react-router-dom";
import { MdLocalPrintshop } from "react-icons/md";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import BackButton from "../../../components/backbutton/BackButton.jsx";
import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext.jsx";
import mainLogo from  "../../../../assets/images/FG-LOGO.png"
export const FeeAdminInvoiceLoader = async ({ request, params }) => {

  const invoiceFor = params?.name;
  const invoiceType = params?.nametype;
  const IndexpositionOfee = Number(params?.index); // Ensure it's a number
  const studentId = params?.id;

  try {
    const [singleStudentData] = await Promise.all([
      ERPApi.get(`/student/viewstudentdata/${studentId}`),
    ]);
    const studentData = singleStudentData?.data?.student?.[0];
    let FeeInstallmentData = null;

    if (invoiceFor === "Admission Fee" && studentData?.admissionFee) {
      FeeInstallmentData = studentData?.admissionFee[IndexpositionOfee];
    } else if (
      invoiceFor === "Installment" &&
      Array.isArray(studentData?.installments)
    ) {
      FeeInstallmentData = studentData.installments[IndexpositionOfee] || null;
    }
    return { studentData, invoiceFor, FeeInstallmentData };
  } catch (error) {
    console.error(error);
    return { studentData: null, invoiceFor: null, FeeInstallmentData: null };
  }
};

const FeeAdminInvoice = () => {
  const data = useLoaderData();
  const { studentData, invoiceFor, FeeInstallmentData } = data;
  const { AuthState } = useAuthContext();
  const branchLogoImage = studentData?.branches?.logoName
  const branchLogo = branchLogoImage
    ? `https://teksacademy.s3.ap-south-1.amazonaws.com/branches/logos/${branchLogoImage}`
    : null;

  const componentRefff = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRefff.current,
  });

  return (
    <div>
      <BackButton heading="Invoice" content="Back" />
      <div className="container">
        <div className="mt-3 text-end me-3 ">
          <button onClick={handlePrint} className="btn btn_primary mb-3  end">
            <MdLocalPrintshop /> Print
          </button>
        </div>
        <div className="invoice" ref={componentRefff}>
          <div className="invoice-border black_300 border-black d-flex justify-content-center">
            <img
              src={mainLogo}
              className="img-fluid logoinvoice_css"
              alt="Branch Logo"
            />
          </div>
          <div className="invoice-border border-black ">
            <h3 className="text-center my-3  black_300 fs-22 fw-500">
              {" "}
              Fee Invoice
            </h3>
          </div>

          <div className="invoice-border border-black">
            <div className="row no-rowmargin">
              <div className="col-6 pt-2  black_300">
                <b className="ps-2  black_300 fs-14 fs-14">
                  Registration No :{" "}
                </b>
                {studentData && studentData?.registrationnumber}
              </div>
              <div className="col-6 invoice-sideborder border-black pt-2  black_300 fs-14 fs-14">
                <b> Invoice NO : </b>

                {invoiceFor &&
                  (invoiceFor === "Installment" || invoiceFor === "Admission Fee")
                  ? FeeInstallmentData?.invoice?.adminInvoiceNo
                  : null}

                <p>
                  {(invoiceFor === "Installment" ||
                    invoiceFor === "Admission Fee") &&
                    FeeInstallmentData?.paiddate ? (
                    <>
                      <b>Date:</b>{" "}
                      {new Date(FeeInstallmentData.paiddate)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </>
                  ) : (
                    "No Date Found"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="row invoice-border border-black no-margin">
            <div className="col-6 invoice-sideborder border-black py-2">
              <p className="">
                <strong className="ps-2  black_300 fs-14">
                  {" "}
                  KAPIL KNOWLEDGE HUB PVT LTD
                </strong>
              </p>
              <span className=" black_300 fs-14">
                <b className="ps-2  black_300 fs-14 ">PAN : </b>
                  AALFF5087H
              </span>{" "}
              <br />
              <span className="   black_300 fs-14">
                <b className="ps-2  black_300 fs-14 ">GSTIN : </b>{" "}
                36AAHCK0599C1ZI{" "}
              </span>{" "}
              <br />
              <span className="ps-2   fs-14  black_300">
                <b>Branch : </b> Teks-{studentData && studentData?.branch}
              </span>
            </div>

            <div className="col-6 invoice-sideborder border-black py-2   black_300 fs-14">
              <p className="">BILL TO : </p>
              <span>
                <b>Name : </b>
                {studentData && studentData?.name}
              </span>
              <br />
              <span>
                <b>Contact No : </b> {studentData && studentData.mobilenumber}
              </span>
              <br />
              <span>
                <b>Email : </b>
                {studentData && studentData?.email}
              </span>
              <br />

              <span>
                <b>Address : </b>{" "}
                <span>
                  {studentData && (
                    <span>
                      {studentData?.area},&nbsp;{studentData?.native},&nbsp;
                      {studentData?.state}, &nbsp;{studentData?.zipcode},&nbsp;
                      {studentData?.country}
                    </span>
                  )}
                </span>
              </span>
              <br />
              <span>
                <b>Course : </b>
                {studentData?.course[0].course_name}
              </span>
            </div>
          </div>

          <div className="table table-hd table-responsive pt-4  black_300">
            <table className="table table-hd table-centered align-middle table-nowrap mb-0  black_300">
              <thead className="">
                <th className="fs-14  text-center">Fee Type</th>
                <th className=" fs-14  caption text-center">Course Type</th>
                <th className=" fs-14  text-center">HSN Type</th>
                <th className=" fs-14   text-center">Amount</th>
                <th className=" fs-14   text-center">Tax</th>
                <th className=" fs-14   text-center">Tax Amount</th>
                <th className=" fs-14  text-center">Total Amount</th>
              </thead>

              <tbody>
                {/* addmission Fee */}
                {invoiceFor &&
                  invoiceFor === "Admission Fee" &&
                  FeeInstallmentData ? (
                  <tr>
                    <td className="border text-center black_300 border-black">
                      <span> Admission Fee</span>
                    </td>
                    <td className="border text-center  black_300 border-black">
                      <span> {studentData.modeoftraining}</span>
                    </td>
                    <td className="border text-center  black_300 border-black">
                      <span> 99843</span>
                    </td>
                    <td className="border text-center  black_300 border-black">
                      <span>
                        {" "}
                        {Number(
                          parseFloat(
                            FeeInstallmentData?.admissionAmount / 1.18
                          ).toFixed(2)
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="border text-center  black_300 border-black">
                      <span> 18%</span>
                    </td>

                    <td className="border text-center  black_300 border-black">
                      <span>
                        {" "}
                        {Number(
                          (
                            parseFloat(
                              FeeInstallmentData?.admissionAmount
                            ).toFixed(2) -
                            parseFloat(
                              FeeInstallmentData?.admissionAmount / 1.18
                            ).toFixed(2)
                          ).toFixed(2)
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="border text-center black_300 border-black">
                      <span>
                        {Number(
                          FeeInstallmentData?.admissionAmount
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                ) : null}

                {/* course Fee */}
                {invoiceFor &&
                  invoiceFor === "Installment" &&
                  FeeInstallmentData ? (
                  <tr>
                    <td className=" text-center black_300 border border-black border border-black 1">
                      Course Fee
                    </td>
                    <td className=" text-center black_300 border border-black border border-black 1">
                      {studentData?.modeoftraining}
                    </td>
                    <td className="border text-center black_300 border-black">
                      <span> 99843</span>
                    </td>

                    <td className=" text-center black_300 border border-black border border-black 1">
                      {Number(
                        parseFloat(
                          (FeeInstallmentData.paidamount * 0.7) / 1.18
                        ).toFixed(2)
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="border text-center black_300 border-black">
                      <span> 18%</span>
                    </td>

                    <td className=" text-center  black_300 border border-black border border-black 1">
                      {Number(
                        (
                          parseFloat(
                            FeeInstallmentData.paidamount * 0.7
                          ).toFixed(2) -
                          parseFloat(
                            (FeeInstallmentData.paidamount * 0.7) / 1.18
                          ).toFixed(2)
                        ).toFixed(2)
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className=" text-center black_300 border border-black border border-black 1">
                      {Number(
                        parseInt(FeeInstallmentData.paidamount * 0.7)
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ) : null}

                {/* material Fee */}

                {invoiceFor &&
                  invoiceFor === "Installment" &&
                  FeeInstallmentData ? (
                  <tr>
                    <td className="border border-black black_300 border border-black 1 text-center">
                      Material Fee
                    </td>
                    <td className="border border-black black_300 border border-black 1 text-center"></td>
                    <td className="border border-black black_300 border border-black 1 text-center"></td>
                    <td className="border border-black black_300 border border-black 1 text-center">
                      {Number(
                        parseInt(FeeInstallmentData.paidamount * 0.3)
                      ).toLocaleString("en-IN")}
                    </td>
                    <td className="border border-black black_300 border border-black 1 text-center"></td>
                    <td className="border border-black black_300 border border-black 1 text-center"></td>
                    <td className="border border-black black_300 border border-black 1 text-center">
                      {Number(
                        parseInt(FeeInstallmentData.paidamount * 0.3)
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ) : null}

                {/* Admission Fee total */}
                {invoiceFor &&
                  invoiceFor === "Admission Fee" &&
                  FeeInstallmentData ? (
                  <tr>
                    <td className="border border-black black_300" colSpan="3">
                      <span>
                        <b>Total</b>
                      </span>
                    </td>

                    <td className="border text-center black_300 border-black">
                      <span>
                        {" "}
                        {Number(
                          parseFloat(
                            FeeInstallmentData?.admissionAmount / 1.18
                          ).toFixed(2)
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="border border-black border black_300 border-black 1 text-center"></td>
                    <td className="border text-center black_300 border-black">
                      <span>
                        {" "}
                        {Number(
                          (
                            parseFloat(
                              FeeInstallmentData?.admissionAmount
                            ).toFixed(2) -
                            parseFloat(
                              FeeInstallmentData?.admissionAmount / 1.18
                            ).toFixed(2)
                          ).toFixed(2)
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="border text-center black_300 border-black border border-black 1 ">
                      <strong>
                        {" "}
                        {Number(
                          parseInt(FeeInstallmentData?.admissionAmount)
                        ).toLocaleString("en-IN")}
                      </strong>
                    </td>
                  </tr>
                ) : null}

                {/* Installment Fee Total */}

                {invoiceFor &&
                  invoiceFor === "Installment" &&
                  FeeInstallmentData ? (
                  <tr>
                    <td className="border black_300 border-black" colSpan="3">
                      <span>
                        <b>Total</b>
                      </span>
                    </td>
                    <td className=" text-center black_300 border border-black ">
                      {Number(
                        parseFloat(
                          (FeeInstallmentData.paidamount * 0.7) / 1.18 +
                          FeeInstallmentData.paidamount * 0.3
                        ).toFixed(2)
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="border border-black black_300 text-center"></td>
                    <td className=" text-center border black_300 border-black border">
                      {Number(
                        (
                          parseFloat(
                            FeeInstallmentData?.paidamount * 0.7
                          ).toFixed(2) -
                          parseFloat(
                            (FeeInstallmentData?.paidamount * 0.7) / 1.18
                          ).toFixed(2)
                        ).toFixed(2)
                      ).toLocaleString("en-IN")}
                    </td>
                    <td className="border border-black border black_300 text-center">
                      <p>
                        {Number(
                          parseInt(FeeInstallmentData.paidamount)
                        ).toLocaleString("en-IN")}
                      </p>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className=" table table-hd table-responsive  table-scroll pt-4">
            <table className="table table-hd table-hover table-centered align-middle table-nowrap mb-0">
              <thead>
                <tr>
                  <th
                    className="border border-black fs-14 text-center"
                    rowSpan="2"
                  >
                    HSN/AC
                  </th>
                  <th
                    className="border border-black fs-14  text-center"
                    rowSpan={3}
                  >
                    Taxable Value
                  </th>
                  <th
                    className="border border-black fs-14  text-center"
                    colSpan={2}
                  >
                    CGST
                  </th>

                  <th
                    className="border border-black fs-14  text-center"
                    colSpan={2}
                  >
                    SGST
                  </th>
                  <th
                    className="border border-black fs-14 text-center"
                    rowSpan="3"
                  >
                    Total Tax Amount
                  </th>
                </tr>
                <tr>
                  <th className="border border-black fs-14  text-center">
                    Rate
                  </th>
                  <th className="border border-black fs-14  text-center">
                    Amount
                  </th>
                  <th className="border border-black fs-14  text-center">
                    Rate
                  </th>
                  <th className="border border-black fs-14  text-center">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Admission fee */}
                {invoiceFor &&
                  invoiceFor === "Admission Fee" &&
                  FeeInstallmentData ? (
                  <tr>
                    <td className="border border-black text-center black_300">
                      <span style={{ fontSize: "15px" }}>
                        {" "}
                        {studentData?.modeoftraining}
                      </span>
                    </td>

                    <td className="border border-black text-center black_300">
                      <span style={{ fontSize: "15px" }}>
                        {" "}
                        {Number(
                          parseFloat(
                            FeeInstallmentData?.admissionAmount / 1.18
                          ).toFixed(2)
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="border border-black text-center black_300">
                      <span style={{ fontSize: "15px" }}> 9%</span>
                    </td>
                    <td className="border border-black text-center black_300">
                      <span style={{ fontSize: "15px" }}>
                        {" "}
                        {Number(
                          (
                            (parseFloat(
                              FeeInstallmentData?.admissionAmount
                            ).toFixed(2) -
                              parseFloat(
                                FeeInstallmentData?.admissionAmount / 1.18
                              ).toFixed(2)) /
                            2
                          ).toFixed(2)
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="border border-black text-center black_300">
                      <span style={{ fontSize: "15px" }}> 9%</span>
                    </td>
                    <td className="border border-black text-center black_300">
                      <span style={{ fontSize: "15px" }}>
                        {" "}
                        {Number(
                          (
                            (parseFloat(
                              FeeInstallmentData?.admissionAmount
                            ).toFixed(2) -
                              parseFloat(
                                FeeInstallmentData?.admissionAmount / 1.18
                              ).toFixed(2)) /
                            2
                          ).toFixed(2)
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="border border-black text-center black_300">
                      <span style={{ fontSize: "15px" }}>
                        {" "}
                        {Number(
                          (
                            parseFloat(
                              FeeInstallmentData?.admissionAmount
                            ).toFixed(2) -
                            parseFloat(
                              FeeInstallmentData?.admissionAmount / 1.18
                            ).toFixed(2)
                          ).toFixed(2)
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                ) : null}

                {/* Installment */}
                {invoiceFor &&
                  invoiceFor === "Installment" &&
                  FeeInstallmentData ? (
                  <tr>
                    <td className=" text-center border border-black black_300 ">
                      {studentData?.modeoftraining}
                    </td>

                    <td className=" text-center border border-black black_300 ">
                      {Number(
                        parseFloat(
                          (FeeInstallmentData?.paidamount * 0.7) / 1.18
                        ).toFixed(2)
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="border border-black text-center black_300">
                      <span style={{ fontSize: "15px" }}> 9%</span>
                    </td>

                    <td className=" text-center border border-black  black_300">
                      {Number(
                        (
                          (parseFloat(
                            FeeInstallmentData?.paidamount * 0.7
                          ).toFixed(2) -
                            parseFloat(
                              (FeeInstallmentData?.paidamount * 0.7) / 1.18
                            ).toFixed(2)) /
                          2
                        ).toFixed(2)
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="border border-black text-center black_300">
                      <span style={{ fontSize: "15px" }}> 9%</span>
                    </td>

                    <td className=" text-center border border-black black_300">
                      {Number(
                        (
                          (parseFloat(
                            FeeInstallmentData?.paidamount * 0.7
                          ).toFixed(2) -
                            parseFloat(
                              (FeeInstallmentData?.paidamount * 0.7) / 1.18
                            ).toFixed(2)) /
                          2
                        ).toFixed(2)
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className=" text-center border border-black black_300">
                      {Number(
                        (
                          parseFloat(
                            FeeInstallmentData?.paidamount * 0.7
                          ).toFixed(2) -
                          parseFloat(
                            (FeeInstallmentData?.paidamount * 0.7) / 1.18
                          ).toFixed(2)
                        ).toFixed(2)
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-6">
              <p>
                <u>
                  <b className="ps-2 black-color fs-14">Bank details:</b>
                </u>
              </p>
              <div className="black_300 fs-14">
                <b className="ps-2 black_300 fs-14">GSTIN:</b> 36AAHCK0599C1ZI
              </div>
              <div>
                {" "}
                <b className="ps-2 black_300 fs-14">Account No:</b> ...........
              </div>
              <div>
                {" "}
                <b className="ps-2 black_300 fs-14">IFSC Code:</b> ...........
              </div>
              <p>
                <b className="ps-2 black_300 fs-14">Branch:</b> ..........
              </p>
            </div>
            <div className="col-6 m-auto">
              <div className="black-color fs-14">
                {" "}
                KAPIL KNOWLEDGE HUB PVT LMD
              </div>
              <div>
                <small>(Formerly Kapil Food Park Pvt Ltd)</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeAdminInvoice;

// chnaged to admission fee

// import React from "react";
// import { useEffect, useState } from "react";
// import "../../../../assets/css/FeeAdminInvoice.css";
// import { useReactToPrint } from "react-to-print";
// import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
// import { useParams } from "react-router-dom";
// import { MdLocalPrintshop } from "react-icons/md";
// import numberToWords from "number-to-words";
// import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";

// // admissionFee

// function FeeAdminInvoice() {
//   const { id } = useParams();
//   const [invoice, setinvoice] = useState();
//   const { index } = useParams();
//   const { name } = useParams();
//   const { nametype } = useParams();
//   const [number, setNumber] = useState();
//   const [studentdata, setstudentdata] = useState("");
//   const {
//     studentState: { singleStudentData },
//   } = useStudentsContext();
//   const componentRefff = React.useRef();



//   const handlePrint = useReactToPrint({
//     content: () => componentRefff.current,
//   });

//   useEffect(() => {
//     if (name === "Installment" && studentdata?.installments) {
//       let data = studentdata?.installments;
//       let paidamount = data[index]?.paidamount;
//       setNumber(paidamount);
//     }

//     if (name === "Admission Fee" && studentdata?.admissionFee) {
//       let data = studentdata?.admissionFee;
//       let initialamount = data[index]?.initialamount;
//       setNumber(initialamount);
//     }

//     if (number) {
//       let words = numberToWords.toWords(number);
//       words = words
//         .split(" ")
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(" ");
//       setWords(words);
//     }
//   }, [studentdata]);

//   const [words, setWords] = useState("");

//   useEffect(() => {
//     let firstbranch;
//     if (studentdata?.branch) {
//       firstbranch = studentdata?.branch[0]?.toUpperCase();
//     }

//     let paiddate;
//     if (name === "Admission Fee" && studentdata?.admissionFee) {
//       let data = studentdata?.admissionFee;
//       if (data && data[index]) {
//         paiddate = data[index].paiddate;
//       }
//     }

//     if (name === "Installment" && studentdata?.installments) {
//       let data = studentdata?.installments;
//       if (data && data[index]) {
//         paiddate = data[index].paiddate;
//       }
//     }

//     let regnumber;

//     if (studentdata?.registrationnumber) {
//       let regnum = studentdata?.registrationnumber;
//       regnumber = regnum.substring(9);
//     }

//     if (!studentdata) {
//       setinvoice("");
//     }

//     if (name === "Admission Fee" && studentdata?.admissionFee) {
//       if (nametype === "studentinvoice") {
//         setinvoice(
//           "R-TA" +
//             firstbranch +
//             "-" +
//             paiddate[5] +
//             paiddate[6] +
//             "-" +
//             paiddate[2] +
//             paiddate[3] +
//             "/" +
//             regnumber +
//             `/${parseInt(index) + 1}`
//         );
//       }

//       if (nametype === "admininvoice") {
//         setinvoice(
//           "IN-TA" +
//             firstbranch +
//             "-" +
//             paiddate[5] +
//             paiddate[6] +
//             "-" +
//             paiddate[2] +
//             paiddate[3] +
//             "/" +
//             regnumber +
//             `/${parseInt(index) + 1}`
//         );
//       }
//     }

//     if (name === "Installment" && studentdata?.installments) {
//       if (nametype === "studentinvoice") {
//         setinvoice(
//           "R-TA" +
//             firstbranch +
//             "-" +
//             paiddate[5] +
//             paiddate[6] +
//             "-" +
//             paiddate[2] +
//             paiddate[3] +
//             "/" +
//             regnumber +
//             `/${parseInt(index) + 2}`
//         );
//       }

//       if (nametype === "admininvoice") {
//         setinvoice(
//           "IN-TA" +
//             firstbranch +
//             "-" +
//             paiddate[5] +
//             paiddate[6] +
//             "-" +
//             paiddate[2] +
//             paiddate[3] +
//             "/" +
//             regnumber +
//             `/${parseInt(index) + 2}`
//         );
//       }
//     }
//   }, [studentdata]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (id) {
//         try {
//           const { data, status } = await ERPApi.get(
//             `${import.meta.env.VITE_API_URL}/student/viewstudentdata/${id}`
//           );
//           if (status === 200) {
//             setstudentdata(data?.student[0]);
//           }
//         } catch (error) {
//           console.error(error)
//         }
//       }
//     };

//     fetchData();
//     return () => {};
//   }, [id]);

//   return (
//     <div className="container">
//       <div className="mt-3 text-end me-3 ">
//         <button onClick={handlePrint} className="btn btn_primary mb-3  end">
//           <MdLocalPrintshop /> Print
//         </button>
//       </div>
//       <div className="invoice" ref={componentRefff}>
//         <div className="invoice-border black_300 border-black d-flex justify-content-center">
//           <img
//             className=" my-3 w-25"
//             // src="https://www.admin.teksacademy.com/static/media/Teks-Logo-with-Trade.07d75f2c54a71180af08.png"
//             src="https://teksacademy.com/assets/img/logo/mainlogo.svg"
//             alt="logo"
//           />
//         </div>
//         <div className="invoice-border border-black ">
//           <h3 className="text-center my-3  black_300 fs-22 fw-500">
//             {" "}
//             Fee Invoice
//           </h3>
//         </div>

//         <div className="invoice-border border-black">
//           <div className="row no-rowmargin">
//             <div className="col-6 pt-2  black_300">
//               <b className="ps-2  black_300 fs-14 fs-14">Registration No : </b>
//               {studentdata && studentdata.registrationnumber}
//             </div>
//             <div className="col-6 invoice-sideborder border-black pt-2  black_300 fs-14 fs-14">
//               <b> Invoice NO : </b>

//               {/* <b> {invoice}</b> */}

//               {name === "Admission Fee" &&
//                 name !== "Installment" &&
//                 (studentdata &&
//                 studentdata?.admissionFee[0]?.invoice?.studentInvoiceNo ? (
//                   <b>
//                     {" "}
//                     {studentdata?.admissionFee[0]?.invoice?.studentInvoiceNo}
//                   </b>
//                 ) : (
//                   <b> {invoice}</b>
//                 ))}

//               {name !== "Admission Fee" &&
//                 name === "Installment" &&
//                 (studentdata &&
//                 studentdata?.installments[index]?.invoice?.studentInvoiceNo ? (
//                   <b>
//                     {" "}
//                     {
//                       studentdata?.installments[index]?.invoice
//                         ?.studentInvoiceNo
//                     }
//                   </b>
//                 ) : (
//                   <b> {invoice}</b>
//                 ))}

//               <p>
//                 {name === "Admission Fee" &&
//                 studentdata &&
//                 studentdata?.admissionFee &&
//                 studentdata?.admissionFee?.length > 0 ? (
//                   studentdata?.admissionFee?.map((student) => {
//                     let paidDate = new Date(student?.paiddate);
//                     const day = paidDate.getUTCDate();
//                     const monthIndex = paidDate.getUTCMonth();
//                     const year = paidDate.getUTCFullYear();

//                     const monthAbbreviations = [
//                       "Jan",
//                       "Feb",
//                       "Mar",
//                       "Apr",
//                       "May",
//                       "Jun",
//                       "Jul",
//                       "Aug",
//                       "Sep",
//                       "Oct",
//                       "Nov",
//                       "Dec",
//                     ];

//                     // Formatting the date
//                     paidDate = `${day < 10 ? "0" : ""}${day}-${
//                       monthAbbreviations[monthIndex]
//                     }-${year}`;
//                     return (
//                       <span key={student.id}>
//                         <b>Date:</b> {paidDate}
//                       </span>
//                     );
//                   })
//                 ) : name === "Admission Fee" ? (
//                   <p>No initial payment data available</p>
//                 ) : null}
//                 {studentdata &&
//                 name === "Installment" &&
//                 studentdata?.installments &&
//                 studentdata?.installments.length > 0 ? (
//                   studentdata?.installments.map((student, indx) => {
//                     const originalDate = new Date(student?.paiddate);
//                     const day = String(originalDate.getDate()).padStart(2, "0");
//                     const month = String(originalDate.getMonth() + 1).padStart(
//                       2,
//                       "0"
//                     ); // Month is zero-based, so we add 1.
//                     const year = originalDate.getFullYear();

//                     const formattedDate = `${day}-${month}-${year}`;

//                     if (indx === parseInt(index)) {
//                       return (
//                         <span key={student?.id}>
//                           <b>Date : </b> {formattedDate}
//                         </span>
//                       );
//                     }
//                     return null; // If the condition is not met, return null
//                   })
//                 ) : name === "Installment" ? (
//                   <p>No payment date available</p>
//                 ) : null}
//               </p>

//             </div>
//           </div>
//         </div>

//         <div className="row invoice-border border-black no-margin">
//           <div className="col-6 invoice-sideborder border-black py-2">
//             <p className="">
//               <strong className="ps-2  black_300 fs-14">
//                 {" "}
//                 KAPIL KNOWLEDGE HUB PVT LTD
//               </strong>
//             </p>
//             <span className=" black_300 fs-14">
//               <b className="ps-2  black_300 fs-14 ">CIN : </b>
//               U80100TG2018PTC123853
//             </span>{" "}
//             <br />
//             <span className="   black_300 fs-14">
//               <b className="ps-2  black_300 fs-14 ">GSTIN : </b> 36AAHCK0599C1ZI{" "}
//             </span>{" "}
//             <br />
//             <span className="ps-2   fs-14  black_300">
//               <b>Branch : </b> Teks-{studentdata && studentdata?.branch}
//             </span>
//           </div>

//           <div className="col-6 invoice-sideborder border-black py-2   black_300 fs-14">
//             <p className="">BILL TO : </p>
//             <span>
//               <b>Name : </b>
//               {studentdata && studentdata?.name}
//             </span>
//             <br />
//             <span>
//               <b>Contact No : </b> {studentdata && studentdata.mobilenumber}
//             </span>
//             <br />
//             <span>
//               <b>Email : </b>
//               {studentdata && studentdata?.email}
//             </span>
//             <br />

//             <span>
//               <b>Address : </b>{" "}
//               <span>
//                 {studentdata && (
//                   <span>
//                     {studentdata?.area},&nbsp;{studentdata?.native},&nbsp;
//                     {studentdata?.state}, &nbsp;{studentdata?.zipcode},&nbsp;
//                     {studentdata?.country}
//                   </span>
//                 )}
//               </span>
//             </span>
//             <br />
//             <span>
//               <b>Course : </b>
//               {studentdata?.courses}
//             </span>
//           </div>
//         </div>

//         <div className="table table-hd table-responsive pt-4  black_300">
//           <table className="table table-hd table-centered align-middle table-nowrap mb-0  black_300">
//             <thead className="">
//               <th className="fs-14  text-center">Fee Type</th>
//               <th className=" fs-14  caption text-center">Course Type</th>
//               <th className=" fs-14  text-center">HSN Type</th>
//               <th className=" fs-14   text-center">Amount</th>
//               <th className=" fs-14   text-center">Tax</th>
//               <th className=" fs-14   text-center">Tax Amount</th>
//               <th className=" fs-14  text-center">Total Amount</th>
//             </thead>

//             <tbody>
//               {name === "Admission Fee" &&
//               studentdata &&
//               studentdata?.admissionFee &&
//               studentdata?.admissionFee?.length > 0 ? (
//                 studentdata?.admissionFee?.map((student, index) => (
//                   <tr key={index+1}>
//                     <td className="border text-center black_300 border-black">
//                       <span> Admission Fee</span>
//                     </td>
//                     <td className="border text-center  black_300 border-black">
//                       <span> {studentdata.modeoftraining}</span>
//                     </td>
//                     <td className="border text-center  black_300 border-black">
//                       <span> 99843</span>
//                     </td>
//                     <td className="border text-center  black_300 border-black">
//                       <span>
//                         {" "}
//                         {Number(
//                           parseFloat(student.initialamount / 1.18).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border text-center  black_300 border-black">
//                       <span> 18%</span>
//                     </td>

//                     <td className="border text-center  black_300 border-black">
//                       <span>
//                         {" "}
//                         {Number(
//                           (
//                             parseFloat(student.initialamount).toFixed(2) -
//                             parseFloat(student.initialamount / 1.18).toFixed(2)
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border text-center black_300 border-black">
//                       <span>
//                         {Number(student.initialamount).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : name === "Admission Fee" ? (
//                 <p>No initial payment data available</p>
//               ) : null}

//               {studentdata &&
//               name === "Installment" &&
//               studentdata?.installments &&
//               studentdata?.installments.length > 0 ? (
//                 studentdata?.installments.map((student, indx) => {
//                   if (indx === parseInt(index)) {
//                     return (
//                       <tr key={indx+1}>
//                         <td className=" text-center black_300 border border-black border border-black 1">
//                           Course Fee
//                         </td>
//                         <td className=" text-center black_300 border border-black border border-black 1">
//                           {studentdata?.modeoftraining}
//                         </td>
//                         <td className="border text-center black_300 border-black">
//                           <span> 99843</span>
//                         </td>

//                         <td className=" text-center black_300 border border-black border border-black 1">
//                           {Number(
//                             parseFloat(
//                               (student.paidamount * 0.7) / 1.18
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className="border text-center black_300 border-black">
//                           <span> 18%</span>
//                         </td>

//                         <td className=" text-center  black_300 border border-black border border-black 1">
//                           {Number(
//                             (
//                               parseFloat(student.paidamount * 0.7).toFixed(2) -
//                               parseFloat(
//                                 (student.paidamount * 0.7) / 1.18
//                               ).toFixed(2)
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className=" text-center black_300 border border-black border border-black 1">
//                           {Number(
//                             parseInt(student.paidamount * 0.7)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       </tr>
//                     );
//                   }
//                   return null;
//                 })
//               ) : name === "Installment" ? (
//                 <p>No payment date available</p>
//               ) : null}

//               {studentdata &&
//               name === "Installment" &&
//               studentdata?.installments &&
//               studentdata?.installments.length > 0 ? (
//                 studentdata?.installments.map((student, indx) => {
//                   if (indx === parseInt(index)) {
//                     return (
//                       <tr key={indx+1}>
//                         <td className="border border-black black_300 border border-black 1 text-center">
//                           Material Fee
//                         </td>
//                         <td className="border border-black black_300 border border-black 1 text-center"></td>
//                         <td className="border border-black black_300 border border-black 1 text-center"></td>
//                         <td className="border border-black black_300 border border-black 1 text-center">
//                           {Number(
//                             parseInt(student.paidamount * 0.3)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                         <td className="border border-black black_300 border border-black 1 text-center"></td>
//                         <td className="border border-black black_300 border border-black 1 text-center"></td>
//                         <td className="border border-black black_300 border border-black 1 text-center">
//                           {Number(
//                             parseInt(student.paidamount * 0.3)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       </tr>
//                     );
//                   }

//                   return null; // If the condition is not met, return null
//                 })
//               ) : name === "Installment" && nametype === "admininvoice" ? (
//                 <p>No payment date available</p>
//               ) : null}

//               {name === "Admission Fee" &&
//               studentdata &&
//               studentdata?.admissionFee &&
//               studentdata?.admissionFee?.length > 0 ? (
//                 studentdata?.admissionFee?.map((student, index) => (
//                   <tr key={index+1}>
//                     <td className="border border-black black_300" colSpan="3">
//                       <span>
//                         <b>Total</b>
//                       </span>
//                     </td>

//                     <td className="border text-center black_300 border-black">
//                       <span>
//                         {" "}
//                         {Number(
//                           parseFloat(student.initialamount / 1.18).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border border-black border black_300 border-black 1 text-center"></td>
//                     <td className="border text-center black_300 border-black">
//                       <span>
//                         {" "}
//                         {Number(
//                           (
//                             parseFloat(student.initialamount).toFixed(2) -
//                             parseFloat(student.initialamount / 1.18).toFixed(2)
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>

//                     <td className="border text-center black_300 border-black border border-black 1 ">
//                       <strong>
//                         {" "}
//                         {Number(parseInt(student.initialamount)).toLocaleString(
//                           "en-IN"
//                         )}
//                       </strong>
//                     </td>
//                   </tr>
//                 ))
//               ) : name === "Admission Fee" ? (
//                 <p>No initial payment data available</p>
//               ) : null}

//               {studentdata &&
//               name === "Installment" &&
//               studentdata?.installments &&
//               studentdata?.installments.length > 0 ? (
//                 studentdata?.installments.map((student, indx) => {
//                   if (indx === parseInt(index)) {
//                     return (
//                       <tr key={indx+1}>
//                         <td
//                           className="border black_300 border-black"
//                           colSpan="3"
//                         >
//                           <span>
//                             <b>Total</b>
//                           </span>
//                         </td>
//                         <td className=" text-center black_300 border border-black ">
//                           {Number(
//                             parseFloat(
//                               (student.paidamount * 0.7) / 1.18 +
//                                 student.paidamount * 0.3
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className="border border-black black_300 text-center"></td>
//                         <td className=" text-center border black_300 border-black border">
//                           {Number(
//                             (
//                               parseFloat(student?.paidamount * 0.7).toFixed(2) -
//                               parseFloat(
//                                 (student?.paidamount * 0.7) / 1.18
//                               ).toFixed(2)
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                         <td className="border border-black border black_300 text-center">
//                           <p>
//                             {Number(
//                               parseInt(student.paidamount)
//                             ).toLocaleString("en-IN")}
//                           </p>
//                         </td>
//                       </tr>
//                     );
//                   }

//                   return null; // If the condition is not met, return null
//                 })
//               ) : name === "Installment" ? (
//                 <p>No payment date available</p>
//               ) : null}
//             </tbody>
//           </table>
//         </div>

//         <div className=" table table-hd table-responsive  table-scroll pt-4">
//           <table className="table table-hd table-hover table-centered align-middle table-nowrap mb-0">
//             <thead>
//               <tr>
//                 <th
//                   className="border border-black fs-14 text-center"
//                   rowSpan="2"
//                 >
//                   HSN/AC
//                 </th>
//                 <th
//                   className="border border-black fs-14  text-center"
//                   rowSpan={3}
//                 >
//                   Taxable Value
//                 </th>
//                 <th
//                   className="border border-black fs-14  text-center"
//                   colSpan={2}
//                 >
//                   CGST
//                 </th>

//                 <th
//                   className="border border-black fs-14  text-center"
//                   colSpan={2}
//                 >
//                   SGST
//                 </th>
//                 <th
//                   className="border border-black fs-14 text-center"
//                   rowSpan="3"
//                 >
//                   Total Tax Amount
//                 </th>
//               </tr>
//               <tr>
//                 <th className="border border-black fs-14  text-center">Rate</th>
//                 <th className="border border-black fs-14  text-center">
//                   Amount
//                 </th>
//                 <th className="border border-black fs-14  text-center">Rate</th>
//                 <th className="border border-black fs-14  text-center">
//                   Amount
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {name === "Admission Fee" &&
//               studentdata &&
//               studentdata?.admissionFee &&
//               studentdata?.admissionFee?.length > 0 ? (
//                 studentdata?.admissionFee?.map((student, index) => (
//                   <tr key={index+1}>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {studentdata.modeoftraining}
//                       </span>
//                     </td>

//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {Number(
//                           parseFloat(student.initialamount / 1.18).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}> 9%</span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {Number(
//                           (
//                             (parseFloat(student.initialamount).toFixed(2) -
//                               parseFloat(student.initialamount / 1.18).toFixed(
//                                 2
//                               )) /
//                             2
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}> 9%</span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {Number(
//                           (
//                             (parseFloat(student.initialamount).toFixed(2) -
//                               parseFloat(student.initialamount / 1.18).toFixed(
//                                 2
//                               )) /
//                             2
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {Number(
//                           (
//                             parseFloat(student.initialamount).toFixed(2) -
//                             parseFloat(student.initialamount / 1.18).toFixed(2)
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : name === "Admission Fee" ? (
//                 <p>No initial payment data available</p>
//               ) : null}
//               {studentdata &&
//               name === "Installment" &&
//               studentdata?.installments &&
//               studentdata?.installments.length > 0 ? (
//                 studentdata?.installments.map((student, indx) => {
//                   if (indx === parseInt(index)) {
//                     return (
//                       <tr key={index+1}>
//                         <td className=" text-center border border-black black_300 ">
//                           {studentdata?.modeoftraining}
//                         </td>

//                         <td className=" text-center border border-black black_300 ">
//                           {Number(
//                             parseFloat(
//                               (student.paidamount * 0.7) / 1.18
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className="border border-black text-center black_300">
//                           <span style={{ fontSize: "15px" }}> 9%</span>
//                         </td>

//                         <td className=" text-center border border-black  black_300">
//                           {Number(
//                             (
//                               (parseFloat(student.paidamount * 0.7).toFixed(2) -
//                                 parseFloat(
//                                   (student.paidamount * 0.7) / 1.18
//                                 ).toFixed(2)) /
//                               2
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className="border border-black text-center black_300">
//                           <span style={{ fontSize: "15px" }}> 9%</span>
//                         </td>

//                         <td className=" text-center border border-black black_300">
//                           {Number(
//                             (
//                               (parseFloat(student.paidamount * 0.7).toFixed(2) -
//                                 parseFloat(
//                                   (student.paidamount * 0.7) / 1.18
//                                 ).toFixed(2)) /
//                               2
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className=" text-center border border-black black_300">
//                           {Number(
//                             (
//                               parseFloat(student.paidamount * 0.7).toFixed(2) -
//                               parseFloat(
//                                 (student.paidamount * 0.7) / 1.18
//                               ).toFixed(2)
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       </tr>
//                     );
//                   }
//                   return null; // If the condition is not met, return null
//                 })
//               ) : name === "Installment" ? (
//                 <p>No payment date available</p>
//               ) : null}
//             </tbody>
//           </table>
//         </div>
//         <div className="row">
//           <div className="col-6">
//             <p>
//               <u>
//                 <b className="ps-2 black-color fs-14">Bank details:</b>
//               </u>
//             </p>
//             <div className="black_300 fs-14">
//               <b className="ps-2 black_300 fs-14">GSTIN:</b> 36AAHCK0599C1ZI
//             </div>
//             <div>
//               {" "}
//               <b className="ps-2 black_300 fs-14">Account No:</b> ...........
//             </div>
//             <div>
//               {" "}
//               <b className="ps-2 black_300 fs-14">IFSC Code:</b> ...........
//             </div>
//             <p>
//               <b className="ps-2 black_300 fs-14">Branch:</b> ..........
//             </p>
//           </div>
//           <div className="col-6 m-auto">
//             <div className="black-color fs-14">
//               {" "}
//               KAPIL KNOWLEDGE HUB PVT LMD
//             </div>
//             <div>
//               <small>(Formerly Kapil Food Park Pvt Ltd)</small>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FeeAdminInvoice;

// Original

// import React from "react";
// import { useEffect, useState } from "react";
// import "../../../../assets/css/FeeAdminInvoice.css";
// import { useReactToPrint } from "react-to-print";
// import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
// import { useParams } from "react-router-dom";
// import { MdLocalPrintshop } from "react-icons/md";
// import numberToWords from "number-to-words";
// import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";

// function FeeAdminInvoice() {
//   const { id } = useParams();
//   const [invoice, setinvoice] = useState();
//   const { index } = useParams();
//   const { name } = useParams();
//   const { nametype } = useParams();
//   const [number, setNumber] = useState();
//   const [studentdata, setstudentdata] = useState("");
//   const {
//     studentState: { singleStudentData },
//   } = useStudentsContext();
//   const componentRefff = React.useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRefff.current,
//   });

//   useEffect(() => {
//     if (name === "Installment" && studentdata?.installments) {
//       let data = studentdata?.installments;
//       let paidamount = data[index]?.paidamount;
//       setNumber(paidamount);
//     }

//     if (name === "Admission Fee" && studentdata?.initialpayment) {
//       let data = studentdata?.initialpayment;
//       let initialamount = data[index]?.initialamount;
//       setNumber(initialamount);
//     }

//     if (number) {
//       let words = numberToWords.toWords(number);
//       words = words
//         .split(" ")
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(" ");
//       setWords(words);
//     }
//   }, [studentdata]);

//   const [words, setWords] = useState("");

//   useEffect(() => {
//     let firstbranch;
//     if (studentdata?.branch) {
//       firstbranch = studentdata?.branch[0]?.toUpperCase();
//     }

//     let paiddate;
//     if (name === "Admission Fee" && studentdata?.initialpayment) {
//       let data = studentdata.initialpayment;
//       if (data && data[index]) {
//         paiddate = data[index].paiddate;
//       }
//     }

//     if (name === "Installment" && studentdata?.installments) {
//       let data = studentdata.installments;
//       if (data && data[index]) {
//         paiddate = data[index].paiddate;
//       }
//     }

//     let regnumber;

//     if (studentdata?.registrationnumber) {
//       let regnum = studentdata?.registrationnumber;
//       regnumber = regnum.substring(9);
//     }

//     if (!studentdata) {
//       setinvoice("");
//     }

//     if (name === "Admission Fee" && studentdata?.initialpayment) {
//       if (nametype === "studentinvoice") {
//         setinvoice(
//           "R-TA" +
//             firstbranch +
//             "-" +
//             paiddate[5] +
//             paiddate[6] +
//             "-" +
//             paiddate[2] +
//             paiddate[3] +
//             "/" +
//             regnumber +
//             `/${parseInt(index) + 1}`
//         );
//       }

//       if (nametype === "admininvoice") {
//         setinvoice(
//           "IN-TA" +
//             firstbranch +
//             "-" +
//             paiddate[5] +
//             paiddate[6] +
//             "-" +
//             paiddate[2] +
//             paiddate[3] +
//             "/" +
//             regnumber +
//             `/${parseInt(index) + 1}`
//         );
//       }
//     }

//     if (name === "Installment" && studentdata?.installments) {
//       if (nametype === "studentinvoice") {
//         setinvoice(
//           "R-TA" +
//             firstbranch +
//             "-" +
//             paiddate[5] +
//             paiddate[6] +
//             "-" +
//             paiddate[2] +
//             paiddate[3] +
//             "/" +
//             regnumber +
//             `/${parseInt(index) + 2}`
//         );
//       }

//       if (nametype === "admininvoice") {
//         setinvoice(
//           "IN-TA" +
//             firstbranch +
//             "-" +
//             paiddate[5] +
//             paiddate[6] +
//             "-" +
//             paiddate[2] +
//             paiddate[3] +
//             "/" +
//             regnumber +
//             `/${parseInt(index) + 2}`
//         );
//       }
//     }
//   }, [studentdata]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (id) {
//         try {
//           const { data, status } = await ERPApi.get(
//             `${import.meta.env.VITE_API_URL}/student/viewstudentdata/${id}`
//           );
//           if (status === 200) {
//             setstudentdata(data?.student[0]);
//           }
//         } catch (error) {}
//       }
//     };

//     fetchData();
//     return () => {};
//   }, [id]);

//   return (
//     <div className="container">
//       <div className="mt-3 text-end me-3 ">
//         <button onClick={handlePrint} className="btn btn_primary mb-3  end">
//           <MdLocalPrintshop /> Print
//         </button>
//       </div>
//       <div className="invoice" ref={componentRefff}>
//         <div className="invoice-border black_300 border-black d-flex justify-content-center">
//           <img
//             className=" my-3 w-25"
//             // src="https://www.admin.teksacademy.com/static/media/Teks-Logo-with-Trade.07d75f2c54a71180af08.png"
//             src="https://teksacademy.com/assets/img/logo/mainlogo.svg"
//             alt="logo"
//           />
//         </div>
//         <div className="invoice-border border-black ">
//           <h3 className="text-center my-3  black_300 fs-22 fw-500">
//             {" "}
//             Fee Invoice
//           </h3>
//         </div>

//         <div className="invoice-border border-black">
//           <div className="row no-rowmargin">
//             <div className="col-6 pt-2  black_300">
//               <b className="ps-2  black_300 fs-14 fs-14">Registration No : </b>
//               {studentdata && studentdata.registrationnumber}
//             </div>
//             <div className="col-6 invoice-sideborder border-black pt-2  black_300 fs-14 fs-14">
//               <b> Invoice NO : </b>

//               {/* <b> {invoice}</b> */}

//               {name === "Admission Fee" &&
//                 name !== "Installment" &&
//                 (studentdata &&
//                 studentdata?.initialpayment[0]?.invoice?.studentInvoiceNo ? (
//                   <b>
//                     {" "}
//                     {studentdata?.initialpayment[0]?.invoice?.studentInvoiceNo}
//                   </b>
//                 ) : (
//                   <b> {invoice}</b>
//                 ))}

//               {name !== "Admission Fee" &&
//                 name === "Installment" &&
//                 (studentdata &&
//                 studentdata?.installments[index]?.invoice?.studentInvoiceNo ? (
//                   <b>
//                     {" "}
//                     {
//                       studentdata?.installments[index]?.invoice
//                         ?.studentInvoiceNo
//                     }
//                   </b>
//                 ) : (
//                   <b> {invoice}</b>
//                 ))}

//               <p>
//                 {name === "Admission Fee" &&
//                 studentdata &&
//                 studentdata?.initialpayment &&
//                 studentdata?.initialpayment.length > 0 ? (
//                   studentdata?.initialpayment.map((student) => {
//                     let paidDate = new Date(student?.paiddate);
//                     const day = paidDate.getUTCDate();
//                     const monthIndex = paidDate.getUTCMonth();
//                     const year = paidDate.getUTCFullYear();

//                     const monthAbbreviations = [
//                       "Jan",
//                       "Feb",
//                       "Mar",
//                       "Apr",
//                       "May",
//                       "Jun",
//                       "Jul",
//                       "Aug",
//                       "Sep",
//                       "Oct",
//                       "Nov",
//                       "Dec",
//                     ];

//                     // Formatting the date
//                     paidDate = `${day < 10 ? "0" : ""}${day}-${
//                       monthAbbreviations[monthIndex]
//                     }-${year}`;
//                     return (
//                       <span key={student.id}>
//                         <b>Date:</b> {paidDate}
//                       </span>
//                     );
//                   })
//                 ) : name === "Admission Fee" ? (
//                   <p>No initial payment data available</p>
//                 ) : null}
//                 {studentdata &&
//                 name === "Installment" &&
//                 studentdata?.installments &&
//                 studentdata?.installments.length > 0 ? (
//                   studentdata?.installments.map((student, indx) => {
//                     const originalDate = new Date(student?.paiddate);
//                     const day = String(originalDate.getDate()).padStart(2, "0");
//                     const month = String(originalDate.getMonth() + 1).padStart(
//                       2,
//                       "0"
//                     ); // Month is zero-based, so we add 1.
//                     const year = originalDate.getFullYear();

//                     const formattedDate = `${day}-${month}-${year}`;

//                     if (indx === parseInt(index)) {
//                       return (
//                         <span key={student?.id}>
//                           <b>Date : </b> {formattedDate}
//                         </span>
//                       );
//                     }
//                     return null; // If the condition is not met, return null
//                   })
//                 ) : name === "Installment" ? (
//                   <p>No payment date available</p>
//                 ) : null}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="row invoice-border border-black no-margin">
//           <div className="col-6 invoice-sideborder border-black py-2">
//             <p className="">
//               <strong className="ps-2  black_300 fs-14">
//                 {" "}
//                 KAPIL KNOWLEDGE HUB PVT LTD
//               </strong>
//             </p>
//             <span className=" black_300 fs-14">
//               <b className="ps-2  black_300 fs-14 ">CIN : </b>
//               U80100TG2018PTC123853
//             </span>{" "}
//             <br />
//             <span className="   black_300 fs-14">
//               <b className="ps-2  black_300 fs-14 ">GSTIN : </b> 36AAHCK0599C1ZI{" "}
//             </span>{" "}
//             <br />
//             <span className="ps-2   fs-14  black_300">
//               <b>Branch : </b> Teks-{studentdata && studentdata?.branch}
//             </span>
//           </div>

//           <div className="col-6 invoice-sideborder border-black py-2   black_300 fs-14">
//             <p className="">BILL TO : </p>
//             <span>
//               <b>Name : </b>
//               {studentdata && studentdata?.name}
//             </span>
//             <br />
//             <span>
//               <b>Contact No : </b> {studentdata && studentdata.mobilenumber}
//             </span>
//             <br />
//             <span>
//               <b>Email : </b>
//               {studentdata && studentdata?.email}
//             </span>
//             <br />

//             <span>
//               <b>Address : </b>{" "}
//               <span>
//                 {studentdata && (
//                   <span>
//                     {studentdata?.area},&nbsp;{studentdata?.native},&nbsp;
//                     {studentdata?.state}, &nbsp;{studentdata?.zipcode},&nbsp;
//                     {studentdata?.country}
//                   </span>
//                 )}
//               </span>
//             </span>
//             <br />
//             <span>
//               <b>Course : </b>
//               {studentdata?.courses}
//             </span>
//           </div>
//         </div>

//         <div className="table table-hd table-responsive pt-4  black_300">
//           <table className="table table-hd table-centered align-middle table-nowrap mb-0  black_300">
//             <thead className="">
//               <th className="fs-14  text-center">Fee Type</th>
//               <th className=" fs-14  caption text-center">Course Type</th>
//               <th className=" fs-14  text-center">HSN Type</th>
//               <th className=" fs-14   text-center">Amount</th>
//               <th className=" fs-14   text-center">Tax</th>
//               <th className=" fs-14   text-center">Tax Amount</th>
//               <th className=" fs-14  text-center">Total Amount</th>
//             </thead>

//             <tbody>
//               {name === "Admission Fee" &&
//               studentdata &&
//               studentdata?.initialpayment &&
//               studentdata?.initialpayment.length > 0 ? (
//                 studentdata.initialpayment.map((student) => (
//                   <tr>
//                     <td className="border text-center black_300 border-black">
//                       <span> Admission Fee</span>
//                     </td>
//                     <td className="border text-center  black_300 border-black">
//                       <span> {studentdata.modeoftraining}</span>
//                     </td>
//                     <td className="border text-center  black_300 border-black">
//                       <span> 99843</span>
//                     </td>
//                     <td className="border text-center  black_300 border-black">
//                       <span>
//                         {" "}
//                         {Number(
//                           parseFloat(student.initialamount / 1.18).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border text-center  black_300 border-black">
//                       <span> 18%</span>
//                     </td>

//                     <td className="border text-center  black_300 border-black">
//                       <span>
//                         {" "}
//                         {Number(
//                           (
//                             parseFloat(student.initialamount).toFixed(2) -
//                             parseFloat(student.initialamount / 1.18).toFixed(2)
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border text-center black_300 border-black">
//                       <span>
//                         {Number(student.initialamount).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : name === "Admission Fee" ? (
//                 <p>No initial payment data available</p>
//               ) : null}

//               {studentdata &&
//               name === "Installment" &&
//               studentdata?.installments &&
//               studentdata?.installments.length > 0 ? (
//                 studentdata?.installments.map((student, indx) => {
//                   if (indx === parseInt(index)) {
//                     return (
//                       <tr>
//                         <td className=" text-center black_300 border border-black border border-black 1">
//                           Course Fee
//                         </td>
//                         <td className=" text-center black_300 border border-black border border-black 1">
//                           {studentdata?.modeoftraining}
//                         </td>
//                         <td className="border text-center black_300 border-black">
//                           <span> 99843</span>
//                         </td>

//                         <td className=" text-center black_300 border border-black border border-black 1">
//                           {Number(
//                             parseFloat(
//                               (student.paidamount * 0.7) / 1.18
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className="border text-center black_300 border-black">
//                           <span> 18%</span>
//                         </td>

//                         <td className=" text-center  black_300 border border-black border border-black 1">
//                           {Number(
//                             (
//                               parseFloat(student.paidamount * 0.7).toFixed(2) -
//                               parseFloat(
//                                 (student.paidamount * 0.7) / 1.18
//                               ).toFixed(2)
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className=" text-center black_300 border border-black border border-black 1">
//                           {Number(
//                             parseInt(student.paidamount * 0.7)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       </tr>
//                     );
//                   }
//                   return null;
//                 })
//               ) : name === "Installment" ? (
//                 <p>No payment date available</p>
//               ) : null}

//               {studentdata &&
//               name === "Installment" &&
//               studentdata?.installments &&
//               studentdata?.installments.length > 0 ? (
//                 studentdata?.installments.map((student, indx) => {
//                   if (indx === parseInt(index)) {
//                     return (
//                       <tr>
//                         <td className="border border-black black_300 border border-black 1 text-center">
//                           Material Fee
//                         </td>
//                         <td className="border border-black black_300 border border-black 1 text-center"></td>
//                         <td className="border border-black black_300 border border-black 1 text-center"></td>
//                         <td className="border border-black black_300 border border-black 1 text-center">
//                           {Number(
//                             parseInt(student.paidamount * 0.3)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                         <td className="border border-black black_300 border border-black 1 text-center"></td>
//                         <td className="border border-black black_300 border border-black 1 text-center"></td>
//                         <td className="border border-black black_300 border border-black 1 text-center">
//                           {Number(
//                             parseInt(student.paidamount * 0.3)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       </tr>
//                     );
//                   }

//                   return null; // If the condition is not met, return null
//                 })
//               ) : name === "Installment" && nametype === "admininvoice" ? (
//                 <p>No payment date available</p>
//               ) : null}

//               {name === "Admission Fee" &&
//               studentdata &&
//               studentdata.initialpayment &&
//               studentdata.initialpayment.length > 0 ? (
//                 studentdata.initialpayment.map((student) => (
//                   <tr>
//                     <td className="border border-black black_300" colspan="3">
//                       <span>
//                         <b>Total</b>
//                       </span>
//                     </td>

//                     <td className="border text-center black_300 border-black">
//                       <span>
//                         {" "}
//                         {Number(
//                           parseFloat(student.initialamount / 1.18).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border border-black border black_300 border-black 1 text-center"></td>
//                     <td className="border text-center black_300 border-black">
//                       <span>
//                         {" "}
//                         {Number(
//                           (
//                             parseFloat(student.initialamount).toFixed(2) -
//                             parseFloat(student.initialamount / 1.18).toFixed(2)
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>

//                     <td className="border text-center black_300 border-black border border-black 1 ">
//                       <strong>
//                         {" "}
//                         {Number(parseInt(student.initialamount)).toLocaleString(
//                           "en-IN"
//                         )}
//                       </strong>
//                     </td>
//                   </tr>
//                 ))
//               ) : name === "Admission Fee" ? (
//                 <p>No initial payment data available</p>
//               ) : null}

//               {studentdata &&
//               name === "Installment" &&
//               studentdata?.installments &&
//               studentdata?.installments.length > 0 ? (
//                 studentdata?.installments.map((student, indx) => {
//                   if (indx === parseInt(index)) {
//                     return (
//                       <tr>
//                         <td
//                           className="border black_300 border-black"
//                           colspan="3"
//                         >
//                           <span>
//                             <b>Total</b>
//                           </span>
//                         </td>
//                         <td className=" text-center black_300 border border-black ">
//                           {Number(
//                             parseFloat(
//                               (student.paidamount * 0.7) / 1.18 +
//                                 student.paidamount * 0.3
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className="border border-black black_300 text-center"></td>
//                         <td className=" text-center border black_300 border-black border">
//                           {Number(
//                             (
//                               parseFloat(student?.paidamount * 0.7).toFixed(2) -
//                               parseFloat(
//                                 (student?.paidamount * 0.7) / 1.18
//                               ).toFixed(2)
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                         <td className="border border-black border black_300 text-center">
//                           <p>
//                             {Number(
//                               parseInt(student.paidamount)
//                             ).toLocaleString("en-IN")}
//                           </p>
//                         </td>
//                       </tr>
//                     );
//                   }

//                   return null; // If the condition is not met, return null
//                 })
//               ) : name === "Installment" ? (
//                 <p>No payment date available</p>
//               ) : null}
//             </tbody>
//           </table>
//         </div>

//         <div className=" table table-hd table-responsive  table-scroll pt-4">
//           <table className="table table-hd table-hover table-centered align-middle table-nowrap mb-0">
//             <thead>
//               <tr>
//                 <th
//                   className="border border-black fs-14 text-center"
//                   rowspan="2"
//                 >
//                   HSN/AC
//                 </th>
//                 <th
//                   className="border border-black fs-14  text-center"
//                   rowspan={3}
//                 >
//                   Taxable Value
//                 </th>
//                 <th
//                   className="border border-black fs-14  text-center"
//                   colSpan={2}
//                 >
//                   CGST
//                 </th>

//                 <th
//                   className="border border-black fs-14  text-center"
//                   colSpan={2}
//                 >
//                   SGST
//                 </th>
//                 <th
//                   className="border border-black fs-14 text-center"
//                   rowspan="3"
//                 >
//                   Total Tax Amount
//                 </th>
//               </tr>
//               <tr>
//                 <th className="border border-black fs-14  text-center">Rate</th>
//                 <th className="border border-black fs-14  text-center">
//                   Amount
//                 </th>
//                 <th className="border border-black fs-14  text-center">Rate</th>
//                 <th className="border border-black fs-14  text-center">
//                   Amount
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {name === "Admission Fee" &&
//               studentdata &&
//               studentdata.initialpayment &&
//               studentdata.initialpayment.length > 0 ? (
//                 studentdata.initialpayment.map((student) => (
//                   <tr>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {studentdata.modeoftraining}
//                       </span>
//                     </td>

//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {Number(
//                           parseFloat(student.initialamount / 1.18).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}> 9%</span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {Number(
//                           (
//                             (parseFloat(student.initialamount).toFixed(2) -
//                               parseFloat(student.initialamount / 1.18).toFixed(
//                                 2
//                               )) /
//                             2
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}> 9%</span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {Number(
//                           (
//                             (parseFloat(student.initialamount).toFixed(2) -
//                               parseFloat(student.initialamount / 1.18).toFixed(
//                                 2
//                               )) /
//                             2
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                     <td className="border border-black text-center black_300">
//                       <span style={{ fontSize: "15px" }}>
//                         {" "}
//                         {Number(
//                           (
//                             parseFloat(student.initialamount).toFixed(2) -
//                             parseFloat(student.initialamount / 1.18).toFixed(2)
//                           ).toFixed(2)
//                         ).toLocaleString("en-IN")}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : name === "Admission Fee" ? (
//                 <p>No initial payment data available</p>
//               ) : null}
//               {studentdata &&
//               name === "Installment" &&
//               studentdata?.installments &&
//               studentdata?.installments.length > 0 ? (
//                 studentdata?.installments.map((student, indx) => {
//                   if (indx === parseInt(index)) {
//                     return (
//                       <tr>
//                         <td className=" text-center border border-black black_300 ">
//                           {studentdata?.modeoftraining}
//                         </td>

//                         <td className=" text-center border border-black black_300 ">
//                           {Number(
//                             parseFloat(
//                               (student.paidamount * 0.7) / 1.18
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className="border border-black text-center black_300">
//                           <span style={{ fontSize: "15px" }}> 9%</span>
//                         </td>

//                         <td className=" text-center border border-black  black_300">
//                           {Number(
//                             (
//                               (parseFloat(student.paidamount * 0.7).toFixed(2) -
//                                 parseFloat(
//                                   (student.paidamount * 0.7) / 1.18
//                                 ).toFixed(2)) /
//                               2
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className="border border-black text-center black_300">
//                           <span style={{ fontSize: "15px" }}> 9%</span>
//                         </td>

//                         <td className=" text-center border border-black black_300">
//                           {Number(
//                             (
//                               (parseFloat(student.paidamount * 0.7).toFixed(2) -
//                                 parseFloat(
//                                   (student.paidamount * 0.7) / 1.18
//                                 ).toFixed(2)) /
//                               2
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td className=" text-center border border-black black_300">
//                           {Number(
//                             (
//                               parseFloat(student.paidamount * 0.7).toFixed(2) -
//                               parseFloat(
//                                 (student.paidamount * 0.7) / 1.18
//                               ).toFixed(2)
//                             ).toFixed(2)
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       </tr>
//                     );
//                   }
//                   return null; // If the condition is not met, return null
//                 })
//               ) : name === "Installment" ? (
//                 <p>No payment date available</p>
//               ) : null}
//             </tbody>
//           </table>
//         </div>
//         <div className="row">
//           <div className="col-6">
//             <p>
//               <u>
//                 <b className="ps-2 black-color fs-14">Bank details:</b>
//               </u>
//             </p>
//             <div className="black_300 fs-14">
//               <b className="ps-2 black_300 fs-14">GSTIN:</b> 36AAHCK0599C1ZI
//             </div>
//             <div>
//               {" "}
//               <b className="ps-2 black_300 fs-14">Account No:</b> ...........
//             </div>
//             <div>
//               {" "}
//               <b className="ps-2 black_300 fs-14">IFSC Code:</b> ...........
//             </div>
//             <p>
//               <b className="ps-2 black_300 fs-14">Branch:</b> ..........
//             </p>
//           </div>
//           <div className="col-6 m-auto">
//             <div className="black-color fs-14">
//               {" "}
//               KAPIL KNOWLEDGE HUB PVT LMD
//             </div>
//             <div>
//               <small>(Formerly Kapil Food Park Pvt Ltd)</small>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FeeAdminInvoice;
