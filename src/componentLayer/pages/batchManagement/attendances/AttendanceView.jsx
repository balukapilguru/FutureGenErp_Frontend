import React, { useState } from 'react';
import BackButton from "../../../components/backbutton/BackButton";
import { MdFileDownload } from "react-icons/md";


const AttendanceView = () => {
    const [activeButton, setActiveButton] = useState('toggle-button2');

    const handleToggleClick = (buttonId) => {
        setActiveButton(buttonId);
    };

    return (
        <div>
            <BackButton heading="Data Of Students" content="Back" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card border-0">
                            <div className="card-header">
                                <div className="row d-flex justify-content-between">
                                    <div className='col-lg-8'>
                                        <table className="fs-13">
                                            <tbody>
                                                <tr className="lh-400">
                                                    <td className="ps-0 black_300 fw-500">
                                                        <h6> Student Name</h6>
                                                    </td>

                                                </tr>
                                                <tr className="lh-400">
                                                    <td className="ps-0 black_300 fw-500">
                                                        <h6> Enrollement Id</h6>
                                                    </td>

                                                </tr>
                                                <tr className="lh-400">
                                                    <td className="ps-0 black_300 fw-500">
                                                        <h6> Admission Date</h6>
                                                    </td>

                                                </tr>
                                                <tr className="lh-400">
                                                    <td className="ps-0 black_300 fw-500">
                                                        <h6> Trainer Name</h6>
                                                    </td>

                                                </tr>
                                                <tr className="lh-400">
                                                    <td className="ps-0 black_300 fw-500">
                                                        <h6> batch time</h6>
                                                    </td>

                                                </tr>
                                                <tr className="lh-400">
                                                    <td className="ps-0 black_300 fw-500">
                                                        <h6> Course </h6>
                                                    </td>

                                                </tr>



                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-4 text-end">
                                        <div className="fs-13 me-3">
                                            <button type="button" className="btn btn-sm btn_primary margin_top_12 me-1 button-res" data-bs-toggle="modal" data-bs-target="#myModal">
                                                <MdFileDownload className="me-1" />Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive table-card table-container table-scroll border-0">
                                    <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="fs-13 lh-xs fw-600">S.No</th>
                                                <th scope="col" className="fs-13 lh-xs fw-600">Date</th>
                                                <th scope="col" className="fs-13 lh-xs fw-600">Topic Name</th>
                                                <th scope="col" className="fs-13 lh-xs fw-600">Attendance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="fs-13 black_300 fw-500 lh-xs bg_light">01</td>
                                                <td className="fs-13 black_300 fw-500 lh-xs bg_light">1-June-2024</td>
                                                <td className="fs-13 black_300 lh-xs bg_light">OverLoading</td>
                                                <td className="fs-13 black_300 lh-xs bg_light">
                                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                        <div className="tri-state-toggle">
                                                            <button
                                                                className={`tri-state-toggle-button ${activeButton === "toggle-button1"
                                                                    ? "active red"
                                                                    : ""
                                                                    }`}
                                                                id="toggle-button1"
                                                                onClick={() => handleToggleClick("toggle-button1")}
                                                            >
                                                                A
                                                            </button>
                                                            <button
                                                                className={`tri-state-toggle-button ${activeButton === "toggle-button2"
                                                                    ? "active green"
                                                                    : ""
                                                                    }`}
                                                                id="toggle-button2"
                                                                onClick={() => handleToggleClick("toggle-button2")}
                                                            >p</button>
                                                            {/* <button
                                className={`tri-state-toggle-button ${activeButton === "toggle-button3"
                                  ? "active green"
                                  : ""
                                  }`}
                                id="toggle-button3"
                                onClick={() => handleToggleClick("toggle-button3")}
                              >
                                P
                              </button> */}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceView;
