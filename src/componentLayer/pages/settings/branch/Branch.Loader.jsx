import { ERPApi } from "../../../../serviceLayer/interceptor";

export const branchFromLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  const branchId = url.searchParams.get("branchId");
  try {
    const [branchData, bankOptions] = await Promise.all([
      branchId ? ERPApi.get(`/settings/getbranch/${branchId}`) : Promise.resolve({ data: {} }), 
      ERPApi.get(`/bank/all`)
    ]);

    const singlebranchData = branchData.data;
    const banks = bankOptions.data.data;

    const options = banks.map(bank => ({
      value: bank.id,
      label: `${bank.bankName} - ${bank?.bankBranchName || ''}`,
    }));
    return { singlebranchData, options };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { singlebranchData: {}, options: [] };
  }
};


export const branchListLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  try {
    // const [branchData] = await Promise.all([ERPApi.get(`/settings/getbranch${url.search}`)]);
    const [branchData] = await Promise.all([ERPApi.get(`/settings/getallpaginatedbranch${url.search}`)]);
    const BranchList = branchData.data;

    return { BranchList };
  } catch (error) {
    console.error(error);
  }
};

