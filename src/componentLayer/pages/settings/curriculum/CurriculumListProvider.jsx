import { useEffect, useReducer } from "react";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";

const CurriculumListProvider = () => {
  const intialState = {
    curriculums: [],
    curriculumsList: {
      paginatedCurriculum: [],
      searchResultCurriculums: null,
      perPage: 10,
      totalCurriculums: null,
      totalPages: null,
      loading: false,
      startCurriculum: null,
      endCurriculum: null,
      search: "",
      currentPage: 1,
    },
  };

  const CurriculumsReducer = (state, action) => {
    switch (action.type) {
      case "SET_ALL_CURRICULUMS":
        return {
          ...state,
          curriculums: action?.payload?.reversedCurriculums,
        };

      case "SET_PAGINATED_CURRICULUMS":
        const reducerData = action?.payload;
        return {
          ...state,
          curriculumsList: {
            ...state?.curriculumsList,
            paginatedCurriculum: reducerData?.reversedCurriculums,
            totalPages: reducerData?.totalPages,
            searchResultCurriculums: reducerData?.searchResultCurriculums,
            perPage: reducerData?.pageSize,
            startCurriculum: reducerData?.startCurriculum,
            endCurriculum: reducerData?.endCurriculum,
            totalCurriculums: reducerData?.totalCurriculums,
            currentPage: reducerData?.currentPage,
          },
        };
      case "SET_LOADING":
        return {
          ...state,
          curriculumsList: {
            ...state.curriculumsList,
            loading: !state.curriculumsList.loading,
          },
        };

      case "SET_SEARCH":
        return {
          ...state,
          curriculumsList: {
            ...state.curriculumsList,
            search: action?.payload?.data,
            perPage: 10,
            currentPage: 1,
          },
        };

      case "SET_PER_PAGE":
        return {
          ...state,
          curriculumsList: {
            ...state.curriculumsList,
            perPage: action?.payload?.data,
            currentPage: 1,
          },
        };

      case "SET_CUSTOM_PAGE":
        return {
          ...state,
          curriculumsList: {
            ...state.curriculumsList,
            currentPage: action?.payload?.data,
          },
        };
      default:
        return state;
    }
  };

  const [CurriculumState, DispatchCurriculumState] = useReducer(
    CurriculumsReducer,
    intialState
  );

  const getAllCurriculums = async () => {
    try {
      const { status, data } = await ERPApi.get(`batch/curriculum`);

      if (status === 200) {
        DispatchCurriculumState({ type: "SET_ALL_CURRICULUMS", payload: data });
      }
    } catch (error) {}
  };

  const getPaginatedCurriculums = async () => {
    const { search, currentPage, perPage } = CurriculumState?.curriculumsList;

    DispatchCurriculumState({ type: "SET_LOADING" });
    try {
      const { status, data } = await ERPApi.get(
        `batch/curriculum?page=${currentPage}&pageSize=${perPage}&search=${search}`
      );
      if (status === 200) {
        DispatchCurriculumState({
          type: "SET_PAGINATED_CURRICULUMS",
          payload: data,
        });
      }
    } catch (error) {
    } finally {
      DispatchCurriculumState({ type: "SET_LOADING" });
    }
  };

  useEffect(() => {
    getPaginatedCurriculums();
  }, [
    CurriculumState?.curriculumsList?.search,
    CurriculumState?.curriculumsList?.currentPage,
    CurriculumState?.curriculumsList?.perPage,
  ]);

  useEffect(() => {
    getAllCurriculums();
  }, []);

  return {
    DispatchCurriculumState,
    CurriculumState,
    getPaginatedCurriculums,
  };
};
export default CurriculumListProvider;
