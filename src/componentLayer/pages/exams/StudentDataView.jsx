import React, { useCallback, useEffect, useRef, useState } from 'react'
import PaginationInfo from '../../../utils/PaginationInfo'
import Pagination from '../../../utils/Pagination'
import BackButton from '../../components/backbutton/BackButton'
import { ERPApi } from '../../../serviceLayer/interceptor'
import { Link, useFetcher, useLoaderData, useNavigation, useParams } from 'react-router-dom'
import { debounce } from '../../../utils/Utils'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { AiFillEye } from 'react-icons/ai'
import { HiPencilSquare } from 'react-icons/hi2'
export const studentExamDataLoader = async ({ request, params }) => {
    const { id } = params
    const searchParams = new URL(request.url).searchParams
    const page = searchParams.get('page') || 1
    const pageSize = searchParams.get('pageSize') || 10
    const search = searchParams.get('search') || ''
    const filterAttempted = searchParams.get('filter[isAttemptedExam]') || '' 
    try {
        const query = new URLSearchParams({
            page,
            pageSize,
            search,
        })
        if (filterAttempted) {
            query.set('filter[isAttemptedExam]', filterAttempted)
        }
        const response = await ERPApi.get(
            `/registrationform/getformwiseStudents/${id}?${query.toString()}`
        )
        return response.data
    } catch (error) {
        return null
    }
}

const StudentDataView = () => {
    const initialData = useLoaderData()
    const fetcher = useFetcher()
    const navigation = useNavigation()
    const { id } = useParams()
    const studentExamData = fetcher.data || initialData
    const students = studentExamData?.studentaactions || []

    const [Qparams, setQParams] = useState({
        search: '',
        page: 1,
        pageSize: 10,
        filterAttempted: '',
    })

    const handleSearch = (event) => {
        setQParams((prev) => ({
            ...prev,
            search: event.target.value,
            page: 1,
        }))
    }

    const handlePage = (page) => {
        setQParams((prev) => ({
            ...prev,
            page,
        }))
    }

    const handlePerPageChange = (event) => {
        const selectedValue = parseInt(event.target.value, 10)
        setQParams((prev) => ({
            ...prev,
            page: 1,
            pageSize: selectedValue,
        }))
    }

    const toggleFilter = () => {
        setQParams((prev) => ({
            ...prev,
            page: 1,
            filterAttempted: prev.filterAttempted === '1' ? '' : '1',
        }))
    }

    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        debouncedParams(Qparams)
    }, [Qparams])

    const debouncedParams = useCallback(
        debounce((param) => {
            const searchParams = new URLSearchParams({
                page: param.page,
                pageSize: param.pageSize,
                search: param.search,
            })

            if (param.filterAttempted) {
                searchParams.set('filter[isAttemptedExam]', param.filterAttempted)
            }

            fetcher.submit(`?${searchParams.toString()}`, { method: 'get', action: '.' })
        }, 500),
        []
    )

    const showAttemptsColumn = Qparams.filterAttempted === '1';

    const [isAssigning, setIsAssigning] = useState(false)

    const AssignRank = async () => {
        try {
            setIsAssigning(true)


            const response = await ERPApi.get(`/exam/assignRanks/${id}`)

            if (response?.status === 200) {
                toast.success('Ranks assigned successfully!')
                fetcher.submit(null, { method: 'get', action: '.' })
            } else {
                toast.error(response?.data?.message || 'Something went wrong while assigning ranks.')
            }
        } catch (error) {
            console.error('Assign Rank Error:', error)
            toast.error('Failed to assign ranks.')
        } finally {
            setIsAssigning(false)
        }
    }
    const handleExport = () => {
        if (students.length === 0) return;
        const firstStudent = students[0];
        const headers = [
            'S.No',
            ...Object.entries(firstStudent)
                .filter(([key]) => {
                    const excludeKeys = [
                        'id',
                        'formId',
                        'createdAt',
                        'updatedAt',
                        'studentdetailId',
                        'examId',
                        'registeredstudentsdetail',
                    ];
                    return !excludeKeys.includes(key) &&
                        students.some(stu => stu[key] !== null && stu[key] !== '' && stu[key] !== 0);
                })
                .map(([key]) =>
                    key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, char => char.toUpperCase())
                ),
            ...(showAttemptsColumn
                ? ['Questions Attempted', 'Score', 'Rank', 'Percentage']
                : []),
        ];
        const dataRows = students.map((student, index) => {
            const row = [
                (Qparams.page - 1) * Qparams.pageSize + index + 1, // S.No
            ];

            Object.entries(student).forEach(([key, value]) => {
                const excludeKeys = [
                    'id',
                    'formId',
                    'createdAt',
                    'updatedAt',
                    'studentdetailId',
                    'examId',
                    'registeredstudentsdetail',
                ];
                if (excludeKeys.includes(key)) return;

                const shouldDisplay = students.some(stu => stu[key] !== null && stu[key] !== '' && stu[key] !== 0);
                if (!shouldDisplay) return;

                let displayValue = value;
                if (key === 'isTeksStudent' || key === 'isAttemptedExam') {
                    displayValue = value === 1 ? 'Yes' : 'No';
                }
                row.push(displayValue ?? '-');
            });
            if (showAttemptsColumn) {
                const detail = student?.registeredstudentsdetail?.[0];
                row.push(detail?.questionsAttempted || 0);
                row.push(detail?.score ?? '-');
                row.push(detail?.rank ?? '-');
                row.push(detail?.percentage ?? '-');
            }

            return row;
        });
        const worksheetData = [headers, ...dataRows];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Data');
        XLSX.writeFile(workbook, 'visible_student_data.xlsx');
    };

    return (
        <div>
            <BackButton heading="Student Data" content="Back" />
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
                                                value={Qparams.search}
                                                onChange={handleSearch}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-sm-end text-center">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn_primary fs-13"
                                            onClick={toggleFilter}
                                        >
                                            {Qparams.filterAttempted === '1' ? 'Registerd Students' : 'Attempted'}
                                        </button>
                                        {showAttemptsColumn &&
                                            <button
                                                type="button"
                                                className="btn btn-sm btn_primary fs-13 ms-3 my-2"
                                                onClick={AssignRank}
                                                disabled={isAssigning}
                                            >
                                                {isAssigning ? 'Assigning...' : 'Assign Rank'}
                                            </button>

                                        }
                                        <button
                                            type="button"
                                            className="btn btn-sm btn_primary fs-13 ms-3 my-2"
                                            onClick={handleExport}
                                            disabled={students.length === 0}
                                        >
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive table-card border-0">
                                    <div className="table-container table-scroll">
                                        <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                            <thead>
                                                <tr>
                                                    <th className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: '50px' }}>S.No</th>
                                                    {students.length > 0 &&
                                                        Object.entries(students[0]).map(([key]) => {
                                                            const excludeKeys = [
                                                                'id',
                                                                'formId',
                                                                'createdAt',
                                                                'updatedAt',
                                                                'studentdetailId',
                                                                'examId',
                                                                'registeredstudentsdetail',
                                                            ]

                                                            if (excludeKeys.includes(key)) return null

                                                            const shouldDisplay = students.some(student => {
                                                                const val = student[key]
                                                                return val !== null && val !== '' && val !== 0
                                                            })

                                                            if (!shouldDisplay) return null

                                                            const label = key
                                                                .replace(/([A-Z])/g, ' $1')
                                                                .replace(/^./, char => char.toUpperCase())

                                                            return (
                                                                <th
                                                                    key={key}
                                                                    className="fs-13 lh-xs fw-600 text-truncate"
                                                                    style={{ maxWidth: '80px' }}
                                                                    title={label}
                                                                >
                                                                    {label}
                                                                </th>
                                                            )
                                                        })}
                                                    {showAttemptsColumn && (
                                                        <>
                                                            <th className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: '80px' }} title="Questions Attempted">Questions Attempted</th>
                                                            <th className="fs-13 lh-xs fw-600">Score</th>
                                                            <th className="fs-13 lh-xs fw-600">Rank</th>
                                                            <th className="fs-13 lh-xs fw-600">Percentage</th>
                                                            <th className="fs-13 lh-xs fw-600">Start Time</th>
                                                            <th className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "60px" }} title="Completion Time">Completion Time</th>
                                                            <th className="fs-13 lh-xs fw-600">Action</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {students.length > 0 ? (
                                                    students.map((student, index) => (
                                                        <tr key={student.id || index}>
                                                            <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                                                                {(Qparams.page - 1) * Qparams.pageSize + index + 1}
                                                            </td>

                                                            {Object.entries(student)
                                                                .filter(([key, value]) => {
                                                                    const ignoreKeys = [
                                                                        'id',
                                                                        'formId',
                                                                        'registeredstudentsdetail',
                                                                        'createdAt',
                                                                        'updatedAt',
                                                                        'studentdetailId',
                                                                        'examId',
                                                                    ]
                                                                    if (ignoreKeys.includes(key)) return false
                                                                    return students.some(stu => {
                                                                        const v = stu[key]
                                                                        return v !== null && v !== undefined && v !== '' && v !== 0
                                                                    })
                                                                })
                                                                .map(([key, value]) => {
                                                                    let displayValue = value

                                                                    if (key === 'isTeksStudent' || key === 'isAttemptedExam') {
                                                                        displayValue = value === 1 ? 'Yes' : 'No'
                                                                    }

                                                                    return (
                                                                        <td
                                                                            key={key}
                                                                            className="fs-13 black_300 lh-xs bg_light text-truncate"
                                                                            style={{ maxWidth: '120px' }}
                                                                            title={String(displayValue)}
                                                                        >
                                                                            {String(displayValue)}
                                                                        </td>
                                                                    )
                                                                })}

                                                            {showAttemptsColumn && (() => {
                                                                const detail = student?.registeredstudentsdetail?.[0];
                                                                return (
                                                                    <>
                                                                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                                                                            {detail?.questionsAttempted || 0}
                                                                        </td>
                                                                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                                                                            {detail?.score ?? '-'}
                                                                        </td>
                                                                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                                                                            {detail?.rank ?? '-'}
                                                                        </td>
                                                                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                                                                            {detail?.percentage ?? '-'}
                                                                        </td>
                                                                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                                                                            {detail?.startTime ? new Date(detail.startTime).toLocaleString('en-GB', {
                                                                                day: '2-digit',
                                                                                month: 'short',
                                                                                year: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                                hour12: true
                                                                            }) : '-'}
                                                                        </td>
                                                                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                                                                            {detail?.totalTime?.startsWith('00:') ? detail.totalTime.slice(3) : detail?.totalTime ?? '-'}
                                                                        </td>
                                                                        <td className='fs-13 black_300 fw-500 lh-xs bg_light'>
                                                                            {detail?.status === 'completed and Evaluated' ? (
                                                                                <HiPencilSquare
                                                                                    className="eye_icon table_icons me-3 opacity-50 cursor-not-allowed" 
                                                                                    data-bs-toggle="tooltip"
                                                                                    data-bs-placement="top"
                                                                                    title="answersheet (Evaluated)" 
                                                                                />
                                                                            ) : (
                                                                                <Link to={`/exam/studentanswersheet/${detail?.id}?examId=${detail?.examId}`}>
                                                                                    <HiPencilSquare
                                                                                        className="eye_icon table_icons me-3"
                                                                                        data-bs-toggle="tooltip"
                                                                                        data-bs-placement="top"
                                                                                        title="answersheet"
                                                                                    />
                                                                                </Link>
                                                                            )}
                                                                        </td>
                                                                    </>
                                                                )
                                                            })()}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="20" className="text-center">No students found.</td>
                                                    </tr>
                                                )}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                                <div className="mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                                    <div className="col-sm">
                                        <PaginationInfo
                                            data={{
                                                length: students.length,
                                                start: studentExamData?.startRecord,
                                                end: studentExamData?.endRecord,
                                                total: studentExamData?.searchResultCount,
                                            }}
                                        />
                                    </div>
                                    <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                                        <div className="mt-2">
                                            <select
                                                className="form-select form-control me-3 input_bg_color pagination-select"
                                                onChange={handlePerPageChange}
                                                value={Qparams.pageSize}
                                            >
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="75">75</option>
                                                <option value="100">100</option>
                                            </select>
                                        </div>
                                        <Pagination
                                            currentPage={studentExamData?.page}
                                            totalPages={studentExamData?.totalPages}
                                            loading={navigation.state === 'loading'}
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
    )
}

export default StudentDataView
