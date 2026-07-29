import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../../../dataLayer/context/themeContext/ThemeContext";
import { IoMdArrowBack, IoMdCheckmark, IoMdArrowForward, IoMdSend } from "react-icons/io";
import "../../../../assets/css/RegistrationForm.css";
import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext";
import { useLeadSourceContext } from "../../../../dataLayer/hooks/useLeadSourceContext";
import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext";
import { useCoursePackage } from "../../../../dataLayer/hooks/useCoursePackage";
import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
import { MdDelete } from "react-icons/md";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";

function RegistrationForm() {
  // * Active Tab start

  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();
  const [isPopupOpen, setPopupOpen] = useState(false);
  let select = "select";
  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  const { BranchState } = useBranchContext();
  const { leadSourceState } = useLeadSourceContext();
  const { courseState, getAllCourses } = useCourseContext();
  const { coursePackageState } = useCoursePackage();

  const { getPaginatedStudentsData } = useStudentsContext();

  const navigate = useNavigate();

  // registration form data
  const [user_id, setuserid] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return userData?.user?.id || "";
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [parentsname, setParentsName] = useState("");
  const [parentsnumber, SetParentsNumber] = useState("");
  const [birthdate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [maritalstatus, setMaritalStatus] = useState("");
  const [college, setCollege] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [area, setArea] = useState("");
  const [native, setNative] = useState("");
  const [zipcode, setZipcode] = useState(null);
  const [whatsappno, setWhatsAppNo] = useState(null);
  const [educationtype, setEducationType] = useState("");
  const [marks, setMarks] = useState("");
  const [academicyear, setAcademicyear] = useState("");
  const [aadharCardImage, setAadharCardImage] = useState("")
  const [aadharCardNumber, setAadharCardNumber] = useState("")
  // const [studentImage, setSelectedFile] = useState(null);
  // const [profilepic, setProfilePic] = useState("");
  const [enquirydate, setEnquiryDate] = useState("");
  const [enquirytakenby, setEnquiryTakenBy] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return userData?.user?.fullname || "";
  });

  // const [branch, setBranch] = useState(() => {
  //   const userData = JSON.parse(localStorage.getItem("data"));
  //   return userData?.user?.branch || "";
  // })

  const [branch, setBranch] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return {
      branch: userData?.user?.branch || "",
      branchId: userData?.user?.branchId || null,
    };
  });

  const [coursepackage, setCoursepakage] = useState("");

  const [courses, setCourses] = useState({
    courses: "",
    coursesId: null,
  });



  const [coursesList, setCoursesList] = useState([]);

  const [coursePackage, setCoursePackage] = useState({
    coursepackage: "",
    coursepackageId: null,
  });

  const handleCoursePackage = (e) => {
    setCoursePackage((prev) => ({
      ...prev,
      coursepackage: e.target.options[e.target.selectedIndex].text,
      coursepackageId: parseInt(e.target.value),
    }));
    fetchCourseListByCoursePackage(e.target.value);
  };

  const fetchCourseListByCoursePackage = async (coursepackageId) => {
    try {
      const { data, status } = await ERPApi.get(
        `batch/course/getcoursesfromcoursepackage/${coursepackageId}`
      );
      if (status === 200) {
        setCoursesList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [leadsource, setLeadSource] = useState("");

  // const [branch, setBranch] = useState("");
  const [modeoftraining, setModeOfTraining] = useState("");
  // const [admissionstatus, setAdmissionStatus] = useState("");
  const [registrationnumber, setRegistrationNumber] = useState("");
  const [admissiondate, setAdmissionDate] = useState("");
  const [validitystartdate, setValidityStartDate] = useState("");
  const [validityenddate, setValidityEndDate] = useState("");

  const [feetype, setfeetype] = useState("");
  const [amount, setAmount] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [taxamount, setTaxamount] = useState(null);
  const [totalamount, setTotalamount] = useState(null);

  const [feedetails, setFeeDetails] = useState([]);
  const [grosstotal, setGrosstotal] = useState(null);
  const [totaldiscount, setTotalDiscount] = useState(0);
  const [totaltax, settotaltax] = useState(null);
  const [grandtotal, setGrandtotal] = useState(null);
  const [finaltotal, setfinaltotal] = useState(null);
  const [admissionremarks, setadmissionremarks] = useState("");
  const [assets, setassets] = useState([]);
  const [initialpayment, setinitialamount] = useState([]);
  const [dueamount, setdueamount] = useState(null);
  const [totalinstallments, settotalinstallments] = useState(0);
  const [duedatetype, setduedatetype] = useState("");
  const [addfee, setaddfee] = useState(false);
  const [installments, setinstallments] = useState([]);
  const [leadsourceOptions, setleadsourceOptions] = useState(false);

  const [CustomLeadSource, setCustomLeadSource] = useState("");
  const [feedetailsbilling, setfeedetailsbilling] = useState([]);
  const [materialfee, setmaterialfee] = useState(null);

  const [totalfeewithouttax, settotalfeewithouttax] = useState(null);
  const [totalpaidamount, settotalpaidamount] = useState(0);
  const [educationOthersOption, setEducationOthersOption] = useState(false);
  const [customEducationType, setCustomEducationType] = useState("");
  const [student_status, setStudent_status] = useState([]);
  const [certificate_status, setcertificate_status] = useState([
    {
      courseStartDate: "",
      courseEndDate: "",
      certificateStatus: "",
      requistedDate: "",
      issuedDate: "",
    },
  ]);

  const [validations, setValidations] = useState({
    student: false,
    parent: false,
    education: false,
    admission: false,
    fee: false,
    billings: false,
    others: false,
    preview: false,
    // Add more tab numbers and set their initial validation status
  });

  const currentYear = new Date().getFullYear();


  const handleTabClick = (tabNumber) => {
    // Check if current tab is valid before navigating
    if (validations.student) {
      return setActiveTab(tabNumber);
    }
    if (validations.parent) {
      return setActiveTab(tabNumber);
    }
    if (validations.education) {
      return setActiveTab(tabNumber);
    }
    if (validations.admission) {
      return setActiveTab(tabNumber);
    }
    if (validations.fee) {
      return setActiveTab(tabNumber);
    }
    if (validations.others) {
      return setActiveTab(tabNumber);
    } else {
      toast.error("Please fill in all required fields before proceeding.");
    }
  };

  const [errorState, setErrorState] = useState({});
  const [extra_discount, setExtra_Discount] = useState([]);
  let LoggedInuser = JSON.parse(localStorage.getItem("user"));
  let userName;

  // if (LoggedInuser) {
  //   userName = LoggedInuser.fullname;
  //   setEnquiryTakenBy(userName);
  // }

  const [imageUrl, setImageUrl] = useState(null);
  // const [imageName, setImageName] = useState("");
  const displayImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result; // Get the base64 image data
      setImageUrl(imageUrl);
    };

    reader.readAsDataURL(file);
  };


  useEffect(() => {
    if (LoggedInuser) {
      userName = LoggedInuser.fullname;
      setEnquiryTakenBy(userName);
      setBranch({
        branch: LoggedInuser?.branch || "",
        branchId: LoggedInuser?.branchId || null,
      });
    }
  }, [LoggedInuser]);

  const handleAssetChange = (event) => {
    const assetName = event.target.name;
    if (event.target.checked) {
      // Add the selected asset to the array
      setassets([...assets, assetName]);
    } else {
      // Remove the asset from the array if it's unchecked
      setassets(assets.filter((asset) => asset !== assetName));
    }
  };


  const handleEducationSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "others") {
      setEducationOthersOption(true);
      setCustomEducationType("");
      setEducationType(selectedValue);
    } else {
      setEducationOthersOption(false);
      setEducationType(selectedValue);
    }
  };
  const handleLeadSourceSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (
      selectedValue.toLowerCase().split(" ").filter(Boolean).join(" ") ===
      "student referral" ||
      selectedValue.toLowerCase().split(" ").filter(Boolean).join(" ") ===
      "employee referral" ||
      selectedValue.toLowerCase().split(" ").filter(Boolean).join(" ") ===
      "student reference" ||
      selectedValue.toLowerCase().split(" ").filter(Boolean).join(" ") ===
      "employee reference"
    ) {
      setleadsourceOptions(true);
      setCustomLeadSource({ source: selectedValue });
      setLeadSource([{ source: selectedValue }]);
    } else {
      setleadsourceOptions(false);
      setCustomLeadSource({ source: selectedValue });
      setLeadSource([{ source: selectedValue }]);
    }
  };

  const handleFeecalculations = () => {
    function validateFeedetails(feedetails) {
      const admissionFeeExists = feedetails.some(
        (item) => item.feetype === "Admission Fee"
      );
      const feeExists = feedetails.some((item) => item.feetype === "fee");

      if (!admissionFeeExists || !feeExists) {
        // Validation failed

        return false;
      }

      // Validation passed
      return true;
    }

    if (validateFeedetails(feedetails)) {
      let grosstotall = 0;
      let totaldiscountt = 0;
      let totalfeewithouttaxx = 0;
      let totaltaxx = 0;
      let grandtotall = 0;
      let materialfeee = 0;

      const array = [];
      for (let i = 0; i < feedetails.length; i++) {
        if (feedetails[i].feetype === "Admission Fee") {
          let admissionobject = {
            id: "",
            feetype: "",
            feewithtax: 0,
            feewithouttax: 0,
            feetax: 0,
          };
          admissionobject.id = feedetails[i].id;
          admissionobject.feetype = "Admission Fee";
          admissionobject.feewithtax = feedetails[i].totalamount;
          admissionobject.feewithouttax = admissionobject.feewithtax / 1.18;
          admissionobject.feetax =
            admissionobject.feewithtax - admissionobject.feewithouttax;
          grosstotall = grosstotall + parseInt(feedetails[i].amount);
          // totaldiscountt = totaldiscountt + parseInt(feedetails[i].discount);
          totaldiscountt = 0;
          totalfeewithouttaxx =
            totalfeewithouttaxx + admissionobject.feewithouttax;
          totaltaxx = totaltaxx + admissionobject.feetax;
          grandtotall = grandtotall + admissionobject.feewithtax;

          array.push(admissionobject);
        }
        if (feedetails[i].feetype === "fee") {
          let coursefeeobject = {
            id: "",
            feetype: "",
            feewithtax: 0,
            feewithouttax: 0,
            feetax: 0,
          };
          coursefeeobject.id = feedetails[i].id;
          coursefeeobject.feetype = "Course Fee";
          coursefeeobject.feewithtax = feedetails[i].totalamount * 0.7;
          coursefeeobject.feewithouttax = coursefeeobject.feewithtax / 1.18;
          coursefeeobject.feetax =
            coursefeeobject.feewithtax - coursefeeobject.feewithouttax;
          // settotalfeewithouttax((value) => value + coursefeeobject.feewithouttax);
          // settotaltax((value) => value + coursefeeobject.feetax);
          // setGrandtotal((value) => value + coursefeeobject.feewithtax);
          grosstotall = grosstotall + Math.round(feedetails[i].amount * 0.7);
          totaldiscountt =
            totaldiscountt + parseInt(feedetails[i].discount * 0.7);

          totalfeewithouttaxx =
            totalfeewithouttaxx + coursefeeobject.feewithouttax;
          totaltaxx = totaltaxx + coursefeeobject.feetax;
          grandtotall = grandtotall + coursefeeobject.feewithtax;
          array.push(coursefeeobject);
          let materialfeeobject = {
            id: "",
            feetype: "",
            feewithtax: 0,
            feewithouttax: 0,
            feetax: 0,
          };
          materialfeeobject.id = feedetails[i].id;
          materialfeeobject.feetype = "Material Fee";
          materialfeeobject.feewithtax = Math.round(
            feedetails[i].totalamount * 0.3
          );
          materialfeeobject.feewithouttax = materialfeeobject.feewithtax;
          materialfeeobject.feetax = 0;

          // settotalfeewithouttax(
          //   (value) => value + materialfeeobject.feewithouttax
          // );
          // settotaltax((value) => value + materialfeeobject.feetax);
          // setGrandtotal((value) => value + materialfeeobject.feewithtax);
          grosstotall = grosstotall + parseInt(feedetails[i].amount * 0.3);
          totaldiscountt =
            totaldiscountt + parseInt(feedetails[i].discount * 0.3);
          materialfeee =
            materialfeee + Math.round(feedetails[i].totalamount * 0.3);
          // totalfeewithouttaxx =
          //   totalfeewithouttaxx + materialfeeobject.feewithouttax;
          totaltaxx = totaltaxx + materialfeeobject.feetax;
          // grandtotall = grandtotall + materialfeeobject.feewithtax;
          array.push(materialfeeobject);
        }
      }
      setTotalDiscount(totaldiscountt);
      setGrosstotal(grosstotall);
      settotalfeewithouttax(totalfeewithouttaxx);
      settotaltax(totaltaxx);
      setGrandtotal(grandtotall);
      setfeedetailsbilling(array);
      setmaterialfee(materialfeee);
      if (feedetails.length === 0) {
        toast.error("please enter feedetails");
        return;
      }
      setValidations((prev) => ({ ...prev, fee: true }));
      handleNext();
    } else {
      setErrorState((prev) => ({ ...prev, feetype: "Fee type is required" }));
      setErrorState((prev) => ({ ...prev, amount: "Amount is required" }));
    }
  };


  useEffect(() => {
    setfinaltotal(grandtotal + materialfee);
  }, [grandtotal, materialfee]);


  useEffect(() => {
    setdueamount(finaltotal);
  }, [finaltotal]);


  useEffect(() => {
    setTotalamount(amount - discount);
    let actualfee = (totalamount * 100) / 118;

    setTaxamount(totalamount - actualfee);
  });

  // fee binding as per course selected

  useEffect(() => {
    if (feetype === "Admission Fee") {
      setAmount(500);
    }
    if (feetype === "fee") {
      // let course = courseState?.courses?.filter(
      //   (course) =>
      //     course.course_name === courses?.courses &&
      //     course.course_package === coursePackage.coursepackage
      // );

      let course = coursesList.filter((course) => {
        return (
          course.id === courses?.coursesId
        )
      })
      if (course.length > 0) {
        setAmount(course[0].fee);
      } else {
        setAmount("");
      }
    }
  }, [
    feetype,
    courses?.courses,
    courses?.coursesId,
    coursePackage?.coursepackage,
    courseState,
    coursesList,
  ]);

  const handleDiscount = (e) => {
    if (feetype === "Admission Fee") {
      if (parseInt(e.target.value) > 500) {
        return
      }
      else {
        setDiscount(parseInt(e.target.value));
      }

    }
    if (feetype === "fee") {
      setDiscount(parseInt(e.target.value));
    }

  }

  const handleFeeDetails = (e) => {
    e.preventDefault();
    if (!feetype) {
      setErrorState((prev) => ({ ...prev, feetype: "Fee type is required" }));
      return;
    }

    if (!amount) {
      setErrorState((prev) => ({ ...prev, amount: "Amount is required" }));
      return;
    }
    const existingAdmissionFee = feedetails.some(
      (item) => item.feetype === "Admission Fee"
    );
    const existingRegularFee = feedetails.some(
      (item) => item.feetype === "fee"
    );

    // Validate that only one admission fee and one regular fee are allowed
    if (feetype === "Admission Fee" && existingAdmissionFee) {
      toast.error("Admission Fee is only accepted once.");
      return;
    }

    if (feetype === "fee" && existingRegularFee) {
      toast.error("Fee is only Allowed Once");
      return;
    }
    let save = true;
    if (feetype === "fee") {
      let course = courseState.courses.filter(
        (course) =>
          course.course_name === courses?.courses &&
          course.course_package === coursePackage?.coursepackage
      );

      if (
        course.length > 0 &&
        parseInt(discount) > parseInt(course[0].max_discount) &&
        course[0].course_name === courses?.courses &&
        course[0].course_package === coursePackage?.coursepackage
      ) {
        save = false;
        toast.error(
          `Discount cannot be greater than ${course[0].max_discount}`
        );
      }
    }
    if (save) {
      setFeeDetails([
        ...feedetails,
        {
          id: Date.now(),
          feetype: feetype,
          amount: amount,
          discount: discount ? discount : 0,
          taxamount: taxamount,
          totalamount: totalamount,
        },
      ]);
      setfeetype("");
      setAmount("");
      setDiscount("");
      setTaxamount(0);
      setTotalamount(0);
    }
  };


  // * ------------------validations------------------;

  const [otpLoading, setOtpLoading] = useState({
    email: false,
    otp: false
  });
  const [enableOTPInput, setEnableOTPInput] = useState(false);
  const [emailOTP, setEmailOTP] = useState(Array(6).fill(""));
  const [countdown, setCountdown] = useState(0); // Countdown in seconds

  const [OtpVerify, setOtpVerify] = useState(false);

  // Initialize an array for OTP values
  const inputRefs = useRef([]);


  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) { // Allow only digits
      const newOTP = [...emailOTP];
      newOTP[index] = value;
      setEmailOTP(newOTP);

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
    if (e.key === "Backspace" && !emailOTP[index] && index > 0) {
      inputRefs.current[index - 1].focus(); // Move to the previous input field on backspace
    }
  };



  const handleEmailOPT = async () => {
    if (!email) {
      setErrorState((prev) => ({ ...prev, email: "Email is required" }));
      return;
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(email)) {
        setErrorState((prev) => ({ ...prev, email: "Invalid Email Address" }));
        return;
      }
    }

    const emaildata = {
      email
    }
    // /student/sendotp
    setOtpLoading((prev) => ({
      ...prev,
      email: true,
    }));

    try {
      const { data, status } = await toast.promise(
        ERPApi.post(`/student/sendotp`, emaildata),
        {
          pending: "Sending the OTP to email",
        }
      );
      if (status === 200) {
        setEnableOTPInput(true);
        setEmailOTP(Array(6).fill(""));
        setOtpVerify(false);

        setCountdown(5 * 60); // Start a 5-minute countdown (300 seconds)
        // Simulate OTP sending
        setTimeout(() => {
          setOtpLoading({ email: false });
        }, 2000); // Simulate API call duration
        Swal.fire({
          title: "Email Sent Successfully!",
          text: "An OTP has been sent to your registered email address. Please check your inbox (or spam folder) and use the OTP to proceed.",
          icon: "success",
        });
      }
    }
    catch (error) {
      console.error(error);

      const errorMessgae = error?.response?.data?.message

      setEnableOTPInput(false);
      Swal.fire({
        title: "Email Sending Failed!",
        text: errorMessgae ? errorMessgae : "We encountered an issue while trying to send the OTP to your email. Please check your email address and try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });

    }
    finally {
      setOtpLoading((prev) => ({
        ...prev,
        email: false,
      }));
    }
  };

  const handleVerfiyOTP = async () => {

    const OtpNumber = Number(emailOTP.join(""));

    if (!OtpNumber) {
      setErrorState((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }
    else if (OtpNumber.toString().length < 6 || OtpNumber.toString().length === 5) {
      setErrorState((prev) => ({ ...prev, otp: "OTP must be 6 digits long" }));
      return;
    };

    const emailUpdatedData = {
      email: email,
      emailOtp: OtpNumber.toString(),
    }

    setOtpLoading((prev) => ({
      ...prev,
      otp: true,
    }));
    try {
      const { data, status } = await toast.promise(
        ERPApi.post(`/student/validateotp`, emailUpdatedData),
        {
          pending: "Sending the OTP to email",
        }
      );
      if (status === 200) {
        setOtpVerify(true);
        const suucessMesssage = data?.message;
        setErrorState((prev) => ({ ...prev, otp: "" }));
        setActiveTab((prevActiveTab) => prevActiveTab + 1);

        Swal.fire({
          title: "OTP Verified Successfully!",
          text: suucessMesssage ? suucessMesssage : "Your OTP has been verified. You can proceed to the next step.",
          icon: "success",
          confirmButtonText: "Continue",
        });
      }
    }
    catch (error) {
      setErrorState((prev) => ({ ...prev, otp: "" }));
      setOtpVerify(false)
      console.error(error);
      const errorMessgae = error?.response?.data?.message
      Swal.fire({
        title: "OTP Verification Failed!",
        text: errorMessgae ? errorMessgae : "The OTP you entered is incorrect or expired. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
    finally {
      setOtpLoading((prev) => ({
        ...prev,
        otp: false,
      }));
    }
  };


  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup interval on unmount or countdown reset
    }
  }, [countdown]);

  // Format countdown as MM:SS
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };




  const handletheEmailandOtp = async () => {
    if (!email) {
      setErrorState((prev) => ({ ...prev, email: "Email is required" }));
      return;
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(email)) {
        setErrorState((prev) => ({ ...prev, email: "Invalid Email Address" }));
        return;
      }
    }
    handleNext();
  }

  const handleBasicDetails = async () => {
    if (!name) {
      setErrorState((prev) => ({ ...prev, name: "Name is required" }));
      return;
    } else if (name.length < 3) {
      setErrorState((prev) => ({
        ...prev,
        name: "Name must be at least 3 characters long",
      }));
      return;
    }
    if (!email) {
      setErrorState((prev) => ({ ...prev, email: "Email is required" }));
      return;
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(email)) {
        setErrorState((prev) => ({ ...prev, email: "Invalid Email Address" }));
        return;
      }
    }

    if (!imageUrl) {
      setErrorState((prev) => ({ ...prev, imageUrl: "Image is required" }));
      return;
    }

    if (!birthdate) {
      setErrorState((prev) => ({ ...prev, dob: "Date of birth is required" }));
      return;
    }

    if (!mobilenumber) {
      setErrorState((prev) => ({ ...prev, contact: "Contact is required" }));
      return;
    } else {
      if (mobilenumber.length !== 10) {
        setErrorState((prev) => ({
          ...prev,
          contact: "Incorrect mobile number",
        }));
        return;
      }
    }

    if (!whatsappno) {
      setErrorState((prev) => ({ ...prev, wpNum: "WhatsApp Number required" }));
      return;
    } else {
      if (whatsappno.length !== 10) {
        setErrorState((prev) => ({
          ...prev,
          wpNum: "Incorrect WhatsApp number",
        }));
        return;
      }
    }

    if (!aadharCardImage) {
      setErrorState((prev) => ({ ...prev, aadharCardImage: "Aadhar Image is required" }));
      return;
    }
      if (!aadharCardNumber) {
      setErrorState((prev) => ({ ...prev, aadharCardNumber: "aadhar Number required" }));
      return;
    } else {
      if (aadharCardNumber.length !== 10) {
        setErrorState((prev) => ({
          ...prev,
          aadharCardNumber: "Incorrect WhatsApp number",
        }));
        return;
      }
    }

    if (!gender) {
      setErrorState((prev) => ({ ...prev, gender: "Gender is required" }));
      return;
    }

    if (!maritalstatus) {
      setErrorState((prev) => ({
        ...prev,
        marital: "Marital status is required",
      }));
      return;
    }

    if (!college) {
      setErrorState((prev) => ({ ...prev, college: "college is required" }));
      return;
    } else if (college.length < 3) {
      setErrorState((prev) => ({
        ...prev,
        college: "college must be at least 3 characters long",
      }));
      return;
    }

    if (!zipcode) {
      setErrorState((prev) => ({ ...prev, pincode: "Pincode is required" }));
      return;
    } else if (zipcode.length !== 6) {
      setErrorState((prev) => ({
        ...prev,
        pincode: "Pincode must be exactly 6 characters long",
      }));
      return;
    }
    if (!country) {
      setErrorState((prev) => ({ ...prev, country: "country is required" }));
      return;
    } else if (country.length < 3) {
      setErrorState((prev) => ({
        ...prev,
        country: "country must be at least 3 characters long",
      }));
      return;
    }
    if (!state) {
      setErrorState((prev) => ({ ...prev, state: "state is required" }));
      return;
    } else if (state.length < 3) {
      setErrorState((prev) => ({
        ...prev,
        state: "state must be at least 3 characters long",
      }));
      return;
    }
    if (!native) {
      setErrorState((prev) => ({ ...prev, native: "native is required" }));
      return;
    } else if (native.length < 3) {
      setErrorState((prev) => ({
        ...prev,
        native: "native must be at least 3 characters long",
      }));
      return;
    }
    if (!area) {
      setErrorState((prev) => ({ ...prev, area: "area is required" }));
      return;
    } else if (area.length < 3) {
      setErrorState((prev) => ({
        ...prev,
        area: "area must be at least 3 characters long",
      }));
      return;
    }

    // Checking for similar number and email

    try {
      const response = await ERPApi.get(
        `${import.meta.env.VITE_API_URL}/student/mobemailregdata`
      );

      if (response && response.data && response?.data?.students.length < 0) {
        handleNext();
      }

      if (
        response &&
        response?.data &&
        response?.data?.students &&
        response?.data?.students.length > 0
      ) {
        const students = response?.data?.students?.map((student) => student);

        // if you get back an empty array then it will throw a console error
        if (!students || students.length === 0) {
          console.error("No student data found.");
          return;
        }

        // Check if email exists or not
        const emailExists = students?.some(
          (student) => student.email === email
        );

        // Check if phone exists or not
        const phoneExists = students?.some(
          (student) => student.mobilenumber === mobilenumber
        );

        if (emailExists) {
          setErrorState((prev) => ({ ...prev, email: "Email already exists" }));
          return;
        }
        if (phoneExists) {
          setErrorState((prev) => ({
            ...prev,
            contact: "Phone number already exists",
          }));
          return;
        }
      }
      setValidations((prev) => ({ ...prev, student: true }));
      handleNext();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOtherChanges = () => {
    if (!admissionremarks) {
      setErrorState((prev) => ({
        ...prev,
        admissionremarks: "Admission Remarks is required",
      }));
      return;
    }
    setValidations((prev) => ({ ...prev, others: true }));
    handleNext();
  };

  const handleParentDetails = () => {
    if (!parentsname) {
      setErrorState((prev) => ({
        ...prev,
        parentsname: "parentsname is required",
      }));
      return;
    } else if (parentsname.length < 3) {
      setErrorState((prev) => ({
        ...prev,
        parentsname: "parentsname must be at least 3 characters long",
      }));
      return;
    }

    if (!parentsnumber) {
      setErrorState((prev) => ({
        ...prev,
        parentsnumber: "Parent Number is required",
      }));

      return;
    } else {
      if (parentsnumber.length !== 10) {
        setErrorState((prev) => ({
          ...prev,
          parentsnumber: "Number is invalid",
        }));

        return;
      }
    }
    setValidations((prev) => ({ ...prev, parent: true }));

    handleNext();
  };
  const handleEducationDetails = () => {
    if (!educationtype) {
      setErrorState((prev) => ({
        ...prev,
        educationtype: "Education type is required",
      }));
      return;
    }
    if (!marks) {
      setErrorState((prev) => ({
        ...prev,
        marks: "Percentage is required",
      }));
      return;
    }
    if (!academicyear || parseInt(academicyear) > currentYear) {
      setErrorState((prev) => ({
        ...prev,
        academicyear: "Enter Valid year",
      }));
      return;
    }
    if (educationtype === "others") {
      setEducationType(customEducationType);
    }
    setValidations((prev) => ({ ...prev, education: true }));

    handleNext();
  };
  // -----photo start--------------------------------------
  const fileInputRef = useRef(null);
  // const [resizedImage, setResizedImage] = useState(null);

  const [studentImage, setSelectedFile] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const targetSizeInBytes = 45 * 1024;
        const resizedImage = await resizeImage(file, targetSizeInBytes);
        const { width, height } = await getImageSize(resizedImage);
        const sizeInKB = (resizedImage.size / 1024).toFixed(2);
        setSelectedFile(resizedImage);
        // setImageName(file.name);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };
   const handleAdharFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const targetSizeInBytes = 45 * 1024;
        const resizedImage = await resizeImage(file, targetSizeInBytes);
        const { width, height } = await getImageSize(resizedImage);
        const sizeInKB = (resizedImage.size / 1024).toFixed(2);
        setAadharCardImage(resizedImage);
        // setImageName(file.name);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };

  const getImageSize = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = (error) => {
        reject(error);
      };

      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const resizeImage = async (file, targetSize) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.src = URL.createObjectURL(file);

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    let width = img.width;
    let height = img.height;
    let resizedFile = file;

    while (resizedFile.size > targetSize) {
      width *= 0.9;
      height *= 0.9;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.85);
      });

      resizedFile = new File([blob], file.name, { type: blob.type });
    }

    return resizedFile;
  };

  const handlePhoto = () => {
    // const maxSizeInBytes = 45 * 1024; // 40 KB in bytes
    // if (studentImage.size > maxSizeInBytes) {
    //   alert("Image size is too large. Maximum allowed size is 45 KB");
    //   return;
    // }

    // Image size is within the limit, proceed to the next step
    handleNext();
  };

  // ----photo end--------------------------------------------
  const handleAdmissionDetails = () => {
    if (!enquirydate) {
      setErrorState((prev) => ({
        ...prev,
        enquirydate: "Enquiry Date is required",
      }));
      return;
    } else if (!enquirytakenby) {
      setErrorState((prev) => ({
        ...prev,
        enquirytakenby: "Enquiry Taken by is required",
      }));
      return;
    } else if (!coursePackage?.coursepackage) {
      setErrorState((prev) => ({
        ...prev,
        coursepackage: "Course Package is required",
      }));
      return;
    } else if (!courses.coursesId) {
      setErrorState((prev) => ({ ...prev, courses: "Courses is required" }));
      return;
    } else if (!leadsource) {
      setErrorState((prev) => ({
        ...prev,
        leadsource: "Lead Source is required",
      }));
      return;
    }
    if (
      leadsource[0].source
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .join(" ") === "student referral" ||
      leadsource[0].source
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .join(" ") === "employee referral"
    ) {
      setLeadSource([CustomLeadSource]);
    } else if (!branch.branch) {
      setErrorState((prev) => ({ ...prev, branch: "Branch is required" }));
      return;
    } else if (!modeoftraining) {
      setErrorState((prev) => ({
        ...prev,
        modeoftraining: "Mode of Training is required",
      }));
      return;
    } else if (!admissiondate) {
      setErrorState((prev) => ({
        ...prev,
        admissiondate: "Admission Date is required",
      }));
      return;
    } else if (!validitystartdate) {
      setErrorState((prev) => ({
        ...prev,
        validitystartdate: "Validity Start Date is required",
      }));
      return;
    } else if (!validityenddate) {
      setErrorState((prev) => ({
        ...prev,
        validityenddate: "Validity End Date is required",
      }));
      return;
    }
    setValidations((prev) => ({ ...prev, admission: true }));

    handleNext();
  };

  useEffect(() => {
    const today = new Date(validitystartdate);
    const futureDate = new Date(
      today.getFullYear(),
      today.getMonth() + 10,
      today.getDate()
    );

    // Format the future date as a string (e.g., "YYYY-MM-DD")
    const formattedFutureDate = `${futureDate.getFullYear()}-${(
      futureDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${futureDate.getDate().toString().padStart(2, "0")}`;
    setValidityEndDate(formattedFutureDate);
  }, [validitystartdate]);

  const handleReset = () => { };
  // useEffect(() => {
  //   setuserid(user.id);
  // }, [user]);

  useEffect(() => {
    // Clear error messages on change
    setErrorState((prev) => ({
      ...prev,
      name: "",
      email: "",
      imageUrl: "",
      dob: "",
      contact: "",
      wpNum: "",
      gender: "",
      marital: "",
      college: "",
      pincode: "",
      country: "",
      state: "",
      area: "",
      native: "",
      parentsname: "",
      parentsnumber: "",
      educationtype: "",
      marks: "",
      academicyear: "",
      enquirydate: "",
      enquirytakenby: "",
      coursepackage: "",
      courses: "",
      leadsource: "",
      branch: "",
      modeoftraining: "",
      admissiondate: "",
      validitystartdate: "",
      validityenddate: "",
      feetype: "",
      amount: "",
      admissionremarks: "",
    }));
  }, [
    name,
    email,
    imageUrl,
    birthdate,
    mobilenumber,
    whatsappno,
    gender,
    maritalstatus,
    college,
    zipcode,
    country,
    state,
    area,
    native,
    parentsname,
    parentsnumber,
    educationtype,
    marks,
    academicyear,
    enquirydate,
    enquirytakenby,
    coursePackage?.coursepackage,
    courses?.courses,
    leadsource,
    branch,
    modeoftraining,
    admissiondate,
    validitystartdate,
    validityenddate,
    feetype,
    amount,
    admissionremarks,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onload = async () => {
      const photoData = reader.result.split(",")[1];



      // Validate the form data
      if (!admissionremarks) {
        setErrorState((prev) => ({
          ...prev,
          admissionremarks: "Admission Remarks is required",
        }));
        return;
      }
      if (!assets) {
        toast.error("Please enter assets");
        return;
      }

      // Create the data object with the form fields
      let studentRegistrationdata = {
        name,
        email,
        mobilenumber,
        parentsname,
        parentsnumber,
        birthdate,
        gender,
        maritalstatus,
        college,
        country,
        state,
        area,
        native,
        zipcode,
        whatsappno,
        educationtype,
        marks,
        academicyear,
        filename: studentImage.name,
        aadharCardImage:aadharCardImage.name,
        aadharCardNumber,
        imgData: photoData,
        enquirydate,
        enquirytakenby,
        coursepackage: coursePackage?.coursepackage,
        coursepackageId: coursePackage?.coursepackageId,
        courses: courses?.courses,
        coursesId: courses.coursesId,
        leadsource,
        branch: branch.branch,
        branchId: branch.branchId,
        modeoftraining,
        admissiondate,
        validitystartdate,
        validityenddate,
        feedetails,
        grosstotal,
        totaldiscount,
        totaltax,
        grandtotal,
        finaltotal,
        admissionremarks,
        assets,
        totalinstallments,
        dueamount,
        addfee,
        initialpayment,
        duedatetype,
        installments,
        materialfee,
        feedetailsbilling,
        totalfeewithouttax,
        totalpaidamount,
        student_status,
        user_id,
        certificate_status,
        extra_discount,
      };
      // title case
      studentRegistrationdata = [studentRegistrationdata];
      const dataWithTitleCase = studentRegistrationdata.map((item) => {
        const newItem = {};

        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            if (typeof item[key] === "string" && key !== "email") {
              newItem[key] = item[key]
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            } else {
              newItem[key] = item[key];
            }
          }
        }

        return newItem;
      });
      studentRegistrationdata = dataWithTitleCase[0];
      setLoading((prev) => !prev);
      try {
        const { data, status } = await toast.promise(
          ERPApi.post(`/student/student_form`, studentRegistrationdata),
          {
            pending: "Verifing Enrollment Data...",
          }
        );

        if (status === 201) {
          const id = data.studentId;
          getPaginatedStudentsData();


          navigate(`/student/feeUpdate?studentId=${id}`)

          // navigate(`/student/feeview/${id}`);
          Swal.fire({
            title: "Enrolled!",
            text: "Student Enrolled Successfully!",
            icon: "success",
          });
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message
          ? error?.response?.data?.message
          : "Something went wrong Please Try Again 🤯";
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
        });
      } finally {
        setLoading((prev) => !prev);
      }
    };
    // Read the student image as a data URL
    reader.readAsDataURL(studentImage);
  };



  useEffect(() => {
    if (studentImage) {
      displayImage(studentImage);
    }
  }, [studentImage]);

  const handleFeeDelete = (id) => {
    const updatedTasks = feedetails.filter((task) => task.id !== id);
    setFeeDetails(updatedTasks);
  };

  const fetchData = async () => {
    if (zipcode && zipcode.length > 2) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${zipcode}`
        );

        if (response.data.length > 0) {
          const postOffice = response.data[0]?.PostOffice[0];

          if (postOffice) {
            const {
              Region: city,
              State: state,
              Country: country,
              Block: area,
            } = postOffice;

            setCountry(country);
            setState(state);
            setArea(area || "");
            setNative(city || "");
          } else {
            // Clear the state if no post office data is available
            setCountry("");
            setState("");
            setArea("");
            setNative("");
          }
        } else {
          // Clear the state if no data is returned
          setCountry("");
          setState("");
          setArea("");
          setNative("");
        }
      } catch (error) {
        console.error("Error fetching location information:", error);
        // Handle error as needed
      }
    } else {
      // Clear the state if the pincode is not valid
      setCountry("");
      setState("");
      setArea("");
      setNative("");
    }
  };

  useEffect(() => {
    fetchData();
  }, [zipcode]);

  function handleNext() {
    setActiveTab((prevActiveTab) => prevActiveTab + 1);
  }

  const handlePrev = () => {
    setActiveTab((prevActiveTab) => prevActiveTab - 1);
  };
  const handleKeyDown = (event) => {
    if (event.keyCode === 38 || event.keyCode === 40) {
      event.preventDefault(); // Prevent default behavior of arrow keys
    }
  };
  const fixCurrentDate = new Date().toISOString().split("T")[0];

  // admissionDate
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
  const dayBeforeYesterdayString = dayBeforeYesterday
    .toISOString()
    .split("T")[0];



  return (
    <div>
      <BackButton heading="Registration Form" content="Back" to="/" />
      <div className="container-fluid">
        <div className="registration_form_section  ">
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
                  Email
                </button>

                <button
                  type="button"
                  className={
                    activeTab === 2
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
                    activeTab === 3
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
                    activeTab === 4
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
                    activeTab === 5
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
                    activeTab === 6
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
                    activeTab === 7
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
                    activeTab === 8
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
                    activeTab === 9
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
            <form className="" onSubmit={handleSubmit}>
              {/* email */}


              {activeTab === 1 && (
                <>
                  <div className="row">


                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="remail"
                      >
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.email
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color "
                        }
                        id="remail"
                        type="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Enter your email address"

                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.email && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-3 mt-4 pt-2">
                      <Button
                        type="button"
                        className="btn btn-sm btn right btn_primary w-50"
                        onClick={() => handleEmailOPT()}
                        disabled={otpLoading?.email}
                        style={{ cursor: otpLoading?.email ? "not-allowed" : "pointer" }}

                        icon={<IoMdSend className="button_icons" />}
                      >
                        {otpLoading?.email ? "Sending OTP" : "Send OTP"}

                      </Button>
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
                          disabled={enableOTPInput === false}
                          style={{ cursor: enableOTPInput === false ? "not-allowed" : "" }}
                          maxLength="1"
                          value={emailOTP[index] || ""}
                          onChange={(e) => handleInputChange(e, index)}
                          onFocus={() => handleFocus(index)}
                          onKeyDown={(e) => handleKeyDownemail(e, index)}
                          ref={(el) => (inputRefs.current[index] = el)}
                        />
                      ))}

                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.otp && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.otp}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <button className={`btn  ${OtpVerify === true ? "btn-success" : "btn_primary"}   btn-sm btn right  ms-5 w-100`}
                        onClick={() => handleVerfiyOTP()}
                        disabled={enableOTPInput === false || OtpVerify === true}
                        style={{ cursor: enableOTPInput === false ? "not-allowed" : "" }}

                      >
                        {otpLoading.otp ? "Verifing..." : OtpVerify === true ? "Verified" : "Verify"}

                      </button>
                    </div>

                  </div>
                  <div></div>
                  <p className="fs-12 mt-2">{(OtpVerify === false && countdown > 0) ? `Expires in ${formatCountdown(countdown)}. You can resend the OTP after the timer ends.` : ""}</p>

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
                      {activeTab !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handletheEmailandOtp}
                          icon={<IoMdArrowForward />}
                          disabled={OtpVerify === false}
                          style={{ cursor: OtpVerify === false ? "not-allowed" : "" }}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Student Details Start */}
              {activeTab === 2 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6 ">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rname"
                      >
                        Name<span className="text-danger">*</span>
                      </label>

                      <input
                        className={
                          errorState && errorState.name
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="rname"
                        type="text"
                        required
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Enter your name"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.name && (
                          <span className="fs-xs text-danger ">
                            {errorState.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="remail"
                      >
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.email
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color "
                        }
                        style={{ cursor: "not-allowed" }}
                        id="remail"
                        type="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Enter your email address"
                        disabled
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.email && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        htmlFor="rphoto"
                        className="form-label fs-s text_color"
                      >
                        Choose your photo<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.imageUrl
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="rphoto"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      // value={imageName || ""}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.imageUrl && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.imageUrl}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rdob"
                      >
                        Date of Birth<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.dob
                            ? " form-control input_bg_color error-input date_input_color "
                            : "form-control input_bg_color date_input_color"
                        }
                        id="rdob"
                        type="date"
                        onChange={(e) => setBirthDate(e.target.value)}
                        max={fixCurrentDate}
                        value={birthdate !== "" ? birthdate : undefined}
                        onKeyDown={handleKeyDown}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.dob && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.dob}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rcontactnum"
                      >
                        Contact Number<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.contact
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="rcontactnum"
                        type="number"
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Contact Number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 10);
                          setMobileNumber(value);
                        }}
                        value={mobilenumber}
                        max="10"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.contact && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.contact}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rwhatsappnum"
                      >
                        Whatsapp Number<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.wpNum
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="rwhatsappnum"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 10);
                          setWhatsAppNo(value);
                        }}
                        value={whatsappno}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter WhatsApp number"
                        max="10"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.wpNum && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.wpNum}
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
                      <select
                        className={
                          errorState && errorState.gender
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color text-capitalize"
                        }
                        aria-label="Default select example"
                        id="gender"
                        name="gender"
                        onChange={(e) => setGender(e.target.value)}
                        value={gender}
                        required
                      >
                        <option disabled className="fs-s" value="">
                          Select your Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.gender && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.gender}
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
                          errorState && errorState.marital
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color text-capitalize"
                        }
                        aria-label="Default select example"
                        id="maritalstatus"
                        name="maritalstatus"
                        required
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        value={maritalstatus}
                      >
                        <option disabled className="fs-s" value="">
                          Your Marital Status
                        </option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.marital && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.marital}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rcscname"
                      >
                        College/School/Company
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.college
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="rcscname"
                        type="text"
                        required
                        onChange={(e) => setCollege(e.target.value)}
                        value={college}
                        onKeyDown={handleKeyDown}
                        placeholder="College/School/Company"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.college && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.college}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        htmlFor="rphoto"
                        className="form-label fs-s text_color"
                      >
                        Upload Aadhar Card<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.aadharCardImage
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="rphoto"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAdharFileChange}
                      // value={imageName || ""}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.aadharCardImage && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.aadharCardImage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rpincode"
                      >
                        Aadhar Card Number<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.aadharCardNumber
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        maxLength={6}
                        id="raadharCardNumber"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 6);
                          setAadharCardNumber(value);
                        }}
                        value={zipcode}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your aadharCardNumber"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.aadharCardNumber && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.aadharCardNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rpincode"
                      >
                        Pincode<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.pincode
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        maxLength={6}
                        id="rpincode"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 6);
                          setZipcode(value);
                        }}
                        value={zipcode}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your pincode"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.pincode && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.pincode}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rcountry"
                      >
                        Country<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.country
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="rcountry"
                        type="text"
                        required
                        onChange={(e) => setCountry(e.target.value)}
                        value={country}
                        placeholder="Enter your Country"
                      />

                      <div className="response" style={{ height: "9px" }}>
                        {errorState && errorState.country && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.country}
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
                          errorState && errorState.state
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="rstate"
                        type="text"
                        required
                        onChange={(e) => setState(e.target.value)}
                        value={state}
                        placeholder="Enter your State"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.state && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rnative"
                      >
                        Native Place<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.native
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="rnative"
                        type="text"
                        required
                        onChange={(e) => setNative(e.target.value)}
                        value={native}
                        placeholder="Enter your Native Place"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.native && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.native}
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
                          errorState && errorState.area
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="rarea"
                        type="text"
                        required
                        onChange={(e) => setArea(e.target.value)}
                        value={area}
                        placeholder="Enter your Area"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.area && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.area}
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
                      {activeTab !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleBasicDetails}
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
              {activeTab === 3 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rparentname"
                      >
                        Parent&apos;s/Guardian&apos;s Name
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.parentsname
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color text-capitalize"
                        }
                        id="rparentname"
                        type="text"
                        required
                        onChange={(e) => setParentsName(e.target.value)}
                        value={parentsname}
                        placeholder="Enter Parent's/Guardian's Name"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.parentsname && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.parentsname}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rparentscontact"
                      >
                        Parent&apos;s/Guardian&apos;s Contact
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.parentsnumber
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="rparentscontact"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 10);
                          SetParentsNumber(value);
                        }}
                        value={parentsnumber}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Parent's/Guardian's contact"
                        max="10"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.parentsnumber && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.parentsnumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* <div className="form-group text-start col-lg-3 col-md-6">
                    <label
                      className="form-label fs-s text_color"
                      htmlFor="rgender"
                    >
                      Relation<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select select form-control input_bg_color"
                      aria-label="Default select example"
                      id="rrelation"
                    >
                      <option disabled className="fs-s" value="">
                        --Select--
                      </option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                    </select>
                  </div> */}
                  </div>
                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {activeTab !== 1 && (
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
                      {activeTab !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleParentDetails}
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
              {activeTab === 4 && (
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
                          errorState && errorState.educationtype
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        id="educationtype"
                        name="educationtype"
                        required
                        onChange={handleEducationSelectChange}
                        value={educationtype}
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
                        {errorState && errorState.educationtype && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.educationtype}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rpercentage"
                      >
                        Percentage<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.marks
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        maxLength={2}
                        id="rpercentage"
                        type="number"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 2);
                          setMarks(value);
                        }}
                        value={marks}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your percentage"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.marks && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.marks}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="racademicyear"
                      >
                        Academic Year<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.academicyear
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="racademicyear"
                        type="number"
                        placeholder="Enter your academic year"
                        required
                        onChange={(e) => {
                          let value = e.target.value.slice(0, 4);
                          setAcademicyear(value);
                        }}
                        value={academicyear}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.academicyear && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.academicyear}
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
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {activeTab !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleEducationDetails}
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
              {activeTab === 5 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="renqiurydate"
                      >
                        Enquiry Date<span className="text-danger">*</span>
                      </label>
                      {/* <input
                        className={
                          errorState && errorState.enquirydate
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="renqiurydate"
                        type="date"
                        required
                        onChange={(e) => setEnquiryDate(e.target.value)}
                        value={enquirydate}
                      /> */}
                      <input
                        className={
                          errorState && errorState.enquirydate
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        type="date"
                        id="renqiurydate"
                        name="renqiurydate"
                        onChange={(e) => setEnquiryDate(e.target.value)}
                        required
                        // max={fixCurrentDate}
                        value={enquirydate !== "" ? enquirydate : undefined}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.enquirydate && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.enquirydate}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="renqtakeby"
                      >
                        Enquiry taken by<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.enquirytakenby
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="renqtakeby"
                        type="text"
                        name="renqtakeby"
                        required
                        value={enquirytakenby}
                        placeholder="Enter your Counsellor Name"
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.enquirytakenby && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.enquirytakenby}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="coursepackage"
                      >
                        Course Package<span className="text-danger">*</span>
                      </label>
                      <select
                        className={
                          errorState && errorState.coursepackage
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        name="coursepackage"
                        required
                        // onChange={(e) => setCoursepakage(e.target.value)}
                        // value={coursepackage}
                        onChange={(e) => handleCoursePackage(e)}
                        // onChange={(e) =>
                        //   setCoursePackage({
                        //     coursepackage: e.target.options[e.target.selectedIndex].text,
                        //     coursepackageId: parseInt(e.target.value),
                        //   })
                        // }
                        value={coursePackage?.coursepackageId || ""}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>

                        <option value={18}>	Employment Program</option>
                        <option value={19}>Post Graduation Employment Program</option>
                        <option value={12}> Certification Program</option>
                        <option value={16}>Scholarship</option>
                        <option value={15}>United Nations</option>
                        <option value={17}>Module Certification Program</option>
                        <option value={27}>Module Certification Program - Vizag</option>
                        <option value={26}>Post Graduation Employment Program - Vizag</option>
                        <option value={25}>Certification Program - Vizag</option>
                        <option value={24}>Employment Program - Vizag</option>


                        {/* {coursePackageState &&
                          coursePackageState?.coursepackages?.map(
                            (item, index) => (
                              <option
                                key={item.id}
                                value={item.id}
                              >
                                {item.coursepackages_name}
                              </option>
                            )
                          )} */}
                      </select>
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.coursepackage && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.coursepackage}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="courses"
                      >
                        Course<span className="text-danger">*</span>
                      </label>
                      <select
                        className={
                          errorState && errorState.courses
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        style={{
                          cursor: !coursePackage?.coursepackageId
                            ? "not-allowed"
                            : "pointer",
                        }}
                        aria-label="Default select example"
                        id="courses"
                        name="courses"
                        required
                        onChange={(e) =>
                          setCourses({
                            courses:
                              e.target.options[e.target.selectedIndex].text,
                            coursesId: parseInt(e.target.value),
                          })
                        }
                        disabled={!coursePackage?.coursepackageId}
                        value={courses?.coursesId || ""}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>
                        {/* {courseState?.courses &&
                          courseState?.courses?.map((item, index) => (
                            <option key={item?.id} value={item?.id}>
                              {item?.course_name}
                            </option>
                          ))} */}

                        {coursesList?.length > 0 &&
                          coursesList?.map((item, index) => (
                            <option key={item.id} value={item.id}>
                              {item.course_name}
                            </option>
                          ))}
                      </select>
                      <div style={{ height: "8px" }}>
                        {errorState && errorState?.courses && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState?.courses}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="leadsource"
                      >
                        Lead Source<span className="text-danger">*</span>
                      </label>
                      <select
                        className={
                          errorState && errorState.leadsource
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select  form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        id="leadsource"
                        required
                        onChange={handleLeadSourceSelectChange}
                        value={leadsource[0]?.source}
                      >
                        <option disabled selected className="fs-s" value="">
                          --Select--
                        </option>
                        {leadSourceState?.leadSources &&
                          leadSourceState?.leadSources?.map((item, index) => (
                            <option key={item.id} value={item.leadsource}>
                              {item.leadsource}
                            </option>
                          ))}
                      </select>
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.leadsource && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.leadsource}
                          </p>
                        )}
                      </div>

                      {leadsourceOptions && (
                        <div className="mt-3">
                          <label
                            htmlFor=""
                            className="form-label fs-s text_color"
                          >
                            Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control input_bg_color"
                            required
                            onChange={(e) =>
                              setCustomLeadSource((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            value={CustomLeadSource.name || ""}
                          />
                          <label
                            htmlFor=""
                            className="form-label fs-s text_color"
                          >
                            Mobile Number<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control input_bg_color"
                            required
                            onChange={(e) =>
                              setCustomLeadSource((prev) => ({
                                ...prev,
                                mobileNumber: e.target.value,
                              }))
                            }
                            value={CustomLeadSource.mobileNumber || ""}
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

                      <input
                        className={
                          errorState && errorState.branch
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        id="branch"
                        type="text"
                        name="branch"
                        required
                        value={branch.branch}
                        placeholder="Enter your Branch Name"
                      />

                      {/* <select
                        className={
                          errorState && errorState.branch
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        id="branch"
                        required
                        onChange={(e) => setBranch(e.target.value)}
                        value={branch}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>
                        {BranchState?.branches &&
                          BranchState?.branches.map((item, index) => (
                            <option key={item.id} value={item.branch_name}>
                              {item.branch_name}
                            </option>
                          ))}
                      </select> */}

                      <div style={{ height: "8px" }}>
                        {errorState && errorState?.branch && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState?.branch}
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
                          errorState && errorState.modeoftraining
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        id="modeoftraining"
                        required
                        onChange={(e) => setModeOfTraining(e.target.value)}
                        value={modeoftraining}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                      </select>
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.modeoftraining && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.modeoftraining}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="radmissiondate"
                      >
                        Admission Date<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.admissiondate
                            ? "form-control input_bg_color error-input date_input_color"
                            : "form-control input_bg_color date_input_color"
                        }
                        id="radmissiondate"
                        type="date"
                        name="radmissiondate"
                        required
                        onChange={(e) => setAdmissionDate(e.target.value)}
                        value={admissiondate}
                        // min={dayBeforeYesterdayString}
                        max={todayString}
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.admissiondate && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.admissiondate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rvaliditystartdate"
                      >
                        Validity Start Date
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.validitystartdate
                            ? "form-control input_bg_color error-input date_input_color"
                            : "form-control input_bg_color date_input_color"
                        }
                        id="rvaliditystartdate"
                        type="date"
                        name="rvaliditystartdate"
                        onChange={(e) => setValidityStartDate(e.target.value)}
                        value={validitystartdate}
                        required
                      />
                      <div className="response" style={{ height: "8px" }}>
                        {errorState && errorState.validitystartdate && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.validitystartdate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rvalidityenddate"
                      >
                        Validity End Date<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.validityenddate
                            ? "form-control input_bg_color error-input date_input_color"
                            : "form-control input_bg_color date_input_color"
                        }
                        id="rvalidityenddate"
                        type="date"
                        name="rvalidityenddate"
                        onChange={(e) => setValidityEndDate(e.target.value)}
                        value={validityenddate}
                        required
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.validityenddate && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.validityenddate}
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
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {activeTab !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleAdmissionDetails}
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
              {activeTab === 6 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rwhatsappnum"
                      >
                        Fee Type<span className="text-danger">*</span>
                      </label>
                      <select
                        className={
                          errorState && errorState.feetype
                            ? "form-select select form-control input_bg_color error-input"
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        name="Fee Type"
                        required
                        onChange={(e) => setfeetype(e.target.value)}
                        value={feetype}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>
                        <option value="Admission Fee">Admission Fee</option>
                        <option value="fee">Fee</option>
                      </select>
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.feetype && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.feetype}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="courseamount"
                      >
                        Amount<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.amount
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="courseamount"
                        type="number"
                        name="courseamount"
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Course Amount"
                        required
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                        disabled={amount ? true : false}
                        style={{ cursor: amount ? "not-allowed" : "" }}
                      />

                      <div style={{ height: "8px" }}>
                        {errorState && errorState.amount && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.amount}
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
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Discount"
                        required
                        // onChange={(e) => setDiscount(e.target.value)}
                        onChange={(e) => handleDiscount(e)}
                        value={discount}
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
                  {feedetails.length > 0 && (
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
                              {feedetails.length > 0 &&
                                feedetails.map((item) => (
                                  <tr key={item.id}>
                                    <td className="fw-medium fs-13 text_color">
                                      {item.feetype}
                                    </td>
                                    <td className="fs-13 text_color">
                                      {item.amount}
                                    </td>
                                    <td className="fs-13 text_color">
                                      {item.discount}
                                    </td>
                                    <td className="fs-13 text_color">
                                      {parseFloat(item.taxamount.toFixed(2))}
                                    </td>
                                    <td className="fs-13 text_color">
                                      {item.totalamount}
                                    </td>
                                    <td
                                      onClick={() => handleFeeDelete(item.id)}
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
                      {activeTab !== 1 && (
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
                      {activeTab !== 9 && (
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
              {activeTab === 7 && (
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
                                {grosstotal}
                              </td>
                              <td className="fs-13  text_color">
                                {totaldiscount}
                              </td>
                              <td className="fs-13  text_color">
                                {finaltotal}
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
                            {feedetailsbilling?.length > 0 &&
                              feedetailsbilling?.map((item) => {
                                if (item.feetype !== "Material Fee") {
                                  return (
                                    <tr key={item.id}>
                                      <td className=" fs-13 text_color">
                                        {item.feetype}
                                      </td>
                                      <td className=" fs-13 text_color">
                                        {parseFloat(
                                          item.feewithouttax.toFixed(2)
                                        )}
                                      </td>
                                      <td className=" fs-13 text_color">
                                        {parseFloat(item.feetax.toFixed(2))}
                                      </td>
                                      <td className=" fs-13 text_color">
                                        {parseFloat(item.feewithtax.toFixed(2))}
                                      </td>
                                    </tr>
                                  );
                                }
                              })}

                            {feedetailsbilling.length > 0 && (
                              <tr>
                                <td className="fw-medium fs-13 text_color">
                                  <b>Sub Total</b>
                                </td>
                                <td className=" fs-13 text_color">
                                  {parseFloat(totalfeewithouttax.toFixed(2))}
                                </td>
                                <td className=" fs-13 text_color">
                                  {parseFloat(totaltax.toFixed(2))}
                                </td>
                                <td className=" fs-13 text_color">
                                  {parseFloat(grandtotal.toFixed(2))}
                                </td>
                              </tr>
                            )}

                            <tr>
                              <td rowSpan={3} />
                              <td rowSpan={3} />
                              <td className="fs-13 text_color">Material Fee</td>
                              <td className="fs-13 text_color">
                                {materialfee}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-medium fs-13 text_color">
                                <strong> Grand Total</strong>
                              </td>
                              <td className="fs-13 text_color">{finaltotal}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {activeTab !== 1 && (
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
                      {activeTab !== 9 && (
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
              {activeTab === 8 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6 ">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rremarks"
                      >
                        Remarks<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.admissionremarks
                            ? "form-control input_bg_color error-input date_input_color"
                            : "form-control input_bg_color date_input_color"
                        }
                        id="rremarks"
                        type="text"
                        name="rremarks"
                        placeholder="Enter your Remarks"
                        required
                        onChange={(e) => setadmissionremarks(e.target.value)}
                        value={admissionremarks}
                      />
                      <div style={{ height: "25px" }}>
                        {errorState && errorState.admissionremarks && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.admissionremarks}
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
                            htmlFor="cardtableCheck"
                          >
                            Bag
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="cardtableCheck"
                            name="bag"
                            checked={assets.includes("bag")}
                            onChange={handleAssetChange}
                          />
                        </div>

                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="cardtableCheck"
                          >
                            Laptop
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="cardtableCheck"
                            name="laptop"
                            checked={assets.includes("laptop")}
                            onChange={handleAssetChange}
                          />
                        </div>

                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="cardtableCheck"
                          >
                            LMS
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="cardtableCheck"
                            name="lms"
                            checked={assets.includes("lms")}
                            onChange={handleAssetChange}
                          />
                        </div>

                        <div className="form-check ">
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="cardtableCheck"
                          >
                            Course Material
                          </label>
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="cardtableCheck"
                            name="courseMaterial"
                            checked={assets.includes("courseMaterial")}
                            onChange={handleAssetChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {activeTab !== 1 && (
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
                      {activeTab !== 9 && (
                        <Button
                          type="button"
                          className="btn  right btn_primary "
                          onClick={handleOtherChanges}
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
              {activeTab === 9 && (
                <>
                  <div className="">
                    <div className="card p-2">
                      <div className="">
                        <div className="row">
                          <div className="col-4 d-flex justify-content-start h-155 mt-2">
                            <img
                              className="col-lg-4 col-md-6  col-sm-4 h-100 object-fit-cover"
                              style={{ border: "4px solid  #b3b9d0" }}
                              src={imageUrl}
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
                                    <span className="ms-4">: </span> {name}
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
                                    <span className="ms-4">: </span> {email}
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
                                    <span className="ms-4">: </span> {birthdate}
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
                                    {mobilenumber}
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
                                    <span className="ms-5">: </span> {zipcode}
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
                                    <span className="ms-5">: </span> {country}
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
                                    <span className="ms-5">: </span> {state}
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
                                    <span className="ms-5">: </span> {native}
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
                                    {area}
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
                                    {whatsappno}
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
                                    {gender}
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
                                    {maritalstatus}
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
                                    Parent's Name
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>
                                    {parentsname}
                                  </td>
                                </tr>

                                <tr className="lh-400">
                                  <td
                                    className="ps-0 black_300 fw-500 text-start  fs-13"
                                    scope="row"
                                  >
                                    Parent's Number
                                  </td>
                                  <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                    <span className="ms-5">: </span>{" "}
                                    {parentsnumber}
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
                                    {academicyear}
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
                                    {leadsource[0].source}
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
                                    {branch?.branch}
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
                                    {modeoftraining}
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
                                    {admissiondate}
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
                                    {validitystartdate}
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
                                    {validityenddate}
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
                                    {educationtype}
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
                                    {marks}
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
                                    {enquirydate}
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
                                    {enquirytakenby}
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
                                    {coursePackage?.coursepackage}
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
                                    {courses?.courses}
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
                                    <span className="ms-5">: </span> {college}
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
                                  {feedetails &&
                                    feedetails.map((item, index) => (
                                      <tr key={index}>
                                        <td className="fs-13 text_color">
                                          {item.feetype}
                                        </td>
                                        <td className="fs-13 text_color">
                                          {item.amount}
                                        </td>
                                        <td className="fs-13 text_color">
                                          {item.discount}
                                        </td>
                                        <td className="fs-13 text_color">
                                          {parseFloat(item.taxamount).toFixed(
                                            2
                                          )}
                                        </td>
                                        <td className="fs-13 text_color">
                                          {item.feetype === "fee" ? (
                                            <>
                                              Materialfee: {materialfee}&nbsp;,
                                              CourseFee:{" "}
                                              {item.totalamount - materialfee}
                                              <br />
                                              <b>{item.totalamount}</b>
                                            </>
                                          ) : (
                                            <b>{item.totalamount}</b>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="col-lg-12 col-md-6 ">
                            {admissionremarks && (
                              <p className="text_color">
                                <b className="prev_bold"> Remarks:</b>{" "}
                                {admissionremarks}
                              </p>
                            )}
                            {assets.length > 0 && (
                              <p className="text_color">
                                <b className="prev_bold">Assets:</b>{" "}
                                {assets.map((item, index) => (
                                  <span key={index}>
                                    {index === assets.length - 1
                                      ? item
                                      : item + ", "}{" "}
                                  </span>
                                ))}
                              </p>
                            )}
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
                          className="btn control_prev_btn reg_btn text_color"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {activeTab === 9 && (
                        <Button
                          type="submit"
                          className="btn  right btn_primary "
                          onClick={handleSubmit}
                          icon={<IoMdCheckmark />}
                          disabled={loading}
                        >
                          Submit
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
    </div>
  );
}

export default RegistrationForm;

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useTheme } from "../../../../dataLayer/context/themeContext/ThemeContext";
// import { IoMdArrowBack, IoMdCheckmark, IoMdArrowForward } from "react-icons/io";
// import "../../../../assets/css/RegistrationForm.css";
// import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
// import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext";
// import { useLeadSourceContext } from "../../../../dataLayer/hooks/useLeadSourceContext";
// import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext";
// import { useCoursePackage } from "../../../../dataLayer/hooks/useCoursePackage";
// import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
// import { MdDelete } from "react-icons/md";
// import Button from "../../../components/button/Button";
// import BackButton from "../../../components/backbutton/BackButton";
// import { toast } from "react-toastify";
// import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
// import Swal from "sweetalert2";

// function RegistrationForm() {
//   // * Active Tab start

//   const [activeTab, setActiveTab] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const { theme } = useTheme();
//   const [isPopupOpen, setPopupOpen] = useState(false);
//   let select = "select";
//   const openPopup = () => setPopupOpen(true);
//   const closePopup = () => setPopupOpen(false);

//   const { BranchState } = useBranchContext();
//   const { leadSourceState } = useLeadSourceContext();
//   const { courseState, getAllCourses } = useCourseContext();
//   const { coursePackageState } = useCoursePackage();

//   const { getPaginatedStudentsData } = useStudentsContext();

//   const navigate = useNavigate();

//   // registration form data
//   const [user_id, setuserid] = useState(() => {
//     const userData = JSON.parse(localStorage.getItem("data"));
//     return userData?.user?.id || "";
//   });

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobilenumber, setMobileNumber] = useState("");
//   const [parentsname, setParentsName] = useState("");
//   const [parentsnumber, SetParentsNumber] = useState("");
//   const [birthdate, setBirthDate] = useState("");
//   const [gender, setGender] = useState("");
//   const [maritalstatus, setMaritalStatus] = useState("");
//   const [college, setCollege] = useState("");
//   const [country, setCountry] = useState("");
//   const [state, setState] = useState("");
//   const [area, setArea] = useState("");
//   const [native, setNative] = useState("");
//   const [zipcode, setZipcode] = useState(null);
//   const [whatsappno, setWhatsAppNo] = useState(null);
//   const [educationtype, setEducationType] = useState("");
//   const [marks, setMarks] = useState("");
//   const [academicyear, setAcademicyear] = useState("");
//   // const [studentImage, setSelectedFile] = useState(null);
//   // const [profilepic, setProfilePic] = useState("");
//   const [enquirydate, setEnquiryDate] = useState("");
//   const [enquirytakenby, setEnquiryTakenBy] = useState(() => {
//     const userData = JSON.parse(localStorage.getItem("data"));
//     return userData?.user?.fullname || "";
//   });

//   // const [branch, setBranch] = useState(() => {
//   //   const userData = JSON.parse(localStorage.getItem("data"));
//   //   return userData?.user?.branch || "";
//   // })

//   const [branch, setBranch] = useState(() => {
//     const userData = JSON.parse(localStorage.getItem("data"));
//     return {
//       branch: userData?.user?.branch || "",
//       branchId: userData?.user?.branchId || null,
//     };
//   });

//   const [coursepackage, setCoursepakage] = useState("");

//   const [courses, setCourses] = useState({
//     courses: "",
//     coursesId: null,
//   });

//   const [coursesList, setCoursesList] = useState([]);

//   const [coursePackage, setCoursePackage] = useState({
//     coursepackage: "",
//     coursepackageId: null,
//   })

//   const handleCoursePackage = (e) => {
//     setCoursePackage((prev) => ({
//       ...prev,
//       coursepackage: e.target.options[e.target.selectedIndex].text,
//       coursepackageId: parseInt(e.target.value),
//     }))
//     fetchCourseListByCoursePackage(e.target.value);
//   }

//   const fetchCourseListByCoursePackage = async (coursepackageId) => {
//     try {
//       const { data, status } = await ERPApi.get(`batch/course/getcoursesfromcoursepackage/${coursepackageId}`);
//       if (status === 200) {
//         setCoursesList(data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const [leadsource, setLeadSource] = useState("");
//   // const [branch, setBranch] = useState("");
//   const [modeoftraining, setModeOfTraining] = useState("");
//   // const [admissionstatus, setAdmissionStatus] = useState("");
//   const [registrationnumber, setRegistrationNumber] = useState("");
//   const [admissiondate, setAdmissionDate] = useState("");
//   const [validitystartdate, setValidityStartDate] = useState("");
//   const [validityenddate, setValidityEndDate] = useState("");

//   const [feetype, setfeetype] = useState("");
//   const [amount, setAmount] = useState(null);
//   const [discount, setDiscount] = useState(null);
//   const [taxamount, setTaxamount] = useState(null);
//   const [totalamount, setTotalamount] = useState(null);

//   const [feedetails, setFeeDetails] = useState([]);
//   const [grosstotal, setGrosstotal] = useState(null);
//   const [totaldiscount, setTotalDiscount] = useState(0);
//   const [totaltax, settotaltax] = useState(null);
//   const [grandtotal, setGrandtotal] = useState(null);
//   const [finaltotal, setfinaltotal] = useState(null);
//   const [admissionremarks, setadmissionremarks] = useState("");
//   const [assets, setassets] = useState([]);
//   const [initialpayment, setinitialamount] = useState([]);
//   const [dueamount, setdueamount] = useState(null);
//   const [totalinstallments, settotalinstallments] = useState(0);
//   const [duedatetype, setduedatetype] = useState("");
//   const [addfee, setaddfee] = useState(false);
//   const [installments, setinstallments] = useState([]);
//   const [leadsourceOptions, setleadsourceOptions] = useState(false);

//   const [CustomLeadSource, setCustomLeadSource] = useState("");
//   const [feedetailsbilling, setfeedetailsbilling] = useState([]);
//   const [materialfee, setmaterialfee] = useState(null);

//   const [totalfeewithouttax, settotalfeewithouttax] = useState(null);
//   const [totalpaidamount, settotalpaidamount] = useState(0);
//   const [educationOthersOption, setEducationOthersOption] = useState(false);
//   const [customEducationType, setCustomEducationType] = useState("");
//   const [student_status, setStudent_status] = useState([]);
//   const [certificate_status, setcertificate_status] = useState([
//     {
//       courseStartDate: "",
//       courseEndDate: "",
//       certificateStatus: "",
//       requistedDate: "",
//       issuedDate: "",
//     },
//   ]);

//   const [validations, setValidations] = useState({
//     student: false,
//     parent: false,
//     education: false,
//     admission: false,
//     fee: false,
//     billings: false,
//     others: false,
//     preview: false,
//     // Add more tab numbers and set their initial validation status
//   });

//   const handleTabClick = (tabNumber) => {
//     // Check if current tab is valid before navigating
//     if (validations.student) {
//       return setActiveTab(tabNumber);
//     }
//     if (validations.parent) {
//       return setActiveTab(tabNumber);
//     }
//     if (validations.education) {
//       return setActiveTab(tabNumber);
//     }
//     if (validations.admission) {
//       return setActiveTab(tabNumber);
//     }
//     if (validations.fee) {
//       return setActiveTab(tabNumber);
//     }
//     if (validations.others) {
//       return setActiveTab(tabNumber);
//     } else {
//       toast.error("Please fill in all required fields before proceeding.");
//     }
//   };

//   const [errorState, setErrorState] = useState({});
//   const [extra_discount, setExtra_Discount] = useState([]);
//   let LoggedInuser = JSON.parse(localStorage.getItem("user"));
//   let userName;

//   // if (LoggedInuser) {
//   //   userName = LoggedInuser.fullname;
//   //   setEnquiryTakenBy(userName);
//   // }

//   const [imageUrl, setImageUrl] = useState(null);
//   // const [imageName, setImageName] = useState("");
//   const displayImage = (file) => {
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const imageUrl = e.target.result; // Get the base64 image data
//       setImageUrl(imageUrl);
//     };

//     reader.readAsDataURL(file);
//   };
//   useEffect(() => {
//     if (LoggedInuser) {
//       userName = LoggedInuser.fullname;
//       setEnquiryTakenBy(userName);
//       setBranch({
//         branch: LoggedInuser?.branch || "",
//         branchId: LoggedInuser?.branchId || null,
//       });
//     }
//   }, [LoggedInuser]);

//   const handleAssetChange = (event) => {
//     const assetName = event.target.name;
//     if (event.target.checked) {
//       // Add the selected asset to the array
//       setassets([...assets, assetName]);
//     } else {
//       // Remove the asset from the array if it's unchecked
//       setassets(assets.filter((asset) => asset !== assetName));
//     }
//   };
//   const handleEducationSelectChange = (e) => {
//     const selectedValue = e.target.value;
//     if (selectedValue === "others") {
//       setEducationOthersOption(true);
//       setCustomEducationType("");
//       setEducationType(selectedValue);
//     } else {
//       setEducationOthersOption(false);
//       setEducationType(selectedValue);
//     }
//   };
//   const handleLeadSourceSelectChange = (e) => {
//     const selectedValue = e.target.value;
//     if (
//       selectedValue.toLowerCase().split(" ").filter(Boolean).join(" ") ===
//       "student referral" ||
//       selectedValue.toLowerCase().split(" ").filter(Boolean).join(" ") ===
//       "employee referral" ||
//       selectedValue.toLowerCase().split(" ").filter(Boolean).join(" ") ===
//       "student reference" ||
//       selectedValue.toLowerCase().split(" ").filter(Boolean).join(" ") ===
//       "employee reference"
//     ) {
//       setleadsourceOptions(true);
//       setCustomLeadSource({ source: selectedValue });
//       setLeadSource([{ source: selectedValue }]);
//     } else {
//       setleadsourceOptions(false);
//       setCustomLeadSource({ source: selectedValue });

//       setLeadSource([{ source: selectedValue }]);
//     }
//   };
//   const handleFeecalculations = () => {
//     function validateFeedetails(feedetails) {
//       const admissionFeeExists = feedetails.some(
//         (item) => item.feetype === "Admission Fee"
//       );
//       const feeExists = feedetails.some((item) => item.feetype === "fee");

//       if (!admissionFeeExists || !feeExists) {
//         // Validation failed

//         return false;
//       }

//       // Validation passed
//       return true;
//     }

//     if (validateFeedetails(feedetails)) {
//       let grosstotall = 0;
//       let totaldiscountt = 0;
//       let totalfeewithouttaxx = 0;
//       let totaltaxx = 0;
//       let grandtotall = 0;
//       let materialfeee = 0;

//       const array = [];
//       for (let i = 0; i < feedetails.length; i++) {
//         if (feedetails[i].feetype === "Admission Fee") {
//           let admissionobject = {
//             id: "",
//             feetype: "",
//             feewithtax: 0,
//             feewithouttax: 0,
//             feetax: 0,
//           };
//           admissionobject.id = feedetails[i].id;
//           admissionobject.feetype = "Admission Fee";
//           admissionobject.feewithtax = feedetails[i].totalamount;
//           admissionobject.feewithouttax = admissionobject.feewithtax / 1.18;
//           admissionobject.feetax =
//             admissionobject.feewithtax - admissionobject.feewithouttax;
//           grosstotall = grosstotall + parseInt(feedetails[i].amount);
//           // totaldiscountt = totaldiscountt + parseInt(feedetails[i].discount);
//           totaldiscountt = 0;
//           totalfeewithouttaxx =
//             totalfeewithouttaxx + admissionobject.feewithouttax;
//           totaltaxx = totaltaxx + admissionobject.feetax;
//           grandtotall = grandtotall + admissionobject.feewithtax;

//           array.push(admissionobject);
//         }
//         if (feedetails[i].feetype === "fee") {
//           let coursefeeobject = {
//             id: "",
//             feetype: "",
//             feewithtax: 0,
//             feewithouttax: 0,
//             feetax: 0,
//           };
//           coursefeeobject.id = feedetails[i].id;
//           coursefeeobject.feetype = "Course Fee";
//           coursefeeobject.feewithtax = feedetails[i].totalamount * 0.7;
//           coursefeeobject.feewithouttax = coursefeeobject.feewithtax / 1.18;
//           coursefeeobject.feetax =
//             coursefeeobject.feewithtax - coursefeeobject.feewithouttax;
//           // settotalfeewithouttax((value) => value + coursefeeobject.feewithouttax);
//           // settotaltax((value) => value + coursefeeobject.feetax);
//           // setGrandtotal((value) => value + coursefeeobject.feewithtax);
//           grosstotall = grosstotall + Math.round(feedetails[i].amount * 0.7);
//           totaldiscountt =
//             totaldiscountt + parseInt(feedetails[i].discount * 0.7);

//           totalfeewithouttaxx =
//             totalfeewithouttaxx + coursefeeobject.feewithouttax;
//           totaltaxx = totaltaxx + coursefeeobject.feetax;
//           grandtotall = grandtotall + coursefeeobject.feewithtax;
//           array.push(coursefeeobject);
//           let materialfeeobject = {
//             id: "",
//             feetype: "",
//             feewithtax: 0,
//             feewithouttax: 0,
//             feetax: 0,
//           };
//           materialfeeobject.id = feedetails[i].id;
//           materialfeeobject.feetype = "Material Fee";
//           materialfeeobject.feewithtax = Math.round(
//             feedetails[i].totalamount * 0.3
//           );
//           materialfeeobject.feewithouttax = materialfeeobject.feewithtax;
//           materialfeeobject.feetax = 0;

//           // settotalfeewithouttax(
//           //   (value) => value + materialfeeobject.feewithouttax
//           // );
//           // settotaltax((value) => value + materialfeeobject.feetax);
//           // setGrandtotal((value) => value + materialfeeobject.feewithtax);
//           grosstotall = grosstotall + parseInt(feedetails[i].amount * 0.3);
//           totaldiscountt =
//             totaldiscountt + parseInt(feedetails[i].discount * 0.3);
//           materialfeee =
//             materialfeee + Math.round(feedetails[i].totalamount * 0.3);
//           // totalfeewithouttaxx =
//           //   totalfeewithouttaxx + materialfeeobject.feewithouttax;
//           totaltaxx = totaltaxx + materialfeeobject.feetax;
//           // grandtotall = grandtotall + materialfeeobject.feewithtax;
//           array.push(materialfeeobject);
//         }
//       }
//       setTotalDiscount(totaldiscountt);
//       setGrosstotal(grosstotall);
//       settotalfeewithouttax(totalfeewithouttaxx);
//       settotaltax(totaltaxx);
//       setGrandtotal(grandtotall);
//       setfeedetailsbilling(array);
//       setmaterialfee(materialfeee);
//       if (feedetails.length === 0) {
//         toast.error("please enter feedetails");
//         return;
//       }
//       setValidations((prev) => ({ ...prev, fee: true }));

//       handleNext();
//     } else {
//       setErrorState((prev) => ({ ...prev, feetype: "Fee type is required" }));
//       setErrorState((prev) => ({ ...prev, amount: "Amount is required" }));
//     }
//   };
//   useEffect(() => {
//     setfinaltotal(grandtotal + materialfee);
//   }, [grandtotal, materialfee]);
//   useEffect(() => {
//     setdueamount(finaltotal);
//   }, [finaltotal]);
//   useEffect(() => {
//     setTotalamount(amount - discount);
//     let actualfee = (totalamount * 100) / 118;

//     setTaxamount(totalamount - actualfee);
//   });

//   // fee binding as per course selected

//   useEffect(() => {
//     if (feetype === "Admission Fee") {
//       setAmount(499);
//     }
//     if (feetype === "fee") {
//       let course = courseState?.courses?.filter(
//         (course) =>
//           course.course_name === courses?.courses &&
//           course.course_package === coursePackage.coursepackage
//       );
//       if (course.length > 0) {
//         setAmount(course[0].fee);
//       } else {
//         setAmount("");
//       }
//     }
//   }, [
//     feetype,
//     courses?.courses,
//     courses?.coursesId,
//     coursePackage?.coursepackage,
//     courseState,
//   ]);

//   const handleFeeDetails = (e) => {
//     e.preventDefault();
//     if (!feetype) {
//       setErrorState((prev) => ({ ...prev, feetype: "Fee type is required" }));
//       return;
//     }

//     if (!amount) {
//       setErrorState((prev) => ({ ...prev, amount: "Amount is required" }));
//       return;
//     }
//     const existingAdmissionFee = feedetails.some(
//       (item) => item.feetype === "Admission Fee"
//     );
//     const existingRegularFee = feedetails.some(
//       (item) => item.feetype === "fee"
//     );

//     // Validate that only one admission fee and one regular fee are allowed
//     if (feetype === "Admission Fee" && existingAdmissionFee) {
//       toast.error("Admission Fee is only accepted once.");
//       return;
//     }

//     if (feetype === "fee" && existingRegularFee) {
//       toast.error("Fee is only Allowed Once");
//       return;
//     }
//     let save = true;
//     if (feetype === "fee") {
//       let course = courseState.courses.filter(
//         (course) =>
//           course.course_name === courses?.courses &&
//           course.course_package === coursePackage?.coursepackage
//       );

//       if (
//         course.length > 0 &&
//         parseInt(discount) > parseInt(course[0].max_discount) &&
//         course[0].course_name === courses?.courses &&
//         course[0].course_package === coursePackage?.coursepackage
//       ) {
//         save = false;
//         toast.error(`Discount cannot be greater than ${course[0].max_discount}`);
//       }
//     }
//     if (save) {
//       setFeeDetails([
//         ...feedetails,
//         {
//           id: Date.now(),
//           feetype: feetype,
//           amount: amount,
//           discount: discount,
//           taxamount: taxamount,
//           totalamount: totalamount,
//         },
//       ]);
//       setfeetype("");
//       setAmount("");
//       setDiscount("");
//       setTaxamount(0);

//       setTotalamount(0);
//     }
//   };

//   // * ------------------validations------------------

//   const handleBasicDetails = async () => {
//     if (!name) {
//       setErrorState((prev) => ({ ...prev, name: "Name is required" }));
//       return;
//     } else if (name.length < 3) {
//       setErrorState((prev) => ({
//         ...prev,
//         name: "Name must be at least 3 characters long",
//       }));
//       return;
//     }
//     if (!email) {
//       setErrorState((prev) => ({ ...prev, email: "Email is required" }));
//       return;
//     } else {
//       const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
//       if (!emailPattern.test(email)) {
//         setErrorState((prev) => ({ ...prev, email: "Invalid Email Address" }));
//         return;
//       }
//     }

//     if (!imageUrl) {
//       setErrorState((prev) => ({ ...prev, imageUrl: "Image is required" }));
//       return;
//     }

//     if (!birthdate) {
//       setErrorState((prev) => ({ ...prev, dob: "Date of birth is required" }));
//       return;
//     }

//     if (!mobilenumber) {
//       setErrorState((prev) => ({ ...prev, contact: "Contact is required" }));
//       return;
//     } else {
//       if (mobilenumber.length !== 10) {
//         setErrorState((prev) => ({
//           ...prev,
//           contact: "Incorrect mobile number",
//         }));
//         return;
//       }
//     }

//     if (!whatsappno) {
//       setErrorState((prev) => ({ ...prev, wpNum: "WhatsApp Number required" }));
//       return;
//     } else {
//       if (whatsappno.length !== 10) {
//         setErrorState((prev) => ({
//           ...prev,
//           wpNum: "Incorrect WhatsApp number",
//         }));
//         return;
//       }
//     }

//     if (!gender) {
//       setErrorState((prev) => ({ ...prev, gender: "Gender is required" }));
//       return;
//     }

//     if (!maritalstatus) {
//       setErrorState((prev) => ({
//         ...prev,
//         marital: "Marital status is required",
//       }));
//       return;
//     }

//     if (!college) {
//       setErrorState((prev) => ({ ...prev, college: "college is required" }));
//       return;
//     } else if (college.length < 3) {
//       setErrorState((prev) => ({
//         ...prev,
//         college: "college must be at least 3 characters long",
//       }));
//       return;
//     }

//     if (!zipcode) {
//       setErrorState((prev) => ({ ...prev, pincode: "Pincode is required" }));
//       return;
//     } else if (zipcode.length !== 6) {
//       setErrorState((prev) => ({
//         ...prev,
//         pincode: "Pincode must be exactly 6 characters long",
//       }));
//       return;
//     }
//     if (!country) {
//       setErrorState((prev) => ({ ...prev, country: "country is required" }));
//       return;
//     } else if (country.length < 3) {
//       setErrorState((prev) => ({
//         ...prev,
//         country: "country must be at least 3 characters long",
//       }));
//       return;
//     }
//     if (!state) {
//       setErrorState((prev) => ({ ...prev, state: "state is required" }));
//       return;
//     } else if (state.length < 3) {
//       setErrorState((prev) => ({
//         ...prev,
//         state: "state must be at least 3 characters long",
//       }));
//       return;
//     }
//     if (!native) {
//       setErrorState((prev) => ({ ...prev, native: "native is required" }));
//       return;
//     } else if (native.length < 3) {
//       setErrorState((prev) => ({
//         ...prev,
//         native: "native must be at least 3 characters long",
//       }));
//       return;
//     }
//     if (!area) {
//       setErrorState((prev) => ({ ...prev, area: "area is required" }));
//       return;
//     } else if (area.length < 3) {
//       setErrorState((prev) => ({
//         ...prev,
//         area: "area must be at least 3 characters long",
//       }));
//       return;
//     }

//     // Checking for similar number and email

//     try {
//       const response = await ERPApi.get(
//         `${import.meta.env.VITE_API_URL}/student/mobemailregdata`
//       );

//       if (response && response.data && response?.data?.students.length < 0) {
//         handleNext();
//       }

//       if (
//         response &&
//         response?.data &&
//         response?.data?.students &&
//         response?.data?.students.length > 0
//       ) {
//         const students = response?.data?.students?.map((student) => student);

//         // if you get back an empty array then it will throw a console error
//         if (!students || students.length === 0) {
//           console.error("No student data found.");
//           return;
//         }

//         // Check if email exists or not
//         const emailExists = students?.some(
//           (student) => student.email === email
//         );

//         // Check if phone exists or not
//         const phoneExists = students?.some(
//           (student) => student.mobilenumber === mobilenumber
//         );

//         if (emailExists) {
//           setErrorState((prev) => ({ ...prev, email: "Email already exists" }));
//           return;
//         }
//         if (phoneExists) {
//           setErrorState((prev) => ({
//             ...prev,
//             contact: "Phone number already exists",
//           }));
//           return;
//         }
//       }
//       setValidations((prev) => ({ ...prev, student: true }));
//       handleNext();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleOtherChanges = () => {
//     if (!admissionremarks) {
//       setErrorState((prev) => ({
//         ...prev,
//         admissionremarks: "Admission Remarks is required",
//       }));
//       return;
//     }
//     setValidations((prev) => ({ ...prev, others: true }));
//     handleNext();
//   };

//   const handleParentDetails = () => {
//     if (!parentsname) {
//       setErrorState((prev) => ({
//         ...prev,
//         parentsname: "parentsname is required",
//       }));
//       return;
//     } else if (parentsname.length < 3) {
//       setErrorState((prev) => ({
//         ...prev,
//         parentsname: "parentsname must be at least 3 characters long",
//       }));
//       return;
//     }

//     if (!parentsnumber) {
//       setErrorState((prev) => ({
//         ...prev,
//         parentsnumber: "Parent Number is required",
//       }));

//       return;
//     } else {
//       if (parentsnumber.length !== 10) {
//         setErrorState((prev) => ({
//           ...prev,
//           parentsnumber: "Number is invalid",
//         }));

//         return;
//       }
//     }
//     setValidations((prev) => ({ ...prev, parent: true }));

//     handleNext();
//   };
//   const handleEducationDetails = () => {
//     if (!educationtype) {
//       setErrorState((prev) => ({
//         ...prev,
//         educationtype: "Education type is required",
//       }));
//       return;
//     }
//     if (!marks) {
//       setErrorState((prev) => ({
//         ...prev,
//         marks: "Percentage is required",
//       }));
//       return;
//     }
//     if (!academicyear || parseInt(academicyear) > 2024) {
//       setErrorState((prev) => ({
//         ...prev,
//         academicyear: "Enter Valid year",
//       }));
//       return;
//     }
//     if (educationtype === "others") {
//       setEducationType(customEducationType);
//     }
//     setValidations((prev) => ({ ...prev, education: true }));

//     handleNext();
//   };
//   // -----photo start--------------------------------------
//   const fileInputRef = useRef(null);
//   // const [resizedImage, setResizedImage] = useState(null);

//   const [studentImage, setSelectedFile] = useState(null);

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       try {
//         const targetSizeInBytes = 45 * 1024;
//         const resizedImage = await resizeImage(file, targetSizeInBytes);
//         const { width, height } = await getImageSize(resizedImage);
//         const sizeInKB = (resizedImage.size / 1024).toFixed(2);
//         setSelectedFile(resizedImage);
//         // setImageName(file.name);
//       } catch (error) {
//         console.error("Error processing image:", error);
//       }
//     }
//   };

//   const getImageSize = (file) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();

//       img.onload = () => {
//         resolve({ width: img.width, height: img.height });
//       };

//       img.onerror = (error) => {
//         reject(error);
//       };

//       const reader = new FileReader();

//       reader.onload = (e) => {
//         img.src = e.target.result;
//       };

//       reader.onerror = (error) => {
//         reject(error);
//       };

//       reader.readAsDataURL(file);
//     });
//   };

//   const resizeImage = async (file, targetSize) => {
//     const img = new Image();
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     img.src = URL.createObjectURL(file);

//     await new Promise((resolve) => {
//       img.onload = resolve;
//     });

//     let width = img.width;
//     let height = img.height;
//     let resizedFile = file;

//     while (resizedFile.size > targetSize) {
//       width *= 0.9;
//       height *= 0.9;

//       canvas.width = width;
//       canvas.height = height;

//       ctx.clearRect(0, 0, width, height);
//       ctx.drawImage(img, 0, 0, width, height);

//       const blob = await new Promise((resolve) => {
//         canvas.toBlob(resolve, "image/jpeg", 0.85);
//       });

//       resizedFile = new File([blob], file.name, { type: blob.type });
//     }

//     return resizedFile;
//   };

//   const handlePhoto = () => {
//     // const maxSizeInBytes = 45 * 1024; // 40 KB in bytes
//     // if (studentImage.size > maxSizeInBytes) {
//     //   alert("Image size is too large. Maximum allowed size is 45 KB");
//     //   return;
//     // }

//     // Image size is within the limit, proceed to the next step
//     handleNext();
//   };

//   // ----photo end--------------------------------------------
//   const handleAdmissionDetails = () => {
//     if (!enquirydate) {
//       setErrorState((prev) => ({
//         ...prev,
//         enquirydate: "Enquiry Date is required",
//       }));
//       return;
//     } else if (!enquirytakenby) {
//       setErrorState((prev) => ({
//         ...prev,
//         enquirytakenby: "Enquiry Taken by is required",
//       }));
//       return;
//     } else if (!coursePackage?.coursepackage) {
//       setErrorState((prev) => ({
//         ...prev,
//         coursepackage: "Course Package is required",
//       }));
//       return;
//     } else if (!courses.coursesId) {
//       setErrorState((prev) => ({ ...prev, courses: "Courses is required" }));
//       return;
//     } else if (!leadsource) {
//       setErrorState((prev) => ({
//         ...prev,
//         leadsource: "Lead Source is required",
//       }));
//       return;
//     }
//     if (
//       leadsource[0].source
//         .toLowerCase()
//         .split(" ")
//         .filter(Boolean)
//         .join(" ") === "student referral" ||
//       leadsource[0].source
//         .toLowerCase()
//         .split(" ")
//         .filter(Boolean)
//         .join(" ") === "employee referral"
//     ) {
//       setLeadSource([CustomLeadSource]);
//     } else if (!branch.branch) {
//       setErrorState((prev) => ({ ...prev, branch: "Branch is required" }));
//       return;
//     } else if (!modeoftraining) {
//       setErrorState((prev) => ({
//         ...prev,
//         modeoftraining: "Mode of Training is required",
//       }));
//       return;
//     } else if (!admissiondate) {
//       setErrorState((prev) => ({
//         ...prev,
//         admissiondate: "Admission Date is required",
//       }));
//       return;
//     } else if (!validitystartdate) {
//       setErrorState((prev) => ({
//         ...prev,
//         validitystartdate: "Validity Start Date is required",
//       }));
//       return;
//     } else if (!validityenddate) {
//       setErrorState((prev) => ({
//         ...prev,
//         validityenddate: "Validity End Date is required",
//       }));
//       return;
//     }
//     setValidations((prev) => ({ ...prev, admission: true }));

//     handleNext();
//   };

//   useEffect(() => {
//     const today = new Date(validitystartdate);
//     const futureDate = new Date(
//       today.getFullYear(),
//       today.getMonth() + 10,
//       today.getDate()
//     );

//     // Format the future date as a string (e.g., "YYYY-MM-DD")
//     const formattedFutureDate = `${futureDate.getFullYear()}-${(
//       futureDate.getMonth() + 1
//     )
//       .toString()
//       .padStart(2, "0")}-${futureDate.getDate().toString().padStart(2, "0")}`;
//     setValidityEndDate(formattedFutureDate);
//   }, [validitystartdate]);

//   const handleReset = () => { };
//   // useEffect(() => {
//   //   setuserid(user.id);
//   // }, [user]);

//   useEffect(() => {
//     // Clear error messages on change
//     setErrorState((prev) => ({
//       ...prev,
//       name: "",
//       email: "",
//       imageUrl: "",
//       dob: "",
//       contact: "",
//       wpNum: "",
//       gender: "",
//       marital: "",
//       college: "",
//       pincode: "",
//       country: "",
//       state: "",
//       area: "",
//       native: "",
//       parentsname: "",
//       parentsnumber: "",
//       educationtype: "",
//       marks: "",
//       academicyear: "",
//       enquirydate: "",
//       enquirytakenby: "",
//       coursepackage: "",
//       courses: "",
//       leadsource: "",
//       branch: "",
//       modeoftraining: "",
//       admissiondate: "",
//       validitystartdate: "",
//       validityenddate: "",
//       feetype: "",
//       amount: "",
//       admissionremarks: "",
//     }));
//   }, [
//     name,
//     email,
//     imageUrl,
//     birthdate,
//     mobilenumber,
//     whatsappno,
//     gender,
//     maritalstatus,
//     college,
//     zipcode,
//     country,
//     state,
//     area,
//     native,
//     parentsname,
//     parentsnumber,
//     educationtype,
//     marks,
//     academicyear,
//     enquirydate,
//     enquirytakenby,
//     coursePackage?.coursepackage,
//     courses?.courses,
//     leadsource,
//     branch,
//     modeoftraining,
//     admissiondate,
//     validitystartdate,
//     validityenddate,
//     feetype,
//     amount,
//     admissionremarks,
//   ]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const reader = new FileReader();
//     reader.onload = async () => {
//       const photoData = reader.result.split(",")[1];

//       // Validate the form data
//       if (!admissionremarks) {
//         setErrorState((prev) => ({
//           ...prev,
//           admissionremarks: "Admission Remarks is required",
//         }));
//         return;
//       }
//       if (!assets) {
//         toast.error("Please enter assets");
//         return;
//       }

//       // Create the data object with the form fields
//       let studentRegistrationdata = {
//         name,
//         email,
//         mobilenumber,
//         parentsname,
//         parentsnumber,
//         birthdate,
//         gender,
//         maritalstatus,
//         college,
//         country,
//         state,
//         area,
//         native,
//         zipcode,
//         whatsappno,
//         educationtype,
//         marks,
//         academicyear,
//         filename: studentImage.name,
//         imgData: photoData,
//         enquirydate,
//         enquirytakenby,
//         coursepackage: coursePackage?.coursepackage,
//         coursepackageId: coursePackage?.coursepackageId,
//         courses: courses?.courses,
//         coursesId: courses.coursesId,
//         leadsource,
//         branch: branch.branch,
//         branchId: branch.branchId,
//         modeoftraining,
//         admissiondate,
//         validitystartdate,
//         validityenddate,
//         feedetails,
//         grosstotal,
//         totaldiscount,
//         totaltax,
//         grandtotal,
//         finaltotal,
//         admissionremarks,
//         assets,
//         totalinstallments,
//         dueamount,
//         addfee,
//         initialpayment,
//         duedatetype,
//         installments,
//         materialfee,
//         feedetailsbilling,
//         totalfeewithouttax,
//         totalpaidamount,
//         student_status,
//         user_id,
//         certificate_status,
//         extra_discount,
//       };
//       // title case
//       studentRegistrationdata = [studentRegistrationdata];
//       const dataWithTitleCase = studentRegistrationdata.map((item) => {
//         const newItem = {};

//         for (const key in item) {
//           if (Object.prototype.hasOwnProperty.call(item, key)) {
//             if (typeof item[key] === "string" && key !== "email") {
//               newItem[key] = item[key]
//                 .split(" ")
//                 .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                 .join(" ");
//             } else {
//               newItem[key] = item[key];
//             }
//           }
//         }

//         return newItem;
//       });
//       studentRegistrationdata = dataWithTitleCase[0];
//       setLoading((prev) => !prev);
//       try {
//         const { data, status } = await toast.promise(
//           ERPApi.post(`/student/student_form`, studentRegistrationdata),
//           {
//             pending: "Verifing Enrollment Data...",
//           }
//         );

//         if (status === 201) {
//           const id = data.studentId;
//           getPaginatedStudentsData();
//           navigate(`/student/feeview/${id}`);
//           Swal.fire({
//             title: "Enrolled!",
//             text: "Student Enrolled Successfully!",
//             icon: "success",
//           });
//         }
//       } catch (error) {
//         const errorMessage = error?.response?.data?.message
//           ? error?.response?.data?.message
//           : "Something went wrong Please Try Again 🤯";
//         Swal.fire({
//           title: "Error!",
//           text: errorMessage,
//           icon: "error",
//         });
//       } finally {
//         setLoading((prev) => !prev);
//       }
//     };
//     // Read the student image as a data URL
//     reader.readAsDataURL(studentImage);
//   };

//   useEffect(() => {
//     if (studentImage) {
//       displayImage(studentImage);
//     }
//   }, [studentImage]);

//   const handleFeeDelete = (id) => {
//     const updatedTasks = feedetails.filter((task) => task.id !== id);
//     setFeeDetails(updatedTasks);
//   };

//   const fetchData = async () => {
//     if (zipcode && zipcode.length > 2) {
//       try {
//         const response = await axios.get(
//           `https://api.postalpincode.in/pincode/${zipcode}`
//         );

//         if (response.data.length > 0) {
//           const postOffice = response.data[0]?.PostOffice[0];

//           if (postOffice) {
//             const {
//               Region: city,
//               State: state,
//               Country: country,
//               Block: area,
//             } = postOffice;

//             setCountry(country);
//             setState(state);
//             setArea(area || "");
//             setNative(city || "");
//           } else {
//             // Clear the state if no post office data is available
//             setCountry("");
//             setState("");
//             setArea("");
//             setNative("");
//           }
//         } else {
//           // Clear the state if no data is returned
//           setCountry("");
//           setState("");
//           setArea("");
//           setNative("");
//         }
//       } catch (error) {
//         console.error("Error fetching location information:", error);
//         // Handle error as needed
//       }
//     } else {
//       // Clear the state if the pincode is not valid
//       setCountry("");
//       setState("");
//       setArea("");
//       setNative("");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [zipcode]);

//   function handleNext() {
//     setActiveTab((prevActiveTab) => prevActiveTab + 1);
//   }

//   const handlePrev = () => {
//     setActiveTab((prevActiveTab) => prevActiveTab - 1);
//   };
//   const handleKeyDown = (event) => {
//     if (event.keyCode === 38 || event.keyCode === 40) {
//       event.preventDefault(); // Prevent default behavior of arrow keys
//     }
//   };
//   const fixCurrentDate = new Date().toISOString().split("T")[0];

//   // admissionDate
//   const today = new Date();
//   const todayString = today.toISOString().split("T")[0];

//   const dayBeforeYesterday = new Date(today);
//   dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
//   const dayBeforeYesterdayString = dayBeforeYesterday
//     .toISOString()
//     .split("T")[0];

//   return (
//     <div>
//       <BackButton heading="Registration Form" content="Back" to="/" />
//       <div className="container-fluid">
//         <div className="registration_form_section  ">
//           <div className="top">
//             <div className="registration_form_tabs row">
//               <div className="button_grp col-lg-12 p-0">
//                 <button
//                   type="button"
//                   className={
//                     activeTab === 1
//                       ? `${theme === "light"
//                         ? "form_tab_btn active w-100 "
//                         : "form_tab_btn dark active"
//                       }`
//                       : "form_tab_btn"
//                   }
//                   style={{ cursor: "auto" }}
//                 >
//                   Student Details
//                 </button>
//                 <button
//                   type="button"
//                   className={
//                     activeTab === 2
//                       ? `${theme === "light"
//                         ? "form_tab_btn active w-100"
//                         : "form_tab_btn dark active"
//                       }`
//                       : "form_tab_btn "
//                   }
//                   style={{ cursor: "auto" }}
//                 >
//                   Parent Details
//                 </button>
//                 <button
//                   type="button"
//                   className={
//                     activeTab === 3
//                       ? `${theme === "light"
//                         ? "form_tab_btn active w-100"
//                         : "form_tab_btn dark active"
//                       }`
//                       : "form_tab_btn "
//                   }
//                   style={{ cursor: "auto" }}
//                 >
//                   Education Details
//                 </button>
//                 <button
//                   type="button"
//                   className={
//                     activeTab === 4
//                       ? `${theme === "light"
//                         ? "form_tab_btn active w-100"
//                         : "form_tab_btn dark active"
//                       }`
//                       : "form_tab_btn "
//                   }
//                   style={{ cursor: "auto" }}
//                 >
//                   Admission Details
//                 </button>
//                 <button
//                   type="button"
//                   className={
//                     activeTab === 5
//                       ? `${theme === "light"
//                         ? "form_tab_btn active w-100"
//                         : "form_tab_btn dark active"
//                       }`
//                       : "form_tab_btn "
//                   }
//                   style={{ cursor: "auto" }}
//                 >
//                   Fee Details
//                 </button>
//                 <button
//                   type="button"
//                   className={
//                     activeTab === 6
//                       ? `${theme === "light"
//                         ? "form_tab_btn active w-100"
//                         : "form_tab_btn dark active"
//                       }`
//                       : "form_tab_btn "
//                   }
//                   style={{ cursor: "auto" }}
//                 >
//                   Billing Details
//                 </button>
//                 <button
//                   type="button"
//                   className={
//                     activeTab === 7
//                       ? `${theme === "light"
//                         ? "form_tab_btn active w-100"
//                         : "form_tab_btn dark active"
//                       }`
//                       : "form_tab_btn "
//                   }
//                   style={{ cursor: "auto" }}
//                 >
//                   Others Details
//                 </button>
//                 <button
//                   type="button"
//                   className={
//                     activeTab === 8
//                       ? `${theme === "light"
//                         ? "form_tab_btn active w-100"
//                         : "form_tab_btn dark active"
//                       }`
//                       : "form_tab_btn "
//                   }
//                   style={{ cursor: "auto" }}
//                 >
//                   Complete Preview
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="bottom mt-3">
//             <form className="" onSubmit={handleSubmit}>
//               {/* Student Details Start */}
//               {activeTab === 1 && (
//                 <>
//                   <div className="row">
//                     <div className="form-group text-start col-lg-3 col-md-6 ">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rname"
//                       >
//                         Name<span className="text-danger">*</span>
//                       </label>

//                       <input
//                         className={
//                           errorState && errorState.name
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color text-capitalize"
//                         }
//                         id="rname"
//                         type="text"
//                         required
//                         onChange={(e) => setName(e.target.value)}
//                         value={name}
//                         placeholder="Enter your name"
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.name && (
//                           <span className="fs-xs text-danger ">
//                             {errorState.name}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="remail"
//                       >
//                         Email<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.email
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color "
//                         }
//                         id="remail"
//                         type="email"
//                         required
//                         onChange={(e) => setEmail(e.target.value)}
//                         value={email}
//                         placeholder="Enter your email address"
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.email && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.email}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         htmlhtmlFor="rphoto"
//                         className="form-label fs-s text_color"
//                       >
//                         Choose your photo<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.imageUrl
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         id="rphoto"
//                         ref={fileInputRef}
//                         type="file"
//                         onChange={handleFileChange}
//                       // value={imageName || ""}
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.imageUrl && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.imageUrl}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rdob"
//                       >
//                         Date of Birth<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.dob
//                             ? " form-control input_bg_color error-input date_input_color "
//                             : "form-control input_bg_color date_input_color"
//                         }
//                         id="rdob"
//                         type="date"
//                         onChange={(e) => setBirthDate(e.target.value)}
//                         max={fixCurrentDate}
//                         value={birthdate !== "" ? birthdate : undefined}
//                         onKeyDown={handleKeyDown}
//                       />
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.dob && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.dob}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="row mt-3">
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rcontactnum"
//                       >
//                         Contact Number<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.contact
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         id="rcontactnum"
//                         type="number"
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter Contact Number"
//                         required
//                         onChange={(e) => {
//                           let value = e.target.value.slice(0, 10);
//                           setMobileNumber(value);
//                         }}
//                         value={mobilenumber}
//                         max="10"
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.contact && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.contact}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rwhatsappnum"
//                       >
//                         Whatsapp Number<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.wpNum
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         id="rwhatsappnum"
//                         type="number"
//                         required
//                         onChange={(e) => {
//                           let value = e.target.value.slice(0, 10);
//                           setWhatsAppNo(value);
//                         }}
//                         value={whatsappno}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter WhatsApp number"
//                         max="10"
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.wpNum && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.wpNum}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="gender"
//                       >
//                         Gender<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className={
//                           errorState && errorState.gender
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select form-control input_bg_color text-capitalize"
//                         }
//                         aria-label="Default select example"
//                         id="gender"
//                         name="gender"
//                         onChange={(e) => setGender(e.target.value)}
//                         value={gender}
//                         required
//                       >
//                         <option disabled className="fs-s" value="">
//                           Select your Gender
//                         </option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                       </select>
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.gender && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.gender}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="maritalstatus"
//                       >
//                         Marital Status<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className={
//                           errorState && errorState.marital
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select form-control input_bg_color text-capitalize"
//                         }
//                         aria-label="Default select example"
//                         id="maritalstatus"
//                         name="maritalstatus"
//                         required
//                         onChange={(e) => setMaritalStatus(e.target.value)}
//                         value={maritalstatus}
//                       >
//                         <option disabled className="fs-s" value="">
//                           Your Marital Status
//                         </option>
//                         <option value="Single">Single</option>
//                         <option value="Married">Married</option>
//                       </select>
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.marital && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.marital}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="row mt-3">
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rcscname"
//                       >
//                         College/School/Company
//                         <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.college
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color text-capitalize"
//                         }
//                         id="rcscname"
//                         type="text"
//                         required
//                         onChange={(e) => setCollege(e.target.value)}
//                         value={college}
//                         onKeyDown={handleKeyDown}
//                         placeholder="College/School/Company"
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.college && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.college}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rpincode"
//                       >
//                         Pincode<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.pincode
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         maxLength={6}
//                         id="rpincode"
//                         type="number"
//                         required
//                         onChange={(e) => {
//                           let value = e.target.value.slice(0, 6);
//                           setZipcode(value);
//                         }}
//                         value={zipcode}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter your pincode"
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.pincode && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.pincode}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rcountry"
//                       >
//                         Country<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.country
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color text-capitalize"
//                         }
//                         id="rcountry"
//                         type="text"
//                         required
//                         onChange={(e) => setCountry(e.target.value)}
//                         value={country}
//                         placeholder="Enter your Country"
//                       />

//                       <div className="response" style={{ height: "9px" }}>
//                         {errorState && errorState.country && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.country}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rstate"
//                       >
//                         State<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.state
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color text-capitalize"
//                         }
//                         id="rstate"
//                         type="text"
//                         required
//                         onChange={(e) => setState(e.target.value)}
//                         value={state}
//                         placeholder="Enter your State"
//                       />
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.state && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.state}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="row mt-3">
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rnative"
//                       >
//                         Native Place<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.native
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color text-capitalize"
//                         }
//                         id="rnative"
//                         type="text"
//                         required
//                         onChange={(e) => setNative(e.target.value)}
//                         value={native}
//                         placeholder="Enter your Native Place"
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.native && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.native}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rarea"
//                       >
//                         Area<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.area
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color text-capitalize"
//                         }
//                         id="rarea"
//                         type="text"
//                         required
//                         onChange={(e) => setArea(e.target.value)}
//                         value={area}
//                         placeholder="Enter your Area"
//                       />
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.area && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.area}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="controls d-flex justify-content-between  mt-4">
//                     <div>
//                       {activeTab !== 1 && (
//                         <Button
//                           type="button"
//                           className="control_prev_btn text_color"
//                           onClick={handlePrev}
//                           icon={<IoMdArrowBack className="button_icons" />}
//                         >
//                           Go Back
//                         </Button>
//                       )}
//                     </div>

//                     <div>
//                       {activeTab !== 8 && (
//                         <Button
//                           type="button"
//                           className="btn  right btn_primary "
//                           onClick={handleBasicDetails}
//                           icon={<IoMdArrowForward />}
//                         >
//                           Continue
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {/* Student Details End */}

//               {/* Parent Details start */}
//               {activeTab === 2 && (
//                 <>
//                   <div className="row">
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rparentname"
//                       >
//                         Parent's/Guardian's Name
//                         <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.parentsname
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color text-capitalize"
//                         }
//                         id="rparentname"
//                         type="text"
//                         required
//                         onChange={(e) => setParentsName(e.target.value)}
//                         value={parentsname}
//                         placeholder="Enter Parent's/Guardian's Name"
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.parentsname && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.parentsname}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rparentscontact"
//                       >
//                         Parent's/Guardian's Contact
//                         <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.parentsnumber
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         id="rparentscontact"
//                         type="number"
//                         required
//                         onChange={(e) => {
//                           let value = e.target.value.slice(0, 10);
//                           SetParentsNumber(value);
//                         }}
//                         value={parentsnumber}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter Parent's/Guardian's contact"
//                         max="10"
//                       />
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.parentsnumber && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.parentsnumber}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* <div className="form-group text-start col-lg-3 col-md-6">
//                     <label
//                       className="form-label fs-s text_color"
//                       htmlFor="rgender"
//                     >
//                       Relation<span className="text-danger">*</span>
//                     </label>
//                     <select
//                       className="form-select select form-control input_bg_color"
//                       aria-label="Default select example"
//                       id="rrelation"
//                     >
//                       <option disabled className="fs-s" value="">
//                         --Select--
//                       </option>
//                       <option value="Father">Father</option>
//                       <option value="Mother">Mother</option>
//                       <option value="Brother">Brother</option>
//                       <option value="Sister">Sister</option>
//                       <option value="Uncle">Uncle</option>
//                       <option value="Aunt">Aunt</option>
//                     </select>
//                   </div> */}
//                   </div>
//                   <div className="controls d-flex justify-content-between  mt-4">
//                     <div>
//                       {activeTab !== 1 && (
//                         <Button
//                           type="button"
//                           className="btn control_prev_btn reg_btn text_color"
//                           onClick={handlePrev}
//                           icon={<IoMdArrowBack className="button_icons" />}
//                         >
//                           Go Back
//                         </Button>
//                       )}
//                     </div>

//                     <div>
//                       {activeTab !== 8 && (
//                         <Button
//                           type="button"
//                           className="btn  right btn_primary "
//                           onClick={handleParentDetails}
//                           icon={<IoMdArrowForward />}
//                         >
//                           Continue
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {/* Parent Details end */}

//               {/* Education Details Start */}
//               {activeTab === 3 && (
//                 <>
//                   <div className="row">
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="educationtype"
//                       >
//                         Education Type<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className={
//                           errorState && errorState.educationtype
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select form-control input_bg_color"
//                         }
//                         aria-label="Default select example"
//                         id="educationtype"
//                         name="educationtype"
//                         required
//                         onChange={handleEducationSelectChange}
//                         value={educationtype}
//                       >
//                         <option disabled className="fs-s" value="">
//                           ---Select---
//                         </option>
//                         <option value="B.Tech">B.Tech</option>
//                         <option value="MCA">MCA</option>
//                         <option value="SSC">SSC</option>
//                         <option value="Other">Other</option>
//                       </select>
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.educationtype && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.educationtype}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rpercentage"
//                       >
//                         Percentage<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.marks
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         maxLength={2}
//                         id="rpercentage"
//                         type="number"
//                         required
//                         onChange={(e) => {
//                           let value = e.target.value.slice(0, 2);
//                           setMarks(value);
//                         }}
//                         value={marks}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter your percentage"
//                       />
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.marks && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.marks}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="racademicyear"
//                       >
//                         Academic Year<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.academicyear
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         id="racademicyear"
//                         type="number"
//                         placeholder="Enter your academic year"
//                         required
//                         onChange={(e) => {
//                           let value = e.target.value.slice(0, 4);
//                           setAcademicyear(value);
//                         }}
//                         value={academicyear}
//                       />
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.academicyear && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.academicyear}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="controls d-flex justify-content-between  mt-4">
//                     <div>
//                       {activeTab !== 1 && (
//                         <Button
//                           type="button"
//                           className="btn control_prev_btn reg_btn text_color"
//                           onClick={handlePrev}
//                           icon={<IoMdArrowBack className="button_icons" />}
//                         >
//                           Go Back
//                         </Button>
//                       )}
//                     </div>

//                     <div>
//                       {activeTab !== 8 && (
//                         <Button
//                           type="button"
//                           className="btn  right btn_primary "
//                           onClick={handleEducationDetails}
//                           icon={<IoMdArrowForward />}
//                         >
//                           Continue
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {/* Education Details End */}

//               {/* Admission Details Start */}
//               {activeTab === 4 && (
//                 <>
//                   <div className="row">
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="renqiurydate"
//                       >
//                         Enquiry Date<span className="text-danger">*</span>
//                       </label>
//                       {/* <input
//                         className={
//                           errorState && errorState.enquirydate
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         id="renqiurydate"
//                         type="date"
//                         required
//                         onChange={(e) => setEnquiryDate(e.target.value)}
//                         value={enquirydate}
//                       /> */}
//                       <input
//                         className={
//                           errorState && errorState.enquirydate
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         type="date"
//                         id="renqiurydate"
//                         name="renqiurydate"
//                         onChange={(e) => setEnquiryDate(e.target.value)}
//                         required
//                         // max={fixCurrentDate}
//                         value={enquirydate !== "" ? enquirydate : undefined}
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.enquirydate && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.enquirydate}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="renqtakeby"
//                       >
//                         Enquiry taken by<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.enquirytakenby
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         id="renqtakeby"
//                         type="text"
//                         name="renqtakeby"
//                         required
//                         value={enquirytakenby}
//                         placeholder="Enter your Counsellor Name"
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.enquirytakenby && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.enquirytakenby}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="coursepackage"
//                       >
//                         Course Package<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className={
//                           errorState && errorState.coursepackage
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select form-control input_bg_color"
//                         }
//                         aria-label="Default select example"
//                         name="coursepackage"
//                         required
//                         // onChange={(e) => setCoursepakage(e.target.value)}
//                         // value={coursepackage}
//                         onChange={(e) => handleCoursePackage(e)}

//                         // onChange={(e) =>
//                         //   setCoursePackage({
//                         //     coursepackage: e.target.options[e.target.selectedIndex].text,
//                         //     coursepackageId: parseInt(e.target.value),
//                         //   })
//                         // }
//                         value={coursePackage?.coursepackageId || ""}
//                       >
//                         <option disabled className="fs-s" value="">
//                           --Select--
//                         </option>
//                         <option value={16}>Scholarship</option>
//                         <option value={12}>Certification Program</option>
//                         <option value={11}>Advanced Certification Program</option>
//                         <option value={10}>Post Graduation Certification Program</option>

//                         {/* {coursePackageState &&
//                           coursePackageState?.coursepackages?.map(
//                             (item, index) => (
//                               <option
//                                 key={item.id}
//                                 value={item.id}
//                               >
//                                 {item.coursepackages_name}
//                               </option>
//                             )
//                           )} */}

//                       </select>
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.coursepackage && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.coursepackage}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="courses"
//                       >
//                         Course<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className={
//                           errorState && errorState.courses
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select form-control input_bg_color"
//                         }
//                         style={{
//                           cursor: !coursePackage?.coursepackageId ? "not-allowed" : "pointer"
//                         }}
//                         aria-label="Default select example"
//                         id="courses"
//                         name="courses"
//                         required
//                         onChange={(e) =>
//                           setCourses({
//                             courses:
//                               e.target.options[e.target.selectedIndex].text,
//                             coursesId: parseInt(e.target.value),
//                           })
//                         }
//                         disabled={!coursePackage?.coursepackageId}
//                         value={courses?.coursesId || ""}
//                       >
//                         <option disabled className="fs-s" value="">
//                           --Select--
//                         </option>
//                         {/* {courseState?.courses &&
//                           courseState?.courses?.map((item, index) => (
//                             <option key={item?.id} value={item?.id}>
//                               {item?.course_name}
//                             </option>
//                           ))} */}

//                         {
//                           coursesList?.length > 0 && coursesList?.map((item, index) => (
//                             <option key={item.id} value={item.id}>
//                               {item.course_name}
//                             </option>
//                           ))
//                         }
//                       </select>
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState?.courses && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState?.courses}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="row mt-3">
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="leadsource"
//                       >
//                         Lead Source<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className={
//                           errorState && errorState.leadsource
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select  form-control input_bg_color"
//                         }
//                         aria-label="Default select example"
//                         id="leadsource"
//                         required
//                         onChange={handleLeadSourceSelectChange}
//                         value={leadsource.source}
//                       >
//                         <option disabled selected className="fs-s" value="">
//                           --Select--
//                         </option>
//                         {leadSourceState?.leadSources &&
//                           leadSourceState?.leadSources?.map((item, index) => (
//                             <option key={item.id} value={item.leadsource}>
//                               {item.leadsource}
//                             </option>
//                           ))}
//                       </select>
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.leadsource && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.leadsource}
//                           </p>
//                         )}
//                       </div>

//                       {leadsourceOptions && (
//                         <div className="mt-3">
//                           <label
//                             htmlFor=""
//                             className="form-label fs-s text_color"
//                           >
//                             Name<span className="text-danger">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control input_bg_color"
//                             required
//                             onChange={(e) =>
//                               setCustomLeadSource((prev) => ({
//                                 ...prev,
//                                 name: e.target.value,
//                               }))
//                             }
//                             value={CustomLeadSource.name || ""}
//                           />
//                           <label
//                             htmlFor=""
//                             className="form-label fs-s text_color"
//                           >
//                             Mobile Number<span className="text-danger">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control input_bg_color"
//                             required
//                             onChange={(e) =>
//                               setCustomLeadSource((prev) => ({
//                                 ...prev,
//                                 mobileNumber: e.target.value,
//                               }))
//                             }
//                             value={CustomLeadSource.mobileNumber || ""}
//                           />
//                         </div>
//                       )}
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="branch"
//                       >
//                         Branch<span className="text-danger">*</span>
//                       </label>

//                       <input
//                         className={
//                           errorState && errorState.branch
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select form-control input_bg_color"
//                         }
//                         id="branch"
//                         type="text"
//                         name="branch"
//                         required
//                         value={branch.branch}
//                         placeholder="Enter your Branch Name"
//                       />

//                       {/* <select
//                         className={
//                           errorState && errorState.branch
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select form-control input_bg_color"
//                         }
//                         aria-label="Default select example"
//                         id="branch"
//                         required
//                         onChange={(e) => setBranch(e.target.value)}
//                         value={branch}
//                       >
//                         <option disabled className="fs-s" value="">
//                           --Select--
//                         </option>
//                         {BranchState?.branches &&
//                           BranchState?.branches.map((item, index) => (
//                             <option key={item.id} value={item.branch_name}>
//                               {item.branch_name}
//                             </option>
//                           ))}
//                       </select> */}

//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState?.branch && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState?.branch}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="modeoftraining"
//                       >
//                         Mode Of Training<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className={
//                           errorState && errorState.modeoftraining
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select form-control input_bg_color"
//                         }
//                         aria-label="Default select example"
//                         id="modeoftraining"
//                         required
//                         onChange={(e) => setModeOfTraining(e.target.value)}
//                         value={modeoftraining}
//                       >
//                         <option disabled className="fs-s" value="">
//                           --Select--
//                         </option>
//                         <option value="Online">Online</option>
//                         <option value="Offline">Offline</option>
//                       </select>
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.modeoftraining && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.modeoftraining}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="radmissiondate"
//                       >
//                         Admission Date<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.admissiondate
//                             ? "form-control input_bg_color error-input date_input_color"
//                             : "form-control input_bg_color date_input_color"
//                         }
//                         id="radmissiondate"
//                         type="date"
//                         name="radmissiondate"
//                         required
//                         onChange={(e) => setAdmissionDate(e.target.value)}
//                         value={admissiondate}
//                         // min={dayBeforeYesterdayString}
//                         max={todayString}
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.admissiondate && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.admissiondate}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="row mt-3">
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rvaliditystartdate"
//                       >
//                         Validity Start Date
//                         <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.validitystartdate
//                             ? "form-control input_bg_color error-input date_input_color"
//                             : "form-control input_bg_color date_input_color"
//                         }
//                         id="rvaliditystartdate"
//                         type="date"
//                         name="rvaliditystartdate"
//                         onChange={(e) => setValidityStartDate(e.target.value)}
//                         value={validitystartdate}
//                         required
//                       />
//                       <div className="response" style={{ height: "8px" }}>
//                         {errorState && errorState.validitystartdate && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.validitystartdate}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rvalidityenddate"
//                       >
//                         Validity End Date<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.validityenddate
//                             ? "form-control input_bg_color error-input date_input_color"
//                             : "form-control input_bg_color date_input_color"
//                         }
//                         id="rvalidityenddate"
//                         type="date"
//                         name="rvalidityenddate"
//                         onChange={(e) => setValidityEndDate(e.target.value)}
//                         value={validityenddate}
//                         required
//                       />
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.validityenddate && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.validityenddate}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="controls d-flex justify-content-between  mt-4">
//                     <div>
//                       {activeTab !== 1 && (
//                         <Button
//                           type="button"
//                           className="btn control_prev_btn reg_btn text_color"
//                           onClick={handlePrev}
//                           icon={<IoMdArrowBack className="button_icons" />}
//                         >
//                           Go Back
//                         </Button>
//                       )}
//                     </div>

//                     <div>
//                       {activeTab !== 8 && (
//                         <Button
//                           type="button"
//                           className="btn  right btn_primary "
//                           onClick={handleAdmissionDetails}
//                           icon={<IoMdArrowForward />}
//                         >
//                           Continue
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {/* Admission Details End */}

//               {/* Fee Details Start */}
//               {activeTab === 5 && (
//                 <>
//                   <div className="row">
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rwhatsappnum"
//                       >
//                         Fee Type<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className={
//                           errorState && errorState.feetype
//                             ? "form-select select form-control input_bg_color error-input"
//                             : "form-select select form-control input_bg_color"
//                         }
//                         aria-label="Default select example"
//                         name="Fee Type"
//                         required
//                         onChange={(e) => setfeetype(e.target.value)}
//                         value={feetype}
//                       >
//                         <option disabled className="fs-s" value="">
//                           --Select--
//                         </option>
//                         <option value="Admission Fee">Admission Fee</option>
//                         <option value="fee">Fee</option>
//                       </select>
//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.feetype && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.feetype}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="courseamount"
//                       >
//                         Amount<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.amount
//                             ? "form-control input_bg_color error-input"
//                             : "form-control input_bg_color"
//                         }
//                         id="courseamount"
//                         type="number"
//                         name="courseamount"
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter Course Amount"
//                         required
//                         onChange={(e) => setAmount(e.target.value)}
//                         value={amount}
//                         disabled={amount ? true : false}
//                         style={{ cursor: amount ? "not-allowed" : "" }}
//                       />

//                       <div style={{ height: "8px" }}>
//                         {errorState && errorState.amount && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.amount}
//                           </p>
//                         )}
//                       </div>

//                     </div>

//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="discount"
//                       >
//                         Discount
//                       </label>
//                       <input
//                         className={"form-control input_bg_color"}
//                         id="discount"
//                         type="number"
//                         name="discount"
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter Discount"
//                         required
//                         onChange={(e) => setDiscount(e.target.value)}
//                         value={discount}
//                       />
//                     </div>

//                     <div className="col-lg-3 form-group text-start align-middle mt-4 pt-2">
//                       <Button
//                         onClick={handleFeeDetails}
//                         className="btn btn_primary fs-13"
//                       >
//                         Save
//                       </Button>
//                     </div>
//                   </div>
//                   {feedetails.length > 0 && (
//                     <div className="row mt-3">
//                       <div className="col-xl-12 ">
//                         <div className="table-responsive ">
//                           <table className="table table-hover align-midle table-nowrap mb-0">
//                             <thead>
//                               <tr>
//                                 <th
//                                   scope="col"
//                                   className="fs-13 lh-xs black_color text_color"
//                                 >
//                                   Fee Type
//                                 </th>
//                                 <th
//                                   scope="col"
//                                   className="fs-13 lh-xs black_color fw-600 text_color"
//                                 >
//                                   Amount
//                                 </th>
//                                 <th
//                                   scope="col"
//                                   className="fs-13 lh-xs black_color fw-600 text_color"
//                                 >
//                                   Discount
//                                 </th>
//                                 <th
//                                   scope="col"
//                                   className="fs-13 lh-xs black_color fw-600 text_color"
//                                 >
//                                   Tax Amount
//                                 </th>
//                                 <th
//                                   scope="col"
//                                   className="fs-13 lh-xs black_color fw-600 text_color"
//                                 >
//                                   Total Amount
//                                 </th>
//                                 <th
//                                   scope="col"
//                                   className="fs-13 lh-xs black_color fw-600 text_color"
//                                 >
//                                   Actions
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {feedetails.length > 0 &&
//                                 feedetails.map((item) => (
//                                   <tr key={item.id}>
//                                     <td className="fw-medium fs-13 text_color">
//                                       {item.feetype}
//                                     </td>
//                                     <td className="fs-13 text_color">
//                                       {item.amount}
//                                     </td>
//                                     <td className="fs-13 text_color">
//                                       {item.discount}
//                                     </td>
//                                     <td className="fs-13 text_color">
//                                       {parseFloat(item.taxamount.toFixed(2))}
//                                     </td>
//                                     <td className="fs-13 text_color">
//                                       {item.totalamount}
//                                     </td>
//                                     <td
//                                       onClick={() => handleFeeDelete(item.id)}
//                                     >
//                                       <MdDelete className="text_danger" />
//                                     </td>
//                                   </tr>
//                                 ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div className="controls d-flex justify-content-between  mt-4">
//                     <div>
//                       {activeTab !== 1 && (
//                         <Button
//                           type="button"
//                           className="btn control_prev_btn reg_btn text_color"
//                           onClick={handlePrev}
//                           icon={<IoMdArrowBack className="button_icons" />}
//                         >
//                           Go Back
//                         </Button>
//                       )}
//                     </div>

//                     <div>
//                       {activeTab !== 8 && (
//                         <Button
//                           type="button"
//                           className="btn  right btn_primary "
//                           onClick={handleFeecalculations}
//                           icon={<IoMdArrowForward />}
//                         >
//                           Continue
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {/* Fee Details End */}

//               {/* Billing Start */}
//               {activeTab === 6 && (
//                 <>
//                   <div className="row">
//                     <div className="col-xl-12 ">
//                       <div className="table-responsive ">
//                         <table className="table table-hover align-midle table-nowrap mb-0">
//                           <thead>
//                             <tr>
//                               <th
//                                 scope="col"
//                                 className="fs-13 lh-xs black_color fw-600 text_color"
//                               >
//                                 Gross Total
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="fs-13 lh-xs black_color fw-600 text_color"
//                               >
//                                 Total Discount
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="fs-13 lh-xs black_color fw-600 text_color"
//                               >
//                                 Total Amount
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             <tr>
//                               <td className="fs-13  text_color">
//                                 {grosstotal}
//                               </td>
//                               <td className="fs-13  text_color">
//                                 {totaldiscount}
//                               </td>
//                               <td className="fs-13  text_color">
//                                 {finaltotal}
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                     <div className="col-xl-12 ">
//                       <div className="table-responsive mt-2 ">
//                         <table className="table table-hover align-midle table-nowrap mb-0">
//                           <thead>
//                             <tr>
//                               <th
//                                 scope="col"
//                                 className="fs-13 lh-xs black_color fw-600 text_color"
//                               >
//                                 Fee Type
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="fs-13 lh-xs black_color fw-600 text_color"
//                               >
//                                 Fee (Excl. of GST)
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="fs-13 lh-xs black_color fw-600 text_color"
//                               >
//                                 Tax
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="fs-13 lh-xs black_color fw-600 text_color"
//                               >
//                                 Fee (Incl. of GST)
//                               </th>
//                             </tr>
//                           </thead>

//                           <tbody>
//                             {feedetailsbilling.length > 0 &&
//                               feedetailsbilling.map((item) => {
//                                 if (item.feetype !== "Material Fee") {
//                                   return (
//                                     <tr key={item.id}>
//                                       <td className=" fs-13 text_color">
//                                         {item.feetype}
//                                       </td>
//                                       <td className=" fs-13 text_color">
//                                         {parseFloat(
//                                           item.feewithouttax.toFixed(2)
//                                         )}
//                                       </td>
//                                       <td className=" fs-13 text_color">
//                                         {parseFloat(item.feetax.toFixed(2))}
//                                       </td>
//                                       <td className=" fs-13 text_color">
//                                         {parseFloat(item.feewithtax.toFixed(2))}
//                                       </td>
//                                     </tr>
//                                   );
//                                 }
//                               })}

//                             {feedetailsbilling.length > 0 && (
//                               <tr>
//                                 <td className="fw-medium fs-13 text_color">
//                                   <b>Sub Total</b>
//                                 </td>
//                                 <td className=" fs-13 text_color">
//                                   {parseFloat(totalfeewithouttax.toFixed(2))}
//                                 </td>
//                                 <td className=" fs-13 text_color">
//                                   {parseFloat(totaltax.toFixed(2))}
//                                 </td>
//                                 <td className=" fs-13 text_color">
//                                   {parseFloat(grandtotal.toFixed(2))}
//                                 </td>
//                               </tr>
//                             )}

//                             <tr>
//                               <td rowSpan={3} />
//                               <td rowSpan={3} />
//                               <td className="fs-13 text_color">Material Fee</td>
//                               <td className="fs-13 text_color">
//                                 {materialfee}
//                               </td>
//                             </tr>
//                             <tr>
//                               <td className="fw-medium fs-13 text_color">
//                                 <strong> Grand Total</strong>
//                               </td>
//                               <td className="fs-13 text_color">{finaltotal}</td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="controls d-flex justify-content-between  mt-4">
//                     <div>
//                       {activeTab !== 1 && (
//                         <Button
//                           type="button"
//                           className="btn control_prev_btn reg_btn text_color"
//                           onClick={handlePrev}
//                           icon={<IoMdArrowBack className="button_icons" />}
//                         >
//                           Go Back
//                         </Button>
//                       )}
//                     </div>

//                     <div>
//                       {activeTab !== 8 && (
//                         <Button
//                           type="button"
//                           className="btn  right btn_primary "
//                           onClick={handleNext}
//                           icon={<IoMdArrowForward />}
//                         >
//                           Continue
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {/* Billing End */}

//               {/* Others Start */}
//               {activeTab === 7 && (
//                 <>
//                   <div className="row">
//                     <div className="form-group text-start col-lg-3 col-md-6 ">
//                       <label
//                         className="form-label fs-s text_color"
//                         htmlFor="rremarks"
//                       >
//                         Remarks<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         className={
//                           errorState && errorState.admissionremarks
//                             ? "form-control input_bg_color error-input date_input_color"
//                             : "form-control input_bg_color date_input_color"
//                         }
//                         id="rremarks"
//                         type="text"
//                         name="rremarks"
//                         placeholder="Enter your Remarks"
//                         required
//                         onChange={(e) => setadmissionremarks(e.target.value)}
//                         value={admissionremarks}
//                       />
//                       <div style={{ height: "25px" }}>
//                         {errorState && errorState.admissionremarks && (
//                           <p className="text-danger m-0 fs-xs">
//                             {errorState.admissionremarks}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="form-group text-start col-lg-3 col-md-6">
//                       <label
//                         className="form-check-label fs-s text_color"
//                         for="cardtableCheck"
//                       >
//                         Assets
//                       </label>

//                       <div className="w-100 ">
//                         <div className="form-check ">
//                           <label
//                             className="form-check-label fs-s text_color"
//                             for="cardtableCheck"
//                           >
//                             Bag
//                           </label>
//                           <input
//                             className="form-check-input input_bg_color text_color"
//                             type="checkbox"
//                             id="cardtableCheck"
//                             name="bag"
//                             checked={assets.includes("bag")}
//                             onChange={handleAssetChange}
//                           />
//                         </div>

//                         <div className="form-check ">
//                           <label
//                             className="form-check-label fs-s text_color"
//                             for="cardtableCheck"
//                           >
//                             Laptop
//                           </label>
//                           <input
//                             className="form-check-input input_bg_color text_color"
//                             type="checkbox"
//                             id="cardtableCheck"
//                             name="laptop"
//                             checked={assets.includes("laptop")}
//                             onChange={handleAssetChange}
//                           />
//                         </div>

//                         <div className="form-check ">
//                           <label
//                             className="form-check-label fs-s text_color"
//                             for="cardtableCheck"
//                           >
//                             LMS
//                           </label>
//                           <input
//                             className="form-check-input input_bg_color text_color"
//                             type="checkbox"
//                             id="cardtableCheck"
//                             name="lms"
//                             checked={assets.includes("lms")}
//                             onChange={handleAssetChange}
//                           />
//                         </div>

//                         <div className="form-check ">
//                           <label
//                             className="form-check-label fs-s text_color"
//                             for="cardtableCheck"
//                           >
//                             Course Material
//                           </label>
//                           <input
//                             className="form-check-input input_bg_color text_color"
//                             type="checkbox"
//                             id="cardtableCheck"
//                             name="courseMaterial"
//                             checked={assets.includes("courseMaterial")}
//                             onChange={handleAssetChange}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="controls d-flex justify-content-between  mt-4">
//                     <div>
//                       {activeTab !== 1 && (
//                         <Button
//                           type="button"
//                           className="btn control_prev_btn reg_btn text_color"
//                           onClick={handlePrev}
//                           icon={<IoMdArrowBack className="button_icons" />}
//                         >
//                           Go Back
//                         </Button>
//                       )}
//                     </div>

//                     <div>
//                       {activeTab !== 8 && (
//                         <Button
//                           type="button"
//                           className="btn  right btn_primary "
//                           onClick={handleOtherChanges}
//                           icon={<IoMdArrowForward />}
//                         >
//                           Continue
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {/* Others End */}

//               {/* Preview Starts */}
//               {activeTab === 8 && (
//                 <>
//                   <div className="">
//                     <div className="card p-2">
//                       <div className="">
//                         <div className="row">
//                           <div className="col-lg-4 col-md-6  col-sm-4  mt-2">
//                             <img
//                               className="img-fluid "
//                               src={imageUrl}
//                               alt="user_img"
//                               width={"50%"}
//                             />
//                           </div>
//                           <div className="col-lg-4 col-md-6 col-sm-12">
//                             <div className="table-responsive table-scroll">
//                               <tbody className="fs-13 ">
//                                 <tr className="lh-400">
//                                   <td
//                                     className=" ps-0 black_300 fw-500   fs-13"
//                                     scope="row"
//                                   >
//                                     Name
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
//                                     <span className="ms-4">: </span> {name}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className=" ps-0 black_300 fw-500   fs-13"
//                                     scope="row"
//                                   >
//                                     Email
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
//                                     <span className="ms-4">: </span> {email}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className=" ps-0 black_300 fw-500   fs-13"
//                                     scope="row"
//                                   >
//                                     Date Of Birth
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
//                                     <span className="ms-4">: </span> {birthdate}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className=" ps-0 black_300 fw-500   fs-13"
//                                     scope="row"
//                                   >
//                                     Contact
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
//                                     <span className="ms-4">: </span>{" "}
//                                     {mobilenumber}
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </div>
//                           </div>
//                           <div className="col-lg-4 col-md-6  col-sm-12 ">
//                             <div className="table-responsive table-scroll">
//                               <tbody>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Pincode
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span> {zipcode}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Country
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span> {country}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     State
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span> {state}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Native Place
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span> {native}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Area
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>
//                                     {area}
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </div>
//                           </div>
//                           <div className="col-lg-4 col-md-6">
//                             <div className="table-responsive table-scroll">
//                               <tbody>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     WhatsApp Number
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>{" "}
//                                     {whatsappno}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Gender
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>
//                                     {gender}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Marital Status
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>{" "}
//                                     {maritalstatus}
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </div>
//                           </div>
//                           <div className="col-lg-4 col-md-6  col-sm-12 ">
//                             <div className="table-responsive table-scroll">
//                               <tbody>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Parent's Name
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>
//                                     {parentsname}
//                                   </td>
//                                 </tr>

//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Parent's Number
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>{" "}
//                                     {parentsnumber}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Academic Year
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>{" "}
//                                     {academicyear}
//                                   </td>
//                                 </tr>
//                               </tbody>
//                               {/* <p className="text_color">
//                           <b className="prev_bold">Relation:</b> Other
//                         </p> */}
//                             </div>
//                           </div>
//                           <div className="col-lg-4 col-md-6  col-sm-12">
//                             <div className="table-responsive table-scroll">
//                               <tbody>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Lead Source
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-4">: </span>
//                                     {leadsource[0].source}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Branch
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-4">: </span>{" "}
//                                     {branch?.branch}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Mode Of Training
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-4">: </span>{" "}
//                                     {modeoftraining}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Admission Date
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-4">: </span>{" "}
//                                     {admissiondate}
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </div>
//                           </div>

//                           <div className="col-lg-4 col-md-6  col-sm-4">
//                             <div className="table-responsive table-scroll">
//                               <tbody>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Validity Start Date
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>{" "}
//                                     {validitystartdate}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Validity End Date
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>
//                                     {validityenddate}
//                                   </td>
//                                 </tr>

//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Education Type
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>
//                                     {educationtype}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Percentage
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>
//                                     {marks}
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </div>
//                           </div>
//                           <div className="col-lg-6 col-md-6  col-sm-12">
//                             <div className="table-responsive table-scroll">
//                               <tbody>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Enquiry Date
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>
//                                     {enquirydate}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Enquiry taken by
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>{" "}
//                                     {enquirytakenby}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Course Package
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>{" "}
//                                     {coursePackage?.coursepackage}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13"
//                                     scope="row"
//                                   >
//                                     Course
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span>
//                                     {courses?.courses}
//                                   </td>
//                                 </tr>
//                                 <tr className="lh-400">
//                                   <td
//                                     className="ps-0 black_300 fw-500 text-start  fs-13 text-truncate"
//                                     style={{ maxWidth: "120px" }}
//                                     title="College/School/Company"
//                                     scope="row"
//                                   >
//                                     College/School/Company
//                                   </td>
//                                   <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
//                                     <span className="ms-5">: </span> {college}
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </div>
//                           </div>

//                           <div className="col-lg-12 ">
//                             <div className="table-responsive mt-2 ">
//                               <table className="table table-hover align-midle table-nowrap mb-0">
//                                 <thead>
//                                   <tr>
//                                     <th
//                                       scope="col"
//                                       className="fs-13 lh-xs black_color fw-600 text_color"
//                                     >
//                                       Fee Type
//                                     </th>
//                                     <th
//                                       scope="col"
//                                       className="fs-13 lh-xs black_color fw-600 text_color"
//                                     >
//                                       Amount
//                                     </th>
//                                     <th
//                                       scope="col"
//                                       className="fs-13 lh-xs black_color fw-600 text_color"
//                                     >
//                                       Discount
//                                     </th>
//                                     <th
//                                       scope="col"
//                                       className="fs-13 lh-xs black_color fw-600 text_color"
//                                     >
//                                       Tax Amount (Inclusive of GST)
//                                     </th>
//                                     <th
//                                       scope="col"
//                                       className="fs-13 lh-xs black_color fw-600 text_color"
//                                     >
//                                       Total Amount
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {feedetails &&
//                                     feedetails.map((item, index) => (
//                                       <tr key={index}>
//                                         <td className="fs-13 text_color">
//                                           {item.feetype}
//                                         </td>
//                                         <td className="fs-13 text_color">
//                                           {item.amount}
//                                         </td>
//                                         <td className="fs-13 text_color">
//                                           {item.discount}
//                                         </td>
//                                         <td className="fs-13 text_color">
//                                           {parseFloat(item.taxamount).toFixed(
//                                             2
//                                           )}
//                                         </td>
//                                         <td className="fs-13 text_color">
//                                           {item.feetype === "fee" ? (
//                                             <>
//                                               Materialfee: {materialfee}&nbsp;,
//                                               CourseFee:{" "}
//                                               {item.totalamount - materialfee}
//                                               <br />
//                                               <b>{item.totalamount}</b>
//                                             </>
//                                           ) : (
//                                             <b>{item.totalamount}</b>
//                                           )}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>

//                           <div className="col-lg-12 col-md-6 ">
//                             {admissionremarks && (
//                               <p className="text_color">
//                                 <b className="prev_bold"> Remarks:</b>{" "}
//                                 {admissionremarks}
//                               </p>
//                             )}
//                             {assets.length > 0 && (
//                               <p className="text_color">
//                                 <b className="prev_bold">Assets:</b>{" "}
//                                 {assets.map((item, index) => (
//                                   <span key={index}>
//                                     {index === assets.length - 1
//                                       ? item
//                                       : item + ", "}{" "}
//                                   </span>
//                                 ))}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="controls d-flex justify-content-between  mt-4">
//                     <div>
//                       {activeTab !== 1 && (
//                         <Button
//                           type="button"
//                           className="btn control_prev_btn reg_btn text_color"
//                           onClick={handlePrev}
//                           icon={<IoMdArrowBack className="button_icons" />}
//                         >
//                           Go Back
//                         </Button>
//                       )}
//                     </div>

//                     <div>
//                       {activeTab === 8 && (
//                         <Button
//                           type="submit"
//                           className="btn  right btn_primary "
//                           onClick={handleSubmit}
//                           icon={<IoMdCheckmark />}
//                           disabled={loading}
//                         >
//                           Submit
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {/* Preview ENd */}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RegistrationForm;
