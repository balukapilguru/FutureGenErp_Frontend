import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";

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

const CreateAdmissionFee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem("admissionFeeList");
      let list = defaultAdmissionFees;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            list = parsed;
          }
        } catch (e) {
          console.error(e);
        }
      }
      const found = list.find((item) => String(item.id) === String(id));
      if (found) {
        setFormData({
          name: found.name || "",
          amount: found.amount || "",
        });
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Admission Fee Name / Branch is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userData = JSON.parse(localStorage.getItem("data") || "{}");
    const createdBy =
      userData?.user?.fullname || userData?.fullname || "Admin";
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    const saved = localStorage.getItem("admissionFeeList");
    let list = defaultAdmissionFees;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (isEdit) {
      list = list.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              name: formData.name.trim(),
              amount: formData.amount,
            }
          : item
      );
      toast.success("Admission fee updated successfully!");
    } else {
      const newId =
        list.length > 0
          ? Math.max(...list.map((i) => Number(i.id) || 0)) + 1
          : 1;
      list.push({
        id: newId,
        name: formData.name.trim(),
        amount: formData.amount,
        createdBy,
        createdAt: dateStr,
      });
      toast.success("Admission fee created successfully!");
    }

    localStorage.setItem("admissionFeeList", JSON.stringify(list));
    navigate("/settings/admissionfee");
  };

  return (
    <div>
      <BackButton
        heading={isEdit ? "Edit Admission Fee" : "Add Admission Fee"}
        content="Back"
      />
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-5">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label fs-s fw-medium txt-color"
                    >
                      Admission Fee / Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control fs-s bg-form txt-color ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Admission Fee Name / Branch"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="text-danger fs-12 mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="amount"
                      className="form-label fs-s fw-medium txt-color"
                    >
                      Amount
                    </label>
                    <input
                      type="number"
                      className="form-control fs-s bg-form txt-color"
                      placeholder="Enter Fee Amount"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mt-4">
                    <div className="d-flex justify-content-end">
                      <Button type="submit" className="btn_primary">
                        {isEdit ? "Update" : "Submit"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmissionFee;
