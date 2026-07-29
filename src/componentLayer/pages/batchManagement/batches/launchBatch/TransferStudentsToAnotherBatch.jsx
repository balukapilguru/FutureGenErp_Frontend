import { Modal, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";

const TransferStudentsToAnotherBatch = ({
  show,
  handleClose,
  students,
  batchId,
  type,
}) => {
  const batchTypeList = [
    { label: "Active Batches", value: "active" },
    { label: "Upcoming Batches", value: "upcoming" },
  ];
  const [BatchesList, setBatchesList] = useState([]);

  const [selectedBatchType, setSelectedBatchType] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedBatchType) {
        try {
          const { data, status } = await ERPApi.get(
            `/batch/getbatches?filter[batchStatus]=${selectedBatchType?.value}`
          );
          if (status === 200) {
            setBatchesList(
              data?.reversedBatches.map((item, index) => ({
                label: item?.batchName,
                value: item?.id,
              }))
            );
          }
        } catch (error) {
          setBatchesList([]);
        }
      }
    };
    fetchData();
  }, [selectedBatchType]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {type === "copy"
            ? "Copy Students to Another Batch"
            : "Move Students to Another Batch"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row d-flex justify-content-center">
          <div className="col-lg-8 text-start">
            <label
              className="form-label fs-s fw-medium black_300"
              htmlFor="batchType"
            >
              Batch Type <span className="text-danger">*</span>
            </label>
            <Select
              className={`fs-s bg-form text_color input_bg_color`}
              options={batchTypeList}
              classNamePrefix="Select the Batch Type"
              value={selectedBatchType}
              onChange={(selectedOption) => {
                setSelectedBatchType(selectedOption);
              }}
            />
          </div>

          <div className="col-lg-8 text-start mt-2">
            <label
              className="form-label fs-s fw-medium black_300"
              htmlFor="batch"
            >
              Batch <span className="text-danger">*</span>
            </label>
            <Select
              className={`fs-s bg-form text_color input_bg_color`}
              options={BatchesList}
              classNamePrefix="Select The Batch"
              value={selectedBatch}
              onChange={(selectedOption) => {
                setSelectedBatch(selectedOption);
              }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary">Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransferStudentsToAnotherBatch;
