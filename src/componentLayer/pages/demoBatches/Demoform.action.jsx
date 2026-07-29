import {toast} from "react-toastify";
import {ERPApi} from "../../../serviceLayer/interceptor";


// ✅ LOADER (GET ALL FORMS)
export const demoRegistrationFormLoader = async ({request}) => {
    const searchParams = new URL(request.url).searchParams;

    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const search = searchParams.get("search") || "";
    const enquiryTakenby = searchParams.get("enquiryTakenby") || "";
    const enquiryTakenbyLable = searchParams.get("enquiryTakenby_label") || "";
    const branch = searchParams.get("branch") || "";
    const trainer = searchParams.get("trainer") || "";
    const fromDate = searchParams.get("fromDate") || "";
    const toDate = searchParams.get("toDate") || "";

    const query = new URLSearchParams({
        page,
        pageSize,
        search,
    });
    if (enquiryTakenby !== "" && enquiryTakenby !== undefined && enquiryTakenby !== null) {
        query.append("userId", enquiryTakenby);
    }

    if (branch !== "" && branch !== undefined && branch !== null) {
        query.append("branch", branch);
    }
    if (trainer !== "" && trainer !== undefined && trainer !== null) {
        query.append("trainerId", trainer);
    }

    if (fromDate) {
        query.append("fromDate", fromDate);
    }
    if (toDate) {
        query.append("toDate", toDate);
    }

    const userdata = JSON.parse(localStorage.getItem("data"));

    const role = userdata?.user?.profile;
    const branchId = userdata?.user?.branchId;

    if (role !== "Admin" && branchId) {
        query.append("branch", branchId);
    }

    try {
        const [
            registrationFormResponse,
            branchData,
            usersWithCounsellorsData,
            trainersData
        ] = await Promise.all([
            ERPApi.get(`/demo-enrollment/forms?${query}`),

            ERPApi.get(`/settings/getbranch`),

            ERPApi.get(`/user/list_user?${enquiryTakenbyLable ? `search=${enquiryTakenbyLable}` : ""}`),

            ERPApi.get(`batch/trainer`)

        ]);

        const trainer = trainersData?.data?.users?.map((item) => ({
            label: item?.fullname,
            value: item?.id,
        }))
        const branchOptions = branchData?.data?.branchData?.map((item) => ({
            label: item?.branch_name,
            value: item?.id,
        })) || []
        const userData = usersWithCounsellorsData?.data?.reversedusers?.map((item) => ({
            label: item?.fullname,
            value: item?.id,
        })) || []
        console.log("Loader Data:1", usersWithCounsellorsData)
        return {
            trainersData: trainer,
            registrationFormData: registrationFormResponse?.data,

            branchData: branchOptions,

            usersWithCounsellorsData: userData,
        };
    } catch (error) {
        console.error("Error loading demo forms:", error);

        return {
            registrationFormData: [],
            branchData: [],
            usersWithCounsellorsData: [],
        };
    }
};


// ✅ MAIN ACTION (DELETE / STATUS / UPDATE)
export const demoRegistrationFormAction = async ({request}) => {
    const data = await request.json();
    if (!data) return null;

    // ✅ DELETE
    if (data.type === "delete") {
        try {
            const deletePromise = ERPApi.delete(
                `/demo-enrollment/forms/${data.id}`
            );

            const response = await toast.promise(deletePromise, {
                pending: "Deleting...",
                success: "Deleted successfully",
            });

            return response.data;
        } catch (e) {
            console.error(e)
            toast.error(e.response?.data?.message || "Error While deleting Demo Form");
        }
    }

    // ✅ UPDATE STATUS
    if (data.type === "updateStatus") {
        try {
            const updateStatusPromise = ERPApi.patch(
                `/demo-enrollment/forms/${data.id}/status`,
                {isActive: data.isActive}
            );

            const response = await toast.promise(updateStatusPromise, {
                pending: "Updating status...",
                success: `Form ${data.isActive === 1 ? "activated" : "deactivated"
                } successfully!`,
                error: "Failed to update status",
            });

            return response.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Something went wrong";
            toast.error(message);
            return null;
        }
    }

    // ✅ UPDATE FORM
    if (data.type === "update") {
        try {
            const updatePromise = ERPApi.patch(
                `/demo-enrollment/forms/update/${data.id}`,
                data
            );

            const response = await toast.promise(updatePromise, {
                pending: "Updating...",
                success: "Updated successfully",
                error: "Failed to update",
            });

            return response.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Something went wrong";
            toast.error(message);
            return null;
        }
    }

    return null;
};

//update action

export const updateDemoRegistrationFormAction = async ({request, params}) => {
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
            return {error: "Empty request body"};
        }

        const {registrationformid} = params;

        if (!registrationformid) {
            toast.error("Missing form ID");
            return {error: "Missing form ID"};
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

        if (data.courseIds?.length) payload.courseIds = data.courseIds;
        if (data.coursePackageIds?.length) payload.coursePackageIds = data.coursePackageIds;

        if (data.dojFilterType) {
            payload.dojFilterType = data.dojFilterType;
            if (data.dojAfterDate) payload.dojAfterDate = data.dojAfterDate;
            if (data.dojBeforeDate) payload.dojBeforeDate = data.dojBeforeDate;
        }

        const response = await ERPApi.patch(
            `/demo-enrollment/forms/update/${registrationformid}`,
            payload,
            {
                headers: {"Content-Type": "application/json"},
            }
        );

        if (response?.status === 200) {
            toast.success("Form updated successfully!");
            return redirect("/demobatches/registrationform");
        }

        return {success: true, message: "Form updated successfully!"};

    } catch (error) {
        console.error("Error in update form:", error);

        const errorMessage =
            error?.response?.data?.message || error.message || "Something went wrong";

        toast.error(errorMessage);

        return {error: errorMessage};
    }
};

// ✅ CREATE FORM
export const demoRegistrationFormCreateAction = async ({request}) => {
    const formData = await request.json();

    try {
        const response = await toast.promise(
            ERPApi.post("/demo-enrollment/forms", formData),
            {
                pending: "Creating...",
                success: "Form created successfully",
                error: "Failed to create form",
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error?.response?.data?.message || "Something went wrong";
        toast.error(message);
        return null;
    }
};

export const getDemoBatchesLoader = async ({request}) => {
    const url = new URL(request.url);
    try {
        const response = await ERPApi.get(`/batch/getbatches?filter[batchStatus]=active&filter[trainingMode]=DEMO_BATCH&${url.search.slice(1)}`);
        const demoBatches = response.data
        return {demoBatches};
    } catch (error) {
        const demoBatches = {}
        console.error(error, "Demo Batches error");
        return demoBatches
    }
}


// ✅ CUSTOM FIELDS CREATE
export const demoCustomFieldsAction = async ({request}) => {
    const formData = await request.json();

    try {
        const response = await toast.promise(
            ERPApi.post("/demo-enrollment/custom-fields", formData),
            {
                pending: "Saving fields...",
                success: "Fields saved successfully",
                error: "Failed to save fields",
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error?.response?.data?.message || "Something went wrong";
        toast.error(message);
        return null;
    }
};


// ✅ GET SINGLE FORM (FOR EDIT PAGE LOADER)
export const demoRegistrationFormByIdLoader = async ({params}) => {
    try {
        const response = await ERPApi.get(
            `/demo-enrollment/forms/${params.uuid}`
        );

        return {
            formData: response.data?.data, // ✅ correct
        };
    } catch (error) {
        console.error("Error fetching form by id:", error);
        return {formData: null};
    }
};