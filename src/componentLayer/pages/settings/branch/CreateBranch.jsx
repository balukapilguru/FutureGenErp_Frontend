import { useEffect, useState } from "react";
import BackButton from "../../../components/backbutton/BackButton";
import Button from "../../../components/button/Button";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from "react-router-dom";
import { useTheme } from "../../../../dataLayer/context/themeContext/ThemeContext";
import { IoMdArrowBack, IoMdArrowForward, IoMdCheckmark } from "react-icons/io";

// import DefaultBG from "../../../../assets/images/student_idCard_images/DefaultimgBG.png";
import DefaultBG from "../../../../assets/images/student_idCard_images/DefaultimgBG.png";
import { IoInformationCircleOutline } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import Select from "react-select";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import fgLogo from "../../../../assets/images/FG-LOGO.png";

const CreateBrnach = () => {
const {id} = useParams()
  const { theme } = useTheme();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const { singlebranchData, options } = useLoaderData();
  const [activeTab, setActiveTab] = useState(1);
  const [branchId, setBranchId] = useState(null);
  // const [previewBranchLogo, setPreviewBranchLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [BranchFrom, setBranchFrom] = useState({
    branch_name: "",
    logoName: "",
    GST_NO: "",
    address_line1: "",
    address_line2: "",
    pincode: "",
    city: "",
    state: "",
    description: "",
    banks: ""
  });
  const [bankOptions, setBankOptions] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  useEffect(() => {
    setBankOptions(options)
  }, [options])

  const handleBankChange = (selectedOptions) => {
    const selectedBankIds = selectedOptions ? selectedOptions.map(option => Number(option.value)) : [];
    setSelectedBanks(selectedOptions);
    setBranchFrom((prevForm) => ({
      ...prevForm,
      banks: [...selectedBankIds],
    }));
  };

  useEffect(() => {
    if (singlebranchData) {
      setBranchFrom((prev) => ({
        ...prev,
        branch_name: singlebranchData?.branch_name,
        logoName: singlebranchData?.logoName,
        GST_NO: singlebranchData?.GST_NO,
        address_line1: singlebranchData?.address_line1,
        address_line2: singlebranchData?.address_line2,
        pincode: singlebranchData?.pincode,
        city: singlebranchData?.city,
        state: singlebranchData?.state,
        description: singlebranchData?.description,
        banks: singlebranchData?.branchez?.map((bank) => bank.id),
      }));
      setBranchId(singlebranchData?.id)

    }
  }, [singlebranchData]);



  const handleNext = () => {
    if (!BranchFrom.branch_name || BranchFrom.branch_name.toString()?.trim() == "") {
      setErrors((prev) => ({
        ...prev,
        branch_name: "Branch name required",
      }));
      return;
    } else if (BranchFrom.branch_name?.trim().replace(/\s/g, "").length <= 2) {
      setErrors((prev) => ({
        ...prev,
        branch_name: "Enter minimum 3 characters",
      }));
      return;
    }
    // file

    if (!branchId) {
      if (!BranchFrom?.logoName) {
        setErrors((prev) => ({
          ...prev,
          logoName: "Branch Logo required",
        }));
        return;
      }
    }
    // GST_NO
    if (!BranchFrom.GST_NO || BranchFrom.GST_NO?.trim() == "") {
      setErrors((prev) => ({
        ...prev,
        GST_NO: "GST Number required",
      }));
      return;
    } else if (BranchFrom.GST_NO?.trim().replace(/\s/g, "").length <= 2) {
      setErrors((prev) => ({
        ...prev,
        GST_NO: "Enter minimum 3 characters",
      }));
      return;
    }
    // address_line1
    if (!BranchFrom.address_line1 || BranchFrom.address_line1?.trim() == "") {
      setErrors((prev) => ({
        ...prev,
        address_line1: "Address Line-1 required",
      }));
      return;
    } else if (BranchFrom.address_line1?.trim().replace(/\s/g, "").length <= 2) {
      setErrors((prev) => ({
        ...prev,
        address_line1: "Enter minimum 3 characters",
      }));
      return;
    }

    // address_line2
    if (!BranchFrom.address_line2 || BranchFrom.address_line2?.trim() == "") {
      setErrors((prev) => ({
        ...prev,
        address_line2: "Address Line-2 required",
      }));
      return;
    } else if (BranchFrom.address_line2?.trim().replace(/\s/g, "").length <= 2) {
      setErrors((prev) => ({
        ...prev,
        address_line2: "Enter minimum 3 characters",
      }));
      return;
    }

    // pincode

    const regexPincode = /^[1-9][0-9]{2}\s?[0-9]{3}$/;
    const pincodeString = BranchFrom.pincode
      ? BranchFrom.pincode.toString()
      : "";

    if (!pincodeString?.trim()) {
      setErrors((prev) => ({
        ...prev,
        pincode: "Pincode is required",
      }));
      return;
    } else if (!regexPincode.test(pincodeString?.trim())) {
      setErrors((prev) => ({
        ...prev,
        pincode: "Enter a valid Pincode",
      }));
      return;
    }

    // city

    if (!BranchFrom.city || BranchFrom.city?.trim() == "") {
      setErrors((prev) => ({
        ...prev,
        city: "City is  required",
      }));
      return;
    } else if (BranchFrom.city?.trim().replace(/\s/g, "").length <= 2) {
      setErrors((prev) => ({
        ...prev,
        city: "Enter minimum 3 characters",
      }));
      return;
    }

    // state

    if (!BranchFrom.state || BranchFrom.state?.trim() == "") {
      setErrors((prev) => ({
        ...prev,
        state: "State is  required",
      }));
      return;
    } else if (BranchFrom.state?.trim().replace(/\s/g, "").length <= 2) {
      setErrors((prev) => ({
        ...prev,
        state: "Enter minimum 3 characters",
      }));
      return;
    }

    // description

    if (!BranchFrom.description || BranchFrom.description?.trim() == "") {
      setErrors((prev) => ({
        ...prev,
        description: "Description is  required",
      }));
      return;
    } else if (BranchFrom.description?.trim().replace(/\s/g, "").length <= 2) {
      setErrors((prev) => ({
        ...prev,
        description: "Enter minimum 3 characters",
      }));
      return;
    }
    //banks
    if (BranchFrom.banks.length <= 0) {
      setErrors((prev) => ({
        ...prev,
        banks: "banks is  required",
      }));
      return;
    }

    setActiveTab((prevActiveTab) => prevActiveTab + 1);
  }

  const handlePrev = () => {
    setActiveTab((prevActiveTab) => prevActiveTab - 1);
  };

  const handleBranchDetails = async () => {
    const data = new FormData();
    Object.keys(BranchFrom).forEach((key) => {
      data.append(key, BranchFrom[key]);
    });
    const formData = new FormData();

    // Append other BranchFrom fields to formData
    formData.append('branch_name', BranchFrom.branch_name);
    formData.append('logoName', BranchFrom.logoName); 
    formData.append('GST_NO', BranchFrom.GST_NO);
    formData.append('address_line1', BranchFrom.address_line1);
    formData.append('address_line2', BranchFrom.address_line2);
    formData.append('pincode', BranchFrom.pincode);
    formData.append('city', BranchFrom.city);
    formData.append('state', BranchFrom.state);
    formData.append('description', BranchFrom.description);
    formData.append('banks', JSON.stringify(BranchFrom.banks));
    const MethodType = branchId ? "PUT" : "POST"

    try {
      await fetcher?.submit(formData, {
        method: MethodType,
        encType: "multipart/form-data",
      });

    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "pincode" && value.length > 6) {
      return;
    }
    else {
      setBranchFrom((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 2 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!file) {
      setErrors((prev) => ({
        ...prev,
        logoName: "Please select an image file",
      }));
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        logoName: "Invalid file type. Only JPEG, PNG, or GIF are allowed",
      }));
      return;
    }
    if (file.size > maxFileSize) {
      setErrors((prev) => ({
        ...prev,
        logoName: "File size exceeds 2MB limit",
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, logoName: null }));
    setBranchFrom((prev) => ({ ...prev, logoName: file }));

    // Generate preview
    // const reader = new FileReader();
    // reader.onload = () => {
    //   setPreviewBranchLogo(reader.result); // Set the preview state to the file's data URL
    // };
    // reader.readAsDataURL(file);


  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = BankDetailsState;
    try {
      await fetcher?.submit(data, {
        method: "PATCH",
        encType: "application/json",
      });
    } catch (error) {
      console.error(error);
    }
  };


  
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {



      if (
        (fetcher.data?.status === 201 || fetcher.data?.status === 200) &&
        (fetcher.data?.type === "BRANCH_CREATION" ||
          fetcher.data?.type === "BRANCH_UPDATE")
      ) {

        navigate("/settings/branch")
      }

      if (
        fetcher.data?.status === 201 &&
        fetcher.data?.type === "BANK_DETAILS"
      ) {
        navigate("/settings/branch")
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div>
      {/* tabs code start here */}
      <BackButton heading = {branchId ? "Update Branch" : "Create Branch"} content="Back" />
      <div className="container-fluid">
        <div className="registration_form_section">
          <div className="top">
            <div className="registration_form_tabs row">
              <div className="button_grp col-lg-12 p-0">
                <button
                  type="button"
                  className={
                    activeTab === 1
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100 "
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn"
                  }
                  style={{ cursor: "auto" }}
                >
                  Branch Details
                </button>
                <button
                  type="button"
                  className={
                    activeTab === 2
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                  style={{ cursor: "auto" }}
                >
                  Preview
                </button>
              </div>
              <div className="bottom mt-3">
                <form className="" onSubmit={handleSubmit}>
                  {activeTab === 1 && (
                    <>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="branch_name"
                              className="form-label fs-s fw-medium black_300"
                            >
                              Branch Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={
                                errors && errors.branch_name
                                  ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                  : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                              }
                              placeholder="Enter Full Name"
                              id="branch_name"
                              name="branch_name"
                              onChange={handleChange}
                              disabled={id}
                              value={BranchFrom?.branch_name}
                            />

                            <div style={{ height: "8px" }}>
                              {errors && errors.branch_name && (
                                <p className="text-danger m-0 fs-xs">
                                  {errors.branch_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* branch logo */}
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="logoName"
                              className="form-label fs-s fw-medium black_300"
                            >
                              Branch Logo<span className="text-danger">*</span> <BsInfoCircle title="Give Image size width-192px height-40px" />
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              className={
                                errors && errors.logoName
                                  ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                  : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                              }
                              placeholder="Enter the Logo"
                              id="logoName"
                              name="logoName"
                              onChange={handleFileChange}
                            />

                            <div style={{ height: "8px" }}>
                              {errors && errors.logoName && (
                                <p className="text-danger m-0 fs-xs">
                                  {errors.logoName}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* gst no */}
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="GST_NO"
                              className="form-label fs-s fw-medium black_300"
                            >
                              GST-NO<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={
                                errors && errors.GST_NO
                                  ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                  : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                              }
                              placeholder="Enter the GST Number"
                              id="GST_NO"
                              name="GST_NO"
                              value={BranchFrom?.GST_NO}
                              onChange={handleChange}
                            />

                            <div style={{ height: "8px" }}>
                              {errors && errors.GST_NO && (
                                <p className="text-danger m-0 fs-xs">
                                  {errors.GST_NO}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        {/* address line -1 */}

                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="address_line1"
                              className="form-label fs-s fw-medium black_300"
                            >
                              Address Line -1
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={
                                errors && errors.address_line1
                                  ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                  : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                              }
                              placeholder="Enter the Address Line-1"
                              id="address_line1"
                              name="address_line1"
                              value={BranchFrom?.address_line1}
                              onChange={handleChange}
                            />

                            <div style={{ height: "8px" }}>
                              {errors && errors.address_line1 && (
                                <p className="text-danger m-0 fs-xs">
                                  {errors.address_line1}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* adress line-2 */}
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="address_line2"
                              className="form-label fs-s fw-medium black_300"
                            >
                              Address Line - 2
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={
                                errors && errors.address_line2
                                  ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                  : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                              }
                              placeholder="Enter the Address Line -2"
                              id="address_line2"
                              name="address_line2"
                              value={BranchFrom?.address_line2}
                              onChange={handleChange}
                            />

                            <div style={{ height: "8px" }}>
                              {errors && errors.address_line2 && (
                                <p className="text-danger m-0 fs-xs">
                                  {errors.address_line2}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* pincode */}
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="pincode"
                              className="form-label fs-s fw-medium black_300"
                            >
                              PinCode<span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={
                                errors && errors.fullname
                                  ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                  : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                              }
                              placeholder="Enter the PinCode "
                              id="pincode"
                              name="pincode"
                              value={BranchFrom?.pincode}
                              onChange={handleChange}
                            />

                            <div style={{ height: "8px" }}>
                              {errors && errors.pincode && (
                                <p className="text-danger m-0 fs-xs">
                                  {errors.pincode}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        {/* city */}
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="city"
                              className="form-label fs-s fw-medium black_300"
                            >
                              City <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={
                                errors && errors.city
                                  ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                  : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                              }
                              placeholder="Enter the City"
                              id="city"
                              name="city"
                              value={BranchFrom?.city}
                              onChange={handleChange}
                            />

                            <div style={{ height: "8px" }}>
                              {errors && errors.city && (
                                <p className="text-danger m-0 fs-xs">
                                  {errors.city}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* state */}

                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="state"
                              className="form-label fs-s fw-medium black_300"
                            >
                              State<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={
                                errors && errors.state
                                  ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                  : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                              }
                              placeholder="Enter the State"
                              id="state"
                              name="state"
                              value={BranchFrom?.state}
                              onChange={handleChange}
                            />

                            <div style={{ height: "8px" }}>
                              {errors && errors.state && (
                                <p className="text-danger m-0 fs-xs">
                                  {errors.state}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* description */}
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label
                              htmlFor="description"
                              className="form-label fs-s fw-medium black_300"
                            >
                              Description<span className="text-danger">*</span>
                            </label>
                            <input
                              type="textarea"
                              className={
                                errors && errors.description
                                  ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                  : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                              }
                              placeholder="Enter the Description"
                              id="description"
                              name="description"
                              value={BranchFrom?.description}
                              onChange={handleChange}
                            />

                            <div style={{ height: "8px" }}>
                              {errors && errors.description && (
                                <p className="text-danger m-0 fs-xs">
                                  {errors.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* bank name */}
                        <div className=" col-md-4 ">
                          <label className="form-label fs-s fw-medium black_300">
                            Bank Name<span className="text-danger">*</span>
                          </label>

                          <Select
                            className={` fs-s bg-form text_color input_bg_color ${errors && errors.banks
                              ? "error-input border border-red-500"
                              : ""
                              }`}
                            isMulti
                            options={bankOptions}
                            classNamePrefix="select"
                            value={bankOptions.filter(option => (BranchFrom.banks || []).includes(option.value))}
                            onChange={handleBankChange}
                          />
                          <div style={{ height: "8px" }}>
                            {errors && errors?.banks && (
                              <p className="text-danger m-0 fs-xs">
                                {errors.banks}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="controls d-flex justify-content-between  mt-4">
                        <div>
                          {activeTab !== 1 && (
                            <Button
                              type="button"
                              className="control_prev_btn text_color"
                              onClick={handlePrev}
                              icon={<IoMdArrowBack className="button_icons" />}
                            >
                              Go Back
                            </Button>
                          )}
                        </div>

                        <div>
                          {activeTab !== 2 && (

                            <Button
                              type="button"
                              className="btn  right btn_primary "
                              onClick={handleNext}
                            >
                              Continue
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {/* Perview State */}
                  {activeTab === 2 && (
                    <>
                      <div className="">
                        <div className="card p-2">
                          <div className="">
                            <div className="row">
                              <div className="col-lg-4 col-md-6  col-sm-4  mt-2">
                                 <img
                                        src={fgLogo}
                                        className="w-50 admform-sd"
                                        width={"50%"}
                                        alt="Branch Logo"
                                      />
                              </div>
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="table-responsive table-scroll">
                                  <h6>Branch Details</h6>
                                  <tbody className="fs-13 ">
                                    <tr className="lh-400">
                                      <td
                                        className=" ps-0 black_300 fw-500   fs-13"
                                        scope="row"
                                      >
                                        Branch Name
                                      </td>
                                      <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                        <span className="ms-4">:  {BranchFrom?.branch_name} </span>
                                      </td>
                                    </tr>
                                    <tr className="lh-400">
                                      <td
                                        className=" ps-0 black_300 fw-500   fs-13"
                                        scope="row"
                                      >
                                        GST NO
                                      </td>
                                      <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                        <span className="ms-4">: {BranchFrom?.GST_NO} </span>
                                      </td>
                                    </tr>
                                    <tr className="lh-400">
                                      <td
                                        className=" ps-0 black_300 fw-500   fs-13"
                                        scope="row"
                                      >
                                        Address Line-1
                                      </td>
                                      <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                        <span className="ms-4">: {BranchFrom?.address_line1} </span>
                                      </td>

                                    </tr>
                                    <tr className="lh-400">
                                      <td
                                        className=" ps-0 black_300 fw-500   fs-13"
                                        scope="row"
                                      >
                                        Address Line-2
                                      </td>
                                      <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                        <span className="ms-4">: {BranchFrom?.address_line2}</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </div>
                              </div>

                              <div className="col-lg-4 col-md-6">
                                <div className="table-responsive table-scroll">
                                  <tbody>
                                    <tr className="lh-400">
                                      <td
                                        className=" ps-0 black_300 fw-500   fs-13"
                                        scope="row"
                                      >
                                        Pincode
                                      </td>
                                      <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                        <span className="ms-4">: {BranchFrom?.pincode} </span>
                                      </td>

                                    </tr>
                                    <tr className="lh-400">
                                      <td
                                        className=" ps-0 black_300 fw-500   fs-13"
                                        scope="row"
                                      >
                                        City
                                      </td>
                                      <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                        <span className="ms-4">: {BranchFrom?.city}</span>
                                      </td>

                                    </tr>
                                    <tr className="lh-400">
                                      <td
                                        className=" ps-0 black_300 fw-500   fs-13"
                                        scope="row"
                                      >
                                        State
                                      </td>
                                      <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                        <span className="ms-4">:{BranchFrom?.state} </span>
                                      </td>

                                    </tr>
                                    <tr className="lh-400">
                                      <td
                                        className=" ps-0 black_300 fw-500   fs-13"
                                        scope="row"
                                      >
                                        Description
                                      </td>
                                      <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                        <span className="ms-4">:{BranchFrom?.description} </span>
                                      </td>

                                    </tr>
                                    <tr className="lh-400">
                                      <td
                                        className=" ps-0 black_300 fw-500   fs-13"
                                        scope="row"
                                      >
                                        Bank
                                      </td>
                                      <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                        <span className="ms-4">:
                                          {BranchFrom?.banks && Array.isArray(BranchFrom.banks)
                                            ? BranchFrom.banks.map((bankId) => {
                                              const bank = bankOptions.find((option) => option.value === bankId);
                                              return bank ? bank.label : "Unknown Bank";
                                            }).join(", ")
                                            : "No Banks Selected"}
                                        </span>
                                      </td>

                                    </tr>
                                  </tbody>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6  col-sm-12 ">
                                <div className="table-responsive table-scroll">
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="controls d-flex justify-content-between  mt-4">
                        <div>
                          {activeTab !== 1 && (
                            <Button
                              type="button"
                              className="control_prev_btn text_color"
                              onClick={handlePrev}
                              icon={<IoMdArrowBack className="button_icons" />}
                            >
                              Go Back
                            </Button>
                          )}
                        </div>

                        <div>
                          {activeTab !== 1 && (

                            <Button
                              type="button"
                              className="btn  right btn_primary "
                              onClick={handleBranchDetails}
                              icon={<IoMdArrowForward />}
                              disabled={fetcher.state === "submitting"}
                              style={{ cursor: fetcher.state === "submitting" ? "not-allowed" : "" }}
                            >
                              Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBrnach;

// import React, { useEffect, useState } from "react";
// import { useContext } from "react";
// import { BranchContext } from "../../../../dataLayer/context/branchContext/BranchContextProvider";
// import axios from "axios";
// import { FaArrowRight } from "react-icons/fa";
// import { useNavigate, useNavigation, useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// import Button from "../../../components/button/Button";
// import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
// import BackButton from "../../../components/backbutton/BackButton";
// import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext";
// import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";

// const CreateBranch = () => {
//   const { DispatchBranch, getAllBranches } = useBranchContext();
//   const { id } = useParams();
//   const { AuthState } = useAuthContext();
//   const navigate = useNavigate();
//   const [createdBy, setCreatedBy] = useState(AuthState?.user?.fullname);

//   const [formData, setFormData] = useState({
//     branch_name: "",
//     description: "",
//   });
//   const [error, setError] = useState({});

//   useEffect(() => {
//     if (id) {
//       // Fetch branch for editing
//       ERPApi.get(`${import.meta.env.VITE_API_URL}/settings/getbranch/${id}`)
//         .then((response) => {
//           setFormData({
//             branch_name: response?.data?.branch_name || "",
//             description: response?.data?.description || "",
//           });
//         })
//         .catch((error) => {});
//     }
//   }, [id]);

//   const handlechange = (e) => {
//     const { name, value } = e.target;
//     setError((prev) => ({
//       ...prev,
//       [name]: "",
//     }));
//     setFormData((prev) => {
//       return { ...prev, [name]: value };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       !formData.branch_name ||
//       formData.branch_name.trim() === "" ||
//       formData.branch_name.length < 3
//     ) {
//       setError((prev) => ({
//         ...prev,
//         branch_name: "Please enter the branch name (min 3 characters)",
//       }));
//       return;
//     }

//     if (
//       !formData.description ||
//       formData.description.trim() === "" ||
//       formData.description.length < 3
//     ) {
//       setError((prev) => ({
//         ...prev,
//         description: "Please enter the description (min 3 characters)",
//       }));
//       return;
//     }

//     let user = {
//       branch_name: formData.branch_name,
//       description: formData.description,
//       createdby: createdBy,
//     };
//     user = [user];

//     const dataWithTitleCase = user.map((item) => {
//       const newItem = {};

//       for (const key in item) {
//         if (Object.prototype.hasOwnProperty.call(item, key)) {
//           if (typeof item[key] === "string" && key !== "email") {
//             newItem[key] = item[key]
//               .split(" ")
//               .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//               .join(" ");
//           } else {
//             newItem[key] = item[key];
//           }
//         }
//       }
//       return newItem;
//     });

//     user = dataWithTitleCase[0];

//     if (!id) {
//       try {
//         const { data, status } = await toast.promise(
//           ERPApi.post(
//             `${import.meta.env.VITE_API_URL}/settings/addbranch`,
//             user
//           ),
//           {
//             loading: "Loading...",
//             success: "Branch created Successfully",
//             error: "Branch not Created",
//           }
//         );

//         if (status === 201) {
//           DispatchBranch({ type: "CREATE_BRANCH", payload: data });
//           getAllBranches();
//           navigate("/settings/branch");
//         }
//       } catch (error) {}
//     }

//     if (id) {
//       try {
//         const { data, status } = await toast.promise(
//           ERPApi.put(
//             `${import.meta.env.VITE_API_URL}/settings/updatebranch/${id}`,
//             user
//           ),
//           {
//             loading: "Loading...",
//             success: "Branch Updated Successfully",
//             error: "Branch not Updated",
//           }
//         );

//         if (status === 200) {
//           DispatchBranch({ type: "CREATE_BRANCH", payload: data });
//           getAllBranches();
//           navigate("/settings/branch");
//         }
//       } catch (error) {}
//     }
//   };

//   return (
//     <div>
//       {id && id ? (
//         <BackButton heading="Update Branch" content="Back" />
//       ) : (
//         <BackButton heading="Create Branch" content="Back" />
//       )}
//       <div className="container">
//         <div className="row d-flex justify-content-center">
//           <div className="col-lg-5">
//             <div className="card">
//               <div className="card-body">
//                 <form className="row">
//                   <div className=" col-lg-12 mb-3">
//                     <label
//                       for="firstNameinput"
//                       className="form-label fs-s fw-medium text_color"
//                     >
//                       Branch Name<span className="text-danger">*</span>
//                     </label>

//                     <input
//                       type="text"
//                       className={
//                         error && error?.branch_name
//                           ? "form-control fs-s bg-form text_color input_bg_color error-input"
//                           : "form-control fs-s bg-form text_color input_bg_color"
//                       }
//                       placeholder="Enter Branch Name"
//                       id="firstNameinput"
//                       name="branch_name"
//                       value={formData?.branch_name}
//                       onChange={handlechange}
//                     />
//                     <div style={{ height: "8px" }}>
//                       {error && error?.branch_name && (
//                         <p className="text-danger m-0 fs-xs">
//                           {error?.branch_name}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="col-lg-12 mb-3">
//                     <label
//                       for="description"
//                       className="form-label fs-s fw-medium text_color "
//                     >
//                       Description<span className="text-danger">*</span>
//                     </label>
//                     <textarea
//                       type="text"
//                       className={
//                         error && error?.description
//                           ? "form-control fs-s bg-form text_color input_bg_color error-input"
//                           : "form-control fs-s bg-form text_color input_bg_color"
//                       }
//                       placeholder="Add your description"
//                       id="description"
//                       name="description"
//                       onChange={handlechange}
//                       value={formData?.description}
//                     />
//                     <div style={{ height: "8px" }}>
//                       {error && error.description && (
//                         <p className="text-danger m-0 fs-xs">
//                           {error?.description}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className=" ">
//                     <div className="d-flex justify-content-end">
//                       <Button className={"btn_primary"} onClick={handleSubmit}>
//                         {id ? "Update" : "Submit"}
//                       </Button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default CreateBranch;








//    branch code

//  <div className="bottom mt-3">
// <form className="" onSubmit={handleSubmit}>
//   <div className="row d-flex">
//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="branch_name"
//           className="form-label fs-s fw-medium black_300"
//         >
//           Branch Name<span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.branch_name
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter Full Name"
//           id="branch_name"
//           name="branch_name"
//           onChange={handleChange}
//           value={BranchFrom?.branch_name}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.branch_name && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.branch_name}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//     {/* branch logo */}
//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="logoName"
//           className="form-label fs-s fw-medium black_300"
//         >
//           Branch Logo <span className="text-danger">*</span>
//         </label>
//         <input
//           type="file"
//           accept="image/*"
//           className={
//             errors && errors.logoName
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the Logo"
//           id="logoName"
//           name="logoName"
//           onChange={handleFileChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.logoName && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.logoName}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//     {/* gst no */}
//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="GST_NO"
//           className="form-label fs-s fw-medium black_300"
//         >
//           GST-NO<span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.GST_NO
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the GST Number"
//           id="GST_NO"
//           name="GST_NO"
//           value={BranchFrom?.GST_NO}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.GST_NO && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.GST_NO}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//     {/* address line -1 */}

//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="address_line1"
//           className="form-label fs-s fw-medium black_300"
//         >
//           Address Line -1<span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.address_line1
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the Address Line-1"
//           id="address_line1"
//           name="address_line1"
//           value={BranchFrom?.address_line1}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.address_line1 && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.address_line1}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//     {/* adress line-2 */}
//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="address_line2"
//           className="form-label fs-s fw-medium black_300"
//         >
//           Address Line - 2<span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.address_line2
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the Address Line -2"
//           id="address_line2"
//           name="address_line2"
//           value={BranchFrom?.address_line2}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.address_line2 && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.address_line2}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* pincode */}
//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="pincode"
//           className="form-label fs-s fw-medium black_300"
//         >
//           PinCode<span className="text-danger">*</span>
//         </label>
//         <input
//           type="number"
//           className={
//             errors && errors.fullname
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the PinCode "
//           id="pincode"
//           name="pincode"
//           value={BranchFrom?.pincode}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.pincode && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.pincode}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//     {/* city */}
//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="city"
//           className="form-label fs-s fw-medium black_300"
//         >
//           City <span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.city
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the City"
//           id="city"
//           name="city"
//           value={BranchFrom?.city}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.city && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.city}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* state */}

//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="state"
//           className="form-label fs-s fw-medium black_300"
//         >
//           State<span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.state
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the State"
//           id="state"
//           name="state"
//           value={BranchFrom?.state}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.state && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.state}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* description */}
//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="description"
//           className="form-label fs-s fw-medium black_300"
//         >
//           Description<span className="text-danger">*</span>
//         </label>
//         <input
//           type="textarea"
//           className={
//             errors && errors.description
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the Description"
//           id="description"
//           name="description"
//           value={BranchFrom?.description}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.description && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.description}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>


//     {/* Account Holder Name */}
//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="accountHolderName"
//           className="form-label fs-s fw-medium black_300"
//         >
//           Account Holder Name
//           <span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.accountHolderName
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the Account HolderName"
//           id="accountHolderName"
//           name="accountHolderName"
//           value={BranchFrom?.accountHolderName}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.accountHolderName && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.accountHolderName}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* Account number */}
//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="accountNumber"
//           className="form-label fs-s fw-medium black_300"
//         >
//           Account Number<span className="text-danger">*</span>
//         </label>
//         <input
//           type="number"
//           className={
//             errors && errors.accountNumber
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the Account Number"
//           id="accountNumber"
//           name="accountNumber"
//           value={BranchFrom?.accountNumber}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.accountNumber && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.accountNumber}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* IFSC Code  */}

//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="IFSC"
//           className="form-label fs-s fw-medium black_300"
//         >
//           IFSC Code <span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.IFSC
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the IFSC Code"
//           id="IFSC"
//           name="IFSC"
//           value={BranchFrom?.IFSC}
//           onChange={handleChange}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.IFSC && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.IFSC}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//     {/* verify */}
//     <div className="row d-flex justify-content-end p-0">
//       <div className="col text-end p-0">
//         <div className="mt-1">
//           <Button
//             className={"btn_primary"}
//             // onClick={(e) => handleSubmit(e)}
//             // disabled={loading}
//             // style={{ cursor: loading ? "not-allowed" : "pointer" }}
//             onClick={() => handleIFSCVerification()}
//           >
//             Verify
//           </Button>
//         </div>
//       </div>
//     </div>
//     {/* Bank Name */}

//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="bankName"
//           className="form-label fs-s fw-medium black_300"
//         >
//           Bank Name<span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.bankName
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the Bank Name"
//           id="bankName"
//           name="bankName"
//           value={BranchFrom?.bankName}
//           onChange={handleChange}
//           disabled
//           style={{ cursor: "not-allowed" }}
//         />

//         <div style={{ height: "8px" }}>
//           {errors && errors.bankName && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.bankName}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* bank Brnach Name */}

//     <div className="col-md-4">
//       <div className="mb-3">
//         <label
//           htmlFor="bankBranchName"
//           className="form-label fs-s fw-medium black_300"
//         >
//           Bank Branch Name{" "}
//           <span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className={
//             errors && errors.bankBranchName
//               ? "form-control fs-s bg-form text_color input_bg_color error-input "
//               : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
//           }
//           placeholder="Enter the Bank Branch Name"
//           id="bankBranchName"
//           name="bankBranchName"
//           value={BranchFrom?.bankBranchName}
//           onChange={handleChange}
//           disabled
//           style={{ cursor: "not-allowed" }}
//         />
//         <div style={{ height: "8px" }}>
//           {errors && errors.bankBranchName && (
//             <p className="text-danger m-0 fs-xs">
//               {errors.bankBranchName}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//     {/* submit */}
//     <div className="row d-flex justify-content-end p-0">
//       <div className="col text-end p-0">
//         <div className="mt-1">
//           <Button
//             className={"btn_primary"}
//             onClick={(e) => handleSubmit(e)}
//           // disabled={loading}
//           // style={{ cursor: loading ? "not-allowed" : "pointer" }}
//           >
//             Submit
//           </Button>
//         </div>
//       </div>
//     </div>
//   </div>
// </form>
// </div> 
