import * as ActionTypes from "./utils/StudentActiontypes";

const StudentsReducer = (state, action) => {

    switch (action?.type) {
        case ActionTypes?.UPDATE_EXTRA_DISCOUNT:
            if (action?.payload?.context === "UPDATE_EXTRA_DISCOUNT_STUDENT") {
                let updatedExtraDiscountStudentIndex = action?.payload?.data?.id;
                if (state?.singleStudentData[0]?.id === updatedExtraDiscountStudentIndex) {
                    let updatedExtraDiscount = [...state?.singleStudentData];
                    updatedExtraDiscount[0].installments = action?.payload?.data?.installments;
                    updatedExtraDiscount[0].dueamount = action?.payload?.data?.dueamount;
                    updatedExtraDiscount[0].extra_discount = action?.payload?.data?.Extra_Discount_remarks_history;
                    updatedExtraDiscount[0].totalinstallments = action?.payload?.data?.totalinstallments;
                    return {
                        ...state,
                        singleStudentData: updatedExtraDiscount
                    }
                }
                else {
                    return state.singleStudentData
                }
            }
            break;


        case ActionTypes.UPDATE_DUE_DATE_DUE_AMOUNT:
            if (action?.payload?.context === "UPDATE_DUE_DATE_DUE_AMOUNT_STUDENT") {
                let updateDueDateDueAmountIndex = action?.payload?.data?.id;

                if (state?.singleStudentData[0]?.id === updateDueDateDueAmountIndex) {
                    let updated_duedate_dueamount = [...state?.singleStudentData];
                    updated_duedate_dueamount[0].installments = action?.payload?.data?.installments;
                    updated_duedate_dueamount[0].nextduedate = action?.payload?.data?.nextduedate;

                    return {
                        ...state,
                        singleStudentData: updated_duedate_dueamount
                    }
                }
                else {
                    return state.singleStudentData
                }

            }
            break;


        case ActionTypes?.UPDATE_INSTALLMENTS:
            if (action?.payload?.context === "UPDATE_SINGLE_INSTALLMENT") {
                let UpdatedInstallmentStudentIndex = action?.payload?.data?.id;
                if (state?.singleStudentData[0]?.id === UpdatedInstallmentStudentIndex) {
                    let updatedInstallment = [...state?.singleStudentData]
                    updatedInstallment[0].installments = action?.payload?.data?.installments;
                    updatedInstallment[0].totalinstallments = action?.payload?.data?.totalinstallments;
                    updatedInstallment[0].dueamount = action?.payload.data?.dueamount;
                    updatedInstallment[0].totalpaidamount = action?.payload.data?.totalpaidamount;
                    updatedInstallment[0].nextduedate = action?.payload.data?.nextduedate;
                    return {
                        ...state,
                        singleStudentData: updatedInstallment
                    }
                }
            }

            break;



        case ActionTypes?.UPDATE_ADMISSIONFEE:
            if (action?.payload?.context === "ADMISSION_FEE_UPDATED_STUDENTS") {
                let updatedAdmissionFeeStudentIndex = action?.payload?.data?.id

                if (state?.singleStudentData[0]?.id === updatedAdmissionFeeStudentIndex) {
                    let updatedAdmissionFee = [...state?.singleStudentData];
                    updatedAdmissionFee[0].dueamount = action?.payload?.data?.dueamount;
                    updatedAdmissionFee[0].initialpayment = action?.payload?.data?.initialpayment;
                    updatedAdmissionFee[0].totalpaidamount = action?.payload?.data?.totalpaidamount;
                    return {
                        ...state,
                        singleStudentData: updatedAdmissionFee
                    }
                }
                else {
                    return state?.singleStudentData
                }
            }
            break;


        case ActionTypes.UPDATE_NO_OF_INSTALLMENTS:

            if (action?.payload?.context === "NO_OF_INSTALLMENST_UPDATED_STUDENTS") {
                let updatedAdmissionFeeStudentIndex = action?.payload?.data?.id

                if (state?.singleStudentData[0]?.id === updatedAdmissionFeeStudentIndex) {

                    let updatednoOfInstallments = [...state?.singleStudentData];
                    updatednoOfInstallments[0].totalinstallments = action?.payload?.data?.totalinstallments;
                    updatednoOfInstallments[0].addfee = action?.payload?.data?.addfee;
                    updatednoOfInstallments[0].installments = action?.payload?.data?.installments;
                    return {
                        ...state,
                        singleStudentData: updatednoOfInstallments
                    }
                }
                else {
                    return state?.singleStudentData
                }

            }
            break;

        case ActionTypes.GET_STUDENT_BY_ID:
            if (action?.payload.context === "GET_SINGLE_STUDENT") {
                return {
                    ...state,
                    singleStudentData: action?.payload.data?.student,
                }
            }
            break;

        case ActionTypes.SET_ALL_STUDENTS_DATA:
            if (action?.payload.context === "ALL_STUDENTS") {
                return {
                    ...state,
                    TotalStudents: action?.payload.data
                }
            }
            break;

        // Upadate of Certificate Status Table Without Refreshing the Page
        case ActionTypes.UPDATE_CERTIFICATE_STATUS:
            if (action?.payload?.context === "CERTIFICATE_STUDENTS") {



                let updatedStudentIndex = state.CertificateStudents.PaginatedCertificateStudents.findIndex((student) => student.id === action?.payload?.data?.studentid);

                if (updatedStudentIndex === -1) {
                    return {
                        ...state,
                        CertificateStudents: {
                            ...state.CertificateStudents,
                        }
                    }
                }
                let updatedCertificate = [...state.CertificateStudents.PaginatedCertificateStudents];
                updatedCertificate[updatedStudentIndex].certificate_status = action?.payload?.data?.certificate_status
                updatedCertificate[updatedStudentIndex].courses = action?.payload?.data?.courses

                // courses
                return {
                    ...state,
                    CertificateStudents: {
                        ...state.CertificateStudents,
                        PaginatedCertificateStudents: updatedCertificate
                    }
                }
            }



                else if (action?.payload?.context === "REQUESTED_CERTIFICATE_STUDENTS") {
                let id = action?.payload?.data?.studentid
                id = parseInt(id)
                return {
                    ...state,
                    Requested_CertificateStudents: {
                        ...state.Requested_CertificateStudents,
                        Paginated_Requested_CertificateStudents: (state.Requested_CertificateStudents.Paginated_Requested_CertificateStudents || []).filter((student) => student.id !== id)
                    }
                }
            }
            break;

        // Create student
        case ActionTypes.CREATE_STUDENT:
            return {
                ...state,
                TotalStudents: [...state.TotalStudents, action?.payload.data]
            }

            break;

        case ActionTypes.SET_LOADING:

            if (action?.payload.context === "ENROLLED_STUDENTS") {
                return {
                    ...state,
                    EnrolledStudents: {
                        ...state.EnrolledStudents,
                        loading: !state.EnrolledStudents.loading
                    }
                }
            }

            else if (action?.payload.context === "CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    CertificateStudents: {
                        ...state?.CertificateStudents,
                        loading: !state.CertificateStudents.loading
                    }
                }
            }

            else if (action?.payload.context === "REQUESTED_CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    Requested_CertificateStudents: {
                        ...state.Requested_CertificateStudents,
                        loading: !state.Requested_CertificateStudents.loading
                    }
                }
            }

            else if (action?.payload?.context === "ISSUED_CERTIFICATES_STUDENTS") {
                return {
                    ...state,
                    Issued_CerificateStudents: {
                        ...state.Issued_CerificateStudents,
                        loading: !state.Issued_CerificateStudents.loading
                    }
                }
            }


            else if (action?.payload.context === "FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    FeeDetailsStudents: {
                        ...state.FeeDetailsStudents,
                        loading: !state.FeeDetailsStudents.loading
                    }
                }
            }

            else if (action?.payload?.context === "NO_DUE_FEE_RECORDS_STUDENTS") {
                return {
                    ...state,
                    NoDueFeeRecords_Students: {
                        ...state.NoDueFeeRecords_Students,
                        loading: !state.NoDueFeeRecords_Students.loading
                    }
                }
            }

            else if (action?.payload.context === "DASHBOARD_STUDENTS") {
                return {
                    ...state,
                    DashboardStudents: {
                        ...state.DashboardStudents,
                        loading: !state.DashboardStudents.loading
                    }
                }
            }

            else if (action?.payload?.context === "TODAY_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    TodayFeeDetailsStudents: {
                        ...state.TodayFeeDetailsStudents,
                        loading: !state?.TodayFeeDetailsStudents?.loading
                    }
                }
            }

            else if (action?.payload?.context === "OVER_DUE_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    OverDueFeeDetailsStudents: {
                        ...state.OverDueFeeDetailsStudents,
                        loading: !state?.OverDueFeeDetailsStudents?.loading
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    UpComingFeeDetailsStudents: {
                        ...state.UpComingFeeDetailsStudents,
                        loading: !state?.UpComingFeeDetailsStudents?.loading
                    }
                }
            }


            break;

        // here the PAGINATED DATA;

        case ActionTypes.SET_PAGINATED_STUDENTS:

            if (action?.payload.context === "ENROLLED_STUDENTS") {
                const reducerData = action?.payload?.data
                return {
                    ...state,
                    EnrolledStudents: {
                        ...state.EnrolledStudents,
                        PaginatedStudents: reducerData?.students,
                        totalPages: reducerData?.totalPages,
                        searchResultStudents: reducerData?.searchResultStudents,
                        perPage: reducerData?.pageSize,
                        startStudent: reducerData?.startStudent,
                        endStudent: reducerData?.endStudent,
                        totalStudents: reducerData?.totalStudents,
                        currentPage: reducerData?.currentPage,

                    }
                }
            }

            else if (action?.payload?.context === "CERTIFICATE_STUDENTS") {
                const reducerData = action?.payload?.data
                return {
                    ...state,
                    CertificateStudents: {
                        ...state.CertificateStudents,
                        PaginatedCertificateStudents: reducerData?.students,
                        currentPage: reducerData?.currentPage,
                        totalPages: reducerData?.totalPages,
                        perPage: reducerData?.pageSize,
                        startStudent: reducerData?.startStudent,
                        endStudent: reducerData?.endStudent,
                        totalStudents: reducerData?.totalStudents,
                        searchResultStudents: reducerData?.searchResultStudents,
                        
                    }
                }
            }


            else if (action?.payload?.context === "REQUESTED_CERTIFICATE_STUDENTS") {
                const reducerData = action?.payload?.data
                return {
                    ...state,
                    Requested_CertificateStudents: {
                        ...state?.Requested_CertificateStudents,
                        Paginated_Requested_CertificateStudents: reducerData?.students,
                        totalPages: reducerData?.totalPages,
                        searchResultStudents: reducerData?.searchResultStudents,
                        perPage: reducerData?.pageSize,
                        startStudent: reducerData?.startStudent,
                        endStudent: reducerData?.endStudent,
                        totalStudents: reducerData?.totalStudents,
                        currentPage: reducerData?.currentPage
                    }
                }
            }



            else if (action?.payload.context === "ISSUED_CERTIFICATES_STUDENTS") {
                const reducerData = action?.payload?.data
                return {
                    ...state,
                    Issued_CerificateStudents: {
                        ...state.Issued_CerificateStudents,
                        Paginated_Issued_CerificateStudents: reducerData?.students,
                        totalPages: reducerData?.totalPages,
                        searchResultStudents: reducerData?.searchResultStudents,
                        perPage: reducerData?.pageSize,
                        startStudent: reducerData?.startStudent,
                        endStudent: reducerData?.endStudent,
                        totalStudents: reducerData?.totalStudents,
                        currentPage: reducerData?.currentPage
                    }
                }
            }

            else if (action?.payload?.context === "FEE_DETAILS_STUDENTS") {
                const reducerdata = action?.payload?.data

                return {
                    ...state,
                    FeeDetailsStudents: {
                        ...state?.FeeDetailsStudents,
                        PaginatedFeeDetailsStudents: reducerdata?.students,
                        currentPage: reducerdata?.currentPage,
                        totalPages: reducerdata?.totalPages,
                        perPage: reducerdata?.pageSize,
                        startStudent: reducerdata?.startStudent,
                        endStudent: reducerdata?.endStudent,
                        searchResultStudents: reducerdata?.searchResultStudents,
                        totalStudents: reducerdata?.totalStudents,
                      

                    }
                }
            }

            else if (action.payload.context === "DASHBOARD_STUDENTS") {
                const reducerdata = action.payload.data;
                return {
                    ...state,
                    DashboardStudents: {
                        ...state.DashboardStudents,
                        PaginatedDashboardStudents: reducerdata.TotalStudents,
                        currentPage: reducerdata.currentPage,
                        totalPages: reducerdata.totalPages,
                        perPage: reducerdata.perPage,
                        startStudent: reducerdata.startStudent,
                    }
                }

            }

            else if (action?.payload?.context === "NO_DUE_FEE_RECORDS_STUDENTS") {
                const reducerData = action?.payload?.data
                return {
                    ...state,
                    NoDueFeeRecords_Students: {
                        ...state?.NoDueFeeRecords_Students,
                        PaginatedNoDueFeeRecords_Students: reducerData?.students,
                        totalPages: reducerData?.totalPages,
                        searchResultStudents: reducerData?.searchResultStudents,
                        perPage: reducerData?.pageSize,
                        startStudent: reducerData?.startStudent,
                        endStudent: reducerData?.endStudent,
                        totalStudents: reducerData?.totalStudents,
                        currentPage: reducerData?.currentPage
                    }
                }
            }


            else if (action?.payload?.context === "TODAY_FEE_DETAILS_STUDENTS") {
                const reducerData = action?.payload?.data;
                return {
                    ...state,
                    TodayFeeDetailsStudents: {
                        ...state.TodayFeeDetailsStudents,
                        PaginatedTodayFeeDetails: reducerData?.todayDueFeeRecords,
                        totalPages: reducerData?.totalPages,
                        searchResultStudents: reducerData?.searchResultStudents,
                        perPage: reducerData?.pageSize,
                        startStudent: reducerData?.startStudent,
                        endStudent: reducerData?.endStudent,
                        totalStudents: reducerData?.todayDueFeeRecordsCount,
                        currentPage: reducerData?.currentPage,
                        totalDueAmount: reducerData?.totalDueAmount
                    }
                }
            }

            else if (action?.payload?.context === "OVER_DUE_FEE_DETAILS_STUDENTS") {
                const reducerData = action?.payload?.data;
                return {
                    ...state,
                    OverDueFeeDetailsStudents: {
                        ...state?.OverDueFeeDetailsStudents,
                        PaginatedOverDueFeeDetails: reducerData?.overDueFeeRecords,
                        totalPages: reducerData?.totalPages,
                        searchResultStudents: reducerData?.searchResultStudents,
                        perPage: reducerData?.pageSize,
                        startStudent: reducerData?.startStudent,
                        endStudent: reducerData?.endStudent,
                        totalStudents: reducerData?.overDueFeeRecordsCount,
                        currentPage: reducerData?.currentPage,
                        totalDueAmount: reducerData?.totalDueAmount
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_FEE_DETAILS_STUDENTS") {
                const reducerData = action?.payload?.data;
                return {
                    ...state,
                    UpComingFeeDetailsStudents: {
                        ...state?.UpComingFeeDetailsStudents,
                        PaginatedUpComingFeeDetails: reducerData?.upcomingFeeRecords,
                        totalPages: reducerData?.totalPages,
                        searchResultStudents: reducerData?.searchResultStudents,
                        perPage: reducerData?.pageSize,
                        startStudent: reducerData?.startStudent,
                        endStudent: reducerData?.endStudent,
                        totalStudents: reducerData?.upcomingDueFeeRecordsCount,
                        currentPage: reducerData?.currentPage,
                        totalDueAmount: reducerData?.totalDueAmount
                    }
                }
            }
            break;

        //  Here the handle Search 

        case ActionTypes.SET_SEARCH:

            if (action.payload.context === "ENROLLED_STUDENTS") {
                return {
                    ...state,
                    EnrolledStudents: {
                        ...state.EnrolledStudents,
                        search: action.payload.data,
                        currentPage: 1,
                    }
                }
            }
            else if (action?.payload?.context === "CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    CertificateStudents: {
                        ...state?.CertificateStudents,
                        search: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "REQUESTED_CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    Requested_CertificateStudents: {
                        ...state.Requested_CertificateStudents,
                        search: action.payload.data,
                        currentPage: 1,
                    }
                }
            }
            else if (action?.payload?.context === "ISSUED_CERTIFICATES_STUDENTS") {
                return {
                    ...state,
                    Issued_CerificateStudents: {
                        ...state.Issued_CerificateStudents,
                        search: action.payload.data,
                        currentPage: 1,
                    }

                }
            }

            else if (action.payload.context === "FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    FeeDetailsStudents: {
                        ...state?.FeeDetailsStudents,
                        search: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "NO_DUE_FEE_RECORDS_STUDENTS") {
                return {
                    ...state,
                    NoDueFeeRecords_Students: {
                        ...state.NoDueFeeRecords_Students,
                        search: action.payload.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action.payload.context === "TODAY_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    TodayFeeDetailsStudents: {
                        ...state?.TodayFeeDetailsStudents,
                        search: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "OVER_DUE_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    OverDueFeeDetailsStudents: {
                        ...state?.OverDueFeeDetailsStudents,
                        search: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    UpComingFeeDetailsStudents: {
                        ...state?.UpComingFeeDetailsStudents,
                        search: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }
            break;

        // here the Handle PerPage

        case ActionTypes?.SET_PER_PAGE:
            if (action?.payload?.context === "ENROLLED_STUDENTS") {
                return {
                    ...state,
                    EnrolledStudents: {
                        ...state.EnrolledStudents,
                        perPage: action.payload.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    CertificateStudents: {
                        ...state?.CertificateStudents,
                        perPage: action?.payload?.data,
                        currentPage: 1,
                    }
                }

            }

            else if (action?.payload?.context === "REQUESTED_CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    Requested_CertificateStudents: {
                        ...state?.Requested_CertificateStudents,
                        perPage: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }



            else if (action.payload.context === "ISSUED_CERTIFICATES_STUDENTS") {
                return {
                    ...state,
                    Issued_CerificateStudents: {
                        ...state.Issued_CerificateStudents,
                        perPage: action.payload.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload.context === "FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    FeeDetailsStudents: {
                        ...state.FeeDetailsStudents,
                        perPage: action.payload.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "NO_DUE_FEE_RECORDS_STUDENTS") {
                return {
                    ...state,
                    NoDueFeeRecords_Students: {
                        ...state.NoDueFeeRecords_Students,
                        perPage: action.payload.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action.payload.context === "TODAY_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    TodayFeeDetailsStudents: {
                        ...state?.TodayFeeDetailsStudents,
                        perPage: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "OVER_DUE_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    OverDueFeeDetailsStudents: {
                        ...state?.OverDueFeeDetailsStudents,
                        perPage: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    UpComingFeeDetailsStudents: {
                        ...state?.UpComingFeeDetailsStudents,
                        perPage: action?.payload?.data,
                        currentPage: 1,
                    }
                }
            }

            break


        case ActionTypes.SET_CUSTOM_PAGE:
            if (action.payload?.context === "ENROLLED_STUDENTS") {
                return {
                    ...state,
                    EnrolledStudents: {
                        ...state.EnrolledStudents,
                        currentPage: action.payload.data,
                    }
                }
            }

            else if (action?.payload?.context === "CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    CertificateStudents: {
                        ...state?.CertificateStudents,
                        currentPage: action?.payload?.data
                    }
                }
            }

            else if (action?.payload.context === "REQUESTED_CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    Requested_CertificateStudents: {
                        ...state?.Requested_CertificateStudents,
                        currentPage: action.payload.data
                    }
                }
            }

            else if (action?.payload.context === "FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    FeeDetailsStudents: {
                        ...state.FeeDetailsStudents,
                        currentPage: action.payload.data
                    }
                }
            }

            else if (action?.payload?.context === "ISSUED_CERTIFICATES_STUDENTS") {
                return {
                    ...state,
                    Issued_CerificateStudents: {
                        ...state?.Issued_CerificateStudents,
                        currentPage: action?.payload?.data,
                    }
                }
            }

            else if (action?.payload?.context === "NO_DUE_FEE_RECORDS_STUDENTS") {
                return {
                    ...state,
                    NoDueFeeRecords_Students: {
                        ...state.NoDueFeeRecords_Students,
                        currentPage: action.payload.data,
                    }
                }
            }

            else if (action.payload?.context === "TODAY_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    TodayFeeDetailsStudents: {
                        ...state?.TodayFeeDetailsStudents,
                        currentPage: action?.payload?.data,
                    }
                }
            }

            else if (action.payload?.context === "OVER_DUE_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    OverDueFeeDetailsStudents: {
                        ...state?.OverDueFeeDetailsStudents,
                        currentPage: action?.payload?.data,
                    }
                }
            }

            else if (action.payload?.context === "UPCOMING_FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    UpComingFeeDetailsStudents: {
                        ...state?.UpComingFeeDetailsStudents,
                        currentPage: action?.payload?.data,
                    }
                }
            }
            // default to the old state in order not to lose any information
            break;
        case ActionTypes.SET_FILTERS:
            if (action?.payload?.context === "ENROLLED_STUDENTS") {
                const filterdata = action?.payload?.data;


                return {
                    ...state,
                    EnrolledStudents: {
                        ...state?.EnrolledStudents,
                        filters: {
                            ...state?.EnrolledStudents?.filters,
                            enquiry: filterdata?.enquiry,
                            fromDate: filterdata?.fromDate,
                            toDate: filterdata?.toDate,
                            branch: filterdata?.branch,
                            modeOfTraining: filterdata?.modeOfTraining,
                            lead: filterdata?.lead,
                            course: filterdata?.course,
                            coursepackage: filterdata?.coursepackage
                        },
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            else if (action?.payload?.context === "CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    CertificateStudents: {
                        ...state?.CertificateStudents,
                        filters: action?.payload?.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            else if (action?.payload?.context === "REQUESTED_CERTIFICATE_STUDENTS") {
                return {
                    ...state,
                    Requested_CertificateStudents: {
                        ...state.Requested_CertificateStudents,
                        filters: action.payload.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            else if (action?.payload?.context === "ISSUED_CERTIFICATES_STUDENTS") {
                return {
                    ...state,
                    Issued_CerificateStudents: {
                        ...state?.Issued_CerificateStudents,
                        filters: action?.payload?.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }


            else if (action?.payload?.context === "FEE_DETAILS_STUDENTS") {
                return {
                    ...state,
                    FeeDetailsStudents: {
                        ...state.FeeDetailsStudents,
                        filters: action?.payload?.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            else if (action?.payload?.context === "NO_DUE_FEE_RECORDS_STUDENTS") {

                return {
                    ...state,
                    NoDueFeeRecords_Students: {
                        ...state?.NoDueFeeRecords_Students,
                        filters: action?.payload?.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            else if (action?.payload?.context === "TODAY_FEE_DETAILS_STUDENTS") {


                return {
                    ...state,
                    TodayFeeDetailsStudents: {
                        ...state?.TodayFeeDetailsStudents,
                        filters: action?.payload?.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }


            else if (action?.payload?.context === "OVER_DUE_FEE_DETAILS_STUDENTS") {

                return {
                    ...state,
                    OverDueFeeDetailsStudents: {
                        ...state?.OverDueFeeDetailsStudents,
                        filters: action?.payload?.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            else if (action?.payload?.context === "UPCOMING_FEE_DETAILS_STUDENTS") {

                return {
                    ...state,
                    UpComingFeeDetailsStudents: {
                        ...state?.UpComingFeeDetailsStudents,
                        filters: action?.payload?.data,
                        currentPage: 1,
                        perPage: 10,
                    }
                }
            }

            break


        default:
            return state;
    }

}




export default StudentsReducer;