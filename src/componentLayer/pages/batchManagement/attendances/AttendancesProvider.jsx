import { createContext, useEffect, useReducer } from "react";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";

const AttendancesProvider = () => {
  const intialState = {
    AttendancesList: {
      PaginatedAttendancesList: [],
      filters: {
        status: "",
      },
      searchResultAttendancesList: null,
      perPage: 10,
      totalAttendancesList: null,
      totalPages: null,
      loading: false,
      startAttendancesList: null,
      endAttendancesList: null,
      search: "",
      currentPage: 1,
    },
  };

  const AttendancesReducer = (state, action) => {
    switch (action.type) {
      case "SET_PAGINATED_ATTENDANCES":
        const reducerData = action?.payload;

        return {
          ...state,
          AttendancesList: {
            ...state?.AttendancesList,
            PaginatedAttendancesList: reducerData?.students,
            totalPages: reducerData?.totalPages,
            searchResultAttendancesList: reducerData?.searchResultStudents,
            perPage: reducerData?.pageSize,
            startAttendancesList: reducerData?.startStudent,
            endAttendancesList: reducerData?.endStudent,
            totalAttendancesList: reducerData?.totalStudents,
            currentPage: reducerData?.currentPage,
          },
        };
      case "SET_LOADING":
        return {
          ...state,
          AttendancesList: {
            ...state.AttendancesList,
            loading: !state.AttendancesList.loading,
          },
        };

      case "SET_SEARCH":
        return {
          ...state,
          AttendancesList: {
            ...state.AttendancesList,
            search: action?.payload?.data,
            perPage: 10,
            currentPage: 1,
          },
        };

      case "SET_PER_PAGE":
        return {
          ...state,
          AttendancesList: {
            ...state.AttendancesList,
            perPage: action?.payload?.data,
            currentPage: 1,
          },
        };

      case "SET_CUSTOM_PAGE":
        return {
          ...state,
          AttendancesList: {
            ...state.AttendancesList,
            currentPage: action?.payload?.data,
          },
        };

      case "SET_FILTERS":
        return {
          ...state,
          AttendancesList: {
            ...state.AttendancesList,
            filters: action?.payload?.data,
            perPage: 10,
            currentPage: 1,
          },
        };

      default:
        return state;
    }
  };

  const [AttendancesState, DispatchAttendances] = useReducer(
    AttendancesReducer,
    intialState
  );

  const getPaginatedAttendancesList = async () => {
    const { search, currentPage, perPage, filters } =
      AttendancesState.AttendancesList;
    DispatchAttendances({ type: "SET_LOADING" });
    try {
      const { status, data } = await ERPApi.get(
        `${
          import.meta.env.VITE_API_URL
        }/student/list_students?page=${currentPage}&pageSize=${perPage}&search=${search}`
      );

      if (status === 200) {
        DispatchAttendances({
          type: "SET_PAGINATED_ATTENDANCES",
          payload: data,
        });
      }
    } catch (error) {
    } finally {
      DispatchAttendances({ type: "SET_LOADING" });
    }
  };

  useEffect(() => {
    getPaginatedAttendancesList();
  }, [
    AttendancesState?.AttendancesList?.search,
    AttendancesState?.AttendancesList?.currentPage,
    AttendancesState?.AttendancesList?.perPage,
    AttendancesState?.AttendancesList?.filters,
  ]);

  return {
    AttendancesState,
    DispatchAttendances,
  };
};
export default AttendancesProvider;
