import { toast } from "react-toastify";
import { Offcanvas } from "bootstrap";

const CustomFilters = ({ filterData, Qparams, setQParams, setFilterData }) => {

    const getPairedDateKey = (currentName) => {
        if (/from/i.test(currentName)) {
            const paired = currentName.replace(/from/i, (m) => (m === "From" ? "To" : m === "FROM" ? "TO" : "to"));
            return { type: "from", pairedKey: paired };
        }
        if (/start/i.test(currentName)) {
            const paired = currentName.replace(/start/i, (m) => (m === "Start" ? "End" : m === "START" ? "END" : "end"));
            return { type: "from", pairedKey: paired };
        }
        if (/to/i.test(currentName)) {
            const paired = currentName.replace(/to/i, (m) => (m === "To" ? "From" : m === "TO" ? "FROM" : "from"));
            return { type: "to", pairedKey: paired };
        }
        if (/end/i.test(currentName)) {
            const paired = currentName.replace(/end/i, (m) => (m === "End" ? "Start" : m === "END" ? "START" : "start"));
            return { type: "to", pairedKey: paired };
        }
        return { type: "none", pairedKey: null };
    };

    const HandleFilters = (index, name, value) => {
        let updatedFilterData = [...filterData];
        updatedFilterData[index].value = value;
        setFilterData(updatedFilterData);
    };

    const handleSubmitFilters = () => {
        const hasAnyFilter = filterData.some((f) => f.value);
        if (!hasAnyFilter) {
            toast.error("Please fill in at least one filter criteria.");
            return;
        }

        // Validate date pairs
        for (const f of filterData) {
            if (f.type === "date") {
                const { type, pairedKey } = getPairedDateKey(f.inputname);
                const val = f.value;
                const pairedItem = pairedKey ? filterData.find((item) => item.inputname === pairedKey) : null;
                const pairedVal = pairedItem?.value;

                if (type === "from") {
                    if (val && !pairedVal) {
                        toast.error(`Please select ${f.label.replace(/from/i, "To")} as well.`);
                        return;
                    }
                } else if (type === "to") {
                    if (val && !pairedVal) {
                        toast.error(`Please select ${f.label.replace(/to/i, "From")} as well.`);
                        return;
                    }
                    if (val && pairedVal && new Date(val) < new Date(pairedVal)) {
                        toast.error(`${f.label} cannot be earlier than From Date.`);
                        return;
                    }
                }
            }
        }

        setQParams({
            ...Qparams, ...filterData.reduce((acc, curr) => {
                acc[curr.inputname] = curr.value;
                return acc;
            }, {})
        });

        // Auto-close offcanvas
        const openOffcanvases = document.querySelectorAll(".offcanvas.show");
        openOffcanvases.forEach((el) => {
            const closeBtn = el.querySelector('[data-bs-dismiss="offcanvas"]');
            if (closeBtn) {
                closeBtn.click();
            } else {
                const instance = Offcanvas.getInstance(el) || (window.bootstrap ? new window.bootstrap.Offcanvas(el) : null);
                instance?.hide();
            }
        });
    };

    const handleResetFilters = () => {
        setFilterData(filterData.map((filter) => ({ ...filter, value: "" })))
        setQParams({
            search: '',
            page: 1,
            pageSize: 10,
        })
    };


    return (
        <div className="d-flex flex-column h-100">
            {/* Scrollable inputs */}
            <div className="flex-grow-1 overflow-auto px-2">
                {filterData && filterData.map((filter, index) => {
                    const { type, pairedKey } = getPairedDateKey(filter.inputname);
                    const pairedItem = pairedKey ? filterData.find((item) => item.inputname === pairedKey) : null;
                    const pairedVal = pairedItem?.value;
                    const dynamicMin = type === "to" ? (pairedVal || filter.min || undefined) : (filter.min || undefined);
                    const dynamicMax = type === "from" ? (pairedVal || filter.max || undefined) : (filter.max || undefined);

                    return (
                        <div key={index} className="mb-3">
                            {filter.type === "date" && (
                                <div className="form-group text-start">
                                    <label
                                        className="form-label fs-s text_color"
                                        htmlFor={`exampleInputdate${index}`}
                                    >
                                        {filter.label}
                                    </label>
                                    <input
                                        className="form-control fs-s input_bg_color bg-form date_input_color"
                                        type="date"
                                        id={`exampleInputdate${index}`}
                                        name={filter.inputname}
                                        value={filter?.value}
                                        onChange={(e) => HandleFilters(index, filter.inputname, e.target.value)}
                                        required
                                        min={dynamicMin}
                                        max={dynamicMax}
                                    />
                                </div>
                            )}

                            {filter.type === "select" && (
                                <div>
                                    <label className="form-label fs-s fw-medium text_color">
                                        {filter.label}
                                    </label>
                                    <select
                                        className="form-select form-control input_bg_color text_color select"
                                        name={filter.inputname}
                                        id={filter.inputname}
                                        value={filter?.value}
                                        onChange={(e) => HandleFilters(index, filter.inputname, e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select the {filter.label}
                                        </option>
                                        {filter.options && filter.options.length > 0 &&
                                            filter.options.map((item, i) => (
                                                <option key={i} value={item?.value}>
                                                    {item.label}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Buttons fixed at bottom */}
            <div className="d-flex justify-content-between mt-auto p-2 border-top bg-white">
                <button
                    className="btn btn-sm btn_primary"
                    onClick={handleResetFilters}
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    Clear
                </button>
                <button
                    className="btn btn-sm btn_primary"
                    onClick={handleSubmitFilters}
                >
                    Save
                </button>
            </div>
        </div>

    );
};

export default CustomFilters;


{/* <div>
            <div>
                {filterData && filterData?.map((filter, index) => (
                    <div key={index}>
                        {filter.type === "date" && (
                            <div className="form-group text-start">
                                <label
                                    className="form-label fs-s text_color"
                                    htmlFor="example-text-input "
                                >
                                    {filter.label}
                                </label>
                                <input
                                    className="form-control fs-s input_bg_color bg-form date_input_color"
                                    type="date"
                                    id="exampleInputdate"
                                    name={filter.inputname}
                                    value={filter?.value}
                                    onChange={(e) => HandleFilters(index, filter.inputname, e.target.value)}
                                    required
                                    min={filter?.min}
                                    max={filter?.max}

                                />
                            </div>
                        )}

                        {filter.type === "select" && (
                            <div className="">
                                <label className="form-label fs-s fw-medium text_color">
                                    {filter.label}
                                </label>
                                <select
                                    className="form-select form-control input_bg_color text_color select"
                                    aria-label="Default select example"
                                    placeholder="course*"
                                    name={filter.inputname}
                                    id={filter.inputname}
                                    value={filter?.value}
                                    onChange={(e) => HandleFilters(index, filter.inputname, e.target.value)
                                    }
                                    required
                                >
                                    <option value="" disabled selected>
                                        {" "}
                                        Select the {filter.label}
                                    </option>
                                    {filter.options && filter.options.length > 0
                                        ? filter.options.map((item, index) => (
                                            <option key={index} value={item?.value}>
                                                {item.label}
                                            </option>
                                        ))
                                        : null}
                                </select>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                    <button
                        className="btn btn-sm btn_primary"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={handleResetFilters}
                    >
                        Clear
                    </button>
                </div>
                <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                    <button
                        className="btn btn-sm btn_primary"
                        onClick={handleSubmitFilters}
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div> */}