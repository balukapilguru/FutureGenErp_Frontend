import React, { useState, useEffect } from "react";
import "../../../../assets/css/OrganizationProfile.css";
import { FaCamera } from "react-icons/fa";
import { TiEdit } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { CiGlobe } from "react-icons/ci";
import { FaDribbble } from "react-icons/fa6";
import { ImPinterest2 } from "react-icons/im";
import BackButton from "../../../components/backbutton/BackButton";
import { toast } from "react-toastify";

const defaultOrgDetails = {
  organization_name: "Teks Academy",
  institute_type: "Computer/Dance/Music Training Institute",
  office_address: "501, 5th floor, green house building, Ameerpet",
  whatsapp_number: "9492910454",
  landline_number: "18001204748",
  email: "info@futuregentechnologies.com",
  branding_type: "subdomain",
  domain_name: "https://futuregentechnologies.com",
  account_validity: "N/A",
  lock_timing: "",
  enable_reporting: "",
};

function OrganizationProfile() {
  const [orgDetails, setOrgDetails] = useState(() => {
    const saved = localStorage.getItem("organizationDetails");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultOrgDetails, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return defaultOrgDetails;
  });

  const [formData, setFormData] = useState(orgDetails);

  useEffect(() => {
    setFormData(orgDetails);
  }, [orgDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.organization_name || formData.organization_name.trim() === "") {
      toast.error("Organization Name is required");
      return;
    }

    setOrgDetails(formData);
    localStorage.setItem("organizationDetails", JSON.stringify(formData));
    toast.success("Organization details updated successfully!");

    // Switch to Organization Details tab
    const detailsTab = document.getElementById("pills-personal-detail-tab");
    if (detailsTab) {
      detailsTab.click();
    }
  };

  return (
    <div>
      <BackButton heading="Organization Profile" content="Back" />
      <div className="">
        <div className="profile-wid-bg "></div>
        <div className="profile-img-card">
          <div className="container-fluid">
            <div className="row p-2">
              <div className="col-lg-3 col-xl-3 col-md-12  col-sm-3 p-0">
                <div className="text-center">
                  <div className="card h-100">
                    <div className="rounded-top">
                      <div className="my-5">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1qWOPjJWxA3OsJ_tsPTTJh9uQH-7tsMg9o-ZkH4IYM4TZ5LYsPZP2SahhGEKR57pn4Wc&usqp=CAU"
                          alt="user-img"
                          className="w-50 h-50 rounded-circle thumbnail"
                        />
                      </div>
                      <div className="ps-1">
                        <h3 className="black_300 mb-5">
                          {orgDetails.organization_name || "Fullname"}
                        </h3>
                        <p className="text-mute fs-lg fw-500 mb-2">Profile</p>
                        <p className="text-mute fs-lg fw-500 mb-4">
                          {orgDetails.office_address
                            ? orgDetails.office_address.split(",").pop().trim()
                            : "Branch"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-md-12 col-xl-9  col-sm-3">
                <div className="card">
                  <div className="card-header">
                    <ul
                      className="nav mb-3 nav-tabs"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li
                        className="nav-item fs-13 fw_400  button-bg"
                        role="presentation"
                      >
                        <button
                          className=" nav-link active  button-bg black_300 "
                          id="pills-personal-detail-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-detail"
                          type="button"
                          role="tab"
                          aria-controls="pills-detail"
                          aria-selected="true"
                        >
                          Organization Details
                        </button>
                      </li>
                      <li
                        className="nav-item fs-13 fw_400  button-bg"
                        role="presentation"
                      >
                        <button
                          className="nav-link fs-13  button-bg black_300"
                          id="pills-organization-logo-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-logo"
                          type="button"
                          role="tab"
                          aria-controls="pills-logo"
                          aria-selected="false"
                        >
                          Organization Logo
                        </button>
                      </li>
                      <li
                        className="nav-item fs-13 fw_400  button-bg"
                        role="presentation"
                      >
                        <button
                          className="nav-link fs-13  button-bg black_300"
                          id="pills-edit-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-edit"
                          type="button"
                          role="tab"
                          aria-controls="pills-edit"
                          aria-selected="false"
                        >
                          Edit
                        </button>
                      </li>
                      <li
                        className="nav-item fs-13 fw_400  button-bg"
                        role="presentation"
                      >
                        <button
                          className="nav-link fs-13  button-bg black_300"
                          id="pills-subscription-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-subscription"
                          type="button"
                          role="tab"
                          aria-controls="pills-subscription"
                          aria-selected="false"
                        >
                          Subscription
                        </button>
                      </li>
                      <li
                        className="nav-item fs-13 fw_400  button-bg"
                        role="presentation"
                      >
                        <button
                          className="nav-link fs-13  button-bg black_300"
                          id="pills-payment-history-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-payment-history"
                          type="button"
                          role="tab"
                          aria-controls="pills-payment-history"
                          aria-selected="false"
                        >
                          Payment History{" "}
                        </button>
                      </li>
                      <li
                        className="nav-item fs-13 fw_400  button-bg"
                        role="presentation"
                      >
                        <button
                          className="nav-link fs-13  button-bg black_300"
                          id="pills-login-history-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-login-history"
                          type="button"
                          role="tab"
                          aria-controls="pills-login-history"
                          aria-selected="false"
                        >
                          {" "}
                          Login History
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="tab-content" id="pills-tabContent">
                    {/* Organization Details Tab */}
                    <div
                      className="tab-pane fade show active"
                      id="pills-detail"
                      role="tabpanel"
                      aria-labelledby="pills-personal-detail-tab"
                    >
                      <div className="card-body">
                        <div className="live-prieview">
                          <div className="row ">
                            <div className="col-lg-12 col-xl-12 col-md-12 w-100">
                              <div className="table table-responsive table-scroll   table-bordered ">
                                <table className="table align-middle table-nowrap  mb-0">
                                  <tbody>
                                    <tr className=" organization-table-border">
                                      <th
                                        scope="col"
                                        className="fs-13 lh-500 black_300 fw-500 organization-table-border p-3 "
                                      >
                                        Organization&nbsp;Name
                                      </th>
                                      <td className="fs-13 black_300   organization-table-border ">
                                        {orgDetails.organization_name || "N/A"}
                                      </td>
                                    </tr>

                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-500 black_300 fw-500  organization-table-border p-3  "
                                      >
                                        Institute Type
                                      </th>
                                      <td className="fs-13 black_300  organization-table-border ">
                                        {orgDetails.institute_type || "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-500 black_300 fw-500  organization-table-border p-3  "
                                      >
                                        Office Address
                                      </th>
                                      <td className="fs-13 black_300  organization-table-border ">
                                        {orgDetails.office_address || "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-500 black_300 fw-500  organization-table-border p-3  "
                                      >
                                        Whatsapp&nbsp;Number
                                      </th>
                                      <td className="fs-13 black_300  organization-table-border ">
                                        {orgDetails.whatsapp_number || "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-500 black_300 fw-500  organization-table-border p-3  "
                                      >
                                        Office&nbsp;Landline&nbsp;Number
                                      </th>
                                      <td className="fs-13 black_300  organization-table-border ">
                                        {" "}
                                        {orgDetails.landline_number || "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-500 black_300 fw-500  organization-table-border p-3  "
                                      >
                                        Office Email Id
                                      </th>
                                      <td className="fs-13 black_300  organization-table-border ">
                                        {" "}
                                        {orgDetails.email || "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-500 black_300 fw-500  organization-table-border p-3  "
                                      >
                                        Own Domain/Sub Domain
                                      </th>
                                      <td className="fs-13 black_300  organization-table-border ">
                                        {" "}
                                        {orgDetails.domain_name || "N/A"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-500 black_300 fw-500  organization-table-border p-3  "
                                      >
                                        Account Validity
                                      </th>
                                      <td className="fs-13 black_300  organization-table-border ">
                                        {" "}
                                        {orgDetails.account_validity || "N/A"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logo Tab */}
                    <div
                      className="tab-pane fade"
                      id="pills-logo"
                      role="tabpanel"
                      aria-labelledby="pills-organization-logo-tab"
                    >
                      <div className=" p-1">
                        <div className="card-header ">
                          <h5 className="black_300">Organization Logo</h5>
                        </div>
                        <div
                          className="card-body  d-flex justify-content-center p-1 align-items-center"
                          style={{ height: "300px" }}
                        >
                          <div className="live-prieview">
                            <div className="row align-items-center">
                              <div className="col-12 ">
                                <div className="input-group mb-3">
                                  <input
                                    type="file"
                                    className="form-control"
                                    id="inputGroupFile03"
                                    aria-describedby="inputGroupFileAddon03"
                                    aria-label="Upload"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Edit Tab */}
                    <div
                      className="tab-pane fade"
                      id="pills-edit"
                      role="tabpanel"
                      aria-labelledby="pills-edit-tab"
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="card p-1">
                          <div className="card-header ">
                            <h5 className="black_300">
                              Organization&nbsp;Details
                            </h5>
                          </div>
                          <div className="card-body">
                            <div className="form-group row black_300  p-2">
                              <label className="col-sm-4 col-form-label fs-13">
                                Organization Name
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-sm-7 text-center">
                                <input
                                  type="text"
                                  name="organization_name"
                                  value={formData.organization_name || ""}
                                  onChange={handleChange}
                                  required
                                  className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                />
                              </div>
                            </div>
                            <div className="form-group row black_300 p-2 ">
                              <label
                                className="col-sm-4 col-form-label fs-13"
                                style={{ padding: "3px 0px 0px 45px" }}
                              >
                                Institute Type
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-sm-7 text-center">
                                <input
                                  type="text"
                                  name="institute_type"
                                  value={formData.institute_type || ""}
                                  onChange={handleChange}
                                  className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                  style={{ padding: "5px 0px 5px 10px" }}
                                />
                              </div>
                            </div>
                            <div className="form-group row black_300 p-2">
                              <label
                                className="col-sm-4 col-form-label fs-13"
                                style={{ padding: "3px 0px 0px 45px" }}
                              >
                                Office&nbsp;Address
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-sm-7 text-center">
                                <input
                                  type="text"
                                  name="office_address"
                                  value={formData.office_address || ""}
                                  onChange={handleChange}
                                  className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                  style={{ padding: "5px 0px 5px 10px" }}
                                />
                              </div>
                            </div>
                            <div className="form-group row black_300 p-2">
                              <label
                                className="col-sm-4 col-form-label fs-13"
                                style={{ padding: "3px 0px 0px 45px" }}
                              >
                                Whatsapp&nbsp;number
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-sm-7 text-center">
                                <input
                                  type="text"
                                  name="whatsapp_number"
                                  value={formData.whatsapp_number || ""}
                                  onChange={handleChange}
                                  className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                  style={{ padding: "5px 0px 5px 10px" }}
                                />
                              </div>
                            </div>
                            <div className="form-group row  black_300 p-2">
                              <label
                                className="col-sm-4 col-form-label fs-13"
                                style={{ padding: "3px 0px 0px 45px" }}
                              >
                                Office&nbsp;LandLine&nbsp;Number
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-sm-7 text-center">
                                <input
                                  type="text"
                                  name="landline_number"
                                  value={formData.landline_number || ""}
                                  onChange={handleChange}
                                  className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                  style={{ padding: "5px 0px 5px 10px" }}
                                />
                              </div>
                            </div>
                            <div className="form-group row  black_300 p-2">
                              <label
                                className="col-sm-4 col-form-label fs-13"
                                style={{ padding: "3px 0px 0px 45px" }}
                              >
                                Office Email id
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-sm-7 text-center">
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email || ""}
                                  onChange={handleChange}
                                  className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                  style={{ padding: "5px 0px 5px 10px" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card p-1">
                          <div className="card-header black_300">
                            <h5 className="black_300">Organization Setting</h5>
                          </div>
                          <div className="card-body">
                            <div className="row p-2 black_300">
                              <div className="input-group ">
                                <label
                                  className="col-sm-4 col-form-label fs-13"
                                  style={{ padding: "5px 0px 0px 33px" }}
                                >
                                  Select Branding Type
                                </label>
                                <div className="col-sm-7 text-center fs-13">
                                  <select
                                    className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                    id="inputGroupSelect01"
                                    name="branding_type"
                                    value={formData.branding_type || "subdomain"}
                                    onChange={handleChange}
                                    style={{
                                      padding: "7px 3px",
                                    }}
                                  >
                                    <option value="subdomain">
                                      Sub Domain
                                    </option>
                                    <option value="owndomain">
                                      Own Domain
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row p-2 black_300 ">
                              <label
                                className="col-sm-4 col-form-label fs-13"
                                style={{ padding: "3px 0px 0px 45px" }}
                              >
                                Sub Domain/&nbsp;Own&nbsp;Domain
                              </label>
                              <div className="col-sm-7 text-center">
                                <input
                                  type="text"
                                  name="domain_name"
                                  value={formData.domain_name || ""}
                                  onChange={handleChange}
                                  className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                  style={{ padding: "5px 0px 5px 10px" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="form-group row p-2 black_300">
                            <label
                              className="col-sm-4 col-form-label fs-13"
                              style={{ padding: "3px 0px 0px 45px" }}
                            >
                              Inactive&nbsp;Session&nbsp;Lock&nbsp;Timing(in
                              minutes)
                            </label>
                            <div className="col-sm-7 text-center">
                              <input
                                type="text"
                                name="lock_timing"
                                value={formData.lock_timing || ""}
                                onChange={handleChange}
                                className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                style={{ padding: "5px 0px 5px 10px" }}
                              />
                            </div>
                          </div>
                          <div className="form-group row p-2 black_300">
                            <label
                              className="col-sm-4 col-form-label fs-13"
                              style={{ padding: "3px 0px 0px 45px" }}
                            >
                              Enable&nbsp;Reporting&nbsp;(Through Whatsapp)
                            </label>
                            <div className="col-sm-7 text-center">
                              <input
                                type="text"
                                name="enable_reporting"
                                value={formData.enable_reporting || ""}
                                onChange={handleChange}
                                className="w-75 form-control fs-s bg-form text_color input_bg_color"
                                style={{ padding: "5px 0px 5px 10px" }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 p-4">
                          <div className="text-end">
                            <button
                              type="submit"
                              className="btn btn_primary form-fs-s fw-medium"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Subscription Tab */}
                    <div
                      className="tab-pane fade"
                      id="pills-subscription"
                      role="tabpanel"
                      aria-labelledby="pills-subscription-tab"
                    >
                      <div className="row">
                        <div className="col-xl-12">
                          <div className=" border-0">
                            <div className="card-header">
                              <div className="row justify-content-between">
                                <div className="col-sm-4">
                                  <div className="search-box">
                                    <input
                                      type="text"
                                      className="form-control search"
                                      placeholder="Search for..."
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-6">
                                  <div className="d-flex justify-content-end">
                                    <div className="fs-13 me-3 mt-2">10/40</div>
                                    <div className="me-2">
                                      <select
                                        className="form-select form-control me-3"
                                        aria-label="Default select example"
                                        placeholder="Branch*"
                                        name="branch"
                                        id="branch"
                                        required
                                      >
                                        <option value="1">10</option>
                                        <option value="2">50</option>
                                        <option value="3">100</option>
                                        <option value="4">150</option>
                                        <option value="5">200</option>
                                        <option value="6">250</option>
                                        <option value="7">500</option>
                                        <option value="8">1000</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="card-body">
                              <div className="table-responsive table-scroll">
                                <table className="table table-centered table-hover align-middle table-nowrap equal-cell-table">
                                  <thead>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600 black_300 "
                                      >
                                        Subscription Scheme Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        Valid From
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        Valid Till
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        Amount
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                        Teks
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        21-03-2021
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        21-03-2021
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        211
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment History Tab */}
                    <div
                      className="tab-pane fade"
                      id="pills-payment-history"
                      role="tabpanel"
                      aria-labelledby="pills-payment-history-tab"
                    >
                      <div className="row">
                        <div className="col-xl-12 ">
                          <div className=" border-0">
                            <div className="card-header">
                              <div className="row justify-content-between">
                                <div className="col-sm-4">
                                  <div className="search-box">
                                    <input
                                      type="text"
                                      className="form-control search"
                                      placeholder="Search for..."
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-6">
                                  <div className="d-flex justify-content-end">
                                    <div className="fs-13 me-3 mt-2">10/40</div>
                                    <div className="me-2">
                                      <select
                                        className="form-select form-control me-3"
                                        aria-label="Default select example"
                                        placeholder="Branch*"
                                        name="branch"
                                        id="branch"
                                        required
                                      >
                                        <option value="1">10</option>
                                        <option value="2">50</option>
                                        <option value="3">100</option>
                                        <option value="4">150</option>
                                        <option value="5">200</option>
                                        <option value="6">250</option>
                                        <option value="7">500</option>
                                        <option value="8">1000</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="table-responsive table-scroll  border-0">
                                <table className="table table-centered table-hover align-middle table-nowrap equal-cell-table">
                                  <thead>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600 black_300 "
                                      >
                                        Order Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        Payment ID
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        Amount(Including Tax)
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        Transction Status
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                        Teks
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        21-03-2021
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        21-03-2021
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        211
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Login History Tab */}
                    <div
                      className="tab-pane fade"
                      id="pills-login-history"
                      role="tabpanel"
                      aria-labelledby="pills-login-history-tab"
                    >
                      <div className="row">
                        <div className="col-xl-12">
                          <div className=" border-0">
                            <div className="card-header">
                              <div className="row justify-content-between">
                                <div className="col-sm-4">
                                  <div className="search-box">
                                    <input
                                      type="text"
                                      className="form-control search"
                                      placeholder="Search for..."
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-6">
                                  <div className="d-flex justify-content-end">
                                    <div className="fs-13 me-3 mt-2">10/40</div>
                                    <div className="me-2">
                                      <select
                                        className="form-select form-control me-3"
                                        aria-label="Default select example"
                                        placeholder="Branch*"
                                        name="branch"
                                        id="branch"
                                        required
                                      >
                                        <option value="1">10</option>
                                        <option value="2">50</option>
                                        <option value="3">100</option>
                                        <option value="4">150</option>
                                        <option value="5">200</option>
                                        <option value="6">250</option>
                                        <option value="7">500</option>
                                        <option value="8">1000</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="table-responsive table-scroll  border-0">
                                <table className="table table-centered table-hover align-middle table-nowrap equal-cell-table">
                                  <thead>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600 black_300 "
                                      >
                                        Login Time
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        IP Address
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        Browser
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        Employee Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs black_300 fw-600  "
                                      >
                                        Branch
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                        Teks
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        21-03-2021
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        21-03-2021
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        211
                                      </td>
                                      <td className="fs-13 black_300  lh-xs bg_light">
                                        211
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
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
        </div>
      </div>
    </div>
  );
}

export default OrganizationProfile;
