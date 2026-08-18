import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../../dataLayer/context/themeContext/ThemeContext";
import {
  IoMdArrowBack,
  IoMdCheckmark,
  IoMdArrowForward,
  IoMdSend,
  IoMdMail,
} from "react-icons/io";
import "../../../../assets/css/RegistrationForm.css";
import { MdDelete } from "react-icons/md";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import mainLogo from "../../../../assets/images/FG-LOGO.png";
import DefaultBG from "../../../../assets/images/student_idCard_images/DefaultimgBG.png";
import jsPDF from "jspdf";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { debounce } from "../../../../utils/Utils";
import Select from "react-select";
import { toast } from "react-toastify";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";
import Swal from "sweetalert2";

import { IoCall, IoChevronDownSharp } from "react-icons/io5";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import { PiAtBold } from "react-icons/pi";
import useFormattedDate from "../../../../dataLayer/hooks/useFormattedDate";
import { SearchSelect } from "../../../../utils/SearchSelect";

const StudentRegistrationFrom = () => {
  const data = useLoaderData();
  const {
    coursePackageList,
    BranchsList,
    leadSourceList,
    active,
    courseData,
    coursepackageIdparams,
  } = data;

  const submit = useSubmit();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("data"));
  const currentYear = new Date().getFullYear();

  const { theme } = useTheme();
  const [query, setQuerys] = useState({
    active: active ? active : 1,
    coursepackageId: coursepackageIdparams ? coursepackageIdparams : null,
  });

  const coursesList =
    courseData?.map((item, index) => ({
      label: item.course_name,
      value: item.id,
    })) || [];

  // const [coursePackageListData, setCoursePackageListData] = useState([
  //     { label: "IIT Certification Program", value: 31 },
  //     { label: "Job Oriented Training Program", value: 29 },
  //     { label: "Module Certification Program - Vizag", value: 27 },
  //     { label: "IIT Certification Program - Vizag", value: 26 },
  //     { label: "Job Oriented Training Program - Vizag", value: 25 },
  //     { label: "Employment Program - Vizag", value: 24 },
  //     { label: "Employment Program", value: 18 },
  //     { label: "Module Certification Program", value: 17 },
  //     { label: "Dual Certification Program", value: 41 },
  //     { label: "Jain University", value: 32 },
  //     { label: "Scholarship ", value: 16 },

  // ]);

  const coursePackageListData = coursePackageList
    ?.filter((item) => item.isToggle === 1)
    .map((item) => ({ label: item.label, value: item.value }));

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    debouncedParams(query);
  }, [query]);

  const debouncedParams = useCallback(
    debounce((param) => {
      const searchParams = new URLSearchParams({
        active: param?.active,
        coursepackageId: param?.coursepackageId,
      }).toString();
      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 200),
    [],
  );

  const handleNext = () => {
    setQuerys((prev) => ({
      ...prev,
      active: active + 1,
    }));
  };
  const handlePrev = () => {
    setQuerys((prev) => ({
      ...prev,
      active: active - 1,
    }));
  };

  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountDown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const [emailVerificationState, setEmailVerificationState] = useState({
    email: "",
    enableOTPInputFeild: false,
    emailOTP: Array(6).fill(""),
    otpVerified: false,
  });

  const inputRefs = useRef([]);

  const handleInputChangeEmail = (e, index) => {
    const { value } = e.target;

    setErrors((prev) => ({
      ...prev,
      emailOTP: "",
    }));
    if (/^[0-9]?$/.test(value)) {
      // Allow only digits
      const newOTP = [...emailVerificationState.emailOTP];
      newOTP[index] = value;
      setEmailVerificationState((prev) => ({
        ...prev,
        emailOTP: newOTP,
      }));
      // Move to the next input field if a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (index) => {
    inputRefs.current[index].select(); // Select the current input text when focused
  };

  const handleKeyDownemail = (e, index) => {
    if (
      e.key === "Backspace" &&
      !emailVerificationState.emailOTP[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1].focus(); // Move to the previous input field on backspace
    }
  };

  // useEffect(() => {
  //     if (countdown > 0) {
  //         const timer = setInterval(() => {
  //             setCountDown((prev) => prev - 1)
  //         }, 1000);
  //         return () => clearInterval(timer); // Cleanup interval on unmount or countdown reset
  //     }
  // }, [countdown]);

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const [studentDetails, setStudentDetails] = useState({
    name: "",
    email: "",
    imageFile: "",
    filename: "",
    imagePerview: "",
    studentImg: "",
    aadharCardImage: "",
    aadharCardImageData: "",
    aadharImagePerview: "",
    aadharImageFile: "",
    aadharCardNumber: "",
    birthdate: "",
    mobilenumber: "",
    whatsappno: "",
    gender: "",
    maritalstatus: "",
    college: "",
    zipcode: "",
    country: "",
    state: "",
    native: "",
    area: "",
  });

  const [parentsDetails, setParentsDetails] = useState({
    parentsname: "",
    parentsnumber: "",
  });
  const[selectedLeadSource, setSelectedLeadSource] = useState(null);

  const [educationDetails, setEducationDetails] = useState({
    educationtype: "",
    marks: "",
    academicyear: "",
  });

  const [admissionDetails, setAdmissionDetails] = useState({
    enquirydate: "",
    enquirytakenby: "",
    enquirytakenbyId: "",
    coursepackage: "",
    coursepackageId: "",
    courses: "",
    coursesId: "",
    leadsource: [],
    leadsourceId: "",
    branch: "",
    branchId: "",
    modeoftraining: "",
    admissiondate: "",
    validitystartdate: "",
    validityenddate: "",
    user_id: null,
    isInterestedForAbroad: "",
  });

  const [feeData, setFeeData] = useState({
    id: null,
    feetype: "",
    amount: 0,
    discount: 0,
    taxamount: 0,
    totalamount: 0,
  });

  const [feeAndBillingDetails, setFeeAndBillingDetails] = useState({
    feedetails: [],
    feedetailsbilling: [],
    addfee: false,
    duedatetype: "",
    admissionremarks: "",
    assets: [],
    tshirtSize: "",
    installments: [],
    totalpaidamount: 0,
    nextduedate: null,
    status: 1,
    admissionFee: [],
    initialpayment: [],
    extra_discount: [],
    student_status: [],
    refund: null,
    certificate_status: [
      {
        courseStartDate: "",
        courseEndDate: "",
        certificateStatus: "",
        requistedDate: "",
        issuedDate: "",
      },
    ],
    totalinstallments: 0,
  });

  useEffect(() => {
    const storedemailVerificationState = localStorage.getItem(
      "emailVerificationState",
    );
    const storedStudentDetails = localStorage.getItem("studentDetails");
    const storedParentDetails = localStorage.getItem("parentsDetails");
    const storedEducationDetails = localStorage.getItem("educationDetails");
    const storedAdmissionDetails = localStorage.getItem("admissionDetails");
    const stroedFeeAndBillingDetails = localStorage.getItem(
      "feeAndBillingDetails",
    );
    const userData = JSON.parse(localStorage.getItem("data"));

    if (userData) {
      setAdmissionDetails((prev) => ({
        ...prev,
        enquirytakenby: userData?.user?.fullname,
        enquirytakenbyId: userData?.user?.id,
        branch: userData?.user?.branch_setting?.branch_name,
        branchId: userData?.user?.branch_setting?.id,
        user_id: userData?.user?.id,
      }));
    }
    if (storedemailVerificationState) {
      setEmailVerificationState(JSON.parse(storedemailVerificationState));
    }

    if (storedStudentDetails) {
      setStudentDetails(JSON.parse(storedStudentDetails));
    }
    if (storedParentDetails) {
      setParentsDetails(JSON.parse(storedParentDetails));
    }
    if (storedEducationDetails) {
      setEducationDetails(JSON.parse(storedEducationDetails));
    }
    if (storedAdmissionDetails) {
      setAdmissionDetails(JSON.parse(storedAdmissionDetails));
      setSelectedLeadSource(JSON.parse(storedAdmissionDetails)?.leadsourceId ? {
        value: JSON.parse(storedAdmissionDetails)?.leadsourceId,
        label: JSON.parse(storedAdmissionDetails)?.leadsource?.[0]?.source,
      } : null);
    }
    if (stroedFeeAndBillingDetails) {
      setFeeAndBillingDetails(JSON.parse(stroedFeeAndBillingDetails));
    }

    // return () => {
    //     localStorage.removeItem("emailVerificationState");
    //     localStorage.removeItem("studentDetails");
    //     localStorage.removeItem("parentsDetails");
    //     localStorage.removeItem("educationDetails");
    //     localStorage.removeItem("admissionDetails");
    //     localStorage.removeItem("feeAndBillingDetails");
    // };
  }, []);

  const handleSendOTPtoEmail = async () => {
    if (!studentDetails.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(studentDetails?.email)) {
        setErrors((prev) => ({ ...prev, email: "Invalid Email Address" }));
        return;
      }
    }
    try {
      const updatedData = {
        email: studentDetails?.email,
        type: "SEND_OTP_TO_EMAIL",
      };

      await fetcher.submit(updatedData, {
        method: "POST",
        encType: "application/json",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOTP = async () => {
    const OtpString = emailVerificationState?.emailOTP?.join(""); // Ensure OTP exists as a string
    const OtpNumber = OtpString ? Number(OtpString) : null;

    if (!OtpNumber || OtpString.length !== 6) {
      setErrors((prev) => ({ ...prev, emailOTP: "OTP must be 6 digits long" }));
      return;
    }

    try {
      const updatedData = {
        email: studentDetails?.email,
        emailOtp: OtpString, // Ensure OTP is sent as a string
        type: "VERIFY_OTP_TO_EMAIL",
      };

      await fetcher.submit(updatedData, {
        method: "POST",
        encType: "application/json",
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleInputChange = async (event, inputType) => {
    try {
      if (active === 2 || active === 1) {
        const { name, value } = event.target;

        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));

        // if (name === "filename") {
        //     const file = event.target.files[0];
        //     setStudentDetails((prev) => ({
        //         ...prev,
        //         filename: file.name,
        //         imageFile: file,
        //     }));
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         const photoData = reader.result.split(",")[1];
        //         setStudentDetails((prev) => ({
        //             ...prev,
        //             imagePerview: reader.result,
        //             studentImg: photoData,
        //         }));
        //     };
        //     reader.readAsDataURL(file);
        // }
        // else if (name === "aadharCardImage") {
        //     const file = event.target.files[0];
        //     setStudentDetails((prev) => ({
        //         ...prev,
        //         aadharCardImage: file.name,
        //         aadharImageFile: file,
        //     }));
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         const photoData = reader.result.split(",")[1];
        //         setStudentDetails((prev) => ({
        //             ...prev,
        //             aadharImagePerview: reader.result,
        //             aadharCardImageData: photoData,
        //         }));
        //     };
        //     reader.readAsDataURL(file);
        // }
        if (name === "filename") {
          const file = event.target.files[0];

          if (file) {
            const maxSize = 2 * 1024 * 1024; // 2 MB

            // ✅ File size validation
            if (file.size > maxSize) {
              setErrors((prev) => ({
                ...prev,
                filename: "File size must be 2 MB or less",
              }));

              event.target.value = null; // clear the input
              return; // stop execution
            } else {
              // clear previous error if valid file chosen
              setErrors((prev) => ({
                ...prev,
                filename: "",
              }));
            }
          }

          setStudentDetails((prev) => ({
            ...prev,
            filename: file.name,
            imageFile: file,
          }));

          const reader = new FileReader();
          reader.onloadend = () => {
            const photoData = reader.result.split(",")[1];
            setStudentDetails((prev) => ({
              ...prev,
              imagePerview: reader.result,
              studentImg: photoData,
            }));
          };
          reader.readAsDataURL(file);
        } else if (name === "aadharCardImage") {
          const file = event.target.files[0];

          if (file) {
            const maxSize = 2 * 1024 * 1024; // 2 MB

            // ✅ File size validation
            if (file.size > maxSize) {
              setErrors((prev) => ({
                ...prev,
                aadharCardImage: "File size must be 2 MB or less",
              }));

              event.target.value = null; // clear input
              return; // stop further processing
            } else {
              // clear previous error
              setErrors((prev) => ({
                ...prev,
                aadharCardImage: "",
              }));
            }
          }

          setStudentDetails((prev) => ({
            ...prev,
            aadharCardImage: file.name,
            aadharImageFile: file,
          }));

          const reader = new FileReader();
          reader.onloadend = () => {
            const photoData = reader.result.split(",")[1];
            setStudentDetails((prev) => ({
              ...prev,
              aadharImagePerview: reader.result,
              aadharCardImageData: photoData,
            }));
          };
          reader.readAsDataURL(file);
        } else if (name === "email") {
          setStudentDetails((prevState) => ({ ...prevState, email: value }));
          setEmailVerificationState((prev) => ({
            ...prev,
            otpVerified: false,
            enableOTPInputFeild: false,
          }));
        } else {
          setStudentDetails((prevState) => ({ ...prevState, [name]: value }));
        }
      } else if (active === 3) {
        const { name, value } = event.target;
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
        setParentsDetails((prevState) => ({ ...prevState, [name]: value }));
      } else if (active === 4) {
        const { name, value } = event.target;
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
        setEducationDetails((prevState) => ({ ...prevState, [name]: value }));
      } else if (active === 5) {
        if (inputType) {
          setErrors((prev) => ({
            ...prev,
            [inputType]: "",
          }));
        }

        if (inputType === "enquirytakenby") {
          setAdmissionDetails((prev) => ({
            ...prev,
            enquirytakenby: event.label,
            enquirytakenbyId: parseInt(event.value),
          }));
        } else if (inputType === "coursepackage") {
          setAdmissionDetails((prev) => ({
            ...prev,
            coursepackage: event.label,
            coursepackageId: parseInt(event.value),
            courses: "",
            coursesId: "",
          }));

          setQuerys((prev) => ({
            ...prev,
            coursepackageId: event.value,
            active: active,
          }));
        } else if (inputType === "branch") {
          setAdmissionDetails((prev) => ({
            ...prev,
            branch: event.label,
            branchId: parseInt(event.value),
          }));
        } else if (inputType === "courses") {
          setAdmissionDetails((prev) => ({
            ...prev,
            courses: event.label,
            coursesId: parseInt(event.value),
          }));
          setFeeAndBillingDetails((prev) => ({
            ...prev,
            feedetails: [],
          }));
        } else if (inputType === "leadsource") {
          setAdmissionDetails((prev) => ({
            ...prev,
            leadsource: [
              {
                source: event?.label,
              },
            ],
            leadsourceId: parseInt(event?.value) || "",
          }));
        } else {
          const { name, value } = event.target;
          setErrors((prev) => ({
            ...prev,
            [name]: "",
          }));
          if (name == "validitystartdate") {
            const startDate = new Date(value);
            const endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);
            const formattedEndDate = endDate.toISOString().split("T")[0];
            setAdmissionDetails((prev) => ({
              ...prev,
              validitystartdate: value,
              validityenddate: formattedEndDate,
            }));
          }
          setAdmissionDetails((prevState) => ({ ...prevState, [name]: value }));
        }
      } else if (active === 6) {
        const { name, value } = event.target;

        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
        if (name === "feetype" && value === "Admission Fee") {
          setFeeData({
            id: Date.now(),
            feetype: value,
            amount: 500,
            discount: 0,
          });
        } else if (name === "feetype" && value === "fee") {
          let course = courseData.filter((course) => {
            return course.id === admissionDetails?.coursesId;
          });
          const voucherData = JSON.parse(localStorage.getItem("VoucherData"));
          const discountType = voucherData?.valueType ?? null;

          const fee = Number(course[0].fee) || 0;
          const percentage = Number(voucherData?.percentage) || 0;
          const amount = Number(voucherData?.amount) || 0;

          const discountAmount =
            discountType === "percentage"
              ? Math.round(fee * (percentage / 100))
              : amount;
          // const discountAmount = localStorage.getItem("voucherAmount")
          //  here getting fee from course data based on selected course

          setFeeData({
            id: Date.now(),
            feetype: value,
            amount: course[0].fee,
            discount: discountAmount ?? 0,
          });
        } else if (name === "discount") {
          if (feeData.feetype === "Admission Fee") {
            if (parseInt(value) > 500) {
              return;
            } else {
              setFeeData((prev) => ({
                ...prev,
                discount: parseInt(value),
              }));
            }
          } else if (feeData.feetype === "fee") {
            setFeeData((prev) => ({
              ...prev,
              discount: parseInt(value),
            }));
          }
        } else {
          setFeeData((prevState) => ({
            ...prevState,
            [name]: parseInt(value),
          }));
        }
      } else if (active === 8) {
        const { id, name, checked, value } = event.target;

        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));

        setFeeAndBillingDetails((prev) => {
          const currentAssets = Array.isArray(prev.assets) ? prev.assets : []; // Ensure assets is an array
          if (inputType === "checkbox") {
            setFeeAndBillingDetails((prevDetails) => {
              const updatedAssets = checked
                ? [...prevDetails.assets, id]
                : prevDetails.assets.filter((asset) => asset !== id);

              // If 'mac' is unchecked, reset 'tshirtSize'
              if (id === "mac" && !checked) {
                return {
                  ...prevDetails,
                  assets: updatedAssets,
                  tshirtSize: "", // Reset t-shirt size when mac is unchecked
                };
              }

              return {
                ...prevDetails,
                assets: updatedAssets,
              };
            });
          } else if (id === "tshirtSize") {
            setFeeAndBillingDetails((prevDetails) => ({
              ...prevDetails,
              tshirtSize: value,
            }));
          } else {
            // Handle other input types if you have them
            setFeeAndBillingDetails((prevDetails) => ({
              ...prevDetails,
              [id]: value,
            }));
          }
          if (name === "admissionremarks") {
            return { ...prev, admissionremarks: value };
          } else {
            const updatedAssets = checked
              ? [...currentAssets, name] // Add asset
              : currentAssets.filter((asset) => asset !== name); // Remove asset

            return { ...prev, assets: updatedAssets };
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const relevantCoursePackageIds = [31, 26, 19];

  const shouldShowMacAndTshirt = relevantCoursePackageIds.includes(
    admissionDetails.coursepackageId,
  );
  const handleFeeDetails = (e) => {
    e.preventDefault();
    if (!feeData.feetype) {
      setErrors((prev) => ({ ...prev, feetype: "Fee type is required" }));
      return;
    }

    if (!feeData?.amount) {
      setErrors((prev) => ({ ...prev, amount: "Amount is required" }));
      return;
    }
    const existingAdmissionFee = feeAndBillingDetails?.feedetails.some(
      (item) => item.feetype === "Admission Fee",
    );
    const existingRegularFee = feeAndBillingDetails?.feedetails?.some(
      (item) => item.feetype === "fee",
    );

    // Validate that only one admission fee and one regular fee are allowed
    if (feeData.feetype === "Admission Fee" && existingAdmissionFee) {
      toast.error("Admission Fee is only accepted once.");
      return;
    }
    if (feeData.feetype === "fee" && existingRegularFee) {
      toast.error("Fee is only Allowed Once");
      return;
    }
    let save = true;
    if (feeData.feetype === "fee") {
      let course = courseData.filter(
        (course) =>
          course.course_name === admissionDetails?.courses &&
          course.course_package === admissionDetails?.coursepackage,
      );

      if (
        course.length > 0 &&
        parseInt(feeData.discount ? feeData.discount : 0) >
        (localStorage.getItem("voucherAmount")
          ? localStorage.getItem("voucherAmount")
          : parseInt(course[0].max_discount)) &&
        course[0].course_name === admissionDetails?.courses &&
        course[0].course_package === admissionDetails?.coursepackage
      ) {
        save = false;
        toast.error(
          `Discount cannot be greater than ${course[0].max_discount}`,
        );
      }
    }
    if (save) {
      const DiscountAmount = feeData?.discount || 0;
      const totalAmount = feeData?.amount - DiscountAmount;
      const actualFee = (totalAmount * 100) / 118;
      const taxAmount = totalAmount - actualFee;
      setFeeData((prev) => ({
        ...prev,
        taxamount: taxAmount,
        totalamount: totalAmount,
      }));

      setFeeAndBillingDetails((prev) => ({
        ...prev,
        feedetails: [
          ...prev.feedetails,
          {
            id: Date.now(),
            feetype: feeData.feetype,
            amount: feeData.amount,
            discount: DiscountAmount,
            taxamount: taxAmount,
            totalamount: totalAmount,
          },
        ],
      }));
      setFeeData({
        id: null,
        feetype: "",
        amount: 0,
        discount: 0,
        taxamount: 0,
        totalamount: 0,
      });
    }
  };

  const handleFeeDelete = (id) => {
    const updatedTasks = feeAndBillingDetails.feedetails.filter(
      (task) => task.id !== id,
    );
    setFeeAndBillingDetails((prev) => ({
      ...prev,
      feedetails: updatedTasks,
    }));
  };

  const handleFeecalculations = () => {
    function validateFeedetails(feedetails) {
      const admissionFeeExists = feedetails.some(
        (item) => item.feetype === "Admission Fee",
      );
      const feeExists = feedetails.some((item) => item.feetype === "fee");

      return admissionFeeExists && feeExists;
    }

    if (!validateFeedetails(feeAndBillingDetails?.feedetails || [])) {
      setErrors((prev) => ({
        ...prev,
        feetype: "Fee type is required",
        amount: "Amount is required",
      }));
      return;
    }

    let grosstotal = 0;
    let totaldiscount = 0;
    let totalfeewithouttax = 0;
    let totaltax = 0;
    let grandtotal = 0;
    let materialfee = 0;
    const array = [];

    feeAndBillingDetails?.feedetails?.forEach((item) => {
      if (item.feetype === "Admission Fee") {
        let admissionObject = {
          id: item.id,
          feetype: "Admission Fee",
          feewithtax: item.totalamount,
          feewithouttax: item.totalamount / 1.18,
          feetax: item.totalamount - item.totalamount / 1.18,
        };

        grosstotal += parseInt(item.amount);
        totalfeewithouttax += admissionObject.feewithouttax;
        totaltax += admissionObject.feetax;
        grandtotal += admissionObject.feewithtax;
        array.push(admissionObject);
      }

      if (item.feetype === "fee") {
        let courseFeeObject = {
          id: item.id,
          feetype: "Course Fee",
          feewithtax: item.totalamount * 0.7,
          feewithouttax: (item.totalamount * 0.7) / 1.18,
          feetax: item.totalamount * 0.7 - (item.totalamount * 0.7) / 1.18,
        };

        grosstotal += Math.round(item.amount * 0.7);
        totaldiscount += parseInt(item.discount * 0.7);
        totalfeewithouttax += courseFeeObject.feewithouttax;
        totaltax += courseFeeObject.feetax;
        grandtotal += courseFeeObject.feewithtax;
        array.push(courseFeeObject);

        let materialFeeObject = {
          id: item.id,
          feetype: "Material Fee",
          feewithtax: Math.round(item.totalamount * 0.3),
          feewithouttax: Math.round(item.totalamount * 0.3),
          feetax: 0,
        };

        grosstotal += parseInt(item.amount * 0.3);
        totaldiscount += parseInt(item.discount * 0.3);
        materialfee += Math.round(item.totalamount * 0.3);
        totaltax += materialFeeObject.feetax;
        array.push(materialFeeObject);
      }
    });

    const finalTotal = grandtotal + materialfee;

    setFeeAndBillingDetails((prev) => {
      const updatedDetails = {
        ...prev,
        feedetailsbilling: array,
        totaldiscount,
        grosstotal,
        totalfeewithouttax,
        totaltax,
        grandtotal,
        materialfee,
        finaltotal: finalTotal,
        dueamount: finalTotal,
      };

      localStorage.setItem(
        "feeAndBillingDetails",
        JSON.stringify(updatedDetails),
      );
      return updatedDetails;
    });

    if (feeAndBillingDetails?.feedetails?.length === 0) {
      toast.error("Please enter fee details");
      return;
    }

    handleSubmitFeeAndBillingDetails();
  };

  const handleSubmitStudentDetails = () => {
    if (!studentDetails?.name) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    } else if (studentDetails?.name?.trim().replace(/\s/g, "").length < 3) {
      setErrors((prev) => ({
        ...prev,
        name: "Name must be at least 3 characters long",
      }));
      return;
    }
    if (!studentDetails?.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(studentDetails?.email)) {
        setErrors((prev) => ({ ...prev, email: "Invalid Email Address" }));
        return;
      }
    }

    if (!studentDetails?.filename || !studentDetails?.studentImg) {
      setErrors((prev) => ({ ...prev, filename: "Image is required" }));
      return;
    }

    if (!studentDetails?.birthdate) {
      setErrors((prev) => ({
        ...prev,
        birthdate: "Date of birth is required",
      }));
      return;
    }

    if (!studentDetails?.mobilenumber) {
      setErrors((prev) => ({
        ...prev,
        mobilenumber: "Moblie Number is required",
      }));
      return;
    } else {
      if (
        studentDetails?.mobilenumber?.trim().replace(/\s/g, "")?.length !== 10
      ) {
        setErrors((prev) => ({
          ...prev,
          mobilenumber: "Incorrect Mobile number",
        }));
        return;
      }
      if (studentDetails?.mobilenumber?.toString().startsWith("0")) {
        setErrors((prev) => ({
          ...prev,
          mobilenumber: "Incorrect Mobile number",
        }));
        return;
      }
    }

    if (!studentDetails?.whatsappno) {
      setErrors((prev) => ({
        ...prev,
        whatsappno: "WhatsApp Number required",
      }));
      return;
    } else {
      if (studentDetails?.whatsappno?.trim().replace(/\s/g, "").length !== 10) {
        setErrors((prev) => ({
          ...prev,
          whatsappno: "Incorrect WhatsApp number",
        }));
        return;
      } else if (studentDetails?.whatsappno?.toString().startsWith("0")) {
        setErrors((prev) => ({
          ...prev,
          whatsappno: "Incorrect WhatsApp number",
        }));
        return;
      }
    }

    if (!studentDetails?.gender) {
      setErrors((prev) => ({ ...prev, gender: "Gender is required" }));
      return;
    }

    if (!studentDetails?.maritalstatus) {
      setErrors((prev) => ({
        ...prev,
        maritalstatus: "Marital status is required",
      }));
      return;
    }

    if (!studentDetails?.college) {
      setErrors((prev) => ({ ...prev, college: "college is required" }));
      return;
    } else if (studentDetails?.college?.trim().replace(/\s/g, "").length < 3) {
      setErrors((prev) => ({
        ...prev,
        college: "college must be at least 3 characters long",
      }));
      return;
    }
    if (
      !studentDetails?.aadharCardImage ||
      !studentDetails?.aadharCardImageData
    ) {
      setErrors((prev) => ({ ...prev, aadharCardImage: "Image is required" }));
      return;
    }

    if (!studentDetails?.aadharCardNumber) {
      setErrors((prev) => ({
        ...prev,
        aadharCardNumber: "Aadhar number is required",
      }));
      return;
    } else if (
      studentDetails?.aadharCardNumber?.trim().replace(/\s/g, "").length !== 12
    ) {
      setErrors((prev) => ({
        ...prev,
        aadharCardNumber: "Aadhar number be exactly 12 characters long",
      }));
      return;
    }
    if (!studentDetails?.zipcode) {
      setErrors((prev) => ({ ...prev, zipcode: "Pincode is required" }));
      return;
    } else if (
      studentDetails?.zipcode?.trim().replace(/\s/g, "").length !== 6
    ) {
      setErrors((prev) => ({
        ...prev,
        zipcode: "Pincode must be exactly 6 characters long",
      }));
      return;
    } else if (studentDetails?.zipcode?.toString().startsWith("0")) {
      setErrors((prev) => ({
        ...prev,
        zipcode: "Pincode's first digit cannot be 0",
      }));
      return;
    }
    if (!studentDetails?.country) {
      setErrors((prev) => ({ ...prev, country: "Country is required" }));
      return;
    } else if (studentDetails?.country?.trim().replace(/\s/g, "").length < 3) {
      setErrors((prev) => ({
        ...prev,
        country: "Country must be at least 3 characters long",
      }));
      return;
    }
    if (!studentDetails?.state) {
      setErrors((prev) => ({ ...prev, state: "state is required" }));
      return;
    } else if (studentDetails?.state?.trim().replace(/\s/g, "").length < 3) {
      setErrors((prev) => ({
        ...prev,
        state: "State must be at least 3 characters long",
      }));
      return;
    }
    if (!studentDetails?.native) {
      setErrors((prev) => ({ ...prev, native: "native is required" }));
      return;
    } else if (studentDetails?.native?.trim().replace(/\s/g, "").length < 3) {
      setErrors((prev) => ({
        ...prev,
        native: "Native Place must be at least 3 characters long",
      }));
      return;
    }
    if (!studentDetails?.area) {
      setErrors((prev) => ({ ...prev, area: "Area is required" }));
      return;
    } else if (studentDetails?.area?.trim().replace(/\s/g, "").length < 3) {
      setErrors((prev) => ({
        ...prev,
        area: "Area must be at least 3 characters long",
      }));
      return;
    }

    localStorage.setItem("studentDetails", JSON.stringify(studentDetails));
    handleNext();
  };

  const handleSubmitParentDetails = () => {
    if (!parentsDetails?.parentsname) {
      setErrors((prev) => ({
        ...prev,
        parentsname: "parentsname is required",
      }));
      return;
    } else if (
      parentsDetails?.parentsname?.trim().replace(/\s/g, "").length < 3
    ) {
      setErrors((prev) => ({
        ...prev,
        parentsname: "parentsname must be at least 3 characters long",
      }));
      return;
    }

    if (!parentsDetails?.parentsnumber) {
      setErrors((prev) => ({
        ...prev,
        parentsnumber: "Parent Number is required",
      }));

      return;
    } else {
      if (
        parentsDetails?.parentsnumber?.trim().replace(/\s/g, "")?.length !== 10
      ) {
        setErrors((prev) => ({
          ...prev,
          parentsnumber: "Number is invalid",
        }));
        return;
      } else if (parentsDetails?.parentsnumber?.toString().startsWith("0")) {
        setErrors((prev) => ({
          ...prev,
          parentsnumber: "Number is invalid",
        }));
        return;
      }
    }
    localStorage.setItem("parentsDetails", JSON.stringify(parentsDetails));
    handleNext();
  };

  const handleSubmitEducationDetails = () => {
    if (!educationDetails?.educationtype) {
      setErrors((prev) => ({
        ...prev,
        educationtype: "Education type is required",
      }));
      return;
    }
    if (!educationDetails?.marks) {
      setErrors((prev) => ({
        ...prev,
        marks: "Percentage is required",
      }));
      return;
    }
    if (
      !educationDetails?.academicyear ||
      parseInt(educationDetails?.academicyear) > currentYear ||
      educationDetails?.academicyear?.toString().startsWith("0") ||
      educationDetails?.academicyear?.toString().length !== 4
    ) {
      setErrors((prev) => ({
        ...prev,
        academicyear: "Enter Valid year",
      }));
      return;
    }

    localStorage.setItem("educationDetails", JSON.stringify(educationDetails));
    handleNext();
  };

  const handleSubmitAdmissionDetails = () => {
    if (!admissionDetails?.enquirydate) {
      setErrors((prev) => ({
        ...prev,
        enquirydate: "Enquiry Date is required",
      }));
      return;
    } else if (!admissionDetails?.enquirytakenby) {
      setErrors((prev) => ({
        ...prev,
        enquirytakenby: "Enquiry Taken by is required",
      }));
      return;
    } else if (!admissionDetails?.coursepackage) {
      setErrors((prev) => ({
        ...prev,
        coursepackage: "Course Package is required",
      }));
      return;
    } else if (!admissionDetails?.courses) {
      setErrors((prev) => ({ ...prev, courses: "Courses is required" }));
      return;
    } else if (!admissionDetails?.leadsource[0]?.source) {
      setErrors((prev) => ({
        ...prev,
        leadsource: "Lead Source is required",
      }));
      return;
    } else if (!admissionDetails?.branch) {
      setErrors((prev) => ({ ...prev, branch: "Branch is required" }));
      return;
    } else if (!admissionDetails?.modeoftraining) {
      setErrors((prev) => ({
        ...prev,
        modeoftraining: "Mode of Training is required",
      }));
      return;
    } else if (!admissionDetails?.admissiondate) {
      setErrors((prev) => ({
        ...prev,
        admissiondate: "Admission Date is required",
      }));
      return;
    } else if (!admissionDetails?.validitystartdate) {
      setErrors((prev) => ({
        ...prev,
        validitystartdate: "Validity Start Date is required",
      }));
      return;
    } else if (!admissionDetails?.validityenddate) {
      setErrors((prev) => ({
        ...prev,
        validityenddate: "Validity End Date is required",
      }));
      return;
    } else if (!admissionDetails?.readyToGoAbroad) {
      setErrors((prev) => ({
        ...prev,
        readyToGoAbroad: "Ready to go Abroad selection is required",
      }));
      return;
    }
    // if (admissionDetails?.voucherCode && !isVouherVerified) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     voucherCode: "Please verify the voucher code",
    //   }));
    //   return;
    // }

    localStorage.setItem("admissionDetails", JSON.stringify(admissionDetails));
    handleNext();
  };

  const handleSubmitFeeAndBillingDetails = () => {
    // localStorage.setItem("feeAndBillingDetails", JSON.stringify(feeAndBillingDetails));
    handleNext();
  };

  const handleSubmitOtherDetails = () => {
    if (!feeAndBillingDetails?.admissionremarks) {
      setErrors((prev) => ({
        ...prev,
        admissionremarks: "Admission Remarks is required",
      }));
      return;
    } else if (
      feeAndBillingDetails?.admissionremarks?.trim().replace(/\s/g, "").length <
      3
    ) {
      setErrors((prev) => ({
        ...prev,
        admissionremarks:
          "Admission Remarks must be at least 3 characters long",
      }));
      return;
    }

    localStorage.setItem(
      "feeAndBillingDetails",
      JSON.stringify(feeAndBillingDetails),
    );
    handleNext();
  };

  const handleSubmitSubmitEnrollement = async () => {
    const voucherDetails = JSON.parse(localStorage.getItem("VoucherData"));
    const enrollementData = {
      ...studentDetails,
      ...parentsDetails,
      ...educationDetails,
      ...admissionDetails,
      ...feeAndBillingDetails,
      // voucher_id: voucherDetails?.voucher_id ?? ""
      ...(voucherDetails?.voucher_id
        ? { voucher_id: voucherDetails.voucher_id }
        : {}),
      voucherLeadId: voucherDetails?.voucherLeadId,
    };

    const updatedData = {
      enrollementData: enrollementData,
      type: "CREATE_ENROLLEMENT",
    };

    try {
      await fetcher.submit(updatedData, {
        method: "POST",
        encType: "application/json",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //     if (fetcher.state === "idle" && fetcher.data) {
  //         if (fetcher.data.type === "SEND_OTP_TO_EMAIL") {
  //             setEmailVerificationState((prev) => {
  //                 if (
  //                     !prev.enableOTPInputFeild ||
  //                     prev.otpVerified ||
  //                     prev.emailOTP.some((otp) => otp !== "")
  //                 ) {
  //                     return {
  //                         ...prev,
  //                         enableOTPInputFeild: true,
  //                         otpVerified: false,
  //                         emailOTP: Array(6).fill(""),
  //                     };
  //                 }
  //                 return prev; // Prevents re-render if the state is the same
  //             });

  //             setCountDown(5 * 60);
  //             Swal.fire({
  //                 title: "Email Sent Successfully!",
  //                 text: "An OTP has been sent to your registered email address. Please check your inbox (or spam folder) and use the OTP to proceed.",
  //                 icon: "success",
  //             });
  //         }

  //         if (fetcher.data.type === "VERIFY_OTP_TO_EMAIL") {
  //             setEmailVerificationState((prev) => {
  //                 if (prev.enableOTPInputFeild || !prev.otpVerified) {
  //                     const updatedState = {
  //                         ...prev,
  //                         enableOTPInputFeild: false,
  //                         otpVerified: true,
  //                     };
  //                     localStorage.setItem("emailVerificationState", JSON.stringify(updatedState));
  //                     return updatedState;
  //                 }
  //                 return prev;
  //             });
  //             localStorage.setItem("studentDetails", JSON.stringify(studentDetails));
  //             setQuerys((prev) => ({
  //                 ...prev,
  //                 active: active + 1,
  //             }));

  //             Swal.fire({
  //                 title: "OTP Verified Successfully!",
  //                 text: "You have successfully verified your email address.",
  //                 icon: "success",
  //             });
  //         }

  //         // CREATE_ENROLLEMENT
  //         if (fetcher?.data?.type === "CREATE_ENROLLEMENT") {

  //             const updatedData = fetcher?.data?.data;
  //             const studentId = updatedData?.studentId
  //             // const studentId = updatedData?.student?.id
  //             navigate(`/student/feeUpdate?studentId=${studentId}`)
  //             localStorage.removeItem("emailVerificationState");
  //             localStorage.removeItem("studentDetails");
  //             localStorage.removeItem("parentsDetails");
  //             localStorage.removeItem("educationDetails");
  //             localStorage.removeItem("feeAndBillingDetails");
  //             localStorage.removeItem("admissionDetails");
  //             localStorage.removeItem("voucherVerified");
  //             localStorage.removeItem("voucherSuccessMessage");
  //             localStorage.removeItem("voucherCode");
  //             localStorage.removeItem("voucherAmount");
  //             localStorage.removeItem("VoucherData");
  //             Swal.fire({
  //                 title: "Enrollement Successful!",
  //                 text: "Enrollement has been submitted successfully.",
  //                 icon: "success",
  //             });
  //         }

  //     }
  // }, [fetcher.state, fetcher.data]);

  const studentApplicationPrintAction = async (data) => {
    try {
      return toast.promise(ERPApi.post(`/student/sendstudentpdf`, data), {
        pending: "Sending PDF...",
        success: "PDF sent successfully!",
        error: "Failed to send PDF ",
      });
    } catch (error) {
      console.error("Error sending PDF:", error);
      toast.error("An error occurred while sending the PDF.");
      return {
        success: false,
        message: "An error occurred while sending the PDF.",
      };
    }
  };

  const componentRefff = useRef();
  const [studentdata, setStudentData] = useState();
  let BirthDate = useFormattedDate(studentdata?.birthdate);
  let EnquiryDate = useFormattedDate(studentdata?.enquirydate);
  let AdmissionDate = useFormattedDate(studentdata?.admissiondate);
  let CourseStartDate = useFormattedDate(studentdata?.validitystartdate);
  let ExpectedEndDate = useFormattedDate(studentdata?.validityenddate);
  let IssueDate = useFormattedDate(studentdata?.admissiondate);

  const branchImage = studentdata?.branches?.logoName;
  const branchLogo = branchImage
    ? `https://teksacademy.s3.ap-south-1.amazonaws.com/branches/logos/${branchImage}`
    : null;
  useEffect(() => {
    let timer;

    if (isResendDisabled && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    if (resendTimer === 0) {
      setIsResendDisabled(false);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isResendDisabled, resendTimer]);
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      // 1. SEND OTP LOGIC
      if (fetcher.data.type === "SEND_OTP_TO_EMAIL") {
        setOtpSent(true);
        setResendTimer(45);
        setIsResendDisabled(true);
        setEmailVerificationState((prev) => {
          if (
            !prev.enableOTPInputFeild ||
            prev.otpVerified ||
            prev.emailOTP.some((otp) => otp !== "")
          ) {
            return {
              ...prev,
              enableOTPInputFeild: true,
              otpVerified: false,
              emailOTP: Array(6).fill(""),
            };
          }
          return prev;
        });

        setResendTimer(45);
        setIsResendDisabled(true);
        Swal.fire({
          title: "Email Sent Successfully!",
          text: "An OTP has been sent to your registered email address.",
          icon: "success",
        });
      }

      // 2. VERIFY OTP LOGIC
      if (fetcher.data.type === "VERIFY_OTP_TO_EMAIL") {
        setEmailVerificationState((prev) => {
          if (prev.enableOTPInputFeild || !prev.otpVerified) {
            const updatedState = {
              ...prev,
              enableOTPInputFeild: false,
              otpVerified: true,
            };
            localStorage.setItem(
              "emailVerificationState",
              JSON.stringify(updatedState),
            );
            return updatedState;
          }
          return prev;
        });
        localStorage.setItem("studentDetails", JSON.stringify(studentDetails));
        setQuerys((prev) => ({
          ...prev,
          active: active + 1,
        }));

        Swal.fire({
          title: "OTP Verified Successfully!",
          text: "You have successfully verified your email address.",
          icon: "success",
        });
      }

      // 3. CREATE_ENROLLEMENT & PDF SUBMISSION
      if (fetcher.data.type === "CREATE_ENROLLEMENT") {
        const updatedData = fetcher.data.data;
        const studentId = updatedData?.studentId;
        setStudentData(studentId);
      }
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    if (studentdata && fetcher.data?.type === "CREATE_ENROLLEMENT") {
      handlePDFAndCleanup();
    }
  }, [studentdata]); // This fires when setStudentData finishes updating

  const handlePDFAndCleanup = async () => {
    // Start PDF Generation
    const input = componentRefff.current;
    if (!input) {
      console.error("PDF Template ref not found");
      return;
    }

    try {
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
      const pdfFile = new File([pdfBlob], "Student_Application.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("email", studentdata?.email || "");
      formData.append("mobilenumber", studentdata?.mobilenumber || "");
      formData.append("studentName", studentdata?.name);

      // Submit PDF to server
      // fetcher.submit(formData, {
      //     method: "POST",
      //     encType: "multipart/form-data",
      // });
      studentApplicationPrintAction(formData);

      // 4. CLEANUP & SUCCESS
      localStorage.removeItem("emailVerificationState");
      localStorage.removeItem("studentDetails");
      localStorage.removeItem("parentsDetails");
      localStorage.removeItem("educationDetails");
      localStorage.removeItem("feeAndBillingDetails");
      localStorage.removeItem("admissionDetails");
      localStorage.removeItem("voucherVerified");
      localStorage.removeItem("voucherSuccessMessage");
      localStorage.removeItem("voucherCode");
      localStorage.removeItem("voucherAmount");
      localStorage.removeItem("VoucherData");

      await Swal.fire({
        title: "Enrollment Successful!",
        text: "Enrollment and Application submitted successfully.",
        icon: "success",
      });

      // Navigate after everything is done
      navigate(`/student/feeUpdate?studentId=${studentdata?.id}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire(
        "Error",
        "Enrollment was successful but PDF failed to generate.",
        "warning",
      );
      navigate(`/student/feeUpdate?studentId=${studentId}`);
    }
  };

  const [verifyVoucherLoading, setVerifyVoucherLoading] = useState(false);
  const [isVouherVerified, setIsVouherVerified] = useState(
    localStorage.getItem("voucherVerified") === "true" ? true : false,
  );
  const [voucherResponseData, setVoucherResponseData] = useState({
    success: {
      status: false,
      message: "",
      voucherDetails: null,
    },
    failed: {
      status: false,
      message: "",
    },
  });
  // const verifyVoucherCode = async (code) => {
  //   setErrors((prev) => ({ ...prev, voucherCode: "" }));
  //   setVerifyVoucherLoading(true);
  //   try {
  //     const VoucherResponse = await ERPApi.post("student/checkvoucher", {
  //       voucherCode: code,
  //       phone_number: studentDetails?.mobilenumber,
  //     });
  //     if (VoucherResponse.status === 200) {
  //       setVoucherResponseData((prev) => ({
  //         ...prev,
  //         success: {
  //           status: true,
  //           message:
  //             VoucherResponse.data.message ||
  //             "Voucher code verified successfully",
  //           voucherDetails: VoucherResponse?.data?.data || null,
  //         },
  //         failed: {
  //           status: false,
  //           message: "",
  //         },
  //       }));
  //       localStorage.setItem("voucherVerified", "true");
  //       localStorage.setItem(
  //         "VoucherData",
  //         JSON.stringify(VoucherResponse?.data?.data),
  //       );
  //       localStorage.setItem(
  //         "voucherCode",
  //         VoucherResponse?.data?.data?.voucherCode,
  //       );
  //       localStorage.setItem(
  //         "voucherAmount",
  //         VoucherResponse?.data?.data?.amount,
  //       );
  //       localStorage.setItem(
  //         "voucherAmount",
  //         VoucherResponse?.data?.data?.amount,
  //       );
  //       localStorage.setItem(
  //         "voucherSuccessMessage",
  //         VoucherResponse?.data?.message,
  //       );
  //       setIsVouherVerified(true);
  //     }
  //     return VoucherResponse.data;
  //   } catch (error) {
  //     console.error(error);
  //     setVoucherResponseData((prev) => ({
  //       ...prev,
  //       failed: {
  //         status: true,
  //         message:
  //           error?.response?.data?.message || "Failed to verify voucher code",
  //       },
  //     }));
  //     setVerifyVoucherLoading(false);
  //   } finally {
  //     setVerifyVoucherLoading(false);
  //   }
  // };

  return (
    <div className="position-relative">
      <BackButton heading="Registration Form" content="Back" to="/" />
      <div className="container-fluid">
        <div className="registration_form_section  ">
          <div className="top">
            <div className="registration_form_tabs row">
              <div className="button_grp col-lg-12 p-0">
                <button
                  type="button"
                  className={
                    active === 1
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100 "
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn"
                  }
                  style={{ cursor: "auto" }}
                >
                  Email
                </button>

                <button
                  type="button"
                  className={
                    active === 2
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100 "
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn"
                  }
                  style={{ cursor: "auto" }}
                >
                  Student Details
                </button>
                <button
                  type="button"
                  className={
                    active === 3
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                  style={{ cursor: "auto" }}
                >
                  Parent Details
                </button>
                <button
                  type="button"
                  className={
                    active === 4
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                  style={{ cursor: "auto" }}
                >
                  Education Details
                </button>
                <button
                  type="button"
                  className={
                    active === 5
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                  style={{ cursor: "auto" }}
                >
                  Admission Details
                </button>
                <button
                  type="button"
                  className={
                    active === 6
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                  style={{ cursor: "auto" }}
                >
                  Fee Details
                </button>
                <button
                  type="button"
                  className={
                    active === 7
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                  style={{ cursor: "auto" }}
                >
                  Billing Details
                </button>
                <button
                  type="button"
                  className={
                    active === 8
                      ? `${theme === "light"
                        ? "form_tab_btn active w-100"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                  style={{ cursor: "auto" }}
                >
                  Others Details
                </button>
                <button
                  type="button"
                  className={
                    active === 9
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
            </div>
          </div>
          <div className="bottom mt-3">
            <form
              className=""
            // onSubmit={handleSubmit}
            >
              {/* email */}

              {active === 1 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="email"
                      >
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.email
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="email"
                        name="email"
                        type="email"
                        required
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Enter the Email Address"
                        value={studentDetails?.email}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.email && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-3 mt-4 pt-2">
                      <Button
                        type="button"
                        className="btn btn-sm btn right btn_primary w-50"
                        onClick={handleSendOTPtoEmail}
                        disabled={isResendDisabled}
                        style={{
                          cursor: isResendDisabled ? "not-allowed" : "pointer",
                        }}
                        icon={<IoMdSend className="button_icons" />}
                      >
                        {fetcher.state === "submitting"
                          ? "Sending OTP..."
                          : isResendDisabled
                            ? `Resend in ${resendTimer}s`
                            : otpSent
                              ? "Resend OTP"
                              : "Send OTP"}
                      </Button>{" "}
                    </div>
                  </div>

                  <label
                    className="form-label fs-s text_color"
                    htmlFor="remail"
                  >
                    Enter OTP<span className="text-danger">*</span>
                  </label>
                  <div className="form-group text-start col-lg-6 col-md-6 d-flex">
                    <div className="otp-input-container">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <input
                          key={index}
                          name={`otp-${index}`}
                          type="text"
                          className="otp-input form-control"
                          disabled={
                            emailVerificationState?.enableOTPInputFeild ===
                            false
                          }
                          style={{
                            cursor:
                              emailVerificationState?.enableOTPInputFeild ===
                                false
                                ? "not-allowed"
                                : "",
                          }}
                          maxLength="1"
                          value={emailVerificationState?.emailOTP[index] || ""}
                          onChange={(e) => handleInputChangeEmail(e, index)}
                          onFocus={() => handleFocus(index)}
                          onKeyDown={(e) => handleKeyDownemail(e, index)}
                          ref={(el) => (inputRefs.current[index] = el)}
                        />
                      ))}

                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.emailOTP && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.emailOTP}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className={`btn ${emailVerificationState?.otpVerified === true ? "btn-success" : "btn_primary"}    btn-sm btn right  ms-5 w-100`}
                        onClick={() => handleVerifyOTP()}
                        disabled={
                          emailVerificationState?.enableOTPInputFeild ===
                          false ||
                          emailVerificationState?.otpVerficationOtpVerify ===
                          true
                        }
                        style={{
                          cursor:
                            emailVerificationState?.enableOTPInputFeild ===
                              false
                              ? "not-allowed"
                              : "",
                        }}
                      >
                        {fetcher.state === "submitting"
                          ? "Verifing..."
                          : fetcher.state === "loading"
                            ? "Loading.."
                            : emailVerificationState?.otpVerified === true
                              ? "Verified"
                              : "Verify"}
                      </button>
                    </div>
                  </div>
                  <div></div>
                  {/* <p className="fs-12 mt-2">{(emailVerificationState?.otpVerified === false && countdown > 0) ? `Expires in ${formatCountdown(countdown)}. You can resend the OTP after the timer ends.` : ""}</p> */}
                  {/* <p className="fs-12 mt-2"> {`Expires in ${formatCountdown(countdown)}. You can resend the OTP after the timer ends.`}</p> */}

                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {active !== 1 && (
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
                      {active !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleNext}
                          icon={<IoMdArrowForward />}
                          disabled={
                            emailVerificationState?.otpVerified === false
                          }
                          style={{
                            cursor:
                              emailVerificationState?.otpVerified === false
                                ? "not-allowed"
                                : "",
                          }}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Student Details Start */}
              {active === 2 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6 ">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="name"
                      >
                        Name<span className="text-danger">*</span>
                      </label>

                      <input
                        className={
                          errors && errors.name
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="name"
                        name="name"
                        type="text"
                        required
                        onChange={(e) => handleInputChange(e)}
                        value={studentDetails?.name}
                        placeholder="Enter your name"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.name && (
                          <span className="fs-xs text-danger ">
                            {errors.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="email"
                      >
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.email
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        style={{ cursor: "not-allowed" }}
                        id="email"
                        name="email"
                        type="email"
                        required
                        // onChange={(e) => setEmail(e.target.value)}
                        onChange={(e) => handleInputChange(e)}
                        value={studentDetails?.email}
                        placeholder="Enter your email address"
                        disabled
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors?.email && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        htmlFor="filename"
                        className="form-label fs-s text_color"
                      >
                        Choose your photo<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.filename
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="filename"
                        name="filename"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInputChange(e)}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors?.filename && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.filename}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="birthdate"
                      >
                        Date of Birth<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.birthdate
                            ? "form-control input_bg_color date_input_color error-input"
                            : "form-control input_bg_color date_input_color"
                        }
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => handleInputChange(e)}
                        value={studentDetails?.birthdate}
                      // onKeyDown={handleKeyDown}
                      />
                      <div style={{ height: "8px" }}>
                        {errors && errors.birthdate && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.birthdate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="mobilenumber"
                      >
                        Contact Number<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.mobilenumber
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="mobilenumber"
                        name="mobilenumber"
                        type="number"
                        // onKeyDown={handleKeyDown}
                        placeholder="Enter Contact Number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 10);

                          setErrors((prev) => ({
                            ...prev,
                            mobilenumber: "",
                          }));
                          setStudentDetails((prev) => ({
                            ...prev,
                            mobilenumber: value,
                          }));
                        }}
                        value={studentDetails?.mobilenumber}
                        maxLength={10}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.mobilenumber && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.mobilenumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="whatsappno"
                      >
                        Whatsapp Number<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.whatsappno
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="whatsappno"
                        name="whatsappno"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 10);
                          setErrors((prev) => ({
                            ...prev,
                            whatsappno: "",
                          }));
                          setStudentDetails((prev) => ({
                            ...prev,
                            whatsappno: value,
                          }));
                        }}
                        value={studentDetails?.whatsappno}
                        // onKeyDown={handleKeyDown}
                        placeholder="Enter WhatsApp number"
                        max="10"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors?.whatsappno && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.whatsappno}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="gender"
                      >
                        Gender<span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        {/* <IoChevronDownSharp className="position-absolute end-0 mt-2 me-2" /> */}
                        <select
                          className={
                            errors && errors.gender
                              ? "form-control form-select select input_bg_color error-input"
                              : "form-control form-select select input_bg_color text-capitalize"
                          }
                          aria-label="Default select example"
                          id="gender"
                          name="gender"
                          // onChange={(e) => setGender(e.target.value)}
                          onChange={(e) => handleInputChange(e)}
                          value={studentDetails?.gender}
                          required
                        >
                          <option disabled className="fs-s" value="">
                            Select your Gender
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.gender && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.gender}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="maritalstatus"
                      >
                        Marital Status<span className="text-danger">*</span>
                      </label>
                      <select
                        className={
                          errors && errors.maritalstatus
                            ? "form-control form-select  select input_bg_color error-input"
                            : "form-control form-select select  input_bg_color text-capitalize "
                        }
                        aria-label="Default select example"
                        id="maritalstatus"
                        name="maritalstatus"
                        required
                        onChange={(e) => handleInputChange(e)}
                        // onChange={(e) => setMaritalStatus(e.target.value)}
                        value={studentDetails?.maritalstatus}
                      >
                        <option disabled className="fs-s" value="">
                          Your Marital Status
                        </option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                      <div style={{ height: "8px" }}>
                        {errors && errors.maritalstatus && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.maritalstatus}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="college"
                      >
                        College/School/Company
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.college
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="college"
                        name="college"
                        type="text"
                        required
                        // onChange={(e) => setCollege(e.target.value)}
                        value={studentDetails?.college}
                        // onKeyDown={handleKeyDown}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="College/School/Company"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.college && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.college}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        htmlFor="aadharCardImage"
                        className="form-label fs-s text_color"
                      >
                        Upload Aadhar Card<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.aadharCardImage
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="aadharCardImage"
                        name="aadharCardImage"
                        // ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInputChange(e)}
                      // value={studentDetails?.aadharCardImage || ""}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors?.aadharCardImage && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.aadharCardImage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="zipcode"
                      >
                        Aadar card Number<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.aadharCardNumber
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        maxLength={12}
                        id="aadharCardNumber"
                        name="aadharCardNumber"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 12);
                          setErrors((prev) => ({
                            ...prev,
                            aadharCardNumber: "",
                          }));
                          setStudentDetails((prev) => ({
                            ...prev,
                            aadharCardNumber: value,
                          }));
                        }}
                        value={studentDetails?.aadharCardNumber}
                        // onKeyDown={handleKeyDown}
                        placeholder="Enter your aadhar number"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.aadharCardNumber && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.aadharCardNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="zipcode"
                      >
                        Pincode<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.zipcode
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        maxLength={6}
                        id="zipcode"
                        name="zipcode"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 6);
                          setErrors((prev) => ({
                            ...prev,
                            zipcode: "",
                          }));
                          setStudentDetails((prev) => ({
                            ...prev,
                            zipcode: value,
                          }));
                        }}
                        value={studentDetails?.zipcode}
                        // onKeyDown={handleKeyDown}
                        placeholder="Enter your pincode"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.zipcode && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.zipcode}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="country"
                      >
                        Country<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.country
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="country"
                        name="country"
                        type="text"
                        required
                        // onChange={(e) => setCountry(e.target.value)}
                        onChange={(e) => handleInputChange(e)}
                        value={studentDetails?.country}
                        placeholder="Enter your Country"
                      />

                      <div className="response" style={{ height: "9px" }}>
                        {errors && errors.country && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rstate"
                      >
                        State<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.state
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="state"
                        name="state"
                        type="text"
                        required
                        // onChange={(e) => setState(e.target.value)}
                        onChange={(e) => handleInputChange(e)}
                        value={studentDetails?.state}
                        placeholder="Enter your State"
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

                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="native"
                      >
                        Native Place<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.native
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="native"
                        name="native"
                        type="text"
                        required
                        // onChange={(e) => setNative(e.target.value)}
                        onChange={(e) => handleInputChange(e)}
                        value={studentDetails?.native}
                        placeholder="Enter your Native Place"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.native && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.native}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rarea"
                      >
                        Area<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.area
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="area"
                        type="text"
                        name="area"
                        required
                        // onChange={(e) => setArea(e.target.value)}
                        onChange={(e) => handleInputChange(e)}
                        value={studentDetails?.area}
                        placeholder="Enter your Area"
                      />
                      <div style={{ height: "8px" }}>
                        {errors && errors.area && (
                          <p className="text-danger m-0 fs-xs">{errors.area}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {active !== 1 && (
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
                      {active !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleSubmitStudentDetails}
                          icon={<IoMdArrowForward />}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* Student Details End */}

              {/* Parent Details start */}
              {active === 3 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="parentsname"
                      >
                        Parent&apos;s/Guardian&apos;s Name
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.parentsname
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="parentsname"
                        name="parentsname"
                        type="text"
                        required
                        onChange={(e) => handleInputChange(e)}
                        // onChange={(e) => setParentsName(e.target.value)}
                        value={parentsDetails?.parentsname}
                        placeholder="Enter Parent's/Guardian's Name"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.parentsname && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.parentsname}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="parentsnumber"
                      >
                        Parent&apos;s/Guardian&apos;s Contact
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.parentsnumber
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="parentsnumber"
                        name="parentsnumber"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 10);

                          setErrors((prev) => ({
                            ...prev,
                            parentsnumber: "",
                          }));
                          setParentsDetails((prev) => ({
                            ...prev,
                            parentsnumber: value,
                          }));
                        }}
                        value={parentsDetails?.parentsnumber}
                        // onKeyDown={handleKeyDown}
                        placeholder="Enter Parent's/Guardian's contact"
                        max="10"
                      />
                      <div style={{ height: "8px" }}>
                        {errors && errors?.parentsnumber && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.parentsnumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {active !== 1 && (
                        <Button
                          type="button"
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {active !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleSubmitParentDetails}
                          icon={<IoMdArrowForward />}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* Parent Details end */}

              {/* Education Details Start */}
              {active === 4 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="educationtype"
                      >
                        Education Type<span className="text-danger">*</span>
                      </label>
                      <select
                        className={
                          errors && errors.educationtype
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        id="educationtype"
                        name="educationtype"
                        required
                        onChange={(e) => handleInputChange(e)}
                        // onChange={handleEducationSelectChange}
                        value={educationDetails?.educationtype}
                      >
                        <option disabled className="fs-s" value="">
                          ---Select---
                        </option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="MCA">MCA</option>
                        <option value="SSC">SSC</option>
                        <option value="Other">Other</option>
                      </select>
                      <div style={{ height: "8px" }}>
                        {errors && errors?.educationtype && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.educationtype}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="marks"
                      >
                        Percentage<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.marks
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        maxLength={2}
                        id="marks"
                        name="marks"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 2);
                          setErrors((prev) => ({
                            ...prev,
                            marks: "",
                          }));
                          setEducationDetails((prev) => ({
                            ...prev,
                            marks: value,
                          }));
                        }}
                        value={educationDetails?.marks}
                        // onKeyDown={handleKeyDown}
                        placeholder="Enter your percentage"
                      />
                      <div style={{ height: "8px" }}>
                        {errors && errors.marks && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.marks}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="academicyear"
                      >
                        Academic Year<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.academicyear
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="academicyear"
                        name="academicyear"
                        type="number"
                        placeholder="Enter your academic year"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 4);
                          setErrors((prev) => ({
                            ...prev,
                            academicyear: "",
                          }));
                          setEducationDetails((prev) => ({
                            ...prev,
                            academicyear: value,
                          }));
                        }}
                        value={educationDetails?.academicyear}
                      />
                      <div style={{ height: "8px" }}>
                        {errors && errors.academicyear && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.academicyear}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {active !== 1 && (
                        <Button
                          type="button"
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {active !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleSubmitEducationDetails}
                          icon={<IoMdArrowForward />}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* Education Details End */}

              {/* Admission Details Start */}
              {active === 5 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="enquirydate"
                      >
                        Enquiry Date<span className="text-danger">*</span>
                      </label>

                      <input
                        className={
                          errors && errors.enquirydate
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        type="date"
                        id="enquirydate"
                        name="enquirydate"
                        onChange={(e) => handleInputChange(e)}
                        required
                        max={new Date().toISOString().split("T")[0]}
                        value={admissionDetails?.enquirydate}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors?.enquirydate && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.enquirydate}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="enquirytakenby"
                      >
                        Enquiry taken by<span className="text-danger">*</span>
                      </label>

                      <Select
                        className="fs-s bg-form text_color input_bg_color"
                        options={[
                          {
                            label: admissionDetails.enquirytakenby,
                            value: admissionDetails?.enquirytakenbyId,
                          },
                        ]}
                        classNamePrefix="select"
                        value={[
                          {
                            label: admissionDetails.enquirytakenby,
                            value: admissionDetails?.enquirytakenbyId,
                          },
                        ]}
                        onChange={(selectedOption) =>
                          handleInputChange(selectedOption, "enquirytakenby")
                        }
                        isDisabled
                        styles={{ cursor: "not-allowed" }}
                      />

                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.enquirytakenby && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.enquirytakenby}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="coursepackageId"
                      >
                        Course Package<span className="text-danger">*</span>
                      </label>

                      <Select
                        // className="fs-s bg-form text_color input_bg_color"

                        className={
                          errors && errors.enquirytakenby
                            ? "fs-s bg-form text_color input_bg_color error-input"
                            : "fs-s bg-form text_color input_bg_color"
                        }
                        options={coursePackageListData}
                        classNamePrefix="select"
                        value={
                          coursePackageListData.find(
                            (option) =>
                              option.value === admissionDetails.coursepackageId,
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange(selectedOption, "coursepackage")
                        }
                      />

                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors?.coursepackage && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.coursepackage}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="coursesId"
                      >
                        Course<span className="text-danger">*</span>
                      </label>

                      <Select
                        className="fs-s bg-form text_color input_bg_color"
                        options={coursesList}
                        classNamePrefix="select"
                        value={
                          coursesList?.find(
                            (option) =>
                              option.value === admissionDetails?.coursesId,
                          ) || [
                            {
                              label: admissionDetails.courses,
                              value: admissionDetails.coursesId,
                            },
                          ]
                        }
                        onChange={(selectedOption) =>
                          handleInputChange(selectedOption, "courses")
                        }
                      />

                      <div style={{ height: "8px" }}>
                        {errors && errors?.courses && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.courses}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="leadsourceId"
                      >
                        Lead Source<span className="text-danger">*</span>
                      </label>

                      {/* <Select
                        className="fs-s bg-form text_color input_bg_color"
                        options={leadSourceList}
                        classNamePrefix="select"
                        value={
                          leadSourceList.find(
                            (option) =>
                              option.value === admissionDetails.leadsourceId,
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          handleInputChange(selectedOption, "leadsource")
                          console.log("selectedOption", selectedOption)
                        }
                        }
                      /> */}
                      <SearchSelect
                        className="fs-s bg-form text_color input_bg_color"
                        placeholder="Select Lead Source"
                        value={
                          selectedLeadSource
                        }
                        defaultOptions={leadSourceList.length ? leadSourceList : true}
                        onChange={(selectedOption,val) =>{
                          handleInputChange(val, "leadsource")
                          setSelectedLeadSource(val)
                        }
                        }
                        fetchOptions={async (search) => {
                          try {
                            const res = await ERPApi.get(`/settings/getleadsource`, {
                              params: { search: search || "" },
                            });

                            const data = res?.data?.leadSourceData || [];

                            return data.map((item) => ({
                              label: item?.leadsource,
                              value: item?.id,
                            }));
                          } catch (error) {
                            console.error("Error fetching lead sources:", error);
                            return [];
                          }
                        }}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors?.leadsource && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.leadsource}
                          </p>
                        )}
                      </div>

                      {(admissionDetails.leadsourceId === 7 ||
                        admissionDetails.leadsourceId === 8 ||
                        admissionDetails.leadsourceId === 13) && (
                          <div className="mt-3">
                            <label
                              htmlFor=""
                              className="form-label fs-s text_color"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              className="form-control input_bg_color"
                              required
                              onChange={(e) =>
                                setAdmissionDetails((prev) => ({
                                  ...prev,
                                  leadsource: prev.leadsource?.length
                                    ? prev.leadsource.map((item, index) =>
                                      index === 0
                                        ? { ...item, name: e.target.value }
                                        : item,
                                    )
                                    : [{ name: e.target.value }],
                                }))
                              }
                              value={admissionDetails?.leadsource[0]?.name || ""}
                            />
                            <label
                              htmlFor=""
                              className="form-label fs-s text_color"
                            >
                              Mobile Number
                            </label>
                            <input
                              type="number"
                              className="form-control input_bg_color"
                              required
                              onChange={(e) => {
                                let value = e.target.value.slice(0, 10);
                                setAdmissionDetails((prev) => ({
                                  ...prev,
                                  leadsource: prev.leadsource?.length
                                    ? prev.leadsource.map((item, index) =>
                                      index === 0
                                        ? { ...item, mobileNumber: value }
                                        : item,
                                    )
                                    : [{ mobileNumber: value }],
                                }));
                              }}
                              value={
                                admissionDetails?.leadsource[0]?.mobileNumber ||
                                ""
                              }
                            />
                          </div>
                        )}
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="branch"
                      >
                        Branch<span className="text-danger">*</span>
                      </label>

                      <Select
                        className="fs-s  bg-form text_color input_bg_color"
                        options={BranchsList}
                        classNamePrefix="select"
                        value={
                          BranchsList.find(
                            (option) =>
                              option.value === admissionDetails.branchId,
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          handleInputChange(selectedOption, "branch")
                        }
                        isDisabled
                        styles={{ cursor: "not-allowed" }}
                      />

                      <div style={{ height: "8px" }}>
                        {errors && errors?.branch && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.branch}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="modeoftraining"
                      >
                        Mode Of Training<span className="text-danger">*</span>
                      </label>
                      <select
                        className={
                          errors && errors.modeoftraining
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        id="modeoftraining"
                        name="modeoftraining"
                        required
                        onChange={(e) => handleInputChange(e)}
                        value={admissionDetails?.modeoftraining}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="self-learning">Self Learning</option>
                      </select>
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.modeoftraining && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.modeoftraining}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="voucherCode"
                      >
                        Voucher Code
                      </label>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control input_bg_color"
                          required
                          placeholder="Enter Voucher Code"
                          name="voucherCode"
                          id="voucherCode"
                          onChange={(e) => {
                            setErrors((prev) => ({ ...prev, voucherCode: "" }));
                            setAdmissionDetails((prev) => ({
                              ...prev,
                              voucherCode: e.target.value,
                            }));
                          }}
                          disabled={
                            localStorage.getItem("voucherVerified") == "true" ||
                            isVouherVerified
                          }
                          style={
                            isVouherVerified ? { cursor: "not-allowed" } : {}
                          }
                          value={
                            localStorage.getItem("voucherCode")
                              ? localStorage.getItem("voucherCode")
                              : admissionDetails?.voucherCode?.toUpperCase() ||
                              ""
                          }
                        />
                        {(localStorage.getItem("voucherVerified") !== "true" ||
                          !isVouherVerified) && (
                            <Button
                              type="button"
                              className="btn  right btn_primary "
                              onClick={(e) =>
                                verifyVoucherCode(admissionDetails?.voucherCode)
                              }
                            >
                              {verifyVoucherLoading ? "Verifying..." : "Verify"}
                            </Button>
                          )}
                      </div>
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.voucherCode && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.voucherCode}
                          </p>
                        )}
                      </div>
                      <div className="response" style={{ height: "8px" }}>
                        {voucherResponseData &&
                          (localStorage.getItem("voucherVerified") ||
                            voucherResponseData?.success?.status === true) ? (
                          <p className="text-success m-0 fs-xs">
                            {localStorage.getItem("voucherSuccessMessage")
                              ? localStorage.getItem("voucherSuccessMessage")
                              : voucherResponseData?.success?.message}
                          </p>
                        ) : (
                          voucherResponseData?.failed?.status === true && (
                            <p className="text-danger m-0 fs-xs">
                              {voucherResponseData?.failed?.message}
                            </p>
                          )
                        )}
                      </div>
                    </div> */}

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="admissiondate"
                      >
                        Admission Date<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.admissiondate
                            ? "form-control input_bg_color error-input date_input_color"
                            : "form-control input_bg_color date_input_color"
                        }
                        id="admissiondate"
                        type="date"
                        name="admissiondate"
                        required
                        onChange={(e) => handleInputChange(e)}
                        value={admissionDetails?.admissiondate}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors?.admissiondate && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.admissiondate}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="readyToGoAbroad"
                      >
                        Ready to go Abroad<span className="text-danger">*</span>
                      </label>

                      <select
                        className={
                          errors && errors.readyToGoAbroad
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        id="readyToGoAbroad"
                        name="readyToGoAbroad"
                        required
                        onChange={(e) => handleInputChange(e)}
                        value={admissionDetails?.readyToGoAbroad}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>

                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors.readyToGoAbroad && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.readyToGoAbroad}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="validitystartdate"
                      >
                        Validity Start Date
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.validitystartdate
                            ? "form-control input_bg_color error-input date_input_color"
                            : "form-control input_bg_color date_input_color"
                        }
                        id="validitystartdate"
                        type="date"
                        name="validitystartdate"
                        onChange={(e) => handleInputChange(e)}
                        value={admissionDetails?.validitystartdate}
                        required
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errors && errors?.validitystartdate && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.validitystartdate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="validityenddate"
                      >
                        Validity End Date<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.validityenddate
                            ? "form-control input_bg_color error-input date_input_color"
                            : "form-control input_bg_color date_input_color"
                        }
                        id="validityenddate"
                        type="date"
                        name="validityenddate"
                        onChange={(e) => handleInputChange(e)}
                        value={admissionDetails?.validityenddate}
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <div style={{ height: "8px" }}>
                        {errors && errors?.validityenddate && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.validityenddate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {active !== 1 && (
                        <Button
                          type="button"
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {active !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleSubmitAdmissionDetails}
                          icon={<IoMdArrowForward />}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* Admission Details End */}

              {/* Fee Details Start */}
              {active === 6 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="feetype"
                      >
                        Fee Type<span className="text-danger">*</span>
                      </label>
                      <select
                        className={
                          errors && errors.feetype
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        name="feetype"
                        id="feetype"
                        required
                        onChange={(e) => handleInputChange(e)}
                        value={feeData.feetype}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>
                        <option value="Admission Fee">Admission Fee</option>
                        <option value="fee">Course Fee</option>
                      </select>
                      <div style={{ height: "8px" }}>
                        {errors && errors.feetype && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.feetype}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="amount"
                      >
                        Amount<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.amount
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="amount"
                        type="number"
                        name="amount"
                        placeholder="Enter Fee Amount"
                        required
                        onChange={(e) => handleInputChange(e)}
                        value={feeData?.amount}
                        disabled
                        style={{ cursor: "not-allowed" }}
                      />

                      <div style={{ height: "8px" }}>
                        {errors && errors?.amount && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.amount}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="discount"
                      >
                        Discount
                      </label>
                      <input
                        className={"form-control input_bg_color"}
                        id="discount"
                        type="number"
                        name="discount"
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Enter the Discount"
                        required
                        disabled={
                          feeData.feetype === "fee" &&
                          (localStorage.getItem("voucherVerified") == "true" ||
                            isVouherVerified)
                        }
                        value={feeData?.discount}
                      />
                    </div>

                    <div className="col-lg-3 form-group text-start align-middle mt-4 pt-2">
                      <Button
                        onClick={handleFeeDetails}
                        className="btn btn_primary fs-13"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  {feeAndBillingDetails?.feedetails.length > 0 && (
                    <div className="row mt-3">
                      <div className="col-xl-12 ">
                        <div className="table-responsive ">
                          <table className="table table-hover align-midle table-nowrap mb-0">
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  className="fs-13 lh-xs black_color text_color"
                                >
                                  Fee Type
                                </th>
                                <th
                                  scope="col"
                                  className="fs-13 lh-xs black_color fw-600 text_color"
                                >
                                  Amount
                                </th>
                                <th
                                  scope="col"
                                  className="fs-13 lh-xs black_color fw-600 text_color"
                                >
                                  Discount
                                </th>
                                <th
                                  scope="col"
                                  className="fs-13 lh-xs black_color fw-600 text_color"
                                >
                                  Tax Amount
                                </th>
                                <th
                                  scope="col"
                                  className="fs-13 lh-xs black_color fw-600 text_color"
                                >
                                  Total Amount
                                </th>
                                <th
                                  scope="col"
                                  className="fs-13 lh-xs black_color fw-600 text_color"
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {feeAndBillingDetails?.feedetails.length > 0 &&
                                feeAndBillingDetails?.feedetails.map((item) => (
                                  <tr key={item?.id}>
                                    <td className="fw-medium fs-13 text_color">
                                      {item?.feetype}
                                    </td>
                                    <td className="fs-13 text_color">
                                      {item?.amount}
                                    </td>
                                    <td className="fs-13 text_color">
                                      {item?.discount}
                                    </td>
                                    <td className="fs-13 text_color">
                                      {parseFloat(item?.taxamount?.toFixed(2))}
                                    </td>
                                    <td className="fs-13 text_color">
                                      {item?.totalamount}
                                    </td>
                                    <td
                                      onClick={() => handleFeeDelete(item?.id)}
                                    >
                                      <MdDelete className="text_danger" />
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {active !== 1 && (
                        <Button
                          type="button"
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {active !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleFeecalculations}
                          icon={<IoMdArrowForward />}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* Fee Details End */}

              {/* Billing Start */}
              {active === 7 && (
                <>
                  <div className="row">
                    <div className="col-xl-12 ">
                      <div className="table-responsive ">
                        <table className="table table-hover align-midle table-nowrap mb-0">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="fs-13 lh-xs black_color fw-600 text_color"
                              >
                                Gross Total
                              </th>
                              <th
                                scope="col"
                                className="fs-13 lh-xs black_color fw-600 text_color"
                              >
                                Total Discount
                              </th>
                              <th
                                scope="col"
                                className="fs-13 lh-xs black_color fw-600 text_color"
                              >
                                Total Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="fs-13  text_color">
                                {feeAndBillingDetails?.grosstotal}
                              </td>
                              <td className="fs-13  text_color">
                                {feeAndBillingDetails?.totaldiscount}
                              </td>
                              <td className="fs-13  text_color">
                                {feeAndBillingDetails?.finaltotal}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-xl-12 ">
                      <div className="table-responsive mt-2 ">
                        <table className="table table-hover align-midle table-nowrap mb-0">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="fs-13 lh-xs black_color fw-600 text_color"
                              >
                                Fee Type
                              </th>
                              <th
                                scope="col"
                                className="fs-13 lh-xs black_color fw-600 text_color"
                              >
                                Fee (Excl. of GST)
                              </th>
                              <th
                                scope="col"
                                className="fs-13 lh-xs black_color fw-600 text_color"
                              >
                                Tax
                              </th>
                              <th
                                scope="col"
                                className="fs-13 lh-xs black_color fw-600 text_color"
                              >
                                Fee (Incl. of GST)
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {feeAndBillingDetails?.feedetailsbilling?.length >
                              0 &&
                              feeAndBillingDetails?.feedetailsbilling?.map(
                                (item) => {
                                  if (item.feetype !== "Material Fee") {
                                    return (
                                      <tr key={item?.id}>
                                        <td className=" fs-13 text_color">
                                          {item?.feetype}
                                        </td>
                                        <td className=" fs-13 text_color">
                                          {parseFloat(
                                            item?.feewithouttax.toFixed(2),
                                          )}
                                        </td>
                                        <td className=" fs-13 text_color">
                                          {parseFloat(item?.feetax.toFixed(2))}
                                        </td>
                                        <td className=" fs-13 text_color">
                                          {parseFloat(
                                            item?.feewithtax.toFixed(2),
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                },
                              )}

                            {feeAndBillingDetails?.feedetailsbilling?.length >
                              0 && (
                                <tr>
                                  <td className="fw-medium fs-13 text_color">
                                    <b>Sub Total</b>
                                  </td>
                                  <td className=" fs-13 text_color">
                                    {parseFloat(
                                      feeAndBillingDetails?.totalfeewithouttax.toFixed(
                                        2,
                                      ),
                                    )}
                                  </td>
                                  <td className=" fs-13 text_color">
                                    {parseFloat(
                                      feeAndBillingDetails?.totaltax.toFixed(2),
                                    )}
                                  </td>
                                  <td className=" fs-13 text_color">
                                    {parseFloat(
                                      feeAndBillingDetails?.grandtotal.toFixed(2),
                                    )}
                                  </td>
                                </tr>
                              )}

                            <tr>
                              <td rowSpan={3} />
                              <td rowSpan={3} />
                              <td className="fs-13 text_color">Material Fee</td>
                              <td className="fs-13 text_color">
                                {feeAndBillingDetails?.materialfee}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-medium fs-13 text_color">
                                <strong> Grand Total</strong>
                              </td>
                              <td className="fs-13 text_color">
                                {feeAndBillingDetails?.finaltotal}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {active !== 1 && (
                        <Button
                          type="button"
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {active !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleNext}
                          icon={<IoMdArrowForward />}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* Billing End */}

              {/* Others Start */}
              {active === 8 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6 ">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="admissionremarks"
                      >
                        Remarks<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errors && errors.admissionremarks
                            ? "form-control input_bg_color error-input date_input_color"
                            : "form-control input_bg_color date_input_color"
                        }
                        id="admissionremarks"
                        type="text"
                        name="admissionremarks"
                        placeholder="Enter your Remarks"
                        required
                        onChange={(e) => handleInputChange(e)}
                        value={feeAndBillingDetails?.admissionremarks}
                      />
                      <div style={{ height: "25px" }}>
                        {errors && errors?.admissionremarks && (
                          <p className="text-danger m-0 fs-xs">
                            {errors?.admissionremarks}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-check-label fs-s text_color"
                        htmlFor="cardtableCheck"
                      >
                        Assets
                      </label>

                      <div className="w-100 ">
                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="linkedIn"
                          >
                            LinkedIn
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="linkedIn"
                            name="linkedIn"
                            checked={feeAndBillingDetails?.assets?.includes(
                              "linkedIn",
                            )}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="paidInternship"
                          >
                            Paid Internship
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="paidInternship"
                            name="paidInternship"
                            checked={feeAndBillingDetails?.assets?.includes(
                              "paidInternship",
                            )}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="employmentDocument"
                          >
                            Employment Document
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="employmentDocument"
                            name="employmentDocument"
                            checked={feeAndBillingDetails?.assets?.includes(
                              "employmentDocument",
                            )}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="bag"
                          >
                            Bag
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="bag"
                            name="bag"
                            checked={feeAndBillingDetails?.assets?.includes(
                              "bag",
                            )}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="laptop"
                          >
                            Laptop
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="laptop"
                            name="laptop"
                            checked={feeAndBillingDetails?.assets?.includes(
                              "laptop",
                            )}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="lms"
                          >
                            LMS
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="lms"
                            name="lms"
                            checked={feeAndBillingDetails?.assets?.includes(
                              "lms",
                            )}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="courseMaterial"
                          >
                            Course Material
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="courseMaterial"
                            name="courseMaterial"
                            checked={feeAndBillingDetails?.assets?.includes(
                              "courseMaterial",
                            )}
                            onChange={handleInputChange}
                          />
                        </div>

                        {shouldShowMacAndTshirt && (
                          <div className="form-check ">
                            <label
                              className="form-check-label fs-s text_color"
                              htmlFor="mac"
                            >
                              Mac
                            </label>
                            <input
                              className="form-check-input input_bg_color text_color"
                              type="checkbox"
                              id="mac"
                              name="mac"
                              checked={feeAndBillingDetails?.assets?.includes(
                                "mac",
                              )}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}

                        {/* --- Conditional T-shirt Size Dropdown --- */}
                        {shouldShowMacAndTshirt && (
                          <div className="form-group mt-3">
                            {" "}
                            <label
                              className="form-check-label fs-s text_color"
                              htmlFor="tshirtSize"
                            >
                              T-shirt Size
                            </label>
                            <select
                              className="form-select select input_bg_color text_color"
                              id="tshirtSize"
                              name="tshirtSize"
                              value={feeAndBillingDetails?.tshirtSize || ""} // Controlled component
                              onChange={handleInputChange}
                            >
                              <option value="">Select Size</option>
                              <option value="xs">XS</option>
                              <option value="s">S</option>
                              <option value="m">M</option>
                              <option value="l">L</option>
                              <option value="xl">XL</option>
                              <option value="2xl">2XL</option>
                              <option value="3xl">3XL</option>
                              <option value="4xl">4XL</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {active !== 1 && (
                        <Button
                          type="button"
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {active !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleSubmitOtherDetails}
                          icon={<IoMdArrowForward />}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* Others End */}

              {/* Preview Starts */}
              {active === 9 && (
                <>
                  <div className="">
                    <div className="card p-2">
                      <div className="">
                        <div className="row">
                          <div className="col-4 d-flex justify-content-start h-155 mt-2">
                            <img
                              className="col-lg-4 col-md-6  col-sm-4 h-100 object-fit-cover"
                              style={{ border: "4px solid  #b3b9d0" }}
                              src={studentDetails?.imagePerview}
                              alt="user_img"
                              width={"50%"}
                            />
                          </div>
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="table-responsive table-scroll">
                              <tbody className="fs-13 ">
                                <tr className="lh-400">
                                  <td
                                    className=" ps-0 black_300 fw-500   fs-13"
                                    scope="row"
                                  >
                                    Name
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                    <span className="ms-4">: </span>
                                    {studentDetails?.name}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className=" ps-0 black_300 fw-500   fs-13"
                                    scope="row"
                                  >
                                    Email
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                    <span className="ms-4">: </span>
                                    {studentDetails?.email}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className=" ps-0 black_300 fw-500   fs-13"
                                    scope="row"
                                  >
                                    Date Of Birth
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                    <span className="ms-4">: </span>
                                    {studentDetails?.birthdate}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className=" ps-0 black_300 fw-500   fs-13"
                                    scope="row"
                                  >
                                    Contact
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                    <span className="ms-4">: </span>{" "}
                                    {studentDetails?.mobilenumber}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className=" ps-0 black_300 fw-500   fs-13"
                                    scope="row"
                                  >
                                    Aadhar Number
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                    <span className="ms-4">: </span>{" "}
                                    {studentDetails?.aadharCardNumber}
                                  </td>
                                </tr>
                              </tbody>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6  col-sm-12 ">
                            <div className="table-responsive table-scroll">
                              <tbody>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Pincode
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {studentDetails?.zipcode}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Country
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {studentDetails?.country}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    State
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {studentDetails?.state}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Native Place
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {studentDetails?.native}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Area
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {studentDetails?.area}
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
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    WhatsApp Number
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>{" "}
                                    {studentDetails?.whatsappno}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Gender
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {studentDetails?.gender}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Marital Status
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>{" "}
                                    {studentDetails?.maritalstatus}
                                  </td>
                                </tr>
                              </tbody>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6  col-sm-12 ">
                            <div className="table-responsive table-scroll">
                              <tbody>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Parent&apos;s Name
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {parentsDetails?.parentsname}
                                  </td>
                                </tr>

                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Parent&apos;s Number
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>{" "}
                                    {parentsDetails?.parentsnumber}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Academic Year
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>{" "}
                                    {educationDetails?.academicyear}
                                  </td>
                                </tr>
                              </tbody>
                              {/* <p className="text_color">
                          <b className="prev_bold">Relation:</b> Other
                        </p> */}
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6  col-sm-12">
                            <div className="table-responsive table-scroll">
                              <tbody>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Lead Source
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-4">: </span>
                                    {admissionDetails?.leadsource[0]?.source}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Branch
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-4">: </span>{" "}
                                    {admissionDetails?.branch}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Mode Of Training
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-4">: </span>{" "}
                                    {admissionDetails?.modeoftraining}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Admission Date
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-4">: </span>{" "}
                                    {admissionDetails?.admissiondate}
                                  </td>
                                </tr>
                              </tbody>
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-6  col-sm-4">
                            <div className="table-responsive table-scroll">
                              <tbody>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Validity Start Date
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>{" "}
                                    {admissionDetails?.validitystartdate}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Validity End Date
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {admissionDetails?.validityenddate}
                                  </td>
                                </tr>

                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Education Type
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {educationDetails?.educationtype}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Percentage
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {educationDetails?.marks}
                                  </td>
                                </tr>
                              </tbody>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6  col-sm-12">
                            <div className="table-responsive table-scroll">
                              <tbody>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Enquiry Date
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {admissionDetails?.enquirydate}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Enquiry taken by
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>{" "}
                                    {admissionDetails?.enquirytakenby}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Course Package
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>{" "}
                                    {admissionDetails?.coursepackage}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Course
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {admissionDetails?.courses}
                                  </td>
                                </tr>
                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13 text-truncate"
                                    style={{ maxWidth: "120px" }}
                                    title="College/School/Company"
                                    scope="row"
                                  >
                                    College/School/Company
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {studentDetails?.college}
                                  </td>
                                </tr>
                              </tbody>
                            </div>
                          </div>

                          <div className="col-lg-12 ">
                            <div className="table-responsive mt-2 ">
                              <table className="table table-hover align-midle table-nowrap mb-0">
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      className="fs-13 lh-xs black_color fw-600 text_color"
                                    >
                                      Fee Type
                                    </th>
                                    <th
                                      scope="col"
                                      className="fs-13 lh-xs black_color fw-600 text_color"
                                    >
                                      Amount
                                    </th>
                                    <th
                                      scope="col"
                                      className="fs-13 lh-xs black_color fw-600 text_color"
                                    >
                                      Discount
                                    </th>
                                    <th
                                      scope="col"
                                      className="fs-13 lh-xs black_color fw-600 text_color"
                                    >
                                      Tax Amount (Inclusive of GST)
                                    </th>
                                    <th
                                      scope="col"
                                      className="fs-13 lh-xs black_color fw-600 text_color"
                                    >
                                      Total Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {feeAndBillingDetails?.feedetails &&
                                    feeAndBillingDetails?.feedetails?.map(
                                      (item, index) => (
                                        <tr key={index}>
                                          <td className="fs-13 text_color">
                                            {item?.feetype}
                                          </td>
                                          <td className="fs-13 text_color">
                                            {item?.amount}
                                          </td>
                                          <td className="fs-13 text_color">
                                            {item?.discount}
                                          </td>
                                          <td className="fs-13 text_color">
                                            {parseFloat(
                                              item?.taxamount,
                                            ).toFixed(2)}
                                          </td>
                                          <td className="fs-13 text_color">
                                            {item.feetype === "fee" ? (
                                              <>
                                                Materialfee:{" "}
                                                {
                                                  feeAndBillingDetails?.materialfee
                                                }
                                                &nbsp;, CourseFee:{" "}
                                                {item.totalamount -
                                                  feeAndBillingDetails?.materialfee}
                                                <br />
                                                <b>{item.totalamount}</b>
                                              </>
                                            ) : (
                                              <b>{item.totalamount}</b>
                                            )}
                                          </td>
                                        </tr>
                                      ),
                                    )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="col-lg-12 col-md-6 ">
                            {feeAndBillingDetails?.admissionremarks && (
                              <p className="text_color">
                                <b className="prev_bold"> Remarks:</b>{" "}
                                {feeAndBillingDetails?.admissionremarks}
                              </p>
                            )}
                            {feeAndBillingDetails?.assets?.length > 0 && (
                              <p className="text_color">
                                <b className="prev_bold">Assets:</b>{" "}
                                {feeAndBillingDetails?.assets?.map(
                                  (item, index) => (
                                    <span key={index}>
                                      {index ===
                                        feeAndBillingDetails?.assets.length - 1
                                        ? item
                                        : item + ", "}{" "}
                                    </span>
                                  ),
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {active !== 1 && (
                        <Button
                          type="button"
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {active === 9 && (
                        <Button
                          type="submit"
                          className="btn  right btn_primary "
                          onClick={() => handleSubmitSubmitEnrollement()}
                          icon={<IoMdCheckmark />}
                          disabled={
                            fetcher.state === "submitting" ||
                            fetcher.state === "loading"
                          }
                          style={{
                            cursor:
                              fetcher.state === "submitting" ||
                                fetcher.state === "loading"
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {/* Submit */}
                          {fetcher.state === "submitting"
                            ? "Submitting...!"
                            : fetcher.state === "loading"
                              ? "Loading.."
                              : "Submit"}
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* Preview ENd */}
            </form>
          </div>
        </div>
      </div>

      <div
        className="container-fluid "
        ref={componentRefff}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "210mm",
        }}
      >
        <div className="page">
          <div className="application">
            <div className="row">
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
              <div className="col-12 col-md-6 col-lg-6 col-xl-6 text-center ">
                <img
                  src={ mainLogo}
                  alt="Branch Logo"
                  className=" w-75 "
                />
                <p className="fs-15 mt-4 black_300">
                  <b className="">Branch:</b> Kukatpally, Hyderabad
                </p>
              </div>
              <div className=" mt-3 ">
                <div className="">
                  <h5 className=" text-center caption p-2">Student Details</h5>
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
                                  studentdata.leadsource.map(
                                    (source, index) => (
                                      <td className="borderleft" key={index}>
                                        {source.source}
                                      </td>
                                    ),
                                  )
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
                                {ExpectedEndDate ? ExpectedEndDate : "No Date"}
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
                                {CourseStartDate ? CourseStartDate : "No Date"}
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
                                      parseFloat(item.amount).toFixed(2),
                                    ).toLocaleString("en-IN")}
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {item.discount &&
                                      Number(
                                        parseFloat(item.discount).toFixed(2),
                                      ).toLocaleString("en-IN")}

                                    {!item.discount && <>0</>}
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {" "}
                                    {Number(
                                      parseFloat(item.taxamount).toFixed(2),
                                    ).toLocaleString("en-IN")}
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {Number(
                                      parseFloat(item.totalamount).toFixed(2),
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
                  <h5 className=" text-center caption  asset p-2"> Assets</h5>
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
                    <h5 className="fs-14 fw-600 black_300"> 1.Admission:</h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1. Students must provide all required documents and
                      information during the admission process.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2. Admission will be confirmed only after payment of the
                      booking amount, as decided by the management from time to
                      time.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300"> 2. Fees:</h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1. Students shall pay the course fees as per the due dates
                      / terms mentioned overleaf. Fees shall not
                      refundable/non-transferable/non-adjustable, under any
                      circumstances.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.Late payment of fees shall attract penal interest @1.5%
                      per month.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      3.Teks academy reserves its right to cancel the admission,
                      in case of non-payment of fees, as per the agreed due
                      dates.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      4. Course fees may vary from student to student, based on
                      their merit and other relevant factors as determined by
                      the Teks Academy (“Academy) administration, at its sole
                      discretion.
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
                      reproduced or used for commercial purposes without written
                      permission of the Academy.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.Any damage or loss of course material will be the
                      responsibility of the student and shall attract additional
                      charges for extra material copy of the course material as
                      decided by the administration from time to time.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300"> 4. Attendence:</h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1. Regular attendance is essential for successfully
                      completing the course and obtaining a certificate.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.In case of Continuous absence of 3 classes, without
                      intimation, Academy reserves its right, to terminate the
                      admission.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      3.In case of absence, Make-up / Extra classes may be
                      arranged at the discretion of the Academy and subject to
                      availability of resources. For clarity, the Academy is not
                      obliged to provide the makeup/extra classes.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300 ">5. Conduct</h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1.Students must conduct themselves respectfully towards
                      the Academy staff, fellow students, and not spoil the
                      Academy's property.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.Any form of harassment, discrimination, or bullying will
                      not be tolerated and may lead to immediate expulsion of
                      the student from the Academy.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      3.Use of drugs or alcohol within the Academy's premises is
                      strictly prohibited and shall lead to immediate expulsion
                      from the Academy.
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
                      criteria, as decided by the management from time to time.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.The certificate does not guarantee employment or
                      acceptance/admission into any institution.student from the
                      Academy.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">7. Liablity:</h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1.The Academy is not responsible for any injury, loss, or
                      damage to the students or their belongings within the
                      Academy's premises or during any offsite activit
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
                      regulations, course structure, fees, timings, or any other
                      aspect of the Academy at its sole discretion from time to
                      time, without prior notice to the students.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.Such revised policies will be applicable to all existing
                      and new students.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">
                      9. Dispute Resolutions:
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1.Any dispute arising out of or related to these terms and
                      conditions shall be resolved amicably through mutual
                      discussion and agreement between the Academy and the
                      student. Any unresolved dispute shall be subject to the
                      jurisdiction of the courts of Hyderabad, Telangana, India.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">
                      10. Termination of Admission:
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1.The Academy reserves the right to terminate the
                      admission of any student at any time, without assigning
                      any reason.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.In such cases, Academy may at its sole discretion,
                      refund a portion of the fees that completely depends on
                      Academy’s decision and on the duration of the course
                      completed by the student.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">
                      11. No Placemets Guarantee
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1.The Academy does not provide any placement guarantee to
                      the students but may assist them in finding suitable job
                      opportunities through guidance, counseling.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600  black_300">
                      12. Using Id Card
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1.Each student will be issued an identification card (ID
                      card) by the Academy, and it must be carried by the
                      student at all times while attending classes or any other
                      activities conducted by the Academy.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300 ">
                      13. Copiying Institute Content
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1.Distributing any of the any other Academy's / Coaching
                      centers brochures /course material, including lectures,
                      notes, presentations, or any other content, promoting of
                      any other coaching institutes is strictly prohibited. Any
                      violation of this rule may lead to immediate expulsion
                      from the Academy and legal action may be taken against the
                      student.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300 next-page  student-data">
                      14. Teaching Staff:
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1.While the Academy will endeavor to provide training with
                      a specific teaching staff member, there is no commitment
                      to do so.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.The Academy reserves the right to assign trainers based
                      on availability, and students cannot demand a specific
                      trainer.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">
                      15. Course Curriculum
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1. The Academy reserves the right to update the course
                      curriculum at its discretion, without any prior notice to
                      the students.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.Students are expected to keep themselves updated with
                      any changes in the course curriculum.
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
                      2.The Academy will not guarantee any specific internship
                      or job placement.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      3.The Academy may charge a separate fee for providing
                      internship support services.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      4.The Academy will not be liable for any issues or
                      disputes that arise between the student and the internship
                      provider.
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
                      2.The projects assigned may be either Capstone, live or
                      previously completed projects, depending on availability
                      and suitability.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      3.Students must complete the project within the given time
                      frame and submit it to the Academy for evaluation.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600  black_300">
                      19. Intellectual Property:
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      1.All intellectual property created by students during the
                      live project or internship belongs to the Academy.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      2.The Academy may use such intellectual property for
                      promotional or educational purposes, at its sole
                      discretion.
                    </p>

                    <p className="black_300 fs-14 ms-3">
                      3.The Academy will not claim any ownership rights over the
                      student's intellectual property.
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
                      address, phone number, and other details from students at
                      the time of enrollment.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">
                      2. Use Of Information:
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      We use the information collected to contact students
                      regarding course updates, provide course materials, and
                      issue certificates of completion.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">
                      3. Information Sharing:
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      We do not share personal information with any third
                      parties without the student's consent, except as required
                      by law.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">4. Security:</h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      We take reasonable measures to ensure the security of the
                      personal information collected from students.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">5. Cookies:</h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      We use cookies on our website to track user behavior and
                      improve the user experience. Students can disable cookies
                      in their web browser if they choose to do so.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">
                      6. Data Retention :
                    </h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      We retain personal information for as long as necessary to
                      provide the course and related services, or until the
                      student requests that their information be deleted.
                    </p>
                  </div>

                  <div className="ps-4">
                    <h5 className="fs-14 fw-600 black_300">7.Modification:</h5>

                    <p className="black_300 fs-14 ms-3">
                      {" "}
                      We reserve the right to modify this privacy policy at any
                      time without prior notice.
                    </p>
                  </div>

                  <div className="p-4">
                    <p className="black_300 fs-14 ">
                      By signing this form, you acknowledge that you have read,
                      understood, and agree to abide by the terms and conditions
                      and privacy policy.{" "}
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
                      <h6 className="fs-14 fw-600 p-2 black_300"> Place :</h6>
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
  );
};

export default StudentRegistrationFrom;
