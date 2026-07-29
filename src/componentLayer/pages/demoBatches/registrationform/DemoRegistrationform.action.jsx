import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";

export const createDemoRegistrationFormAction = async ({ request }) => {
  try {
    let data = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      try {
        const formData = await request.formData();
        data = Object.fromEntries(formData);
      } catch {
        data = {};
      }
    }

    // parse complex fields
    if (data.fieldsList && typeof data.fieldsList === "string") {
      try {
        data.fieldsList = JSON.parse(data.fieldsList);
      } catch {
        data.fieldsList = [];
      }
    }
 
    if (!data || Object.keys(data).length === 0) {
      toast.error("Empty request body");
      return { error: "Empty request body" };
    }

    const payload = {
      formName: data.formName,
      description: data.description,
      activeFrom: data.activeFrom,
      activeTo: data.activeTo,
      communityLink: data.communityLink,
      customFieldIds: data.customFieldIds || [],
      registrationPolicy: data.registrationPolicy,
      allowedPreviousFormIds: data.allowedPreviousFormIds || [],
    };
if (data.curriculumIds?.length) {
  payload.curriculumIds = data.curriculumIds;
}
    if (data.courseIds?.length) payload.courseIds = data.courseIds;
    if (data.coursePackageIds?.length) payload.coursePackageIds = data.coursePackageIds;

    if (data.dojFilterType) {
      payload.dojFilterType = data.dojFilterType;
      if (data.dojAfterDate) payload.dojAfterDate = data.dojAfterDate;
      if (data.dojBeforeDate) payload.dojBeforeDate = data.dojBeforeDate;
    }

    const response = await ERPApi.post(`/demo-enrollment/forms`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response?.status === 200 || response?.status === 201) {
      toast.success("Form created successfully!");
      return redirect("/demobatches/registrationform");
    }

    return { success: true, message: "Form created successfully!" };

  } catch (error) {
    console.error("Error in create form:", error);

    const errorMessage =
      error?.response?.data?.message || error.message || "Something went wrong";

    toast.error(errorMessage);

    return { error: errorMessage };
  }
};

export const registerFormGetLoader = async ({ params }) => {
  const { registrationformid } = params;

  try {
   const [questionsRes, coursesRes, packagesRes, curriculumRes, formRes] = await Promise.all([
  ERPApi.get(`demo-enrollment/questions?page=1&pageSize=100`),
  ERPApi.get(`/batch/course`),
  ERPApi.get(`/settings/getallpaginatedcoursepackages`),
  ERPApi.get(`/batch/curriculum`), // ✅ ADD THIS
  registrationformid
    ? ERPApi.get(`demo-enrollment/forms/${registrationformid}`)
    : Promise.resolve(null),
]);

    
    const allQuestions =
    questionsRes?.data?.data?.map((q) => ({
      label: q.label,
      value: q.uuid,
      type: q.type || "text",
    })) || [];
    // console.log(allQuestions,questionsRes,"dfslflsdkjf")

    const coursesList =
      coursesRes?.data?.reversedCourses?.map((c) => ({
        label: c.course_name,
        value: c.id,
      })) || [];

    const coursePackageList =
      packagesRes?.data?.coursePackageData?.map((p) => ({
        label: p.coursepackages_name,
        value: p.id,
        createdby: p.createdby,
        isToggle: p.isToggle,
      })) || [];

     const rawCurricula =
  curriculumRes?.data?.reversedCurriculums ||
  curriculumRes?.data?.curriculums ||
  curriculumRes?.data?.data ||
  (Array.isArray(curriculumRes?.data) ? curriculumRes.data : []);
console.log("rawCurricula:", rawCurricula);
const curriculumList = rawCurricula.map((c) => ({
  label: c.curriculumName || c.name || `Curriculum ${c.id}`,
  value: c.id,
}));
    const formData = formRes ? formRes?.data?.data || formRes?.data : null;

    return {
      registrationFormData: formData,
      allQuestionsData: allQuestions,
      coursesData: coursesList,
      coursePackagesData: coursePackageList,
      curriculumData: curriculumList,
    };
  } catch (error) {
    console.error("Loader Error:", error);

    return {
      registrationFormData: null,
      allQuestionsData: [],
      coursesData: [],
      coursePackagesData: [],
      error: error.message || "Failed to load data",
    };
  }
};
// Keep your existing custom fields actions...
export const customFieldsLoader = async () => {
  try {
    const response = await ERPApi.get(
      `demo-enrollment/questions?page=1&pagesize=100`,
    );
    return { customFieldsData: response.data.data };
  } catch (error) {
    console.error("Error fetching custom fields:", error);
    return { customFieldsData: [] };
  }
};

export const addCustomFieldAction = async ({ request }) => {
  try {
    const data = await request.json();

    await toast.promise(
      ERPApi.post("/placement-preparation/questions", data, {
        headers: { "Content-Type": "application/json" },
      }),
      {
        pending: "Creating custom field...",
        success: "Custom field created successfully!",
        error: "Failed to create custom field.",
      },
    );

    // return redirect("/placement/registrationform/Customfields");
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateCustomFieldAction = async ({ request, params }) => {
  try {
    const data = await request.json();
    const { id } = params;

    await toast.promise(
      ERPApi.patch(`/placement-preparation/questions/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      }),
      {
        pending: "Updating custom field...",
        success: "Custom field updated successfully!",
        error: "Failed to update custom field.",
      },
    );

    // return redirect("/placement/registrationform/Customfields");
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteCustomFieldAction = async ({ params }) => {
  try {
    const { id } = params;

    await toast.promise(
      ERPApi.delete(`/placement-preparation/questions/${id}`),
      {
        pending: "Deleting custom field...",
        success: "Custom field deleted successfully!",
        error: "Failed to delete custom field.",
      },
    );

    // return redirect("/placement/registrationform/Customfields");
  } catch (error) {
    console.error(error);
    return null;
  }
};
