import * as ActionTypes from "./utils/DashboardActionTypes"

const DashboardReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTER_DATE:
      if (action?.payload?.context === "TOTAL_ENROLLMENTS_DETAILS") {

        return {
          ...state,
          TotalEnrollementDetails: {
            ...state.TotalEnrollementDetails,
            filterDate: action?.payload?.data,
          },
        };
      } else if (action?.payload?.context === "TOTAL_FEE_DETAILS") {
        return {
          ...state,
          TotalFeeDetails: {
            ...state.TotalFeeDetails,
            filterDate: {
              ...state.TotalFeeDetails.filterDate,
              admissionFromDate: action?.payload?.data?.admissionFromDate,
              admissionToDate: action?.payload?.data?.admissionToDate,
              fromDate: action?.payload?.data?.fromDate,
              toDate: action?.payload?.data?.toDate,
            },
          },
        };
      }
      break;

    case ActionTypes.SET_BRANCH_DETAILS:
      if (
        action?.payload?.context ===
        "TOTAL_ENROLLMENTS_DETAILS_BRANCH_WISE_COUNCELLERS"
      ) {

        return {
          ...state,
          BranchwiseCouncellers: {
            ...state.BranchwiseCouncellers,
            sendBranchDetails: action?.payload?.data,
          },
        };
      } else if (action?.payload?.context === "ALL_USERS_LIST_IN_BRANCH_WISE") {

        return {
          ...state,
          UsersListInBranchWise: {
            ...state.UsersListInBranchWise,
            branchDetails: action?.payload?.data,
          },
        };
      } else if (
        action?.payload?.context === "FEE_DETAILS_BRANCH_WISE_COUNCELLORS"
      ) {
        return {
          ...state,
          FeeDetailsBranchwiseCouncellers: {
            ...state.FeeDetailsBranchwiseCouncellers,
            sendBranchDetails: action?.payload?.data,
          },
        };
      } else if (action?.payload?.context === "TOTAL_ENROLLMENTS_GRAPH") {

        return {
          ...state,

          TotalEnrollmentGraph: {
            ...state.TotalEnrollmentGraph,
            branch: action?.payload?.data,
          },
        };
      } else if (action?.payload?.context === "TOTAL_FEEDETAILS_GRAPH") {
        return {
          ...state,
          TotalFeeDetailsGraph: {
            ...state?.TotalFeeDetailsGraph,
            branch: action?.payload?.data,
          },
        };
      }
      else if (action?.payload?.context === "SET_BRANCH_ID_IN_TODAY_FEE_RECEVIED") {
        return {
          ...state,
          TodayFeeReceviedByCouncellors: {
            ...state?.TodayFeeReceviedByCouncellors,
            filters: {
              ...state?.TodayFeeReceviedByCouncellors?.filters,
              branch: action?.payload?.data?.branch
            },
          },
        };
      }
      break;



    case ActionTypes.SET_COUNCELLOR_DETAILS:
      if (
        action?.payload?.context ===
        "TOTAL_ENROLLMENTS_DETAILS_COUNCELLOR_WISE_STUDENTS"
      ) {
        return {
          ...state,
          CouncellerwiseStudents: {
            ...state.CouncellerwiseStudents,
            sendCouncellerDetails: action?.payload?.data,
          },
        };
      } else if (
        action?.payload?.context === "FEE_DETAILS_COUNCELLORS_WISE_STUDENTS"
      ) {
        return {
          ...state,
          FeeDetailsCouncellerwiseStudents: {
            ...state.FeeDetailsCouncellerwiseStudents,
            sendCouncellerDetails: action?.payload?.data,
          },
        };
      }
      else if (action?.payload?.context === "SET_COUNCELLOR_ID_IN_TODAY_FEE_RECEVIED") {

        return {
          ...state,
          TodayFeeReceviedByStudents: {
            ...state?.TodayFeeReceviedByStudents,
            filters: {
              ...state?.TodayFeeReceviedByStudents?.filters,
              enquirytakenby: action?.payload?.data?.enquirytakenby
            },
          },
        };
      }

      break;

    case ActionTypes.SET_LOADING:
      if (action?.payload?.context === "TOTAL_ENROLLMENT_DETAILS") {
        return {
          ...state,
          TotalEnrollementDetails: {
            ...state.TotalEnrollementDetails,
            loading: !state?.TotalEnrollementDetails?.loading,
          },
        };
      } else if (action?.payload?.context === "TOTAL_FEE_DETAILS") {
        return {
          ...state,
          TotalFeeDetails: {
            ...state.TotalFeeDetails,
            loading: !state?.TotalFeeDetails?.loading,
          },
        };
      } else if (
        action?.payload?.context ===
        "TOTAL_ENROLLMENTS_DETAILS_BRANCH_WISE_COUNCELLERS"
      )
        return {
          ...state,
          BranchwiseCouncellers: {
            ...state.BranchwiseCouncellers,
            loading: !state?.BranchwiseCouncellers?.loading,
          },
        };
      else if (
        action?.payload?.context ===
        "TOTAL_ENROLLMENTS_DETAILS_COUNCELLOR_WISE_STUDENTS"
      )
        return {
          ...state,
          CouncellerwiseStudents: {
            ...state.CouncellerwiseStudents,
            loading: !state?.CouncellerwiseStudents?.loading,
          },
        };
      else if (
        action?.payload?.context === "FEE_DETAILS_BRANCH_WISE_COUNCELLORS"
      ) {
        return {
          ...state,
          FeeDetailsBranchwiseCouncellers: {
            ...state.FeeDetailsBranchwiseCouncellers,
            loading: !state?.FeeDetailsBranchwiseCouncellers?.loading,
          },
        };
      } else if (
        action?.payload?.context === "FEE_DETAILS_COUNCELLORS_WISE_STUDENTS"
      ) {
        return {
          ...state,
          FeeDetailsCouncellerwiseStudents: {
            ...state.FeeDetailsCouncellerwiseStudents,
            loading: !state?.FeeDetailsCouncellerwiseStudents?.loading,
          },
        };
      } else if (action?.payload?.context === "TOTAL_USERS_BRACHES_LIST") {
        return {
          ...state,
          TotalUsersInDashboad: {
            ...state.TotalUsersInDashboad,
            loading: !state?.TotalUsersInDashboad?.loading,
          },
        };
      } else if (action?.payload?.context === "ALL_USERS_LIST_IN_BRANCH_WISE") {
        return {
          ...state,
          UsersListInBranchWise: {
            ...state.UsersListInBranchWise,
            loading: !state?.UsersListInBranchWise?.loading,
          },
        };
      } else if (action?.payload?.context === "TOTAL_ENROLLMENTS_GRAPH") {
        return {
          ...state,
          TotalEnrollmentGraph: {
            ...state.TotalEnrollmentGraph,
            loading: !state.TotalEnrollmentGraph.loading,
          },
        };
      } else if (action?.payload?.context === "TOTAL_FEEDETAILS_GRAPH") {
        return {
          ...state,
          TotalFeeDetailsGraph: {
            ...state.TotalFeeDetailsGraph,
            loading: !state.TotalFeeDetailsGraph.loading,
          },
        };
      }
      else if (action?.payload?.context === "TODAY_FEE_RECEIVED") {
        return {
          ...state,
          TodayFeeRecevied: {
            ...state.TodayFeeRecevied,
            loading: !state.TodayFeeRecevied.loading,
          },
        };
      }
      else if (action?.payload?.context === "TODAY_FEE_RECEIVED_BY_COUNCELLORSWISE") {
        return {
          ...state,
          TodayFeeReceviedByCouncellors: {
            ...state.TodayFeeReceviedByCouncellors,
            loading: !state.TodayFeeReceviedByCouncellors.loading,
          },
        };
      }
      else if (action?.payload?.context === "TODAY_FEE_RECEIVED_BY_STUDENTS_WISE") {
        return {
          ...state,
          TodayFeeReceviedByStudents: {
            ...state.TodayFeeReceviedByStudents,
            loading: !state.TodayFeeReceviedByStudents.loading,
          },
        };
      }

      break;

    case ActionTypes.SET_PAGINATED_TOTAL_USERS:
      if (action?.payload?.context === "TOTAL_USERS_BRACHES_LIST") {
        const reducerData = action?.payload?.data;
        return {
          ...state,
          TotalUsersInDashboad: {
            ...state?.TotalUsersInDashboad,
            paginatedBranchesList: reducerData?.branches,
            totalNoOfUsers: reducerData?.overallUsers,
          },
        };
      } else if (action?.payload?.context === "ALL_USERS_LIST_IN_BRANCH_WISE") {
        const reducerData = action?.payload?.data;
        return {
          ...state,
          UsersListInBranchWise: {
            ...state?.UsersListInBranchWise,
            paginatedUsersListInBranchWise: reducerData?.users,
            totalUsers: reducerData?.overallUsers,
          },
        };
      }
      break;

    case ActionTypes.SET_PAGINATED_TOTAL_ENROLLMENT_DETAILS:
      if (action?.payload?.context === "TOTAL_ENROLLMENT_DETAILS") {
        const reducerData = action?.payload?.data;

        return {
          ...state,
          TotalEnrollementDetails: {
            ...state.TotalEnrollementDetails,
            PaginatedBranchs: reducerData?.branches, // branch, enrollments, bookingamount, feeReceived, feeYetTOReceived,
            PaginatedTopRatedCouncellers: reducerData?.topEnquiryTakenBy, // According to the Branch, it will coming,
            totalNoOfEnrollements: reducerData?.overallEnrollments,
            totalBookingAmount: reducerData?.overallFinalTotal,
            totalFeeReceived: reducerData?.overallFeeReceived,
            totalFeeYetTOReceived: reducerData?.overallFeeYetToReceive,
          },
        };
      } else if (
        action?.payload.context ===
        "TOTAL_ENROLLMENTS_DETAILS_BRANCH_WISE_COUNCELLERS"
      ) {
        const reducerData = action?.payload?.data;

        return {
          ...state,
          BranchwiseCouncellers: {
            ...state.BranchwiseCouncellers,
            paginatedBranchwiseCouncellers: reducerData?.enquirytakenbyData,
          },
        };
      } else if (
        action?.payload.context ===
        "TOTAL_ENROLLMENTS_DETAILS_COUNCELLOR_WISE_STUDENTS"
      ) {
        const reducerData = action?.payload?.data;
        return {
          ...state,
          CouncellerwiseStudents: {
            ...state.CouncellerwiseStudents,
            paginatedCouncellerwiseStudents: reducerData?.students,
          },
        };
      } else if (action?.payload.context === "TOTAL_ENROLLMENTS_GRAPH") {
        const reducerData = action?.payload?.data;


        return {
          ...state,
          TotalEnrollmentGraph: {
            ...state.TotalEnrollmentGraph,
            yearlyEnrollments: reducerData?.yearlyEnrollments,
            currentmonthEnrollments: reducerData?.currentEnrollments,
            lastMonthEnrollments: reducerData?.lastMonthEnrollments,
            totalEnrollments: reducerData?.totalEnrollments,
            difference: reducerData?.lastAndCurrentMonthEnrollementsDifference,
            progressPercentageBranches: [reducerData?.branchEnrollments],
            progressPercentageCounsellors: [
              reducerData?.enquiryTakenByEnrollments,
            ],
            progressEnrollementsCount: reducerData?.totalYearlyEnrollmentsCount,

            // new Feilds

            totalBookingAmount: reducerData?.overallFinalTotal,
            lastMonthBookingAmount: reducerData?.lastMonthFinalTotal,
            lastMonthEnrollmentsAsOnDate: reducerData?.lastMonthAsOnDateEnrollments,
            currentMonthBookingAmountAsOnDate: reducerData?.currentMonthFinalTotal,
            currentMonthFeeRecievedAsOnDate: reducerData?.currentMonthFeeRecevied,

          },
        };
      }

      break;

    case ActionTypes.SET_PAGINATED_FEE_DETAILS:
      if (action?.payload.context === "TOTAL_FEE_DETAILS") {
        const reducerData = action?.payload?.data;
        return {
          ...state,
          TotalFeeDetails: {
            ...state.TotalFeeDetails,
            PaginatedBranchs: reducerData?.branches,
            PaginatedTopRatedCouncellers: reducerData?.topEnquiryTakenBy,
            totalBookingAmount: reducerData?.totalBookingAmount,
            totalFeeReceived: reducerData?.overallFeeReceived,
            totalFeeYetTOReceived: reducerData?.overallFeeYetToReceive,
          },
        };
      } else if (
        action?.payload.context === "FEE_DETAILS_BRANCH_WISE_COUNCELLORS"
      ) {
        const reducerData = action?.payload?.data;

        return {
          ...state,
          FeeDetailsBranchwiseCouncellers: {
            ...state.FeeDetailsBranchwiseCouncellers,
            paginatedFeeDetailsBranchwiseCouncellers:
              reducerData?.enquirytakenbyData,
          },
        };
      } else if (
        action?.payload.context === "FEE_DETAILS_COUNCELLORS_WISE_STUDENTS"
      ) {
        const reducerData = action?.payload?.data;

        return {
          ...state,
          FeeDetailsCouncellerwiseStudents: {
            ...state.FeeDetailsCouncellerwiseStudents,
            paginatedFeeDetailsCouncellerwiseStudents: reducerData?.students,
          },
        };
      } else if (action?.payload.context === "TOTAL_FEEDETAILS_GRAPH") {
        const reducerData = action?.payload?.data;

        return {
          ...state,
          TotalFeeDetailsGraph: {
            ...state.TotalFeeDetailsGraph,
            progressiveFeeRecevied: [reducerData?.branchFeeDetails],
            progressiveFeeReceviedCounsellors: [
              reducerData?.enquiryTakenByFeeDetails,
            ],
            currentFeeReceived: reducerData?.currentFeeReceived,
            currentFeeYetToReceived: reducerData?.currentFeeYetToReceived,
            feeReceiveddifference: reducerData?.feeReceiveddifference,
            feeYetToReceiveddifference: reducerData?.feeYetToReceiveddifference,
            lastMonthFeeReceived: reducerData?.lastMonthFeeReceived,
            lastMonthFeeYetToReceived: reducerData?.lastMonthFeeYetToReceived,
            overallEnrollments: reducerData?.overallEnrollments,
            totalFeeReceived: reducerData?.totalFeeReceived,
            totalFeeYetToReceive: reducerData?.totalFeeYetToReceive,
            totalYearlyFeeReceivedAmount:
              reducerData?.totalYearlyFeeReceivedAmount,
            totalYearlyFeeYetToReceivedAmount:
              reducerData?.totalYearlyFeeYetToReceivedAmount,
            yearlyFeeReceived: reducerData?.yearlyFeeReceived,
            yearlyFeeYetRecevie: reducerData?.yearlyFeeYetRecevie,


            //  new Feilds Added
            lastThreeMonthsFeeReceived: reducerData?.lastThreeMonthsFeeReceived,
            lastThreeMonthsFeeYetToReceive: reducerData?.lastThreeMonthsFeeYetToReceive,

            lastMonthFeeReceivedAsOnDate:reducerData?.lastMonthFeeReceivedAsOnDate,
            withoutGstCurrentFeeReceived:reducerData?.withoutGstCurrentFeeReceived
          },
        };
      }

      break;

    case ActionTypes.SET_PAGINATED_TODAY_FEE_RECEVIED:
      if (action?.payload?.context === "SET_TODAY_FEE_RECEIVED") {
        const reducerData = action?.payload?.data;
        return {
          ...state,
          TodayFeeRecevied: {
            ...state?.TodayFeeRecevied,
            paginatedBranchesList: reducerData?.branches,
            paginatedTopRatedCouncellors: reducerData?.topEnquiryTakenBy,
            todayOverallFeeReceived: reducerData?.overallFeeReceived
          },
        };
      }
      else if (action?.payload?.context === "SET_TODAY_FEE_RECEIVED_BY_COUNCELLORSWISE") {
        const reducerData = action?.payload?.data;

        return {
          ...state,
          TodayFeeReceviedByCouncellors: {
            ...state?.TodayFeeReceviedByCouncellors,
            paginatedCouncellorsList: reducerData?.enquirytakenbyData,
          },
        };
      }

      else if (action?.payload?.context === "SET_TODAY_FEE_RECEIVED_BY_STUDENTS_WISE") {
        const reducerData = action?.payload?.data;

        return {
          ...state,
          TodayFeeReceviedByStudents: {
            ...state?.TodayFeeReceviedByStudents,
            paginatedStudentsList: reducerData?.students,
          },
        };
      }


      break;


    default:
      return state;
  }
};

export default DashboardReducer;