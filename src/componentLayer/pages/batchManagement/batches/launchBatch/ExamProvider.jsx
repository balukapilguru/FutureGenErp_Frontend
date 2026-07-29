import { useEffect, useReducer } from "react";
import { ERPApi } from "../../../../../serviceLayer/interceptor";

const ExamProvider = ({ batchId }) => {
  const initialState = {
    examLinks: [],
    currentPage: 1,
    perPage: 10,
    totalPages: null,
    totalExamLinks: null,
    loading: false,
    startExamLink: null,
    endExamLink: null,
    searchResultsExamLinks: null,
  };

  const examReducer = (state, action) => {
    switch (action.type) {
      case "SET_EXAM_LINKS":

     

      const reducerData = action?.payload;
    
        return {
          ...state,
          examLinks: reducerData?.examLinks,
          totalPages: reducerData?.totalPages, // Pagination info from API
          totalExamLinks: reducerData?.totalExamlinks,
          startExamLink: reducerData?.startStudent,
          endExamLink: reducerData?.endStudent,
          searchResultsExamLinks: reducerData?.searchResultStudents,
          currentPage:reducerData?.currentPage,
          perPage:reducerData?.pageSize,
        };
      case "SET_LOADING":
        return {
          ...state,
          loading: action.payload,
        };
      case "SET_CURRENT_PAGE":
        return {
          ...state,
          currentPage: action.payload,
        };
      case "SET_PER_PAGE":
        return {
          ...state,
          perPage: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(examReducer, initialState);

  const fetchExamLinks = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { status, data } = await ERPApi.get(
        `/batch/examLinks/all/?batchId=${batchId}&page=${state.currentPage}&pageSize=${state.perPage}`
      );

      if (status === 200) {
        dispatch({
          type: "SET_EXAM_LINKS",
          payload: data,
        });
      }

      // Validate the response data before dispatching
    } catch (error) {
      console.error("Error fetching exam links:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const setPage = (page) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const handlePerPage = (perPage) => {
    const pageSize = Number(perPage);
    dispatch({ type: "SET_PER_PAGE", payload: pageSize });
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  };

  useEffect(() => {
    fetchExamLinks();
  }, [state.currentPage, state.perPage]);

  return {
    state,
    setPage,
    handlePerPage,
    fetchExamLinks,
  };
};

export default ExamProvider;
