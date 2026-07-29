import { useEffect, useReducer } from "react";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";

const BatchStudentsListProvider = ({ batchId }) => {
  const intialState = {
    singleBatchStudentsList: {
      paginatedSingleBatchStudents: [],
      filters: {
        fromDate: "",
        toDate: "",
        course: "",
        branch: "",
      },
      searchResultStudents: null,
      perPage: 10,
      totalStudents: null,
      totalPages: null,
      loading: false,
      startStudent: null,
      endStudent: null,
      search: "",
      currentPage: 1,
    },
  };

  const SingleBatchStudentsReducer = (state, action) => {
    switch (action.type) {
      case "SET_PAGINATED_SINGLEBATCH_STUDENTS":
        const reducerData = action?.payload;

        return {
          ...state,
          singleBatchStudentsList: {
            ...state?.singleBatchStudentsList,
            paginatedSingleBatchStudents: reducerData?.reversedStudents,
            totalPages: reducerData?.totalPages,
            searchResultStudents: reducerData?.searchResultStudents,
            perPage: reducerData?.pageSize,
            startStudent: reducerData?.startStudent,
            endStudent: reducerData?.endStudent,
            totalStudents: reducerData?.totalStudents,
            currentPage: reducerData?.currentPage,
          },
        };
      case "SET_LOADING":
        return {
          ...state,
          singleBatchStudentsList: {
            ...state.singleBatchStudentsList,
            loading: !state.singleBatchStudentsList.loading,
          },
        };

      case "UPDATE_STUDENT_REMARKS_HISTORY":
        const checkStudent =
          state?.singleBatchStudentsList?.paginatedSingleBatchStudents?.filter(
            (student) => student.id === action.payload.studentId
          );
        const studentIndex =
          state?.singleBatchStudentsList?.paginatedSingleBatchStudents?.findIndex(
            (student) => student.id === action.payload.studentId
          );

        if (checkStudent) {
          let updatedStudents = [
            ...state?.singleBatchStudentsList?.paginatedSingleBatchStudents,
          ];
          updatedStudents[studentIndex].studentStatus =
            action?.payload?.studentStatus;
          updatedStudents[studentIndex].remarks = action?.payload?.remarks;
          return {
            ...state,
            singleBatchStudentsList: {
              ...state.singleBatchStudentsList,
              paginatedSingleBatchStudents: updatedStudents,
            },
          };
        } else {
          return state?.singleBatchStudentsList?.paginatedSingleBatchStudents;
        }

      case "SET_SEARCH":
        return {
          ...state,
          singleBatchStudentsList: {
            ...state.singleBatchStudentsList,
            search: action?.payload?.data,
            perPage: 10,
            currentPage: 1,
          },
        };

      case "SET_PER_PAGE":
        return {
          ...state,
          singleBatchStudentsList: {
            ...state.singleBatchStudentsList,
            perPage: action?.payload?.data,
            currentPage: 1,
          },
        };

      case "SET_CUSTOM_PAGE":
        return {
          ...state,
          singleBatchStudentsList: {
            ...state.singleBatchStudentsList,
            currentPage: action?.payload?.data,
          },
        };

      case "SET_FILTERS":
        return {
          ...state,
          singleBatchStudentsList: {
            ...state.singleBatchStudentsList,
            filters: action?.payload?.data,
            perPage: 10,
            currentPage: 1,
          },
        };

      default:
        return state;
    }
  };

  const [singleBatchStudentsState, DispatchSingleBatchStudentsState] =
    useReducer(SingleBatchStudentsReducer, intialState);

  const getPaginatedSingleBatchStudents = async () => {
    const { search, currentPage, perPage } =
      singleBatchStudentsState?.singleBatchStudentsList;
    DispatchSingleBatchStudentsState({ type: "SET_LOADING" });
    try {
      const { status, data } = await ERPApi.get(
        `/batch/getstudents?batchId=${batchId}&page=${currentPage}&pageSize=${perPage}&search=${search}`
      );

      if (status === 200) {
        DispatchSingleBatchStudentsState({
          type: "SET_PAGINATED_SINGLEBATCH_STUDENTS",
          payload: data,
        });
      }
    } catch (error) {
    } finally {
      DispatchSingleBatchStudentsState({ type: "SET_LOADING" });
    }
  };

  useEffect(() => {
    getPaginatedSingleBatchStudents();
  }, [
    singleBatchStudentsState?.singleBatchStudentsList?.search,
    singleBatchStudentsState?.singleBatchStudentsList?.currentPage,
    singleBatchStudentsState?.singleBatchStudentsList?.perPage,
    singleBatchStudentsState?.singleBatchStudentsList?.filters,
  ]);

  return {
    singleBatchStudentsState,
    DispatchSingleBatchStudentsState,
    getPaginatedSingleBatchStudents,
  };
};
export default BatchStudentsListProvider;
