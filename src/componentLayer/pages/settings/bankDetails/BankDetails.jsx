import "../../../../assets/css/Table.css";
import { Link, useFetcher, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { HiMiniPlus } from "react-icons/hi2";
import BackButton from "../../../components/backbutton/BackButton";
import Button from "../../../components/button/Button";
import Swal from "sweetalert2";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider";
import GateKeeper from "../../../../rbac/GateKeeper";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Pagination from "../../../../utils/Pagination";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../../../../utils/Utils.jsx";

const BankDetails = () => {
    const fetcher = useFetcher()
    let submit = useSubmit();
    const navigation = useNavigation()
    const bankDetailsData = useLoaderData();
    const { permission } = usePermissionsProvider();

    const [Qparams, setQParams] = useState({
        search: '',
        page: 1,
        pageSize: 10,
    });

    const handleSearch = (event) => {
        setQParams({
            ...Qparams,
            search: event.target.value,
        });
    };
    const handlePage = (page) => {
        setQParams({
            ...Qparams,
            page,
        });
    };

    const handlePerPageChange = (event) => {
        const selectedValue = parseInt(event.target.value, 10);
        setQParams({
            ...Qparams,
            page: 1,
            pageSize: selectedValue,

        });
    };

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        debouncedParams(Qparams);
    }, [Qparams]);

    const debouncedParams = useCallback(
        debounce((param) => {
            const searchParams = new URLSearchParams({
                page: param.page,
                pageSize: param.pageSize,
                search: param.search,
            }).toString();

            submit(`?${searchParams}`, { method: "get", action: "." });

        }, 500),
        []
    );

    const handleDeletBankDetails = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this Branch",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let data = { id };
                try {
                    await fetcher.submit(data, {
                        method: "DELETE",
                        encType: "application/json",
                    });


                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    return (
        <div>
            <BackButton heading="Bank Details" content="Back" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card border-0">
                            <div className="card-header">
                                <div className="row d-flex justify-content-between">
                                    <div className="col-sm-4">
                                        <div className="search-box">
                                            <input
                                                type="text"
                                                className="form-control search input_bg_color text_color"
                                                placeholder="Search for..."
                                                name="search"
                                                required
                                                onChange={(e) => handleSearch(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-end">
                                        <GateKeeper
                                            requiredModule="Settings"
                                            requiredPermission="all"
                                            submenumodule="Bank Details"
                                            submenuReqiredPermission="canCreate"
                                        >
                                            <Button
                                                type="button"
                                                className="btn btn-sm btn_primary fs-13"
                                            >
                                                <Link
                                                    to="/settings/createbankdetails"
                                                    className="button_color"
                                                >
                                                    {<HiMiniPlus />} Create Bank
                                                </Link>
                                            </Button>
                                        </GateKeeper>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive table-card border-0">
                                    <div className="table-container table-scroll">
                                        <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                                            <thead>
                                                <tr className="">
                                                    <th scope="col" className="fs-13 lh-xs fw-600  ">
                                                        S.No
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                        Bank Nane
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                        Bank Branch Name
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                        Account Holder Name
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                        Account Number
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs  fw-600 ">
                                                        Account Type
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs  fw-600 ">
                                                        IFSC Code
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs  fw-600 ">
                                                        City
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs  fw-600 ">
                                                        CreatedBy
                                                    </th>
                                                    {permission?.permissions.map((item) => {
                                                        if (item.module === "Settings") {
                                                            return item?.submenus?.map((submenu) => {
                                                                if (
                                                                    submenu?.module === "Bank Details" &&
                                                                    (submenu?.canUpdate === true ||
                                                                        submenu?.canDelete === true)
                                                                ) {
                                                                    return (
                                                                        <th scope="col" className="fs-13 lh_xs 0 fw-600">Actions </th>
                                                                    );
                                                                }
                                                                return null;
                                                            });
                                                        }
                                                        return null;
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody className="scrollable-body">
                                                {bankDetailsData?.data && bankDetailsData?.data.length > 0 ? (
                                                    bankDetailsData?.data?.map((bank, index) => (
                                                        <tr key={index}>
                                                            <td className="fs-13 black_300 fw-500 lh-xs bg_light">{index + 1}</td>
                                                            <td className="fs-13 black_300  lh-xs bg_light text-truncate">{bank.bankName}</td>
                                                            <td className="fs-13 black_300  lh-xs bg_light text-truncate">{bank.bankBranchName}</td>
                                                            <td className="fs-13 black_300  lh-xs bg_light text-truncate">{bank.accountHolderName}</td>
                                                            <td className="fs-13 black_300  lh-xs bg_light text-truncate">{bank.accountNumber}</td>
                                                            <td className="fs-13 black_300  lh-xs bg_light text-truncate">{bank.accountType}</td>
                                                            <td className="fs-13 black_300  lh-xs bg_light text-truncate">{bank.IFSC}</td>
                                                            <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }}>{bank.bankAddress}</td>
                                                            <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }}>{bank?.bankCreator?.fullname}</td>
                                                            {permission?.permissions.map((item) => {
                                                                if (item.module === "Settings") {
                                                                    return item?.submenus?.map((submenu) => {
                                                                        if (
                                                                            submenu?.module === "Bank Details" &&
                                                                            (submenu?.canUpdate === true || submenu?.canDelete === true)
                                                                        ) {
                                                                            return (
                                                                                <td>
                                                                                    <Link to={`/settings/editbankdetails/${bank?.id}`}>
                                                                                        <RiEdit2Line className="text-primary me-2" />
                                                                                    </Link>
                                                                                    {/* <MdDelete
                                                                                        className="text-danger"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            handleDeletBankDetails(bank?.id);
                                                                                        }}
                                                                                    /> */}
                                                                                </td>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    });
                                                                }
                                                                return null;
                                                            })}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td className=" fs-13 black_300  lh-xs bg_light">
                                                            No Data
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                                    <div className="col-sm mt-3 mt-sm-0">
                                        <PaginationInfo
                                            data={{
                                                length: bankDetailsData?.length,
                                                start: bankDetailsData?.startRecord,
                                                end: bankDetailsData?.endRecord,
                                                total: bankDetailsData?.totalRecord,
                                            }}
                                            loading={navigation?.state === "loading"}
                                        />
                                    </div>
                                    <div className="col-sm-auto mt-sm-0 d-flex justify-content-center pagination-res">
                                        <div className="mt-2">
                                            <select
                                                className="form-select form-control me-3 input_bg_color pagination-select "
                                                aria-label="Default select example"
                                                required
                                                onChange={(e) => handlePerPageChange(e)}
                                                value={Qparams?.pageSize}
                                            >
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="75">75</option>
                                                <option value="100">100</option>
                                            </select>
                                        </div>

                                        <div className="">
                                            <Pagination
                                                currentPage={bankDetailsData?.currentPage}
                                                totalPages={bankDetailsData?.totalPages}
                                                loading={navigation?.state === "loading"}
                                                onPageChange={handlePage}
                                            />
                                        </div>
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
export default BankDetails;
