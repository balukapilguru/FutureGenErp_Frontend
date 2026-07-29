import React from 'react';
import BackButton from '../../../../components/backbutton/BackButton';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { useLoaderData, Link, useParams } from 'react-router-dom';
import { HiPencilSquare } from 'react-icons/hi2';

export const batchExamStudentLoader = async ({ params }) => {
    try {
        const response = await ERPApi.get(`/exam/allStudentsAnswers/${params.batchId}/?examId=${params.id} `);
        const batchStudentExamData = response.data;
        return batchStudentExamData;
    } catch (error) {
        console.error("Error fetching batch student exam data:", error);
        return []; // Return an empty array to avoid errors in the component
    }
};

const BatchSudentExam = () => {
    const batchStudentExamData = useLoaderData();
    const { courseId, batchId, id: examId } = useParams();
    const dateTimeFormatter = (isoDateString) => {
        const date = new Date(isoDateString);
        const options = {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-IN', options).format(date);
    };
    return (
        <div>
            <div>
                <BackButton heading="Batch Exams Students" content="Back" to={`/${courseId}/${batchId}/examview/${examId}`} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card border-0">
                                <div className="card-header">
                                    <div className="row justify-content-between">
                                        <div className="col-sm-4">
                                            {/* <div className="search-box">
                                                <input
                                                    type="text"
                                                    className="form-control search input_bg_color select"
                                                    placeholder="Search for..."
                                                    name="search"
                                                    required
                                                />
                                            </div> */}
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="buttons_alignment">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive table-card table-container table-scroll border-0">
                                        <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                            <thead>
                                                <tr className="">
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        S.No
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        Email
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        Start Time
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        End Time
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        Total Time
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        Score
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        Percentage
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        Attempt
                                                    </th>
                                                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {batchStudentExamData && batchStudentExamData.map((studentData, index) => (
                                                    <tr key={studentData.id}>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>{index + 1}</td>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>{studentData.detailregisteredstudents?.name}</td>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light text-truncate' style={{ maxWidth: "120px" }}>{studentData.detailregisteredstudents?.email}</td>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>{dateTimeFormatter(studentData.startTime)}</td>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>{dateTimeFormatter(studentData.endTime)}</td>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>{studentData.totalTime}</td>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>{studentData.score}</td>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>{studentData.percentage}%</td>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>{studentData.attempt}</td>
                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>
                                                            {studentData?.status === 'completed and Evaluated' ? (
                                                                <HiPencilSquare
                                                                    className="eye_icon table_icons me-3 opacity-50 cursor-not-allowed" // Added opacity and cursor style
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-placement="top"
                                                                    title="answersheet (Evaluated)" // Updated title
                                                                    style={{cursor:studentData?.status === 'completed and Evaluated' ? "not-allowed" : "pointer"}}
                                                                />
                                                            ) : (
                                                                <Link
                                                                    to={`/batchmanagement/batchStudentExamResult/${batchId}/${studentData.id}?examId=${studentData.examId}`}
                                                                >
                                                                    <HiPencilSquare
                                                                        className="eye_icon table_icons me-3"
                                                                        data-bs-toggle="tooltip"
                                                                        data-bs-placement="top"
                                                                        title="answersheet"
                                                                    />
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {batchStudentExamData && batchStudentExamData.length === 0 && (
                                                    <tr>
                                                        <td colSpan="12" className="text-center">No student exam data </td>
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

export default BatchSudentExam;