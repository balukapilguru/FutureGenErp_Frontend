import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchSelect } from "./SearchSelect";

const Filter = ({ filterData, filterReset, filterSubmit, HandleFilters }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Local state to hold form values before submitting
    const [localFilters, setLocalFilters] = useState(() => {
        const initialValues = {};
        filterData.forEach((f) => {
            const key = f.urlParam || f.inputname;
            initialValues[key] = searchParams.get(key) || "";
        });
        return initialValues;
    });

    // Handle local field changes only
    const handleFilterChange = (index, name, value, opt, type) => {
        HandleFilters(index, name, value)
        if (type === 'search-select' && opt?.label) {
            setLocalFilters((prev) => ({ ...prev, [name]: value, [`${name}_label`]: opt.label }));
        }
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Clear local state and URL
    const handleReset = () => {
        setLocalFilters({});
        setSearchParams({});
        filterReset?.();
    };

    // Save filters → update URL params on Submit
    // const handleSubmit = () => {
    //     const updatedParams = new URLSearchParams();

    //     Object.entries(localFilters).forEach(([key, value]) => {
    //         if (value) updatedParams.set(key, value);
    //     });

    //     // ✅ Validation: at least one non-empty filter
    //     const hasAnyFilter = Array.from(updatedParams.keys()).length > 0;

    //     if (!hasAnyFilter) {
    //         toast.error("Please fill in at least one filter criteria.");
    //         return;
    //     }
    //     setSearchParams(updatedParams);
    //     filterSubmit?.(localFilters);
    // };


    const handleSubmit = () => {

        // Validation: at least one non-empty filter
        const hasAnyFilter = Object.entries(localFilters)
            .some(([, value]) => value);

        if (!hasAnyFilter) {
            toast.error("Please fill in at least one filter criteria.");
            return localFilters; // 🚫 do not update URL
        }
        setSearchParams(prevParams => {
            const updatedParams = new URLSearchParams(prevParams);

            // Remove old filter params first (important)
            filterData.forEach(f => {
                const key = f.urlParam || f.inputname || f?.urlSearchParam;
                updatedParams.delete(key);
            });

            // Add new filter values
            Object.entries(localFilters).forEach(([key, value]) => {
                if (value) updatedParams.set(key, value);
            });

            // Optional: reset page
            updatedParams.set("page", "1");

            return updatedParams;
        });

        filterSubmit?.(localFilters);
    };


    return (
        <div className="d-flex flex-column h-100">
            {/* Scrollable filters area */}
            <div className="flex-grow-1 overflow-auto p-3">
                {filterData.map((filter, index) => {
                    const name = filter.urlParam || filter.inputname;
                    const value = localFilters[name] || "";

                    return (
                        <div key={index} className="mb-3">
                            {filter.type === "search-select" && (
                                <div className="form-group text-start">
                                    <label className="form-label fs-s fw-medium text_color">
                                        {filter.label}
                                    </label>
                                    <SearchSelect
                                        placeholder={`Search ${filter.label}`}
                                        value={value}
                                        defaultOptions={filter.options || []}
                                        fetchOptions={filter.fetchOptions}
                                        onChange={(val, opt) =>
                                            handleFilterChange(index, name, val, opt, "search-select")
                                        }
                                    />
                                </div>
                            )}

                            {filter.type === "date" && (
                                <div className="form-group text-start">
                                    <label className="form-label fs-s text_color" htmlFor={name}>
                                        {filter.label}
                                    </label>
                                    <input
                                        className="form-control fs-s input_bg_color bg-form date_input_color"
                                        type="date"
                                        id={name}
                                        name={name}
                                        value={value}
                                        min={filter.min || undefined}
                                        max={filter.max || undefined}
                                        onChange={(e) => handleFilterChange(index, name, e.target.value)}
                                    />
                                </div>
                            )}

                            {filter.type === "select" && (
                                <div>
                                    <label className="form-label fs-s fw-medium text_color" htmlFor={name}>
                                        {filter.label}
                                    </label>
                                    <select
                                        className="form-select form-control input_bg_color text_color select"
                                        id={name}
                                        name={name}
                                        value={value}
                                        onChange={(e) => handleFilterChange(index, name, e.target.value)}
                                    >
                                        <option value="">Select the {filter.label}</option>
                                        {filter.options?.map((opt, i) => (
                                            <option key={i} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bottom buttons always visible */}
            <div className="border-top p-2 d-flex justify-content-between bg-white flex-shrink-0">
                <button
                    className="btn btn-sm btn_primary"
                    data-bs-dismiss="offcanvas"
                    onClick={handleReset}
                >
                    Clear
                </button>
                <button className="btn btn-sm btn_primary" onClick={handleSubmit}>
                    Save
                </button>
            </div>
        </div>

    );
};

export default Filter;
//  <div>
//             {filterData.map((filter, index) => {
//                 const name = filter.urlParam || filter.inputname;
//                 const value = localFilters[name] || "";

//                 return (
//                     <div key={index}>
//                         {filter.type === "search-select" && (
//                             <div className="form-group text-start">
//                                 <label className="form-label fs-s fw-medium text_color">
//                                     {filter.label}
//                                 </label>
//                                 <SearchSelect
//                                     placeholder={`Search ${filter.label}`}
//                                     value={value}
//                                     defaultOptions={filter.options || []} // This is your initial data
//                                     fetchOptions={filter.fetchOptions}
//                                     onChange={(val, opt) => handleFilterChange(index, name, val, opt, 'search-select')}
//                                 />
//                             </div>
//                         )}
//                         {filter.type === "date" && (
//                             <div className="form-group text-start">
//                                 <label className="form-label fs-s text_color" htmlFor={name}>
//                                     {filter.label}
//                                 </label>
//                                 <input
//                                     className="form-control fs-s input_bg_color bg-form date_input_color"
//                                     type="date"
//                                     id={name}
//                                     name={name}
//                                     value={value}
//                                     min={filter.min || undefined}
//                                     max={filter.max || undefined}
//                                     onChange={(e) => handleFilterChange(index, name, e.target.value)}
//                                 />
//                             </div>
//                         )}

//                         {filter.type === "select" && (
//                             <div>
//                                 <label
//                                     className="form-label fs-s fw-medium text_color"
//                                     htmlFor={name}
//                                 >
//                                     {filter.label}
//                                 </label>
//                                 <select
//                                     className="form-select form-control input_bg_color text_color select"
//                                     id={name}
//                                     name={name}
//                                     value={value}
//                                     onChange={(e) => handleFilterChange(index, name, e.target.value)}
//                                 >
//                                     <option value="">Select the {filter.label}</option>
//                                     {filter.options?.map((opt, i) => (
//                                         <option key={i} value={opt.value}>
//                                             {opt.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         )}
//                     </div>
//                 );
//             })}

//             <div>
//                 <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
//                     <button
//                         className="btn btn-sm btn_primary"
//                         data-bs-dismiss="offcanvas"
//                         onClick={handleReset}
//                     >
//                         Clear
//                     </button>
//                 </div>
//                 <div className="position-absolute bottom-0 end-0 me-2 mb-2">
//                     <button className="btn btn-sm btn_primary" onClick={handleSubmit}>
//                         Save
//                     </button>
//                 </div>
//             </div>
//         </div>