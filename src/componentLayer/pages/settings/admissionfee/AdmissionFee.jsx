import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../../assets/css/Table.css";
import { MdDelete } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { HiMiniPlus } from "react-icons/hi2";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const defaultAdmissionFees = [
  {
    id: 1,
    name: "Kukkatpally",
    amount: "5000",
    createdBy: "Bhavitha",
    createdAt: "12-10-2024",
  },
  {
    id: 2,
    name: "Ameerpet",
    amount: "5000",
    createdBy: "Bhavitha",
    createdAt: "12-10-2024",
  },
];

const AdmissionFee = () => {
  const [admissionFeeList, setAdmissionFeeList] = useState(() => {
    const saved = localStorage.getItem("admissionFeeList");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return defaultAdmissionFees;
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Admission Fee",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = admissionFeeList.filter((item) => item.id !== id);
        setAdmissionFeeList(updated);
        localStorage.setItem("admissionFeeList", JSON.stringify(updated));
        Swal.fire({
          title: "Deleted!",
          text: "Admission Fee deleted Successfully.",
          icon: "success",
        });
      }
    });
  };

  return (
    <div>
      <BackButton heading="Admission Fee" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="d-flex justify-content-end">
                  <div>
                    <Link
                      to="/settings/admissionfee/new"
                      className="button_color text-decoration-none"
                    >
                      <Button
                        type="button"
                        className="btn btn-sm btn_primary fs-13"
                      >
                        <HiMiniPlus className="me-1" /> Add Admission Fee
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive table-card border-0">
                  <div className="table-scroll">
                    <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                      <thead>
                        <tr>
                          <th scope="col" className="fs-13 lh-xs fw-600">
                            S.No
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600">
                            Name
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600">
                            Created By
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600">
                            Created At
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {admissionFeeList && admissionFeeList.length > 0 ? (
                          admissionFeeList.map((item, index) => (
                            <tr key={item.id || index}>
                              <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                                {String(index + 1).padStart(2, "0")}
                              </td>
                              <td className="fs-13 black_300 lh-xs bg_light">
                                {item.name}
                              </td>
                              <td className="fs-13 black_300 lh-xs bg_light">
                                {item.createdBy || "Admin"}
                              </td>
                              <td className="fs-13 black_300 lh-xs bg_light">
                                {item.createdAt || "N/A"}
                              </td>
                              <td className="fs-13 black_300 lh-xs bg_light">
                                <Link
                                  to={`/settings/admissionfee/edit/${item.id}`}
                                  title="Edit Admission Fee"
                                >
                                  <RiEdit2Line className="edit_icon me-3 cursor-pointer" />
                                </Link>
                                <MdDelete
                                  className="delete_icon me-3 cursor-pointer"
                                  onClick={() => handleDelete(item.id)}
                                  title="Delete Admission Fee"
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              No Admission Fees Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

export default AdmissionFee;
