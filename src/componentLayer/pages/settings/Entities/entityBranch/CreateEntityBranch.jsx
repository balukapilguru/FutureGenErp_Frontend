import React, { useEffect, useState } from 'react'
import BackButton from '../../../../components/backbutton/BackButton';
import { useFetcher, useLoaderData, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../../components/button/Button';
import Select from "react-select";


const CreateEntityBranch = () => {
    const { branchId } = useParams()

    const { entityBranchData = {}, entityList } = useLoaderData() ?? {};
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const [selectedEntity, setSelectedEntity] = useState()

    const [branchData, setEntityData] = useState(
        {
            name: "",
            email: "",
            entity_id: null,
        }
    )
    const [error, setError] = useState(
        {
            name: "",
            email: "",
            entity_id: null,
        }
    )

    useEffect(() => {
        if (branchId) {

            setEntityData(prev => ({
                ...prev,
                name: entityBranchData.branch_name,
                email: entityBranchData.email,
                entity_id: entityBranchData.id,
            }))
            setSelectedEntity({ label: `${entityBranchData?.entity?.name}`, value: entityBranchData?.entity?.id })
        }
    }, [])


    const validateEntityData = () => {
        const errors = {};

        // Validate Name
        if (!branchData?.name?.trim() || branchData?.name?.trim().replace(/\s/g, "").length < 3) {
            errors.name = "Name must be at least 3 characters long and cannot be empty or just spaces.";
        }
        if (!selectedEntity?.value) {
            errors.entity_id = "Entity is required";
        }


        setError(errors)
        return errors;
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setEntityData({ ...branchData, [name]: value });
        setError({ ...error, [name]: "" })
    }

    const handleSubmitEntityData = () => {
        const errors = validateEntityData();

        // Check if there are any validation errors
        if (Object.keys(errors).length > 0) {
            return; // You can return or handle the errors as needed
        }
        const formdata = new FormData();
        formdata.set("branch", branchData.name);
        formdata.set("entity_id", selectedEntity?.value)


        if (branchId) {
            fetcher.submit(formdata, {
                method: "put",
                encType: "application/form-data"
            })

        } else {
            fetcher.submit(formdata, {
                method: "post",
                encType: "application/form-data"
            })
        }
    }

    useEffect(() => {
        if (fetcher?.data?.status === 200 || fetcher?.data?.status === 201) {
            navigate("/settings/entity-branch")
        }
    }, [fetcher])
    return (
        <div>
            {branchId && branchId ? (
                <BackButton heading="Edit Entity Branch" content="Back" />
            ) : (
                <BackButton heading="Entity Branch Form" content="Back" />
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
                                                Branch Name<span className="text-danger">*</span>
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
                                                value={branchData.name}
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
                                    {/* <div className="col-md-4">
                                        <div className="mb-3">
                                            <label
                                                for="email"
                                                className="form-label fs-s fw-medium black_300"
                                            >
                                                Description<span className="text-danger">*</span>
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
                                                value={branchData?.email}
                                                readOnly={!!branchId}
                                                // disabled={branchData.email}
                                                onChange={handleInputChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {error && error.email && (
                                                    <p className="text-danger m-0 fs-xs">{error.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label
                                                for="lastNameinput"
                                                className="form-label fs-s fw-medium black_300"
                                            >
                                                Entity <span className="text-danger">*</span>
                                            </label>
                                            {/* <Select
                                                id="curriculum"
                                                name="curriculum"
                                                placeholder="Search the Curriculum"
                                                classNamePrefix="Search"
                                                className="fs-s bg-form text_color input_bg_color"
                                                options={entityList || []}
                                            // onChange={(e) => handleQueryFilters(e, "curriculum")}
                                            // value={selectedCurriculum || ""}
                                            // onInputChange={(inputValue) => handleQuerySearch(inputValue, "curriculum")}
                                            // isClearable
                                            /> */}
                                            <Select
                                                className={`fs-s bg-form text_color input_bg_color`}
                                                options={entityList}
                                                classNamePrefix="Select the Batch Type"
                                                value={selectedEntity}
                                                onChange={(selectedOption) => {
                                                    setError(prev => ({
                                                        ...prev,
                                                        entity_id: ""
                                                    }))
                                                    setSelectedEntity(selectedOption);
                                                }}
                                                isDisabled= {branchId}
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
                                </div>
                                <div className=" ">
                                    <div className="d-flex justify-content-end mt-3">
                                        <Button
                                            className={"btn_primary"}
                                            onClick={(e) => handleSubmitEntityData(e)}
                                            disabled={fetcher.state !== "idle"}
                                            style={{ cursor: fetcher.state === "submitting" ? "not-allowed" : "pointer" }}
                                        >
                                            {branchId ? fetcher.state === "submitting" ? " Updating" : "Update" : fetcher.state === "submitting" ? "Submiting" : "Submit"}
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

export default CreateEntityBranch
