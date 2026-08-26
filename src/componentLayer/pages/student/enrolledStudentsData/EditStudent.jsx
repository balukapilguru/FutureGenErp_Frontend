import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTheme } from "../../../../dataLayer/context/themeContext/ThemeContext";
import { IoMdArrowBack, IoMdCheckmark, IoMdArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import { useLeadSourceContext } from "../../../../dataLayer/hooks/useLeadSourceContext";
import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext";
import { useCoursePackage } from "../../../../dataLayer/hooks/useCoursePackage";
import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";
import { SearchSelect } from "../../../../utils/SearchSelect.jsx";

function EditStudent() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(1);
  const { theme } = useTheme();
  const { getPaginatedStudentsData } = useStudentsContext();
  // const { leadSourceState } = useLeadSourceContext();
  // const { courseState } = useCourseContext();
  // const { coursePackageState } = useCoursePackage();

  const { leadSource, cousreData, studentData } = useLoaderData();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [isPopupOpen, setPopupOpen] = useState(false);
  let select = "select";
  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  // registration form data
  const [user_id, setuserid] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return userData?.user?.id || "";
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [parentsname, setParentsName] = useState("");
  const [aadharCardImage, setAadharCardImage] = useState("");
  const [aadharCardNo, setAadharCardNumber] = useState("");
  const [tshirtSize, setTshirtSize] = useState("")
  // const [parentsnumber, SetParentsNumber] = useState("");
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
  // const [studentImage, setSelectedFile] = useState(null);
  // const [profilepic, setProfilePic] = useState("");
  const [enquirydate, setEnquiryDate] = useState("");
  const [enquirytakenby, setEnquiryTakenBy] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return userData?.user?.fullname || "";
  });

  const [coursepackage, setCoursepakage] = useState("");

  const [courses, setCourses] = useState("");
  const [leadsource, setLeadSource] = useState("");
  const [branch, setBranch] = useState("");
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

  const [coursePackage, setCoursePackage] = useState({
    coursepackage: "",
    coursepackageId: null,
  });


  const handleCoursePackage = (e) => {
    setCoursePackage((prev) => ({
      ...prev,
      coursepackage: e.target.options[e.target.selectedIndex].text,
      coursepackageId: parseInt(e.target.value),
    }))
  }
  const currentYear = new Date().getFullYear();
  const [errorState, setErrorState] = useState({});
  const [extra_discount, setExtra_Discount] = useState([]);
  let LoggedInuser = JSON.parse(localStorage.getItem("user"));
  let userName;

  const [formData, setFormData] = useState({
    studentImg: "",
    name: "",
    email: "",
    imageUrl: "",
    aadharCardNo: "",
    aadharCardImage: "",
    tshirtSize: "",
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
    educationtype: "",
    marks: "",
    academicyear: "",
    enquirydate: "",
    enquirytakenby: "",
    coursepackage: "",
    coursepackageId: "",
    courses: "",
    leadsource: "",
    branch: "",
    admissionremarks: "",
    modeoftraining: "",
    admissiondate: "",
    validitystartdate: "",
    validityenddate: "",
    feetype: "",
    amount: "",
  });


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
    }
  }, [LoggedInuser]);

  useEffect(() => {
    setuser((prevUser) => {
      return {
        ...prevUser,
        assets: assets,
      };
    });
  }, [assets]);

  // const handleAssetChange = (event) => {
  //   const assetName = event.target.value; // Use value instead of name
  //   setFormData((prevData) => {
  //     const updatedAssets = event.target.checked
  //       ? [...prevData.assets, assetName]
  //       : prevData.assets.filter((asset) => asset !== assetName);
  //     return {
  //       ...prevData,
  //       assets: updatedAssets,
  //     };
  //   });
  // };

  const handleAssetChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevData) => {
      if (type === "checkbox") {
        const updatedAssets = checked
          ? [...prevData.assets, value]
          : prevData.assets.filter((asset) => asset !== value);

        // If 'mac' is unchecked, clear the tshirtSize
        if (value === "mac" && !checked) {
          return {
            ...prevData,
            assets: updatedAssets,
            tshirtSize: "" // Clear tshirtSize when mac is unchecked
          };
        }

        return {
          ...prevData,
          assets: updatedAssets,
        };
      } else if (name === "tshirtSize") {
        return {
          ...prevData,
          tshirtSize: value,
        };
      }
      return prevData; // Return previous state if no relevant change
    });
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
      setAmount(499);
    }
    if (feetype === "fee") {
      let course = cousreData?.reversedCourses?.filter(
        (course) =>
          course.course_name === courses &&
          course.course_package === coursePackage?.coursepackage
      );
      if (course.length > 0) {
        setAmount(course[0].fee);
      } else {
        setAmount("");
      }
    }
  }, [feetype, courses, coursePackage?.coursepackage, cousreData]);

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
    let save = true;
    if (feetype === "fee") {
      let course = cousreData.reversedCourses.filter(
        (course) =>
          course.course_name === courses &&
          course.course_package === coursePackage?.coursepackage
      );

      if (
        course.length > 0 &&
        parseInt(discount) > parseInt(course[0].max_discount) &&
        course[0].course_name === courses &&
        course[0].course_package === coursePackage?.coursepackage
      ) {
        save = false;
        alert(`Discount cannot be greater than ${course[0].max_discount}`);
      }
    }
    if (save) {
      setFeeDetails([
        ...feedetails,
        {
          id: Date.now(),
          feetype: feetype,
          amount: amount,
          discount: discount,
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
  // * ------------------validations-------------------------------

  const handleBasicDetails = () => {
    if (!formData.name) {
      setErrorState((prev) => ({ ...prev, name: "Please enter the name" }));
      return;
    }
    if (!formData.email) {
      setErrorState((prev) => ({ ...prev, email: "Email is required" }));
      return;
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(formData.email)) {
        setErrorState((prev) => ({ ...prev, email: "Invalid Email Address" }));
        return;
      }
    }
    if (!formData.birthdate) {
      setErrorState((prev) => ({ ...prev, dob: "Date of birth is required" }));
      return;
    }

    if (!formData.mobilenumber) {
      setErrorState((prev) => ({ ...prev, contact: "Contact is required" }));
      return;
    } else {
      if (formData.mobilenumber.length !== 10) {
        setErrorState((prev) => ({
          ...prev,
          contact: "Incorrect mobile number",
        }));
        return;
      }
    }

    if (!formData.whatsappno) {
      setErrorState((prev) => ({ ...prev, wpNum: "WhatsApp Number required" }));
      return;
    } else {
      if (formData.whatsappno.length !== 10) {
        setErrorState((prev) => ({
          ...prev,
          wpNum: "Incorrect WhatsApp number",
        }));
        return;
      }
    }

    if (!formData.gender) {
      setErrorState((prev) => ({ ...prev, gender: "Gender is required" }));
      return;
    }

    if (!formData.maritalstatus) {
      setErrorState((prev) => ({
        ...prev,
        marital: "Marital status is required",
      }));
      return;
    }

    if (!formData.college) {
      setErrorState((prev) => ({
        ...prev,
        college: "College name is required",
      }));
      return;
    }

    if (!formData.zipcode) {
      setErrorState((prev) => ({ ...prev, pincode: "Pincode is required" }));
      return;
    }
    if (!formData.country) {
      setErrorState((prev) => ({ ...prev, country: "Country is required" }));
      return;
    }
    if (!formData.state) {
      setErrorState((prev) => ({ ...prev, state: "State is required" }));
      return;
    }
    if (!formData.area) {
      setErrorState((prev) => ({ ...prev, area: "Area is required" }));
      return;
    }
    if (!formData.native) {
      setErrorState((prev) => ({ ...prev, native: "Native is required" }));
      return;
    }

    handleNext();
  };

  const handleParentDetails = () => {
    if (!formData.parentsname) {
      setErrorState((prev) => ({
        ...prev,
        parentsname: "Parent Name is required",
      }));

      return;
    }

    handleNext();
  };
  const handleEducationDetails = () => {
    if (!formData.educationtype) {
      setErrorState((prev) => ({
        ...prev,
        educationtype: "Education type is required",
      }));
      return;
    }
    if (!formData.marks) {
      setErrorState((prev) => ({
        ...prev,
        marks: "Percentage is required",
      }));
      return;
    }
    if (!formData.academicyear) {
      setErrorState((prev) => ({
        ...prev,
        academicyear: "Academic Year is required",
      }));
      return;
    } else {
      if (
        !/^\d{4}$/.test(formData.academicyear) ||
        parseInt(formData.academicyear) > currentYear
      ) {
        setErrorState((prev) => ({
          ...prev,
          academicyear: "Enter a valid year ",
        }));
        return;
      }
    }

    if (formData.educationtype === "others") {
      setEducationType(customEducationType);
    }

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
        setFormData((prev) => ({ ...prev, imageUrl: studentImage }));
      } catch (error) { }
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
  useEffect(() => {
    if (studentImage) {
      displayImage(studentImage);
    }
  }, [studentImage]);

  const [showImage, setShowImage] = useState({
    url: null,
  });

  const handleFileChange1 = (event) => {
    const { id, value, files } = event.target;
    if (id === "studentImg" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          studentImg: file,
        }));
        setShowImage((prev) => ({
          ...prev,
          url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileChange2 = (event) => {
    const { id, value, files } = event.target;
    if (id === "aadharCardImage" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          aadharCardImage: file,
        }));
        setShowImage((prev) => ({
          ...prev,
          url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const relevantCoursePackageIds = [31, 26, 19];

  const shouldShowMacAndTshirt = relevantCoursePackageIds.includes(
    formData?.coursepackageId
  );

  // ----photo end--------------------------------------------
  const handleAdmissionDetails = () => {
    if (!formData.enquirydate) {
      setErrorState((prev) => ({
        ...prev,
        enquirydate: "Enquiry Date is required",
      }));
      return;
    }
    // else if (!formData.enquirytakenby) {
    //     setErrorState((prev) => ({
    //         ...prev,
    //         enquirytakenby: "Enquiry Taken by is required",
    //     }));
    //     return;
    // }
    else if (!formData.coursepackage) {
      setErrorState((prev) => ({
        ...prev,
        coursepackage: "Course Package is required",
      }));
      return;
    } else if (!formData.courses) {
      setErrorState((prev) => ({ ...prev, courses: "Courses is required" }));
      return;
    } else if (!formData.leadsource) {
      setErrorState((prev) => ({
        ...prev,
        leadsource: "Lead Source is required",
      }));
      return;
    } else if (!formData.branch) {
      setErrorState((prev) => ({ ...prev, branch: "Branch is required" }));
      return;
    } else if (!formData.modeoftraining) {
      setErrorState((prev) => ({
        ...prev,
        modeoftraining: "Mode of Training is required",
      }));
      return;
    } else if (!formData.admissiondate) {
      setErrorState((prev) => ({
        ...prev,
        admissiondate: "Admission Date is required",
      }));
      return;
    } else if (!formData.validitystartdate) {
      setErrorState((prev) => ({
        ...prev,
        validitystartdate: "Validity Start Date is required",
      }));
      return;
    } else if (!formData.validityenddate) {
      setErrorState((prev) => ({
        ...prev,
        validityenddate: "Validity End Date is required",
      }));
      return;
    } else if (!formData.admissionremarks) {
      setErrorState((prev) => ({
        ...prev,
        admissionremarks: "admissionremarks is required",
      }));
      return;
    }

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
      aadharCardNo: "",
      aadharCardImage: "",
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
      admissionremarks: "",
      modeoftraining: "",
      admissiondate: "",
      validitystartdate: "",
      validityenddate: "",
      feetype: "",
      amount: "",
    }));
  }, [
    name,
    email,
    imageUrl,
    aadharCardNo,
    aadharCardImage,
    birthdate,
    mobilenumber,
    whatsappno,
    gender,
    maritalstatus,
    college,
    zipcode,
    country,
    state,
    admissionremarks,
    area,
    native,
    parentsname,
    // parentsnumber,
    educationtype,
    marks,
    academicyear,
    enquirydate,
    enquirytakenby,
    coursePackage?.coursepackage,
    courses,
    leadsource,
    branch,
    modeoftraining,
    admissiondate,
    validitystartdate,
    validityenddate,
    feetype,
    amount,
  ]);
  const [error, setError] = useState({});
  const [selectedLeadSource, setSelectedLeadSource] = useState(
    {
      label: studentData?.student?.[0]?.leadsource?.[0]?.source || "",
      value: studentData?.student?.[0]?.leadsource?.[0]?.source || "",
    }
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      [name]: "", // Reset error for the field being changed
    }));
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id && studentData) {
        setFormData(studentData?.student?.[0]);
        setCoursePackage({
          // coursepackage: data?.student[0]?.coursepackage,
          coursepackage: "Advanced Certification Program",
          coursepackageId: studentData?.student?.[0]?.coursepackageId,
        })

        console.log(studentData?.student?.[0], "student data");
        // try {
        //   const { data, status } = await ERPApi.get(
        //     `${import.meta.env.VITE_API_URL}/student/viewstudentdata/${id}`
        //   );
        //   if (status === 200) {
        //     setFormData(data?.student[0]);
        //     setCoursePackage({
        //       // coursepackage: data?.student[0]?.coursepackage,
        //       coursepackage: "Advanced Certification Program",
        //       coursepackageId: data?.student[0]?.coursepackageId,
        //     })

        //   }
        // } catch (error) {
        //   console.error(error)
        // }
      }
    };
    fetchData();
  }, [id]);

  const [user, setuser] = useState();

  useEffect(() => {
    if (studentImage) {
      displayImage(studentImage);
    }
  }, [studentImage]);

  const fetchData = async () => {
    const { zipcode } = formData;
    if (zipcode && zipcode.length > 2) {
      try {
        const response = await ERPApi.get(
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      setLoading((prev) => !prev);
      try {
        const { data, status } = await toast.promise(
          ERPApi.put(`/student/updatestudentdata/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }),
          {
            pending: "Verifying Student Data...",
          }
        );
        if (status === 200) {
          // getPaginatedStudentsData();
          navigate(`/student/list`);
          Swal.fire({
            title: "Updated!",
            text: "Student Updated Successfully!",
            icon: "success",
          });
        }
      } catch (error) {
        console.error(error);
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
    }
  };

  return (
    <div>
      <BackButton heading="Edit Form" content="Back" />
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
                        ? "form_tab_btn active"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                >
                  Student Details
                </button>
                <button
                  type="button"
                  className={
                    activeTab === 2
                      ? `${theme === "light"
                        ? "form_tab_btn active"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                >
                  Parent Details
                </button>
                <button
                  type="button"
                  className={
                    activeTab === 3
                      ? `${theme === "light"
                        ? "form_tab_btn active"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                >
                  Education Details
                </button>
                <button
                  type="button"
                  className={
                    activeTab === 4
                      ? `${theme === "light"
                        ? "form_tab_btn active"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                >
                  Admission Details
                </button>

                <button
                  type="button"
                  className={
                    activeTab === 5
                      ? `${theme === "light"
                        ? "form_tab_btn active"
                        : "form_tab_btn dark active"
                      }`
                      : "form_tab_btn "
                  }
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
          <div className="bottom mt-3">
            <form className="" onSubmit={handleSubmit}>
              {/* Student Details Start */}
              {activeTab === 1 && (
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
                            : "form-control input_bg_color"
                        }
                        id="rname"
                        type="text"
                        required
                        name="name"
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, name: "" }))
                        }
                        value={formData?.name}
                        placeholder="Enter your name"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.name && (
                          <span className="fs-xs text-danger">
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
                            : "form-control input_bg_color"
                        }
                        id="remail"
                        type="email"
                        name="email"
                        required
                        value={formData?.email}
                        placeholder="Enter your email address"
                        onChange={handleChange}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.email && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.email}
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
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="rdob"
                        type="date"
                        name="birthdate"
                        onChange={handleChange}
                        value={formData?.birthdate}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, birthdate: "" }))
                        }
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
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        htmlhtmlFor="studentImg"
                        className="form-label fs-s text_color"
                      >
                        Choose your photo<span className="text-danger">*</span>
                      </label>

                      <input
                        className={
                          errorState && errorState.studentImg
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="studentImg"
                        name="studentImg"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange1(e)}

                      // value={imageName || ""}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.studentImg && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.studentImg}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
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
                            : "form-select select form-control input_bg_color"
                        }
                        aria-label="Default select example"
                        id="gender"
                        name="gender"
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, gender: "" }))
                        }
                        value={formData?.gender}
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
                            ? "form-control input_bg_color error-input select form-select"
                            : "form-control input_bg_color select form-select"
                        }
                        aria-label="Default select example"
                        id="maritalstatus"
                        name="maritalstatus"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({
                            ...prev,
                            maritalstatus: "",
                          }))
                        }
                        value={formData?.maritalstatus}
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
                            : "form-control input_bg_color"
                        }
                        id="rcscname"
                        type="text"
                        name="college"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, college: "" }))
                        }
                        value={formData?.college}
                        onKeyDown={handleKeyDown}
                        placeholder="College/School/Company"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.college && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.college}
                          </p>
                        )}
                      </div>
                    </div>
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
                        name="mobilenumber"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Contact Number"
                        required
                        // onChange={(e) => {

                        //     let value = e.target.value.slice(0, 10);
                        //     setMobileNumber(value);
                        // }}
                        value={formData?.mobilenumber}
                        max="10"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.contact && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.contact}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
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
                        onChange={handleChange}
                        name="whatsappno"
                        required
                        // onChange={(e) => {

                        //   let value = e.target.value.slice(0, 10);
                        //   setWhatsAppNo(value);
                        // }}
                        value={formData?.whatsappno}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter WhatsApp number"
                        max="10"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.wpNum && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.wpNum}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        htmlhtmlFor="aadharCardImage"
                        className="form-label fs-s text_color"
                      >
                        Upload Aadhar Image<span className="text-danger">*</span>
                      </label>

                      <input
                        className={
                          errorState && errorState.aadharCardImage
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="aadharCardImage"
                        name="aadharCardImage"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange2(e)}

                      // value={imageName || ""}
                      />
                      <div style={{ height: "8px" }}>
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
                        htmlFor="aadharCardNo"
                      >
                        Aadhar Number<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.aadharCardNo
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="aadharCardNo"
                        type="number"
                        name="aadharCardNo"
                        required
                        onChange={(e) => {
                          handleChange(e);
                          fetchData();
                        }}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, aadharCardNo: "" }))
                        }
                        value={formData?.aadharCardNo}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your aadhar Number"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.aadharCardNo && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.aadharCardNo}
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
                        id="rpincode"
                        type="number"
                        name="zipcode"
                        required
                        onChange={(e) => {
                          handleChange(e);
                          fetchData();
                        }}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, pincode: "" }))
                        }
                        value={formData?.zipcode}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your pincode"
                      />
                      <div style={{ height: "8px" }}>
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
                            : "form-control input_bg_color"
                        }
                        id="rcountry"
                        type="text"
                        name="country"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, country: "" }))
                        }
                        value={formData?.country}
                        placeholder="Enter your Country"
                      />

                      <div style={{ height: "8px" }}>
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
                            : "form-control input_bg_color"
                        }
                        id="rstate"
                        type="text"
                        name="state"
                        required
                        onChange={handleChange}
                        value={formData?.state}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, state: "" }))
                        }
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
                            : "form-control input_bg_color"
                        }
                        id="rnative"
                        type="text"
                        name="native"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, native: "" }))
                        }
                        value={formData?.native}
                        placeholder="Enter your Native Place"
                      />
                      <div style={{ height: "8px" }}>
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
                            : "form-control input_bg_color"
                        }
                        id="rarea"
                        type="text"
                        name="area"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, area: "" }))
                        }
                        value={formData?.area}
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
                          className="control_prev_btn "
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {activeTab !== 8 && (
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
              {activeTab === 2 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rparentname"
                      >
                        Parent's Name<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.parentsname
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="rparentname"
                        type="text"
                        name="parentsname"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({
                            ...prev,
                            parentsname: "",
                          }))
                        }
                        value={formData?.parentsname}
                        placeholder="Enter your Parent's Name"
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.parentsname && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.parentsname}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="rparentscontact"
                                            >
                                                Parent's Contact<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errorState && errorState.parentsnumber
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color"
                                                }
                                                id="rparentscontact"
                                                type="number"
                                                name="parentsnumber"
                                                required
                                                onChange={handleChange}
                                                value={formData.parentsnumber}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Enter your Parent's contact"
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errorState && errorState.parentsnumber && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errorState.parentsnumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div> */}
                  </div>
                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {activeTab !== 1 && (
                        <Button
                          type="button"
                          className="btn control_prev_btn reg_btn"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {activeTab !== 8 && (
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
              {activeTab === 3 && (
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
                            ? "form-control input_bg_color error-input select form-select"
                            : "form-control input_bg_color select form-select"
                        }
                        aria-label="Default select example"
                        id="educationtype"
                        name="educationtype"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({
                            ...prev,
                            educationtype: "",
                          }))
                        }
                        value={formData?.educationtype}
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
                        id="rpercentage"
                        type="number"
                        name="marks"
                        required
                        onChange={handleChange}
                        value={formData?.marks}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, marks: "" }))
                        }
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
                        type=""
                        name="academicyear"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({
                            ...prev,
                            academicyear: "",
                          }))
                        }
                        value={formData?.academicyear}
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
                          className="btn control_prev_btn reg_btn"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {activeTab !== 8 && (
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
              {activeTab === 4 && (
                <>
                  <div className="row">
                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="renqiurydate"
                      >
                        Enquiry Date<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.enquirydate
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="renqiurydate"
                        type="date"
                        name="enquirydate"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({
                            ...prev,
                            enquirydate: "",
                          }))
                        }
                        value={formData?.enquirydate}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.enquirydate && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.enquirydate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* <div className="form-group text-start col-lg-3 col-md-6">
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
                                                name="enquirytakenby"
                                                onChange={handleChange}
                                                onFocus={() => setErrorState((prev) => ({ ...prev, enquirytakenby: "" }))}
                                                required
                                                value={formData.enquirytakenby}
                                                placeholder="Enter your Counsellor Name"
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errorState && errorState.enquirytakenby && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errorState.enquirytakenby}
                                                    </p>
                                                )}
                                            </div>
                                        </div> */}

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
                            ? "form-control input_bg_color error-input select form-select"
                            : "form-control input_bg_color select form-select"
                        }
                        aria-label="Default select example"
                        name="coursepackage"
                        required
                        // onChange={handleChange}
                        // onFocus={() =>
                        //   setErrorState((prev) => ({
                        //     ...prev,
                        //     coursepackage: "",
                        //   }))
                        // }
                        // value={formData.coursepackage}

                        disabled
                        style={{ cursor: "not-allowed" }}
                        value={coursePackage?.coursepackageId || ""}
                        onChange={(e) => handleCoursePackage(e)}
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
                      <div style={{ height: "8px" }}>
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
                        htmlFor="coursepackage"
                      >
                        Course<span className="text-danger">*</span>
                      </label>
                      <input
                        className={
                          errorState && errorState.coursepackage
                            ? "form-control input_bg_color error-input select form-select"
                            : "form-control input_bg_color select form-select"
                        }
                        aria-label="Default select example"
                        name="course"
                        required
                        disabled
                        style={{ cursor: "not-allowed" }}
                        value={formData?.course[0]?.course_name || ""}

                      />


                    </div>


                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="leadsource"
                      >
                        Lead Source<span className="text-danger">*</span>
                      </label>
                      {/* <select
                        className={
                          errorState && errorState.leadsource
                            ? "form-control input_bg_color error-input select form-select"
                            : "form-control input_bg_color select form-select"
                        }
                        aria-label="Default select example"
                        id="leadsource"
                        name="leadsource"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({ ...prev, leadsource: "" }))
                        }
                        value={formData?.leadsource[0]?.source}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>
                        {leadSource?.leadSourceData &&
                          leadSource?.leadSourceData?.map((item, index) => (
                            <option key={item.id} value={item.leadsource}>
                              {item.leadsource}
                            </option>
                          ))}
                      </select> */}
                      <SearchSelect
                        className={
                          errorState && errorState.leadsource
                            ? "form-control input_bg_color error-input select fs-s"
                            : "form-control input_bg_color select fs-s"
                        }
                        placeholder="--Select--"
                        value={selectedLeadSource}
                        defaultOptions={
                          leadSource?.leadSourceData?.length
                            ? leadSource.leadSourceData.map((item) => ({
                              label: item.leadsource,
                              value: item.id,
                            }))
                            : true
                        }
                        onChange={(value, option) => {
                          handleChange({
                            target: {
                              name: "leadsource",
                              value: option?.label, // same as old select value
                            },
                          });

                          setSelectedLeadSource(option);

                          setErrorState((prev) => ({
                            ...prev,
                            leadsource: "",
                          }));
                        }}
                        fetchOptions={async (search) => {
                          try {
                            const res = await ERPApi.get(`/settings/getleadsource`, {
                              params: { search: search || "" },
                            });

                            const data = res?.data?.leadSourceData || [];

                            return data.map((item) => ({
                              label: item.leadsource,
                              value: item.id,
                            }));
                          } catch (error) {
                            console.error("Error fetching lead sources:", error);
                            return [];
                          }
                        }}
                      />
                      <div style={{ height: "8px" }}>
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
                            value={formData?.CustomLeadSource?.name || ""}
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





                  </div>
                  <div className="row mt-3">

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
                            ? "form-control input_bg_color error-input select form-select"
                            : "form-control input_bg_color select form-select"
                        }
                        aria-label="Default select example"
                        id="modeoftraining"
                        name="modeoftraining"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({
                            ...prev,
                            modeoftraining: "",
                          }))
                        }
                        value={formData?.modeoftraining}
                      >
                        <option disabled className="fs-s" value="">
                          --Select--
                        </option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                      </select>
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.modeoftraining && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.modeoftraining}
                          </p>
                        )}
                      </div>
                    </div>



                    {/* <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="radmissiondate"
                                            >
                                                Admission Date<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errorState && errorState.admissiondate
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color"
                                                }
                                                id="radmissiondate"
                                                type="date"
                                                name="admissiondate"
                                                required
                                                onChange={handleChange}
                                                value={formData.admissiondate}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errorState && errorState.admissiondate && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errorState.admissiondate}
                                                    </p>
                                                )}
                                            </div>
                                        </div> */}
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
                            ? "form-control input_bg_color  fw-400 error-input"
                            : "form-control input_bg_color fw-400"
                        }
                        id="rvaliditystartdate"
                        type="date"
                        name="validitystartdate"
                        onChange={handleChange}
                        value={formData?.validitystartdate}
                        required
                      />
                      <div style={{ height: "8px" }}>
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
                            ? "form-control input_bg_color error-input"
                            : "form-control input_bg_color"
                        }
                        id="rvalidityenddate"
                        type="date"
                        name="validityenddate"
                        onChange={handleChange}
                        value={formData?.validityenddate}
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
                    <div className="form-group text-start col-lg-3 col-md-6 ">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="rremarks"
                      >
                        Remarks<span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control input_bg_color text_color"
                        id="rremarks"
                        type="text"
                        name="admissionremarks"
                        placeholder="Enter your Remarks"
                        required
                        onChange={handleChange}
                        onFocus={() =>
                          setErrorState((prev) => ({
                            ...prev,
                            admissionremarks: "",
                          }))
                        }
                        value={formData?.admissionremarks}
                      />
                      <div style={{ height: "8px" }}>
                        {errorState && errorState.admissionremarks && (
                          <p className="text-danger m-0 fs-xs">
                            {errorState.admissionremarks}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    {/* <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="radmissiondate"
                                            >
                                                Admission Date<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errorState && errorState.admissiondate
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color"
                                                }
                                                id="radmissiondate"
                                                type="date"
                                                name="admissiondate"
                                                required
                                                onChange={handleChange}
                                                value={formData.admissiondate}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errorState && errorState.admissiondate && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errorState.admissiondate}
                                                    </p>
                                                )}
                                            </div>
                                        </div> */}



                    <div className="form-group text-start col-lg-3 col-md-6">
                      <label
                        className="form-check-label fs-s text_color"
                        htmlFor="cardtableCheck"
                      >
                        Assets
                      </label>

                      <div className="w-100 ">
                        <div className="form-check">
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="bag"
                            name="bag"
                            checked={formData?.assets.includes("bag")}
                            onChange={handleAssetChange}
                            value="bag"
                          />
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="bag"
                          >
                            Bag
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="laptop"
                            name="laptop"
                            checked={formData?.assets.includes("laptop")}
                            onChange={handleAssetChange}
                            value="laptop"
                          />
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="laptop"
                          >
                            Laptop
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="lms"
                            name="lms"
                            checked={formData?.assets.includes("lms")}
                            onChange={handleAssetChange}
                            value="lms"
                          />
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="lms"
                          >
                            LMS
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input input_bg_color text_color"
                            type="checkbox"
                            id="courseMaterial"
                            name="courseMaterial"
                            checked={formData?.assets.includes("courseMaterial")}
                            onChange={handleAssetChange}
                            value="courseMaterial"
                          />
                          <label
                            className="form-check-label fs-s text_color"
                            htmlFor="courseMaterial"
                          >
                            Course Material
                          </label>
                        </div>
                        {/* --- New Mac Checkbox --- */}
                        {shouldShowMacAndTshirt && (
                          <div className="form-check ">
                            <label className="form-check-label fs-s text_color" htmlFor="mac">
                              Mac
                            </label>
                            <input
                              className="form-check-input input_bg_color text_color"
                              type="checkbox"
                              id="mac"
                              name="mac"
                              checked={formData?.assets.includes("mac")} // Use includes here
                              onChange={handleAssetChange}
                              value="mac" // Add value for checkbox
                            />
                          </div>
                        )}
                        {shouldShowMacAndTshirt && (
                          <div className="form-group mt-3">
                            <label className="form-check-label fs-s text_color" htmlFor="tshirtSize">
                              T-shirt Size
                            </label>
                            <select
                              className="form-select input_bg_color text_color"
                              id="tshirtSize"
                              name="tshirtSize"
                              value={formData?.tshirtSize || ''}
                              onChange={handleAssetChange}
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

                  <div className="row mt-3"></div>

                  <div className="controls d-flex justify-content-between  mt-4">
                    <div>
                      {activeTab !== 1 && (
                        <Button
                          type="button"
                          className="btn control_prev_btn reg_btn"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {activeTab !== 8 && (
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

              {/* Preview Starts */}
              {activeTab === 5 && (
                <>
                  <div className="container">
                    <div className="col-xl-12 col-lg-12">
                      <div className="row">
                        <div className="col-4 d-flex justify-content-start h-155 ">
                          {/* {imageUrl ? (
                                                        <img
                                                            className="img-fluid"
                                                            src={imageUrl}
                                                            alt="user_img"
                                                            width="50%"
                                                        />
                                                    ) : (
                                                        <img
                                                            className="img-fluid"
                                                            src={`https://teksacademyimages.s3.amazonaws.com/${formData?.studentImg}`}
                                                            alt="default_user_img"
                                                            width="50%"
                                                      />
                                  {}                  )} */}

                          {showImage?.url ? (
                            <img
                              className="col-lg-4 col-md-6  col-sm-4 h-100 object-fit-cover"
                              style={{ border: "4px solid  #b3b9d0" }}
                              src={showImage?.url}
                              alt="user_img"


                            />
                          ) : (
                            <img
                              className="img-fluid"
                              src={`https://teksacademy.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/${formData?.studentImg}`}
                              alt="default_user_img"
                              width="50%"
                            />
                          )}
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <tr className="lh-400">
                            <td
                              className=" ps-0 black_300 fw-500   fs-13"
                              scope="row"
                            >
                              Name
                            </td>
                            <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                              <span className="ms-4">: </span> {formData?.name}
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
                              <span className="ms-4">: </span> {formData?.email}
                            </td>
                          </tr>

                          <tr className="lh-400">
                            <td
                              className=" ps-0 black_300 fw-500   fs-13"
                              scope="row"
                            >
                              Date Of Birth
                            </td>
                            <td className="text-mute text-truncate fs-14 ps-2 fw-500 ">
                              <span className="ms-4">: </span>{" "}
                              {formData?.birthdate}
                            </td>
                          </tr>

                          <tr className="lh-400">
                            <td
                              className="ps-0 black_300 fw-500   fs-13"
                              scope="row"
                            >
                              Contact
                            </td>
                            <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                              <span className="ms-4">: </span>{" "}
                              {formData?.mobilenumber}
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
                              <span className="ms-5">: </span>
                              {formData?.aadharCardNo}
                            </td>
                          </tr>
                        </div>

                        <div className="col-lg-4 col-md-6  col-sm-4">
                          <tr className="lh-400">
                            <td
                              className="ps-0 black_300 fw-500 text-start  fs-13"
                              scope="row"
                            >
                              Pincode
                            </td>
                            <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                              <span className="ms-5">: </span>{" "}
                              {formData?.zipcode}
                            </td>
                          </tr>
                          <tr className="lh-400">
                            <td
                              className=" ps-0 black_300 fw-500   fs-13"
                              scope="row"
                            >
                              Country
                            </td>
                            <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                              <span className="ms-5">: </span>{" "}
                              {formData?.country}
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
                              <span className="ms-5">: </span> {formData?.state}
                            </td>
                          </tr>
                          <tr className="lh-400">
                            <td
                              className=" ps-0 black_300 fw-500   fs-13"
                              scope="row"
                            >
                              Native Place
                            </td>
                            <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                              <span className="ms-5">: </span>
                              {formData?.native}
                            </td>
                          </tr>

                          <tr className="lh-400">
                            <td
                              className=" ps-0 black_300 fw-500   fs-13"
                              scope="row"
                            >
                              Area
                            </td>
                            <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                              <span className="ms-5">: </span>
                              {formData?.area}
                            </td>
                          </tr>

                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-4 col-md-6  col-sm-12 mt-1">
                            <tr className="lh-400">
                              <td
                                className="ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Parent&apos;s Name
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                <span className="ms-5">: </span>{" "}
                                {formData?.parentsname}
                              </td>
                            </tr>
                            <tr className="lh-400">
                              <td
                                className=" ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Percentage
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                <span className="ms-5">: </span>{" "}
                                {formData?.marks}
                              </td>
                            </tr>
                            <tr className="lh-400">
                              <td
                                className=" ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Academic Year
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                <span className="ms-5">: </span>{" "}
                                {formData?.academicyear}
                              </td>
                            </tr>
                            <tr className="lh-400">
                              <td
                                className="ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Validity Start Date
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-5">: </span>{" "}
                                {formData?.validitystartdate}
                              </td>
                            </tr>
                            <tr className="lh-400">
                              <td
                                className="ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Validity End Date
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-5">: </span>{" "}
                                {formData?.validityenddate}
                              </td>
                            </tr>
                          </div>

                          <div className="col-lg-4 col-md-6  col-sm-12  ">
                            <tr className="lh-400">
                              <td
                                className="ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Lead Source
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-3">: </span>{" "}
                                {formData?.leadsource[0]?.source}
                              </td>
                            </tr>

                            <tr className="lh-400">
                              <td
                                className=" ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Branch
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-3">: </span>{" "}
                                {formData?.branch}
                              </td>
                            </tr>

                            <tr className="lh-400">
                              <td
                                className=" ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Mode Of Training
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-3">: </span>{" "}
                                {formData?.modeoftraining}
                              </td>
                            </tr>
                            {formData?.admissionremarks && (
                              <tr className="lh-400">
                                <td
                                  className=" ps-0 black_300 fw-500   fs-13"
                                  scope="row"
                                >
                                  Remarks
                                </td>
                                <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                  <span className="ms-3">: </span>
                                  {formData.admissionremarks}
                                </td>
                              </tr>
                            )}
                            {Array.isArray(formData?.assets) &&
                              formData.assets.length > 0 && (
                                <div className="text_color">
                                  <td className="ps-0 black_300 fw-500 fs-13">
                                    Assets
                                  </td>{" "}
                                  <td className="text-mute text-truncate fs-14 ps-2 fw-500">
                                    <span className=" ms-5 ps-5">: </span>
                                    {formData.assets.map((item, index) => (
                                      <span key={index}>
                                        {index === formData?.assets.length - 1
                                          ? item
                                          : `${item}, `}
                                      </span>
                                    ))}
                                  </td>
                                </div>
                              )}
                          </div>
                          <div className="col-lg-4 col-md-6  col-sm-12">
                            <tr className="lh-400">
                              <td
                                className=" ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                WhatsApp Number
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-4">: </span>{" "}
                                {formData?.whatsappno}
                              </td>
                            </tr>

                            <tr className="lh-400">
                              <td
                                className=" ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Marital Status
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-4">: </span>{" "}
                                {formData?.maritalstatus}
                              </td>
                            </tr>

                            <tr className="lh-400">
                              <td
                                className="ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Enquiry Date
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-4">: </span>{" "}
                                {formData?.enquirydate}
                              </td>
                            </tr>

                            <tr className="lh-400">
                              <td
                                className=" ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Enquiry taken by
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-4 ">: </span>{" "}
                                {formData?.enquirytakenby}
                              </td>
                            </tr>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-6 col-md-6">
                            <tr className="lh-400">
                              <td
                                className="ps-0 black_300 fw-500  fs-13 text-truncate"
                                style={{ maxWidth: "120px" }}
                                title="College/School/Company"
                                scope="row"
                              >
                                College/School/Company
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-5">: </span>{" "}
                                {formData?.college}
                              </td>
                            </tr>
                            <tr className="lh-400">
                              <td
                                className="ps-0 black_300 fw-500   fs-13"
                                scope="row"
                              >
                                Course Package
                              </td>
                              <td className="text-mute text-truncate fs-14 ps-2  fw-500">
                                <span className="ms-5 ">: </span>{" "}
                                {formData?.coursepackage}
                              </td>
                            </tr>
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
                          className="btn control_prev_btn reg_btn"
                          onClick={handlePrev}
                          icon={<IoMdArrowBack className="button_icons" />}
                        >
                          Go Back
                        </Button>
                      )}
                    </div>

                    <div>
                      {activeTab === 5 && (
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

export default EditStudent;
