import { ERPApi } from "../../../serviceLayer/interceptor";

export const reportDataLoader = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const pageSize = url.searchParams.get("pageSize") ?? "10";
  const search = url.searchParams.get("search") ?? "";

  const payload = { page, pageSize, search };

  try {
    const { data } = await ERPApi.post("/reports/filteredreports", payload);
    return { reportsData: data };
  } catch (error) {
    console.error("Error fetching report data:", error);
    return { reportsData: {}, error: error.message ?? "Failed to fetch reports" };
  }
};