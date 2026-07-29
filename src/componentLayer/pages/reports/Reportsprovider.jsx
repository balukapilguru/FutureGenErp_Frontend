import axios from "axios";
import React, { useEffect, useReducer } from "react";

const Reportsprovider = () => {
  const intialState = {
    ReportsData: {
      paginatedReportsData: [],
      searchResultReportsData: null,
      pageSize: 10,
      totalReportsDataCount: null,
      totalPages: null,
      loading: false,
      startReportsData: null,
      endReportsData: null,
      search: "",
      page: 1,
    },
  };

  const ReportsReducer = (state, action) => {
    switch (action.type) {
      case "SET_PAGINATED_REPORTS":
        const reducerData = action.payload;
        return {
          ...state,
          ReportsData: {
            ...state.ReportsData,
            paginatedReportsData: reducerData?.reports,
            searchResultReportsData: reducerData?.searchResultStudents,
            pageSize: reducerData?.pageSize,
            totalReportsDataCount: reducerData?.totalReports,
            totalPages: reducerData?.totalPages,
            startReportsData: reducerData?.startReport,
            endReportsData: reducerData?.endReport,
            page: reducerData?.currentPage,
          },
        };

      case "SET_LOADING":
        return {
          ...state,
          ReportsData: {
            ...state.ReportsData,
            loading: !state.ReportsData.loading,
          },
        };

      case "SET_SEARCH":
        if (action.payload.context === "SET_REPORT_DATA") {
          return {
            ...state,
            ReportsData: {
              ...state.ReportsData,
              search: action?.payload?.data,
              page: 1,
            },
          };
        }
        break;

      case "SET_PER_PAGE":
        if (action?.payload?.context === "SET_REPORT_DATA") {
          return {
            ...state,
            ReportsData: {
              ...state.ReportsData,
              pageSize: action?.payload?.data,
              page: 1,
            },
          };
        }
        break;

      case "SET_CUSTOM_PAGE":
        if (action?.payload?.context === "SET_REPORT_DATA") {
          return {
            ...state,
            ReportsData: {
              ...state.ReportsData,
              page: action?.payload?.data,
            },
          };
        }
        break;

      case "DELETE_REPORT":
        let id = action?.payload?.id;
        id = parseInt(id);
        return {
          ...state,
          ReportsData: {
            ...state?.ReportsData,
            paginatedReportsData:
              state?.ReportsData?.paginatedReportsData.filter(
                (report) => report.id !== id
              ),
          },
        };
      default:
        return state;
    }
  };

  const [reportState, DispatchReports] = useReducer(
    ReportsReducer,
    intialState
  );
  const getReportData = async () => {
    DispatchReports({ type: "SET_LOADING" });
    const { pageSize, page, search } = reportState?.ReportsData;

    const pageSizeobj = { pageSize };
    const pageObj = { page };
    const searchObj = { search };

    const mergObj = { ...pageSizeobj, ...pageObj, ...searchObj };

    try {
      const { data, status } = await axios.post(
        `${import.meta.env.VITE_API_URL}/reports/filteredreports`,
        mergObj
      );
      if (status === 200) {
        DispatchReports({ type: "SET_PAGINATED_REPORTS", payload: data });
      }
    } catch (error) {
    } finally {
      DispatchReports({ type: "SET_LOADING" });
    }
  };

  useEffect(() => {
    getReportData();
  }, []);

  useEffect(() => {
    getReportData();
  }, [
    reportState?.ReportsData?.search,
    reportState?.ReportsData?.page,
    reportState?.ReportsData?.pageSize,
  ]);

  return {
    reportState,
    DispatchReports,
  };
};
export default Reportsprovider;
