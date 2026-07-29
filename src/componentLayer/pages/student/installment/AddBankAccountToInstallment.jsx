import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import Select from "react-select";

import { FaBullseye } from "react-icons/fa6";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";


const AddBankAccountToInstallment = ({ show, handleClose, installment, type }) => {


    const navigate = useNavigate();

    const location =useLocation();

    const [selectedBanks, setSelectedBanks] = useState(null);
    const [bankList, setBankList] = useState(null);
    const [loading, setLoading] = useState(false);




    useEffect(() => {
        const fetchBranchData = async () => {
            if (!installment) return;

            const branchId = type === "admission" ? installment?.student?.branches?.id : installment?.studentDetails?.branches?.id

            try {
                const { data, status } = await ERPApi.get(`/settings/getbranch/${branchId}`);
                if (status === 200) {

                    const bankList = data?.branchez?.map((item) => ({
                        label: `${item.bankName} - ${item.bankBranchName} - ${item?.accountHolderName}`,
                        value: item.id
                    })) || [];


                    setBankList(bankList);
                }
            } catch (error) {
                console.error("Error fetching branch data:", error);
                setBankList(null);
            }
        };

        fetchBranchData();
    }, [installment]);




    const handleSubmit = () => {
        if (!selectedBanks) {
            toast.error("Please Select the Bank");
            return;
        }

        const bankIntallmentData = {
            installmentId: installment?.id,
            bankId: selectedBanks.value
        }

        const bankAdmissionData={
            admissionFeeId:installment.id,
            bankId: selectedBanks.value
        }

        const sendApiData =  type === "admission" ? bankAdmissionData: bankIntallmentData


        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Add Bank Account to this Installment",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add Bank Account",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading((prev) => !prev);
                try {
                    const { data, status } = await toast.promise(
                        ERPApi.put(`fee/update_bankid`, sendApiData),
                        {
                            pending: "Adding the Bank Account to the  Installment...",
                        }
                    );

                    if (status === 200) {
                        // navigate("/student/installment?page=1&pageSize=10&search=")
                        handleClose();
                        setBankList([]);
                        setSelectedBanks([]);
                        Swal.fire({
                            title: "Added!",
                            text: "Bank Account Added successfully.",
                            icon: "success",
                        });
                        navigate(`/student/installment${location?.search}`)
                    }
                } catch (error) {
                    console.error(error);
                    const errorMessage =
                        error?.response?.data?.message ||
                        "An unknown error occurred. Please try again.";
                    Swal.fire({
                        title: "Error!",
                        text: errorMessage,
                        icon: "error",
                    });
                } finally {
                    setLoading((prev) => !prev);
                }
            }
        });
    };

    const handleCloseModal = () => {
        handleClose();
        setBankList([]);
        setSelectedBanks([]);
    };



    return (
        <Modal
            show={show}
            onHide={handleCloseModal}
            backdrop="static"
            size="md"
            dialogClassName="modal-dialog-centered"
        >
            <Modal.Header
                closeButton
            >
                <Modal.Title>Add Bank Account to Installment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-8">
                        <label className="form-label fs-s fw-medium black_300">
                            Bank<span className="text-danger">*</span>
                        </label>
                        <Select
                            className="fs-s bg-form text_color input_bg_color"
                            // isMulti
                            options={bankList}
                            classNamePrefix="select"
                            value={selectedBanks}
                            onChange={(selectedOption) => setSelectedBanks(selectedOption)}

                        />
                        {
                            bankList && bankList?.length === 0 ?
                                <div className=" fs-s col-md-8 pt-3 text-danger">
                                    No Banks Avaliable
                                </div> :
                                null
                        }
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-end mt-3">
                    <Button
                        className="btn btn_primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        Submit
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )

}
export default AddBankAccountToInstallment;