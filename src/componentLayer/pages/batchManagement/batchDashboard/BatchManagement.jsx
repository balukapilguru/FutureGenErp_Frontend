import { useEffect } from "react";
import BackButton from "../../../components/backbutton/BackButton";
import girl_img from "../../../../assets/images/batch_management/girl_img.png";
import { HiMiniPlus } from "react-icons/hi2";
import { MdOutlinePeopleOutline } from "react-icons/md";
import "../../../../assets/css/batchmanagement.css";
import { FaPeopleLine } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";
import { BsPersonVideo2 } from "react-icons/bs";
import GraphOne from "./GraphOne";
import GraphThree from "./GraphThree";
import { useState, } from "react";
import AddBatch from "../batches/AddBatch";
import { useNavigate } from "react-router-dom";
import GateKeeper from "../../../../rbac/GateKeeper";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import CountUp from "../../../../utils/CountUp";
import UpcomingBatchesList from "./UpcomingBatchesList";

const BatchManagement = () => {
  const navigate = useNavigate();
  const [showModal1, setShowModal1] = useState(false);
  const handleCloseModal1 = () => {
    setShowModal1(false);
    navigate({ pathname: window.location.pathname });
  };
  const handleCloseForSubmit = () => {
    setShowModal1(false);
    navigate({ pathname: window.location.pathname });
  };
  const [batchID, setBatchID] = useState(null);
  const [batchesCount, setBatchesCount] = useState(null);



  const fetchData = async () => {
    try {

      const { data, status } = await ERPApi.get(`batch/dashboard/metrics`);
      if (status === 200) {
        setBatchesCount(data)
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <div>
      <BackButton heading="Dashboard" content="Back" to="/" />
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-lg-6">
            {/* create batch */}
            <div className="card">
              <div className="row align-items-end">
                <div className="col-lg-8 ">
                  <div className="card-body h-5 pt-5 mt-4">
                    <GateKeeper
                      requiredModule="Batch Management"
                      submenumodule="Batch"
                      submenuReqiredPermission="canCreate"
                    >
                      <button
                        type="button"
                        className="btn btn-sm btn-md btn_primary fs-13"
                        onClick={() => setShowModal1(true)}
                      >
                        <HiMiniPlus className="text_white" /> Create Batch
                      </button>
                    </GateKeeper>
                  </div>
                </div>
                <div className="col-lg-4 text-end">
                  <img
                    src={girl_img}
                    className="img-fluid mx-3"
                    width="100px"
                    height="100px"
                    alt=""
                  />
                </div>
              </div>
            </div>


            {/* 4 boxes */}
            <div className="row">
              <div className="col-lg-6">
                <div className="card card_animate">
                  <div className="card-body my-2">
                    <div className="d-flex align-items-center w-100 justify-content-between">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-start fw-medium text-mute text-truncate mt-1 fs-14">
                          Active Batches
                        </p>
                        <h5 className="text-success fs-14 mb-0">
                          <CountUp
                            finalValue={batchesCount?.activeBatchesCount}
                            duration={500}
                          />

                        </h5>
                        <p className="fs-12 text-mute">
                          Total No. of Active Batches
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="avatar-md-batch me-3">
                          <span className="avatar-title-batch batch_bg rounded-circle fs-1">
                            <BsPersonVideo2 className="fw-300 batch_icon_color" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card card_animate">
                  <div className="card-body my-2">
                    <div className="d-flex align-items-center w-100 justify-content-between">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-start fw-medium text-mute text-truncate mt-1 fs-14">
                          Upcoming Batches
                        </p>
                        <h5 className="text-success fs-14 mb-0">
                          <CountUp
                            finalValue={batchesCount?.upcomingBatchesCount}
                            duration={500}
                          />
                        </h5>
                        <p className="fs-12 text-mute">
                          Total No. of Upcoming Batches
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="avatar-md-batch me-3">
                          <span className="avatar-title-batch batch_bg rounded-circle fs-1">
                            <FaPeopleLine className="fw-300 batch_icon_color" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card card_animate">
                  <div className="card-body my-2">
                    <div className="d-flex align-items-center w-100 justify-content-between">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-start fw-medium text-mute text-truncate mt-1 fs-14">
                          Trainers
                        </p>
                        <h5 className="text-success fs-14 mb-0">
                          <CountUp
                            finalValue={batchesCount?.trainerCount}
                            duration={500}
                          />
                        </h5>
                        <p className="fs-12 text-mute">
                          Total No. of Trainers
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="avatar-md-batch me-3">
                          <span className="avatar-title-batch batch_bg rounded-circle fs-1">
                            <MdOutlinePeopleOutline className="fw-300 batch_icon_color" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card card_animate">
                  <div className="card-body my-2">
                    <div className="d-flex align-items-center w-100 justify-content-between">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-start fw-medium text-mute text-truncate mt-1 fs-14">
                          Students
                        </p>
                        <h5 className="text-success fs-14 mb-0">
                          <CountUp
                            finalValue={batchesCount?.studentCount}
                            duration={500}
                          />
                        </h5>
                        <p className="fs-12 text-mute">
                          Total No. of Active Students
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="avatar-md-batch me-3">
                          <span className="avatar-title-batch batch_bg rounded-circle fs-1">
                            <FaPeopleGroup className="fw-300 batch_icon_color" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h6 className="">Overall Active Batches</h6>
                <GraphOne />
              </div>
            </div>
          </div>
        </div>
        {/* new section */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <GraphThree />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
          <UpcomingBatchesList />
          </div>
        </div>
      
      </div>
      {showModal1 === true && batchID === null && (
        <AddBatch
          show={showModal1}
          handleClose={handleCloseModal1}
          handleCloseForSubmit={handleCloseForSubmit}
        />
      )}
    </div>
  );
};

export default BatchManagement;






