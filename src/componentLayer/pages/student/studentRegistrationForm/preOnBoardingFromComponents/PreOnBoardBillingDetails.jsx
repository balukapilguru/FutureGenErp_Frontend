import React, { useState, useEffect } from "react";
 
const PreOnBoardBillingDetails = ({ steps, activeStep, onNavigate }) => {
    const [billingData, setBillingData] = useState(null);
 
    useEffect(() => {
        const storedBilling = localStorage.getItem("PreOnBoardBillingSummary");
        if (storedBilling) {
            setBillingData(JSON.parse(storedBilling));
        }
    }, []);
 
    if (!billingData) return <div className="text-center p-5">Loading Billing Summary...</div>;
 
    return (
        <div className="billing-section">
            <h4 className="mb-4 main_color">Billing Summary</h4>
           
            <div className="row">
                {/* Table 1: Totals Overview */}
                <div className="col-xl-12 mb-4">
                    <div className="table-responsive shadow-sm">
                        <table className="table table-bordered table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium text-dark">Gross Total</th>
                                    <th className="fw-medium text-dark">Total Discount</th>
                                    <th className="fw-medium text-dark">Net Payable Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{Number(billingData.grosstotal)?.toLocaleString("en-IN")}</td>
                                    <td className="text-danger">{Number(billingData.totaldiscount)?.toLocaleString("en-IN")}</td>
                                    <td className=" text-success">{Number(billingData.finaltotal)?.toLocaleString("en-IN")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
 
                {/* Table 2: Detailed Tax Breakdown */}
                <div className="col-xl-12">
                    <div className="table-responsive shadow-sm">
                        <table className="table table-hover align-middle table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-medium text-dark text-nowrap">Fee Type</th>
                                    <th className="fw-medium text-dark text-nowrap">Fee (Excl. of GST)</th>
                                    <th className="fw-medium text-dark text-nowrap">Tax (18%)</th>
                                    <th className="fw-medium text-dark text-nowrap">Fee (Incl. of GST)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingData.feedetailsbilling?.filter(item => item.feetype !== "Material Fee")?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="fw-medium">{item.feetype}</td>
                                        <td>{Number(item.feewithouttax)?.toLocaleString("en-IN")}</td>
                                        <td className="text-primary">{Number(item.feetax)?.toLocaleString("en-IN")}</td>
                                        <td className="fw-medium">{Number(item.feewithtax)?.toLocaleString("en-IN")}</td>
                                    </tr>
                                ))}
 
                                {/* Sub-Total Row */}
                                <tr className="table-light ">
                                    <td>Sub Total</td>
                                    <td>{Number(billingData.totalfeewithouttax)?.toLocaleString("en-IN")}</td>
                                    <td className="text-primary">{Number(billingData.totaltax)?.toLocaleString("en-IN")}</td>
                                    <td className="fw-medium">{Number(billingData.grandtotal)?.toLocaleString("en-IN")}</td>
                                </tr>
 
                                {/* Material Fee Row */}
                                {/* <tr>
                                    <td colSpan={2} />
                                    <td className="fw-medium">Material Fee (Non-Taxable)</td>
                                    <td className="fw-bold">{billingData.materialfee}</td>
                                </tr> */}
 
                                {/* Final Total Row */}
                                <tr className="bg-light fw-bold">
                                    <td colSpan={2} />
                                    <td className="fw-medium">Material Fee</td>
                                    <td className="fw-medium">
                                        {Number(
                                            billingData.feedetailsbilling?.find(
                                                item => item.feetype === "Material Fee"
                                            )?.feewithtax || 0
                                        ).toLocaleString("en-IN")}
                                    </td>
                                </tr>
                                <tr className="bg-secondary text-white fw-bold">
                                    <td colSpan={2} />
                                    <td className=" fw-medium text-white">Grand Total</td>
                                    <td className="fw-medium text-white">{Number(billingData.finaltotal)?.toLocaleString("en-IN")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
 
            {/* Navigation Controls */}
            <div className="mt-5 d-flex justify-content-between">
                <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => onNavigate(activeStep - 1)}
                >
                    Back to Fees
                </button>
                <button
                    type="button"
                    className="btn bg_primary px-4"
                    onClick={() => onNavigate(activeStep + 1)}
                >
                    Continue to Payment Details
                </button>
            </div>
        </div>
    );
};
 
export default PreOnBoardBillingDetails;
 