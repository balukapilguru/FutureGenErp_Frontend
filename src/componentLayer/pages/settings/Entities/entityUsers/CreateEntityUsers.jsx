import React, { useEffect, useState } from 'react'
import { useFetcher, useLoaderData, useNavigate, useParams } from 'react-router-dom'
import BackButton from '../../../../components/backbutton/BackButton';
import Select from 'react-select'
import Button from '../../../../components/button/Button';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { debounce } from '../../../../../utils/Utils';

const CreateEntityUsers = () => {
    const { entityBranchData = {}, entityList } = useLoaderData() ?? {};
    const { userId } = useParams();
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const [selectedEntity, setSelectedEntity] = useState()
    const [selectedEntityBranch, setSelectedEntityBranch] = useState()
    const [entityBranches, setEntityBranches] = useState();
    const [entityOptions, setEntityOptions] = useState(entityList || []);

    const [userData, setEntityUserData] = useState(
        {
            name: "",
            email: "",
            phone_number: "",
            branch_id: "",
            entity_id: null,
        }
    )
    const [error, setError] = useState(
        {
            name: "",
            email: "",
            phone_number: "",
            branch_id: "",
            entity_id: null,
        }
    )

    useEffect(() => {
        if (userId) {
            setEntityUserData(prev => ({
                ...prev,
                name: entityBranchData.name,
                email: entityBranchData.email,
                phone_number: entityBranchData.phone_number
            }))
            setSelectedEntity({ label: `${entityBranchData?.branch?.entity?.name}`, value: entityBranchData?.branch?.entity?.id, })
            setSelectedEntityBranch({ label: `${entityBranchData?.branch?.branch_name}`, value: entityBranchData?.branch?.id, })
        }
    }, [])


    const validateEntityData = () => {
        const errors = {};

        // Validate Name
        if (!userData?.name?.trim() || userData?.name?.trim().replace(/\s/g, "").length < 3) {
            errors.name = "Enter a name with at least 3 non-space characters.";
        }
        if (!userData?.email?.trim()) {
            errors.email = "Email is required";
        }
        if (!userData?.phone_number?.trim().length === 0) {
            errors.phone_number = "Phone number is required";
        }
        if (userData?.phone_number?.toString().startsWith("0") || userData?.phone_number?.toString().length < 10) {
            errors.phone_number = "Phone number is invalid";
        }
        if (!selectedEntity?.value) {
            errors.entity_id = "Please select Entity";
        }
        if (!selectedEntityBranch?.value) {
            errors.branch_id = "Please select Branch";
        }


        setError(errors)
        return errors;
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setEntityUserData({ ...userData, [name]: value });
        setError({ ...error, [name]: "" })
    }

    const handleSubmitEntityData = () => {
        const errors = validateEntityData();

        // Check if there are any validation errors
        if (Object.keys(errors).length > 0) {
            return; // You can return or handle the errors as needed
        }
        const formdata = new FormData();
        formdata.set("name", userData.name);
        formdata.set("email", userData.email);
        formdata.set("phone_number", userData.phone_number);
        formdata.set("entity_id", selectedEntity?.value)
        formdata.set("branch_id", selectedEntityBranch?.value)

        fetcher.submit(formdata, {
            method: userId ? "put" : "post",
            encType: "application/form-data"
        })
    }

    useEffect(() => {
        if (fetcher?.data?.status === 201) {
            navigate("/settings/entity-users")
        }
    }, [fetcher])

    const getallBranches = async () => {
        try {
            const response = await ERPApi.get(`branch/getallBranches?entity_id=${selectedEntity && selectedEntity.value}`)
            const branchList = response?.data?.data?.map((item) => ({
                label: item.branch_name,
                value: item.id,
            })) || [];


            setEntityBranches(branchList)
            // return {
            //     branchList: branchList
            // }
        } catch (error) {
            return {
                branchList: {}
            }
            console.error(error)
        }
    }

    useEffect(() => {
        if (selectedEntity?.value) {
            getallBranches();
        }
    }, [selectedEntity])

    const searchEntity = async (search) => {
        try {
            // setLoading(true); // Set loading to true while fetching data
            const entityResponse = await ERPApi.get(
                `${import.meta.env.VITE_API_URL}/entity/getallentities?search=${search}`
            );

            const entityList = entityResponse?.data?.data?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [];

            setEntityOptions(entityList);
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false); // Set loading to false once data fetching is done
        }
    };


    const debouncedSearch = debounce((search) => {
        searchEntity(search); // Call the searchEntity function after the debounce delay
    }, 1500);


    const trigersearch = (search) => {
        debouncedSearch(search)
    };


    const handleChange = (selectedOption, filed) => {
        setSelectedEntity(selectedOption)
    }

    return (
        <div>
            {userId && userId ? (
                <BackButton heading="Edit Entity User" content="Back" />
            ) : (
                <BackButton heading="Entity User Form" content="Back" />
            )}
            <div className="container-fluid">
                <div className="card border-0">
                    <div className="align-items-center"></div>
                    <div className="card-body">
                        <div className="live-prieview">
                            <form>
                                <div className="row d-flex">
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label
                                                for="name"
                                                className="form-label fs-s fw-medium black_300"
                                            >
                                                Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={
                                                    error && error.name
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                        : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                }
                                                placeholder="Enter Full Name"
                                                id="name"
                                                name="name"
                                                value={userData.name}
                                                onChange={handleInputChange}
                                            />

                                            <div style={{ height: "8px" }}>
                                                {error && error.name && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {error.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label
                                                for="email"
                                                className="form-label fs-s fw-medium black_300"
                                            >
                                                Email Id<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className={
                                                    error && error.email
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input"
                                                        : "form-control fs-s bg-form text_color input_bg_color"
                                                }
                                                placeholder="Enter Email Id"
                                                id="email"
                                                name="email"
                                                value={userData?.email}
                                                readOnly={!!userId}
                                                // disabled={userData.email}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.email && (
                                                    <p className="text-danger m-0 fs-xs">{error.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label
                                                for="lastNameinput"
                                                className="form-label fs-s fw-medium black_300"
                                            >
                                                Phone Number<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={10}
                                                className={
                                                    error && error.phone_number
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input"
                                                        : "form-control fs-s bg-form text_color input_bg_color"
                                                }
                                                placeholder="Enter Phone Number"
                                                name="phone_number"
                                                value={userData.phone_number || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;

                                                    // Allow ONLY digits
                                                    if (/^\d*$/.test(value) && value.length <= 10) {
                                                        handleInputChange(e);
                                                    }
                                                }}
                                            />

                                            <div style={{ height: "8px", margin: "0 2px 0 0" }}>
                                                {error && error.phone_number && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {error.phone_number}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label
                                                for="lastNameinput"
                                                className="form-label fs-s fw-medium black_300"
                                            >
                                                Entity<span className="text-danger">*</span>
                                            </label>
                                            {/* <Select
                                                className={`fs-s bg-form text_color input_bg_color`}
                                                options={entityList}
                                                classNamePrefix="Select the Batch Type"
                                                value={selectedEntity}
                                                onChange={(selectedOption) => {
                                                    setSelectedEntity(selectedOption);
                                                    setError((prev) => ({
                                                        ...prev,
                                                        entity_id: "",
                                                    }))
                                                }}
                                                isDisabled={userId}
                                            /> */}
                                            <Select
                                                id="entity_id"
                                                name="entity_id"
                                                placeholder="Search entity"
                                                classNamePrefix="Search"
                                                value={selectedEntity}
                                                className="fs-s bg-form text_color input_bg_color"
                                                options={entityOptions || []}  // Branch options from API
                                                onInputChange={(inputValue) => {
                                                    trigersearch(inputValue);  // Fetch new branches based on search input
                                                }}
                                                onChange={async (selectedOption) => {
                                                    if (selectedOption) {
                                                        const branchId = selectedOption?.value; // This will be the branch id
                                                        await handleChange(selectedOption, "entity_id");
                                                    }
                                                }}
                                                isDisabled={userId}
                                                isClearable = {false}
                                                getOptionLabel={(e) => e.label}
                                                getOptionValue={(e) => e.value}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.entity_id && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {error.entity_id}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* {entityBranches?.length > 0 && ( */}
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label
                                                    for="lastNameinput"
                                                    className="form-label fs-s fw-medium black_300"
                                                >
                                                    Branch<span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                    className={`fs-s bg-form text_color input_bg_color`}
                                                    options={entityBranches}
                                                    classNamePrefix="Select the Batch Type"
                                                    value={selectedEntityBranch}
                                                    onChange={(selectedOption) => {
                                                        setError((prev) => ({
                                                            ...prev,
                                                            branch_id: "",
                                                        }))
                                                        setSelectedEntityBranch(selectedOption);
                                                    }}
                                                    isDisabled={userId}
                                                />

                                                <div style={{ height: "8px" }}>
                                                    {error && error.branch_id && (
                                                        <p className="text-danger m-0 fs-xs">
                                                            {error.branch_id}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* )} */}
                                </div>
                                <div className=" ">
                                    <div className="d-flex justify-content-end mt-3">
                                        <Button
                                            className={"btn_primary"}
                                            onClick={(e) => handleSubmitEntityData(e)}
                                            disabled={fetcher.state !== "idle"}
                                            style={{ cursor: fetcher.state === "submitting" ? "not-allowed" : "pointer" }}
                                        >
                                            {userId ? fetcher.state === "submitting" ? " Updating" : "Update" : fetcher.state === "submitting" ? "Submiting" : "Submit"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateEntityUsers