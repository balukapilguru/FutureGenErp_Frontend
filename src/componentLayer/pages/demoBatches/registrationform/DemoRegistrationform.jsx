import React, { useState, useEffect, useRef } from "react";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";

import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import BackButton from "../../../components/backbutton/BackButton";
import { SearchSelect } from "../../../../utils/SearchSelect";

const fieldTypes = {
  "Date of Birth": "date",
  "WhatsApp Number": "tel",
  "Highest Qualification": "select",
  City: "text",
  Stream: "text",
  "College Name": "text",
  "Passout Year": "number",
  "12th Percentage": "number",
  "10th Percentage": "number",
  "Education Gap": "number",
  "Working Professional": "select",
  Experience: "number",
  "Company Name": "text",
};

const selectOptions = {
  Gender: ["Select", "Male", "Female", "Other"],
  "Working Professional": ["Select", "Yes", "No"],
  "Are you a Teks Student?": ["Select", "Yes", "No"],
  "Highest Qualification": [
    "Select",
    "High School",
    "Bachelor's",
    "Master's",
    "PhD",
  ],
  //  "Eligible Enrolled Dates": [
  //   "Select",
  //   "Enrolled Before",
  //   "Enrolled After",
  //   "Enrolled in Between",
  // ],
};

const ELIGIBILITY = {
  BEFORE: "before",
  AFTER: "after",
  BETWEEN: "between",
};

const eligibilityOptions = [
  { label: "Select", value: "" },
  { label: "Enrolled Before", value: ELIGIBILITY.BEFORE },
  { label: "Enrolled After", value: ELIGIBILITY.AFTER },
  { label: "Enrolled in Between", value: ELIGIBILITY.BETWEEN },
];

// Predefined fields that should always be shown
const predefinedFields = [
  {
    label: "Student Name",
    value: "",
    type: "text",
    options: [],
    manderatory: true,
    description: "",
    filtered: false,
    isRegistrationform: 0,
    uuid: "6ada0a36-b09c-4210-85ca-1951ec0486b8",
    isPredefined: true, // Mark as predefined
  },
  {
    label: "Registered Email",
    value: "",
    type: "email",
    options: [],
    manderatory: false,
    description: "",
    filtered: false,
    isRegistrationform: 0,
    uuid: "ee61a78e-581e-43e0-8226-ecb24c35591c",
    isPredefined: true,
  },
  {
    label: "Mobile number",
    value: "",
    type: "text",
    options: [],
    manderatory: false,
    description: "",
    filtered: false,
    isRegistrationform: 0,
    uuid: "89ad5c9c-cbc9-4b0e-8f34-d717f8431aaa",
    isPredefined: true,
  },
];
const predefinedKeys = [
  "Name",
  "Email",
  "Phone",
  "Registration Number",
  "coursepackage",
  "Courses",
  "Branch",
];
const defaultFields = [
  { label: "Registration Form Title", value: "", type: "text" },
  { label: "Description", value: "", type: "text" },
  { label: "Form Start Date", value: "", type: "date" },
  { label: "Form Closing Date", value: "", type: "date" },
  { label: "WhatsApp Community Link", value: "", type: "text" },
];
const defaultFieldss = [
  { label: "Registration Form Title", value: "", type: "text" },
  { label: "Description", value: "", type: "text" },
  { label: "Form Start Date", value: "", type: "date" },
  { label: "Form Closing Date", value: "", type: "date" },
  { label: "WhatsApp Community Link", value: "", type: "text" },
  { label: "Eligible Enrolled Dates", value: "", type: "select" },
];

const DemoRegistrationform = () => {
  const loaderData = useLoaderData();
  const {
    registrationFormData,
    allQuestionsData,
    coursesData = [],
    coursePackagesData = [],
    curriculumData = [], // ✅ ADD
  } = loaderData || {};

  const fetcher = useFetcher();
  const { registrationformid } = useParams();

  const isEditMode = !!registrationformid;
  const navigation = useNavigate();
  console.log(curriculumData, "kjflskdjflskdfj");

  const [fields, setFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [formOptions, setFormOptions] = useState([]);
  const [formOptionsLoading, setFormOptionsLoading] = useState(false);
  // const [selectedBatch, setSelectedBatch] = useState(null);
  const searchTimeoutRef = useRef(null);
  const [userData, setUserData] = useState(() => {
    const userdata = JSON.parse(localStorage.getItem("data"));
    return userdata || "";
  });

  const branchId = userData?.user?.branchId;

  const [batchOptions, setBatchOptions] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  // State variables
  const [selectionType, setSelectionType] = useState("course");
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [packageOptions, setPackageOptions] = useState(
    coursePackagesData || [],
  );
  const [courseOptions, setCourseOptions] = useState([]);
  // const [allowPreviousApplicants, setAllowPreviousApplicants] = useState(false);
  // const [previousJObReadyApplicants, setPreviousJObReadyApplicants] =
  //   useState(false);
  const [showDateFields, setShowDateFields] = useState(false);
  const [curriculumOptions, setCurriculumOptions] = useState(curriculumData);
  const [selectedCurriculum, setSelectedCurriculum] = useState([]);
  useEffect(() => {
    console.log(selectedCurriculum, "Selected curriculum changed");
  }, [selectedCurriculum]);
  const [applicantType, setApplicantType] = useState("dont");
  const [selectedForms, setSelectedForms] = useState([]);
  const [formDropdownOptions, setFormDropdownOptions] = useState([]);
  const fetchBatchesByCurriculumAndBranch = async (
    curriculumId,
    branchId,
    search,
  ) => {
    console.log("vi2", curriculumId,
      branchId,
      search);
    if (!curriculumId || !branchId) return [];

    console.log("vi3");
    // try {
    const res = await ERPApi.get("/batch/getbatches", {
      params: {
        "filter[batchStatus]": "active",
        "filter[curriculum]": curriculumId,
        "filter[branch]": branchId,
        "filter[trainingMode]": "DEMO_BATCH",
        page: 1,
        pageSize: 50,
        search: search ?? "",
      },
    });

    const raw = res?.data?.reversedBatches || [];
    // const raw = res?.data?.data || res?.data?.batches || res?.data?.rows || [];
    console.log(res, "vi4");

    return raw.map((b) => ({
      label: b.batchName,
      value: b.id,
    }));
    // } catch (err) {
    //   console.error("Batch fetch failed:", err);
    //   return [];
    // }
  };

  useEffect(() => {
    const loadBatches = async () => {
      const curriculumId = selectedCurriculum;
      console.log("Selected curriculum in useEffect:", curriculumId, branchId);
      // const curriculumId = selectedCurriculum?.[0]?.value;

      if (!curriculumId || !branchId) {
        setBatchOptions([]);
        setSelectedBatch(null);
        return;
      }

      setBatchLoading(true);
      const Cid =
        typeof curriculumId === "object"
          ? curriculumId?.value
          : curriculumId;

      const batches = await fetchBatchesByCurriculumAndBranch(
        Cid,
        branchId,
      );

      setBatchOptions(batches);

      // reset batch when curriculum changes
      if (!isEditMode) {
        setSelectedBatch(null);
      }

      setBatchLoading(false);
    };

    loadBatches();
  }, [selectedCurriculum, branchId]);
  useEffect(() => {
    const fetchForms = async () => {
      try {
        let res;
        let data = [];

        // ✅ Same API for allow & semi
        if (applicantType === "allow" || applicantType === "semi") {
          res = await ERPApi.get(`/demo-enrollment/forms`);
        } else {
          // ❌ No need to call API for "dont"
          setFormDropdownOptions([]);
          return;
        }

        data = res?.data?.forms || [];

        const mapped = data.map((item) => ({
          label: item.formName,
          value: item.id,
        }));

        setFormDropdownOptions(mapped);
      } catch (err) {
        console.error(err);
        setFormDropdownOptions([]);
      }
    };

    fetchForms();
  }, [applicantType]);
  // Initialize fields with predefined fields
  useEffect(() => {
    if (!isEditMode) {
      // In create mode, start with predefined fields only
      setFields(defaultFieldss);
    }
  }, []);

  // Initialize form options from loader data
  useEffect(() => {
    const loadInitialOptions = async () => {
      if (allQuestionsData && allQuestionsData.length > 0) {
        const mappedOptions = allQuestionsData.map((item) => ({
          label: item.title || item.label || item.name,
          value: item.uuid || item.id,
          data: item,
        }));
        console.log(allQuestionsData, mappedOptions, "fklsjldfjslkf");
        setFormOptions(mappedOptions);
      } else {
        await fetchRegistrationForms("", 1, 20);
      }
    };

    loadInitialOptions();
  }, [allQuestionsData]);

  // Load edit mode data
  useEffect(() => {
    if (isEditMode && registrationFormData) {
      console.log("Loading edit mode data:", registrationFormData);

      // Start with predefined fields
      let updatedFields = [...defaultFields];

      // Update predefined field values from backend if they exist
      if (
        registrationFormData.fieldsList &&
        registrationFormData.fieldsList.length
      ) {
        registrationFormData.fieldsList.forEach((customField) => {
          // Check if this is a predefined field
          const isPredefined = predefinedFields.some(
            (pf) => pf.label === customField.label,
          );

          if (isPredefined) {
            // Update predefined field value
            const fieldIndex = updatedFields.findIndex(
              (f) => f.label === customField.label,
            );
            if (fieldIndex !== -1) {
              updatedFields[fieldIndex].value = customField.value || "";
            }
          }
          // In the edit mode useEffect, update the curriculum handling section:

          if (
            registrationFormData.coursePackageregistrationfomrs &&
            registrationFormData.coursePackageregistrationfomrs.length > 0
          ) {
            const packages =
              registrationFormData.coursePackageregistrationfomrs.map(
                (pkg) => ({
                  value: pkg.id,
                  label: pkg.coursepackages_name,
                }),
              );

            setSelectionType("package");
            setSelectedPackages(packages);

            // 🔥 IMPORTANT: Load courses based on selected packages
            handlePackageChange(packages);
          } else {
            // Add custom field (these are API-added fields)
            updatedFields.push({
              label: customField.label,
              value: customField.value || "",
              type: customField.type || "text",
              options: customField.options || [],
              description: customField.description || "",
              uuid: customField.uuid,
              manderatory: customField.manderatory || false,
              filtered: customField.filtered || false,
              isRegistrationform: 1,
              isPredefined: false, // Mark as custom
            });
          }
        });
      }
      if (registrationFormData.allowedPreviousFormIds?.length) {
        const mappedForms = registrationFormData.allowedPreviousFormIds.map(
          (id) => ({
            value: id,
            label: id, // will be replaced later
          }),
        );

        setSelectedForms(mappedForms);
      }
      
      if (registrationFormData.curriculumId != null || registrationFormData.curriculumId != {}) {
        setSelectedCurriculum({ value: registrationFormData?.curriculumId?.id, label: registrationFormData?.curriculumId?.name });
      }
      if (registrationFormData.batchId != null || registrationFormData.batchId != {}) {


        
        setSelectedBatch({ value: registrationFormData?.batchId?.id, label: registrationFormData?.batchId?.name });
      }

      // Update default field values
      updatedFields.forEach((field) => {
        if (field.label === "Registration Form Title") {
          field.value = registrationFormData.formName || "";
        }
        if (field.label === "Description") {
          field.value = registrationFormData.description || "";
        }
        if (field.label === "Form Start Date") {
          field.value = registrationFormData.activeFrom
            ? registrationFormData.activeFrom.split("T")[0]
            : "";
        }
        if (field.label === "Form Closing Date") {
          field.value = registrationFormData.activeTo
            ? registrationFormData.activeTo.split("T")[0]
            : "";
        }
        if (field.label === "WhatsApp Community Link") {
          field.value = registrationFormData.communityLink || "";
        }
      });

      // Set Eligible Enrolled Dates
      let eligibleValue = registrationFormData.dojFilterType || "";

      if (registrationFormData.dojFilterType === ELIGIBILITY.AFTER) {
        eligibleValue = ELIGIBILITY.AFTER;
      } else if (registrationFormData.dojFilterType === ELIGIBILITY.BEFORE) {
        eligibleValue = ELIGIBILITY.BEFORE;
      } else if (registrationFormData.dojFilterType === ELIGIBILITY.BETWEEN) {
        eligibleValue = ELIGIBILITY.BETWEEN;
      }

      const eligibleIndex = updatedFields.findIndex(
        (f) => f.label === "Eligible Enrolled Dates",
      );

      if (eligibleIndex !== -1) {
        updatedFields[eligibleIndex].value = eligibleValue;
      }

      // Remove existing date fields and add them based on filter type
      const fieldsWithoutDateRange = updatedFields.filter(
        (f) =>
          !["Before Date", "After Date", "Start Date", "End Date"].includes(
            f.label,
          ),
      );

      // Add date fields based on filter type
      if (eligibleValue && eligibleValue !== "Select") {
        const eligiblePos = fieldsWithoutDateRange.findIndex(
          (f) => f.label === "Eligible Enrolled Dates",
        );
        if (
          eligibleValue === ELIGIBILITY.BEFORE &&
          registrationFormData.dojBeforeDate
        ) {
          fieldsWithoutDateRange.splice(eligiblePos + 1, 0, {
            label: "Before Date",
            value: registrationFormData.dojBeforeDate.split("T")[0],
            type: "date",
          });
        }

        if (
          eligibleValue === ELIGIBILITY.AFTER &&
          registrationFormData.dojAfterDate
        ) {
          fieldsWithoutDateRange.splice(eligiblePos + 1, 0, {
            label: "After Date",
            value: registrationFormData.dojAfterDate.split("T")[0],
            type: "date",
          });
        }

        if (eligibleValue === ELIGIBILITY.BETWEEN) {
          if (registrationFormData.dojAfterDate) {
            fieldsWithoutDateRange.splice(eligiblePos + 1, 0, {
              label: "Start Date",
              value: registrationFormData.dojAfterDate.split("T")[0],
              type: "date",
            });
          }

          if (registrationFormData.dojBeforeDate) {
            fieldsWithoutDateRange.splice(eligiblePos + 2, 0, {
              label: "End Date",
              value: registrationFormData.dojBeforeDate.split("T")[0],
              type: "date",
            });
          }
        }
      }

      // Set course/package selections
      if (
        registrationFormData.courseregistrationfomrs &&
        registrationFormData.courseregistrationfomrs.length > 0
      ) {
        console.log(registrationFormData, "Vineedh1");
        setSelectionType("course");
        setSelectedCourses(
          registrationFormData.courseregistrationfomrs.map((course) => ({
            value: course.id,
            label: course.course_name,
          })),
        );
      } else if (
        registrationFormData.coursePackageregistrationfomrs &&
        registrationFormData.coursePackageregistrationfomrs.length > 0
      ) {
        console.log(registrationFormData, "Vineedh2");
        setSelectionType("package");
        setSelectedPackages(
          registrationFormData.coursePackageregistrationfomrs.map((pkg) => ({
            value: pkg.id,
            label: pkg.coursepackages_name,
          })),
        );
      }

      if (registrationFormData.allowPreviousApplicants) {
        setApplicantType("allow");
      } else if (registrationFormData.allowPreviousSemiJobReadyApplicants) {
        setApplicantType("semi");
      } else {
        setApplicantType("dont");
      }

      setFields(fieldsWithoutDateRange);
    }
  }, [isEditMode, registrationFormData, coursesData, coursePackagesData]);

  useEffect(() => {
    if (
      isEditMode &&
      registrationFormData?.curriculumIds?.length &&
      curriculumOptions.length
    ) {
      const mapped = registrationFormData.curriculumIds.map((id) => {
        return (
          curriculumOptions.find((c) => c.value === id) || {
            value: id,
            label: `Curriculum ${id}`,
          }
        );
      });

      setSelectedCurriculum(mapped);
    }
  }, [registrationFormData, curriculumOptions]);
  // Update the useEffect that sets curriculumOptions from loader data
  useEffect(() => {
    if (curriculumData && curriculumData.length > 0) {
      // Map the curriculum data to the format expected by SearchSelect
      const mappedCurricula = curriculumData.map((item) => ({
        label: item.curriculumName || item.name || item.label,
        value: item.id,
      }));
      setCurriculumOptions(mappedCurricula);
      console.log("Mapped curriculum options:", mappedCurricula);
    }
  }, [curriculumData]);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await ERPApi.get("/settings/getallpaginatedcoursepackages");

        const data = res?.data?.coursePackageData || [];

        setPackageOptions(
          data.map((item) => ({
            label: item.coursepackages_name,
            value: item.id,
          })),
        );
      } catch (err) {
        console.error(err);
      }
    };

    loadPackages();
  }, []);

  const handlePackageChange = async (packages) => {
    setSelectedPackages(packages);
    setSelectedCourses([]);

    if (!packages.length) {
      setCourseOptions([]);
      return;
    }

    try {
      const res = await ERPApi.post(
        "/batch/course/getcoursesfrommultiplcecoursepackages",
        {
          ids: packages.map((p) => p.value),
        },
      );

      const courses = res?.data?.courses || res?.data?.reversedCourses || [];

      const mapped = courses.map((course) => ({
        label: course.course_name,
        value: course.id,
      }));
      console.log(mapped, "GayathriV2");

      setCourseOptions(mapped); // 🔥 THIS IS CRITICAL
    } catch (error) {
      console.error(error);
      setCourseOptions([]);
    }
  };
  useEffect(() => {
    console.log(courseOptions, "GayathriV3");
  }, [courseOptions]);
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await ERPApi.get("/settings/getallpaginatedcoursepackages");

        const data = res?.data?.coursePackageData || [];

        const mapped = data.map((item) => ({
          label: item.coursepackages_name,
          value: item.id,
        }));

        setPackageOptions(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    loadPackages();
  }, []);
  // const handleCourseChange = (value) => {
  //   setSelectedCourses(value);
  // };
  const handleDropdownChange = (option, val) => {
    if (isEditMode) {
      toast.warning("Cannot add fields in edit mode");
      return;
    }
    console.log(option, "option", val);
    if (!val) return;

    const exists = fields.find((f) => f.label === val.data.label);
    if (exists) {
      toast.warning(`${option.label} already added`);
      return;
    }
    console.log(option, "option1", val);

    const newField = {
      label: val.data.label,
      value: "",
      type: fieldTypes[val.data.label] || val.data.type || "text",
      options: val.data?.label || selectOptions[val.data.label] || [],
      manderatory: val.data?.mandatory || false,
      description: val.data?.description || "",
      filtered: val.data?.filtered || false,
      isRegistrationform: 0,
      uuid: val.data.value, // ✅ FIXED
      isPredefined: false,
    };
    console.log(option, "option3", val, newField);

    setFields((prev) => [...prev, newField]);
    setSelectedFormId(null);
  };

  const fetchRegistrationForms = async (search = "", page = 1, limit = 20) => {
    try {
      setFormOptionsLoading(true);
      console.log("Fetching questions with search:", search, "page:", page);

      const response = await ERPApi.get("/demo-enrollment/questions", {
        params: {
          search: search || "",
          page: page,
          limit: limit,
        },
      });

      console.log("API Response:", response);

      let questionsArray = [];

      if (response?.data?.data && Array.isArray(response.data.data)) {
        questionsArray = response.data.data;
      } else if (
        response?.data?.questions &&
        Array.isArray(response.data.questions)
      ) {
        questionsArray = response.data.questions;
      } else if (response?.data && Array.isArray(response.data)) {
        questionsArray = response.data;
      } else if (
        response?.data?.results &&
        Array.isArray(response.data.results)
      ) {
        questionsArray = response.data.results;
      } else {
        console.warn("Unexpected response structure:", response?.data);
        questionsArray = [];
      }

      console.log("Questions array:", questionsArray);
      const mappedOptions = questionsArray.map((item) => ({
        label: item?.label,
        value: item.uuid,
        data: item,
        type: item.type,
        options: item.options || [],
      }));

      console.log("Mapped options:", mappedOptions);

      setFormOptions(mappedOptions);
      return mappedOptions;
    } catch (err) {
      console.error("Error fetching questions:", err);
      toast.error(err.response?.data?.message || "Failed to load questions");
      return [];
    } finally {
      setFormOptionsLoading(false);
    }
  };
  useEffect(() => {
    if (formDropdownOptions.length && selectedForms.length) {
      const updated = selectedForms.map((sf) => {
        const match = formDropdownOptions.find((opt) => opt.value === sf.value);
        return match || sf;
      });

      setSelectedForms(updated);
    }
  }, [formDropdownOptions]);

  const debouncedFetchOptions = async (search) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    return new Promise((resolve) => {
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await fetchRegistrationForms(search, 1, 20);
        resolve(results);
      }, 300);
    });
  };

  const handleInputChange = (label, e) => {
    if (isEditMode) {
      // In edit mode, only allow editing of date fields and eligibility criteria
      const allowedFields = [
        "Form Start Date",
        "Form Closing Date",
        "Eligible Enrolled Dates",
        "Before Date",
        "After Date",
        "Start Date",
        "End Date",
      ];

      if (!allowedFields.includes(label)) {
        toast.warning("This field cannot be edited in update mode");
        return;
      }
    }

    const newValue = e.target.value;

    if (label === "Eligible Enrolled Dates") {
      const value = e.target.value;

      const dateFieldsToRemove = [
        "Before Date",
        "After Date",
        "Start Date",
        "End Date",
      ];

      let baseFields = fields.filter(
        (f) => !dateFieldsToRemove.includes(f.label),
      );

      const index = baseFields.findIndex(
        (f) => f.label === "Eligible Enrolled Dates",
      );

      let newFields = [];

      switch (value) {
        case ELIGIBILITY.BEFORE:
          newFields.push({ label: "Before Date", value: "", type: "date" });
          break;

        case ELIGIBILITY.AFTER:
          newFields.push({ label: "After Date", value: "", type: "date" });
          break;

        case ELIGIBILITY.BETWEEN:
          newFields.push(
            { label: "Start Date", value: "", type: "date" },
            { label: "End Date", value: "", type: "date" },
          );
          break;

        default:
          break;
      }

      baseFields[index].value = value;
      baseFields.splice(index + 1, 0, ...newFields);

      setFields(baseFields);
      setShowDateFields(value !== "");
    } else {
      const updatedFields = fields.map((field) =>
        field.label === label ? { ...field, value: newValue } : field,
      );
      setFields(updatedFields);
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[label];
      return newErrors;
    });
  };

  // Fix the DemoRegistrationform component - replace the handleSubmit function
  // Add this function inside your DemoRegistrationform component
  const handleDeleteCustomField = (fieldLabel) => {
    if (isEditMode) {
      toast.warning("Cannot delete fields in edit mode");
      return;
    }

    // Filter out the field to be deleted
    const updatedFields = fields.filter(field => field.label !== fieldLabel);
    setFields(updatedFields);

    // Optional: Show success message
    toast.success("Field deleted successfully");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit triggered");

    const newErrors = {};

    // Only these fields are required
    const requiredFields = [
      "Registration Form Title",
      "Description",
      "Form Start Date",
      "Form Closing Date",
      "WhatsApp Community Link",
    ];

    const fieldMap = {};
    fields.forEach((f) => {
      fieldMap[f.label] = f.value;
    });

    // Validate only basic required fields
    requiredFields.forEach((label) => {
      if (!fieldMap[label] || fieldMap[label].toString().trim() === "") {
        newErrors[label] = `${label} is required`;
      }
    });

    // Validate dates
    if (fieldMap["Form Start Date"] && fieldMap["Form Closing Date"]) {
      const startDate = new Date(fieldMap["Form Start Date"]);
      const closingDate = new Date(fieldMap["Form Closing Date"]);

      if (closingDate < startDate) {
        newErrors["Form Closing Date"] =
          "Form Closing Date must be after Start Date";
      }
    }

    // Validate course/package selection
    // if (selectionType === "course" && (!selectedCourses || selectedCourses.length === 0)) {
    //   newErrors["courseSelection"] = "Please select at least one course";
    // }
    // if (selectionType === "package" && (!selectedPackages || selectedPackages.length === 0)) {
    //   newErrors["packageSelection"] = "Please select at least one package";
    // }

    // If validation fails, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    // Build SIMPLE payload
    const formDataToSend = {
      formName: fieldMap["Registration Form Title"],
      description: fieldMap["Description"],
      activeFrom: fieldMap["Form Start Date"],
      activeTo: fieldMap["Form Closing Date"],
      communityLink: fieldMap["WhatsApp Community Link"],

      // ✅ clean + correct
      curriculumId: typeof selectedCurriculum === "object"
        ? selectedCurriculum?.value
        : selectedCurriculum,
      batchId: selectedBatch,

      customFieldIds: fields.filter((f) => f.uuid).map((f) => f.uuid),
    };

    // Collect custom field IDs from fields that have UUID
    const mainFormFieldsList = [
      "Registration Form Title",
      "Description",
      "Form Start Date",
      "Form Closing Date",
      "WhatsApp Community Link",
    ];

    // Get custom field IDs
    fields.forEach((field) => {
      if (!mainFormFieldsList.includes(field.label) && field.uuid) {
        formDataToSend.customFieldIds.push(field.uuid);
      }
    });


    try {
      const isEdit = isEditMode;

      const response = await toast.promise(
        ERPApi({
          method: isEdit ? "patch" : "post",
          url: isEdit
            ? `/demo-enrollment/forms/update/${registrationformid}`
            : "/demo-enrollment/forms",
          data: formDataToSend,
          headers: { "Content-Type": "application/json" },
        }),
        {
          pending: isEdit ? "Updating form..." : "Creating form...",
          success: isEdit
            ? "Form updated successfully!"
            : "Form created successfully!",
          error: {
            render({ data }) {
              return data?.response?.data?.message || "Something went wrong!";
            },
          },
        },
      );

      console.log("API Response:", response);

      const isSuccess = response?.status === 200 || response?.status === 201;

      if (isSuccess) {
        navigation("/demobatches/registrationform");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  // Course options for react-select
  // const courseOptions = coursesData;

  // const packageOptions = coursePackagesData.map((pkg) => ({
  //   value: pkg.id,
  //   label: pkg.name || `Package ${pkg.id}`,
  // }));

  // Separate fields into sections

  const mainFormFields = fields.filter((f) =>
    [
      "Registration Form Title",
      "Description",
      "Form Start Date",
      "Form Closing Date",
      "WhatsApp Community Link",
    ].includes(f.label),
  );

  const eligibleDateField = fields.find(
    (f) => f.label === "Eligible Enrolled Dates",
  );
  const dateFields = fields.filter((f) =>
    ["Before Date", "After Date", "Start Date", "End Date"].includes(f.label),
  );

  const customFields = fields.filter(
    (f) =>
      ![
        "Registration Form Title",
        "Description",
        "Form Start Date",
        "Form Closing Date",
        "WhatsApp Community Link",
        "Eligible Enrolled Dates",
        "Before Date",
        "After Date",
        "Start Date",
        "End Date",
      ].includes(f.label),
  );

  const handleCourseAdd = (value) => {
    setSelectedCourses(value);
  };

  useEffect(() => {
    if (applicantType === "dont") {
      setSelectedForms([]);
    }
  }, [applicantType]);

  // Get custom field count (excluding main form fields and predefined fields)

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    console.log("Selected curriculum in main component:", selectedBatch);
  }, [selectedBatch]);

  return (
    <div>
      <BackButton heading="Registration Form" content="Back" />

      <div className="p-4">
        <div className="bg-white p-4 rounded-3 shadow-sm mb-4 shadow">
          <div className="rounded-3 mb-4 p-4 text-white bg_primary">
            <h3 className="mb-1 fw-bold">
              {isEditMode
                ? "Edit Registration Form"
                : "Create Registration Form"}
            </h3>
            <p className="mb-0 small text-white opacity-75">
              Configure your registration form settings and custom fields
            </p>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <div className="">
                <div className="">
                  <h5 className="fw-semibold mb-3 border-bottom pb-2">
                    Basic Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* {mainFormFields.map((field, index) => {
                      let disabled = isEditMode
                        ? !["Form Start Date", "Form Closing Date"].includes(
                            field.label,
                          )
                        : false;

                      return (
                        <div className="mb-3 col-lg-6" key={index}>
                          <label className="form-label">
                            {field.label}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type={field.type}
                            className="form-control"
                            value={field.value || ""}
                            onChange={(e) => handleInputChange(field.label, e)}
                            disabled={disabled}
                          />
                          {errors[field.label] && (
                            <div className="text-danger small mt-1">
                              {errors[field.label]}
                            </div>
                          )}
                        </div>
                      );
                    })} */}

                    {mainFormFields.map((field, index) => {
                      let disabled = isEditMode
                        ? !["Form Start Date", "Form Closing Date"].includes(
                          field.label,
                        )
                        : false;

                      return (
                        <div className="mb-3 col-lg-6" key={index}>
                          <label className="form-label fw-small">
                            {field.label}
                            <span className="text-danger">*</span>
                          </label>

                          <input
                            type={field.type}
                            className="form-control rounded-2"
                            value={field.value || ""}
                            placeholder={"Enter " + field.label}
                            onChange={(e) => handleInputChange(field.label, e)}
                            disabled={disabled}
                            min={(field.type === "date" && !isEditMode) ? today : undefined}
                          />

                          {errors[field.label] && (
                            <div className="text-danger small mt-1">
                              {errors[field.label]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Curriculum */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium">
                    Select Curriculum
                  </label>

                  <SearchSelect
                    placeholder="Select Curriculum"
                    value={selectedCurriculum}
                    defaultOptions={curriculumData.length ? curriculumData : true}
                    isMulti
                    onChange={(selected) => {
                      console.log(selected, "kdjfhksjdh");
                      setSelectedCurriculum(selected || []);
                    }}
                    fetchOptions={async (search) => {
                      try {
                        const res = await ERPApi.get("/batch/curriculum", {
                          params: { search: search || "" },
                        });

                        let curriculumArray = [];

                        if (Array.isArray(res?.data?.reversedCurriculums)) {
                          curriculumArray = res.data.reversedCurriculums;
                        } else if (Array.isArray(res?.data?.data)) {
                          curriculumArray = res.data.data;
                        } else if (Array.isArray(res?.data)) {
                          curriculumArray = res.data;
                        } else if (Array.isArray(res?.data?.curriculums)) {
                          curriculumArray = res.data.curriculums;
                        }

                        return curriculumArray.map((item) => ({
                          label:
                            item.curriculumName ||
                            item.name ||
                            `Curriculum ${item.id}`,
                          value: item.id,
                        }));
                      } catch (error) {
                        console.error("Error fetching curricula:", error);
                        return [];
                      }
                    }}
                  />
                </div>

                {/* Batch */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium">Select Batch</label>

                  <SearchSelect
                    placeholder="Select Batch"
                    value={selectedBatch}
                    defaultOptions={batchOptions}
                    isLoading={batchLoading}
                    onChange={(option) => {
                      console.log(option, "selected batch");
                      setSelectedBatch(option);
                    }}
                    isDisabled={!selectedCurriculum?.length}
                    fetchOptions={(search) =>
                      fetchBatchesByCurriculumAndBranch(
                        selectedCurriculum,
                        branchId,
                        search
                      )
                    }
                  />
                </div>
              </div>
              {/* Custom Fields Section */}
              <div className="">
                <div className="">
                  <h5 className="fw-semibold mb-3 border-bottom pb-2">
                    Predefined Fields
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {predefinedFields.map((field, index) => {
                      // Find the actual field value from fields state
                      const actualField = fields.find(
                        (f) => f.label === field.label,
                      );

                      return (
                        <div className="mb-3 col-lg-6" key={index}>
                          <label className="form-label">
                            {field.label}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type={field.type}
                            className="form-control"
                            value={actualField?.value || ""}
                            placeholder={"Enter " + field.label}
                            onChange={(e) => handleInputChange(field.label, e)}
                            disabled={true}
                          />
                          {errors[field.label] && (
                            <div className="text-danger small mt-1">
                              {errors[field.label]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="">
                    <h5 className="fw-semibold mb-3 mt-3 border-bottom pb-2">
                      Custom Fields
                    </h5>
                  </div>
                  {!isEditMode && (
                    <div className="row mb-4">
                      <div className="col-lg-6">
                        <label className="form-label">Add More Fields</label>
                        <SearchSelect
                          placeholder="Search and select fields to add"
                          value={selectedFormId}
                          defaultOptions={formOptions}
                          fetchOptions={debouncedFetchOptions}
                          onChange={(option, val) => {
                            setSelectedFormId(option);
                            handleDropdownChange(option, val);
                            setErrors((prev) => ({
                              ...prev,
                              registrationFormId: "",
                            }));
                          }}
                          isDisabled={isEditMode}
                          isLoading={formOptionsLoading}
                        />
                        {/* {getCustomFieldCount() < 3 && !isEditMode && (
                          <div className="text-warning small mt-1">
                            Please add at least {3 - getCustomFieldCount()} more custom
                            field(s)
                          </div>
                        )} */}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-body">
                  <div className="row">
                    {console.log(customFields, "dfksdfksdf")}
                    {/* {customFields
                      .filter((item) => !predefinedKeys.includes(item.label))
                      .map((field, index) => {
                        console.log(field, "dsjfhksdhf");
                        let disabled = isEditMode && !field.isPredefined;
                        const isPredefined = field.isPredefined;
                        const isDisabled = true;
                        return (
                          <div
                            className="mb-3 col-lg-6"
                            key={`custom-${index}`}
                          >
                            <label className="form-label">
                              {field.label}
                              {!isPredefined && !field.isPredefined && (
                                <span className="text-danger">*</span>
                              )}
                              {isPredefined && (
                                <span className="text-danger ms-1 ">*</span>
                              )}
                            </label>
                            {(field.type === "select" ||
                              field.type === "radio") &&
                              field.options?.length ? (
                              <select
                                className="form-select"
                                value={field.value || ""}
                                onChange={(e) =>
                                  handleInputChange(field.label, e)
                                }
                                disabled={true}
                              >
                                <option value="">Select</option>
                                {field?.options?.map((opt, i) => (
                                  <option key={i} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.type}
                                className="form-control"
                                value={field.value || ""}
                                placeholder={"Enter " + field.label}
                                onChange={(e) =>
                                  handleInputChange(field.label, e)
                                }
                                disabled={true}
                              />
                            )}
                            {errors[field.label] && (
                              <div className="text-danger small mt-1">
                                {errors[field.label]}
                              </div>
                            )}
                          </div>
                        );
                      })} */}

                    {customFields
                      .filter((item) => !predefinedKeys.includes(item.label))
                      .map((field, index) => {
                        console.log(field, "dsjfhksdhf");

                        const isPredefined = field.isPredefined;
                        const isDisabled = true;

                        const isSelectable =
                          (field.type === "select" || field.type === "radio") &&
                          Array.isArray(field.options);

                        return (
                          <div
                            className="mb-3 col-lg-6"
                            key={`custom-${index}`}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <label className="form-label mb-0">
                                {field.label}
                                <span className="text-danger ms-1">*</span>
                              </label>
                              {!isEditMode && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteCustomField(field.label)}
                                  style={{ padding: "2px 8px", fontSize: "12px" }}
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            <div className="mt-2">
                              {isSelectable ? (
                                <select
                                  className="form-select"
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    handleInputChange(field.label, e)
                                  }
                                  disabled={isDisabled}
                                >
                                  <option value="">Select</option>

                                  {field.options.map((opt, i) => (
                                    <option key={i} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={field.type}
                                  className="form-control"
                                  value={field.value || ""}
                                  placeholder={"Enter " + field.label}
                                  onChange={(e) =>
                                    handleInputChange(field.label, e)
                                  }
                                  disabled={isDisabled}
                                />
                              )}
                            </div>

                            {errors[field.label] && (
                              <div className="text-danger small mt-1">
                                {errors[field.label]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="row d-flex justify-content-end mt-4">
                <div className="col-lg-2">
                  <button
                    type="submit"
                    className="btn btn_primary w-100"
                    disabled={fetcher.state === "submitting"}
                  >
                    {fetcher.state === "submitting"
                      ? isEditMode
                        ? "Updating..."
                        : "Submitting..."
                      : isEditMode
                        ? "Update"
                        : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoRegistrationform;
