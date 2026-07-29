import "../../../../assets/css/Table.css";
import "../../../../assets/css/Table.css";
import { Link, useFetcher, useLoaderData, useSearchParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { HiMiniPlus } from "react-icons/hi2";
import BackButton from "../../../components/backbutton/BackButton";
import Swal from "sweetalert2";
import Button from "../../../components/button/Button";
import GateKeeper from "../../../../rbac/GateKeeper";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider";
import FormattedDate from "../../../../utils/FormattedDate";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Pagination from "../../../../utils/Pagination";

const Branch = () => {
  const data = useLoaderData();
  const { BranchList } = data;
  const fetcher = useFetcher();
  const { permission } = usePermissionsProvider();

  const [searchParams, setSearchParams] = useSearchParams();
  const handlePerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("pageSize", selectedvalue.toString());
    newSearchParams.set("page", 1);
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);

    // debouncesetPage({ context: "ENROLLED_STUDENTS", data: page });
  };

  const handleDeleteBranch = async (id) => {
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
        let data = { id: id };
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
      <BackButton heading=" Branch" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="d-flex justify-content-end">
                  <div>
                    <GateKeeper
                      requiredModule="Settings"
                      requiredPermission="all"
                      submenumodule="Branch"
                      submenuReqiredPermission="canCreate"
                    >
                      <Button
                        type="button"
                        className="btn btn-sm btn_primary fs-13"
                      >
                        <Link
                          to="/settings/branch/new"
                          className="button_color"
                        >
                          {<HiMiniPlus />} Add Branch
                        </Link>
                      </Button>
                    </GateKeeper>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive table-card  border-0">
                  <div className=" table-scroll">
                    <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                      <thead>
                        <tr className="">
                          <th scope="col" className="fs-13 lh-xs fw-600">
                            S.No
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Name
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Description
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Created By
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600 ">
                            Created At
                          </th>

                          {permission?.permissions.map((item) => {
                            if (item.module === "Settings") {
                              return item?.submenus?.map((submenu) => {
                                if (
                                  submenu?.module === "Branch" &&
                                  (submenu?.canUpdate === true ||
                                    submenu?.canDelete === true)
                                ) {
                                  return (
                                    <th
                                      key={1}
                                      scope="col"
                                      className="fs-13 lh_xs 0 fw-600"
                                    >
                                      Actions
                                    </th>
                                  );
                                }
                                return null;
                              });
                            }
                            return null;
                          })}
                        </tr>
                      </thead>
                      <tbody
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                        className=""
                      >
                        {BranchList && BranchList?.branchData?.length > 0 ? (
                          BranchList?.branchData?.map((item, index) => {
                            const branchid = item?.id;
                            return (
                              <tr key={index}>
                                <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                  {index + 1}
                                </td>
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {item?.branch_name}
                                </td>
                                <td
                                  className="fs-13 black_300  lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "150px" }}
                                  title={item?.description}
                                >
                                  {item?.description}
                                </td>
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {item?.branchCreator?.fullname}
                                </td>
                                <td className="fs-13 black_300  lh-xs bg_light">

                                  {FormattedDate(item?.date)}
                                </td>
                                {permission?.permissions?.map((item) => {
                                  if (item.module === "Settings") {
                                    return item?.submenus?.map((submenu) => {
                                      if (
                                        submenu?.module === "Branch" &&
                                        (submenu?.canUpdate === true ||
                                          submenu?.canDelete === true)
                                      ) {
                                        return (
                                          <td
                                            className="fs-13 black_300  lh-xs bg_light "
                                            key={index + 1}
                                          >
                                            <GateKeeper
                                              requiredModule="Settings"
                                              requiredPermission="all"
                                              submenumodule="Branch"
                                              submenuReqiredPermission="canCreate"
                                            >
                                              <Link
                                                to={`/settings/branch/edit?branchId=${branchid}`}
                                              >
                                                <RiEdit2Line className="edit_icon me-3" />
                                              </Link>
                                            </GateKeeper>
                                            <GateKeeper
                                              requiredModule="Settings"
                                              requiredPermission="all"
                                              submenumodule="Branch"
                                              submenuReqiredPermission="canCreate"
                                            >
                                              <MdDelete
                                                className="delete_icon me-3"
                                                onClick={() =>
                                                  handleDeleteBranch(branchid)
                                                }
                                              />
                                            </GateKeeper>
                                          </td>
                                        );
                                      }
                                      return null;
                                    });
                                  }
                                  return null;
                                })}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="fs-13 black_300">No Data </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                  </div>
                </div>
                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: BranchList?.branchData?.length,
                        start: BranchList?.startBranch,
                        end: BranchList?.endBranch,
                        total: BranchList?.totalBranches,
                      }}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex justify-content-center pagination-res">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color pagination-select"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                        onChange={(e) => handlePerPage(e)}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>

                    <div>
                      <Pagination
                        currentPage={BranchList?.currentPage}
                        totalPages={BranchList?.totalPages}
                        onPageChange={handlePageChange}
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
export default Branch;

