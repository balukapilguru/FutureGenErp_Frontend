import { useSearchParams } from "react-router-dom";

import { useState } from "react";
import SearchInputField from "./SearchInputField";
import BackButton from "../componentLayer/components/backbutton/BackButton";
import Filter from "./Filter";
import CustomTable from "./CustomTable";
import { Offcanvas } from "bootstrap";
import InfoTooltip from "./InfoTooltip.jsx";

const CustomPage = ({
    tableData,
    tableColum,
    tableActions,
    tablePagination,
    isSearch = false,
    searchPlaceHolder,
    isFilter = false,
    onPageChange,
    InitialFilterData,
    handlePerPageChange,
    backButtonText = "Back",
    heading = "Page",
    searchToolTipText,
    searchToolTipPosition,
    headerActions,
}) => {
    const [filterData, setFilterData] = useState(
        InitialFilterData?.map((item) => ({ ...item })),
    );
    const [searchParams, setSearchParams] = useSearchParams();

    //   const HandleFilters = (index, name, value) => {
    //     setFilterData((prev) =>
    //       prev.map((item, idx) =>
    //         idx == index
    //           ? {
    //               ...item,
    //               [`filter[${name}]`]: value,
    //             }
    //           : item,
    //       ),
    //     );
    //   };

    const HandleFilters = (index, name, value) => {
        setFilterData((prev) =>
            prev.map((item, idx) =>
                idx === index
                    ? { ...item, value } // ✅ only this
                    : item,
            ),
        );
    };

    const FilterReset = () => {
        const resetFilterData = filterData?.map((item) => ({
            ...item,
            value: "",
        }));
        setFilterData(resetFilterData);

        const newSearchParams = new URLSearchParams(searchParams.toString());
        InitialFilterData.forEach((filter) => {
            newSearchParams.delete(filter.urlParam || filter.inputname);
        });
        newSearchParams.set("page", "1");

        setSearchParams(newSearchParams);
    };

    const filterSubmit = () => {
        const newSearchParams = new URLSearchParams();

        filterData.forEach((item) => {
            if (item.value) {
                newSearchParams.set(item.urlParam || item.inputname, item.value);
            }
        });

        newSearchParams.set("page", "1");
        setSearchParams(newSearchParams);

        const offcanvasElement = document.getElementById("offcanvasRight");
        const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) offcanvasInstance.hide();
    };

    return (
        <div>
            <BackButton heading={heading} content={backButtonText} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card border-0">
                            {/* 🔹 Header (same as your main UI) */}
                            <div className="card-header">
                                <div className="row d-flex justify-content-between align-items-center">
                                    {/* Search */}
                                    <div className="col-sm-4">
                                        {isSearch && (
                                            <div className="search-box d-flex gap-2">
                                                <SearchInputField
                                                    placeholder={searchPlaceHolder || "Search"}
                                                />
                                                {searchToolTipText &&
                                                    <InfoTooltip text={searchToolTipText} position={searchToolTipPosition || "top"} />
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-md-6 text-end d-flex justify-content-end gap-2">
                                        {/* Filter Button */}
                                        <div className="me-3">
                                            {headerActions && headerActions}
                                        </div>
                                        {isFilter && (
                                            <>
                                                <button
                                                    className="btn btn-sm btn_primary fs-13"
                                                    data-bs-toggle="offcanvas"
                                                    data-bs-target="#offcanvasRight"
                                                >
                                                    Filters
                                                </button>

                                                <div
                                                    className="offcanvas offcanvas-end bg_white"
                                                    id="offcanvasRight"
                                                >
                                                    <div className="offcanvas-header">
                                                        <h5 className="offcanvas-title text_color">
                                                            Filters
                                                        </h5>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            data-bs-dismiss="offcanvas"
                                                        ></button>
                                                    </div>

                                                    <div className="offcanvas-body p-2 bg_white">
                                                        <Filter
                                                            filterData={filterData}
                                                            filterReset={FilterReset}
                                                            filterSubmit={filterSubmit}
                                                            HandleFilters={HandleFilters}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Example Button (optional like your Create button) */}
                                        {/*
                                    <button className="btn btn-sm btn_primary fs-13">
                                        <Plus /> Add
                                    </button> 
                                    */}
                                    </div>
                                </div>
                            </div>

                            {/* 🔹 Table Section */}
                            <div
                                className="card-body d-flex flex-column"
                                style={{ minHeight: "70vh" }}
                            >
                                <div className="table-responsive table-card border-0 flex-grow-1">
                                    <div className="table-container table-scroll h-100">
                                        <CustomTable
                                            data={tableData}
                                            columns={tableColum}
                                            actions={tableActions}
                                            pagination={tablePagination}
                                            onPageSizeChange={handlePerPageChange}
                                            onPageChange={onPageChange}
                                            tableClassName="table table-centered align-middle table-nowrap equal-cell-table table-hover"
                                        />
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
export default CustomPage;
